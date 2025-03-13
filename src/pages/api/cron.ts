import { APIError, apiErrorMiddleware } from '@/common/apiUtils';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import cronHandler from '@/apiHandlers/cronHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/config/auth';

const authenticate = async (
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) => {
  console.log('in authenticate, headers are ` ', req.headers);

  const authorizationHeader = req.headers['authorization'];

  console.log('Authorization header:', authorizationHeader);

  if (!authorizationHeader) {
    return res.status(400).json({ message: 'Authorization header missing' });
  }

  // Step 2: Extract the Bearer token from the Authorization header
  const token = authorizationHeader.split(' ')[1]; // 'Bearer <token>'

  console.log('Extracted Bearer token:', token);

  if (!token) {
    return res.status(400).json({ message: 'Bearer token missing' });
  }

  // Step 3: Use the token for your logic (e.g., authenticate the request or make another API call)
  console.log('Received Bearer token:', token);
  console.log('Expected (process.env.CRON_API_KEY):', process.env.CRON_API_KEY);
  // Example: If you need to validate the token
  if (token !== process.env.CRON_API_KEY) {
    return res.status(401).json({ message: 'Invalid API Key' });
  }
};

const executeDailyAction = async (
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) => {
  console.log('----------------');
  console.log('Cron Job Request');

  console.log('Authenticating request');
  await authenticate(req, res);

  console.log('----------------');
  console.log('Executing cron job');

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
    //   routeFunction = addChildAccount;
    // case 'PATCH':
    //   routeFunction = updateChildAccount;
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
