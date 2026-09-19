import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Timeline } from './Timeline';

describe('Timeline Component', () => {
  const mockItems = [
    {
      time: '09:00',
      title: 'Pool Opening',
      description: 'Morning water quality check completed',
      status: 'completed' as const,
    },
    {
      time: '12:00',
      title: 'Lunch Break',
      description: 'Staff rotation in progress',
      status: 'active' as const,
    },
    {
      time: '15:00',
      title: 'Afternoon Maintenance',
      description: 'Scheduled filter cleaning',
      status: 'pending' as const,
    },
  ];

  describe('Basic Rendering', () => {
    it('should render timeline component', () => {
      render(<Timeline items={mockItems} />);
      const timeline = screen.getByRole('list');
      expect(timeline).toBeInTheDocument();
      expect(timeline).toHaveAttribute('aria-label', 'Timeline');
    });

    it('should render all timeline items', () => {
      render(<Timeline items={mockItems} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
    });

    it('should render with empty items array', () => {
      render(<Timeline items={[]} />);
      const timeline = screen.getByRole('list');
      expect(timeline).toBeInTheDocument();
      const items = screen.queryAllByRole('listitem');
      expect(items).toHaveLength(0);
    });

    it('should render with custom className', () => {
      render(<Timeline items={mockItems} className="custom-timeline" />);
      const timeline = screen.getByRole('list');
      expect(timeline).toHaveClass('custom-timeline');
    });

    it('should render with multiple classNames', () => {
      render(<Timeline items={mockItems} className="class-one class-two" />);
      const timeline = screen.getByRole('list');
      expect(timeline).toHaveClass('class-one');
      expect(timeline).toHaveClass('class-two');
    });
  });

  describe('Timeline Item Content', () => {
    it('should display time for each item', () => {
      render(<Timeline items={mockItems} />);
      expect(screen.getByText('09:00')).toBeInTheDocument();
      expect(screen.getByText('12:00')).toBeInTheDocument();
      expect(screen.getByText('15:00')).toBeInTheDocument();
    });

    it('should display title for each item', () => {
      render(<Timeline items={mockItems} />);
      expect(screen.getByText('Pool Opening')).toBeInTheDocument();
      expect(screen.getByText('Lunch Break')).toBeInTheDocument();
      expect(screen.getByText('Afternoon Maintenance')).toBeInTheDocument();
    });

    it('should display description when provided', () => {
      render(<Timeline items={mockItems} />);
      expect(screen.getByText('Morning water quality check completed')).toBeInTheDocument();
      expect(screen.getByText('Staff rotation in progress')).toBeInTheDocument();
      expect(screen.getByText('Scheduled filter cleaning')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const itemsWithoutDescription = [
        { time: '10:00', title: 'Event', status: 'completed' as const },
      ];
      render(<Timeline items={itemsWithoutDescription} />);
      expect(screen.getByText('Event')).toBeInTheDocument();
      expect(screen.queryByText('description')).not.toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      const itemsWithIcon = [
        {
          time: '10:00',
          title: 'Event',
          status: 'completed' as const,
          icon: <span data-testid="test-icon">🏊</span>,
        },
      ];
      render(<Timeline items={itemsWithIcon} />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should not render icon element when not provided', () => {
      const itemsWithoutIcon = [
        { time: '10:00', title: 'Event', status: 'completed' as const },
      ];
      const { container } = render(<Timeline items={itemsWithoutIcon} />);
      const iconContainers = container.querySelectorAll('.flex-shrink-0');
      expect(iconContainers).toHaveLength(0);
    });
  });

  describe('Status Variants', () => {
    it('should render completed status items', () => {
      const completedItems = [
        { time: '10:00', title: 'Completed Task', status: 'completed' as const },
      ];
      render(<Timeline items={completedItems} />);
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });

    it('should render active status items', () => {
      const activeItems = [
        { time: '10:00', title: 'Active Task', status: 'active' as const },
      ];
      render(<Timeline items={activeItems} />);
      expect(screen.getByText('Active Task')).toBeInTheDocument();
    });

    it('should render pending status items', () => {
      const pendingItems = [
        { time: '10:00', title: 'Pending Task', status: 'pending' as const },
      ];
      render(<Timeline items={pendingItems} />);
      expect(screen.getByText('Pending Task')).toBeInTheDocument();
    });

    it('should apply different styling to pending items', () => {
      const items = [
        { time: '10:00', title: 'Pending Task', status: 'pending' as const },
      ];
      render(<Timeline items={items} />);
      const title = screen.getByText('Pending Task');
      expect(title).toHaveClass('text-muted-foreground');
    });

    it('should not apply muted styling to completed items', () => {
      const items = [
        { time: '10:00', title: 'Completed Task', status: 'completed' as const },
      ];
      render(<Timeline items={items} />);
      const title = screen.getByText('Completed Task');
      expect(title).not.toHaveClass('text-muted-foreground');
      expect(title).toHaveClass('text-foreground');
    });

    it('should not apply muted styling to active items', () => {
      const items = [
        { time: '10:00', title: 'Active Task', status: 'active' as const },
      ];
      render(<Timeline items={items} />);
      const title = screen.getByText('Active Task');
      expect(title).not.toHaveClass('text-muted-foreground');
      expect(title).toHaveClass('text-foreground');
    });
  });

  describe('Time Formatting', () => {
    it('should render time with datetime attribute', () => {
      render(<Timeline items={mockItems} />);
      const times = screen.getAllByRole('time');
      expect(times).toHaveLength(3);
      expect(times[0]).toHaveAttribute('dateTime', '09:00');
      expect(times[1]).toHaveAttribute('dateTime', '12:00');
      expect(times[2]).toHaveAttribute('dateTime', '15:00');
    });

    it('should handle 24-hour time format', () => {
      const items = [
        { time: '14:30', title: 'Afternoon Event', status: 'completed' as const },
      ];
      render(<Timeline items={items} />);
      const time = screen.getByText('14:30');
      expect(time).toHaveAttribute('dateTime', '14:30');
    });

    it('should handle time with seconds', () => {
      const items = [
        { time: '10:30:45', title: 'Precise Time', status: 'completed' as const },
      ];
      render(<Timeline items={items} />);
      const time = screen.getByText('10:30:45');
      expect(time).toHaveAttribute('dateTime', '10:30:45');
    });

    it('should handle custom time strings', () => {
      const items = [
        { time: 'Morning', title: 'Custom Time', status: 'completed' as const },
      ];
      render(<Timeline items={items} />);
      expect(screen.getByText('Morning')).toBeInTheDocument();
    });
  });

  describe('Single Item', () => {
    it('should render single timeline item', () => {
      const singleItem = [
        { time: '10:00', title: 'Single Event', status: 'completed' as const },
      ];
      render(<Timeline items={singleItem} />);
      expect(screen.getByText('Single Event')).toBeInTheDocument();
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(1);
    });

    it('should render single item with all props', () => {
      const singleItem = [
        {
          time: '10:00',
          title: 'Complete Event',
          description: 'Full description',
          status: 'active' as const,
          icon: <span data-testid="icon">✓</span>,
        },
      ];
      render(<Timeline items={singleItem} />);
      expect(screen.getByText('Complete Event')).toBeInTheDocument();
      expect(screen.getByText('Full description')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Multiple Items', () => {
    it('should render two items', () => {
      const twoItems = [
        { time: '10:00', title: 'First', status: 'completed' as const },
        { time: '11:00', title: 'Second', status: 'active' as const },
      ];
      render(<Timeline items={twoItems} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(2);
    });

    it('should render many items', () => {
      const manyItems = Array.from({ length: 10 }, (_, i) => ({
        time: `${10 + i}:00`,
        title: `Event ${i + 1}`,
        status: 'completed' as const,
      }));
      render(<Timeline items={manyItems} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(10);
    });

    it('should maintain order of items', () => {
      render(<Timeline items={mockItems} />);
      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('Pool Opening');
      expect(items[1]).toHaveTextContent('Lunch Break');
      expect(items[2]).toHaveTextContent('Afternoon Maintenance');
    });
  });

  describe('Visual Connectors', () => {
    it('should render SVG connector between items', () => {
      const { container } = render(<Timeline items={mockItems} />);
      const svgs = container.querySelectorAll('svg');
      // Should have connectors (one less than number of items)
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should not render connector after last item', () => {
      const singleItem = [
        { time: '10:00', title: 'Only Item', status: 'completed' as const },
      ];
      const { container } = render(<Timeline items={singleItem} />);
      const connectors = container.querySelectorAll('svg path');
      expect(connectors).toHaveLength(0);
    });

    it('should render connector with water-inspired curve path', () => {
      const twoItems = [
        { time: '10:00', title: 'First', status: 'completed' as const },
        { time: '11:00', title: 'Second', status: 'active' as const },
      ];
      const { container } = render(<Timeline items={twoItems} />);
      const paths = container.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
      const firstPath = paths[0];
      expect(firstPath).toHaveAttribute('d');
      // Check for quadratic bezier curve (Q command)
      const pathData = firstPath.getAttribute('d');
      expect(pathData).toContain('Q');
    });

    it('should set aria-hidden on connector elements', () => {
      const twoItems = [
        { time: '10:00', title: 'First', status: 'completed' as const },
        { time: '11:00', title: 'Second', status: 'active' as const },
      ];
      const { container } = render(<Timeline items={twoItems} />);
      const connectorContainers = container.querySelectorAll('[aria-hidden="true"]');
      expect(connectorContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long titles', () => {
      const items = [
        {
          time: '10:00',
          title: 'This is a very long title that should still render properly without breaking the layout',
          status: 'completed' as const,
        },
      ];
      render(<Timeline items={items} />);
      expect(
        screen.getByText('This is a very long title that should still render properly without breaking the layout')
      ).toBeInTheDocument();
    });

    it('should handle very long descriptions', () => {
      const items = [
        {
          time: '10:00',
          title: 'Event',
          description:
            'This is a very long description that contains a lot of information about the event and should wrap properly',
          status: 'completed' as const,
        },
      ];
      render(<Timeline items={items} />);
      expect(
        screen.getByText(/This is a very long description/)
      ).toBeInTheDocument();
    });

    it('should handle empty title', () => {
      const items = [
        { time: '10:00', title: '', status: 'completed' as const },
      ];
      render(<Timeline items={items} />);
      const timeline = screen.getByRole('list');
      expect(timeline).toBeInTheDocument();
    });

    it('should handle empty time', () => {
      const items = [
        { time: '', title: 'Event', status: 'completed' as const },
      ];
      render(<Timeline items={items} />);
      expect(screen.getByText('Event')).toBeInTheDocument();
    });

    it('should handle empty description', () => {
      const items = [
        { time: '10:00', title: 'Event', description: '', status: 'completed' as const },
      ];
      render(<Timeline items={items} />);
      expect(screen.getByText('Event')).toBeInTheDocument();
    });

    it('should handle special characters in content', () => {
      const items = [
        {
          time: '10:00',
          title: 'Event & Task <Test>',
          description: 'Description with "quotes" and \'apostrophes\'',
          status: 'completed' as const,
        },
      ];
      render(<Timeline items={items} />);
      expect(screen.getByText('Event & Task <Test>')).toBeInTheDocument();
      expect(screen.getByText(/Description with "quotes"/)).toBeInTheDocument();
    });

    it('should handle mixed status types', () => {
      const mixedItems = [
        { time: '09:00', title: 'Done', status: 'completed' as const },
        { time: '10:00', title: 'Now', status: 'active' as const },
        { time: '11:00', title: 'Later', status: 'pending' as const },
        { time: '12:00', title: 'Also Done', status: 'completed' as const },
      ];
      render(<Timeline items={mixedItems} />);
      expect(screen.getByText('Done')).toBeInTheDocument();
      expect(screen.getByText('Now')).toBeInTheDocument();
      expect(screen.getByText('Later')).toBeInTheDocument();
      expect(screen.getByText('Also Done')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have list role', () => {
      render(<Timeline items={mockItems} />);
      const timeline = screen.getByRole('list');
      expect(timeline).toBeInTheDocument();
    });

    it('should have listitem role for each item', () => {
      render(<Timeline items={mockItems} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
    });

    it('should have aria-label on timeline', () => {
      render(<Timeline items={mockItems} />);
      const timeline = screen.getByRole('list');
      expect(timeline).toHaveAttribute('aria-label', 'Timeline');
    });

    it('should use semantic time element', () => {
      render(<Timeline items={mockItems} />);
      const times = screen.getAllByRole('time');
      expect(times).toHaveLength(3);
    });

    it('should use proper heading element for titles', () => {
      const { container } = render(<Timeline items={mockItems} />);
      const headings = container.querySelectorAll('h3');
      expect(headings).toHaveLength(3);
    });

    it('should hide decorative elements from screen readers', () => {
      const twoItems = [
        { time: '10:00', title: 'First', status: 'completed' as const },
        { time: '11:00', title: 'Second', status: 'active' as const },
      ];
      const { container } = render(<Timeline items={twoItems} />);
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenElements.length).toBeGreaterThan(0);
    });
  });

  describe('Layout and Styling', () => {
    it('should apply relative positioning to container', () => {
      const { container } = render(<Timeline items={mockItems} />);
      const timeline = container.querySelector('[role="list"]');
      expect(timeline).toHaveClass('relative');
    });

    it('should apply flex layout to items', () => {
      const { container } = render(<Timeline items={mockItems} />);
      const firstItem = container.querySelector('[role="listitem"]');
      expect(firstItem).toHaveClass('flex');
      expect(firstItem).toHaveClass('gap-4');
    });

    it('should apply bottom padding to items except last', () => {
      const { container } = render(<Timeline items={mockItems} />);
      const firstItem = container.querySelector('[role="listitem"]');
      expect(firstItem).toHaveClass('pb-8');
      expect(firstItem).toHaveClass('last:pb-0');
    });

    it('should apply minimum width to time column', () => {
      const { container } = render(<Timeline items={mockItems} />);
      const timeColumn = container.querySelector('.min-w-\\[80px\\]');
      expect(timeColumn).toBeInTheDocument();
    });

    it('should apply flex-1 to content column', () => {
      const { container } = render(<Timeline items={mockItems} />);
      const contentColumn = container.querySelector('.flex-1');
      expect(contentColumn).toBeInTheDocument();
    });
  });
});
