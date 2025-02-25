import { PrismaClient } from '@prisma/client';

//@ts-expect-error - globalThis is not defined in typescript
export const db = globalThis.prisma || new PrismaClient();
//@ts-expect-error - globalThis is not defined in typescript
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
