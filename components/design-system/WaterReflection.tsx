/**
 * WaterReflection Component
 * 
 * Creates water-inspired light reflection effects using animated SVG caustic patterns.
 * This component is designed for backgrounds and overlays to create immersive aquatic visuals.
 * 
 * Features:
 * - Animated SVG caustic pattern using CSS transforms for performance
 * - Configurable opacity for subtle or prominent effects
 * - Adjustable animation speed
 * - Uses Framer Motion for smooth, performant animation
 * - Default opacity of 0.1 for subtle background effect
 * 
 * @see Requirements 5.6, 21.1, 21.2, 24.2
 * 
 * @example
 * ```tsx
 * // Subtle background effect (default)
 * <WaterReflection />
 * 
 * // More prominent effect
 * <WaterReflection opacity={0.3} speed={1.5} />
 * 
 * // Custom styling
 * <WaterReflection className="absolute inset-0 z-0" opacity={0.15} />
 * ```
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WaterReflectionProps {
  /**
   * Opacity of the water reflection effect
   * Range: 0-1
   * Default: 0.1 (subtle effect)
   */
  opacity?: number;
  
  /**
   * Animation speed multiplier
   * 1.0 = normal speed, 2.0 = twice as fast, 0.5 = half speed
   * Default: 1.0
   */
  speed?: number;
  
  /**
   * Additional CSS classes for positioning and styling
   */
  className?: string;
}

/**
 * WaterReflection component renders an animated caustic pattern overlay
 * using CSS transforms and Framer Motion for optimal performance.
 */
export const WaterReflection: React.FC<WaterReflectionProps> = ({
  opacity = 0.1,
  speed = 1.0,
  className,
}) => {
  // Clamp opacity between 0 and 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  
  // Calculate animation duration based on speed (inverse relationship)
  const animationDuration = 20 / speed; // Base duration is 20 seconds
  
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
      style={{ opacity: clampedOpacity }}
      aria-hidden="true"
    >
      {/* Animated caustic pattern using Framer Motion */}
      <motion.div
        className="absolute inset-0"
        initial={{ 
          x: 0,
          y: 0,
          scale: 1,
        }}
        animate={{
          x: [0, 10, -5, 0],
          y: [0, -8, 12, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: [0.4, 0.0, 0.2, 1], // waterFlow easing
        }}
      >
        {/* SVG caustic pattern */}
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: 'url(/assets/water-patterns/caustic.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </motion.div>
      
      {/* Secondary layer for depth - slightly offset animation */}
      <motion.div
        className="absolute inset-0"
        initial={{ 
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
        }}
        animate={{
          x: [0, -8, 12, 0],
          y: [0, 10, -6, 0],
          scale: [1, 0.97, 1.03, 1],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: animationDuration * 1.3, // Slightly slower for variation
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1], // waterWave easing
        }}
        style={{ opacity: 0.5 }} // Secondary layer is more subtle
      >
        {/* SVG caustic pattern (same source, different animation) */}
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: 'url(/assets/water-patterns/caustic.svg)',
            backgroundSize: '110%', // Slightly larger for layering effect
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(2px)', // Slight blur for depth
          }}
        />
      </motion.div>
    </div>
  );
};

/**
 * Default export for convenience
 */
export default WaterReflection;
