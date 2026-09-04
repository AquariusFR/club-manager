import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }

  // MOCK LOGIC: Map the code to a mock email for authentication
  const mockCodeToEmail: Record<string, string> = {
    'mock_google_code_123': 'admin@rcba.fr',
    'mock_google_code_456': 'coach@rcba.fr',
    'mock_google_code_789': 'joueur@rcba.fr',
  };

  const email = mockCodeToEmail[code];

  if (!email) {
    return NextResponse.redirect(new URL('/login?error=invalid_oauth_session', request.url));
  }

  const db = await getDb();
  const user = await db.get(`
    SELECT id, email, role as roleName, player_id as playerId
    FROM Users
    WHERE email = ?
  `, [email]);

  if (user) {
    const cookieStore = await cookies();
    cookieStore.set("rcba_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Redirect to appropriate dashboard
    let redirectUrl = '/';
    if (user.roleName === 'Parent' || user.roleName === 'Joueur') redirectUrl = '/parents/dashboard';
    if (user.roleName === 'Coach') redirectUrl = '/coach/dashboard';
    if (user.roleName === 'Direction') redirectUrl = '/direction/dashboard';
    if (user.roleName === 'Développeur') redirectUrl = '/dev';

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.redirect(new URL('/login?error=no_associated_account', request.url));
}
