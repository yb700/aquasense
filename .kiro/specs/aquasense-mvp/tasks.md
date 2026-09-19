# Implementation Plan: AquaSense MVP

## Overview

This implementation plan creates a mobile-first SaaS application for swimming pool operations using Next.js 14 with TypeScript, PostgreSQL with Prisma ORM, and Supabase Storage. The architecture follows a server-first approach with React Server Components, session-based authentication, and multi-tenant data isolation. Tasks are organized to build foundational infrastructure first, then layer in features incrementally, with property-based tests validating universal correctness properties from the design document.

## Tasks

- [ ] 1. Set up project structure and core infrastructure
  - [x] 1.1 Initialize Next.js 14 project with TypeScript and App Router
    - Create Next.js project using `create-next-app` with TypeScript
    - Configure `tsconfig.json` for strict type checking
    - Set up project directory structure: `app/`, `lib/`, `components/`, `prisma/`
    - Install core dependencies: `next`, `react`, `react-dom`, `typescript`
    - _Requirements: 15.7, 16.1_

  - [x] 1.2 Set up PostgreSQL database and Prisma ORM
    - Install Prisma and PostgreSQL client: `@prisma/client`, `prisma`
    - Initialize Prisma schema with multi-tenant data model (Organization, User, Shift, LeaveRequest, ClockEntry, Incident, CleaningTask, CleaningLog)
    - Configure Prisma enums: Role (MANAGER, STAFF), LeaveType (SICK, VACATION), LeaveStatus (PENDING, APPROVED, REJECTED), Severity (LOW, MEDIUM, HIGH), IncidentStatus (OPEN, CLOSED)
    - Add indexes for organization filtering and common queries
    - Create initial migration
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

  - [x] 1.3 Configure Supabase Storage integration
    - Install Supabase client: `@supabase/supabase-js`
    - Create storage configuration utility in `lib/storage.ts`
    - Set up environment variables for Supabase URL and API key
    - _Requirements: 14.1, 16.3_

  - [x] 1.4 Set up UI component library and styling
    - Install shadcn/ui CLI and initialize
    - Install Tailwind CSS dependencies
    - Configure Tailwind for mobile-first design with 44px minimum touch targets
    - Install shadcn/ui components: Button, Input, Form, Toast, Card, Select, Calendar
    - _Requirements: 11.1, 11.2, 11.4_

  - [x] 1.5 Set up internationalization with next-intl
    - Install `next-intl` package
    - Create translation files: `messages/da.json` and `messages/en.json`
    - Configure next-intl provider in root layout
    - Create language switcher component
    - _Requirements: 12.1, 12.2, 12.3, 12.5_

- [x] 2. Implement authentication and session management
  - [x] 2.1 Create authentication utilities and password hashing
    - Install bcrypt: `bcryptjs` and `@types/bcryptjs`
    - Create `lib/auth.ts` with functions: `hashPassword()`, `verifyPassword()`
    - Create session type definition matching design Session interface
    - _Requirements: 1.1_

  - [x] 2.2 Implement session management with encrypted cookies
    - Install `iron-session` for encrypted cookie sessions
    - Create `lib/session.ts` with functions: `createSession()`, `getSession()`, `destroySession()`
    - Configure session options: 24-hour timeout, HTTP-only, Secure, SameSite=Strict
    - _Requirements: 1.1, 1.3_

  - [x] 2.3 Create login API endpoint
    - Create `app/api/auth/login/route.ts`
    - Implement POST handler: validate credentials, verify password, create session
    - Return error responses for invalid credentials (401)
    - _Requirements: 1.1, 1.2, 15.1_

  - [x] 2.4 Create logout API endpoint
    - Create `app/api/auth/logout/route.ts`
    - Implement POST handler: destroy session, clear cookie
    - _Requirements: 1.3, 15.1_

  - [x] 2.5 Create login page UI
    - Create `app/[locale]/login/page.tsx` as Client Component
    - Build form with email and password inputs using shadcn/ui Form
    - Handle form submission with error display using Toast
    - Add bilingual support for form labels and error messages
    - _Requirements: 1.1, 1.2, 11.1, 12.3_

  - [ ]* 2.6 Write property tests for authentication
    - **Property 3: Valid authentication creates session**
    - **Property 4: Invalid authentication fails**
    - **Property 5: Logout terminates session**
    - Install `fast-check` and `@types/jest`
    - Create `__tests__/auth.property.test.ts`
    - Generate test users with valid/invalid credentials
    - Validate session creation, rejection, and termination behavior
    - Run minimum 100 iterations per property
    - Tag tests with feature name and property numbers
    - _Validates: Requirements 1.1, 1.2, 1.3_

