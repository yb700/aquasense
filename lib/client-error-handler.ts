/**
 * Client-side error handling utilities
 * 
 * Provides helper functions for handling API errors in Client Components
 * and displaying user-friendly error messages with toast notifications.
 * 
 * Features:
 * - Parse API error responses
 * - Generate user-friendly error messages
 * - Support for bilingual error messages
 * - Integration with toast notifications
 * 
 * Requirements:
 * - 1.2: Display error messages on invalid credentials
 * - 11.1: Mobile-first user interface
 * - 12.3: Bilingual error messages
 */

import { ErrorResponse, ErrorCodes } from './errors';

/**
 * Parse error response from API and return user-friendly message
 * 
 * @param response - Fetch response object
 * @param defaultMessage - Default message if parsing fails
 * @returns User-friendly error message
 */
export async function parseApiError(
  response: Response,
  defaultMessage: string = 'An unexpected error occurred'
): Promise<string> {
  try {
    const data: ErrorResponse = await response.json();
    return data.error || defaultMessage;
  } catch {
    // If JSON parsing fails, return default message
    return defaultMessage;
  }
}

/**
 * Get user-friendly error message based on error code and locale
 * 
 * @param code - Error code from API response
 * @param locale - Current locale (en or da)
 * @returns Translated error message
 */
export function getErrorMessage(code: string, locale: 'en' | 'da' = 'en'): string {
  const messages: Record<string, Record<'en' | 'da', string>> = {
    [ErrorCodes.INVALID_CREDENTIALS]: {
      en: 'Invalid email or password',
      da: 'Ugyldig e-mail eller adgangskode',
    },
    [ErrorCodes.UNAUTHORIZED]: {
      en: 'You must be logged in to perform this action',
      da: 'Du skal være logget ind for at udføre denne handling',
    },
    [ErrorCodes.FORBIDDEN]: {
      en: 'You do not have permission to perform this action',
      da: 'Du har ikke tilladelse til at udføre denne handling',
    },
    [ErrorCodes.MANAGER_ONLY]: {
      en: 'This action is only available to managers',
      da: 'Denne handling er kun tilgængelig for ledere',
    },
    [ErrorCodes.VALIDATION_ERROR]: {
      en: 'Please check your input and try again',
      da: 'Tjek venligst dit input og prøv igen',
    },
    [ErrorCodes.ALREADY_CLOCKED_IN]: {
      en: 'You are already clocked in',
      da: 'Du er allerede stemplet ind',
    },
    [ErrorCodes.NO_ACTIVE_SESSION]: {
      en: 'You do not have an active session to clock out',
      da: 'Du har ingen aktiv session at stemple ud fra',
    },
    [ErrorCodes.INCIDENT_LOCKED]: {
      en: 'This incident is locked and cannot be modified',
      da: 'Denne hændelse er låst og kan ikke ændres',
    },
    [ErrorCodes.NOT_FOUND]: {
      en: 'The requested resource was not found',
      da: 'Den ønskede ressource blev ikke fundet',
    },
    [ErrorCodes.INTERNAL_ERROR]: {
      en: 'An unexpected server error occurred',
      da: 'Der opstod en uventet serverfejl',
    },
  };

  const message = messages[code];
  if (message) {
    return message[locale];
  }

  // Default fallback messages
  return locale === 'da'
    ? 'Der opstod en uventet fejl'
    : 'An unexpected error occurred';
}

/**
 * Handle API errors with toast notifications
 * 
 * @param response - Fetch response object
 * @param toast - Toast function from useToast hook
 * @param locale - Current locale (en or da)
 * @param customMessage - Optional custom error message
 */
export async function handleApiError(
  response: Response,
  toast: (options: {
    variant?: 'default' | 'destructive';
    title: string;
    description?: string;
  }) => void,
  locale: 'en' | 'da' = 'en',
  customMessage?: string
): Promise<void> {
  try {
    const data: ErrorResponse = await response.json();
    
    // Use custom message if provided, otherwise try to get translated message
    let errorMessage = customMessage;
    if (!errorMessage && data.code) {
      errorMessage = getErrorMessage(data.code, locale);
    }
    if (!errorMessage) {
      errorMessage = data.error;
    }

    toast({
      variant: 'destructive',
      title: locale === 'da' ? 'Fejl' : 'Error',
      description: errorMessage,
    });
  } catch {
    // If JSON parsing fails, show generic error
    toast({
      variant: 'destructive',
      title: locale === 'da' ? 'Fejl' : 'Error',
      description: customMessage || (locale === 'da' 
        ? 'Der opstod en uventet fejl' 
        : 'An unexpected error occurred'),
    });
  }
}

/**
 * Wrap async API call with try-catch and error handling
 * 
 * @param apiCall - Async function that makes the API call
 * @param toast - Toast function from useToast hook
 * @param locale - Current locale (en or da)
 * @returns Result of the API call or null if error occurred
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  toast: (options: {
    variant?: 'default' | 'destructive';
    title: string;
    description?: string;
  }) => void,
  locale: 'en' | 'da' = 'en'
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call error:', error);
    toast({
      variant: 'destructive',
      title: locale === 'da' ? 'Netværksfejl' : 'Network Error',
      description: locale === 'da'
        ? 'Kunne ikke oprette forbindelse til serveren'
        : 'Could not connect to the server',
    });
    return null;
  }
}
