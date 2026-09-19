/**
 * Test suite for AquaSense shadow system design tokens
 */

import { describe, it, expect } from 'vitest';
import {
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
  type ShadowSystem,
} from './shadows';

describe('Shadow System', () => {
  describe('Light Mode Shadows', () => {
    it('should define all shadow sizes', () => {
      expect(shadows.sm).toBeDefined();
      expect(shadows.base).toBeDefined();
      expect(shadows.md).toBeDefined();
      expect(shadows.lg).toBeDefined();
      expect(shadows.xl).toBeDefined();
      expect(shadows['2xl']).toBeDefined();
    });

    it('should define special effect shadows', () => {
      expect(shadows.glass).toBeDefined();
      expect(shadows.water).toBeDefined();
    });

    it('should use Deep Ocean color (10, 61, 98) in shadows', () => {
      expect(shadows.sm).toContain('rgba(10, 61, 98');
      expect(shadows.base).toContain('rgba(10, 61, 98');
      expect(shadows.md).toContain('rgba(10, 61, 98');
      expect(shadows.lg).toContain('rgba(10, 61, 98');
    });

    it('should use Aqua color (77, 208, 225) in water shadow', () => {
      expect(shadows.water).toContain('rgba(77, 208, 225');
    });

    it('should have valid CSS shadow format', () => {
      // Basic shadow format: offset-x offset-y blur spread color
      // More flexible pattern to handle various shadow formats
      const shadowPattern = /^(inset\s+)?-?\d+(\s+|px\s+)-?\d+(\s+|px\s+)\d+(\s+|px\s+)(\d+(\s+|px\s+))?rgba?\([^)]+\)$/;
      
      Object.entries(shadows).forEach(([key, value]) => {
        // Glass shadow has multiple shadows separated by comma (but not inside rgba())
        if (key === 'glass') {
          // Split by comma, but only outside of rgba() parentheses
          const parts = value.split(/,\s*(?![^(]*\))/);
          parts.forEach((part) => {
            expect(part.trim()).toMatch(shadowPattern);
          });
        } else {
          expect(value).toMatch(shadowPattern);
        }
      });
    });

    it('should increase shadow depth progressively', () => {
      // Extract blur radius from shadow strings
      const getBlur = (shadow: string): number => {
        const match = shadow.match(/0\s+(\d+)px/);
        return match ? parseInt(match[1]) : 0;
      };

      const smBlur = getBlur(shadows.sm);
      const baseBlur = getBlur(shadows.base);
      const mdBlur = getBlur(shadows.md);
      const lgBlur = getBlur(shadows.lg);
      const xlBlur = getBlur(shadows.xl);

      expect(baseBlur).toBeGreaterThan(smBlur);
      expect(mdBlur).toBeGreaterThan(baseBlur);
      expect(lgBlur).toBeGreaterThan(mdBlur);
      expect(xlBlur).toBeGreaterThan(lgBlur);
    });

    it('should increase shadow opacity progressively', () => {
      // Extract opacity from rgba
      const getOpacity = (shadow: string): number => {
        const match = shadow.match(/rgba\([^)]+,\s*([\d.]+)\)/);
        return match ? parseFloat(match[1]) : 0;
      };

      const smOpacity = getOpacity(shadows.sm);
      const baseOpacity = getOpacity(shadows.base);
      const mdOpacity = getOpacity(shadows.md);
      const lgOpacity = getOpacity(shadows.lg);

      expect(baseOpacity).toBeGreaterThanOrEqual(smOpacity);
      expect(mdOpacity).toBeGreaterThanOrEqual(baseOpacity);
      expect(lgOpacity).toBeGreaterThanOrEqual(mdOpacity);
    });
  });

  describe('Dark Mode Shadows', () => {
    it('should define all shadow sizes for dark mode', () => {
      expect(darkShadows.sm).toBeDefined();
      expect(darkShadows.base).toBeDefined();
      expect(darkShadows.md).toBeDefined();
      expect(darkShadows.lg).toBeDefined();
      expect(darkShadows.xl).toBeDefined();
      expect(darkShadows['2xl']).toBeDefined();
    });

    it('should define special effect shadows for dark mode', () => {
      expect(darkShadows.glass).toBeDefined();
      expect(darkShadows.water).toBeDefined();
    });

    it('should use black (0, 0, 0) in dark mode shadows', () => {
      expect(darkShadows.sm).toContain('rgba(0, 0, 0');
      expect(darkShadows.base).toContain('rgba(0, 0, 0');
      expect(darkShadows.md).toContain('rgba(0, 0, 0');
      expect(darkShadows.lg).toContain('rgba(0, 0, 0');
    });

    it('should have higher opacity than light mode shadows', () => {
      const getOpacity = (shadow: string): number => {
        const match = shadow.match(/rgba\([^)]+,\s*([\d.]+)\)/);
        return match ? parseFloat(match[1]) : 0;
      };

      // Compare base shadows
      const lightOpacity = getOpacity(shadows.base);
      const darkOpacity = getOpacity(darkShadows.base);

      expect(darkOpacity).toBeGreaterThan(lightOpacity);
    });
  });

  describe('Component Shadows', () => {
    describe('Button Shadows', () => {
      it('should define button shadow states', () => {
        expect(componentShadows.button.rest).toBeDefined();
        expect(componentShadows.button.hover).toBeDefined();
        expect(componentShadows.button.active).toBeDefined();
      });

      it('should increase shadow on hover', () => {
        expect(componentShadows.button.hover).not.toBe(componentShadows.button.rest);
      });

      it('should use inset shadow for active state', () => {
        expect(componentShadows.button.active).toContain('inset');
      });
    });

    describe('Card Shadows', () => {
      it('should define card shadow states', () => {
        expect(componentShadows.card.rest).toBeDefined();
        expect(componentShadows.card.hover).toBeDefined();
        expect(componentShadows.card.elevated).toBeDefined();
      });

      it('should progressively increase card elevation', () => {
        expect(componentShadows.card.hover).not.toBe(componentShadows.card.rest);
        expect(componentShadows.card.elevated).not.toBe(componentShadows.card.hover);
      });
    });

    describe('Input Shadows', () => {
      it('should define input shadow states', () => {
        expect(componentShadows.input.rest).toBeDefined();
        expect(componentShadows.input.focus).toBeDefined();
        expect(componentShadows.input.error).toBeDefined();
      });

      it('should use inset shadow for rest state', () => {
        expect(componentShadows.input.rest).toContain('inset');
      });

      it('should include focus ring with Aqua color', () => {
        expect(componentShadows.input.focus).toContain('rgba(77, 208, 225');
      });

      it('should include error ring with red color', () => {
        expect(componentShadows.input.error).toContain('rgba(211, 47, 47');
      });
    });

    describe('Navigation Shadows', () => {
      it('should define navigation shadows', () => {
        expect(componentShadows.nav.rail).toBeDefined();
        expect(componentShadows.nav.bottom).toBeDefined();
      });

      it('should use upward shadow for bottom navigation', () => {
        // Bottom nav shadow should have negative Y offset
        expect(componentShadows.nav.bottom).toContain('0 -');
      });
    });

    describe('Modal Shadows', () => {
      it('should define modal shadows', () => {
        expect(componentShadows.modal.backdrop).toBeDefined();
        expect(componentShadows.modal.surface).toBeDefined();
      });

      it('should use inset shadow for modal backdrop', () => {
        expect(componentShadows.modal.backdrop).toContain('inset');
      });
    });

    describe('Dropdown and Tooltip Shadows', () => {
      it('should define dropdown shadows', () => {
        expect(componentShadows.dropdown.menu).toBeDefined();
      });

      it('should define tooltip shadows', () => {
        expect(componentShadows.tooltip.default).toBeDefined();
      });
    });
  });

  describe('Dark Component Shadows', () => {
    it('should define all component shadows for dark mode', () => {
      expect(darkComponentShadows.button).toBeDefined();
      expect(darkComponentShadows.card).toBeDefined();
      expect(darkComponentShadows.input).toBeDefined();
      expect(darkComponentShadows.nav).toBeDefined();
      expect(darkComponentShadows.modal).toBeDefined();
      expect(darkComponentShadows.dropdown).toBeDefined();
      expect(darkComponentShadows.tooltip).toBeDefined();
    });

    it('should maintain same structure as light mode', () => {
      expect(Object.keys(darkComponentShadows)).toEqual(Object.keys(componentShadows));
    });
  });

  describe('Elevation System', () => {
    it('should define 7 elevation levels (0-6)', () => {
      expect(elevation[0]).toBe('none');
      expect(elevation[1]).toBe(shadows.sm);
      expect(elevation[2]).toBe(shadows.base);
      expect(elevation[3]).toBe(shadows.md);
      expect(elevation[4]).toBe(shadows.lg);
      expect(elevation[5]).toBe(shadows.xl);
      expect(elevation[6]).toBe(shadows['2xl']);
    });

    it('should define dark elevation levels', () => {
      expect(darkElevation[0]).toBe('none');
      expect(darkElevation[1]).toBe(darkShadows.sm);
      expect(darkElevation[2]).toBe(darkShadows.base);
      expect(darkElevation[6]).toBe(darkShadows['2xl']);
    });

    it('should map elevation levels consistently', () => {
      expect(darkElevation[0]).toBe(elevation[0]); // Both should be 'none'
    });
  });

  describe('Helper Functions', () => {
    describe('getShadow', () => {
      it('should retrieve shadow by key', () => {
        expect(getShadow('sm')).toBe(shadows.sm);
        expect(getShadow('base')).toBe(shadows.base);
        expect(getShadow('md')).toBe(shadows.md);
        expect(getShadow('glass')).toBe(shadows.glass);
      });

      it('should work for all shadow keys', () => {
        const keys: (keyof ShadowSystem)[] = ['sm', 'base', 'md', 'lg', 'xl', '2xl', 'glass', 'water'];
        
        keys.forEach((key) => {
          const value = getShadow(key);
          expect(value).toBeDefined();
          expect(typeof value).toBe('string');
        });
      });
    });

    describe('getDarkShadow', () => {
      it('should retrieve dark shadow by key', () => {
        expect(getDarkShadow('sm')).toBe(darkShadows.sm);
        expect(getDarkShadow('base')).toBe(darkShadows.base);
        expect(getDarkShadow('water')).toBe(darkShadows.water);
      });

      it('should return different values than light mode', () => {
        expect(getDarkShadow('base')).not.toBe(getShadow('base'));
      });
    });

    describe('getComponentShadow', () => {
      it('should retrieve component shadow by path', () => {
        expect(getComponentShadow('button.rest')).toBe(componentShadows.button.rest);
        expect(getComponentShadow('card.hover')).toBe(componentShadows.card.hover);
        expect(getComponentShadow('input.focus')).toBe(componentShadows.input.focus);
      });

      it('should return dark mode shadows when isDark is true', () => {
        const lightShadow = getComponentShadow('button.rest', false);
        const darkShadow = getComponentShadow('button.rest', true);
        
        expect(lightShadow).toBe(componentShadows.button.rest);
        expect(darkShadow).toBe(darkComponentShadows.button.rest);
        expect(lightShadow).not.toBe(darkShadow);
      });

      it('should return fallback for invalid path', () => {
        const result = getComponentShadow('invalid.path');
        expect(result).toBe(shadows.base);
      });

      it('should return dark fallback for invalid path in dark mode', () => {
        const result = getComponentShadow('invalid.path', true);
        expect(result).toBe(darkShadows.base);
      });
    });

    describe('getElevationShadow', () => {
      it('should retrieve shadow by elevation level', () => {
        expect(getElevationShadow(0)).toBe('none');
        expect(getElevationShadow(1)).toBe(shadows.sm);
        expect(getElevationShadow(2)).toBe(shadows.base);
        expect(getElevationShadow(6)).toBe(shadows['2xl']);
      });

      it('should return dark shadows when isDark is true', () => {
        expect(getElevationShadow(2, false)).toBe(shadows.base);
        expect(getElevationShadow(2, true)).toBe(darkShadows.base);
      });

      it('should work for all elevation levels', () => {
        const levels: (0 | 1 | 2 | 3 | 4 | 5 | 6)[] = [0, 1, 2, 3, 4, 5, 6];
        
        levels.forEach((level) => {
          const lightValue = getElevationShadow(level, false);
          const darkValue = getElevationShadow(level, true);
          
          expect(lightValue).toBeDefined();
          expect(darkValue).toBeDefined();
        });
      });
    });
  });

  describe('Type Safety', () => {
    it('should have correct ShadowSystem type structure', () => {
      const shadowSystem: ShadowSystem = shadows;
      
      expect(shadowSystem.sm).toBeDefined();
      expect(shadowSystem.base).toBeDefined();
      expect(shadowSystem.glass).toBeDefined();
      expect(shadowSystem.water).toBeDefined();
    });

    it('should enforce string values for shadows', () => {
      Object.values(shadows).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('Consistency', () => {
    it('should use base shadows in component shadows', () => {
      // Component shadows should reference base shadow system
      expect(componentShadows.card.rest).toBe(shadows.base);
      expect(componentShadows.button.rest).toBe(shadows.sm);
    });

    it('should use dark shadows in dark component shadows', () => {
      expect(darkComponentShadows.card.rest).toBe(darkShadows.base);
      expect(darkComponentShadows.button.rest).toBe(darkShadows.sm);
    });

    it('should maintain parallel structure between light and dark', () => {
      const lightKeys = Object.keys(componentShadows);
      const darkKeys = Object.keys(darkComponentShadows);
      
      expect(darkKeys).toEqual(lightKeys);
    });
  });
});
