import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number;             // 0-100
  size?: number;             // Diameter in pixels
  strokeWidth?: number;      // Ring thickness
  label?: string;
  color?: string;            // Defaults to accent color
  className?: string;
}

/**
 * CircularProgress Component
 * 
 * An SVG-based circular progress indicator with smooth animations.
 * Displays progress from 0-100% in a ring format with optional label.
 * 
 * @param value - Progress value from 0 to 100
 * @param size - Diameter of the circle in pixels (default: 120)
 * @param strokeWidth - Thickness of the progress ring (default: 8)
 * @param label - Optional text label displayed in the center
 * @param color - Custom color for the progress ring (default: accent color #4DD0E1)
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 12.1, 12.5**
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  color = '#4DD0E1',
  className = ''
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedValue / 100) * circumference;
  
  // Center position
  const center = size / 2;

  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Progress: ${normalizedValue}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
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
        
        {/* Progress circle with animation */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0.0, 0.2, 1], // waterFlow easing
          }}
          style={{
            filter: `drop-shadow(0 0 4px ${color}40)`,
          }}
        />
      </svg>
      
      {/* Center label */}
      {label && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          <span className="text-2xl font-bold text-primary">
            {normalizedValue}%
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {label}
          </span>
        </motion.div>
      )}
      
      {/* Show only percentage if no label */}
      {!label && (
        <motion.span
          className="absolute text-xl font-semibold text-primary"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          {normalizedValue}%
        </motion.span>
      )}
    </div>
  );
};

export default CircularProgress;
