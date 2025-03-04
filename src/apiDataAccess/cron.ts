import { Interval, Periodic, TransactionReason } from '@prisma/client';
import HttpStatusCodes from '@/common/HttpStatusCodes';
import { db } from '@/server/db';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { APIError } from '@/common/apiUtils';

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
    const childAccountIds = periodics.map((p) => p.childAccountId);
    const childAccounts = await prisma.childAccount.findMany({
      where: {
        id: {
          in: childAccountIds,
        },
      },
    });

    for (const periodic of periodics) {
      const childAccount = childAccounts.find(
        (childAccount) => childAccount.id === periodic.childAccountId
      );
      if (!childAccount) {
        throw new APIError(
          HttpStatusCodes.NOT_FOUND,
          'ChildAccount not found for periodic'
        );
      }
      const { actionType, amount } = periodic;
      if (!actionType) {
        throw new APIError(
          HttpStatusCodes.BAD_REQUEST,
          'Action type not found for periodic'
        );
      }

      if (actionType === 'ADD' && amount) {
        const newChildAccount = await prisma.childAccount.update({
          where: {
            id: childAccount.id,
          },
          data: {
            current: { increment: amount },
          },
        });
        console.log('newChildAccount ', newChildAccount);
      }
      if (actionType === 'SUBTRACT' && amount) {
        const newChildAccount = await prisma.childAccount.update({
          where: {
            id: childAccount.id,
          },
          data: {
            current: { decrement: amount },
          },
        });
        console.log('newChildAccount ', newChildAccount);
      }

      if (!amount) {
        throw new APIError(
          HttpStatusCodes.BAD_REQUEST,
          'Amount not found for periodic'
        );
      }

      //TODO: This might have a problem if a periodic is executed multiple times in a day (it comes from the same periodic const above and will not change after each update)
      await prisma.transaction.create({
        data: {
          amount,
          type: actionType,
          executedAt: new Date(),
          reason: TransactionReason.PERIODIC,
          childAccount: {
            connect: {
              id: childAccount.id,
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
