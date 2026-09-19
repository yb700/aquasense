import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaveForm } from './LeaveForm';
import { LeaveList } from './LeaveList';

/**
 * Leave Request Management Page (Server Component)
 * 
 * Displays leave requests in a list view and provides a form for staff and managers
 * to create leave requests. Managers can also approve/reject requests.
 * Fetches leave request data server-side using Prisma.
 * 
 * Features:
 * - Server-side data fetching for leave requests
 * - Form for creating leave requests (Staff and Manager)
 * - Approve/reject buttons for Manager role
 * - Bilingual support (Danish/English)
 * - Mobile-first responsive design with shadcn/ui Card components
 * - Date range picker, type selector, and reason textarea
 * 
 * Requirements:
 * - 5.1: Staff creates leave request with type, dates, reason
 * - 5.2: Manager approves pending leave requests
 * - 5.3: Manager rejects pending leave requests
 * - 5.4: Display leave requests with type, date range, status, reason
 * - 5.5: Support leave types SICK and VACATION
 * - 5.6: Support statuses PENDING, APPROVED, REJECTED
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels and validation messages
 * 
 * @returns Leave request management page with list and form
 */
export default async function LeavePage() {
  // Get current user session
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Get translations
  const t = await getTranslations('leave');

  // Fetch leave requests (filtered by organization)
  // Managers see all leave requests, Staff see only their own
  const leaveRequests = await prisma.leaveRequest.findMany({
    where: {
      organizationId: session.organizationId,
      ...(session.role === 'STAFF' && { userId: session.userId }),
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
    orderBy: [
      { status: 'asc' }, // PENDING first
      { startDate: 'desc' },
    ],
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {session.role === 'MANAGER' 
            ? 'Manage staff leave requests and create your own' 
            : 'Submit and track your leave requests'}
        </p>
      </div>

      {/* Leave Request Form - Available to all users */}
      <Card>
        <CardHeader>
          <CardTitle>{t('createRequest')}</CardTitle>
          <CardDescription>
            Request time off for sick leave or vacation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaveForm />
        </CardContent>
      </Card>

      {/* Leave Request List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {session.role === 'MANAGER' ? 'All Leave Requests' : 'Your Leave Requests'}
          </CardTitle>
          <CardDescription>
            {leaveRequests.length > 0 
              ? `${leaveRequests.length} request${leaveRequests.length === 1 ? '' : 's'}`
              : t('noRequests')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaveList 
            leaveRequests={leaveRequests} 
            isManager={session.role === 'MANAGER'} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
