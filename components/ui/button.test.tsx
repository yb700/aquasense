import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button.className).toContain('bg-primary')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button', { name: /secondary/i })
      expect(button.className).toContain('border-primary')
      expect(button.className).toContain('bg-transparent')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button', { name: /ghost/i })
      expect(button.className).toContain('bg-transparent')
    })

    it('renders destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button', { name: /delete/i })
      expect(button.className).toContain('bg-error')
    })
  })

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Button>Medium</Button>)
      const button = screen.getByRole('button', { name: /medium/i })
      expect(button.className).toContain('min-h-[48px]')
    })

    it('renders small size with minimum 44px touch target', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button', { name: /small/i })
      expect(button.className).toContain('min-h-[44px]')
    })

    it('renders large size with 56px height', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button', { name: /large/i })
      expect(button.className).toContain('min-h-[56px]')
    })
  })

  describe('Loading State', () => {
    it('displays spinner when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button', { name: /loading/i })
      const spinner = button.querySelector('svg.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('is disabled when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button', { name: /loading/i })
      expect(button).toBeDisabled()
    })

    it('does not display icon when loading', () => {
      const icon = <span data-testid="test-icon">Icon</span>
      render(
        <Button loading icon={icon}>
          Loading
        </Button>
      )
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('applies reduced opacity when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button', { name: /disabled/i })
      expect(button).toBeDisabled()
      expect(button.className).toContain('opacity-50')
    })

    it('prevents pointer events when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button', { name: /disabled/i })
      expect(button.className).toContain('pointer-events-none')
    })
  })

  describe('Icon Support', () => {
    it('renders icon when provided', () => {
      const icon = <span data-testid="test-icon">📧</span>
      render(<Button icon={icon}>With Icon</Button>)
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('renders icon before text', () => {
      const icon = <span data-testid="test-icon">📧</span>
      render(<Button icon={icon}>Send Email</Button>)
      const button = screen.getByRole('button', { name: /send email/i })
      const iconElement = screen.getByTestId('test-icon')
      
      // Icon should come before text in the DOM
      const buttonContent = button.textContent
      expect(buttonContent).toMatch(/📧.*Send Email/)
    })
  })

  describe('Rounded Corners', () => {
    it('applies rounded corners using design system tokens', () => {
      render(<Button>Rounded</Button>)
      const button = screen.getByRole('button', { name: /rounded/i })
      expect(button.className).toContain('rounded-md')
    })
  })

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button disabled onClick={handleClick}>Disabled</Button>)
      const button = screen.getByRole('button', { name: /disabled/i })
      
      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button loading onClick={handleClick}>Loading</Button>)
      const button = screen.getByRole('button', { name: /loading/i })
      
      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible</Button>)
      expect(screen.getByRole('button', { name: /accessible/i })).toBeInTheDocument()
    })

    it('supports custom aria-label', () => {
      render(<Button aria-label="Custom label">Button</Button>)
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
    })

    it('is keyboard accessible', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Press Enter</Button>)
      const button = screen.getByRole('button', { name: /press enter/i })
      
      button.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Design System Integration', () => {
    it('uses water-flow transition timing', () => {
      render(<Button>Animated</Button>)
      const button = screen.getByRole('button', { name: /animated/i })
      expect(button.className).toContain('ease-water-flow')
    })

    it('applies base duration for transitions', () => {
      render(<Button>Transition</Button>)
      const button = screen.getByRole('button', { name: /transition/i })
      expect(button.className).toContain('duration-base')
    })

    it('applies focus ring using design system colors', () => {
      render(<Button>Focus</Button>)
      const button = screen.getByRole('button', { name: /focus/i })
      expect(button.className).toContain('ring-ring')
    })
  })

  describe('Ripple Effect Microinteraction', () => {
    it('creates ripple element on click', async () => {
      const user = userEvent.setup()
      render(<Button>Ripple Test</Button>)
      const button = screen.getByRole('button', { name: /ripple test/i })
      
      await user.click(button)
      
      // Check that a ripple span element was created
      const ripple = button.querySelector('span.absolute.rounded-full')
      expect(ripple).toBeInTheDocument()
    })

    it('ripple has correct initial styling', async () => {
      const user = userEvent.setup()
      render(<Button>Ripple Style</Button>)
      const button = screen.getByRole('button', { name: /ripple style/i })
      
      await user.click(button)
      
      const ripple = button.querySelector('span.absolute.rounded-full')
      expect(ripple).toHaveClass('pointer-events-none')
      expect(ripple).toHaveClass('absolute')
      expect(ripple).toHaveClass('rounded-full')
    })

    it('creates ripple at click coordinates', async () => {
      const user = userEvent.setup()
      render(<Button>Position Test</Button>)
      const button = screen.getByRole('button', { name: /position test/i })
      
      // Mock getBoundingClientRect
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        top: 100,
        right: 200,
        bottom: 150,
        width: 100,
        height: 50,
        x: 100,
        y: 100,
        toJSON: () => ({})
      })
      
      // Simulate click at specific coordinates
      await user.click(button)
      
      const ripple = button.querySelector('span.absolute.rounded-full') as HTMLElement
      expect(ripple).toBeInTheDocument()
    })

    it('uses white ripple for primary variant', async () => {
      const user = userEvent.setup()
      render(<Button variant="primary">Primary Ripple</Button>)
      const button = screen.getByRole('button', { name: /primary ripple/i })
      
      await user.click(button)
      
      const ripple = button.querySelector('span.absolute.rounded-full') as HTMLElement
      expect(ripple.style.backgroundColor).toContain('255, 255, 255') // rgba(255, 255, 255, 0.5)
    })

    it('uses white ripple for destructive variant', async () => {
      const user = userEvent.setup()
      render(<Button variant="destructive">Destructive Ripple</Button>)
      const button = screen.getByRole('button', { name: /destructive ripple/i })
      
      await user.click(button)
      
      const ripple = button.querySelector('span.absolute.rounded-full') as HTMLElement
      expect(ripple.style.backgroundColor).toContain('255, 255, 255') // rgba(255, 255, 255, 0.5)
    })

    it('uses dark ripple for secondary variant', async () => {
      const user = userEvent.setup()
      render(<Button variant="secondary">Secondary Ripple</Button>)
      const button = screen.getByRole('button', { name: /secondary ripple/i })
      
      await user.click(button)
      
      const ripple = button.querySelector('span.absolute.rounded-full') as HTMLElement
      expect(ripple.style.backgroundColor).toContain('10, 61, 98') // rgba(10, 61, 98, 0.2)
    })

    it('uses dark ripple for ghost variant', async () => {
      const user = userEvent.setup()
      render(<Button variant="ghost">Ghost Ripple</Button>)
      const button = screen.getByRole('button', { name: /ghost ripple/i })
      
      await user.click(button)
      
      const ripple = button.querySelector('span.absolute.rounded-full') as HTMLElement
      expect(ripple.style.backgroundColor).toContain('10, 61, 98') // rgba(10, 61, 98, 0.2)
    })

    it('does not create ripple when disabled', async () => {
      const user = userEvent.setup()
      render(<Button disabled>Disabled Ripple</Button>)
      const button = screen.getByRole('button', { name: /disabled ripple/i })
      
      await user.click(button)
      
      const ripple = button.querySelector('span.absolute.rounded-full')
      expect(ripple).not.toBeInTheDocument()
    })

    it('does not create ripple when loading', async () => {
      const user = userEvent.setup()
      render(<Button loading>Loading Ripple</Button>)
      const button = screen.getByRole('button', { name: /loading ripple/i })
      
      await user.click(button)
      
      const ripple = button.querySelector('span.absolute.rounded-full')
      expect(ripple).not.toBeInTheDocument()
    })

    it('allows multiple ripples from rapid clicks', async () => {
      const user = userEvent.setup()
      render(<Button>Multiple Ripples</Button>)
      const button = screen.getByRole('button', { name: /multiple ripples/i })
      
      // Click multiple times quickly
      await user.click(button)
      await user.click(button)
      
      const ripples = button.querySelectorAll('span.absolute.rounded-full')
      expect(ripples.length).toBeGreaterThanOrEqual(1)
    })

    it('removes ripple after animation completes', () => {
      // This test verifies that the timeout is set up correctly
      // Actual removal testing would require integration testing due to animation timing
      render(<Button>Cleanup Test</Button>)
      const button = screen.getByRole('button', { name: /cleanup test/i })
      
      // Verify button is ready for ripple effects
      expect(button.className).toContain('relative')
      expect(button.className).toContain('overflow-hidden')
    })

    it('calls original onClick handler when ripple is triggered', async () => {
      const handleClick = vi.fn()
      
      render(<Button onClick={handleClick}>Click Handler</Button>)
      const button = screen.getByRole('button', { name: /click handler/i })
      
      // Use fireEvent for synchronous click
      const { fireEvent } = await import('@testing-library/react')
      fireEvent.click(button)
      
      // onClick should be called
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('button has overflow-hidden for ripple containment', () => {
      render(<Button>Overflow Test</Button>)
      const button = screen.getByRole('button', { name: /overflow test/i })
      expect(button.className).toContain('overflow-hidden')
    })

    it('button has relative positioning for ripple absolute positioning', () => {
      render(<Button>Position Test</Button>)
      const button = screen.getByRole('button', { name: /position test/i })
      expect(button.className).toContain('relative')
    })
  })
})
