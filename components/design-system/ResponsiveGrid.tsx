'use client';

import React from 'react';

type GapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: GapSize;
  className?: string;
}

/**
 * ResponsiveGrid Component
 * 
 * A flexible CSS Grid layout component with responsive column counts and design token-based spacing.
 * Uses CSS Grid with auto-fit/auto-fill for flexible, responsive behavior.
 * 
 * @param children - Grid items
 * @param columns - Column counts per breakpoint (default: mobile: 1, tablet: 2, desktop: 3)
 * @param gap - Gap size using design tokens: xs(4px), sm(8px), md(16px), lg(24px), xl(32px)
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 18.1, 18.2, 18.3**
 * 
 * Requirement 18.1: Pages designed with mobile viewport as primary target
 * Requirement 18.2: Uses responsive breakpoints for tablet and desktop viewports
 * Requirement 18.3: Adjusts spacing, typography, and component sizing across breakpoints
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  gap = 'md',
  className = '',
}) => {
  // Map gap sizes to Tailwind spacing tokens
  const gapMap: Record<GapSize, string> = {
    xs: 'gap-1',   // 4px
    sm: 'gap-2',   // 8px
    md: 'gap-4',   // 16px
    lg: 'gap-6',   // 24px
    xl: 'gap-8',   // 32px
  };

  const gapClass = gapMap[gap];

  // Default column values
  const mobileColumns = columns.mobile ?? 1;
  const tabletColumns = columns.tablet ?? 2;
  const desktopColumns = columns.desktop ?? 3;

  // Build responsive grid classes
  // Mobile-first: default to mobile columns, then override at breakpoints
  const gridClasses = [
    'grid',
    gapClass,
    // Mobile (default): 1 column
    `grid-cols-${mobileColumns}`,
    // Tablet (md breakpoint: 768px): 2-3 columns
    `md:grid-cols-${tabletColumns}`,
    // Desktop (lg breakpoint: 1024px): 3-4 columns
    `lg:grid-cols-${desktopColumns}`,
  ].join(' ');

  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;
