import 'dotenv/config';
import { PrismaClient, LeaveType, LeaveStatus, Severity, IncidentStatus, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌊 Starting AquaSense database seeding...');

  // Clear existing data (in reverse order of dependencies)
  console.log('Clearing existing data...');
  await prisma.cleaningLog.deleteMany();
  await prisma.cleaningTask.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.clockEntry.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Hash password for all users (password: "password123")
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Organizations
  console.log('Creating organizations...');
  const org1 = await prisma.organization.create({
    data: {
      name: 'AquaCenter Copenhagen',
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      name: 'Aarhus Swimming Pool',
    },
  });

  // Create Users for Organization 1 (Copenhagen)
  console.log('Creating users...');
  await prisma.user.create({
    data: {
      name: 'Lars Jensen',
      email: 'lars@aquacenter.dk',
      passwordHash: hashedPassword,
      role: Role.MANAGER,
      organizationId: org1.id,
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      name: 'Emma Andersen',
      email: 'emma@aquacenter.dk',
      passwordHash: hashedPassword,
      role: Role.STAFF,
      organizationId: org1.id,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      name: 'Mikkel Nielsen',
      email: 'mikkel@aquacenter.dk',
      passwordHash: hashedPassword,
      role: Role.STAFF,
      organizationId: org1.id,
    },
  });

  // Create Users for Organization 2 (Aarhus)
  await prisma.user.create({
    data: {
      name: 'Sophie Hansen',
      email: 'sophie@aarhuspool.dk',
      passwordHash: hashedPassword,
      role: Role.MANAGER,
      organizationId: org2.id,
    },
  });

  const staff3 = await prisma.user.create({
    data: {
      name: 'Thomas Petersen',
      email: 'thomas@aarhuspool.dk',
      passwordHash: hashedPassword,
      role: Role.STAFF,
      organizationId: org2.id,
    },
  });

  // Create Shifts for Organization 1
  console.log('Creating shifts...');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.shift.createMany({
    data: [
      {
        userId: staff1.id,
        organizationId: org1.id,
        date: today,
        startTime: new Date('1970-01-01T08:00:00Z'),
        endTime: new Date('1970-01-01T16:00:00Z'),
        notes: 'Morning shift - lifeguard duty',
      },
      {
        userId: staff2.id,
        organizationId: org1.id,
        date: today,
        startTime: new Date('1970-01-01T14:00:00Z'),
        endTime: new Date('1970-01-01T22:00:00Z'),
        notes: 'Afternoon shift - pool maintenance',
      },
      {
        userId: staff1.id,
        organizationId: org1.id,
        date: tomorrow,
        startTime: new Date('1970-01-01T08:00:00Z'),
        endTime: new Date('1970-01-01T16:00:00Z'),
        notes: null,
      },
      {
        userId: staff2.id,
        organizationId: org1.id,
        date: nextWeek,
        startTime: new Date('1970-01-01T09:00:00Z'),
        endTime: new Date('1970-01-01T17:00:00Z'),
        notes: 'Weekend shift',
      },
    ],
  });

  // Create Shifts for Organization 2
  await prisma.shift.createMany({
    data: [
      {
        userId: staff3.id,
        organizationId: org2.id,
        date: today,
        startTime: new Date('1970-01-01T10:00:00Z'),
        endTime: new Date('1970-01-01T18:00:00Z'),
        notes: 'Regular shift',
      },
      {
        userId: staff3.id,
        organizationId: org2.id,
        date: tomorrow,
        startTime: new Date('1970-01-01T10:00:00Z'),
        endTime: new Date('1970-01-01T18:00:00Z'),
        notes: null,
      },
    ],
  });

  // Create Leave Requests
  console.log('Creating leave requests...');
  const futureDate1 = new Date(today);
  futureDate1.setDate(futureDate1.getDate() + 14);
  const futureDate2 = new Date(futureDate1);
  futureDate2.setDate(futureDate2.getDate() + 2);

  await prisma.leaveRequest.createMany({
    data: [
      {
        userId: staff1.id,
        organizationId: org1.id,
        type: LeaveType.VACATION,
        status: LeaveStatus.PENDING,
        startDate: futureDate1,
        endDate: futureDate2,
        reason: 'Family vacation planned for summer',
      },
      {
        userId: staff2.id,
        organizationId: org1.id,
        type: LeaveType.SICK,
        status: LeaveStatus.APPROVED,
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-16'),
        reason: 'Flu symptoms',
      },
      {
        userId: staff3.id,
        organizationId: org2.id,
        type: LeaveType.VACATION,
        status: LeaveStatus.REJECTED,
        startDate: futureDate1,
        endDate: futureDate2,
        reason: 'Personal reasons',
      },
    ],
  });

  // Create Clock Entries
  console.log('Creating clock entries...');
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.clockEntry.createMany({
    data: [
      {
        userId: staff1.id,
        organizationId: org1.id,
        clockInTime: new Date(yesterday.setHours(8, 0, 0, 0)),
        clockOutTime: new Date(yesterday.setHours(16, 0, 0, 0)),
        clockInLat: 55.6761,
        clockInLng: 12.5683,
        clockOutLat: 55.6761,
        clockOutLng: 12.5683,
      },
      {
        userId: staff2.id,
        organizationId: org1.id,
        clockInTime: new Date(yesterday.setHours(14, 0, 0, 0)),
        clockOutTime: new Date(yesterday.setHours(22, 0, 0, 0)),
        clockInLat: 55.6761,
        clockInLng: 12.5683,
        clockOutLat: 55.6761,
        clockOutLng: 12.5683,
      },
      {
        userId: staff1.id,
        organizationId: org1.id,
        clockInTime: new Date(today.setHours(8, 0, 0, 0)),
        clockOutTime: null, // Currently clocked in
        clockInLat: 55.6761,
        clockInLng: 12.5683,
        clockOutLat: null,
        clockOutLng: null,
      },
      {
        userId: staff3.id,
        organizationId: org2.id,
        clockInTime: new Date(yesterday.setHours(10, 0, 0, 0)),
        clockOutTime: new Date(yesterday.setHours(18, 0, 0, 0)),
        clockInLat: null, // No GPS coordinates
        clockInLng: null,
        clockOutLat: null,
        clockOutLng: null,
      },
    ],
  });

  // Create Incidents
  console.log('Creating incidents...');
  await prisma.incident.createMany({
    data: [
      {
        userId: staff1.id,
        organizationId: org1.id,
        title: 'Slippery floor near entrance',
        description: 'Water accumulation on the floor near the main entrance causing slip hazard. Immediate attention needed.',
        severity: Severity.HIGH,
        status: IncidentStatus.OPEN,
        imageUrl: null,
        locked: false,
      },
      {
        userId: staff2.id,
        organizationId: org1.id,
        title: 'Chlorine level slightly high',
        description: 'Morning chlorine test showed levels at 3.5 ppm, slightly above optimal range.',
        severity: Severity.MEDIUM,
        status: IncidentStatus.OPEN,
        imageUrl: null,
        locked: false,
      },
      {
        userId: staff1.id,
        organizationId: org1.id,
        title: 'Equipment malfunction',
        description: 'Pool vacuum stopped working during cleaning routine. May need repair or replacement.',
        severity: Severity.LOW,
        status: IncidentStatus.OPEN,
        imageUrl: null,
        locked: true, // Reviewed and locked by manager
      },
      {
        userId: staff3.id,
        organizationId: org2.id,
        title: 'Minor leak in changing room',
        description: 'Small leak detected in shower area, locker room B.',
        severity: Severity.MEDIUM,
        status: IncidentStatus.OPEN,
        imageUrl: null,
        locked: false,
      },
    ],
  });

  // Create Cleaning Tasks
  console.log('Creating cleaning tasks...');
  const task1 = await prisma.cleaningTask.create({
    data: {
      organizationId: org1.id,
      title: 'Test pool water chemistry',
      frequency: 'Every 2 hours during operation',
    },
  });

  const task2 = await prisma.cleaningTask.create({
    data: {
      organizationId: org1.id,
      title: 'Clean and disinfect changing rooms',
      frequency: 'Twice daily (morning and evening)',
    },
  });

  const task3 = await prisma.cleaningTask.create({
    data: {
      organizationId: org1.id,
      title: 'Vacuum pool floor',
      frequency: 'Daily before opening',
    },
  });

  const task4 = await prisma.cleaningTask.create({
    data: {
      organizationId: org1.id,
      title: 'Empty skimmer baskets',
      frequency: 'Every 4 hours',
    },
  });

  const task5 = await prisma.cleaningTask.create({
    data: {
      organizationId: org2.id,
      title: 'Check filtration system',
      frequency: 'Daily',
    },
  });

  const task6 = await prisma.cleaningTask.create({
    data: {
      organizationId: org2.id,
      title: 'Sanitize safety equipment',
      frequency: 'Weekly',
    },
  });

  // Create Cleaning Logs
  console.log('Creating cleaning logs...');
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  await prisma.cleaningLog.createMany({
    data: [
      {
        taskId: task1.id,
        userId: staff1.id,
        organizationId: org1.id,
        completedAt: new Date(yesterday.setHours(10, 0, 0, 0)),
      },
      {
        taskId: task1.id,
        userId: staff2.id,
        organizationId: org1.id,
        completedAt: new Date(yesterday.setHours(12, 0, 0, 0)),
      },
      {
        taskId: task1.id,
        userId: staff1.id,
        organizationId: org1.id,
        completedAt: new Date(yesterday.setHours(14, 0, 0, 0)),
      },
      {
        taskId: task2.id,
        userId: staff2.id,
        organizationId: org1.id,
        completedAt: new Date(yesterday.setHours(9, 0, 0, 0)),
      },
      {
        taskId: task2.id,
        userId: staff1.id,
        organizationId: org1.id,
        completedAt: new Date(yesterday.setHours(20, 0, 0, 0)),
      },
      {
        taskId: task3.id,
        userId: staff1.id,
        organizationId: org1.id,
        completedAt: new Date(yesterday.setHours(7, 30, 0, 0)),
      },
      {
        taskId: task4.id,
        userId: staff2.id,
        organizationId: org1.id,
        completedAt: new Date(yesterday.setHours(11, 0, 0, 0)),
      },
      {
        taskId: task5.id,
        userId: staff3.id,
        organizationId: org2.id,
        completedAt: new Date(yesterday.setHours(10, 30, 0, 0)),
      },
      {
        taskId: task6.id,
        userId: staff3.id,
        organizationId: org2.id,
        completedAt: new Date(twoDaysAgo.setHours(15, 0, 0, 0)),
      },
    ],
  });

  console.log('✅ Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Organizations: 2`);
  console.log(`   - Users: 5 (2 Managers, 3 Staff)`);
  console.log(`   - Shifts: 6`);
  console.log(`   - Leave Requests: 3`);
  console.log(`   - Clock Entries: 4`);
  console.log(`   - Incidents: 4`);
  console.log(`   - Cleaning Tasks: 6`);
  console.log(`   - Cleaning Logs: 9`);
  console.log('\n🔑 Login credentials (all users):');
  console.log('   Email: [user]@[organization].dk');
  console.log('   Password: password123');
  console.log('\n👤 Example accounts:');
  console.log('   Manager: lars@aquacenter.dk');
  console.log('   Staff: emma@aquacenter.dk');
  console.log('   Staff: mikkel@aquacenter.dk');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
