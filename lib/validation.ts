/**
 * Centralized Zod validation schemas for all API endpoints
 * 
 * This module provides type-safe validation schemas for:
 * - Shift management (Requirements 4.1, 5.1)
 * - Leave request management (Requirement 5.1)
 * - Clock entries (Requirement 6.1)
 * - Incident reporting (Requirement 7.1)
 * - Cleaning tasks (Requirement 8.1)
 * 
 * All schemas validate input before database operations and return
 * 400 Bad Request with field-specific errors on validation failure.
 */

import { z } from 'zod';

/**
 * Shift validation schemas
 * Requirements: 4.1, 4.2
 */

// Create shift schema - for POST /api/shifts
export const createShiftSchema = z.object({
  userId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format'),
  notes: z.string().optional().nullable(),
  isRoutine: z.boolean().optional().default(false),
});

// Update shift schema - for PATCH /api/shifts/[id]
export const updateShiftSchema = z.object({
  userId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format').optional(),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format').optional(),
  notes: z.string().optional().nullable(),
  isRoutine: z.boolean().optional(),
});

// Copy shifts schema - for POST /api/shifts/copy
export const copyShiftsSchema = z.object({
  sourceMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Source month must be in YYYY-MM format'),
  targetMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Target month must be in YYYY-MM format'),
  keepAssignments: z.boolean().optional().default(false),
  onlyRoutine: z.boolean().optional().default(false),
});

// Swap shifts schemas
export const createSwapRequestSchema = z.object({
  shiftId: z.string().min(1, 'Shift ID is required'),
  targetUserId: z.string().optional().nullable(),
  offeredShiftId: z.string().optional().nullable(),
});

export const updateSwapRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'CANCELLED']),
});

/**
 * Leave request validation schemas
 * Requirements: 5.1
 */

// Create leave request schema - for POST /api/leave
export const createLeaveRequestSchema = z.object({
  type: z.enum(['SICK', 'VACATION'], {
    message: 'Leave type must be SICK or VACATION',
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  reason: z.string().min(1, 'Reason is required'),
});

// Update leave request schema - for PATCH /api/leave/[id]
// Only allows managers to approve or reject (not set back to PENDING)
export const approveRejectLeaveRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    message: 'Status must be APPROVED or REJECTED',
  }),
});

// Generic update leave request schema (for potential future use)
export const updateLeaveRequestSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'], {
    message: 'Status must be PENDING, APPROVED, or REJECTED',
  }),
});

/**
 * Clock entry validation schemas
 * Requirements: 6.1, 6.5, 6.6
 */

// GPS coordinates schema (used in both clock in and clock out)
export const gpsCoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
});

// Clock in schema - for POST /api/clock/in
export const clockInSchema = gpsCoordinatesSchema;

// Clock out schema - for POST /api/clock/out
export const clockOutSchema = gpsCoordinatesSchema;

/**
 * Incident validation schemas
 * Requirements: 7.1, 7.3
 */

// Create incident schema - for POST /api/incidents
export const createIncidentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().min(1, 'Description is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    message: 'Severity must be LOW, MEDIUM, or HIGH',
  }),
});

// Update incident schema - for PATCH /api/incidents/[id]
export const updateIncidentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    message: 'Severity must be LOW, MEDIUM, or HIGH',
  }).optional(),
  status: z.enum(['OPEN', 'CLOSED'], {
    message: 'Status must be OPEN or CLOSED',
  }).optional(),
});

/**
 * Cleaning task validation schemas
 * Requirements: 8.1
 */

// Create cleaning task schema - for POST /api/cleaning/tasks
export const createCleaningTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  frequency: z.string().min(1, 'Frequency is required'),
});

// Update cleaning task schema - for PATCH /api/cleaning/tasks/[id]
export const updateCleaningTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  frequency: z.string().min(1, 'Frequency is required').optional(),
});

/**
 * Type exports for TypeScript type inference
 */
export type CreateShiftInput = z.infer<typeof createShiftSchema>;
export type UpdateShiftInput = z.infer<typeof updateShiftSchema>;
export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>;
export type ApproveRejectLeaveRequestInput = z.infer<typeof approveRejectLeaveRequestSchema>;
export type UpdateLeaveRequestInput = z.infer<typeof updateLeaveRequestSchema>;
export type GpsCoordinatesInput = z.infer<typeof gpsCoordinatesSchema>;
export type ClockInInput = z.infer<typeof clockInSchema>;
export type ClockOutInput = z.infer<typeof clockOutSchema>;
export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
export type UpdateIncidentInput = z.infer<typeof updateIncidentSchema>;
export type CreateCleaningTaskInput = z.infer<typeof createCleaningTaskSchema>;
export type UpdateCleaningTaskInput = z.infer<typeof updateCleaningTaskSchema>;
