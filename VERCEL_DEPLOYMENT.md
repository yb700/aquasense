# Vercel Deployment Guide

This guide covers deploying AquaSense MVP to Vercel with proper environment configuration, database setup, and production best practices.

## Prerequisites

- Vercel account ([sign up at vercel.com](https://vercel.com))
- GitHub/GitLab/Bitbucket repository with AquaSense code
- Managed PostgreSQL database (Vercel Postgres, Supabase, Railway, or Neon)
- Supabase project with Storage configured

## Quick Start

### 1. Connect Repository to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your AquaSense repository
4. Vercel will auto-detect Next.js configuration

### 2. Configure Build Settings

Vercel should auto-detect these settings, but verify:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |
| Development Command | `npm run dev` |

### 3. Configure Environment Variables

**Critical**: Configure all environment variables **before** the first deployment.

Go to **Project Settings > Environment Variables** and add:

#### Required Variables

```bash
# Database Connection
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Session Security
SESSION_SECRET=your-32-plus-character-random-secret
```

#### Environment Scope

For each variable, select the appropriate environments:

- ✅ **Production**: Main production environment (main/master branch)
- ✅ **Preview**: Preview deployments (pull requests and branches)
- ✅ **Development**: Local development (optional, use `.env.local` instead)

### 4. Database Setup Options

#### Option A: Vercel Postgres (Recommended)

Vercel Postgres integrates seamlessly with Vercel deployments:

1. Go to **Storage** tab in your Vercel project
2. Click **"Create Database"** → **Postgres**
3. Vercel automatically sets `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.
4. Use `POSTGRES_PRISMA_URL` for your `DATABASE_URL`:
   ```bash
   DATABASE_URL=${POSTGRES_PRISMA_URL}
   ```

**Connection Pooling**: Vercel Postgres includes Prisma-compatible connection pooling automatically.

#### Option B: Supabase Postgres

1. Create a Supabase project at [app.supabase.com](https://app.supabase.com)
2. Go to **Settings > Database**
3. Copy the **Connection pooling** connection string (uses port 6543)
4. Add to Vercel environment variables:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
   ```

**Important**: Use the pooling connection string (port 6543), not the direct connection (port 5432).

#### Option C: Railway

1. Create a PostgreSQL database in [Railway](https://railway.app)
2. Copy the **Postgres Connection URL**
3. Add to Vercel with `?sslmode=require` appended:
   ```bash
   DATABASE_URL=postgresql://postgres:...@containers-us-west-xxx.railway.app:5432/railway?sslmode=require
   ```

#### Option D: Neon

1. Create a project at [Neon](https://neon.tech)
2. Copy the connection string (includes connection pooling by default)
3. Add to Vercel environment variables:
   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 5. Run Database Migrations

After deploying, run Prisma migrations to set up the database schema:

**Option A: Automatic (via build command)**

Prisma migrations run automatically during the Vercel build if you have a `postinstall` script in `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma migrate deploy && next build"
  }
}
```

**Option B: Manual (via Vercel CLI)**

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

### 6. Deploy

Click **"Deploy"** in Vercel dashboard or push to your repository:

```bash
git push origin main
```

Vercel will automatically:
1. Install dependencies
2. Generate Prisma client
3. Run migrations (if configured)
4. Build the Next.js application
5. Deploy to production

## Environment Variable Reference

### Complete Environment Variables Table

| Variable | Type | Description | Example | Required |
|----------|------|-------------|---------|----------|
| `DATABASE_URL` | Secret | PostgreSQL connection string with connection pooling | `postgresql://user:pass@host:5432/db?pgbouncer=true` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL | `https://abcdefgh.supabase.co` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key (safe for client-side) | `eyJhbGciOiJIUzI1NiIs...` | ✅ Yes |
| `SESSION_SECRET` | Secret | Random string for session cookie encryption (32+ chars) | Generated via `openssl rand -base64 32` | ✅ Yes |

### Variable Security

- **Secret Variables**: Not exposed to client-side code, only available in API routes and server components
- **Public Variables** (`NEXT_PUBLIC_*`): Embedded in client-side JavaScript bundles, visible to users

### Generating Secure Secrets

For `SESSION_SECRET`, generate a cryptographically secure random string:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Important**: Use a different `SESSION_SECRET` for production vs. preview/development environments.

## Post-Deployment Checklist

After your first successful deployment:

- [ ] Verify environment variables are set correctly in Vercel dashboard
- [ ] Check deployment logs for any errors or warnings
- [ ] Test database connection by accessing the application
- [ ] Verify Supabase Storage is working by creating a test incident with an image
- [ ] Test authentication (login/logout)
- [ ] Test role-based access (manager vs. staff features)
- [ ] Verify multi-tenancy isolation (data from one org doesn't leak to another)
- [ ] Test mobile responsiveness on actual devices
- [ ] Enable Vercel Web Analytics (optional but recommended)
- [ ] Set up custom domain (optional)

## Continuous Deployment

Vercel automatically deploys:

- **Production**: Commits to `main` or `master` branch
- **Preview**: Commits to other branches and pull requests
- **Automatic Rollback**: If a deployment fails, Vercel keeps the previous version live

### Branch Configuration

Configure which branch triggers production deployments:

1. Go to **Project Settings > Git**
2. Set **Production Branch** (default: `main`)
3. Preview deployments are created for all other branches

### Deployment Protection

Enable deployment protection for production:

1. Go to **Project Settings > Deployment Protection**
2. Enable **Vercel Authentication** or **Password Protection**
3. Restrict access to production previews (optional)

## Monitoring and Debugging

### View Deployment Logs

1. Go to **Deployments** tab in Vercel dashboard
2. Click on a deployment
3. View **Build Logs** and **Function Logs**

### Common Issues

#### "Prisma Client not found"

**Solution**: Ensure `prisma generate` runs during build:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

#### "Database connection timeout"

**Solution**: Verify connection pooling is enabled. For Prisma with serverless:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["jsonProtocol"]
}
```

#### "Session secret not set"

**Solution**: Verify `SESSION_SECRET` is configured in Vercel environment variables and redeploy.

#### "Supabase Storage 401 Unauthorized"

**Solution**: 
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Verify the `incident-images` bucket exists and has public access
- Review bucket policies in Supabase dashboard

### Enable Logging

Add runtime logging for debugging:

```typescript
// Add to API routes for debugging
console.log('Environment check:', {
  hasDatabase: !!process.env.DATABASE_URL,
  hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasSession: !!process.env.SESSION_SECRET
});
```

View logs in **Deployments > Function Logs**.

## Performance Optimization

### Database Connection Pooling

**Critical for serverless**: Always use connection pooling to avoid exhausting database connections.

**Prisma Configuration**:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Edge Runtime Considerations

AquaSense uses Node.js runtime (not Edge) for database and session management. Verify:

```typescript
// API routes should NOT have:
export const runtime = 'edge'; // DON'T use for routes with Prisma

// Use default Node.js runtime (no export needed)
```

### Caching Strategy

Consider enabling Vercel's caching for static assets:

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-project-id.supabase.co'],
  },
  // Enable ISR for dashboard pages (optional)
  experimental: {
    isrMemoryCacheSize: 0, // Disable for default behavior
  },
};
```

## Security Best Practices

### Production Checklist

- [ ] All environment variables use production values (not development/test)
- [ ] `SESSION_SECRET` is at least 32 characters and randomly generated
- [ ] Database uses SSL/TLS (`?sslmode=require` in connection string)
- [ ] Supabase Storage bucket policies are properly configured
- [ ] CORS is configured correctly (Next.js defaults to same-origin)
- [ ] Rate limiting is implemented (consider Vercel Edge Config or Upstash)
- [ ] Error messages don't leak sensitive information
- [ ] Database connection string doesn't contain plaintext credentials (use Vercel environment variables)

### Rotate Secrets

To rotate `SESSION_SECRET`:

1. Generate a new secret
2. Update environment variable in Vercel
3. Trigger a redeployment
4. **Note**: Existing sessions will be invalidated (users must re-login)

### Monitor Security

- Enable Vercel Security alerts
- Review Vercel deployment logs regularly
- Monitor database connection usage
- Set up alerts for unusual activity (optional)

## Scaling Considerations

### Database

- **Vercel Postgres**: Scales automatically with your plan
- **Supabase**: Free tier includes 500MB, upgrade for more
- **Connection Pooling**: Essential for handling concurrent requests

### Storage

- **Supabase Storage**: Free tier includes 1GB, upgrade as needed
- Consider CDN for frequently accessed images (Vercel Edge Network handles this automatically)

### Compute

- **Vercel Functions**: Serverless, scales automatically
- **Cold Starts**: Minimize by keeping functions warm (Vercel Pro+ has faster cold starts)

## Custom Domain Setup

1. Go to **Project Settings > Domains**
2. Add your custom domain (e.g., `aquasense.example.com`)
3. Configure DNS records as instructed by Vercel
4. Vercel automatically provisions SSL certificates

## Rollback Strategy

If a deployment causes issues:

1. Go to **Deployments** tab
2. Find the last known good deployment
3. Click the three dots (•••) → **Promote to Production**
4. Instant rollback (no rebuild needed)

## Support and Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma on Vercel**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Supabase + Vercel**: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

## Summary

This deployment guide covers:

✅ Connecting your repository to Vercel  
✅ Configuring all required environment variables  
✅ Setting up managed PostgreSQL with connection pooling  
✅ Running database migrations  
✅ Deploying to production  
✅ Post-deployment verification  
✅ Monitoring and debugging  
✅ Security best practices  
✅ Scaling and performance optimization  

Follow this guide for a production-ready AquaSense deployment on Vercel.
