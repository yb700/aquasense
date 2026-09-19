'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, Loader2, AlertCircle } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WaterBackground } from '@/components/design-system/WaterBackground';
import { FloatingCard } from '@/components/design-system/FloatingCard';
import { Container } from '@/components/design-system/Container';

/**
 * New Incident Report Page (Client Component)
 * 
 * Client Component form for creating incident reports with:
 * - Title input
 * - Description textarea
 * - Severity dropdown (LOW, MEDIUM, HIGH)
 * - Image upload input
 * 
 * Features:
 * - Form validation with Zod
 * - Multipart/form-data submission for image upload
 * - Error handling for image upload failures
 * - Bilingual labels for severity levels
 * - Mobile-first responsive design
 * - Toast notifications for success/error
 * 
 * Requirements:
 * - 7.1: Create incident with title, description, severity
 * - 7.2: Upload image to Supabase Storage
 * - 7.3: Support LOW, MEDIUM, HIGH severity levels
 * - 11.1: Mobile-first responsive layout
 * - 11.2: Touch targets at least 44x44 pixels
 * - 12.3: Bilingual labels for severity levels
 * - 14.1: Image upload to Supabase
 * - 14.3: Display error if upload fails but allow incident creation
 * - 14.4: Handle multipart/form-data
 * - 14.5: Image file input
 * 
 * @returns New incident form page
 */

// Form validation schema
const incidentFormSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: z.string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be 5000 characters or less'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    message: 'Please select a severity level',
  }),
  image: z.any().optional(),
});

type IncidentFormValues = z.infer<typeof incidentFormSchema>;

export default function NewIncidentPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('incidents');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [imageUploadWarning, setImageUploadWarning] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      severity: 'LOW',
    },
  });

  /**
   * Handle form submission
   * - Builds multipart/form-data request
   * - Calls POST /api/incidents endpoint
   * - Displays success/error toast
   * - Handles image upload failures gracefully
   * - Redirects to incidents list on success
   */
  const onSubmit = async (values: IncidentFormValues) => {
    setIsLoading(true);
    setImageUploadWarning(null);

    try {
      // Build FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('severity', values.severity);

      // Add image file if selected
      const fileInput = document.getElementById('image-input') as HTMLInputElement;
      if (fileInput?.files && fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
      }

      // Submit to API
      const response = await fetch('/api/incidents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to create incident report',
        });
        return;
      }

      // Check for image upload warning
      if (data.warning) {
        setImageUploadWarning(data.warning);
        toast({
          title: 'Incident created with warning',
          description: data.warning,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Incident reported',
          description: 'Your incident report has been submitted successfully',
        });
      }

      // Redirect to incidents list
      router.push(`/${locale}/incidents`);
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Incident form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle file input change
   * - Updates selected file name display
   * - Validates file type (basic client-side validation)
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (basic validation)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Please select a JPEG, PNG, or WebP image file',
        });
        e.target.value = ''; // Clear the input
        setSelectedFileName(null);
        return;
      }

      // Check file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Image must be less than 10MB',
        });
        e.target.value = ''; // Clear the input
        setSelectedFileName(null);
        return;
      }

      setSelectedFileName(file.name);
    } else {
      setSelectedFileName(null);
    }
  };

  return (
    <WaterBackground intensity="subtle" className="min-h-screen">
      <Container maxWidth="wide" className="py-6 space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={() => router.push(`/${locale}/incidents`)}
        >
          <ArrowLeft className="h-4 w-4" />
          {tCommon('back')}
        </Button>

        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('reportIncident')}</h1>
          <p className="text-muted-foreground">
            Report safety or operational incidents with details and optional photo evidence
          </p>
        </div>

        {/* Incident Form */}
        <FloatingCard>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Incident Details</h2>
              <p className="text-sm text-muted-foreground">
                Provide information about the incident. All fields except image are required.
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('incidentTitle')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief summary of the incident"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('description')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of what happened, when, and where..."
                          className="min-h-32 resize-y"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide as much detail as possible to help management understand the incident
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Severity Field */}
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('severity')}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOW">{t('low')}</SelectItem>
                          <SelectItem value="MEDIUM">{t('medium')}</SelectItem>
                          <SelectItem value="HIGH">{t('high')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the severity level that best describes this incident
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Field */}
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t('uploadImage')} (Optional)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <label 
                            htmlFor="image-input"
                            className="flex items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-card border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-accent focus:outline-none"
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <Upload className="w-8 h-8 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedFileName || 'Click to upload or drag and drop'}
                              </span>
                              <span className="text-xs text-gray-500">
                                JPEG, PNG, or WebP (max 10MB)
                              </span>
                            </div>
                          </label>
                          <input
                            id="image-input"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a photo if available. Incident will be created even if image upload fails.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Warning */}
                {imageUploadWarning && (
                  <Alert variant="default">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{imageUploadWarning}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Submitting...' : tCommon('submit')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="lg"
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial"
                    onClick={() => router.push(`/${locale}/incidents`)}
                  >
                    {tCommon('cancel')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </FloatingCard>
      </Container>
    </WaterBackground>
  );
}
