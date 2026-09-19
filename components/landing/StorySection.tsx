'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/design-system/ScrollReveal';

export interface StoryStage {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface StorySectionProps {
  id?: string;
  title: string;
  subtitle: string;
  stages: StoryStage[];
  className?: string;
}

export const StorySection: React.FC<StorySectionProps> = ({
  id,
  title,
  subtitle,
  stages,
  className,
}) => {
  return (
    <section id={id} className={cn('py-20 sm:py-24 lg:py-32 bg-background', className)}>
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

        <div className="relative">
          {/* Timeline connector */}
          <div
            className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-accent-300 to-primary-300 hidden md:block"
            aria-hidden="true"
          />

          {/* Story stages */}
          <div className="space-y-12">
            {stages.map((stage, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="relative grid md:grid-cols-[auto_1fr] gap-6 md:gap-8">
                  {/* Icon */}
                  <div className="flex items-start justify-center md:justify-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-md">
                      {stage.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-3">
                      <span className="text-sm font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-wide">
                        {stage.time}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        {stage.title}
                      </h3>
                    </div>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
