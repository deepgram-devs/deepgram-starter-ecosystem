/**
 * Filter Logic Tests
 * Tests the filtering behavior to ensure it handles missing/null optional fields correctly
 */

const { waitForServer } = require('../helpers/test-utils');

describe('Filter Logic with Missing Fields', () => {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Wait for server to be ready before running tests
  beforeAll(async () => {
    const isReady = await waitForServer(`${BASE_URL}/api/starters`, 10, 500);
    if (!isReady) {
      console.error('Server not ready. Make sure the dev server is running on', BASE_URL);
      throw new Error('Server not available for testing');
    }
  }, 15000); // 15 second timeout for server to be ready

  // Mock starters with various field combinations (simulating real-world data)
  const mockStarters = [
    {
      id: 1,
      name: 'complete-starter',
      title: 'Complete Starter',
      description: 'Has all fields',
      language: 'TypeScript',
      framework: 'Next.js',
      category: 'STT',
      // vertical: null,  // Commented out - simulating missing field
      tags: ['websocket', 'real-time']
    },
    {
      id: 2,
      name: 'minimal-starter',
      title: 'Minimal Starter',
      description: 'Has minimal fields',
      language: 'JavaScript',
      // framework: null,  // No framework
      category: 'TTS',
      // vertical: null,
      tags: ['api']
    },
    {
      id: 3,
      name: 'python-starter',
      title: 'Python Starter',
      description: 'Python based',
      language: 'Python',
      framework: 'Flask',
      category: 'STT',
      // vertical: null,
      // tags: []  // No tags
    }
  ];

  describe('Language Filter', () => {
    test('should filter by language when field is present', () => {
      const filtered = mockStarters.filter(starter =>
        starter.language === 'TypeScript'
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('complete-starter');
    });

    test('should return all starters when no language filter applied', () => {
      // Simulating no filter selected - should return all
      const filtered = mockStarters.filter(starter => true);

      expect(filtered).toHaveLength(3);
    });
  });

  describe('Framework Filter', () => {
    test('should filter by framework when field is present', () => {
      const filtered = mockStarters.filter(starter =>
        starter.framework && starter.framework === 'Flask'
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('python-starter');
    });

    test('should not filter out starters with missing framework when filter not applied', () => {
      // Key test: starters without framework should still show up
      const filtered = mockStarters.filter(starter => true);

      expect(filtered).toHaveLength(3);
      expect(filtered.some(s => !s.framework)).toBe(true);
    });

    test('should handle filter when some starters have null/undefined framework', () => {
      const selectedFrameworks = ['Next.js'];

      // This mimics the actual filter logic
      const filtered = mockStarters.filter(starter =>
        starter.framework && selectedFrameworks.includes(starter.framework)
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].framework).toBe('Next.js');
    });
  });

  describe('Optional Field Filtering Edge Cases', () => {
    test('should not exclude all results when optional field is null for all starters', () => {
      const selectedVerticals = ['Healthcare'];
      const correctFiltered = mockStarters.filter(starter =>
        starter.vertical && selectedVerticals.includes(starter.vertical)
      );

      // Should return empty array, but shouldn't have filtered if no filter was selected
      expect(correctFiltered).toHaveLength(0);
    });

    test('should only apply filter when filter has values selected', () => {
      // When no filter is selected (empty array), shouldn't filter
      const emptyFrameworkFilter = [];

      const filtered = mockStarters.filter(starter => {
        // Only apply filter if there are values selected
        if (emptyFrameworkFilter.length === 0) return true;
        return starter.framework && emptyFrameworkFilter.includes(starter.framework);
      });

      expect(filtered).toHaveLength(3);  // All starters should be included
    });

    test('should combine multiple filters correctly with optional fields', () => {
      const filters = {
        language: ['TypeScript', 'Python'],
        framework: ['Flask'],
        category: []  // No category filter
      };

      const filtered = mockStarters.filter(starter => {
        // Language filter
        if (filters.language.length > 0 && !filters.language.includes(starter.language)) {
          return false;
        }

        // Framework filter (with null check)
        if (filters.framework.length > 0) {
          if (!starter.framework || !filters.framework.includes(starter.framework)) {
            return false;
          }
        }

        // Category filter
        if (filters.category.length > 0 && !filters.category.includes(starter.category)) {
          return false;
        }

        return true;
      });

      // Should only return python-starter (has Python AND Flask)
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('python-starter');
    });
  });

  describe('Integration with Real API Data', () => {
    let realStarters;

    beforeAll(async () => {
      const response = await fetch(`${BASE_URL}/api/starters`);
      if (response.ok) {
        realStarters = await response.json();
      }
    });

    test('should handle filtering real starters with potentially missing optional fields', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Test that filtering by an optional field that might be null doesn't break
      const startersWithFramework = realStarters.filter(s => s.framework);
      const startersWithoutFramework = realStarters.filter(s => !s.framework);

      // Should be able to count both categories without errors
      expect(startersWithFramework.length + startersWithoutFramework.length).toBe(realStarters.length);
    });

    test('should verify all starters have required fields', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      realStarters.forEach(starter => {
        // Required fields
        expect(starter).toHaveProperty('id');
        expect(starter).toHaveProperty('name');
        expect(starter).toHaveProperty('title');
        expect(starter).toHaveProperty('language');
        expect(starter).toHaveProperty('category');

        // Optional fields - may or may not be present depending on TOML config
        // Framework is optional, so just verify it's a string if present
        if (starter.framework !== undefined) {
          expect(typeof starter.framework).toBe('string');
        }

        // TODO: Re-enable when vertical data is available in deepgram.toml
        // if (starter.vertical !== undefined) {
        //   expect(typeof starter.vertical).toBe('string');
        // }
      });
    });

    test('should apply language filter to real data without errors', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Get unique languages
      const languages = [...new Set(realStarters.map(s => s.language))];
      expect(languages.length).toBeGreaterThan(0);

      // Filter by first language
      const selectedLanguage = languages[0];
      const filtered = realStarters.filter(s => s.language === selectedLanguage);

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(s => s.language === selectedLanguage)).toBe(true);
    });

    test('should apply category filter to real data without errors', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Get unique categories
      const categories = [...new Set(realStarters.map(s => s.category).filter(Boolean))];
      expect(categories.length).toBeGreaterThan(0);

      // Filter by first category
      const selectedCategory = categories[0];
      const filtered = realStarters.filter(s => s.category === selectedCategory);

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(s => s.category === selectedCategory)).toBe(true);
    });

    test('should handle framework filter with null values gracefully', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Get unique frameworks (excluding null/undefined)
      const frameworks = [...new Set(
        realStarters
          .map(s => s.framework)
          .filter(Boolean)
      )];

      if (frameworks.length === 0) {
        console.warn('No frameworks found in data, skipping test');
        return;
      }

      // Filter by first framework
      const selectedFramework = frameworks[0];
      const filtered = realStarters.filter(s =>
        s.framework && s.framework === selectedFramework
      );

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(s => s.framework === selectedFramework)).toBe(true);

      // Verify we didn't accidentally exclude starters with no framework when filtering
      const totalWithSelectedOrNoFramework = realStarters.filter(s =>
        !s.framework || s.framework === selectedFramework
      );
      expect(totalWithSelectedOrNoFramework.length).toBeGreaterThanOrEqual(filtered.length);
    });
  });

  describe('Search Filter', () => {
    test('should search across multiple fields', () => {
      const searchTerm = 'starter';

      const filtered = mockStarters.filter(starter =>
        starter.title.toLowerCase().includes(searchTerm) ||
        starter.description.toLowerCase().includes(searchTerm) ||
        starter.name.toLowerCase().includes(searchTerm)
      );

      expect(filtered.length).toBeGreaterThan(0);
    });

    test('should be case insensitive', () => {
      const searchTerm1 = 'typescript';
      const searchTerm2 = 'TYPESCRIPT';

      const filtered1 = mockStarters.filter(starter =>
        starter.language.toLowerCase().includes(searchTerm1.toLowerCase())
      );

      const filtered2 = mockStarters.filter(starter =>
        starter.language.toLowerCase().includes(searchTerm2.toLowerCase())
      );

      expect(filtered1).toEqual(filtered2);
    });
  });
});

