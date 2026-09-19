/**
 * Test suite for AquaSense color system design tokens
 */

import { describe, it, expect } from 'vitest';
import {
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
  type ColorSystem,
  type DarkModeColors,
} from './colors';

describe('Color System', () => {
  describe('Primary Brand Colors', () => {
    it('should define Deep Ocean as primary color', () => {
      expect(colors.primary[500]).toBe('#0A3D62');
      expect(DEEP_OCEAN).toBe('#0A3D62');
    });

    it('should define Pool Blue as secondary color', () => {
      expect(colors.secondary[500]).toBe('#1B7FBD');
      expect(POOL_BLUE).toBe('#1B7FBD');
    });

    it('should define Aqua as accent color', () => {
      expect(colors.accent[300]).toBe('#4DD0E1');
      expect(AQUA).toBe('#4DD0E1');
    });

    it('should define Fresh Mint as highlight color', () => {
      expect(colors.highlight[300]).toBe('#76E4C3');
      expect(FRESH_MINT).toBe('#76E4C3');
    });
  });

  describe('Neutral Colors', () => {
    it('should define light background color', () => {
      expect(colors.neutral[50]).toBe('#F7FBFC');
      expect(LIGHT_BACKGROUND).toBe('#F7FBFC');
    });

    it('should define muted text color', () => {
      expect(colors.neutral[500]).toBe('#627D98');
      expect(TEXT_MUTED).toBe('#627D98');
    });

    it('should define dark text color', () => {
      expect(colors.neutral[900]).toBe('#102A43');
      expect(TEXT_PRIMARY).toBe('#102A43');
    });

    it('should define surface white constant', () => {
      expect(SURFACE_WHITE).toBe('#FFFFFF');
    });
  });

  describe('Semantic Colors', () => {
    it('should define success color using highlight', () => {
      expect(colors.semantic.success.light).toBe('#76E4C3');
      expect(colors.semantic.success.main).toBe('#1ABC9C');
      expect(colors.semantic.success.dark).toBe('#148F77');
    });

    it('should define warning colors', () => {
      expect(colors.semantic.warning.light).toBe('#FFE082');
      expect(colors.semantic.warning.main).toBe('#FFC107');
      expect(colors.semantic.warning.dark).toBe('#FF8F00');
    });

    it('should define error colors', () => {
      expect(colors.semantic.error.light).toBe('#EF5350');
      expect(colors.semantic.error.main).toBe('#D32F2F');
      expect(colors.semantic.error.dark).toBe('#C62828');
    });

    it('should define info color using accent', () => {
      expect(colors.semantic.info.light).toBe('#4DD0E1');
      expect(colors.semantic.info.main).toBe('#00BCD4');
      expect(colors.semantic.info.dark).toBe('#0097A7');
    });
  });

  describe('Color Scales', () => {
    it('should have 10 shades for each color scale', () => {
      const scales: (keyof Pick<ColorSystem, 'primary' | 'secondary' | 'accent' | 'highlight' | 'neutral'>)[] = [
        'primary',
        'secondary',
        'accent',
        'highlight',
        'neutral',
      ];

      scales.forEach((scale) => {
        const colorScale = colors[scale];
        expect(colorScale[50]).toBeDefined();
        expect(colorScale[100]).toBeDefined();
        expect(colorScale[200]).toBeDefined();
        expect(colorScale[300]).toBeDefined();
        expect(colorScale[400]).toBeDefined();
        expect(colorScale[500]).toBeDefined();
        expect(colorScale[600]).toBeDefined();
        expect(colorScale[700]).toBeDefined();
        expect(colorScale[800]).toBeDefined();
        expect(colorScale[900]).toBeDefined();
      });
    });

    it('should have valid hex color format for all shades', () => {
      const hexColorPattern = /^#[0-9A-F]{6}$/i;

      const scales: (keyof Pick<ColorSystem, 'primary' | 'secondary' | 'accent' | 'highlight' | 'neutral'>)[] = [
        'primary',
        'secondary',
        'accent',
        'highlight',
        'neutral',
      ];

      scales.forEach((scale) => {
        const colorScale = colors[scale];
        Object.values(colorScale).forEach((color) => {
          expect(color).toMatch(hexColorPattern);
        });
      });
    });
  });

  describe('Dark Mode Colors', () => {
    it('should define dark background colors', () => {
      expect(darkModeColors.background.primary).toBe('#0B1F2E');
      expect(darkModeColors.background.secondary).toBe('#152A3B');
      expect(darkModeColors.background.surface).toBe('#1E3A4F');
      expect(darkModeColors.background.elevated).toBe('#27475E');
    });

    it('should define dark text colors', () => {
      expect(darkModeColors.text.primary).toBe('#E3F2FD');
      expect(darkModeColors.text.secondary).toBe('#B3E5FC');
      expect(darkModeColors.text.muted).toBe('#81D4FA');
    });

    it('should define dark border colors', () => {
      expect(darkModeColors.border.default).toBe('#27475E');
      expect(darkModeColors.border.subtle).toBe('#1E3A4F');
    });

    it('should define adjusted brand colors for dark mode', () => {
      expect(darkModeColors.primary).toBe('#4FC3F7');
      expect(darkModeColors.secondary).toBe('#29B6F6');
      expect(darkModeColors.accent).toBe('#4DD0E1');
      expect(darkModeColors.highlight).toBe('#76E4C3');
    });

    it('should have valid hex color format for all dark colors', () => {
      const hexColorPattern = /^#[0-9A-F]{6}$/i;

      // Check all nested dark mode colors
      expect(darkModeColors.background.primary).toMatch(hexColorPattern);
      expect(darkModeColors.background.secondary).toMatch(hexColorPattern);
      expect(darkModeColors.background.surface).toMatch(hexColorPattern);
      expect(darkModeColors.background.elevated).toMatch(hexColorPattern);

      expect(darkModeColors.text.primary).toMatch(hexColorPattern);
      expect(darkModeColors.text.secondary).toMatch(hexColorPattern);
      expect(darkModeColors.text.muted).toMatch(hexColorPattern);

      expect(darkModeColors.border.default).toMatch(hexColorPattern);
      expect(darkModeColors.border.subtle).toMatch(hexColorPattern);

      expect(darkModeColors.primary).toMatch(hexColorPattern);
      expect(darkModeColors.secondary).toMatch(hexColorPattern);
      expect(darkModeColors.accent).toMatch(hexColorPattern);
      expect(darkModeColors.highlight).toMatch(hexColorPattern);
    });
  });

  describe('Helper Functions', () => {
    describe('getColor', () => {
      it('should retrieve color by path', () => {
        expect(getColor('primary.500')).toBe('#0A3D62');
        expect(getColor('secondary.500')).toBe('#1B7FBD');
        expect(getColor('accent.300')).toBe('#4DD0E1');
        expect(getColor('highlight.300')).toBe('#76E4C3');
      });

      it('should retrieve nested semantic colors', () => {
        expect(getColor('semantic.success.main')).toBe('#1ABC9C');
        expect(getColor('semantic.warning.main')).toBe('#FFC107');
        expect(getColor('semantic.error.main')).toBe('#D32F2F');
        expect(getColor('semantic.info.main')).toBe('#00BCD4');
      });

      it('should return fallback for invalid path', () => {
        expect(getColor('invalid.path')).toBe('#000000');
        expect(getColor('primary.1000')).toBe('#000000');
      });
    });

    describe('getDarkColor', () => {
      it('should retrieve dark color by path', () => {
        expect(getDarkColor('background.primary')).toBe('#0B1F2E');
        expect(getDarkColor('text.primary')).toBe('#E3F2FD');
        expect(getDarkColor('border.default')).toBe('#27475E');
      });

      it('should retrieve root-level dark colors', () => {
        expect(getDarkColor('primary')).toBe('#4FC3F7');
        expect(getDarkColor('secondary')).toBe('#29B6F6');
        expect(getDarkColor('accent')).toBe('#4DD0E1');
        expect(getDarkColor('highlight')).toBe('#76E4C3');
      });

      it('should return fallback for invalid path', () => {
        expect(getDarkColor('invalid.path')).toBe('#FFFFFF');
        expect(getDarkColor('background.invalid')).toBe('#FFFFFF');
      });
    });
  });

  describe('Type Safety', () => {
    it('should have correct ColorSystem type structure', () => {
      const colorSystem: ColorSystem = colors;
      
      expect(colorSystem.primary).toBeDefined();
      expect(colorSystem.secondary).toBeDefined();
      expect(colorSystem.accent).toBeDefined();
      expect(colorSystem.highlight).toBeDefined();
      expect(colorSystem.neutral).toBeDefined();
      expect(colorSystem.semantic).toBeDefined();
    });

    it('should have correct DarkModeColors type structure', () => {
      const darkColors: DarkModeColors = darkModeColors;
      
      expect(darkColors.background).toBeDefined();
      expect(darkColors.text).toBeDefined();
      expect(darkColors.border).toBeDefined();
      expect(darkColors.primary).toBeDefined();
      expect(darkColors.secondary).toBeDefined();
      expect(darkColors.accent).toBeDefined();
      expect(darkColors.highlight).toBeDefined();
    });
  });
});
