import { Task } from '@prisma/client';
import { db } from '@/server/db';

//TODO: Add prismDisconnect to all functions
const getTaskById = async (id: string): Promise<Task | null> => {
  return await db.task.findUnique({
    where: { id },
  });
};

const getAllTasksForAccount = async (accountId: string): Promise<Task[]> => {
  return await db.task.findMany({
    where: {
      accountId,
    },
  });
};

const addTask = async (
  data: Omit<Task, 'id' | 'accountId' | 'periodicId'>,
  accountId: string,
  periodicId: string | null
): Promise<Task> => {
  return await db.task.create({
    data: {
      ...data,
      ...(periodicId && { periodic: { connect: { id: periodicId } } }),
      account: {
        connect: {
          id: accountId,
        },
      },
    },
  });
};

const updateTask = async (
  id: string,
  data: Omit<Task, 'id' | 'accountId' | 'periodicId'>
): Promise<Task> => {
  return await db.task.update({
    where: { id },
    data: data,
  });
};

const deleteTask = async (id: string): Promise<Task> => {
  return await db.task.delete({
    where: { id },
  });
};

export default {
  getTaskById,
  getAllTasksForAccount,
  addTask,
  updateTask,
  deleteTask,
};
