'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X, LogOut, Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

/**
 * Navigation Component (Client Component)
 * 
 * Provides mobile-responsive navigation with:
 * - Language switcher (Danish/English)
 * - Navigation links (Dashboard, Shifts, Leave, Incidents, Cleaning, Clock)
 * - Logout button with API call to /api/auth/logout
 * - Mobile hamburger menu
 * - Touch-friendly targets (min 44x44 pixels)
 * 
 * Requirements:
 * - 11.1: Mobile-first responsive layout
 * - 11.2: Touch targets at least 44x44 pixels
 * - 12.1: Display UI text in Danish by default
 * - 12.2: Support language switching
 * - 12.3: Translate navigation elements
 * - 12.4: Persist language preference
 * 
 * @param props.userName - Authenticated user's name
 * @param props.currentLocale - Current language locale (da or en)
 */

interface NavigationProps {
  userName: string;
  currentLocale: string;
}

export function Navigation({ userName, currentLocale }: NavigationProps) {
  const t = useTranslations('navigation');
  const tAuth = useTranslations('auth');
  const tLanguage = useTranslations('language');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Navigation links
  const navLinks = [
    { href: `/${currentLocale}/dashboard/staff` as any, label: t('dashboard') },
    { href: `/${currentLocale}/shifts` as any, label: t('shifts') },
    { href: `/${currentLocale}/leave` as any, label: t('leave') },
    { href: `/${currentLocale}/incidents` as any, label: t('incidents') },
    { href: `/${currentLocale}/cleaning` as any, label: t('cleaning') },
    { href: `/${currentLocale}/clock` as any, label: t('clock') },
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
    // pathname from next-intl's usePathname() has no locale prefix, just prepend the new one
    router.push(`/${newLocale}${pathname}` as any);
    router.refresh();
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / App Name */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${currentLocale}/dashboard/staff` as any}
              className="text-xl font-bold text-primary"
            >
              {tCommon('appName')}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Language Switcher */}
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

            {/* User Info */}
            <span className="text-sm text-muted-foreground">{userName}</span>

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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-11 w-11 min-w-[44px] min-h-[44px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* User Info */}
            <div className="text-sm text-muted-foreground px-2">
              {userName}
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-2 py-3 text-base font-medium rounded-md transition-colors min-h-[44px] flex items-center ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="px-2">
              <label className="text-sm font-medium mb-2 block">
                {tLanguage('select')}
              </label>
              <Select value={currentLocale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full h-11 min-h-[44px]">
                  <Globe className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="da">{tLanguage('danish')}</SelectItem>
                  <SelectItem value="en">{tLanguage('english')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logout Button */}
            <div className="px-2 pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full h-11 min-h-[44px]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {tAuth('logout')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
