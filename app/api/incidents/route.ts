import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { uploadIncidentImage } from '@/lib/storage';
import { createIncidentSchema } from '@/lib/validation';

/**
 * API Route: POST /api/incidents
 * Create a new incident report with optional image upload
 * 
 * Requirements:
 * - 7.1: Create incident with title, description, severity, status OPEN, locked false
 * - 7.2: Upload image to Supabase Storage and store URL
 * - 14.1: Upload image file to Supabase Storage
 * - 14.2: Store Supabase Storage URL with incident record
 * - 14.3: Allow incident creation even if image upload fails
 * - 3.6: Automatically assign organization ID
 * 
 * @param request - Contains incident data (multipart/form-data or JSON)
 * @returns Created incident or error
 */
export async function POST(request: NextRequest) {
  try {
    // Get session and verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request - handle both multipart form data and JSON
    let title: string;
    let description: string;
    let severity: string;
    let imageFile: File | null = null;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // Handle multipart form data (with image)
      const formData = await request.formData();
      title = formData.get('title') as string;
      description = formData.get('description') as string;
      severity = formData.get('severity') as string;
      imageFile = formData.get('image') as File | null;
    } else {
      // Handle JSON request (without image)
      const body = await request.json();
      title = body.title;
      description = body.description;
      severity = body.severity;
    }

    // Validate required fields
    const validated = createIncidentSchema.parse({
      title,
      description,
      severity,
    });

    // Handle image upload if provided
    let imageUrl: string | null = null;
    let imageUploadError: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadIncidentImage(imageFile, session.organizationId);
      
      if (uploadResult.url) {
        imageUrl = uploadResult.url;
      } else {
        imageUploadError = uploadResult.error;
        console.warn('Image upload failed, proceeding without image:', uploadResult.error);
      }
    }

    // Create incident with automatic organization assignment
    // Status is OPEN and locked is false by default (per schema)
    const incident = await prisma.incident.create({
      data: {
        userId: session.userId,
        organizationId: session.organizationId,
        title: validated.title,
        description: validated.description,
        severity: validated.severity,
        status: 'OPEN',
        locked: false,
        imageUrl: imageUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Prepare response with optional warning about image upload
    const response: any = { incident };
    if (imageUploadError) {
      response.warning = `Incident created successfully, but image upload failed: ${imageUploadError}`;
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create incident error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/incidents
 * List incidents for the user's organization
 * 
 * Requirements:
 * - 7.6: Display incidents with title, description, severity, status, and image
 * - 3.4: Return only incidents from user's organization
 * 
 * @param request - May contain query parameters for filtering
 * @returns Array of incidents
 */
export async function GET(request: NextRequest) {
  try {
    // Get session and verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse optional query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');

    // Build filter
    const where: any = {
      organizationId: session.organizationId,
    };

    if (status && ['OPEN', 'CLOSED'].includes(status)) {
      where.status = status;
    }

    if (severity && ['LOW', 'MEDIUM', 'HIGH'].includes(severity)) {
      where.severity = severity;
    }

    // Fetch incidents (filtered by organization)
    const incidents = await prisma.incident.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ incidents });
  } catch (error) {
    console.error('List incidents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
