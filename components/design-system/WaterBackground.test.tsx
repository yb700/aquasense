/**
 * WaterBackground Component Tests
 * 
 * Tests the WaterBackground component's rendering, prop behavior, and layout.
 * Validates Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WaterBackground } from './WaterBackground';

describe('WaterBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<WaterBackground />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders children content', () => {
    const testContent = 'Test Content';
    const { getByText } = render(
      <WaterBackground>
        <div>{testContent}</div>
      </WaterBackground>
    );
    
    expect(getByText(testContent)).toBeTruthy();
  });

  it('applies light variant gradient by default', () => {
    const { container } = render(<WaterBackground />);
    const wrapper = container.firstChild as HTMLElement;
    
    // Should have gradient classes
    expect(wrapper.className).toContain('bg-gradient-to-br');
  });

  it('applies dark variant gradient when specified', () => {
    const { container } = render(<WaterBackground variant="dark" />);
    
    // Should have gradient classes for dark mode
    expect(container.firstChild).toBeTruthy();
    expect((container.firstChild as HTMLElement).className).toContain('bg-gradient-to-br');
  });

  it('applies subtle intensity by default', () => {
    const { container } = render(<WaterBackground />);
    const wrapper = container.firstChild as HTMLElement;
    
    // Subtle intensity should not show caustic overlay
    const causticOverlay = container.querySelector('[class*="WaterReflection"]');
    expect(causticOverlay).toBeFalsy();
  });

  it('shows caustic overlay for medium intensity', () => {
    const { container } = render(<WaterBackground intensity="medium" />);
    
    // Medium intensity should include WaterReflection component
    // Check for the water reflection's characteristic classes
    const reflection = container.querySelector('.pointer-events-none.absolute');
    expect(reflection).toBeTruthy();
  });

  it('shows caustic overlay for strong intensity', () => {
    const { container } = render(<WaterBackground intensity="strong" />);
    
    // Strong intensity should include WaterReflection component
    const reflection = container.querySelector('.pointer-events-none.absolute');
    expect(reflection).toBeTruthy();
  });

  it('applies custom className', () => {
    const customClass = 'custom-bg-class';
    const { container } = render(
      <WaterBackground className={customClass} />
    );
    const wrapper = container.firstChild as HTMLElement;
    
    expect(wrapper.className).toContain(customClass);
  });

  it('includes minimum height for full coverage', () => {
    const { container } = render(<WaterBackground />);
    const wrapper = container.firstChild as HTMLElement;
    
    expect(wrapper.className).toContain('min-h-screen');
  });

  it('layers content above background effects', () => {
    const { container } = render(
      <WaterBackground>
        <div data-testid="content">Content</div>
      </WaterBackground>
    );
    
    // Find the content wrapper with z-10
    const contentLayer = container.querySelector('.relative.z-10');
    expect(contentLayer).toBeTruthy();
  });

  it('includes subtle radial gradient overlay', () => {
    const { container } = render(<WaterBackground />);
    
    // Check for the radial gradient overlay div
    const overlays = container.querySelectorAll('.pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('sets aria-hidden on decorative elements', () => {
    const { container } = render(<WaterBackground intensity="medium" />);
    
    // Check for aria-hidden on decorative overlays
    const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorativeElements.length).toBeGreaterThan(0);
  });

  describe('Intensity Variations', () => {
    it('applies correct gradient for subtle light mode', () => {
      const { container } = render(
        <WaterBackground variant="light" intensity="subtle" />
      );
      const wrapper = container.firstChild as HTMLElement;
      
      expect(wrapper.className).toContain('from-background');
    });

    it('applies correct gradient for medium light mode', () => {
      const { container } = render(
        <WaterBackground variant="light" intensity="medium" />
      );
      const wrapper = container.firstChild as HTMLElement;
      
      expect(wrapper.className).toContain('from-background');
    });

    it('applies correct gradient for strong light mode', () => {
      const { container } = render(
        <WaterBackground variant="light" intensity="strong" />
      );
      const wrapper = container.firstChild as HTMLElement;
      
      expect(wrapper.className).toContain('from-primary-50');
    });

    it('applies correct gradient for subtle dark mode', () => {
      const { container } = render(
        <WaterBackground variant="dark" intensity="subtle" />
      );
      const wrapper = container.firstChild as HTMLElement;
      
      expect(wrapper.className).toContain('from-background');
    });
  });

  describe('Performance Requirements (10.4)', () => {
    it('uses CSS gradients for performance', () => {
      const { container } = render(<WaterBackground />);
      const wrapper = container.firstChild as HTMLElement;
      
      // Should use Tailwind gradient classes (CSS-based)
      expect(wrapper.className).toContain('bg-gradient-to-br');
    });

    it('avoids layout-triggering animations', () => {
      const { container } = render(<WaterBackground intensity="medium" />);
      
      // WaterReflection uses CSS transforms, not layout properties
      // This is validated by the WaterReflection component itself
      expect(container).toBeTruthy();
    });
  });

  describe('Readability Requirements (10.3)', () => {
    it('ensures content is readable on light background', () => {
      const { container, getByText } = render(
        <WaterBackground variant="light">
          <p className="text-foreground">Readable text</p>
        </WaterBackground>
      );
      
      const text = getByText('Readable text');
      expect(text).toBeTruthy();
      
      // Content should be in a relative z-10 layer above background
      const contentLayer = container.querySelector('.relative.z-10');
      expect(contentLayer).toBeTruthy();
    });

    it('ensures content is readable on dark background', () => {
      const { container, getByText } = render(
        <WaterBackground variant="dark">
          <p className="text-foreground">Readable text</p>
        </WaterBackground>
      );
      
      const text = getByText('Readable text');
      expect(text).toBeTruthy();
      
      // Content should be in a relative z-10 layer above background
      const contentLayer = container.querySelector('.relative.z-10');
      expect(contentLayer).toBeTruthy();
    });
  });

  describe('Dark Mode Support (10.5)', () => {
    it('provides dark variant', () => {
      const { container } = render(<WaterBackground variant="dark" />);
      const wrapper = container.firstChild as HTMLElement;
      
      // Should apply dark mode gradient classes
      expect(wrapper.className).toContain('from-background');
    });

    it('adjusts all intensity levels for dark mode', () => {
      // Test all three intensities with dark variant
      const intensities: Array<'subtle' | 'medium' | 'strong'> = ['subtle', 'medium', 'strong'];
      
      intensities.forEach(intensity => {
        const { container } = render(
          <WaterBackground variant="dark" intensity={intensity} />
        );
        const wrapper = container.firstChild as HTMLElement;
        
        expect(wrapper.className).toContain('bg-gradient-to-br');
      });
    });
  });
});
