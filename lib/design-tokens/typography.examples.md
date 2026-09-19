# Typography Design Tokens - Usage Examples

This document provides practical examples of using the AquaSense typography design tokens in React components and Tailwind CSS.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Headings](#headings)
- [Body Text](#body-text)
- [Responsive Typography](#responsive-typography)
- [Helper Functions](#helper-functions)
- [Tailwind Integration](#tailwind-integration)
- [Accessibility](#accessibility)

## Basic Usage

### Import Typography Tokens

```typescript
import { 
  typography, 
  fontSize, 
  fontWeight, 
  lineHeight,
  headingStyles,
  bodyStyles,
  getHeadingStyle,
  getBodyStyle,
  getHeadingClass,
  getBodyClass
} from '@/lib/design-tokens/typography';
```

## Headings

### Using Heading Styles Directly

```tsx
import { headingStyles } from '@/lib/design-tokens/typography';

export function PageTitle() {
  const h1Mobile = headingStyles.h1.mobile;
  const h1Desktop = headingStyles.h1.desktop;

  return (
    <h1 
      style={{
        fontSize: h1Mobile.fontSize,
        lineHeight: h1Mobile.lineHeight,
        fontWeight: h1Mobile.fontWeight,
        letterSpacing: h1Mobile.letterSpacing,
      }}
      className="lg:text-[3.75rem] lg:leading-[1.2]"
    >
      Welcome to AquaSense
    </h1>
  );
}
```

### Using Helper Functions

```tsx
import { getHeadingStyle, getHeadingClass } from '@/lib/design-tokens/typography';

export function SectionHeader({ title }: { title: string }) {
  // Get styles programmatically
  const h2Style = getHeadingStyle('h2', 'mobile');
  
  // Or use the class generator for Tailwind
  return (
    <h2 className={getHeadingClass('h2')}>
      {title}
    </h2>
  );
}
```

### All Heading Levels

```tsx
import { getHeadingClass } from '@/lib/design-tokens/typography';

export function TypographyShowcase() {
  return (
    <div className="space-y-6">
      <h1 className={getHeadingClass('h1')}>Heading 1 - Hero Title</h1>
      <h2 className={getHeadingClass('h2')}>Heading 2 - Section Title</h2>
      <h3 className={getHeadingClass('h3')}>Heading 3 - Subsection</h3>
      <h4 className={getHeadingClass('h4')}>Heading 4 - Card Title</h4>
      <h5 className={getHeadingClass('h5')}>Heading 5 - Small Heading</h5>
      <h6 className={getHeadingClass('h6')}>Heading 6 - Smallest Heading</h6>
    </div>
  );
}
```

## Body Text

### Using Body Text Styles

```tsx
import { bodyStyles, getBodyClass } from '@/lib/design-tokens/typography';

export function ContentSection() {
  return (
    <div className="space-y-4">
      {/* Large body text - for introductions */}
      <p className={getBodyClass('large')}>
        AquaSense is your comprehensive pool operations management solution.
      </p>
      
      {/* Base body text - standard paragraphs */}
      <p className={getBodyClass('base')}>
        Manage shifts, track incidents, and monitor cleaning tasks all in one place.
      </p>
      
      {/* Small text - for secondary information */}
      <p className={getBodyClass('small')}>
        Available in Danish and English with full mobile support.
      </p>
      
      {/* Caption text - for labels and meta information */}
      <p className={getBodyClass('caption')}>
        Last updated: June 2024
      </p>
    </div>
  );
}
```

### Direct Style Access

```tsx
import { bodyStyles } from '@/lib/design-tokens/typography';

export function FormLabel({ children }: { children: React.ReactNode }) {
  const smallStyle = bodyStyles.small;

  return (
    <label
      style={{
        fontSize: smallStyle.fontSize,
        lineHeight: smallStyle.lineHeight,
        fontWeight: smallStyle.fontWeight,
      }}
      className="text-neutral-700"
    >
      {children}
    </label>
  );
}
```

## Responsive Typography

### Mobile-First Approach

```tsx
import { getHeadingClass, getBodyClass } from '@/lib/design-tokens/typography';

export function HeroSection() {
  return (
    <section className="px-4 py-12 lg:py-24">
      {/* Automatically responsive: 36px mobile → 60px desktop */}
      <h1 className={`${getHeadingClass('h1')} mb-4`}>
        Transform Your Pool Operations
      </h1>
      
      {/* Large body text for intro */}
      <p className={`${getBodyClass('large')} max-w-2xl`}>
        Streamline shift management, incident reporting, and cleaning tasks
        with our intuitive, mobile-first platform.
      </p>
    </section>
  );
}
```

### Custom Responsive Styles

```tsx
import { fontSize, fontWeight, lineHeight } from '@/lib/design-tokens/typography';

export function CustomHeading() {
  return (
    <h2
      style={{
        fontSize: fontSize.xl,        // 20px base
        fontWeight: fontWeight.bold,  // 700
        lineHeight: lineHeight.tight, // 1.25
      }}
      className="lg:text-3xl"  // 30px on desktop
    >
      Custom Sized Heading
    </h2>
  );
}
```

## Helper Functions

### getHeadingStyle

Returns the style object for a specific heading level and viewport.

```typescript
import { getHeadingStyle } from '@/lib/design-tokens/typography';

// Get mobile styles (default)
const h1Mobile = getHeadingStyle('h1');
// Returns: { fontSize: '2.25rem', lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }

// Get desktop styles
const h1Desktop = getHeadingStyle('h1', 'desktop');
// Returns: { fontSize: '3.75rem', lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }
```

### getBodyStyle

Returns the style object for a specific body text variant.

```typescript
import { getBodyStyle } from '@/lib/design-tokens/typography';

// Get base body style (default)
const baseBody = getBodyStyle();
// Returns: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400' }

// Get large body style
const largeBody = getBodyStyle('large');
// Returns: { fontSize: '1.125rem', lineHeight: '1.625', fontWeight: '400' }
```

### getHeadingClass

Generates a Tailwind CSS class string with responsive typography.

```typescript
import { getHeadingClass } from '@/lib/design-tokens/typography';

const h1Classes = getHeadingClass('h1');
// Returns: "text-[2.25rem] lg:text-[3.75rem] leading-[1.25] lg:leading-[1.2] font-[700] tracking-[-0.02em]"

const h3Classes = getHeadingClass('h3');
// Returns: "text-[1.5rem] lg:text-[2.25rem] leading-[1.35] lg:leading-[1.3] font-[600]"
```

### getBodyClass

Generates a Tailwind CSS class string for body text.

```typescript
import { getBodyClass } from '@/lib/design-tokens/typography';

const baseClasses = getBodyClass('base');
// Returns: "text-[1rem] leading-[1.5] font-[400]"

const captionClasses = getBodyClass('caption');
// Returns: "text-[0.75rem] leading-[1.375] font-[400]"
```

## Tailwind Integration

### Using in Tailwind Config

```javascript
// tailwind.config.js
import { tailwindTypography } from './lib/design-tokens/typography';

module.exports = {
  theme: {
    extend: {
      fontFamily: tailwindTypography.fontFamily,
      fontSize: tailwindTypography.fontSize,
      fontWeight: tailwindTypography.fontWeight,
      lineHeight: tailwindTypography.lineHeight,
    },
  },
};
```

### Using Tailwind Classes

```tsx
export function TailwindExample() {
  return (
    <div>
      {/* Using configured font sizes */}
      <h1 className="text-6xl font-bold leading-tight">
        Hero Title
      </h1>
      
      {/* Base body text (16px minimum for mobile) */}
      <p className="text-base leading-normal">
        Standard paragraph text that meets accessibility requirements.
      </p>
      
      {/* Small text */}
      <p className="text-sm leading-normal font-normal">
        Secondary information
      </p>
    </div>
  );
}
```

## Accessibility

### Minimum Font Size (Requirement 3.7)

The typography system ensures body text is never smaller than 16px on mobile:

```tsx
import { bodyStyles } from '@/lib/design-tokens/typography';

export function AccessibleText() {
  // ✅ CORRECT: Base body text is 16px (1rem)
  return (
    <p className={getBodyClass('base')}>
      This text meets the minimum 16px requirement for mobile devices.
    </p>
  );
}

// ❌ AVOID: Using caption text (12px) for primary content
export function InaccessibleText() {
  return (
    <p className={getBodyClass('caption')}>
      This should only be used for labels, not primary content.
    </p>
  );
}
```

### Readable Line Heights

All body text styles use line heights optimized for readability:

```typescript
import { bodyStyles } from '@/lib/design-tokens/typography';

// All body styles have line-height >= 1.375 (WCAG recommended minimum is 1.5 for body text)
bodyStyles.large.lineHeight;   // '1.625' ✅
bodyStyles.base.lineHeight;    // '1.5' ✅
bodyStyles.small.lineHeight;   // '1.5' ✅
bodyStyles.caption.lineHeight; // '1.375' ✅
```

## Real-World Examples

### Card Component

```tsx
import { getHeadingClass, getBodyClass } from '@/lib/design-tokens/typography';

export function IncidentCard({ title, description, severity }: IncidentCardProps) {
  return (
    <article className="p-6 bg-white rounded-lg shadow-md">
      <h3 className={`${getHeadingClass('h4')} mb-2`}>
        {title}
      </h3>
      
      <p className={`${getBodyClass('base')} mb-4 text-neutral-700`}>
        {description}
      </p>
      
      <span className={`${getBodyClass('small')} font-medium text-${severity}`}>
        Severity: {severity}
      </span>
    </article>
  );
}
```

### Landing Page Hero

```tsx
import { getHeadingClass, getBodyClass } from '@/lib/design-tokens/typography';

export function LandingHero() {
  return (
    <section className="py-20 lg:py-32 text-center">
      <h1 className={`${getHeadingClass('h1')} mb-6 text-primary-500`}>
        Welcome to AquaSense
      </h1>
      
      <p className={`${getBodyClass('large')} mb-8 max-w-2xl mx-auto text-neutral-700`}>
        The complete solution for swimming pool operations management.
        Track shifts, manage incidents, and maintain cleanliness with ease.
      </p>
      
      <button className="px-8 py-3 bg-accent-300 text-white rounded-lg font-semibold">
        Get Started
      </button>
    </section>
  );
}
```

### Form with Labels

```tsx
import { getBodyClass } from '@/lib/design-tokens/typography';

export function LoginForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className={`${getBodyClass('small')} font-medium block mb-2`}>
          Email Address
        </label>
        <input 
          type="email" 
          className={`${getBodyClass('base')} w-full px-4 py-2 border rounded-lg`}
        />
      </div>
      
      <div>
        <label className={`${getBodyClass('small')} font-medium block mb-2`}>
          Password
        </label>
        <input 
          type="password" 
          className={`${getBodyClass('base')} w-full px-4 py-2 border rounded-lg`}
        />
      </div>
      
      <p className={`${getBodyClass('caption')} text-neutral-500`}>
        Forgot your password? <a href="#" className="text-accent-300">Reset it here</a>
      </p>
    </form>
  );
}
```

## Best Practices

1. **Always use base or larger for body text on mobile** to meet the 16px minimum requirement
2. **Use heading helpers** (`getHeadingClass`) for consistent responsive scaling
3. **Reserve caption text** for labels, timestamps, and meta information only
4. **Maintain proper hierarchy** - use H1-H6 in semantic order
5. **Test on mobile** - verify text is readable at smaller viewport sizes
6. **Combine with color tokens** - use neutral text colors from the color system
7. **Respect line heights** - don't override the optimized line-height values

## Related Documentation

- [Color Design Tokens](./colors.ts) - For text color values
- [Design Document](../../.kiro/specs/aquasense-design-system/design.md) - Full design system
- [Requirements](../../.kiro/specs/aquasense-design-system/requirements.md) - Typography requirements
