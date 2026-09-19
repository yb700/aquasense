import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH, DELETE } from './route';
import { NextRequest } from 'next/server';

/**
 * Unit Tests for Incident Detail API Route
 * 
 * Tests incident detail, update, and delete endpoints to verify:
 * - Locked incidents cannot be modified or deleted
 * - Authentication is required
 * - Organization isolation is enforced
 * - Only accessible to same organization
 * 
 * Requirements:
 * - 7.5: Prevent modifications to locked incidents
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
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockGetSession = vi.mocked((await import('@/lib/session')).getSession);
const mockPrisma = vi.mocked((await import('@/lib/prisma')).prisma);

describe('GET /api/incidents/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1');
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await GET(request, { params });
    expect(response.status).toBe(401);
  });

  it('should return incident for authenticated user in same organization', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    const mockIncident = {
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
      user: {
        id: 'user-1',
        name: 'Staff User',
        email: 'staff@test.com',
      },
    };

    mockPrisma.incident.findFirst.mockResolvedValue(mockIncident);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1');
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await GET(request, { params });
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.incident).toBeDefined();
    expect(json.incident.id).toBe('incident-1');
  });

  it('should return 404 if incident not found', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.incident.findFirst.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-999');
    const params = Promise.resolve({ id: 'incident-999' });

    const response = await GET(request, { params });
    expect(response.status).toBe(404);
  });
});

describe('PATCH /api/incidents/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(401);
  });

  it('should update unlocked incident', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Original Title',
      description: 'Original Description',
      severity: 'LOW',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedIncident = {
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Updated Title',
      description: 'Original Description',
      severity: 'LOW',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Staff User',
        email: 'staff@test.com',
      },
    };

    mockPrisma.incident.update.mockResolvedValue(updatedIncident);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.incident).toBeDefined();
    expect(json.incident.title).toBe('Updated Title');
  });

  it('should return 400 when trying to update locked incident', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Locked Incident',
      description: 'Description',
      severity: 'HIGH',
      status: 'OPEN',
      locked: true,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(400);
    
    const json = await response.json();
    expect(json.error).toContain('locked');
  });

  it('should return 404 for incident from different organization', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-2',
      organizationId: 'org-2', // Different organization
      title: 'Other Org Incident',
      description: 'Description',
      severity: 'LOW',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(404);
  });

  it('should update multiple fields at once', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Original Title',
      description: 'Original Description',
      severity: 'LOW',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedIncident = {
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Updated Title',
      description: 'Updated Description',
      severity: 'HIGH',
      status: 'CLOSED',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Manager User',
        email: 'manager@test.com',
      },
    };

    mockPrisma.incident.update.mockResolvedValue(updatedIncident);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'PATCH',
      body: JSON.stringify({
        title: 'Updated Title',
        description: 'Updated Description',
        severity: 'HIGH',
        status: 'CLOSED',
      }),
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await PATCH(request, { params });
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.incident.title).toBe('Updated Title');
    expect(json.incident.severity).toBe('HIGH');
    expect(json.incident.status).toBe('CLOSED');
  });
});

describe('DELETE /api/incidents/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await DELETE(request, { params });
    expect(response.status).toBe(401);
  });

  it('should delete unlocked incident', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Test Incident',
      description: 'Description',
      severity: 'LOW',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockPrisma.incident.delete.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Test Incident',
      description: 'Description',
      severity: 'LOW',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await DELETE(request, { params });
    expect(response.status).toBe(200);
    
    const json = await response.json();
    expect(json.message).toBeDefined();
    expect(mockPrisma.incident.delete).toHaveBeenCalledWith({
      where: { id: 'incident-1' },
    });
  });

  it('should return 400 when trying to delete locked incident', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'MANAGER',
      name: 'Manager User',
      email: 'manager@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-1',
      organizationId: 'org-1',
      title: 'Locked Incident',
      description: 'Description',
      severity: 'HIGH',
      status: 'OPEN',
      locked: true,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await DELETE(request, { params });
    expect(response.status).toBe(400);
    
    const json = await response.json();
    expect(json.error).toContain('locked');
  });

  it('should return 404 if incident not found', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-999', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'incident-999' });

    const response = await DELETE(request, { params });
    expect(response.status).toBe(404);
  });

  it('should return 404 for incident from different organization', async () => {
    mockGetSession.mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Staff User',
      email: 'staff@test.com',
    });

    mockPrisma.incident.findUnique.mockResolvedValue({
      id: 'incident-1',
      userId: 'user-2',
      organizationId: 'org-2', // Different organization
      title: 'Other Org Incident',
      description: 'Description',
      severity: 'LOW',
      status: 'OPEN',
      locked: false,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/incidents/incident-1', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'incident-1' });

    const response = await DELETE(request, { params });
    expect(response.status).toBe(404);
  });
});
