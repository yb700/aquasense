# Design Document

## Overview

AquaSense MVP is a mobile-first SaaS web application built with Next.js 14 (App Router), designed to digitize swimming pool operations for single-pool facilities. The system architecture follows a modern full-stack pattern with server-side rendering, API Route Handlers, and a managed PostgreSQL database accessed through Prisma ORM.

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (managed) with Prisma ORM
- **Storage**: Supabase Storage for incident images
- **UI**: React with shadcn/ui components, Tailwind CSS
- **Authentication**: Custom session-based auth with encrypted cookies
- **Deployment**: Vercel
- **Internationalization**: next-intl for Danish/English support

### Key Architectural Decisions

1. **Session-based Authentication**: Using encrypted HTTP-only cookies instead of JWT to simplify security and avoid client-side token management
2. **Multi-tenant Single Database**: Shared PostgreSQL database with organization_id filtering at the ORM level to ensure data isolation
3. **Server Components First**: Leveraging React Server Components for data fetching to reduce client-side JavaScript and improve mobile performance
4. **Optimistic UI Updates**: Client components use optimistic updates for clock in/out to provide immediate feedback on slow mobile connections
5. **Route Handler API**: All mutations go through Next.js Route Handlers with server-side session validation

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Mobile[Mobile Browser]
        Desktop[Desktop Browser]
    end
    
    subgraph "Next.js Application - Vercel"
        Pages[App Router Pages<br/>Server Components]
        API[API Route Handlers<br/>/api/*]
        Middleware[Middleware<br/>Auth + i18n]
    end
    
    subgraph "Data Layer"
        Prisma[Prisma Client]
        DB[(PostgreSQL<br/>Multi-tenant)]
        Storage[Supabase Storage<br/>Images]
    end
    
    Mobile --> Middleware
    Desktop --> Middleware
    Middleware --> Pages
    Middleware --> API
    Pages --> Prisma
    API --> Prisma
    Prisma --> DB
    API --> Storage
    
    style Mobile fill:#e1f5ff
    style Desktop fill:#e1f5ff
    style DB fill:#fff4e1
    style Storage fill:#fff4e1
```

### Request Flow

1. **Page Load**: Browser → Middleware (session check) → Server Component (data fetch via Prisma) → Rendered HTML
2. **API Mutation**: Client Component → API Route Handler → Session validation → Prisma mutation → Response
3. **Image Upload**: Client → API Route Handler → Supabase Storage upload → URL stored in PostgreSQL

### Multi-Tenancy Architecture

Data isolation is enforced at three levels:

1. **Session Level**: User session includes organization_id
2. **Query Level**: Prisma queries automatically filter by organization_id using middleware
3. **Insert Level**: All new records automatically receive the user's organization_id

```typescript
// Prisma Middleware Pattern (conceptual)
prisma.$use(async (params, next) => {
  const session = await getSession();
  if (session) {
    // Inject organization filter
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = { 
        ...params.args.where, 
        organizationId: session.organizationId 
      };
    }
  }
  return next(params);
});
```

## Components and Interfaces

### Core Modules

#### 1. Authentication Module

**Responsibilities**:
- User login/logout
- Session management with encrypted cookies
- Password hashing and verification
- Role-based access control enforcement

**Key Functions**:
```typescript
// Server-side authentication utilities
async function login(email: string, password: string): Promise<Session | null>
async function logout(): Promise<void>
async function getSession(): Promise<Session | null>
async function requireAuth(role?: Role): Promise<Session>
```

**Session Structure**:
```typescript
interface Session {
  userId: string;
  organizationId: string;
  role: 'MANAGER' | 'STAFF';
  name: string;
  email: string;
}
```

#### 2. Multi-Tenant Data Access Layer

**Responsibilities**:
- Automatic organization filtering on all queries
- Automatic organization assignment on all inserts
- Data isolation enforcement

**Implementation**: Prisma middleware that intercepts all database operations

#### 3. Shift Management Module

**Responsibilities**:
- Shift CRUD operations
- Date range queries
- Manager-only access enforcement

**API Endpoints**:
- `POST /api/shifts` - Create shift (Manager only)
- `GET /api/shifts?startDate=X&endDate=Y` - List shifts
- `PATCH /api/shifts/[id]` - Update shift (Manager only)
- `DELETE /api/shifts/[id]` - Delete shift (Manager only)

#### 4. Leave Request Module

**Responsibilities**:
- Leave request creation
- Status management (PENDING → APPROVED/REJECTED)
- Manager approval workflow

**API Endpoints**:
- `POST /api/leave` - Create leave request (Staff)
- `GET /api/leave` - List leave requests
- `PATCH /api/leave/[id]` - Approve/Reject (Manager only)

#### 5. Time Tracking Module

**Responsibilities**:
- Clock in/out operations
- Session state management
- GPS coordinate capture

**API Endpoints**:
- `POST /api/clock/in` - Clock in with optional GPS
- `POST /api/clock/out` - Clock out with optional GPS
- `GET /api/clock/status` - Get current session status
- `GET /api/clock/entries` - List clock entries

**State Management**:
- Server maintains active session state in database
- Client polls `/api/clock/status` or uses optimistic updates

#### 6. Incident Reporting Module

**Responsibilities**:
- Incident creation with optional images
- Image upload to Supabase Storage
- Incident locking by managers

**API Endpoints**:
- `POST /api/incidents` - Create incident with optional image
- `GET /api/incidents` - List incidents
- `PATCH /api/incidents/[id]/lock` - Lock incident (Manager only)

**Image Upload Flow**:
1. Client selects image file
2. Client sends multipart/form-data to `/api/incidents`
3. Server uploads to Supabase Storage
4. Server stores returned URL in incident record

#### 7. Cleaning Task Module

**Responsibilities**:
- Task definition by managers
- Task completion logging by staff

**API Endpoints**:
- `POST /api/cleaning/tasks` - Create task (Manager only)
- `GET /api/cleaning/tasks` - List tasks with last completion
- `POST /api/cleaning/tasks/[id]/complete` - Log completion

#### 8. Dashboard Module

**Responsibilities**:
- Role-specific data aggregation
- Today's operations summary

**Pages**:
- `/dashboard/manager` - Manager dashboard (Server Component)
- `/dashboard/staff` - Staff dashboard (Server Component)

**Data Loading**: Server Components fetch all data server-side, no client-side loading states needed

#### 9. Internationalization Module

**Responsibilities**:
- Language switching (Danish/English)
- Translation management
- Locale persistence

**Implementation**:
- `next-intl` with middleware for locale detection
- Language preference stored in cookie
- Translation files: `messages/da.json`, `messages/en.json`

### Component Hierarchy

```
app/
├── [locale]/
│   ├── layout.tsx (Root layout with i18n provider)
│   ├── login/page.tsx (Login page - Client Component)
│   ├── dashboard/
│   │   ├── manager/page.tsx (Manager dashboard - Server Component)
│   │   └── staff/page.tsx (Staff dashboard - Server Component)
│   ├── shifts/page.tsx (Shift list/calendar - Server Component)
│   ├── leave/page.tsx (Leave request list - Server Component)
│   ├── incidents/
│   │   ├── page.tsx (Incident list - Server Component)
│   │   └── new/page.tsx (Create incident - Client Component for image)
│   ├── cleaning/page.tsx (Cleaning tasks - Server Component)
│   └── clock/page.tsx (Clock in/out - Client Component)
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── logout/route.ts
│   ├── shifts/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── leave/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── incidents/
│   │   ├── route.ts
│   │   └── [id]/lock/route.ts
│   ├── clock/
│   │   ├── in/route.ts
│   │   ├── out/route.ts
│   │   └── status/route.ts
│   └── cleaning/
│       ├── tasks/route.ts
│       └── tasks/[id]/complete/route.ts
└── middleware.ts (Auth + i18n)
```

## Data Models

### Prisma Schema

```prisma
// This is a conceptual schema showing the data model structure

model Organization {
  id             String          @id @default(cuid())
  name           String
  users          User[]
  shifts         Shift[]
  leaveRequests  LeaveRequest[]
  clockEntries   ClockEntry[]
  incidents      Incident[]
  cleaningTasks  CleaningTask[]
  cleaningLogs   CleaningLog[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

model User {
  id             String          @id @default(cuid())
  name           String
  email          String          @unique
  passwordHash   String
  role           Role
  organizationId String
  organization   Organization    @relation(fields: [organizationId], references: [id])
  shifts         Shift[]
  leaveRequests  LeaveRequest[]
  clockEntries   ClockEntry[]
  incidents      Incident[]
  cleaningLogs   CleaningLog[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  
  @@index([organizationId])
  @@index([email])
}

enum Role {
  MANAGER
  STAFF
}

model Shift {
  id             String       @id @default(cuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  date           DateTime     @db.Date
  startTime      DateTime     @db.Time
  endTime        DateTime     @db.Time
  notes          String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  @@index([organizationId])
  @@index([userId])
  @@index([date])
}

model LeaveRequest {
  id             String            @id @default(cuid())
  userId         String
  user           User              @relation(fields: [userId], references: [id])
  organizationId String
  organization   Organization      @relation(fields: [organizationId], references: [id])
  type           LeaveType
  status         LeaveStatus
  startDate      DateTime          @db.Date
  endDate        DateTime          @db.Date
  reason         String
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
  
  @@index([organizationId])
  @@index([userId])
  @@index([status])
}

enum LeaveType {
  SICK
  VACATION
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
}

model ClockEntry {
  id              String       @id @default(cuid())
  userId          String
  user            User         @relation(fields: [userId], references: [id])
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id])
  clockInTime     DateTime
  clockOutTime    DateTime?
  clockInLat      Float?
  clockInLng      Float?
  clockOutLat     Float?
  clockOutLng     Float?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  @@index([organizationId])
  @@index([userId])
  @@index([clockInTime])
}

model Incident {
  id             String        @id @default(cuid())
  userId         String
  user           User          @relation(fields: [userId], references: [id])
  organizationId String
  organization   Organization  @relation(fields: [organizationId], references: [id])
  title          String
  description    String        @db.Text
  severity       Severity
  status         IncidentStatus
  imageUrl       String?
  locked         Boolean       @default(false)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  
  @@index([organizationId])
  @@index([status])
  @@index([locked])
}

enum Severity {
  LOW
  MEDIUM
  HIGH
}

enum IncidentStatus {
  OPEN
  CLOSED
}

model CleaningTask {
  id             String        @id @default(cuid())
  organizationId String
  organization   Organization  @relation(fields: [organizationId], references: [id])
  title          String
  frequency      String
  logs           CleaningLog[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  
  @@index([organizationId])
}

model CleaningLog {
  id             String        @id @default(cuid())
  taskId         String
  task           CleaningTask  @relation(fields: [taskId], references: [id])
  userId         String
  user           User          @relation(fields: [userId], references: [id])
  organizationId String
  organization   Organization  @relation(fields: [organizationId], references: [id])
  completedAt    DateTime      @default(now())
  
  @@index([organizationId])
  @@index([taskId])
  @@index([completedAt])
}
```

### Data Model Relationships

```mermaid
erDiagram
    Organization ||--o{ User : contains
    Organization ||--o{ Shift : owns
    Organization ||--o{ LeaveRequest : owns
    Organization ||--o{ ClockEntry : owns
    Organization ||--o{ Incident : owns
    Organization ||--o{ CleaningTask : owns
    Organization ||--o{ CleaningLog : owns
    
    User ||--o{ Shift : assigned
    User ||--o{ LeaveRequest : submits
    User ||--o{ ClockEntry : creates
    User ||--o{ Incident : reports
    User ||--o{ CleaningLog : completes
    
    CleaningTask ||--o{ CleaningLog : has
    
    User {
        string id PK
        string email UK
        string name
        string passwordHash
        Role role
        string organizationId FK
    }
    
    Organization {
        string id PK
        string name
    }
    
    Shift {
        string id PK
        string userId FK
        string organizationId FK
        date date
        time startTime
        time endTime
        string notes
    }
    
    ClockEntry {
        string id PK
        string userId FK
        string organizationId FK
        datetime clockInTime
        datetime clockOutTime
        float clockInLat
        float clockInLng
    }
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*



### Property 1: Multi-tenant data isolation

*For any* user belonging to organization A and any records (shifts, leave requests, clock entries, incidents, cleaning tasks, cleaning logs) distributed across organizations A and B, when the user queries for records, the system SHALL return only records belonging to organization A.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 8.5**

### Property 2: Automatic organization assignment

*For any* authenticated user with organization ID O and any record type (shift, leave request, clock entry, incident, cleaning task, cleaning log), when the user creates a new record, the system SHALL automatically assign organization ID O to that record.

**Validates: Requirements 3.6**

### Property 3: Valid authentication creates session

*For any* valid email and password combination that matches a stored user record, when authentication is attempted, the system SHALL create a session containing the user's ID, organization ID, role, name, and email.

**Validates: Requirements 1.1**

### Property 4: Invalid authentication fails

*For any* email and password combination that does not match a stored user record, when authentication is attempted, the system SHALL reject the authentication and return an error.

**Validates: Requirements 1.2**

### Property 5: Logout terminates session

*For any* authenticated user with an active session, when logout is requested, the system SHALL terminate the session such that subsequent requests are unauthenticated.

**Validates: Requirements 1.3**

### Property 6: User role and organization uniqueness

*For any* user record, the system SHALL ensure the user has exactly one role (MANAGER or STAFF) and exactly one organization ID.

**Validates: Requirements 1.4, 1.5**

### Property 7: Manager authorization for restricted operations

*For any* user with role MANAGER and any operation in the set {create shift, edit shift, delete shift, approve leave request, reject leave request, lock incident}, the system SHALL allow the operation.

**Validates: Requirements 2.1, 2.3, 2.5**

### Property 8: Staff authorization denial for restricted operations

*For any* user with role STAFF and any operation in the set {create shift, edit shift, delete shift, approve leave request, reject leave request, lock incident}, the system SHALL deny the operation.

**Validates: Requirements 2.2, 2.4, 2.6**

### Property 9: Shift creation and storage

*For any* valid shift data containing user ID, date, start time, end time, and optional notes, when a manager creates the shift, the system SHALL store the shift record with all provided fields.

**Validates: Requirements 4.1, 4.2**

### Property 10: Shift update persistence

*For any* existing shift and any valid update to its fields (date, start time, end time, notes, assigned user), when a manager updates the shift, the system SHALL persist the new values.

**Validates: Requirements 4.4**

### Property 11: Shift deletion

*For any* existing shift, when a manager deletes the shift, the system SHALL remove the shift such that subsequent queries do not return it.

**Validates: Requirements 4.5**

### Property 12: Date range filtering

*For any* date range [startDate, endDate] and any set of shifts with various dates, when a user queries shifts for that date range, the system SHALL return only shifts where shift.date is within [startDate, endDate] inclusive.

**Validates: Requirements 4.6**

### Property 13: Leave request creation with pending status

*For any* valid leave request data containing type (SICK or VACATION), start date, end date, and reason, when a staff user creates the leave request, the system SHALL store it with status PENDING.

**Validates: Requirements 5.1**

### Property 14: Leave request approval transition

*For any* leave request with status PENDING, when a manager approves it, the system SHALL update the status to APPROVED.

**Validates: Requirements 5.2**

### Property 15: Leave request rejection transition

*For any* leave request with status PENDING, when a manager rejects it, the system SHALL update the status to REJECTED.

**Validates: Requirements 5.3**

### Property 16: Clock in creates entry

*For any* user and optional GPS coordinates (latitude, longitude), when the user clocks in, the system SHALL create a clock entry with clock-in timestamp and GPS coordinates (if provided).

**Validates: Requirements 6.1, 6.5**

### Property 17: Clock out updates entry

*For any* user with an active clock entry (clockOutTime is null) and optional GPS coordinates, when the user clocks out, the system SHALL update the clock entry with clock-out timestamp and GPS coordinates (if provided).

**Validates: Requirements 6.2**

### Property 18: Clock in succeeds without GPS

*For any* user, when the user clocks in without GPS coordinates, the system SHALL create a clock entry with null GPS fields.

**Validates: Requirements 6.6**

### Property 19: Incident creation with open and unlocked state

*For any* valid incident data containing title, description, severity (LOW, MEDIUM, or HIGH), and optional image URL, when a user creates the incident, the system SHALL store it with status OPEN and locked set to false.

**Validates: Requirements 7.1**

### Property 20: Incident locking by manager

*For any* incident with locked set to false, when a manager reviews and locks it, the system SHALL set the locked field to true.

**Validates: Requirements 7.4**

### Property 21: Locked incident immutability

*For any* incident with locked set to true, when any user attempts to modify the incident (title, description, severity, status), the system SHALL reject the modification.

**Validates: Requirements 7.5**

### Property 22: Cleaning task creation

*For any* valid cleaning task data containing title and frequency text, when a manager creates the task, the system SHALL store the cleaning task.

**Validates: Requirements 8.1**

### Property 23: Cleaning task completion logging

*For any* cleaning task and any staff user, when the staff user marks the task as completed, the system SHALL create a cleaning log entry with the current timestamp, user ID, and task ID.

**Validates: Requirements 8.2**

### Property 24: Language preference persistence

*For any* user who selects a language preference (Danish or English), when the user logs out and logs back in, the system SHALL display the UI in the previously selected language.

**Validates: Requirements 12.2, 12.4**

## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid credentials → 401 Unauthorized with error message
   - Missing session → 401 Unauthorized, redirect to login
   - Expired session → 401 Unauthorized, redirect to login

2. **Authorization Errors**
   - Insufficient permissions → 403 Forbidden with error message
   - Wrong role for operation → 403 Forbidden

3. **Validation Errors**
   - Missing required fields → 400 Bad Request with field-specific errors
   - Invalid enum values → 400 Bad Request
   - Invalid date ranges → 400 Bad Request (e.g., start date after end date)
   - Invalid time ranges → 400 Bad Request (e.g., start time after end time)

4. **Multi-Tenancy Violations**
   - Attempted access to another org's data → 404 Not Found (data doesn't exist from user's perspective)
   - This is enforced at the query level, so violations should be impossible

5. **Business Logic Errors**
   - Clock out without active session → 400 Bad Request
   - Clock in while already clocked in → 400 Bad Request
   - Modify locked incident → 400 Bad Request
   - Approve/reject non-pending leave request → 400 Bad Request

6. **External Service Errors**
   - Image upload to Supabase fails → 500 Internal Server Error, allow incident creation without image
   - Database connection failure → 500 Internal Server Error

7. **Not Found Errors**
   - Resource doesn't exist → 404 Not Found
   - Resource exists but belongs to different org → 404 Not Found

### Error Response Format

All API errors follow a consistent JSON structure:

```typescript
interface ErrorResponse {
  error: string;           // Human-readable error message
  code: string;            // Machine-readable error code (e.g., "INVALID_CREDENTIALS")
  field?: string;          // Optional: which field caused the error
  details?: string[];      // Optional: additional error details
}
```

### Error Handling Strategy

1. **API Route Handlers**: Use try-catch blocks with typed error handlers
2. **Client Components**: Display errors using toast notifications (shadcn/ui Toast)
3. **Server Components**: Show error boundaries for unexpected errors
4. **Validation**: Use Zod schemas for input validation before database operations
5. **Database Errors**: Catch Prisma errors and translate to user-friendly messages

## Testing Strategy

### Testing Approach

The AquaSense MVP requires a dual testing approach combining property-based testing for core business logic with integration tests for external services and UI rendering.

**Property-based testing is appropriate** for this system because:
- Core business logic involves pure functions (authentication, authorization, data filtering)
- Multi-tenancy isolation properties must hold universally across all users and data
- CRUD operations should work correctly for any valid input
- State transitions (leave approval, incident locking) should be consistent

**Property-based testing is NOT appropriate** for:
- Supabase Storage integration (external service)
- UI rendering and responsive layout
- Deployment configuration
- Performance characteristics

### Unit Tests

**Focus Areas**:
- Authentication utilities (password hashing, session creation/validation)
- Authorization logic (role checks before operations)
- Validation functions (date range validation, enum validation)
- Error handling and error response formatting
- Edge cases: empty strings, null values, boundary dates

**Testing Library**: Jest with @testing-library/react for component unit tests

**Example Unit Tests**:
- Clock in/out button disabled states
- Leave request form validation
- Incident severity display logic
- Date range picker constraints

### Property-Based Tests

**Library**: fast-check (TypeScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each property test references its design document property using comment tags

**Tag Format**:
```typescript
// Feature: aquasense-mvp, Property 1: Multi-tenant data isolation
test('queries return only same-org data', () => {
  fc.assert(fc.property(
    // generators and test implementation
  ), { numRuns: 100 });
});
```

**Property Test Implementation**:

1. **Property 1-2: Multi-tenancy** - Generate users with different org IDs and records across orgs, verify queries return only same-org data
2. **Property 3-6: Authentication** - Generate credentials and sessions, verify login/logout behavior
3. **Property 7-8: Authorization** - Generate users with different roles and operations, verify RBAC
4. **Property 9-12: Shifts** - Generate shift data, verify CRUD operations and date filtering
5. **Property 13-15: Leave requests** - Generate leave requests, verify state transitions
6. **Property 16-18: Clock entries** - Generate clock operations with/without GPS, verify creation/updates
7. **Property 19-21: Incidents** - Generate incidents, verify creation, locking, and immutability
8. **Property 22-23: Cleaning tasks** - Generate tasks and completions, verify logging
9. **Property 24: i18n** - Generate language preferences, verify persistence

**Generators** (using fast-check):
```typescript
// Example generators
const orgIdGen = fc.uuid();
const roleGen = fc.constantFrom('MANAGER', 'STAFF');
const userGen = fc.record({
  id: fc.uuid(),
  email: fc.emailAddress(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  role: roleGen,
  organizationId: orgIdGen,
});
const shiftGen = fc.record({
  userId: fc.uuid(),
  date: fc.date(),
  startTime: fc.date(),
  endTime: fc.date(),
  notes: fc.option(fc.string()),
});
// ... additional generators for each entity type
```

### Integration Tests

**Focus Areas**:
- Supabase Storage image upload/download
- Database migrations and schema validation
- Full API endpoint flows (request → response)
- Multi-step workflows (create shift → assign staff → view dashboard)

**Tools**:
- Vitest for test runner
- Supertest for API endpoint testing
- Test database with Prisma migrations

**Example Integration Tests**:
- Upload incident image to Supabase Storage
- Create shift as manager, verify staff sees it on dashboard
- Clock in → work → clock out flow
- Mobile responsive layout on various screen sizes (manual or Playwright)

### End-to-End Tests

**Scope**: Critical user journeys only (due to MVP scope)

**Tool**: Playwright

**Test Cases**:
1. Manager creates shift, staff clocks in/out
2. Staff submits leave request, manager approves
3. Staff reports incident with image
4. Staff completes cleaning task, manager views dashboard

### Test Database Strategy

- Use separate test database with same schema as production
- Reset database between test runs using Prisma migrations
- Seed with test organizations and users for integration tests
- Use transactions in property tests for isolation

### Performance Testing

**Out of scope for MVP** - focus on functional correctness first

Future performance validation:
- Lighthouse scores for mobile performance
- Load testing for multi-user scenarios
- Database query optimization

## Security Considerations

### Authentication Security

1. **Password Storage**: Use bcrypt with salt rounds ≥ 10 for password hashing
2. **Session Tokens**: Store in HTTP-only, Secure, SameSite=Strict cookies
3. **Session Expiration**: 24-hour session timeout with sliding window
4. **Password Requirements**: Minimum 8 characters (enforced client and server-side)

### Authorization Security

1. **Server-Side Validation**: All authorization checks happen server-side in API Route Handlers
2. **No Client-Side Role Checks**: UI role-based rendering is convenience only, not security boundary
3. **Organization ID Injection**: Organization ID comes from session, never from client request

### Multi-Tenancy Security

1. **Query-Level Isolation**: Prisma middleware enforces organization filtering on ALL queries
2. **No Direct ID Access**: Users cannot access resources by guessing IDs from other orgs
3. **404 vs 403**: Return 404 for cross-org access attempts (don't leak existence of other org's data)

### Input Validation

1. **Zod Schemas**: Validate all API inputs before database operations
2. **SQL Injection**: Prevented by Prisma parameterized queries
3. **XSS Prevention**: React automatically escapes rendered content
4. **File Upload Validation**: Check file type and size before Supabase upload

### API Security

1. **CORS**: Configure for same-origin only (Next.js default)
2. **Rate Limiting**: Add rate limiting middleware for production (not in MVP scope)
3. **HTTPS Only**: Enforced by Vercel deployment

### Data Privacy

1. **GDPR Considerations**: User data stored in EU-region database (future requirement)
2. **Audit Logging**: Not in MVP scope, but consider for production
3. **Data Retention**: Not defined in MVP scope

## Deployment and Infrastructure

### Deployment Target

- **Platform**: Vercel
- **Region**: Auto (Vercel edge network)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Environment Variables

Required environment variables (stored in Vercel project settings):

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Session Encryption
SESSION_SECRET="random-256-bit-secret"

# Environment
NODE_ENV="production"
```

### Database Setup

1. **Managed PostgreSQL**: Use Vercel Postgres or Supabase Postgres
2. **Connection Pooling**: Configure Prisma to use connection pooling for serverless
3. **Migrations**: Run `npx prisma migrate deploy` in Vercel build step

```json
// package.json build script
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### Supabase Storage Setup

1. **Bucket Configuration**: Create `incident-images` bucket
2. **Security Policy**: Allow authenticated users to upload, any user in same org to read
3. **File Size Limit**: 5MB max per image
4. **Allowed Formats**: JPEG, PNG, WebP

### Monitoring and Logging

**MVP Scope**:
- Vercel built-in monitoring for deployment health
- Console.error for server-side errors
- Next.js automatic error reporting

**Future Enhancements**:
- Sentry for error tracking
- Datadog for performance monitoring
- Audit log table for user actions

### CI/CD Pipeline

**Vercel Automatic Deployments**:
- Push to `main` branch → Production deployment
- Pull requests → Preview deployments
- Automatic rollback on deployment failure

**Pre-deployment Checks** (GitHub Actions):
```yaml
# .github/workflows/test.yml
- Run TypeScript type checking
- Run ESLint
- Run unit tests
- Run property-based tests
- Run integration tests
```

## Open Questions and Future Enhancements

### Open Questions for Product Owner

1. **Password Reset**: How should users reset forgotten passwords? (Email link, manager reset, etc.)
2. **User Onboarding**: How are new users and organizations created? (Self-service signup, admin panel, etc.)
3. **Shift Conflicts**: Should system prevent double-booking staff for same time slot?
4. **Leave Approval Workflow**: Should managers be notified immediately when leave is requested?
5. **Incident Escalation**: What happens to high-severity incidents? Notifications?
6. **Cleaning Task Scheduling**: Should system warn if tasks haven't been completed based on frequency?
7. **Data Export**: Do managers need to export reports (shifts, clock entries, etc.)?
8. **Mobile App**: Is a native mobile app planned, or web app only?

### Future Enhancement Opportunities

**Phase 2 Features**:
- Real-time notifications (WebSocket or Server-Sent Events)
- Calendar integration for shifts
- Staff availability management
- Advanced reporting and analytics
- Email notifications for leave requests and incidents
- Shift templates for recurring schedules
- Mobile app (React Native or PWA)

**Technical Improvements**:
- Add rate limiting middleware
- Implement Redis for session storage (better scalability)
- Add full-text search for incidents
- Optimize images with Next.js Image component
- Add audit logging for compliance
- Implement GDPR data export/deletion

**UX Enhancements**:
- Offline mode with service workers
- Push notifications
- Dark mode support
- Advanced filtering and sorting on all list views
- Bulk operations (create multiple shifts, etc.)
- Drag-and-drop calendar for shift planning

## Appendix: Technology Justifications

### Why Next.js App Router?

- Server Components reduce client-side JavaScript for better mobile performance
- Built-in API routes eliminate need for separate backend
- Automatic code splitting and optimization
- Excellent Vercel deployment integration

### Why Prisma ORM?

- Type-safe database queries (TypeScript integration)
- Migration system for schema evolution
- Middleware support for multi-tenancy filtering
- Good developer experience with schema definitions

### Why Supabase Storage?

- Simple integration with PostgreSQL database
- Built-in CDN for fast image delivery
- Row-level security policies for access control
- Generous free tier for MVP

### Why Session-Based Auth Instead of JWT?

- Simpler to implement correctly
- HTTP-only cookies prevent XSS token theft
- Easier session revocation (important for security)
- No token refresh complexity

### Why Tailwind CSS and shadcn/ui?

- Tailwind: Utility-first CSS for rapid development
- shadcn/ui: Accessible, customizable components
- Good mobile-first design patterns
- Consistent design system without heavy framework

### Why next-intl for i18n?

- Built for Next.js App Router
- Server-side translation support
- Type-safe translation keys
- Lightweight compared to alternatives

---

*End of Design Document*
