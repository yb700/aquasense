# AquaSense Theme System

The AquaSense theme system provides light and dark mode support with localStorage persistence.

## Features

- Light and dark theme support
- Automatic theme persistence in localStorage
- System preference detection as fallback
- Document root class application for CSS theming
- React context for easy access throughout the app

## Usage

### 1. Wrap your app with ThemeProvider

```tsx
// app/[locale]/layout.tsx or similar
import { ThemeProvider } from '@/lib/theme/theme-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Use the theme in components

```tsx
'use client';

import { useTheme } from '@/lib/theme/theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      
      {/* Toggle button */}
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>

      {/* Explicit set buttons */}
      <button onClick={() => setTheme('light')}>
        Light Mode
      </button>
      <button onClick={() => setTheme('dark')}>
        Dark Mode
      </button>
    </div>
  );
}
```

### 3. Theme persists automatically

The theme preference is automatically saved to localStorage with the key `aquasense-theme` and will be restored on subsequent page loads.

## API

### ThemeProvider

Props:
- `children` (ReactNode, required): Child components to wrap
- `defaultTheme` ('light' | 'dark', optional): Default theme if no preference is stored. Defaults to 'light'.

### useTheme Hook

Returns:
- `theme` ('light' | 'dark'): Current theme
- `toggleTheme` (function): Toggles between light and dark
- `setTheme` (function): Set theme explicitly to 'light' or 'dark'

Must be used within a ThemeProvider. Throws error if used outside.

### getStoredTheme Helper

A utility function to get the current theme from localStorage.

```tsx
import { getStoredTheme } from '@/lib/theme/theme-provider';

const theme = getStoredTheme(); // Returns 'light' or 'dark'
```

Returns 'light' when called server-side or when no theme is stored.

## How It Works

1. On mount, the ThemeProvider checks localStorage for a saved theme preference
2. If found, that theme is applied
3. If not found, system preference (`prefers-color-scheme`) is checked
4. The selected theme class ('light' or 'dark') is applied to `document.documentElement`
5. All theme changes are persisted to localStorage automatically
6. CSS can use `.dark` selector to apply dark mode styles

## CSS Integration

The theme provider applies either `.light` or `.dark` class to the document root. Your CSS can use this:

```css
:root {
  --background: white;
  --text: black;
}

.dark {
  --background: #0B1F2E;
  --text: #E3F2FD;
}
```

The AquaSense design system already has comprehensive CSS variables defined in `app/globals.css` that respond to the `.dark` class.

## Requirements Satisfied

- **17.1**: Provides dark mode toggle accessible via useTheme hook
- **17.2**: Applies dark mode colors through CSS class on document root
- **17.5**: Persists user's dark mode preference in localStorage
