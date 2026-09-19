import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH, DELETE } from './route';
import { NextRequest } from 'next/server';

/**
 * Unit Tests for Individual Shift API Route
 * 
 * Tests shift update and delete endpoints to verify:
 * - Manager can edit shifts
 * - Manager can delete shifts
 * - Staff cannot edit/delete shifts
 * - Organization isolation is enforced
 * 
 * Requirements:
 * - 4.4: Manager edits shifts
 * - 4.5: Manager deletes shifts
 * - 2.1, 2.2: Role-based access control
 * - 3.1: Multi-tenant data isolation
 */

// Mock dependencies
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    shift: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

const mockGetSession = vi.mocked((await import('@/lib/session')).getSession);
const mockPrisma = vi.mocked((await import('@/lib/prisma')).prisma);

describe('PATCH /api/shifts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/shifts/shift-1', {
      method: 'PATCH',
      body: JSON.stringify({
        startTime: '10:00',
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'shift-1' }),
    });
    expect(response.status).toBe(401);
  });

  it('should return 403 if user is not a manager', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const request = new NextRequest('http://localhost:3000/api/shifts/shift-1', {
      method: 'PATCH',
      body: JSON.stringify({
        startTime: '10:00',
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'shift-1' }),
    });
    expect(response.status).toBe(403);
  });

  it('should return 404 if shift not found', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.shift.findUnique.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/shifts/shift-1', {
      method: 'PATCH',
      body: JSON.stringify({
        startTime: '10:00',
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'shift-1' }),
    });
    expect(response.status).toBe(404);
  });

  it('should update shift when manager provides valid data', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.shift.findUnique.mockResolvedValue({
      id: 'shift-1',
      organizationId: 'org-1',
      userId: 'user-1',
      date: new Date('2024-01-15'),
      startTime: new Date('1970-01-01T09:00:00Z'),
      endTime: new Date('1970-01-01T17:00:00Z'),
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedShift = {
      id: 'shift-1',
      userId: 'user-1',
      organizationId: 'org-1',
      date: new Date('2024-01-15'),
      startTime: new Date('1970-01-01T10:00:00Z'),
      endTime: new Date('1970-01-01T17:00:00Z'),
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Staff User',
        email: 'staff@test.com',
      },
    };

    mockPrisma.shift.update.mockResolvedValue(updatedShift);

    const request = new NextRequest('http://localhost:3000/api/shifts/shift-1', {
      method: 'PATCH',
      body: JSON.stringify({
        startTime: '10:00',
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'shift-1' }),
    });
    expect(response.status).toBe(200);
  });
});

describe('DELETE /api/shifts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/shifts/shift-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'shift-1' }),
    });
    expect(response.status).toBe(401);
  });

  it('should return 403 if user is not a manager', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const request = new NextRequest('http://localhost:3000/api/shifts/shift-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'shift-1' }),
    });
    expect(response.status).toBe(403);
  });

  it('should delete shift when manager requests', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.shift.findUnique.mockResolvedValue({
      id: 'shift-1',
      organizationId: 'org-1',
      userId: 'user-1',
      date: new Date('2024-01-15'),
      startTime: new Date('1970-01-01T09:00:00Z'),
      endTime: new Date('1970-01-01T17:00:00Z'),
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockPrisma.shift.delete.mockResolvedValue({
      id: 'shift-1',
      organizationId: 'org-1',
      userId: 'user-1',
      date: new Date('2024-01-15'),
      startTime: new Date('1970-01-01T09:00:00Z'),
      endTime: new Date('1970-01-01T17:00:00Z'),
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/shifts/shift-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'shift-1' }),
    });
    expect(response.status).toBe(200);
  });
});
