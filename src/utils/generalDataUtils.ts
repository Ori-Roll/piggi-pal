import { Account, User } from '@prisma/client';

export const selectCurrentAccount = (user: User, accounts: Account[]) => {
  if (!accounts?.length) {
    return null;
  }
  //TODO: Fix this logic, take into account that there might be a user with different devices, each should open with it's corresponding account
  if (!user?.lastOpenedAccountId) {
    return accounts[0];
  }
  return accounts.find((account) => account.id === user.lastOpenedAccountId);
};
