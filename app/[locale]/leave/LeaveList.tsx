'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

/**
 * Leave Request List Component (Client Component)
 * 
 * Displays leave requests in a list/card format with:
 * - Leave type, date range, status
 * - Reason for leave
 * - Requester name (for managers)
 * - Approve and reject buttons (Manager only, for pending requests)
 * 
 * Features:
 * - Mobile-first responsive card layout
 * - Status badges with color coding
 * - Toast notifications for approve/reject actions
 * - Bilingual labels for types and statuses
 * 
 * Requirements:
 * - 5.2: Manager approves pending leave requests
 * - 5.3: Manager rejects pending leave requests
 * - 5.4: Display type, date range, status, reason
 * - 5.6: Support PENDING, APPROVED, REJECTED statuses
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels
 */

interface LeaveRequest {
  id: string;
  userId: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface LeaveListProps {
  leaveRequests: LeaveRequest[];
  isManager: boolean;
}

export function LeaveList({ leaveRequests, isManager }: LeaveListProps) {
  const router = useRouter();
  const t = useTranslations('leave');
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  /**
   * Handle approve/reject action
   * - Calls PATCH /api/leave/[id] with new status
   * - Displays toast and refreshes on success
   */
  const handleStatusUpdate = async (leaveRequestId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const actionText = newStatus === 'APPROVED' ? 'approve' : 'reject';
    
    if (!confirm(`Are you sure you want to ${actionText} this leave request?`)) {
      return;
    }

    setProcessingId(leaveRequestId);

    try {
      const response = await fetch(`/api/leave/${leaveRequestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || `Failed to ${actionText} leave request`,
        });
        return;
      }

      toast({
        title: `Leave request ${newStatus.toLowerCase()}`,
        description: `The leave request has been ${newStatus.toLowerCase()} successfully`,
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Update leave request error:', error);
    } finally {
      setProcessingId(null);
    }
  };

  /**
   * Get badge variant for status
   */
  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  /**
   * Get badge variant for leave type
   */
  const getTypeBadgeVariant = (type: string): 'default' | 'outline' => {
    return type === 'SICK' ? 'default' : 'outline';
  };

  if (leaveRequests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('noRequests')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leaveRequests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                  {isManager && <span>{request.user.name}</span>}
                  <Badge variant={getTypeBadgeVariant(request.type)}>
                    {request.type === 'SICK' ? t('sick') : t('vacation')}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status === 'PENDING' && t('pending')}
                    {request.status === 'APPROVED' && t('approved')}
                    {request.status === 'REJECTED' && t('rejected')}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {format(request.startDate, 'MMM d, yyyy')} - {format(request.endDate, 'MMM d, yyyy')}
                </CardDescription>
              </div>
              
              {/* Manager Actions - Only for pending requests */}
              {isManager && request.status === 'PENDING' && (
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-9"
                    onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                    disabled={processingId === request.id}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {t('approve')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-9"
                    onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                    disabled={processingId === request.id}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t('reject')}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          {/* Reason */}
          <CardContent className="pt-0">
            <div>
              <p className="text-sm font-medium mb-1">{t('reason')}:</p>
              <p className="text-sm text-muted-foreground">
                {request.reason}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
