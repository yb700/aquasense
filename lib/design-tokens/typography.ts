/**
 * AquaSense Design System - Typography Tokens
 * 
 * Typography system with mobile-first responsive scales.
 * Uses Inter font family for clean, modern, readable text.
 * 
 * Requirements:
 * - 3.1: Primary font family optimized for print and screen reading
 * - 3.2: Font size scales for mobile and desktop viewports
 * - 3.3: Font weights (regular, medium, semibold, bold)
 * - 3.4: Line heights optimized for readability
 * - 3.5: Heading styles (H1-H6) with responsive sizes and weights
 * - 3.6: Body text styles (large, base, small, caption)
 * - 3.7: Minimum 16px font size for mobile body text
 */

/**
 * Font size scale using rem units
 * Base size: 16px
 */
export interface FontSizeScale {
  xs: string;      // 12px
  sm: string;      // 14px
  base: string;    // 16px - minimum for mobile body text
  lg: string;      // 18px
  xl: string;      // 20px
  '2xl': string;   // 24px
  '3xl': string;   // 30px
  '4xl': string;   // 36px
  '5xl': string;   // 48px
  '6xl': string;   // 60px
}

/**
 * Font weight values
 */
export interface FontWeights {
  normal: string;   // 400
  medium: string;   // 500
  semibold: string; // 600
  bold: string;     // 700
}

/**
 * Line height values for different text types
 */
export interface LineHeights {
  tight: string;    // 1.25 - for large headings
  snug: string;     // 1.375 - for smaller headings
  normal: string;   // 1.5 - for body text
  relaxed: string;  // 1.625 - for longer paragraphs
  loose: string;    // 2 - for special cases
}

/**
 * Responsive heading style with mobile and desktop variants
 */
export interface HeadingStyle {
  mobile: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing?: string;
  };
  desktop: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing?: string;
  };
}

/**
 * Body text style definition
 */
export interface BodyTextStyle {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
}

/**
 * Complete typography system
 */
export interface TypographySystem {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: FontSizeScale;
  fontWeight: FontWeights;
  lineHeight: LineHeights;
  headingStyles: {
    h1: HeadingStyle;
    h2: HeadingStyle;
    h3: HeadingStyle;
    h4: HeadingStyle;
    h5: HeadingStyle;
    h6: HeadingStyle;
  };
  bodyStyles: {
    large: BodyTextStyle;
    base: BodyTextStyle;
    small: BodyTextStyle;
    caption: BodyTextStyle;
  };
}

/**
 * Font families (Inter is included in Next.js by default)
 */
export const fontFamily = {
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

/**
 * Font size scale
 * Mobile-first with minimum 16px for body text
 */
export const fontSize: FontSizeScale = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px - minimum for mobile body text (Req 3.7)
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
};

/**
 * Font weights
 * Covers regular, medium, semibold, and bold (Req 3.3)
 */
export const fontWeight: FontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

/**
 * Line heights
 * Optimized for readability in different contexts (Req 3.4)
 */
export const lineHeight: LineHeights = {
  tight: '1.25',     // Large headings
  snug: '1.375',     // Smaller headings
  normal: '1.5',     // Body text
  relaxed: '1.625',  // Long-form content
  loose: '2',        // Special spacing
};

/**
 * Heading styles (H1-H6)
 * Responsive with mobile and desktop variants (Req 3.5)
 */
