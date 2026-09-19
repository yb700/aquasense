import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { destroySession } from '@/lib/session';
import { NextRequest } from 'next/server';

/**
 * Unit tests for logout API endpoint
 * 
 * Requirements tested:
 * - 1.3: WHEN an authenticated user requests logout, THE System SHALL terminate the session
 * - 15.1: THE System SHALL implement authentication endpoints at /api/auth/*
 * 
 * Design document: Authentication Module - logout function
 */

// Mock the session module
vi.mock('@/lib/session', () => ({
  destroySession: vi.fn(),
}));

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully log out and return success response', async () => {
    // Mock destroySession to succeed
    vi.mocked(destroySession).mockResolvedValue(undefined);

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Verify destroySession was called
    expect(destroySession).toHaveBeenCalledTimes(1);

    // Verify response
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      message: 'Logged out successfully',
    });
  });

  it('should return 500 if destroySession throws an error', async () => {
    // Mock destroySession to throw an error
    const error = new Error('Session destruction failed');
    vi.mocked(destroySession).mockRejectedValue(error);

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Verify destroySession was called
    expect(destroySession).toHaveBeenCalledTimes(1);

    // Verify error response
    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'An unexpected error occurred during logout',
      code: 'INTERNAL_ERROR',
    });
  });

  it('should succeed even when called multiple times', async () => {
    // Mock destroySession to succeed
    vi.mocked(destroySession).mockResolvedValue(undefined);

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });

    // Call the handler twice
    const response1 = await POST(request);
    const data1 = await response1.json();
    
    const response2 = await POST(request);
    const data2 = await response2.json();

    // Both calls should succeed
    expect(destroySession).toHaveBeenCalledTimes(2);
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(data1.success).toBe(true);
    expect(data2.success).toBe(true);
  });

  it('should not require any request body', async () => {
    // Mock destroySession to succeed
    vi.mocked(destroySession).mockResolvedValue(undefined);

    // Create a mock request with no body
    const request = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Should succeed without body
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should work even with request body present', async () => {
    // Mock destroySession to succeed
    vi.mocked(destroySession).mockResolvedValue(undefined);

    // Create a mock request with body (should be ignored)
    const request = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ someField: 'someValue' }),
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Should succeed and ignore body
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(destroySession).toHaveBeenCalledTimes(1);
  });
});
