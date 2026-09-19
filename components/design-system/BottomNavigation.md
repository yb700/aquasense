# BottomNavigation Component

A mobile-optimized bottom navigation bar component for the AquaSense Design System. Provides fixed-bottom navigation with glass effect, designed for touch-friendly mobile and tablet experiences.

## Features

- **Fixed Bottom Positioning**: Stays accessible at the bottom of the viewport
- **Mobile-First**: Only visible on mobile/tablet viewports (<1024px)
- **Glass Effect**: Translucent background with backdrop blur for premium feel
- **Touch-Optimized**: Minimum 44x44px touch targets for all interactive elements
- **Active State**: Highlights current page with accent color and indicator
- **Badge Support**: Optional notification counts on navigation items
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Dark Mode**: Automatic theme adaptation
- **Smooth Animations**: Water-inspired transitions (respects prefers-reduced-motion)

## Requirements Validation

**Validates Requirements:**
- 8.1: Fixed bottom navigation for mobile viewports
- 8.2: Glass effect with translucent background and backdrop blur
- 8.3: Display 4-5 primary navigation items with icons and labels
- 8.6: 56px minimum height for touch targets (72px including safe area)
- 22.2: WCAG 2.1 AA contrast ratios and accessibility support

## Usage

### Basic Example

```tsx
import { BottomNavigation } from '@/components/design-system';
import { Home, Calendar, ClipboardList, Settings } from 'lucide-react';

const MyPage = () => {
  const navigationItems = [
    { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
    { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar size={24} /> },
    { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList size={24} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={24} /> },
  ];

  return (
    <div>
      <main>
        {/* Your page content */}
      </main>
      
      <BottomNavigation 
        items={navigationItems} 
        currentPath="/dashboard" 
      />
    </div>
  );
};
```

### With Notification Badges

```tsx
const navigationItems = [
  { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
  { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar size={24} />, badge: 3 },
  { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList size={24} />, badge: 12 },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={24} /> },
];

<BottomNavigation items={navigationItems} currentPath="/dashboard/shifts" />
```

### Maximum Items (5)

```tsx
import { Home, Calendar, ClipboardList, Users, Settings } from 'lucide-react';

const navigationItems = [
  { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
  { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar size={24} /> },
  { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList size={24} /> },
  { label: 'Team', href: '/dashboard/team', icon: <Users size={24} /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={24} /> },
];

<BottomNavigation items={navigationItems} currentPath="/dashboard/team" />
```

## Props

### `BottomNavigationProps`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `NavigationItem[]` | Yes | Array of navigation items (max 5 recommended) |
| `currentPath` | `string` | Yes | Current active route path for highlighting |

### `NavigationItem`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | Yes | Display label for the navigation item |
| `href` | `string` | Yes | Target route path |
| `icon` | `React.ReactNode` | Yes | Icon component (24x24px recommended) |
| `badge` | `number` | No | Optional notification count (displays 99+ for values >99) |

## Design Tokens Used

### Colors
- `accent-300`: Active state highlight
- `neutral-600/400`: Inactive state text
- `error`: Badge background
- `white/90` & `card/90`: Glass background
- `neutral-200/700`: Border color

### Spacing
- `min-h-[56px]`: Touch target height
- `min-w-touch` / `min-h-touch`: 44px minimum touch areas
- `px-2`: Container horizontal padding
- `py-2`: Item vertical padding

### Shadows
- `shadow-lg`: Elevated shadow for glass effect
- `dark:shadow-dark-lg`: Dark mode variant

### Motion
- `duration-base`: 250ms transition duration
- `ease-water-flow`: Water-inspired easing function
- `scale: 0.9`: Tap feedback animation

## Responsive Behavior

- **Mobile (<640px)**: Visible, fixed to bottom
- **Tablet (640-1023px)**: Visible, fixed to bottom
- **Desktop (≥1024px)**: Hidden (use NavigationRail instead)

