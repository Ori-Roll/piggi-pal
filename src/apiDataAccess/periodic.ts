import { Periodic } from '@prisma/client';
import { db } from '@/server/db';

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

const addPeriodic = async (data: Omit<Periodic, 'id'>): Promise<Periodic> => {
  const { childAccountId, ...modPeriodic } = data;

  return await db.periodic.create({
    data: {
      ...modPeriodic,
      childAccount: {
        connect: {
          id: childAccountId,
        },
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
