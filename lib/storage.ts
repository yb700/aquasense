import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Storage Configuration
 * 
 * This module provides utilities for uploading and managing files in Supabase Storage.
 * Primary use case: Incident report image uploads
 * 
 * Validates: Requirements 14.1, 16.3
 */

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Storage bucket name for incident images
 */
const INCIDENT_IMAGES_BUCKET = 'incident-images';

/**
 * Supported image file types
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Upload an incident image to Supabase Storage
 * 
 * @param file - The image file to upload
 * @param organizationId - The organization ID (for file path organization)
 * @returns The public URL of the uploaded image, or null if upload fails
 */
export async function uploadIncidentImage(
  file: File,
  organizationId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        url: null,
        error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        url: null,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${organizationId}/${timestamp}-${crypto.randomUUID()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(INCIDENT_IMAGES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(INCIDENT_IMAGES_BUCKET)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error during image upload:', error);
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete an incident image from Supabase Storage
 * 
 * @param imageUrl - The full public URL of the image to delete
 * @returns Success status
 */
export async function deleteIncidentImage(
  imageUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
    
    if (!pathMatch) {
      return { success: false, error: 'Invalid image URL format' };
    }

    const filePath = pathMatch[1];

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from(INCIDENT_IMAGES_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error during image deletion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get the storage bucket name for incident images
 * (Used for bucket setup/configuration)
 */
export function getIncidentImagesBucketName(): string {
  return INCIDENT_IMAGES_BUCKET;
}
