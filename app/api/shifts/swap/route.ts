import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { createSwapRequestSchema, updateSwapRequestSchema } from '@/lib/validation';

/**
 * API Route: GET /api/shifts/swap
 * List swap requests for the organization
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const swapRequests = await prisma.swapRequest.findMany({
      where: {
        organizationId: session.organizationId,
      },
      include: {
        shift: true,
        requester: { select: { id: true, name: true, email: true } },
        targetUser: { select: { id: true, name: true, email: true } },
        offeredShift: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ swapRequests });
  } catch (error) {
    console.error('List swap requests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * API Route: POST /api/shifts/swap
 * Create a new swap request
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createSwapRequestSchema.parse(body);

    // Verify shift belongs to requester
    const shift = await prisma.shift.findUnique({
      where: { id: validated.shiftId },
    });

    if (!shift || shift.userId !== session.userId) {
      return NextResponse.json({ error: 'Invalid shift or not authorized' }, { status: 403 });
    }

    // Create swap request
    const swapRequest = await prisma.swapRequest.create({
      data: {
        organizationId: session.organizationId,
        shiftId: validated.shiftId,
        requesterId: session.userId,
        targetUserId: validated.targetUserId || null,
        offeredShiftId: validated.offeredShiftId || null,
        status: 'PENDING',
      },
      include: {
        shift: true,
        requester: { select: { id: true, name: true } },
        targetUser: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ swapRequest }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    console.error('Create swap request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
