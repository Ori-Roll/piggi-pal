import { CardStyle, Periodic } from '@prisma/client';
import periodicAccess from '@/apiDataAccess/periodic';
import childAccountHandler from './childAccountHandler';
import { startOfDay, endOfDay } from 'date-fns';
import { APIError } from '@/common/apiUtils';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import {
  createDefaultCardStyle,
  createPeriodicDataWithNextOccurrence,
} from '@/utils/dataManipulation';
import {
  PeriodicWithCardStyle,
  PeriodicWithCardStyleToCreate,
} from '@/types/dataTypes';
import { MakeOptional } from '@/types/utilTypes';

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

const add = async (
  userId: string,
  data: PeriodicWithCardStyleToCreate
): Promise<Periodic> => {
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

  const dataWithNextOccurrence = createPeriodicDataWithNextOccurrence(data);
  const dataWithCardStyle = {
    ...dataWithNextOccurrence,
    cardStyle: data.cardStyle || createDefaultCardStyle(),
  };

  return await periodicAccess.addPeriodic(dataWithCardStyle);
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
