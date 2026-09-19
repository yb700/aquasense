import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';

/**
 * Unit Tests for Cleaning Tasks API Route
 * 
 * Tests cleaning task creation and listing endpoints to verify:
 * - Manager can create cleaning tasks
 * - Staff cannot create cleaning tasks
 * - Authentication is required
 * - Organization isolation is enforced
 * - Tasks returned with most recent completion log
 * 
 * Requirements:
 * - 8.1: Manager creates cleaning task with title and frequency
 * - 8.3: Display task with most recent completion timestamp
 * - 2.1: Manager authorization for task creation
 * - 3.5, 3.6: Multi-tenant data isolation
 * - 15.6: Cleaning task API endpoints
 */

// Mock dependencies
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    cleaningTask: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const mockGetSession = vi.mocked((await import('@/lib/session')).getSession);
const mockPrisma = vi.mocked((await import('@/lib/prisma')).prisma);

describe('POST /api/cleaning/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Clean pool filters',
        frequency: 'Daily',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    
    const json = await response.json();
    expect(json.error).toBe('Authentication required');
  });

  it('should return 403 if user is not a manager', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Clean pool filters',
        frequency: 'Daily',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    
    const json = await response.json();
    expect(json.error).toBe('Only managers can create cleaning tasks');
  });

  it('should create cleaning task when manager provides valid data', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    const mockTask = {
      id: 'task-1',
      title: 'Clean pool filters',
      frequency: 'Daily',
      organizationId: 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.cleaningTask.create.mockResolvedValue(mockTask);

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Clean pool filters',
        frequency: 'Daily',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    
    const json = await response.json();
    expect(json.task).toBeDefined();
    expect(json.task.title).toBe('Clean pool filters');
    expect(json.task.frequency).toBe('Daily');
    expect(json.task.organizationId).toBe('org-1');
  });

  it('should return 400 if title is missing', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks', {
      method: 'POST',
      body: JSON.stringify({
        frequency: 'Daily',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const json = await response.json();
    expect(json.error).toBe('Validation error');
  });

  it('should return 400 if frequency is missing', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Clean pool filters',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const json = await response.json();
    expect(json.error).toBe('Validation error');
  });

  it('should automatically assign organization ID from session', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-2',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    const mockTask = {
      id: 'task-1',
      title: 'Test pool water',
      frequency: 'Hourly',
      organizationId: 'org-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.cleaningTask.create.mockResolvedValue(mockTask);

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test pool water',
        frequency: 'Hourly',
      }),
    });

    const response = await POST(request);
    const json = await response.json();
    
    expect(mockPrisma.cleaningTask.create).toHaveBeenCalledWith({
      data: {
        title: 'Test pool water',
        frequency: 'Hourly',
        organizationId: 'org-2',
      },
    });
    expect(json.task.organizationId).toBe('org-2');
  });
});

describe('GET /api/cleaning/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks');

    const response = await GET(request);
    expect(response.status).toBe(401);
    
    const json = await response.json();
    expect(json.error).toBe('Authentication required');
  });

  it('should return cleaning tasks for authenticated user', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const mockTasks = [
      {
        id: 'task-1',
        title: 'Clean pool filters',
        frequency: 'Daily',
        organizationId: 'org-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        logs: [],
      },
    ];

    mockPrisma.cleaningTask.findMany.mockResolvedValue(mockTasks);

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks');

    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.tasks).toBeDefined();
    expect(json.tasks).toHaveLength(1);
    expect(json.tasks[0].title).toBe('Clean pool filters');
    expect(json.tasks[0].lastCompletion).toBeNull();
  });

  it('should return tasks with most recent completion log', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const completedAt = new Date('2024-01-15T10:30:00Z');
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Clean pool filters',
        frequency: 'Daily',
        organizationId: 'org-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        logs: [
          {
            id: 'log-1',
            completedAt,
            userId: 'user-2',
            user: {
              name: 'John Doe',
            },
          },
        ],
      },
    ];

    mockPrisma.cleaningTask.findMany.mockResolvedValue(mockTasks);

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks');

    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.tasks).toBeDefined();
    expect(json.tasks[0].lastCompletion).toBeDefined();
    expect(json.tasks[0].lastCompletion.completedAt).toBe(completedAt.toISOString());
    expect(json.tasks[0].lastCompletion.completedBy).toBe('John Doe');
    expect(json.tasks[0].lastCompletion.userId).toBe('user-2');
  });

  it('should filter tasks by organization ID', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.cleaningTask.findMany.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks');
    await GET(request);

    expect(mockPrisma.cleaningTask.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
      },
      include: {
        logs: {
          orderBy: {
            completedAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            completedAt: true,
            userId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('should work for both staff and manager roles', async () => {
    // Test with MANAGER role
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.cleaningTask.findMany.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/cleaning/tasks');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
  });
});
