/**
 * API Endpoint Integration Tests
 * Tests the /api/starters endpoints with real API calls
 */

describe('API Endpoints - /api/starters', () => {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  describe('GET /api/starters', () => {
    test('should return 200 status', async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      expect(response.status).toBe(200);
    });

    test('should return valid JSON array', async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('should return array with starter objects', async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      const data = await response.json();

      expect(data.length).toBeGreaterThan(0);

      // Check first starter has required fields
      const firstStarter = data[0];
      expect(firstStarter).toHaveProperty('id');
      expect(firstStarter).toHaveProperty('name');
      expect(firstStarter).toHaveProperty('title');
      expect(firstStarter).toHaveProperty('description');
      expect(firstStarter).toHaveProperty('links');
      expect(firstStarter.links).toHaveProperty('github');
    });

    test('should return proper cache headers', async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      const cacheControl = response.headers.get('cache-control');

      expect(cacheControl).toBeTruthy();
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('s-maxage');
    });
  });

  describe('GET /api/starters/[slug]/readme', () => {
    let knownRepoSlug;

    beforeAll(async () => {
      // Get a known repo slug from the starters list
      const response = await fetch(`${BASE_URL}/api/starters`);
      const data = await response.json();

      if (data.length > 0) {
        knownRepoSlug = data[0].name;
      }
    });

    test('should return 200 for known repo', async () => {
      if (!knownRepoSlug) {
        console.warn('No repos available, skipping test');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/starters/${knownRepoSlug}/readme`);
      expect(response.status).toBe(200);
    });

    test('should return markdown content', async () => {
      if (!knownRepoSlug) {
        console.warn('No repos available, skipping test');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/starters/${knownRepoSlug}/readme`);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json();
      expect(data).toHaveProperty('content');
      expect(typeof data.content).toBe('string');
      expect(data.content.length).toBeGreaterThan(0);
    });

    test('should have proper cache headers', async () => {
      if (!knownRepoSlug) {
        console.warn('No repos available, skipping test');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/starters/${knownRepoSlug}/readme`);
      const cacheControl = response.headers.get('cache-control');

      expect(cacheControl).toBeTruthy();
    });
  });
});

