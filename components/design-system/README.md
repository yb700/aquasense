# AquaSense Design System Components

This directory contains custom components specific to the AquaSense design system, implementing the water-inspired visual language and brand identity.

## Components

### Logo

The AquaSense logo component provides three variants optimized for different contexts.

#### Features

- **Three Variants**: Full logo, icon only, and wordmark
- **Dynamic Scaling**: Size prop accepts any pixel value for responsive layouts
- **SVG-Based**: Inline SVG for optimal performance and scalability
- **TypeScript**: Fully typed interface with strict type checking
- **Accessible**: Proper ARIA labels and semantic HTML

#### Usage

```tsx
import { Logo } from '@/components/design-system/Logo';

// Default full logo
<Logo />

// Icon only (perfect for mobile headers)
<Logo variant="icon" size={32} />

// Wordmark (great for footers)
<Logo variant="wordmark" size={120} />

// Custom size
<Logo variant="full" size={250} />

// With custom styling
<Logo variant="icon" size={48} className="hover:scale-110 transition-transform" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'full' \| 'icon' \| 'wordmark'` | `'full'` | Logo variant to display |
| `size` | `number` | Varies by variant | Width in pixels (height scales proportionally) |
| `className` | `string` | `''` | Additional CSS classes |

#### Default Sizes

- **Full**: 200px width (4.167:1 aspect ratio)
- **Icon**: 48px (1:1 square)
- **Wordmark**: 140px width (2.917:1 aspect ratio)

#### Variants Guide

**Full Logo** (`variant="full"`)
- Use in: Landing page header, login page, desktop navigation
- Contains: Icon + wordmark
- Best for: Primary branding contexts with sufficient space
- Minimum recommended width: 120px

**Icon** (`variant="icon"`)
- Use in: Mobile headers, favicons, app icons, compact spaces
- Contains: Symbol only (water droplet with "A")
- Best for: Tight spaces, square/circular containers
- Minimum recommended size: 16px (requirement 1.3)
- Remains legible at small sizes

**Wordmark** (`variant="wordmark"`)
- Use in: Footer, secondary navigation, minimal headers
- Contains: "AquaSense" text with decorative wave
- Best for: Text-focused contexts, horizontal layouts

#### Accessibility

All logo variants include:
- Proper `role="img"` attribute
- Descriptive `aria-label` for screen readers
- Semantic SVG structure

#### Performance

- **No image requests**: Inline SVG eliminates HTTP requests
- **Scalable**: Vector graphics scale to any size without quality loss
- **Small bundle size**: Optimized SVG paths
- **Tree-shakeable**: Only imported variants are bundled

#### Requirements Validation

This component validates:
- **Requirement 1.5**: Logo works on light backgrounds and in monochrome ✓
- **Requirement 4.5**: Logo implemented as SVG React component ✓
- **Requirement 24.1**: AquaSense logo provided as SVG React component ✓

#### Examples

See `Logo.example.tsx` for comprehensive usage examples including:
- All three variants at different sizes
- Navigation integration (desktop and mobile)
- Dark background usage
- Custom styling and animations
- Responsive design patterns

#### Testing

The Logo component includes comprehensive unit tests covering:
- All variant rendering
- Size prop functionality and edge cases
- ClassName application
- Accessibility features
- SVG structure validation

Run tests:
```bash
npm test -- Logo.test.tsx
```

---

### WaterReflection

The WaterReflection component creates water-inspired light reflection effects using animated SVG caustic patterns. This component is designed for backgrounds and overlays to create immersive aquatic visuals.

#### Features

- **Animated Caustic Patterns**: Realistic water light reflections
- **CSS Transforms**: Performant animations using GPU acceleration
- **Framer Motion Integration**: Smooth, fluid animations
- **Configurable Opacity**: Adjustable from subtle to prominent
- **Variable Speed**: Control animation speed for different effects
- **Layered Depth**: Dual animation layers for visual richness
- **Optimized Performance**: Lightweight SVG with efficient animations

#### Usage

