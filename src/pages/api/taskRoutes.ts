import { Task } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import taskHandler from '@/apiHandlers/taskHandler';
import { RouteFunction } from '@/types/apiTypes';
import { auth } from '@/config/auth';
import { APIError } from '@/common/apiUtils';

/**
 * Get all tasks.
 */

const getAllTasksForAccount: RouteFunction<Task> = async (req, res) => {
  const { accountId } = req.body;
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!accountId) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Account ID not found');
  }

  const tasks = await taskHandler.getAll(accountId, userId);
  res.status(HttpStatusCodes.OK).json({ data: tasks });
};

/**
 * Get one task.
 */

const getOneTask: RouteFunction<Task> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const { id } = req.query;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!id) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Task ID not found');
  }

  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only one task id can be fetched at a time'
    );
  }

  const task = await taskHandler.getOne(id, userId);

  if (!task) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'Task not found');
  }

  res.status(HttpStatusCodes.OK).json({ data: task });
};

/**
 * Add one task.
 */

const addTask: RouteFunction<Task> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const data = req.body;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  const task = await taskHandler.add(userId, data);
  res.status(HttpStatusCodes.CREATED).json({ data: task });
};

/**
 * Update one task.
 */

const updateTask: RouteFunction<Task> = async (req, res) => {
  const data = req.body;
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const { id } = req.query;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!id) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Task ID not found');
  }

  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only one task id can be updated at a time'
    );
  }

  const task = await taskHandler.update(id, userId, data);
  res.status(HttpStatusCodes.OK).json({ data: task });
};

/**
 * Delete one task.
 */

const deleteTask: RouteFunction<Task> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const { id } = req.query;

  // TODO: This (everywhere) is not an unauthorized error. The user comes from the session so it should always be there and if not, it's a server error.
  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!id) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Task ID not found');
  }

  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only one task id can be updated at a time'
    );
  }

  const task = await taskHandler.deleteOne(id, userId);
  res
    .setHeader('Content-Type', 'application/json')
    .status(HttpStatusCodes.OK)
    .json({ data: task });
};

export default {
  getAllTasksForAccount,
  getOneTask,
  addTask,
  updateTask,
  deleteTask,
} as const;
