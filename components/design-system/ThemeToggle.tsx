'use client';

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme/theme-provider';
import { cn } from '@/lib/utils';

/**
 * AquaSense Design System - ThemeToggle Component
 * 
 * A theme toggle component supporting button and switch variants.
 * Includes animated icon transitions and full accessibility support.
 * 
 * **Validates: Requirements 17.1, 22.2, 22.6**
 */

interface ThemeToggleProps {
  variant?: 'button' | 'switch';
  className?: string;
}

/**
 * ThemeToggle Component
 * 
 * Provides a UI control for switching between light and dark themes.
 * 
 * @param variant - Display variant: 'button' (icon button) or 'switch' (toggle switch) (default: 'button')
 * @param className - Additional CSS classes
 * 
 * Features:
 * - Button variant: Icon button with smooth sun/moon icon transitions
 * - Switch variant: Toggle switch with icon indicators
 * - Fully accessible: ARIA labels, keyboard navigation (Space, Enter)
 * - Icon transitions with rotation and fade animations
 * - Touch-optimized: minimum 44x44px touch targets
 * 
 * @example
 * // Button variant
 * <ThemeToggle variant="button" />
 * 
 * // Switch variant
 * <ThemeToggle variant="switch" />
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  if (variant === 'switch') {
    return (
      <div
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex items-center h-11 w-20 cursor-pointer rounded-full transition-colors duration-300',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
          isDark ? 'bg-primary' : 'bg-neutral-300',
          className
        )}
      >
        {/* Switch Track */}
        <span
          className={cn(
            'absolute h-9 w-9 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center',
            isDark ? 'translate-x-10' : 'translate-x-1'
          )}
        >
          {/* Icon with transition */}
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-all duration-300',
              isAnimating && 'animate-spin'
            )}
          >
            {isDark ? (
              <Moon
                size={20}
                className="text-primary transition-opacity duration-300"
                aria-hidden="true"
              />
            ) : (
              <Sun
                size={20}
                className="text-pool-blue transition-opacity duration-300"
                aria-hidden="true"
              />
            )}
          </span>
        </span>

        {/* Background Icons (optional decorative) */}
        <span className="absolute left-2.5 flex items-center justify-center pointer-events-none">
          <Sun
            size={16}
            className={cn(
              'transition-opacity duration-300',
              isDark ? 'opacity-30' : 'opacity-0'
            )}
            aria-hidden="true"
          />
        </span>
        <span className="absolute right-2.5 flex items-center justify-center pointer-events-none">
          <Moon
            size={16}
            className={cn(
              'transition-opacity duration-300',
              isDark ? 'opacity-0' : 'opacity-30'
            )}
            aria-hidden="true"
          />
        </span>
      </div>
    );
  }

  // Button variant
  return (
    <button
      type="button"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative inline-flex items-center justify-center',
        'h-11 w-11 rounded-md',
        'bg-background hover:bg-muted',
        'border border-border',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        'cursor-pointer',
        className
      )}
    >
      {/* Icon container with rotation animation */}
      <span
        className={cn(
          'relative flex items-center justify-center',
          'transition-transform duration-300',
          isAnimating && 'rotate-180'
        )}
      >
        {isDark ? (
          <Moon
            size={20}
            className="text-foreground transition-opacity duration-300"
            aria-hidden="true"
          />
        ) : (
          <Sun
            size={20}
            className="text-foreground transition-opacity duration-300"
            aria-hidden="true"
          />
        )}
      </span>

      {/* Screen reader text */}
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
