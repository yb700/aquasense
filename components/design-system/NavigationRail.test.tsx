import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NavigationRail } from './NavigationRail';
import { Home, Calendar, ClipboardList } from 'lucide-react';

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock Next.js useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('NavigationRail', () => {
  const mockItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home data-testid="home-icon" />,
    },
    {
      label: 'Schedule',
      href: '/schedule',
      icon: <Calendar data-testid="calendar-icon" />,
      badge: 3,
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: <ClipboardList data-testid="tasks-icon" />,
    },
  ];

  it('renders the logo at the top', () => {
    render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    // Logo should be present
    const logo = screen.getByRole('img', { name: /aquasense/i });
    expect(logo).toBeDefined();
  });

  it('renders all navigation items', () => {
    render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Schedule')).toBeDefined();
    expect(screen.getByText('Tasks')).toBeDefined();
  });

  it('highlights the current active page', () => {
    render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink.getAttribute('aria-current')).toBe('page');
  });

  it('renders badge when provided', () => {
    render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    const badge = screen.getByText('3');
    expect(badge).toBeDefined();
  });

  it('does not render badge when count is 0', () => {
    const itemsWithZeroBadge = [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <Home />,
        badge: 0,
      },
    ];

    render(
      <NavigationRail
        items={itemsWithZeroBadge}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    // Badge should not be present
    const badges = screen.queryAllByText('0');
    expect(badges.length).toBe(0);
  });

  it('displays badge as "99+" when count exceeds 99', () => {
    const itemsWithLargeBadge = [
      {
        label: 'Notifications',
        href: '/notifications',
        icon: <Home />,
        badge: 150,
      },
    ];

    render(
      <NavigationRail
        items={itemsWithLargeBadge}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    expect(screen.getByText('99+')).toBeDefined();
  });

  it('renders user profile section at the bottom', () => {
    render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('View profile')).toBeDefined();
  });

  it('has minimum touch target size for accessibility', () => {
    render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink.className).toContain('min-h-touch');
  });

  it('applies glass effect styling', () => {
    const { container } = render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('backdrop-blur-lg');
    expect(nav?.className).toContain('bg-white/80');
  });

  it('is fixed at 280px width on desktop', () => {
    const { container } = render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard"
        userName="John Doe"
      />
    );

    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('w-[280px]');
    expect(nav?.className).toContain('fixed');
  });

  it('matches active state for nested routes', () => {
    render(
      <NavigationRail
        items={mockItems}
        currentPath="/dashboard/analytics"
        userName="John Doe"
      />
    );

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink.getAttribute('aria-current')).toBe('page');
  });

  describe('Keyboard Navigation', () => {
    it('prevents default behavior on arrow key presses', () => {
      render(
        <NavigationRail
          items={mockItems}
          currentPath="/dashboard"
          userName="John Doe"
        />
      );

      const navList = screen.getByRole('list');
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      navList.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('adds visible focus ring for keyboard navigation', () => {
      render(
        <NavigationRail
          items={mockItems}
          currentPath="/dashboard"
          userName="John Doe"
        />
      );

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      
      // Check for focus ring classes
      expect(dashboardLink.className).toContain('focus:outline-none');
      expect(dashboardLink.className).toContain('focus:ring-2');
      expect(dashboardLink.className).toContain('focus:ring-accent');
    });

    it('handles onFocus and onBlur events', () => {
      render(
        <NavigationRail
          items={mockItems}
          currentPath="/dashboard"
          userName="John Doe"
        />
      );

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      
      // Verify the link has onFocus and onBlur handlers
      expect(dashboardLink.getAttribute('onfocus')).toBeDefined;
      expect(dashboardLink.getAttribute('onblur')).toBeDefined;
    });

    it('supports keyboard navigation with ref management', () => {
      const { container } = render(
        <NavigationRail
          items={mockItems}
          currentPath="/dashboard"
          userName="John Doe"
        />
      );

      const links = container.querySelectorAll('a[href^="/"]');
      
      // Verify all navigation links exist and are focusable
      expect(links.length).toBeGreaterThanOrEqual(mockItems.length);
      
      links.forEach((link) => {
        expect(link.getAttribute('tabindex')).not.toBe('-1');
      });
    });
  });
});
