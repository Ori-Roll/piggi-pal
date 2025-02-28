import { client } from './fetchClient/fetchClient';
import { ParentLock } from '@prisma/client';

const baseUrl = '/users/parent-lock';

const parentLock = {
  validate: (pin: string) =>
    client.get<ParentLock>(`${baseUrl}/validate?pin=${pin}`),
  createParentLock: (parentLockData: ParentLock) =>
    client.post<ParentLock>(baseUrl, parentLockData),
  updateParentLock: (parentLockData: ParentLock) =>
    client.patch<ParentLock>(baseUrl, parentLockData),
  deleteTask: () => client.delete<ParentLock>(baseUrl),
};

export default parentLock;
