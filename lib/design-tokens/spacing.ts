/**
 * AquaSense Design System - Spacing Tokens
 * 
 * 4px base unit scale for consistent spacing rhythm.
 * Mobile-first approach with consistent vertical and horizontal spacing.
 * 
 * Requirements:
 * - 23.2: Spacing tokens using 4px base unit scale
 */

/**
 * Spacing scale interface
 * All values based on 4px increments
 */
export interface SpacingScale {
  0: string;   // 0px
  1: string;   // 4px
  2: string;   // 8px
  3: string;   // 12px
  4: string;   // 16px
  5: string;   // 20px
  6: string;   // 24px
  8: string;   // 32px
  10: string;  // 40px
  12: string;  // 48px
  16: string;  // 64px
  20: string;  // 80px
  24: string;  // 96px
  32: string;  // 128px
}

/**
 * Spacing tokens based on 4px base unit
 * Provides consistent rhythm throughout the application
 */
export const spacing: SpacingScale = {
  0: '0',           // 0px - no spacing
  1: '0.25rem',     // 4px - tight spacing
  2: '0.5rem',      // 8px - extra small
  3: '0.75rem',     // 12px - small
  4: '1rem',        // 16px - base spacing
  5: '1.25rem',     // 20px - medium
  6: '1.5rem',      // 24px - large
  8: '2rem',        // 32px - extra large
  10: '2.5rem',     // 40px - 2xl
  12: '3rem',       // 48px - 3xl
  16: '4rem',       // 64px - 4xl
  20: '5rem',       // 80px - 5xl
  24: '6rem',       // 96px - 6xl
  32: '8rem',       // 128px - 7xl
};

/**
 * Component-specific spacing presets
 * Common spacing patterns for consistent component layouts
 */
export const componentSpacing = {
  // Touch targets (minimum 44x44px on mobile)
  touchTarget: {
    sm: '2.75rem',    // 44px - minimum mobile touch target
    md: '3rem',       // 48px - comfortable touch target
    lg: '3.5rem',     // 56px - large touch target
  },

  // Padding presets
  padding: {
    xs: spacing[2],   // 8px
    sm: spacing[3],   // 12px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8],   // 32px
  },

  // Gap/spacing between elements
  gap: {
    xs: spacing[1],   // 4px
    sm: spacing[2],   // 8px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8],   // 32px
  },

  // Section spacing (between major page sections)
  section: {
    mobile: spacing[12],    // 48px - sections on mobile
    tablet: spacing[16],    // 64px - sections on tablet
    desktop: spacing[20],   // 80px - sections on desktop
  },

  // Container padding (horizontal page margins)
  container: {
    mobile: spacing[4],     // 16px - mobile margins
    tablet: spacing[6],     // 24px - tablet margins
    desktop: spacing[8],    // 32px - desktop margins
  },

  // Card spacing
  card: {
    padding: spacing[6],    // 24px - internal card padding
    gap: spacing[4],        // 16px - gap between card elements
  },

  // Form spacing
  form: {
    fieldGap: spacing[4],   // 16px - gap between form fields
    labelGap: spacing[2],   // 8px - gap between label and input
    groupGap: spacing[8],   // 32px - gap between field groups
  },

  // Navigation spacing
  nav: {
    itemGap: spacing[2],    // 8px - gap between nav items
    padding: spacing[4],    // 16px - nav item padding
  },
};

/**
 * Responsive spacing utilities
 * Different spacing values for different breakpoints
 */
export const responsiveSpacing = {
  // Vertical spacing between components
  componentY: {
    mobile: spacing[4],     // 16px
    tablet: spacing[6],     // 24px
    desktop: spacing[8],    // 32px
  },

  // Horizontal spacing between components
  componentX: {
    mobile: spacing[3],     // 12px
    tablet: spacing[4],     // 16px
    desktop: spacing[6],    // 24px
  },
};

/**
 * Helper function to get spacing value by key
 * Example: getSpacing(4) returns '1rem'
 */
export function getSpacing(key: keyof SpacingScale): string {
  return spacing[key];
}

/**
 * Helper function to calculate custom spacing based on base unit
 * Example: calculateSpacing(3) returns '0.75rem' (3 * 4px = 12px)
 */
export function calculateSpacing(multiplier: number): string {
  const baseUnit = 0.25; // 0.25rem = 4px
  return `${baseUnit * multiplier}rem`;
}

/**
 * Helper function to get component spacing preset
 * Example: getComponentSpacing('padding.md') returns '1rem'
 */
export function getComponentSpacing(path: string): string {
  const keys = path.split('.');
  let value: any = componentSpacing;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Component spacing path "${path}" not found`);
      return spacing[4]; // Default to base spacing
    }
  }

  return typeof value === 'string' ? value : spacing[4];
}
