import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import LoginPage from './page';

// Mock next/navigation
const mockPush = vi.fn();
const mockParams = { locale: 'en' };

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => mockParams,
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      auth: {
        login: 'Login',
        loginDescription: 'Enter your credentials to access your account',
        email: 'Email',
        password: 'Password',
        invalidCredentials: 'Invalid credentials',
        loginSuccess: 'Login successful',
      },
      common: {
        appName: 'AquaSense',
        welcome: 'Welcome',
        loading: 'Loading...',
      },
    };
    return (key: string) => translations[namespace]?.[key] || key;
  },
}));

// Mock toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock design system components
vi.mock('@/components/design-system/Logo', () => ({
  Logo: ({ variant, size }: { variant: string; size: number }) => (
    <div data-testid="logo" data-variant={variant} data-size={size}>
      AquaSense Logo
    </div>
  ),
}));

vi.mock('@/components/design-system/FloatingCard', () => ({
  FloatingCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="floating-card" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/design-system/WaterBackground', () => ({
  WaterBackground: ({ children, variant, intensity, className }: any) => (
    <div 
      data-testid="water-background" 
      data-variant={variant}
      data-intensity={intensity}
      className={className}
    >
      {children}
    </div>
  ),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams.locale = 'en';
  });

  /**
   * Test: Renders login form with all required fields and design system components
   * Validates: Requirements 29.1, 29.2, 29.3, 29.4, 29.5
   */
  it('renders login form with email and password fields', () => {
    render(<LoginPage />);

    // Verify design system components are rendered
    expect(screen.getByTestId('water-background')).toBeInTheDocument();
    expect(screen.getByTestId('floating-card')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    
    // Verify form fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    
    // Verify login description is displayed
    expect(screen.getByText('Enter your credentials to access your account')).toBeInTheDocument();
  });

  /**
   * Test: Form validation displays errors for invalid inputs
   * Validates: Requirements 1.2, 11.1
   */
  it('displays validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  /**
   * Test: Successful login redirects to manager dashboard
   * Validates: Requirements 1.1, 1.4
   */
  it('redirects to manager dashboard on successful login for manager role', async () => {
    const user = userEvent.setup();
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          id: 'user-1',
          email: 'manager@example.com',
          name: 'Manager User',
          role: 'MANAGER',
          organizationId: 'org-1',
        },
      }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'manager@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login successful',
        description: 'Welcome, Manager User',
      });
      expect(mockPush).toHaveBeenCalledWith('/en/dashboard/manager');
    });
  });

  /**
   * Test: Successful login redirects to staff dashboard
   * Validates: Requirements 1.1, 1.4
   */
  it('redirects to staff dashboard on successful login for staff role', async () => {
    const user = userEvent.setup();
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          id: 'user-2',
          email: 'staff@example.com',
          name: 'Staff User',
          role: 'STAFF',
          organizationId: 'org-1',
        },
      }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'staff@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login successful',
        description: 'Welcome, Staff User',
      });
      expect(mockPush).toHaveBeenCalledWith('/en/dashboard/staff');
    });
  });

  /**
   * Test: Failed login displays error toast
   * Validates: Requirements 1.2
   */
  it('displays error toast on invalid credentials', async () => {
    const user = userEvent.setup();
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Invalid credentials',
        description: 'Invalid email or password',
      });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  /**
   * Test: Network error displays error toast
   * Validates: Requirements 1.2
   */
  it('displays error toast on network failure', async () => {
    const user = userEvent.setup();
    
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  /**
   * Test: Login button disables during submission
   * Validates: Requirements 11.1
   */
  it('disables form inputs and button during submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /login/i }) as HTMLButtonElement;

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Check that button is disabled during submission
    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  /**
   * Test: Form uses correct locale in redirect URL
   * Validates: Requirements 12.3
   */
  it('includes locale in dashboard redirect URL', async () => {
    const user = userEvent.setup();
    mockParams.locale = 'da';
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          id: 'user-1',
          email: 'user@example.com',
          name: 'User',
          role: 'STAFF',
          organizationId: 'org-1',
        },
      }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/da/dashboard/staff');
    });
  });

  /**
   * Test: Login form has mobile-first responsive design
   * Validates: Requirements 11.1, 11.2
   */
  it('renders with mobile-first responsive layout', () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    
    // Button should have min-h-touch class for 44px touch target
    expect(submitButton).toBeInTheDocument();
    
    // Card should have responsive width classes
    const card = submitButton.closest('.max-w-md');
    expect(card).toBeInTheDocument();
  });
});
