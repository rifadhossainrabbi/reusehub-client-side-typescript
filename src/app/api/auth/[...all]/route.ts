// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextResponse } from 'next/server';

// ✅ Check if auth exists
if (!auth) {
  console.error('❌ Auth is not configured properly');
}

// ✅ Export handlers with error handling
export const { POST, GET } = toNextJsHandler(auth);

// ✅ Fallback handler if auth fails
export async function handler(req: Request) {
  try {
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 },
      );
    }
    return toNextJsHandler(auth);
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
