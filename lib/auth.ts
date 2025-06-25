import { unstable_getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Use in API routes with `req` and `res` (from context)
 */
export const getServerAuthSession = async (
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
) => {
  return await unstable_getServerSession(req, res, authOptions);
};

/**
 * Use in client-side components
 */
export const getClientAuthSession = async () => {
  return await getSession();
};
