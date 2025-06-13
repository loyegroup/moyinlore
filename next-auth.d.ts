import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: 'admin' | 'superAdmin';
    };
  }

  interface User {
    id: string;
    email: string;
    role: 'admin' | 'superAdmin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: 'admin' | 'superAdmin';
  }
}
