import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

/**
 * Logout API endpoint
 * 
 * POST /api/auth/logout
 * 
 * Terminates the user's session by destroying the session cookie.
 * Does not require request body. Always succeeds even if no session exists.
 * 
 * Requirements:
 * - 1.3: WHEN an authenticated user requests logout, THE System SHALL terminate the session
 * - 15.1: THE System SHALL implement authentication endpoints at /api/auth/*
 * 
 * Design document: Authentication Module - logout function
 */

/**
 * POST handler for user logout
 * 
 * Request body: None required
 * 
 * Success response (200):
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
 * }
 * 
 * Error responses:
 * - 500: Server error
 */
export async function POST(_request: NextRequest) {
  try {
    // Destroy the session (clears the session cookie)
    await destroySession();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);

    // Handle unexpected errors
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during logout',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
