'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/**
 * Shift Form Component (Client Component)
 * 
 * Provides a form for managers to create shifts with:
 * - Date picker for shift date
 * - Time inputs for start and end time
 * - Staff selector dropdown
 * - Notes textarea
 * 
 * Features:
 * - Form validation with Zod
 * - Bilingual labels and validation messages
 * - Toast notifications for success/error
 * - Mobile-first design with 44x44px touch targets
 * 
 * Requirements:
 * - 4.1: Create shift with staff, date, times, notes
 * - 11.2: Touch targets at least 44x44 pixels
 * - 12.3: Bilingual labels and validation
 * 
 * @param users - List of users in the organization for staff selection
 */

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ShiftFormProps {
  users: User[];
  editShift?: {
    id: string;
    userId: string | null;
    date: Date;
    startTime: Date;
    endTime: Date;
    notes: string | null;
    isRoutine?: boolean;
  };
  onSuccess?: () => void;
}

// Form validation schema
const shiftFormSchema = z.object({
  userId: z.string().optional(),
  date: z.date({
    message: 'Date is required',
  }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  notes: z.string().optional(),
  isRoutine: z.boolean(),
}).refine((data) => {
  // Validate that end time is after start time
  const [startHour, startMin] = data.startTime.split(':').map(Number);
  const [endHour, endMin] = data.endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

type ShiftFormValues = z.infer<typeof shiftFormSchema>;

export function ShiftForm({ users, editShift, onSuccess }: ShiftFormProps) {
  const router = useRouter();
  const t = useTranslations('shifts');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to format time from Date object
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Initialize form with default values
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: editShift ? {
      userId: editShift.userId || 'unassigned',
      date: editShift.date,
      startTime: formatTime(editShift.startTime),
      endTime: formatTime(editShift.endTime),
      notes: editShift.notes || '',
      isRoutine: editShift.isRoutine || false,
    } : {
      userId: 'unassigned',
      date: new Date(),
      startTime: '09:00',
      endTime: '17:00',
      notes: '',
      isRoutine: false,
    },
  });

  /**
   * Handle form submission
   * - Calls /api/shifts endpoint (POST for create, PATCH for edit)
   * - Displays success/error toast
   * - Refreshes page data on success
   */
  const onSubmit = async (values: ShiftFormValues) => {
    setIsLoading(true);

    try {
      const url = editShift ? `/api/shifts/${editShift.id}` : '/api/shifts';
      const method = editShift ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: values.userId === 'unassigned' ? null : values.userId,
          date: format(values.date, 'yyyy-MM-dd'),
          startTime: values.startTime,
          endTime: values.endTime,
          notes: values.notes || null,
          isRoutine: values.isRoutine,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to save shift',
        });
        return;
      }

      // Display success toast
      toast({
        title: editShift ? 'Shift updated' : 'Shift created',
        description: editShift 
          ? 'The shift has been updated successfully'
          : 'The shift has been created successfully',
      });

      // Reset form if creating new shift
      if (!editShift) {
        form.reset();
      }

      // Call success callback or refresh
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Shift form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Staff Selector */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assignedTo')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">
                    (Open Shift - Unassigned)
                  </SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Picker */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('date')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="secondary"
                      className={cn(
                        'h-11 w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isLoading}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('startTime')}</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="h-11"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('endTime')}</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="h-11"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes Textarea */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('notes')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional notes about this shift..."
                  className="resize-none"
                  rows={3}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Routine Toggle */}
        <FormField
          control={form.control}
          name="isRoutine"
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
                <FormLabel>
                  Routine Shift (Advice Shift)
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Mark this shift as a standard routine shift
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 h-11"
            disabled={isLoading}
          >
            {isLoading ? tCommon('loading') : (editShift ? t('editShift') : t('createShift'))}
          </Button>
          {editShift && onSuccess && (
            <Button
              type="button"
              variant="secondary"
              className="h-11"
              onClick={() => {
                form.reset();
                onSuccess();
              }}
              disabled={isLoading}
            >
              {tCommon('cancel')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
