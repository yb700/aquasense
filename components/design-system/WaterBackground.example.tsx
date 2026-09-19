/**
 * WaterBackground Component Examples
 * 
 * Demonstrates various use cases for the WaterBackground component.
 * Shows different variants and intensity levels for dashboard and page backgrounds.
 */

import React from 'react';
import { WaterBackground } from './WaterBackground';

/**
 * Example 1: Subtle Dashboard Background (Default)
 * 
 * The most common use case - a subtle water-inspired background
 * for dashboard pages that doesn't interfere with content readability.
 */
export function SubtleDashboardExample() {
  return (
    <WaterBackground>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-foreground">
          Pool Operations Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Subtle aquatic background enhances the theme without distracting from content.
        </p>
        
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-card p-6 shadow-md">
            <h3 className="font-semibold text-primary">Active Shifts</h3>
            <p className="mt-2 text-3xl font-bold">12</p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-md">
            <h3 className="font-semibold text-secondary">Incidents Today</h3>
            <p className="mt-2 text-3xl font-bold">3</p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-md">
            <h3 className="font-semibold text-accent">Pool Status</h3>
            <p className="mt-2 text-3xl font-bold">Good</p>
          </div>
        </div>
      </div>
    </WaterBackground>
  );
}

/**
 * Example 2: Medium Intensity Background
 * 
 * For pages where you want a more noticeable aquatic atmosphere
 * with caustic light effects visible in the background.
 */
export function MediumIntensityExample() {
  return (
    <WaterBackground intensity="medium" variant="light">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-foreground">
          Shift Planning
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Plan and manage staff shifts with a more prominent aquatic feel.
        </p>
        
        <div className="mt-8 space-y-4">
          {['Morning Shift', 'Afternoon Shift', 'Evening Shift'].map((shift) => (
            <div key={shift} className="rounded-xl bg-card/90 p-6 shadow-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary">{shift}</h3>
              <p className="mt-2 text-muted-foreground">
                3 staff members assigned • 08:00 - 16:00
              </p>
            </div>
          ))}
        </div>
      </div>
    </WaterBackground>
  );
}

/**
 * Example 3: Strong Intensity Background
 * 
 * For landing pages or hero sections where you want
 * the most prominent aquatic atmosphere.
 */
export function StrongIntensityExample() {
  return (
    <WaterBackground intensity="strong" variant="light">
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-foreground">
            Welcome to AquaSense
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Experience the most immersive aquatic management platform
          </p>
          <button className="mt-8 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </WaterBackground>
  );
}

/**
 * Example 4: Dark Mode Subtle Background
 * 
 * Dark mode variant with subtle intensity for nighttime usage.
 */
export function DarkModeSubtleExample() {
  return (
    <WaterBackground variant="dark" intensity="subtle">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-foreground">
          Night Operations Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Dark mode with subtle aquatic background for comfortable nighttime viewing.
        </p>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-card p-6 shadow-lg">
            <h3 className="font-semibold text-accent">Water Temperature</h3>
            <p className="mt-2 text-3xl font-bold text-foreground">26°C</p>
            <p className="mt-1 text-sm text-muted-foreground">Optimal range</p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-lg">
            <h3 className="font-semibold text-highlight">Chlorine Levels</h3>
            <p className="mt-2 text-3xl font-bold text-foreground">1.5 ppm</p>
            <p className="mt-1 text-sm text-muted-foreground">Within limits</p>
          </div>
        </div>
      </div>
    </WaterBackground>
  );
}

/**
 * Example 5: Dark Mode Medium Intensity
 * 
 * Dark mode with medium intensity and caustic effects.
 */
