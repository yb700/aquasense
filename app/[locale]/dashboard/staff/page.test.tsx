import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

// Mock dependencies
vi.mock('@/lib/session');
vi.mock('@/lib/prisma', () => ({
  prisma: {
    shift: { findMany: vi.fn() },
    leaveRequest: { findMany: vi.fn() },
    cleaningTask: { findMany: vi.fn() },
    clockEntry: { findFirst: vi.fn() },
  },
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

describe('Staff Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login if no session', async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    // Dynamic import to trigger server component
    const { default: StaffDashboardPage } = await import('./page');
    
    try {
      await StaffDashboardPage();
    } catch (e) {
      // redirect throws an error that Next.js catches
    }

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to manager dashboard if user is a manager', async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: 'user-1',
      organizationId: 'org-1',
      role: Role.MANAGER,
      name: 'Manager Name',
      email: 'manager@test.com',
    });

    const { default: StaffDashboardPage } = await import('./page');
    
    try {
      await StaffDashboardPage();
    } catch (e) {
      // redirect throws an error that Next.js catches
    }

    expect(redirect).toHaveBeenCalledWith('/dashboard/manager');
  });

  it('fetches user-specific data for staff members', async () => {
    const mockSession = {
      userId: 'user-1',
      organizationId: 'org-1',
      role: Role.STAFF,
      name: 'Staff Name',
      email: 'staff@test.com',
    };

    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(prisma.shift.findMany).mockResolvedValue([]);
    vi.mocked(prisma.leaveRequest.findMany).mockResolvedValue([]);
    vi.mocked(prisma.cleaningTask.findMany).mockResolvedValue([]);
    vi.mocked(prisma.clockEntry.findFirst).mockResolvedValue(null);

    const { default: StaffDashboardPage } = await import('./page');
    
    // Render the component
    await StaffDashboardPage();

    // Verify data fetching with user filters
    expect(prisma.shift.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: mockSession.userId,
          organizationId: mockSession.organizationId,
        }),
      })
    );

    expect(prisma.leaveRequest.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: mockSession.userId,
          organizationId: mockSession.organizationId,
        }),
      })
    );

    expect(prisma.cleaningTask.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          organizationId: mockSession.organizationId,
        }),
      })
    );

    expect(prisma.clockEntry.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: mockSession.userId,
          organizationId: mockSession.organizationId,
          clockOutTime: null,
        }),
      })
    );
  });
});
