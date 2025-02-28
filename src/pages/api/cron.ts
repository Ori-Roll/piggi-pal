import { APIError, apiErrorMiddleware } from '@/common/apiUtils';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import cronHandler from '@/apiHandlers/cronHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/config/auth';

const executeDailyAction = async (
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
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

const useCronHandlers = async (
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) => {
  const { method } = req;

  let routeFunction;
  switch (method) {
    case 'GET':
      routeFunction = executeDailyAction;
      break;
    // case 'POST':
    //   routeFunction = addAccount;
    // case 'PATCH':
    //   routeFunction = updateAccount;
    // case 'PUT':
    //   routeFunction = update;
    // case 'DELETE':
    //   routeFunction = _delete;
  }

  if (!method || !routeFunction) {
    throw new APIError(
      HttpStatusCodes.METHOD_NOT_ALLOWED,
      `Request method ${method} Not Allowed for this route`
    );
  }

  await routeFunction(req, res);
};

export default apiErrorMiddleware(useCronHandlers);
