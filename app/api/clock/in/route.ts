import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { clockInSchema } from '@/lib/validation';

/**
 * API Route: POST /api/clock/in
 * Clock in and create a new clock entry
 * 
 * Requirements:
 * - 6.1: Create clock entry with current timestamp and optional GPS coordinates
 * - 6.5: Store latitude and longitude if GPS available
 * - 6.6: Create clock entries without location data if GPS unavailable
 * - 3.6: Automatically assign organization ID
 * 
 * @param request - Contains optional GPS coordinates (latitude, longitude)
 * @returns Created clock entry or error
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

    // Check if user already has an active clock session
    const activeSession = await prisma.clockEntry.findFirst({
      where: {
        userId: session.userId,
        organizationId: session.organizationId,
        clockOutTime: null,
      },
    });

    if (activeSession) {
      return NextResponse.json(
        { error: 'You already have an active clock session. Please clock out first.' },
        { status: 400 }
      );
    }

    // Parse and validate request body (GPS coordinates are optional)
    const body = await request.json().catch(() => ({}));
    const validated = clockInSchema.parse(body);

    // Create clock entry with automatic organization assignment
    const clockEntry = await prisma.clockEntry.create({
      data: {
        userId: session.userId,
        organizationId: session.organizationId,
        clockInTime: new Date(),
        clockInLat: validated.latitude ?? null,
        clockInLng: validated.longitude ?? null,
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

    return NextResponse.json({ clockEntry }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Clock in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
