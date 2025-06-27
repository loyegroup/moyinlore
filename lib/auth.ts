import { unstable_getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import { authOptions } from './authOptions';

export const getServerAuthSession = async (
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
) => {
  return await unstable_getServerSession(req, res, authOptions);
};

export const getClientAuthSession = async () => {
  return await getSession();
};
