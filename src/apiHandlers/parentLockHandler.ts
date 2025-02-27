import { ParentLock } from '@prisma/client';
import parentLockAccess from '@/apiDataAccess/parentLock';

const validateParentLock = async (userId: string, pin: number) => {
  const parentLock = await parentLockAccess.getParentLock(userId);

  if (!parentLock) {
    throw new Error('Parent lock does not exist');
  }
  if (parentLock.pin !== pin) {
    throw new Error('Invalid pin');
  }

  if (parentLock.userId !== userId) {
    throw new Error('Invalid user');
  }

  return true;
};

const createParentLockWithPinAndQuestion = async (
  userId: string,
  parentLockData: Pick<ParentLock, 'pin' | 'question' | 'answer'>
) => {
  const parentLock = await parentLockAccess.getParentLock(userId);

  if (parentLock) {
    throw new Error('Parent lock already exists');
  }

  return await parentLockAccess.addParentLock(userId, parentLockData);
};

const updateParentLockPinAndQuestion = async (
  userId: string,
  data: Pick<ParentLock, 'pin' | 'question' | 'answer'>
) => {
  const parentLock = await parentLockAccess.getParentLock(userId);

  if (!parentLock) {
    throw new Error('Parent lock does not exist');
  }

  return await parentLockAccess.updateParentLock(userId, data);
};

const deleteParentLock = async (userId: string) => {
  const parentLock = await parentLockAccess.getParentLock(userId);

  if (!parentLock) {
    throw new Error('Parent lock does not exist');
  }

  return await parentLockAccess.deleteParentLock(userId);
};

export default {
  validateParentLock,
  createParentLockWithPinAndQuestion,
  updateParentLockPinAndQuestion,
  deleteParentLock,
};
