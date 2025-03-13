import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/config/auth';
import { User } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import userHandler from '@/apiHandlers/users';
import { APIError, apiErrorMiddleware } from '@/common/apiUtils';
import { ResponseFormat, RouteFunction } from '@/types/apiTypes';
import { UserWithAllData } from '@/types/dataTypes';

const getMe: RouteFunction<UserWithAllData> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  if (!user || !user.id) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'Unauthorized',
    });
    return;
  }

  const userData = await userHandler.getOne(user.id);

  if (!userData || !userData.id) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'User not found',
    });
    return;
  }

  res.status(HttpStatusCodes.OK).json({ data: userData });
};
/**
 * Add one user.
 */

/**
 * Update one user.
 */
const update: RouteFunction<User> = async (req, res) => {
  const { id } = req.query;
  const user = req.body;
  //@ts-expect-error - Fix this later
  const updatedUser = await userHandler.updateOne(id, user);
  res.status(HttpStatusCodes.OK).json({ data: updatedUser });
};
/**
 * Delete one user.
 */
const _delete: RouteFunction<User> = async (req, res) => {
  const { id } = req.query;
  //@ts-expect-error - Fix this later
  await userHandler.delete(id);
  res.status(HttpStatusCodes.OK).json({
    message: 'User deleted',
  });
};

const getUsersGEThandlers = (req: NextApiRequest) => {
  const { id } = req.query;
  if (id) {
    // routeFunction = getMe;
    return;
  }
  return getMe;
};

const useUsersHandlers = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseFormat<User | User[]> | { message: string }>
) => {
  const { method } = req;
  let routeFunction;
  switch (method) {
    case 'GET':
      routeFunction = getUsersGEThandlers(req);
      break;
    // case 'POST':
    //   routeFunction = add;
    // break;
    case 'PATCH':
      routeFunction = update;
      break;
    // case 'PUT':
    //   routeFunction = update;
    // break;
    case 'DELETE':
      routeFunction = _delete;
      break;
  }

  console.log('IN useUsersH routeFunction', routeFunction);

  if (!method || !routeFunction) {
    throw new APIError(
      HttpStatusCodes.METHOD_NOT_ALLOWED,
      `Request method ${method} Not Allowed for this route`
    );
  }

  await routeFunction(req, res);
};

export default apiErrorMiddleware(useUsersHandlers);
