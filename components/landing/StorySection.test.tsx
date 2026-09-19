/**
 * StorySection Component Tests
 * 
 * Tests the StorySection component's rendering, props handling,
 * responsive behavior, and accessibility features.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { StorySection } from './StorySection';

// Mock next/image to avoid Next.js image optimization in tests
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: () => true,
}));

describe('StorySection', () => {
  const mockStages = [
    {
      time: '07:00',
      title: 'Morning Setup',
      description: 'Start your day with automated checklists and pool chemistry verification.',
      icon: <svg data-testid="morning-icon" />,
      imageUrl: '/images/morning-setup.jpg',
      imageAlt: 'Morning setup checklist',
    },
    {
      time: '12:00',
      title: 'Daytime Operations',
      description: 'Monitor real-time pool status and visitor activity throughout the day.',
      icon: <svg data-testid="daytime-icon" />,
      imageUrl: '/images/daytime-ops.jpg',
      imageAlt: 'Daytime operations dashboard',
    },
    {
      time: '15:30',
      title: 'Incident Handling',
      description: 'Document incidents quickly with photo uploads and automated reporting.',
      icon: <svg data-testid="incident-icon" />,
    },
    {
      time: '20:00',
      title: 'Closing Procedures',
      description: 'Complete end-of-day tasks with guided closing checklists.',
      icon: <svg data-testid="closing-icon" />,
      imageUrl: '/images/closing.jpg',
      imageAlt: 'Closing procedures checklist',
    },
  ];

  describe('Rendering', () => {
    it('renders the component', () => {
      render(<StorySection stages={mockStages} />);
      expect(screen.getByText('Morning Setup')).toBeInTheDocument();
    });

    it('renders all stages', () => {
      render(<StorySection stages={mockStages} />);
      expect(screen.getByText('Morning Setup')).toBeInTheDocument();
      expect(screen.getByText('Daytime Operations')).toBeInTheDocument();
      expect(screen.getByText('Incident Handling')).toBeInTheDocument();
      expect(screen.getByText('Closing Procedures')).toBeInTheDocument();
    });

    it('renders section title when provided', () => {
      render(
        <StorySection
          stages={mockStages}
          title="A Day in the Life"
          subtitle="See how AquaSense fits into your operations"
        />
      );
      expect(screen.getByText('A Day in the Life')).toBeInTheDocument();
      expect(screen.getByText('See how AquaSense fits into your operations')).toBeInTheDocument();
    });

    it('renders without title and subtitle', () => {
      const { container } = render(<StorySection stages={mockStages} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Stage Content', () => {
    it('renders stage time badges', () => {
      render(<StorySection stages={mockStages} />);
      expect(screen.getByText('07:00')).toBeInTheDocument();
      expect(screen.getByText('12:00')).toBeInTheDocument();
      expect(screen.getByText('15:30')).toBeInTheDocument();
      expect(screen.getByText('20:00')).toBeInTheDocument();
    });

    it('renders stage titles', () => {
      render(<StorySection stages={mockStages} />);
      expect(screen.getByText('Morning Setup')).toBeInTheDocument();
      expect(screen.getByText('Daytime Operations')).toBeInTheDocument();
      expect(screen.getByText('Incident Handling')).toBeInTheDocument();
      expect(screen.getByText('Closing Procedures')).toBeInTheDocument();
    });

    it('renders stage descriptions', () => {
      render(<StorySection stages={mockStages} />);
      expect(
        screen.getByText('Start your day with automated checklists and pool chemistry verification.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Monitor real-time pool status and visitor activity throughout the day.')
      ).toBeInTheDocument();
    });

    it('renders stage icons', () => {
      render(<StorySection stages={mockStages} />);
      expect(screen.getByTestId('morning-icon')).toBeInTheDocument();
      expect(screen.getByTestId('daytime-icon')).toBeInTheDocument();
      expect(screen.getByTestId('incident-icon')).toBeInTheDocument();
      expect(screen.getByTestId('closing-icon')).toBeInTheDocument();
    });
  });

  describe('Images', () => {
    it('renders images when provided', () => {
      render(<StorySection stages={mockStages} />);
      const images = screen.getAllByRole('img');
      // 3 stages have images (morning, daytime, closing)
      expect(images.length).toBeGreaterThanOrEqual(3);
    });

    it('uses imageAlt when provided', () => {
      render(<StorySection stages={mockStages} />);
      expect(screen.getByAltText('Morning setup checklist')).toBeInTheDocument();
    });

    it('falls back to title when imageAlt not provided', () => {
      const stages = [
        {
          time: '07:00',
          title: 'Morning Setup',
          description: 'Test description',
          icon: <svg data-testid="icon" />,
          imageUrl: '/test.jpg',
        },
      ];
      render(<StorySection stages={stages} />);
      expect(screen.getByAltText('Morning Setup')).toBeInTheDocument();
    });

    it('does not render image when imageUrl not provided', () => {
      const stages = [
        {
          time: '07:00',
          title: 'Test Stage',
          description: 'Test description',
          icon: <svg data-testid="icon" />,
        },
      ];
      render(<StorySection stages={stages} />);
      const images = screen.queryAllByRole('img');
      expect(images.length).toBe(0);
    });
  });

  describe('Layout and Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <StorySection stages={mockStages} className="custom-class" />
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
    });

    it('renders with Container component for responsive width', () => {
      const { container } = render(<StorySection stages={mockStages} />);
      // Container adds mx-auto and max-width classes
      const containerDiv = container.querySelector('.mx-auto');
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML', () => {
      const { container } = render(<StorySection stages={mockStages} />);
      expect(container.querySelector('section')).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    });

    it('has proper heading hierarchy', () => {
      render(
        <StorySection
          stages={mockStages}
          title="A Day in the Life"
        />
      );
      // Section title is h2
      expect(screen.getByRole('heading', { level: 2, name: 'A Day in the Life' })).toBeInTheDocument();
      // Stage titles are h3
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    });

    it('sets aria-hidden on decorative elements', () => {
      const { container } = render(<StorySection stages={mockStages} />);
      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    it('provides alt text for images', () => {
      render(<StorySection stages={mockStages} />);
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty stages array', () => {
      const { container } = render(<StorySection stages={[]} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('handles single stage', () => {
      const singleStage = [mockStages[0]];
      render(<StorySection stages={singleStage} />);
      expect(screen.getByText('Morning Setup')).toBeInTheDocument();
    });

    it('handles stages without icons', () => {
      const stagesWithoutIcons = [
        {
          time: '07:00',
          title: 'Test Stage',
          description: 'Test description',
          icon: null,
        },
      ];
      const { container } = render(<StorySection stages={stagesWithoutIcons} />);
      expect(container).toBeInTheDocument();
    });

    it('handles very long descriptions', () => {
      const longDescription = 'A'.repeat(500);
      const stages = [
        {
          time: '07:00',
          title: 'Test Stage',
          description: longDescription,
          icon: <svg data-testid="icon" />,
        },
      ];
      render(<StorySection stages={stages} />);
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });
});
