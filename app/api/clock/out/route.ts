import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { clockOutSchema } from '@/lib/validation';

/**
 * API Route: POST /api/clock/out
 * Clock out and update the active clock entry
 * 
 * Requirements:
 * - 6.2: Update active clock entry with clock-out timestamp and optional GPS
 * - 6.5: Store latitude and longitude if GPS available
 * - 6.6: Update clock entries without location data if GPS unavailable
 * 
 * @param request - Contains optional GPS coordinates (latitude, longitude)
 * @returns Updated clock entry or error
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

    // Find the active clock session
    const activeSession = await prisma.clockEntry.findFirst({
      where: {
        userId: session.userId,
        organizationId: session.organizationId,
        clockOutTime: null,
      },
    });

    if (!activeSession) {
      return NextResponse.json(
        { error: 'No active clock session found. Please clock in first.' },
        { status: 400 }
      );
    }

    // Parse and validate request body (GPS coordinates are optional)
    const body = await request.json().catch(() => ({}));
    const validated = clockOutSchema.parse(body);

    // Update clock entry with clock-out timestamp and GPS
    const clockEntry = await prisma.clockEntry.update({
      where: {
        id: activeSession.id,
      },
      data: {
        clockOutTime: new Date(),
        clockOutLat: validated.latitude ?? null,
        clockOutLng: validated.longitude ?? null,
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

    return NextResponse.json({ clockEntry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Clock out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
