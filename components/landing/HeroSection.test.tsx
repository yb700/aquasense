/**
 * HeroSection Component Tests
 * 
 * Unit tests for the landing page HeroSection component.
 * Tests core functionality, accessibility, and responsive behavior.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { vi } from 'vitest';

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useInView: () => true,
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('HeroSection', () => {
  const defaultProps = {
    headline: 'Professional Pool Management',
    subheadline: 'Streamline your swimming pool operations',
    ctaText: 'Get Started',
    ctaHref: '/signup',
  };

  it('renders headline and subheadline', () => {
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Professional Pool Management'
    );
    expect(screen.getByText(/Streamline your swimming pool operations/i)).toBeInTheDocument();
  });

  it('renders primary CTA button with correct text and link', () => {
    render(<HeroSection {...defaultProps} />);
    
    const ctaLink = screen.getByRole('link', { name: /Get Started/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/signup');
    
    // Button should be inside the link
    const ctaButton = screen.getByRole('button', { name: /Get Started/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it('renders secondary CTA when provided', () => {
    render(
      <HeroSection
        {...defaultProps}
        secondaryCtaText="Learn More"
        secondaryCtaHref="/about"
      />
    );
    
    const secondaryCta = screen.getByRole('link', { name: /Learn More/i });
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveAttribute('href', '/about');
  });

  it('does not render secondary CTA when not provided', () => {
    render(<HeroSection {...defaultProps} />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1); // Only primary CTA link
  });

  it('renders hero image when provided', () => {
    render(
      <HeroSection
        {...defaultProps}
        heroImage="/images/dashboard.png"
        heroImageAlt="Dashboard Preview"
      />
    );
    
    const image = screen.getByAltText('Dashboard Preview');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/dashboard.png');
  });

  it('does not render hero image when not provided', () => {
    render(<HeroSection {...defaultProps} />);
    
    const images = screen.queryAllByRole('img');
    expect(images).toHaveLength(0);
  });

  it('uses default heroImageAlt when not provided', () => {
    render(
      <HeroSection
        {...defaultProps}
        heroImage="/images/dashboard.png"
      />
    );
    
    expect(screen.getByAltText('AquaSense Dashboard')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <HeroSection {...defaultProps} className="custom-class" />
    );
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('has minimum height of viewport', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('min-h-screen');
  });

  it('renders with semantic HTML structure', () => {
    render(<HeroSection {...defaultProps} />);
    
    // Should have a section element
    expect(screen.getByRole('heading', { level: 1 }).closest('section')).toBeInTheDocument();
  });

  it('applies intense background variant when specified', () => {
    const { container } = render(
      <HeroSection {...defaultProps} backgroundVariant="intense" />
    );
    
    // Check that intense gradient classes are applied
    const gradientDiv = container.querySelector('.from-pool-blue');
    expect(gradientDiv).toBeInTheDocument();
  });

  it('applies default background variant by default', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    
    // Check that default gradient classes are applied
    const gradientDiv = container.querySelector('.from-secondary-400');
    expect(gradientDiv).toBeInTheDocument();
  });

  it('centers content when no hero image is provided', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    
    const textContent = container.querySelector('.text-center');
    expect(textContent).toBeInTheDocument();
  });
});
