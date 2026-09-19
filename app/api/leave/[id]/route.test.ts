import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import { NextRequest } from 'next/server';

/**
 * Unit Tests for Leave Request Approval/Rejection API Route
 * 
 * Tests leave request status update endpoint to verify:
 * - Manager can approve/reject leave requests
 * - Staff cannot approve/reject leave requests
 * - Authentication is required
 * - Only PENDING requests can be modified
 * - Organization isolation is enforced
 * 
 * Requirements:
 * - 5.2: Manager approves pending leave requests
 * - 5.3: Manager rejects pending leave requests
 * - 2.3: Manager authorization for leave approval
 * - 15.3: Prevent status changes on non-PENDING requests
 * - 3.2: Multi-tenant data isolation
 */

// Mock dependencies
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    leaveRequest: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const mockGetSession = vi.mocked((await import('@/lib/session')).getSession);
const mockPrisma = vi.mocked((await import('@/lib/prisma')).prisma);

describe('PATCH /api/leave/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/leave/leave-1', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'leave-1' }) });
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

    const request = new NextRequest('http://localhost:3000/api/leave/leave-1', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'leave-1' }) });
    expect(response.status).toBe(403);
  });

  it('should return 404 if leave request does not exist', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.leaveRequest.findUnique.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/leave/leave-1', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'leave-1' }) });
    expect(response.status).toBe(404);
  });

  it('should return 404 if leave request belongs to different organization', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.leaveRequest.findUnique.mockResolvedValue({
      id: 'leave-1',
      userId: 'user-1',
      organizationId: 'org-2', // Different organization
      type: 'SICK',
      status: 'PENDING',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      reason: 'Flu',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/leave/leave-1', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'leave-1' }) });
    expect(response.status).toBe(404);
  });

  it('should return 400 if leave request is not PENDING', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.leaveRequest.findUnique.mockResolvedValue({
      id: 'leave-1',
      userId: 'user-1',
      organizationId: 'org-1',
      type: 'SICK',
      status: 'APPROVED', // Already approved
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      reason: 'Flu',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/leave/leave-1', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'REJECTED',
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'leave-1' }) });
    expect(response.status).toBe(400);
    
    const json = await response.json();
    expect(json.error).toContain('not pending');
  });

  it('should approve leave request when manager provides APPROVED status', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.leaveRequest.findUnique.mockResolvedValue({
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
    });

    const updatedLeaveRequest = {
      id: 'leave-1',
      userId: 'user-1',
      organizationId: 'org-1',
      type: 'SICK',
      status: 'APPROVED',
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

    mockPrisma.leaveRequest.update.mockResolvedValue(updatedLeaveRequest);

    const request = new NextRequest('http://localhost:3000/api/leave/leave-1', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'leave-1' }) });
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.leaveRequest).toBeDefined();
    expect(json.leaveRequest.status).toBe('APPROVED');
  });

  it('should reject leave request when manager provides REJECTED status', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.leaveRequest.findUnique.mockResolvedValue({
      id: 'leave-1',
      userId: 'user-1',
      organizationId: 'org-1',
      type: 'VACATION',
      status: 'PENDING',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-07'),
      reason: 'Holiday',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedLeaveRequest = {
      id: 'leave-1',
      userId: 'user-1',
      organizationId: 'org-1',
      type: 'VACATION',
      status: 'REJECTED',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-07'),
      reason: 'Holiday',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Staff User',
        email: 'staff@test.com',
      },
    };

    mockPrisma.leaveRequest.update.mockResolvedValue(updatedLeaveRequest);

    const request = new NextRequest('http://localhost:3000/api/leave/leave-1', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'REJECTED',
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'leave-1' }) });
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.leaveRequest).toBeDefined();
    expect(json.leaveRequest.status).toBe('REJECTED');
  });

  it('should return 400 if status is invalid', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.leaveRequest.findUnique.mockResolvedValue({
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
    });

    const request = new NextRequest('http://localhost:3000/api/leave/leave-1', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'PENDING', // Not allowed, only APPROVED or REJECTED
      }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'leave-1' }) });
    expect(response.status).toBe(400);
  });
});
