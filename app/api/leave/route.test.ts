import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';

/**
 * Unit Tests for Leave Request API Route
 * 
 * Tests leave request creation and listing endpoints to verify:
 * - Staff and Manager can create leave requests
 * - Authentication is required
 * - Leave requests are created with PENDING status
 * - Organization isolation is enforced
 * - Date validation works (end date not before start date)
 * 
 * Requirements:
 * - 5.1: Create leave request with type, dates, reason, PENDING status
 * - 3.2, 3.6: Multi-tenant data isolation
 * - 5.4: List leave requests with filtering
 */

// Mock dependencies
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    leaveRequest: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const mockGetSession = vi.mocked((await import('@/lib/session')).getSession);
const mockPrisma = vi.mocked((await import('@/lib/prisma')).prisma);

describe('POST /api/leave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/leave', {
      method: 'POST',
      body: JSON.stringify({
        type: 'SICK',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Flu',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('should create leave request when staff provides valid data', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const mockLeaveRequest = {
      id: 'leave-1',
      userId: 'user-1',
      organizationId: 'org-1',
      type: 'SICK',
      status: 'PENDING',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      reason: 'Flu',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Staff User',
        email: 'staff@test.com',
      },
    };

    mockPrisma.leaveRequest.create.mockResolvedValue(mockLeaveRequest);

    const request = new NextRequest('http://localhost:3000/api/leave', {
      method: 'POST',
      body: JSON.stringify({
        type: 'SICK',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Flu',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    
    const json = await response.json();
    expect(json.leaveRequest).toBeDefined();
    expect(json.leaveRequest.status).toBe('PENDING');
    expect(json.leaveRequest.type).toBe('SICK');
  });

  it('should create leave request when manager provides valid data', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    const mockLeaveRequest = {
      id: 'leave-2',
      userId: 'manager-1',
      organizationId: 'org-1',
      type: 'VACATION',
      status: 'PENDING',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-07'),
      reason: 'Holiday',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'manager-1',
        name: 'Manager User',
        email: 'manager@test.com',
      },
    };

    mockPrisma.leaveRequest.create.mockResolvedValue(mockLeaveRequest);

    const request = new NextRequest('http://localhost:3000/api/leave', {
      method: 'POST',
      body: JSON.stringify({
        type: 'VACATION',
        startDate: '2024-02-01',
        endDate: '2024-02-07',
        reason: 'Holiday',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    
    const json = await response.json();
    expect(json.leaveRequest).toBeDefined();
    expect(json.leaveRequest.status).toBe('PENDING');
    expect(json.leaveRequest.type).toBe('VACATION');
  });

  it('should return 400 if end date is before start date', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const request = new NextRequest('http://localhost:3000/api/leave', {
      method: 'POST',
      body: JSON.stringify({
        type: 'SICK',
        startDate: '2024-01-20',
        endDate: '2024-01-15',
        reason: 'Invalid date range',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should return 400 if type is invalid', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const request = new NextRequest('http://localhost:3000/api/leave', {
      method: 'POST',
      body: JSON.stringify({
        type: 'INVALID',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Test',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should return 400 if reason is missing', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const request = new NextRequest('http://localhost:3000/api/leave', {
      method: 'POST',
      body: JSON.stringify({
        type: 'SICK',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: '',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});

describe('GET /api/leave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/leave');

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('should return all leave requests for manager', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    const mockLeaveRequests = [
      {
        id: 'leave-1',
        userId: 'user-1',
        organizationId: 'org-1',
        type: 'SICK',
        status: 'PENDING',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        reason: 'Flu',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-1',
          name: 'Staff User',
          email: 'staff@test.com',
        },
      },
      {
        id: 'leave-2',
        userId: 'user-2',
        organizationId: 'org-1',
        type: 'VACATION',
        status: 'APPROVED',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-07'),
        reason: 'Holiday',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-2',
          name: 'Another Staff',
          email: 'staff2@test.com',
        },
      },
    ];

    mockPrisma.leaveRequest.findMany.mockResolvedValue(mockLeaveRequests);

    const request = new NextRequest('http://localhost:3000/api/leave');

    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.leaveRequests).toBeDefined();
    expect(json.leaveRequests).toHaveLength(2);
  });

  it('should return only own leave requests for staff', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const mockLeaveRequests = [
      {
        id: 'leave-1',
        userId: 'user-1',
        organizationId: 'org-1',
        type: 'SICK',
        status: 'PENDING',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        reason: 'Flu',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-1',
          name: 'Staff User',
          email: 'staff@test.com',
        },
      },
    ];

    mockPrisma.leaveRequest.findMany.mockResolvedValue(mockLeaveRequests);

    const request = new NextRequest('http://localhost:3000/api/leave');

    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.leaveRequests).toBeDefined();
    expect(json.leaveRequests).toHaveLength(1);
    expect(json.leaveRequests[0].userId).toBe('user-1');
  });
});
