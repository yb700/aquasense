# prisma/

This directory contains the Prisma schema and database migrations.

## Purpose

- Define the PostgreSQL database schema
- Manage database migrations
- Configure Prisma client
- Store seed data scripts

## Structure

```
prisma/
├── schema.prisma   # Database schema definition
├── migrations/     # Migration files (generated)
└── seed.ts         # Database seeding script (optional)
```

## Database Schema

The schema will include the following models:
- Organization (multi-tenant container)
- User (staff and managers)
- Shift (work schedules)
- LeaveRequest (time-off requests)
- ClockEntry (time tracking)
- Incident (safety/operational reports)
- CleaningTask (maintenance tasks)
- CleaningLog (task completion records)

## Usage

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```
