import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import { NextRequest } from 'next/server';

/**
 * Unit Tests for Incident Lock API Route
 * 
 * Tests incident locking endpoint to verify:
 * - Only managers can lock incidents
 * - Staff cannot lock incidents
 * - Locked incidents cannot be locked again
 * - Authentication is required
 * - Organization isolation is enforced
 * 
 * Requirements:
 * - 7.4: Manager can lock incidents
 * - 2.6: Staff cannot lock incidents
 * - 3.4: Multi-tenant data isolation
 */

// Mock dependencies
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    incident: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const mockGetSession = vi.mocked((await import('@/lib/session')).getSession);
const mockPrisma = vi.mocked((await import('@/lib/prisma')).prisma);

describe('PATCH /api/incidents/[id]/lock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1/lock', {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
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

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1/lock', {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(403);
    
    const json = await response.json();
    expect(json.error).toContain('Only managers');
  });

  it('should lock incident when manager provides valid request', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Test Incident',
      description: 'Description',
      severity: 'HIGH',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const lockedIncident = {
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Test Incident',
      description: 'Description',
      severity: 'HIGH',
      status: 'OPEN',
      locked: true,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Staff User',
        email: 'staff@test.com',
      },
    };

    mockPrisma.incident.update.mockResolvedValue(lockedIncident);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1/lock', {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.incident).toBeDefined();
    expect(json.incident.locked).toBe(true);
    expect(mockPrisma.incident.update).toHaveBeenCalledWith({
      where: { id: 'incident-1' },
      data: { locked: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  });

  it('should return 400 if incident is already locked', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Test Incident',
      description: 'Description',
      severity: 'HIGH',
      status: 'OPEN',
      locked: true, // Already locked
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1/lock', {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(400);
    
    const json = await response.json();
    expect(json.error).toContain('already locked');
  });

  it('should return 404 if incident not found', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-999/lock', {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: 'incident-999' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(404);
  });

  it('should return 404 for incident from different organization', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'manager-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-2',
      organizationId: 'org-2', // Different organization
      title: 'Test Incident',
      description: 'Description',
      severity: 'HIGH',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1/lock', {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(404);
  });
});
