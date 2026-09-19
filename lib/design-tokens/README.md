# AquaSense Design Tokens

Design tokens are the visual design atoms of the AquaSense Design System. They are named entities that store visual design attributes such as colors, typography, spacing, shadows, and motion parameters.

## Overview

Design tokens enable consistent visual design across the application by providing a single source of truth for design decisions. They bridge the gap between design and development, ensuring that the implemented interface matches the design intent.

## Available Token Sets

### ✅ Colors Tokens (`colors.ts`)

Water-inspired color palette with Scandinavian aesthetic including light and dark mode support.

**Status:** ✅ Implemented

**Import:**
```typescript
import { colors, darkModeColors, getColor, getDarkColor } from '@/lib/design-tokens/colors';
// or
import { colors } from '@/lib/design-tokens';
```

**Contents:**
- **Primary Colors:** Deep Ocean (#0A3D62) - trustworthy, stable, professional
- **Secondary Colors:** Pool Blue (#1B7FBD) - energetic, clear, refreshing
- **Accent Colors:** Aqua (#4DD0E1) - vibrant, modern, interactive
- **Highlight Colors:** Fresh Mint (#76E4C3) - success, completion
- **Neutral Colors:** Backgrounds, text, and muted colors
- **Semantic Colors:** Success, warning, error, info states
- **Dark Mode:** Complete dark mode color palette

### ✅ Typography Tokens (`typography.ts`)

Typography system with mobile-first responsive scales using Inter font family.

**Status:** ✅ Implemented

**Import:**
```typescript
import { typography, headingStyles, bodyStyles, getHeadingStyle, getBodyStyle } from '@/lib/design-tokens/typography';
// or
import { typography } from '@/lib/design-tokens';
```

**Contents:**
- **Font Families:** Inter (sans-serif) with system font fallbacks
- **Font Size Scale:** xs (12px) to 6xl (60px) with responsive scaling
- **Font Weights:** normal (400), medium (500), semibold (600), bold (700)
- **Line Heights:** tight, snug, normal, relaxed, loose
- **Heading Styles:** H1-H6 with mobile and desktop variants
- **Body Text Styles:** large, base, small, caption
- **Minimum Size:** 16px for mobile body text (accessibility)

### ✅ Spacing Tokens (`spacing.ts`)

4px base unit spacing scale for consistent rhythm.

**Status:** ✅ Implemented

**Import:**
```typescript
import { spacing } from '@/lib/design-tokens/spacing';
// or
import { spacing } from '@/lib/design-tokens';
```

**Contents:**
- **Scale:** 0 to 32 (0px to 128px) based on 4px increments

### ✅ Shadow Tokens (`shadows.ts`)

Layered depth shadows for premium feel with light and dark mode variants.

**Status:** ✅ Implemented

**Import:**
```typescript
import { shadows, darkShadows, getShadow } from '@/lib/design-tokens/shadows';
// or
import { shadows } from '@/lib/design-tokens';
```

**Contents:**
- **Shadow Scale:** sm, base, md, lg, xl, 2xl
- **Special Shadows:** glass effect, water reflection
- **Dark Mode:** Adjusted shadows for dark backgrounds

### ✅ Border Radius Tokens (`radius.ts`)

Border radius scale for consistent corner rounding.

**Status:** ✅ Implemented

**Import:**
```typescript
import { borderRadius, getRadius } from '@/lib/design-tokens/radius';
// or
import { borderRadius } from '@/lib/design-tokens';
```

**Contents:**
- **Scale:** none, sm, base, md, lg, xl, 2xl, full (0 to pill shape)

### ✅ Motion Tokens (`motion.ts`)

Water-inspired easing functions and duration scales for animations and transitions.

**Status:** ✅ Implemented

**Import:**
```typescript
import { easing, duration, motion } from '@/lib/design-tokens/motion';
// or
import { motion } from '@/lib/design-tokens';
```

**Contents:**
- **Easing Functions:** `waterFlow`, `waterRipple`, `waterWave`, `easeIn`, `easeOut`, `easeInOut`
- **Duration Scale:** `fast` (150ms), `base` (250ms), `slow` (400ms), `slower` (600ms)

**Documentation:** See [motion.examples.md](./motion.examples.md) for usage examples.

## Usage

### Typography Tokens

```typescript
import { typography, getHeadingStyle, getBodyStyle, getHeadingClass, getBodyClass } from '@/lib/design-tokens/typography';

// Access font sizes
const baseFontSize = typography.fontSize.base; // '1rem' (16px)
const heading1Size = typography.fontSize['6xl']; // '3.75rem' (60px)

// Access font weights
const normalWeight = typography.fontWeight.normal; // '400'
const boldWeight = typography.fontWeight.bold; // '700'

// Get heading styles programmatically
const h1Mobile = getHeadingStyle('h1', 'mobile');
// { fontSize: '2.25rem', lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }

const h1Desktop = getHeadingStyle('h1', 'desktop');
// { fontSize: '3.75rem', lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }

// Get body text styles
const baseBody = getBodyStyle('base');
// { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400' }

// Generate Tailwind CSS classes
const h1Classes = getHeadingClass('h1');
// Returns: "text-[2.25rem] lg:text-[3.75rem] leading-[1.25] lg:leading-[1.2] font-[700] tracking-[-0.02em]"

const bodyClasses = getBodyClass('base');
// Returns: "text-[1rem] leading-[1.5] font-[400]"
```

**Using in React Components:**
```tsx
import { getHeadingClass, getBodyClass } from '@/lib/design-tokens/typography';

export function HeroSection() {
  return (
    <div>
      <h1 className={getHeadingClass('h1')}>
        Welcome to AquaSense
      </h1>
      <p className={getBodyClass('large')}>
        Your pool operations management solution
      </p>
    </div>
  );
}
```

### Color Tokens

```typescript
import { colors, darkModeColors, getColor } from '@/lib/design-tokens/colors';

// Access colors directly
const primaryColor = colors.primary[500]; // '#0A3D62' (Deep Ocean)
const accentColor = colors.accent[300]; // '#4DD0E1' (Aqua)

// Use helper functions
const buttonColor = getColor('primary.500'); // '#0A3D62'
const successColor = getColor('semantic.success.main'); // '#1ABC9C'

// Dark mode colors
const darkBg = darkModeColors.background.primary; // '#0B1F2E'
```

### Basic Import

```typescript
// Import specific token sets
import { motion } from '@/lib/design-tokens/motion';
import { easing, duration } from '@/lib/design-tokens';

// Use in CSS-in-JS
const style = {
  transition: `opacity ${duration.base} ${easing.waterFlow}`,
};

// Use in Tailwind
<div className="transition-opacity duration-250" 
     style={{ transitionTimingFunction: easing.waterFlow }}>
  Content
</div>
```

### With Framer Motion

```typescript
import { motion as framerMotion } from 'framer-motion';
import { motion } from '@/lib/design-tokens';

<framerMotion.div
  animate={{ opacity: 1 }}
  transition={{
    duration: parseFloat(motion.duration.base) / 1000, // Convert ms to seconds
    ease: [0.4, 0.0, 0.2, 1], // waterFlow curve
  }}
>
  Animated content
</framerMotion.div>
```

## Design Principles

The AquaSense Design System follows these core principles:

1. **Water-Inspired:** Visual language reflects aquatic operations with fluid motion, caustic patterns, and glass-like surfaces
2. **Scandinavian Minimalism:** Clean lines, ample whitespace, functional beauty
3. **Mobile-First:** Designed for touch interactions and small screens first
4. **Performance:** Optimized for smooth 60fps animations using GPU-accelerated properties
5. **Accessibility:** WCAG 2.1 AA compliant, respects `prefers-reduced-motion`

## Motion System Guidelines

### Water-Like Characteristics (Requirements 13.5, 13.6)

- ✅ Smooth, gentle movement (no jarring transitions)
- ✅ Flowing, natural momentum
- ✅ Subtle bounce effects for interaction feedback
- ✅ Appropriate durations (not too fast or slow)

### When to Use Each Easing

| Easing | Use Case | Example |
|--------|----------|---------|
| `waterFlow` | General transitions, most common | Fade-ins, slide-ins, dropdown menus |
| `waterRipple` | Interactive feedback with bounce | Button presses, hover states, ripple effects |
| `waterWave` | Large, symmetric movements | Page transitions, modals, floating elements |

### When to Use Each Duration

| Duration | Use Case | Example |
|----------|----------|---------|
| `fast` (150ms) | Micro-interactions | Hover states, focus indicators |
| `base` (250ms) | Standard interactions | Button clicks, dropdowns, tooltips |
| `slow` (400ms) | Complex animations | Card flips, slide panels, form reveals |
| `slower` (600ms) | Page-level transitions | Route changes, large modals |

## Testing

All design token sets include comprehensive test coverage:

```bash
# Run all design token tests
npm test -- lib/design-tokens --run

# Run specific test file
npm test -- lib/design-tokens/motion.test.ts --run

# Run with coverage
npm test -- lib/design-tokens --coverage --run
```

## File Structure

```
lib/design-tokens/
├── index.ts                    # Centralized exports
├── colors.ts                   # Color system tokens
├── colors.test.ts              # Color tests
├── typography.ts               # Typography system tokens
├── typography.test.ts          # Typography tests
├── spacing.ts                  # Spacing scale tokens
├── spacing.test.ts             # Spacing tests
├── shadows.ts                  # Shadow system tokens
├── shadows.test.ts             # Shadow tests
├── radius.ts                   # Border radius tokens
├── radius.test.ts              # Border radius tests
├── motion.ts                   # Motion system tokens
├── motion.test.ts              # Motion tests
├── motion.examples.md          # Motion usage examples
├── integration.test.ts         # Integration tests
└── README.md                   # This file
```

## Requirements Traceability

The design token system satisfies the following requirements:

### Color System (colors.ts)
- **Requirement 2.1:** Deep Ocean (#0A3D62) as primary color
- **Requirement 2.2:** Pool Blue (#1B7FBD) as secondary color
- **Requirement 2.3:** Aqua (#4DD0E1) as accent color
- **Requirement 2.4:** Fresh Mint (#76E4C3) as highlight color
- **Requirement 2.5:** Light backgrounds, surface white, text colors, muted colors
- **Requirement 2.6:** Semantic color mappings (success, warning, error, info)
- **Requirement 2.7:** Complete dark mode color palette
- **Requirement 2.8:** Dark mode colors applied when enabled

### Typography System (typography.ts)
- **Requirement 3.1:** Primary font family (Inter) optimized for print and screen reading
- **Requirement 3.2:** Font size scales for mobile and desktop viewports
- **Requirement 3.3:** Font weights (regular, medium, semibold, bold)
- **Requirement 3.4:** Line heights optimized for readability
- **Requirement 3.5:** Heading styles (H1-H6) with responsive sizes and weights
- **Requirement 3.6:** Body text styles (large, base, small, caption)
- **Requirement 3.7:** Minimum 16px font size for mobile body text

### Motion System (motion.ts)
- **Requirement 13.5:** Motion system uses water-like, smooth, gentle movement characteristics
- **Requirement 13.6:** Motion system never uses flashy or jarring animations
- **Requirement 13.7:** Motion system implemented using CSS transforms and Framer Motion

### General Design Tokens
- **Requirement 23.1:** Color tokens defined as CSS custom properties
- **Requirement 23.2:** Spacing tokens using 4px base unit scale
- **Requirement 23.3:** Typography tokens including font sizes, weights, line heights
- **Requirement 23.4:** Shadow tokens for layered depth effects
- **Requirement 23.5:** Border-radius tokens for consistent corner rounding
- **Requirement 23.6:** Both light mode and dark mode token values

## Contributing

When adding new design token sets:

1. Create the token file (e.g., `colors.ts`)
2. Create corresponding test file (e.g., `colors.test.ts`)
3. Add exports to `index.ts`
4. Document usage in a corresponding `.examples.md` file
5. Update this README with the new token set
6. Ensure all tests pass

## Resources

- [Design Document](../../.kiro/specs/aquasense-design-system/design.md) - Full technical design
- [Requirements](../../.kiro/specs/aquasense-design-system/requirements.md) - Design system requirements
- [Framer Motion Documentation](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS Configuration](../../tailwind.config.js) - Tailwind integration
