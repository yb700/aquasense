# Requirements Document

## Introduction

AquaSense is a simple MVP SaaS web application designed to digitize swimming pool operations for single swimming pools. The system replaces paper-based workflows with a mobile-first digital solution that handles shift planning, leave management, time tracking, incident reporting, and cleaning task management. The application supports multi-tenancy for multiple swimming pool organizations using a single shared database.

## Glossary

- **System**: The AquaSense web application
- **Manager**: A user with administrative privileges who can create shifts, approve leave requests, and review incidents
- **Staff**: A regular user who can clock in/out, request leave, report incidents, and complete cleaning tasks
- **Organization**: A swimming pool facility registered in the system (tenant)
- **Shift**: A scheduled work period with assigned staff, date, and time range
- **Leave_Request**: A staff member's request for time off (sick leave or vacation)
- **Clock_Entry**: A time tracking record containing clock-in and clock-out timestamps
- **Incident**: A safety or operational issue report with severity level and optional image
- **Cleaning_Task**: A recurring maintenance task defined by management
- **Cleaning_Log**: A record of a completed cleaning task with timestamp
- **Session**: An active clock-in period before clock-out
- **GPS_Coordinates**: Browser-provided latitude and longitude at clock-in/out time

## Requirements

### Requirement 1: User Authentication

**User Story:** As a staff member or manager, I want to securely log in to the system using email and password, so that I can access my organization's pool operations data.

#### Acceptance Criteria

1. WHEN a user submits valid email and password credentials, THE System SHALL authenticate the user and create a session
2. WHEN a user submits invalid credentials, THE System SHALL reject authentication and display an error message
3. WHEN an authenticated user requests logout, THE System SHALL terminate the session and redirect to the login page
4. THE System SHALL assign each user exactly one role (Manager or Staff)
5. THE System SHALL associate each user with exactly one organization

### Requirement 2: Role-Based Access Control

**User Story:** As a manager, I want staff members to have limited privileges, so that sensitive operations are protected.

#### Acceptance Criteria

1. WHEN a Manager accesses shift creation features, THE System SHALL allow the operation
2. WHEN a Staff user attempts to access shift creation features, THE System SHALL deny the operation
3. WHEN a Manager accesses leave request approval features, THE System SHALL allow the operation
4. WHEN a Staff user attempts to access leave request approval features, THE System SHALL deny the operation
5. WHEN a Manager accesses incident review features, THE System SHALL allow the operation
6. WHEN a Staff user attempts to lock incidents, THE System SHALL deny the operation

### Requirement 3: Multi-Tenant Data Isolation

**User Story:** As a swimming pool organization, I want my data to be isolated from other organizations, so that privacy and data integrity are maintained.

#### Acceptance Criteria

1. WHEN a user queries shifts, THE System SHALL return only shifts belonging to the user's organization
2. WHEN a user queries leave requests, THE System SHALL return only leave requests belonging to the user's organization
3. WHEN a user queries clock entries, THE System SHALL return only clock entries belonging to the user's organization
4. WHEN a user queries incidents, THE System SHALL return only incidents belonging to the user's organization
5. WHEN a user queries cleaning tasks, THE System SHALL return only cleaning tasks belonging to the user's organization
6. WHEN a user creates any record, THE System SHALL automatically assign the user's organization ID to that record

### Requirement 4: Shift Planning

**User Story:** As a manager, I want to create and manage staff shifts, so that I can plan pool operations efficiently.

#### Acceptance Criteria

1. WHEN a Manager creates a shift with staff member, date, start time, and end time, THE System SHALL store the shift record
2. WHEN a Manager creates a shift with optional notes, THE System SHALL store the notes with the shift
3. WHEN a user views shifts, THE System SHALL display shifts in a list or basic calendar format
4. WHEN a Manager edits a shift, THE System SHALL update the shift record with new values
5. WHEN a Manager deletes a shift, THE System SHALL remove the shift record from the database
6. WHEN a user queries shifts for a specific date range, THE System SHALL return shifts within that range for the user's organization

### Requirement 5: Leave Request Management

