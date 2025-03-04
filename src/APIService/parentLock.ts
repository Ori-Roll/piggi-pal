import { client } from './fetchClient/fetchClient';
import { ParentLock } from '@prisma/client';

const baseUrl = '/parent-lock';

const parentLock = {
  validate: (pin: string) =>
    client.get<ParentLock, 'message' | 'error'>(`${baseUrl}?pin=${pin}`),
  createParentLock: (parentLockData: Partial<ParentLock>) =>
    client.post<ParentLock, 'message' | 'error'>(baseUrl, parentLockData),
  updateParentLock: (parentLockData: ParentLock) =>
    client.patch<ParentLock, 'message' | 'error'>(baseUrl, parentLockData),
  deleteTask: () => client.delete<ParentLock, 'message' | 'error'>(baseUrl),
};

export default parentLock;
