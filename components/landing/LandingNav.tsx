'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/design-system/Logo';
import { ThemeToggle } from '@/components/design-system/ThemeToggle';
import { LanguageSelector } from '@/components/design-system/LanguageSelector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface LandingNavProps {
  loginText?: string;
  className?: string;
}

/**
 * LandingNav - Navigation bar for public landing page
 * 
 * Features:
 * - Logo on left
 * - Language selector and theme toggle in center/right
 * - Login button on far right
 * - Transparent background with subtle blur
 * - Mobile responsive
 */
export const LandingNav: React.FC<LandingNavProps> = ({
  loginText = 'Login',
  className,
}) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'da';
  
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white/80 dark:bg-card/80 backdrop-blur-md',
        'border-b border-border/50',
        'shadow-sm',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href={`/${locale}`} className="flex items-center" aria-label="Home">
            <Logo variant="full" size={120} />
          </a>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selector */}
            <LanguageSelector variant="dropdown" />
            
            {/* Theme Toggle */}
            <ThemeToggle variant="button" />
            
            {/* Login Button */}
            <a href={`/${locale}/login`} aria-label="Login">
              <Button variant="primary" size="md" className="min-w-[100px]">
                {loginText}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
