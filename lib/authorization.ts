import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

/**
 * Session interface representing an authenticated user
 * Validates Requirements: 1.1, 1.4, 1.5
 */
export interface Session {
  userId: string;
  organizationId: string;
  role: Role;
  name: string;
  email: string;
}

/**
 * Error thrown when authentication is required but not present
 */
export class UnauthorizedError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error thrown when user lacks required permissions
 */
export class ForbiddenError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Get the current session from cookies
 * Returns null if no session exists
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    // Parse the session from the cookie
    // In a production implementation, this should decrypt/verify the session
    const session: Session = JSON.parse(sessionCookie.value);
    
    // Validate session structure
    if (
      !session.userId ||
      !session.organizationId ||
      !session.role ||
      !session.name ||
      !session.email
    ) {
      return null;
    }

    // Validate role is a valid enum value
    if (session.role !== Role.MANAGER && session.role !== Role.STAFF) {
      return null;
    }

    return session;
  } catch (error) {
    // Invalid session cookie format
    return null;
  }
}

/**
 * Require authentication and optionally validate role
 * 
 * @param role - Optional role requirement (MANAGER or STAFF)
 * @returns Session object if authentication succeeds
 * @throws UnauthorizedError if session is missing (401)
 * @throws ForbiddenError if role requirement is not met (403)
 * 
 * Validates Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */
export async function requireAuth(role?: Role): Promise<Session> {
  const session = await getSession();

  // Check if session exists
  if (!session) {
    throw new UnauthorizedError('Authentication required. Please log in.');
  }

  // Check role requirement if specified
  if (role && session.role !== role) {
    throw new ForbiddenError(
      `This operation requires ${role} role. Your role is ${session.role}.`
    );
  }

  return session;
}

/**
 * Require MANAGER role
 * Convenience function for manager-only operations
 * 
 * @returns Session object if user is a manager
 * @throws UnauthorizedError if session is missing (401)
 * @throws ForbiddenError if user is not a manager (403)
 */
export async function requireManager(): Promise<Session> {
  return requireAuth(Role.MANAGER);
}

/**
 * Require STAFF role
 * Convenience function for staff-only operations
 * 
 * @returns Session object if user is a staff member
 * @throws UnauthorizedError if session is missing (401)
 * @throws ForbiddenError if user is not a staff member (403)
 */
export async function requireStaff(): Promise<Session> {
  return requireAuth(Role.STAFF);
}

/**
 * Check if current user has a specific role
 * Returns false if no session exists
 * 
 * @param role - Role to check
 * @returns true if user has the specified role, false otherwise
 */
export async function hasRole(role: Role): Promise<boolean> {
  const session = await getSession();
  return session?.role === role;
}

/**
 * Check if current user is a manager
 * Returns false if no session exists
 */
export async function isManager(): Promise<boolean> {
  return hasRole(Role.MANAGER);
}

/**
 * Check if current user is a staff member
 * Returns false if no session exists
 */
export async function isStaff(): Promise<boolean> {
  return hasRole(Role.STAFF);
}
