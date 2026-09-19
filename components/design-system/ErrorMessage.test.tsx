import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage Component', () => {
  describe('Basic Rendering', () => {
    it('should render error message component', () => {
      render(<ErrorMessage message="Something went wrong" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should render with only required message prop', () => {
      render(<ErrorMessage message="Error message" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should render with all props specified', () => {
      const handleDismiss = vi.fn();
      render(
        <ErrorMessage
          message="Test message"
          title="Error Title"
          variant="toast"
          dismissible={true}
          onDismiss={handleDismiss}
          className="custom-class"
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Error Title')).toBeInTheDocument();
    });
  });

  describe('Message Prop', () => {
    it('should display the message text', () => {
      render(<ErrorMessage message="This is an error message" />);
      expect(screen.getByText('This is an error message')).toBeInTheDocument();
    });

    it('should handle long messages', () => {
      const longMessage = 'This is a very long error message that should still be displayed correctly and wrap properly within the component boundaries.';
      render(<ErrorMessage message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle empty message string', () => {
      render(<ErrorMessage message="" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should handle messages with special characters', () => {
      const message = 'Error: <script>alert("test")</script>';
      render(<ErrorMessage message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  describe('Title Prop', () => {
    it('should not display title when not provided', () => {
      render(<ErrorMessage message="Test message" />);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should display title when provided', () => {
      render(<ErrorMessage message="Test message" title="Error Title" />);
      expect(screen.getByText('Error Title')).toBeInTheDocument();
    });

    it('should display title as heading element', () => {
      render(<ErrorMessage message="Test message" title="Error Title" />);
      const title = screen.getByText('Error Title');
      expect(title.tagName.toLowerCase()).toBe('h4');
    });

    it('should handle empty title string', () => {
      render(<ErrorMessage message="Test message" title="" />);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should handle long titles', () => {
      const longTitle = 'This is a very long error title that should be displayed';
      render(<ErrorMessage message="Test message" title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  describe('Variant Prop', () => {
    it('should use inline variant by default', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-error/10');
    });

    it('should apply inline variant styles', () => {
      const { container } = render(<ErrorMessage message="Test message" variant="inline" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-error/10');
      expect(alert).toHaveClass('text-error');
      expect(alert).toHaveClass('border-error/30');
    });

    it('should apply toast variant styles', () => {
      const { container } = render(<ErrorMessage message="Test message" variant="toast" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-white');
      expect(alert).toHaveClass('shadow-lg');
    });

    it('should apply alert variant styles', () => {
      const { container } = render(<ErrorMessage message="Test message" variant="alert" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-warning/10');
      expect(alert).toHaveClass('border-l-4');
      expect(alert).toHaveClass('border-warning');
    });

    it('should display appropriate icon for inline variant', () => {
      const { container } = render(<ErrorMessage message="Test message" variant="inline" />);
      // AlertCircle icon for inline
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should display appropriate icon for toast variant', () => {
      const { container } = render(<ErrorMessage message="Test message" variant="toast" />);
      // Info icon for toast
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should display appropriate icon for alert variant', () => {
      const { container } = render(<ErrorMessage message="Test message" variant="alert" />);
      // AlertTriangle icon for alert
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Dismissible Prop', () => {
    it('should not show dismiss button by default', () => {
      render(<ErrorMessage message="Test message" />);
      expect(screen.queryByLabelText('Dismiss message')).not.toBeInTheDocument();
    });

    it('should not show dismiss button when dismissible is false', () => {
      render(<ErrorMessage message="Test message" dismissible={false} />);
      expect(screen.queryByLabelText('Dismiss message')).not.toBeInTheDocument();
    });

    it('should show dismiss button when dismissible is true', () => {
      render(<ErrorMessage message="Test message" dismissible={true} />);
      expect(screen.getByLabelText('Dismiss message')).toBeInTheDocument();
    });

    it('should have X icon in dismiss button', () => {
      const { container } = render(<ErrorMessage message="Test message" dismissible={true} />);
      const dismissButton = screen.getByLabelText('Dismiss message');
      expect(dismissButton.querySelector('svg')).toBeInTheDocument();
    });

    it('should dismiss message when dismiss button is clicked', async () => {
      render(<ErrorMessage message="Test message" dismissible={true} />);
      const dismissButton = screen.getByLabelText('Dismiss message');
      
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();
      }, { timeout: 500 });
    });
  });

  describe('OnDismiss Callback', () => {
    it('should call onDismiss when dismiss button is clicked', async () => {
      const handleDismiss = vi.fn();
      render(
        <ErrorMessage
          message="Test message"
          dismissible={true}
          onDismiss={handleDismiss}
        />
      );
      
      const dismissButton = screen.getByLabelText('Dismiss message');
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        expect(handleDismiss).toHaveBeenCalledTimes(1);
      }, { timeout: 500 });
    });

    it('should not call onDismiss when not dismissible', () => {
      const handleDismiss = vi.fn();
      render(
        <ErrorMessage
          message="Test message"
          dismissible={false}
          onDismiss={handleDismiss}
        />
      );
      
      // No dismiss button exists, so callback should not be called
      expect(handleDismiss).not.toHaveBeenCalled();
    });

    it('should handle onDismiss being undefined', () => {
      render(
        <ErrorMessage
          message="Test message"
          dismissible={true}
        />
      );
      
      const dismissButton = screen.getByLabelText('Dismiss message');
      expect(() => fireEvent.click(dismissButton)).not.toThrow();
    });
  });

  describe('ClassName Prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ErrorMessage message="Test message" className="custom-error" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('custom-error');
    });

    it('should support multiple classNames', () => {
      const { container } = render(
        <ErrorMessage message="Test message" className="class-one class-two" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('class-one');
      expect(alert).toHaveClass('class-two');
    });

    it('should preserve base styles when custom className is applied', () => {
      const { container } = render(
        <ErrorMessage message="Test message" className="custom-class" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('custom-class');
      expect(alert).toHaveClass('flex');
      expect(alert).toHaveClass('rounded-md');
    });

    it('should work without className prop', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have alert role', () => {
      render(<ErrorMessage message="Test message" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have aria-live="polite" attribute', () => {
      render(<ErrorMessage message="Test message" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-atomic="true" attribute', () => {
      render(<ErrorMessage message="Test message" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });

    it('should have accessible dismiss button label', () => {
      render(<ErrorMessage message="Test message" dismissible={true} />);
      expect(screen.getByLabelText('Dismiss message')).toBeInTheDocument();
    });

    it('should be keyboard accessible for dismiss button', () => {
      const handleDismiss = vi.fn();
      render(
        <ErrorMessage
          message="Test message"
          dismissible={true}
          onDismiss={handleDismiss}
        />
      );
      
      const dismissButton = screen.getByLabelText('Dismiss message');
      expect(dismissButton.tagName.toLowerCase()).toBe('button');
    });
  });

  describe('Icon Rendering', () => {
    it('should render an icon', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render icon with correct size', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('w-5');
      expect(icon).toHaveClass('h-5');
    });

    it('should render icon with flex-shrink-0', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('flex-shrink-0');
    });
  });

  describe('Layout Structure', () => {
    it('should have flex layout', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('flex');
    });

    it('should have items-start alignment', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('items-start');
    });

    it('should have gap-3 spacing', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('gap-3');
    });

    it('should have rounded corners', () => {
      const { container } = render(<ErrorMessage message="Test message" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('rounded-md');
    });

    it('should have correct padding for inline variant', () => {
      const { container } = render(<ErrorMessage message="Test message" variant="inline" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('p-3');
    });

    it('should have correct padding for toast and alert variants', () => {
      const { container: toastContainer } = render(<ErrorMessage message="Test" variant="toast" />);
      const toastAlert = toastContainer.querySelector('[role="alert"]');
      expect(toastAlert).toHaveClass('p-4');

      const { container: alertContainer } = render(<ErrorMessage message="Test" variant="alert" />);
      const alertEl = alertContainer.querySelector('[role="alert"]');
      expect(alertEl).toHaveClass('p-4');
    });
  });

  describe('Content Layout', () => {
    it('should render message with correct text styles', () => {
      render(<ErrorMessage message="Test message" />);
      const message = screen.getByText('Test message');
      expect(message.tagName.toLowerCase()).toBe('p');
      expect(message).toHaveClass('text-sm');
      expect(message).toHaveClass('leading-relaxed');
    });

    it('should render title with correct styles', () => {
      render(<ErrorMessage message="Test" title="Error Title" />);
      const title = screen.getByText('Error Title');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('mb-1');
      expect(title).toHaveClass('text-sm');
    });

    it('should have flex-1 for content container', () => {
      const { container } = render(<ErrorMessage message="Test message" title="Title" />);
      const contentDiv = container.querySelector('.flex-1');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveClass('min-w-0');
    });
  });

  describe('Dismiss Button Styling', () => {
    it('should have correct button styling', () => {
      render(<ErrorMessage message="Test" dismissible={true} />);
      const dismissButton = screen.getByLabelText('Dismiss message');
      expect(dismissButton).toHaveClass('flex-shrink-0');
      expect(dismissButton).toHaveClass('p-1');
      expect(dismissButton).toHaveClass('rounded');
    });

    it('should have hover styles', () => {
      render(<ErrorMessage message="Test" dismissible={true} />);
      const dismissButton = screen.getByLabelText('Dismiss message');
      expect(dismissButton).toHaveClass('hover:bg-black/5');
    });

    it('should have X icon with correct size', () => {
      const { container } = render(<ErrorMessage message="Test" dismissible={true} />);
      const dismissButton = screen.getByLabelText('Dismiss message');
      const icon = dismissButton.querySelector('svg');
      expect(icon).toHaveClass('w-4');
      expect(icon).toHaveClass('h-4');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very short messages', () => {
      render(<ErrorMessage message="!" />);
      expect(screen.getByText('!')).toBeInTheDocument();
    });

    it('should handle messages with line breaks', () => {
      const message = 'Line 1\nLine 2';
      render(<ErrorMessage message={message} />);
      // Line breaks should be preserved in the DOM
      const paragraph = screen.getByText(/Line 1/);
      expect(paragraph).toBeInTheDocument();
      expect(paragraph.textContent).toContain('Line 2');
    });

    it('should handle dismissible without onDismiss callback', async () => {
      render(<ErrorMessage message="Test" dismissible={true} />);
      const dismissButton = screen.getByLabelText('Dismiss message');
      
      expect(() => fireEvent.click(dismissButton)).not.toThrow();
      
      await waitFor(() => {
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
      }, { timeout: 500 });
    });

    it('should handle empty string className', () => {
      const { container } = render(<ErrorMessage message="Test" className="" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });
  });
});
