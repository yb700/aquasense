import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { createLeaveRequestSchema } from '@/lib/validation';

/**
 * API Route: POST /api/leave
 * Create a new leave request (Staff and Manager)
 * 
 * Requirements:
 * - 5.1: Staff creates leave request with type, start date, end date, reason
 * - 5.1: Store request with status PENDING
 * - 3.6: Automatically assign organization ID
 * 
 * @param request - Contains leave request data (type, startDate, endDate, reason)
 * @returns Created leave request or error
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

    // Parse and validate request body
    const body = await request.json();
    const validated = createLeaveRequestSchema.parse(body);

    // Validate that end date is not before start date
    const startDate = new Date(validated.startDate);
    const endDate = new Date(validated.endDate);
    
    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must not be before start date' },
        { status: 400 }
      );
    }

    // Create leave request with automatic organization assignment and PENDING status
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: session.userId,
        organizationId: session.organizationId,
        type: validated.type,
        status: 'PENDING',
        startDate,
        endDate,
        reason: validated.reason,
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

    return NextResponse.json({ leaveRequest }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create leave request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/leave
 * List leave requests for the user's organization
 * 
 * Requirements:
 * - 5.4: Display leave requests with type, date range, status, and reason
 * - 3.2: Return only leave requests from user's organization
 * 
 * @param request - Next.js request object
 * @returns Array of leave requests
 */
export async function GET(_request: NextRequest) {
  try {
    // Get session and verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch leave requests (filtered by organization)
    // Managers see all leave requests, Staff see only their own
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        organizationId: session.organizationId,
        ...(session.role === 'STAFF' && { userId: session.userId }),
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
        { status: 'asc' }, // PENDING first
        { startDate: 'desc' },
      ],
    });

    return NextResponse.json({ leaveRequests });
  } catch (error) {
    console.error('List leave requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
