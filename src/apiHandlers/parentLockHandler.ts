import { ParentLock } from '@prisma/client';
import parentLockAccess from '@/apiDataAccess/parentLock';
import { APIError } from '@/common/apiUtils';
import HttpStatusCodes from '@/common/HttpStatusCodes';

const validateParentLock = async (userId: string, pin: number) => {
  const parentLock = await parentLockAccess.getParentLock(userId);

  if (!parentLock) {
    throw new APIError(HttpStatusCodes.NOT_FOUND, 'Parent lock does not exist');
  }
  if (parentLock.pin !== pin) {
    throw new APIError(
      HttpStatusCodes.UNAUTHORIZED,
      'Pin does not match parent lock'
    );
  }

  if (parentLock.userId !== userId) {
    throw new APIError(
      HttpStatusCodes.FORBIDDEN,
      'User not authorized to access this parent lock'
    );
  }

  return true;
};

const createParentLockWithPinAndQuestion = async (
  userId: string,
  parentLockData: Pick<ParentLock, 'pin' | 'question' | 'answer'>
) => {
  const parentLock = await parentLockAccess.getParentLock(userId);

  if (parentLock) {
    throw new APIError(
      HttpStatusCodes.CONFLICT,
      'Parent lock already exists for user'
    );
  }

  return await parentLockAccess.addParentLock(userId, parentLockData);
};

const updateParentLockPinAndQuestion = async (
  userId: string,
  data: Pick<ParentLock, 'pin' | 'question' | 'answer'>
) => {
  const parentLock = await parentLockAccess.getParentLock(userId);

  if (!parentLock) {
    throw new APIError(
      HttpStatusCodes.NOT_FOUND,
      'Parent lock does not exist for user'
    );
  }

  return await parentLockAccess.updateParentLock(userId, data);
};

const deleteParentLock = async (userId: string) => {
  const parentLock = await parentLockAccess.getParentLock(userId);

  if (!parentLock) {
    throw new APIError(
      HttpStatusCodes.NOT_FOUND,
      'Parent lock does not exist for user'
    );
  }

  return await parentLockAccess.deleteParentLock(userId);
};

export default {
  validateParentLock,
  createParentLockWithPinAndQuestion,
  updateParentLockPinAndQuestion,
  deleteParentLock,
};
