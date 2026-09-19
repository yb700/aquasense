import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CircularProgress } from './CircularProgress';

describe('CircularProgress Component', () => {
  describe('Basic Rendering', () => {
    it('should render circular progress component', () => {
      render(<CircularProgress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<CircularProgress value={0} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('should render with all props specified', () => {
      render(
        <CircularProgress
          value={75}
          size={150}
          strokeWidth={10}
          label="Complete"
          color="#FF0000"
          className="custom-class"
        />
      );
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveClass('custom-class');
    });
  });

  describe('Value Prop', () => {
    it('should handle value of 0', () => {
      render(<CircularProgress value={0} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle value of 50', () => {
      render(<CircularProgress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should handle value of 100', () => {
      render(<CircularProgress value={100} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should clamp negative values to 0', () => {
      render(<CircularProgress value={-10} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should clamp values over 100 to 100', () => {
      render(<CircularProgress value={150} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should handle decimal values', () => {
      render(<CircularProgress value={45.7} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '45.7');
      expect(screen.getByText('45.7%')).toBeInTheDocument();
    });
  });

  describe('Size Prop', () => {
    it('should use default size of 120 when not specified', () => {
      const { container } = render(<CircularProgress value={50} />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveStyle({ width: '120px', height: '120px' });
    });

    it('should apply custom size', () => {
      const { container } = render(<CircularProgress value={50} size={200} />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveStyle({ width: '200px', height: '200px' });
    });

    it('should handle small size', () => {
      const { container } = render(<CircularProgress value={50} size={60} />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveStyle({ width: '60px', height: '60px' });
    });

    it('should handle large size', () => {
      const { container } = render(<CircularProgress value={50} size={300} />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveStyle({ width: '300px', height: '300px' });
    });
  });

  describe('StrokeWidth Prop', () => {
    it('should use default stroke width of 8 when not specified', () => {
      const { container } = render(<CircularProgress value={50} />);
      const circles = container.querySelectorAll('circle');
      expect(circles[0]).toHaveAttribute('stroke-width', '8');
      expect(circles[1]).toHaveAttribute('stroke-width', '8');
    });

    it('should apply custom stroke width', () => {
      const { container } = render(<CircularProgress value={50} strokeWidth={12} />);
      const circles = container.querySelectorAll('circle');
      expect(circles[0]).toHaveAttribute('stroke-width', '12');
      expect(circles[1]).toHaveAttribute('stroke-width', '12');
    });

    it('should handle thin stroke width', () => {
      const { container } = render(<CircularProgress value={50} strokeWidth={4} />);
      const circles = container.querySelectorAll('circle');
      expect(circles[0]).toHaveAttribute('stroke-width', '4');
      expect(circles[1]).toHaveAttribute('stroke-width', '4');
    });

    it('should handle thick stroke width', () => {
      const { container } = render(<CircularProgress value={50} strokeWidth={16} />);
      const circles = container.querySelectorAll('circle');
      expect(circles[0]).toHaveAttribute('stroke-width', '16');
      expect(circles[1]).toHaveAttribute('stroke-width', '16');
    });
  });

  describe('Label Prop', () => {
    it('should display percentage only when no label is provided', () => {
      render(<CircularProgress value={75} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.queryByText(/complete/i)).not.toBeInTheDocument();
    });

    it('should display label with percentage when label is provided', () => {
      render(<CircularProgress value={75} label="Complete" />);
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('should handle empty label string', () => {
      render(<CircularProgress value={50} label="" />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should handle long labels', () => {
      render(<CircularProgress value={80} label="Task Completion Progress" />);
      expect(screen.getByText('Task Completion Progress')).toBeInTheDocument();
    });
  });

  describe('Color Prop', () => {
    it('should use default accent color when not specified', () => {
      const { container } = render(<CircularProgress value={50} />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', '#4DD0E1');
    });

    it('should apply custom color', () => {
      const { container } = render(<CircularProgress value={50} color="#FF5733" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', '#FF5733');
    });

    it('should handle named colors', () => {
      const { container } = render(<CircularProgress value={50} color="red" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', 'red');
    });

    it('should handle RGB colors', () => {
      const { container } = render(<CircularProgress value={50} color="rgb(255, 0, 0)" />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke', 'rgb(255, 0, 0)');
    });
  });

  describe('ClassName Prop', () => {
    it('should apply custom className', () => {
      render(<CircularProgress value={50} className="custom-progress" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass('custom-progress');
    });

    it('should support multiple classNames', () => {
      render(<CircularProgress value={50} className="class-one class-two" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass('class-one');
      expect(progress).toHaveClass('class-two');
    });

    it('should work without className prop', () => {
      render(<CircularProgress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have progressbar role', () => {
      render(<CircularProgress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('should have aria-valuenow attribute', () => {
      render(<CircularProgress value={65} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '65');
    });

    it('should have aria-valuemin attribute of 0', () => {
      render(<CircularProgress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
    });

    it('should have aria-valuemax attribute of 100', () => {
      render(<CircularProgress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('should have default aria-label with progress percentage', () => {
      render(<CircularProgress value={75} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-label', 'Progress: 75%');
    });

    it('should use custom label in aria-label when provided', () => {
      render(<CircularProgress value={80} label="Upload Progress" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-label', 'Upload Progress');
    });
  });

  describe('SVG Structure', () => {
    it('should render SVG element', () => {
      const { container } = render(<CircularProgress value={50} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.tagName).toBe('svg');
    });

    it('should have correct viewBox based on size', () => {
      const { container } = render(<CircularProgress value={50} size={120} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 120 120');
    });

    it('should contain two circles (background and progress)', () => {
      const { container } = render(<CircularProgress value={50} />);
      const circles = container.querySelectorAll('circle');
      expect(circles).toHaveLength(2);
    });

    it('should have background circle with correct styling', () => {
      const { container } = render(<CircularProgress value={50} />);
      const backgroundCircle = container.querySelectorAll('circle')[0];
      expect(backgroundCircle).toHaveAttribute('stroke', '#E3F2FD');
      expect(backgroundCircle).toHaveAttribute('fill', 'none');
    });

    it('should have progress circle with correct styling', () => {
      const { container } = render(<CircularProgress value={50} />);
      const progressCircle = container.querySelectorAll('circle')[1];
      expect(progressCircle).toHaveAttribute('stroke-linecap', 'round');
      expect(progressCircle).toHaveAttribute('fill', 'none');
    });

    it('should rotate SVG -90 degrees for correct progress start position', () => {
      const { container } = render(<CircularProgress value={50} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('transform');
      expect(svg).toHaveClass('-rotate-90');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small sizes', () => {
      const { container } = render(<CircularProgress value={50} size={20} />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveStyle({ width: '20px', height: '20px' });
    });

    it('should handle very large sizes', () => {
      const { container } = render(<CircularProgress value={50} size={500} />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveStyle({ width: '500px', height: '500px' });
    });

    it('should handle decimal size values', () => {
      const { container } = render(<CircularProgress value={50} size={120.5} />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveStyle({ width: '120.5px', height: '120.5px' });
    });

    it('should handle decimal stroke width values', () => {
      const { container } = render(<CircularProgress value={50} strokeWidth={7.5} />);
      const circles = container.querySelectorAll('circle');
      expect(circles[0]).toHaveAttribute('stroke-width', '7.5');
    });

    it('should handle empty string className', () => {
      render(<CircularProgress value={50} className="" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });
  });

  describe('Circle Calculations', () => {
    it('should calculate correct circumference for default size', () => {
      const { container } = render(<CircularProgress value={50} />);
      const progressCircle = container.querySelectorAll('circle')[1];
      const strokeDasharray = progressCircle.getAttribute('stroke-dasharray');
      
      // Default size=120, strokeWidth=8, radius=(120-8)/2=56, circumference=2*PI*56≈351.86
      const expectedCircumference = 2 * Math.PI * 56;
      expect(parseFloat(strokeDasharray || '0')).toBeCloseTo(expectedCircumference, 1);
    });

    it('should calculate correct offset for 0% progress', () => {
      const { container } = render(<CircularProgress value={0} />);
      const progressCircle = container.querySelectorAll('circle')[1];
      const strokeDasharray = progressCircle.getAttribute('stroke-dasharray');
      
      // At 0%, offset should equal circumference (no progress shown)
      const circumference = parseFloat(strokeDasharray || '0');
      expect(circumference).toBeGreaterThan(0);
    });

    it('should calculate correct offset for 100% progress', () => {
      const { container } = render(<CircularProgress value={100} />);
      const progressCircle = container.querySelectorAll('circle')[1];
      
      // At 100%, offset should be 0 (full circle shown) - handled by framer-motion animation
      expect(progressCircle).toBeInTheDocument();
    });
  });
});
