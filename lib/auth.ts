import bcrypt from 'bcryptjs';

/**
 * Session interface matching the design document
 * Represents an authenticated user's session data
 */
export interface Session {
  userId: string;
  organizationId: string;
  role: 'MANAGER' | 'STAFF';
  name: string;
  email: string;
}

/**
 * Hash a plain text password using bcrypt
 * 
 * @param password - Plain text password to hash
 * @returns Promise resolving to the hashed password
 * 
 * Uses bcrypt with 10 salt rounds as per security requirements
 * (Design document: Security Considerations - Password Storage)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a plain text password against a hashed password
 * 
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 * 
 * Used during login authentication to validate user credentials
 * (Requirements 1.1, 1.2: User Authentication)
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
