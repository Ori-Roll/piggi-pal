import { client } from './fetchClient/fetchClient';
import { ParentLock } from '@prisma/client';

const baseUrl = '/parent-lock';

const parentLock = {
  validate: (pin: string) => client.get<ParentLock>(`${baseUrl}?pin=${pin}`),
  createParentLock: (parentLockData: Partial<ParentLock>) =>
    client.post<ParentLock>(baseUrl, parentLockData),
  updateParentLock: (parentLockData: ParentLock) =>
    client.patch<ParentLock>(baseUrl, parentLockData),
  deleteTask: () => client.delete<ParentLock>(baseUrl),
};

export default parentLock;
