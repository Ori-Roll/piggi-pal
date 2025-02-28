import { client } from './fetchClient/fetchClient';
import { Account } from '@prisma/client';

const accountsService = {
  getUserAccounts: () => client.get<Account[]>('/accounts'),
  getAccount: (id: string) => client.get<Account>(`/accounts?id=${id}`),
  createAccount: (accountData: Partial<Account>) =>
    client.post<Account>('/accounts', accountData),
  updateAccount: (accountData: Partial<Account>, accountId: string) =>
    client.patch<Account>(`/accounts?id=${accountId}`, accountData),
  deleteAccount: (id: string) => client.delete<Account>(`/accounts?id=${id}`),
};

export default accountsService;
