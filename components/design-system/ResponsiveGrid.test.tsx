import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResponsiveGrid } from './ResponsiveGrid';

describe('ResponsiveGrid', () => {
  it('renders children correctly', () => {
    render(
      <ResponsiveGrid>
        <div data-testid="grid-item-1">Item 1</div>
        <div data-testid="grid-item-2">Item 2</div>
        <div data-testid="grid-item-3">Item 3</div>
      </ResponsiveGrid>
    );
    
    expect(screen.getByTestId('grid-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item-3')).toBeInTheDocument();
  });

  it('applies default grid classes', () => {
    const { container } = render(
      <ResponsiveGrid>
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('gap-4'); // default md gap
    expect(grid).toHaveClass('grid-cols-1'); // default mobile columns
    expect(grid).toHaveClass('md:grid-cols-2'); // default tablet columns
    expect(grid).toHaveClass('lg:grid-cols-3'); // default desktop columns
  });

  it('applies custom column counts', () => {
    const { container } = render(
      <ResponsiveGrid columns={{ mobile: 1, tablet: 3, desktop: 4 }}>
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-3');
    expect(grid).toHaveClass('lg:grid-cols-4');
  });

  it('applies xs gap correctly', () => {
    const { container } = render(
      <ResponsiveGrid gap="xs">
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('gap-1'); // 4px
  });

  it('applies sm gap correctly', () => {
    const { container } = render(
      <ResponsiveGrid gap="sm">
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('gap-2'); // 8px
  });

  it('applies md gap correctly', () => {
    const { container } = render(
      <ResponsiveGrid gap="md">
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('gap-4'); // 16px
  });

  it('applies lg gap correctly', () => {
    const { container } = render(
      <ResponsiveGrid gap="lg">
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('gap-6'); // 24px
  });

  it('applies xl gap correctly', () => {
    const { container } = render(
      <ResponsiveGrid gap="xl">
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('gap-8'); // 32px
  });

  it('applies custom className', () => {
    const { container } = render(
      <ResponsiveGrid className="custom-grid-class">
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('custom-grid-class');
  });

  it('handles partial column configuration', () => {
    const { container } = render(
      <ResponsiveGrid columns={{ desktop: 4 }}>
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid-cols-1'); // default mobile
    expect(grid).toHaveClass('md:grid-cols-2'); // default tablet
    expect(grid).toHaveClass('lg:grid-cols-4'); // custom desktop
  });

  it('renders multiple children in grid layout', () => {
    render(
      <ResponsiveGrid>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </ResponsiveGrid>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('Item 4')).toBeInTheDocument();
  });

  it('combines all custom props correctly', () => {
    const { container } = render(
      <ResponsiveGrid
        columns={{ mobile: 1, tablet: 2, desktop: 4 }}
        gap="lg"
        className="custom-wrapper"
      >
        <div>Item</div>
      </ResponsiveGrid>
    );
    
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('gap-6');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-4');
    expect(grid).toHaveClass('custom-wrapper');
  });
});
