'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const copyFormSchema = z.object({
  sourceMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Must be YYYY-MM'),
  targetMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Must be YYYY-MM'),
  keepAssignments: z.boolean(),
  onlyRoutine: z.boolean(),
});

type CopyFormValues = z.infer<typeof copyFormSchema>;

export function CopyShiftsForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Default to copying this month to next month
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const form = useForm<CopyFormValues>({
    resolver: zodResolver(copyFormSchema),
    defaultValues: {
      sourceMonth: thisMonth,
      targetMonth: nextMonth,
      keepAssignments: false,
      onlyRoutine: false,
    },
  });

  const onSubmit = async (values: CopyFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/shifts/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || data.message || 'Failed to copy shifts',
        });
        return;
      }

      toast({
        title: 'Shifts Copied',
        description: data.message,
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sourceMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Month (YYYY-MM)</FormLabel>
                <FormControl>
                  <Input type="month" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Month (YYYY-MM)</FormLabel>
                <FormControl>
                  <Input type="month" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="keepAssignments"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Keep Staff Assignments</FormLabel>
                <FormDescription>
                  If checked, copies who is assigned to each shift. Otherwise, leaves them as Open Shifts.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="onlyRoutine"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Only Copy Routine Shifts</FormLabel>
                <FormDescription>
                  If checked, only copies shifts marked as 'Routine'.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Copying...' : 'Copy Shifts'}
        </Button>
      </form>
    </Form>
  );
}
