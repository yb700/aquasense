/**
 * AquaSense Motion System Design Tokens
 * 
 * Water-inspired easing functions and duration scales for animations and transitions.
 * These tokens create smooth, flowing, gentle movement characteristics that feel
 * natural and never flashy or jarring.
 * 
 * Usage:
 * - Use waterFlow for general transitions and smooth decelerations
 * - Use waterRipple for interactive feedback with gentle bounce
 * - Use waterWave for symmetric, wave-like movements
 * 
 * @see Requirements 13.5, 13.6, 23.5
 */

/**
 * Water-inspired easing functions for animations
 * 
 * These cubic-bezier curves create motion that mimics water behavior:
 * - Smooth acceleration and deceleration
 * - Gentle, flowing movement
 * - Natural momentum without jarring stops
 */
export const easing = {
  /**
   * Water Flow - Smooth deceleration curve
   * Best for: General transitions, fade-ins, slide-ins
   * cubic-bezier(0.4, 0.0, 0.2, 1)
   */
  waterFlow: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  /**
   * Water Ripple - Gentle bounce effect
   * Best for: Interactive feedback, button presses, hover states
   * cubic-bezier(0.34, 1.56, 0.64, 1)
   */
  waterRipple: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  /**
   * Water Wave - Symmetric ease for wave-like motion
   * Best for: Page transitions, modal animations, floating elements
   * cubic-bezier(0.65, 0, 0.35, 1)
   */
  waterWave: 'cubic-bezier(0.65, 0, 0.35, 1)',
  
  // Standard easing functions (fallbacks)
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Duration scale for animations and transitions
 * 
 * These durations create a consistent rhythm throughout the interface:
 * - Fast for micro-interactions
 * - Base for most transitions
 * - Slow for complex animations
 * - Slower for page-level transitions
 */
export const duration = {
  /**
   * Fast - 150ms
   * Best for: Hover states, focus indicators, small UI feedback
   */
  fast: '150ms',
  
  /**
   * Base - 250ms
   * Best for: Button interactions, dropdown menus, tooltips
   */
  base: '250ms',
  
  /**
   * Slow - 400ms
   * Best for: Card animations, modal opens/closes, slide panels
   */
  slow: '400ms',
  
  /**
   * Slower - 600ms
   * Best for: Page transitions, complex multi-step animations
   */
  slower: '600ms',
} as const;

/**
 * Combined motion system export
 */
export const motion = {
  easing,
  duration,
} as const;

/**
 * Type definitions for TypeScript
 */
export type EasingFunction = keyof typeof easing;
export type Duration = keyof typeof duration;

/**
 * Default export for convenience
 */
export default motion;
