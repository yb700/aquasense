'use client';

import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full';
  padding?: boolean;
  className?: string;
}

/**
 * Container Component
 * 
 * A responsive layout container with configurable max-width breakpoints
 * and automatic horizontal padding that scales with viewport size.
 * 
 * @param children - Container content
 * @param maxWidth - Maximum width variant (default: 'default')
 *   - 'narrow': 960px (good for text-heavy content)
 *   - 'default': 1280px (standard application width)
 *   - 'wide': 1440px (spacious layouts)
 *   - 'full': No max-width constraint
 * @param padding - Enable responsive horizontal padding (default: true)
 *   Scales from 16px on mobile to 32px on desktop
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 8.6, 22.1**
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'default',
  padding = true,
  className = '',
}) => {
  // Center container with auto margins
  const baseStyles = 'mx-auto w-full';
  
  // Max-width variants based on requirements
  // narrow: 960px (max-w-[960px])
  // default: 1280px (max-w-7xl = 1280px)
  // wide: 1440px (max-w-[1440px])
  // full: no constraint
  const maxWidthStyles = {
    narrow: 'max-w-[960px]',
    default: 'max-w-7xl',
    wide: 'max-w-[1440px]',
    full: '',
  };
  
  // Responsive horizontal padding
  // Mobile: 16px (px-4)
  // Tablet (md: 768px+): 24px (md:px-6)
  // Desktop (lg: 1024px+): 32px (lg:px-8)
  const paddingStyles = padding ? 'px-4 md:px-6 lg:px-8' : '';
  
  const widthClass = maxWidthStyles[maxWidth];
  
  return (
    <div className={`${baseStyles} ${widthClass} ${paddingStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
