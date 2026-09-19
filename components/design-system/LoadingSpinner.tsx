'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  color?: string;
  className?: string;
}

/**
 * LoadingSpinner Component
 * 
 * A circular loading spinner with smooth animations and multiple size options.
 * Uses SVG-based circular progress animation for a water-inspired loading effect.
 * 
 * @param size - Spinner size: 'sm' (24px), 'md' (40px), 'lg' (64px) (default: 'md')
 * @param variant - Spinner style: 'default' or 'circular' (default: 'circular')
 * @param label - Optional accessible label describing what's loading
 * @param color - Custom color for the spinner (default: accent color #4DD0E1)
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 20.1, 20.2, 22.2**
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  color = '#4DD0E1',
  className = '',
}) => {
  // Size mappings
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 64,
  };

  const dimension = sizeMap[size];
  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 6;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = dimension / 2;

  // Accessibility: reduce motion for users who prefer it
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
    >
      {/* Circular SVG spinner */}
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E3F2FD"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />

        {/* Animated progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          style={{
            filter: `drop-shadow(0 0 4px ${color}40)`,
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  rotate: 360,
                }
          }
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 1.2,
                  ease: 'linear',
                  repeat: Infinity,
                }
          }
        />
      </svg>

      {/* Optional label */}
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
