import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-base ease-water-flow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        secondary: "border-2 border-primary bg-transparent text-primary hover:bg-primary/5 hover:border-primary/80",
        ghost: "bg-transparent hover:bg-accent/10 text-foreground hover:text-accent-foreground",
        destructive: "bg-error text-white hover:bg-error-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        sm: "min-h-[44px] px-4 py-2 text-sm", // 44px minimum touch target
        md: "min-h-[48px] px-6 py-3 text-base", // 48px default
        lg: "min-h-[56px] px-8 py-4 text-lg", // 56px for prominent actions
        icon: "min-h-[44px] min-w-[44px] p-0", // 44x44px for icon-only buttons
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

// Spinner component for loading state
const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

// Ripple state interface
interface Ripple {
  x: number
  y: number
  id: number
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, children, disabled, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading
    
    // Ripple state
    const [ripples, setRipples] = React.useState<Ripple[]>([])
    const buttonRef = React.useRef<HTMLButtonElement | null>(null)
    
    // Determine ripple color based on button variant
    const getRippleColor = () => {
      switch (variant) {
        case 'primary':
        case 'destructive':
          // White ripple with opacity for dark buttons
          return 'rgba(255, 255, 255, 0.5)'
        case 'secondary':
        case 'ghost':
        default:
          // Dark ripple with opacity for light buttons
          return 'rgba(10, 61, 98, 0.2)'
      }
    }
    
    // Handle click with ripple effect
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return
      
      const button = buttonRef.current
      if (button) {
        const rect = button.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        
        const newRipple: Ripple = {
          x,
          y,
          id: Date.now()
        }
        
        setRipples(prev => [...prev, newRipple])
        
        // Remove ripple after animation completes (600ms)
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)
      }
      
      // Call original onClick handler
      onClick?.(event)
    }
    
    // Merge refs
    React.useImperativeHandle(ref, () => buttonRef.current!)
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={buttonRef}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <Spinner className="h-4 w-4" />
        )}
        {!loading && icon && icon}
        {children}
        
        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: getRippleColor(),
                width: 0,
                height: 0,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: 4,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1], // waterRipple easing
              }}
            />
          ))}
        </AnimatePresence>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
