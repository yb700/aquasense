# Error Handling Documentation

This document describes the error handling and validation strategy for the AquaSense MVP application.

## Overview

AquaSense implements a comprehensive error handling system with:
- **Server-side error responses** with consistent format and error codes
- **Client-side error boundaries** for unexpected UI errors
- **Toast notifications** for API error feedback
- **Bilingual error messages** (Danish and English)
- **Zod validation** for input validation before database operations

## Architecture

### 1. Server-Side Error Handling

#### Error Response Format

All API errors follow a consistent JSON structure defined in `lib/errors.ts`:

```typescript
interface ErrorResponse {
  error: string;           // Human-readable error message
  code: string;            // Machine-readable error code
  field?: string;          // Optional: which field caused the error
  details?: string[];      // Optional: additional error details
}
```

#### Error Codes

Standard error codes are defined in `lib/errors.ts`:

```typescript
export const ErrorCodes = {
  // Authentication errors (401)
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Authorization errors (403)
  FORBIDDEN: 'FORBIDDEN',
  MANAGER_ONLY: 'MANAGER_ONLY',
  
  // Validation errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Business logic errors (400)
  ALREADY_CLOCKED_IN: 'ALREADY_CLOCKED_IN',
  NO_ACTIVE_SESSION: 'NO_ACTIVE_SESSION',
  INCIDENT_LOCKED: 'INCIDENT_LOCKED',
  
  // Resource errors (404)
  NOT_FOUND: 'NOT_FOUND',
  
  // Server errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
};
```

#### Error Response Helpers

The `lib/errors.ts` module provides helper functions for creating consistent error responses:

```typescript
// 401 Unauthorized
unauthorized(message?: string, code?: ErrorCode): NextResponse<ErrorResponse>

// 403 Forbidden
forbidden(message?: string, code?: ErrorCode): NextResponse<ErrorResponse>

// 400 Bad Request
badRequest(message: string, code?: ErrorCode, details?: string[], field?: string): NextResponse<ErrorResponse>

// 404 Not Found
notFound(message?: string, code?: ErrorCode): NextResponse<ErrorResponse>

// 500 Internal Server Error
internalError(message?: string, code?: ErrorCode): NextResponse<ErrorResponse>

// Validation error from Zod
validationError(zodError): NextResponse<ErrorResponse>
```

#### Usage in API Routes

```typescript
import { unauthorized, forbidden, badRequest, validationError } from '@/lib/errors';
import { createShiftSchema } from '@/lib/validation';

export async function POST(request: Request) {
  // Authentication check
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  
  // Authorization check
  if (session.role !== 'MANAGER') {
    return forbidden('Only managers can create shifts', ErrorCodes.MANAGER_ONLY);
  }
  
  // Input validation
  const body = await request.json();
  const result = createShiftSchema.safeParse(body);
  if (!result.success) {
    return validationError(result.error);
  }
  
  // Business logic error
  if (someCondition) {
    return badRequest('Invalid shift time range', ErrorCodes.INVALID_INPUT);
  }
  
  // Success
  return NextResponse.json({ shift });
}
```

### 2. Zod Validation

All API input validation uses Zod schemas defined in `lib/validation.ts`:

#### Available Schemas

- `createShiftSchema` - Validate shift creation input
- `updateShiftSchema` - Validate shift updates
- `createLeaveRequestSchema` - Validate leave request creation
- `approveRejectLeaveRequestSchema` - Validate leave request status changes
- `clockInSchema` / `clockOutSchema` - Validate clock operations with optional GPS
- `createIncidentSchema` - Validate incident creation
- `createCleaningTaskSchema` - Validate cleaning task creation

#### Example Usage

```typescript
import { createShiftSchema } from '@/lib/validation';

const body = await request.json();
const result = createShiftSchema.safeParse(body);

if (!result.success) {
  return validationError(result.error);
}

// result.data is now type-safe and validated
const validatedData = result.data;
```

### 3. Client-Side Error Handling

#### Error Boundary Component

The `ErrorBoundary` component (`components/ErrorBoundary.tsx`) catches unexpected JavaScript errors in the component tree:

**Features:**
- Catches rendering errors, lifecycle errors, and constructor errors
- Displays user-friendly fallback UI
- Bilingual error messages (Danish/English)
- "Try Again" button to reset error state
- Technical details in development mode only
- Mobile-first responsive design

**Usage:**

```tsx
<ErrorBoundary locale={locale}>
  <YourComponent />
</ErrorBoundary>
```

