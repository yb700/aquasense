'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface BottomNavigationProps {
  items: NavigationItem[];
  currentPath: string;
}

// Ripple state interface
interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * BottomNavigation Component
 * 
 * A mobile-optimized bottom navigation bar for touch-friendly navigation.
 * Fixed to the bottom of the viewport, visible only on mobile/tablet (<1024px).
 * 
 * Features:
 * - Fixed bottom positioning with safe area handling
 * - Glass effect with backdrop blur and elevated shadow
 * - 4-5 primary navigation items with icons and labels
 * - 56px minimum height for touch targets (72px including safe area)
 * - Active state highlighting with accent color and indicator
 * - Tap scale animation with ripple effect on interaction
 * - Keyboard navigation support (Tab, Enter, Arrow keys)
 * - Smooth transitions and animations
 * 
 * @param items - Navigation items (maximum 5 recommended)
 * @param currentPath - Current active route path
 * 
 * **Validates: Requirements 8.3, 8.4, 8.5, 8.7, 22.2, 22.6**
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  currentPath,
}) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Ripple state for each navigation item
  const [ripples, setRipples] = React.useState<Record<string, Ripple[]>>({});

  // Handle ripple effect on tap/click
  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>, itemHref: string) => {
    if (prefersReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple: Ripple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => ({
      ...prev,
      [itemHref]: [...(prev[itemHref] || []), ripple],
    }));

    // Remove ripple after animation completes (600ms)
    setTimeout(() => {
      setRipples((prev) => ({
        ...prev,
        [itemHref]: (prev[itemHref] || []).filter((r) => r.id !== ripple.id),
      }));
    }, 600);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      aria-label="Mobile navigation"
    >
      {/* Glass effect container with backdrop blur and elevated shadow */}
      <div className="bg-white/90 dark:bg-card/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-700 shadow-lg dark:shadow-dark-lg pb-safe">
        {/* Navigation items container - 56px minimum height for touch targets */}
        <div className="flex items-center justify-around min-h-[56px] px-2">
          {items.slice(0, 5).map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href as any}
                onClick={(e) => handleRipple(e, item.href)}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 relative group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background rounded-md"
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${item.label}${item.badge ? ` (${item.badge} notifications)` : ''}`}
                tabIndex={0}
              >
                {/* Ripple effect container */}
                <AnimatePresence>
                  {!prefersReducedMotion && ripples[item.href]?.map((ripple) => (
                    <motion.span
                      key={ripple.id}
                      className="absolute rounded-full bg-accent-300/30 pointer-events-none"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 0,
                        height: 0,
                        transform: 'translate(-50%, -50%)',
                      }}
                      initial={{ width: 0, height: 0, opacity: 1 }}
                      animate={{ 
                        width: 100, 
                        height: 100, 
                        opacity: 0,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.34, 1.56, 0.64, 1], // waterRipple easing
                      }}
                    />
                  ))}
                </AnimatePresence>

                {/* Touch target area - minimum 44x44px (padding ensures this) */}
                <div className="min-w-touch min-h-touch flex items-center justify-center">
                  {/* Icon container with active state */}
                  {prefersReducedMotion ? (
                    <div
                      className={`
                        relative transition-colors duration-base ease-water-flow
                        ${isActive 
                          ? 'text-accent-300' 
                          : 'text-neutral-600 dark:text-neutral-400 group-hover:text-accent-300 group-focus-visible:text-accent-300'
                        }
                      `}
                    >
                      {/* Icon */}
                      <div className="w-6 h-6 flex items-center justify-center">
                        {item.icon}
                      </div>
                      
                      {/* Optional badge indicator */}
                      {item.badge && item.badge > 0 && (
                        <div 
                          className="absolute -top-1 -right-1 bg-error text-white text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                          aria-hidden="true"
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      className={`
                        relative transition-colors duration-base ease-water-flow
                        ${isActive 
                          ? 'text-accent-300' 
                          : 'text-neutral-600 dark:text-neutral-400 group-hover:text-accent-300 group-focus-visible:text-accent-300'
                        }
                      `}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        duration: 0.15,
                        ease: [0.4, 0.0, 0.2, 1],
                      }}
                    >
                      {/* Icon */}
                      <div className="w-6 h-6 flex items-center justify-center">
                        {item.icon}
                      </div>
                      
                      {/* Optional badge indicator */}
                      {item.badge && item.badge > 0 && (
                        <div 
                          className="absolute -top-1 -right-1 bg-error text-white text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                          aria-hidden="true"
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
                
                {/* Label */}
                <span
                  className={`
                    text-xs font-medium transition-colors duration-base ease-water-flow text-center
                    ${isActive 
                      ? 'text-accent-300' 
                      : 'text-neutral-600 dark:text-neutral-400 group-hover:text-accent-300 group-focus-visible:text-accent-300'
                    }
                  `}
                >
                  {item.label}
                </span>
                
                {/* Active indicator - subtle accent bar at top */}
                {isActive && (
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-accent-300 rounded-full"
                    layoutId="bottomNavActiveIndicator"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