export function DarkModeMediumExample() {
  return (
    <WaterBackground variant="dark" intensity="medium">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-foreground">
          Incident Reports
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Dark mode with noticeable aquatic effects for incident management.
        </p>
        
        <div className="mt-8 space-y-4">
          {[
            { title: 'Minor slip near pool edge', severity: 'low', time: '2 hours ago' },
            { title: 'Chemical spill in storage', severity: 'medium', time: '5 hours ago' },
            { title: 'Equipment maintenance required', severity: 'low', time: '1 day ago' },
          ].map((incident, idx) => (
            <div key={idx} className="rounded-xl bg-card/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{incident.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{incident.time}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  incident.severity === 'medium' 
                    ? 'bg-warning/20 text-warning' 
                    : 'bg-info/20 text-info'
                }`}>
                  {incident.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WaterBackground>
  );
}

/**
 * Example 6: Full Page Layout with Navigation
 * 
 * Complete page example showing how WaterBackground integrates
 * with navigation and content sections.
 */
export function FullPageLayoutExample() {
  return (
    <WaterBackground intensity="subtle">
      {/* Simulated Navigation */}
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-xl font-bold text-primary">AquaSense</div>
          <div className="flex gap-6">
            <a href="#" className="text-foreground hover:text-primary">Dashboard</a>
            <a href="#" className="text-foreground hover:text-primary">Shifts</a>
            <a href="#" className="text-foreground hover:text-primary">Reports</a>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-foreground">
          Pool Management Overview
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Complete dashboard with water-inspired background treatment.
        </p>
        
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-card p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-foreground">Today's Summary</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Visitors</span>
                <span className="font-semibold text-foreground">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Staff</span>
                <span className="font-semibold text-foreground">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tasks Completed</span>
                <span className="font-semibold text-foreground">15/18</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-card p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-foreground">Water Quality</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">pH Level</span>
                <span className="font-semibold text-success">7.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperature</span>
                <span className="font-semibold text-success">26°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chlorine</span>
                <span className="font-semibold text-success">1.5 ppm</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </WaterBackground>
  );
}

/**
 * Example 7: Comparison View (Light vs Dark)
 * 
 * Side-by-side comparison of light and dark variants
 * for documentation purposes.
 */
export function ComparisonExample() {
  return (
    <div className="grid lg:grid-cols-2">
      {/* Light Mode */}
      <WaterBackground variant="light" intensity="medium">
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-4 text-4xl">☀️</div>
            <h2 className="text-3xl font-bold text-foreground">Light Mode</h2>
            <p className="mt-2 text-muted-foreground">
              Subtle aquatic feel for daytime usage
            </p>
          </div>
        </div>
      </WaterBackground>
      
      {/* Dark Mode */}
      <WaterBackground variant="dark" intensity="medium">
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-4 text-4xl">🌙</div>
            <h2 className="text-3xl font-bold text-foreground">Dark Mode</h2>
            <p className="mt-2 text-muted-foreground">
              Deep ocean atmosphere for nighttime usage
            </p>
          </div>
        </div>
      </WaterBackground>
    </div>
  );
}

/**
 * Combined Examples Component
 * 
 * Renders all examples in a scrollable page for visual testing.
 */
export default function WaterBackgroundExamples() {
  return (
    <div className="space-y-1">
      <div>
        <h2 className="bg-neutral-900 p-4 text-2xl font-bold text-white">
          1. Subtle Dashboard (Default)
        </h2>
        <SubtleDashboardExample />
      </div>
      
      <div>
        <h2 className="bg-neutral-900 p-4 text-2xl font-bold text-white">
          2. Medium Intensity
        </h2>
        <MediumIntensityExample />
      </div>
      
      <div>
        <h2 className="bg-neutral-900 p-4 text-2xl font-bold text-white">
          3. Strong Intensity
        </h2>
        <StrongIntensityExample />
      </div>
      
      <div>
        <h2 className="bg-neutral-900 p-4 text-2xl font-bold text-white">
          4. Dark Mode Subtle
        </h2>
        <DarkModeSubtleExample />
      </div>
      
      <div>
        <h2 className="bg-neutral-900 p-4 text-2xl font-bold text-white">
          5. Dark Mode Medium
        </h2>
        <DarkModeMediumExample />
      </div>
      
      <div>
        <h2 className="bg-neutral-900 p-4 text-2xl font-bold text-white">
          6. Full Page Layout
        </h2>
        <FullPageLayoutExample />
      </div>
      
      <div>
        <h2 className="bg-neutral-900 p-4 text-2xl font-bold text-white">
          7. Light vs Dark Comparison
        </h2>
        <ComparisonExample />
      </div>
    </div>
  );
}
