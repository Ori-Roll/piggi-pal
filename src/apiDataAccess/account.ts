import { Account } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import { db } from '@/server/db';
import { APIError } from '@/common/apiUtils';

const getAllUserAccounts = async (userID: string) => {
  try {
    const accounts = await db.account.findMany({
      where: {
        userId: userID,
      },
    });
    return accounts;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not get accounts'
    );
  }
};

const getOneAccount = async (id: string, userId: string) => {
  // TODO: Is this the correct way to handle this? (with the userId as a safety check?)
  try {
    const account = await db.account.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        periodics: {
          include: {
            transactions: true,
          },
        },
        tasks: true,
        transactions: true,
      },
    });
    return account;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not get account'
    );
  }
};

const getOneAccountByIdOnly = async (id: string) => {
  try {
    const account = await db.account.findFirst({
      where: {
        id,
      },
    });
    return account;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not get account'
    );
  }
};

const getManyAccountsByIds = async (ids: string[]) => {
  try {
    const accounts = await db.account.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return accounts;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not get accounts'
    );
  }
};

const addAccount = async (data: Account) => {
  console.log('GOT DATA', data);

  try {
    const account = await db.account.create({
      data,
      include: {
        periodics: true,
      },
    });
    console.log('returning account', account);
    return account;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not add account'
    );
  }
};

const deleteAccount = async (id: string) => {
  try {
    const account = await db.account.delete({
      where: { id },
    });
    return account;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not delete account'
    );
  }
};

const updateAccount = async (id: string, data: Account, userId: string) => {
  try {
    const account = await db.account.update({
      where: { userId, id },
      data,
    });
    return account;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not update account'
    );
  }
};

const updateAccountWithIdOnly = async (id: string, data: Partial<Account>) => {
  try {
    const account = await db.account.update({
      where: { id },
      data,
    });
    return account;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not update account'
    );
  }
};

export default {
  getAllUserAccounts,
  getOneAccount,
  getOneAccountByIdOnly,
  getManyAccountsByIds,
  addAccount,
  updateAccount,
  updateAccountWithIdOnly,
  deleteAccount,
} as const;
