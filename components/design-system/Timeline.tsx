import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItem {
  time: string;
  title: string;
  description?: string;
  status: 'completed' | 'active' | 'pending';
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * Timeline Component
 * 
 * A clean timeline component that displays events or activities with visual clarity.
 * Features water-path inspired visual connectors between timeline items.
 * Supports three status variants: completed (green), active (blue), and pending (gray).
 * 
 * @param items - Array of timeline items to display
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 12.3, 12.5**
 */
export const Timeline: React.FC<TimelineProps> = ({
  items,
  className = ''
}) => {
  const getStatusColor = (status: TimelineItem['status']): string => {
    switch (status) {
      case 'completed':
        return '#76E4C3'; // Fresh Mint - highlight color
      case 'active':
        return '#4DD0E1'; // Aqua - accent color
      case 'pending':
        return '#B5CDD9'; // Neutral gray
      default:
        return '#B5CDD9';
    }
  };

  const getStatusDotSize = (status: TimelineItem['status']): number => {
    return status === 'active' ? 16 : 12;
  };

  return (
    <div 
      className={`relative ${className}`}
      role="list"
      aria-label="Timeline"
    >
      {items.map((item, index) => {
        const statusColor = getStatusColor(item.status);
        const isLast = index === items.length - 1;
        const dotSize = getStatusDotSize(item.status);
        
        return (
          <motion.div
            key={index}
            className="relative flex gap-4 pb-8 last:pb-0"
            role="listitem"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.4, 0.0, 0.2, 1], // waterFlow easing
            }}
          >
            {/* Left column: Time and status indicator */}
            <div className="flex flex-col items-end min-w-[80px] pt-1">
              <time 
                className="text-sm font-medium text-muted-foreground mb-2"
                dateTime={item.time}
              >
                {item.time}
              </time>
              
              {/* Status dot with animation */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  className="rounded-full z-10"
                  style={{
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: statusColor,
                    boxShadow: `0 0 0 4px ${statusColor}20`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1 + 0.2,
                    ease: [0.34, 1.56, 0.64, 1], // waterRipple easing
                  }}
                >
                  {/* Active pulse animation */}
                  {item.status === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: statusColor,
                      }}
                      animate={{
                        scale: [1, 1.5, 1.5],
                        opacity: [0.6, 0, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Connector line with water-inspired curve */}
            {!isLast && (
              <div 
                className="absolute left-[88px] top-[44px] w-[2px] h-full"
                aria-hidden="true"
              >
                <svg
                  className="w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 2 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M 1 0 Q 1 20 1 30 Q 1 50 1 70 Q 1 80 1 100"
                    stroke={statusColor}
                    strokeWidth="2"
                    strokeOpacity={item.status === 'completed' ? 0.4 : 0.2}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1 + 0.3,
                      ease: [0.65, 0, 0.35, 1], // waterWave easing
                    }}
                  />
                </svg>
              </div>
            )}

            {/* Right column: Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-start gap-3">
                {/* Icon */}
                {item.icon && (
                  <motion.div
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: statusColor }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + 0.15,
                      ease: [0.4, 0.0, 0.2, 1],
                    }}
                  >
                    {item.icon}
                  </motion.div>
                )}
                
                {/* Title and description */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className={`text-base font-semibold mb-1 ${
                      item.status === 'pending' 
                        ? 'text-muted-foreground' 
                        : 'text-foreground'
                    }`}
                  >
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Timeline;
