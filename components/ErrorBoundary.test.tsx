/**
 * Tests for ErrorBoundary component
 * 
 * Validates:
 * - Error catching and fallback UI display
 * - Bilingual error messages (English and Danish)
 * - Reset functionality
 * - Technical details display in development mode
 * - Mobile-first responsive design
 * 
 * Requirements:
 * - 11.1: Mobile-first responsive layout
 * - 12.3: User-friendly error messages translated to selected language
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, vi, afterEach } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error for testing
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests since we expect errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe('Error catching', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('An unexpected error occurred. Please try refreshing the page.')).toBeInTheDocument();
    });

    it('should display Try Again button when error occurs', () => {
      render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
    });
  });

  describe('Bilingual support', () => {
    it('should display error message in English when locale is en', () => {
      render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('An unexpected error occurred. Please try refreshing the page.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('should display error message in Danish when locale is da', () => {
      render(
        <ErrorBoundary locale="da">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Noget gik galt')).toBeInTheDocument();
      expect(screen.getByText('Der opstod en uventet fejl. Prøv venligst at genindlæse siden.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /prøv igen/i })).toBeInTheDocument();
    });

    it('should default to English when locale is invalid', () => {
      render(
        <ErrorBoundary locale="fr">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Reset functionality', () => {
    it('should reset error state when Try Again button is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error is displayed
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Click Try Again button
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(tryAgainButton);

      // Re-render with no error
      rerender(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Component should render normally
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('Technical details', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should display technical details in development mode', () => {
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Technical details should be visible
      expect(screen.getByText('Technical Details')).toBeInTheDocument();
    });

    it('should not display technical details in production mode', () => {
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Technical details should not be visible
      expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();
    });
  });

  describe('Responsive design', () => {
    it('should render with mobile-first responsive classes', () => {
      const { container } = render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Check for responsive layout classes
      const errorContainer = container.querySelector('.flex.min-h-screen');
      expect(errorContainer).toBeInTheDocument();

      // Check for padding classes for mobile
      expect(errorContainer).toHaveClass('px-4', 'py-8');
    });

    it('should have appropriate button size for touch targets', () => {
      render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      
      // Button should have h-11 class (44px minimum touch target)
      expect(tryAgainButton).toHaveClass('h-11');
    });
  });

  describe('Error icon', () => {
    it('should display error icon', () => {
      const { container } = render(
        <ErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Check for AlertCircle icon by class
      const icon = container.querySelector('.lucide-alert-circle');
      expect(icon).toBeInTheDocument();
    });
  });
});
