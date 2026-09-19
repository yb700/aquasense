/**
 * Unit tests for centralized Zod validation schemas
 * 
 * These tests verify that validation schemas correctly:
 * - Accept valid inputs
 * - Reject invalid inputs with appropriate error messages
 * - Enforce field requirements and constraints
 */

import { describe, it, expect } from 'vitest';
import {
  createShiftSchema,
  updateShiftSchema,
  createLeaveRequestSchema,
  approveRejectLeaveRequestSchema,
  clockInSchema,
  clockOutSchema,
  createIncidentSchema,
  updateIncidentSchema,
  createCleaningTaskSchema,
} from './validation';
import { ZodError } from 'zod';

describe('Shift validation schemas', () => {
  describe('createShiftSchema', () => {
    it('should accept valid shift data', () => {
      const validShift = {
        userId: 'user-123',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '17:00',
        notes: 'Regular shift',
      };

      const result = createShiftSchema.parse(validShift);
      expect(result).toEqual(validShift);
    });

    it('should accept shift data without optional notes', () => {
      const validShift = {
        userId: 'user-123',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '17:00',
      };

      const result = createShiftSchema.parse(validShift);
      expect(result.notes).toBeUndefined();
    });

    it('should reject invalid date format', () => {
      const invalidShift = {
        userId: 'user-123',
        date: '01/15/2024', // Wrong format
        startTime: '09:00',
        endTime: '17:00',
      };

      expect(() => createShiftSchema.parse(invalidShift)).toThrow(ZodError);
    });

    it('should reject invalid time format', () => {
      const invalidShift = {
        userId: 'user-123',
        date: '2024-01-15',
        startTime: '9:00', // Missing leading zero
        endTime: '17:00',
      };

      expect(() => createShiftSchema.parse(invalidShift)).toThrow(ZodError);
    });

    it('should reject missing required fields', () => {
      const invalidShift = {
        userId: 'user-123',
        date: '2024-01-15',
        // Missing startTime and endTime
      };

      expect(() => createShiftSchema.parse(invalidShift)).toThrow(ZodError);
    });
  });

  describe('updateShiftSchema', () => {
    it('should accept partial shift updates', () => {
      const partialUpdate = {
        notes: 'Updated notes',
      };

      const result = updateShiftSchema.parse(partialUpdate);
      expect(result).toEqual(partialUpdate);
    });
  });
});

describe('Leave request validation schemas', () => {
  describe('createLeaveRequestSchema', () => {
    it('should accept valid leave request', () => {
      const validRequest = {
        type: 'SICK' as const,
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Medical appointment',
      };

      const result = createLeaveRequestSchema.parse(validRequest);
      expect(result).toEqual(validRequest);
    });

    it('should accept VACATION type', () => {
      const validRequest = {
        type: 'VACATION' as const,
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Family vacation',
      };

      const result = createLeaveRequestSchema.parse(validRequest);
      expect(result.type).toBe('VACATION');
    });

    it('should reject invalid leave type', () => {
      const invalidRequest = {
        type: 'PERSONAL', // Invalid type
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Personal reasons',
      };

      expect(() => createLeaveRequestSchema.parse(invalidRequest)).toThrow(ZodError);
    });

    it('should reject empty reason', () => {
      const invalidRequest = {
        type: 'SICK' as const,
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: '',
      };

      expect(() => createLeaveRequestSchema.parse(invalidRequest)).toThrow(ZodError);
    });
  });

  describe('approveRejectLeaveRequestSchema', () => {
    it('should accept APPROVED status', () => {
      const update = { status: 'APPROVED' as const };
      const result = approveRejectLeaveRequestSchema.parse(update);
      expect(result.status).toBe('APPROVED');
    });

    it('should accept REJECTED status', () => {
      const update = { status: 'REJECTED' as const };
      const result = approveRejectLeaveRequestSchema.parse(update);
      expect(result.status).toBe('REJECTED');
    });

    it('should reject PENDING status (managers cannot set back to pending)', () => {
      const update = { status: 'PENDING' };
      expect(() => approveRejectLeaveRequestSchema.parse(update)).toThrow(ZodError);
    });
  });
});

