/**
 * AquaSense Design System - Border Radius Tokens
 * 
 * Border radius scale for consistent corner rounding.
 * Softer, more rounded corners for aquatic, organic feel.
 * 
 * Requirements:
 * - 23.5: Border radius tokens for consistent corner rounding
 */

/**
 * Border radius scale interface
 * Ranges from none (sharp) to full (pill/circle)
 */
export interface BorderRadiusScale {
  none: string;   // 0px - sharp corners
  sm: string;     // 6px - subtle rounding
  base: string;   // 8px - standard rounding
  md: string;     // 12px - medium rounding (default for cards)
  lg: string;     // 16px - large rounding
  xl: string;     // 24px - extra large rounding
  '2xl': string;  // 32px - very large rounding
  full: string;   // Perfect circle/pill shape
}

/**
 * Border radius tokens
 * Based on organic, water-like shapes with softer corners
 */
export const borderRadius: BorderRadiusScale = {
  none: '0',              // 0px - no rounding (sharp edges)
  sm: '0.375rem',         // 6px - subtle rounding for small elements
  base: '0.5rem',         // 8px - standard rounding for buttons
  md: '0.75rem',          // 12px - default for cards, inputs
  lg: '1rem',             // 16px - large components, prominent cards
  xl: '1.5rem',           // 24px - hero sections, large containers
  '2xl': '2rem',          // 32px - very large containers, decorative elements
  full: '9999px',         // Perfect circles (avatars, badges) and pills (buttons)
};

/**
 * Component-specific radius presets
 * Common border radius patterns for consistent component styling
 */
export const componentRadius = {
  // Button radius
  button: {
    sm: borderRadius.base,    // 8px - small buttons
    md: borderRadius.base,    // 8px - medium buttons (default)
    lg: borderRadius.md,      // 12px - large buttons
    pill: borderRadius.full,  // Pill-shaped buttons
  },

  // Input radius
  input: {
    default: borderRadius.md, // 12px - text inputs, selects
    small: borderRadius.base, // 8px - compact inputs
  },

  // Card radius
  card: {
    default: borderRadius.md, // 12px - standard cards
    large: borderRadius.lg,   // 16px - prominent cards
    hero: borderRadius.xl,    // 24px - hero cards, featured content
  },

  // Modal/Dialog radius
  modal: {
    default: borderRadius.lg, // 16px - standard modals
    large: borderRadius.xl,   // 24px - large modals
  },

  // Navigation radius
  nav: {
    item: borderRadius.base,  // 8px - nav items
    rail: borderRadius.lg,    // 16px - nav rail container
  },

  // Badge/Tag radius
  badge: {
    default: borderRadius.base, // 8px - rectangular badges
    pill: borderRadius.full,    // Pill-shaped badges
  },

  // Avatar radius
  avatar: {
    square: borderRadius.md,  // 12px - rounded square avatars
    circle: borderRadius.full, // Circular avatars
  },

  // Image radius
  image: {
    thumbnail: borderRadius.base, // 8px - small images
    default: borderRadius.md,     // 12px - standard images
    large: borderRadius.lg,       // 16px - large images
  },

  // Tooltip/Popover radius
  tooltip: {
    default: borderRadius.base,   // 8px - tooltips and popovers
  },

  // Dropdown radius
  dropdown: {
    menu: borderRadius.md,        // 12px - dropdown menus
  },

  // Container radius
  container: {
    default: borderRadius.lg,     // 16px - content containers
    section: borderRadius.xl,     // 24px - page sections
  },
};

/**
 * Directional radius utilities
 * For applying radius to specific corners only
 */
