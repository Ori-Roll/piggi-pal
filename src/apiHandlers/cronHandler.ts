import cronAccess from '@/apiDataAccess/cron';
import { startOfDay, endOfDay } from 'date-fns';

//TODO: This is ugly. Refactor this.
// const getUpdatedChildAccounts = (
//   periodics: Periodic[],
//   childAccounts: ChildAccount[]
// ): ChildAccount[] => {
//   const resolvedChildAccounts = [];
//   for (const periodic of periodics) {
//     const childAccount = childAccounts.find((a) => a.id === periodic.childAccountId);
//     if (!childAccount) {
//       throw new Error('ChildAccount not found');
//     }
//     let newCurrent = childAccount.current;
//     const { actionType, amount } = periodic;
//     if (actionType === ActionType.ADD) {
//       newCurrent = childAccount.current + amount;
//     }
//     if (actionType === ActionType.SUBTRACT) {
//       newCurrent = childAccount.current - amount;
//     }
//     const newChildAccount = { ...childAccount, current: newCurrent };
//     resolvedChildAccounts.push(newChildAccount);
//   }
//   return resolvedChildAccounts;
// };

// const getUpdatedPeriodics = (periodics: Periodic[]): Periodic[] => {
//     const resolvedPeriodics = [];
//     for (const periodic of periodics) {

//     }

const executePeriodicActions = async () => {
  //   const periodics = await periodicHandler.getAllWithTodayNextOccurrence();
  //   console.log('1. periodics ', periodics);
  //   const allPeriodicsChildAccountIds = periodics.map((p) => p.childAccountId);
  //   console.log('2. allPeriodicsChildAccountIds ', allPeriodicsChildAccountIds);
  //   const childAccounts = await childAccountHandler.getManyChildAccountsByIds(
  //     allPeriodicsChildAccountIds
  //   );
  //   console.log('3. childAccounts ', childAccounts);
  //   const updatedChildAccounts = getUpdatedChildAccounts(periodics, childAccounts);

  //   const resolvedPeriodics = [];

  //   console.log('periodics ', periodics);
  //   if (periodics.length === 0) {
  //     console.log('No periodics to execute today');
  //     return;
  //   }
  //   for (const periodic of periodics) {
  //     const newChildAccount = await calculateAdd(periodic);
  //     resolvedPeriodics.push(newChildAccount);
  //   }
  const now = new Date();
  await cronAccess.processPeriodicTransactions(startOfDay(now), endOfDay(now));
  console.log('resolvedPeriodics ');
  return;
};

export default {
  executePeriodicActions,
};
