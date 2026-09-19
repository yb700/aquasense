import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { updateSwapRequestSchema } from '@/lib/validation';

/**
 * API Route: PATCH /api/shifts/swap/[id]
 * Update a swap request (approve, reject, cancel)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateSwapRequestSchema.parse(body);

    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id },
      include: { shift: true, offeredShift: true },
    });

    if (!swapRequest) {
      return NextResponse.json({ error: 'Swap request not found' }, { status: 404 });
    }

    // Authorization checks
    // If CANCELLED, must be requester or manager
    // If REJECTED, must be targetUser or manager
    // If APPROVED, must be targetUser (if target specified) or manager
    
    // For MVP, we'll allow manager to do anything, and users involved to act appropriately
    const isManager = session.role === 'MANAGER';
    const isRequester = session.userId === swapRequest.requesterId;
    const isTarget = session.userId === swapRequest.targetUserId;
    
    if (validated.status === 'CANCELLED' && !isRequester && !isManager) {
      return NextResponse.json({ error: 'Unauthorized to cancel' }, { status: 403 });
    }
    
    if (validated.status === 'REJECTED' && !isTarget && !isManager) {
      return NextResponse.json({ error: 'Unauthorized to reject' }, { status: 403 });
    }

    if (validated.status === 'APPROVED' && swapRequest.targetUserId && !isTarget && !isManager) {
      return NextResponse.json({ error: 'Unauthorized to approve' }, { status: 403 });
    }

    // Perform the swap if APPROVED
    if (validated.status === 'APPROVED') {
      // Begin transaction for safe swap
      await prisma.$transaction(async (tx) => {
        // Update swap request status
        await tx.swapRequest.update({
          where: { id },
          data: { status: 'APPROVED' },
        });

        // Reassign the original shift to the approver (or target user)
        // If it's a manager approving an open swap, they must specify who gets it, but for now we assume session user gets it if they are staff
        const newAssigneeId = isTarget ? swapRequest.targetUserId : session.userId;
        
        await tx.shift.update({
          where: { id: swapRequest.shiftId },
          data: { userId: newAssigneeId },
        });

        // If there was an offered shift in exchange, reassign it to the requester
        if (swapRequest.offeredShiftId) {
          await tx.shift.update({
            where: { id: swapRequest.offeredShiftId },
            data: { userId: swapRequest.requesterId },
          });
        }
      });
      
      return NextResponse.json({ message: 'Swap approved successfully' });
    }

    // Otherwise, just update status
    const updated = await prisma.swapRequest.update({
      where: { id },
      data: { status: validated.status },
    });

    return NextResponse.json({ swapRequest: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    console.error('Update swap request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
