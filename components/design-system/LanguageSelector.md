# LanguageSelector Component

A language selector component for switching between Danish (DA) and English (EN) locales with full next-intl integration.

## Features

- **Two Variants**: Inline button group and dropdown select menu
- **i18n Integration**: Seamlessly integrates with next-intl for locale switching
- **Flag Icons**: Visual language indicators (🇬🇧 🇩🇰) with globe icon
- **Water-Inspired Design**: Smooth transitions and hover effects matching AquaSense design system
- **Fully Accessible**: WCAG 2.1 AA compliant with keyboard navigation and ARIA labels
- **Touch-Optimized**: Minimum 44x44px touch targets for mobile devices
- **Responsive**: Works beautifully on all screen sizes

## Variants

### Inline Button Group (Default)
Best for desktop navigation and header placement. Displays language options as side-by-side buttons with active state highlighting.

```tsx
<LanguageSelector variant="inline" />
```

### Dropdown Select
Compact dropdown menu ideal for footer placement or space-constrained areas.

```tsx
<LanguageSelector variant="dropdown" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentLocale` | `string` | Auto-detected | Current locale code ('en' or 'da') |
| `onLocaleChange` | `(locale: string) => void` | next-intl navigation | Callback when locale changes |
| `variant` | `'inline' \| 'dropdown'` | `'inline'` | Display variant |
| `className` | `string` | `''` | Additional CSS classes |

## Usage Examples

### Basic Usage (Auto-detects locale)
```tsx
import { LanguageSelector } from '@/components/design-system';

export default function Header() {
  return (
    <nav>
      <LanguageSelector variant="inline" />
    </nav>
  );
}
```

### Custom Handler
```tsx
import { LanguageSelector } from '@/components/design-system';
import { useState } from 'react';

export default function CustomLanguageSelector() {
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    // Custom logic (e.g., analytics, API calls)
    console.log('Language changed to:', newLocale);
  };

  return (
    <LanguageSelector
      currentLocale={locale}
      onLocaleChange={handleLocaleChange}
      variant="dropdown"
    />
  );
}
```

### Footer Placement (Per Requirements)
```tsx
import { LanguageSelector } from '@/components/design-system';

export default function Footer() {
  return (
    <footer className="py-8">
      <div className="flex justify-between items-center">
        <div>© 2024 AquaSense</div>
        <LanguageSelector variant="dropdown" />
      </div>
    </footer>
  );
}
```

## Accessibility

- ✅ **Keyboard Navigation**: Tab to focus, Enter/Space to activate
- ✅ **ARIA Labels**: 
  - Inline: `"Language selector"` group with `"Switch to [Language]"` buttons
  - Dropdown: `"Select language"` combobox
- ✅ **ARIA Pressed**: Active language button indicated with `aria-pressed="true"`
- ✅ **Focus Indicators**: Visible focus ring with accent color
- ✅ **Touch Targets**: Minimum 44x44px for all interactive elements
- ✅ **Screen Readers**: Decorative icons hidden with `aria-hidden="true"`

## Design Tokens

The component uses the following AquaSense design tokens:

- **Colors**: Primary, muted-foreground, accent, border
- **Spacing**: Standard 4px grid system
- **Typography**: Text-sm with medium font-weight
- **Border Radius**: Rounded-md (12px)
- **Transitions**: Water-flow easing with 200ms duration
- **Shadows**: Subtle elevation for active state

## Requirements Validated

This component validates the following requirements from the AquaSense Design System specification:

- **Requirement 19.1**: Language selector with Danish and English options ✓
- **Requirement 19.2**: Language selector accessible in footer ✓
- **Requirement 22.2**: Visible focus indicators for keyboard navigation ✓

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- **ThemeToggle**: For switching between light/dark modes
- **NavigationRail**: Desktop navigation with language selector integration
- **BottomNavigation**: Mobile navigation

## Testing

Comprehensive test suite with 48 tests covering:
- Both variants (inline & dropdown)
- Keyboard navigation
- Accessibility features
- Visual states (hover, focus, active)
- Locale detection and switching
- Edge cases

Run tests:
```bash
npm test -- LanguageSelector.test.tsx
```

## Examples

See `LanguageSelector.example.tsx` for live interactive examples demonstrating:
- Both variants
- Integration with navigation and footer
- Dark mode compatibility
- Custom styling
- State management
