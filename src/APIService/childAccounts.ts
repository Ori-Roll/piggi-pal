import { client } from './fetchClient/fetchClient';
import { ChildAccount } from '@prisma/client';

const childAccountsService = {
  getUserChildAccounts: () => client.get<ChildAccount[]>('/childAccounts'),
  getChildAccount: (id: string) =>
    client.get<ChildAccount>(`/childAccounts?id=${id}`),
  createChildAccount: (childAccountData: Partial<ChildAccount>) =>
    client.post<ChildAccount>('/childAccounts', childAccountData),
  updateChildAccount: (
    childAccountData: Partial<ChildAccount>,
    childAccountId: string
  ) =>
    client.patch<ChildAccount>(
      `/childAccounts?id=${childAccountId}`,
      childAccountData
    ),
  deleteChildAccount: (id: string) =>
    client.delete<ChildAccount>(`/childAccounts?id=${id}`),
};

export default childAccountsService;
