import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Home, Calendar, ClipboardList, Users, Settings } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

describe('BottomNavigation', () => {
  const mockItems = [
    { label: 'Home', href: '/dashboard', icon: <Home data-testid="home-icon" /> },
    { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar data-testid="schedule-icon" /> },
    { label: 'Tasks', href: '/dashboard/cleaning', icon: <ClipboardList data-testid="tasks-icon" /> },
    { label: 'Team', href: '/dashboard/team', icon: <Users data-testid="team-icon" /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings data-testid="settings-icon" /> },
  ];

  it('renders all navigation items', () => {
    render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders icons for all items', () => {
    render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tasks-icon')).toBeInTheDocument();
    expect(screen.getByTestId('team-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
  });

  it('highlights the currently active page', () => {
    render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('does not highlight inactive pages', () => {
    render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const scheduleLink = screen.getByText('Schedule').closest('a');
    expect(scheduleLink).not.toHaveAttribute('aria-current');
  });

  it('renders correct href for each navigation item', () => {
    render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const homeLink = screen.getByText('Home').closest('a');
    const scheduleLink = screen.getByText('Schedule').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/dashboard');
    expect(scheduleLink).toHaveAttribute('href', '/dashboard/shifts');
  });

  it('displays badge when provided', () => {
    const itemsWithBadge = [
      { label: 'Home', href: '/dashboard', icon: <Home />, badge: 5 },
      { label: 'Schedule', href: '/dashboard/shifts', icon: <Calendar /> },
    ];
    
    render(<BottomNavigation items={itemsWithBadge} currentPath="/dashboard" />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays 99+ for badges over 99', () => {
    const itemsWithLargeBadge = [
      { label: 'Home', href: '/dashboard', icon: <Home />, badge: 150 },
    ];
    
    render(<BottomNavigation items={itemsWithLargeBadge} currentPath="/dashboard" />);
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('does not display badge when value is 0', () => {
    const itemsWithZeroBadge = [
      { label: 'Home', href: '/dashboard', icon: <Home />, badge: 0 },
    ];
    
    const { container } = render(<BottomNavigation items={itemsWithZeroBadge} currentPath="/dashboard" />);
    
    // Check that no badge div is rendered
    const badge = container.querySelector('.bg-error');
    expect(badge).not.toBeInTheDocument();
  });

  it('limits display to maximum 5 items', () => {
    const sixItems = [
      ...mockItems,
      { label: 'Extra', href: '/dashboard/extra', icon: <Settings /> },
    ];
    
    render(<BottomNavigation items={sixItems} currentPath="/dashboard" />);
    
    // Should render only 5 items
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.queryByText('Extra')).not.toBeInTheDocument();
  });

  it('applies glass effect styling', () => {
    const { container } = render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const glassContainer = container.querySelector('.backdrop-blur-lg');
    expect(glassContainer).toBeInTheDocument();
    expect(glassContainer).toHaveClass('bg-white/90');
    expect(glassContainer).toHaveClass('dark:bg-card/90');
  });

  it('has fixed bottom positioning', () => {
    const { container } = render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('bottom-0');
    expect(nav).toHaveClass('left-0');
    expect(nav).toHaveClass('right-0');
  });

  it('is hidden on desktop (lg breakpoint)', () => {
    const { container } = render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('lg:hidden');
  });

  it('has minimum height for touch targets', () => {
    const { container } = render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const itemsContainer = container.querySelector('.min-h-\\[56px\\]');
    expect(itemsContainer).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const nav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('highlights active item on subpaths', () => {
    render(<BottomNavigation items={mockItems} currentPath="/dashboard/shifts/new" />);
    
    const scheduleLink = screen.getByText('Schedule').closest('a');
    expect(scheduleLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders with minimum 44x44px touch targets', () => {
    const { container } = render(<BottomNavigation items={mockItems} currentPath="/dashboard" />);
    
    const touchTargets = container.querySelectorAll('.min-w-touch');
    expect(touchTargets.length).toBeGreaterThan(0);
    touchTargets.forEach(target => {
      expect(target).toHaveClass('min-h-touch');
    });
  });
});
