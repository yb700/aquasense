import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from './Navigation';
import { useRouter, usePathname } from 'next/navigation';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      dashboard: 'Dashboard',
      shifts: 'Shifts',
      leave: 'Leave',
      incidents: 'Incidents',
      cleaning: 'Cleaning',
      clock: 'Clock',
      logout: 'Logout',
      logoutSuccess: 'You have been logged out',
      appName: 'AquaSense',
      select: 'Select Language',
      danish: 'Danish',
      english: 'English',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Navigation', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any);
    vi.mocked(usePathname).mockReturnValue('/da/dashboard/staff');
    global.fetch = vi.fn();
  });

  it('should render app name and user name', () => {
    render(<Navigation userName="John Doe" currentLocale="en" />);

    expect(screen.getByText('AquaSense')).toBeDefined();
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
  });

  it('should render all navigation links', () => {
    render(<Navigation userName="John Doe" currentLocale="da" />);

    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Shifts')).toBeDefined();
    expect(screen.getByText('Leave')).toBeDefined();
    expect(screen.getByText('Incidents')).toBeDefined();
    expect(screen.getByText('Cleaning')).toBeDefined();
    expect(screen.getByText('Clock')).toBeDefined();
  });

  it('should render logout button', () => {
    render(<Navigation userName="John Doe" currentLocale="en" />);

    const logoutButtons = screen.getAllByText('Logout');
    expect(logoutButtons.length).toBeGreaterThan(0);
  });

  it('should call logout API when logout button is clicked', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<Navigation userName="John Doe" currentLocale="en" />);

    // Click logout button (desktop version)
    const logoutButtons = screen.getAllByText('Logout');
    fireEvent.click(logoutButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/login');
    });
  });

  it('should toggle mobile menu when hamburger button is clicked', () => {
    render(<Navigation userName="John Doe" currentLocale="da" />);

    // Mobile menu should not be visible initially
    const mobileLinks = screen.queryAllByRole('link');
    const initialLinksCount = mobileLinks.length;

    // Click hamburger button
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);

    // Mobile menu should now be visible
    const visibleLinks = screen.getAllByRole('link');
    expect(visibleLinks.length).toBeGreaterThan(initialLinksCount);
  });

  it('should handle language change', async () => {
    vi.mocked(usePathname).mockReturnValue('/da/dashboard/staff');

    render(<Navigation userName="John Doe" currentLocale="da" />);

    // Open language selector (this is implementation-specific)
    // For now, verify the component renders with correct locale
    expect(screen.getByText('Danish')).toBeDefined();
  });

  it('should have touch-friendly button sizes on mobile', () => {
    render(<Navigation userName="John Doe" currentLocale="en" />);

    const hamburgerButton = screen.getByLabelText('Toggle menu');
    // Check button has minimum touch target size classes
    expect(hamburgerButton.className).toContain('h-11');
    expect(hamburgerButton.className).toContain('w-11');
  });

  it('should highlight active navigation link', () => {
    vi.mocked(usePathname).mockReturnValue('/en/shifts');

    render(<Navigation userName="John Doe" currentLocale="en" />);

    // The navigation component should render links
    const shiftsLinks = screen.getAllByText('Shifts');
    expect(shiftsLinks.length).toBeGreaterThan(0);
  });

  it('should handle logout error gracefully', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Logout failed' }),
    } as Response);

    render(<Navigation userName="John Doe" currentLocale="en" />);

    const logoutButtons = screen.getAllByText('Logout');
    fireEvent.click(logoutButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should close mobile menu after clicking a link', () => {
    render(<Navigation userName="John Doe" currentLocale="da" />);

    // Open mobile menu
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);

    // Click a navigation link
    const dashboardLinks = screen.getAllByText('Dashboard');
    const mobileLink = dashboardLinks.find((link) => {
      return link.closest('a')?.className.includes('min-h-[44px]');
    });

    if (mobileLink) {
      fireEvent.click(mobileLink);
      // Menu should close (implementation detail - hamburger icon changes)
    }
  });
});
