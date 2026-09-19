/**
 * AquaSense Design System - Shadow Tokens
 * 
 * Layered depth shadow tokens for premium feel.
 * Includes both light mode and dark mode variants.
 * 
 * Requirements:
 * - 23.4: Shadow tokens for layered depth effects
 * - 23.6: Both light mode and dark mode token values
 */

/**
 * Shadow system interface
 * Defines all shadow variants for layered depth
 */
export interface ShadowSystem {
  sm: string;     // Subtle elevation
  base: string;   // Default elevation
  md: string;     // Medium elevation
  lg: string;     // Large elevation
  xl: string;     // Extra large elevation
  '2xl': string;  // Maximum elevation
  glass: string;  // Glass effect with inner shadow
  water: string;  // Water-inspired colored shadow
}

/**
 * Light mode shadow tokens
 * Soft, natural shadows suggesting water depth
 * Using Deep Ocean color (#0A3D62 = rgb(10, 61, 98)) for shadow base
 */
export const shadows: ShadowSystem = {
  // Subtle elevation - minimal depth
  sm: '0 1px 2px 0 rgba(10, 61, 98, 0.05)',

  // Default elevation - standard cards and buttons
  base: '0 2px 8px 0 rgba(10, 61, 98, 0.08)',

  // Medium elevation - hover states, dropdowns
  md: '0 4px 16px 0 rgba(10, 61, 98, 0.10)',

  // Large elevation - modals, popovers
  lg: '0 8px 24px 0 rgba(10, 61, 98, 0.12)',

  // Extra large elevation - prominent modals
  xl: '0 16px 48px 0 rgba(10, 61, 98, 0.15)',

  // Maximum elevation - overlays, critical alerts
  '2xl': '0 24px 64px 0 rgba(10, 61, 98, 0.18)',

  // Glass effect - translucent surface with inner glow
  // Combines inner highlight with outer shadow
  glass: 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.1), 0 2px 8px 0 rgba(10, 61, 98, 0.08)',

  // Water reflection - colored shadow using Aqua accent
  // Using Aqua color (#4DD0E1 = rgb(77, 208, 225))
  water: '0 4px 16px 0 rgba(77, 208, 225, 0.15)',
};

/**
 * Dark mode shadow tokens
 * Deeper, more pronounced shadows for dark backgrounds
 * Pure black shadows with higher opacity for better contrast
 */
export const darkShadows: ShadowSystem = {
  // Subtle elevation
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',

  // Default elevation
  base: '0 2px 8px 0 rgba(0, 0, 0, 0.4)',

  // Medium elevation
  md: '0 4px 16px 0 rgba(0, 0, 0, 0.5)',

  // Large elevation
  lg: '0 8px 24px 0 rgba(0, 0, 0, 0.6)',

  // Extra large elevation
  xl: '0 16px 48px 0 rgba(0, 0, 0, 0.7)',

  // Maximum elevation
  '2xl': '0 24px 64px 0 rgba(0, 0, 0, 0.8)',

  // Glass effect for dark mode - subtle inner glow
  glass: 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.05), 0 2px 8px 0 rgba(0, 0, 0, 0.5)',

  // Water reflection with higher opacity for dark mode
  water: '0 4px 16px 0 rgba(77, 208, 225, 0.25)',
};

/**
 * Component-specific shadow presets
 * Common shadow patterns for consistent component styling
 */
