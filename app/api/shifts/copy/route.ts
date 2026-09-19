import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { copyShiftsSchema } from '@/lib/validation';
import { startOfMonth, endOfMonth, parseISO, addMonths, differenceInDays } from 'date-fns';

/**
 * API Route: POST /api/shifts/copy
 * Copy shifts from one month to another (Manager only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = copyShiftsSchema.parse(body);

    const sourceDate = parseISO(`${validated.sourceMonth}-01`);
    const targetDate = parseISO(`${validated.targetMonth}-01`);
    
    const sourceStart = startOfMonth(sourceDate);
    const sourceEnd = endOfMonth(sourceDate);

    // Build the query to get source shifts
    const whereClause: any = {
      organizationId: session.organizationId,
      date: {
        gte: sourceStart,
        lte: sourceEnd,
      },
    };

    if (validated.onlyRoutine) {
      whereClause.isRoutine = true;
    }

    const sourceShifts = await prisma.shift.findMany({
      where: whereClause,
    });

    if (sourceShifts.length === 0) {
      return NextResponse.json({ message: 'No shifts found to copy' }, { status: 404 });
    }

    // Calculate month difference to adjust dates
    const monthDiff = (targetDate.getFullYear() - sourceDate.getFullYear()) * 12 + 
                      (targetDate.getMonth() - sourceDate.getMonth());

    const newShiftsData = sourceShifts.map((shift) => {
      // Create new date by adding months
      const newDate = addMonths(shift.date, monthDiff);
      
      return {
        userId: validated.keepAssignments ? shift.userId : null,
        organizationId: shift.organizationId,
        date: newDate,
        startTime: shift.startTime,
        endTime: shift.endTime,
        notes: shift.notes,
        isRoutine: shift.isRoutine,
      };
    });

    // Bulk insert the new shifts
    const created = await prisma.shift.createMany({
      data: newShiftsData,
    });

    return NextResponse.json({ 
      message: `Successfully copied ${created.count} shifts`, 
      count: created.count 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    console.error('Copy shifts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
