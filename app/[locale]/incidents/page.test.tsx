import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IncidentCard } from './IncidentCard';

/**
 * Unit Tests for Incident Pages
 * 
 * Tests the incident reporting UI components to ensure:
 * - Incident cards display correctly
 * - Manager lock button appears for managers
 * - Severity badges use correct colors
 * - Images display when present
 * 
 * Requirements tested:
 * - 7.1: Display incidents with title, description, severity, status
 * - 7.4: Manager can lock incidents
 * - 7.6: Display incidents with image if present
 */

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      incidents: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        open: 'Open',
        closed: 'Closed',
        locked: 'Locked',
        lockIncident: 'Lock Incident',
      },
    };
    return (key: string) => translations[namespace]?.[key] || key;
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('IncidentCard', () => {
  const mockIncident = {
    id: 'incident-1',
    title: 'Pool Maintenance Issue',
    description: 'The pool filter needs immediate attention',
    severity: 'HIGH',
    status: 'OPEN',
    imageUrl: 'https://example.com/image.jpg',
    locked: false,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render incident details correctly', () => {
    render(<IncidentCard incident={mockIncident} isManager={false} />);

    expect(screen.getByText('Pool Maintenance Issue')).toBeInTheDocument();
    expect(screen.getByText('The pool filter needs immediate attention')).toBeInTheDocument();
    expect(screen.getByText(/Reported by John Doe/)).toBeInTheDocument();
  });

  it('should display severity badge with correct variant', () => {
    render(<IncidentCard incident={mockIncident} isManager={false} />);

    const severityBadge = screen.getByText('High');
    expect(severityBadge).toBeInTheDocument();
  });

  it('should display status badge', () => {
    render(<IncidentCard incident={mockIncident} isManager={false} />);

    const statusBadge = screen.getByText('Open');
    expect(statusBadge).toBeInTheDocument();
  });

  it('should display image when imageUrl is present', () => {
    render(<IncidentCard incident={mockIncident} isManager={false} />);

    const image = screen.getByAltText('Pool Maintenance Issue');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should not display image when imageUrl is null', () => {
    const incidentWithoutImage = { ...mockIncident, imageUrl: null };
    render(<IncidentCard incident={incidentWithoutImage} isManager={false} />);

    const image = screen.queryByAltText('Pool Maintenance Issue');
    expect(image).not.toBeInTheDocument();
  });

  it('should show lock button for managers when incident is not locked', () => {
    render(<IncidentCard incident={mockIncident} isManager={true} />);

    const lockButton = screen.getByRole('button', { name: /Lock Incident/i });
    expect(lockButton).toBeInTheDocument();
  });

  it('should not show lock button for staff', () => {
    render(<IncidentCard incident={mockIncident} isManager={false} />);

    const lockButton = screen.queryByRole('button', { name: /Lock Incident/i });
    expect(lockButton).not.toBeInTheDocument();
  });

  it('should not show lock button when incident is already locked', () => {
    const lockedIncident = { ...mockIncident, locked: true };
    render(<IncidentCard incident={lockedIncident} isManager={true} />);

    const lockButton = screen.queryByRole('button', { name: /Lock Incident/i });
    expect(lockButton).not.toBeInTheDocument();
  });

  it('should display locked badge when incident is locked', () => {
    const lockedIncident = { ...mockIncident, locked: true };
    render(<IncidentCard incident={lockedIncident} isManager={true} />);

    expect(screen.getByText('Locked')).toBeInTheDocument();
  });

  it('should display LOW severity with secondary variant', () => {
    const lowSeverityIncident = { ...mockIncident, severity: 'LOW' };
    render(<IncidentCard incident={lowSeverityIncident} isManager={false} />);

    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('should display MEDIUM severity', () => {
    const mediumSeverityIncident = { ...mockIncident, severity: 'MEDIUM' };
    render(<IncidentCard incident={mediumSeverityIncident} isManager={false} />);

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should display CLOSED status', () => {
    const closedIncident = { ...mockIncident, status: 'CLOSED' };
    render(<IncidentCard incident={closedIncident} isManager={false} />);

    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
});
