import { ParentLock } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import parentLockHandler from '@/apiHandlers/parentLockHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import { APIError, apiErrorMiddleware } from '@/common/apiUtils';
import { auth } from '@/config/auth';
import { RouteFunction } from '@/types/apiTypes';

const validateParentLock: RouteFunction<ParentLock> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const { pin: reqPin } = req.query;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!reqPin || isNaN(Number(reqPin))) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Invalid pin');
  }

  const pin = Number(reqPin);

  const validated = await parentLockHandler.validateParentLock(userId, pin);

  if (!validated) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Invalid pin');
  }

  res.status(HttpStatusCodes.OK).json({ message: 'validated' });
};

const createParentLockWithPinAndQuestion: RouteFunction<ParentLock> = async (
  req,
  res
) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const data = req.body;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!data.pin || isNaN(Number(data.pin))) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Invalid pin');
  }

  await parentLockHandler.createParentLockWithPinAndQuestion(userId, data);

  res.status(HttpStatusCodes.CREATED).json({ message: 'created' });
};

const updateParentLockPinAndQuestion: RouteFunction<ParentLock> = async (
  req,
  res
) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const data = req.body;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!data.pin || isNaN(Number(data.pin))) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Invalid pin');
  }

  await parentLockHandler.updateParentLockPinAndQuestion(userId, data);

  res.status(HttpStatusCodes.OK).json({ message: 'updated' });
};

const deleteParentLock: RouteFunction<ParentLock> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  await parentLockHandler.deleteParentLock(userId);

  res.status(HttpStatusCodes.OK).json({ message: 'deleted' });
};

const useParentLockRouteHandlers = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { method } = req;

  let routeFunction;
  switch (method) {
    case 'GET':
      routeFunction = validateParentLock;
      break;
    case 'POST':
      routeFunction = createParentLockWithPinAndQuestion;
      break;
    case 'PATCH':
      routeFunction = updateParentLockPinAndQuestion;
      break;
    case 'DELETE':
      routeFunction = deleteParentLock;
      break;
  }

  if (!method || !routeFunction) {
    throw new APIError(
      HttpStatusCodes.METHOD_NOT_ALLOWED,
      `Request method ${method} Not Allowed for this route`
    );
  }

  await routeFunction(req, res);
};

export default apiErrorMiddleware(useParentLockRouteHandlers);
