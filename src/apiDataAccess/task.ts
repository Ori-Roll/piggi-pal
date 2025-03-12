import { ChildAccount, Task } from '@prisma/client';
import { db } from '@/server/db';

//TODO: Add prismDisconnect to all functions
const getTaskById = async (id: string): Promise<Task | null> => {
  return await db.task.findUnique({
    where: { id },
  });
};

const getAllTasksForChildAccount = async (
  childAccountId: string
): Promise<Task[]> => {
  return await db.task.findMany({
    where: {
      childAccountId,
    },
  });
};

const addTask = async (
  data: Omit<Task, 'id' | 'childAccountId' | 'periodicId'>,
  childAccountId: string,
  periodicId: string | null
): Promise<Task> => {
  return await db.task.create({
    data: {
      ...data,
      ...(periodicId && { periodic: { connect: { id: periodicId } } }),
      childAccount: {
        connect: {
          id: childAccountId,
        },
      },
    },
  });
};

const updateTask = async (
  id: string,
  data: Partial<Omit<Task, 'id' | 'childAccountId' | 'periodicId'>>
): Promise<Task> => {
  return await db.task.update({
    where: { id },
    data: data,
  });
};

const completeTask = async (
  id: string,
  childAccountId: string,
  amount: number
): Promise<Task> => {
  return await db.$transaction(async (prisma) => {
    await prisma.childAccount.update({
      where: { id: childAccountId },
      data: {
        current: {
          increment: amount,
        },
      },
    });

    const task = await prisma.task.update({
      where: { id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    return task;
  });
};

const deleteTask = async (id: string): Promise<Task> => {
  return await db.task.delete({
    where: { id },
  });
};

export default {
  getTaskById,
  getAllTasksForChildAccount,
  addTask,
  updateTask,
  completeTask,
  deleteTask,
};