describe('Clock entry validation schemas', () => {
  describe('clockInSchema', () => {
    it('should accept valid GPS coordinates', () => {
      const validClock = {
        latitude: 55.6761,
        longitude: 12.5683,
      };

      const result = clockInSchema.parse(validClock);
      expect(result).toEqual(validClock);
    });

    it('should accept missing GPS coordinates', () => {
      const clockWithoutGPS = {};
      const result = clockInSchema.parse(clockWithoutGPS);
      expect(result.latitude).toBeUndefined();
      expect(result.longitude).toBeUndefined();
    });

    it('should accept null GPS coordinates', () => {
      const clockWithNullGPS = {
        latitude: null,
        longitude: null,
      };

      const result = clockInSchema.parse(clockWithNullGPS);
      expect(result.latitude).toBeNull();
      expect(result.longitude).toBeNull();
    });

    it('should reject latitude out of range', () => {
      const invalidClock = {
        latitude: 91, // Max is 90
        longitude: 12.5683,
      };

      expect(() => clockInSchema.parse(invalidClock)).toThrow(ZodError);
    });

    it('should reject longitude out of range', () => {
      const invalidClock = {
        latitude: 55.6761,
        longitude: 181, // Max is 180
      };

      expect(() => clockInSchema.parse(invalidClock)).toThrow(ZodError);
    });
  });

  describe('clockOutSchema', () => {
    it('should have same validation as clockInSchema', () => {
      const validClock = {
        latitude: -33.8688,
        longitude: 151.2093,
      };

      const result = clockOutSchema.parse(validClock);
      expect(result).toEqual(validClock);
    });
  });
});

describe('Incident validation schemas', () => {
  describe('createIncidentSchema', () => {
    it('should accept valid incident data', () => {
      const validIncident = {
        title: 'Pool leak detected',
        description: 'Water leak found in the main pool filtration system',
        severity: 'HIGH' as const,
      };

      const result = createIncidentSchema.parse(validIncident);
      expect(result).toEqual(validIncident);
    });

    it('should accept all severity levels', () => {
      const severities = ['LOW', 'MEDIUM', 'HIGH'] as const;
      
      severities.forEach(severity => {
        const incident = {
          title: 'Test incident',
          description: 'Test description',
          severity,
        };

        const result = createIncidentSchema.parse(incident);
        expect(result.severity).toBe(severity);
      });
    });

    it('should reject title exceeding 200 characters', () => {
      const invalidIncident = {
        title: 'A'.repeat(201), // Too long
        description: 'Test description',
        severity: 'LOW' as const,
      };

      expect(() => createIncidentSchema.parse(invalidIncident)).toThrow(ZodError);
    });

    it('should reject empty title', () => {
      const invalidIncident = {
        title: '',
        description: 'Test description',
        severity: 'LOW' as const,
      };

      expect(() => createIncidentSchema.parse(invalidIncident)).toThrow(ZodError);
    });

    it('should reject empty description', () => {
      const invalidIncident = {
        title: 'Test title',
        description: '',
        severity: 'LOW' as const,
      };

      expect(() => createIncidentSchema.parse(invalidIncident)).toThrow(ZodError);
    });

    it('should reject invalid severity', () => {
      const invalidIncident = {
        title: 'Test title',
        description: 'Test description',
        severity: 'CRITICAL', // Invalid severity
      };

      expect(() => createIncidentSchema.parse(invalidIncident)).toThrow(ZodError);
    });
  });

  describe('updateIncidentSchema', () => {
    it('should accept partial incident updates', () => {
      const partialUpdate = {
        severity: 'MEDIUM' as const,
      };

      const result = updateIncidentSchema.parse(partialUpdate);
      expect(result.severity).toBe('MEDIUM');
    });

    it('should accept status updates', () => {
      const statusUpdate = {
        status: 'CLOSED' as const,
      };

      const result = updateIncidentSchema.parse(statusUpdate);
      expect(result.status).toBe('CLOSED');
    });
  });
});

describe('Cleaning task validation schemas', () => {
  describe('createCleaningTaskSchema', () => {
    it('should accept valid cleaning task', () => {
      const validTask = {
        title: 'Clean pool filters',
        frequency: 'Daily',
      };

      const result = createCleaningTaskSchema.parse(validTask);
      expect(result).toEqual(validTask);
    });

    it('should reject empty title', () => {
      const invalidTask = {
        title: '',
        frequency: 'Daily',
      };

      expect(() => createCleaningTaskSchema.parse(invalidTask)).toThrow(ZodError);
    });

    it('should reject empty frequency', () => {
      const invalidTask = {
        title: 'Clean pool filters',
        frequency: '',
      };

      expect(() => createCleaningTaskSchema.parse(invalidTask)).toThrow(ZodError);
    });

    it('should reject missing required fields', () => {
      const invalidTask = {
        title: 'Clean pool filters',
        // Missing frequency
      };

      expect(() => createCleaningTaskSchema.parse(invalidTask)).toThrow(ZodError);
    });
  });
});
