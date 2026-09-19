import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Logo } from './Logo';

describe('Logo Component', () => {
  describe('Variant Rendering', () => {
    it('should render full logo variant by default', () => {
      render(<Logo />);
      const logo = screen.getByRole('img', { name: /AquaSense/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('viewBox', '0 0 200 48');
    });

    it('should render icon variant correctly', () => {
      render(<Logo variant="icon" />);
      const logo = screen.getByRole('img', { name: /AquaSense Logo/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('viewBox', '0 0 48 48');
    });

    it('should render wordmark variant correctly', () => {
      render(<Logo variant="wordmark" />);
      const logo = screen.getByRole('img', { name: /AquaSense/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('viewBox', '0 0 140 48');
    });

    it('should render full logo variant when explicitly specified', () => {
      render(<Logo variant="full" />);
      const logo = screen.getByRole('img', { name: /AquaSense/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('viewBox', '0 0 200 48');
    });
  });

  describe('Size Prop', () => {
    it('should use default size when size prop is not provided - full variant', () => {
      render(<Logo variant="full" />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '200');
    });

    it('should use default size when size prop is not provided - icon variant', () => {
      render(<Logo variant="icon" />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '48');
    });

    it('should use default size when size prop is not provided - wordmark variant', () => {
      render(<Logo variant="wordmark" />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '140');
    });

    it('should scale logo to specified size - icon variant', () => {
      render(<Logo variant="icon" size={64} />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '64');
      expect(logo).toHaveAttribute('height', '64');
    });

    it('should scale logo to specified size - full variant', () => {
      render(<Logo variant="full" size={150} />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '150');
      // Height should maintain aspect ratio (150 / 4.167 ≈ 36)
      expect(parseFloat(logo.getAttribute('height') || '0')).toBeCloseTo(36, 0);
    });

    it('should scale logo to specified size - wordmark variant', () => {
      render(<Logo variant="wordmark" size={100} />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '100');
      // Height should maintain aspect ratio (100 / 2.917 ≈ 34.3)
      expect(parseFloat(logo.getAttribute('height') || '0')).toBeCloseTo(34.3, 0);
    });

    it('should handle small size for minimum visibility', () => {
      render(<Logo variant="icon" size={16} />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '16');
      expect(logo).toHaveAttribute('height', '16');
    });

    it('should handle large size for scalability', () => {
      render(<Logo variant="full" size={400} />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '400');
    });
  });

  describe('ClassName Prop', () => {
    it('should apply custom className', () => {
      render(<Logo className="custom-logo" />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveClass('custom-logo');
    });

    it('should support multiple classNames', () => {
      render(<Logo className="class-one class-two" />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveClass('class-one');
      expect(logo).toHaveClass('class-two');
    });

    it('should work without className prop', () => {
      render(<Logo />);
      const logo = screen.getByRole('img');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      render(<Logo />);
      const logo = screen.getByRole('img');
      expect(logo).toBeInTheDocument();
    });

    it('should have descriptive aria-label for full variant', () => {
      render(<Logo variant="full" />);
      const logo = screen.getByLabelText(/AquaSense/i);
      expect(logo).toBeInTheDocument();
    });

    it('should have descriptive aria-label for icon variant', () => {
      render(<Logo variant="icon" />);
      const logo = screen.getByLabelText(/AquaSense Logo/i);
      expect(logo).toBeInTheDocument();
    });

    it('should have descriptive aria-label for wordmark variant', () => {
      render(<Logo variant="wordmark" />);
      const logo = screen.getByLabelText(/AquaSense/i);
      expect(logo).toBeInTheDocument();
    });
  });

  describe('SVG Structure', () => {
    it('should render as inline SVG', () => {
      const { container } = render(<Logo />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.tagName).toBe('svg');
    });

    it('should have proper namespace', () => {
      const { container } = render(<Logo />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('should contain gradient definitions for icon variant', () => {
      const { container } = render(<Logo variant="icon" />);
      const gradient = container.querySelector('linearGradient#gi');
      expect(gradient).toBeInTheDocument();
    });

    it('should contain gradient definitions for full variant', () => {
      const { container } = render(<Logo variant="full" />);
      const gradient = container.querySelector('linearGradient#g1');
      expect(gradient).toBeInTheDocument();
    });

    it('should contain text elements for wordmark variant', () => {
      const { container } = render(<Logo variant="wordmark" />);
      const textElements = container.querySelectorAll('text');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('should contain text elements for full variant', () => {
      const { container } = render(<Logo variant="full" />);
      const textElements = container.querySelectorAll('text');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('should not contain text elements for icon variant', () => {
      const { container } = render(<Logo variant="icon" />);
      const textElements = container.querySelectorAll('text');
      expect(textElements.length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle size of 0', () => {
      render(<Logo size={0} />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '0');
    });

    it('should handle very large sizes', () => {
      render(<Logo size={10000} />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '10000');
    });

    it('should handle decimal sizes', () => {
      render(<Logo size={48.5} />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('width', '48.5');
    });

    it('should handle empty className', () => {
      render(<Logo className="" />);
      const logo = screen.getByRole('img');
      expect(logo).toBeInTheDocument();
    });
  });
});
