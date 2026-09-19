/**
 * HeroSection Component Examples
 * 
 * Demonstrates various configurations and use cases for the HeroSection component.
 */

import React from 'react';
import { HeroSection } from './HeroSection';

/**
 * Example 1: Basic Hero Section (Text Only)
 * Minimal configuration with headline, subheadline, and single CTA
 */
export const BasicHeroExample = () => (
  <HeroSection
    headline="Professional Pool Management Made Simple"
    subheadline="AquaSense helps swimming pool operators streamline daily operations, manage staff, and ensure safety compliance."
    ctaText="Get Started"
    ctaHref="/signup"
  />
);

/**
 * Example 2: Hero with Secondary CTA
 * Includes both primary and secondary call-to-action buttons
 */
export const HeroWithSecondaryCTAExample = () => (
  <HeroSection
    headline="Transform Your Pool Operations"
    subheadline="From shift planning to incident reporting, AquaSense brings all your pool management tools into one intuitive platform."
    ctaText="Start Free Trial"
    ctaHref="/signup"
    secondaryCtaText="Watch Demo"
    secondaryCtaHref="/demo"
  />
);

/**
 * Example 3: Hero with Image
 * Shows the dashboard preview alongside the hero content
 */
export const HeroWithImageExample = () => (
  <HeroSection
    headline="See Your Pool Operations at a Glance"
    subheadline="Real-time dashboards, staff coordination, and safety tracking designed specifically for swimming pools."
    ctaText="Explore Features"
    ctaHref="/features"
    secondaryCtaText="View Pricing"
    secondaryCtaHref="/pricing"
    heroImage="/images/dashboard-preview.png"
    heroImageAlt="AquaSense Dashboard showing pool operations overview"
  />
);

/**
 * Example 4: Intense Background Variant
 * Uses more prominent aquatic effects for a bolder impression
 */
export const IntenseBackgroundExample = () => (
  <HeroSection
    headline="Dive Into Smarter Pool Management"
    subheadline="Join hundreds of aquatic facilities using AquaSense to improve operations and safety."
    ctaText="Get Started Today"
    ctaHref="/signup"
    secondaryCtaText="Contact Sales"
    secondaryCtaHref="/contact"
    backgroundVariant="intense"
  />
);

/**
 * Example 5: Full Configuration
 * Demonstrates all available props
 */
export const FullConfigurationExample = () => (
  <HeroSection
    headline="The Complete Pool Management Solution"
    subheadline="Everything you need to run a safe, efficient, and professional swimming pool facility."
    ctaText="Start Your Free Trial"
    ctaHref="/signup"
    secondaryCtaText="Schedule a Demo"
    secondaryCtaHref="/demo"
    heroImage="/images/mockup-devices.png"
    heroImageAlt="AquaSense on mobile and tablet devices"
    backgroundVariant="intense"
    className="custom-hero-class"
  />
);

/**
 * Example 6: Mobile-Optimized Content
 * Shorter, punchier copy optimized for mobile viewports
 */
export const MobileOptimizedExample = () => (
  <HeroSection
    headline="Pool Management Made Simple"
    subheadline="All your operations in one app."
    ctaText="Get Started"
    ctaHref="/signup"
    secondaryCtaText="Learn More"
    secondaryCtaHref="/features"
  />
);

/**
 * Example 7: Localized Content (Danish)
 * Demonstrates bilingual support
 */
export const LocalizedDanishExample = () => (
  <HeroSection
    headline="Professionel Svømmehalstyring"
    subheadline="AquaSense hjælper svømmehalsdriftsledere med at strømline daglige operationer og sikre overholdelse af sikkerhed."
    ctaText="Kom I Gang"
    ctaHref="/signup"
    secondaryCtaText="Læs Mere"
    secondaryCtaHref="/features"
  />
);

/**
 * Example Component for Documentation/Storybook
 */
export default function HeroSectionExamples() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">Basic Hero (Text Only)</h2>
        <BasicHeroExample />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Hero with Secondary CTA</h2>
        <HeroWithSecondaryCTAExample />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Hero with Image</h2>
        <HeroWithImageExample />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Intense Background</h2>
        <IntenseBackgroundExample />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Mobile-Optimized</h2>
        <MobileOptimizedExample />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Localized (Danish)</h2>
        <LocalizedDanishExample />
      </div>
    </div>
  );
}
