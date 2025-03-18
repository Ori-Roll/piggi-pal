import cronAccess from '@/apiDataAccess/cron';
import { startOfDay, endOfDay } from 'date-fns';

//TODO: This is ugly. Refactor this.

const executePeriodicActions = async () => {
  const now = new Date();
  await cronAccess.processPeriodicTransactions(startOfDay(now), endOfDay(now));
  console.log('resolvedPeriodics ');
  return;
};

export default {
  executePeriodicActions,
};
