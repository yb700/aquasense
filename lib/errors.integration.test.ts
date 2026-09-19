/**
 * Integration tests for error utilities with API route handlers
 * 
 * These tests demonstrate how the error utilities integrate with
 * Next.js API routes and verify the response format.
 */

import { describe, it, expect } from 'vitest';
import { NextResponse } from 'next/server';
import {
  ErrorCodes,
  unauthorized,
  forbidden,
  badRequest,
  notFound,
  internalError,
  validationError,
  requireManager,
  requireStaff,
  type ErrorResponse,
} from './errors';

describe('Error Utilities Integration', () => {
  describe('API Route Handler Usage', () => {
    it('should handle authentication check in route handler', async () => {
      // Simulate a route handler checking authentication
      const mockSession = null; // No session

      let response: NextResponse<ErrorResponse>;
      if (!mockSession) {
        response = unauthorized('Authentication required', ErrorCodes.MISSING_SESSION);
      } else {
        response = NextResponse.json({ data: 'success' });
      }

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Authentication required');
      expect(body.code).toBe('MISSING_SESSION');
    });

    it('should handle manager authorization check', async () => {
      // Simulate a route handler requiring manager role
      const mockSession = { role: 'STAFF', userId: 'user1', organizationId: 'org1' };

      const authError = requireManager(mockSession.role, 'delete shifts');
      expect(authError).not.toBeNull();

      if (authError) {
        expect(authError.status).toBe(403);
        const body = await authError.json();
        expect(body.code).toBe('MANAGER_ONLY');
        expect(body.error).toContain('delete shifts');
      }
    });

    it('should allow operation when user has correct role', async () => {
      // Simulate a route handler requiring manager role
      const mockSession = { role: 'MANAGER', userId: 'user1', organizationId: 'org1' };

      const authError = requireManager(mockSession.role);
      expect(authError).toBeNull(); // No error, proceed with operation
    });

    it('should handle validation errors from Zod', async () => {
      // Simulate Zod validation error
      const zodError = {
        issues: [
          { message: 'Invalid email format', path: ['email'] },
          { message: 'Password must be at least 8 characters', path: ['password'] },
        ],
      };

      const response = validationError(zodError);
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body.code).toBe('VALIDATION_ERROR');
      expect(body.details).toHaveLength(2);
      expect(body.field).toBe('email');
    });

    it('should handle resource not found (multi-tenancy)', async () => {
      // Simulate checking if resource belongs to user's org
      const resourceOrg = 'org-a';
      const userOrg = 'org-b';

      let response: NextResponse<ErrorResponse>;
      if (resourceOrg !== userOrg) {
        // Return 404 to avoid leaking existence of other org's data
        response = notFound('Incident not found');
      } else {
        response = NextResponse.json({ data: 'resource' });
      }

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error).toBe('Incident not found');
      expect(body.code).toBe('NOT_FOUND');
    });

    it('should handle business logic errors', async () => {
      // Simulate clock in when already clocked in
      const hasActiveSession = true;

      let response: NextResponse;
      if (hasActiveSession) {
        response = badRequest(
          'You already have an active clock session. Please clock out first.',
          ErrorCodes.ALREADY_CLOCKED_IN
        );
      } else {
        response = NextResponse.json({ success: true }, { status: 201 });
      }

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.code).toBe('ALREADY_CLOCKED_IN');
    });

    it('should handle external service errors', async () => {
      // Simulate image upload failure
      const uploadSuccess = false;

      let response: NextResponse;
      if (!uploadSuccess) {
        response = internalError(
          'Failed to upload image to storage',
          ErrorCodes.EXTERNAL_SERVICE_ERROR
        );
      } else {
        response = NextResponse.json({ imageUrl: 'https://...' });
      }

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.code).toBe('EXTERNAL_SERVICE_ERROR');
    });
  });

  describe('Error Response Consistency', () => {
    it('should maintain consistent structure across all error types', async () => {
      const errors = [
        unauthorized(),
        forbidden(),
        badRequest('Test error'),
        notFound(),
        internalError(),
      ];

      for (const error of errors) {
        const body = await error.json();
        
        // All errors must have these required fields
        expect(body).toHaveProperty('error');
        expect(body).toHaveProperty('code');
        expect(typeof body.error).toBe('string');
        expect(typeof body.code).toBe('string');
        
        // Optional fields should not be present if not provided
        if (!body.details) {
          expect(body).not.toHaveProperty('details');
        }
        if (!body.field) {
          expect(body).not.toHaveProperty('field');
        }
      }
    });

    it('should use correct HTTP status codes', () => {
      expect(unauthorized().status).toBe(401);
      expect(forbidden().status).toBe(403);
      expect(badRequest('test').status).toBe(400);
      expect(notFound().status).toBe(404);
      expect(internalError().status).toBe(500);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle login with invalid credentials', async () => {
      const response = unauthorized('Invalid email or password', ErrorCodes.INVALID_CREDENTIALS);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.code).toBe('INVALID_CREDENTIALS');
      expect(body.error).toBe('Invalid email or password');
    });

    it('should handle staff trying to lock incident', async () => {
      const response = forbidden('Only managers can lock incidents', ErrorCodes.MANAGER_ONLY);
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.code).toBe('MANAGER_ONLY');
    });

    it('should handle modifying locked incident', async () => {
      const response = badRequest(
        'Cannot modify locked incident',
        ErrorCodes.INCIDENT_LOCKED
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe('INCIDENT_LOCKED');
    });

    it('should handle invalid date range', async () => {
      const response = badRequest(
        'Start date must be before end date',
        ErrorCodes.INVALID_DATE_RANGE
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe('INVALID_DATE_RANGE');
    });

    it('should handle clock out without active session', async () => {
      const response = badRequest(
        'No active clock session found',
        ErrorCodes.NO_ACTIVE_SESSION
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe('NO_ACTIVE_SESSION');
    });
  });

  describe('Type Safety', () => {
    it('should enforce ErrorResponse type structure', async () => {
      const response = badRequest('Test', ErrorCodes.VALIDATION_ERROR, ['error1'], 'field1');
      const body: ErrorResponse = await response.json();

      // TypeScript ensures these properties exist
      expect(body.error).toBeDefined();
      expect(body.code).toBeDefined();
      expect(body.details).toBeDefined();
      expect(body.field).toBeDefined();
    });

    it('should work with ErrorCode type', () => {
      const codes: Array<typeof ErrorCodes[keyof typeof ErrorCodes]> = [
        ErrorCodes.INVALID_CREDENTIALS,
        ErrorCodes.FORBIDDEN,
        ErrorCodes.VALIDATION_ERROR,
        ErrorCodes.NOT_FOUND,
        ErrorCodes.INTERNAL_ERROR,
      ];

      for (const code of codes) {
        const response = badRequest('Test', code);
        expect(response).toBeDefined();
      }
    });
  });
});
