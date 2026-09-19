import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { getIronSession } from 'iron-session';
import { Session } from './lib/auth';

/**
 * Next.js Middleware for Authentication and Internationalization
 * 
 * This middleware combines two critical functions:
 * 1. Session-based authentication with route protection
 * 2. Locale detection and routing for bilingual support (Danish/English)
 * 
 * Requirements:
 * - 1.1: User authentication and session management
 * - 1.3: Redirect unauthenticated users to login
 * - 12.4: Locale detection and routing
 * 
 * Design: Authentication Module + Internationalization Module
 * 
 * Flow:
 * 1. Check if route requires authentication
 * 2. If authenticated route, validate session
 * 3. If no valid session, redirect to login
 * 4. Apply i18n middleware for locale handling
 * 5. Set security headers on response
 */

// Session configuration matching lib/session.ts
const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'aquasense_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
};

// Configure next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['da', 'en'],
  defaultLocale: 'da',
  localeDetection: true,
  localePrefix: 'as-needed'
});

/**
 * Public routes that don't require authentication
 * These routes are accessible without a valid session
 */
const publicRoutes = [
  '/',
  '/login',
  '/api/auth/login',
];

/**
 * Check if a pathname is a public route
 * Handles both localized paths (e.g., /da/login) and non-localized paths
 */
function isPublicRoute(pathname: string): boolean {
  // Remove locale prefix if present (e.g., /da/login -> /login)
  const pathWithoutLocale = pathname.replace(/^\/(da|en)/, '');
  
  // Check if the path (with or without locale) is in public routes
  return publicRoutes.some(route => 
    pathname === route || pathWithoutLocale === route || pathname.startsWith(route)
  );
}

/**
 * Main middleware function
 * Executes on every request matching the config.matcher pattern
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication check for public routes
  if (isPublicRoute(pathname)) {
    // Apply i18n middleware for locale handling
    const response = intlMiddleware(request);
    
    // Add security headers
    addSecurityHeaders(response);
    
    return response;
  }

  // Validate session for protected routes
  try {
    const session = await getIronSession<Session>(request.cookies as any, sessionOptions);

    // Check if session has required fields (user is authenticated)
    const isAuthenticated = Boolean(
      session.userId &&
      session.organizationId &&
      session.role &&
      session.name &&
      session.email
    );

    if (!isAuthenticated) {
      // No valid session - redirect to login with locale
      const locale = pathname.match(/^\/(da|en)/)?.[1] || 'da';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      
      // Store the original URL to redirect back after login (optional enhancement)
      loginUrl.searchParams.set('from', pathname);
      
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated - apply i18n middleware
    const intlResponse = intlMiddleware(request);
    
    // Add security headers
    addSecurityHeaders(intlResponse);
    
    return intlResponse;
  } catch (error) {
    console.error('Middleware session validation error:', error);
    
    // On error, redirect to login for safety
    const locale = pathname.match(/^\/(da|en)/)?.[1] || 'da';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Add security headers to response
 * 
 * Sets headers for:
 * - Secure cookie handling (already handled by iron-session)
 * - SameSite=Strict for CSRF protection (already handled by iron-session)
 * - Additional security headers for defense in depth
 * 
 * Requirements: 12.4 (Set response headers for security)
 */
function addSecurityHeaders(response: NextResponse): void {
  // X-Frame-Options: Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // X-Content-Type-Options: Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer-Policy: Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // X-XSS-Protection: Enable XSS filter (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');
}

export const config = {
  // Match all pathnames except:
  // - API routes (handled directly, no locale prefix needed)
  // - _next (Next.js internals)
  // - Static files (images, fonts, etc.)
  matcher: [
    '/((?!_next|api|.*\\..*).*)',
  ]
};
