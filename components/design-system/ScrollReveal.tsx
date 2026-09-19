'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;            // Delay in seconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  once?: boolean;            // Animate only once
  className?: string;
}

/**
 * ScrollReveal Component
 * 
 * Animation wrapper that detects when an element enters the viewport using
 * Intersection Observer and triggers reveal animations. Supports multiple
 * animation variants (fade, slideUp, slideLeft, slideRight) with water-flow
 * easing for smooth, natural motion.
 * 
 * @param children - Content to reveal on scroll
 * @param delay - Animation delay in seconds (default: 0)
 * @param direction - Animation variant: 'fade', 'up', 'down', 'left', 'right' (default: 'up')
 * @param once - Whether to animate only once when entering viewport (default: true)
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 9.1, 9.3, 22.6**
 * 
 * Features:
 * - Intersection Observer for viewport detection
 * - Multiple animation variants (fade, slide up/down/left/right)
 * - Water-flow easing for smooth reveals
 * - Respects prefers-reduced-motion setting
 * - Configurable delay for staggered animations
 * - One-time or repeated animations
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  once = true,
  className = '',
}) => {
  const ref = useRef(null);
  
  // useInView hook with Intersection Observer
  // once: animate only on first view if true
  // margin: trigger animation slightly before element enters viewport (-100px)
  const isInView = useInView(ref, { 
    once, 
    margin: '-100px' 
  });

  // Check for prefers-reduced-motion setting
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  // Define initial and animate states based on direction
  const getAnimationStates = () => {
    switch (direction) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case 'up':
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
        };
      case 'down':
        return {
          initial: { opacity: 0, y: -40 },
          animate: { opacity: 1, y: 0 },
        };
      case 'left':
        return {
          initial: { opacity: 0, x: 40 },
          animate: { opacity: 1, x: 0 },
        };
      case 'right':
        return {
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
        };
      default:
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const { initial, animate } = getAnimationStates();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{
        duration: 0.6,  // 600ms - slower duration for smooth reveal
        delay,
        ease: [0.4, 0.0, 0.2, 1],  // waterFlow easing
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
