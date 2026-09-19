import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Role } from '@prisma/client';
import { ClockButton } from './ClockButton';
import { WaterBackground } from '@/components/design-system/WaterBackground';

/**
 * Staff Dashboard Page (Server Component)
 * 
 * Displays an overview of staff member's assigned work and tasks:
 * - User's assigned shifts
 * - User's leave requests with current status
 * - Cleaning tasks for the organization
 * - Clock in/out button with current session status
 * 
 * Features:
 * - Server-side data fetching using Prisma with userId filtering
 * - Role-based access control (Staff only)
 * - Mobile-first responsive grid layout with shadcn/ui Cards
 * - Bilingual section headers and labels
 * - Data updates on page refresh
 * - Clock button component for time tracking
 * 
 * Requirements:
 * - 10.1: Display user's assigned shifts
 * - 10.2: Display user's leave requests with status
 * - 10.3: Display cleaning tasks for organization
 * - 10.4: Display clock in/out button with session status
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels
 * 
 * @returns Staff dashboard with assigned work overview
 */
export default async function StaffDashboardPage() {
  // Get current user session
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Redirect to manager dashboard if not a staff member
  if (session.role !== Role.STAFF) {
    redirect('/dashboard/manager');
  }

  // Get translations
  const tDashboard = await getTranslations('dashboard');
  const tShifts = await getTranslations('shifts');
  const tLeave = await getTranslations('leave');
  const tCleaning = await getTranslations('cleaning');

  // Calculate upcoming date range (today and next 7 days)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Fetch user's assigned shifts (upcoming)
  const userShifts = await prisma.shift.findMany({
    where: {
      userId: session.userId,
      organizationId: session.organizationId,
      date: {
        gte: today,
        lte: nextWeek,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Fetch user's leave requests
  const userLeaveRequests = await prisma.leaveRequest.findMany({
    where: {
      userId: session.userId,
      organizationId: session.organizationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10, // Show last 10 requests
  });

  // Fetch cleaning tasks for organization with most recent completion
  const cleaningTasks = await prisma.cleaningTask.findMany({
    where: {
      organizationId: session.organizationId,
    },
    include: {
      logs: {
        orderBy: {
          completedAt: 'desc',
        },
        take: 1,
        select: {
          completedAt: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      title: 'asc',
    },
  });

  // Fetch user's current clock session status
  const activeClockSessionRaw = await prisma.clockEntry.findFirst({
    where: {
      userId: session.userId,
      organizationId: session.organizationId,
      clockOutTime: null,
    },
  });

  // Serialize the clock session for client component
  const activeClockSession = activeClockSessionRaw
    ? {
        id: activeClockSessionRaw.id,
        userId: activeClockSessionRaw.userId,
        organizationId: activeClockSessionRaw.organizationId,
        clockInTime: activeClockSessionRaw.clockInTime.toISOString(),
        clockOutTime: activeClockSessionRaw.clockOutTime?.toISOString() ?? null,
        clockInLat: activeClockSessionRaw.clockInLat,
        clockInLng: activeClockSessionRaw.clockInLng,
        clockOutLat: activeClockSessionRaw.clockOutLat,
        clockOutLng: activeClockSessionRaw.clockOutLng,
      }
    : null;

  return (
    <WaterBackground intensity="subtle">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{tDashboard('staffDashboard')}</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.name}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Clock In/Out Card */}
        <FloatingCard hover>
          <CardHeader>
            <CardTitle>{tDashboard('clockInOut')}</CardTitle>
            <CardDescription>
              {activeClockSession
                ? `Session started at ${new Date(activeClockSession.clockInTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'No active session'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClockButton activeSession={activeClockSession} />
          </CardContent>
        </FloatingCard>

        {/* My Shifts Card */}
        <FloatingCard hover>
          <CardHeader>
            <CardTitle>{tDashboard('myShifts')}</CardTitle>
            <CardDescription>
              {userShifts.length > 0
                ? `${userShifts.length} upcoming shift${userShifts.length === 1 ? '' : 's'} this week`
                : 'No upcoming shifts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userShifts.length > 0 ? (
              <div className="space-y-4">
                {userShifts.map((shift) => (
                  <div key={shift.id} className="flex items-start justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {new Date(shift.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(shift.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(shift.endTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {shift.notes && (
                        <p className="text-sm text-muted-foreground italic">{shift.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
                <Link
                  href="/shifts"
                  className="inline-block text-sm text-primary hover:underline mt-2"
                >
                  {tShifts('title')} →
                </Link>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>{tShifts('noShifts')}</p>
                <Link
                  href="/shifts"
                  className="inline-block text-primary hover:underline mt-2"
                >
                  View all shifts →
                </Link>
              </div>
            )}
          </CardContent>
        </FloatingCard>

        {/* My Leave Requests Card */}
        <FloatingCard hover>
          <CardHeader>
            <CardTitle>{tDashboard('myLeaveRequests')}</CardTitle>
            <CardDescription>
              {userLeaveRequests.length > 0
                ? `${userLeaveRequests.length} request${userLeaveRequests.length === 1 ? '' : 's'}`
                : 'No leave requests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userLeaveRequests.length > 0 ? (
              <div className="space-y-4">
                {userLeaveRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-start justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={request.type === 'SICK' ? 'destructive' : 'default'}>
                          {request.type === 'SICK' ? tLeave('sick') : tLeave('vacation')}
                        </Badge>
                        <Badge
                          variant={
                            request.status === 'APPROVED'
                              ? 'default'
                              : request.status === 'REJECTED'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {request.status === 'PENDING'
                            ? tLeave('pending')
                            : request.status === 'APPROVED'
                            ? tLeave('approved')
                            : tLeave('rejected')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString()} -{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                  </div>
                ))}
                <Link
                  href="/leave"
                  className="inline-block text-sm text-primary hover:underline mt-2"
                >
                  {tLeave('title')} →
                </Link>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>{tLeave('noRequests')}</p>
                <Link
                  href="/leave"
                  className="inline-block text-primary hover:underline mt-2"
                >
                  {tLeave('createRequest')} →
                </Link>
              </div>
            )}
          </CardContent>
        </FloatingCard>

        {/* Cleaning Tasks Card */}
        <FloatingCard hover>
          <CardHeader>
            <CardTitle>{tDashboard('cleaningTasks')}</CardTitle>
            <CardDescription>
              {cleaningTasks.length > 0
                ? `${cleaningTasks.length} task${cleaningTasks.length === 1 ? '' : 's'} available`
                : 'No cleaning tasks'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cleaningTasks.length > 0 ? (
              <div className="space-y-4">
                {cleaningTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {tCleaning('frequency')}: {task.frequency}
                      </p>
                      {task.logs.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {tCleaning('lastCompleted')}:{' '}
                          {new Date(task.logs[0].completedAt).toLocaleString()} by{' '}
                          {task.logs[0].user.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <Link
                  href="/cleaning"
                  className="inline-block text-sm text-primary hover:underline mt-2"
                >
                  {tCleaning('title')} →
                </Link>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>{tCleaning('noTasks')}</p>
              </div>
            )}
          </CardContent>
        </FloatingCard>
      </div>
      </div>
    </WaterBackground>
  );
}
