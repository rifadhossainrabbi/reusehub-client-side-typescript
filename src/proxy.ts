import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from './lib/auth';

export async function proxy(request) {
  console.log('Message from Proxy');

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:id+',
    '/dashboard/admin/:id+',
    '/dashboard/user/:id+',
    // '/explore/:path*',
    '/explore/:id+',
  ],
};
