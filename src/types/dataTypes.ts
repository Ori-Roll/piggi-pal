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
    accounts: true,
    sessions: true,
    childAccounts: true,
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
