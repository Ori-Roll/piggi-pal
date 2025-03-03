import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/config/auth';
import { ChildAccount } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import childAccountHandler from '@/apiHandlers/childAccountHandler';
import { APIError, apiErrorMiddleware } from '@/common/apiUtils';
import { ResponseFormat, RouteFunction } from '@/types/apiTypes';

// **** Functions **** //

/**
 * Get all childAccounts for user
 */

const getAllUserChildAccounts: RouteFunction<ChildAccount> = async (
  req,
  res
) => {
  const session = await auth(req, res);
  const user = session?.user;

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  const childAccounts = await childAccountHandler.getAllUserChildAccounts(
    user.id
  );

  res.status(HttpStatusCodes.OK).json({ data: childAccounts });
};

const getOneChildAccount: RouteFunction<ChildAccount> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const { id } = req.query;

  //TODO: Move all these checks to some validation functions

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!id) {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'ChildAccount ID not found'
    );
  }

  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only on childAccount id can be fetched at a time'
    );
  }

  const childAccount = await childAccountHandler.getOneChildAccount(
    id,
    user.id
  );

  if (!childAccount) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'ChildAccount not found');
  }

  res.status(HttpStatusCodes.OK).json({ data: childAccount });
};

const addChildAccount: RouteFunction<ChildAccount> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const data = req.body;

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  const childAccount = await childAccountHandler.addChildAccount(data, user.id);

  res.status(HttpStatusCodes.CREATED).json({ data: childAccount });
};

const updateChildAccount: RouteFunction<ChildAccount> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const data = req.body;
  const { id } = req.query;

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }
  if (!id) {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'ChildAccount ID not found'
    );
  }
  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only on childAccount id can be updated at a time'
    );
  }

  const childAccount = await childAccountHandler.updateChildAccount(
    id,
    data,
    user.id
  );

  res.status(HttpStatusCodes.OK).json({ data: childAccount });
};

const getChildAccountsGEThandlers = (req: NextApiRequest) => {
  const { id } = req.query;
  if (id) {
    return getOneChildAccount;
  } else {
    return getAllUserChildAccounts;
  }
};

const _delete: RouteFunction<ChildAccount> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const { id } = req.query;

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!id) {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'ChildAccount ID not found'
    );
  }

  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only on childAccount id can be deleted at a time'
    );
  }

  await childAccountHandler.deleteChildAccount(id, user.id);

  res.status(HttpStatusCodes.NO_CONTENT).json({
    message: 'ChildAccount deleted',
  });
};

const useChildAccountsHandlers = async (
  req: NextApiRequest,
  res: NextApiResponse<
    ResponseFormat<ChildAccount | ChildAccount[]> | { message: string }
  >
) => {
  const { method } = req;

  let routeFunction;
  switch (method) {
    case 'GET':
      routeFunction = getChildAccountsGEThandlers(req);
      break;
    case 'POST':
      routeFunction = addChildAccount;
      break;
    case 'PATCH':
      routeFunction = updateChildAccount;
      break;
    // case 'PUT':
    //   routeFunction = update;
    // break;
    case 'DELETE':
      routeFunction = _delete;
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

export default apiErrorMiddleware(useChildAccountsHandlers);
