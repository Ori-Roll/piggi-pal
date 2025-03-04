import NextAuth from '../../node_modules/next-auth';
// import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/server/db';
import authConfig from './auth.config';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  // session: { strategy: 'jwt' },
  ...authConfig,
});
