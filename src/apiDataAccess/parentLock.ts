import { ParentLock } from '@prisma/client';
import { db } from '@/server/db';

//TODO: Add prismDisconnect to all functions

export const getParentLock = async (
  userId: string
): Promise<ParentLock | null> => {
  return await db.parentLock.findUnique({
    where: { userId },
  });
};

export const addParentLock = async (
  userId: string,
  newData: Pick<ParentLock, 'pin' | 'question' | 'answer'>
): Promise<ParentLock> => {
  return await db.parentLock.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      ...newData,
    },
  });
};

export const updateParentLock = async (
  userId: string,
  data: Pick<ParentLock, 'pin' | 'question' | 'answer'>
): Promise<ParentLock> => {
  return await db.parentLock.update({
    where: { userId },
    data: data,
  });
};

export const deleteParentLock = async (userId: string): Promise<ParentLock> => {
  return await db.parentLock.delete({
    where: { userId },
  });
};

export default {
  getParentLock,
  addParentLock,
  updateParentLock,
  deleteParentLock,
};
