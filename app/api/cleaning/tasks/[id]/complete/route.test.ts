import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

/**
 * Unit Tests for Cleaning Task Completion API Route
 * 
 * Tests cleaning task completion endpoint to verify:
 * - Staff can complete cleaning tasks
 * - Authentication is required
 * - Organization isolation is enforced
 * - Completion log is created with correct data
 * 
 * Requirements:
 * - 8.2: Staff marks cleaning task as completed, create cleaning log entry
 * - 3.6: Automatically assign organization ID
 * - 15.6: Cleaning task completion endpoint
 */

// Mock dependencies
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    cleaningTask: {
      findUnique: vi.fn(),
    },
    cleaningLog: {
      create: vi.fn(),
    },
  },
}));

const mockGetSession = vi.mocked((await import('@/lib/session')).getSession);
const mockPrisma = vi.mocked((await import('@/lib/prisma')).prisma);

describe('POST /api/cleaning/tasks/[id]/complete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest(
      'http://localhost:3000/api/cleaning/tasks/task-1/complete',
      { method: 'POST' }
    );

    const response = await POST(request, { params: Promise.resolve({ id: 'task-1' }) });
    expect(response.status).toBe(401);
    
    const json = await response.json();
    expect(json.error).toBe('Authentication required');
  });

  it('should return 404 if task does not exist', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.cleaningTask.findUnique.mockResolvedValue(null);

    const request = new NextRequest(
      'http://localhost:3000/api/cleaning/tasks/task-1/complete',
      { method: 'POST' }
    );

    const response = await POST(request, { params: Promise.resolve({ id: 'task-1' }) });
    expect(response.status).toBe(404);
    
    const json = await response.json();
    expect(json.error).toBe('Cleaning task not found');
  });

  it('should return 404 if task belongs to different organization', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.cleaningTask.findUnique.mockResolvedValue({
      id: 'task-1',
      title: 'Clean pool filters',
      frequency: 'Daily',
      organizationId: 'org-2', // Different organization
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest(
      'http://localhost:3000/api/cleaning/tasks/task-1/complete',
      { method: 'POST' }
    );

    const response = await POST(request, { params: Promise.resolve({ id: 'task-1' }) });
    expect(response.status).toBe(404);
    
    const json = await response.json();
    expect(json.error).toBe('Cleaning task not found');
  });

  it('should create completion log for staff user', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.cleaningTask.findUnique.mockResolvedValue({
      id: 'task-1',
      title: 'Clean pool filters',
      frequency: 'Daily',
      organizationId: 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockLog = {
      id: 'log-1',
      taskId: 'task-1',
      userId: 'user-1',
      organizationId: 'org-1',
      completedAt: new Date(),
      user: {
        name: 'Staff User',
        email: 'staff@test.com',
      },
      task: {
        title: 'Clean pool filters',
        frequency: 'Daily',
      },
    };

    mockPrisma.cleaningLog.create.mockResolvedValue(mockLog);

    const request = new NextRequest(
      'http://localhost:3000/api/cleaning/tasks/task-1/complete',
      { method: 'POST' }
    );

    const response = await POST(request, { params: Promise.resolve({ id: 'task-1' }) });
    expect(response.status).toBe(201);
    
    const json = await response.json();
    expect(json.log).toBeDefined();
    expect(json.log.taskId).toBe('task-1');
    expect(json.log.userId).toBe('user-1');
    expect(json.log.organizationId).toBe('org-1');
  });

  it('should create completion log for manager user', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.cleaningTask.findUnique.mockResolvedValue({
      id: 'task-1',
      title: 'Test pool water',
      frequency: 'Hourly',
      organizationId: 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockLog = {
      id: 'log-2',
      taskId: 'task-1',
      userId: 'manager-1',
      organizationId: 'org-1',
      completedAt: new Date(),
      user: {
        name: 'Manager User',
        email: 'manager@test.com',
      },
      task: {
        title: 'Test pool water',
        frequency: 'Hourly',
      },
    };

    mockPrisma.cleaningLog.create.mockResolvedValue(mockLog);

    const request = new NextRequest(
      'http://localhost:3000/api/cleaning/tasks/task-1/complete',
      { method: 'POST' }
    );

    const response = await POST(request, { params: Promise.resolve({ id: 'task-1' }) });
    expect(response.status).toBe(201);
    
    const json = await response.json();
    expect(json.log).toBeDefined();
    expect(json.log.userId).toBe('manager-1');
  });

  it('should automatically set current timestamp', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.cleaningTask.findUnique.mockResolvedValue({
      id: 'task-1',
      title: 'Clean pool filters',
      frequency: 'Daily',
      organizationId: 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockPrisma.cleaningLog.create.mockResolvedValue({
      id: 'log-1',
      taskId: 'task-1',
      userId: 'user-1',
      organizationId: 'org-1',
      completedAt: new Date(),
      user: {
        name: 'Staff User',
        email: 'staff@test.com',
      },
      task: {
        title: 'Clean pool filters',
        frequency: 'Daily',
      },
    });

    const beforeTime = new Date();
    
    const request = new NextRequest(
      'http://localhost:3000/api/cleaning/tasks/task-1/complete',
      { method: 'POST' }
    );

    await POST(request, { params: Promise.resolve({ id: 'task-1' }) });

    const afterTime = new Date();

    // Verify that cleaningLog.create was called with a completedAt between beforeTime and afterTime
    expect(mockPrisma.cleaningLog.create).toHaveBeenCalled();
    const createCall = mockPrisma.cleaningLog.create.mock.calls[0][0];
    const completedAt = createCall.data.completedAt;
    
    expect(completedAt).toBeInstanceOf(Date);
    expect(completedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    expect(completedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
  });

  it('should include user and task details in response', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.cleaningTask.findUnique.mockResolvedValue({
      id: 'task-1',
      title: 'Vacuum pool',
      frequency: 'Weekly',
      organizationId: 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockLog = {
      id: 'log-1',
      taskId: 'task-1',
      userId: 'user-1',
      organizationId: 'org-1',
      completedAt: new Date(),
      user: {
        name: 'Staff User',
        email: 'staff@test.com',
      },
      task: {
        title: 'Vacuum pool',
        frequency: 'Weekly',
      },
    };

    mockPrisma.cleaningLog.create.mockResolvedValue(mockLog);

    const request = new NextRequest(
      'http://localhost:3000/api/cleaning/tasks/task-1/complete',
      { method: 'POST' }
    );

    const response = await POST(request, { params: Promise.resolve({ id: 'task-1' }) });
    const json = await response.json();
    
    expect(json.log.user).toBeDefined();
    expect(json.log.user.name).toBe('Staff User');
    expect(json.log.task).toBeDefined();
    expect(json.log.task.title).toBe('Vacuum pool');
    expect(json.log.task.frequency).toBe('Weekly');
  });
});
