/**
 * ThemeToggle Component Examples
 * 
 * Demonstrates the usage of ThemeToggle component with different variants.
 * 
 * **Validates: Requirements 17.1, 22.2, 22.6**
 */

import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '@/lib/theme/theme-provider';

export default function ThemeToggleExamples() {
  return (
    <ThemeProvider>
      <div className="space-y-16 p-8 bg-background">
        {/* Button Variant Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Button Variant
            </h2>
            <p className="text-muted-foreground">
              Icon button with smooth sun/moon transitions
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ThemeToggle variant="button" />
              <span className="text-sm text-muted-foreground">Default button</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle variant="button" className="bg-card" />
              <span className="text-sm text-muted-foreground">
                Button with custom background
              </span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle variant="button" className="border-2 border-accent" />
              <span className="text-sm text-muted-foreground">
                Button with custom border
              </span>
            </div>
          </div>
        </section>

        {/* Switch Variant Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Switch Variant
            </h2>
            <p className="text-muted-foreground">
              Toggle switch with animated slider and icons
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ThemeToggle variant="switch" />
              <span className="text-sm text-muted-foreground">Default switch</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle variant="switch" className="scale-90" />
              <span className="text-sm text-muted-foreground">Scaled switch</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle variant="switch" className="opacity-80" />
              <span className="text-sm text-muted-foreground">
                Switch with reduced opacity
              </span>
            </div>
          </div>
        </section>

        {/* Usage in Navigation Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Usage in Navigation
            </h2>
            <p className="text-muted-foreground">
              Common patterns for integrating ThemeToggle in UI
            </p>
          </div>

          {/* Header Example */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Header Navigation
            </h3>
            <div className="flex items-center justify-between bg-card p-3 rounded-md border border-border">
              <span className="text-sm font-medium">AquaSense</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">User Name</span>
                <ThemeToggle variant="button" />
              </div>
            </div>
          </div>

          {/* Settings Panel Example */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Settings Panel
            </h3>
            <div className="bg-card p-4 rounded-md border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
                <ThemeToggle variant="switch" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Language</p>
                  <p className="text-xs text-muted-foreground">
                    Choose your preferred language
                  </p>
                </div>
                <button className="text-sm text-accent hover:underline">
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Navigation Example */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Mobile Bottom Navigation
            </h3>
            <div className="bg-card p-3 rounded-md border border-border">
              <div className="flex items-center justify-around">
                <button className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">Tasks</span>
                </button>
                <ThemeToggle variant="button" />
                <button className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Accessibility Features
            </h2>
            <p className="text-muted-foreground">
              ThemeToggle is built with accessibility in mind
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                ✓ Keyboard Navigation
              </h3>
              <p className="text-xs text-muted-foreground">
                Fully accessible with Tab, Enter, and Space keys
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                ✓ ARIA Labels
              </h3>
              <p className="text-xs text-muted-foreground">
                Descriptive labels that update based on current theme
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                ✓ Focus Indicators
              </h3>
              <p className="text-xs text-muted-foreground">
                Visible focus ring for keyboard navigation
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                ✓ Touch Targets
              </h3>
              <p className="text-xs text-muted-foreground">
                Minimum 44x44px touch targets for mobile devices
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                ✓ Screen Reader Support
              </h3>
              <p className="text-xs text-muted-foreground">
                Icons hidden from screen readers, descriptive text provided
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Implementation Notes
            </h2>
          </div>

          <div className="bg-muted border border-border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Basic Usage
              </h3>
              <pre className="text-xs bg-background p-3 rounded border border-border overflow-x-auto">
                <code>{`import { ThemeToggle } from '@/components/design-system/ThemeToggle';

// Button variant (default)
<ThemeToggle />

// Switch variant
<ThemeToggle variant="switch" />

// With custom className
<ThemeToggle variant="button" className="my-custom-class" />`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Requirements
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Must be wrapped in ThemeProvider</li>
                <li>ThemeProvider must be in a Client Component ('use client')</li>
                <li>Component automatically syncs with theme context</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Props
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">variant</code>:{' '}
                  'button' | 'switch' (default: 'button')
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">className</code>:{' '}
                  string (optional)
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
