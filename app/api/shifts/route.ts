import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { createShiftSchema } from '@/lib/validation';

/**
 * API Route: POST /api/shifts
 * Create a new shift (Manager only)
 * 
 * Requirements:
 * - 4.1: Manager creates shift with staff, date, start time, end time
 * - 4.2: Store shift with optional notes
 * - 2.1: Manager can create shifts
 * - 3.6: Automatically assign organization ID
 * 
 * @param request - Contains shift data (userId, date, startTime, endTime, notes)
 * @returns Created shift or error
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

    // Verify manager role
    if (session.role !== 'MANAGER') {
      return NextResponse.json(
        { error: 'Only managers can create shifts' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = createShiftSchema.parse(body);

    // Verify that the assigned user belongs to the same organization, if assigned
    if (validated.userId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: validated.userId },
        select: { organizationId: true },
      });

      if (!assignedUser || assignedUser.organizationId !== session.organizationId) {
        return NextResponse.json(
          { error: 'Cannot assign shift to user from different organization' },
          { status: 400 }
        );
      }
    }

    // Validate that end time is after start time
    const [startHour, startMin] = validated.startTime.split(':').map(Number);
    const [endHour, endMin] = validated.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Create shift with automatic organization assignment
    // Date and time are stored separately in the database
    const shift = await prisma.shift.create({
      data: {
        userId: validated.userId || null,
        organizationId: session.organizationId,
        date: new Date(validated.date),
        startTime: new Date(`1970-01-01T${validated.startTime}:00Z`),
        endTime: new Date(`1970-01-01T${validated.endTime}:00Z`),
        notes: validated.notes || null,
        isRoutine: validated.isRoutine || false,
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

    return NextResponse.json({ shift }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create shift error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/shifts
 * List shifts for the user's organization
 * 
 * Query parameters:
 * - startDate: Filter shifts from this date (YYYY-MM-DD)
 * - endDate: Filter shifts until this date (YYYY-MM-DD)
 * 
 * Requirements:
 * - 4.6: Query shifts for specific date range
 * - 3.1: Return only shifts from user's organization
 * 
 * @param request - Contains optional date range query params
 * @returns Array of shifts
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Fetch shifts (filtered by organization)
    const shifts = await prisma.shift.findMany({
      where: {
        organizationId: session.organizationId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
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
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return NextResponse.json({ shifts });
  } catch (error) {
    console.error('List shifts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
