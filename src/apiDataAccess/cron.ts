import { Interval, Periodic, TransactionReason } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import { db } from '@/server/db';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

// import { Periodic } from '@prisma/client';
// import accountHandler from '@src/handlers/accountHandler';
// import periodicHandler from '@src/handlers/periodicHandler';

// const calculateAdd = async (periodic: Periodic) => {
//   const { actionType, amount } = periodic;
//   const account = await accountHandler.getOneAccountByIdOnly(
//     periodic.accountId
//   );
//   if (!account) {
//     throw new Error('Account not found');
//   }
//   const newBalance = account.current + amount;
//   const newAccount = await accountHandler.updateAccountWithIdOnly(account.id, {
//     current: newBalance,
//   });
//   return newAccount;
// };

// const executeDailyAction = async () => {
//   const periodics = await periodicHandler.getAllWithTodayNextOccurrence();

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
//   console.log('resolvedPeriodics :');
//   console.log('-------------------');
//   console.log(resolvedPeriodics);
//   return resolvedPeriodics;
// };

const periodicIntervalToNextOccurrence: Record<Interval, (date: Date) => Date> =
  {
    [Interval.DAY]: (date: Date) => addDays(date, 1),
    [Interval.WEEK]: (date: Date) => addWeeks(date, 1),
    [Interval.BIWEEK]: (date: Date) => addWeeks(date, 2),
    [Interval.MONTH]: (date: Date) => addMonths(date, 1),
    [Interval.YEAR]: (date: Date) => addYears(date, 1),
  };

type PeriodicWithRequiredNext = Pick<
  Periodic,
  Exclude<keyof Periodic, 'nextOccurrence'>
> & { nextOccurrence: Date };

const getUpdatedNextOccurrence = (
  periodic: PeriodicWithRequiredNext
): Date | null => {
  const { interval, nextOccurrence: currentNextOccurrence, endsAt } = periodic;

  const nextOccurrence = periodicIntervalToNextOccurrence[interval](
    currentNextOccurrence
  );

  if (endsAt && nextOccurrence > endsAt) {
    return null;
  }

  return nextOccurrence;
};

const processPeriodicTransactions = async (minDate: Date, maxDate: Date) => {
  await db.$transaction(async (prisma) => {
    const periodics = await prisma.periodic.findMany({
      where: {
        nextOccurrence: {
          gte: minDate,
          lte: maxDate,
        },
        NOT: {
          nextOccurrence: null,
        },
      },
    });
    const accountIds = periodics.map((p) => p.accountId);
    const accounts = await prisma.account.findMany({
      where: {
        id: {
          in: accountIds,
        },
      },
    });

    for (const periodic of periodics) {
      const account = accounts.find((a) => a.id === periodic.accountId);
      if (!account) {
        throw new Error(HttpStatusCodes.NOT_FOUND, {
          cause: 'Account not found for periodic',
        });
      }
      const { actionType, amount } = periodic;
      if (actionType === 'ADD' && amount) {
        const newAccount = await prisma.account.update({
          where: {
            id: account.id,
          },
          data: {
            current: { increment: amount },
          },
        });
        console.log('newAccount ', newAccount);
      }
      if (actionType === 'SUBTRACT' && amount) {
        const newAccount = await prisma.account.update({
          where: {
            id: account.id,
          },
          data: {
            current: { decrement: amount },
          },
        });
        console.log('newAccount ', newAccount);
      }

      //TODO: This might have a problem if a periodic is executed multiple times in a day (it comes from the same periodic const above and will not change after each update)
      await prisma.transaction.create({
        data: {
          amount,
          type: actionType,
          executedAt: new Date(),
          reason: TransactionReason.PERIODIC,
          account: {
            connect: {
              id: account.id,
            },
          },
          periodic: {
            connect: {
              id: periodic.id,
            },
          },
        },
      });

      const updatedPeriodic = await prisma.periodic.update({
        where: {
          id: periodic.id,
        },
        data: {
          nextOccurrence: getUpdatedNextOccurrence(
            periodic as PeriodicWithRequiredNext
          ),
        },
      });
      console.log('resolvedPeriodic ', updatedPeriodic);
    }

    return;
  });
  db.$disconnect();
  return;
};

export default {
  processPeriodicTransactions,
};
