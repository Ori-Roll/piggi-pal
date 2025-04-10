import { UserWithAllData } from '@/types/dataTypes';
import { ChildAccount } from '@prisma/client';

export const selectCurrentChildAccount = (
  user: UserWithAllData,
  childAccounts: ChildAccount[]
) => {
  if (!childAccounts?.length) {
    return null;
  }
  //TODO: Fix this logic, take into childAccount that there might be a user with different devices, each should open with it's corresponding childAccount
  if (!user?.lastOpenedChildAccountId) {
    return childAccounts[0];
  }
  return childAccounts.find(
    (childAccount) => childAccount.id === user.lastOpenedChildAccountId
  );
};
