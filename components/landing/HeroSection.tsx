/**
 * HeroSection Component
 * 
 * Landing page hero section with water-inspired gradient background, animated visuals,
 * and compelling call-to-action. Features full viewport height, layered depth effects,
 * and ScrollReveal animations for immersive first impression.
 * 
 * Features:
 * - Full viewport height hero section
 * - Water-inspired gradient (pool-blue to deep-ocean)
 * - Animated water reflection effects
 * - Headline, subtitle, and CTA buttons
 * - Optional hero image/device mockup
 * - ScrollReveal entrance animations
 * - Mobile-first responsive design
 * - Minimum 44x44px touch targets
 * - Dark mode support
 * 
 * Requirements:
 * - 10.1: Full viewport hero section
 * - 10.2: Animated water light reflection effects
 * - 18.1: Mobile-first responsive design
 * - 18.2: Large spacing to avoid crowded interfaces
 * 
 * @example
 * ```tsx
 * <HeroSection
 *   headline="Professional Pool Management Made Simple"
 *   subheadline="AquaSense helps swimming pool operators streamline operations"
 *   ctaText="Get Started"
 *   ctaHref="/signup"
 *   secondaryCtaText="Learn More"
 *   secondaryCtaHref="/about"
 * />
 * ```
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/design-system/ScrollReveal';
import { WaterReflection } from '@/components/design-system/WaterReflection';
import Image from 'next/image';

export interface HeroSectionProps {
  /**
   * Main headline text
   */
  headline: string;
  
  /**
   * Subheadline/description text
   */
  subheadline: string;
  
  /**
   * Primary CTA button text
   */
  ctaText: string;
  
  /**
   * Primary CTA button link
   */
  ctaHref: string;
  
  /**
   * Secondary CTA button text (optional)
   */
  secondaryCtaText?: string;
  
  /**
   * Secondary CTA button link (optional)
   */
  secondaryCtaHref?: string;
  
  /**
   * Optional hero image URL
   */
  heroImage?: string;
  
  /**
   * Alt text for hero image
   */
  heroImageAlt?: string;
  
  /**
   * Background intensity variant
   * - default: Standard gradient
   * - intense: More prominent aquatic effects
   */
  backgroundVariant?: 'default' | 'intense';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * HeroSection - Landing page hero with water-inspired design
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  heroImage,
  heroImageAlt = 'AquaSense Dashboard',
  backgroundVariant = 'default',
  className,
}) => {
  return (
    <section
      className={cn(
        'relative min-h-screen w-full overflow-hidden',
        'flex items-center justify-center',
        className
      )}
    >
      {/* Water-inspired gradient background */}
      <div
        className={cn(
          'absolute inset-0 z-0',
          backgroundVariant === 'intense'
            ? 'bg-gradient-to-br from-pool-blue via-primary-500 to-deep-ocean'
            : 'bg-gradient-to-br from-secondary-400 via-primary-500 to-primary-600'
        )}
        aria-hidden="true"
      />
      
      {/* Animated water reflection overlay */}
      <WaterReflection
        opacity={backgroundVariant === 'intense' ? 0.12 : 0.08}
        speed={0.8}
        className="absolute inset-0 z-0"
      />
      
      {/* Additional radial gradient for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_120%,rgba(77,208,225,0.15),transparent_70%)]"
        aria-hidden="true"
      />
      
      {/* Content container */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div
            className={cn(
              'grid gap-12 lg:gap-16',
              heroImage
                ? 'lg:grid-cols-2 lg:items-center'
                : 'lg:grid-cols-1 text-center'
            )}
          >
            {/* Text content */}
            <div className={cn('flex flex-col', !heroImage && 'items-center')}>
              {/* Headline */}
              <ScrollReveal direction="up" delay={0.1}>
                <h1
                  className={cn(
                    'font-bold tracking-tight text-white',
                    'text-4xl sm:text-5xl lg:text-6xl',
                    'leading-tight mb-6',
                    !heroImage && 'max-w-4xl'
                  )}
                >
                  {headline}
                </h1>
              </ScrollReveal>
              
              {/* Subheadline */}
              <ScrollReveal direction="up" delay={0.2}>
                <p
                  className={cn(
                    'text-lg sm:text-xl lg:text-2xl',
                    'text-primary-50 leading-relaxed mb-8',
                    !heroImage && 'max-w-3xl'
                  )}
                >
                  {subheadline}
                </p>
              </ScrollReveal>
              
              {/* CTA Buttons */}
              <ScrollReveal direction="up" delay={0.3}>
                <div
                  className={cn(
                    'flex flex-col sm:flex-row gap-4',
                    !heroImage && 'justify-center'
                  )}
                >
                  {/* Primary CTA */}
                  <a href={ctaHref}>
                    <Button
                      size="lg"
                      className={cn(
                        'bg-white text-primary-600 hover:bg-primary-50',
                        'shadow-xl hover:shadow-2xl',
                        'font-semibold text-lg',
                        'min-w-[180px] w-full sm:w-auto'
                      )}
                    >
                      {ctaText}
                    </Button>
                  </a>
                  
                  {/* Secondary CTA (optional) */}
                  {secondaryCtaText && secondaryCtaHref && (
                    <a href={secondaryCtaHref}>
                      <Button
                        variant="secondary"
                        size="lg"
                        className={cn(
                          'bg-transparent border-2 border-white text-white',
                          'hover:bg-white/10',
                          'font-semibold text-lg',
                          'min-w-[180px] w-full sm:w-auto'
                        )}
                      >
                        {secondaryCtaText}
                      </Button>
                    </a>
                  )}
                </div>
              </ScrollReveal>
            </div>
            
            {/* Hero Image (optional) */}
            {heroImage && (
              <ScrollReveal direction="right" delay={0.4}>
                <div className="relative">
                  {/* Decorative glow effect behind image */}
                  <div
                    className="absolute inset-0 bg-gradient-radial from-accent-300/30 to-transparent blur-3xl -z-10"
                    aria-hidden="true"
                  />
                  
                  {/* Image container with elevated depth */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={heroImage}
                      alt={heroImageAlt}
                      width={800}
                      height={600}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom fade for smooth transition to next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent z-0"
        aria-hidden="true"
      />
    </section>
  );
};

/**
 * Default export for convenience
 */
export default HeroSection;
