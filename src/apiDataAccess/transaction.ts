import { Transaction } from '@prisma/client';
import { db } from '@/server/db';
import { prismaDisconnect } from '@/server/disconnect';

const updateTransaction = async (
  id: string,
  data: Partial<Transaction>
): Promise<Transaction> => {
  const updatedTransaction = await db.transaction.update({
    where: { id },
    data,
  });
  prismaDisconnect();
  return updatedTransaction;
};

export default {
  // addTransaction,
  updateTransaction,
};
