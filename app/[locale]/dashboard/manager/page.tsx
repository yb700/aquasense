import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Role } from '@prisma/client';
import { WaterBackground } from '@/components/design-system/WaterBackground';

/**
 * Manager Dashboard Page (Server Component)
 * 
 * Displays an overview of today's operations for managers:
 * - Today's shifts for the organization
 * - Pending leave requests
 * - Open incidents
 * - Cleaning tasks for the organization
 * 
 * Features:
 * - Server-side data fetching using Prisma date filtering
 * - Role-based access control (Manager only)
 * - Mobile-first responsive grid layout with shadcn/ui Cards
 * - Bilingual section headers and labels
 * - Data updates on page refresh
 * 
 * Requirements:
 * - 9.1: Display today's shifts for organization
 * - 9.2: Display pending leave requests for organization
 * - 9.3: Display open incidents for organization
 * - 9.4: Display cleaning tasks for organization
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels
 * 
 * @returns Manager dashboard with operational overview
 */
export default async function ManagerDashboardPage() {
  // Get current user session
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Redirect to staff dashboard if not a manager
  if (session.role !== Role.MANAGER) {
    redirect('/dashboard/staff');
  }

  // Get translations
  const tDashboard = await getTranslations('dashboard');
  const tShifts = await getTranslations('shifts');
  const tLeave = await getTranslations('leave');
  const tIncidents = await getTranslations('incidents');
  const tCleaning = await getTranslations('cleaning');

  // Calculate today's date range (start and end of day)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  // Fetch today's shifts for organization
  const todaysShifts = await prisma.shift.findMany({
    where: {
      organizationId: session.organizationId,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  // Fetch pending leave requests
  const pendingLeaveRequests = await prisma.leaveRequest.findMany({
    where: {
      organizationId: session.organizationId,
      status: 'PENDING',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch open incidents
  const openIncidents = await prisma.incident.findMany({
    where: {
      organizationId: session.organizationId,
      status: 'OPEN',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch cleaning tasks with most recent completion
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
        },
      },
    },
    orderBy: {
      title: 'asc',
    },
  });

  return (
    <WaterBackground intensity="subtle">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{tDashboard('managerDashboard')}</h1>
          <p className="text-muted-foreground">
            Overview of today&apos;s operations for {session.name}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Today's Shifts Card */}
        <FloatingCard hover>
          <CardHeader>
            <CardTitle>{tDashboard('todaysShifts')}</CardTitle>
            <CardDescription>
              {todaysShifts.length > 0
                ? `${todaysShifts.length} shift${todaysShifts.length === 1 ? '' : 's'} scheduled today`
                : 'No shifts scheduled for today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysShifts.length > 0 ? (
              <div className="space-y-4">
                {todaysShifts.map((shift) => (
                  <div key={shift.id} className="flex items-start justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {shift.user?.name || <span className="italic text-muted-foreground">Open Shift (Unassigned)</span>}
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
                  {tShifts('createShift')} →
                </Link>
              </div>
            )}
          </CardContent>
        </FloatingCard>

        {/* Pending Leave Requests Card */}
        <FloatingCard hover>
          <CardHeader>
            <CardTitle>{tDashboard('pendingLeave')}</CardTitle>
            <CardDescription>
              {pendingLeaveRequests.length > 0
                ? `${pendingLeaveRequests.length} request${pendingLeaveRequests.length === 1 ? '' : 's'} awaiting approval`
                : 'No pending leave requests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingLeaveRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingLeaveRequests.map((request) => (
                  <div key={request.id} className="flex items-start justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{request.user.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={request.type === 'SICK' ? 'destructive' : 'default'}>
                          {request.type === 'SICK' ? tLeave('sick') : tLeave('vacation')}
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
              </div>
            )}
          </CardContent>
        </FloatingCard>

        {/* Open Incidents Card */}
        <FloatingCard hover>
          <CardHeader>
            <CardTitle>{tDashboard('openIncidents')}</CardTitle>
            <CardDescription>
              {openIncidents.length > 0
                ? `${openIncidents.length} incident${openIncidents.length === 1 ? '' : 's'} requiring attention`
                : 'No open incidents'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {openIncidents.length > 0 ? (
              <div className="space-y-4">
                {openIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-start justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{incident.title}</p>
                        <Badge
                          variant={
                            incident.severity === 'HIGH'
                              ? 'destructive'
                              : incident.severity === 'MEDIUM'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {incident.severity === 'HIGH'
                            ? tIncidents('high')
                            : incident.severity === 'MEDIUM'
                            ? tIncidents('medium')
                            : tIncidents('low')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Reported by {incident.user.name} on{' '}
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Link
                  href="/incidents"
                  className="inline-block text-sm text-primary hover:underline mt-2"
                >
                  {tIncidents('title')} →
                </Link>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>{tIncidents('noIncidents')}</p>
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
                ? `${cleaningTasks.length} task${cleaningTasks.length === 1 ? '' : 's'} defined`
                : 'No cleaning tasks defined'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cleaningTasks.length > 0 ? (
              <div className="space-y-4">
                {cleaningTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {tCleaning('frequency')}: {task.frequency}
                      </p>
                      {task.logs.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {tCleaning('lastCompleted')}:{' '}
                          {new Date(task.logs[0].completedAt).toLocaleString()}
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
                <Link
                  href="/cleaning"
                  className="inline-block text-primary hover:underline mt-2"
                >
                  {tCleaning('createTask')} →
                </Link>
              </div>
            )}
          </CardContent>
        </FloatingCard>
      </div>
      </div>
    </WaterBackground>
  );
}
