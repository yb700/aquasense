'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { User } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavigationRailProps {
  items: NavigationItem[];
  currentPath: string;
  userName: string;
}

/**
 * NavigationRail Component
 * 
 * A vertical navigation sidebar for desktop layouts (≥1024px viewport).
 * Features a fixed left sidebar with glass effect, logo at top, navigation items
 * in the middle, and user profile at the bottom.
 * 
 * Features:
 * - Hover ripple effect on navigation items
 * - Active page highlighting with accent color
 * - Optional badge prop for notification counts
 * - Minimum 44x44px touch targets for all interactive elements
 * - Keyboard navigation support (arrow keys, Enter)
 * 
 * @param items - Array of navigation items with labels, hrefs, icons, and optional badges
 * @param currentPath - Current active path for highlighting
 * @param userName - User's display name
 * 
 * **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 22.2, 22.6**
 */
export const NavigationRail: React.FC<NavigationRailProps> = ({
  items,
  currentPath,
  userName,
}) => {
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const navItemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  // Check if motion should be reduced for accessibility
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const { key } = event;

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      
      let newIndex = focusedIndex;
      
      if (key === 'ArrowDown') {
        newIndex = focusedIndex < items.length - 1 ? focusedIndex + 1 : 0;
      } else if (key === 'ArrowUp') {
        newIndex = focusedIndex > 0 ? focusedIndex - 1 : items.length - 1;
      }
      
      setFocusedIndex(newIndex);
      navItemRefs.current[newIndex]?.focus();
    } else if (key === 'Enter' && focusedIndex >= 0) {
      event.preventDefault();
      const targetHref = items[focusedIndex]?.href;
      if (targetHref) {
        router.push(targetHref as any);
      }
    }
  };

  // Track focus on navigation items
  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  // Clear focused index when focus leaves the navigation
  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <nav
      className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] flex-col bg-white/80 dark:bg-card/80 backdrop-blur-lg border-r border-border shadow-md dark:shadow-dark-md z-50"
      aria-label="Main navigation"
    >
      {/* Logo Section - Top */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-border">
        <Link href={"/" as any} aria-label="Home">
          <Logo variant="full" size={160} />
        </Link>
      </div>

      {/* Navigation Items - Middle (scrollable if needed) */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <ul 
          className="space-y-2" 
          role="list"
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => {
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
            
            return (
              <li key={item.href}>
                <Link
                  ref={(el) => {
                    navItemRefs.current[index] = el;
                  }}
                  href={item.href as any}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-md
                    min-h-touch transition-all duration-base ease-water-flow
                    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background
                    ${
                      isActive
                        ? 'bg-accent/10 text-accent dark:bg-accent/20'
                        : 'text-foreground hover:bg-accent/5 dark:hover:bg-accent/10'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Ripple effect container */}
                  {!prefersReducedMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-md overflow-hidden"
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <motion.span
                        className="absolute inset-0 bg-accent/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.34, 1.56, 0.64, 1], // water-ripple easing
                        }}
                      />
                    </motion.span>
                  )}

                  {/* Icon */}
                  <span className={`relative z-10 flex-shrink-0 ${isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'}`}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="relative z-10 flex-1 font-medium text-sm">
                    {item.label}
                  </span>

                  {/* Badge (if present) */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="relative z-10 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-error text-white text-xs font-semibold rounded-full">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}

                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"
                      layoutId="activeIndicator"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User Profile Section - Bottom */}
      <div className="p-4 border-t border-border">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-md hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-base ease-water-flow min-h-touch"
          aria-label={`User profile: ${userName}`}
        >
          {/* User Avatar */}
          <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent">
            <User size={20} />
          </div>

          {/* User Name */}
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground truncate">
              {userName}
            </p>
            <p className="text-xs text-muted-foreground">
              View profile
            </p>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default NavigationRail;
