'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const swapSchema = z.object({
  targetUserId: z.string().optional(),
});

export function SwapShiftDialog({ shiftId, users, currentUserId }: { shiftId: string, users: any[], currentUserId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(swapSchema),
    defaultValues: { targetUserId: 'anyone' },
  });

  const onSubmit = async (values: z.infer<typeof swapSchema>) => {
    setIsLoading(true);
    try {
      const targetUserId = values.targetUserId === 'anyone' ? null : values.targetUserId;
      
      const response = await fetch('/api/shifts/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId, targetUserId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ variant: 'destructive', title: 'Error', description: data.error });
        return;
      }

      toast({ title: 'Success', description: 'Swap request created' });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to request swap' });
    } finally {
      setIsLoading(false);
    }
  };

  const otherUsers = users.filter((u) => u.id !== currentUserId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">Swap</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Shift Swap</DialogTitle>
          <DialogDescription>
            Offer this shift to a specific colleague, or make it open for anyone to take.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="targetUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer to</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a colleague" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="anyone">Anyone (Open Request)</SelectItem>
                      {otherUsers.map(u => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Requesting...' : 'Request Swap'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
