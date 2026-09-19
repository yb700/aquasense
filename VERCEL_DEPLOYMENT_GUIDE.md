# Vercel Deployment Guide for AquaSense

This guide provides step-by-step instructions for deploying the AquaSense MVP to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm install -g vercel`
- PostgreSQL database (managed instance recommended)
- Supabase project for image storage

## Configuration Files

### vercel.json

The `vercel.json` file has been created with the following configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key",
    "SESSION_SECRET": "@session_secret"
  },
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Key Configuration Details:**
- **buildCommand**: Uses `npm run build` to build the Next.js application
- **outputDirectory**: `.next` is the standard Next.js build output directory
- **framework**: Explicitly set to `nextjs` for automatic Next.js optimizations
- **env**: References to environment variables (stored as Vercel secrets)
- **regions**: Set to `iad1` (US East) - adjust based on your target audience
- **functions**: API routes are configured with 1GB memory and 10s timeout

## Environment Variables Setup

### Required Environment Variables

You need to configure the following environment variables in your Vercel project:

1. **DATABASE_URL**
   - PostgreSQL connection string
   - Format: `postgresql://username:password@host:port/database?schema=public`
   - Example: `postgresql://user:pass@db.example.com:5432/aquasense`
   - **IMPORTANT**: Use a managed PostgreSQL instance (Vercel Postgres, Supabase, Neon, etc.)

2. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`
   - Get from: Supabase Dashboard → Project Settings → API

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Safe for client-side use
   - Get from: Supabase Dashboard → Project Settings → API

4. **SESSION_SECRET**
   - Secret key for encrypting session cookies
   - **MUST be at least 32 characters**
   - Generate with: `openssl rand -base64 32`
   - **CRITICAL**: Keep this secret and never expose it

### Method 1: Configure via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable:
   - Click **Add New**
   - Enter the **Key** (e.g., `DATABASE_URL`)
   - Enter the **Value**
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**
4. Repeat for all four variables

### Method 2: Configure via Vercel CLI

```bash
# Navigate to your project directory
cd /path/to/AquaSense

# Add environment variables (production)
vercel env add DATABASE_URL production
# Paste your database URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your Supabase anon key when prompted

vercel env add SESSION_SECRET production
# Paste your session secret when prompted

# Repeat for preview and development environments if needed
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
```

## Deployment Steps

### Initial Deployment

1. **Link your project to Vercel**
   ```bash
   cd /path/to/AquaSense
   vercel link
   ```
   - Follow prompts to connect to existing project or create new one
   - Select your Vercel account/team
   - Name your project (e.g., `aquasense-mvp`)

2. **Configure environment variables** (see above)

3. **Run database migrations** (before first deployment)
   ```bash
   # Set DATABASE_URL in local .env file pointing to production database
   npx prisma migrate deploy
   
   # Optional: Seed the database with initial data
   npm run db:seed
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Subsequent Deployments

For updates after the initial deployment:

```bash
# Deploy to preview (testing)
vercel

# Deploy to production (after testing preview)
vercel --prod
```

### Automatic Deployments via Git

For continuous deployment:

1. Connect your Git repository to Vercel:
   - Go to Vercel Dashboard → **Add New Project**
   - Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Configure project settings
   - Vercel will automatically deploy on every push to main/master branch

2. Preview deployments:
   - Every pull request gets a unique preview URL
   - Test changes before merging to production

## Testing Preview Deployment

After deploying to preview, test the following:

### 1. Verify Environment Variables

Visit `https://your-preview-url.vercel.app` and check:
- [ ] Application loads without errors
- [ ] No environment variable errors in browser console
- [ ] Database connection works (try logging in)

### 2. Test Core Functionality

- [ ] **Authentication**: Log in with test credentials
- [ ] **Multi-tenancy**: Verify data isolation (requires test data in DB)
- [ ] **Shifts**: Create, view, edit, and delete shifts (Manager role)
- [ ] **Leave Requests**: Submit and approve leave requests
- [ ] **Clock In/Out**: Test time tracking functionality
- [ ] **Incidents**: Create incident report with image upload
- [ ] **Cleaning Tasks**: Create and complete cleaning tasks
- [ ] **Dashboards**: View Manager and Staff dashboards
- [ ] **Language Switching**: Toggle between Danish and English

