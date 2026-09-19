# NavigationRail Component

A vertical navigation sidebar for desktop layouts (≥1024px viewport) with a water-inspired glass effect design.

## Features

- **Fixed Left Sidebar**: 280px width on desktop viewports (≥1024px)
- **Glass Effect**: Translucent background with backdrop blur for premium feel
- **Three Sections**: Logo at top, navigation items in middle, user profile at bottom
- **Active State Highlighting**: Visual indicator for current page with animated bar
- **Ripple Effects**: Water-like hover interactions on navigation items
- **Badge Support**: Optional notification badges on navigation items
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and ARIA labels
- **Reduced Motion Support**: Respects user's motion preferences
- **Dark Mode**: Fully themed for light and dark modes

## Usage

```tsx
import { NavigationRail } from '@/components/design-system';
import { Home, Calendar, ClipboardList, Users, Settings } from 'lucide-react';

const items = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home size={20} />,
  },
  {
    label: 'Schedule',
    href: '/schedule',
    icon: <Calendar size={20} />,
    badge: 3, // Optional badge count
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: <ClipboardList size={20} />,
  },
  {
    label: 'Staff',
    href: '/staff',
    icon: <Users size={20} />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={20} />,
  },
];

function AppLayout() {
  const currentPath = '/dashboard'; // Get from router
  const userName = 'Jane Smith'; // Get from auth context

  return (
    <div className="min-h-screen">
      <NavigationRail
        items={items}
        currentPath={currentPath}
        userName={userName}
      />
      
      {/* Main content should have left margin on desktop */}
      <main className="lg:ml-[280px] p-8">
        {/* Your page content */}
      </main>
    </div>
  );
}
```

## Props

### NavigationRailProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `NavigationItem[]` | Yes | Array of navigation items to display |
| `currentPath` | `string` | Yes | Current active path for highlighting (supports nested routes) |
| `userName` | `string` | Yes | User's display name shown in profile section |

### NavigationItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | Yes | Display text for the navigation item |
| `href` | `string` | Yes | URL/path for the navigation link |
| `icon` | `React.ReactNode` | Yes | Icon component (recommend lucide-react icons at 20px) |
| `badge` | `number` | No | Optional notification count (shows "99+" if >99, hidden if 0) |

## Layout Integration

The NavigationRail is a **desktop-only** component that:

1. **Only displays on ≥1024px viewports** (lg breakpoint)
2. **Is fixed positioned** at the left edge of the screen
3. **Takes up 280px width** when visible

### Responsive Layout Pattern

```tsx
// In your root layout or page component:
<div className="min-h-screen bg-background">
  {/* Desktop Navigation Rail (≥1024px) */}
  <NavigationRail 
    items={navItems}
    currentPath={pathname}
    userName={user.name}
  />
  
  {/* Mobile/Tablet Bottom Navigation (<1024px) */}
  <BottomNavigation 
    items={mobileNavItems}
    currentPath={pathname}
  />
  
  {/* Main Content */}
  <main className="lg:ml-[280px] pb-20 lg:pb-0">
    {children}
  </main>
</div>
```

**Important**: Add `lg:ml-[280px]` to your main content area to offset the fixed NavigationRail on desktop.

## Active State Detection

The component highlights navigation items in two ways:

1. **Exact match**: `currentPath === item.href`
2. **Nested routes**: `currentPath.startsWith(item.href + '/')`

This means `/settings/profile` will highlight the `/settings` nav item.

## Badge Behavior

- **Hidden** when `badge` is `undefined` or `0`
- **Shows count** for values 1-99
- **Shows "99+"** for values ≥100
- **Styled with error color** for visibility
- **Accessible** with proper semantic HTML

## Styling

The component uses:

- **Design tokens** from Tailwind config (colors, spacing, shadows)
- **Glass effect**: `bg-white/80 dark:bg-card/80 backdrop-blur-lg`
- **Water-inspired motion**: `ease-water-flow` timing function
- **Layered depth**: Shadow tokens from design system
- **Minimum touch targets**: 44px height per WCAG guidelines

## Accessibility

✅ **ARIA labels** on navigation elements  
✅ **Semantic HTML** with `<nav>` and `role="list"`  
✅ **Keyboard navigation** with proper focus states  
✅ **Active page indication** with `aria-current="page"`  
✅ **Reduced motion support** disables animations when preferred  
✅ **Color contrast** meets WCAG 2.1 AA standards  
✅ **Screen reader friendly** with descriptive labels

## Animation Details

### Ripple Effect
- Triggered on hover
- Uses `water-ripple` easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- 400ms duration
- Respects `prefers-reduced-motion`

### Active Indicator
- Animated bar on the left side of active items
- Uses Framer Motion `layoutId` for smooth transitions
- Spring animation with controlled stiffness/damping

### Tap Scale
- Subtle scale down (0.98) on tap
- 150ms duration
- Provides tactile feedback

## Design Validation

**Validates Requirements:**
- ✅ 8.1: Vertical navigation rail on desktop viewport
- ✅ 8.2: Subtle translucency (glass effect)
- ✅ 8.6: Logo at top, user profile at bottom

## Related Components

- **BottomNavigation**: Mobile/tablet navigation component
- **Logo**: AquaSense logo used in the header
- **FloatingCard**: Similar glass effect implementation

## Examples

See `NavigationRail.example.tsx` for complete usage examples including:
- Basic navigation
- With badges
- Nested route highlighting
- Dark mode
- Responsive layout patterns
