'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FloatingCard } from '@/components/design-system/FloatingCard';

/**
 * Incident Card Component (Client Component)
 * 
 * Displays a single incident card with:
 * - Title, description, severity, status, and image
 * - Lock button for managers (if not already locked)
 * - Color-coded severity badges
 * 
 * Features:
 * - Client-side lock action with API call
 * - Toast notifications for success/error
 * - Loading state during lock operation
 * - Mobile-first responsive design
 * 
 * Requirements:
 * - 7.4: Manager can lock incidents
 * - 7.6: Display incident details
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels
 * 
 * @param incident - Incident data to display
 * @param isManager - Whether current user is a manager
 */

interface IncidentCardProps {
  incident: {
    id: string;
    title: string;
    description: string;
    severity: string;
    status: string;
    imageUrl: string | null;
    locked: boolean;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  isManager: boolean;
}

export function IncidentCard({ incident, isManager }: IncidentCardProps) {
  const router = useRouter();
  const t = useTranslations('incidents');
  const { toast } = useToast();
  const [isLocking, setIsLocking] = useState(false);

  /**
   * Get badge variant based on severity level
   * - HIGH: destructive (red)
   * - MEDIUM: default (yellow/orange)
   * - LOW: secondary (gray)
   */
  const getSeverityVariant = (severity: string): 'default' | 'secondary' | 'destructive' => {
    switch (severity) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      case 'LOW':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  /**
   * Get badge variant for incident status
   * - OPEN: default
   * - CLOSED: secondary
   */
  const getStatusVariant = (status: string): 'default' | 'secondary' => {
    return status === 'OPEN' ? 'default' : 'secondary';
  };

  /**
   * Handle lock incident action
   * - Calls PATCH /api/incidents/[id]/lock endpoint
   * - Displays success/error toast
   * - Refreshes page data on success
   */
  const handleLock = async () => {
    setIsLocking(true);

    try {
      const response = await fetch(`/api/incidents/${incident.id}/lock`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to lock incident',
        });
        return;
      }

      toast({
        title: 'Incident locked',
        description: 'The incident has been reviewed and locked',
      });

      // Refresh page to show updated incident
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Lock incident error:', error);
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <FloatingCard hover className="overflow-hidden">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="space-y-1 flex-1">
            <h3 className="text-xl font-semibold">{incident.title}</h3>
            <p className="text-sm text-muted-foreground">
              Reported by {incident.user.name} on {format(new Date(incident.createdAt), 'PPP')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Severity Badge */}
            <Badge variant={getSeverityVariant(incident.severity)}>
              {t(incident.severity.toLowerCase() as 'low' | 'medium' | 'high')}
            </Badge>

            {/* Status Badge */}
            <Badge variant={getStatusVariant(incident.status)}>
              {t(incident.status.toLowerCase() as 'open' | 'closed')}
            </Badge>

            {/* Locked Badge */}
            {incident.locked && (
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" />
                {t('locked')}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {incident.description}
        </p>

        {/* Image */}
        {incident.imageUrl && (
          <div className="rounded-lg overflow-hidden border">
            <img 
              src={incident.imageUrl} 
              alt={incident.title}
              className="w-full h-auto max-h-96 object-contain bg-muted"
            />
          </div>
        )}

        {/* Manager Actions */}
        {isManager && !incident.locked && (
          <div className="pt-2 border-t">
            <Button 
              onClick={handleLock}
              variant="secondary" 
              size="sm"
              disabled={isLocking}
              className="w-full sm:w-auto"
            >
              {isLocking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Locking...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {t('lockIncident')}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </FloatingCard>
  );
}
