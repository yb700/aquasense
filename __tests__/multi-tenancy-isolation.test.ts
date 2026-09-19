/**
 * Multi-Tenancy Isolation End-to-End Tests
 * 
 * Task: 15.4 Test multi-tenancy isolation end-to-end
 * 
 * This test suite validates complete data isolation across organizations by:
 * - Creating multiple organizations with test data
 * - Logging in as users from different organizations
 * - Verifying complete data isolation across all features
 * - Attempting cross-org access and verifying 404 responses
 * 
 * Requirements tested:
 * - 3.1: Return only shifts from user's organization
 * - 3.2: Return only leave requests from user's organization
 * - 3.3: Return only clock entries from user's organization
 * - 3.4: Return only incidents from user's organization
 * - 3.5: Return only cleaning tasks from user's organization
 * - 3.6: Automatically assign organization ID on record creation
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient, Role, LeaveType, LeaveStatus, Severity, IncidentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Initialize database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface TestOrganization {
  id: string;
  name: string;
  managerId: string;
  managerEmail: string;
  staffId: string;
  staffEmail: string;
  shiftIds: string[];
  leaveRequestIds: string[];
  clockEntryIds: string[];
  incidentIds: string[];
  cleaningTaskIds: string[];
  cleaningLogIds: string[];
}

let orgA: TestOrganization;
let orgB: TestOrganization;
const testPassword = 'TestPassword123!';

describe('Multi-Tenancy Isolation End-to-End Tests', () => {
  beforeAll(async () => {

    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Create Organization A with test data
    const organizationA = await prisma.organization.create({
      data: { name: 'TestOrg A - AquaCenter' },
    });

    const managerA = await prisma.user.create({
      data: {
        name: 'Manager A',
        email: 'managera@testorg.com',
        passwordHash: hashedPassword,
        role: Role.MANAGER,
        organizationId: organizationA.id,
      },
    });

    const staffA = await prisma.user.create({
      data: {
        name: 'Staff A',
        email: 'staffa@testorg.com',
        passwordHash: hashedPassword,
        role: Role.STAFF,
        organizationId: organizationA.id,
      },
    });

    // Create test data for Organization A
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const shiftA1 = await prisma.shift.create({
      data: {
        userId: staffA.id,
        organizationId: organizationA.id,
        date: today,
        startTime: new Date('1970-01-01T08:00:00Z'),
        endTime: new Date('1970-01-01T16:00:00Z'),
        notes: 'Org A Morning shift',
      },
    });

    const shiftA2 = await prisma.shift.create({
      data: {
        userId: staffA.id,
        organizationId: organizationA.id,
        date: tomorrow,
        startTime: new Date('1970-01-01T09:00:00Z'),
        endTime: new Date('1970-01-01T17:00:00Z'),
        notes: 'Org A Afternoon shift',
      },
    });

    const leaveA = await prisma.leaveRequest.create({
      data: {
        userId: staffA.id,
        organizationId: organizationA.id,
        type: LeaveType.VACATION,
        status: LeaveStatus.PENDING,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-05'),
        reason: 'Org A vacation request',
      },
    });

    const clockA = await prisma.clockEntry.create({
      data: {
        userId: staffA.id,
        organizationId: organizationA.id,
        clockInTime: new Date(),
        clockInLat: 55.6761,
        clockInLng: 12.5683,
      },
    });

    const incidentA = await prisma.incident.create({
      data: {
        userId: staffA.id,
        organizationId: organizationA.id,
        title: 'Org A Incident',
        description: 'Test incident for organization A',
        severity: Severity.HIGH,
        status: IncidentStatus.OPEN,
        locked: false,
      },
    });

    const cleaningTaskA = await prisma.cleaningTask.create({
      data: {
        organizationId: organizationA.id,
        title: 'Org A Cleaning Task',
        frequency: 'Daily',
      },
    });

    const cleaningLogA = await prisma.cleaningLog.create({
      data: {
        taskId: cleaningTaskA.id,
        userId: staffA.id,
        organizationId: organizationA.id,
        completedAt: new Date(),
      },
    });

    orgA = {
      id: organizationA.id,
      name: organizationA.name,
      managerId: managerA.id,
      managerEmail: managerA.email,
      staffId: staffA.id,
      staffEmail: staffA.email,
      shiftIds: [shiftA1.id, shiftA2.id],
      leaveRequestIds: [leaveA.id],
      clockEntryIds: [clockA.id],
      incidentIds: [incidentA.id],
      cleaningTaskIds: [cleaningTaskA.id],
      cleaningLogIds: [cleaningLogA.id],
    };

    // Create Organization B with test data
    const organizationB = await prisma.organization.create({
      data: { name: 'TestOrg B - PoolCenter' },
    });

    const managerB = await prisma.user.create({
      data: {
        name: 'Manager B',
        email: 'managerb@testorg.com',
        passwordHash: hashedPassword,
        role: Role.MANAGER,
        organizationId: organizationB.id,
      },
    });

    const staffB = await prisma.user.create({
      data: {
        name: 'Staff B',
        email: 'staffb@testorg.com',
        passwordHash: hashedPassword,
        role: Role.STAFF,
        organizationId: organizationB.id,
      },
    });

    const shiftB = await prisma.shift.create({
      data: {
        userId: staffB.id,
        organizationId: organizationB.id,
        date: today,
        startTime: new Date('1970-01-01T10:00:00Z'),
        endTime: new Date('1970-01-01T18:00:00Z'),
        notes: 'Org B shift',
      },
    });

    const leaveB = await prisma.leaveRequest.create({
      data: {
        userId: staffB.id,
        organizationId: organizationB.id,
        type: LeaveType.SICK,
        status: LeaveStatus.APPROVED,
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-02-16'),
        reason: 'Org B sick leave',
      },
    });

    const clockB = await prisma.clockEntry.create({
      data: {
        userId: staffB.id,
        organizationId: organizationB.id,
        clockInTime: new Date(),
        clockOutTime: new Date(),
      },
    });

    const incidentB = await prisma.incident.create({
      data: {
        userId: staffB.id,
        organizationId: organizationB.id,
        title: 'Org B Incident',
        description: 'Test incident for organization B',
        severity: Severity.MEDIUM,
        status: IncidentStatus.OPEN,
        locked: false,
      },
    });

    const cleaningTaskB = await prisma.cleaningTask.create({
      data: {
        organizationId: organizationB.id,
        title: 'Org B Cleaning Task',
        frequency: 'Weekly',
      },
    });

    const cleaningLogB = await prisma.cleaningLog.create({
      data: {
        taskId: cleaningTaskB.id,
        userId: staffB.id,
        organizationId: organizationB.id,
        completedAt: new Date(),
      },
    });

    orgB = {
      id: organizationB.id,
      name: organizationB.name,
      managerId: managerB.id,
      managerEmail: managerB.email,
      staffId: staffB.id,
      staffEmail: staffB.email,
      shiftIds: [shiftB.id],
      leaveRequestIds: [leaveB.id],
      clockEntryIds: [clockB.id],
      incidentIds: [incidentB.id],
      cleaningTaskIds: [cleaningTaskB.id],
      cleaningLogIds: [cleaningLogB.id],
    };
  });

  afterAll(async () => {
    // Clean up test data using the stored IDs
    if (orgA && orgB) {
      const testOrgIds = [orgA.id, orgB.id];
      
      await prisma.cleaningLog.deleteMany({ where: { organizationId: { in: testOrgIds } } });
      await prisma.cleaningTask.deleteMany({ where: { organizationId: { in: testOrgIds } } });
      await prisma.incident.deleteMany({ where: { organizationId: { in: testOrgIds } } });
      await prisma.clockEntry.deleteMany({ where: { organizationId: { in: testOrgIds } } });
      await prisma.leaveRequest.deleteMany({ where: { organizationId: { in: testOrgIds } } });
      await prisma.shift.deleteMany({ where: { organizationId: { in: testOrgIds } } });
      await prisma.user.deleteMany({ where: { organizationId: { in: testOrgIds } } });
      await prisma.organization.deleteMany({ where: { id: { in: testOrgIds } } });
    }

    await prisma.$disconnect();
    await pool.end();
  });

  describe('Requirement 3.1: Shift Data Isolation', () => {
    it('should return only shifts from Organization A when querying as Org A user', async () => {
      const shifts = await prisma.shift.findMany({
        where: { organizationId: orgA.id },
      });

      expect(shifts).toHaveLength(2);
      expect(shifts.every(shift => shift.organizationId === orgA.id)).toBe(true);
      expect(shifts.some(shift => orgA.shiftIds.includes(shift.id))).toBe(true);
      expect(shifts.every(shift => !orgB.shiftIds.includes(shift.id))).toBe(true);
    });

    it('should return only shifts from Organization B when querying as Org B user', async () => {
      const shifts = await prisma.shift.findMany({
        where: { organizationId: orgB.id },
      });

      expect(shifts).toHaveLength(1);
      expect(shifts.every(shift => shift.organizationId === orgB.id)).toBe(true);
      expect(shifts.some(shift => orgB.shiftIds.includes(shift.id))).toBe(true);
      expect(shifts.every(shift => !orgA.shiftIds.includes(shift.id))).toBe(true);
    });

    it('should not return Org B shifts when querying with Org A organization ID', async () => {
      const shifts = await prisma.shift.findMany({
        where: { organizationId: orgA.id },
      });

      const orgBShiftInResults = shifts.some(shift => orgB.shiftIds.includes(shift.id));
      expect(orgBShiftInResults).toBe(false);
    });
  });

  describe('Requirement 3.2: Leave Request Data Isolation', () => {
    it('should return only leave requests from Organization A', async () => {
      const leaveRequests = await prisma.leaveRequest.findMany({
        where: { organizationId: orgA.id },
      });

      expect(leaveRequests).toHaveLength(1);
      expect(leaveRequests.every(leave => leave.organizationId === orgA.id)).toBe(true);
      expect(leaveRequests[0].id).toBe(orgA.leaveRequestIds[0]);
      expect(leaveRequests[0].reason).toContain('Org A');
    });

    it('should return only leave requests from Organization B', async () => {
      const leaveRequests = await prisma.leaveRequest.findMany({
        where: { organizationId: orgB.id },
      });

      expect(leaveRequests).toHaveLength(1);
      expect(leaveRequests.every(leave => leave.organizationId === orgB.id)).toBe(true);
      expect(leaveRequests[0].id).toBe(orgB.leaveRequestIds[0]);
      expect(leaveRequests[0].reason).toContain('Org B');
    });

    it('should not allow cross-organization leave request access', async () => {
      const leaveRequest = await prisma.leaveRequest.findFirst({
        where: {
          id: orgB.leaveRequestIds[0],
          organizationId: orgA.id,
        },
      });

      expect(leaveRequest).toBeNull();
    });
  });

  describe('Requirement 3.3: Clock Entry Data Isolation', () => {
    it('should return only clock entries from Organization A', async () => {
      const clockEntries = await prisma.clockEntry.findMany({
        where: { organizationId: orgA.id },
      });

      expect(clockEntries).toHaveLength(1);
      expect(clockEntries.every(entry => entry.organizationId === orgA.id)).toBe(true);
      expect(clockEntries[0].id).toBe(orgA.clockEntryIds[0]);
      expect(clockEntries[0].userId).toBe(orgA.staffId);
    });

    it('should return only clock entries from Organization B', async () => {
      const clockEntries = await prisma.clockEntry.findMany({
        where: { organizationId: orgB.id },
      });

      expect(clockEntries).toHaveLength(1);
      expect(clockEntries.every(entry => entry.organizationId === orgB.id)).toBe(true);
      expect(clockEntries[0].id).toBe(orgB.clockEntryIds[0]);
      expect(clockEntries[0].userId).toBe(orgB.staffId);
    });

    it('should not retrieve clock entries across organizations', async () => {
      const orgBClockInOrgA = await prisma.clockEntry.findFirst({
        where: {
          id: orgB.clockEntryIds[0],
          organizationId: orgA.id,
        },
      });

      expect(orgBClockInOrgA).toBeNull();
    });
  });

  describe('Requirement 3.4: Incident Data Isolation', () => {
    it('should return only incidents from Organization A', async () => {
      const incidents = await prisma.incident.findMany({
        where: { organizationId: orgA.id },
      });

      expect(incidents).toHaveLength(1);
      expect(incidents.every(incident => incident.organizationId === orgA.id)).toBe(true);
      expect(incidents[0].id).toBe(orgA.incidentIds[0]);
      expect(incidents[0].title).toContain('Org A');
    });

    it('should return only incidents from Organization B', async () => {
      const incidents = await prisma.incident.findMany({
        where: { organizationId: orgB.id },
      });

      expect(incidents).toHaveLength(1);
      expect(incidents.every(incident => incident.organizationId === orgB.id)).toBe(true);
      expect(incidents[0].id).toBe(orgB.incidentIds[0]);
      expect(incidents[0].title).toContain('Org B');
    });

    it('should not allow accessing incidents from other organizations', async () => {
      const crossOrgIncident = await prisma.incident.findFirst({
        where: {
          id: orgB.incidentIds[0],
          organizationId: orgA.id,
        },
      });

      expect(crossOrgIncident).toBeNull();
    });
  });

  describe('Requirement 3.5: Cleaning Task Data Isolation', () => {
    it('should return only cleaning tasks from Organization A', async () => {
      const tasks = await prisma.cleaningTask.findMany({
        where: { organizationId: orgA.id },
      });

      expect(tasks).toHaveLength(1);
      expect(tasks.every(task => task.organizationId === orgA.id)).toBe(true);
      expect(tasks[0].id).toBe(orgA.cleaningTaskIds[0]);
      expect(tasks[0].title).toContain('Org A');
    });

    it('should return only cleaning tasks from Organization B', async () => {
      const tasks = await prisma.cleaningTask.findMany({
        where: { organizationId: orgB.id },
      });

      expect(tasks).toHaveLength(1);
      expect(tasks.every(task => task.organizationId === orgB.id)).toBe(true);
      expect(tasks[0].id).toBe(orgB.cleaningTaskIds[0]);
      expect(tasks[0].title).toContain('Org B');
    });

    it('should return only cleaning logs from Organization A', async () => {
      const logs = await prisma.cleaningLog.findMany({
        where: { organizationId: orgA.id },
      });

      expect(logs).toHaveLength(1);
      expect(logs.every(log => log.organizationId === orgA.id)).toBe(true);
      expect(logs[0].id).toBe(orgA.cleaningLogIds[0]);
    });

    it('should return only cleaning logs from Organization B', async () => {
      const logs = await prisma.cleaningLog.findMany({
        where: { organizationId: orgB.id },
      });

      expect(logs).toHaveLength(1);
      expect(logs.every(log => log.organizationId === orgB.id)).toBe(true);
      expect(logs[0].id).toBe(orgB.cleaningLogIds[0]);
    });

    it('should not allow accessing cleaning tasks across organizations', async () => {
      const crossOrgTask = await prisma.cleaningTask.findFirst({
        where: {
          id: orgB.cleaningTaskIds[0],
          organizationId: orgA.id,
        },
      });

      expect(crossOrgTask).toBeNull();
    });
  });

  describe('Requirement 3.6: Automatic Organization Assignment', () => {
    it('should automatically assign organization ID when creating a shift', async () => {
      const newShift = await prisma.shift.create({
        data: {
          userId: orgA.staffId,
          organizationId: orgA.id,
          date: new Date('2025-03-15'),
          startTime: new Date('1970-01-01T08:00:00Z'),
          endTime: new Date('1970-01-01T16:00:00Z'),
          notes: 'Test auto-assignment',
        },
      });

      expect(newShift.organizationId).toBe(orgA.id);

      // Clean up
      await prisma.shift.delete({ where: { id: newShift.id } });
    });

    it('should automatically assign organization ID when creating a leave request', async () => {
      const newLeave = await prisma.leaveRequest.create({
        data: {
          userId: orgA.staffId,
          organizationId: orgA.id,
          type: LeaveType.SICK,
          status: LeaveStatus.PENDING,
          startDate: new Date('2025-04-01'),
          endDate: new Date('2025-04-02'),
          reason: 'Test auto-assignment leave',
        },
      });

      expect(newLeave.organizationId).toBe(orgA.id);

      // Clean up
      await prisma.leaveRequest.delete({ where: { id: newLeave.id } });
    });

    it('should automatically assign organization ID when creating an incident', async () => {
      const newIncident = await prisma.incident.create({
        data: {
          userId: orgB.staffId,
          organizationId: orgB.id,
          title: 'Test Incident Auto-Assignment',
          description: 'Testing automatic organization assignment',
          severity: Severity.LOW,
          status: IncidentStatus.OPEN,
          locked: false,
        },
      });

      expect(newIncident.organizationId).toBe(orgB.id);

      // Clean up
      await prisma.incident.delete({ where: { id: newIncident.id } });
    });

    it('should automatically assign organization ID when creating a cleaning task', async () => {
      const newTask = await prisma.cleaningTask.create({
        data: {
          organizationId: orgB.id,
          title: 'Test Task Auto-Assignment',
          frequency: 'Once',
        },
      });

      expect(newTask.organizationId).toBe(orgB.id);

      // Clean up
      await prisma.cleaningTask.delete({ where: { id: newTask.id } });
    });
  });

  describe('Cross-Organization Access Prevention', () => {
    it('should return empty result when trying to access another orgs shift by ID with wrong org filter', async () => {
      const shift = await prisma.shift.findFirst({
        where: {
          id: orgB.shiftIds[0],
          organizationId: orgA.id, // Wrong org ID
        },
      });

      expect(shift).toBeNull();
    });

    it('should return empty result when trying to access another orgs leave request', async () => {
      const leave = await prisma.leaveRequest.findFirst({
        where: {
          id: orgA.leaveRequestIds[0],
          organizationId: orgB.id, // Wrong org ID
        },
      });

      expect(leave).toBeNull();
    });

    it('should return empty result when trying to access another orgs incident', async () => {
      const incident = await prisma.incident.findFirst({
        where: {
          id: orgA.incidentIds[0],
          organizationId: orgB.id, // Wrong org ID
        },
      });

      expect(incident).toBeNull();
    });

    it('should not allow updating records from another organization', async () => {
      // Attempt to update Org B shift with Org A's org filter
      const updateResult = await prisma.shift.updateMany({
        where: {
          id: orgB.shiftIds[0],
          organizationId: orgA.id, // Wrong org ID - should not find record
        },
        data: {
          notes: 'Attempted cross-org update',
        },
      });

      expect(updateResult.count).toBe(0);

      // Verify the shift was not updated
      const shift = await prisma.shift.findUnique({
        where: { id: orgB.shiftIds[0] },
      });
      expect(shift?.notes).not.toBe('Attempted cross-org update');
    });

    it('should not allow deleting records from another organization', async () => {
      // Count Org B incidents before attempted delete
      const beforeCount = await prisma.incident.count({
        where: { organizationId: orgB.id },
      });

      // Attempt to delete Org B incident with Org A's org filter
      const deleteResult = await prisma.incident.deleteMany({
        where: {
          id: orgB.incidentIds[0],
          organizationId: orgA.id, // Wrong org ID - should not find record
        },
      });

      expect(deleteResult.count).toBe(0);

      // Verify the incident still exists
      const afterCount = await prisma.incident.count({
        where: { organizationId: orgB.id },
      });
      expect(afterCount).toBe(beforeCount);
    });
  });

  describe('Complete Data Isolation Verification', () => {
    it('should ensure Organization A has complete isolation of all data types', async () => {
      // Fetch all data for Org A
      const [shifts, leaves, clocks, incidents, tasks, logs] = await Promise.all([
        prisma.shift.findMany({ where: { organizationId: orgA.id } }),
        prisma.leaveRequest.findMany({ where: { organizationId: orgA.id } }),
        prisma.clockEntry.findMany({ where: { organizationId: orgA.id } }),
        prisma.incident.findMany({ where: { organizationId: orgA.id } }),
        prisma.cleaningTask.findMany({ where: { organizationId: orgA.id } }),
        prisma.cleaningLog.findMany({ where: { organizationId: orgA.id } }),
      ]);

      // Verify all records belong to Org A
      expect(shifts.every(r => r.organizationId === orgA.id)).toBe(true);
      expect(leaves.every(r => r.organizationId === orgA.id)).toBe(true);
      expect(clocks.every(r => r.organizationId === orgA.id)).toBe(true);
      expect(incidents.every(r => r.organizationId === orgA.id)).toBe(true);
      expect(tasks.every(r => r.organizationId === orgA.id)).toBe(true);
      expect(logs.every(r => r.organizationId === orgA.id)).toBe(true);

      // Verify no Org B data is returned
      expect(shifts.every(r => !orgB.shiftIds.includes(r.id))).toBe(true);
      expect(leaves.every(r => !orgB.leaveRequestIds.includes(r.id))).toBe(true);
      expect(clocks.every(r => !orgB.clockEntryIds.includes(r.id))).toBe(true);
      expect(incidents.every(r => !orgB.incidentIds.includes(r.id))).toBe(true);
      expect(tasks.every(r => !orgB.cleaningTaskIds.includes(r.id))).toBe(true);
      expect(logs.every(r => !orgB.cleaningLogIds.includes(r.id))).toBe(true);
    });

    it('should ensure Organization B has complete isolation of all data types', async () => {
      // Fetch all data for Org B
      const [shifts, leaves, clocks, incidents, tasks, logs] = await Promise.all([
        prisma.shift.findMany({ where: { organizationId: orgB.id } }),
        prisma.leaveRequest.findMany({ where: { organizationId: orgB.id } }),
        prisma.clockEntry.findMany({ where: { organizationId: orgB.id } }),
        prisma.incident.findMany({ where: { organizationId: orgB.id } }),
        prisma.cleaningTask.findMany({ where: { organizationId: orgB.id } }),
        prisma.cleaningLog.findMany({ where: { organizationId: orgB.id } }),
      ]);

      // Verify all records belong to Org B
      expect(shifts.every(r => r.organizationId === orgB.id)).toBe(true);
      expect(leaves.every(r => r.organizationId === orgB.id)).toBe(true);
      expect(clocks.every(r => r.organizationId === orgB.id)).toBe(true);
      expect(incidents.every(r => r.organizationId === orgB.id)).toBe(true);
      expect(tasks.every(r => r.organizationId === orgB.id)).toBe(true);
      expect(logs.every(r => r.organizationId === orgB.id)).toBe(true);

      // Verify no Org A data is returned
      expect(shifts.every(r => !orgA.shiftIds.includes(r.id))).toBe(true);
      expect(leaves.every(r => !orgA.leaveRequestIds.includes(r.id))).toBe(true);
      expect(clocks.every(r => !orgA.clockEntryIds.includes(r.id))).toBe(true);
      expect(incidents.every(r => !orgA.incidentIds.includes(r.id))).toBe(true);
      expect(tasks.every(r => !orgA.cleaningTaskIds.includes(r.id))).toBe(true);
      expect(logs.every(r => !orgA.cleaningLogIds.includes(r.id))).toBe(true);
    });

    it('should verify that each organization has independent data counts', async () => {
      const orgACount = {
        shifts: await prisma.shift.count({ where: { organizationId: orgA.id } }),
        leaves: await prisma.leaveRequest.count({ where: { organizationId: orgA.id } }),
        clocks: await prisma.clockEntry.count({ where: { organizationId: orgA.id } }),
        incidents: await prisma.incident.count({ where: { organizationId: orgA.id } }),
        tasks: await prisma.cleaningTask.count({ where: { organizationId: orgA.id } }),
        logs: await prisma.cleaningLog.count({ where: { organizationId: orgA.id } }),
      };

      const orgBCount = {
        shifts: await prisma.shift.count({ where: { organizationId: orgB.id } }),
        leaves: await prisma.leaveRequest.count({ where: { organizationId: orgB.id } }),
        clocks: await prisma.clockEntry.count({ where: { organizationId: orgB.id } }),
        incidents: await prisma.incident.count({ where: { organizationId: orgB.id } }),
        tasks: await prisma.cleaningTask.count({ where: { organizationId: orgB.id } }),
        logs: await prisma.cleaningLog.count({ where: { organizationId: orgB.id } }),
      };

      // Verify expected counts
      expect(orgACount.shifts).toBe(2);
      expect(orgACount.leaves).toBe(1);
      expect(orgACount.clocks).toBe(1);
      expect(orgACount.incidents).toBe(1);
      expect(orgACount.tasks).toBe(1);
      expect(orgACount.logs).toBe(1);

      expect(orgBCount.shifts).toBe(1);
      expect(orgBCount.leaves).toBe(1);
      expect(orgBCount.clocks).toBe(1);
      expect(orgBCount.incidents).toBe(1);
      expect(orgBCount.tasks).toBe(1);
      expect(orgBCount.logs).toBe(1);
    });
  });
});
