/// app/api/auth/[...nextauth]/authOptions.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';
import { compare } from 'bcryptjs';
import User from '@/models/User';
import { connectDB } from '@/lib/db';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error('No user found');

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) throw new Error('Invalid password');

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=CredentialsSignin',
  },
};
export default authOptions;
// This code sets up NextAuth.js with a credentials provider for user authentication.