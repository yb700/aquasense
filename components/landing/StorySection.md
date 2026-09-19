# StorySection Component

A landing page story section component that showcases operational journey through a visual timeline. Features asymmetric water-flow-inspired layout, staggered ScrollReveal animations, and alternating image/text positioning for visual interest.

## Features

- ✅ Visual operational journey timeline
- ✅ Water-path inspired visual connectors between stages
- ✅ Asymmetric layout (not rigid columns)
- ✅ Alternating left/right image positioning
- ✅ Icons/illustrations for each operational phase
- ✅ ScrollReveal for staggered entrance animations
- ✅ Mobile-first responsive design
- ✅ Container for responsive width management
- ✅ Support for optional section title and subtitle
- ✅ Dark mode support with appropriate styling
- ✅ Accessibility compliant (WCAG 2.1 AA)
- ✅ Respects prefers-reduced-motion

## Requirements Validation

**Validates:**
- Requirement 6.1: Display visual operational journey
- Requirement 6.2: Timeline flow (morning, daytime, incident, closing)
- Requirement 6.3: Water-path inspired visual connectors
- Requirement 6.4: Illustrations/icons for each phase
- Requirement 6.5: Asymmetric layout inspired by water flow
- Requirement 6.6: Fully responsive with mobile adjustments
- Requirement 10.1: Water-inspired design elements
- Requirement 18.1: Mobile-first responsive design
- Requirement 18.2: Large spacing to avoid crowding

## Installation

The component is located at `components/landing/StorySection.tsx` and is ready to use.

## API

### Props

```typescript
interface OperationalStage {
  time: string;           // Time of day or label (e.g., "07:00", "Morning")
  title: string;          // Title of the operational stage
  description: string;    // Description text explaining the stage
  icon: React.ReactNode;  // Icon or illustration component
  imageUrl?: string;      // Optional image URL for the stage
  imageAlt?: string;      // Alt text for the image (defaults to title)
}

interface StorySectionProps {
  stages: OperationalStage[];  // Array of operational stages
  title?: string;              // Section title (optional)
  subtitle?: string;           // Section subtitle (optional)
  className?: string;          // Additional CSS classes
}
```

### OperationalStage Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `time` | `string` | Yes | - | Time of day or stage label |
| `title` | `string` | Yes | - | Stage title |
| `description` | `string` | Yes | - | Stage description |
| `icon` | `React.ReactNode` | Yes | - | Icon or illustration |
| `imageUrl` | `string` | No | - | Optional image URL |
| `imageAlt` | `string` | No | `title` | Image alt text |

### StorySection Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `stages` | `OperationalStage[]` | Yes | - | Array of stages |
| `title` | `string` | No | - | Section title |
| `subtitle` | `string` | No | - | Section subtitle |
| `className` | `string` | No | `''` | Custom CSS classes |

## Usage

### Basic Usage

```tsx
import { StorySection } from '@/components/landing/StorySection';
import { Clock, Sun, AlertCircle, Moon } from 'lucide-react';

export default function LandingPage() {
  return (
    <StorySection
      title="A Day in the Life"
      subtitle="See how AquaSense fits into daily operations"
      stages={[
        {
          time: '07:00',
          title: 'Morning Setup',
          description: 'Start your day with automated checklists and pool chemistry verification.',
          icon: <Clock className="w-8 h-8" />,
          imageUrl: '/images/morning-setup.jpg',
          imageAlt: 'Morning setup checklist',
        },
        {
          time: '12:00',
          title: 'Daytime Operations',
          description: 'Monitor real-time pool status and visitor activity throughout the day.',
          icon: <Sun className="w-8 h-8" />,
          imageUrl: '/images/daytime-ops.jpg',
        },
        {
          time: '15:30',
          title: 'Incident Handling',
          description: 'Document incidents quickly with photo uploads and automated reporting.',
          icon: <AlertCircle className="w-8 h-8" />,
        },
        {
          time: '20:00',
          title: 'Closing Procedures',
          description: 'Complete end-of-day tasks with guided closing checklists.',
          icon: <Moon className="w-8 h-8" />,
          imageUrl: '/images/closing.jpg',
        },
      ]}
    />
  );
}
```

### Without Section Header

```tsx
<StorySection
  stages={[
    {
      time: 'Step 1',
      title: 'Quick Setup',
      description: 'Get started in minutes...',
      icon: <CheckCircle className="w-8 h-8" />,
    },
    // ... more stages
  ]}
/>
```

### Icon-Only (No Images)

```tsx
<StorySection
  title="Complete Pool Management"
  stages={[
    {
      time: 'Daily',
      title: 'Staff Scheduling',
      description: 'Create shifts, assign staff...',
      icon: <Users className="w-8 h-8" />,
      // No imageUrl
    },
    // ... more stages
  ]}
/>
```

### Custom Styling

