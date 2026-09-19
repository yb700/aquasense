import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const claimShiftSchema = z.object({
  shiftId: z.string().min(1, 'Shift ID is required'),
});

/**
 * API Route: POST /api/shifts/claim
 * Claim an open shift (Staff/Manager)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const validated = claimShiftSchema.parse(body);

    const shift = await prisma.shift.findUnique({
      where: { id: validated.shiftId },
    });

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }

    if (shift.organizationId !== session.organizationId) {
      return NextResponse.json({ error: 'Not authorized for this shift' }, { status: 403 });
    }

    if (shift.userId !== null) {
      return NextResponse.json({ error: 'Shift is already claimed' }, { status: 400 });
    }

    const updatedShift = await prisma.shift.update({
      where: { id: validated.shiftId },
      data: { userId: session.userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ shift: updatedShift, message: 'Shift claimed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    console.error('Claim shift error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
