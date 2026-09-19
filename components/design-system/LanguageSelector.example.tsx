import React from 'react';
import { LanguageSelector } from './LanguageSelector';

/**
 * LanguageSelector Component Examples
 * 
 * Demonstrates various use cases and configurations of the LanguageSelector component.
 */

export default function LanguageSelectorExamples() {
  const [currentLocale, setCurrentLocale] = React.useState<string>('en');

  const handleLocaleChange = (locale: string) => {
    console.log('Language changed to:', locale);
    setCurrentLocale(locale);
  };

  return (
    <div className="space-y-12 p-8">
      <section>
        <h2 className="text-2xl font-bold mb-6">LanguageSelector Component Examples</h2>
        <p className="text-muted-foreground mb-8">
          Language selector for switching between EN/DA with i18n integration.
        </p>
      </section>

      {/* Inline Variant (Default) */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Inline Button Group (Default)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Button group with flag icons and labels. Best for desktop navigation.
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <LanguageSelector
            variant="inline"
            currentLocale={currentLocale}
            onLocaleChange={handleLocaleChange}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Current locale: <strong>{currentLocale}</strong>
        </div>
      </section>

      {/* Dropdown Variant */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Dropdown Select</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Compact select menu with globe icon. Space-efficient for mobile or footer.
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <LanguageSelector
            variant="dropdown"
            currentLocale={currentLocale}
            onLocaleChange={handleLocaleChange}
          />
        </div>
      </section>

      {/* In Navigation Context */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">In Navigation Bar</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Example of language selector in a navigation context.
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-lg font-bold">AquaSense</span>
              <div className="flex gap-4 text-sm">
                <a href="#" className="hover:text-accent">Dashboard</a>
                <a href="#" className="hover:text-accent">Shifts</a>
                <a href="#" className="hover:text-accent">Incidents</a>
              </div>
            </div>
            <LanguageSelector
              variant="inline"
              currentLocale={currentLocale}
              onLocaleChange={handleLocaleChange}
            />
          </nav>
        </div>
      </section>

      {/* In Footer Context */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">In Footer</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Dropdown variant is ideal for footer placement (per requirements).
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <footer className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
            <LanguageSelector
              variant="dropdown"
              currentLocale={currentLocale}
              onLocaleChange={handleLocaleChange}
            />
          </footer>
        </div>
      </section>

      {/* Dark Mode Example */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Dark Mode</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Language selector adapts to dark theme automatically.
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-neutral-900 text-white dark">
          <div className="space-y-6">
            <div>
              <p className="text-xs text-neutral-400 mb-3">Inline variant in dark mode:</p>
              <LanguageSelector
                variant="inline"
                currentLocale={currentLocale}
                onLocaleChange={handleLocaleChange}
              />
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-3">Dropdown variant in dark mode:</p>
              <LanguageSelector
                variant="dropdown"
                currentLocale={currentLocale}
                onLocaleChange={handleLocaleChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styling */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Styling</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Apply custom classes for specific contexts.
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">With custom margin and padding:</p>
            <LanguageSelector
              variant="inline"
              currentLocale={currentLocale}
              onLocaleChange={handleLocaleChange}
              className="my-4 p-2"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Right-aligned:</p>
            <div className="flex justify-end">
              <LanguageSelector
                variant="dropdown"
                currentLocale={currentLocale}
                onLocaleChange={handleLocaleChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Accessibility Features</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Fully keyboard navigable with proper ARIA labels and focus states.
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>Keyboard navigation: Tab to focus, Enter/Space to activate</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>ARIA labels: "Language selector" group, "Switch to [Language]" buttons</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>ARIA pressed state: Active language button indicated</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>Focus ring: Visible focus indicator with accent color</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>Touch targets: Minimum 44x44px for all interactive elements</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>Icons hidden: Decorative icons hidden from screen readers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Examples */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Integration Examples</h3>
          <p className="text-sm text-muted-foreground mb-4">
            How to integrate with next-intl and custom logic.
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">Default (next-intl integration):</p>
              <pre className="text-xs bg-neutral-100 dark:bg-neutral-800 p-3 rounded overflow-x-auto">
{`<LanguageSelector variant="inline" />
// Automatically uses next-intl's useLocale and navigation`}
              </pre>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">With custom handler:</p>
              <pre className="text-xs bg-neutral-100 dark:bg-neutral-800 p-3 rounded overflow-x-auto">
{`const [locale, setLocale] = useState('en');

<LanguageSelector
  currentLocale={locale}
  onLocaleChange={(newLocale) => {
    setLocale(newLocale);
    // Custom logic here (e.g., API call, analytics)
  }}
  variant="dropdown"
/>`}
              </pre>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">In footer (per requirements):</p>
              <pre className="text-xs bg-neutral-100 dark:bg-neutral-800 p-3 rounded overflow-x-auto">
{`<footer className="py-8 px-4">
  <div className="flex justify-between items-center">
    <div>© 2024 AquaSense</div>
    <LanguageSelector variant="dropdown" />
  </div>
</footer>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* State Demo */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Interactive State Demo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try switching languages to see state changes in real-time.
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm">Current Language:</span>
              <span className="text-lg font-bold text-accent">
                {currentLocale === 'en' ? '🇬🇧 English' : '🇩🇰 Dansk'}
              </span>
            </div>
            <div className="flex gap-4">
              <LanguageSelector
                variant="inline"
                currentLocale={currentLocale}
                onLocaleChange={handleLocaleChange}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Language changes are logged to console and update the state above.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