export const headingStyles = {
  h1: {
    mobile: {
      fontSize: '2.25rem',        // 36px
      lineHeight: '1.25',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    desktop: {
      fontSize: '3.75rem',        // 60px
      lineHeight: '1.2',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
  },

  h2: {
    mobile: {
      fontSize: '1.875rem',       // 30px
      lineHeight: '1.3',
      fontWeight: '700',
    },
    desktop: {
      fontSize: '3rem',           // 48px
      lineHeight: '1.25',
      fontWeight: '700',
    },
  },

  h3: {
    mobile: {
      fontSize: '1.5rem',         // 24px
      lineHeight: '1.35',
      fontWeight: '600',
    },
    desktop: {
      fontSize: '2.25rem',        // 36px
      lineHeight: '1.3',
      fontWeight: '600',
    },
  },

  h4: {
    mobile: {
      fontSize: '1.25rem',        // 20px
      lineHeight: '1.4',
      fontWeight: '600',
    },
    desktop: {
      fontSize: '1.875rem',       // 30px
      lineHeight: '1.35',
      fontWeight: '600',
    },
  },

  h5: {
    mobile: {
      fontSize: '1.125rem',       // 18px
      lineHeight: '1.4',
      fontWeight: '600',
    },
    desktop: {
      fontSize: '1.5rem',         // 24px
      lineHeight: '1.375',
      fontWeight: '600',
    },
  },

  h6: {
    mobile: {
      fontSize: '1rem',           // 16px
      lineHeight: '1.5',
      fontWeight: '600',
    },
    desktop: {
      fontSize: '1.25rem',        // 20px
      lineHeight: '1.4',
      fontWeight: '600',
    },
  },
};

/**
 * Body text styles
 * Includes large, base, small, and caption variants (Req 3.6)
 */
export const bodyStyles = {
  large: {
    fontSize: '1.125rem',    // 18px
    lineHeight: '1.625',
    fontWeight: '400',
  },

  base: {
    fontSize: '1rem',        // 16px - minimum for mobile (Req 3.7)
    lineHeight: '1.5',
    fontWeight: '400',
  },

  small: {
    fontSize: '0.875rem',    // 14px
    lineHeight: '1.5',
    fontWeight: '400',
  },

  caption: {
    fontSize: '0.75rem',     // 12px
    lineHeight: '1.375',
    fontWeight: '400',
  },
};

/**
 * Complete typography system export
 */
export const typography: TypographySystem = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  headingStyles,
  bodyStyles,
};

/**
 * Helper function to get heading style for a specific level and viewport
 * @param level - Heading level (h1-h6)
 * @param viewport - 'mobile' or 'desktop'
 * @returns Heading style object
 */
export function getHeadingStyle(
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  viewport: 'mobile' | 'desktop' = 'mobile'
) {
  return headingStyles[level][viewport];
}

/**
 * Helper function to get body text style
 * @param variant - Body text variant (large, base, small, caption)
 * @returns Body text style object
 */
export function getBodyStyle(variant: 'large' | 'base' | 'small' | 'caption' = 'base') {
  return bodyStyles[variant];
}

/**
 * Helper function to generate CSS class string for heading
 * @param level - Heading level (h1-h6)
 * @returns CSS class string with responsive styles
 */
export function getHeadingClass(level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'): string {
  const mobile = headingStyles[level].mobile;
  const desktop = headingStyles[level].desktop;

  const letterSpacingClass = ('letterSpacing' in mobile && mobile.letterSpacing) ? `tracking-[${mobile.letterSpacing}]` : '';
  
  return `text-[${mobile.fontSize}] lg:text-[${desktop.fontSize}] leading-[${mobile.lineHeight}] lg:leading-[${desktop.lineHeight}] font-[${mobile.fontWeight}] ${letterSpacingClass}`.trim();
}

/**
 * Helper function to generate CSS class string for body text
 * @param variant - Body text variant (large, base, small, caption)
 * @returns CSS class string
 */
export function getBodyClass(variant: 'large' | 'base' | 'small' | 'caption' = 'base'): string {
  const style = bodyStyles[variant];
  return `text-[${style.fontSize}] leading-[${style.lineHeight}] font-[${style.fontWeight}]`;
}

/**
 * Tailwind CSS configuration values for typography
 * Use these in tailwind.config.js
 */
export const tailwindTypography = {
  fontFamily: {
    sans: fontFamily.sans.split(', '),
    mono: fontFamily.mono.split(', '),
  },
  fontSize: {
    xs: [fontSize.xs, { lineHeight: lineHeight.snug }],
    sm: [fontSize.sm, { lineHeight: lineHeight.normal }],
    base: [fontSize.base, { lineHeight: lineHeight.normal }],
    lg: [fontSize.lg, { lineHeight: lineHeight.relaxed }],
    xl: [fontSize.xl, { lineHeight: lineHeight.relaxed }],
    '2xl': [fontSize['2xl'], { lineHeight: lineHeight.snug }],
    '3xl': [fontSize['3xl'], { lineHeight: lineHeight.snug }],
    '4xl': [fontSize['4xl'], { lineHeight: lineHeight.tight }],
    '5xl': [fontSize['5xl'], { lineHeight: lineHeight.tight }],
    '6xl': [fontSize['6xl'], { lineHeight: lineHeight.tight }],
  },
  fontWeight,
  lineHeight,
};

/**
 * Export default
 */
export default typography;
