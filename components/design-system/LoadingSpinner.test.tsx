import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  describe('Basic Rendering', () => {
    it('should render loading spinner component', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('should render with all props specified', () => {
      render(
        <LoadingSpinner
          size="lg"
          variant="circular"
          label="Loading data"
          color="#FF0000"
          className="custom-spinner"
        />
      );
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading data')).toBeInTheDocument();
    });
  });

  describe('Size Prop', () => {
    it('should use medium size by default', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '40');
      expect(svg).toHaveAttribute('height', '40');
    });

    it('should apply small size (24px)', () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should apply medium size (40px)', () => {
      const { container } = render(<LoadingSpinner size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '40');
      expect(svg).toHaveAttribute('height', '40');
    });

    it('should apply large size (64px)', () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '64');
      expect(svg).toHaveAttribute('height', '64');
    });

    it('should have correct viewBox for small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should have correct viewBox for medium size', () => {
      const { container } = render(<LoadingSpinner size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 40 40');
    });

    it('should have correct viewBox for large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
    });

    it('should have correct stroke width for small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      const circles = container.querySelectorAll('circle');
      expect(circles[0]).toHaveAttribute('stroke-width', '3');
      expect(circles[1]).toHaveAttribute('stroke-width', '3');
    });

    it('should have correct stroke width for medium size', () => {
      const { container } = render(<LoadingSpinner size="md" />);
      const circles = container.querySelectorAll('circle');
      expect(circles[0]).toHaveAttribute('stroke-width', '4');
      expect(circles[1]).toHaveAttribute('stroke-width', '4');
    });

    it('should have correct stroke width for large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const circles = container.querySelectorAll('circle');
      expect(circles[0]).toHaveAttribute('stroke-width', '6');
      expect(circles[1]).toHaveAttribute('stroke-width', '6');
    });
  });

  describe('Variant Prop', () => {
    it('should use circular variant by default', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply circular variant', () => {
      const { container } = render(<LoadingSpinner variant="circular" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('transform');
      expect(svg).toHaveClass('-rotate-90');
    });

    it('should apply default variant', () => {
      const { container } = render(<LoadingSpinner variant="default" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Label Prop', () => {
    it('should not display label when not provided', () => {
      render(<LoadingSpinner />);
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('should display label when provided', () => {
      render(<LoadingSpinner label="Loading data" />);
      expect(screen.getByText('Loading data')).toBeInTheDocument();
    });

    it('should render label with correct styles', () => {
      render(<LoadingSpinner label="Loading" />);
      const label = screen.getByText('Loading');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('text-muted-foreground');
    });

    it('should handle empty label string', () => {
      const { container } = render(<LoadingSpinner label="" />);
      // Empty label should not render the span element
      const labelSpan = container.querySelector('span');
      expect(labelSpan).not.toBeInTheDocument();
    });

    it('should handle long labels', () => {
      const longLabel = 'Loading a very long operation that might take some time';
      render(<LoadingSpinner label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });

  describe('Color Prop', () => {
    it('should use default accent color when not specified', () => {
      const { container } = render(<LoadingSpinner />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', '#4DD0E1');
    });

    it('should apply custom color', () => {
      const { container } = render(<LoadingSpinner color="#FF5733" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', '#FF5733');
    });

    it('should handle named colors', () => {
      const { container } = render(<LoadingSpinner color="blue" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', 'blue');
    });

    it('should handle RGB colors', () => {
      const { container } = render(<LoadingSpinner color="rgb(255, 0, 0)" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', 'rgb(255, 0, 0)');
    });

    it('should handle HSL colors', () => {
      const { container } = render(<LoadingSpinner color="hsl(200, 50%, 50%)" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', 'hsl(200, 50%, 50%)');
    });
  });

  describe('ClassName Prop', () => {
    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-spinner" />);
      const wrapper = container.querySelector('.custom-spinner');
      expect(wrapper).toBeInTheDocument();
    });

    it('should support multiple classNames', () => {
      const { container } = render(<LoadingSpinner className="class-one class-two" />);
      const wrapper = container.querySelector('.class-one');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('class-two');
    });

    it('should preserve base styles when custom className is applied', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toHaveClass('inline-flex');
      expect(wrapper).toHaveClass('flex-col');
    });

    it('should work without className prop', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have status role', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live="polite" attribute', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('should have default aria-label when no label provided', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('should use custom label in aria-label when provided', () => {
      render(<LoadingSpinner label="Loading content" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    });

    it('should handle empty label in aria-label', () => {
      render(<LoadingSpinner label="" />);
      const spinner = screen.getByRole('status');
      // Empty label should fallback to default "Loading"
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });
  });

  describe('SVG Structure', () => {
    it('should render SVG element', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.tagName).toBe('svg');
    });

    it('should have correct viewBox based on size', () => {
      const { container } = render(<LoadingSpinner size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 40 40');
    });

    it('should contain two circles (background and progress)', () => {
      const { container } = render(<LoadingSpinner />);
      const circles = container.querySelectorAll('circle');
      expect(circles).toHaveLength(2);
    });

    it('should have background circle with correct styling', () => {
      const { container } = render(<LoadingSpinner />);
      const backgroundCircle = container.querySelectorAll('circle')[0];
      expect(backgroundCircle).toHaveAttribute('stroke', '#E3F2FD');
      expect(backgroundCircle).toHaveAttribute('fill', 'none');
      expect(backgroundCircle).toHaveAttribute('opacity', '0.2');
    });

    it('should have progress circle with correct styling', () => {
      const { container } = render(<LoadingSpinner />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke-linecap', 'round');
      expect(progressCircle).toHaveAttribute('fill', 'none');
    });

    it('should rotate SVG -90 degrees for correct start position', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('transform');
      expect(svg).toHaveClass('-rotate-90');
    });
  });

  describe('Layout Structure', () => {
    it('should have inline-flex layout', () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = screen.getByRole('status');
      expect(wrapper).toHaveClass('inline-flex');
    });

    it('should have flex-col direction', () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = screen.getByRole('status');
      expect(wrapper).toHaveClass('flex-col');
    });

    it('should have items-center alignment', () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = screen.getByRole('status');
      expect(wrapper).toHaveClass('items-center');
    });

    it('should have justify-center alignment', () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = screen.getByRole('status');
      expect(wrapper).toHaveClass('justify-center');
    });

    it('should have gap-2 spacing', () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = screen.getByRole('status');
      expect(wrapper).toHaveClass('gap-2');
    });
  });

  describe('Circle Calculations', () => {
    it('should calculate correct radius for small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      const circle = container.querySelectorAll('circle')[0];
      const r = parseFloat(circle.getAttribute('r') || '0');
      // size=24, strokeWidth=3, radius=(24-3)/2=10.5
      expect(r).toBe(10.5);
    });

    it('should calculate correct radius for medium size', () => {
      const { container } = render(<LoadingSpinner size="md" />);
      const circle = container.querySelectorAll('circle')[0];
      const r = parseFloat(circle.getAttribute('r') || '0');
      // size=40, strokeWidth=4, radius=(40-4)/2=18
      expect(r).toBe(18);
    });

    it('should calculate correct radius for large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const circle = container.querySelectorAll('circle')[0];
      const r = parseFloat(circle.getAttribute('r') || '0');
      // size=64, strokeWidth=6, radius=(64-6)/2=29
      expect(r).toBe(29);
    });

    it('should calculate correct center position', () => {
      const { container } = render(<LoadingSpinner size="md" />);
      const circle = container.querySelectorAll('circle')[0];
      const cx = parseFloat(circle.getAttribute('cx') || '0');
      const cy = parseFloat(circle.getAttribute('cy') || '0');
      // center = 40/2 = 20
      expect(cx).toBe(20);
      expect(cy).toBe(20);
    });

    it('should have correct stroke-dasharray', () => {
      const { container } = render(<LoadingSpinner size="md" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      const strokeDasharray = progressCircle.getAttribute('stroke-dasharray');
      
      // radius=18, circumference=2*PI*18≈113.1
      const expectedCircumference = 2 * Math.PI * 18;
      expect(parseFloat(strokeDasharray || '0')).toBeCloseTo(expectedCircumference, 1);
    });

    it('should have correct stroke-dashoffset', () => {
      const { container } = render(<LoadingSpinner size="md" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      const strokeDashoffset = progressCircle.getAttribute('stroke-dashoffset');
      
      // offset = circumference * 0.25
      const radius = 18;
      const circumference = 2 * Math.PI * radius;
      const expectedOffset = circumference * 0.25;
      expect(parseFloat(strokeDashoffset || '0')).toBeCloseTo(expectedOffset, 1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string label', () => {
      render(<LoadingSpinner label="" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle empty string className', () => {
      render(<LoadingSpinner className="" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle color with transparency', () => {
      const { container } = render(<LoadingSpinner color="rgba(255, 0, 0, 0.5)" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', 'rgba(255, 0, 0, 0.5)');
    });
  });

  describe('Animation Behavior', () => {
    it('should have stroke-dasharray on progress circle', () => {
      const { container } = render(<LoadingSpinner />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke-dasharray');
    });

    it('should have stroke-dashoffset on progress circle', () => {
      const { container } = render(<LoadingSpinner />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke-dashoffset');
    });

    it('should have filter drop-shadow on progress circle', () => {
      const { container } = render(<LoadingSpinner color="#4DD0E1" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      const style = progressCircle.getAttribute('style');
      expect(style).toContain('filter');
      expect(style).toContain('drop-shadow');
    });
  });

  describe('Responsive Design', () => {
    it('should maintain aspect ratio across all sizes', () => {
      const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];
      
      sizes.forEach(size => {
        const { container } = render(<LoadingSpinner size={size} />);
        const svg = container.querySelector('svg');
        const width = svg?.getAttribute('width');
        const height = svg?.getAttribute('height');
        expect(width).toBe(height);
      });
    });

    it('should scale proportionally with size', () => {
      const { container: smContainer } = render(<LoadingSpinner size="sm" />);
      const { container: mdContainer } = render(<LoadingSpinner size="md" />);
      const { container: lgContainer } = render(<LoadingSpinner size="lg" />);
      
      const smSvg = smContainer.querySelector('svg');
      const mdSvg = mdContainer.querySelector('svg');
      const lgSvg = lgContainer.querySelector('svg');
      
      const smSize = parseInt(smSvg?.getAttribute('width') || '0');
      const mdSize = parseInt(mdSvg?.getAttribute('width') || '0');
      const lgSize = parseInt(lgSvg?.getAttribute('width') || '0');
      
      expect(smSize).toBeLessThan(mdSize);
      expect(mdSize).toBeLessThan(lgSize);
    });
  });
});
