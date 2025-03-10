import childAccountHandler from '@/apiHandlers/childAccountHandler';
import taskHandler from '@/apiHandlers/taskHandler';
import { APIError, apiErrorMiddleware } from '@/common/apiUtils';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import { auth } from '@/config/auth';
import { RouteFunction } from '@/types/apiTypes';
import { Task } from '@prisma/client';

const updateTask: RouteFunction<Task> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const { childAccountId } = req.body;
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    throw new APIError(
      HttpStatusCodes.METHOD_NOT_ALLOWED,
      'Method not allowed'
    );
  }

  if (!childAccountId) {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'ChildAccount ID not found'
    );
  }

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!id) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Task ID not found');
  }

  const childAccount = await childAccountHandler.getOneChildAccount(
    childAccountId,
    userId
  );

  if (!childAccount || childAccount.userId !== userId) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User does not have access to this child account'
    );
  }

  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only one task id can be updated at a time'
    );
  }

  const updatedData = {
    childAccountId,
    completed: true,
    completedAt: new Date(),
  };

  const task = await taskHandler.update(id, userId, updatedData);
  res.status(HttpStatusCodes.OK).json({ data: task });
};

export default apiErrorMiddleware(updateTask);
