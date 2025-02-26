import { db } from './db';

//TODO: Does this work?
export const prismaDisconnect = async () => {
  try {
    await db.$disconnect();
  } catch (e) {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  }
};
