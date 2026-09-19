import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { getSession } from '@/lib/session';
import { AppLayout } from '@/components/AppLayout';
import { Footer } from '@/components/design-system/Footer';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import '../globals.css';

/**
 * Root Layout with i18n Provider and Theme Support
 * 
 * Features:
 * - Wraps children with NextIntlClientProvider for i18n support
 * - Wraps application with ThemeProvider for dark mode support
 * - Includes NavigationRail (desktop) and BottomNavigation (mobile) via AppLayout
 * - Displays logout button with API call to /api/auth/logout
 * - Validates locale parameter (da or en)
 * - Conditionally shows navigation only for authenticated users
 * - Loads theme before first paint to avoid flash
 * 
 * Requirements:
 * - 11.1: Mobile-first responsive layout
 * - 11.2: Touch targets at least 44x44 pixels
 * - 12.1: Display UI text in Danish by default
 * - 12.2: Support language switching
 * - 12.3: Translate navigation elements
 * - 12.4: Persist language preference
 * - 17.2: Apply dark mode colors when enabled
 * - 8.1-8.7: NavigationRail for desktop
 * - 9.1-9.7: BottomNavigation for mobile
 */

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Validate that the incoming `locale` parameter is valid
  const locales = ['da', 'en'];
  if (!locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Get current user session to determine if navigation should be shown
  const session = await getSession();

  return (
    <html lang={locale}>
      <head>
        {/* Load theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('aquasense-theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {/* Conditional navigation based on authentication */}
            {session ? (
              <AppLayout userName={session.name} currentLocale={locale}>
                {children}
              </AppLayout>
            ) : (
              <main>{children}</main>
            )}
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