- [x] 3. Implement multi-tenant data isolation
  - [x] 3.1 Create Prisma middleware for organization filtering
    - Create `lib/prisma-middleware.ts`
    - Implement middleware to inject `organizationId` filter on all `findMany`, `findFirst`, `findUnique` operations
    - Implement middleware to auto-assign `organizationId` on all `create` operations
    - Apply middleware to global Prisma client instance
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.2 Create authorization utility functions
    - Create `lib/authorization.ts`
    - Implement `requireAuth(role?: Role)` function that extracts session and validates role
    - Return 401 for missing session, 403 for insufficient role
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 3.3 Write property tests for multi-tenancy and authorization
    - **Property 1: Multi-tenant data isolation**
    - **Property 2: Automatic organization assignment**
    - **Property 6: User role and organization uniqueness**
    - **Property 7: Manager authorization for restricted operations**
    - **Property 8: Staff authorization denial for restricted operations**
    - Create `__tests__/multi-tenancy.property.test.ts`
    - Generate users with different organization IDs and roles
    - Generate records across multiple organizations
    - Validate query filtering returns only same-org data
    - Validate auto-assignment of organization ID on create
    - Validate role-based operation permissions
    - _Validates: Requirements 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 4. Implement shift management
  - [x] 4.1 Create shift API endpoints
    - Create `app/api/shifts/route.ts` for GET (list) and POST (create)
    - Implement GET handler: extract session, query shifts with date range filtering, return JSON
    - Implement POST handler: validate Manager role, validate input (date, times, userId, notes), create shift, return JSON
    - Create `app/api/shifts/[id]/route.ts` for PATCH (update) and DELETE (delete)
    - Implement PATCH handler: validate Manager role, update shift fields
    - Implement DELETE handler: validate Manager role, delete shift
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6, 15.2_

  - [x] 4.2 Create shift management UI page
    - Create `app/[locale]/shifts/page.tsx` as Server Component
    - Fetch shifts for date range server-side using Prisma
    - Display shifts in calendar/list view using shadcn/ui Card components
    - Add client-side form for creating/editing shifts (Manager only)
    - Implement form with date picker, time inputs, staff selector, notes textarea
    - Add bilingual labels and validation messages
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 11.1, 12.3_

  - [ ]* 4.3 Write property tests for shift management
    - **Property 9: Shift creation and storage**
    - **Property 10: Shift update persistence**
    - **Property 11: Shift deletion**
    - **Property 12: Date range filtering**
    - Create `__tests__/shifts.property.test.ts`
    - Generate shift data with various dates, times, and optional fields
    - Validate CRUD operations and date range queries
    - _Validates: Requirements 4.1, 4.2, 4.4, 4.5, 4.6_

