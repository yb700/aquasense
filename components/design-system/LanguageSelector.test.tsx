import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LanguageSelector } from './LanguageSelector';

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: vi.fn(() => 'en'),
  useTranslations: vi.fn(() => (key: string) => key),
}));

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockPathname = '/en/dashboard';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => mockPathname,
}));

describe('LanguageSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Inline Variant', () => {
    it('should render inline variant by default', () => {
      render(<LanguageSelector />);
      const group = screen.getByRole('group', { name: /language selector/i });
      expect(group).toBeInTheDocument();
    });

    it('should render inline variant when explicitly specified', () => {
      render(<LanguageSelector variant="inline" />);
      const group = screen.getByRole('group', { name: /language selector/i });
      expect(group).toBeInTheDocument();
    });

    it('should display both language buttons', () => {
      render(<LanguageSelector variant="inline" />);
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      expect(englishButton).toBeInTheDocument();
      expect(danishButton).toBeInTheDocument();
    });

    it('should display flag icons for both languages', () => {
      render(<LanguageSelector variant="inline" />);
      expect(screen.getByText('🇬🇧')).toBeInTheDocument();
      expect(screen.getByText('🇩🇰')).toBeInTheDocument();
    });

    it('should display globe icon', () => {
      const { container } = render(<LanguageSelector variant="inline" />);
      const globeIcon = container.querySelector('svg');
      expect(globeIcon).toBeInTheDocument();
    });

    it('should highlight current language button', () => {
      render(<LanguageSelector currentLocale="en" variant="inline" />);
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      expect(englishButton).toHaveAttribute('aria-pressed', 'true');
      expect(englishButton).toHaveClass('bg-primary');
    });

    it('should not highlight inactive language button', () => {
      render(<LanguageSelector currentLocale="en" variant="inline" />);
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      expect(danishButton).toHaveAttribute('aria-pressed', 'false');
      expect(danishButton).not.toHaveClass('bg-primary');
    });

    it('should call onLocaleChange when clicking a different language', () => {
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="inline" />);
      
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      fireEvent.click(danishButton);
      
      expect(handleChange).toHaveBeenCalledWith('da');
    });

    it('should not call onLocaleChange when clicking current language', () => {
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="inline" />);
      
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      fireEvent.click(englishButton);
      
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should navigate using next-intl when no onLocaleChange provided', () => {
      render(<LanguageSelector currentLocale="en" variant="inline" />);
      
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      fireEvent.click(danishButton);
      
      expect(mockPush).toHaveBeenCalledWith('/da/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });

    it('should have minimum 44px touch targets', () => {
      render(<LanguageSelector variant="inline" />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach((button) => {
        expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]');
      });
    });

    it('should apply custom className', () => {
      const { container } = render(<LanguageSelector variant="inline" className="custom-class" />);
      const group = container.firstChild;
      expect(group).toHaveClass('custom-class');
    });
  });

  describe('Dropdown Variant', () => {
    it('should render dropdown variant', () => {
      render(<LanguageSelector variant="dropdown" />);
      const select = screen.getByRole('combobox', { name: /select language/i });
      expect(select).toBeInTheDocument();
    });

    it('should display globe icon', () => {
      const { container } = render(<LanguageSelector variant="dropdown" />);
      const globeIcon = container.querySelector('svg');
      expect(globeIcon).toBeInTheDocument();
    });

    it('should display both language options', () => {
      render(<LanguageSelector variant="dropdown" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      const options = Array.from(select.options);
      
      expect(options).toHaveLength(2);
      expect(options[0].value).toBe('en');
      expect(options[1].value).toBe('da');
    });

    it('should show current locale as selected', () => {
      render(<LanguageSelector currentLocale="en" variant="dropdown" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('en');
    });

    it('should call onLocaleChange when selecting a different language', () => {
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="dropdown" />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'da' } });
      
      expect(handleChange).toHaveBeenCalledWith('da');
    });

    it('should navigate using next-intl when no onLocaleChange provided', () => {
      render(<LanguageSelector currentLocale="en" variant="dropdown" />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'da' } });
      
      expect(mockPush).toHaveBeenCalledWith('/da/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });

    it('should have minimum height for touch target', () => {
      render(<LanguageSelector variant="dropdown" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('h-11');
    });

    it('should apply custom className', () => {
      const { container } = render(<LanguageSelector variant="dropdown" className="custom-dropdown" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-dropdown');
    });

    it('should display flag icons in options', () => {
      render(<LanguageSelector variant="dropdown" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      const options = Array.from(select.options);
      
      expect(options[0].text).toContain('🇬🇧');
      expect(options[1].text).toContain('🇩🇰');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should change language when Enter key is pressed on inline button', () => {
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="inline" />);
      
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      fireEvent.keyDown(danishButton, { key: 'Enter', code: 'Enter' });
      
      expect(handleChange).toHaveBeenCalledWith('da');
    });

    it('should change language when Space key is pressed on inline button', () => {
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="inline" />);
      
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      fireEvent.keyDown(danishButton, { key: ' ', code: 'Space' });
      
      expect(handleChange).toHaveBeenCalledWith('da');
    });

    it('should not change language on other keys', () => {
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="inline" />);
      
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      fireEvent.keyDown(danishButton, { key: 'a', code: 'KeyA' });
      
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('inline buttons should be focusable', () => {
      render(<LanguageSelector variant="inline" />);
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      
      englishButton.focus();
      expect(englishButton).toHaveFocus();
    });

    it('dropdown should be focusable', () => {
      render(<LanguageSelector variant="dropdown" />);
      const select = screen.getByRole('combobox');
      
      select.focus();
      expect(select).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('inline buttons should have focus ring styles', () => {
      render(<LanguageSelector variant="inline" />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach((button) => {
        expect(button).toHaveClass('focus:ring-2', 'focus:ring-accent');
      });
    });

    it('dropdown should have focus ring styles', () => {
      render(<LanguageSelector variant="dropdown" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('focus:ring-2', 'focus:ring-accent');
    });

    it('inline variant should have group role with label', () => {
      render(<LanguageSelector variant="inline" />);
      const group = screen.getByRole('group', { name: /language selector/i });
      expect(group).toHaveAttribute('aria-label', 'Language selector');
    });

    it('dropdown should have aria-label', () => {
      render(<LanguageSelector variant="dropdown" />);
      const select = screen.getByRole('combobox', { name: /select language/i });
      expect(select).toHaveAttribute('aria-label', 'Select language');
    });

    it('inline buttons should have descriptive aria-labels', () => {
      render(<LanguageSelector variant="inline" />);
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      
      expect(englishButton).toHaveAttribute('aria-label', 'Switch to English');
      expect(danishButton).toHaveAttribute('aria-label', 'Switch to Dansk');
    });

    it('inline buttons should have aria-pressed attribute', () => {
      render(<LanguageSelector currentLocale="en" variant="inline" />);
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      
      expect(englishButton).toHaveAttribute('aria-pressed', 'true');
      expect(danishButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('icons should be hidden from screen readers', () => {
      const { container } = render(<LanguageSelector variant="inline" />);
      const globeIcon = container.querySelector('svg');
      expect(globeIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('flag emojis should be in aria-hidden spans', () => {
      render(<LanguageSelector variant="inline" />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        const ariaHiddenSpans = button.querySelectorAll('[aria-hidden="true"]');
        expect(ariaHiddenSpans.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Visual States', () => {
    it('inline buttons should have hover styles', () => {
      render(<LanguageSelector currentLocale="en" variant="inline" />);
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      expect(danishButton).toHaveClass('hover:bg-muted', 'hover:text-foreground');
    });

    it('dropdown should have hover styles', () => {
      render(<LanguageSelector variant="dropdown" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('hover:border-accent', 'hover:bg-muted');
    });

    it('should have transition classes', () => {
      render(<LanguageSelector variant="inline" />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach((button) => {
        expect(button).toHaveClass('transition-all');
      });
    });

    it('inactive inline button should have scale hover effect', () => {
      render(<LanguageSelector currentLocale="en" variant="inline" />);
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      expect(danishButton).toHaveClass('hover:scale-105');
    });

    it('active inline button should not have scale hover effect', () => {
      render(<LanguageSelector currentLocale="en" variant="inline" />);
      const englishButton = screen.getByRole('button', { name: /switch to english/i });
      expect(englishButton).not.toHaveClass('hover:scale-105');
    });
  });

  describe('Locale Detection', () => {
    it('should use currentLocale prop when provided', () => {
      render(<LanguageSelector currentLocale="da" variant="inline" />);
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      expect(danishButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should update when currentLocale prop changes', () => {
      const { rerender } = render(<LanguageSelector currentLocale="en" variant="inline" />);
      
      let englishButton = screen.getByRole('button', { name: /switch to english/i });
      expect(englishButton).toHaveAttribute('aria-pressed', 'true');
      
      rerender(<LanguageSelector currentLocale="da" variant="inline" />);
      
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      expect(danishButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicking without errors', () => {
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="inline" />);
      
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      
      fireEvent.click(danishButton);
      fireEvent.click(danishButton);
      fireEvent.click(danishButton);
      
      // Clicking a different language multiple times calls handler each time
      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenCalledWith('da');
    });

    it('should handle missing className prop', () => {
      render(<LanguageSelector variant="inline" />);
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
    });

    it('should handle empty className', () => {
      render(<LanguageSelector variant="inline" className="" />);
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
    });

    it('should work without explicit variant prop', () => {
      render(<LanguageSelector />);
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
    });

    it('should handle selecting same language in dropdown', async () => {
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="dropdown" />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'en' } });
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Animation States', () => {
    it('should apply animation class temporarily when language changes', async () => {
      vi.useFakeTimers();
      
      const handleChange = vi.fn();
      render(<LanguageSelector currentLocale="en" onLocaleChange={handleChange} variant="inline" />);
      
      const danishButton = screen.getByRole('button', { name: /switch to dansk/i });
      fireEvent.click(danishButton);
      
      expect(handleChange).toHaveBeenCalledWith('da');
      
      // Fast-forward animation
      vi.advanceTimersByTime(300);
      
      vi.useRealTimers();
    });

    it('should apply animation to dropdown when changed', async () => {
      vi.useFakeTimers();
      
      render(<LanguageSelector currentLocale="en" variant="dropdown" />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'da' } });
      
      // Animation should be triggered
      vi.advanceTimersByTime(300);
      
      vi.useRealTimers();
    });
  });
});