**Note:** Error boundaries are typically added at the layout level. They are already included in the root layout (`app/[locale]/layout.tsx`).

#### Toast Notifications

All Client Components use the `useToast` hook from `hooks/use-toast.ts` for displaying API errors:

```tsx
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();
  
  try {
    const response = await fetch('/api/some-endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unexpected error occurred',
      });
      return;
    }
    
    // Success
    toast({
      title: 'Success',
      description: 'Operation completed successfully',
    });
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
    });
  }
}
```

#### Client Error Handler Utilities

The `lib/client-error-handler.ts` module provides utilities for handling API errors in Client Components:

##### `parseApiError(response, defaultMessage?)`

Parses error response and returns user-friendly message:

```typescript
const errorMessage = await parseApiError(response, 'Default message');
```

##### `getErrorMessage(code, locale?)`

Gets translated error message based on error code:

```typescript
const message = getErrorMessage(ErrorCodes.INVALID_CREDENTIALS, 'da');
// Returns: "Ugyldig e-mail eller adgangskode"
```

##### `handleApiError(response, toast, locale?, customMessage?)`

Handles API errors with toast notifications and automatic translation:

```typescript
import { handleApiError } from '@/lib/client-error-handler';

if (!response.ok) {
  await handleApiError(response, toast, locale);
  return;
}
```

##### `safeApiCall(apiCall, toast, locale?)`

Wraps async API call with try-catch and error handling:

```typescript
const result = await safeApiCall(
  async () => {
    const response = await fetch('/api/endpoint');
    return response.json();
  },
  toast,
  locale
);

if (!result) {
  // Error occurred, toast was already shown
  return;
}

// Use result
```

### 4. Bilingual Error Messages

All error messages support both Danish (da) and English (en) translations:

#### Translation Files

Error translations are defined in:
- `messages/en.json` - English translations
- `messages/da.json` - Danish translations

```json
// messages/en.json
{
  "errors": {
    "unexpected": "An unexpected error occurred",
    "tryAgain": "Please try again",
    "networkError": "Network error. Please check your connection.",
    "unauthorized": "You are not authorized to perform this action",
    "validationError": "Please check your input and try again"
  }
}
```

#### Using Translations in Client Components

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('errors');
  
  toast({
    variant: 'destructive',
    title: t('unexpected'),
    description: t('tryAgain'),
  });
}
```

#### Client Error Handler Translations

The `client-error-handler.ts` utility automatically translates error messages based on error codes:

```typescript
// English
getErrorMessage(ErrorCodes.MANAGER_ONLY, 'en')
// Returns: "This action is only available to managers"

