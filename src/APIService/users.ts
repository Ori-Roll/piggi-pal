import { client } from './fetchClient/fetchClient';
import { User } from '@prisma/client';

export const userService = {
  getCurrentUser: () => client.get<User>('/users'),

  updateProfile: (id: string, userData: Partial<User>) =>
    client.patch<User>(`/users?id=${id}`, userData),
};