### 3. Test Mobile Responsiveness

- [ ] Open preview URL on mobile device or use browser DevTools
- [ ] Verify responsive layout on various screen sizes
- [ ] Test touch targets (minimum 44x44px)
- [ ] Verify text readability on small screens

### 4. Check Performance

- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Target scores: Performance > 80, Accessibility > 90
- [ ] Verify page load time < 3 seconds on 3G connection

### 5. Verify Image Upload

- [ ] Create incident with image attachment
- [ ] Verify image uploads to Supabase Storage
- [ ] Verify image displays correctly on incident details

## Troubleshooting

### Build Failures

**Error**: `Database connection failed`
- **Solution**: Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Check database is accessible from Vercel's network

**Error**: `Module not found`
- **Solution**: Run `npm install` locally and commit `package-lock.json`
- Ensure all dependencies are in `dependencies` (not `devDependencies`) if used at runtime

**Error**: `Prisma client not generated`
- **Solution**: Add postinstall script to `package.json`:
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```

### Runtime Errors

**Error**: `Session secret not configured`
- **Solution**: Verify `SESSION_SECRET` is set in Vercel environment variables
- Must be at least 32 characters long

**Error**: `Supabase storage error`
- **Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase Storage bucket permissions (should allow public reads)

**Error**: `Multi-tenant data leaking`
- **Solution**: Verify Prisma middleware is properly configured
- Check session organization ID is correctly extracted

### Performance Issues

**Slow page loads**
- Enable Next.js Image Optimization (already enabled by default)
- Implement caching strategies for frequently accessed data
- Consider database connection pooling

**API route timeouts**
- Increase `maxDuration` in `vercel.json` functions config (currently 10s)
- Optimize database queries (add indexes)
- Review Prisma query performance

## Database Migration on Vercel

### Applying New Migrations

When you have new Prisma migrations to apply:

1. **Deploy migration to production database**
   ```bash
   # Set DATABASE_URL to production database
   export DATABASE_URL="postgresql://..."
   
   # Apply migrations
   npx prisma migrate deploy
   ```

2. **Deploy application code**
   ```bash
   vercel --prod
   ```

**IMPORTANT**: Always apply migrations before deploying new code that depends on schema changes.

## Monitoring and Logs

### View Deployment Logs

Via Vercel Dashboard:
1. Go to your project → **Deployments**
2. Click on a deployment
3. View **Build Logs** and **Function Logs**

Via CLI:
```bash
# View function logs in real-time
vercel logs <deployment-url>

# Follow logs
vercel logs <deployment-url> --follow
```

### Error Tracking

Consider integrating error tracking:
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)
- Vercel Analytics (built-in)

## Security Checklist

Before deploying to production:

- [ ] `SESSION_SECRET` is set and secure (32+ characters)
- [ ] Database credentials are not exposed in code
- [ ] `.env.local` is in `.gitignore`
- [ ] Supabase Storage bucket has proper access policies
- [ ] Database has proper indexes for performance
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Rate limiting is configured (consider future enhancement)

## Production Database Setup

### Recommended Providers

1. **Vercel Postgres**
   - Integrated with Vercel dashboard
   - Easy to set up
   - Automatic connection pooling
   - https://vercel.com/docs/storage/vercel-postgres

2. **Supabase Database**
   - Managed PostgreSQL
   - Includes Storage (already using for images)
   - Free tier available
   - Connection pooling with pgBouncer
   - https://supabase.com/database

3. **Neon**
   - Serverless PostgreSQL
   - Automatic scaling
   - Branch database for preview deployments
   - https://neon.tech

### Setting Up Vercel Postgres

```bash
# Install Vercel Postgres
vercel postgres create

# Get connection string
vercel env pull .env.local
```

Then add the `DATABASE_URL` to your Vercel project environment variables.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## Support

For issues specific to:
- **Vercel Platform**: https://vercel.com/support
- **Database**: Contact your database provider
- **Supabase**: https://supabase.com/support

---

**Last Updated**: Task 14.3 - Configure Vercel deployment settings
**Requirements**: 16.1, 16.4