// Danish
getErrorMessage(ErrorCodes.MANAGER_ONLY, 'da')
// Returns: "Denne handling er kun tilgængelig for ledere"
```

## Error Categories

### 1. Authentication Errors (401)

**When:** User is not logged in or session has expired

**Error Codes:**
- `UNAUTHORIZED` - Generic authentication failure
- `INVALID_CREDENTIALS` - Invalid email/password
- `SESSION_EXPIRED` - Session has expired
- `MISSING_SESSION` - No active session

**Client Handling:** Redirect to login page

### 2. Authorization Errors (403)

**When:** User lacks permission to perform action

**Error Codes:**
- `FORBIDDEN` - Generic authorization failure
- `MANAGER_ONLY` - Action requires manager role
- `STAFF_ONLY` - Action requires staff role
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions

**Client Handling:** Display error message, do not allow retry

### 3. Validation Errors (400)

**When:** Input data is invalid

**Error Codes:**
- `VALIDATION_ERROR` - Generic validation failure (usually from Zod)
- `INVALID_INPUT` - Invalid data provided
- `MISSING_REQUIRED_FIELD` - Required field is missing
- `INVALID_DATE_RANGE` - Date range is invalid
- `INVALID_TIME_RANGE` - Time range is invalid
- `INVALID_ENUM_VALUE` - Enum value is not valid

**Client Handling:** Highlight invalid fields, allow correction and retry

### 4. Business Logic Errors (400)

**When:** Request violates business rules

**Error Codes:**
- `ALREADY_CLOCKED_IN` - User is already clocked in
- `NO_ACTIVE_SESSION` - No active clock session to clock out from
- `INCIDENT_LOCKED` - Incident is locked and cannot be modified
- `INVALID_STATUS_TRANSITION` - Invalid state transition

**Client Handling:** Display error message with explanation

### 5. Not Found Errors (404)

**When:** Resource doesn't exist or user doesn't have access (multi-tenancy)

**Error Codes:**
- `NOT_FOUND` - Generic not found error
- `RESOURCE_NOT_FOUND` - Specific resource not found

**Client Handling:** Display error message, redirect to list page

**Note:** For multi-tenancy violations, return 404 instead of 403 to avoid leaking information about other organizations' data.

### 6. Server Errors (500)

**When:** Unexpected server error or external service failure

**Error Codes:**
- `INTERNAL_ERROR` - Generic server error
- `DATABASE_ERROR` - Database operation failed
- `EXTERNAL_SERVICE_ERROR` - External service (Supabase Storage) failed

**Client Handling:** Display generic error message, allow retry, log to console

## Best Practices

### API Route Error Handling

1. **Always validate authentication first**
   ```typescript
   const session = await getSession();
   if (!session) {
     return unauthorized();
   }
   ```

2. **Check authorization before business logic**
   ```typescript
   if (session.role !== 'MANAGER') {
     return forbidden('Only managers can perform this action', ErrorCodes.MANAGER_ONLY);
   }
   ```

3. **Validate input with Zod before database operations**
   ```typescript
   const result = schema.safeParse(body);
   if (!result.success) {
     return validationError(result.error);
   }
   ```

4. **Wrap database operations in try-catch**
   ```typescript
   try {
     const record = await prisma.shift.create({ data });
     return NextResponse.json({ shift: record });
   } catch (error) {
     console.error('Database error:', error);
     return internalError('Failed to create shift', ErrorCodes.DATABASE_ERROR);
   }
   ```

5. **Return 404 for multi-tenancy violations**
   ```typescript
   const shift = await prisma.shift.findFirst({
     where: { id, organizationId: session.organizationId },
   });
   
   if (!shift) {
     return notFound('Shift not found');
   }
   ```

### Client Component Error Handling

1. **Always use try-catch around fetch calls**
   ```typescript
   try {
     const response = await fetch('/api/endpoint');
     const data = await response.json();
     
     if (!response.ok) {
       toast({ variant: 'destructive', description: data.error });
       return;
     }
   } catch (error) {
     toast({ variant: 'destructive', description: 'Network error' });
   }
   ```

2. **Display loading states during operations**
   ```typescript
   const [isLoading, setIsLoading] = useState(false);
   
   const handleSubmit = async () => {
     setIsLoading(true);
     try {
       // API call
     } finally {
       setIsLoading(false);
     }
   };
   ```

3. **Use bilingual error messages**
   ```typescript
   const t = useTranslations('errors');
   toast({
     variant: 'destructive',
     description: t('networkError'),
   });
   ```

4. **Provide user-friendly error messages**
   - Bad: "Error 500"
   - Good: "An unexpected error occurred. Please try again."
   
5. **Don't expose technical details in production**
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     console.error('Technical details:', error);
   }
   ```

## Testing

### Testing Error Boundaries

```typescript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

it('should catch errors and display fallback UI', () => {
  render(
    <ErrorBoundary locale="en">
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});
```

### Testing API Error Responses

```typescript
import { unauthorized, validationError } from '@/lib/errors';

it('should return 401 for unauthenticated request', async () => {
  const response = await POST(mockRequest);
  const data = await response.json();
  
  expect(response.status).toBe(401);
  expect(data.code).toBe('UNAUTHORIZED');
});
```

### Testing Client Error Handling

```typescript
it('should display error toast when API fails', async () => {
  const mockToast = vi.fn();
  
  // Mock fetch to return error
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: 'Test error', code: 'TEST_CODE' }),
  });
  
  await handleSubmit();
  
  expect(mockToast).toHaveBeenCalledWith({
    variant: 'destructive',
    description: 'Test error',
  });
});
```

## Requirements Coverage

This error handling implementation satisfies the following requirements:

- **Requirement 1.2:** Display error message on invalid credentials
- **Requirement 11.1:** Mobile-first user interface with error boundaries
- **Requirement 12.3:** User-friendly error messages translated to selected language

## Files

- `lib/errors.ts` - Server-side error utilities and error codes
- `lib/validation.ts` - Zod validation schemas
- `lib/client-error-handler.ts` - Client-side error handling utilities
- `components/ErrorBoundary.tsx` - Error boundary component
- `components/ui/toaster.tsx` - Toast notification component
- `hooks/use-toast.ts` - Toast notification hook
- `messages/en.json` - English error translations
- `messages/da.json` - Danish error translations

## Additional Resources

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Toast](https://ui.shadcn.com/docs/components/toast)
