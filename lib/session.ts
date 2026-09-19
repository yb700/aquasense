import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { Session } from './auth';

/**
 * Session configuration for iron-session
 * 
 * Security settings per design document:
 * - 24-hour timeout (maxAge: 24 * 60 * 60 seconds)
 * - HTTP-only cookies (httpOnly: true)
 * - Secure flag for HTTPS (secure: true in production)
 * - SameSite=Strict to prevent CSRF (sameSite: 'strict')
 * 
 * (Requirements 1.1, 1.3: User Authentication)
 * (Design document: Security Considerations - Session Tokens)
 */
export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'aquasense_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
};

/**
 * Create a new session for an authenticated user
 * 
 * @param sessionData - Session data containing userId, organizationId, role, name, and email
 * @returns Promise that resolves when the session is created
 * 
 * Creates an encrypted HTTP-only cookie with the session data.
 * The session will expire after 24 hours.
 * 
 * (Requirements 1.1: WHEN a user submits valid credentials, THE System SHALL create a session)
 * (Design document: Authentication Module - Session Structure)
 */
export async function createSession(sessionData: Session): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<Session>(cookieStore, sessionOptions);
  
  // Set session data
  session.userId = sessionData.userId;
  session.organizationId = sessionData.organizationId;
  session.role = sessionData.role;
  session.name = sessionData.name;
  session.email = sessionData.email;
  
  // Save the session (encrypts and sets the cookie)
  await session.save();
}

/**
 * Get the current user's session
 * 
 * @returns Promise resolving to Session object if authenticated, null otherwise
 * 
 * Retrieves and decrypts the session from the encrypted HTTP-only cookie.
 * Returns null if no session exists or session is invalid/expired.
 * 
 * (Requirements 1.1: User session retrieval for authenticated requests)
 * (Design document: Authentication Module - getSession function)
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const session = await getIronSession<Session>(cookieStore, sessionOptions);
  
  // Check if session has required fields
  if (
    session.userId &&
    session.organizationId &&
    session.role &&
    session.name &&
    session.email
  ) {
    return {
      userId: session.userId,
      organizationId: session.organizationId,
      role: session.role,
      name: session.name,
      email: session.email,
    };
  }
  
  return null;
}

/**
 * Destroy the current user's session
 * 
 * @returns Promise that resolves when the session is destroyed
 * 
 * Clears the session cookie, effectively logging the user out.
 * After this call, subsequent getSession() calls will return null.
 * 
 * (Requirements 1.3: WHEN an authenticated user requests logout, 
 *  THE System SHALL terminate the session)
 * (Design document: Authentication Module - logout function)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<Session>(cookieStore, sessionOptions);
  
  // Destroy the session (clears the cookie)
  session.destroy();
}
