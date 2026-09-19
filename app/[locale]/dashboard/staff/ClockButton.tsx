'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Clock, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

/**
 * ClockButton Component (Client Component)
 * 
 * Provides clock in/out functionality on the staff dashboard with:
 * - Clock In button when no active session
 * - Clock Out button when session is active
 * - Session start time display
 * - Optional GPS coordinate capture
 * - Optimistic UI updates for immediate feedback
 * - Design system integration
 * 
 * Features:
 * - Requests browser geolocation for GPS tracking
 * - Displays loading states during API calls
 * - Shows success/error toast notifications
 * - Mobile-first responsive design with 44x44px touch targets
 * - Bilingual button labels and status messages
 * - Refreshes page data after successful clock operations
 * - Premium depth effects consistent with design system
 * 
 * Requirements:
 * - 6.1: Clock in with current timestamp and optional GPS
 * - 6.2: Clock out with current timestamp and optional GPS
 * - 6.3: Display Clock In button when no active session
 * - 6.4: Display Clock Out button and session start time when active
 * - 6.5: Store GPS coordinates if available
 * - 6.6: Create entries without location data if GPS unavailable
 * - 10.4: Display clock in/out button on staff dashboard
 * - 11.1: Mobile-first responsive layout
 * - 11.2: Touch targets at least 44x44 pixels
 * - 12.3: Bilingual labels and messages
 * - 28.1: Prominent clock button with design system styling
 * - 28.2: Active session indicator with visual styling
 */

interface ClockEntry {
  id: string;
  userId: string;
  organizationId: string;
  clockInTime: string;
  clockOutTime: string | null;
  clockInLat: number | null;
  clockInLng: number | null;
  clockOutLat: number | null;
  clockOutLng: number | null;
}

interface ClockButtonProps {
  activeSession: ClockEntry | null;
}

export function ClockButton({ activeSession: initialSession }: ClockButtonProps) {
  const t = useTranslations('clock');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  const router = useRouter();

  const [activeSession, setActiveSession] = useState<ClockEntry | null>(initialSession);
  const [isOperating, setIsOperating] = useState(false);

  /**
   * Get current GPS coordinates
   */
  const getCoordinates = async (): Promise<{ latitude: number; longitude: number } | null> => {
    if (!('geolocation' in navigator)) {
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Silently fail if GPS is not available or denied
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 0,
        }
      );
    });
  };

  /**
   * Handle clock in operation
   */
  const handleClockIn = async () => {
    setIsOperating(true);

    // Optimistic update: immediately show as clocked in
    const optimisticEntry: ClockEntry = {
      id: 'temp',
      userId: 'temp',
      organizationId: 'temp',
      clockInTime: new Date().toISOString(),
      clockOutTime: null,
      clockInLat: null,
      clockInLng: null,
      clockOutLat: null,
      clockOutLng: null,
    };
    setActiveSession(optimisticEntry);

    try {
      // Get GPS coordinates
      const coordinates = await getCoordinates();

      const response = await fetch('/api/clock/in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: coordinates?.latitude ?? null,
          longitude: coordinates?.longitude ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update
        setActiveSession(null);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to clock in',
        });
        return;
      }

      // Update with actual session data
      setActiveSession(data.clockEntry);
      toast({
        title: t('clockInSuccess'),
        description: coordinates ? 'Location recorded' : 'Location not available',
      });

      // Refresh the page to update all data
      router.refresh();
    } catch (error) {
      // Revert optimistic update
      setActiveSession(null);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Clock in error:', error);
    } finally {
      setIsOperating(false);
    }
  };

  /**
   * Handle clock out operation
   */
  const handleClockOut = async () => {
    setIsOperating(true);

    // Store current session for potential rollback
    const previousSession = activeSession;

    // Optimistic update: immediately show as clocked out
    setActiveSession(null);

    try {
      // Get GPS coordinates
      const coordinates = await getCoordinates();

      const response = await fetch('/api/clock/out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: coordinates?.latitude ?? null,
          longitude: coordinates?.longitude ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update
        setActiveSession(previousSession);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to clock out',
        });
        return;
      }

      toast({
        title: t('clockOutSuccess'),
        description: coordinates ? 'Location recorded' : 'Location not available',
      });

      // Refresh the page to update all data
      router.refresh();
    } catch (error) {
      // Revert optimistic update
      setActiveSession(previousSession);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Clock out error:', error);
    } finally {
      setIsOperating(false);
    }
  };

  return (
    <div className="space-y-4">
      {activeSession ? (
        <>
          {/* Active Session Info */}
          <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-lg space-y-3 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('sessionStart')}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Active
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              {format(new Date(activeSession.clockInTime), 'HH:mm:ss')}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(activeSession.clockInTime), 'PPP')}
            </p>
            {activeSession.clockInLat && activeSession.clockInLng && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Location recorded
              </p>
            )}
          </div>

          {/* Clock Out Button */}
          <Button
            onClick={handleClockOut}
            disabled={isOperating}
            variant="destructive"
            className="w-full min-h-[56px] text-lg font-semibold"
            size="lg"
          >
            {isOperating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {tCommon('loading')}
              </>
            ) : (
              <>
                <Clock className="mr-2 h-5 w-5" />
                {t('clockOut')}
              </>
            )}
          </Button>
        </>
      ) : (
        <>
          {/* No Active Session */}
          <div className="p-6 bg-muted/50 rounded-lg text-center space-y-3">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t('noActiveSession')}</p>
          </div>

          {/* Clock In Button */}
          <Button
            onClick={handleClockIn}
            disabled={isOperating}
            variant="primary"
            className="w-full min-h-[56px] text-lg font-semibold"
            size="lg"
          >
            {isOperating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {tCommon('loading')}
              </>
            ) : (
              <>
                <Clock className="mr-2 h-5 w-5" />
                {t('clockIn')}
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
