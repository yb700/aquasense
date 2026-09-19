import React from 'react';
import { FloatingCard } from './FloatingCard';

/**
 * FloatingCard Component Examples
 * 
 * Demonstrates different variants and use cases for the FloatingCard component.
 */
export default function FloatingCardExamples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-accent-50 dark:from-background dark:to-neutral-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary-500 dark:text-primary-300">
            FloatingCard Component
          </h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-300">
            Premium card component with layered depth and water-inspired styling
          </p>
        </header>

        {/* Standard Variant */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary-500 dark:text-primary-300">
            Standard Variant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <FloatingCard>
              <h3 className="text-xl font-semibold text-primary-500 mb-2">
                Basic Card
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                A standard card with solid background, soft shadow, and built-in responsive padding (p-4 on mobile, p-6 on tablet+).
              </p>
            </FloatingCard>

            {/* Card with hover */}
            <FloatingCard hover>
              <h3 className="text-xl font-semibold text-secondary-500 mb-2">
                Hoverable Card
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Hover over this card to see the gentle elevation animation with Y-axis translation.
              </p>
            </FloatingCard>

            {/* Card with custom styling */}
            <FloatingCard hover className="border-l-4 border-accent-300">
              <h3 className="text-xl font-semibold text-accent-500 mb-2">
                Custom Styled
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Additional styling can be easily combined using the className prop.
              </p>
            </FloatingCard>
          </div>
        </section>

        {/* Glass Variant */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary-500 dark:text-primary-300">
            Glass Variant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Glass card */}
            <FloatingCard glass>
              <h3 className="text-xl font-semibold text-primary-500 mb-2">
                Glass Effect
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Translucent background (bg-white/10 or bg-black/10) with backdrop-blur-lg creates a premium frosted glass effect.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm">
                  Translucent
                </span>
                <span className="px-3 py-1 bg-highlight-100 dark:bg-highlight-900/30 text-highlight-700 dark:text-highlight-300 rounded-full text-sm">
                  Blurred
                </span>
              </div>
            </FloatingCard>

            {/* Glass card with hover */}
            <FloatingCard glass hover>
              <h3 className="text-xl font-semibold text-secondary-500 mb-2">
                Glass + Hover
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Combining glass effect with hover animation creates an elevated, premium interaction.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm">
                  Interactive
                </span>
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  Elevated
                </span>
              </div>
            </FloatingCard>
          </div>
        </section>

        {/* Content Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary-500 dark:text-primary-300">
            Content Examples
          </h2>
          
          {/* Stat Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FloatingCard hover className="text-center">
              <div className="text-4xl font-bold text-accent-500 mb-2">127</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Active Members
              </div>
            </FloatingCard>

            <FloatingCard hover className="text-center">
              <div className="text-4xl font-bold text-highlight-500 mb-2">98%</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Satisfaction Rate
              </div>
            </FloatingCard>

            <FloatingCard hover className="text-center">
              <div className="text-4xl font-bold text-secondary-500 mb-2">24/7</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Monitoring
              </div>
            </FloatingCard>
          </div>

          {/* Feature Card */}
          <FloatingCard glass hover className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-accent-300 to-accent-500 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-primary-500 dark:text-primary-300 mb-3">
                  Real-Time Monitoring
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                  Monitor pool conditions in real-time with advanced sensors and instant alerts. 
                  Stay informed about water quality, temperature, and chemical levels at all times.
                </p>
                <button className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </FloatingCard>

          {/* List Card */}
          <FloatingCard className="overflow-hidden p-0">
            <div className="p-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <h3 className="text-2xl font-semibold">Today's Schedule</h3>
              <p className="text-primary-100">Wednesday, November 15</p>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {[
                { time: '08:00', task: 'Morning chemical check', status: 'completed' },
                { time: '10:00', task: 'Pool cleaning', status: 'in-progress' },
                { time: '14:00', task: 'Filter maintenance', status: 'pending' },
                { time: '16:00', task: 'Evening water test', status: 'pending' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 w-16">
                      {item.time}
                    </div>
                    <div className="text-neutral-900 dark:text-neutral-100">
                      {item.task}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' ? 'bg-highlight-100 text-highlight-700 dark:bg-highlight-900/30 dark:text-highlight-300' :
                    item.status === 'in-progress' ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300' :
                    'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </FloatingCard>
        </section>

        {/* Technical Notes */}
        <FloatingCard glass>
          <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-300 mb-3">
            Technical Notes
          </h3>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>✓ Built-in responsive padding (p-4 on mobile, p-6 on tablet+)</li>
            <li>✓ Uses shadow tokens from design system (shadow-md, shadow-glass, shadow-lg on hover)</li>
            <li>✓ Uses border radius token (rounded-md = 12px)</li>
            <li>✓ Glass variant uses bg-white/10 or bg-black/10 with backdrop-blur-lg</li>
            <li>✓ Respects prefers-reduced-motion for accessibility</li>
            <li>✓ Smooth water-flow easing for hover animations</li>
            <li>✓ Dark mode support with appropriate shadow adjustments</li>
            <li>✓ Gentle Y-axis translation (-4px) on hover</li>
          </ul>
        </FloatingCard>
      </div>
    </div>
  );
}
