import cronAccess from '@/apiDataAccess/cron';
import { startOfDay, endOfDay } from 'date-fns';

//TODO: This is ugly. Refactor this.
// const getUpdatedAccounts = (
//   periodics: Periodic[],
//   accounts: Account[]
// ): Account[] => {
//   const resolvedAccounts = [];
//   for (const periodic of periodics) {
//     const account = accounts.find((a) => a.id === periodic.accountId);
//     if (!account) {
//       throw new Error('Account not found');
//     }
//     let newCurrent = account.current;
//     const { actionType, amount } = periodic;
//     if (actionType === ActionType.ADD) {
//       newCurrent = account.current + amount;
//     }
//     if (actionType === ActionType.SUBTRACT) {
//       newCurrent = account.current - amount;
//     }
//     const newAccount = { ...account, current: newCurrent };
//     resolvedAccounts.push(newAccount);
//   }
//   return resolvedAccounts;
// };

// const getUpdatedPeriodics = (periodics: Periodic[]): Periodic[] => {
//     const resolvedPeriodics = [];
//     for (const periodic of periodics) {

//     }

const executePeriodicActions = async () => {
  //   const periodics = await periodicHandler.getAllWithTodayNextOccurrence();
  //   console.log('1. periodics ', periodics);
  //   const allPeriodicsAccountIds = periodics.map((p) => p.accountId);
  //   console.log('2. allPeriodicsAccountIds ', allPeriodicsAccountIds);
  //   const accounts = await accountHandler.getManyAccountsByIds(
  //     allPeriodicsAccountIds
  //   );
  //   console.log('3. accounts ', accounts);
  //   const updatedAccounts = getUpdatedAccounts(periodics, accounts);

  //   const resolvedPeriodics = [];

  //   console.log('periodics ', periodics);
  //   if (periodics.length === 0) {
  //     console.log('No periodics to execute today');
  //     return;
  //   }
  //   for (const periodic of periodics) {
  //     const newAccount = await calculateAdd(periodic);
  //     resolvedPeriodics.push(newAccount);
  //   }
  const now = new Date();
  await cronAccess.processPeriodicTransactions(startOfDay(now), endOfDay(now));
  console.log('resolvedPeriodics ');
  return;
};

export default {
  executePeriodicActions,
};
