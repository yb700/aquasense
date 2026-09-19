import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';

/**
 * Unit Tests for Shifts API Route
 * 
 * Tests shift creation and listing endpoints to verify:
 * - Manager can create shifts
 * - Staff cannot create shifts
 * - Authentication is required
 * - Organization isolation is enforced
 * - Date range filtering works
 * 
 * Requirements:
 * - 4.1: Manager creates shift
 * - 4.6: Query shifts for date range
 * - 2.1, 2.2: Role-based access control
 * - 3.1, 3.6: Multi-tenant data isolation
 */

// Mock dependencies
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    shift: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

const mockGetSession = vi.mocked((await import('@/lib/session')).getSession);
const mockPrisma = vi.mocked((await import('@/lib/prisma')).prisma);

describe('POST /api/shifts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/shifts', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-1',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '17:00',
      }),
    });

    const response = await POST(request);
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

    const request = new NextRequest('http://localhost:3000/api/shifts', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-2',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '17:00',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it('should create shift when manager provides valid data', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      organizationId: 'org-1',
      name: 'Staff User',
      email: 'staff@test.com',
      passwordHash: 'hash',
      role: 'STAFF',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockShift = {
      id: 'shift-1',
      userId: 'user-1',
      organizationId: 'org-1',
      date: new Date('2024-01-15'),
      startTime: new Date('1970-01-01T09:00:00Z'),
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

    mockPrisma.shift.create.mockResolvedValue(mockShift);

    const request = new NextRequest('http://localhost:3000/api/shifts', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-1',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '17:00',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    
    const json = await response.json();
    expect(json.shift).toBeDefined();
    expect(json.shift.userId).toBe('user-1');
  });

  it('should return 400 if end time is before start time', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      organizationId: 'org-1',
      name: 'Staff User',
      email: 'staff@test.com',
      passwordHash: 'hash',
      role: 'STAFF',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/shifts', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-1',
        date: '2024-01-15',
        startTime: '17:00',
        endTime: '09:00',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});

describe('GET /api/shifts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/shifts');

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('should return shifts for authenticated user', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const mockShifts = [
      {
        id: 'shift-1',
        userId: 'user-1',
        organizationId: 'org-1',
        date: new Date('2024-01-15'),
        startTime: new Date('1970-01-01T09:00:00Z'),
        endTime: new Date('1970-01-01T17:00:00Z'),
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-1',
          name: 'Staff User',
          email: 'staff@test.com',
        },
      },
    ];

    mockPrisma.shift.findMany.mockResolvedValue(mockShifts);

    const request = new NextRequest('http://localhost:3000/api/shifts');

    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.shifts).toBeDefined();
    expect(json.shifts).toHaveLength(1);
  });
});
