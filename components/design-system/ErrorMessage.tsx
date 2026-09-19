'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  variant?: 'inline' | 'toast' | 'alert';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * ErrorMessage Component
 * 
 * A flexible error/alert message component with multiple display variants.
 * Supports inline, toast, and alert styles with appropriate icons and animations.
 * 
 * @param message - The error or message text to display (required)
 * @param title - Optional title/heading for the message
 * @param variant - Display style: 'inline' (default), 'toast', or 'alert'
 * @param dismissible - Whether the message can be dismissed (default: false)
 * @param onDismiss - Callback function when message is dismissed
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 20.1, 20.2, 22.2**
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title,
  variant = 'inline',
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300); // Wait for exit animation
  };

  // Icon selection based on variant
  const getIcon = () => {
    switch (variant) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
      case 'toast':
        return <Info className="w-5 h-5 flex-shrink-0" />;
      case 'inline':
      default:
        return <AlertCircle className="w-5 h-5 flex-shrink-0" />;
    }
  };

  // Base styles for all variants
  const baseStyles = 'flex items-start gap-3 rounded-md transition-all duration-base';

  // Variant-specific styles
  const variantStyles = {
    inline: 'p-3 bg-error/10 dark:bg-error/20 text-error border border-error/30',
    toast: 'p-4 bg-white dark:bg-card shadow-lg border border-border text-foreground',
    alert: 'p-4 bg-warning/10 dark:bg-warning/20 text-warning border-l-4 border-warning',
  };

  // Animation variants
  const animationVariants = {
    inline: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    },
    toast: {
      initial: { opacity: 0, x: 100, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 100, scale: 0.95 },
    },
    alert: {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: 'auto' },
      exit: { opacity: 0, height: 0 },
    },
  };

  // Accessibility: reduce motion for users who prefer it
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const currentVariant = animationVariants[variant];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
          initial={prefersReducedMotion ? undefined : currentVariant.initial}
          animate={prefersReducedMotion ? undefined : currentVariant.animate}
          exit={prefersReducedMotion ? undefined : currentVariant.exit}
          transition={{
            duration: 0.25,
            ease: [0.4, 0.0, 0.2, 1], // waterFlow easing
          }}
        >
          {/* Icon */}
          <div className="mt-0.5">{getIcon()}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold mb-1 text-sm">{title}</h4>
            )}
            <p className="text-sm leading-relaxed">{message}</p>
          </div>

          {/* Dismiss button */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorMessage;
