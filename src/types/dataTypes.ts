import { Prisma } from '@prisma/client';

// This is an example of how to create a type that includes only some of the scalar fields of a model
// const userPersonalData = Prisma.validator<Prisma.UserDefaultArgs>()({
//   select: { email: true, name: true },
// })

/**
 * User extra types
 */

const userWithParentLock = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { parentLock: true },
});

const userWithAllData = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    childAccounts: {
      include: {
        periodics: true,
        tasks: true,
        transactions: true,
      },
    },
    parentLock: true,
  },
});

export type UserWithParentLock = Prisma.UserGetPayload<
  typeof userWithParentLock
>;

export type UserWithAllData = Prisma.UserGetPayload<typeof userWithAllData>;

/**
 * ChildAccount extra types
 */

const childAccountWithPeriodics =
  Prisma.validator<Prisma.ChildAccountDefaultArgs>()({
    include: { periodics: true },
  });

const childAccountWithTasks =
  Prisma.validator<Prisma.ChildAccountDefaultArgs>()({
    include: { tasks: true },
  });

const childAccountWithAllData =
  Prisma.validator<Prisma.ChildAccountDefaultArgs>()({
    include: { periodics: true, tasks: true, transactions: true },
  });

export type ChildAccountWithPeriodics = Prisma.ChildAccountGetPayload<
  typeof childAccountWithPeriodics
>;

export type ChildAccountWithTasks = Prisma.ChildAccountGetPayload<
  typeof childAccountWithTasks
>;

export type ChildAccountWithAllData = Prisma.ChildAccountGetPayload<
  typeof childAccountWithAllData
>;

/**
 * Periodic extra types
 */

const periodicWithCardStyle = Prisma.validator<Prisma.PeriodicDefaultArgs>()({
  include: { cardStyle: true },
});

export type PeriodicWithCardStyle = Prisma.PeriodicGetPayload<
  typeof periodicWithCardStyle
>;

export type PeriodicWithCardStyleToCreate = Omit<
  PeriodicWithCardStyle,
  'id' | 'cardStyle'
> & {
  cardStyle?: Prisma.CardStyleCreateInput;
};

/**
 * Task extra types
 */

const taskWithCardStyle = Prisma.validator<Prisma.TaskDefaultArgs>()({
  include: { cardStyle: true },
});

export type TaskWithCardStyle = Prisma.TaskGetPayload<typeof taskWithCardStyle>;
