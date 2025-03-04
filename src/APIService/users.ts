import { client } from './fetchClient/fetchClient';
import { UserWithAllData, UserWithParentLock } from '@/types/dataTypes';

export const userService = {
  getCurrentUser: () => client.get<UserWithAllData>('/users'),

  updateProfile: (id: string, userData: Partial<UserWithParentLock>) =>
    client.patch<UserWithParentLock>(`/users?id=${id}`, userData),
};