```tsx
<StorySection
  className="bg-primary-50/30 dark:bg-primary-900/10"
  stages={stages}
/>
```

### With Translations (next-intl)

```tsx
import { useTranslations } from 'next-intl';

export default function StoryPage() {
  const t = useTranslations('landing.story');
  
  return (
    <StorySection
      title={t('title')}
      subtitle={t('subtitle')}
      stages={[
        {
          time: t('morning.time'),
          title: t('morning.title'),
          description: t('morning.description'),
          icon: <Clock className="w-8 h-8" />,
        },
        // ... more stages
      ]}
    />
  );
}
```

## Design System Integration

### Colors

The component uses the AquaSense color system:
- **Gradient Background**: `from-background via-primary-50/20 to-background`
- **Icon Container**: `from-accent-200 to-pool-blue`
- **Time Badge**: `bg-primary-100 dark:bg-primary-900/30`
- **Connectors**: `from-accent-300/50 via-pool-blue/30 to-transparent`

### Spacing

Follows the 4px base spacing system:
- Stage spacing: `space-y-16 sm:space-y-20 lg:space-y-24`
- Section padding: `py-16 sm:py-20 lg:py-24`
- Content gap: `gap-8 lg:gap-12`

### Typography

Uses responsive typography scales:
- Section title: `text-3xl sm:text-4xl lg:text-5xl`
- Stage title: `text-2xl sm:text-3xl lg:text-4xl`
- Description: `text-base sm:text-lg`

### Shadows

Applies design system shadow tokens:
- Image container: `shadow-lg dark:shadow-dark-lg`

### Border Radius

Uses consistent border radius:
- Icon container: `rounded-xl` (12px)
- Image container: `rounded-2xl` (16px)
- Time badge: `rounded-full`

## Layout Behavior

### Desktop (≥1024px)

- Two-column grid for stages with images
- Alternating left/right image positioning (asymmetric)
- Images have subtle rotation: `-1deg` (left) or `1deg` (right)
- Connectors positioned at 1/3 or 2/3 width based on image position

### Tablet (768px - 1023px)

- Single column layout
- Images below text content
- Connectors centered

### Mobile (<768px)

- Single column layout
- Reduced spacing
- Smaller typography
- Connectors aligned left

## Accessibility

### Semantic HTML

- `<section>` for the main container
- `<h2>` for section title
- `<h3>` for stage titles
- Proper heading hierarchy

### ARIA Attributes

- `aria-hidden="true"` on decorative elements
- Meaningful alt text for images

### Keyboard Navigation

- All content is reachable via keyboard
- No interactive elements (static content section)

### Reduced Motion

- Respects `prefers-reduced-motion`
- ScrollReveal animations disabled for users with motion sensitivity

### Color Contrast

- Meets WCAG 2.1 AA standards
- Text has sufficient contrast against backgrounds
- Works in both light and dark modes

## Performance

### Optimizations

- Next.js Image component with lazy loading
- CSS transforms for animations (no layout thrashing)
- Minimal re-renders with proper memoization
- Efficient ScrollReveal with Intersection Observer

### Bundle Size

- Lightweight component (~3KB gzipped)
- Dependencies: Container, ScrollReveal, Next.js Image

## Testing

Comprehensive test coverage with 22 passing tests:

```bash
npm test -- StorySection.test.tsx --run
```

### Test Coverage

- ✅ Rendering all stages
- ✅ Optional title and subtitle
- ✅ Stage content (time, title, description, icons)
- ✅ Image rendering and alt text
- ✅ Layout and styling
- ✅ Accessibility features
- ✅ Edge cases (empty array, single stage, long text)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- React 18+
- Next.js 14+
- Tailwind CSS
- Framer Motion
- Lucide React (for icons in examples)

## Related Components

- [`Container`](../design-system/Container.md) - Responsive width container
- [`ScrollReveal`](../design-system/ScrollReveal.md) - Viewport-based animations
- [`HeroSection`](./HeroSection.tsx) - Landing page hero section

## Migration Guide

If you have an existing story section, here's how to migrate:

### Before

```tsx
<div className="story-section">
  <h2>A Day in the Life</h2>
  <div className="stages">
    <div className="stage">
      <h3>Morning Setup</h3>
      <p>Start your day...</p>
    </div>
  </div>
</div>
```

### After

```tsx
<StorySection
  title="A Day in the Life"
  stages={[
    {
      time: '07:00',
      title: 'Morning Setup',
      description: 'Start your day...',
      icon: <Clock className="w-8 h-8" />,
    },
  ]}
/>
```

## Examples

See [`StorySection.example.tsx`](./StorySection.example.tsx) for more usage examples:

1. Basic Story Section with images
2. Icon-only Story Section
3. Compact Story Section (3 stages)
4. Custom styled Story Section
5. Bilingual Story Section (Danish)
6. Minimal Story Section (no header)

## License

Part of the AquaSense Design System.
