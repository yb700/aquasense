import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { updateShiftSchema } from '@/lib/validation';

/**
 * API Route: PATCH /api/shifts/[id]
 * Update an existing shift (Manager only)
 * 
 * Requirements:
 * - 4.4: Manager can edit shifts
 * - 2.1: Manager authorization for shift updates
 * - 3.1: Can only update shifts from same organization
 * 
 * @param request - Contains updated shift data
 * @param params - Contains shift ID
 * @returns Updated shift or error
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
        { error: 'Only managers can update shifts' },
        { status: 403 }
      );
    }

    // Verify shift exists and belongs to user's organization
    const existingShift = await prisma.shift.findUnique({
      where: { id },
      select: { organizationId: true },
    });

    if (!existingShift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    if (existingShift.organizationId !== session.organizationId) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = updateShiftSchema.parse(body);

    // If userId is being updated, verify the user belongs to same organization
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

    // Validate time range if both times are provided
    if (validated.startTime && validated.endTime) {
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
    }

    // Build update data
    const updateData: any = {};
    if (validated.userId !== undefined) updateData.userId = validated.userId || null;
    if (validated.date) updateData.date = new Date(validated.date);
    if (validated.startTime) updateData.startTime = new Date(`1970-01-01T${validated.startTime}:00Z`);
    if (validated.endTime) updateData.endTime = new Date(`1970-01-01T${validated.endTime}:00Z`);
    if (validated.notes !== undefined) updateData.notes = validated.notes;
    if (validated.isRoutine !== undefined) updateData.isRoutine = validated.isRoutine;

    // Update shift
    const shift = await prisma.shift.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ shift });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update shift error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Route: DELETE /api/shifts/[id]
 * Delete a shift (Manager only)
 * 
 * Requirements:
 * - 4.5: Manager can delete shifts
 * - 2.1: Manager authorization for shift deletion
 * - 3.1: Can only delete shifts from same organization
 * 
 * @param params - Contains shift ID
 * @returns Success message or error
 */
export async function DELETE(
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
        { error: 'Only managers can delete shifts' },
        { status: 403 }
      );
    }

    // Verify shift exists and belongs to user's organization
    const existingShift = await prisma.shift.findUnique({
      where: { id },
      select: { organizationId: true },
    });

    if (!existingShift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    if (existingShift.organizationId !== session.organizationId) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    // Delete shift
    await prisma.shift.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Delete shift error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
