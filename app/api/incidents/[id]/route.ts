import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { updateIncidentSchema } from '@/lib/validation';

/**
 * API Route: GET /api/incidents/[id]
 * Get a single incident by ID
 * 
 * Requirements:
 * - 7.6: Display incident details
 * - 3.4: Can only access incidents from same organization
 * 
 * @param params - Contains incident ID
 * @returns Incident or error
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get session and verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch incident (with organization filter)
    const incident = await prisma.incident.findFirst({
      where: {
        id,
        organizationId: session.organizationId,
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

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ incident });
  } catch (error) {
    console.error('Get incident error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Route: PATCH /api/incidents/[id]
 * Update an incident
 * 
 * Requirements:
 * - 7.5: Prevent modifications to locked incidents
 * - 3.4: Can only update incidents from same organization
 * 
 * @param request - Contains updated incident data
 * @param params - Contains incident ID
 * @returns Updated incident or error
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get session and verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify incident exists and belongs to user's organization
    const existingIncident = await prisma.incident.findUnique({
      where: { id },
      select: { 
        organizationId: true,
        locked: true,
      },
    });

    if (!existingIncident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    if (existingIncident.organizationId !== session.organizationId) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    // Check if incident is locked
    if (existingIncident.locked) {
      return NextResponse.json(
        { error: 'Cannot modify locked incident' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = updateIncidentSchema.parse(body);

    // Build update data
    const updateData: any = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.severity !== undefined) updateData.severity = validated.severity;
    if (validated.status !== undefined) updateData.status = validated.status;

    // Update incident
    const incident = await prisma.incident.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ incident });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update incident error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Route: DELETE /api/incidents/[id]
 * Delete an incident
 * 
 * Requirements:
 * - 7.5: Prevent modifications to locked incidents (deletion is a modification)
 * - 3.4: Can only delete incidents from same organization
 * 
 * @param params - Contains incident ID
 * @returns Success message or error
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get session and verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify incident exists and belongs to user's organization
    const existingIncident = await prisma.incident.findUnique({
      where: { id },
      select: { 
        organizationId: true,
        locked: true,
      },
    });

    if (!existingIncident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    if (existingIncident.organizationId !== session.organizationId) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    // Check if incident is locked
    if (existingIncident.locked) {
      return NextResponse.json(
        { error: 'Cannot delete locked incident' },
        { status: 400 }
      );
    }

    // Delete incident
    await prisma.incident.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Delete incident error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
