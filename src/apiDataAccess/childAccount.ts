import { ChildAccount } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import { db } from '@/server/db';
import { APIError } from '@/common/apiUtils';

const getAllUserChildAccounts = async (userID: string) => {
  try {
    const childAccounts = await db.childAccount.findMany({
      where: {
        userId: userID,
      },
    });
    return childAccounts;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not get childAccounts'
    );
  }
};

const getOneChildAccount = async (id: string, userId: string) => {
  // TODO: Is this the correct way to handle this? (with the userId as a safety check?)
  try {
    const childAccount = await db.childAccount.findUnique({
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
    return childAccount;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not get childAccount'
    );
  }
};

const getOneChildAccountByIdOnly = async (id: string) => {
  try {
    const childAccount = await db.childAccount.findFirst({
      where: {
        id,
      },
    });
    return childAccount;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not get childAccount'
    );
  }
};

const getManyChildAccountsByIds = async (ids: string[]) => {
  try {
    const childAccounts = await db.childAccount.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return childAccounts;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not get childAccounts'
    );
  }
};

const addChildAccount = async (data: ChildAccount) => {
  console.log('ADDING NEW CHILD ACCOUNT - GOT DATA', data);

  try {
    const childAccount = await db.$transaction(async (prisma) => {
      const childAccount = await prisma.childAccount.create({
        data,
        include: {
          periodics: true,
        },
      });
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          lastOpenedChildAccountId: childAccount.id,
        },
      });
      return childAccount;
    });
    // .childAccount.create({
    //   data,
    //   include: {
    //     periodics: true,
    //   },
    // });
    console.log('returning childAccount', childAccount);
    return childAccount;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not add childAccount'
    );
  }
};

const deleteChildAccount = async (id: string) => {
  try {
    const childAccount = await db.childAccount.delete({
      where: { id },
    });
    return childAccount;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not delete childAccount'
    );
  }
};

const updateChildAccount = async (
  id: string,
  data: ChildAccount,
  userId: string
) => {
  try {
    const childAccount = await db.childAccount.update({
      where: { userId, id },
      data,
    });
    return childAccount;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not update childAccount'
    );
  }
};

const updateChildAccountWithIdOnly = async (
  id: string,
  data: Partial<ChildAccount>
) => {
  try {
    const childAccount = await db.childAccount.update({
      where: { id },
      data,
    });
    return childAccount;
  } catch (error) {
    console.error(error);
    throw new APIError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Could not update childAccount'
    );
  }
};

export default {
  getAllUserChildAccounts,
  getOneChildAccount,
  getOneChildAccountByIdOnly,
  getManyChildAccountsByIds,
  addChildAccount,
  updateChildAccount,
  updateChildAccountWithIdOnly,
  deleteChildAccount,
} as const;
