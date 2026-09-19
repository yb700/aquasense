/**
 * StorySection Component - Usage Examples
 * 
 * Demonstrates various ways to use the StorySection component
 * for displaying operational journey timelines.
 */

import React from 'react';
import { StorySection } from './StorySection';
import { 
  Clock, 
  Sun, 
  AlertCircle, 
  Moon,
  CheckCircle,
  Users,
  Droplets,
  ClipboardCheck
} from 'lucide-react';

/**
 * Example 1: Basic Story Section with Full Operational Journey
 * 
 * Showcases a complete day in the life of pool operations with
 * four key stages: morning setup, daytime operations, incident
 * handling, and closing procedures.
 */
export function BasicStorySection() {
  return (
    <StorySection
      title="A Day in the Life"
      subtitle="See how AquaSense streamlines every aspect of pool operations from dawn to dusk"
      stages={[
        {
          time: '07:00',
          title: 'Morning Setup',
          description: 'Start your day right with automated pre-opening checklists. Verify pool chemistry, check equipment status, and ensure everything is ready for visitors—all in one streamlined workflow.',
          icon: <Clock className="w-8 h-8" />,
        },
        {
          time: '12:00',
          title: 'Daytime Operations',
          description: 'Monitor real-time pool status, track visitor activity, and manage staff shifts from anywhere. Get instant alerts when attention is needed, keeping your facility running smoothly.',
          icon: <Sun className="w-8 h-8" />,
        },
        {
          time: '15:30',
          title: 'Incident Handling',
          description: 'Document incidents quickly with photo uploads, automatic timestamps, and guided reporting forms. Generate professional reports instantly for compliance and insurance purposes.',
          icon: <AlertCircle className="w-8 h-8" />,
        },
        {
          time: '20:00',
          title: 'Closing Procedures',
          description: 'Complete end-of-day tasks efficiently with guided closing checklists. Document final chemistry readings, secure equipment, and clock out—ensuring nothing is missed.',
          icon: <Moon className="w-8 h-8" />,
        },
      ]}
    />
  );
}

/**
 * Example 2: Story Section Without Images
 * 
 * Demonstrates a more minimal approach using only icons and text,
 * ideal when images are not available or for faster page loads.
 */
export function IconOnlyStorySection() {
  return (
    <StorySection
      title="Complete Pool Management"
      subtitle="Every feature you need to run a professional aquatic facility"
      stages={[
        {
          time: 'Daily',
          title: 'Staff Scheduling',
          description: 'Create shifts, assign staff, and manage availability with our intuitive scheduling system. Get automatic coverage alerts and handle shift swaps effortlessly.',
          icon: <Users className="w-8 h-8" />,
        },
        {
          time: 'Hourly',
          title: 'Chemistry Monitoring',
          description: 'Log pool chemistry readings throughout the day. Track trends, receive alerts for out-of-range values, and maintain compliance documentation automatically.',
          icon: <Droplets className="w-8 h-8" />,
        },
        {
          time: 'Weekly',
          title: 'Cleaning Tasks',
          description: 'Organize maintenance schedules, track completion status, and ensure nothing falls through the cracks. Set recurring tasks and receive timely reminders.',
          icon: <ClipboardCheck className="w-8 h-8" />,
        },
        {
          time: 'Always',
          title: 'Compliance Ready',
          description: 'Automatically generate reports for health inspections, safety audits, and insurance requirements. Keep all documentation organized and accessible.',
          icon: <CheckCircle className="w-8 h-8" />,
        },
      ]}
    />
  );
}

/**
 * Example 3: Compact Story Section
 * 
 * A shorter version with just three stages, useful for secondary
 * pages or when you want to highlight specific features.
 */
