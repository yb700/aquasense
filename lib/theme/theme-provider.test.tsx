/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme, getStoredTheme } from './theme-provider';
import React from 'react';

describe('ThemeProvider', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Clear localStorage before each test
    localStorageMock.clear();

    // Clear document classes
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ThemeProvider initialization', () => {
    it('should render children', () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should initialize with light theme by default', async () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Wait for mount effect
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId('theme').textContent).toBe('light');
    });

    it('should initialize with defaultTheme prop', async () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('should load theme from localStorage if available', async () => {
      localStorageMock.setItem('aquasense-theme', 'dark');

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('should respect system preference when no stored theme', async () => {
      // Mock system preference for dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });
  });

  describe('Theme toggling', () => {
    it('should toggle from light to dark', async () => {
      const TestComponent = () => {
        const { theme, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId('theme').textContent).toBe('light');

      await act(async () => {
        screen.getByText('Toggle').click();
      });

      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('should toggle from dark to light', async () => {
      localStorageMock.setItem('aquasense-theme', 'dark');

      const TestComponent = () => {
        const { theme, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId('theme').textContent).toBe('dark');

      await act(async () => {
        screen.getByText('Toggle').click();
      });

      expect(screen.getByTestId('theme').textContent).toBe('light');
    });

    it('should persist theme changes to localStorage', async () => {
      const TestComponent = () => {
        const { toggleTheme } = useTheme();
        return <button onClick={toggleTheme}>Toggle</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        screen.getByText('Toggle').click();
      });

      expect(localStorageMock.getItem('aquasense-theme')).toBe('dark');
    });
  });

  describe('setTheme function', () => {
    it('should set theme explicitly to dark', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId('theme').textContent).toBe('light');

      await act(async () => {
        screen.getByText('Set Dark').click();
      });

      expect(screen.getByTestId('theme').textContent).toBe('dark');
    });

    it('should set theme explicitly to light', async () => {
      localStorageMock.setItem('aquasense-theme', 'dark');

      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={() => setTheme('light')}>Set Light</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTestId('theme').textContent).toBe('dark');

      await act(async () => {
        screen.getByText('Set Light').click();
      });

      expect(screen.getByTestId('theme').textContent).toBe('light');
    });

    it('should persist explicit theme changes to localStorage', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('dark')}>Set Dark</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        screen.getByText('Set Dark').click();
      });

      expect(localStorageMock.getItem('aquasense-theme')).toBe('dark');
    });
  });

  describe('Document root class application', () => {
    it('should apply light class to document root', async () => {
      const TestComponent = () => {
        useTheme();
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should apply dark class to document root when theme is dark', async () => {
      localStorageMock.setItem('aquasense-theme', 'dark');

      const TestComponent = () => {
        useTheme();
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should update document root class when theme changes', async () => {
      const TestComponent = () => {
        const { toggleTheme } = useTheme();
        return <button onClick={toggleTheme}>Toggle</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      await act(async () => {
        screen.getByText('Toggle').click();
      });

      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      console.error = consoleError;
    });

    it('should provide theme context when used within ThemeProvider', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.theme).toBe('light');
      expect(typeof result.current.toggleTheme).toBe('function');
      expect(typeof result.current.setTheme).toBe('function');
    });
  });

  describe('getStoredTheme helper', () => {
    it('should return light theme when nothing is stored', () => {
      expect(getStoredTheme()).toBe('light');
    });

    it('should return stored theme from localStorage', () => {
      localStorageMock.setItem('aquasense-theme', 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('should return light for invalid stored values', () => {
      localStorageMock.setItem('aquasense-theme', 'invalid');
      expect(getStoredTheme()).toBe('light');
    });

    it('should return light when called server-side', () => {
      // Mock server environment
      const originalWindow = global.window;
      // @ts-expect-error - Testing server-side behavior
      delete global.window;

      expect(getStoredTheme()).toBe('light');

      // Restore window
      global.window = originalWindow;
    });
  });
});
