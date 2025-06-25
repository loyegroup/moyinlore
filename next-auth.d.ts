// next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: 'admin' | 'superAdmin';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    role: 'admin' | 'superAdmin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    role: 'admin' | 'superAdmin';
  }
}
