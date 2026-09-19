import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { approveRejectLeaveRequestSchema } from '@/lib/validation';

/**
 * API Route: PATCH /api/leave/[id]
 * Approve or reject a leave request (Manager only)
 * 
 * Requirements:
 * - 5.2: Manager approves pending leave request
 * - 5.3: Manager rejects pending leave request
 * - 2.3: Manager authorization for leave approval
 * - 3.2: Can only update leave requests from same organization
 * - 15.3: Prevent status changes on non-PENDING requests
 * 
 * @param request - Contains new status (APPROVED or REJECTED)
 * @param params - Contains leave request ID
 * @returns Updated leave request or error
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

    // Verify manager role
    if (session.role !== 'MANAGER') {
      return NextResponse.json(
        { error: 'Only managers can approve or reject leave requests' },
        { status: 403 }
      );
    }

    // Verify leave request exists and belongs to user's organization
    const existingLeaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      select: { 
        organizationId: true,
        status: true,
      },
    });

    if (!existingLeaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    if (existingLeaveRequest.organizationId !== session.organizationId) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    // Prevent status changes on non-PENDING requests
    if (existingLeaveRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cannot modify leave request that is not pending' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = approveRejectLeaveRequestSchema.parse(body);

    // Update leave request status
    const leaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: validated.status,
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

    return NextResponse.json({ leaveRequest });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update leave request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
