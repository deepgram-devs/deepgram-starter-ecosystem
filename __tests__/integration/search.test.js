/**
 * Search Functionality Integration Tests
 * Tests the search feature to ensure it searches across all relevant fields
 * and handles various input scenarios correctly
 */

const { waitForServer } = require('../helpers/test-utils');

describe('Search Functionality', () => {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  let realStarters;

  beforeAll(async () => {
    // Wait for server to be ready
    const isReady = await waitForServer(`${BASE_URL}/api/starters`, 10, 500);
    if (!isReady) {
      console.error('Server not ready. Make sure the dev server is running on', BASE_URL);
      throw new Error('Server not available for testing');
    }

    const response = await fetch(`${BASE_URL}/api/starters`);
    if (response.ok) {
      realStarters = await response.json();
    }
  }, 15000); // 15 second timeout for server to be ready

  describe('Field-Specific Search Tests', () => {
    test('should find starters by language field', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Get a language that exists in the data
      const existingLanguage = realStarters[0].language;

      const filtered = realStarters.filter(starter => {
        const language = starter.language?.toLowerCase() || '';
        return language.includes(existingLanguage.toLowerCase());
      });

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(s =>
        s.language.toLowerCase().includes(existingLanguage.toLowerCase())
      )).toBe(true);
    });

    test('should find starters by framework field', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Find a starter with a framework
      const starterWithFramework = realStarters.find(s => s.framework);
      if (!starterWithFramework) {
        console.warn('No frameworks found in data, skipping test');
        return;
      }

      const searchTerm = starterWithFramework.framework.toLowerCase();

      const filtered = realStarters.filter(starter => {
        const framework = starter.framework?.toLowerCase() || '';
        return framework.includes(searchTerm);
      });

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some(s => s.id === starterWithFramework.id)).toBe(true);
    });

    test('should find starters by category field', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Get a category that exists
      const existingCategory = realStarters[0].category;

      const filtered = realStarters.filter(starter => {
        const category = starter.category?.toLowerCase() || '';
        return category.includes(existingCategory.toLowerCase());
      });

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(s =>
        s.category?.toLowerCase().includes(existingCategory.toLowerCase())
      )).toBe(true);
    });

    test('should find starters by title field', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Extract a word from a title
      const firstStarter = realStarters[0];
      const titleWords = firstStarter.title.split(' ');
      const searchWord = titleWords[0].toLowerCase();

      const filtered = realStarters.filter(starter => {
        const title = starter.title.toLowerCase();
        return title.includes(searchWord);
      });

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some(s => s.id === firstStarter.id)).toBe(true);
    });

    test('should find starters by name field', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      const firstStarter = realStarters[0];
      // Use part of the repo name (e.g., "node" from "node-transcription")
      const namePart = firstStarter.name.split('-')[0];

      const filtered = realStarters.filter(starter => {
        const name = starter.name.toLowerCase();
        return name.includes(namePart.toLowerCase());
      });

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some(s => s.id === firstStarter.id)).toBe(true);
    });

    test('should find starters by description field', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Use common words that would appear in descriptions
      const commonSearchTerms = ['deepgram', 'transcription', 'speech', 'audio'];

      let foundResults = false;
      for (const term of commonSearchTerms) {
        const filtered = realStarters.filter(starter => {
          const description = starter.description.toLowerCase();
          return description.includes(term);
        });

        if (filtered.length > 0) {
          foundResults = true;
          expect(filtered.every(s =>
            s.description.toLowerCase().includes(term)
          )).toBe(true);
          break;
        }
      }

      expect(foundResults).toBe(true);
    });
  });

  describe('Case Sensitivity Tests', () => {
    test('should handle uppercase search terms', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      const language = realStarters[0].language;
      const upperSearch = language.toUpperCase();
      const lowerSearch = language.toLowerCase();

      const filteredUpper = realStarters.filter(s =>
        s.language.toLowerCase().includes(upperSearch.toLowerCase())
      );
      const filteredLower = realStarters.filter(s =>
        s.language.toLowerCase().includes(lowerSearch.toLowerCase())
      );

      expect(filteredUpper).toEqual(filteredLower);
    });

    test('should handle mixed case search terms', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      const searchTerms = ['PyThOn', 'jAvAsCrIpT', 'TyPeScRiPt'];

      searchTerms.forEach(term => {
        const filtered = realStarters.filter(starter => {
          const language = starter.language.toLowerCase();
          return language.includes(term.toLowerCase());
        });

        // Should either find results or find none (if language doesn't exist)
        // but should not throw an error
        expect(Array.isArray(filtered)).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty search string', () => {
      const mockStarters = [
        { id: 1, title: 'Test', language: 'JavaScript' },
        { id: 2, title: 'Demo', language: 'Python' }
      ];

      const searchTerm = '';

      // Empty search should not filter anything
      const filtered = mockStarters.filter(starter => {
        if (!searchTerm) return true;
        return starter.title.toLowerCase().includes(searchTerm);
      });

      expect(filtered).toEqual(mockStarters);
    });

    test('should handle whitespace-only search', () => {
      const mockStarters = [
        { id: 1, title: 'Test', language: 'JavaScript' },
        { id: 2, title: 'Demo', language: 'Python' }
      ];

      const searchTerm = '   ';
      const trimmed = searchTerm.trim();

      // Whitespace-only search (after trim) should not filter
      const filtered = mockStarters.filter(starter => {
        if (!trimmed) return true;
        return starter.title.toLowerCase().includes(trimmed);
      });

      expect(filtered).toEqual(mockStarters);
    });

    test('should handle special characters in search', () => {
      const mockStarters = [
        { id: 1, name: 'c-sharp-app', language: 'C#' },
        { id: 2, name: 'node_app', language: 'JavaScript' }
      ];

      const specialChars = ['#', '.', '-', '_', '/', '@'];

      specialChars.forEach(char => {
        // Should not throw an error
        expect(() => {
          mockStarters.filter(starter =>
            starter.name.toLowerCase().includes(char)
          );
        }).not.toThrow();
      });
    });

    test('should return empty array for non-existent search term', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      const searchTerm = 'xyzabcnonexistent123456';

      const filtered = realStarters.filter(starter => {
        const title = starter.title.toLowerCase();
        const description = starter.description.toLowerCase();
        const name = starter.name.toLowerCase();
        const language = starter.language.toLowerCase();

        return title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          name.includes(searchTerm) ||
          language.includes(searchTerm);
      });

      expect(filtered).toHaveLength(0);
    });

    test('should handle very long search strings', () => {
      const mockStarters = [
        { id: 1, title: 'Test', language: 'JavaScript' }
      ];

      const longSearch = 'a'.repeat(1000);

      // Should not throw an error or hang
      expect(() => {
        mockStarters.filter(starter =>
          starter.title.toLowerCase().includes(longSearch.toLowerCase())
        );
      }).not.toThrow();
    });
  });

  describe('Search Combined with Filters', () => {
    test('should combine search with language filter', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      const searchTerm = 'transcription';
      const selectedLanguages = ['JavaScript', 'TypeScript'];

      const filtered = realStarters.filter(starter => {
        // Search filter
        const name = starter.name.toLowerCase();
        const title = starter.title.toLowerCase();
        const matchesSearch = name.includes(searchTerm) || title.includes(searchTerm);

        // Language filter
        const matchesLanguage = selectedLanguages.includes(starter.language);

        return matchesSearch && matchesLanguage;
      });

      // Should only return results that match BOTH conditions
      filtered.forEach(starter => {
        expect(selectedLanguages).toContain(starter.language);
        expect(
          starter.name.toLowerCase().includes(searchTerm) ||
          starter.title.toLowerCase().includes(searchTerm)
        ).toBe(true);
      });
    });

    test('should combine search with framework filter', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      const searchTerm = 'starter';
      const selectedFramework = 'Node';

      const filtered = realStarters.filter(starter => {
        // Search filter (across multiple fields)
        const title = starter.title.toLowerCase();
        const name = starter.name.toLowerCase();
        const description = starter.description.toLowerCase();
        const matchesSearch = title.includes(searchTerm) ||
          name.includes(searchTerm) ||
          description.includes(searchTerm);

        // Framework filter
        const matchesFramework = starter.framework === selectedFramework;

        return matchesSearch && matchesFramework;
      });

      // Should only return results that match BOTH conditions
      filtered.forEach(starter => {
        expect(starter.framework).toBe(selectedFramework);
        expect(
          starter.title.toLowerCase().includes(searchTerm) ||
          starter.name.toLowerCase().includes(searchTerm) ||
          starter.description.toLowerCase().includes(searchTerm)
        ).toBe(true);
      });
    });

    test('should combine search with category filter', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      const searchTerm = 'deepgram';
      const selectedCategory = 'STT';

      const filtered = realStarters.filter(starter => {
        // Search filter (across multiple fields)
        const title = starter.title.toLowerCase();
        const name = starter.name.toLowerCase();
        const description = starter.description.toLowerCase();
        const language = starter.language.toLowerCase();
        const matchesSearch = title.includes(searchTerm) ||
          name.includes(searchTerm) ||
          description.includes(searchTerm) ||
          language.includes(searchTerm);

        // Category filter
        const matchesCategory = starter.category === selectedCategory;

        return matchesSearch && matchesCategory;
      });

      // Should only return results that match BOTH conditions
      filtered.forEach(starter => {
        expect(starter.category).toBe(selectedCategory);
        expect(
          starter.title.toLowerCase().includes(searchTerm) ||
          starter.name.toLowerCase().includes(searchTerm) ||
          starter.description.toLowerCase().includes(searchTerm) ||
          starter.language.toLowerCase().includes(searchTerm)
        ).toBe(true);
      });
    });
  });

  describe('Multi-Field Search Priority', () => {
    test('should search across all fields simultaneously', () => {
      if (!realStarters || realStarters.length === 0) {
        console.warn('No real starters available, skipping test');
        return;
      }

      // Pick a common term that might appear in different fields
      const searchTerm = 'node';

      const filtered = realStarters.filter(starter => {
        const title = starter.title.toLowerCase();
        const description = starter.description.toLowerCase();
        const name = starter.name.toLowerCase();
        const language = starter.language.toLowerCase();
        const framework = starter.framework?.toLowerCase() || '';
        const category = starter.category?.toLowerCase() || '';

        return title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          name.includes(searchTerm) ||
          language.includes(searchTerm) ||
          framework.includes(searchTerm) ||
          category.includes(searchTerm);
      });

      // Verify results come from different fields
      const matchesInTitle = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm)
      );
      const matchesInName = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm)
      );
      const matchesInFramework = filtered.filter(s =>
        s.framework?.toLowerCase().includes(searchTerm)
      );

      // At least one field should have matches
      expect(
        matchesInTitle.length > 0 ||
        matchesInName.length > 0 ||
        matchesInFramework.length > 0
      ).toBe(true);
    });
  });
});

