import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Apply mocks first (hoisted)
vi.mock('@/lib/prisma', () => ({
  prisma: {
    clockEntry: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

// Import after mocks are defined
import { POST } from './route';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

describe('POST /api/clock/in', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock implementations
    vi.mocked(getSession).mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: 'STAFF',
      name: 'Test User',
      email: 'test@example.com',
    });
    vi.mocked(prisma.clockEntry.findFirst).mockResolvedValue(null);
  });

  it('should create a clock entry with GPS coordinates', async () => {
    vi.mocked(prisma.clockEntry.create).mockResolvedValue({
      id: 'clock-1',
      userId: 'user-1',
      organizationId: 'org-1',
      clockInTime: new Date(),
      clockOutTime: null,
      clockInLat: 55.6761,
      clockInLng: 12.5683,
      clockOutLat: null,
      clockOutLng: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
    } as any);

    const request = new NextRequest('http://localhost:3000/api/clock/in', {
      method: 'POST',
      body: JSON.stringify({
        latitude: 55.6761,
        longitude: 12.5683,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.clockEntry).toBeDefined();
    expect(data.clockEntry.clockInLat).toBe(55.6761);
    expect(data.clockEntry.clockInLng).toBe(12.5683);
  });

  it('should create a clock entry without GPS coordinates', async () => {
    vi.mocked(prisma.clockEntry.create).mockResolvedValue({
      id: 'clock-1',
      userId: 'user-1',
      organizationId: 'org-1',
      clockInTime: new Date(),
      clockOutTime: null,
      clockInLat: null,
      clockInLng: null,
      clockOutLat: null,
      clockOutLng: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
    } as any);

    const request = new NextRequest('http://localhost:3000/api/clock/in', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.clockEntry).toBeDefined();
  });

  it('should reject if user is not authenticated', async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/clock/in', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
  });

  it('should reject if user already has an active clock session', async () => {
    vi.mocked(prisma.clockEntry.findFirst).mockResolvedValue({
      id: 'existing-clock',
      userId: 'user-1',
      organizationId: 'org-1',
      clockInTime: new Date(),
      clockOutTime: null,
      clockInLat: null,
      clockInLng: null,
      clockOutLat: null,
      clockOutLng: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/clock/in', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('already have an active clock session');
  });
});
