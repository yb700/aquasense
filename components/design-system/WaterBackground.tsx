/**
 * WaterBackground Component
 * 
 * Creates a water-inspired background with gradient effects and optional caustic overlay.
 * Designed for dashboard and page backgrounds to provide subtle aquatic atmosphere
 * while maintaining content readability.
 * 
 * Features:
 * - Light/dark mode support with appropriate aquatic gradients
 * - Configurable intensity levels (subtle/medium/strong)
 * - Optional caustic overlay using WaterReflection component
 * - Performant CSS gradients (no layout reflow)
 * - Content wrapper for proper layering
 * - Ensures background doesn't interfere with readability
 * 
 * Requirements:
 * - 10.1: Subtle water-inspired texture background
 * - 10.2: Light caustic patterns or gentle gradient suggesting water
 * - 10.3: Does not interfere with content readability
 * - 10.4: Performant using CSS gradients or lightweight SVG patterns
 * - 10.5: Dark mode support with appropriate dark variant
 * 
 * @example
 * ```tsx
 * // Subtle background (default)
 * <WaterBackground>
 *   <YourContent />
 * </WaterBackground>
 * 
 * // Medium intensity with caustic overlay
 * <WaterBackground intensity="medium" variant="light">
 *   <YourContent />
 * </WaterBackground>
 * 
 * // Dark mode
 * <WaterBackground variant="dark" intensity="subtle">
 *   <YourContent />
 * </WaterBackground>
 * ```
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { WaterReflection } from './WaterReflection';

interface WaterBackgroundProps {
  /**
   * Color variant - light or dark mode
   * Default: 'light'
   */
  variant?: 'light' | 'dark';
  
  /**
   * Intensity of the water effect
   * - subtle: Minimal gradient, very light (default)
   * - medium: Noticeable but not distracting
   * - strong: More prominent aquatic feel
   * Default: 'subtle'
   */
  intensity?: 'subtle' | 'medium' | 'strong';
  
  /**
   * Content to render on top of the water background
   */
  children?: React.ReactNode;
  
  /**
   * Additional CSS classes for the wrapper
   */
  className?: string;
}

/**
 * WaterBackground component provides aquatic-themed backgrounds
 * using performant CSS gradients and optional caustic overlays.
 */
export const WaterBackground: React.FC<WaterBackgroundProps> = ({
  variant = 'light',
  intensity = 'subtle',
  children,
  className,
}) => {
  // Determine if we should show caustic overlay based on intensity
  const showCaustic = intensity === 'medium' || intensity === 'strong';
  
  // Calculate caustic opacity based on intensity
  const causticOpacity = intensity === 'strong' ? 0.08 : 0.05;
  
  // Light mode gradient configurations
  const lightGradients = {
    subtle: 'bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20',
    medium: 'bg-gradient-to-br from-background via-primary-50/50 to-accent-100/30',
    strong: 'bg-gradient-to-br from-primary-50/40 via-accent-50/40 to-highlight-50/30',
  };
  
  // Dark mode gradient configurations
  const darkGradients = {
    subtle: 'bg-gradient-to-br from-background via-primary-900/20 to-accent-900/10',
    medium: 'bg-gradient-to-br from-background via-primary-900/30 to-accent-800/20',
    strong: 'bg-gradient-to-br from-primary-900/40 via-accent-900/30 to-secondary-900/30',
  };
  
  // Select appropriate gradient based on variant and intensity
  const gradientClass = variant === 'light' 
    ? lightGradients[intensity] 
    : darkGradients[intensity];
  
  return (
    <div 
      className={cn(
        'relative min-h-screen w-full',
        gradientClass,
        className
      )}
    >
      {/* Caustic overlay (optional, based on intensity) */}
      {showCaustic && (
        <WaterReflection 
          opacity={causticOpacity}
          speed={0.8}
          className="absolute inset-0 z-0"
        />
      )}
      
      {/* Additional subtle pattern overlay for depth */}
      <div 
        className={cn(
          'pointer-events-none absolute inset-0 z-0',
          variant === 'light' 
            ? 'bg-[radial-gradient(circle_at_50%_120%,rgba(77,208,225,0.05),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_50%_120%,rgba(77,208,225,0.08),transparent_50%)]'
        )}
        aria-hidden="true"
      />
      
      {/* Content layer - positioned above background effects */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * Default export for convenience
 */
export default WaterBackground;
