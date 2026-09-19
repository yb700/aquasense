'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { cn } from '@/lib/utils';

/**
 * AquaSense Design System - Footer Component
 * 
 * A responsive footer component with language selector, navigation links,
 * branding, and copyright information.
 * 
 * **Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5, 19.6**
 */

interface FooterProps {
  className?: string;
}

/**
 * Footer Component
 * 
 * Provides a consistent footer across all pages with essential links,
 * language selection, and branding. Uses muted colors for subtle appearance.
 * 
 * @param className - Additional CSS classes
 * 
 * Features:
 * - Language selector with Danish (🇩🇰 Dansk) and English (🇬🇧 English) options
 * - Links to privacy policy, terms of service, and contact information
 * - AquaSense wordmark branding
 * - Copyright information with current year
 * - Muted color scheme for non-intrusive appearance
 * - Fully responsive layout (stacked on mobile, horizontal on desktop)
 * - Internationalized text using next-intl
 * 
 * Layout:
 * - Mobile: Stacked sections (logo, links, language selector, copyright)
 * - Tablet+: Two-column layout (branding/links left, language/copyright right)
 * - Desktop: All content in a single row with proper spacing
 * 
 * @example
 * // Basic usage
 * <Footer />
 * 
 * // With custom className
 * <Footer className="mt-auto" />
 */
export const Footer: React.FC<FooterProps> = ({ className }) => {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'w-full border-t border-border bg-background',
        'text-muted-foreground',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile and Tablet Layout (< 1024px) */}
        <div className="lg:hidden space-y-6">
          {/* Logo and Links Section */}
          <div className="space-y-4">
            <Logo variant="wordmark" size={120} className="opacity-60" />
            <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-sm"
              >
                {t('privacy')}
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-sm"
              >
                {t('terms')}
              </Link>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-sm"
              >
                {t('contact')}
              </Link>
            </nav>
          </div>

          {/* Language Selector */}
          <div className="flex justify-start">
            <LanguageSelector variant="dropdown" />
          </div>

          {/* Copyright */}
          <div className="text-sm">
            <p>
              © {currentYear} AquaSense. {t('copyright')}
            </p>
          </div>
        </div>

        {/* Desktop Layout (≥ 1024px) */}
        <div className="hidden lg:flex lg:items-center lg:justify-between">
          {/* Left Section: Logo and Links */}
          <div className="flex items-center gap-8">
            <Logo variant="wordmark" size={120} className="opacity-60" />
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-sm"
              >
                {t('privacy')}
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-sm"
              >
                {t('terms')}
              </Link>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-sm"
              >
                {t('contact')}
              </Link>
            </nav>
          </div>

          {/* Right Section: Language Selector and Copyright */}
          <div className="flex items-center gap-8">
            <p className="text-sm">
              © {currentYear} AquaSense. {t('copyright')}
            </p>
            <LanguageSelector variant="dropdown" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