export function CompactStorySection() {
  return (
    <StorySection
      title="How It Works"
      subtitle="Get started with AquaSense in three simple steps"
      stages={[
        {
          time: 'Step 1',
          title: 'Quick Setup',
          description: 'Get started in minutes with your pool details and team setup.',
          icon: <CheckCircle className="w-8 h-8" />,
        },
        {
          time: 'Step 2',
          title: 'Daily Operations',
          description: 'Track all pool management tasks throughout the day.',
          icon: <Sun className="w-8 h-8" />,
        },
        {
          time: 'Step 3',
          title: 'Insights & Reports',
          description: 'Review trends and generate compliance reports.',
          icon: <ClipboardCheck className="w-8 h-8" />,
        },
      ]}
    />
  );
}

/**
 * Example 4: Story Section with Custom Styling
 * 
 * Shows how to apply custom styling and adjust the component
 * for specific design needs.
 */
export function CustomStyledStorySection() {
  return (
    <StorySection
      title="Built for Professionals"
      subtitle="Trusted by swimming pools and aquatic facilities across Scandinavia"
      className="bg-primary-50/30 dark:bg-primary-900/10"
      stages={[
        {
          time: '5 min',
          title: 'Fast Onboarding',
          description: 'No complex setup required. Start using AquaSense immediately.',
          icon: <Clock className="w-8 h-8" />,
        },
        {
          time: '24/7',
          title: 'Always Available',
          description: 'Access from any device with automatic data sync.',
          icon: <Sun className="w-8 h-8" />,
        },
        {
          time: '100%',
          title: 'Reliable & Secure',
          description: 'Enterprise security with 99.9% uptime guarantee.',
          icon: <CheckCircle className="w-8 h-8" />,
        },
      ]}
    />
  );
}

/**
 * Example 5: Bilingual Story Section (Danish)
 * 
 * Demonstrates usage with Danish content for bilingual support.
 */
export function DanishStorySection() {
  return (
    <StorySection
      title="En Dag i Livet"
      subtitle="Se hvordan AquaSense strømliner hver del af svømmehallens drift fra morgenen til aftenen"
      stages={[
        {
          time: '07:00',
          title: 'Morgen Opsætning',
          description: 'Start din dag rigtigt med automatiserede tjeklister før åbning. Verificer vandkemi, tjek udstyrsstatus, og sikr at alt er klar til besøgende.',
          icon: <Clock className="w-8 h-8" />,
        },
        {
          time: '12:00',
          title: 'Daglige Operationer',
          description: 'Overvåg svømmehalens status i realtid, spor besøgsaktivitet, og administrer personalevagter fra hvor som helst.',
          icon: <Sun className="w-8 h-8" />,
        },
        {
          time: '15:30',
          title: 'Hændelseshåndtering',
          description: 'Dokumenter hændelser hurtigt med fotouploads, automatiske tidsstempler, og guidede rapporteringsformularer.',
          icon: <AlertCircle className="w-8 h-8" />,
        },
        {
          time: '20:00',
          title: 'Lukningsprocedurer',
          description: 'Gennemfør dagens afsluttende opgaver effektivt med guidede lukketjeklister. Dokumenter kemiske aflæsninger og sikr udstyr.',
          icon: <Moon className="w-8 h-8" />,
        },
      ]}
    />
  );
}

/**
 * Example 6: Minimal Story Section (No Title)
 * 
 * Shows the component used without section header,
 * letting the stages speak for themselves.
 */
export function MinimalStorySection() {
  return (
    <StorySection
      title="Your Operations Simplified"
      subtitle="Morning to evening, we've got you covered"
      stages={[
        {
          time: 'Morning',
          title: 'Open with Confidence',
          description: 'Guided checklists ensure nothing is missed during morning setup.',
          icon: <CheckCircle className="w-8 h-8" />,
        },
        {
          time: 'Day',
          title: 'Stay in Control',
          description: 'Real-time monitoring keeps you informed of everything happening at your facility.',
          icon: <Sun className="w-8 h-8" />,
        },
        {
          time: 'Evening',
          title: 'Close Properly',
          description: 'End-of-day procedures completed correctly, every time.',
          icon: <Moon className="w-8 h-8" />,
        },
      ]}
    />
  );
}
