# Session Management Usage Examples

This document provides examples of how to use the session management functions in the AquaSense application.

## Core Functions

### 1. Creating a Session (Login)

```typescript
import { createSession } from '@/lib/session';
import { verifyPassword } from '@/lib/auth';
import prisma from '@/lib/prisma';

// In your login API route handler
export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Find user in database
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    return Response.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash);
  
  if (!isValid) {
    return Response.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  // Create session
  await createSession({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
    name: user.name,
    email: user.email,
  });
  
  return Response.json({ success: true });
}
```

### 2. Getting the Current Session

```typescript
import { getSession } from '@/lib/session';

// In any API route handler or Server Component
export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Use session data
  console.log('Current user:', session.name);
  console.log('Organization:', session.organizationId);
  console.log('Role:', session.role);
  
  return Response.json({
    user: {
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}
```

### 3. Destroying a Session (Logout)

```typescript
import { destroySession } from '@/lib/session';

// In your logout API route handler
export async function POST() {
  await destroySession();
  
  return Response.json({ success: true });
}
```

## Protecting API Routes

### Example: Manager-Only Endpoint

```typescript
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  const session = await getSession();
  
  // Check authentication
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Check authorization
  if (session.role !== 'MANAGER') {
    return Response.json(
      { error: 'Forbidden - Manager access required' },
      { status: 403 }
    );
  }
  
  // Perform manager-only operation
  const data = await request.json();
  // ... create shift, approve leave, etc.
  
  return Response.json({ success: true });
}
```

## Using Session in Server Components

```typescript
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Use session data in your component
  return (
    <div>
      <h1>Welcome, {session.name}</h1>
      <p>Organization: {session.organizationId}</p>
      <p>Role: {session.role}</p>
    </div>
  );
}
```

## Multi-Tenant Data Filtering

```typescript
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Query data filtered by organization
  const shifts = await prisma.shift.findMany({
    where: {
      organizationId: session.organizationId,
    },
    orderBy: {
      date: 'asc',
    },
  });
  
  return Response.json({ shifts });
}
```

## Session Lifecycle

```
1. User submits login credentials
   ↓
2. Server validates credentials
   ↓
3. createSession() creates encrypted cookie
   ↓
4. Cookie automatically sent with subsequent requests
   ↓
5. getSession() decrypts and returns session data
   ↓
6. Session expires after 24 hours OR
   ↓
7. destroySession() explicitly logs out user
```

## Security Features

### Automatic Security
- ✅ Cookie is encrypted with AES-256-GCM
- ✅ Cookie is HTTP-only (not accessible via JavaScript)
- ✅ Cookie is Secure (HTTPS only in production)
- ✅ Cookie has SameSite=Strict (CSRF protection)
- ✅ Session expires after 24 hours

### What You Should Do
- ✅ Always validate session exists before protected operations
- ✅ Check user role for authorization
- ✅ Use session.organizationId for multi-tenant filtering
- ✅ Never trust client-provided IDs for organization or user
- ✅ Keep SESSION_SECRET environment variable secure

### What You Should NOT Do
- ❌ Don't expose session data to client-side JavaScript
- ❌ Don't trust client-provided organizationId
- ❌ Don't skip session validation on API routes
- ❌ Don't hardcode SESSION_SECRET in source code
- ❌ Don't store sensitive data in session (keep it minimal)

## Error Handling

```typescript
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return Response.json(
        { 
          error: 'Unauthorized',
          code: 'NO_SESSION' 
        },
        { status: 401 }
      );
    }
    
    // Your protected logic here
    
  } catch (error) {
    console.error('Session error:', error);
    return Response.json(
      { 
        error: 'Internal server error',
        code: 'SESSION_ERROR' 
      },
      { status: 500 }
    );
  }
}
```

## Testing Sessions

```typescript
// Mock session for tests
import { describe, it, expect, vi } from 'vitest';

// You'll need to mock the cookies() function for testing
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Protected API Route', () => {
  it('should require authentication', async () => {
    // Mock getSession to return null
    vi.mock('@/lib/session', () => ({
      getSession: vi.fn().resolvedValue(null),
    }));
    
    const response = await GET();
    expect(response.status).toBe(401);
  });
});
```