- [x] 5. Implement leave request management
  - [x] 5.1 Create leave request API endpoints
    - Create `app/api/leave/route.ts` for GET (list) and POST (create)
    - Implement GET handler: extract session, query leave requests, return JSON
    - Implement POST handler: validate input (type, dates, reason), create leave request with status PENDING
    - Create `app/api/leave/[id]/route.ts` for PATCH (approve/reject)
    - Implement PATCH handler: validate Manager role, update status to APPROVED or REJECTED
    - Prevent status changes on non-PENDING requests
    - _Requirements: 5.1, 5.2, 5.3, 15.3_

  - [x] 5.2 Create leave request UI page
    - Create `app/[locale]/leave/page.tsx` as Server Component
    - Fetch leave requests server-side using Prisma
    - Display leave requests with type, date range, status, and reason using shadcn/ui Cards
    - Add client-side form for creating leave requests (Staff and Manager)
    - Add approve/reject buttons for Manager role
    - Add bilingual labels for leave types and statuses
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 11.1, 12.3_

  - [ ]* 5.3 Write property tests for leave requests
    - **Property 13: Leave request creation with pending status**
    - **Property 14: Leave request approval transition**
    - **Property 15: Leave request rejection transition**
    - Create `__tests__/leave.property.test.ts`
    - Generate leave request data with various types, dates, and reasons
    - Validate state transitions from PENDING to APPROVED/REJECTED
    - _Validates: Requirements 5.1, 5.2, 5.3_

- [~] 6. Checkpoint - Ensure core features pass tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement time tracking with clock in/out
  - [~] 7.1 Create clock API endpoints
    - Create `app/api/clock/in/route.ts` for clock in
    - Implement POST handler: extract session, create clock entry with current timestamp and optional GPS coordinates
    - Prevent clock in if user already has active session (clockOutTime is null)
    - Create `app/api/clock/out/route.ts` for clock out
    - Implement POST handler: extract session, update active clock entry with clock-out timestamp and optional GPS
    - Return error if no active session exists
    - Create `app/api/clock/status/route.ts` for current session status
    - Implement GET handler: return active session or null
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 15.5_

  - [~] 7.2 Create clock in/out UI page
    - Create `app/[locale]/clock/page.tsx` as Client Component (needs geolocation API)
    - Request browser geolocation permission on mount
    - Display Clock In button when no active session, Clock Out button when session active
    - Show session start time when active
    - Implement optimistic UI updates for immediate feedback
    - Add bilingual button labels and status messages
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 11.1, 11.2, 12.3_

  - [ ]* 7.3 Write property tests for time tracking
    - **Property 16: Clock in creates entry**
    - **Property 17: Clock out updates entry**
    - **Property 18: Clock in succeeds without GPS**
    - Create `__tests__/clock.property.test.ts`
    - Generate clock operations with and without GPS coordinates
    - Validate clock entry creation and updates
    - Validate GPS optional behavior
    - _Validates: Requirements 6.1, 6.2, 6.5, 6.6_

- [x] 8. Implement incident reporting with image upload
  - [x] 8.1 Create incident API endpoints
    - Create `app/api/incidents/route.ts` for GET (list) and POST (create)
    - Implement GET handler: extract session, query incidents, return JSON
    - Implement POST handler: validate input (title, description, severity), handle optional image upload to Supabase Storage, create incident with status OPEN and locked false
    - Store Supabase Storage URL in incident record if image uploaded
    - Allow incident creation even if image upload fails
    - Create `app/api/incidents/[id]/lock/route.ts` for locking
    - Implement PATCH handler: validate Manager role, set locked to true
    - Prevent modifications to locked incidents in update handlers
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 14.1, 14.2, 14.3, 15.4_

  - [x] 8.2 Create incident reporting UI pages
    - Create `app/[locale]/incidents/page.tsx` as Server Component
    - Fetch incidents server-side, display with title, description, severity, status, and image
    - Add lock button for Manager role
    - Create `app/[locale]/incidents/new/page.tsx` as Client Component (needs file input)
    - Build form with title, description, severity dropdown, and image upload input
    - Handle multipart/form-data submission to API
    - Display error if image upload fails but allow incident creation
    - Add bilingual labels for severity levels
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 11.1, 12.3, 14.4, 14.5_

  - [ ]* 8.3 Write property tests for incident reporting
    - **Property 19: Incident creation with open and unlocked state**
    - **Property 20: Incident locking by manager**
    - **Property 21: Locked incident immutability**
    - Create `__tests__/incidents.property.test.ts`
    - Generate incident data with various severities and optional image URLs
    - Validate incident creation with correct initial state
    - Validate locking behavior and immutability enforcement
    - _Validates: Requirements 7.1, 7.4, 7.5_

