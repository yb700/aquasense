import { describe, it, expect } from 'vitest';
import * as designTokens from './index';

describe('Design Tokens Integration', () => {
  it('should export motion tokens from index', () => {
    expect(designTokens.easing).toBeDefined();
    expect(designTokens.duration).toBeDefined();
    expect(designTokens.motion).toBeDefined();
  });

  it('should allow importing motion system directly', () => {
    const { motion } = designTokens;
    
    expect(motion.easing.waterFlow).toBe('cubic-bezier(0.4, 0.0, 0.2, 1)');
    expect(motion.duration.base).toBe('250ms');
  });

  it('should support destructured imports', () => {
    const { easing, duration } = designTokens;
    
    expect(easing.waterRipple).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
    expect(duration.slow).toBe('400ms');
  });

  it('should be usable in component code', () => {
    const { motion } = designTokens;
    
    // Simulate CSS transition string
    const transition = `opacity ${motion.duration.base} ${motion.easing.waterFlow}`;
    expect(transition).toBe('opacity 250ms cubic-bezier(0.4, 0.0, 0.2, 1)');
    
    // Simulate transform transition
    const transformTransition = `transform ${motion.duration.slow} ${motion.easing.waterWave}`;
    expect(transformTransition).toBe('transform 400ms cubic-bezier(0.65, 0, 0.35, 1)');
  });

  it('should support Framer Motion duration conversion', () => {
    const { duration } = designTokens;
    
    // Convert ms string to seconds (as Framer Motion expects)
    const durationInSeconds = parseFloat(duration.base) / 1000;
    expect(durationInSeconds).toBe(0.25);
    
    const slowDurationInSeconds = parseFloat(duration.slow) / 1000;
    expect(slowDurationInSeconds).toBe(0.4);
  });

  it('should provide type safety for easing functions', () => {
    const { easing } = designTokens;
    
    // Verify all expected easing functions exist
    const expectedEasings: (keyof typeof easing)[] = [
      'waterFlow',
      'waterRipple',
      'waterWave',
      'easeIn',
      'easeOut',
      'easeInOut',
    ];
    
    expectedEasings.forEach((easingName) => {
      expect(easing[easingName]).toBeDefined();
      expect(typeof easing[easingName]).toBe('string');
    });
  });

  it('should provide type safety for duration scales', () => {
    const { duration } = designTokens;
    
    // Verify all expected durations exist
    const expectedDurations: (keyof typeof duration)[] = [
      'fast',
      'base',
      'slow',
      'slower',
    ];
    
    expectedDurations.forEach((durationName) => {
      expect(duration[durationName]).toBeDefined();
      expect(typeof duration[durationName]).toBe('string');
      expect(duration[durationName]).toMatch(/^\d+ms$/);
    });
  });
});
