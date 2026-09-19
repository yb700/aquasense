import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

/**
 * API Route: POST /api/cleaning/tasks/[id]/complete
 * Mark a cleaning task as completed
 * 
 * Requirements:
 * - 8.2: Staff user marks cleaning task as completed, create cleaning log entry with current timestamp
 * - 3.6: Automatically assign organization ID
 * - 15.6: Implement cleaning task endpoints
 * 
 * @param request - HTTP request
 * @param params - Route parameters containing task ID
 * @returns Created cleaning log entry or error
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session and verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Await params to get the task ID
    const { id: taskId } = await params;

    // Verify that the task exists and belongs to the user's organization
    const task = await prisma.cleaningTask.findUnique({
      where: { id: taskId },
      select: { id: true, organizationId: true, title: true },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Cleaning task not found' },
        { status: 404 }
      );
    }

    if (task.organizationId !== session.organizationId) {
      return NextResponse.json(
        { error: 'Cleaning task not found' },
        { status: 404 }
      );
    }

    // Create cleaning log entry with current timestamp, user ID, and task ID
    const log = await prisma.cleaningLog.create({
      data: {
        taskId: task.id,
        userId: session.userId,
        organizationId: session.organizationId,
        completedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        task: {
          select: {
            title: true,
            frequency: true,
          },
        },
      },
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error('Complete cleaning task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
