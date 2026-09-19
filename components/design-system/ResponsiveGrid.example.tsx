import React from 'react';
import { ResponsiveGrid } from './ResponsiveGrid';
import { FloatingCard } from './FloatingCard';

/**
 * ResponsiveGrid Component Examples
 * 
 * Demonstrates different configurations and use cases for the ResponsiveGrid component.
 */
export default function ResponsiveGridExamples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-accent-50 dark:from-background dark:to-neutral-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary-500 dark:text-primary-300">
            ResponsiveGrid Component
          </h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-300">
            Flexible CSS Grid layout with responsive column counts and design token-based spacing
          </p>
        </header>

        {/* Default Grid */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-primary-500 dark:text-primary-300 mb-2">
              Default Configuration
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns, Gap: md (16px)
            </p>
          </div>
          <ResponsiveGrid>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <FloatingCard key={num} hover className="text-center">
                <div className="text-2xl font-bold text-accent-500 mb-2">Card {num}</div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Responsive grid item
                </p>
              </FloatingCard>
            ))}
          </ResponsiveGrid>
        </section>

        {/* Custom Columns */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-primary-500 dark:text-primary-300 mb-2">
              Custom Column Counts
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Mobile: 1 column, Tablet: 3 columns, Desktop: 4 columns
            </p>
          </div>
          <ResponsiveGrid columns={{ mobile: 1, tablet: 3, desktop: 4 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <FloatingCard key={num} hover className="text-center">
                <div className="text-xl font-semibold text-secondary-500 mb-2">Item {num}</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  1/3/4 columns
                </p>
              </FloatingCard>
            ))}
          </ResponsiveGrid>
        </section>

        {/* Gap Variations */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-primary-500 dark:text-primary-300">
            Gap Size Variations
          </h2>

          {/* xs gap */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              XS Gap (4px)
            </h3>
            <ResponsiveGrid gap="xs" columns={{ mobile: 2, tablet: 3, desktop: 4 }}>
              {[1, 2, 3, 4].map((num) => (
                <FloatingCard key={num} className="text-center py-4">
                  <div className="text-sm font-semibold text-primary-500">Item {num}</div>
                </FloatingCard>
              ))}
            </ResponsiveGrid>
          </div>

          {/* sm gap */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              SM Gap (8px)
            </h3>
            <ResponsiveGrid gap="sm" columns={{ mobile: 2, tablet: 3, desktop: 4 }}>
              {[1, 2, 3, 4].map((num) => (
                <FloatingCard key={num} className="text-center py-4">
                  <div className="text-sm font-semibold text-secondary-500">Item {num}</div>
                </FloatingCard>
              ))}
            </ResponsiveGrid>
          </div>

          {/* lg gap */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              LG Gap (24px)
            </h3>
            <ResponsiveGrid gap="lg" columns={{ mobile: 2, tablet: 3, desktop: 4 }}>
              {[1, 2, 3, 4].map((num) => (
                <FloatingCard key={num} className="text-center py-4">
                  <div className="text-sm font-semibold text-accent-500">Item {num}</div>
                </FloatingCard>
              ))}
            </ResponsiveGrid>
          </div>

          {/* xl gap */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              XL Gap (32px)
            </h3>
            <ResponsiveGrid gap="xl" columns={{ mobile: 2, tablet: 3, desktop: 4 }}>
              {[1, 2, 3, 4].map((num) => (
                <FloatingCard key={num} className="text-center py-4">
                  <div className="text-sm font-semibold text-highlight-500">Item {num}</div>
                </FloatingCard>
              ))}
            </ResponsiveGrid>
          </div>
        </section>

        {/* Content Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary-500 dark:text-primary-300">
            Real-World Use Cases
          </h2>

          {/* Dashboard Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              Dashboard Stats Grid
            </h3>
            <ResponsiveGrid gap="lg" columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
              <FloatingCard hover className="text-center">
                <div className="text-4xl font-bold text-accent-500 mb-2">127</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Active Members
                </div>
              </FloatingCard>
              <FloatingCard hover className="text-center">
                <div className="text-4xl font-bold text-highlight-500 mb-2">98%</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Satisfaction
                </div>
              </FloatingCard>
              <FloatingCard hover className="text-center">
                <div className="text-4xl font-bold text-secondary-500 mb-2">24/7</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Monitoring
                </div>
              </FloatingCard>
              <FloatingCard hover className="text-center">
                <div className="text-4xl font-bold text-primary-500 mb-2">15</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Locations
                </div>
              </FloatingCard>
            </ResponsiveGrid>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              Feature Cards Grid
            </h3>
            <ResponsiveGrid gap="lg" columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
              {[
                { 
                  title: 'Real-Time Monitoring', 
                  description: 'Track water quality, temperature, and chemical levels in real-time.',
                  icon: '📊',
                  color: 'accent'
                },
                { 
                  title: 'Automated Alerts', 
                  description: 'Receive instant notifications when parameters exceed safe ranges.',
                  icon: '🔔',
                  color: 'secondary'
                },
                { 
                  title: 'Smart Scheduling', 
                  description: 'Optimize staff shifts and maintenance tasks automatically.',
                  icon: '📅',
                  color: 'highlight'
                },
                { 
                  title: 'Incident Reporting', 
                  description: 'Document and track incidents with photos and detailed notes.',
                  icon: '📝',
                  color: 'primary'
                },
                { 
                  title: 'Analytics Dashboard', 
                  description: 'Gain insights with comprehensive reports and data visualization.',
                  icon: '📈',
                  color: 'accent'
                },
                { 
                  title: 'Mobile Access', 
                  description: 'Manage operations on-the-go with our mobile-optimized interface.',
                  icon: '📱',
                  color: 'secondary'
                },
              ].map((feature, idx) => (
                <FloatingCard key={idx} hover className="h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className={`text-xl font-semibold mb-3 text-${feature.color}-500`}>
                    {feature.title}
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </FloatingCard>
              ))}
            </ResponsiveGrid>
          </div>

          {/* Product Gallery */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              Image Gallery Grid
            </h3>
            <ResponsiveGrid gap="md" columns={{ mobile: 2, tablet: 3, desktop: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <FloatingCard key={num} hover className="p-0 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-accent-200 to-secondary-300 flex items-center justify-center">
                    <div className="text-white text-4xl font-bold">{num}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Image {num}
                    </div>
                  </div>
                </FloatingCard>
              ))}
            </ResponsiveGrid>
          </div>
        </section>

        {/* Technical Notes */}
        <FloatingCard glass>
          <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-300 mb-3">
            Technical Notes
          </h3>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>✓ Mobile-first approach with progressive enhancement</li>
            <li>✓ Uses CSS Grid with responsive column counts</li>
            <li>✓ Gap sizes mapped to design system spacing tokens</li>
            <li>✓ Supports breakpoints: mobile (default), tablet (md: 768px), desktop (lg: 1024px)</li>
            <li>✓ Default configuration: 1/2/3 columns with md gap</li>
            <li>✓ Fully customizable with columns and gap props</li>
            <li>✓ Works seamlessly with FloatingCard and other components</li>
            <li>✓ Validates Requirements 18.1, 18.2, 18.3 (Responsive Layout System)</li>
          </ul>
        </FloatingCard>
      </div>
    </div>
  );
}
