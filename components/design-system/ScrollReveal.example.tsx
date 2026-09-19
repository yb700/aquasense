import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { FloatingCard } from './FloatingCard';

/**
 * ScrollReveal Component Examples
 * 
 * Demonstrates various use cases and animation variants for the ScrollReveal component.
 */

export default function ScrollRevealExamples() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-16">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">ScrollReveal Examples</h1>
          <p className="text-muted-foreground">
            Scroll down to see elements reveal with smooth animations
          </p>
        </div>

        {/* Spacer to require scrolling */}
        <div className="h-screen" />

        {/* Fade Animation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Fade Animation</h2>
          <ScrollReveal direction="fade">
            <FloatingCard>
              <h3 className="text-xl font-semibold mb-2">Fade In</h3>
              <p className="text-muted-foreground">
                This card fades in smoothly when it enters the viewport.
              </p>
            </FloatingCard>
          </ScrollReveal>
        </section>

        {/* Slide Up Animation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Slide Up Animation</h2>
          <ScrollReveal direction="up">
            <FloatingCard>
              <h3 className="text-xl font-semibold mb-2">Slide Up</h3>
              <p className="text-muted-foreground">
                This card slides up from below with a fade effect.
              </p>
            </FloatingCard>
          </ScrollReveal>
        </section>

        {/* Slide Down Animation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Slide Down Animation</h2>
          <ScrollReveal direction="down">
            <FloatingCard>
              <h3 className="text-xl font-semibold mb-2">Slide Down</h3>
              <p className="text-muted-foreground">
                This card slides down from above with a fade effect.
              </p>
            </FloatingCard>
          </ScrollReveal>
        </section>

        {/* Slide Left Animation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Slide Left Animation</h2>
          <ScrollReveal direction="left">
            <FloatingCard>
              <h3 className="text-xl font-semibold mb-2">Slide Left</h3>
              <p className="text-muted-foreground">
                This card slides in from the right with a fade effect.
              </p>
            </FloatingCard>
          </ScrollReveal>
        </section>

        {/* Slide Right Animation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Slide Right Animation</h2>
          <ScrollReveal direction="right">
            <FloatingCard>
              <h3 className="text-xl font-semibold mb-2">Slide Right</h3>
              <p className="text-muted-foreground">
                This card slides in from the left with a fade effect.
              </p>
            </FloatingCard>
          </ScrollReveal>
        </section>

        {/* Staggered Animation with Delays */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Staggered Animation</h2>
          <p className="text-muted-foreground mb-4">
            Multiple cards with sequential delays for a staggered reveal effect.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScrollReveal direction="up" delay={0}>
              <FloatingCard>
                <h3 className="text-lg font-semibold mb-2">Card 1</h3>
                <p className="text-sm text-muted-foreground">No delay</p>
              </FloatingCard>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <FloatingCard>
                <h3 className="text-lg font-semibold mb-2">Card 2</h3>
                <p className="text-sm text-muted-foreground">0.2s delay</p>
              </FloatingCard>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <FloatingCard>
                <h3 className="text-lg font-semibold mb-2">Card 3</h3>
                <p className="text-sm text-muted-foreground">0.4s delay</p>
              </FloatingCard>
            </ScrollReveal>
          </div>
        </section>

        {/* Glass Card with Reveal */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Glass Effect with Reveal</h2>
          <ScrollReveal direction="up">
            <FloatingCard glass>
              <h3 className="text-xl font-semibold mb-2">Glass Card</h3>
              <p className="text-muted-foreground">
                ScrollReveal works beautifully with glass effect cards.
              </p>
            </FloatingCard>
          </ScrollReveal>
        </section>

        {/* Repeating Animation (once=false) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Repeating Animation</h2>
          <p className="text-muted-foreground mb-4">
            This card will animate every time it enters the viewport.
          </p>
          <ScrollReveal direction="up" once={false}>
            <FloatingCard hover>
              <h3 className="text-xl font-semibold mb-2">Repeating Reveal</h3>
              <p className="text-muted-foreground">
                Scroll past this card and back to see it animate again.
              </p>
            </FloatingCard>
          </ScrollReveal>
        </section>

        {/* Complex Layout Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Complex Layout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal direction="left">
              <FloatingCard hover>
                <h3 className="text-xl font-semibold mb-2">Feature 1</h3>
                <p className="text-muted-foreground">
                  Real-time monitoring of pool chemistry and water quality.
                </p>
              </FloatingCard>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <FloatingCard hover>
                <h3 className="text-xl font-semibold mb-2">Feature 2</h3>
                <p className="text-muted-foreground">
                  Automated scheduling for staff shifts and maintenance tasks.
                </p>
              </FloatingCard>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.2}>
              <FloatingCard hover>
                <h3 className="text-xl font-semibold mb-2">Feature 3</h3>
                <p className="text-muted-foreground">
                  Incident reporting and management with photo documentation.
                </p>
              </FloatingCard>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.3}>
              <FloatingCard hover>
                <h3 className="text-xl font-semibold mb-2">Feature 4</h3>
                <p className="text-muted-foreground">
                  Comprehensive dashboard with operational insights.
                </p>
              </FloatingCard>
            </ScrollReveal>
          </div>
        </section>

        {/* Bottom Spacer */}
        <div className="h-96" />
      </div>
    </div>
  );
}
