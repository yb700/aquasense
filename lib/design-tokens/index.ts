/**
 * AquaSense Design Tokens
 * 
 * Centralized export of all design tokens for the AquaSense Design System.
 * These tokens provide a consistent foundation for colors, typography, spacing,
 * shadows, and motion throughout the application.
 */

// Export color tokens
export { 
  colors, 
  darkModeColors, 
  getColor, 
  getDarkColor,
  DEEP_OCEAN,
  POOL_BLUE,
  AQUA,
  FRESH_MINT,
  LIGHT_BACKGROUND,
  SURFACE_WHITE,
  TEXT_PRIMARY,
  TEXT_MUTED,
  type ColorScale,
  type SemanticColor,
  type ColorSystem,
  type DarkModeColors,
} from './colors';

// Export typography tokens
export {
  typography,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  headingStyles,
  bodyStyles,
  getHeadingStyle,
  getBodyStyle,
  getHeadingClass,
  getBodyClass,
  tailwindTypography,
  type FontSizeScale,
  type FontWeights,
  type LineHeights,
  type HeadingStyle,
  type BodyTextStyle,
  type TypographySystem,
} from './typography';

// Export spacing tokens
export { 
  spacing, 
  componentSpacing,
  responsiveSpacing,
  getSpacing,
  calculateSpacing,
  getComponentSpacing,
  type SpacingScale 
} from './spacing';

// Export shadow tokens
export { 
  shadows, 
  darkShadows, 
  componentShadows,
  darkComponentShadows,
  elevation,
  darkElevation,
  getShadow, 
  getDarkShadow,
  getComponentShadow,
  getElevationShadow,
  type ShadowSystem 
} from './shadows';

// Export border radius tokens
export { 
  borderRadius, 
  componentRadius,
  directionalRadius,
  responsiveRadius,
  getRadius, 
  getComponentRadius,
  getDirectionalRadius,
  getResponsiveRadius,
  createCustomRadius,
  type BorderRadiusScale 
} from './radius';

// Export motion tokens
export { easing, duration, motion, type EasingFunction, type Duration } from './motion';
