# Motion Design Tokens - Usage Examples

This document provides practical examples of how to use the AquaSense motion design tokens in your components.

## Import

```typescript
import { easing, duration, motion } from '@/lib/design-tokens/motion';
```

## Easing Functions

### Water Flow - Smooth Deceleration
Best for general transitions, fade-ins, and slide-ins.

**CSS Example:**
```css
.fade-in {
  opacity: 0;
  transition: opacity 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.fade-in.active {
  opacity: 1;
}
```

**Tailwind Example:**
```tsx
<div className="opacity-0 hover:opacity-100 transition-opacity duration-250" 
     style={{ transitionTimingFunction: motion.easing.waterFlow }}>
  Smooth fade
</div>
```

**Framer Motion Example:**
```tsx
import { motion } from 'framer-motion';
import { easing, duration } from '@/lib/design-tokens/motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ 
    duration: parseFloat(duration.base) / 1000, // Convert ms to seconds
    ease: [0.4, 0.0, 0.2, 1] // waterFlow
  }}
>
  Content
</motion.div>
```

### Water Ripple - Gentle Bounce
Best for interactive feedback, button presses, and hover states.

**Button Hover Example:**
```tsx
import { motion } from 'framer-motion';
import { easing, duration } from '@/lib/design-tokens/motion';

<motion.button
  whileHover={{ 
    scale: 1.05,
    transition: { 
      duration: parseFloat(duration.fast) / 1000,
      ease: [0.34, 1.56, 0.64, 1] // waterRipple
    }
  }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

**CSS Example:**
```css
.button {
  transform: scale(1);
  transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button:hover {
  transform: scale(1.05);
}

.button:active {
  transform: scale(0.95);
}
```

### Water Wave - Symmetric Ease
Best for page transitions, modal animations, and floating elements.

**Modal Example:**
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { easing, duration } from '@/lib/design-tokens/motion';

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ 
        duration: parseFloat(duration.slow) / 1000,
        ease: [0.65, 0, 0.35, 1] // waterWave
      }}
    >
      Modal Content
    </motion.div>
  )}
</AnimatePresence>
```

## Duration Scale

### Fast (150ms)
Micro-interactions that need immediate feedback.

```tsx
// Hover state feedback
<div className="transition-colors duration-150 hover:bg-blue-500">
  Quick feedback
</div>

// Focus indicator
<input className="transition-ring duration-150 focus:ring-2" />
```

### Base (250ms)
Standard transitions for most UI interactions.

```tsx
// Dropdown menu
<div className="transition-all duration-250 transform"
     style={{ transitionTimingFunction: motion.easing.waterFlow }}>
  Menu Item
</div>

// Button interaction
<button className="transition-colors duration-250">
  Standard Button
</button>
```

### Slow (400ms)
Complex animations that need more time to feel smooth.

```tsx
// Card flip animation
<motion.div
  animate={{ rotateY: isFlipped ? 180 : 0 }}
  transition={{ 
    duration: parseFloat(duration.slow) / 1000,
    ease: [0.65, 0, 0.35, 1]
  }}
>
  Card
</motion.div>

// Slide panel
<div className="transition-transform duration-400"
     style={{ 
       transitionTimingFunction: motion.easing.waterWave,
       transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
     }}>
  Side Panel
</div>
```

### Slower (600ms)
Page-level transitions and complex multi-step animations.

```tsx
// Page transition
<motion.div
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 100 }}
  transition={{ 
    duration: parseFloat(duration.slower) / 1000,
    ease: [0.65, 0, 0.35, 1]
  }}
>
  Page Content
</motion.div>
```

## Real-World Component Examples

### Floating Card with Hover Effect

```tsx
import { motion } from 'framer-motion';
import { easing, duration } from '@/lib/design-tokens/motion';

export function FloatingCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6"
      whileHover={{
        y: -8,
        boxShadow: '0 12px 24px rgba(10, 61, 98, 0.15)',
        transition: {
          duration: parseFloat(duration.base) / 1000,
          ease: [0.4, 0.0, 0.2, 1] // waterFlow
        }
      }}
    >
      {children}
    </motion.div>
  );
}
```

### Ripple Button

```tsx
import { motion } from 'framer-motion';
import { easing, duration } from '@/lib/design-tokens/motion';

export function RippleButton({ children, onClick }: { 
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        scale: 1.05,
        transition: {
          duration: parseFloat(duration.fast) / 1000,
          ease: [0.34, 1.56, 0.64, 1] // waterRipple
        }
      }}
    >
      {children}
    </motion.button>
  );
}
```

### Staggered List Animation

```tsx
import { motion } from 'framer-motion';
import { easing, duration } from '@/lib/design-tokens/motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: parseFloat(duration.fast) / 1000,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: parseFloat(duration.slow) / 1000,
      ease: [0.4, 0.0, 0.2, 1] // waterFlow
    }
  }
};

export function StaggeredList({ items }: { items: string[] }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
    >
      {items.map((text, index) => (
        <motion.li key={index} variants={item}>
          {text}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Modal with Backdrop

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { easing, duration } from '@/lib/design-tokens/motion';

export function Modal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: parseFloat(duration.base) / 1000,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: parseFloat(duration.slow) / 1000,
              ease: [0.65, 0, 0.35, 1] // waterWave
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Accessibility Considerations

Always respect user motion preferences:

```tsx
import { motion } from 'framer-motion';
import { easing, duration } from '@/lib/design-tokens/motion';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: prefersReducedMotion ? 0 : parseFloat(duration.base) / 1000,
    ease: [0.4, 0.0, 0.2, 1]
  }}
>
  Content
</motion.div>
```

Or use a custom hook:

```tsx
import { useReducedMotion } from 'framer-motion';
import { duration } from '@/lib/design-tokens/motion';

function MyComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ x: 100 }}
      transition={{
        duration: shouldReduceMotion ? 0 : parseFloat(duration.base) / 1000
      }}
    />
  );
}
```

## Best Practices

1. **Use waterFlow for most transitions** - It's the most versatile and feels natural
2. **Use waterRipple for interactive feedback** - The subtle bounce provides satisfying feedback
3. **Use waterWave for larger animations** - Symmetric easing works well for page-level transitions
4. **Match duration to animation complexity** - Simple state changes use `fast`, complex animations use `slow` or `slower`
5. **Respect prefers-reduced-motion** - Always disable or reduce animations for users who prefer less motion
6. **Combine with CSS transforms** - Use `transform` and `opacity` for best performance
7. **Avoid animating expensive properties** - Don't animate `width`, `height`, `left`, `top` - use `transform` instead

## Performance Tips

```tsx
// ✅ Good - Uses transform and opacity (GPU accelerated)
<motion.div
  animate={{ 
    opacity: 1, 
    x: 100, // translateX
    y: 0,   // translateY
    scale: 1 
  }}
/>

// ❌ Bad - Uses layout properties (causes reflow)
<motion.div
  animate={{ 
    width: 300,
    left: 100,
    marginTop: 50
  }}
/>
```
