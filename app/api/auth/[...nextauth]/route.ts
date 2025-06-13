// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB();
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Missing credentials');
        }
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error('No user found');
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) throw new Error('Invalid password');

        return {
          id: user._id,
          email: user.email,
          role: user.role,
        };
      },
     }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.sub ?? '';
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
