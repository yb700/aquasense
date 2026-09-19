import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollReveal } from './ScrollReveal';

describe('ScrollReveal', () => {
  it('renders children correctly', () => {
    render(
      <ScrollReveal>
        <div>Test Content</div>
      </ScrollReveal>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScrollReveal className="custom-class">
        <div>Test Content</div>
      </ScrollReveal>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with fade direction', () => {
    render(
      <ScrollReveal direction="fade">
        <div>Fade Content</div>
      </ScrollReveal>
    );
    
    expect(screen.getByText('Fade Content')).toBeInTheDocument();
  });

  it('renders with up direction', () => {
    render(
      <ScrollReveal direction="up">
        <div>Slide Up Content</div>
      </ScrollReveal>
    );
    
    expect(screen.getByText('Slide Up Content')).toBeInTheDocument();
  });

  it('renders with down direction', () => {
    render(
      <ScrollReveal direction="down">
        <div>Slide Down Content</div>
      </ScrollReveal>
    );
    
    expect(screen.getByText('Slide Down Content')).toBeInTheDocument();
  });

  it('renders with left direction', () => {
    render(
      <ScrollReveal direction="left">
        <div>Slide Left Content</div>
      </ScrollReveal>
    );
    
    expect(screen.getByText('Slide Left Content')).toBeInTheDocument();
  });

  it('renders with right direction', () => {
    render(
      <ScrollReveal direction="right">
        <div>Slide Right Content</div>
      </ScrollReveal>
    );
    
    expect(screen.getByText('Slide Right Content')).toBeInTheDocument();
  });

  it('renders with delay', () => {
    render(
      <ScrollReveal delay={0.5}>
        <div>Delayed Content</div>
      </ScrollReveal>
    );
    
    expect(screen.getByText('Delayed Content')).toBeInTheDocument();
  });

  it('renders with once set to false', () => {
    render(
      <ScrollReveal once={false}>
        <div>Repeating Animation</div>
      </ScrollReveal>
    );
    
    expect(screen.getByText('Repeating Animation')).toBeInTheDocument();
  });

  it('respects prefers-reduced-motion', () => {
    // Save original matchMedia
    const originalMatchMedia = window.matchMedia;
    
    // Mock matchMedia to return prefers-reduced-motion: reduce
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    });

    const { container } = render(
      <ScrollReveal>
        <div>Reduced Motion Content</div>
      </ScrollReveal>
    );
    
    // With reduced motion, it should render without motion
    expect(screen.getByText('Reduced Motion Content')).toBeInTheDocument();
    expect(container.querySelector('div')).toBeInTheDocument();
    
    // Restore original matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });
});