```tsx
import { WaterReflection } from '@/components/design-system/WaterReflection';

// Default subtle background effect
<div className="relative bg-blue-50">
  <WaterReflection />
  <div className="relative z-10">{/* Your content */}</div>
</div>

// Hero section with prominent effect
<section className="relative h-screen bg-pool-blue">
  <WaterReflection opacity={0.25} speed={1.2} />
  <div className="relative z-10">{/* Hero content */}</div>
</section>

// Card overlay
<div className="relative rounded-xl bg-white p-6">
  <WaterReflection opacity={0.05} speed={0.8} />
  <div className="relative z-10">{/* Card content */}</div>
</div>

// Custom positioning (bottom half only)
<div className="relative min-h-screen">
  <WaterReflection 
    className="absolute bottom-0 left-0 right-0 top-1/2"
    opacity={0.15}
  />
  <div className="relative z-10">{/* Content */}</div>
</div>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opacity` | `number` | `0.1` | Opacity of the effect (0-1), clamped to valid range |
| `speed` | `number` | `1.0` | Animation speed multiplier (2.0 = twice as fast) |
| `className` | `string` | `''` | Additional CSS classes for positioning |

#### Opacity Guidelines

- **0.05 - 0.1**: Very subtle, card overlays, minimal backgrounds
- **0.1 - 0.2**: Standard backgrounds, most common use case
- **0.2 - 0.3**: Prominent hero sections, landing pages
- **0.3+**: High-impact sections, loading states

#### Speed Guidelines

- **0.5 - 0.8**: Slow, calm, meditative sections
- **1.0**: Default, natural water movement
- **1.2 - 1.5**: Slightly faster, energetic sections
- **2.0+**: Fast, dynamic effects, loading states

#### Implementation Details

The component uses:
- **Dual Layer Animation**: Two staggered animation layers for visual depth
- **CSS Transforms**: `translateX`, `translateY`, `scale`, and `rotate` for GPU acceleration
- **Water-Inspired Easing**: `waterFlow` (0.4, 0.0, 0.2, 1) and `waterWave` (0.65, 0, 0.35, 1) curves
- **SVG Background**: Caustic pattern from `/assets/water-patterns/caustic.svg`
- **Backdrop Filter**: Secondary layer includes slight blur for depth

#### Positioning Best Practices

Always wrap content that should appear above the water reflection in a container with `relative z-10`:

```tsx
<div className="relative">
  <WaterReflection /> {/* Background layer */}
  <div className="relative z-10"> {/* Content layer */}
    Your content here
  </div>
</div>
```

The component includes `pointer-events-none` by default, so it won't interfere with interactive elements.

#### Performance Considerations

- Uses CSS transforms (not layout-triggering properties)
- Optimized with Framer Motion's animation engine
- Lightweight SVG pattern (3.3KB)
- No JavaScript recalculations during animation
- Respects `prefers-reduced-motion` (handled by Framer Motion)

#### Accessibility

- Includes `aria-hidden="true"` (decorative element)
- Does not interfere with screen readers
- Does not affect keyboard navigation
- Framer Motion respects user's motion preferences

#### Requirements Validation

This component validates:
- **Requirement 5.6**: Water reflection animation uses CSS transforms and Framer Motion ✓
- **Requirement 21.1**: Motion system uses CSS transforms for performance ✓
- **Requirement 21.2**: Framer Motion for complex animations ✓
- **Requirement 24.2**: Water-inspired decorative graphics as SVG elements ✓

#### Examples

See `WaterReflection.example.tsx` for comprehensive usage examples including:
- Subtle background effect
- Hero section with prominent effect
- Card overlay effects
- Dynamic/loading effects
- Custom positioning
- Dark mode compatibility

#### Testing

The WaterReflection component includes unit tests covering:
- Default rendering and opacity
- Custom opacity and clamping
- Speed prop acceptance
- ClassName application
- Accessibility attributes
- Layer structure
- SVG background references

Run tests:
```bash
npm test -- WaterReflection.test.tsx
```

#### Browser Support

Requires:
- CSS transforms (all modern browsers)
- SVG support (all modern browsers)
- React 18+
- Framer Motion (bundled dependency)

#### Troubleshooting

**Effect not visible:**
- Increase `opacity` prop (default 0.1 is very subtle)
- Ensure container has sufficient height
- Check that content has `relative z-10` positioning

