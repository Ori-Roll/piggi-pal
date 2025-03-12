import { ChildAccount, Task } from '@prisma/client';
import taskAccess from '@/apiDataAccess/task';
import childAccountHandler from './childAccountHandler';
import { APIError } from '@/common/apiUtils';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import { ChildAccountWithTasks } from '@/types/dataTypes';

/**
 * Get all tasks.
 */
const getAll = async (
  childAccountId: string,
  userId: string
): Promise<Task[]> => {
  const childAccounts = await childAccountHandler.getAllUserChildAccounts(
    userId
  );
  if (
    !childAccounts.find((childAccount) => childAccount.id === childAccountId)
  ) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to access this childAccount'
    );
  }
  return await taskAccess.getAllTasksForChildAccount(childAccountId);
};

/**
 * Get one task.
 */

const getOne = async (id: string, userId: string): Promise<Task | null> => {
  const childAccounts = await childAccountHandler.getAllUserChildAccounts(
    userId
  );
  const task = await taskAccess.getTaskById(id);

  if (
    !childAccounts.find(
      (childAccount) => childAccount.id === task?.childAccountId
    )
  ) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to access this childAccount'
    );
  }
  return task;
};

/**
 * Add one task.
 */

const add = async (userId: string, data: Omit<Task, 'id'>): Promise<Task> => {
  const { childAccountId, periodicId, ...restData } = data;

  const childAccount = await childAccountHandler.getOneChildAccount(
    childAccountId,
    userId
  );
  if (!childAccount) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to access this childAccount'
    );
  }
  return await taskAccess.addTask(restData, childAccountId, periodicId);
};

/**
 * Update one task.
 */

const update = async (
  id: string,
  userId: string,
  data: Partial<Omit<Task, 'id'>> & { childAccountId: string }
): Promise<Task> => {
  const { childAccountId, periodicId, ...restData } = data;

  const childAccount = await childAccountHandler.getOneChildAccount(
    childAccountId,
    userId
  );
  if (!childAccount) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to access this childAccount'
    );
  }

  return await taskAccess.updateTask(id, restData);
};

/**
 * Complete one task.
 */

const complete = async (
  id: string,
  childAccount: ChildAccountWithTasks
): Promise<Task> => {
  const previousTask = childAccount.tasks.find((task: Task) => task.id === id);
  if (!previousTask) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'Task not found');
  }
  if (previousTask.completed) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Task already completed');
  }

  const task = await taskAccess.completeTask(
    id,
    childAccount.id,
    previousTask.amount
  );
  return task;
};
/**
 * Delete one task.
 */

const deleteOne = async (id: string, userId: string): Promise<Task> => {
  const task = await taskAccess.getTaskById(id);

  if (!task) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'Task not found');
  }

  const childAccount = await childAccountHandler.getOneChildAccount(
    task.childAccountId,
    userId
  );
  if (!childAccount) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to access this childAccount'
    );
  }

  return await taskAccess.deleteTask(id);
};

export default {
  getAll,
  getOne,
  add,
  update,
  complete,
  deleteOne,
};
