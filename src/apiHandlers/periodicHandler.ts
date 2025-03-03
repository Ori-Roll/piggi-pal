import { Periodic } from '@prisma/client';
import periodicAccess from '@/apiDataAccess/periodic';
import childAccountHandler from './childAccountHandler';
import { startOfDay, endOfDay } from 'date-fns';
import { APIError } from '@/common/apiUtils';
import HttpStatusCodes from '@/common/HttpStatusCodes';

/**
 * Get all periodics.
 */
const getAll = async (
  childAccountId: string,
  userId: string
): Promise<Periodic[]> => {
  // TODO: check if the user is authorized to access this data
  // TODO: Implement pagination? Is that necessary in this case?

  const childAccounts = await childAccountHandler.getAllUserChildAccounts(
    userId
  );
  if (
    !childAccounts.find((childAccount) => childAccount.id === childAccountId)
  ) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to access this childAccount'
    );
  }
  return await periodicAccess.getAllPeriodicsForChildAccount(childAccountId);
};

/**
 * Get one periodic.
 */

// const getOne = async (id: string): Promise<Periodic | null> => {
//   return await getPeriodicById(id);
// };

/**
 * Add one periodic.
 */

const createDataWithNextOccurrence = (data: Omit<Periodic, 'id'>) => {
  const { startsAt, nextOccurrence } = data;

  const newNextOccurrence = nextOccurrence ? nextOccurrence : startsAt;

  return { ...data, nextOccurrence: newNextOccurrence };
};

const add = async (
  userId: string,
  data: Omit<Periodic, 'id'>
): Promise<Periodic> => {
  console.log('userId ', userId);
  console.log('data ', data);
  // TODO: check periodic user rules for the childAccount?
  const childAccounts = await childAccountHandler.getOneChildAccount(
    data.childAccountId,
    userId
  );
  if (!childAccounts) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to access this childAccount'
    );
  }

  const dataWithNextOccurrence = createDataWithNextOccurrence(data);

  return await periodicAccess.addPeriodic(dataWithNextOccurrence);
};

const getAllWithTodayNextOccurrence = async () => {
  const now = new Date();
  return await periodicAccess.getAllByNextOccurrenceBetweenDates(
    startOfDay(now),
    endOfDay(now)
  );
};

export default {
  getAll,
  add,
  getAllWithTodayNextOccurrence,
} as const;
