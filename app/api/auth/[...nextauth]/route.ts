import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
// @ts-expect-error – temporary fix for broken NextAuthOptions type
import type { NextAuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { AdapterUser } from 'next-auth/adapters';

type ExtendedJWT = JWT & {
  id: string;
  email: string;
  role: 'admin' | 'superAdmin';
};

type ExtendedSession = Session & {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'superAdmin';
    name?: string | null;
    image?: string | null;
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AdapterUser | any }) {
      if (user) {
        const u = user as ExtendedJWT;
        token.id = u.id;
        token.email = u.email;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const t = token as ExtendedJWT;
      (session as ExtendedSession).user.id = t.id;
      (session as ExtendedSession).user.email = t.email;
      (session as ExtendedSession).user.role = t.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
