/**
 * Data Transformation Unit Tests
 * Tests the transformation logic in src/lib/github.ts
 */

// Mock data for testing
const mockRepoWithoutConfig = {
  id: 12345,
  name: 'test-starter',
  full_name: 'deepgram-starters/test-starter',
  description: 'A test starter repository',
  private: false,
  html_url: 'https://github.com/deepgram-starters/test-starter',
  clone_url: 'https://github.com/deepgram-starters/test-starter.git',
  language: 'JavaScript',
  topics: ['deepgram', 'starter', 'test'],
  stargazers_count: 42,
  forks_count: 7,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-10-01T00:00:00Z',
  pushed_at: '2024-10-01T00:00:00Z',
  owner: {
    login: 'deepgram-starters',
    avatar_url: 'https://avatars.githubusercontent.com/u/12345',
    html_url: 'https://github.com/deepgram-starters',
  },
};

const mockRepoWithConfig = {
  ...mockRepoWithoutConfig,
  id: 67890,
  name: 'configured-starter',
  repo_config: {
    meta: {
      title: 'Configured Starter Title',
      description: 'A configured starter with TOML metadata',
      language: 'TypeScript',
      framework: 'Next.js',
      useCase: 'Speech-to-Text',
    },
    vertical: 'AI/ML',
    tags: ['ai', 'speech', 'nextjs'],
    links: {
      docs: 'https://docs.example.com',
      demo: 'https://demo.example.com',
      video: 'https://youtube.com/watch?v=example',
    },
    // COMMENTED OUT: Deploy feature not yet implemented
    // deployment: {
    //   supported: ['digital ocean', 'fly.io, 'vercel', 'netlify, '],
    // },
  },
};

describe('Data Transformation - transformToProcessedStarters', () => {
  // We'll need to import or fetch the actual function
  // For now, testing through the API endpoint
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  describe('Transformation with valid repo data', () => {
    let processedStarters;

    beforeAll(async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      if (response.ok) {
        processedStarters = await response.json();
      }
    });

    test('should properly format repo name when no title in config', () => {
      const startersWithoutTitle = processedStarters.filter(s => !s.config?.meta?.title);

      if (startersWithoutTitle.length > 0) {
        const starter = startersWithoutTitle[0];

        // Title should be formatted from repo name (e.g., "node-live-transcription" -> "Node Live Transcription")
        expect(starter.title).not.toBe(starter.name);
        expect(starter.title.length).toBeGreaterThan(0);

        // Should capitalize words
        const words = starter.title.split(' ');
        words.forEach(word => {
          if (word.length > 0) {
            expect(word[0]).toBe(word[0].toUpperCase());
          }
        });
      }
    });

    test('should use TOML title when available', () => {
      const startersWithTitle = processedStarters.filter(s => s.config?.meta?.title);

      if (startersWithTitle.length > 0) {
        const starter = startersWithTitle[0];
        expect(starter.title).toBe(starter.config.meta.title);
      }
    });
  });

  describe('Handling optional fields', () => {
    let processedStarters;

    beforeAll(async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      if (response.ok) {
        processedStarters = await response.json();
      }
    });

    test('should handle missing framework gracefully', () => {
      processedStarters.forEach(starter => {
        // Framework is optional, so it might be undefined
        if (starter.framework !== undefined) {
          expect(typeof starter.framework).toBe('string');
        }
      });
    });

    test('should handle missing category gracefully', () => {
      processedStarters.forEach(starter => {
        // Category is optional
        if (starter.category !== undefined) {
          expect(typeof starter.category).toBe('string');
        }
      });
    });

    test('should handle missing vertical gracefully', () => {
      processedStarters.forEach(starter => {
        // Vertical is optional
        if (starter.vertical !== undefined) {
          expect(typeof starter.vertical).toBe('string');
        }
      });
    });

    test('should handle missing optional links gracefully', () => {
      processedStarters.forEach(starter => {
        expect(starter.links).toBeDefined();
        expect(starter.links.github).toBeTruthy();

        // Optional links can be undefined
        // Just verify they're either string or undefined
        if (starter.links.docs !== undefined) {
          expect(typeof starter.links.docs).toBe('string');
        }
        if (starter.links.demo !== undefined) {
          expect(typeof starter.links.demo).toBe('string');
        }
        if (starter.links.video !== undefined) {
          expect(typeof starter.links.video).toBe('string');
        }
      });
    });

    test('should use fallback description when none provided', () => {
      processedStarters.forEach(starter => {
        expect(starter.description).toBeDefined();
        expect(starter.description).not.toBe('');
        expect(typeof starter.description).toBe('string');
      });
    });

    test('should handle tags from both TOML and GitHub topics', () => {
      processedStarters.forEach(starter => {
        if (starter.tags) {
          expect(Array.isArray(starter.tags)).toBe(true);
          starter.tags.forEach(tag => {
            expect(typeof tag).toBe('string');
          });
        }
      });
    });
  });

  describe('TOML config merging', () => {
    let processedStarters;

    beforeAll(async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      if (response.ok) {
        processedStarters = await response.json();
      }
    });

    test('should merge TOML config with repo data when available', () => {
      const startersWithConfig = processedStarters.filter(s => s.config);

      expect(startersWithConfig.length).toBeGreaterThan(0);

      startersWithConfig.forEach(starter => {
        // Should have the config included
        expect(starter.config).toBeDefined();

        // Should have base repo data
        expect(starter.id).toBeDefined();
        expect(starter.name).toBeDefined();
        expect(starter.links.github).toBeDefined();
        expect(starter.stats).toBeDefined();
      });
    });

    test('should prioritize TOML metadata over GitHub data', () => {
      const startersWithMeta = processedStarters.filter(s => s.config?.meta);

      if (startersWithMeta.length > 0) {
        const starter = startersWithMeta[0];

        // If TOML has title, it should be used over formatted repo name
        if (starter.config.meta.title) {
          expect(starter.title).toBe(starter.config.meta.title);
        }

        // If TOML has description, it should be used over GitHub description
        if (starter.config.meta.description) {
          expect(starter.description).toBe(starter.config.meta.description);
        }

        // If TOML has language, it should be used
        if (starter.config.meta.language) {
          expect(starter.language).toBe(starter.config.meta.language);
        }
      }
    });

    test('should include full config for detailed views', () => {
      const startersWithConfig = processedStarters.filter(s => s.config);

      if (startersWithConfig.length > 0) {
        const starter = startersWithConfig[0];

        // The full config should be preserved
        expect(starter.config).toBeDefined();
        expect(typeof starter.config).toBe('object');
      }
    });
  });

  describe('Data type validation', () => {
    let processedStarters;

    beforeAll(async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      if (response.ok) {
        processedStarters = await response.json();
      }
    });

    test('should have correct data types for all fields', () => {
      processedStarters.forEach(starter => {
        expect(typeof starter.id).toBe('number');
        expect(typeof starter.name).toBe('string');
        expect(typeof starter.title).toBe('string');
        expect(typeof starter.description).toBe('string');
        expect(typeof starter.language).toBe('string');
        expect(typeof starter.links).toBe('object');
        expect(typeof starter.links.github).toBe('string');
        expect(typeof starter.stats).toBe('object');
        expect(typeof starter.stats.stars).toBe('number');
        expect(typeof starter.stats.forks).toBe('number');
        expect(typeof starter.stats.lastUpdated).toBe('string');
      });
    });
  });
});