**User Story:** As a staff member, I want to request time off, so that I can notify management of my absence.

#### Acceptance Criteria

1. WHEN a Staff user creates a leave request with type, start date, end date, and reason, THE System SHALL store the request with status PENDING
2. WHEN a Manager approves a pending leave request, THE System SHALL update the status to APPROVED
3. WHEN a Manager rejects a pending leave request, THE System SHALL update the status to REJECTED
4. WHEN a user queries leave requests, THE System SHALL display the type (sick or vacation), date range, status, and reason
5. THE System SHALL support leave request types of SICK and VACATION
6. THE System SHALL support leave request statuses of PENDING, APPROVED, and REJECTED

### Requirement 6: Time Tracking with Clock In/Out

**User Story:** As a staff member, I want to clock in and out of my shifts, so that my work hours are accurately recorded.

#### Acceptance Criteria

1. WHEN a user clicks the Clock In button, THE System SHALL create a clock entry with current timestamp and optional GPS coordinates
2. WHEN a user with an active session clicks Clock Out, THE System SHALL update the clock entry with clock-out timestamp and optional GPS coordinates
3. WHEN a user has no active session, THE System SHALL display the Clock In button
4. WHEN a user has an active session, THE System SHALL display the Clock Out button and session start time
5. IF GPS coordinates are available from the browser, THE System SHALL store latitude and longitude with clock entries
6. WHEN GPS coordinates are unavailable, THE System SHALL create clock entries without location data

### Requirement 7: Incident Reporting

**User Story:** As a staff member, I want to report safety or operational incidents, so that management can address issues promptly.

#### Acceptance Criteria

1. WHEN a user creates an incident with title, description, and severity level, THE System SHALL store the incident with status OPEN and locked set to false
2. WHEN a user uploads an image with an incident, THE System SHALL store the image in Supabase Storage and save the URL with the incident
3. THE System SHALL support severity levels of LOW, MEDIUM, and HIGH
4. WHEN a Manager reviews an incident, THE System SHALL set the incident locked field to true
5. WHEN an incident is locked, THE System SHALL prevent modifications to the incident
6. WHEN a user queries incidents, THE System SHALL display title, description, severity, status, and image if present

### Requirement 8: Cleaning Task Management

**User Story:** As a manager, I want to define recurring cleaning tasks, so that staff can track maintenance activities.

#### Acceptance Criteria

1. WHEN a Manager creates a cleaning task with title and frequency, THE System SHALL store the cleaning task
2. WHEN a Staff user marks a cleaning task as completed, THE System SHALL create a cleaning log entry with the current timestamp
3. WHEN a user views cleaning tasks, THE System SHALL display the task title, frequency, and most recent completion timestamp if available
4. THE System SHALL store frequency as text without automated scheduling logic
5. WHEN a user queries cleaning logs, THE System SHALL return logs associated with the user's organization

### Requirement 9: Manager Dashboard

**User Story:** As a manager, I want to see an overview of today's operations, so that I can monitor and respond to important events.

#### Acceptance Criteria

1. WHEN a Manager accesses the dashboard, THE System SHALL display today's shifts for the manager's organization
2. WHEN a Manager accesses the dashboard, THE System SHALL display pending leave requests for the manager's organization
3. WHEN a Manager accesses the dashboard, THE System SHALL display open incidents for the manager's organization
4. WHEN a Manager accesses the dashboard, THE System SHALL display cleaning tasks for the manager's organization
5. THE System SHALL update dashboard data when the manager refreshes the page

### Requirement 10: Staff Dashboard

**User Story:** As a staff member, I want to see my assigned work and tasks, so that I know what I need to do.

#### Acceptance Criteria

1. WHEN a Staff user accesses the dashboard, THE System SHALL display the user's assigned shifts
2. WHEN a Staff user accesses the dashboard, THE System SHALL display the user's leave requests with current status
3. WHEN a Staff user accesses the dashboard, THE System SHALL display cleaning tasks for the user's organization
4. WHEN a Staff user accesses the dashboard, THE System SHALL display a clock in/out button with current session status
5. THE System SHALL update dashboard data when the staff user refreshes the page

