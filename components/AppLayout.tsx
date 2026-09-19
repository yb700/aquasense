'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { NavigationRail } from '@/components/design-system/NavigationRail';
import { BottomNavigation } from '@/components/design-system/BottomNavigation';
import { ThemeToggle } from '@/components/design-system/ThemeToggle';
import { 
  LayoutDashboard, 
  Calendar, 
  UmbrellaIcon, 
  AlertCircle, 
  Droplets, 
  Clock,
  LogOut,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

/**
 * AppLayout Component
 * 
 * Main application layout that integrates NavigationRail (desktop) and BottomNavigation (mobile).
 * Provides consistent navigation experience across all authenticated pages.
 * 
 * Features:
 * - NavigationRail on desktop (≥1024px) with glass effect, logo, and user profile
 * - BottomNavigation on mobile (<1024px) with fixed bottom positioning
 * - Language switcher and theme toggle in navigation rail
 * - Logout functionality with API integration
 * - Responsive content area with proper spacing
 * - Touch-optimized interactions (min 44x44px targets)
 * 
 * @param userName - Authenticated user's name
 * @param currentLocale - Current language locale (da or en)
 * @param children - Page content to display
 * 
 * **Validates: Requirements 8.1-8.7, 9.1-9.7, 21.1**
 */

interface AppLayoutProps {
  userName: string;
  currentLocale: string;
  children: React.ReactNode;
}

export function AppLayout({ userName, currentLocale, children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation');
  const tAuth = useTranslations('auth');
  const tLanguage = useTranslations('language');
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Define navigation items with icons and translations
  const navigationItems = [
    {
      label: t('dashboard'),
      href: `/${currentLocale}/dashboard/staff`,
      icon: <LayoutDashboard size={24} />,
    },
    {
      label: t('shifts'),
      href: `/${currentLocale}/shifts`,
      icon: <Calendar size={24} />,
    },
    {
      label: t('leave'),
      href: `/${currentLocale}/leave`,
      icon: <UmbrellaIcon size={24} />,
    },
    {
      label: t('incidents'),
      href: `/${currentLocale}/incidents`,
      icon: <AlertCircle size={24} />,
    },
    {
      label: t('cleaning'),
      href: `/${currentLocale}/cleaning`,
      icon: <Droplets size={24} />,
    },
  ];

  // Bottom navigation items (maximum 5, excluding less critical items for mobile)
  const bottomNavigationItems = [
    {
      label: t('dashboard'),
      href: `/${currentLocale}/dashboard/staff`,
      icon: <LayoutDashboard size={24} />,
    },
    {
      label: t('shifts'),
      href: `/${currentLocale}/shifts`,
      icon: <Calendar size={24} />,
    },
    {
      label: t('incidents'),
      href: `/${currentLocale}/incidents`,
      icon: <AlertCircle size={24} />,
    },
    {
      label: t('cleaning'),
      href: `/${currentLocale}/cleaning`,
      icon: <Droplets size={24} />,
    },
    {
      label: t('clock'),
      href: `/${currentLocale}/clock`,
      icon: <Clock size={24} />,
    },
  ];

  /**
   * Handle logout button click
   * Makes POST request to /api/auth/logout and redirects to login
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: tAuth('logoutSuccess'),
          description: '',
        });
        // Redirect to login page
        router.push(`/${currentLocale}/login` as any);
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to logout',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * Handle language change
   * Updates the locale in the URL path and reloads the page
   */
  const handleLanguageChange = (newLocale: string) => {
    // Replace current locale in pathname with new locale
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname as any);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation Rail (≥1024px) */}
      <NavigationRail
        items={navigationItems}
        currentPath={pathname}
        userName={userName}
      />

      {/* Mobile Bottom Navigation (<1024px) */}
      <BottomNavigation
        items={bottomNavigationItems}
        currentPath={pathname}
      />

      {/* Main content area with responsive spacing */}
      <div className="lg:pl-[280px]">
        {/* Top bar for desktop with theme toggle, language selector, and logout */}
        <div className="hidden lg:flex items-center justify-between h-16 px-6 border-b border-border bg-white/80 dark:bg-card/80 backdrop-blur-lg">
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle variant="button" />

            {/* Language Selector */}
            <Select value={currentLocale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[140px] h-11">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="da">{tLanguage('danish')}</SelectItem>
                <SelectItem value="en">{tLanguage('english')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Logout Button */}
            <Button
              variant="secondary"
              size="md"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-11 min-w-[44px]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {tAuth('logout')}
            </Button>
          </div>
        </div>

        {/* Mobile top bar with theme toggle and language selector */}
        <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-white/90 dark:bg-card/90 backdrop-blur-lg">
          <div className="text-sm font-semibold text-foreground">{userName}</div>
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle variant="button" />

            {/* Language Selector */}
            <Select value={currentLocale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px] h-10">
                <Globe className="mr-1 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="da">{tLanguage('danish')}</SelectItem>
                <SelectItem value="en">{tLanguage('english')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-10 min-w-[44px]"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">{tAuth('logout')}</span>
            </Button>
          </div>
        </div>

        {/* Page content with bottom padding for mobile navigation (72px for bottom nav + safe area) */}
        <main className="pb-24 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