export const componentShadows = {
  // Button shadows
  button: {
    rest: shadows.sm,
    hover: shadows.base,
    active: 'inset 0 2px 4px 0 rgba(10, 61, 98, 0.1)',
  },

  // Card shadows
  card: {
    rest: shadows.base,
    hover: shadows.md,
    elevated: shadows.lg,
  },

  // Input shadows
  input: {
    rest: 'inset 0 1px 2px 0 rgba(10, 61, 98, 0.05)',
    focus: `0 0 0 3px rgba(77, 208, 225, 0.15), inset 0 1px 2px 0 rgba(10, 61, 98, 0.05)`,
    error: `0 0 0 3px rgba(211, 47, 47, 0.15), inset 0 1px 2px 0 rgba(10, 61, 98, 0.05)`,
  },

  // Navigation shadows
  nav: {
    rail: shadows.md,
    bottom: '0 -2px 8px 0 rgba(10, 61, 98, 0.08)',
  },

  // Modal/Dialog shadows
  modal: {
    backdrop: 'inset 0 0 0 1000px rgba(10, 61, 98, 0.4)',
    surface: shadows.xl,
  },

  // Dropdown shadows
  dropdown: {
    menu: shadows.lg,
  },

  // Tooltip shadows
  tooltip: {
    default: shadows.md,
  },
};

/**
 * Dark mode component shadows
 */
export const darkComponentShadows = {
  button: {
    rest: darkShadows.sm,
    hover: darkShadows.base,
    active: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  },

  card: {
    rest: darkShadows.base,
    hover: darkShadows.md,
    elevated: darkShadows.lg,
  },

  input: {
    rest: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    focus: `0 0 0 3px rgba(77, 208, 225, 0.25), inset 0 1px 2px 0 rgba(0, 0, 0, 0.3)`,
    error: `0 0 0 3px rgba(211, 47, 47, 0.25), inset 0 1px 2px 0 rgba(0, 0, 0, 0.3)`,
  },

  nav: {
    rail: darkShadows.md,
    bottom: '0 -2px 8px 0 rgba(0, 0, 0, 0.4)',
  },

  modal: {
    backdrop: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.7)',
    surface: darkShadows.xl,
  },

  dropdown: {
    menu: darkShadows.lg,
  },

  tooltip: {
    default: darkShadows.md,
  },
};

/**
 * Elevation levels for semantic mapping
 * Maps semantic elevation levels to shadow tokens
 */
export const elevation = {
  0: 'none',        // No shadow
  1: shadows.sm,    // Minimal elevation
  2: shadows.base,  // Low elevation
  3: shadows.md,    // Medium elevation
  4: shadows.lg,    // High elevation
  5: shadows.xl,    // Very high elevation
  6: shadows['2xl'], // Maximum elevation
};

/**
 * Dark mode elevation levels
 */
export const darkElevation = {
  0: 'none',
  1: darkShadows.sm,
  2: darkShadows.base,
  3: darkShadows.md,
  4: darkShadows.lg,
  5: darkShadows.xl,
  6: darkShadows['2xl'],
};

/**
 * Helper function to get shadow value by key
 * Example: getShadow('md') returns '0 4px 16px 0 rgba(10, 61, 98, 0.10)'
 */
export function getShadow(key: keyof ShadowSystem): string {
  return shadows[key];
}

/**
 * Helper function to get dark mode shadow by key
 * Example: getDarkShadow('md') returns '0 4px 16px 0 rgba(0, 0, 0, 0.5)'
 */
export function getDarkShadow(key: keyof ShadowSystem): string {
  return darkShadows[key];
}

/**
 * Helper function to get component shadow by path
 * Example: getComponentShadow('card.hover') returns medium elevation shadow
 */
export function getComponentShadow(path: string, isDark: boolean = false): string {
  const keys = path.split('.');
  const shadowSource = isDark ? darkComponentShadows : componentShadows;
  let value: any = shadowSource;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Component shadow path "${path}" not found`);
      return isDark ? darkShadows.base : shadows.base;
    }
  }

  return typeof value === 'string' ? value : (isDark ? darkShadows.base : shadows.base);
}

/**
 * Helper function to get elevation shadow by level
 * Example: getElevationShadow(3) returns medium elevation shadow
 */
export function getElevationShadow(level: 0 | 1 | 2 | 3 | 4 | 5 | 6, isDark: boolean = false): string {
  const elevationSource = isDark ? darkElevation : elevation;
  return elevationSource[level];
}
