'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Error Boundary Component
 * 
 * Catches unexpected JavaScript errors in the component tree and displays
 * a user-friendly fallback UI instead of crashing the entire application.
 * 
 * Features:
 * - Catches errors in child components during rendering, lifecycle methods, and constructors
 * - Displays user-friendly error message translated to selected language
 * - Provides "Try Again" button to reset the error state
 * - Logs error details to console for debugging
 * - Mobile-first responsive design
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary locale="en">
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * Requirements:
 * - 11.1: Mobile-first responsive layout
 * - 12.3: User-friendly error messages translated to selected language
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  locale?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Translation messages for error boundary
// These are inline to avoid circular dependencies with the i18n system
const messages = {
  en: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try refreshing the page.',
    tryAgain: 'Try Again',
    technicalDetails: 'Technical Details',
  },
  da: {
    title: 'Noget gik galt',
    description: 'Der opstod en uventet fejl. Prøv venligst at genindlæse siden.',
    tryAgain: 'Prøv igen',
    technicalDetails: 'Tekniske detaljer',
  },
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   * This method is called during the "render" phase
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details for debugging
   * This method is called during the "commit" phase
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // In production, you could send error to a logging service here
    // e.g., Sentry, LogRocket, etc.
  }

  /**
   * Reset error state and retry rendering
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, locale = 'en' } = this.props;

    // Get translations for current locale
    const t = messages[locale as keyof typeof messages] || messages.en;

    if (hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-8">
          <Card className="w-full max-w-2xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-2xl">{t.title}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {t.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Try Again Button */}
              <Button
                onClick={this.handleReset}
                className="w-full h-11 gap-2"
                size="lg"
              >
                <RefreshCw className="h-4 w-4" />
                {t.tryAgain}
              </Button>

              {/* Technical Details (only in development) */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-4 rounded-lg border bg-muted p-4">
                  <summary className="cursor-pointer font-semibold text-sm mb-2">
                    {t.technicalDetails}
                  </summary>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 overflow-x-auto rounded bg-background p-2 text-xs">
                        {error.toString()}
                      </pre>
                    </div>
                    {errorInfo && errorInfo.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 overflow-x-auto rounded bg-background p-2 text-xs">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}