**Animation too slow/fast:**
- Adjust `speed` prop (1.0 = normal, 2.0 = double speed)

**Pattern not loading:**
- Verify `/public/assets/water-patterns/caustic.svg` exists
- Check browser console for 404 errors

---

### FloatingCard

A premium card component with layered depth and water-inspired styling. FloatingCard provides both standard and glass variants with optional hover elevation animations.

#### Features

- **Layered Depth**: Soft shadows for premium feel
- **Glass Effect**: Translucent background with backdrop blur
- **Hover Animation**: Gentle Y-axis elevation on hover
- **Water-Inspired Motion**: Smooth easing curves
- **Dark Mode Support**: Automatic shadow adjustments
- **Accessibility**: Respects prefers-reduced-motion
- **Design Token Integration**: Uses shadow and border-radius tokens

#### Usage

```tsx
import { FloatingCard } from '@/components/design-system/FloatingCard';

// Basic card with default styling
<FloatingCard className="p-6">
  <h3>Card Title</h3>
  <p>Card content here...</p>
</FloatingCard>

// Card with hover elevation
<FloatingCard hover className="p-6">
  <div>Interactive content</div>
</FloatingCard>

// Glass effect card
<FloatingCard glass className="p-6">
  <div>Translucent card with blur</div>
</FloatingCard>

// Combined glass + hover
<FloatingCard glass hover className="p-6">
  <div>Premium interactive card</div>
</FloatingCard>

// Dashboard stat card
<FloatingCard hover className="p-6 text-center">
  <div className="text-4xl font-bold text-accent-500">127</div>
  <div className="text-sm text-neutral-600 uppercase">Active Members</div>
</FloatingCard>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Card content |
| `hover` | `boolean` | `false` | Enable hover elevation animation |
| `glass` | `boolean` | `false` | Enable glass effect with translucent background |
| `className` | `string` | `''` | Additional CSS classes for custom styling |

#### Variants

**Standard Variant** (default)
- Solid white background (`bg-white`)
- Soft shadow (`shadow-md`)
- Clean, classic card appearance
- Best for: Content containers, list items, feature cards

**Glass Variant** (`glass={true}`)
- Translucent background (`bg-white/80`)
- Backdrop blur (`backdrop-blur-sm`)
- Subtle border (`border border-white/20`)
- Glass shadow effect (`shadow-glass`)
- Best for: Overlays, hero sections, premium features

#### Hover Animation

When `hover={true}`:
- Gentle Y-axis translation: -4px upward
- Shadow elevation increases
- Duration: 250ms
- Easing: Water-flow curve (cubic-bezier(0.4, 0.0, 0.2, 1))
- Smooth, natural motion

#### Design Tokens Used

**Shadows:**
- `shadow-md`: Standard card shadow (0 4px 16px rgba(10, 61, 98, 0.10))
- `shadow-glass`: Glass effect shadow with inset highlight
- `shadow-dark-md`: Dark mode variant shadows
- Hover elevates to `shadow-lg` (0 8px 24px)

**Border Radius:**
- `rounded-md`: 12px (0.75rem)

**Motion:**
- `duration-base`: 250ms transition duration
- `ease-water-flow`: Custom water-inspired easing function

**Colors:**
- Standard: `bg-white` / `dark:bg-card`
- Glass: `bg-white/80` / `dark:bg-card/60`

#### Dark Mode

FloatingCard automatically adapts to dark mode:
- Background colors adjust for dark theme
- Shadows use darker variants for proper depth
- Glass effect maintains translucency with adjusted opacity
- Border colors adapt for visibility

#### Accessibility

- **Respects prefers-reduced-motion**: Disables hover animation when user prefers reduced motion
- **Semantic HTML**: Uses div element (no semantic assumptions)
- **Keyboard Navigation**: Works with native focus management
- **Screen Reader Friendly**: No ARIA interference with content

#### Performance

- **CSS Transforms**: Hover animation uses `translateY` (GPU-accelerated)
- **Conditional Motion**: Only uses Framer Motion when hover is enabled
- **No Layout Thrashing**: Transform doesn't trigger reflow
- **Optimized Rendering**: Static variant uses plain div

#### Common Use Cases

**Dashboard Stat Cards:**
```tsx
<FloatingCard hover className="p-6 text-center">
  <div className="text-4xl font-bold text-accent-500">98%</div>
  <div className="text-sm text-neutral-600">Uptime</div>
