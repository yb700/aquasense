/**
 * Global error response utilities for consistent API error handling
 * 
 * This module provides standardized error responses, error codes, and helper functions
 * for common HTTP error scenarios across all API endpoints.
 * 
 * Requirements:
 * - 1.2: Invalid authentication error responses
 * - 2.2: Authorization denial responses
 * - 2.4: Authorization denial responses
 * - 2.6: Authorization denial responses
 * 
 * Design document: Error Handling section
 */

import { NextResponse } from 'next/server';

/**
 * Standard error response structure for all API errors
 */
export interface ErrorResponse {
  /** Human-readable error message */
  error: string;
  /** Machine-readable error code for client-side handling */
  code: string;
  /** Optional: specific field that caused the error (for validation errors) */
  field?: string;
  /** Optional: additional error details (e.g., multiple validation errors) */
  details?: string[];
}

/**
 * Standard error codes used throughout the application
 */
export const ErrorCodes = {
  // Authentication errors (401)
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  MISSING_SESSION: 'MISSING_SESSION',

  // Authorization errors (403)
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  MANAGER_ONLY: 'MANAGER_ONLY',
  STAFF_ONLY: 'STAFF_ONLY',

  // Validation errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  INVALID_ENUM_VALUE: 'INVALID_ENUM_VALUE',

  // Business logic errors (400)
  ALREADY_CLOCKED_IN: 'ALREADY_CLOCKED_IN',
  NO_ACTIVE_SESSION: 'NO_ACTIVE_SESSION',
  INCIDENT_LOCKED: 'INCIDENT_LOCKED',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',

  // Resource errors (404)
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',

  // Server errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

/**
 * Type for error code values
 */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Create a 401 Unauthorized error response
 * 
 * Use for authentication failures (invalid credentials, missing/expired session)
 * 
 * @param message - Custom error message (default: "Authentication required")
 * @param code - Error code (default: "UNAUTHORIZED")
 * @returns NextResponse with 401 status
 */
export function unauthorized(
  message: string = 'Authentication required',
  code: ErrorCode = ErrorCodes.UNAUTHORIZED
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      code,
    },
    { status: 401 }
  );
}

/**
 * Create a 403 Forbidden error response
 * 
 * Use for authorization failures (insufficient permissions, wrong role)
 * 
 * @param message - Custom error message (default: "You do not have permission to perform this action")
 * @param code - Error code (default: "FORBIDDEN")
 * @returns NextResponse with 403 status
 */
export function forbidden(
  message: string = 'You do not have permission to perform this action',
  code: ErrorCode = ErrorCodes.FORBIDDEN
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      code,
    },
    { status: 403 }
  );
}

/**
 * Create a 400 Bad Request error response
 * 
 * Use for validation errors, invalid input, or business logic violations
 * 
 * @param message - Custom error message
 * @param code - Error code (default: "INVALID_INPUT")
 * @param details - Optional array of detailed error messages
 * @param field - Optional field name that caused the error
 * @returns NextResponse with 400 status
 */
export function badRequest(
  message: string,
  code: ErrorCode = ErrorCodes.INVALID_INPUT,
  details?: string[],
  field?: string
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      code,
      ...(details && { details }),
      ...(field && { field }),
    },
    { status: 400 }
  );
}

/**
 * Create a 404 Not Found error response
 * 
 * Use for missing resources or multi-tenancy violations (resource exists but belongs to different org)
 * 
 * @param message - Custom error message (default: "Resource not found")
 * @param code - Error code (default: "NOT_FOUND")
 * @returns NextResponse with 404 status
 */
export function notFound(
  message: string = 'Resource not found',
  code: ErrorCode = ErrorCodes.NOT_FOUND
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      code,
    },
    { status: 404 }
  );
}

/**
 * Create a 500 Internal Server Error response
 * 
 * Use for unexpected errors, database failures, or external service errors
 * 
 * @param message - Custom error message (default: "An unexpected error occurred")
 * @param code - Error code (default: "INTERNAL_ERROR")
 * @returns NextResponse with 500 status
 */
export function internalError(
  message: string = 'An unexpected error occurred',
  code: ErrorCode = ErrorCodes.INTERNAL_ERROR
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      code,
    },
    { status: 500 }
  );
}

/**
 * Helper function to create error response from Zod validation errors
 * 
 * @param zodError - Zod validation error object
 * @returns NextResponse with 400 status and validation details
 */
export function validationError(zodError: { issues: Array<{ message: string; path: Array<string | number> }> }): NextResponse<ErrorResponse> {
  const details = zodError.issues.map((issue) => issue.message);
  const firstIssue = zodError.issues[0];
  const field = firstIssue?.path[0]?.toString();

  return badRequest(
    'Invalid request data',
    ErrorCodes.VALIDATION_ERROR,
    details,
    field
  );
}

/**
 * Helper function to check if user is a manager, return forbidden error if not
 * 
 * @param role - User role from session
 * @param operation - Operation being attempted (for error message)
 * @returns NextResponse with 403 status if not manager, null if manager
 */
export function requireManager(role: string, operation: string = 'perform this action'): NextResponse<ErrorResponse> | null {
  if (role !== 'MANAGER') {
    return forbidden(`Only managers can ${operation}`, ErrorCodes.MANAGER_ONLY);
  }
  return null;
}

/**
 * Helper function to check if user is staff, return forbidden error if not
 * 
 * @param role - User role from session
 * @param operation - Operation being attempted (for error message)
 * @returns NextResponse with 403 status if not staff, null if staff
 */
export function requireStaff(role: string, operation: string = 'perform this action'): NextResponse<ErrorResponse> | null {
  if (role !== 'STAFF') {
    return forbidden(`Only staff members can ${operation}`, ErrorCodes.STAFF_ONLY);
  }
  return null;
}
