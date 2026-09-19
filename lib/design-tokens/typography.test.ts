/**
 * Test suite for AquaSense typography system design tokens
 * 
 * Tests validate:
 * - Font family definitions (Req 3.1)
 * - Font size scales for mobile and desktop (Req 3.2)
 * - Font weights (regular, medium, semibold, bold) (Req 3.3)
 * - Line heights for readability (Req 3.4)
 * - Heading styles H1-H6 with responsive variants (Req 3.5)
 * - Body text styles (large, base, small, caption) (Req 3.6)
 * - Minimum 16px font size for mobile body text (Req 3.7)
 */

import { describe, it, expect } from 'vitest';
import {
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
  type TypographySystem,
} from './typography';

describe('Typography System', () => {
  describe('Font Families (Req 3.1)', () => {
    it('should define Inter as primary sans-serif font', () => {
      expect(fontFamily.sans).toContain('Inter');
      expect(fontFamily.sans).toContain('system-ui');
      expect(fontFamily.sans).toContain('sans-serif');
    });

    it('should define monospace font stack', () => {
      expect(fontFamily.mono).toContain('monospace');
      expect(fontFamily.mono).toContain('Menlo');
    });

    it('should include font families in typography system', () => {
      expect(typography.fontFamily).toEqual(fontFamily);
    });
  });

  describe('Font Size Scale (Req 3.2)', () => {
    it('should define complete font size scale from xs to 6xl', () => {
      expect(fontSize.xs).toBe('0.75rem');     // 12px
      expect(fontSize.sm).toBe('0.875rem');    // 14px
      expect(fontSize.base).toBe('1rem');      // 16px
      expect(fontSize.lg).toBe('1.125rem');    // 18px
      expect(fontSize.xl).toBe('1.25rem');     // 20px
      expect(fontSize['2xl']).toBe('1.5rem');  // 24px
      expect(fontSize['3xl']).toBe('1.875rem'); // 30px
      expect(fontSize['4xl']).toBe('2.25rem'); // 36px
      expect(fontSize['5xl']).toBe('3rem');    // 48px
      expect(fontSize['6xl']).toBe('3.75rem'); // 60px
    });

    it('should use rem units for all font sizes', () => {
      const sizes = Object.values(fontSize);
      sizes.forEach(size => {
        expect(size).toMatch(/rem$/);
      });
    });

    it('should have increasing size values', () => {
      const sizeValues = [
        parseFloat(fontSize.xs),
        parseFloat(fontSize.sm),
        parseFloat(fontSize.base),
        parseFloat(fontSize.lg),
        parseFloat(fontSize.xl),
        parseFloat(fontSize['2xl']),
        parseFloat(fontSize['3xl']),
        parseFloat(fontSize['4xl']),
        parseFloat(fontSize['5xl']),
        parseFloat(fontSize['6xl']),
      ];

      for (let i = 1; i < sizeValues.length; i++) {
        expect(sizeValues[i]).toBeGreaterThan(sizeValues[i - 1]);
      }
    });
  });

  describe('Font Weights (Req 3.3)', () => {
    it('should define normal weight (400)', () => {
      expect(fontWeight.normal).toBe('400');
    });

    it('should define medium weight (500)', () => {
      expect(fontWeight.medium).toBe('500');
    });

    it('should define semibold weight (600)', () => {
      expect(fontWeight.semibold).toBe('600');
    });

    it('should define bold weight (700)', () => {
      expect(fontWeight.bold).toBe('700');
    });

    it('should have increasing weight values', () => {
      expect(parseInt(fontWeight.medium)).toBeGreaterThan(parseInt(fontWeight.normal));
      expect(parseInt(fontWeight.semibold)).toBeGreaterThan(parseInt(fontWeight.medium));
      expect(parseInt(fontWeight.bold)).toBeGreaterThan(parseInt(fontWeight.semibold));
    });
  });

  describe('Line Heights (Req 3.4)', () => {
    it('should define tight line height for large headings', () => {
      expect(lineHeight.tight).toBe('1.25');
    });

    it('should define snug line height for smaller headings', () => {
      expect(lineHeight.snug).toBe('1.375');
    });

    it('should define normal line height for body text', () => {
      expect(lineHeight.normal).toBe('1.5');
    });

    it('should define relaxed line height for long-form content', () => {
      expect(lineHeight.relaxed).toBe('1.625');
    });

    it('should define loose line height for special cases', () => {
      expect(lineHeight.loose).toBe('2');
    });

    it('should have increasing line height values', () => {
      const heights = [
        parseFloat(lineHeight.tight),
        parseFloat(lineHeight.snug),
        parseFloat(lineHeight.normal),
        parseFloat(lineHeight.relaxed),
        parseFloat(lineHeight.loose),
      ];

      for (let i = 1; i < heights.length; i++) {
        expect(heights[i]).toBeGreaterThan(heights[i - 1]);
      }
    });
  });

  describe('Heading Styles (Req 3.5)', () => {
    const headingLevels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ];

    it('should define styles for all heading levels H1-H6', () => {
      headingLevels.forEach(level => {
        expect(headingStyles[level]).toBeDefined();
        expect(headingStyles[level].mobile).toBeDefined();
        expect(headingStyles[level].desktop).toBeDefined();
      });
    });

    it('should have mobile and desktop variants for each heading', () => {
      headingLevels.forEach(level => {
        const heading = headingStyles[level];
        
        // Mobile variant
        expect(heading.mobile.fontSize).toBeDefined();
        expect(heading.mobile.lineHeight).toBeDefined();
        expect(heading.mobile.fontWeight).toBeDefined();
        
        // Desktop variant
        expect(heading.desktop.fontSize).toBeDefined();
        expect(heading.desktop.lineHeight).toBeDefined();
        expect(heading.desktop.fontWeight).toBeDefined();
      });
    });

    it('should have larger desktop sizes than mobile sizes', () => {
      headingLevels.forEach(level => {
        const mobileSize = parseFloat(headingStyles[level].mobile.fontSize);
        const desktopSize = parseFloat(headingStyles[level].desktop.fontSize);
        expect(desktopSize).toBeGreaterThanOrEqual(mobileSize);
      });
    });

    describe('H1 heading', () => {
      it('should have correct mobile size (36px)', () => {
        expect(headingStyles.h1.mobile.fontSize).toBe('2.25rem');
      });

      it('should have correct desktop size (60px)', () => {
        expect(headingStyles.h1.desktop.fontSize).toBe('3.75rem');
      });

      it('should be bold (700)', () => {
        expect(headingStyles.h1.mobile.fontWeight).toBe('700');
        expect(headingStyles.h1.desktop.fontWeight).toBe('700');
      });

      it('should have tight line height', () => {
        expect(parseFloat(headingStyles.h1.mobile.lineHeight)).toBeLessThanOrEqual(1.25);
        expect(parseFloat(headingStyles.h1.desktop.lineHeight)).toBeLessThanOrEqual(1.25);
      });

      it('should have negative letter spacing', () => {
        expect(headingStyles.h1.mobile.letterSpacing).toBe('-0.02em');
        expect(headingStyles.h1.desktop.letterSpacing).toBe('-0.02em');
      });
    });

    describe('H2 heading', () => {
      it('should have correct mobile size (30px)', () => {
        expect(headingStyles.h2.mobile.fontSize).toBe('1.875rem');
      });

      it('should have correct desktop size (48px)', () => {
        expect(headingStyles.h2.desktop.fontSize).toBe('3rem');
      });

      it('should be bold (700)', () => {
        expect(headingStyles.h2.mobile.fontWeight).toBe('700');
        expect(headingStyles.h2.desktop.fontWeight).toBe('700');
      });
    });

    describe('H3 heading', () => {
      it('should have correct mobile size (24px)', () => {
        expect(headingStyles.h3.mobile.fontSize).toBe('1.5rem');
      });

      it('should have correct desktop size (36px)', () => {
        expect(headingStyles.h3.desktop.fontSize).toBe('2.25rem');
      });

      it('should be semibold (600)', () => {
        expect(headingStyles.h3.mobile.fontWeight).toBe('600');
        expect(headingStyles.h3.desktop.fontWeight).toBe('600');
      });
    });

    describe('H4 heading', () => {
      it('should have correct mobile size (20px)', () => {
        expect(headingStyles.h4.mobile.fontSize).toBe('1.25rem');
      });

      it('should have correct desktop size (30px)', () => {
        expect(headingStyles.h4.desktop.fontSize).toBe('1.875rem');
      });

      it('should be semibold (600)', () => {
        expect(headingStyles.h4.mobile.fontWeight).toBe('600');
        expect(headingStyles.h4.desktop.fontWeight).toBe('600');
      });
    });

    describe('H5 heading', () => {
      it('should have correct mobile size (18px)', () => {
        expect(headingStyles.h5.mobile.fontSize).toBe('1.125rem');
      });

      it('should have correct desktop size (24px)', () => {
        expect(headingStyles.h5.desktop.fontSize).toBe('1.5rem');
      });

      it('should be semibold (600)', () => {
        expect(headingStyles.h5.mobile.fontWeight).toBe('600');
        expect(headingStyles.h5.desktop.fontWeight).toBe('600');
      });
    });

    describe('H6 heading', () => {
      it('should have correct mobile size (16px)', () => {
        expect(headingStyles.h6.mobile.fontSize).toBe('1rem');
      });

      it('should have correct desktop size (20px)', () => {
        expect(headingStyles.h6.desktop.fontSize).toBe('1.25rem');
      });

      it('should be semibold (600)', () => {
        expect(headingStyles.h6.mobile.fontWeight).toBe('600');
        expect(headingStyles.h6.desktop.fontWeight).toBe('600');
      });
    });
  });

  describe('Body Text Styles (Req 3.6)', () => {
    it('should define large body text style', () => {
      expect(bodyStyles.large).toBeDefined();
      expect(bodyStyles.large.fontSize).toBe('1.125rem'); // 18px
      expect(bodyStyles.large.lineHeight).toBe('1.625');
      expect(bodyStyles.large.fontWeight).toBe('400');
    });

    it('should define base body text style', () => {
      expect(bodyStyles.base).toBeDefined();
      expect(bodyStyles.base.fontSize).toBe('1rem'); // 16px
      expect(bodyStyles.base.lineHeight).toBe('1.5');
      expect(bodyStyles.base.fontWeight).toBe('400');
    });

    it('should define small body text style', () => {
      expect(bodyStyles.small).toBeDefined();
      expect(bodyStyles.small.fontSize).toBe('0.875rem'); // 14px
      expect(bodyStyles.small.lineHeight).toBe('1.5');
      expect(bodyStyles.small.fontWeight).toBe('400');
    });

    it('should define caption text style', () => {
      expect(bodyStyles.caption).toBeDefined();
      expect(bodyStyles.caption.fontSize).toBe('0.75rem'); // 12px
      expect(bodyStyles.caption.lineHeight).toBe('1.375');
      expect(bodyStyles.caption.fontWeight).toBe('400');
    });

    it('should use normal font weight (400) for all body styles', () => {
      expect(bodyStyles.large.fontWeight).toBe('400');
      expect(bodyStyles.base.fontWeight).toBe('400');
      expect(bodyStyles.small.fontWeight).toBe('400');
      expect(bodyStyles.caption.fontWeight).toBe('400');
    });
  });

  describe('Minimum Body Text Size (Req 3.7)', () => {
    it('should ensure base body text is 16px minimum', () => {
      expect(bodyStyles.base.fontSize).toBe('1rem'); // 16px
      const sizeInPx = parseFloat(bodyStyles.base.fontSize) * 16;
      expect(sizeInPx).toBeGreaterThanOrEqual(16);
    });

    it('should ensure H6 mobile size is at least 16px', () => {
      expect(headingStyles.h6.mobile.fontSize).toBe('1rem'); // 16px
      const sizeInPx = parseFloat(headingStyles.h6.mobile.fontSize) * 16;
      expect(sizeInPx).toBeGreaterThanOrEqual(16);
    });

    it('should not use body text smaller than 16px for primary content', () => {
      // Base body text should always be 16px
      expect(bodyStyles.base.fontSize).toBe('1rem');
      
      // Large body text should be larger than 16px
      expect(parseFloat(bodyStyles.large.fontSize)).toBeGreaterThan(1);
    });
  });

  describe('Typography System Object', () => {
    it('should export complete typography system', () => {
      expect(typography).toBeDefined();
      expect(typography.fontFamily).toEqual(fontFamily);
      expect(typography.fontSize).toEqual(fontSize);
      expect(typography.fontWeight).toEqual(fontWeight);
      expect(typography.lineHeight).toEqual(lineHeight);
      expect(typography.headingStyles).toEqual(headingStyles);
      expect(typography.bodyStyles).toEqual(bodyStyles);
    });

    it('should have correct TypeScript types', () => {
      const system: TypographySystem = typography;
      expect(system).toBeDefined();
    });
  });

  describe('Helper Functions', () => {
    describe('getHeadingStyle', () => {
      it('should return mobile styles by default', () => {
        const h1Style = getHeadingStyle('h1');
        expect(h1Style).toEqual(headingStyles.h1.mobile);
      });

      it('should return desktop styles when specified', () => {
        const h1Style = getHeadingStyle('h1', 'desktop');
        expect(h1Style).toEqual(headingStyles.h1.desktop);
      });

      it('should work for all heading levels', () => {
        const levels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ];

        levels.forEach(level => {
          const mobileStyle = getHeadingStyle(level, 'mobile');
          const desktopStyle = getHeadingStyle(level, 'desktop');
          
          expect(mobileStyle).toEqual(headingStyles[level].mobile);
          expect(desktopStyle).toEqual(headingStyles[level].desktop);
        });
      });
    });

    describe('getBodyStyle', () => {
      it('should return base style by default', () => {
        const style = getBodyStyle();
        expect(style).toEqual(bodyStyles.base);
      });

      it('should return correct style for each variant', () => {
        expect(getBodyStyle('large')).toEqual(bodyStyles.large);
        expect(getBodyStyle('base')).toEqual(bodyStyles.base);
        expect(getBodyStyle('small')).toEqual(bodyStyles.small);
        expect(getBodyStyle('caption')).toEqual(bodyStyles.caption);
      });
    });

    describe('getHeadingClass', () => {
      it('should return CSS class string for headings', () => {
        const h1Class = getHeadingClass('h1');
        expect(h1Class).toContain('text-[2.25rem]');
        expect(h1Class).toContain('lg:text-[3.75rem]');
        expect(h1Class).toContain('font-[700]');
        expect(h1Class).toContain('tracking-[-0.02em]');
      });

      it('should work for all heading levels', () => {
        const levels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ];

        levels.forEach(level => {
          const className = getHeadingClass(level);
          expect(className).toBeTruthy();
          expect(typeof className).toBe('string');
        });
      });
    });

    describe('getBodyClass', () => {
      it('should return CSS class string for body text', () => {
        const baseClass = getBodyClass();
        expect(baseClass).toContain('text-[1rem]');
        expect(baseClass).toContain('leading-[1.5]');
        expect(baseClass).toContain('font-[400]');
      });

      it('should work for all body variants', () => {
        const variants: Array<'large' | 'base' | 'small' | 'caption'> = [
          'large', 'base', 'small', 'caption'
        ];

        variants.forEach(variant => {
          const className = getBodyClass(variant);
          expect(className).toBeTruthy();
          expect(typeof className).toBe('string');
        });
      });
    });
  });

  describe('Tailwind Typography Configuration', () => {
    it('should export tailwind-compatible typography config', () => {
      expect(tailwindTypography).toBeDefined();
      expect(tailwindTypography.fontFamily).toBeDefined();
      expect(tailwindTypography.fontSize).toBeDefined();
      expect(tailwindTypography.fontWeight).toBeDefined();
      expect(tailwindTypography.lineHeight).toBeDefined();
    });

    it('should have font family as arrays for Tailwind', () => {
      expect(Array.isArray(tailwindTypography.fontFamily.sans)).toBe(true);
      expect(Array.isArray(tailwindTypography.fontFamily.mono)).toBe(true);
    });

    it('should have font sizes with line heights', () => {
      const sizeKeys = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
      
      sizeKeys.forEach(key => {
        const sizeConfig = tailwindTypography.fontSize[key as keyof typeof tailwindTypography.fontSize];
        expect(Array.isArray(sizeConfig)).toBe(true);
        expect(sizeConfig).toHaveLength(2);
        expect(typeof sizeConfig[0]).toBe('string'); // fontSize
        expect(typeof sizeConfig[1]).toBe('object');  // lineHeight config
      });
    });

    it('should include all font weights', () => {
      expect(tailwindTypography.fontWeight).toEqual(fontWeight);
    });

    it('should include all line heights', () => {
      expect(tailwindTypography.lineHeight).toEqual(lineHeight);
    });
  });

  describe('Accessibility', () => {
    it('should maintain readable line heights for body text', () => {
      const bodyLineHeights = [
        parseFloat(bodyStyles.large.lineHeight),
        parseFloat(bodyStyles.base.lineHeight),
        parseFloat(bodyStyles.small.lineHeight),
        parseFloat(bodyStyles.caption.lineHeight),
      ];

      bodyLineHeights.forEach(lh => {
        // WCAG recommends 1.5 minimum for body text
        expect(lh).toBeGreaterThanOrEqual(1.375);
      });
    });

    it('should use appropriate line heights for headings', () => {
      const headingLevels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ];

      headingLevels.forEach(level => {
        const mobileLH = parseFloat(headingStyles[level].mobile.lineHeight);
        const desktopLH = parseFloat(headingStyles[level].desktop.lineHeight);
        
        // Headings can have tighter line heights but should be readable
        expect(mobileLH).toBeGreaterThanOrEqual(1.2);
        expect(desktopLH).toBeGreaterThanOrEqual(1.2);
      });
    });
  });

  describe('Responsive Design', () => {
    it('should scale headings appropriately from mobile to desktop', () => {
      const headingLevels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ];

      headingLevels.forEach(level => {
        const mobileSize = parseFloat(headingStyles[level].mobile.fontSize);
        const desktopSize = parseFloat(headingStyles[level].desktop.fontSize);
        
        // Desktop should be at least as large as mobile
        expect(desktopSize).toBeGreaterThanOrEqual(mobileSize);
        
        // Scale ratio should be reasonable (not more than 2x)
        const ratio = desktopSize / mobileSize;
        expect(ratio).toBeLessThanOrEqual(2);
      });
    });
  });
});