</FloatingCard>
```

**Feature Cards:**
```tsx
<FloatingCard glass hover className="p-8">
  <div className="flex gap-4">
    <div className="w-12 h-12 bg-accent-500 rounded-xl" />
    <div>
      <h3 className="text-xl font-semibold">Feature Title</h3>
      <p>Feature description...</p>
    </div>
  </div>
</FloatingCard>
```

**List Items:**
```tsx
<FloatingCard className="p-4">
  <div className="flex justify-between items-center">
    <span>Task Name</span>
    <span className="text-highlight-500">Completed</span>
  </div>
</FloatingCard>
```

**Content Sections:**
```tsx
<FloatingCard className="overflow-hidden">
  <div className="p-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
    <h2 className="text-2xl font-semibold">Section Title</h2>
  </div>
  <div className="p-6">
    <p>Section content...</p>
  </div>
</FloatingCard>
```

#### Responsive Considerations

The FloatingCard component is mobile-first and works across all viewports. For responsive layouts:

```tsx
// Adjust padding at different breakpoints
<FloatingCard className="p-4 md:p-6 lg:p-8">
  <div>Responsive content</div>
</FloatingCard>

// Conditional glass effect
<FloatingCard glass className="md:backdrop-blur-md">
  <div>More blur on larger screens</div>
</FloatingCard>
```

#### Requirements Validation

This component validates:
- **Requirement 11.1**: Cards have layered depth using soft shadows ✓
- **Requirement 11.2**: Subtle reflections suggesting glass or water surfaces ✓
- **Requirement 11.3**: Hover applies gentle movement (translate Y) ✓
- **Requirement 11.4**: Uses rounded corners (rounded-md) ✓
- **Requirement 11.5**: Maintains padding and spacing ✓
- **Requirement 11.6**: Fully responsive with adjusted sizing ✓

#### Examples

See `FloatingCard.example.tsx` for comprehensive usage examples including:
- Standard variant examples
- Glass variant examples
- Hover interactions
- Dashboard stat cards
- Feature cards with icons
- List layouts
- Complex content structures
- Dark mode demonstrations

#### Testing

The FloatingCard component includes unit tests covering:
- Children rendering
- Standard variant styles
- Glass variant styles
- Custom className application
- Base styles application
- Motion.div usage with hover
- Regular div usage without hover
- Combined glass and hover props
- Complex children structures

Run tests:
```bash
npm test -- FloatingCard.test.tsx
```

#### Browser Support

Requires:
- CSS transforms (all modern browsers)
- Backdrop filter (modern browsers, graceful degradation)
- React 18+
- Framer Motion (when hover enabled)

#### Troubleshooting

**Glass effect not visible:**
- Ensure there's content behind the card (layered backgrounds)
- Increase background opacity if needed
- Check if backdrop-filter is supported in browser

**Hover animation not working:**
- Verify `hover={true}` is set
- Check if user has prefers-reduced-motion enabled
- Ensure card is interactive (not disabled)

**Shadow not visible:**
- Check container background color (needs contrast)
- Verify dark mode shadows in dark theme
- Increase shadow intensity if needed

### CircularProgress

An SVG-based circular progress indicator with smooth animations powered by Framer Motion. Displays progress from 0-100% in a ring format with optional label and custom colors.

#### Features

- **SVG-Based**: Scalable circular progress ring
- **Smooth Animations**: Framer Motion animations with water-inspired easing
- **Customizable Colors**: Defaults to accent color, supports custom colors
- **Configurable Size**: Adjustable diameter and stroke width
- **Optional Label**: Center text label with percentage
- **Accessible**: ARIA progressbar role with proper attributes
- **Glow Effect**: Subtle drop shadow for visual depth
- **Value Clamping**: Automatically clamps value between 0-100

#### Usage

```tsx
import { CircularProgress } from '@/components/design-system/CircularProgress';

// Basic usage with default accent color
<CircularProgress value={75} />

