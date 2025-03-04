import { NextAuthConfig } from '../../node_modules/next-auth';
import Google from 'next-auth/providers/google';

console.log(process.env.AUTH_SECRET);

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },

  secret: process.env.AUTH_SECRET,
  // session: { strategy: 'jwt' },
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}`;
    },
    jwt({ token, trigger, session }) {
      if (trigger === 'update') token.name = session?.user?.name;
      return token;
    },
  },
} satisfies NextAuthConfig;
