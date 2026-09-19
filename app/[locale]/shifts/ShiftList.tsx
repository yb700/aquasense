'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { useToast } from '@/hooks/use-toast';
import { ShiftForm } from './ShiftForm';
import { SwapShiftDialog } from './SwapShiftDialog';

/**
 * Shift List Component (Client Component)
 * 
 * Displays shifts in a list/card format with:
 * - Date, time range, assigned staff
 * - Optional notes
 * - Edit and delete buttons (Manager only)
 * 
 * Features:
 * - Mobile-first responsive card layout
 * - Inline editing with form modal
 * - Confirmation for delete operations
 * - Toast notifications for actions
 * 
 * Requirements:
 * - 4.3: Display shifts in list format
 * - 4.4: Manager can edit shifts
 * - 4.5: Manager can delete shifts
 * - 11.1: Mobile-first responsive layout
 * 
 * @param shifts - Array of shifts to display
 * @param isManager - Whether the current user is a manager
 * @param users - List of users for the edit form
 */

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Shift {
  id: string;
  userId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  notes: string | null;
  isRoutine: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ShiftListProps {
  shifts: Shift[];
  isManager: boolean;
  users: User[];
  currentUserId?: string;
}

export function ShiftList({ shifts, isManager, users, currentUserId }: ShiftListProps) {
  const router = useRouter();
  const t = useTranslations('shifts');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Handle shift deletion
   * - Calls DELETE /api/shifts/[id]
   * - Shows confirmation before deleting
   * - Displays toast and refreshes on success
   */
  const handleDelete = async (shiftId: string) => {
    if (!confirm('Are you sure you want to delete this shift?')) {
      return;
    }

    setDeletingId(shiftId);

    try {
      const response = await fetch(`/api/shifts/${shiftId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to delete shift',
        });
        return;
      }

      toast({
        title: 'Shift deleted',
        description: 'The shift has been deleted successfully',
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Delete shift error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Handle claiming an open shift
   */
  const handleClaimShift = async (shiftId: string) => {
    try {
      const response = await fetch('/api/shifts/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to claim shift',
        });
        return;
      }

      toast({
        title: 'Shift claimed',
        description: data.message,
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
      console.error(error);
    }
  };

  /**
   * Helper to format time from Date object
   */
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  /**
   * Group shifts by date for better organization
   */
  const groupedShifts = shifts.reduce((acc, shift) => {
    const dateKey = format(shift.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  if (shifts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('noShifts')}
      </div>
    );
  }

  // If editing a shift, show the form
  if (editingShift) {
    return (
      <FloatingCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t('editShift')}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingShift(null)}
          >
            {tCommon('cancel')}
          </Button>
        </div>
        <ShiftForm
          users={users}
          editShift={editingShift}
          onSuccess={() => {
            setEditingShift(null);
            router.refresh();
          }}
        />
      </FloatingCard>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedShifts).map(([dateKey, dateShifts]) => (
        <div key={dateKey} className="space-y-3">
          {/* Date Header */}
          <h3 className="text-lg font-semibold sticky top-0 bg-background py-2">
            {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
          </h3>

          {/* Shifts for this date */}
          <div className="space-y-2">
            {dateShifts.map((shift) => (
              <FloatingCard key={shift.id} hover className="overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold">
                        {shift.user?.name || (
                          <span className="italic text-muted-foreground">Open Shift (Unassigned)</span>
                        )}
                      </h4>
                      {shift.isRoutine && (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Routine
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    </p>
                  </div>
                  
                  {/* Manager Actions */}
                  {isManager && (
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingShift(shift)}
                        disabled={deletingId === shift.id}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t('editShift')}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(shift.id)}
                        disabled={deletingId === shift.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t('deleteShift')}</span>
                      </Button>
                    </div>
                  )}
                  {/* Staff Actions */}
                  {!isManager && shift.userId === null && (
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleClaimShift(shift.id)}
                      >
                        Claim Shift
                      </Button>
                    </div>
                  )}
                  
                  {/* Swap Shift Action */}
                  {!isManager && shift.userId === currentUserId && currentUserId && (
                    <div className="flex gap-1 shrink-0">
                      <SwapShiftDialog shiftId={shift.id} users={users} currentUserId={currentUserId} />
                    </div>
                  )}
                </div>

                {/* Notes */}
                {shift.notes && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      {shift.notes}
                    </p>
                  </div>
                )}
              </FloatingCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