// With custom size
<CircularProgress value={82} size={140} />

// With label
<CircularProgress value={65} label="Complete" />

// With custom color (Fresh Mint green)
<CircularProgress value={90} color="#76E4C3" />

// With custom stroke width
<CircularProgress value={55} strokeWidth={12} />

// Complete example for dashboard metric
<CircularProgress
  value={82}
  size={140}
  strokeWidth={10}
  label="Tasks"
  color="#1B7FBD"
  className="my-4"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | Required | Progress value from 0 to 100 (auto-clamped) |
| `size` | `number` | `120` | Diameter of the circle in pixels |
| `strokeWidth` | `number` | `8` | Thickness of the progress ring in pixels |
| `label` | `string` | `undefined` | Optional text label displayed below percentage |
| `color` | `string` | `'#4DD0E1'` | Custom color for progress ring (accent color default) |
| `className` | `string` | `''` | Additional CSS classes |

#### Value Guidelines

- **0-25%**: Red or warning colors for low progress
- **26-75%**: Accent or primary colors for normal progress
- **76-100%**: Green/highlight colors for high completion
- Values outside 0-100 are automatically clamped

#### Size Guidelines

- **40-60px**: Mini indicators, inline usage
- **80-100px**: Standard cards, compact layouts
- **120-140px**: Default dashboard metrics (recommended)
- **160-200px**: Hero metrics, featured statistics
- **200px+**: Large displays, landing pages

#### Stroke Width Guidelines

- **4-6px**: Thin, minimal aesthetic
- **8px**: Default, balanced appearance (recommended)
- **10-12px**: Thick, bold emphasis
- **14-16px**: Extra thick, maximum visibility

#### Color Presets

Use design system colors for semantic meaning:

```tsx
// Success/Completion (Fresh Mint)
<CircularProgress value={95} color="#76E4C3" label="Complete" />

// Primary Action (Pool Blue)
<CircularProgress value={80} color="#1B7FBD" label="Coverage" />

// Default/Interactive (Aqua)
<CircularProgress value={65} color="#4DD0E1" label="Progress" />

// Warning
<CircularProgress value={45} color="#FFC107" label="At Risk" />

// Error/Critical
<CircularProgress value={20} color="#D32F2F" label="Low" />
```

#### Animation Behavior

- **Initial Load**: Progress animates from 0% to target value over 600ms
- **Value Changes**: Smoothly transitions between values
- **Easing**: Water-flow curve (cubic-bezier(0.4, 0.0, 0.2, 1))
- **Label**: Fades in with scale animation after 200ms delay
- **Respects Motion Preferences**: Honors prefers-reduced-motion via Framer Motion

#### Implementation Details

The component uses:
- **Circular SVG Path**: Two circles (background + progress)
- **Stroke Dash Animation**: `strokeDashoffset` for progress animation
- **Rotation**: SVG rotated -90° to start progress at top
- **Round Line Caps**: Smooth, rounded progress ring ends
- **Drop Shadow**: Colored shadow matching progress color for depth
- **Responsive Text**: Text size adjusts based on available space

#### Dashboard Use Cases

**Metric Cards:**
```tsx
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold mb-4">Daily Tasks</h3>
  <div className="flex justify-center">
    <CircularProgress value={82} size={140} label="Complete" color="#76E4C3" />
  </div>
  <p className="text-center text-sm text-gray-600 mt-4">
    18 of 22 tasks completed today
  </p>
</div>
```

**Inline Mini Progress:**
```tsx
<div className="flex items-center gap-4">
  <CircularProgress value={90} size={40} strokeWidth={4} />
  <div>
    <div className="font-medium">Water Quality Check</div>
    <div className="text-sm text-gray-500">pH, chlorine, temperature</div>
  </div>
</div>
```

**Multiple Metrics Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <CircularProgress value={82} label="Tasks" color="#76E4C3" />
  <CircularProgress value={95} label="Staffed" color="#1B7FBD" />
  <CircularProgress value={68} label="On Track" color="#4DD0E1" />
