'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

/**
 * Cleaning Task Form Component (Client Component)
 * 
 * Provides a form for managers to create cleaning tasks with:
 * - Task title input
 * - Frequency text input (e.g., "Daily", "Weekly", "Every Monday")
 * 
 * Features:
 * - Form validation with Zod
 * - Bilingual labels and validation messages
 * - Toast notifications for success/error
 * - Mobile-first design with 44x44px touch targets
 * 
 * Requirements:
 * - 8.1: Manager creates cleaning task with title and frequency
 * - 8.4: Store frequency as text without automated scheduling
 * - 11.2: Touch targets at least 44x44 pixels
 * - 12.3: Bilingual labels and validation
 */

// Form validation schema
const cleaningTaskFormSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(255, 'Task title is too long'),
  frequency: z.string().min(1, 'Frequency is required').max(100, 'Frequency is too long'),
});

type CleaningTaskFormValues = z.infer<typeof cleaningTaskFormSchema>;

export function CleaningTaskForm() {
  const router = useRouter();
  const t = useTranslations('cleaning');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<CleaningTaskFormValues>({
    resolver: zodResolver(cleaningTaskFormSchema),
    defaultValues: {
      title: '',
      frequency: '',
    },
  });

  /**
   * Handle form submission
   * - Calls /api/cleaning/tasks endpoint (POST)
   * - Displays success/error toast
   * - Refreshes page data on success
   */
  const onSubmit = async (values: CleaningTaskFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/cleaning/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          frequency: values.frequency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to create cleaning task',
        });
        return;
      }

      // Display success toast
      toast({
        title: 'Task created',
        description: 'The cleaning task has been created successfully',
      });

      // Reset form
      form.reset();

      // Refresh page data
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Cleaning task form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Task Title Input */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('taskTitle')}</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Clean pool filters"
                  className="h-11"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Frequency Input */}
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('frequency')}</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Daily, Weekly, Every Monday"
                  className="h-11"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? tCommon('loading') : t('createTask')}
        </Button>
      </form>
    </Form>
  );
}
