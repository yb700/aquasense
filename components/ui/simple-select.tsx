"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { ChevronDown } from "lucide-react"

/**
 * AquaSense Simple Select Component
 * 
 * A native HTML select dropdown variant that extends the base Input component props.
 * Maintains consistent styling with the base Input component.
 * 
 * This is an alternative to the Radix UI-based Select component (select.tsx).
 * Use this component when you need a simple select with consistent Input styling.
 * Use the Radix-based Select when you need advanced features like custom rendering.
 * 
 * Features:
 * - Extends InputProps interface for consistency
 * - Supports options array with value, label, and disabled properties
 * - Same focus, error, and disabled states as Input
 * - Minimum 44px height for touch targets
 * - Consistent border radius and spacing
 * - Accessible with proper ARIA attributes
 * - Native HTML select for simplicity and performance
 * 
 * Requirements: 15.6
 */

const selectVariants = cva(
  "flex w-full rounded-md border bg-background text-base transition-all duration-base ease-water-flow appearance-none cursor-pointer focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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

export interface SimpleSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SimpleSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    Omit<VariantProps<typeof selectVariants>, "hasError"> {
  label?: string
  error?: string
  helperText?: string
  options: SimpleSelectOption[]
  placeholder?: string
  icon?: React.ReactNode
}

const SimpleSelect = React.forwardRef<HTMLSelectElement, SimpleSelectProps>(
  (
    {
      className,
      variant,
      label,
      error: errorProp,
      helperText,
      options,
      placeholder,
      icon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId()
    const hasError = Boolean(errorProp)

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <Label
            htmlFor={selectId}
            className={cn(
              "text-sm font-medium text-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </Label>
        )}

        {/* Select Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
              {icon}
            </div>
          )}

          {/* Select Field */}
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${selectId}-error`
                : helperText
                  ? `${selectId}-helper`
                  : undefined
            }
            className={cn(
              selectVariants({
                variant,
                hasError,
              }),
              "min-h-touch px-4 py-3 pr-10 md:text-sm",
              icon && "pl-10",
              !props.value && !props.defaultValue && "text-muted-foreground",
              className
            )}
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Options */}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="text-foreground"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {/* Error Message */}
        {hasError && errorProp && (
          <p
            id={`${selectId}-error`}
            className="text-sm font-medium text-error"
            role="alert"
          >
            {errorProp}
          </p>
        )}

        {/* Helper Text */}
        {!hasError && helperText && (
          <p
            id={`${selectId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

SimpleSelect.displayName = "SimpleSelect"

export { SimpleSelect }
