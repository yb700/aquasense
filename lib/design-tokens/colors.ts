/**
 * AquaSense Design System - Color Tokens
 * 
 * Water-inspired color palette with Scandinavian aesthetic.
 * Includes light mode and dark mode color systems.
 * 
 * Requirements:
 * - 2.1: Deep Ocean (#0A3D62) as primary color
 * - 2.2: Pool Blue (#1B7FBD) as secondary color
 * - 2.3: Aqua (#4DD0E1) as accent color
 * - 2.4: Fresh Mint (#76E4C3) as highlight color
 * - 2.5: Light backgrounds, surface white, text colors, and muted colors
 * - 2.6: Semantic color mappings (success, warning, error, info)
 * - 2.7: Complete dark mode palette with visual hierarchy
 * - 2.8: Dark mode colors applied when enabled
 */

/**
 * Color scale interface with 10 shades (50-900)
 */
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

/**
 * Semantic color variations (light, main, dark)
 */
export interface SemanticColor {
  light: string;
  main: string;
  dark: string;
}

/**
 * Complete color system for light mode
 */
export interface ColorSystem {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  highlight: ColorScale;
  neutral: ColorScale;
  semantic: {
    success: SemanticColor;
    warning: SemanticColor;
    error: SemanticColor;
    info: SemanticColor;
  };
}

/**
 * Dark mode color mappings
 */
export interface DarkModeColors {
  background: {
    primary: string;
    secondary: string;
    surface: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    default: string;
    subtle: string;
  };
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
}

/**
 * Light mode color system
 * Based on water depths and aquatic environments
 */
export const colors: ColorSystem = {
  // Primary: Deep Ocean (#0A3D62)
  // Trustworthy, stable, professional
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#0A3D62', // Main primary color - Deep Ocean
    600: '#083351',
    700: '#062840',
    800: '#041D2F',
    900: '#02121E',
  },

  // Secondary: Pool Blue (#1B7FBD)
  // Energetic, clear, refreshing
  secondary: {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#1B7FBD', // Main secondary color - Pool Blue
    600: '#1669A0',
    700: '#125383',
    800: '#0D3D66',
    900: '#082749',
  },

  // Accent: Aqua (#4DD0E1)
  // Vibrant, modern, interactive
  accent: {
    50: '#E0F7FA',
    100: '#B2EBF2',
    200: '#80DEEA',
    300: '#4DD0E1', // Main accent color - Aqua
    400: '#26C6DA',
    500: '#00BCD4',
    600: '#00ACC1',
    700: '#0097A7',
    800: '#00838F',
    900: '#006064',
  },

  // Highlight: Fresh Mint (#76E4C3)
  // Success, completion, positive actions
  highlight: {
    50: '#E8F8F5',
    100: '#D1F2EB',
    200: '#A3E4D7',
    300: '#76E4C3', // Main highlight color - Fresh Mint
    400: '#48D1A6',
    500: '#1ABC9C',
    600: '#17A589',
    700: '#148F77',
    800: '#117864',
    900: '#0E6251',
  },

  // Neutral: Grays and background colors
  neutral: {
    50: '#F7FBFC', // Light background
    100: '#EBF4F7',
    200: '#D9E7ED',
    300: '#C7DAE3',
    400: '#B5CDD9',
    500: '#627D98', // Muted text
    600: '#486581',
    700: '#334E68',
    800: '#243B53',
    900: '#102A43', // Dark text
  },

  // Semantic colors for states and feedback
  semantic: {
    success: {
      light: '#76E4C3', // Using highlight color
      main: '#1ABC9C',
      dark: '#148F77',
    },
    warning: {
      light: '#FFE082',
      main: '#FFC107',
      dark: '#FF8F00',
    },
    error: {
      light: '#EF5350',
      main: '#D32F2F',
      dark: '#C62828',
    },
    info: {
      light: '#4DD0E1', // Using accent color
      main: '#00BCD4',
      dark: '#0097A7',
    },
  },
};

/**
 * Dark mode color mappings
 * Maintains aquatic feel with deeper ocean tones
 * Ensures WCAG AA contrast ratios
 */
export const darkModeColors: DarkModeColors = {
  background: {
    primary: '#0B1F2E', // Deep ocean night
    secondary: '#152A3B', // Slightly lighter
    surface: '#1E3A4F', // Card/surface background
    elevated: '#27475E', // Elevated surfaces (modals, dropdowns)
  },

  text: {
    primary: '#E3F2FD', // High contrast white-blue
    secondary: '#B3E5FC', // Medium contrast
    muted: '#81D4FA', // Lower contrast for subtle text
  },

  border: {
    default: '#27475E',
    subtle: '#1E3A4F',
  },

  // Adjusted brand colors for dark backgrounds
  primary: '#4FC3F7', // Lighter pool blue for visibility
  secondary: '#29B6F6', // Lighter secondary
  accent: '#4DD0E1', // Accent remains vibrant
  highlight: '#76E4C3', // Highlight remains fresh
};

/**
 * Export individual color constants for convenient access
 */
export const DEEP_OCEAN = '#0A3D62';
export const POOL_BLUE = '#1B7FBD';
export const AQUA = '#4DD0E1';
export const FRESH_MINT = '#76E4C3';
export const LIGHT_BACKGROUND = '#F7FBFC';
export const SURFACE_WHITE = '#FFFFFF';
export const TEXT_PRIMARY = '#102A43';
export const TEXT_MUTED = '#627D98';

/**
 * Helper function to get color value by key path
 * Example: getColor('primary.500') returns '#0A3D62'
 */
export function getColor(path: string): string {
  const keys = path.split('.');
  let value: any = colors;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Color path "${path}" not found`);
      return '#000000'; // Fallback
    }
  }

  return typeof value === 'string' ? value : '#000000';
}

/**
 * Helper function to get dark mode color by key path
 * Example: getDarkColor('background.primary') returns '#0B1F2E'
 */
export function getDarkColor(path: string): string {
  const keys = path.split('.');
  let value: any = darkModeColors;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Dark color path "${path}" not found`);
      return '#FFFFFF'; // Fallback
    }
  }

  return typeof value === 'string' ? value : '#FFFFFF';
}
