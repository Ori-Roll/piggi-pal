import { Periodic } from '@prisma/client';
import { db } from '@/server/db';
import { PeriodicWithCardStyleToCreate } from '@/types/dataTypes';

//TODO: Add prismDisconnect to all functions

const getPeriodicById = async (id: string): Promise<Periodic | null> => {
  return await db.periodic.findUnique({
    where: { id },
  });
};

const getAllPeriodicsForChildAccount = async (
  childAccountId: string
): Promise<Periodic[]> => {
  return await db.periodic.findMany({
    where: {
      childAccountId,
    },
  });
};

const addPeriodic = async (
  data: PeriodicWithCardStyleToCreate
): Promise<Periodic> => {
  const { childAccountId, cardStyleId, ...restPeriodic } = data;

  return await db.periodic.create({
    data: {
      ...restPeriodic,
      childAccount: {
        connect: {
          id: childAccountId,
        },
      },
      cardStyle: {
        create: restPeriodic.cardStyle,
      },
    },
  });
};

const updatePeriodic = async (
  id: string,
  data: Partial<Periodic>
): Promise<Periodic> => {
  return await db.periodic.update({
    where: { id },
    data,
  });
};

const deletePeriodic = async (id: string): Promise<Periodic> => {
  return await db.periodic.delete({
    where: { id },
  });
};

const getAllByNextOccurrenceBetweenDates = async (
  minDate: Date,
  maxDate: Date
) => {
  return await db.periodic.findMany({
    where: {
      nextOccurrence: {
        gte: minDate,
        lte: maxDate,
      },
    },
  });
};

export default {
  getPeriodicById,
  getAllPeriodicsForChildAccount,
  addPeriodic,
  updatePeriodic,
  deletePeriodic,
  getAllByNextOccurrenceBetweenDates,
};
