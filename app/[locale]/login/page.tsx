'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/design-system/Logo';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { WaterBackground } from '@/components/design-system/WaterBackground';

/**
 * Login Page Component - Redesigned with AquaSense Design System
 * 
 * Client component that provides a login form with email and password inputs.
 * Redesigned with water-inspired styling and AquaSense branding.
 * 
 * Features:
 * - AquaSense logo prominently displayed
 * - FloatingCard with premium depth effects
 * - WaterBackground for aquatic atmosphere
 * - Email and password input fields with validation
 * - Redesigned Button and Input components
 * - Form submission with error handling via Toast notifications
 * - Bilingual support using next-intl
 * - Mobile-first responsive design with 44x44px touch targets
 * - Redirect to /dashboard/manager or /dashboard/staff based on user role
 * 
 * Requirements:
 * - 29.1: Display AquaSense logo prominently
 * - 29.2: Use redesigned Input components
 * - 29.3: Use primary button style
 * - 29.4: Include subtle water-inspired background
 * - 29.5: Fully responsive, centered, mobile-optimized layout
 * 
 * @returns Login page with form
 */

// Form validation schema
const loginFormSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handle form submission
   * - Calls /api/auth/login endpoint
   * - Displays success/error toast
   * - Redirects to role-specific dashboard on success
   */
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        // Display error toast with translated message
        toast({
          variant: 'destructive',
          title: t('invalidCredentials'),
          description: data.error || 'An error occurred during login',
        });
        return;
      }

      // Display success toast
      toast({
        title: t('loginSuccess'),
        description: `${tCommon('welcome')}, ${data.user.name}`,
      });

      // Redirect to role-specific dashboard with locale
      if (data.user.role === 'MANAGER') {
        router.push(`/${locale}/dashboard/manager` as any);
      } else {
        router.push(`/${locale}/dashboard/staff` as any);
      }
    } catch (error) {
      // Handle network or unexpected errors
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WaterBackground variant="light" intensity="subtle" className="flex items-center justify-center px-4 py-8">
      <FloatingCard className="w-full max-w-md">
        {/* Logo - prominently displayed at top */}
        <div className="flex justify-center mb-8">
          <Logo variant="full" size={200} />
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {t('login')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('loginDescription')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('email')}
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('password')}
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button - primary style */}
              <Button 
                type="submit" 
                variant="primary"
                className="w-full" 
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? tCommon('loading') : t('login')}
              </Button>
            </form>
          </Form>
        </div>
      </FloatingCard>
    </WaterBackground>
  );
}
