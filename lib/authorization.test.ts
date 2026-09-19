import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Role } from '@prisma/client';
import {
  getSession,
  requireAuth,
  requireManager,
  requireStaff,
  hasRole,
  isManager,
  isStaff,
  UnauthorizedError,
  ForbiddenError,
  type Session,
} from './authorization';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

const { cookies } = await import('next/headers');

describe('Authorization Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSession', () => {
    it('should return null when no session cookie exists', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null when session cookie value is empty', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: '' }),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return session when valid session cookie exists', async () => {
      const validSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(validSession) }),
      } as any);

      const session = await getSession();
      expect(session).toEqual(validSession);
    });

    it('should return session with STAFF role', async () => {
      const validSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(validSession) }),
      } as any);

      const session = await getSession();
      expect(session).toEqual(validSession);
    });

    it('should return null when session cookie contains invalid JSON', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: 'invalid-json{' }),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null when session is missing userId', async () => {
      const invalidSession = {
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(invalidSession) }),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null when session is missing organizationId', async () => {
      const invalidSession = {
        userId: 'user-123',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(invalidSession) }),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null when session is missing role', async () => {
      const invalidSession = {
        userId: 'user-123',
        organizationId: 'org-456',
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(invalidSession) }),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null when session is missing name', async () => {
      const invalidSession = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(invalidSession) }),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null when session is missing email', async () => {
      const invalidSession = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(invalidSession) }),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null when role is invalid', async () => {
      const invalidSession = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: 'INVALID_ROLE',
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(invalidSession) }),
      } as any);

      const session = await getSession();
      expect(session).toBeNull();
    });
  });

  describe('requireAuth', () => {
    it('should return session when authenticated without role requirement', async () => {
      const validSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(validSession) }),
      } as any);

      const session = await requireAuth();
      expect(session).toEqual(validSession);
    });

    it('should throw UnauthorizedError when no session exists', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      await expect(requireAuth()).rejects.toThrow(UnauthorizedError);
      await expect(requireAuth()).rejects.toThrow('Authentication required. Please log in.');
    });

    it('should return session when role matches requirement', async () => {
      const managerSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(managerSession) }),
      } as any);

      const session = await requireAuth(Role.MANAGER);
      expect(session).toEqual(managerSession);
    });

    it('should throw ForbiddenError when role does not match requirement', async () => {
      const staffSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(staffSession) }),
      } as any);

      await expect(requireAuth(Role.MANAGER)).rejects.toThrow(ForbiddenError);
      await expect(requireAuth(Role.MANAGER)).rejects.toThrow(
        'This operation requires MANAGER role. Your role is STAFF.'
      );
    });

    it('should allow STAFF user when STAFF role is required', async () => {
      const staffSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(staffSession) }),
      } as any);

      const session = await requireAuth(Role.STAFF);
      expect(session).toEqual(staffSession);
    });

    it('should throw ForbiddenError when MANAGER tries to access STAFF-only endpoint', async () => {
      const managerSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(managerSession) }),
      } as any);

      await expect(requireAuth(Role.STAFF)).rejects.toThrow(ForbiddenError);
      await expect(requireAuth(Role.STAFF)).rejects.toThrow(
        'This operation requires STAFF role. Your role is MANAGER.'
      );
    });
  });

  describe('requireManager', () => {
    it('should return session when user is a manager', async () => {
      const managerSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(managerSession) }),
      } as any);

      const session = await requireManager();
      expect(session).toEqual(managerSession);
    });

    it('should throw ForbiddenError when user is staff', async () => {
      const staffSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(staffSession) }),
      } as any);

      await expect(requireManager()).rejects.toThrow(ForbiddenError);
    });

    it('should throw UnauthorizedError when no session exists', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      await expect(requireManager()).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('requireStaff', () => {
    it('should return session when user is staff', async () => {
      const staffSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(staffSession) }),
      } as any);

      const session = await requireStaff();
      expect(session).toEqual(staffSession);
    });

    it('should throw ForbiddenError when user is manager', async () => {
      const managerSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(managerSession) }),
      } as any);

      await expect(requireStaff()).rejects.toThrow(ForbiddenError);
    });

    it('should throw UnauthorizedError when no session exists', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      await expect(requireStaff()).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the specified role (MANAGER)', async () => {
      const managerSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(managerSession) }),
      } as any);

      const result = await hasRole(Role.MANAGER);
      expect(result).toBe(true);
    });

    it('should return true when user has the specified role (STAFF)', async () => {
      const staffSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(staffSession) }),
      } as any);

      const result = await hasRole(Role.STAFF);
      expect(result).toBe(true);
    });

    it('should return false when user does not have the specified role', async () => {
      const staffSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(staffSession) }),
      } as any);

      const result = await hasRole(Role.MANAGER);
      expect(result).toBe(false);
    });

    it('should return false when no session exists', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const result = await hasRole(Role.MANAGER);
      expect(result).toBe(false);
    });
  });

  describe('isManager', () => {
    it('should return true when user is a manager', async () => {
      const managerSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(managerSession) }),
      } as any);

      const result = await isManager();
      expect(result).toBe(true);
    });

    it('should return false when user is staff', async () => {
      const staffSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(staffSession) }),
      } as any);

      const result = await isManager();
      expect(result).toBe(false);
    });

    it('should return false when no session exists', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const result = await isManager();
      expect(result).toBe(false);
    });
  });

  describe('isStaff', () => {
    it('should return true when user is staff', async () => {
      const staffSession: Session = {
        userId: 'user-789',
        organizationId: 'org-456',
        role: Role.STAFF,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(staffSession) }),
      } as any);

      const result = await isStaff();
      expect(result).toBe(true);
    });

    it('should return false when user is a manager', async () => {
      const managerSession: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: Role.MANAGER,
        name: 'John Doe',
        email: 'john@example.com',
      };

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: JSON.stringify(managerSession) }),
      } as any);

      const result = await isStaff();
      expect(result).toBe(false);
    });

    it('should return false when no session exists', async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const result = await isStaff();
      expect(result).toBe(false);
    });
  });

  describe('Error types', () => {
    it('should create UnauthorizedError with default message', () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe('Authentication required');
      expect(error.name).toBe('UnauthorizedError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create UnauthorizedError with custom message', () => {
      const error = new UnauthorizedError('Custom auth message');
      expect(error.message).toBe('Custom auth message');
      expect(error.name).toBe('UnauthorizedError');
    });

    it('should create ForbiddenError with default message', () => {
      const error = new ForbiddenError();
      expect(error.message).toBe('Insufficient permissions');
      expect(error.name).toBe('ForbiddenError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create ForbiddenError with custom message', () => {
      const error = new ForbiddenError('Custom permission message');
      expect(error.message).toBe('Custom permission message');
      expect(error.name).toBe('ForbiddenError');
    });
  });
});