- [x] 9. Implement cleaning task management
  - [x] 9.1 Create cleaning task API endpoints
    - Create `app/api/cleaning/tasks/route.ts` for GET (list) and POST (create)
    - Implement GET handler: query tasks with most recent completion log (use Prisma join)
    - Implement POST handler: validate Manager role, create cleaning task with title and frequency
    - Create `app/api/cleaning/tasks/[id]/complete/route.ts` for completion logging
    - Implement POST handler: create cleaning log entry with current timestamp, user ID, and task ID
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 15.6_

  - [x] 9.2 Create cleaning task UI page
    - Create `app/[locale]/cleaning/page.tsx` as Server Component
    - Fetch cleaning tasks with last completion timestamp server-side
    - Display tasks in list with title, frequency, and last completed time
    - Add "Mark Complete" button for Staff and Manager
    - Add task creation form for Manager role
    - Add bilingual labels for frequency and completion status
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 11.1, 12.3_

  - [ ]* 9.3 Write property tests for cleaning tasks
    - **Property 22: Cleaning task creation**
    - **Property 23: Cleaning task completion logging**
    - Create `__tests__/cleaning.property.test.ts`
    - Generate cleaning task data with various titles and frequencies
    - Validate task creation and completion log generation
    - _Validates: Requirements 8.1, 8.2_

- [x] 10. Implement role-specific dashboards
  - [x] 10.1 Create Manager dashboard
    - Create `app/[locale]/dashboard/manager/page.tsx` as Server Component
    - Fetch today's shifts for organization using Prisma date filtering
    - Fetch pending leave requests using status filter
    - Fetch open incidents using status filter
    - Fetch cleaning tasks for organization
    - Display data using shadcn/ui Card components in grid layout
    - Add bilingual section headers and labels
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 11.1, 12.3_

  - [x] 10.2 Create Staff dashboard
    - Create `app/[locale]/dashboard/staff/page.tsx` as Server Component
    - Fetch user's assigned shifts using userId filter
    - Fetch user's leave requests using userId filter
    - Fetch cleaning tasks for organization
    - Fetch user's current clock session status
    - Display clock in/out button with session status
    - Add bilingual section headers and labels
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.1, 12.3_

- [x] 11. Implement authentication middleware and routing
  - [x] 11.1 Create Next.js middleware for authentication and i18n
    - Create `middleware.ts` in project root
    - Implement session validation on all routes except `/login` and `/api/auth/login`
    - Redirect unauthenticated users to `/login`
    - Implement locale detection and routing for next-intl
    - Set response headers for security (Secure, SameSite)
    - _Requirements: 1.1, 1.3, 12.4_

  - [x] 11.2 Create root layout with i18n provider
    - Create `app/[locale]/layout.tsx`
    - Wrap children with NextIntlClientProvider
    - Include language switcher in navigation
    - Set up mobile-responsive navigation header
    - Add logout button with API call to `/api/auth/logout`
    - _Requirements: 11.1, 12.3, 12.4_

  - [ ]* 11.3 Write property test for language preference persistence
    - **Property 24: Language preference persistence**
    - Create `__tests__/i18n.property.test.ts`
    - Generate language preferences (Danish, English)
    - Validate cookie persistence across logout/login cycles
    - _Validates: Requirements 12.2, 12.4_

- [~] 12. Checkpoint - Ensure all features integrated
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Set up error handling and validation
  - [~] 13.1 Create global error response utilities
    - Create `lib/errors.ts` with ErrorResponse type and formatting functions
    - Implement error code constants (INVALID_CREDENTIALS, UNAUTHORIZED, FORBIDDEN, etc.)
    - Create helper functions for common HTTP error responses (401, 403, 400, 404, 500)
    - _Requirements: 1.2, 2.2, 2.4, 2.6_

  - [~] 13.2 Add Zod validation schemas for all API endpoints
    - Install `zod` package
    - Create `lib/validation.ts` with schemas for shifts, leave requests, clock entries, incidents, cleaning tasks
    - Apply validation in API route handlers before database operations
    - Return 400 Bad Request with field-specific errors on validation failure
    - _Requirements: 4.1, 5.1, 6.1, 7.1, 8.1_

  - [~] 13.3 Add error boundaries and toast notifications
    - Create error boundary component for unexpected errors
    - Configure Toast component for displaying API errors
    - Add error handling in all Client Components that call APIs
    - Display user-friendly error messages translated to selected language
    - _Requirements: 1.2, 11.1, 12.3_

