import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/session-utility';

const protectedPrefixes = [
  '/parents',
  '/coach',
  '/joueur',
  '/direction',
  '/settings',
  '/dev'
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));
  
  if (isProtected) {
    const sessionCookie = request.cookies.get('rcba_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const session = await verifySession(sessionCookie);
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.css).*)',
  ],
};
