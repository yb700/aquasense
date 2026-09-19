/**
 * WaterReflection Component Tests
 * 
 * Tests the WaterReflection component's rendering and prop behavior.
 * Animation testing is minimal as Framer Motion handles the actual animation logic.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WaterReflection } from './WaterReflection';

describe('WaterReflection', () => {
  it('renders without crashing', () => {
    const { container } = render(<WaterReflection />);
    expect(container.firstChild).toBeTruthy();
  });

  it('applies default opacity of 0.1', () => {
    const { container } = render(<WaterReflection />);
    const wrapper = container.firstChild as HTMLElement;
    
    // Check if the component has the expected opacity style
    expect(wrapper).toHaveStyle({ opacity: '0.1' });
  });

  it('applies custom opacity prop', () => {
    const { container } = render(<WaterReflection opacity={0.5} />);
    const wrapper = container.firstChild as HTMLElement;
    
    expect(wrapper).toHaveStyle({ opacity: '0.5' });
  });

  it('clamps opacity to valid range (0-1)', () => {
    // Test upper bound
    const { container: container1 } = render(<WaterReflection opacity={1.5} />);
    const wrapper1 = container1.firstChild as HTMLElement;
    expect(wrapper1).toHaveStyle({ opacity: '1' });

    // Test lower bound
    const { container: container2 } = render(<WaterReflection opacity={-0.2} />);
    const wrapper2 = container2.firstChild as HTMLElement;
    expect(wrapper2).toHaveStyle({ opacity: '0' });
  });

  it('applies custom className', () => {
    const customClass = 'custom-water-class';
    const { container } = render(<WaterReflection className={customClass} />);
    const wrapper = container.firstChild as HTMLElement;
    
    expect(wrapper.className).toContain(customClass);
  });

  it('includes default positioning classes', () => {
    const { container } = render(<WaterReflection />);
    const wrapper = container.firstChild as HTMLElement;
    
    // Check for essential classes
    expect(wrapper.className).toContain('absolute');
    expect(wrapper.className).toContain('inset-0');
    expect(wrapper.className).toContain('pointer-events-none');
  });

  it('sets aria-hidden for accessibility', () => {
    const { container } = render(<WaterReflection />);
    const wrapper = container.firstChild as HTMLElement;
    
    expect(wrapper.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders two animated layers for depth', () => {
    const { container } = render(<WaterReflection />);
    
    // Should have two motion.div layers (primary and secondary)
    const layers = container.querySelectorAll('[class*="absolute inset-0"]');
    expect(layers.length).toBeGreaterThanOrEqual(2);
  });

  it('accepts speed prop without errors', () => {
    // Just verify it renders without crashing with different speed values
    expect(() => render(<WaterReflection speed={0.5} />)).not.toThrow();
    expect(() => render(<WaterReflection speed={2.0} />)).not.toThrow();
  });

  it('uses SVG background from assets', () => {
    const { container } = render(<WaterReflection />);
    
    // Check if background images reference the caustic SVG
    const backgroundElements = container.querySelectorAll('[style*="caustic.svg"]');
    expect(backgroundElements.length).toBeGreaterThan(0);
  });
});
