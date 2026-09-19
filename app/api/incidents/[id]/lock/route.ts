import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

/**
 * API Route: PATCH /api/incidents/[id]/lock
 * Lock an incident (Manager only)
 * 
 * Requirements:
 * - 7.4: Manager can set incident locked field to true
 * - 2.6: Only managers can lock incidents
 * - 3.4: Can only lock incidents from same organization
 * 
 * @param params - Contains incident ID
 * @returns Updated incident or error
 */
export async function PATCH(
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

    // Verify manager role
    if (session.role !== 'MANAGER') {
      return NextResponse.json(
        { error: 'Only managers can lock incidents' },
        { status: 403 }
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

    // Check if already locked
    if (existingIncident.locked) {
      return NextResponse.json(
        { error: 'Incident is already locked' },
        { status: 400 }
      );
    }

    // Lock the incident
    const incident = await prisma.incident.update({
      where: { id },
      data: { locked: true },
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
    console.error('Lock incident error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
