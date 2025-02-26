import { Transaction } from '@prisma/client';
import { db } from '@/server/db';
import { prismaDisconnect } from '@/server/disconnect';

// const addTransaction = async (
//   data: Omit<Transaction, 'id'>
// ): Promise<Transaction> => {
//   return await db.transaction.create({
//     data: {
//       ...data,
//       ...(data.periodicId
//         ? {
//             connect: {
//               periodic: data.periodicId,
//             },
//           }
//         : {}),
//       ...(data.accountId
//         ? {
//             connect: {
//               account: data.accountId,
//             },
//           }
//         : {}),
//     },
//   });
// };

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
