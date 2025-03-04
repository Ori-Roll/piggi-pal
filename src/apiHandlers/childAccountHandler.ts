import { ChildAccount } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import childAccountAccess from '@/apiDataAccess/childAccount';
import userHandler from '@/apiHandlers/users';
import { APIError } from '@/common/apiUtils';

const getAllUserChildAccounts = async (userId: string) => {
  const user = await userHandler.getOne(userId);
  if (!user) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'User not found');
  }
  return await childAccountAccess.getAllUserChildAccounts(userId);
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
  return await childAccountAccess.getOneChildAccount(id, userId);
};

const getOneChildAccountByIdOnly = async (id: string) => {
  return await childAccountAccess.getOneChildAccountByIdOnly(id);
};

const getManyChildAccountsByIds = async (ids: string[]) => {
  return await childAccountAccess.getManyChildAccountsByIds(ids);
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
  return await childAccountAccess.addChildAccount(dataWithUserId);
};

const updateChildAccount = async (
  id: string,
  data: ChildAccount,
  userId: string
) => {
  const childAccount = await childAccountAccess.getOneChildAccount(id, userId);
  if (!childAccount || childAccount.userId !== userId) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to update childAccount'
    );
  }
  return await childAccountAccess.updateChildAccount(id, { ...data }, userId);
};

const updateChildAccountWithIdOnly = async (
  id: string,
  data: Partial<ChildAccount>
) => {
  return await childAccountAccess.updateChildAccountWithIdOnly(id, { ...data });
};

const deleteChildAccount = async (id: string, userId: string) => {
  const user = await userHandler.getOne(userId);
  if (!user) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'User not found');
  }

  return await childAccountAccess.deleteChildAccount(id);
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
