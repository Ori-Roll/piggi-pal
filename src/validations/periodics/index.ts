import { z } from 'zod';
import messages from './messages';

export const allowanceSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: messages.name.min(2) })
      .max(15, { message: messages.name.max(15) }),
    amount: z
      .number({ message: messages.amount.required })
      .min(1, { message: messages.amount.min(1) })
      .max(500, { message: messages.amount.max(500) }),
    startsAt: z.date().min(new Date(), { message: messages.startsAt.min }),
    endsAt: z
      .date()
      .min(new Date(), { message: messages.endsAt.minInFuture })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.endsAt || !data.startsAt) return true;
      return data.startsAt < data.endsAt;
    },
    {
      path: ['endsAt'],
      message: messages.endsAt.min,
    }
  );
