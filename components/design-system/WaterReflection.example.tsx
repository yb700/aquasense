/**
 * WaterReflection Component Examples
 * 
 * Demonstrates various use cases for the WaterReflection component.
 * This file serves as documentation and can be used for visual testing.
 */

import React from 'react';
import { WaterReflection } from './WaterReflection';

/**
 * Example 1: Default Subtle Background Effect
 * 
 * The most common use case - a subtle water reflection
 * in the background of a section or page.
 */
export function SubtleBackgroundExample() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <WaterReflection />
      
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold text-deep-ocean">
          Welcome to AquaSense
        </h1>
        <p className="mt-4 text-lg text-neutral-800">
          Experience water-inspired design with subtle caustic reflections.
        </p>
      </div>
    </div>
  );
}

/**
 * Example 2: Hero Section with Prominent Effect
 * 
 * For landing pages or hero sections where you want
 * a more noticeable water effect.
 */
export function HeroSectionExample() {
  return (
    <section className="relative h-screen bg-gradient-to-br from-pool-blue to-deep-ocean">
      <WaterReflection opacity={0.25} speed={1.2} />
      
      <div className="relative z-10 flex h-full items-center justify-center p-8">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold">
            Pool Management Reimagined
          </h1>
          <p className="mt-6 text-xl">
            Dive into modern aquatic facility operations
          </p>
          <button className="mt-8 rounded-lg bg-aqua px-8 py-3 font-semibold text-deep-ocean transition-transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * Example 3: Card Overlay Effect
 * 
 * Adding water reflections to individual cards or containers
 * for a premium glass-like effect.
 */
export function CardOverlayExample() {
  return (
    <div className="grid gap-6 p-8 md:grid-cols-3">
      {['Shift Planning', 'Incident Reports', 'Cleaning Tasks'].map((title) => (
        <div
          key={title}
          className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg"
        >
          <WaterReflection opacity={0.05} speed={0.8} />
          
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-deep-ocean">{title}</h3>
            <p className="mt-2 text-neutral-700">
              Manage your {title.toLowerCase()} efficiently with AquaSense.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 4: Fast Moving Effect
 * 
 * For more dynamic sections or loading states where
 * you want faster-moving water reflections.
 */
export function DynamicEffectExample() {
  return (
    <div className="relative min-h-[400px] bg-gradient-to-r from-aqua to-pool-blue">
      <WaterReflection opacity={0.3} speed={2.0} />
      
      <div className="relative z-10 flex h-full items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="mb-4 text-5xl">🌊</div>
          <h2 className="text-3xl font-bold">Processing...</h2>
          <p className="mt-2">Analyzing pool data</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 5: Custom Positioned Effect
 * 
 * Demonstrates using custom className for specific positioning,
 * such as only covering part of the container.
 */
export function CustomPositionExample() {
  return (
    <div className="relative min-h-[600px] bg-white">
      {/* Water effect only on bottom half */}
      <WaterReflection 
        className="absolute bottom-0 left-0 right-0 top-1/2"
        opacity={0.15}
        speed={0.7}
      />
      
      <div className="relative z-10 p-8">
        <h2 className="text-3xl font-bold text-deep-ocean">
          Dashboard Overview
        </h2>
        <div className="mt-8 space-y-4">
          <div className="rounded-lg bg-neutral-50 p-6">
            <p>Content without water effect</p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-6">
            <p>More content transitioning to water effect below</p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-6">
            <p>Content with water effect behind it</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 6: Dark Mode Compatible
 * 
 * Water reflections work well with dark backgrounds too.
 */
export function DarkModeExample() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <WaterReflection opacity={0.2} />
      
      <div className="relative z-10 p-8 text-white">
        <h1 className="text-4xl font-bold">Dark Mode Pool Dashboard</h1>
        <p className="mt-4 text-gray-300">
          Subtle water effects enhance the aquatic theme even in dark mode.
        </p>
        
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-800/50 p-6 backdrop-blur">
            <h3 className="font-semibold text-aqua">Active Shifts</h3>
            <p className="mt-2 text-3xl font-bold">4</p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-6 backdrop-blur">
            <h3 className="font-semibold text-fresh-mint">Pool Status</h3>
            <p className="mt-2 text-3xl font-bold">Good</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Combined Examples Component
 * 
 * Renders all examples in a scrollable page for visual testing.
 */
export default function WaterReflectionExamples() {
  return (
    <div className="space-y-16">
      <div>
        <h2 className="mb-4 text-2xl font-bold">1. Subtle Background</h2>
        <SubtleBackgroundExample />
      </div>
      
      <div>
        <h2 className="mb-4 text-2xl font-bold">2. Hero Section</h2>
        <HeroSectionExample />
      </div>
      
      <div>
        <h2 className="mb-4 text-2xl font-bold">3. Card Overlay</h2>
        <CardOverlayExample />
      </div>
      
      <div>
        <h2 className="mb-4 text-2xl font-bold">4. Dynamic Effect</h2>
        <DynamicEffectExample />
      </div>
      
      <div>
        <h2 className="mb-4 text-2xl font-bold">5. Custom Position</h2>
        <CustomPositionExample />
      </div>
      
      <div>
        <h2 className="mb-4 text-2xl font-bold">6. Dark Mode</h2>
        <DarkModeExample />
      </div>
    </div>
  );
}
