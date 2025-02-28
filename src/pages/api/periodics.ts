import { Periodic } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import periodicHandler from '@/apiHandlers/periodicHandler';
import { RouteFunction } from '@/types/apiTypes';
import { APIError } from '@/common/apiUtils';
import { auth } from '@/config/auth';

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

export default {
  getAllPeriodicsForAccount,
  addPeriodic,
} as const;
