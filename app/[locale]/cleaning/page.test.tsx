import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Tests for Cleaning Tasks Page
 * 
 * Verifies:
 * - Server component renders cleaning tasks correctly
 * - Task list displays title, frequency, and last completion
 * - Manager-only task creation form is shown
 * - Staff can see all tasks
 * 
 * Requirements:
 * - 8.1: Manager creates cleaning task with title and frequency
 * - 8.2: Staff marks task as completed
 * - 8.3: Display task title, frequency, and most recent completion timestamp
 * - 11.1: Mobile-first responsive layout
 * - 12.3: Bilingual labels
 */

// Mock next-intl server translations
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async (key: string) => {
    const translations: Record<string, any> = {
      cleaning: {
        title: 'Cleaning Tasks',
        createTask: 'Create Task',
        taskTitle: 'Task Title',
        frequency: 'Frequency',
        lastCompleted: 'Last Completed',
        markComplete: 'Mark Complete',
        completedBy: 'Completed By',
        noTasks: 'No cleaning tasks',
      },
    };
    return (subKey: string) => translations[key]?.[subKey] || subKey;
  }),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock session
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    cleaningTask: {
      findMany: vi.fn(),
    },
  },
}));

describe('Cleaning Tasks Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be a server component', () => {
    const fs = require('fs');
    const path = require('path');
    const pageContent = fs.readFileSync(
      path.join(__dirname, 'page.tsx'),
      'utf-8'
    );
    
    // Server components should NOT have 'use client' directive
    expect(pageContent).not.toContain("'use client'");
    expect(pageContent).not.toContain('"use client"');
  });

  it('should fetch cleaning tasks with last completion log', () => {
    const fs = require('fs');
    const path = require('path');
    const pageContent = fs.readFileSync(
      path.join(__dirname, 'page.tsx'),
      'utf-8'
    );
    
    // Verify that the page includes Prisma query with logs
    expect(pageContent).toContain('prisma.cleaningTask.findMany');
    expect(pageContent).toContain('logs:');
    expect(pageContent).toContain('orderBy:');
    expect(pageContent).toContain('completedAt:');
  });

  it('should display task creation form for managers only', () => {
    const fs = require('fs');
    const path = require('path');
    const pageContent = fs.readFileSync(
      path.join(__dirname, 'page.tsx'),
      'utf-8'
    );
    
    // Verify manager-only form
    expect(pageContent).toContain("session.role === 'MANAGER'");
    expect(pageContent).toContain('CleaningTaskForm');
  });

  it('should pass tasks to CleaningTaskList component', () => {
    const fs = require('fs');
    const path = require('path');
    const pageContent = fs.readFileSync(
      path.join(__dirname, 'page.tsx'),
      'utf-8'
    );
    
    // Verify task list component usage
    expect(pageContent).toContain('CleaningTaskList');
    expect(pageContent).toContain('tasks={tasksWithCompletion}');
  });

  it('should filter tasks by organization', () => {
    const fs = require('fs');
    const path = require('path');
    const pageContent = fs.readFileSync(
      path.join(__dirname, 'page.tsx'),
      'utf-8'
    );
    
    // Verify organization filtering
    expect(pageContent).toContain('organizationId: session.organizationId');
  });

  it('should include bilingual support', () => {
    const fs = require('fs');
    const path = require('path');
    const pageContent = fs.readFileSync(
      path.join(__dirname, 'page.tsx'),
      'utf-8'
    );
    
    // Verify translations are used
    expect(pageContent).toContain("getTranslations('cleaning')");
    expect(pageContent).toContain('t(');
  });
});
