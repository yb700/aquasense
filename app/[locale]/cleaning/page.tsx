import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { WaterBackground } from '@/components/design-system/WaterBackground';
import { CleaningTaskForm } from './CleaningTaskForm';
import { CleaningTaskList } from './CleaningTaskList';

/**
 * Cleaning Tasks Page (Server Component)
 * 
 * Displays cleaning tasks with last completion timestamp and provides:
 * - Task list with title, frequency, and last completed time
 * - "Mark Complete" button for Staff and Manager
 * - Task creation form for Manager role
 * - Bilingual labels for frequency and completion status
 * 
 * Features:
 * - Server-side data fetching for cleaning tasks
 * - Manager-only form for creating tasks
 * - Staff and Manager can mark tasks as complete
 * - Bilingual support (Danish/English)
 * - Mobile-first responsive design
 * 
 * Requirements:
 * - 8.1: Manager creates cleaning task with title and frequency
 * - 8.2: Staff marks task as completed, creates log entry
 * - 8.3: Display task title, frequency, and most recent completion timestamp
 * - 8.4: Store frequency as text without automated scheduling
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels
 * 
 * @returns Cleaning tasks page with list and form
 */
export default async function CleaningPage() {
  // Get current user session
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Get translations
  const t = await getTranslations('cleaning');

  // Fetch cleaning tasks with most recent completion log (filtered by organization)
  const tasks = await prisma.cleaningTask.findMany({
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

  // Transform data to include most recent completion info at the top level
  const tasksWithCompletion = tasks.map(task => ({
    id: task.id,
    title: task.title,
    frequency: task.frequency,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    lastCompletion: task.logs.length > 0 ? {
      completedAt: task.logs[0].completedAt,
      completedBy: task.logs[0].user.name,
      userId: task.logs[0].userId,
    } : null,
  }));

  return (
    <WaterBackground variant="light" intensity="subtle">
      <div className="container mx-auto px-4 py-6 space-y-6 min-h-screen">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {session.role === 'MANAGER' 
              ? 'Create and manage cleaning tasks' 
              : 'View and complete cleaning tasks'}
          </p>
        </div>

        {/* Manager Form - Only shown to managers */}
        {session.role === 'MANAGER' && (
          <FloatingCard>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{t('createTask')}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Define recurring cleaning tasks with title and frequency
                </p>
              </div>
              <CleaningTaskForm />
            </div>
          </FloatingCard>
        )}

        {/* Cleaning Task List */}
        <FloatingCard>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{t('title')}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {tasksWithCompletion.length > 0 
                  ? `${tasksWithCompletion.length} task${tasksWithCompletion.length === 1 ? '' : 's'}`
                  : t('noTasks')}
              </p>
            </div>
            <CleaningTaskList 
              tasks={tasksWithCompletion}
            />
          </div>
        </FloatingCard>
      </div>
    </WaterBackground>
  );
}