- [x] 14. Configure deployment and environment variables
  - [x] 14.1 Set up environment variable configuration
    - Create `.env.example` with required variables: DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, SESSION_SECRET
    - Document environment variable requirements in README
    - Configure Vercel environment variables for production
    - _Requirements: 16.2, 16.3, 16.5_

  - [x] 14.2 Create seed script for development database
    - Create `prisma/seed.ts` with sample organizations, users (Manager and Staff), shifts, leave requests, incidents, cleaning tasks
    - Configure `package.json` with prisma seed command
    - Document seeding process in README
    - _Requirements: 13.1, 13.2_

  - [x] 14.3 Configure Vercel deployment settings
    - Create `vercel.json` with build configuration
    - Set build command to `npm run build`
    - Set output directory to `.next`
    - Configure environment variables in Vercel dashboard
    - Test deployment to Vercel preview environment
    - _Requirements: 16.1, 16.4_

- [x] 15. Final testing and polish
  - [ ]* 15.1 Run all property-based tests
    - Execute full property test suite with minimum 100 iterations
    - Verify all 24 correctness properties pass
    - Document any test failures and fix underlying issues
    - _Validates: All requirements_

  - [x] 15.2 Test mobile responsive behavior on multiple devices
    - Test on mobile viewport (320px, 375px, 414px widths)
    - Verify touch targets meet 44x44 pixel minimum
    - Test on real mobile devices if available
    - Validate page load times under 3 seconds
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 15.3 Test bilingual functionality end-to-end
    - Switch language preference and verify all UI text updates
    - Test persistence across logout/login cycles
    - Verify both Danish and English translations are complete
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 15.4 Test multi-tenancy isolation end-to-end
    - Create multiple organizations with test data
    - Log in as users from different organizations
    - Verify complete data isolation across all features
    - Attempt cross-org access and verify 404 responses
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [~] 16. Final checkpoint - Deployment ready
  - Ensure all tests pass, ask the user if questions arise.
  - Verify deployment to Vercel succeeds
  - Confirm all environment variables configured
  - Test production deployment with real PostgreSQL and Supabase Storage

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The implementation follows Next.js 14 best practices with Server Components for data fetching and Client Components only when necessary (forms, geolocation, file uploads)
- Property tests validate the 24 universal correctness properties defined in the design document
- Multi-tenancy isolation is enforced at the Prisma middleware level, making cross-org access impossible
- Session-based authentication simplifies security compared to JWT approaches
- The task order ensures foundational infrastructure is built first, then features layer on top incrementally
- Checkpoints ensure validation at critical integration points

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2"] },
    { "id": 4, "tasks": ["2.3", "2.4"] },
    { "id": 5, "tasks": ["2.5", "2.6", "3.1"] },
    { "id": 6, "tasks": ["3.2"] },
    { "id": 7, "tasks": ["3.3", "4.1", "5.1", "7.1", "8.1", "9.1"] },
    { "id": 8, "tasks": ["4.2", "5.2", "7.2", "8.2", "9.2"] },
    { "id": 9, "tasks": ["4.3", "5.3", "7.3", "8.3", "9.3", "10.1", "10.2"] },
    { "id": 10, "tasks": ["11.1"] },
    { "id": 11, "tasks": ["11.2", "11.3", "13.1"] },
    { "id": 12, "tasks": ["13.2", "13.3"] },
    { "id": 13, "tasks": ["14.1", "14.2"] },
    { "id": 14, "tasks": ["14.3"] },
    { "id": 15, "tasks": ["15.1", "15.2", "15.3", "15.4"] }
  ]
}
```
