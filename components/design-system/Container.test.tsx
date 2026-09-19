import React from 'react';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="container-content">Test Content</div>
      </Container>
    );
    
    expect(screen.getByTestId('container-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies base styles (centered with auto margins and full width)', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('mx-auto');
    expect(containerEl).toHaveClass('w-full');
  });

  it('applies default max-width (1280px) when maxWidth prop is not specified', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('max-w-7xl'); // 1280px
  });

  it('applies narrow max-width (960px) when maxWidth="narrow"', () => {
    const { container } = render(
      <Container maxWidth="narrow">
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('max-w-[960px]');
  });

  it('applies default max-width (1280px) when maxWidth="default"', () => {
    const { container } = render(
      <Container maxWidth="default">
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('max-w-7xl');
  });

  it('applies wide max-width (1440px) when maxWidth="wide"', () => {
    const { container } = render(
      <Container maxWidth="wide">
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('max-w-[1440px]');
  });

  it('applies no max-width constraint when maxWidth="full"', () => {
    const { container } = render(
      <Container maxWidth="full">
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).not.toHaveClass('max-w-7xl');
    expect(containerEl).not.toHaveClass('max-w-[960px]');
    expect(containerEl).not.toHaveClass('max-w-[1440px]');
    expect(containerEl).toHaveClass('w-full'); // Still full width, just no max constraint
  });

  it('applies responsive horizontal padding by default', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('px-4'); // 16px on mobile
    expect(containerEl).toHaveClass('md:px-6'); // 24px on tablet
    expect(containerEl).toHaveClass('lg:px-8'); // 32px on desktop
  });

  it('applies responsive padding when padding prop is true', () => {
    const { container } = render(
      <Container padding={true}>
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('px-4');
    expect(containerEl).toHaveClass('md:px-6');
    expect(containerEl).toHaveClass('lg:px-8');
  });

  it('does not apply padding when padding prop is false', () => {
    const { container } = render(
      <Container padding={false}>
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).not.toHaveClass('px-4');
    expect(containerEl).not.toHaveClass('md:px-6');
    expect(containerEl).not.toHaveClass('lg:px-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class bg-blue-500">
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('custom-class');
    expect(containerEl).toHaveClass('bg-blue-500');
  });

  it('combines maxWidth, padding, and className props correctly', () => {
    const { container } = render(
      <Container maxWidth="narrow" padding={true} className="custom-bg">
        <div>Content</div>
      </Container>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl).toHaveClass('mx-auto');
    expect(containerEl).toHaveClass('w-full');
    expect(containerEl).toHaveClass('max-w-[960px]');
    expect(containerEl).toHaveClass('px-4');
    expect(containerEl).toHaveClass('md:px-6');
    expect(containerEl).toHaveClass('lg:px-8');
    expect(containerEl).toHaveClass('custom-bg');
  });

  it('renders complex children structure', () => {
    render(
      <Container>
        <header>Header</header>
        <main>Main Content</main>
        <footer>Footer</footer>
      </Container>
    );
    
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('supports nested containers', () => {
    render(
      <Container maxWidth="wide">
        <Container maxWidth="narrow">
          <div data-testid="nested-content">Nested Content</div>
        </Container>
      </Container>
    );
    
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });

  it('handles all maxWidth variants correctly', () => {
    const variants: Array<{ maxWidth: 'narrow' | 'default' | 'wide' | 'full', expectedClass: string }> = [
      { maxWidth: 'narrow', expectedClass: 'max-w-[960px]' },
      { maxWidth: 'default', expectedClass: 'max-w-7xl' },
      { maxWidth: 'wide', expectedClass: 'max-w-[1440px]' },
      { maxWidth: 'full', expectedClass: '' },
    ];

    variants.forEach(({ maxWidth, expectedClass }) => {
      const { container, unmount } = render(
        <Container maxWidth={maxWidth}>
          <div>Content</div>
        </Container>
      );
      
      const containerEl = container.firstChild as HTMLElement;
      if (expectedClass) {
        expect(containerEl).toHaveClass(expectedClass);
      } else {
        // For 'full' variant, ensure no max-width classes are applied
        expect(containerEl).not.toHaveClass('max-w-7xl');
        expect(containerEl).not.toHaveClass('max-w-[960px]');
        expect(containerEl).not.toHaveClass('max-w-[1440px]');
      }
      
      unmount();
    });
  });
});
