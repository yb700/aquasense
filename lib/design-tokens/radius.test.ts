/**
 * Test suite for AquaSense border radius system design tokens
 */

import { describe, it, expect } from 'vitest';
import {
  borderRadius,
  componentRadius,
  directionalRadius,
  responsiveRadius,
  getRadius,
  getComponentRadius,
  getDirectionalRadius,
  getResponsiveRadius,
  createCustomRadius,
  type BorderRadiusScale,
} from './radius';

describe('Border Radius System', () => {
  describe('Base Radius Scale', () => {
    it('should define all radius sizes', () => {
      expect(borderRadius.none).toBe('0');
      expect(borderRadius.sm).toBe('0.375rem');   // 6px
      expect(borderRadius.base).toBe('0.5rem');   // 8px
      expect(borderRadius.md).toBe('0.75rem');    // 12px
      expect(borderRadius.lg).toBe('1rem');       // 16px
      expect(borderRadius.xl).toBe('1.5rem');     // 24px
      expect(borderRadius['2xl']).toBe('2rem');   // 32px
      expect(borderRadius.full).toBe('9999px');
    });

    it('should use rem units except for full', () => {
      expect(borderRadius.sm).toContain('rem');
      expect(borderRadius.base).toContain('rem');
      expect(borderRadius.md).toContain('rem');
      expect(borderRadius.lg).toContain('rem');
      expect(borderRadius.full).toBe('9999px');
    });

    it('should have valid CSS radius format', () => {
      const remPattern = /^(0|[0-9.]+rem|9999px)$/;
      
      Object.values(borderRadius).forEach((value) => {
        expect(value).toMatch(remPattern);
      });
    });

    it('should increase progressively', () => {
      const toPixels = (value: string): number => {
        if (value === '0') return 0;
        if (value === '9999px') return 9999;
        return parseFloat(value.replace('rem', '')) * 16;
      };

      const sizes = [
        borderRadius.none,
        borderRadius.sm,
        borderRadius.base,
        borderRadius.md,
        borderRadius.lg,
        borderRadius.xl,
        borderRadius['2xl'],
      ];

      for (let i = 1; i < sizes.length; i++) {
        expect(toPixels(sizes[i])).toBeGreaterThan(toPixels(sizes[i - 1]));
      }
    });
  });

  describe('Component Radius', () => {
    describe('Button Radius', () => {
      it('should define button radius sizes', () => {
        expect(componentRadius.button.sm).toBeDefined();
        expect(componentRadius.button.md).toBeDefined();
        expect(componentRadius.button.lg).toBeDefined();
        expect(componentRadius.button.pill).toBeDefined();
      });

      it('should use base radius for standard buttons', () => {
        expect(componentRadius.button.md).toBe(borderRadius.base);
      });

      it('should use full radius for pill buttons', () => {
        expect(componentRadius.button.pill).toBe(borderRadius.full);
      });
    });

    describe('Input Radius', () => {
      it('should define input radius variants', () => {
        expect(componentRadius.input.default).toBeDefined();
        expect(componentRadius.input.small).toBeDefined();
      });

      it('should use medium radius for default inputs', () => {
        expect(componentRadius.input.default).toBe(borderRadius.md);
      });
    });

    describe('Card Radius', () => {
      it('should define card radius variants', () => {
        expect(componentRadius.card.default).toBeDefined();
        expect(componentRadius.card.large).toBeDefined();
        expect(componentRadius.card.hero).toBeDefined();
      });

      it('should use medium radius for default cards', () => {
        expect(componentRadius.card.default).toBe(borderRadius.md);
      });

      it('should increase radius for prominent cards', () => {
        const toPixels = (value: string): number => {
          return parseFloat(value.replace('rem', '')) * 16;
        };

        const defaultSize = toPixels(componentRadius.card.default);
        const largeSize = toPixels(componentRadius.card.large);
        const heroSize = toPixels(componentRadius.card.hero);

        expect(largeSize).toBeGreaterThan(defaultSize);
        expect(heroSize).toBeGreaterThan(largeSize);
      });
    });

    describe('Modal Radius', () => {
      it('should define modal radius variants', () => {
        expect(componentRadius.modal.default).toBeDefined();
        expect(componentRadius.modal.large).toBeDefined();
      });

      it('should use large radius for modals', () => {
        expect(componentRadius.modal.default).toBe(borderRadius.lg);
      });
    });

    describe('Navigation Radius', () => {
      it('should define navigation radius', () => {
        expect(componentRadius.nav.item).toBeDefined();
        expect(componentRadius.nav.rail).toBeDefined();
      });
    });

    describe('Badge Radius', () => {
      it('should define badge radius variants', () => {
        expect(componentRadius.badge.default).toBeDefined();
        expect(componentRadius.badge.pill).toBeDefined();
      });

      it('should support pill-shaped badges', () => {
        expect(componentRadius.badge.pill).toBe(borderRadius.full);
      });
    });

    describe('Avatar Radius', () => {
      it('should define avatar radius variants', () => {
        expect(componentRadius.avatar.square).toBeDefined();
        expect(componentRadius.avatar.circle).toBeDefined();
      });

      it('should support circular avatars', () => {
        expect(componentRadius.avatar.circle).toBe(borderRadius.full);
      });
    });

    describe('Image Radius', () => {
      it('should define image radius variants', () => {
        expect(componentRadius.image.thumbnail).toBeDefined();
        expect(componentRadius.image.default).toBeDefined();
        expect(componentRadius.image.large).toBeDefined();
      });
    });

    describe('Tooltip and Dropdown Radius', () => {
      it('should define tooltip radius', () => {
        expect(componentRadius.tooltip.default).toBeDefined();
      });

      it('should define dropdown radius', () => {
        expect(componentRadius.dropdown.menu).toBeDefined();
      });
    });

    describe('Container Radius', () => {
      it('should define container radius variants', () => {
        expect(componentRadius.container.default).toBeDefined();
        expect(componentRadius.container.section).toBeDefined();
      });
    });
  });

  describe('Directional Radius', () => {
    it('should define all directions', () => {
      expect(directionalRadius.top).toBeDefined();
      expect(directionalRadius.bottom).toBeDefined();
      expect(directionalRadius.left).toBeDefined();
      expect(directionalRadius.right).toBeDefined();
    });

    it('should define all sizes for each direction', () => {
      const directions = ['top', 'bottom', 'left', 'right'] as const;
      const sizes = ['sm', 'base', 'md', 'lg', 'xl'] as const;

      directions.forEach((direction) => {
        sizes.forEach((size) => {
          expect(directionalRadius[direction][size]).toBeDefined();
        });
      });
    });

    it('should apply radius only to specified corners for top', () => {
      // Top should be: topLeft topRight 0 0
      expect(directionalRadius.top.md).toContain('0 0');
      expect(directionalRadius.top.md.split(' ').slice(2).join(' ')).toBe('0 0');
    });

    it('should apply radius only to specified corners for bottom', () => {
      // Bottom should be: 0 0 bottomRight bottomLeft
      expect(directionalRadius.bottom.md).toMatch(/^0 0/);
    });

    it('should have four values for each directional radius', () => {
      const allDirectionalRadii = [
        ...Object.values(directionalRadius.top),
        ...Object.values(directionalRadius.bottom),
        ...Object.values(directionalRadius.left),
        ...Object.values(directionalRadius.right),
      ];

      allDirectionalRadii.forEach((radius) => {
        const parts = radius.split(' ');
        expect(parts.length).toBe(4);
      });
    });
  });

  describe('Responsive Radius', () => {
    it('should define responsive radius for cards', () => {
      expect(responsiveRadius.card.mobile).toBeDefined();
      expect(responsiveRadius.card.tablet).toBeDefined();
      expect(responsiveRadius.card.desktop).toBeDefined();
    });

    it('should define responsive radius for containers', () => {
      expect(responsiveRadius.container.mobile).toBeDefined();
      expect(responsiveRadius.container.tablet).toBeDefined();
      expect(responsiveRadius.container.desktop).toBeDefined();
    });

    it('should define responsive radius for modals', () => {
      expect(responsiveRadius.modal.mobile).toBeDefined();
      expect(responsiveRadius.modal.tablet).toBeDefined();
      expect(responsiveRadius.modal.desktop).toBeDefined();
    });

    it('should increase or maintain radius from mobile to desktop', () => {
      const toPixels = (value: string): number => {
        return parseFloat(value.replace('rem', '')) * 16;
      };

      const cardMobile = toPixels(responsiveRadius.card.mobile);
      const cardTablet = toPixels(responsiveRadius.card.tablet);
      const cardDesktop = toPixels(responsiveRadius.card.desktop);

      expect(cardTablet).toBeGreaterThanOrEqual(cardMobile);
      expect(cardDesktop).toBeGreaterThanOrEqual(cardTablet);
    });
  });

  describe('Helper Functions', () => {
    describe('getRadius', () => {
      it('should retrieve radius by key', () => {
        expect(getRadius('none')).toBe('0');
        expect(getRadius('sm')).toBe('0.375rem');
        expect(getRadius('md')).toBe('0.75rem');
        expect(getRadius('full')).toBe('9999px');
      });

      it('should work for all radius keys', () => {
        const keys: (keyof BorderRadiusScale)[] = [
          'none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', 'full'
        ];
        
        keys.forEach((key) => {
          const value = getRadius(key);
          expect(value).toBeDefined();
          expect(typeof value).toBe('string');
        });
      });
    });

    describe('getComponentRadius', () => {
      it('should retrieve component radius by path', () => {
        expect(getComponentRadius('button.md')).toBe(componentRadius.button.md);
        expect(getComponentRadius('card.default')).toBe(componentRadius.card.default);
        expect(getComponentRadius('input.default')).toBe(componentRadius.input.default);
      });

      it('should handle nested paths', () => {
        expect(getComponentRadius('modal.large')).toBe(componentRadius.modal.large);
        expect(getComponentRadius('avatar.circle')).toBe(componentRadius.avatar.circle);
        expect(getComponentRadius('container.section')).toBe(componentRadius.container.section);
      });

      it('should return default radius for invalid path', () => {
        const result = getComponentRadius('invalid.path');
        expect(result).toBe(borderRadius.md);
      });
    });

    describe('getDirectionalRadius', () => {
      it('should retrieve directional radius', () => {
        const topMd = getDirectionalRadius('top', 'md');
        expect(topMd).toBe(directionalRadius.top.md);

        const bottomLg = getDirectionalRadius('bottom', 'lg');
        expect(bottomLg).toBe(directionalRadius.bottom.lg);
      });

      it('should work for all directions', () => {
        const directions: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right'];
        
        directions.forEach((direction) => {
          const result = getDirectionalRadius(direction, 'md');
          expect(result).toBeDefined();
          expect(typeof result).toBe('string');
        });
      });

      it('should work for all sizes', () => {
        const sizes: ('sm' | 'base' | 'md' | 'lg' | 'xl')[] = ['sm', 'base', 'md', 'lg', 'xl'];
        
        sizes.forEach((size) => {
          const result = getDirectionalRadius('top', size);
          expect(result).toBeDefined();
          expect(typeof result).toBe('string');
        });
      });
    });

    describe('getResponsiveRadius', () => {
      it('should retrieve responsive radius', () => {
        expect(getResponsiveRadius('card', 'mobile')).toBe(responsiveRadius.card.mobile);
        expect(getResponsiveRadius('container', 'desktop')).toBe(responsiveRadius.container.desktop);
        expect(getResponsiveRadius('modal', 'tablet')).toBe(responsiveRadius.modal.tablet);
      });

      it('should work for all components', () => {
        const components: ('card' | 'container' | 'modal')[] = ['card', 'container', 'modal'];
        
        components.forEach((component) => {
          const result = getResponsiveRadius(component, 'mobile');
          expect(result).toBeDefined();
          expect(typeof result).toBe('string');
        });
      });

      it('should work for all breakpoints', () => {
        const breakpoints: ('mobile' | 'tablet' | 'desktop')[] = ['mobile', 'tablet', 'desktop'];
        
        breakpoints.forEach((breakpoint) => {
          const result = getResponsiveRadius('card', breakpoint);
          expect(result).toBeDefined();
          expect(typeof result).toBe('string');
        });
      });
    });

    describe('createCustomRadius', () => {
      it('should create radius with all corners specified', () => {
        const result = createCustomRadius({
          topLeft: 'md',
          topRight: 'sm',
          bottomRight: 'none',
          bottomLeft: 'lg',
        });

        expect(result).toContain(borderRadius.md);
        expect(result).toContain(borderRadius.sm);
        expect(result).toContain('0');
        expect(result).toContain(borderRadius.lg);
      });

      it('should handle partial corner specifications', () => {
        const result = createCustomRadius({
          topLeft: 'md',
          topRight: 'md',
        });

        // Unspecified corners should be 0
        expect(result.split(' ').length).toBe(4);
      });

      it('should create valid CSS radius format', () => {
        const result = createCustomRadius({
          topLeft: 'lg',
          topRight: 'lg',
          bottomRight: 'sm',
          bottomLeft: 'sm',
        });

        const parts = result.split(' ');
        expect(parts.length).toBe(4);
      });

      it('should handle empty object', () => {
        const result = createCustomRadius({});
        expect(result).toBe('0 0 0 0');
      });

      it('should handle full radius for specific corners', () => {
        const result = createCustomRadius({
          topLeft: 'full',
          bottomRight: 'full',
        });

        expect(result).toContain('9999px');
      });
    });
  });

  describe('Type Safety', () => {
    it('should have correct BorderRadiusScale type structure', () => {
      const radiusScale: BorderRadiusScale = borderRadius;
      
      expect(radiusScale.none).toBeDefined();
      expect(radiusScale.sm).toBeDefined();
      expect(radiusScale.md).toBeDefined();
      expect(radiusScale.full).toBeDefined();
    });

    it('should enforce string values for radius', () => {
      Object.values(borderRadius).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('Consistency', () => {
    it('should use base radius in component radius', () => {
      // Component radius should reference base radius system
      expect(componentRadius.button.md).toBe(borderRadius.base);
      expect(componentRadius.card.default).toBe(borderRadius.md);
      expect(componentRadius.modal.default).toBe(borderRadius.lg);
    });

    it('should use base radius in responsive radius', () => {
      const allResponsiveRadii = [
        ...Object.values(responsiveRadius.card),
        ...Object.values(responsiveRadius.container),
        ...Object.values(responsiveRadius.modal),
      ];

      allResponsiveRadii.forEach((radius) => {
        expect(Object.values(borderRadius)).toContain(radius);
      });
    });

    it('should use base radius in directional radius', () => {
      // Check that directional radius uses base radius values
      expect(directionalRadius.top.md).toContain(borderRadius.md);
      expect(directionalRadius.bottom.lg).toContain(borderRadius.lg);
    });
  });
});
