# AquaSense MVP

A mobile-first SaaS web application for digitizing swimming pool operations.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **UI**: React with shadcn/ui components, Tailwind CSS
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## Project Structure

```
AquaSense/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── lib/              # Utility functions and shared code
├── prisma/           # Database schema and migrations
├── .kiro/            # Kiro specifications and design docs
└── public/           # Static assets
```

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Requirements

- Node.js 18.x or higher
- PostgreSQL database
- Supabase account (for image storage)

## Environment Variables

AquaSense requires several environment variables for database connection, storage, and session management. These variables must be configured for both development and production environments.

### Required Variables

| Variable | Description | Required For | Example Value |
|----------|-------------|--------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma ORM | All environments | `postgresql://user:password@localhost:5432/aquasense` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for image storage | All environments | `https://abcdefghijklmnop.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key for client-side storage access | All environments | `eyJhbGc...` |
| `SESSION_SECRET` | Secret key for encrypting session cookies (minimum 32 characters) | All environments | Generate with: `openssl rand -base64 32` |

### Setup Instructions

#### 1. Local Development

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your actual values:

```env
# Database - local PostgreSQL instance
DATABASE_URL=postgresql://postgres:password@localhost:5432/aquasense

# Supabase - from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase

# Session Secret - generate a secure random string
SESSION_SECRET=your-generated-secret-key-here
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

#### 2. Database Setup

**For local development:**
1. Install PostgreSQL locally or use Docker:
   ```bash
   docker run --name aquasense-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```
2. Create the database:
   ```bash
   npx prisma migrate dev
   ```
3. Seed the database with sample data (optional):
   ```bash
   npx prisma db seed
   ```

**For production:**
- Use a managed PostgreSQL service:
  - **Vercel Postgres** (recommended for Vercel deployments)
  - **Supabase Postgres**
  - **Railway**
  - **Neon**
- Connection string format: `postgresql://username:password@host:port/database?sslmode=require`

### Database Seeding

The project includes a seed script to populate the development database with sample data. This is useful for testing and development purposes.

#### What Gets Seeded

The seed script creates:
- **2 Organizations**: AquaCenter Copenhagen and Aarhus Swimming Pool
- **5 Users**: 2 Managers and 3 Staff members across both organizations
- **6 Shifts**: Various shifts assigned to staff members
- **3 Leave Requests**: Examples of pending, approved, and rejected requests
- **4 Clock Entries**: Including an active clock-in session
- **4 Incidents**: Various severity levels (Low, Medium, High)
- **6 Cleaning Tasks**: Regular maintenance tasks
- **9 Cleaning Logs**: Completed task records

#### Running the Seed Script

**Prerequisites:**
- PostgreSQL database must be running and accessible
- Database migrations must be applied first

```bash
# 1. Ensure your database is running
# For Docker: docker run --name aquasense-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
# Or use your local PostgreSQL installation

# 2. Run migrations first (if not done already)
npx prisma migrate dev

# 3. Seed the database (choose one method)
npx prisma db seed
# OR
npm run db:seed
```

The seed script will:
1. Clear all existing data from the database
2. Create sample organizations, users, and related data
3. Display a summary of seeded data

#### Sample Login Credentials

All seeded users have the same password: `password123`

**Copenhagen Organization:**
- Manager: `lars@aquacenter.dk` / `password123`
- Staff: `emma@aquacenter.dk` / `password123`
- Staff: `mikkel@aquacenter.dk` / `password123`

**Aarhus Organization:**
- Manager: `sophie@aarhuspool.dk` / `password123`
- Staff: `thomas@aarhuspool.dk` / `password123`

#### Resetting the Database

To completely reset your development database and reseed:

```bash
# Reset database (drops all data and re-runs migrations)
npx prisma migrate reset

# This will automatically run the seed script after resetting
```

**Warning**: `npx prisma migrate reset` will delete all data in your database. Only use this in development environments.

#### Seed Script Location

The seed script is located at `prisma/seed.ts`. You can customize it to add more sample data or modify existing data for your development needs.

#### 3. Supabase Storage Setup

1. Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)
2. Get your credentials from **Settings > API**:
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create a storage bucket:
   - Go to **Storage** in Supabase dashboard
   - Create a new bucket named `incident-images`
   - Set bucket visibility to **Public** to allow incident image access
   - Configure bucket policies if needed for additional security

See `lib/README.md` for detailed storage configuration.

#### 4. Session Secret Generation

Generate a secure random secret for session encryption:

```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as your `SESSION_SECRET` value.

### Production Deployment (Vercel)

#### Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add each required variable:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `DATABASE_URL` | Your managed PostgreSQL connection string | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
   | `SESSION_SECRET` | Your generated secret (32+ chars) | Production, Preview, Development |

4. Click **Save** for each variable

#### Database Connection String for Production

For Vercel Postgres:
```bash
# Vercel will provide this automatically
DATABASE_URL=postgres://default:***@ep-***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require
```

For Supabase Postgres:
```bash
# Format with connection pooling for serverless:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

**Important**: Always use connection pooling for serverless environments like Vercel.

#### Vercel Deployment Checklist

- [ ] All environment variables configured in Vercel dashboard
- [ ] Database connection string uses connection pooling (`pgbouncer=true` or `-pooler` endpoint)
- [ ] Supabase storage bucket `incident-images` created and set to public
- [ ] Session secret is at least 32 characters and randomly generated
- [ ] Run database migrations: `npx prisma migrate deploy` (runs automatically in build)
- [ ] Test deployment with a preview branch before deploying to production

### Security Best Practices

1. **Never commit** `.env.local` or any file containing actual secrets to version control
2. **Rotate secrets** regularly, especially `SESSION_SECRET` if compromised
3. **Use different values** for development and production environments
4. **Limit access** to environment variables in your deployment platform
5. **Use HTTPS** for all production deployments (automatic with Vercel)
6. **Enable connection pooling** for PostgreSQL in serverless environments

### Troubleshooting

**Database connection errors:**
- Verify `DATABASE_URL` format is correct
- Check that PostgreSQL is running (local) or accessible (production)
- For Vercel: Ensure you're using the pooler endpoint for connection pooling

**Supabase storage errors:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that the `incident-images` bucket exists and is public
- Review bucket policies in Supabase dashboard

**Session errors:**
- Ensure `SESSION_SECRET` is at least 32 characters
- Verify the secret is the same across all application instances
- Check that cookies are enabled in the browser

## License

ISC
