import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/config/auth';
import { Account } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import accountHandler from '@/apiHandlers/accountHandler';
import { APIError, apiErrorMiddleware } from '@/common/apiUtils';

type RouteFunction<T> = (
  req: NextApiRequest,
  res: NextApiResponse<T | T[] | { message: string }>
) => void;

// **** Functions **** //

/**
 * Get all accounts for user
 */

const getAllUserAccounts: RouteFunction<Account> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  const accounts = await accountHandler.getAllUserAccounts(user.id);

  res.status(HttpStatusCodes.OK).json({ ...accounts });
};

const getOneAccount: RouteFunction<Account> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const { id } = req.query;

  //TODO: Move all these checks to some validation functions

  if (!user?.id) {
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

  const account = await accountHandler.getOneAccount(id, user.id);

  if (!account) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'Account not found');
  }

  res.status(HttpStatusCodes.OK).json({ ...account });
};

const addAccount: RouteFunction<Account> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const data = req.body;

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  const account = await accountHandler.addAccount(data, user.id);

  res.status(HttpStatusCodes.CREATED).json({ ...account });
};

const updateAccount: RouteFunction<Account> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const data = req.body;
  const { id } = req.query;

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }
  if (!id) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Account ID not found');
  }
  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only on account id can be updated at a time'
    );
  }

  const account = await accountHandler.updateAccount(id, data, user.id);

  res.status(HttpStatusCodes.OK).json({ ...account });
};

const getAccountsGEThandlers = (req: NextApiRequest) => {
  const { id } = req.query;
  if (id) {
    return getOneAccount;
  } else {
    return getAllUserAccounts;
  }
};

const _delete: RouteFunction<Account> = async (req, res) => {
  const session = await auth(req, res);
  const user = session?.user;
  const { id } = req.query;

  if (!user?.id) {
    throw new APIError(HttpStatusCodes.UNAUTHORIZED, 'User not found');
  }

  if (!id) {
    throw new APIError(HttpStatusCodes.BAD_REQUEST, 'Account ID not found');
  }

  if (typeof id !== 'string') {
    throw new APIError(
      HttpStatusCodes.BAD_REQUEST,
      'Only on account id can be deleted at a time'
    );
  }

  await accountHandler.deleteAccount(id, user.id);

  res.status(HttpStatusCodes.NO_CONTENT).json({
    message: 'Account deleted',
  });
};

const getAccountsHandlers = async (
  req: NextApiRequest,
  res: NextApiResponse<Account | Account[] | { message: string }>
) => {
  const { method } = req;

  let routeFunction;
  switch (method) {
    case 'GET':
      routeFunction = getAccountsGEThandlers(req);
    case 'POST':
      routeFunction = addAccount;
    case 'PATCH':
      routeFunction = updateAccount;
    // case 'PUT':
    //   routeFunction = update;
    case 'DELETE':
      routeFunction = _delete;
  }

  if (!method || !routeFunction) {
    throw new APIError(
      HttpStatusCodes.METHOD_NOT_ALLOWED,
      `Request method ${method} Not Allowed for this route`
    );
  }

  await routeFunction(req, res);
};

export default apiErrorMiddleware(getAccountsHandlers);
