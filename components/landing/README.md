# Landing Page Components

This directory contains components specifically designed for the AquaSense public-facing landing page. These components showcase the product, tell the story of daily operations, and convert visitors into users.

## Components

### HeroSection

**Purpose:** Immersive first impression with water-inspired visuals and compelling call-to-action.

**Features:**
- Full viewport height for maximum impact
- Water-inspired gradient background (pool-blue to deep-ocean)
- Animated water reflection effects using WaterReflection component
- ScrollReveal entrance animations for progressive disclosure
- Responsive layout with mobile-first design
- Support for headline, subheadline, and dual CTAs
- Optional hero image/device mockup
- Minimum 44x44px touch targets on mobile
- Dark mode support

**Requirements Met:**
- 10.1: Full viewport hero section
- 10.2: Animated water light reflection effects
- 18.1: Mobile-first responsive design
- 18.2: Large spacing to avoid crowded interfaces

**Usage:**

```tsx
import { HeroSection } from '@/components/landing/HeroSection';

// Basic usage
<HeroSection
  headline="Professional Pool Management Made Simple"
  subheadline="Streamline operations with AquaSense"
  ctaText="Get Started"
  ctaHref="/signup"
/>

// With secondary CTA and hero image
<HeroSection
  headline="Transform Your Pool Operations"
  subheadline="Real-time dashboards and staff coordination"
  ctaText="Start Free Trial"
  ctaHref="/signup"
  secondaryCtaText="Watch Demo"
  secondaryCtaHref="/demo"
  heroImage="/images/dashboard.png"
  heroImageAlt="AquaSense Dashboard Preview"
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `headline` | `string` | Yes | - | Main headline text |
| `subheadline` | `string` | Yes | - | Supporting description text |
| `ctaText` | `string` | Yes | - | Primary CTA button text |
| `ctaHref` | `string` | Yes | - | Primary CTA button link |
| `secondaryCtaText` | `string` | No | - | Secondary CTA button text |
| `secondaryCtaHref` | `string` | No | - | Secondary CTA button link |
| `heroImage` | `string` | No | - | Hero image URL |
| `heroImageAlt` | `string` | No | `"AquaSense Dashboard"` | Alt text for hero image |
| `backgroundVariant` | `'default' \| 'intense'` | No | `'default'` | Background intensity |
| `className` | `string` | No | - | Additional CSS classes |

## Design Principles

### Mobile-First Approach
All landing components are designed for mobile viewports first, then progressively enhanced for tablet and desktop. This ensures:
- Fast loading on mobile connections
- Touch-optimized interactions (minimum 44x44px targets)
- Readable text (minimum 16px base font size)
- Appropriate spacing for thumb navigation

### Water-Inspired Design Language
Landing components incorporate water-inspired elements:
- **Gradients:** Pool-blue to deep-ocean color transitions
- **Caustic patterns:** Light refraction effects using WaterReflection
- **Fluid motion:** ScrollReveal animations with water-flow easing
- **Layered depth:** Elevated shadows and overlapping elements
- **Glass effects:** Translucent surfaces suggesting water

### Performance Optimization
- CSS transforms for animations (no layout thrashing)
- Framer Motion for complex interactions
- Lazy-loaded images with Next.js Image component
- Lightweight SVG patterns instead of heavy graphics
- Optimized for Lighthouse performance score 90+

### Accessibility
- Semantic HTML structure (section, h1, etc.)
- WCAG 2.1 AA contrast ratios
- Keyboard navigation support
- ARIA labels where appropriate
- Respects prefers-reduced-motion setting
- Focus indicators for interactive elements

## File Structure

```
components/landing/
├── README.md                    # This file
├── HeroSection.tsx              # Hero component implementation
├── HeroSection.test.tsx         # Unit tests
└── HeroSection.example.tsx      # Usage examples
```

## Testing

Each component includes comprehensive unit tests covering:
- Rendering with required props
- Optional props behavior
- Accessibility (semantic HTML, ARIA)
- Responsive behavior
- Visual regression (when applicable)

Run tests:
```bash
npm run test components/landing
```

## Future Components

Planned landing page components:
- **StorySection:** Operational journey timeline
- **ProductShowcase:** Device mockups with screenshots
- **FeatureGrid:** Key features presentation
- **TestimonialCarousel:** Customer testimonials
- **PricingTable:** Subscription plans comparison
- **CTASection:** Final conversion prompt
- **Footer:** Links, language selector, branding

## Contributing

When adding new landing components:
1. Follow mobile-first design approach
2. Include ScrollReveal animations where appropriate
3. Use design tokens from tailwind.config.js
4. Write comprehensive unit tests
5. Create usage examples
6. Document props and requirements
7. Ensure WCAG 2.1 AA compliance
8. Optimize for performance (Lighthouse 90+)
