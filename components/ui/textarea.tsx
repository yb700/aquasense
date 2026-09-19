"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"

/**
 * AquaSense Textarea Component
 * 
 * A textarea variant that extends the base Input component props.
 * Maintains consistent styling with the base Input component.
 * 
 * Features:
 * - Extends InputProps interface for consistency
 * - Supports rows prop for height control
 * - Supports maxLength with character counter
 * - Same focus, error, and disabled states as Input
 * - Minimum 44px height for touch targets
 * - Auto-resize option
 * 
 * Requirements: 15.6
 */

const textareaVariants = cva(
  "flex w-full rounded-md border bg-background text-base transition-all duration-base ease-water-flow resize-y placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    Omit<VariantProps<typeof textareaVariants>, "hasError"> {
  label?: string
  error?: string
  helperText?: string
  rows?: number
  maxLength?: number
  showCharacterCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      label,
      error: errorProp,
      helperText,
      rows = 4,
      maxLength,
      showCharacterCount = true,
      id,
      disabled,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId()
    const hasError = Boolean(errorProp)
    
    // Track character count
    const [charCount, setCharCount] = React.useState(0)
    
    React.useEffect(() => {
      const currentValue = (value || defaultValue || '') as string
      setCharCount(currentValue.length)
    }, [value, defaultValue])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      if (props.onChange) {
        props.onChange(e)
      }
    }

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <Label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium text-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </Label>
        )}

        {/* Textarea Field */}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          className={cn(
            textareaVariants({
              variant,
              hasError,
            }),
            "min-h-touch px-4 py-3 md:text-sm",
            className
          )}
          onChange={handleChange}
          {...props}
        />

        {/* Character Count */}
        {maxLength && showCharacterCount && (
          <p className="text-xs text-muted-foreground text-right">
            {charCount} / {maxLength}
          </p>
        )}

        {/* Error Message */}
        {hasError && errorProp && (
          <p
            id={`${textareaId}-error`}
            className="text-sm font-medium text-error"
            role="alert"
          >
            {errorProp}
          </p>
        )}

        {/* Helper Text */}
        {!hasError && helperText && (
          <p
            id={`${textareaId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
