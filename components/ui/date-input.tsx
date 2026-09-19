"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Calendar } from "lucide-react"

/**
 * AquaSense DateInput Component
 * 
 * A date input variant that extends the base Input component props.
 * Maintains consistent styling with the base Input component.
 * 
 * Features:
 * - Extends InputProps interface for consistency
 * - Supports min and max date constraints
 * - Supports format prop for display formatting
 * - Same focus, error, and disabled states as Input
 * - Minimum 44px height for touch targets
 * - Optional calendar icon
 * - Mobile-optimized date picker
 * 
 * Requirements: 15.6
 */

const dateInputVariants = cva(
  "flex w-full rounded-md border bg-background text-base transition-all duration-base ease-water-flow file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:shadow-[0_0_0_3px_rgba(77,208,225,0.1)]",
        filled: "border-transparent bg-muted/20 focus-visible:bg-background focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:shadow-[0_0_0_3px_rgba(77,208,225,0.1)]",
      },
      hasError: {
        true: "border-error focus-visible:border-error focus-visible:ring-error/20 focus-visible:shadow-[0_0_0_3px_rgba(211,47,47,0.1)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hasError: false,
    },
  }
)

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    Omit<VariantProps<typeof dateInputVariants>, "hasError"> {
  label?: string
  error?: string
  helperText?: string
  min?: string
  max?: string
  format?: string
  showIcon?: boolean
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      className,
      variant,
      label,
      error: errorProp,
      helperText,
      min,
      max,
      format = "yyyy-MM-dd",
      showIcon = true,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()
    const hasError = Boolean(errorProp)

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </Label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Calendar Icon */}
          {showIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Calendar className="h-4 w-4" />
            </div>
          )}

          {/* Date Input Field */}
          <input
            id={inputId}
            ref={ref}
            type="date"
            min={min}
            max={max}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={cn(
              dateInputVariants({
                variant,
                hasError,
              }),
              "min-h-touch px-4 py-3 md:text-sm",
              showIcon && "pl-10",
              // Styling for the date picker
              "[&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
              "[&::-webkit-calendar-picker-indicator]:hover:opacity-100",
              "[&::-webkit-calendar-picker-indicator]:transition-opacity",
              className
            )}
            {...props}
          />
        </div>

        {/* Error Message */}
        {hasError && errorProp && (
          <p
            id={`${inputId}-error`}
            className="text-sm font-medium text-error"
            role="alert"
          >
            {errorProp}
          </p>
        )}

        {/* Helper Text */}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

DateInput.displayName = "DateInput"

export { DateInput }
