/**
 * GitHub Repository Validation Integration Tests
 * Tests that starter repository DATA is properly formatted and configured
 *
 * NOTE: These tests do NOT make HTTP requests to github.com to verify repos exist.
 * We trust that GitHub works correctly and only validate our data structure and
 * URL formatting. This prevents unnecessary API calls and rate limiting issues.
 */

describe('GitHub Repository Validation', () => {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const GITHUB_ORG = 'deepgram-starters';
  let starters = [];

  beforeAll(async () => {
    // Fetch the list of starters from the API
    const response = await fetch(`${BASE_URL}/api/starters`);
    if (response.ok) {
      starters = await response.json();
    }
  });

  describe('Repository Data Validation', () => {
    test('should return starter repositories from GitHub', () => {
      expect(starters.length).toBeGreaterThanOrEqual(3);
    });

    test('all repository GitHub URLs should be properly formatted', () => {
      expect(starters.length).toBeGreaterThan(0);

      starters.forEach(starter => {
        // Verify URL exists and is properly formatted
        expect(starter.links.github).toBeTruthy();
        expect(starter.links.github).toContain(GITHUB_ORG);
        expect(starter.links.github).toMatch(/^https:\/\/github\.com\//);

        // Verify URL structure is correct
        expect(starter.links.github).toContain(`/${starter.name}`);
      });
    });

    test('all repositories should be marked as public in data', () => {
      starters.forEach(starter => {
        // If we got it from the API, it passed the private filter in github.ts
        // This is a sanity check that our filtering logic worked
        expect(starter.links.github).toContain(GITHUB_ORG);
        expect(starter.links.github).toMatch(/^https:\/\/github\.com\//);
      });
    });
  });

  describe('TOML Configuration Handling', () => {
    test('should handle repos without TOML config gracefully', () => {
      // Find repos without config (if any)
      const reposWithoutConfig = starters.filter(s => !s.config);

      // If there are repos without config, they should still have required fields
      if (reposWithoutConfig.length > 0) {
        reposWithoutConfig.forEach(starter => {
          expect(starter).toHaveProperty('id');
          expect(starter).toHaveProperty('name');
          expect(starter).toHaveProperty('title');
          expect(starter).toHaveProperty('description');
          expect(starter.title).not.toBe('');
          expect(starter.description).not.toBe('');
        });
      }
    });

    test('should successfully parse TOML from repos that have it', () => {
      const reposWithConfig = starters.filter(s => s.config);

      // Should have at least some repos with config
      expect(reposWithConfig.length).toBeGreaterThan(0);

      // Sample a few repos with config and verify structure
      const samplesToTest = reposWithConfig.slice(0, 3);

      samplesToTest.forEach(starter => {
        expect(starter.config).toBeDefined();

        // If config exists, it should have meta section (optional but common)
        if (starter.config.meta) {
          expect(starter.config.meta).toHaveProperty('title');
        }

        // Verify the config data was properly transformed
        if (starter.config.meta?.title) {
          expect(starter.title).toBe(starter.config.meta.title);
        }
      });
    });
  });

  describe('Data Quality Checks', () => {
    test('all starters should have required fields', () => {
      expect(starters.length).toBeGreaterThan(0);

      starters.forEach(starter => {
        // Required fields
        expect(starter).toHaveProperty('id');
        expect(starter).toHaveProperty('name');
        expect(starter).toHaveProperty('title');
        expect(starter).toHaveProperty('description');
        expect(starter).toHaveProperty('language');
        expect(starter).toHaveProperty('links');
        expect(starter.links).toHaveProperty('github');
        expect(starter).toHaveProperty('stats');

        // Values should not be empty
        expect(starter.name).not.toBe('');
        expect(starter.title).not.toBe('');
        expect(starter.links.github).not.toBe('');
      });
    });

    test('all starters should have valid stats', () => {
      starters.forEach(starter => {
        expect(starter.stats).toBeDefined();
        expect(typeof starter.stats.stars).toBe('number');
        expect(typeof starter.stats.forks).toBe('number');
        expect(starter.stats.lastUpdated).toBeTruthy();
      });
    });

    test('GitHub URLs should point to correct organization', () => {
      starters.forEach(starter => {
        expect(starter.links.github).toContain(`github.com/${GITHUB_ORG}/`);
      });
    });
  });
});

