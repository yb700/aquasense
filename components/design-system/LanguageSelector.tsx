'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * AquaSense Design System - LanguageSelector Component
 * 
 * A language selector component for switching between EN/FR locales.
 * Supports dropdown and inline button group variants with i18n integration.
 * 
 * **Validates: Requirements 19.1, 19.2, 22.2**
 */

interface LanguageSelectorProps {
  currentLocale?: string;
  onLocaleChange?: (locale: string) => void;
  variant?: 'dropdown' | 'inline';
  className?: string;
}

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
];

/**
 * LanguageSelector Component
 * 
 * Provides a UI control for switching between supported languages (EN/DA).
 * Integrates with next-intl for locale switching and persists language preference.
 * 
 * @param currentLocale - Current locale code (optional, auto-detected if not provided)
 * @param onLocaleChange - Callback function when locale changes (optional, uses next-intl navigation if not provided)
 * @param variant - Display variant: 'dropdown' (select menu) or 'inline' (button group) (default: 'inline')
 * @param className - Additional CSS classes
 * 
 * Features:
 * - Inline variant: Button group with flag icons and labels
 * - Dropdown variant: Select menu with globe icon
 * - Fully accessible: ARIA labels, keyboard navigation
 * - Smooth hover and focus states with water-like transitions
 * - Touch-optimized: minimum 44x44px touch targets
 * - Next-intl integration for locale switching
 * 
 * @example
 * // Inline button group (default)
 * <LanguageSelector variant="inline" />
 * 
 * // Dropdown menu
 * <LanguageSelector variant="dropdown" />
 * 
 * // With custom locale change handler
 * <LanguageSelector 
 *   currentLocale="en"
 *   onLocaleChange={(locale) => console.log(locale)}
 * />
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLocale,
  onLocaleChange,
  variant = 'inline',
  className = '',
}) => {
  const detectedLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const locale = currentLocale || detectedLocale;
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (onLocaleChange) {
      onLocaleChange(newLocale);
    } else {
      // Default next-intl navigation behavior
      const pathWithoutLocale = pathname.replace(`/${locale}`, '');
      router.push(`/${newLocale}${pathWithoutLocale}`);
      router.refresh();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, newLocale: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLocaleChange(newLocale);
    }
  };

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative inline-flex items-center gap-2', className)}>
        <Globe
          size={20}
          className="text-muted-foreground"
          aria-hidden="true"
        />
        <select
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value)}
          aria-label="Select language"
          className={cn(
            'h-11 px-3 pr-8 rounded-md',
            'bg-background border border-border',
            'text-foreground text-sm font-medium',
            'transition-all duration-200',
            'hover:border-accent hover:bg-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
            'cursor-pointer appearance-none',
            'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")] bg-[length:20px] bg-[right_0.25rem_center] bg-no-repeat',
            isAnimating && 'animate-pulse'
          )}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Inline button group variant (default)
  return (
    <div
      role="group"
      aria-label="Language selector"
      className={cn('inline-flex items-center gap-2', className)}
    >
      <Globe
        size={20}
        className="text-muted-foreground"
        aria-hidden="true"
      />
      <div className="inline-flex rounded-md border border-border bg-background p-1">
        {languages.map((lang) => {
          const isActive = lang.code === locale;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLocaleChange(lang.code)}
              onKeyDown={(e) => handleKeyDown(e, lang.code)}
              aria-label={`Switch to ${lang.label}`}
              aria-pressed={isActive}
              className={cn(
                'inline-flex items-center justify-center gap-1.5',
                'min-h-[44px] min-w-[44px] px-3 py-2',
                'rounded text-sm font-medium',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                !isActive && 'hover:scale-105',
                isAnimating && isActive && 'animate-pulse'
              )}
            >
              <span className="text-base" aria-hidden="true">
                {lang.flag}
              </span>
              <span>{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
