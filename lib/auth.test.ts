import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, type Session } from './auth';

describe('Authentication Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      // bcrypt generates unique salts, so hashes should be different
      expect(hash1).not.toBe(hash2);
    });

    it('should hash different passwords to different values', async () => {
      const password1 = 'password123';
      const password2 = 'differentPassword456';
      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should hash empty string', async () => {
      const password = '';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should hash long passwords', async () => {
      const password = 'a'.repeat(100);
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for matching password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);
      
      expect(isValid).toBe(false);
    });

    it('should return false for empty password against hashed password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('', hash);
      
      expect(isValid).toBe(false);
    });

    it('should return false for invalid hash format', async () => {
      const password = 'testPassword123';
      const invalidHash = 'not-a-valid-hash';
      const isValid = await verifyPassword(password, invalidHash);
      
      expect(isValid).toBe(false);
    });

    it('should verify password with special characters', async () => {
      const password = 'p@ssw0rd!#$%';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should be case sensitive', async () => {
      const password = 'TestPassword';
      const hash = await hashPassword(password);
      const isValidLower = await verifyPassword('testpassword', hash);
      const isValidUpper = await verifyPassword('TESTPASSWORD', hash);
      const isValidCorrect = await verifyPassword('TestPassword', hash);
      
      expect(isValidLower).toBe(false);
      expect(isValidUpper).toBe(false);
      expect(isValidCorrect).toBe(true);
    });
  });

  describe('Session type', () => {
    it('should have correct type structure', () => {
      const session: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: 'MANAGER',
        name: 'John Doe',
        email: 'john@example.com',
      };
      
      expect(session.userId).toBe('user-123');
      expect(session.organizationId).toBe('org-456');
      expect(session.role).toBe('MANAGER');
      expect(session.name).toBe('John Doe');
      expect(session.email).toBe('john@example.com');
    });

    it('should accept STAFF role', () => {
      const session: Session = {
        userId: 'user-123',
        organizationId: 'org-456',
        role: 'STAFF',
        name: 'Jane Smith',
        email: 'jane@example.com',
      };
      
      expect(session.role).toBe('STAFF');
    });
  });
});
