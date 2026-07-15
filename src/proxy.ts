import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { auth } from './lib/auth';

/**
 * Middleware to handle authentication proxy logic.
 * Follows Next.js file conventions for route protection.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Explicitly allow the base listing page to be PUBLIC
  if (pathname === '/explore') {
    return NextResponse.next();
  }

  // 2. Authenticate session for all other matched routes
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 3. If no session is found, redirect to login
  if (!session) {
    const loginUrl = new URL('/login', request.url);

    // Optional: Add callbackURL to return user to their intended destination after login
    loginUrl.searchParams.set('callbackURL', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // 4. If session exists, proceed to the requested private route
  return NextResponse.next();
}

/**
 * Matcher Configuration:
 * - dashboard/:path* : Protects all routes inside dashboard
 * - explore/:id+     : Protects /explore/123 (Dynamic ID) but NOT /explore
 */
export const config = {
  matcher: ['/dashboard/:path*', '/explore/:id+'],
};
