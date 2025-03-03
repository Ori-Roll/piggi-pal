import { ChildAccount } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import accountAccess from '@/apiDataAccess/account';
import userHandler from '@/apiHandlers/users';
import { APIError } from '@/common/apiUtils';

const getAllUserChildAccounts = async (userId: string) => {
  const user = await userHandler.getOne(userId);
  if (!user) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'User not found');
  }
  return await accountAccess.getAllUserChildAccounts(userId);
};

const getOneChildAccount = async (id: string, userId: string) => {
  const user = await userHandler.getOne(userId);
  try {
    if (!user) {
      throw new APIError(HttpStatusCodes.NOT_FOUND, 'User not found');
    }
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.NOT_FOUND,
      'ChildAccount not found for user'
    );
  }
  return await accountAccess.getOneChildAccount(id, userId);
};

const getOneChildAccountByIdOnly = async (id: string) => {
  return await accountAccess.getOneChildAccountByIdOnly(id);
};

const getManyChildAccountsByIds = async (ids: string[]) => {
  return await accountAccess.getManyChildAccountsByIds(ids);
};

const addChildAccount = async (
  data: Omit<ChildAccount, 'userId'>,
  userId: string
) => {
  const user = await userHandler.getOne(userId);
  if (!user) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'User not found');
  }
  const dataWithUserId = { ...data, userId: user.id };
  return await accountAccess.addChildAccount(dataWithUserId);
};

const updateChildAccount = async (
  id: string,
  data: ChildAccount,
  userId: string
) => {
  const account = await accountAccess.getOneChildAccount(id, userId);
  if (!account || account.userId !== userId) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to update account'
    );
  }
  return await accountAccess.updateChildAccount(id, { ...data }, userId);
};

const updateChildAccountWithIdOnly = async (
  id: string,
  data: Partial<ChildAccount>
) => {
  return await accountAccess.updateChildAccountWithIdOnly(id, { ...data });
};

const deleteChildAccount = async (id: string, userId: string) => {
  const user = await userHandler.getOne(userId);
  if (!user) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'User not found');
  }

  return await accountAccess.deleteChildAccount(id);
};

export default {
  getAllUserChildAccounts,
  getOneChildAccount,
  getOneChildAccountByIdOnly,
  addChildAccount,
  updateChildAccount,
  updateChildAccountWithIdOnly,
  getManyChildAccountsByIds,
  deleteChildAccount,
} as const;
