import React from 'react';
import { Container } from './Container';

/**
 * Container Component Examples
 * 
 * Demonstrates various usage patterns for the Container component
 * in different layout scenarios.
 */

export function ContainerExamples() {
  return (
    <div className="space-y-16 py-8">
      {/* Example 1: Default Container (1280px max-width) */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Default Container (1280px)</h2>
        <Container>
          <div className="bg-accent-100 dark:bg-accent-900 p-6 rounded-md">
            <p className="text-foreground">
              This is a default container with 1280px max-width. Perfect for standard
              application layouts. Horizontal padding scales from 16px on mobile to
              32px on desktop.
            </p>
          </div>
        </Container>
      </section>

      {/* Example 2: Narrow Container (960px) - Good for text content */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Narrow Container (960px)</h2>
        <Container maxWidth="narrow">
          <div className="bg-secondary-100 dark:bg-secondary-900 p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-2">Text-Heavy Content</h3>
            <p className="text-foreground leading-relaxed">
              Narrow containers are ideal for text-heavy content like blog posts,
              articles, or documentation. The reduced line length improves readability
              by keeping line lengths optimal (45-75 characters per line).
            </p>
          </div>
        </Container>
      </section>

      {/* Example 3: Wide Container (1440px) - Spacious layouts */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Wide Container (1440px)</h2>
        <Container maxWidth="wide">
          <div className="bg-highlight-100 dark:bg-highlight-900 p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-2">Dashboard Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white dark:bg-neutral-800 p-4 rounded">Metric 1</div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded">Metric 2</div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded">Metric 3</div>
            </div>
            <p className="text-foreground mt-4">
              Wide containers provide extra space for complex layouts like dashboards
              with multiple columns of data visualization.
            </p>
          </div>
        </Container>
      </section>

      {/* Example 4: Full Width Container - No max-width constraint */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Full Width Container</h2>
        <Container maxWidth="full">
          <div className="bg-primary-100 dark:bg-primary-900 p-6 rounded-md">
            <p className="text-foreground">
              Full width containers span the entire viewport width (minus padding).
              Useful for hero sections, full-bleed images, or edge-to-edge designs.
            </p>
          </div>
        </Container>
      </section>

      {/* Example 5: Container without padding */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Container Without Padding</h2>
        <Container padding={false} className="bg-neutral-100 dark:bg-neutral-800">
          <div className="p-6">
            <p className="text-foreground">
              Setting padding={'{false}'} removes horizontal padding. Useful when you want
              child elements to control their own spacing or extend to container edges.
            </p>
          </div>
        </Container>
      </section>

      {/* Example 6: Nested Containers */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Nested Containers</h2>
        <Container maxWidth="wide" className="bg-neutral-50 dark:bg-neutral-900 py-8">
          <h3 className="text-xl font-semibold mb-4">Outer: Wide Container</h3>
          <Container maxWidth="narrow" className="bg-white dark:bg-neutral-800 py-6">
            <p className="text-foreground">
              Inner: Narrow Container - You can nest containers for complex layouts
              where different sections need different max-widths.
            </p>
          </Container>
        </Container>
      </section>

      {/* Example 7: Container with custom className */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Container with Custom Styling</h2>
        <Container className="bg-gradient-to-r from-aqua/20 to-pool-blue/20 py-12 rounded-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Custom Styled Container</h3>
            <p className="text-foreground">
              Add custom classes for backgrounds, borders, spacing, or any other styling.
            </p>
          </div>
        </Container>
      </section>

      {/* Example 8: Real-world usage - Landing page section */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Real-world Example: Landing Page Section</h2>
        <div className="bg-gradient-to-b from-pool-blue to-deep-ocean py-20">
          <Container maxWidth="default">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to AquaSense
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Modern pool operations management for aquatic facilities
              </p>
              <button className="bg-aqua hover:bg-accent-400 text-deep-ocean px-8 py-3 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </div>
          </Container>
        </div>
      </section>

      {/* Example 9: Real-world usage - Dashboard content area */}
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Real-world Example: Dashboard Content</h2>
        <Container maxWidth="wide">
          <div className="space-y-6">
            <header className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                New Entry
              </button>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-card p-6 rounded-md shadow-md">
                  <div className="text-sm text-muted-foreground mb-2">Metric {i}</div>
                  <div className="text-3xl font-bold">{Math.floor(Math.random() * 100)}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default ContainerExamples;
