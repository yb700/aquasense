# Container Component

A responsive layout container with configurable max-width breakpoints and automatic horizontal padding that scales with viewport size.

## Features

- **Responsive Max-Width Variants**: Choose from 4 max-width options
  - `narrow` (960px) - Ideal for text-heavy content
  - `default` (1280px) - Standard application width
  - `wide` (1440px) - Spacious dashboard layouts
  - `full` - No max-width constraint
  
- **Responsive Horizontal Padding**: Automatically scales with viewport
  - Mobile: 16px (px-4)
  - Tablet (768px+): 24px (md:px-6)
  - Desktop (1024px+): 32px (lg:px-8)

- **Auto-Centered**: Uses `mx-auto` for horizontal centering

- **Customizable**: Supports custom className and can disable padding

## Usage

```tsx
import { Container } from '@/components/design-system';

// Default container (1280px max-width)
<Container>
  <YourContent />
</Container>

// Narrow container for text content
<Container maxWidth="narrow">
  <Article />
</Container>

// Wide container for dashboards
<Container maxWidth="wide">
  <Dashboard />
</Container>

// Full-width container
<Container maxWidth="full">
  <HeroSection />
</Container>

// Container without padding
<Container padding={false}>
  <FullBleedImage />
</Container>

// Container with custom styling
<Container className="bg-neutral-50 py-12">
  <Section />
</Container>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *required* | Content to be wrapped by the container |
| `maxWidth` | `'narrow' \| 'default' \| 'wide' \| 'full'` | `'default'` | Maximum width variant |
| `padding` | `boolean` | `true` | Enable responsive horizontal padding |
| `className` | `string` | `''` | Additional CSS classes |

## Max-Width Variants

### Narrow (960px)
Best for text-heavy content like articles, blog posts, or documentation. Keeps line lengths optimal for readability (45-75 characters per line).

```tsx
<Container maxWidth="narrow">
  <article>
    <h1>Article Title</h1>
    <p>Long form content...</p>
  </article>
</Container>
```

### Default (1280px)
Standard width for most application layouts. Works well for general content and forms.

```tsx
<Container maxWidth="default">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card />
    <Card />
  </div>
</Container>
```

### Wide (1440px)
Spacious layouts for dashboards with multiple columns of data visualization.

```tsx
<Container maxWidth="wide">
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <MetricCard />
    <MetricCard />
    <MetricCard />
    <MetricCard />
  </div>
</Container>
```

### Full
No max-width constraint. Container spans entire viewport width (minus padding if enabled).

```tsx
<Container maxWidth="full">
  <div className="hero-section">
    Full-width hero content
  </div>
</Container>
```

## Responsive Padding

By default, the Container applies responsive horizontal padding that scales with viewport size:

- **Mobile** (< 768px): 16px on each side
- **Tablet** (768px - 1023px): 24px on each side
- **Desktop** (≥ 1024px): 32px on each side

Disable padding when you want child elements to control their own spacing:

```tsx
<Container padding={false}>
  <div className="px-4 md:px-8">
    Custom padding
  </div>
</Container>
```

## Nesting Containers

You can nest containers for complex layouts:

```tsx
<Container maxWidth="wide" className="bg-neutral-50 py-8">
  <h2>Outer Section</h2>
  
  <Container maxWidth="narrow" className="bg-white py-6 mt-4">
    <p>Centered narrow content within a wide section</p>
  </Container>
</Container>
```

## Common Patterns

### Landing Page Hero Section

```tsx
<div className="bg-gradient-to-b from-pool-blue to-deep-ocean py-20">
  <Container maxWidth="default">
    <div className="text-center text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Welcome to AquaSense
      </h1>
      <p className="text-lg md:text-xl mb-8">
        Modern pool operations management
      </p>
      <button className="bg-aqua px-8 py-3 rounded-lg">
        Get Started
      </button>
    </div>
  </Container>
</div>
```

### Dashboard Content Area

```tsx
<Container maxWidth="wide">
  <div className="space-y-6">
    <header className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <button>New Entry</button>
    </header>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard />
      <MetricCard />
      <MetricCard />
      <MetricCard />
    </div>
  </div>
</Container>
```

### Article/Blog Post

```tsx
<Container maxWidth="narrow">
  <article className="prose dark:prose-invert">
    <h1>Article Title</h1>
    <p className="lead">Introduction paragraph...</p>
    <p>Body content with optimal line length for reading.</p>
  </article>
</Container>
```

## Accessibility

The Container component:
- Uses semantic HTML (`<div>`)
- Maintains proper content hierarchy
- Works with screen readers
- Respects user zoom levels
- Doesn't interfere with keyboard navigation

## Design Tokens

The Container uses the following design tokens from the AquaSense Design System:

- **Max-widths**: Custom values (960px, 1280px, 1440px) and Tailwind's `max-w-7xl`
- **Spacing**: 
  - `px-4` (16px) - Mobile padding
  - `md:px-6` (24px) - Tablet padding
  - `lg:px-8` (32px) - Desktop padding
- **Margins**: `mx-auto` for horizontal centering

## Requirements Validation

**Validates: Requirements 8.6, 22.1**

- ✅ Supports responsive layout components for navigation (Req 8.6)
- ✅ Maintains proper semantic structure for accessibility (Req 22.1)
- ✅ Mobile-first responsive design
- ✅ Scales padding appropriately across breakpoints
- ✅ Provides flexible max-width options for different content types
