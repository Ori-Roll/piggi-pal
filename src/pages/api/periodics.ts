import { Periodic } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import periodicHandler from '@/apiHandlers/periodicHandler';
import { ResponseFormat, RouteFunction } from '@/types/apiTypes';
import { APIError, apiErrorMiddleware } from '@/common/apiUtils';
import { auth } from '@/config/auth';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Get all periodics.
 */

const getAllPeriodicsForAccount: RouteFunction<Periodic> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const { id } = req.query;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!id) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Account ID not found');
  }

  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only on account id can be fetched at a time'
    );
  }

  const periodics = await periodicHandler.getAll(id, userId);

  res.status(HttpStatusCodes.OK).json({ data: periodics });
};

/**
 * Get one periodic.
 */

// export const getPeriodicById = async (
//   req: IReq<Periodic, { id: string }>,
//   res: IRes<Periodic>
// ) => {
//   const { id } = req.params;
//   const periodic = await handler.getOne(id);
//   res
//     .setHeader('Content-Type', 'application/json')
//     .status(HttpStatusCodes.OK)
//     .json({ periodic });
// };

/**
 * Add one periodic.
 */

const addPeriodic: RouteFunction<Periodic> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const userId = user?.id;
  const data = req.body;

  if (!userId) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  const newPeriodic = await periodicHandler.add(userId, data);
  res.status(HttpStatusCodes.CREATED).json({ data: newPeriodic });
};

// const usePeriodicHandlers = (req: NextApiRequest) => {
//   const { id } = req.query;

//   if (id) {
//     return ;
//   } else {
//     return ;
//   }
// }

const useTaskHandlers = async (
  req: NextApiRequest,
  res: NextApiResponse<
    ResponseFormat<Periodic | Periodic[]> | { message: string }
  >
) => {
  const { method } = req;

  let routeFunction: RouteFunction<Periodic> | undefined;
  switch (method) {
    case 'GET':
      routeFunction = getAllPeriodicsForAccount;
      break;
    case 'POST':
      routeFunction = addPeriodic;
      break;
    // case 'PATCH':
    // routeFunction = updateTask;
    // break;
    // case 'PUT':
    //   routeFunction = update;
    // break;
    // case 'DELETE':
    //   routeFunction = deleteTask;
    // break;
  }

  if (!method || !routeFunction) {
    throw new APIError(
      HttpStatusCodes.METHOD_NOT_ALLOWED,
      `Request method ${method} Not Allowed for this route`
    );
  }

  await routeFunction(req, res);
};

export default apiErrorMiddleware(useTaskHandlers);
