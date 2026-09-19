import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { createCleaningTaskSchema } from '@/lib/validation';

/**
 * API Route: POST /api/cleaning/tasks
 * Create a new cleaning task (Manager only)
 * 
 * Requirements:
 * - 8.1: Manager creates cleaning task with title and frequency
 * - 2.1: Manager can create cleaning tasks
 * - 3.6: Automatically assign organization ID
 * - 15.6: Implement cleaning task endpoints
 * 
 * @param request - Contains cleaning task data (title, frequency)
 * @returns Created cleaning task or error
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

    // Verify manager role
    if (session.role !== 'MANAGER') {
      return NextResponse.json(
        { error: 'Only managers can create cleaning tasks' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = createCleaningTaskSchema.parse(body);

    // Create cleaning task with automatic organization assignment
    const task = await prisma.cleaningTask.create({
      data: {
        title: validated.title,
        frequency: validated.frequency,
        organizationId: session.organizationId,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create cleaning task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/cleaning/tasks
 * List cleaning tasks for the user's organization with most recent completion log
 * 
 * Requirements:
 * - 8.3: Display task title, frequency, and most recent completion timestamp
 * - 3.5: Return only cleaning tasks from user's organization
 * - 15.6: Implement cleaning task endpoints
 * 
 * @param request - HTTP request
 * @returns Array of cleaning tasks with their most recent completion log
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

    // Fetch cleaning tasks with most recent completion log using Prisma join
    const tasks = await prisma.cleaningTask.findMany({
      where: {
        organizationId: session.organizationId,
      },
      include: {
        logs: {
          orderBy: {
            completedAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            completedAt: true,
            userId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to include most recent completion info at the top level
    const tasksWithCompletion = tasks.map(task => ({
      id: task.id,
      title: task.title,
      frequency: task.frequency,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      lastCompletion: task.logs.length > 0 ? {
        completedAt: task.logs[0].completedAt,
        completedBy: task.logs[0].user.name,
        userId: task.logs[0].userId,
      } : null,
    }));

    return NextResponse.json({ tasks: tasksWithCompletion });
  } catch (error) {
    console.error('List cleaning tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