export const directionalRadius = {
  // Top corners only
  top: {
    sm: `${borderRadius.sm} ${borderRadius.sm} 0 0`,
    base: `${borderRadius.base} ${borderRadius.base} 0 0`,
    md: `${borderRadius.md} ${borderRadius.md} 0 0`,
    lg: `${borderRadius.lg} ${borderRadius.lg} 0 0`,
    xl: `${borderRadius.xl} ${borderRadius.xl} 0 0`,
  },

  // Bottom corners only
  bottom: {
    sm: `0 0 ${borderRadius.sm} ${borderRadius.sm}`,
    base: `0 0 ${borderRadius.base} ${borderRadius.base}`,
    md: `0 0 ${borderRadius.md} ${borderRadius.md}`,
    lg: `0 0 ${borderRadius.lg} ${borderRadius.lg}`,
    xl: `0 0 ${borderRadius.xl} ${borderRadius.xl}`,
  },

  // Left corners only
  left: {
    sm: `${borderRadius.sm} 0 0 ${borderRadius.sm}`,
    base: `${borderRadius.base} 0 0 ${borderRadius.base}`,
    md: `${borderRadius.md} 0 0 ${borderRadius.md}`,
    lg: `${borderRadius.lg} 0 0 ${borderRadius.lg}`,
    xl: `${borderRadius.xl} 0 0 ${borderRadius.xl}`,
  },

  // Right corners only
  right: {
    sm: `0 ${borderRadius.sm} ${borderRadius.sm} 0`,
    base: `0 ${borderRadius.base} ${borderRadius.base} 0`,
    md: `0 ${borderRadius.md} ${borderRadius.md} 0`,
    lg: `0 ${borderRadius.lg} ${borderRadius.lg} 0`,
    xl: `0 ${borderRadius.xl} ${borderRadius.xl} 0`,
  },
};

/**
 * Responsive radius utilities
 * Different radius values for different screen sizes
 */
export const responsiveRadius = {
  // Cards scale up radius on larger screens
  card: {
    mobile: borderRadius.md,    // 12px on mobile
    tablet: borderRadius.md,    // 12px on tablet
    desktop: borderRadius.lg,   // 16px on desktop
  },

  // Containers scale up radius on larger screens
  container: {
    mobile: borderRadius.md,    // 12px on mobile
    tablet: borderRadius.lg,    // 16px on tablet
    desktop: borderRadius.xl,   // 24px on desktop
  },

  // Modals scale up radius on larger screens
  modal: {
    mobile: borderRadius.md,    // 12px on mobile
    tablet: borderRadius.lg,    // 16px on tablet
    desktop: borderRadius.xl,   // 24px on desktop
  },
};

/**
 * Helper function to get radius value by key
 * Example: getRadius('md') returns '0.75rem'
 */
export function getRadius(key: keyof BorderRadiusScale): string {
  return borderRadius[key];
}

/**
 * Helper function to get component radius by path
 * Example: getComponentRadius('card.default') returns '0.75rem'
 */
export function getComponentRadius(path: string): string {
  const keys = path.split('.');
  let value: any = componentRadius;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Component radius path "${path}" not found`);
      return borderRadius.md; // Default to medium radius
    }
  }

  return typeof value === 'string' ? value : borderRadius.md;
}

/**
 * Helper function to get directional radius
 * Example: getDirectionalRadius('top', 'md') returns '0.75rem 0.75rem 0 0'
 */
export function getDirectionalRadius(
  direction: 'top' | 'bottom' | 'left' | 'right',
  size: 'sm' | 'base' | 'md' | 'lg' | 'xl'
): string {
  return directionalRadius[direction][size];
}

/**
 * Helper function to get responsive radius by breakpoint
 * Example: getResponsiveRadius('card', 'desktop') returns '1rem'
 */
export function getResponsiveRadius(
  component: 'card' | 'container' | 'modal',
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): string {
  return responsiveRadius[component][breakpoint];
}

/**
 * Utility to create custom radius for individual corners
 * Example: createCustomRadius({ topLeft: 'md', topRight: 'none', bottomRight: 'md', bottomLeft: 'none' })
 * Returns: '0.75rem 0 0.75rem 0'
 */
export function createCustomRadius(corners: {
  topLeft?: keyof BorderRadiusScale;
  topRight?: keyof BorderRadiusScale;
  bottomRight?: keyof BorderRadiusScale;
  bottomLeft?: keyof BorderRadiusScale;
}): string {
  const topLeft = corners.topLeft ? borderRadius[corners.topLeft] : '0';
  const topRight = corners.topRight ? borderRadius[corners.topRight] : '0';
  const bottomRight = corners.bottomRight ? borderRadius[corners.bottomRight] : '0';
  const bottomLeft = corners.bottomLeft ? borderRadius[corners.bottomLeft] : '0';

  return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
}
