import { cookies } from "next/headers";
import { getDb } from "./db";
import { signSession, verifySession } from "./session-utility";
// verifySession is NOT exported here to avoid edge runtime issues in middleware


export interface UserSession {
  id: number;
  userId: number; // Added for compatibility with actions
  email: string;
  roleId: number;
  roleName: string;
  username: string;
  playerId : number;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("rcba_session")?.value;
  
  if (!sessionData) return null;
  
  return await verifySession(sessionData) as UserSession | null;
}

export async function login(username: string, password_hash: string): Promise<UserSession | null> {
  const db = await getDb();
  
  const user = await db.get(`
    SELECT id, email, email as username, role as roleName, staff_id, player_id
    FROM Users
    WHERE LOWER(email) = LOWER(?) AND password_hash = ?
  `, [username, password_hash]);


  if (user) {
    const roleLower = user.roleName.toLowerCase();
    const isAdmin = roleLower === 'direction' || roleLower === 'admin';
    
    const session: UserSession = { 
      id: user.id,
      userId: user.id,
      email: user.email,
      username: user.email,
      roleId: isAdmin ? 1 : roleLower === 'coach' ? 2 : 3,
      roleName: isAdmin ? 'Direction' : user.roleName,
      playerId: user.player_id || 0 
    };
    
    const cookieStore = await cookies();
    cookieStore.set("rcba_session", await signSession(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && process.env.VERCEL === "1",
      maxAge: isAdmin ? 60 * 60 * 24 * 365 : 60 * 60 * 24, // 1 year for admin, 1 day for others
      path: "/",
      sameSite: "lax"
    });
    return session;
  }

  return null;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("rcba_session");
}
