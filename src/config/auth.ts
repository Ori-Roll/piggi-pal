import { db } from '@/server/db';
import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

// const hasuraQuery = async (variables: GraphQLVariables) => {
//   const query = gql`
//     query users($email: String!, $password: bpchar!) {
//       users(where: { email: { _eq: $email }, password: { _eq: $password } }) {
//         id
//         name
//         email
//         image
//         created_at
//         updated_at
//       }
//     }
//   `;

//   const res = await fetch(process.env.AUTH_HASURA_GRAPHQL!, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-hasura-admin-secret': process.env.AUTH_HASURA_SECRET!,
//     },
//     body: JSON.stringify({ query, variables }),
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch user');
//   }

//   return await res.json();
// };

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    // Credentials({
    //   id: 'hasura-credentials',
    //   name: 'Hasura Credentials',
    //   credentials: {
    //     email: { label: 'Email', type: 'email' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials) {
    //     try {
    //       if (!credentials) {
    //         return null;
    //       }

    //       const { data } = await hasuraQuery({
    //         email: credentials.email as string,
    //         password: credentials.password as string,
    //       });

    //       if (data.users.length > 0) {
    //         return {
    //           id: data.users[0].id,
    //           name: data.users[0].name,
    //           email: data.users[0].email,
    //           image: data.users[0].image,
    //         };
    //       } else {
    //         return null;
    //       }
    //     } catch (error) {
    //       throw new Error(
    //         JSON.stringify({ errors: 'Authorize error', status: false })
    //       );
    //     }
    //   },
    // }),
    // Auth0({
    //   clientId: process.env.AUTH_AUTH0_ID,
    //   clientSecret: process.env.AUTH_AUTH0_SECRET,
    //   issuer: process.env.AUTH_AUTH0_ISSUER,
    // }),
    // Discord({
    //   clientId: process.env.AUTH_DISCORD_ID,
    //   clientSecret: process.env.AUTH_DISCORD_SECRET,
    // }),
    Google({
      clientId: process.env.AUTH_AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_AUTH_GOOGLE_SECRET,
      // Get the user profile from Google OAuth
      profile(profile) {
        console.log('IN profile', profile);
        return {
          ...profile,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn(userDetail) {
      if (Object.keys(userDetail).length === 0) {
        return false;
      }
      const { user, account } = userDetail;
      if (!user) {
        return false;
      }

      const { type, provider, providerAccountId } = account || {};

      const existingUser = user.email
        ? await db.user.findUnique({
            where: {
              email: user.email,
            },
          })
        : null;
      if (!existingUser) {
        const newUserEmail = user.email;
        const userDisplayName = user.name;

        if (!newUserEmail) {
          throw new Error('No email found in provider');
        }
        await db.user.create({
          data: {
            name: userDisplayName,
            email: newUserEmail,
            ...(type ? { providerType: type } : {}),
            ...(provider ? { providerId: provider } : {}),
            ...(providerAccountId
              ? { providerAccountId: providerAccountId }
              : {}),
          },
        });
      }
      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}`;
    },
    async session({ session, token }) {
      // console.log('token', token);
      // console.log('session', session);
      if (token.email) {
        const existingUser = await db.user.findFirst({
          where: {
            email: token.email,
          },
        });
        //TODO: This now uses sub for id, but should it not be id from profile? Note that id appears in userDetail in signIn callback
        if (existingUser?.id) session.user.id = existingUser.id;
      }
      if (token.name) session.user.name = token.name;
      if (token.email) session.user.email = token.email;
      if (token.picture) session.user.image = token.picture;

      return session;
    },
    async jwt({ token, user }) {
      // console.log('IN JWT CALLBACK user', user);
      // console.log('IN JWT CALLBACK account', account);
      // let existingUser;
      // if (account && account.providerAccountId) {
      //   existingUser = await db.user.findFirst({
      //     where: {
      //       providerAccountId: account.providerAccountId,
      //     },
      //   });
      // }
      // if (!existingUser && user?.email) {
      //   existingUser = await db.user.findFirst({
      //     where: {
      //       email: user.email,
      //     },
      //   });
      // }
      // console.log('existingUser', existingUser);
      // token.user = {
      //   ...user,
      //   ...(existingUser?.id ? { id: existingUser.id } : {}),
      // };
      token.user = user;
      return token;
    },
  },
});
