import { APIError } from '@/common/apiUtils';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import cronHandler from '@/apiHandlers/cronHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/config/auth';
import { RouteFunction } from '@/types/apiTypes';

const executeDailyAction: RouteFunction<unknown> = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await auth(req, res);
  const user = session?.user;
  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  console.log('----------------');
  console.log('Running cron job');
  console.log('Time:', new Date().toISOString());
  console.log('----------------');

  //TODO: Authenticate cron job request

  await cronHandler.executePeriodicActions();

  console.log('------DONE------');

  res.status(200).json({ message: 'Handled cron job' });
};

export default {
  executeDailyAction,
};
