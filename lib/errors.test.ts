/**
 * Unit tests for error response utilities
 */

import { describe, it, expect } from 'vitest';
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
} from './errors';

describe('Error Response Utilities', () => {
  describe('ErrorCodes', () => {
    it('should have all required error codes', () => {
      // Authentication errors
      expect(ErrorCodes.INVALID_CREDENTIALS).toBe('INVALID_CREDENTIALS');
      expect(ErrorCodes.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ErrorCodes.SESSION_EXPIRED).toBe('SESSION_EXPIRED');
      expect(ErrorCodes.MISSING_SESSION).toBe('MISSING_SESSION');

      // Authorization errors
      expect(ErrorCodes.FORBIDDEN).toBe('FORBIDDEN');
      expect(ErrorCodes.INSUFFICIENT_PERMISSIONS).toBe('INSUFFICIENT_PERMISSIONS');
      expect(ErrorCodes.MANAGER_ONLY).toBe('MANAGER_ONLY');
      expect(ErrorCodes.STAFF_ONLY).toBe('STAFF_ONLY');

      // Validation errors
      expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCodes.INVALID_INPUT).toBe('INVALID_INPUT');
      expect(ErrorCodes.MISSING_REQUIRED_FIELD).toBe('MISSING_REQUIRED_FIELD');
      expect(ErrorCodes.INVALID_DATE_RANGE).toBe('INVALID_DATE_RANGE');
      expect(ErrorCodes.INVALID_TIME_RANGE).toBe('INVALID_TIME_RANGE');
      expect(ErrorCodes.INVALID_ENUM_VALUE).toBe('INVALID_ENUM_VALUE');

      // Business logic errors
      expect(ErrorCodes.ALREADY_CLOCKED_IN).toBe('ALREADY_CLOCKED_IN');
      expect(ErrorCodes.NO_ACTIVE_SESSION).toBe('NO_ACTIVE_SESSION');
      expect(ErrorCodes.INCIDENT_LOCKED).toBe('INCIDENT_LOCKED');
      expect(ErrorCodes.INVALID_STATUS_TRANSITION).toBe('INVALID_STATUS_TRANSITION');

      // Resource errors
      expect(ErrorCodes.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCodes.RESOURCE_NOT_FOUND).toBe('RESOURCE_NOT_FOUND');

      // Server errors
      expect(ErrorCodes.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
      expect(ErrorCodes.DATABASE_ERROR).toBe('DATABASE_ERROR');
      expect(ErrorCodes.EXTERNAL_SERVICE_ERROR).toBe('EXTERNAL_SERVICE_ERROR');
    });
  });

  describe('unauthorized()', () => {
    it('should return 401 with default message and code', async () => {
      const response = unauthorized();
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toEqual({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    });

    it('should return 401 with custom message', async () => {
      const response = unauthorized('Invalid session');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('Invalid session');
      expect(body.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 with custom code', async () => {
      const response = unauthorized('Session expired', ErrorCodes.SESSION_EXPIRED);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('Session expired');
      expect(body.code).toBe('SESSION_EXPIRED');
    });

    it('should support INVALID_CREDENTIALS code', async () => {
      const response = unauthorized('Invalid email or password', ErrorCodes.INVALID_CREDENTIALS);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('forbidden()', () => {
    it('should return 403 with default message and code', async () => {
      const response = forbidden();
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body).toEqual({
        error: 'You do not have permission to perform this action',
        code: 'FORBIDDEN',
      });
    });

    it('should return 403 with custom message', async () => {
      const response = forbidden('Only managers can delete shifts');
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.error).toBe('Only managers can delete shifts');
      expect(body.code).toBe('FORBIDDEN');
    });

    it('should return 403 with custom code', async () => {
      const response = forbidden('Manager access required', ErrorCodes.MANAGER_ONLY);
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.error).toBe('Manager access required');
      expect(body.code).toBe('MANAGER_ONLY');
    });
  });

  describe('badRequest()', () => {
    it('should return 400 with message and default code', async () => {
      const response = badRequest('Invalid email format');
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        error: 'Invalid email format',
        code: 'INVALID_INPUT',
      });
    });

    it('should return 400 with custom code', async () => {
      const response = badRequest('Start date must be before end date', ErrorCodes.INVALID_DATE_RANGE);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('Start date must be before end date');
      expect(body.code).toBe('INVALID_DATE_RANGE');
    });

    it('should include details when provided', async () => {
      const details = ['Email is required', 'Password is too short'];
      const response = badRequest('Validation failed', ErrorCodes.VALIDATION_ERROR, details);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.details).toEqual(details);
    });

    it('should include field when provided', async () => {
      const response = badRequest('Email is required', ErrorCodes.MISSING_REQUIRED_FIELD, undefined, 'email');
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.field).toBe('email');
    });

    it('should include both details and field', async () => {
      const details = ['Must be a valid email address'];
      const response = badRequest('Invalid email', ErrorCodes.VALIDATION_ERROR, details, 'email');
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.field).toBe('email');
      expect(body.details).toEqual(details);
    });

    it('should support business logic error codes', async () => {
      const response = badRequest('You already have an active clock session', ErrorCodes.ALREADY_CLOCKED_IN);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe('ALREADY_CLOCKED_IN');
    });
  });

  describe('notFound()', () => {
    it('should return 404 with default message and code', async () => {
      const response = notFound();
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        error: 'Resource not found',
        code: 'NOT_FOUND',
      });
    });

    it('should return 404 with custom message', async () => {
      const response = notFound('Incident not found');
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe('Incident not found');
      expect(body.code).toBe('NOT_FOUND');
    });

    it('should return 404 with custom code', async () => {
      const response = notFound('Shift not found', ErrorCodes.RESOURCE_NOT_FOUND);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.code).toBe('RESOURCE_NOT_FOUND');
    });
  });

  describe('internalError()', () => {
    it('should return 500 with default message and code', async () => {
      const response = internalError();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        error: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      });
    });

    it('should return 500 with custom message', async () => {
      const response = internalError('Database connection failed');
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe('Database connection failed');
      expect(body.code).toBe('INTERNAL_ERROR');
    });

    it('should return 500 with custom code', async () => {
      const response = internalError('Failed to upload image', ErrorCodes.EXTERNAL_SERVICE_ERROR);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe('Failed to upload image');
      expect(body.code).toBe('EXTERNAL_SERVICE_ERROR');
    });
  });

  describe('validationError()', () => {
    it('should create error from Zod-like error object', async () => {
      const zodError = {
        issues: [
          { message: 'Invalid email format', path: ['email'] },
          { message: 'Password is required', path: ['password'] },
        ],
      };

      const response = validationError(zodError);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('Invalid request data');
      expect(body.code).toBe('VALIDATION_ERROR');
      expect(body.details).toEqual(['Invalid email format', 'Password is required']);
      expect(body.field).toBe('email');
    });

    it('should handle single validation error', async () => {
      const zodError = {
        issues: [{ message: 'Name is required', path: ['name'] }],
      };

      const response = validationError(zodError);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.details).toEqual(['Name is required']);
      expect(body.field).toBe('name');
    });

    it('should handle nested path', async () => {
      const zodError = {
        issues: [{ message: 'Invalid value', path: ['user', 'profile', 'age'] }],
      };

      const response = validationError(zodError);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.field).toBe('user');
    });

    it('should handle numeric path', async () => {
      const zodError = {
        issues: [{ message: 'Invalid item', path: [0, 'name'] }],
      };

      const response = validationError(zodError);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.field).toBe('0');
    });

    it('should handle empty issues array', async () => {
      const zodError = {
        issues: [],
      };

      const response = validationError(zodError);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.details).toEqual([]);
      expect(body.field).toBeUndefined();
    });
  });

  describe('requireManager()', () => {
    it('should return null for MANAGER role', () => {
      const result = requireManager('MANAGER');
      expect(result).toBeNull();
    });

    it('should return 403 error for STAFF role', async () => {
      const response = requireManager('STAFF');
      expect(response).not.toBeNull();

      if (response) {
        const body = await response.json();
        expect(response.status).toBe(403);
        expect(body.error).toBe('Only managers can perform this action');
        expect(body.code).toBe('MANAGER_ONLY');
      }
    });

    it('should use custom operation in error message', async () => {
      const response = requireManager('STAFF', 'delete shifts');
      expect(response).not.toBeNull();

      if (response) {
        const body = await response.json();
        expect(body.error).toBe('Only managers can delete shifts');
      }
    });

    it('should return 403 error for unknown role', async () => {
      const response = requireManager('ADMIN');
      expect(response).not.toBeNull();

      if (response) {
        const body = await response.json();
        expect(response.status).toBe(403);
        expect(body.code).toBe('MANAGER_ONLY');
      }
    });
  });

  describe('requireStaff()', () => {
    it('should return null for STAFF role', () => {
      const result = requireStaff('STAFF');
      expect(result).toBeNull();
    });

    it('should return 403 error for MANAGER role', async () => {
      const response = requireStaff('MANAGER');
      expect(response).not.toBeNull();

      if (response) {
        const body = await response.json();
        expect(response.status).toBe(403);
        expect(body.error).toBe('Only staff members can perform this action');
        expect(body.code).toBe('STAFF_ONLY');
      }
    });

    it('should use custom operation in error message', async () => {
      const response = requireStaff('MANAGER', 'clock in');
      expect(response).not.toBeNull();

      if (response) {
        const body = await response.json();
        expect(body.error).toBe('Only staff members can clock in');
      }
    });

    it('should return 403 error for unknown role', async () => {
      const response = requireStaff('GUEST');
      expect(response).not.toBeNull();

      if (response) {
        const body = await response.json();
        expect(response.status).toBe(403);
        expect(body.code).toBe('STAFF_ONLY');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string messages', async () => {
      const response = badRequest('');
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('');
    });

    it('should handle very long error messages', async () => {
      const longMessage = 'a'.repeat(1000);
      const response = internalError(longMessage);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe(longMessage);
    });

    it('should handle special characters in messages', async () => {
      const message = 'Error: "Invalid" <input> & special chars';
      const response = badRequest(message);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe(message);
    });

    it('should handle empty details array', async () => {
      const response = badRequest('Error', ErrorCodes.VALIDATION_ERROR, []);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.details).toEqual([]);
    });

    it('should handle very long field names', async () => {
      const longField = 'a'.repeat(100);
      const response = badRequest('Error', ErrorCodes.VALIDATION_ERROR, undefined, longField);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.field).toBe(longField);
    });
  });

  describe('Type Safety', () => {
    it('should accept all defined error codes', async () => {
      // This test ensures TypeScript type checking works correctly
      const codes = Object.values(ErrorCodes);
      
      for (const code of codes) {
        const response = badRequest('Test error', code);
        const body = await response.json();
        expect(body.code).toBe(code);
      }
    });
  });

  describe('Response Structure', () => {
    it('should always include error and code fields', async () => {
      const responses = [
        unauthorized(),
        forbidden(),
        badRequest('test'),
        notFound(),
        internalError(),
      ];

      for (const response of responses) {
        const body = await response.json();
        expect(body).toHaveProperty('error');
        expect(body).toHaveProperty('code');
        expect(typeof body.error).toBe('string');
        expect(typeof body.code).toBe('string');
      }
    });

    it('should not include undefined optional fields', async () => {
      const response = badRequest('Test error');
      const body = await response.json();

      expect(body).not.toHaveProperty('details');
      expect(body).not.toHaveProperty('field');
    });

    it('should include optional fields when provided', async () => {
      const response = badRequest('Test', ErrorCodes.VALIDATION_ERROR, ['detail1'], 'field1');
      const body = await response.json();

      expect(body).toHaveProperty('details');
      expect(body).toHaveProperty('field');
    });
  });
});
