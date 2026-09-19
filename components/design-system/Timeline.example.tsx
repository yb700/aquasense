import React from 'react';
import { Timeline } from './Timeline';

/**
 * Timeline Component Examples
 * 
 * Demonstrates various use cases and configurations of the Timeline component.
 */

// Example 1: Basic timeline with three status variants
export const BasicTimelineExample = () => {
  const items = [
    {
      time: '07:00',
      title: 'Pool Opening',
      description: 'Morning water quality check completed successfully',
      status: 'completed' as const,
    },
    {
      time: '12:00',
      title: 'Lunch Break Rotation',
      description: 'Staff rotation currently in progress',
      status: 'active' as const,
    },
    {
      time: '17:00',
      title: 'Evening Maintenance',
      description: 'Scheduled filter cleaning and water testing',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="max-w-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Daily Operations Schedule</h2>
      <Timeline items={items} />
    </div>
  );
};

// Example 2: Timeline with icons
export const TimelineWithIconsExample = () => {
  const items = [
    {
      time: '08:00',
      title: 'Water Quality Test',
      description: 'pH and chlorine levels checked',
      status: 'completed' as const,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      time: '10:00',
      title: 'Incident Reported',
      description: 'Minor slip reported, being addressed',
      status: 'active' as const,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      time: '14:00',
      title: 'Equipment Check',
      description: 'Routine inspection of pumps and filters',
      status: 'pending' as const,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Facility Operations Timeline</h2>
      <Timeline items={items} />
    </div>
  );
};

// Example 3: Simple timeline without descriptions
export const SimpleTimelineExample = () => {
  const items = [
    {
      time: '09:00',
      title: 'Opening',
      status: 'completed' as const,
    },
    {
      time: '12:00',
      title: 'Peak Hours',
      status: 'active' as const,
    },
    {
      time: '18:00',
      title: 'Closing',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="max-w-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Shift Schedule</h2>
      <Timeline items={items} />
    </div>
  );
};

// Example 4: Extended timeline with many items
export const ExtendedTimelineExample = () => {
  const items = [
    {
      time: '06:00',
      title: 'Pre-Opening Preparation',
      description: 'Staff arrives and begins setup',
      status: 'completed' as const,
    },
    {
      time: '07:00',
      title: 'Water Quality Testing',
      description: 'Initial pH, chlorine, and temperature checks',
      status: 'completed' as const,
    },
    {
      time: '08:00',
      title: 'Pool Opening',
      description: 'Facility opens to public',
      status: 'completed' as const,
    },
    {
      time: '10:00',
      title: 'Morning Patrol',
      description: 'Lifeguard rotation and area inspection',
      status: 'completed' as const,
    },
    {
      time: '12:00',
      title: 'Lunch Break',
      description: 'Staff rotation in progress',
      status: 'active' as const,
    },
    {
      time: '14:00',
      title: 'Afternoon Session',
      description: 'Swimming lessons scheduled',
      status: 'pending' as const,
    },
    {
      time: '16:00',
      title: 'Equipment Check',
      description: 'Routine maintenance inspection',
      status: 'pending' as const,
    },
    {
      time: '18:00',
      title: 'Pool Closing',
      description: 'Final water test and facility shutdown',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="max-w-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Full Day Operations</h2>
      <Timeline items={items} />
    </div>
  );
};

// Example 5: Timeline with custom styling
export const StyledTimelineExample = () => {
  const items = [
    {
      time: '08:00',
      title: 'Start',
      description: 'Begin daily operations',
      status: 'completed' as const,
    },
    {
      time: '12:00',
      title: 'Active',
      description: 'Currently in progress',
      status: 'active' as const,
    },
    {
      time: '16:00',
      title: 'Upcoming',
      description: 'Scheduled for later',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="max-w-2xl p-8 bg-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-primary">Custom Styled Timeline</h2>
      <Timeline items={items} className="mt-4" />
    </div>
  );
};

// Example 6: Dark mode timeline
export const DarkModeTimelineExample = () => {
  const items = [
    {
      time: '20:00',
      title: 'Evening Cleaning',
      description: 'Deep clean after closing',
      status: 'completed' as const,
    },
    {
      time: '21:00',
      title: 'System Check',
      description: 'Filter and pump inspection',
      status: 'active' as const,
    },
    {
      time: '22:00',
      title: 'Final Lockup',
      description: 'Secure facility for the night',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="dark max-w-2xl p-8 bg-background">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Night Operations</h2>
      <Timeline items={items} />
    </div>
  );
};

// Example 7: Single active item timeline
export const SingleActiveItemExample = () => {
  const items = [
    {
      time: 'Now',
      title: 'Current Task',
      description: 'This is the only active task in the timeline',
      status: 'active' as const,
    },
  ];

  return (
    <div className="max-w-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Current Status</h2>
      <Timeline items={items} />
    </div>
  );
};

// Example 8: All completed timeline
export const AllCompletedTimelineExample = () => {
  const items = [
    {
      time: '09:00',
      title: 'Task 1 Complete',
      description: 'First task successfully finished',
      status: 'completed' as const,
    },
    {
      time: '10:00',
      title: 'Task 2 Complete',
      description: 'Second task successfully finished',
      status: 'completed' as const,
    },
    {
      time: '11:00',
      title: 'Task 3 Complete',
      description: 'Third task successfully finished',
      status: 'completed' as const,
    },
  ];

  return (
    <div className="max-w-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-highlight">All Tasks Completed! ✓</h2>
      <Timeline items={items} />
    </div>
  );
};

// Default export with all examples
export default function TimelineExamples() {
  return (
    <div className="space-y-12 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-8">Timeline Component Examples</h1>
      </div>
      
      <BasicTimelineExample />
      <TimelineWithIconsExample />
      <SimpleTimelineExample />
      <ExtendedTimelineExample />
      <StyledTimelineExample />
      <DarkModeTimelineExample />
      <SingleActiveItemExample />
      <AllCompletedTimelineExample />
    </div>
  );
}