## Active State Highlighting

The component highlights the active page in two ways:

1. **Icon & Label Color**: Uses `accent-300` color
2. **Top Indicator**: Animated bar at top of active item

Active state is detected by:
- Exact path match: `currentPath === item.href`
- Sub-path match: `currentPath.startsWith(item.href + '/')`

## Accessibility

- **Keyboard Navigation**: All items are focusable and keyboard-accessible
- **ARIA Labels**: Navigation has `aria-label="Mobile navigation"`
- **Active Indication**: Current page has `aria-current="page"`
- **Touch Targets**: All interactive elements meet 44x44px minimum
- **Contrast Ratios**: WCAG 2.1 AA compliant color combinations
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## Badge Behavior

- Displays only when `badge > 0`
- Shows actual count for values 1-99
- Shows "99+" for values ≥100
- Positioned at top-right of icon
- Red background (`error` color) for high visibility
- Minimum 18x18px size for readability

## Best Practices

### Item Count
- **Recommended**: 4-5 items for optimal mobile UX
- **Minimum**: 3 items to avoid wasted space
- **Maximum**: Component limits to 5 items (additional items are not displayed)

### Icon Selection
- Use 24x24px icons from lucide-react for consistency
- Choose icons that are recognizable at small sizes
- Ensure icons are semantically meaningful

### Label Text
- Keep labels short (1-2 words)
- Use clear, action-oriented language
- Ensure labels match the page title

### Layout Considerations
- Add `pb-20` or `pb-[72px]` to page content to prevent overlap
- Use `pb-safe` for additional padding on devices with notches/home indicators
- Test on actual mobile devices to verify thumb reachability

### Content Management
- Sort items by usage frequency (most used first)
- Place destructive actions (logout) in overflow menu, not bottom nav
- Consider user's dominant hand when ordering items

## Dark Mode

The component automatically adapts to dark mode:
- Background: `dark:bg-card/90` (translucent dark surface)
- Text: `dark:text-neutral-400` (inactive), accent color (active)
- Border: `dark:border-neutral-700`
- Shadow: `dark:shadow-dark-lg`

Apply dark mode at the app level using the `dark` class on a parent element.

## Performance Notes

- Uses CSS transforms for animations (hardware-accelerated)
- Framer Motion animations are disabled when `prefers-reduced-motion` is enabled
- Navigation items are sliced to max 5 at render time (no performance impact)
- Fixed positioning with `z-50` ensures proper layering

## Integration with NavigationRail

For a complete navigation experience:

```tsx
// app/[locale]/layout.tsx
import { NavigationRail } from '@/components/design-system/NavigationRail';
import { BottomNavigation } from '@/components/design-system/BottomNavigation';

export default function DashboardLayout({ children }) {
  const items = [
    { label: 'Home', href: '/dashboard', icon: <Home size={24} /> },
    // ... more items
  ];

  return (
    <div>
      {/* Desktop: Vertical rail on left */}
      <NavigationRail items={items} currentPath={pathname} userName="User" />
      
      {/* Main content with margin for desktop rail */}
      <main className="lg:ml-[280px]">
        {children}
      </main>
      
      {/* Mobile: Fixed bottom nav */}
      <BottomNavigation items={items} currentPath={pathname} />
    </div>
  );
}
```

## Testing

The component includes comprehensive unit tests covering:
- Rendering all navigation items
- Active state highlighting
- Badge display and formatting
- Touch target sizing
- Responsive visibility
- Accessibility attributes
- Glass effect styling
- Item count limiting

Run tests with:
```bash
npm test -- BottomNavigation.test.tsx
```

## Examples

See `BottomNavigation.example.tsx` for complete usage examples including:
- Basic navigation
- With badges
- Dark mode
- Dashboard integration

## Related Components

- **NavigationRail**: Desktop vertical navigation
- **Logo**: Brand identity component for navigation header
- **FloatingCard**: Card component with similar glass effect
