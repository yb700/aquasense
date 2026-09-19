'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/design-system/ScrollReveal';
import Image from 'next/image';

export interface DeviceMockup {
  device: 'mobile' | 'tablet' | 'desktop';
  screenshot: string;
  alt: string;
  position?: 'left' | 'center' | 'right';
}

export interface ProductShowcaseProps {
  title: string;
  subtitle: string;
  mockups: DeviceMockup[];
  className?: string;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title,
  subtitle,
  mockups,
  className,
}) => {
  return (
    <section className={cn('py-20 sm:py-24 lg:py-32 bg-muted/30', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {title}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {mockups.map((mockup, index) => (
            <ScrollReveal
              key={index}
              direction={mockup.position === 'left' ? 'left' : mockup.position === 'right' ? 'right' : 'up'}
              delay={index * 0.15}
            >
              <div
                className={cn(
                  'relative rounded-2xl overflow-hidden shadow-2xl bg-card',
                  mockup.device === 'mobile' && 'w-[280px] sm:w-[320px]',
                  mockup.device === 'tablet' && 'w-[400px] sm:w-[480px]',
                  mockup.device === 'desktop' && 'w-full max-w-5xl'
                )}
              >
                <Image
                  src={mockup.screenshot}
                  alt={mockup.alt}
                  width={mockup.device === 'desktop' ? 1200 : mockup.device === 'tablet' ? 480 : 320}
                  height={mockup.device === 'desktop' ? 800 : mockup.device === 'tablet' ? 640 : 568}
                  className="w-full h-auto"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
