'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

/**
 * Cleaning Task List Component (Client Component)
 * 
 * Displays list of cleaning tasks with:
 * - Task title and frequency
 * - Last completion timestamp and who completed it
 * - "Mark Complete" button for Staff and Manager
 * 
 * Features:
 * - Bilingual labels and date formatting
 * - Optimistic UI updates for completion
 * - Mobile-first responsive design
 * - Toast notifications for success/error
 * 
 * Requirements:
 * - 8.2: Staff marks task as completed
 * - 8.3: Display task title, frequency, and most recent completion timestamp
 * - 11.1: Mobile-first responsive layout
 * - 11.2: Touch targets at least 44x44 pixels
 * - 12.3: Bilingual labels and date formatting
 */

interface CleaningTask {
  id: string;
  title: string;
  frequency: string;
  createdAt: Date;
  updatedAt: Date;
  lastCompletion: {
    completedAt: Date;
    completedBy: string;
    userId: string;
  } | null;
}

interface CleaningTaskListProps {
  tasks: CleaningTask[];
}

export function CleaningTaskList({ tasks }: CleaningTaskListProps) {
  const router = useRouter();
  const t = useTranslations('cleaning');
  const { toast } = useToast();
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  /**
   * Handle marking a task as complete
   * - Calls /api/cleaning/tasks/[id]/complete endpoint (POST)
   * - Displays success/error toast
   * - Refreshes page data on success
   */
  const handleMarkComplete = async (taskId: string) => {
    setLoadingTaskId(taskId);

    try {
      const response = await fetch(`/api/cleaning/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to mark task as complete',
        });
        return;
      }

      // Display success toast
      toast({
        title: 'Task completed',
        description: 'The cleaning task has been marked as complete',
      });

      // Refresh page data
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Mark complete error:', error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>{t('noTasks')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <FloatingCard key={task.id} hover>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Task Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {t('frequency')}: {task.frequency}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Last Completion Info */}
              {task.lastCompletion ? (
                <div className="pl-7 text-sm text-muted-foreground">
                  <p>
                    {t('lastCompleted')}:{' '}
                    <span className="font-medium">
                      {format(new Date(task.lastCompletion.completedAt), 'PPp')}
                    </span>
                  </p>
                  <p>
                    {t('completedBy')}:{' '}
                    <span className="font-medium">
                      {task.lastCompletion.completedBy}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="pl-7 text-sm text-muted-foreground">
                  <p>{t('lastCompleted')}: Never</p>
                </div>
              )}
            </div>

            {/* Mark Complete Button */}
            <Button
              onClick={() => handleMarkComplete(task.id)}
              disabled={loadingTaskId === task.id}
              className="h-11 w-full sm:w-auto"
              variant="primary"
            >
              {loadingTaskId === task.id ? 'Completing...' : t('markComplete')}
            </Button>
          </div>
        </FloatingCard>
      ))}
    </div>
  );
}
