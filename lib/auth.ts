// lib/auth.ts

import { unstable_getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Get the session on the server side (e.g., API routes, server components)
 */
export const getServerAuthSession = async (req?: any, res?: any) => {
  if (req && res) {
    // For API routes with req and res
    return await unstable_getServerSession(req, res, authOptions);
  }
  // For server components
  return await unstable_getServerSession(authOptions);
};

/**
 * Get the session on the client side (use this in client components)
 */
export const getClientAuthSession = async () => {
  return await getSession();
};
