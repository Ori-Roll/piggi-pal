import { z } from 'zod';
import messages from './messages';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: messages.name.min(2) })
    .max(15, { message: messages.name.max(15) }),
  description: z.string(),
  requiredTimes: z.number().min(1, { message: messages.times.min }),
  amount: z
    .number()
    .min(1, { message: messages.amount.min(1) })
    .max(500, { message: messages.amount.max(500) }),
});
