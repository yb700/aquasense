# Task 15.4: Multi-Tenancy Isolation End-to-End Testing

## Overview

This task implements comprehensive end-to-end testing for multi-tenancy data isolation across the AquaSense application. The test suite validates that data from different organizations is completely isolated at the database level.

## Test File

**Location**: `__tests__/multi-tenancy-isolation.test.ts`

## What This Test Validates

The test suite validates all multi-tenancy requirements (3.1-3.6) by:

### Requirement 3.1: Shift Data Isolation
- ✅ Returns only shifts belonging to user's organization
- ✅ Prevents cross-organization shift access
- ✅ Filters shifts correctly by organizationId

### Requirement 3.2: Leave Request Data Isolation
- ✅ Returns only leave requests from user's organization
- ✅ Blocks access to leave requests from other organizations
- ✅ Validates organization-scoped queries

### Requirement 3.3: Clock Entry Data Isolation
- ✅ Returns only clock entries from user's organization
- ✅ Prevents retrieval of clock entries across organizations
- ✅ Ensures time tracking data isolation

### Requirement 3.4: Incident Data Isolation
- ✅ Returns only incidents from user's organization
- ✅ Blocks access to incidents from other organizations
- ✅ Validates incident isolation

### Requirement 3.5: Cleaning Task Data Isolation
- ✅ Returns only cleaning tasks from user's organization
- ✅ Returns only cleaning logs from user's organization
- ✅ Prevents cross-organization access to cleaning data

### Requirement 3.6: Automatic Organization Assignment
- ✅ Automatically assigns organizationId when creating shifts
- ✅ Automatically assigns organizationId when creating leave requests
- ✅ Automatically assigns organizationId when creating incidents
- ✅ Automatically assigns organizationId when creating cleaning tasks
- ✅ Validates that all new records get the correct organization ID

## Test Architecture

The test creates two independent organizations with complete test data:

### Organization A (TestOrg A - AquaCenter)
- 1 Manager, 1 Staff user
- 2 Shifts
- 1 Leave Request
- 1 Clock Entry
- 1 Incident
- 1 Cleaning Task
- 1 Cleaning Log

### Organization B (TestOrg B - PoolCenter)
- 1 Manager, 1 Staff user  
- 1 Shift
- 1 Leave Request
- 1 Clock Entry
- 1 Incident
- 1 Cleaning Task
- 1 Cleaning Log

## Test Scenarios

### Data Isolation Tests
1. **Query Isolation**: Verify queries filtered by organizationId return only that org's data
2. **Cross-Org Access Prevention**: Attempt to access records using wrong organizationId returns null
3. **Update Prevention**: Attempt to update records from another org with wrong filter updates nothing
4. **Delete Prevention**: Attempt to delete records from another org with wrong filter deletes nothing

### Complete Isolation Verification
- Fetch all data types for Organization A and verify no Organization B data is present
- Fetch all data types for Organization B and verify no Organization A data is present
- Verify independent data counts for each organization

## Prerequisites

Before running this test, you need:

1. **PostgreSQL Database**: A running PostgreSQL database instance
2. **Database Configuration**: Update `.env.local` with your actual database credentials:

```env
DATABASE_URL=postgresql://username:password@host:port/database_name
```

3. **Database Migrations**: Run Prisma migrations to set up the schema:

```bash
npx prisma migrate dev
```

## Running the Test

### Run the Specific Test
```bash
npm test -- __tests__/multi-tenancy-isolation.test.ts
```

### Run All Tests
```bash
npm test
```

### Run in Watch Mode
```bash
npm run test:watch
```

## Test Implementation Details

The test uses:
- **Vitest** as the test runner
- **Prisma Client** with PostgreSQL adapter for database operations
- **bcryptjs** for password hashing in test data
- **beforeAll** hook to set up test data
- **afterAll** hook to clean up test data

## Expected Behavior

All 29 test cases should pass, verifying:
- Complete data isolation between organizations
- Automatic organization ID assignment
- Prevention of cross-organization data access
- Correct filtering on all query operations
- Protection against cross-org updates and deletes

## Troubleshooting

### Database Connection Issues
If you see Prisma connection errors:
1. Verify your DATABASE_URL is correctly set in `.env.local`
2. Ensure your PostgreSQL database is running
3. Verify network connectivity to the database
4. Check that the database user has appropriate permissions

### Test Data Conflicts
If tests fail due to existing data:
- The test automatically cleans up its data in `afterAll`
- Test organizations are named uniquely: "TestOrg A - AquaCenter" and "TestOrg B - PoolCenter"
- If cleanup fails, manually delete these organizations from the database

### Permission Errors
Ensure your database user has permissions to:
- CREATE, READ, UPDATE, DELETE on all tables
- Create and manage test data

## Success Criteria

✅ All 29 test cases pass  
✅ No cross-organization data leakage detected  
✅ Automatic organization assignment works for all entity types  
✅ All query operations respect organization boundaries  
✅ Update and delete operations cannot affect other organizations' data  

## Related Requirements

- **Requirement 3.1-3.5**: Multi-tenant data isolation for all entity types
- **Requirement 3.6**: Automatic organization assignment on record creation
- **Design Document**: Multi-Tenancy Architecture section
