import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { WaterBackground } from '@/components/design-system/WaterBackground';
import { Container } from '@/components/design-system/Container';
import { ShiftForm } from './ShiftForm';
import { ShiftList } from './ShiftList';
import { CopyShiftsForm } from './CopyShiftsForm';

/**
 * Shift Management Page (Server Component)
 * 
 * Displays shifts in a calendar/list view and provides a form for managers
 * to create and edit shifts. Fetches shift data server-side using Prisma.
 * 
 * Features:
 * - Server-side data fetching for shifts (current month by default)
 * - Manager-only form for creating/editing shifts
 * - Bilingual support (Danish/English)
 * - Mobile-first responsive design with shadcn/ui Card components
 * - Date picker, time inputs, staff selector, and notes textarea
 * 
 * Requirements:
 * - 4.1: Manager creates shift with staff, date, time, notes
 * - 4.2: Store shifts with optional notes
 * - 4.3: Display shifts in list/calendar format
 * - 4.4: Manager edits shifts
 * - 4.5: Manager deletes shifts
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels and validation messages
 * 
 * @returns Shift management page with list and form
 */
export default async function ShiftsPage() {
  // Get current user session
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Get translations
  const t = await getTranslations('shifts');

  // Calculate date range for current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Fetch shifts for the current month (filtered by organization via middleware)
  const shifts = await prisma.shift.findMany({
    where: {
      organizationId: session.organizationId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
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
    orderBy: [
      { date: 'asc' },
      { startTime: 'asc' },
    ],
  });

  // Fetch all users in the organization for staff selector
  const users = await prisma.user.findMany({
    where: {
      organizationId: session.organizationId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <WaterBackground intensity="subtle" className="min-h-screen">
      <Container maxWidth="wide" className="py-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {session.role === 'MANAGER' 
              ? 'Create and manage staff shifts' 
              : 'View your assigned shifts'}
          </p>
        </div>

        {/* Manager Form - Only shown to managers */}
        {session.role === 'MANAGER' && (
          <FloatingCard hover>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{t('createShift')}</h2>
                <p className="text-sm text-muted-foreground">
                  Assign staff members to shifts with date, time, and notes
                </p>
              </div>
              <ShiftForm users={users} />
            </div>
          </FloatingCard>
        )}

        {/* Manager Form for Copying Shifts */}
        {session.role === 'MANAGER' && (
          <FloatingCard hover>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Copy Shift Plan</h2>
                <p className="text-sm text-muted-foreground">
                  Duplicate shifts from one month to another
                </p>
              </div>
              <CopyShiftsForm />
            </div>
          </FloatingCard>
        )}

        {/* Shift List */}
        <FloatingCard hover>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">
                {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {shifts.length > 0 
                  ? `${shifts.length} shift${shifts.length === 1 ? '' : 's'} scheduled`
                  : t('noShifts')}
              </p>
            </div>
            <ShiftList 
              shifts={shifts as any} 
              isManager={session.role === 'MANAGER'} 
              users={users}
              currentUserId={session.userId}
            />
          </div>
        </FloatingCard>
      </Container>
    </WaterBackground>
  );
}
