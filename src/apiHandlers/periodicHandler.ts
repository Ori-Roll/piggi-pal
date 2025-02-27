import { Periodic } from '@prisma/client';
import periodicAccess from '@/apiDataAccess/periodic';
import accountHandler from './accountHandler';
import { startOfDay, endOfDay } from 'date-fns';

/**
 * Get all periodics.
 */
const getAll = async (
  accountId: string,
  userId: string
): Promise<Periodic[]> => {
  // TODO: check if the user is authorized to access this data
  // TODO: Implement pagination? Is that necessary in this case?

  const accounts = await accountHandler.getAllUserAccounts(userId);
  if (!accounts.find((account) => account.id === accountId)) {
    throw new Error('User not authorized to access this account');
  }
  return await periodicAccess.getAllPeriodicsForAccount(accountId);
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
  // TODO: check periodic user rules for the account?
  const accounts = await accountHandler.getOneAccount(data.accountId, userId);
  if (!accounts) {
    throw new Error('User not authorized to access this account');
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
