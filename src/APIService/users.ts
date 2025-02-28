import { client } from './fetchClient/fetchClient';
import { User } from '@prisma/client';

export const userService = {
  getCurrentUser: () => client.get<User>('/users/me'),

  updateProfile: (id: string, userData: Partial<User>) =>
    client.patch<User>(`/users/${id}`, userData),
};
