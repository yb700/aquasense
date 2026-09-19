# AquaSense Utility Library

This directory contains shared utility modules used throughout the AquaSense application.

## Modules

### `storage.ts` - Supabase Storage Integration

Provides utilities for managing file uploads to Supabase Storage, specifically for incident report images.

#### Configuration

The storage module requires the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

These values can be found in your Supabase project dashboard:
1. Go to https://app.supabase.com
2. Select your project
3. Navigate to Settings > API
4. Copy the "Project URL" and "anon/public" key

#### Storage Bucket Setup

Before using the image upload functionality, you need to create a storage bucket in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Click "Create a new bucket"
4. Name it: `incident-images`
5. Set it to **Public** (so uploaded images can be accessed via URL)
6. Configure policies as needed for your security requirements

#### Usage

**Upload an incident image:**

```typescript
import { uploadIncidentImage } from '@/lib/storage';

// In a Client Component or API Route
const file = formData.get('image') as File;
const organizationId = session.organizationId;

const { url, error } = await uploadIncidentImage(file, organizationId);

if (error) {
  console.error('Upload failed:', error);
  // Handle error - incident can still be created without image
} else {
  // Save the URL to the database with the incident record
  console.log('Image uploaded:', url);
}
```

**Delete an incident image:**

```typescript
import { deleteIncidentImage } from '@/lib/storage';

const imageUrl = incident.imageUrl;

const { success, error } = await deleteIncidentImage(imageUrl);

if (error) {
  console.error('Delete failed:', error);
}
```

**Get bucket name (for configuration):**

```typescript
import { getIncidentImagesBucketName } from '@/lib/storage';

const bucketName = getIncidentImagesBucketName();
// Returns: "incident-images"
```

#### Features

- **File Type Validation**: Only accepts JPEG, PNG, and WebP images
- **Size Validation**: Maximum file size of 5MB
- **Organized Storage**: Files are organized by organization ID in subfolders
- **Unique Filenames**: Uses timestamp + UUID to prevent naming conflicts
- **Error Handling**: Returns detailed error messages for debugging
- **Graceful Degradation**: Incidents can be created without images if upload fails

#### File Organization

Uploaded files are stored with the following path structure:
```
incident-images/
  ├── {organizationId}/
  │   ├── {timestamp}-{uuid}.jpg
  │   ├── {timestamp}-{uuid}.png
  │   └── ...
```

This organization makes it easy to:
- Track storage usage per organization
- Clean up all files for a specific organization
- Debug upload issues

#### Security Considerations

- The anon key is safe to use in client-side code (it's public)
- Supabase Row Level Security (RLS) policies should be configured for additional protection
- Consider implementing server-side upload proxying for enhanced security
- The module validates file types and sizes before upload to prevent abuse

#### Requirements Validated

- **Requirement 14.1**: Upload incident images to Supabase Storage
- **Requirement 16.3**: Use Supabase Storage for image file storage

#### Related Files

- `/app/api/incidents/route.ts` - Uses `uploadIncidentImage()` for incident creation
- `/app/[locale]/incidents/new/page.tsx` - Client-side form for uploading images
- `/.env.example` - Template for environment variables
- `/.env.local` - Local environment configuration (not committed to git)