### Requirement 11: Mobile-First User Interface

**User Story:** As a staff member using a mobile phone, I want a responsive interface with large touch targets, so that I can easily use the system while working at the pool.

#### Acceptance Criteria

1. WHEN a user accesses the system on a mobile device, THE System SHALL display a responsive layout optimized for small screens
2. WHEN a user interacts with buttons on a mobile device, THE System SHALL provide touch targets of at least 44x44 pixels
3. WHEN a user loads any page, THE System SHALL load within 3 seconds on a standard mobile connection
4. THE System SHALL use shadcn/ui components for consistent visual design
5. THE System SHALL prioritize essential information and minimize scrolling on mobile screens

### Requirement 12: Bilingual Support (Danish and English)

**User Story:** As a user in Denmark, I want to use the system in Danish or English, so that I can work in my preferred language.

#### Acceptance Criteria

1. THE System SHALL display user interface text in Danish by default
2. WHEN a user selects English as their language preference, THE System SHALL display user interface text in English
3. THE System SHALL translate labels, buttons, messages, and navigation elements based on selected language
4. THE System SHALL persist language preference across sessions
5. THE System SHALL support Danish and English language options

### Requirement 13: Data Persistence and Schema

**User Story:** As a system administrator, I want all application data to be stored in a PostgreSQL database using Prisma ORM, so that data is reliable and queryable.

#### Acceptance Criteria

1. THE System SHALL store user records with id, name, email, hashed password, role, and organization ID
2. THE System SHALL store organization records with id and name
3. THE System SHALL store shift records with id, user ID, organization ID, date, start time, end time, and optional notes
4. THE System SHALL store leave request records with id, user ID, organization ID, type, status, start date, end date, and reason
5. THE System SHALL store clock entry records with id, user ID, organization ID, clock-in timestamp, optional clock-out timestamp, and optional GPS coordinates
6. THE System SHALL store incident records with id, user ID, organization ID, title, description, severity, status, optional image URL, and locked boolean
7. THE System SHALL store cleaning task records with id, organization ID, title, and frequency text
8. THE System SHALL store cleaning log records with id, task ID, user ID, organization ID, and completion timestamp

### Requirement 14: Image Upload for Incidents

**User Story:** As a staff member, I want to attach photos to incident reports, so that I can provide visual evidence of issues.

#### Acceptance Criteria

1. WHEN a user uploads an image file with an incident, THE System SHALL upload the file to Supabase Storage
2. WHEN an image upload succeeds, THE System SHALL store the Supabase Storage URL with the incident record
3. WHEN an image upload fails, THE System SHALL display an error message and allow incident creation without the image
4. WHEN a user views an incident with an image, THE System SHALL display the image
5. THE System SHALL accept common image formats including JPEG, PNG, and WebP

### Requirement 15: API Route Architecture

**User Story:** As a developer, I want a simple API architecture using Next.js Route Handlers, so that the system is easy to maintain and deploy.

#### Acceptance Criteria

1. THE System SHALL implement authentication endpoints at /api/auth/*
2. THE System SHALL implement shift management endpoints at /api/shifts
3. THE System SHALL implement leave request endpoints at /api/leave
4. THE System SHALL implement incident endpoints at /api/incidents
5. THE System SHALL implement clock in/out endpoints at /api/clock
6. THE System SHALL implement cleaning task and log endpoints at /api/cleaning
7. THE System SHALL use Next.js App Router Route Handlers for all API endpoints

### Requirement 16: Deployment Architecture

**User Story:** As a product owner, I want the system deployed on Vercel with managed database and storage, so that infrastructure is simple and scalable.

#### Acceptance Criteria

1. THE System SHALL deploy the Next.js application to Vercel
2. THE System SHALL connect to a managed PostgreSQL database
3. THE System SHALL use Supabase Storage for image file storage
4. THE System SHALL serve both frontend pages and API routes from the same Vercel deployment
5. THE System SHALL use environment variables for database connection strings and Supabase credentials
