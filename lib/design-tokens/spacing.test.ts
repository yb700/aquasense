/**
 * Test suite for AquaSense spacing system design tokens
 */

import { describe, it, expect } from 'vitest';
import {
  spacing,
  componentSpacing,
  responsiveSpacing,
  getSpacing,
  calculateSpacing,
  getComponentSpacing,
  type SpacingScale,
} from './spacing';

describe('Spacing System', () => {
  describe('Base Spacing Scale', () => {
    it('should define spacing based on 4px base unit', () => {
      expect(spacing[0]).toBe('0');
      expect(spacing[1]).toBe('0.25rem');  // 4px
      expect(spacing[2]).toBe('0.5rem');   // 8px
      expect(spacing[3]).toBe('0.75rem');  // 12px
      expect(spacing[4]).toBe('1rem');     // 16px
      expect(spacing[5]).toBe('1.25rem');  // 20px
      expect(spacing[6]).toBe('1.5rem');   // 24px
      expect(spacing[8]).toBe('2rem');     // 32px
      expect(spacing[10]).toBe('2.5rem');  // 40px
      expect(spacing[12]).toBe('3rem');    // 48px
      expect(spacing[16]).toBe('4rem');    // 64px
      expect(spacing[20]).toBe('5rem');    // 80px
      expect(spacing[24]).toBe('6rem');    // 96px
      expect(spacing[32]).toBe('8rem');    // 128px
    });

    it('should use rem units for all spacing values', () => {
      const remPattern = /^(0|[0-9.]+rem)$/;
      
      Object.values(spacing).forEach((value) => {
        expect(value).toMatch(remPattern);
      });
    });

    it('should follow 4px increments', () => {
      // Convert rem to pixels (1rem = 16px)
      const toPixels = (rem: string): number => {
        if (rem === '0') return 0;
        return parseFloat(rem.replace('rem', '')) * 16;
      };

      // Check that each value is a multiple of 4
      Object.values(spacing).forEach((value) => {
        const pixels = toPixels(value);
        expect(pixels % 4).toBe(0);
      });
    });
  });

  describe('Component Spacing', () => {
    describe('Touch Targets', () => {
      it('should define minimum touch target sizes', () => {
        expect(componentSpacing.touchTarget.sm).toBe('2.75rem'); // 44px
        expect(componentSpacing.touchTarget.md).toBe('3rem');    // 48px
        expect(componentSpacing.touchTarget.lg).toBe('3.5rem');  // 56px
      });

      it('should meet minimum 44px touch target requirement', () => {
        const smPixels = parseFloat(componentSpacing.touchTarget.sm.replace('rem', '')) * 16;
        expect(smPixels).toBeGreaterThanOrEqual(44);
      });
    });

    describe('Padding Presets', () => {
      it('should define padding sizes', () => {
        expect(componentSpacing.padding.xs).toBe(spacing[2]);  // 8px
        expect(componentSpacing.padding.sm).toBe(spacing[3]);  // 12px
        expect(componentSpacing.padding.md).toBe(spacing[4]);  // 16px
        expect(componentSpacing.padding.lg).toBe(spacing[6]);  // 24px
        expect(componentSpacing.padding.xl).toBe(spacing[8]);  // 32px
      });
    });

    describe('Gap Presets', () => {
      it('should define gap sizes', () => {
        expect(componentSpacing.gap.xs).toBe(spacing[1]);  // 4px
        expect(componentSpacing.gap.sm).toBe(spacing[2]);  // 8px
        expect(componentSpacing.gap.md).toBe(spacing[4]);  // 16px
        expect(componentSpacing.gap.lg).toBe(spacing[6]);  // 24px
        expect(componentSpacing.gap.xl).toBe(spacing[8]);  // 32px
      });
    });

    describe('Section Spacing', () => {
      it('should define responsive section spacing', () => {
        expect(componentSpacing.section.mobile).toBe(spacing[12]);   // 48px
        expect(componentSpacing.section.tablet).toBe(spacing[16]);   // 64px
        expect(componentSpacing.section.desktop).toBe(spacing[20]);  // 80px
      });

      it('should increase section spacing from mobile to desktop', () => {
        const mobile = parseFloat(componentSpacing.section.mobile.replace('rem', ''));
        const tablet = parseFloat(componentSpacing.section.tablet.replace('rem', ''));
        const desktop = parseFloat(componentSpacing.section.desktop.replace('rem', ''));

        expect(tablet).toBeGreaterThan(mobile);
        expect(desktop).toBeGreaterThan(tablet);
      });
    });

    describe('Container Padding', () => {
      it('should define responsive container padding', () => {
        expect(componentSpacing.container.mobile).toBe(spacing[4]);   // 16px
        expect(componentSpacing.container.tablet).toBe(spacing[6]);   // 24px
        expect(componentSpacing.container.desktop).toBe(spacing[8]);  // 32px
      });
    });

    describe('Card Spacing', () => {
      it('should define card padding and gap', () => {
        expect(componentSpacing.card.padding).toBe(spacing[6]); // 24px
        expect(componentSpacing.card.gap).toBe(spacing[4]);     // 16px
      });
    });

    describe('Form Spacing', () => {
      it('should define form spacing presets', () => {
        expect(componentSpacing.form.fieldGap).toBe(spacing[4]);  // 16px
        expect(componentSpacing.form.labelGap).toBe(spacing[2]);  // 8px
        expect(componentSpacing.form.groupGap).toBe(spacing[8]);  // 32px
      });
    });

    describe('Navigation Spacing', () => {
      it('should define navigation spacing', () => {
        expect(componentSpacing.nav.itemGap).toBe(spacing[2]);  // 8px
        expect(componentSpacing.nav.padding).toBe(spacing[4]);  // 16px
      });
    });
  });

  describe('Responsive Spacing', () => {
    it('should define responsive vertical spacing', () => {
      expect(responsiveSpacing.componentY.mobile).toBe(spacing[4]);   // 16px
      expect(responsiveSpacing.componentY.tablet).toBe(spacing[6]);   // 24px
      expect(responsiveSpacing.componentY.desktop).toBe(spacing[8]);  // 32px
    });

    it('should define responsive horizontal spacing', () => {
      expect(responsiveSpacing.componentX.mobile).toBe(spacing[3]);   // 12px
      expect(responsiveSpacing.componentX.tablet).toBe(spacing[4]);   // 16px
      expect(responsiveSpacing.componentX.desktop).toBe(spacing[6]);  // 24px
    });
  });

  describe('Helper Functions', () => {
    describe('getSpacing', () => {
      it('should retrieve spacing by key', () => {
        expect(getSpacing(0)).toBe('0');
        expect(getSpacing(4)).toBe('1rem');
        expect(getSpacing(8)).toBe('2rem');
        expect(getSpacing(16)).toBe('4rem');
      });

      it('should work for all spacing scale keys', () => {
        const keys: (keyof SpacingScale)[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];
        
        keys.forEach((key) => {
          const value = getSpacing(key);
          expect(value).toBeDefined();
          expect(typeof value).toBe('string');
        });
      });
    });

    describe('calculateSpacing', () => {
      it('should calculate spacing based on multiplier', () => {
        expect(calculateSpacing(0)).toBe('0rem');
        expect(calculateSpacing(1)).toBe('0.25rem');  // 4px
        expect(calculateSpacing(2)).toBe('0.5rem');   // 8px
        expect(calculateSpacing(4)).toBe('1rem');     // 16px
        expect(calculateSpacing(8)).toBe('2rem');     // 32px
      });

      it('should handle fractional multipliers', () => {
        expect(calculateSpacing(1.5)).toBe('0.375rem'); // 6px
        expect(calculateSpacing(2.5)).toBe('0.625rem'); // 10px
      });

      it('should calculate correct pixel values', () => {
        // 1 multiplier = 4px, 1rem = 16px
        const result = calculateSpacing(3); // Should be 12px = 0.75rem
        const pixels = parseFloat(result.replace('rem', '')) * 16;
        expect(pixels).toBe(12);
      });
    });

    describe('getComponentSpacing', () => {
      it('should retrieve component spacing by path', () => {
        expect(getComponentSpacing('padding.md')).toBe(spacing[4]);
        expect(getComponentSpacing('gap.sm')).toBe(spacing[2]);
        expect(getComponentSpacing('section.mobile')).toBe(spacing[12]);
      });

      it('should handle nested paths', () => {
        expect(getComponentSpacing('touchTarget.sm')).toBe('2.75rem');
        expect(getComponentSpacing('container.desktop')).toBe(spacing[8]);
        expect(getComponentSpacing('form.fieldGap')).toBe(spacing[4]);
      });

      it('should return default spacing for invalid path', () => {
        const result = getComponentSpacing('invalid.path');
        expect(result).toBe(spacing[4]); // Default to base spacing
      });
    });
  });

  describe('Type Safety', () => {
    it('should have correct SpacingScale type structure', () => {
      const spacingScale: SpacingScale = spacing;
      
      expect(spacingScale[0]).toBeDefined();
      expect(spacingScale[1]).toBeDefined();
      expect(spacingScale[4]).toBeDefined();
      expect(spacingScale[8]).toBeDefined();
      expect(spacingScale[32]).toBeDefined();
    });

    it('should enforce string values for spacing', () => {
      Object.values(spacing).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('Consistency', () => {
    it('should use base spacing values in component spacing', () => {
      // All component spacing should reference base spacing values
      expect(Object.values(spacing)).toContain(componentSpacing.padding.md);
      expect(Object.values(spacing)).toContain(componentSpacing.gap.md);
      expect(Object.values(spacing)).toContain(componentSpacing.card.padding);
    });

    it('should maintain proportional scaling', () => {
      const mobile = parseFloat(componentSpacing.section.mobile.replace('rem', ''));
      const tablet = parseFloat(componentSpacing.section.tablet.replace('rem', ''));
      const desktop = parseFloat(componentSpacing.section.desktop.replace('rem', ''));

      // Each step should be a reasonable increase
      expect(tablet / mobile).toBeGreaterThan(1);
      expect(tablet / mobile).toBeLessThan(2);
      expect(desktop / tablet).toBeGreaterThan(1);
      expect(desktop / tablet).toBeLessThan(2);
    });
  });
});
