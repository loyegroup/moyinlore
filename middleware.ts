/// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // 🔐 Redirect unauthenticated users
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 🔒 Block access to superAdmin-only routes
  const superAdminRoutes = ['/dashboard/settings', '/dashboard/logs'];
  if (superAdminRoutes.some((route) => pathname.startsWith(route)) && token?.role !== 'superAdmin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // ✅ Allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Apply to all dashboard pages
};
// This middleware checks if the user is authenticated and has the correct role for specific routes.
// If not, it redirects them to the login page or an unauthorized page.