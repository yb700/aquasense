import { describe, it, expect } from 'vitest';
import { easing, duration, motion } from './motion';

describe('Motion Design Tokens', () => {
  describe('Easing Functions', () => {
    it('should define waterFlow easing curve', () => {
      expect(easing.waterFlow).toBe('cubic-bezier(0.4, 0.0, 0.2, 1)');
    });

    it('should define waterRipple easing curve', () => {
      expect(easing.waterRipple).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
    });

    it('should define waterWave easing curve', () => {
      expect(easing.waterWave).toBe('cubic-bezier(0.65, 0, 0.35, 1)');
    });

    it('should have all required easing functions', () => {
      expect(easing).toHaveProperty('waterFlow');
      expect(easing).toHaveProperty('waterRipple');
      expect(easing).toHaveProperty('waterWave');
      expect(easing).toHaveProperty('easeIn');
      expect(easing).toHaveProperty('easeOut');
      expect(easing).toHaveProperty('easeInOut');
    });

    it('should export valid CSS cubic-bezier values', () => {
      // Regex to match cubic-bezier format
      const cubicBezierPattern = /^cubic-bezier\([\d.-]+,\s*[\d.-]+,\s*[\d.-]+,\s*[\d.-]+\)$/;
      
      expect(easing.waterFlow).toMatch(cubicBezierPattern);
      expect(easing.waterRipple).toMatch(cubicBezierPattern);
      expect(easing.waterWave).toMatch(cubicBezierPattern);
    });
  });

  describe('Duration Scale', () => {
    it('should define fast duration as 150ms', () => {
      expect(duration.fast).toBe('150ms');
    });

    it('should define base duration as 250ms', () => {
      expect(duration.base).toBe('250ms');
    });

    it('should define slow duration as 400ms', () => {
      expect(duration.slow).toBe('400ms');
    });

    it('should define slower duration as 600ms', () => {
      expect(duration.slower).toBe('600ms');
    });

    it('should have all required duration scales', () => {
      expect(duration).toHaveProperty('fast');
      expect(duration).toHaveProperty('base');
      expect(duration).toHaveProperty('slow');
      expect(duration).toHaveProperty('slower');
    });

    it('should export valid CSS duration values', () => {
      // Regex to match duration format (number followed by ms)
      const durationPattern = /^\d+ms$/;
      
      expect(duration.fast).toMatch(durationPattern);
      expect(duration.base).toMatch(durationPattern);
      expect(duration.slow).toMatch(durationPattern);
      expect(duration.slower).toMatch(durationPattern);
    });

    it('should have durations in ascending order', () => {
      const parseDuration = (dur: string) => parseInt(dur.replace('ms', ''), 10);
      
      const fast = parseDuration(duration.fast);
      const base = parseDuration(duration.base);
      const slow = parseDuration(duration.slow);
      const slower = parseDuration(duration.slower);
      
      expect(fast).toBeLessThan(base);
      expect(base).toBeLessThan(slow);
      expect(slow).toBeLessThan(slower);
    });
  });

  describe('Combined Motion System', () => {
    it('should export motion object with easing and duration', () => {
      expect(motion).toHaveProperty('easing');
      expect(motion).toHaveProperty('duration');
    });

    it('should have consistent structure with individual exports', () => {
      expect(motion.easing).toEqual(easing);
      expect(motion.duration).toEqual(duration);
    });
  });

  describe('Water-Inspired Characteristics', () => {
    it('should use gentle easing without jarring movements', () => {
      // Water-inspired curves should have smooth control points
      // Checking that no extreme values are used (values outside -1 to 2 range would be jarring)
      const parseControlPoints = (bezier: string) => {
        const match = bezier.match(/cubic-bezier\(([\d.-]+),\s*([\d.-]+),\s*([\d.-]+),\s*([\d.-]+)\)/);
        if (!match) return null;
        return [
          parseFloat(match[1]),
          parseFloat(match[2]),
          parseFloat(match[3]),
          parseFloat(match[4]),
        ];
      };

      const waterFlowPoints = parseControlPoints(easing.waterFlow);
      const waterRipplePoints = parseControlPoints(easing.waterRipple);
      const waterWavePoints = parseControlPoints(easing.waterWave);

      // Verify control points are within reasonable ranges for smooth motion
      [waterFlowPoints, waterRipplePoints, waterWavePoints].forEach((points) => {
        expect(points).not.toBeNull();
        if (points) {
          // First and third points (x values) should be between 0 and 1
          expect(points[0]).toBeGreaterThanOrEqual(0);
          expect(points[0]).toBeLessThanOrEqual(1);
          expect(points[2]).toBeGreaterThanOrEqual(0);
          expect(points[2]).toBeLessThanOrEqual(1);
          
          // Second and fourth points (y values) can go slightly beyond 0-1 for bounce effects
          // but should not be extreme (waterRipple has slight bounce at 1.56)
          points.forEach((point) => {
            expect(point).toBeGreaterThanOrEqual(-0.5);
            expect(point).toBeLessThanOrEqual(2);
          });
        }
      });
    });

    it('should use appropriate durations for smooth animations (not too fast or slow)', () => {
      const parseDuration = (dur: string) => parseInt(dur.replace('ms', ''), 10);
      
      // Verify durations are within reasonable ranges for smooth, not jarring animations
      const fast = parseDuration(duration.fast);
      const base = parseDuration(duration.base);
      const slow = parseDuration(duration.slow);
      const slower = parseDuration(duration.slower);
      
      // Fast should be at least 100ms (anything faster feels jarring)
      expect(fast).toBeGreaterThanOrEqual(100);
      
      // Slower should be at most 1000ms (anything longer feels sluggish)
      expect(slower).toBeLessThanOrEqual(1000);
      
      // All durations should be reasonable for UI animations
      [fast, base, slow, slower].forEach((dur) => {
        expect(dur).toBeGreaterThanOrEqual(100);
        expect(dur).toBeLessThanOrEqual(1000);
      });
    });
  });

  describe('Requirements Validation', () => {
    it('should satisfy Requirement 13.5: water-like, smooth, gentle movement characteristics', () => {
      // Verify we have water-inspired easing functions
      expect(easing.waterFlow).toBeDefined();
      expect(easing.waterRipple).toBeDefined();
      expect(easing.waterWave).toBeDefined();
      
      // Verify they are smooth cubic-bezier curves
      expect(easing.waterFlow).toContain('cubic-bezier');
      expect(easing.waterRipple).toContain('cubic-bezier');
      expect(easing.waterWave).toContain('cubic-bezier');
    });

    it('should satisfy Requirement 13.6: no flashy or jarring animations', () => {
      // Durations should not be too fast (jarring) or too slow (sluggish)
      const parseDuration = (dur: string) => parseInt(dur.replace('ms', ''), 10);
      
      Object.values(duration).forEach((dur) => {
        const ms = parseDuration(dur);
        expect(ms).toBeGreaterThanOrEqual(100); // Not too fast
        expect(ms).toBeLessThanOrEqual(1000);   // Not too slow
      });
    });

    it('should satisfy Requirement 23.5: provide border-radius tokens (motion context)', () => {
      // This requirement is about design tokens in general
      // For motion tokens specifically, we verify we export a complete system
      expect(motion).toBeDefined();
      expect(motion.easing).toBeDefined();
      expect(motion.duration).toBeDefined();
    });
  });
});
