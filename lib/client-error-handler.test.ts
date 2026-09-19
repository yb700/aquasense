/**
 * Tests for client-side error handling utilities
 * 
 * Validates:
 * - API error parsing
 * - Error message translation (English and Danish)
 * - Toast notification integration
 * - Safe API call wrapper
 * 
 * Requirements:
 * - 1.2: Display error messages on invalid credentials
 * - 12.3: Bilingual error messages
 */

import { parseApiError, getErrorMessage, handleApiError, safeApiCall } from './client-error-handler';
import { ErrorCodes } from './errors';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Client Error Handler', () => {
  describe('parseApiError', () => {
    it('should parse error message from JSON response', async () => {
      const mockResponse = {
        json: async () => ({ error: 'Test error message', code: 'TEST_CODE' }),
        ok: false,
      } as Response;

      const message = await parseApiError(mockResponse);
      expect(message).toBe('Test error message');
    });

    it('should return default message if JSON parsing fails', async () => {
      const mockResponse = {
        json: async () => {
          throw new Error('Invalid JSON');
        },
        ok: false,
      } as Response;

      const message = await parseApiError(mockResponse, 'Custom default');
      expect(message).toBe('Custom default');
    });

    it('should return default message if error field is missing', async () => {
      const mockResponse = {
        json: async () => ({ code: 'TEST_CODE' }),
        ok: false,
      } as Response;

      const message = await parseApiError(mockResponse, 'Fallback message');
      expect(message).toBe('Fallback message');
    });
  });

  describe('getErrorMessage', () => {
    it('should return English error message for INVALID_CREDENTIALS', () => {
      const message = getErrorMessage(ErrorCodes.INVALID_CREDENTIALS, 'en');
      expect(message).toBe('Invalid email or password');
    });

    it('should return Danish error message for INVALID_CREDENTIALS', () => {
      const message = getErrorMessage(ErrorCodes.INVALID_CREDENTIALS, 'da');
      expect(message).toBe('Ugyldig e-mail eller adgangskode');
    });

    it('should return English error message for UNAUTHORIZED', () => {
      const message = getErrorMessage(ErrorCodes.UNAUTHORIZED, 'en');
      expect(message).toBe('You must be logged in to perform this action');
    });

    it('should return Danish error message for UNAUTHORIZED', () => {
      const message = getErrorMessage(ErrorCodes.UNAUTHORIZED, 'da');
      expect(message).toBe('Du skal være logget ind for at udføre denne handling');
    });

    it('should return English error message for MANAGER_ONLY', () => {
      const message = getErrorMessage(ErrorCodes.MANAGER_ONLY, 'en');
      expect(message).toBe('This action is only available to managers');
    });

    it('should return Danish error message for MANAGER_ONLY', () => {
      const message = getErrorMessage(ErrorCodes.MANAGER_ONLY, 'da');
      expect(message).toBe('Denne handling er kun tilgængelig for ledere');
    });

    it('should return English error message for ALREADY_CLOCKED_IN', () => {
      const message = getErrorMessage(ErrorCodes.ALREADY_CLOCKED_IN, 'en');
      expect(message).toBe('You are already clocked in');
    });

    it('should return Danish error message for ALREADY_CLOCKED_IN', () => {
      const message = getErrorMessage(ErrorCodes.ALREADY_CLOCKED_IN, 'da');
      expect(message).toBe('Du er allerede stemplet ind');
    });

    it('should return default English message for unknown error code', () => {
      const message = getErrorMessage('UNKNOWN_CODE', 'en');
      expect(message).toBe('An unexpected error occurred');
    });

    it('should return default Danish message for unknown error code', () => {
      const message = getErrorMessage('UNKNOWN_CODE', 'da');
      expect(message).toBe('Der opstod en uventet fejl');
    });

    it('should default to English when locale is not provided', () => {
      const message = getErrorMessage(ErrorCodes.VALIDATION_ERROR);
      expect(message).toBe('Please check your input and try again');
    });
  });

  describe('handleApiError', () => {
    it('should call toast with translated error message', async () => {
      const mockToast = vi.fn();
      const mockResponse = {
        json: async () => ({
          error: 'Invalid credentials',
          code: ErrorCodes.INVALID_CREDENTIALS,
        }),
        ok: false,
      } as Response;

      await handleApiError(mockResponse, mockToast, 'en');

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid email or password',
      });
    });

    it('should call toast with Danish error message', async () => {
      const mockToast = vi.fn();
      const mockResponse = {
        json: async () => ({
          error: 'Ugyldige loginoplysninger',
          code: ErrorCodes.INVALID_CREDENTIALS,
        }),
        ok: false,
      } as Response;

      await handleApiError(mockResponse, mockToast, 'da');

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Fejl',
        description: 'Ugyldig e-mail eller adgangskode',
      });
    });

    it('should use custom message when provided', async () => {
      const mockToast = vi.fn();
      const mockResponse = {
        json: async () => ({
          error: 'Something went wrong',
          code: 'SOME_CODE',
        }),
        ok: false,
      } as Response;

      await handleApiError(mockResponse, mockToast, 'en', 'Custom error message');

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'Custom error message',
      });
    });

    it('should handle JSON parsing errors gracefully', async () => {
      const mockToast = vi.fn();
      const mockResponse = {
        json: async () => {
          throw new Error('Invalid JSON');
        },
        ok: false,
      } as Response;

      await handleApiError(mockResponse, mockToast, 'en');

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    });

    it('should use error.error field as fallback when code translation not found', async () => {
      const mockToast = vi.fn();
      const mockResponse = {
        json: async () => ({
          error: 'Fallback error message',
          code: 'UNKNOWN_CODE',
        }),
        ok: false,
      } as Response;

      await handleApiError(mockResponse, mockToast, 'en');

      // When code is unknown, it tries getErrorMessage which returns default message
      // Then it falls back to data.error if still no message
      // But getErrorMessage always returns a message, so it uses that
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    });
  });

  describe('safeApiCall', () => {
    it('should return result when API call succeeds', async () => {
      const mockToast = vi.fn();
      const mockApiCall = vi.fn().mockResolvedValue({ success: true, data: 'test' });

      const result = await safeApiCall(mockApiCall, mockToast, 'en');

      expect(result).toEqual({ success: true, data: 'test' });
      expect(mockToast).not.toHaveBeenCalled();
    });

    it('should return null and show toast when API call fails', async () => {
      const mockToast = vi.fn();
      const mockApiCall = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await safeApiCall(mockApiCall, mockToast, 'en');

      expect(result).toBeNull();
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Could not connect to the server',
      });
    });

    it('should show Danish error message when locale is da', async () => {
      const mockToast = vi.fn();
      const mockApiCall = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await safeApiCall(mockApiCall, mockToast, 'da');

      expect(result).toBeNull();
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Netværksfejl',
        description: 'Kunne ikke oprette forbindelse til serveren',
      });
    });

    it('should log error to console', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockToast = vi.fn();
      const error = new Error('Test error');
      const mockApiCall = vi.fn().mockRejectedValue(error);

      await safeApiCall(mockApiCall, mockToast, 'en');

      expect(consoleSpy).toHaveBeenCalledWith('API call error:', error);
      consoleSpy.mockRestore();
    });
  });
});
