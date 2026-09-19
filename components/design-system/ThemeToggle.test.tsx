import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '@/lib/theme/theme-provider';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Helper to render with ThemeProvider
const renderWithTheme = (ui: React.ReactElement, defaultTheme: 'light' | 'dark' = 'light') => {
  localStorage.setItem('aquasense-theme', defaultTheme);
  return render(<ThemeProvider defaultTheme={defaultTheme}>{ui}</ThemeProvider>);
};

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset document classes
    document.documentElement.classList.remove('light', 'dark');
  });

  describe('Button Variant', () => {
    it('should render button variant by default', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(button).toBeInTheDocument();
    });

    it('should render button variant when explicitly specified', () => {
      renderWithTheme(<ThemeToggle variant="button" />);
      const button = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(button).toBeInTheDocument();
    });

    it('should display sun icon in light mode', () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button');
      // Check that the button contains an SVG (icon)
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should display moon icon in dark mode', () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'dark');
      const button = screen.getByRole('button', { name: /switch to light mode/i });
      expect(button).toBeInTheDocument();
    });

    it('should toggle theme when button is clicked', async () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button', { name: /switch to dark mode/i });
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('aquasense-theme')).toBe('dark');
      });
    });

    it('should toggle from dark to light when clicked', async () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'dark');
      const button = screen.getByRole('button', { name: /switch to light mode/i });
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(localStorage.getItem('aquasense-theme')).toBe('light');
      });
    });

    it('should have correct aria-label in light mode', () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('should have correct aria-label in dark mode', () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'dark');
      const button = screen.getByRole('button', { name: /switch to light mode/i });
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should have minimum 44px touch target', () => {
      renderWithTheme(<ThemeToggle variant="button" />);
      const button = screen.getByRole('button');
      // Check for h-11 w-11 classes (44px)
      expect(button).toHaveClass('h-11', 'w-11');
    });

    it('should apply custom className', () => {
      renderWithTheme(<ThemeToggle variant="button" className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Switch Variant', () => {
    it('should render switch variant', () => {
      renderWithTheme(<ThemeToggle variant="switch" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
    });

    it('should have correct aria-checked attribute in light mode', () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'light');
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('should have correct aria-checked attribute in dark mode', () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'dark');
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should toggle theme when switch is clicked', async () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'light');
      const toggle = screen.getByRole('switch');
      
      fireEvent.click(toggle);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('aquasense-theme')).toBe('dark');
      });
    });

    it('should toggle from dark to light when switch is clicked', async () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'dark');
      const toggle = screen.getByRole('switch');
      
      fireEvent.click(toggle);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(localStorage.getItem('aquasense-theme')).toBe('light');
      });
    });

    it('should have correct aria-label in light mode', () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'light');
      const toggle = screen.getByRole('switch', { name: /switch to dark mode/i });
      expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('should have correct aria-label in dark mode', () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'dark');
      const toggle = screen.getByRole('switch', { name: /switch to light mode/i });
      expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should have minimum height for touch target', () => {
      renderWithTheme(<ThemeToggle variant="switch" />);
      const toggle = screen.getByRole('switch');
      // Check for h-11 class (44px)
      expect(toggle).toHaveClass('h-11');
    });

    it('should apply custom className', () => {
      renderWithTheme(<ThemeToggle variant="switch" className="custom-switch" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('custom-switch');
    });

    it('should display icons on both sides of switch track', () => {
      const { container } = renderWithTheme(<ThemeToggle variant="switch" />);
      // Switch should contain multiple icon elements (sun and moon)
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should toggle theme when Enter key is pressed on button', async () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button');
      
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should toggle theme when Space key is pressed on button', async () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button');
      
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should toggle theme when Enter key is pressed on switch', async () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'light');
      const toggle = screen.getByRole('switch');
      
      fireEvent.keyDown(toggle, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should toggle theme when Space key is pressed on switch', async () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'light');
      const toggle = screen.getByRole('switch');
      
      fireEvent.keyDown(toggle, { key: ' ', code: 'Space' });
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should not toggle on other keys', () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button');
      
      fireEvent.keyDown(button, { key: 'a', code: 'KeyA' });
      
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('button should be focusable with tab key', () => {
      renderWithTheme(<ThemeToggle variant="button" />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });

    it('switch should be focusable with tab key', () => {
      renderWithTheme(<ThemeToggle variant="switch" />);
      const toggle = screen.getByRole('switch');
      
      toggle.focus();
      expect(toggle).toHaveFocus();
    });

    it('should have tabIndex 0 on switch', () => {
      renderWithTheme(<ThemeToggle variant="switch" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Accessibility', () => {
    it('button should have focus ring styles', () => {
      renderWithTheme(<ThemeToggle variant="button" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-accent');
    });

    it('switch should have focus ring styles', () => {
      renderWithTheme(<ThemeToggle variant="switch" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('focus:ring-2', 'focus:ring-accent');
    });

    it('icons should be hidden from screen readers', () => {
      const { container } = renderWithTheme(<ThemeToggle variant="button" />);
      const icons = container.querySelectorAll('svg');
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('button should have screen reader text', () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const srText = screen.getByText(/switch to dark mode/i, { selector: '.sr-only' });
      expect(srText).toBeInTheDocument();
    });

    it('should update aria-checked when toggled', async () => {
      renderWithTheme(<ThemeToggle variant="switch" />, 'light');
      const toggle = screen.getByRole('switch');
      
      expect(toggle).toHaveAttribute('aria-checked', 'false');
      
      fireEvent.click(toggle);
      
      await waitFor(() => {
        expect(toggle).toHaveAttribute('aria-checked', 'true');
      });
    });
  });

  describe('Visual Animations', () => {
    it('should have transition classes on button', () => {
      renderWithTheme(<ThemeToggle variant="button" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors');
    });

    it('should have transition classes on switch', () => {
      renderWithTheme(<ThemeToggle variant="switch" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('transition-colors');
    });

    it('should apply animation class during toggle', async () => {
      renderWithTheme(<ThemeToggle variant="button" />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      // Animation class should be applied temporarily
      // (testing implementation detail, but important for smooth UX)
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });
  });

  describe('Theme Persistence', () => {
    it('should persist theme change to localStorage', async () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(localStorage.getItem('aquasense-theme')).toBe('dark');
      });
    });

    it('should load initial theme from localStorage', () => {
      localStorage.setItem('aquasense-theme', 'dark');
      renderWithTheme(<ThemeToggle variant="button" />, 'dark');
      
      const button = screen.getByRole('button', { name: /switch to light mode/i });
      expect(button).toBeInTheDocument();
    });

    it('should toggle multiple times and persist each change', async () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button');
      
      // Toggle to dark
      fireEvent.click(button);
      await waitFor(() => {
        expect(localStorage.getItem('aquasense-theme')).toBe('dark');
      });
      
      // Toggle back to light
      fireEvent.click(button);
      await waitFor(() => {
        expect(localStorage.getItem('aquasense-theme')).toBe('light');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicking without errors', async () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button');
      
      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      // Should eventually settle to a theme
      await waitFor(() => {
        const theme = localStorage.getItem('aquasense-theme');
        expect(theme === 'light' || theme === 'dark').toBe(true);
      });
    });

    it('should handle missing className prop', () => {
      renderWithTheme(<ThemeToggle variant="button" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle empty className', () => {
      renderWithTheme(<ThemeToggle variant="button" className="" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should work without explicit variant prop', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Integration with ThemeProvider', () => {
    it('should use theme context from ThemeProvider', () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'dark');
      const button = screen.getByRole('button', { name: /switch to light mode/i });
      expect(button).toBeInTheDocument();
    });

    it('should update document root class when toggled', async () => {
      renderWithTheme(<ThemeToggle variant="button" />, 'light');
      const button = screen.getByRole('button');
      
      expect(document.documentElement.classList.contains('light')).toBe(true);
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(false);
      });
    });

    it('should sync with theme changes from other components', async () => {
      const { rerender } = renderWithTheme(<ThemeToggle variant="button" />, 'light');
      
      // Simulate external theme change
      localStorage.setItem('aquasense-theme', 'dark');
      
      // Rerender to pick up the change
      rerender(
        <ThemeProvider defaultTheme="dark">
          <ThemeToggle variant="button" />
        </ThemeProvider>
      );
      
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /switch to light mode/i });
        expect(button).toBeInTheDocument();
      });
    });
  });
});
