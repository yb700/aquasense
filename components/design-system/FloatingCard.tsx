'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  className?: string;
}

/**
 * FloatingCard Component
 * 
 * A premium card component with layered depth and water-inspired styling.
 * Provides both standard and glass variants with optional hover elevation.
 * 
 * @param children - Card content
 * @param hover - Enable hover elevation animation (default: false)
 * @param glass - Enable glass effect with translucent background (default: false)
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6**
 */
export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  hover = false,
  glass = false,
  className = '',
}) => {
  // Base styles shared by all variants
  // rounded-md = 12px border radius as per requirement
  // p-4 on mobile, p-6 on md+/tablet+ for responsive padding
  const baseStyles = 'rounded-md transition-all duration-base ease-water-flow p-4 md:p-6';
  
  // Standard variant: solid background with soft shadow
  const standardStyles = 'bg-white dark:bg-card shadow-md dark:shadow-dark-md';
  
  // Glass variant: translucent background with backdrop blur
  const glassStyles = 'bg-white/10 dark:bg-black/10 backdrop-blur-lg shadow-glass dark:shadow-dark-glass border border-white/20 dark:border-white/10';
  
  // Combine styles based on variant
  const variantStyles = glass ? glassStyles : standardStyles;
  
  // Hover animation config - gentle Y-axis translation (-4px) and shadow elevation to shadow-lg
  const hoverAnimation = hover
    ? {
        whileHover: {
          y: -4,
          // Use design system shadow tokens: shadow-lg for elevated state
          boxShadow: glass
            ? 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.1), 0 8px 24px 0 rgba(10, 61, 98, 0.12)' // glass shadow-lg
            : '0 8px 24px 0 rgba(10, 61, 98, 0.12)', // shadow-lg token value
          transition: {
            duration: 0.25,
            ease: [0.4, 0.0, 0.2, 1] as const, // water-flow easing
          },
        },
      }
    : {};

  // Accessibility: reduce motion for users who prefer it
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // If hover is disabled or reduced motion is preferred, use a div instead of motion.div
  if (!hover || prefersReducedMotion) {
    return (
      <div className={`${baseStyles} ${variantStyles} ${className}`}>
        {children}
      </div>
    );
  }

  // Animated card with hover elevation
  return (
    <motion.div
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...hoverAnimation}
    >
      {children}
    </motion.div>
  );
};

export default FloatingCard;
