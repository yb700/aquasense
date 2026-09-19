# ScrollReveal Component

## Overview

The ScrollReveal component is an animation wrapper that detects when an element enters the viewport using Intersection Observer and triggers smooth reveal animations. It supports multiple animation variants with water-flow easing for natural, smooth motion.

## Features

- ✅ Intersection Observer for viewport detection
- ✅ Multiple animation variants (fade, slide up/down/left/right)
- ✅ Water-flow easing for smooth reveals
- ✅ Respects `prefers-reduced-motion` setting (Requirement 22.6)
- ✅ Configurable delay for staggered animations
- ✅ One-time or repeated animations
- ✅ Minimum 44x44 pixel touch targets support (Requirement 9.1)
- ✅ Mobile-first responsive design (Requirement 9.3)

## Requirements Validated

**Validates: Requirements 9.1, 9.3, 22.6**

- **9.1**: Supports mobile viewport with proper touch target considerations
- **9.3**: Implements animations that work within mobile navigation context
- **22.6**: Respects `prefers-reduced-motion` setting and disables animations accordingly

## Props

```typescript
interface ScrollRevealProps {
  children: React.ReactNode;    // Content to reveal on scroll
  delay?: number;                // Animation delay in seconds (default: 0)
  direction?: 'fade' | 'up' | 'down' | 'left' | 'right'; // Animation variant (default: 'up')
  once?: boolean;                // Animate only once when entering viewport (default: true)
  className?: string;            // Additional CSS classes
}
```

## Usage Examples

### Basic Fade In

```tsx
import { ScrollReveal } from '@/components/design-system';

<ScrollReveal direction="fade">
  <div>This content fades in when scrolled into view</div>
</ScrollReveal>
```

### Slide Up Animation

```tsx
<ScrollReveal direction="up">
  <FloatingCard>
    <h3>Card Title</h3>
    <p>This card slides up from below with a fade effect.</p>
  </FloatingCard>
</ScrollReveal>
```

### Staggered Animation

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <ScrollReveal direction="up" delay={0}>
    <FloatingCard>Card 1</FloatingCard>
  </ScrollReveal>
  
  <ScrollReveal direction="up" delay={0.2}>
    <FloatingCard>Card 2</FloatingCard>
  </ScrollReveal>
  
  <ScrollReveal direction="up" delay={0.4}>
    <FloatingCard>Card 3</FloatingCard>
  </ScrollReveal>
</div>
```

### Slide From Sides

```tsx
<div className="grid grid-cols-2 gap-4">
  <ScrollReveal direction="left">
    <FloatingCard>Slides from right</FloatingCard>
  </ScrollReveal>
  
  <ScrollReveal direction="right">
    <FloatingCard>Slides from left</FloatingCard>
  </ScrollReveal>
</div>
```

### Repeating Animation

```tsx
<ScrollReveal direction="up" once={false}>
  <FloatingCard>
    This animates every time it enters the viewport
  </FloatingCard>
</ScrollReveal>
```

## Animation Variants

### Fade
- Opacity: 0 → 1
- No movement, just fades in

### Slide Up (default)
- Opacity: 0 → 1
- Y position: +40px → 0
- Element slides up from below

### Slide Down
- Opacity: 0 → 1
- Y position: -40px → 0
- Element slides down from above

### Slide Left
- Opacity: 0 → 1
- X position: +40px → 0
- Element slides from right to left

### Slide Right
- Opacity: 0 → 1
- X position: -40px → 0
- Element slides from left to right

## Animation Configuration

- **Duration**: 600ms (slower duration for smooth reveal)
- **Easing**: Water-flow cubic-bezier(0.4, 0.0, 0.2, 1)
- **Trigger Margin**: -100px (animation starts slightly before element enters viewport)
- **Default Behavior**: Animates once on first view

## Accessibility

### Reduced Motion Support

The component automatically detects the `prefers-reduced-motion` setting:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

When reduced motion is preferred:
- All animations are disabled
- Content renders immediately without motion
- Maintains full functionality without visual effects

### Semantic HTML

The component preserves the semantic structure of wrapped content:
- Uses `motion.div` wrapper that doesn't affect semantics
- No additional ARIA attributes needed
- Screen readers treat content normally

## Performance

- Uses CSS transforms for animations (GPU accelerated)
- Intersection Observer for efficient viewport detection
- Lazy triggers animations only when needed
- No JavaScript on scroll events (better performance)

## Integration with Other Components

Works seamlessly with all design system components:

```tsx
// With FloatingCard
<ScrollReveal direction="up">
  <FloatingCard hover glass>
    Premium glass card with reveal
  </FloatingCard>
</ScrollReveal>

// With Container
<Container>
  <ScrollReveal direction="fade">
    <h1>Section Title</h1>
  </ScrollReveal>
</Container>

// With ResponsiveGrid
<ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
  <ScrollReveal direction="up" delay={0}>
    <FloatingCard>Item 1</FloatingCard>
  </ScrollReveal>
  <ScrollReveal direction="up" delay={0.15}>
    <FloatingCard>Item 2</FloatingCard>
  </ScrollReveal>
  <ScrollReveal direction="up" delay={0.3}>
    <FloatingCard>Item 3</FloatingCard>
  </ScrollReveal>
</ResponsiveGrid>
```

## Best Practices

1. **Use Staggered Delays for Multiple Items**
   - Apply incremental delays (0.1-0.2s) for sequential reveals
   - Creates a natural, flowing entrance effect

2. **Choose Appropriate Directions**
   - Use `up` for general content (most common)
   - Use `fade` for subtle reveals
   - Use `left`/`right` for side-by-side layouts

3. **Set once={true} for Performance**
   - Default behavior animates only once
   - Reduces unnecessary re-renders on scroll
   - Only use `once={false}` when intentional

4. **Respect User Preferences**
   - Component automatically handles `prefers-reduced-motion`
   - No additional configuration needed

5. **Combine with Layout Components**
   - Use with Container for consistent spacing
   - Use with ResponsiveGrid for responsive reveals

## Common Patterns

### Hero Section Reveal

```tsx
<HeroSection>
  <ScrollReveal direction="fade" delay={0}>
    <h1>Welcome to AquaSense</h1>
  </ScrollReveal>
  <ScrollReveal direction="up" delay={0.2}>
    <p>Pool operations management simplified</p>
  </ScrollReveal>
  <ScrollReveal direction="up" delay={0.4}>
    <Button>Get Started</Button>
  </ScrollReveal>
</HeroSection>
```

### Feature Grid

```tsx
<ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
  {features.map((feature, index) => (
    <ScrollReveal key={feature.id} direction="up" delay={index * 0.1}>
      <FloatingCard hover>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </FloatingCard>
    </ScrollReveal>
  ))}
</ResponsiveGrid>
```

### Alternating Side Reveals

```tsx
{items.map((item, index) => (
  <ScrollReveal 
    key={item.id} 
    direction={index % 2 === 0 ? 'left' : 'right'}
  >
    <FloatingCard>{item.content}</FloatingCard>
  </ScrollReveal>
))}
```

## Testing

The component includes comprehensive tests covering:
- ✅ Renders children correctly
- ✅ Applies custom className
- ✅ All animation directions (fade, up, down, left, right)
- ✅ Delay configuration
- ✅ Once vs repeating animations
- ✅ Reduced motion support

Run tests with:
```bash
npm test -- ScrollReveal.test.tsx --run
```

## Browser Support

- Modern browsers with Intersection Observer support
- Automatically falls back to immediate render if Intersection Observer is unavailable
- Respects `prefers-reduced-motion` in all modern browsers
