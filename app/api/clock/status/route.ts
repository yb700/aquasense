import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

/**
 * API Route: GET /api/clock/status
 * Get the current clock session status
 * 
 * Requirements:
 * - 6.3: Display Clock In button when no active session
 * - 6.4: Display Clock Out button and session start time when session active
 * 
 * @returns Active clock entry or null
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

    // Find the active clock session
    const activeSession = await prisma.clockEntry.findFirst({
      where: {
        userId: session.userId,
        organizationId: session.organizationId,
        clockOutTime: null,
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

    return NextResponse.json({ activeSession });
  } catch (error) {
    console.error('Clock status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
