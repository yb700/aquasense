'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Clock, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { WaterBackground } from '@/components/design-system/WaterBackground';
import { Container } from '@/components/design-system/Container';

/**
 * Clock In/Out Page (Client Component)
 * 
 * Provides time tracking functionality with:
 * - Clock In button when no active session
 * - Clock Out button when session is active
 * - Session start time display
 * - Optional GPS coordinate capture
 * - Optimistic UI updates for immediate feedback
 * - Design system integration with FloatingCard and WaterBackground
 * 
 * Features:
 * - Requests browser geolocation permission on mount
 * - Displays loading states during API calls
 * - Shows success/error toast notifications
 * - Mobile-first responsive design
 * - Bilingual button labels and status messages
 * - Premium depth effects with FloatingCard
 * - Water-inspired background
 * 
 * Requirements:
 * - 6.1: Clock in with current timestamp and optional GPS
 * - 6.2: Clock out with current timestamp and optional GPS
 * - 6.3: Display Clock In button when no active session
 * - 6.4: Display Clock Out button and session start time when active
 * - 6.5: Store GPS coordinates if available
 * - 6.6: Create entries without location data if GPS unavailable
 * - 11.1: Mobile-first responsive layout
 * - 11.2: Touch targets at least 44x44 pixels
 * - 12.3: Bilingual labels and messages
 * - 28.1: Large prominent clock button (minimum 60x60px)
 * - 28.2: Active session indicator with visual styling
 * - 28.3: FloatingCard for clock history with timestamps
 * - 28.5: Mobile-first responsive layout with centered button
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
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ClockStatusResponse {
  activeSession: ClockEntry | null;
  error?: string;
}

export default function ClockPage() {
  const t = useTranslations('clock');
  const tCommon = useTranslations('common');
  const { toast } = useToast();

  const [activeSession, setActiveSession] = useState<ClockEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOperating, setIsOperating] = useState(false);
  const [gpsPermission, setGpsPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  /**
   * Request geolocation permission and update coordinates
   */
  const requestGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsPermission('granted');
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setGpsPermission('denied');
          setCoordinates(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setGpsPermission('denied');
    }
  };

  /**
   * Fetch current clock session status
   */
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/clock/status');
      const data: ClockStatusResponse = await response.json();

      if (response.ok) {
        setActiveSession(data.activeSession);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to fetch clock status',
        });
      }
    } catch (error) {
      console.error('Fetch status error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to connect to server',
      });
    } finally {
      setIsLoading(false);
    }
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
      clockInLat: coordinates?.latitude ?? null,
      clockInLng: coordinates?.longitude ?? null,
      clockOutLat: null,
      clockOutLng: null,
      user: {
        id: 'temp',
        name: 'You',
        email: '',
      },
    };
    setActiveSession(optimisticEntry);

    try {
      // Get fresh coordinates before clocking in
      if (gpsPermission === 'granted' && 'geolocation' in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              resolve();
            },
            () => resolve(),
            { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
          );
        });
      }

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
        description: coordinates
          ? 'Location recorded'
          : 'Location not available',
      });
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
      // Get fresh coordinates before clocking out
      if (gpsPermission === 'granted' && 'geolocation' in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              resolve();
            },
            () => resolve(),
            { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
          );
        });
      }

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
        description: coordinates
          ? 'Location recorded'
          : 'Location not available',
      });
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

  /**
   * Initialize component: request geolocation and fetch status
   */
  useEffect(() => {
    requestGeolocation();
    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <WaterBackground variant="light" intensity="subtle">
        <Container maxWidth="narrow">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Container>
      </WaterBackground>
    );
  }

  return (
    <WaterBackground variant="light" intensity="subtle">
      <Container maxWidth="narrow">
        <div className="py-8 px-4">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground text-lg">
              {activeSession ? t('currentSession') : t('noActiveSession')}
            </p>
          </div>

          {/* Main Clock Card */}
          <FloatingCard hover className="max-w-md mx-auto">
            <div className="space-y-6">
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {activeSession ? t('currentSession') : t('title')}
                  </h2>
                </div>
                {gpsPermission === 'granted' && (
                  <p className="flex items-center justify-center gap-1 text-sm text-primary">
                    <MapPin className="h-4 w-4" />
                    Location tracking enabled
                  </p>
                )}
                {gpsPermission === 'denied' && (
                  <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Location tracking disabled
                  </p>
                )}
              </div>

              {activeSession ? (
                <>
                  {/* Active Session Info */}
                  <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-lg space-y-3 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('sessionStart')}</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        Active
                      </Badge>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-center text-primary">
                      {format(new Date(activeSession.clockInTime), 'HH:mm:ss')}
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                      {format(new Date(activeSession.clockInTime), 'PPP')}
                    </p>
                    {activeSession.clockInLat && activeSession.clockInLng && (
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activeSession.clockInLat.toFixed(6)}, {activeSession.clockInLng.toFixed(6)}
                      </p>
                    )}
                  </div>

                  {/* Clock Out Button - Prominent size (60x60px minimum) */}
                  <Button
                    onClick={handleClockOut}
                    disabled={isOperating}
                    variant="destructive"
                    className="w-full min-h-[60px] text-lg font-semibold"
                    size="lg"
                  >
                    {isOperating ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        {tCommon('loading')}
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-6 w-6" />
                        {t('clockOut')}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* No Active Session */}
                  <div className="p-8 bg-muted/50 rounded-lg text-center space-y-4">
                    <Clock className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-base text-muted-foreground">
                      {t('noActiveSession')}
                    </p>
                  </div>

                  {/* Clock In Button - Prominent size (60x60px minimum) */}
                  <Button
                    onClick={handleClockIn}
                    disabled={isOperating}
                    variant="primary"
                    className="w-full min-h-[60px] text-lg font-semibold"
                    size="lg"
                  >
                    {isOperating ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        {tCommon('loading')}
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-6 w-6" />
                        {t('clockIn')}
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </FloatingCard>
        </div>
      </Container>
    </WaterBackground>
  );
}