</div>
```

#### Accessibility

- **ARIA Role**: `progressbar` for screen readers
- **ARIA Attributes**:
  - `aria-valuenow`: Current progress value
  - `aria-valuemin`: Always 0
  - `aria-valuemax`: Always 100
  - `aria-label`: Descriptive label or default "Progress: X%"
- **Semantic Structure**: Proper nesting and text hierarchy
- **Motion Respect**: Framer Motion respects prefers-reduced-motion

#### Performance

- **GPU Acceleration**: SVG transforms are hardware-accelerated
- **Efficient Rendering**: Framer Motion optimized animations
- **No Layout Thrashing**: Animations don't trigger reflows
- **Lightweight**: Minimal DOM nodes, optimized SVG paths

#### Responsive Considerations

CircularProgress scales naturally but consider these patterns:

```tsx
// Responsive sizing
<CircularProgress 
  value={75} 
  size={window.innerWidth < 768 ? 100 : 140} 
/>

// Mobile-first with Tailwind (using wrapper)
<div className="w-24 h-24 md:w-32 md:h-32">
  <CircularProgress value={75} size={120} />
</div>

// Adjust stroke for small sizes
<CircularProgress 
  value={80} 
  size={60} 
  strokeWidth={6}  // Thinner for small sizes
/>
```

#### Requirements Validation

This component validates:
- **Requirement 12.1**: System displays progress using circular progress indicators ✓
- **Requirement 12.5**: Data visualizations use colors from defined color system ✓

#### Examples

See `CircularProgress.example.tsx` for comprehensive usage examples including:
- Basic usage with different values
- With labels
- Size variants (60px to 200px)
- Stroke width variants
- Custom colors from design system
- Dashboard metric cards
- Mini inline progress indicators
- Dark background usage
- Code examples

#### Testing

The CircularProgress component includes comprehensive unit tests covering:
- Basic rendering with all props
- Value prop handling (0, 50, 100, negative, over 100, decimals)
- Size prop (default, custom, small, large)
- Stroke width prop (default, custom, thin, thick)
- Label prop (none, with label, empty, long)
- Color prop (default accent, custom hex, named colors, RGB)
- ClassName prop
- Accessibility (ARIA attributes, roles, labels)
- SVG structure (viewBox, circles, styling)
- Edge cases (very small/large sizes, decimal values)
- Circle calculations (circumference, offset)

Run tests:
```bash
npm test -- CircularProgress.test.tsx
```

All 48 tests pass successfully.

#### Browser Support

Requires:
- SVG support (all modern browsers)
- CSS transforms (all modern browsers)
- React 18+
- Framer Motion (bundled dependency)

#### Troubleshooting

**Progress not animating:**
- Check that Framer Motion is installed
- Verify value prop is changing
- Check console for errors

**Text not visible:**
- Ensure sufficient size (minimum 60px recommended with labels)
- Check text color contrast
- Verify label prop is provided

**Wrong color:**
- Verify color prop is valid CSS color
- Check that color isn't being overridden by className

**Value not updating:**
- Ensure component is receiving new value prop
- Check that value is a number, not a string

---

## Design Tokens

The components use the following design tokens from the AquaSense design system:

### Colors
- `#0A3D62` - Deep Ocean (primary)
- `#1B7FBD` - Pool Blue (secondary)
- `#4DD0E1` - Aqua (accent)
- `#76E4C3` - Fresh Mint (highlight)

### Shadows
- `shadow-sm` through `shadow-2xl` - Progressive depth
- `shadow-glass` - Glass effect with inset highlight
- `shadow-water` - Colored aqua shadow

### Border Radius
- `rounded-md` (12px) - Default card corners
- `rounded-lg` (16px) - Larger elements
- `rounded-xl` (24px) - Hero sections

### Motion
- `ease-water-flow` - Smooth deceleration
- `ease-water-ripple` - Gentle bounce
- `ease-water-wave` - Symmetric ease
- `duration-base` (250ms) - Standard transitions

These tokens ensure consistency across all components in the design system.

## Browser Support

The Logo component works in all modern browsers that support:
- SVG (all modern browsers)
- React 18+
- CSS transforms (for any custom animations)

## Future Enhancements

Potential future improvements:
- Animated logo variants with water ripple effects
- Dark mode color variants
- Monochrome variant (single color)
- Logo loading skeleton
