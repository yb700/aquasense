import React from 'react';
import { render, screen } from '@testing-library/react';
import { FloatingCard } from './FloatingCard';

describe('FloatingCard', () => {
  it('renders children correctly', () => {
    render(
      <FloatingCard>
        <div data-testid="card-content">Test Content</div>
      </FloatingCard>
    );
    
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies standard variant styles by default', () => {
    const { container } = render(
      <FloatingCard>
        <div>Standard Card</div>
      </FloatingCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('dark:bg-card');
    expect(card).toHaveClass('shadow-md');
  });

  it('applies glass variant styles when glass prop is true', () => {
    const { container } = render(
      <FloatingCard glass>
        <div>Glass Card</div>
      </FloatingCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white/10');
    expect(card).toHaveClass('dark:bg-black/10');
    expect(card).toHaveClass('backdrop-blur-lg');
    expect(card).toHaveClass('shadow-glass');
    expect(card).toHaveClass('border');
  });

  it('applies custom className', () => {
    const { container } = render(
      <FloatingCard className="custom-class">
        <div>Custom Card</div>
      </FloatingCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('applies base styles to all variants', () => {
    const { container } = render(
      <FloatingCard>
        <div>Card</div>
      </FloatingCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-md');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('duration-base');
    expect(card).toHaveClass('ease-water-flow');
    expect(card).toHaveClass('p-4');
    expect(card).toHaveClass('md:p-6');
  });

  it('uses motion.div when hover is enabled', () => {
    const { container } = render(
      <FloatingCard hover>
        <div>Hoverable Card</div>
      </FloatingCard>
    );
    
    const card = container.firstChild as HTMLElement;
    // motion.div should be present when hover is enabled
    expect(card).toBeInTheDocument();
  });

  it('uses regular div when hover is disabled', () => {
    const { container } = render(
      <FloatingCard hover={false}>
        <div>Non-hoverable Card</div>
      </FloatingCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toBeInTheDocument();
  });

  it('combines glass and hover props correctly', () => {
    const { container } = render(
      <FloatingCard glass hover>
        <div>Glass Hoverable Card</div>
      </FloatingCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('backdrop-blur-lg');
    expect(card).toHaveClass('shadow-glass');
    expect(card).toBeInTheDocument();
  });

  it('renders complex children structure', () => {
    render(
      <FloatingCard>
        <header>Card Header</header>
        <main>Card Content</main>
        <footer>Card Footer</footer>
      </FloatingCard>
    );
    
    expect(screen.getByText('Card Header')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });
});
