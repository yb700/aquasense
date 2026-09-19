import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createSession } from '@/lib/session';

/**
 * Login API endpoint
 * 
 * POST /api/auth/login
 * 
 * Authenticates a user with email and password credentials.
 * On success, creates an encrypted session cookie and returns user data.
 * 
 * Requirements:
 * - 1.1: WHEN a user submits valid credentials, THE System SHALL authenticate and create a session
 * - 1.2: WHEN a user submits invalid credentials, THE System SHALL reject authentication
 * - 15.1: THE System SHALL implement authentication endpoints at /api/auth/*
 * 
 * Design document: Authentication Module - login function
 */

// Request body validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST handler for user login
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "userpassword"
 * }
 * 
 * Success response (200):
 * {
 *   "success": true,
 *   "user": {
 *     "id": "user_id",
 *     "email": "user@example.com",
 *     "name": "User Name",
 *     "role": "MANAGER" | "STAFF",
 *     "organizationId": "org_id"
 *   }
 * }
 * 
 * Error responses:
 * - 400: Invalid request body
 * - 401: Invalid credentials
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.issues.map((err) => err.message),
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Query user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        organizationId: true,
      },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    // Verify password using bcrypt
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    // Create session with user data
    await createSession({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    // Return success response with user data (excluding password hash)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);

    // Handle unexpected errors
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during login',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
