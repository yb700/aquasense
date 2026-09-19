# Error Utilities Usage Guide

This guide demonstrates how to use the global error response utilities in AquaSense API route handlers.

## Import

```typescript
import {
  ErrorCodes,
  unauthorized,
  forbidden,
  badRequest,
  notFound,
  internalError,
  validationError,
  requireManager,
  requireStaff,
} from '@/lib/errors';
```

## Common Patterns

### 1. Authentication Check

```typescript
export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return unauthorized('Authentication required', ErrorCodes.MISSING_SESSION);
  }
  
  // Proceed with authenticated request...
}
```

### 2. Authorization Check - Manager Only

```typescript
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return unauthorized();
  }
  
  // Check if user is manager
  const authError = requireManager(session.role, 'delete shifts');
  if (authError) {
    return authError;
  }
  
  // Proceed with manager-only operation...
}
```

### 3. Authorization Check - Staff Only

```typescript
export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return unauthorized();
  }
  
  // Check if user is staff
  const authError = requireStaff(session.role, 'clock in');
  if (authError) {
    return authError;
  }
  
  // Proceed with staff-only operation...
}
```

### 4. Input Validation with Zod

```typescript
const shiftSchema = z.object({
  userId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  
  const body = await request.json();
  const result = shiftSchema.safeParse(body);
  
  if (!result.success) {
    return validationError(result.error);
  }
  
  // Proceed with validated data...
  const { userId, date, startTime, endTime } = result.data;
}
```

### 5. Multi-Tenancy - Resource Not Found

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  
  const { id } = await params;
  
  const incident = await prisma.incident.findUnique({
    where: { id },
  });
  
  // Return 404 if not found OR belongs to different org
  if (!incident || incident.organizationId !== session.organizationId) {
    return notFound('Incident not found');
  }
  
  // Proceed with update...
}
```

### 6. Business Logic Errors

```typescript
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  
  // Check if user already has active clock session
  const activeSession = await prisma.clockEntry.findFirst({
    where: {
      userId: session.userId,
      organizationId: session.organizationId,
      clockOutTime: null,
    },
  });
  
  if (activeSession) {
    return badRequest(
      'You already have an active clock session. Please clock out first.',
      ErrorCodes.ALREADY_CLOCKED_IN
    );
  }
  
  // Proceed with clock in...
}
```

### 7. Invalid State Transitions

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  
  const incident = await prisma.incident.findUnique({
    where: { id: (await params).id },
  });
  
  if (!incident) {
    return notFound('Incident not found');
  }
  
  // Check if incident is locked
  if (incident.locked) {
    return badRequest(
      'Cannot modify locked incident',
      ErrorCodes.INCIDENT_LOCKED
    );
  }
  
  // Proceed with update...
}
```

### 8. Date/Time Validation

```typescript
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  
  const { startDate, endDate } = await request.json();
  
  if (new Date(startDate) > new Date(endDate)) {
    return badRequest(
      'Start date must be before end date',
      ErrorCodes.INVALID_DATE_RANGE
    );
  }
  
  // Proceed with valid date range...
}
```

### 9. External Service Errors

```typescript
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }
  
  try {
    const imageUrl = await uploadToSupabase(file);
    // Proceed with success...
  } catch (error) {
    console.error('Image upload failed:', error);
    return internalError(
      'Failed to upload image',
      ErrorCodes.EXTERNAL_SERVICE_ERROR
    );
  }
}
```

### 10. Generic Error Handling

```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorized();
    }
    
    // Your business logic here...
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return internalError('An unexpected error occurred');
  }
}
```

## Error Response Format

All error responses follow this consistent structure:

```typescript
interface ErrorResponse {
  error: string;           // Human-readable error message
  code: string;            // Machine-readable error code
  field?: string;          // Optional: which field caused the error
  details?: string[];      // Optional: additional error details
}
```

### Example Responses

**401 Unauthorized:**
```json
{
  "error": "Authentication required",
  "code": "MISSING_SESSION"
}
```

**403 Forbidden:**
```json
{
  "error": "Only managers can delete shifts",
  "code": "MANAGER_ONLY"
}
```

**400 Bad Request (Validation):**
```json
{
  "error": "Invalid request data",
  "code": "VALIDATION_ERROR",
  "details": [
    "Invalid email format",
    "Password must be at least 8 characters"
  ],
  "field": "email"
}
```

**400 Bad Request (Business Logic):**
```json
{
  "error": "You already have an active clock session. Please clock out first.",
  "code": "ALREADY_CLOCKED_IN"
}
```

**404 Not Found:**
```json
{
  "error": "Incident not found",
  "code": "NOT_FOUND"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to upload image",
  "code": "EXTERNAL_SERVICE_ERROR"
}
```

## Available Error Codes

### Authentication (401)
- `INVALID_CREDENTIALS` - Invalid login credentials
- `UNAUTHORIZED` - Generic authentication failure
- `SESSION_EXPIRED` - Session has expired
- `MISSING_SESSION` - No session found

### Authorization (403)
- `FORBIDDEN` - Generic permission denied
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `MANAGER_ONLY` - Operation requires manager role
- `STAFF_ONLY` - Operation requires staff role

### Validation (400)
- `VALIDATION_ERROR` - Input validation failed
- `INVALID_INPUT` - Generic invalid input
- `MISSING_REQUIRED_FIELD` - Required field is missing
- `INVALID_DATE_RANGE` - Date range is invalid
- `INVALID_TIME_RANGE` - Time range is invalid
- `INVALID_ENUM_VALUE` - Enum value is invalid

### Business Logic (400)
- `ALREADY_CLOCKED_IN` - User has active clock session
- `NO_ACTIVE_SESSION` - No active clock session found
- `INCIDENT_LOCKED` - Incident is locked
- `INVALID_STATUS_TRANSITION` - Invalid state transition

### Resource (404)
- `NOT_FOUND` - Resource not found
- `RESOURCE_NOT_FOUND` - Specific resource not found

### Server (500)
- `INTERNAL_ERROR` - Generic server error
- `DATABASE_ERROR` - Database operation failed
- `EXTERNAL_SERVICE_ERROR` - External service failure

## Best Practices

1. **Always check authentication first** before any authorization or business logic
2. **Use 404 for multi-tenancy violations** to avoid leaking existence of other org's data
3. **Provide specific error codes** for client-side error handling
4. **Include field names** in validation errors to help clients highlight specific inputs
5. **Log errors** before returning error responses for debugging
6. **Use consistent error messages** that match the error codes
7. **Don't expose sensitive information** in error messages (e.g., "User not found" vs "Invalid credentials")
