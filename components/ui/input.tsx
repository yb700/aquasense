"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"

/**
 * AquaSense Input Component
 * 
 * A redesigned input component with water-inspired styling.
 * Extends shadcn/ui base input with AquaSense design system tokens.
 * 
 * Features:
 * - Two variants: default (outline) and filled
 * - Focus state with accent color border and subtle glow
 * - Error state with red border and error message
 * - Disabled state with reduced opacity
 * - Minimum 44px height for mobile touch targets
 * - Optional label, helper text, and icons
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 */

const inputVariants = cva(
  "flex w-full rounded-md border bg-background text-base transition-all duration-base ease-water-flow file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:shadow-[0_0_0_3px_rgba(77,208,225,0.1)]",
        filled: "border-transparent bg-muted/20 focus-visible:bg-background focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:shadow-[0_0_0_3px_rgba(77,208,225,0.1)]",
      },
      inputSize: {
        default: "min-h-touch px-4 py-3 md:text-sm",
        sm: "min-h-[40px] px-3 py-2 text-sm",
        lg: "min-h-[52px] px-5 py-4 text-lg",
      },
      hasError: {
        true: "border-error focus-visible:border-error focus-visible:ring-error/20 focus-visible:shadow-[0_0_0_3px_rgba(211,47,47,0.1)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      hasError: false,
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof inputVariants>, "hasError"> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      type,
      label,
      error: errorProp,
      helperText,
      icon,
      iconPosition = "left",
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
          {/* Left Icon */}
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            id={inputId}
            ref={ref}
            type={type}
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
              inputVariants({
                variant,
                inputSize,
                hasError,
              }),
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10",
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {icon && iconPosition === "right" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
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

Input.displayName = "Input"

export { Input }
