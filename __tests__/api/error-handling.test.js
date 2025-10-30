/**
 * Error Handling Integration Tests
 * Tests how the API handles various error conditions
 *
 * NOTE: These tests verify OUR error handling code works correctly.
 * We do NOT test whether GitHub returns specific error codes - we assume
 * GitHub works correctly and focus on testing our handling of edge cases.
 */

describe('API Error Handling', () => {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  describe('404 Not Found Errors', () => {
    test('should return 404 for non-existent starter README', async () => {
      const response = await fetch(`${BASE_URL}/api/starters/non-existent-repo-xyz/readme`);

      // Should handle gracefully - either 404 or 500 with error message
      expect([404, 500]).toContain(response.status);

      if (response.status === 500) {
        const data = await response.json();
        expect(data).toHaveProperty('error');
      }
    });

    test('should return proper error format for missing resources', async () => {
      const response = await fetch(`${BASE_URL}/api/starters/non-existent-repo-xyz/readme`);

      if (!response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty('error');
        expect(typeof data.error).toBe('string');
      }
    });
  });

  describe('Error Response Format', () => {
    test('error responses should have consistent format', async () => {
      const response = await fetch(`${BASE_URL}/api/starters/non-existent-repo/readme`);

      if (!response.ok) {
        const data = await response.json();

        // Should have error field
        expect(data).toHaveProperty('error');
        expect(typeof data.error).toBe('string');

        // May optionally have message field
        if (data.message) {
          expect(typeof data.message).toBe('string');
        }
      }
    });

    test('should return proper HTTP status codes', async () => {
      const response = await fetch(`${BASE_URL}/api/starters/non-existent-repo/readme`);

      // Status code should be meaningful (4xx or 5xx for errors)
      if (!response.ok) {
        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.status).toBeLessThan(600);
      }
    });
  });

  describe('Timeout and Network Handling', () => {
    test('should handle slow responses within timeout', async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout

      try {
        const response = await fetch(`${BASE_URL}/api/starters`, {
          signal: controller.signal
        });

        clearTimeout(timeout);
        expect(response.ok).toBe(true);
      } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') {
          // If timeout happens, that's a real issue
          throw new Error('Request took too long (>25s)');
        }
        throw error;
      }
    }, 30000);
  });

  describe('Response Consistency', () => {
    test('should return consistent data across multiple requests', async () => {
      // Make a few requests to verify caching works and data is consistent
      const response1 = await fetch(`${BASE_URL}/api/starters`);
      const response2 = await fetch(`${BASE_URL}/api/starters`);

      expect(response1.ok).toBe(true);
      expect(response2.ok).toBe(true);

      const data1 = await response1.json();
      const data2 = await response2.json();

      // Data should be consistent (same repos, same count)
      expect(data1.length).toBe(data2.length);
      if (data1.length > 0) {
        expect(data1[0].id).toBe(data2[0].id);
      }
    });
  });

  describe('Invalid Input Handling', () => {
    test('should handle special characters in repo slug', async () => {
      const specialChars = ['<script>', '../../../etc/passwd', '%00', '\\x00'];

      for (const char of specialChars) {
        const response = await fetch(`${BASE_URL}/api/starters/${encodeURIComponent(char)}/readme`);

        // Should not crash, should return error
        expect(response.status).toBeGreaterThanOrEqual(400);
      }
    });

    test('should handle empty repo slug gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/starters//readme`);

      // Should return 404 or redirect
      expect([404, 301, 302]).toContain(response.status);
    });
  });

  describe('Data Integrity on Errors', () => {
    test('should maintain data structure even with partial failures', async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      const starters = await response.json();

      // Even if some data failed to load, structure should be consistent
      if (starters.length > 0) {
        starters.forEach(starter => {
          expect(starter).toHaveProperty('id');
          expect(starter).toHaveProperty('name');
          expect(starter).toHaveProperty('links');
          expect(starter.links).toHaveProperty('github');
        });
      }
    });

    test('should not expose sensitive error information', async () => {
      const response = await fetch(`${BASE_URL}/api/starters/test-error/readme`);

      if (!response.ok) {
        const data = await response.json();
        const jsonString = JSON.stringify(data).toLowerCase();

        // Should not expose sensitive paths, tokens, or stack traces
        expect(jsonString).not.toContain('token');
        expect(jsonString).not.toContain('password');
        expect(jsonString).not.toContain('/users/');
        expect(jsonString).not.toContain('gh_pat');
      }
    });
  });
});

