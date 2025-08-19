import {
  clamp,
  mapRange,
  getEntriesForYear,
  getPrefilledBoxes,
  getBoxes
} from '../core';
import { Entry, Box, ColorsList, TrackerData, TrackerSettings } from '../../types';

describe('Core Utilities', () => {
  const mockColorsList: ColorsList = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  
  const mockTrackerData: TrackerData = {
    entries: [],
    year: 2023,
    colorScheme: {},
    showCurrentDayBorder: false,
    defaultEntryIntensity: 1,
    intensityScaleStart: undefined,
    intensityScaleEnd: undefined,
    intensityConfig: {
      scaleStart: 0,
      scaleEnd: 10,
      defaultIntensity: 1,
      showOutOfRange: true
    },
    insights: []
  };

  const mockSettings: TrackerSettings = {
    weekStartDay: 1, // Monday
    weekDisplayMode: 'all',
    separateMonths: false,
    language: 'en',
    palettes: {},
    viewTabsVisibility: {}
  };

  describe('clamp', () => {
    it('should clamp value within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should handle inverted bounds', () => {
      expect(clamp(5, 10, 0)).toBe(10);
    });

    it('should handle equal bounds', () => {
      expect(clamp(5, 3, 3)).toBe(3);
    });
  });

  describe('mapRange', () => {
    it('should map value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
      expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
      expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
    });

    it('should handle negative ranges', () => {
      expect(mapRange(-5, -10, 0, 0, 100)).toBe(50);
    });

    it('should clamp result to output range', () => {
      expect(mapRange(15, 0, 10, 0, 100)).toBe(100);
      expect(mapRange(-5, 0, 10, 0, 100)).toBe(0);
    });

    it('should handle inverted ranges', () => {
      const result = mapRange(5, 0, 10, 100, 0);
      expect(result).toBe(50);
    });
  });

  describe('getEntriesForYear', () => {
    const entries: Entry[] = [
      { date: '2023-01-01', intensity: 1 },
      { date: '2023-06-15', intensity: 5 },
      { date: '2024-01-01', intensity: 3 },
      { date: '2022-12-31', intensity: 2 },
      { date: 'invalid-date', intensity: 4 }
    ];

    it('should filter entries for specific year', () => {
      const result = getEntriesForYear(entries, 2023);
      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2023-01-01');
      expect(result[1].date).toBe('2023-06-15');
    });

    it('should return empty array for year with no entries', () => {
      const result = getEntriesForYear(entries, 2025);
      expect(result).toHaveLength(0);
    });

    it('should handle invalid dates by excluding them', () => {
      const result = getEntriesForYear(entries, 2023);
      expect(result).not.toContainEqual(expect.objectContaining({ date: 'invalid-date' }));
    });

    it('should handle empty entries array', () => {
      const result = getEntriesForYear([], 2023);
      expect(result).toHaveLength(0);
    });
  });

  describe('getPrefilledBoxes', () => {
    it('should create correct number of prefilled boxes', () => {
      const result = getPrefilledBoxes(3);
      expect(result).toHaveLength(3);
      
      result.forEach(box => {
        expect(box.backgroundColor).toBe('transparent');
        expect(box.isSpaceBetweenBox).toBe(true);
      });
    });

    it('should handle zero prefilled days', () => {
      const result = getPrefilledBoxes(0);
      expect(result).toHaveLength(0);
    });

    it('should throw error for invalid input', () => {
      expect(() => getPrefilledBoxes(NaN)).toThrow('numberOfEmptyDaysBeforeYearBegins must be a number');
    });

    it('should handle large numbers', () => {
      const result = getPrefilledBoxes(10);
      expect(result).toHaveLength(10);
    });
  });

  describe('getBoxes', () => {
    const mockEntriesWithIntensity = {
      1: { date: '2023-01-01', intensity: 3 },
      100: { date: '2023-04-10', intensity: 7 }
    };

    it('should generate boxes for entire year', () => {
      const result = getBoxes(2023, {}, mockColorsList, mockTrackerData, mockSettings);
      
      // Should have 365 days + any prefilled days for 2023
      expect(result.length).toBeGreaterThan(365);
      
      // Check first few boxes have correct structure
      const firstDataBox = result.find(box => !box.isSpaceBetweenBox);
      expect(firstDataBox).toBeDefined();
      expect(firstDataBox?.date).toBeTruthy();
      expect(firstDataBox?.name).toMatch(/^month-/);
    });

    it('should handle entries with intensity', () => {
      const result = getBoxes(2023, mockEntriesWithIntensity, mockColorsList, mockTrackerData, mockSettings);
      
      const boxWithData = result.find(box => box.hasData);
      expect(boxWithData).toBeDefined();
      expect(boxWithData?.backgroundColor).toBeTruthy();
    });

    it('should handle today\'s date correctly', () => {
      const currentYear = new Date().getFullYear();
      const result = getBoxes(currentYear, {}, mockColorsList, {
        ...mockTrackerData,
        showCurrentDayBorder: true
      }, mockSettings);
      
      // Should find today's box if we're testing current year
      const todayBox = result.find(box => box.isToday);
      if (todayBox) {
        expect(todayBox.showBorder).toBe(true);
      }
    });

    it('should handle separate months setting', () => {
      const separateMonthsData = {
        ...mockTrackerData,
        separateMonths: true
      };

      const result = getBoxes(2023, {}, mockColorsList, separateMonthsData, mockSettings);
      
      // Should have more boxes due to month separators
      expect(result.length).toBeGreaterThan(365);
      
      const spaceBoxes = result.filter(box => box.isSpaceBetweenBox);
      expect(spaceBoxes.length).toBeGreaterThan(0);
    });

    it('should handle entries with metadata', () => {
      const entriesWithMetadata = {
        100: {
          date: '2023-04-10',
          intensity: 5,
          metadata: {
            documentCount: 2,
            channels: ['twitter', 'linkedin'],
            documents: [
              { name: 'doc1.md', path: 'doc1.md', channels: ['twitter'] },
              { name: 'doc2.md', path: 'doc2.md', channels: ['linkedin'] }
            ]
          }
        }
      };

      const result = getBoxes(2023, entriesWithMetadata, mockColorsList, mockTrackerData, mockSettings);
      
      const boxWithMetadata = result.find(box => box.metadata);
      expect(boxWithMetadata).toBeDefined();
      expect(boxWithMetadata?.metadata?.documentCount).toBe(2);
      expect(boxWithMetadata?.metadata?.channels).toHaveLength(2);
    });

    it('should handle custom colors', () => {
      const entriesWithCustomColor = {
        50: {
          date: '2023-02-19',
          intensity: 5,
          customColor: '#ff0000'
        }
      };

      const result = getBoxes(2023, entriesWithCustomColor, mockColorsList, mockTrackerData, mockSettings);
      
      const customColorBox = result.find(box => box.backgroundColor === '#ff0000');
      expect(customColorBox).toBeDefined();
    });
  });

  describe('Multi-Channel Box Generation', () => {
    it('should create boxes with multi-document metadata', () => {
      const multiDocumentEntries = {
        150: {
          date: '2023-05-30',
          intensity: 8,
          metadata: {
            documentCount: 3,
            channels: ['twitter', 'linkedin', 'substack'],
            documents: [
              { name: 'post1.md', path: 'post1.md', channels: ['twitter', 'linkedin'] },
              { name: 'blog.md', path: 'blog.md', channels: ['substack'] },
              { name: 'update.md', path: 'update.md', channels: ['twitter'] }
            ]
          }
        }
      };

      const result = getBoxes(2023, multiDocumentEntries, mockColorsList, mockTrackerData, mockSettings);
      
      const multiBox = result.find(box => box.metadata?.documentCount && box.metadata.documentCount > 1);
      expect(multiBox).toBeDefined();
      expect(multiBox?.metadata?.documentCount).toBe(3);
      expect(multiBox?.metadata?.channels).toHaveLength(3);
      expect(multiBox?.metadata?.documents).toHaveLength(3);
    });

    it('should handle single document with multiple channels', () => {
      const singleDocMultiChannel = {
        200: {
          date: '2023-07-19',
          intensity: 6,
          metadata: {
            documentCount: 1,
            channels: ['twitter', 'instagram', 'tiktok'],
            documents: [
              { name: 'viral-content.md', path: 'viral-content.md', channels: ['twitter', 'instagram', 'tiktok'] }
            ]
          }
        }
      };

      const result = getBoxes(2023, singleDocMultiChannel, mockColorsList, mockTrackerData, mockSettings);
      
      const singleDocBox = result.find(box => box.metadata?.documentCount === 1 && (box.metadata?.channels?.length || 0) > 1);
      expect(singleDocBox).toBeDefined();
      expect(singleDocBox?.metadata?.documentCount).toBe(1);
      expect(singleDocBox?.metadata?.channels).toHaveLength(3);
    });

    it('should preserve content alongside metadata', () => {
      const entriesWithContentAndMetadata = {
        250: {
          date: '2023-09-07',
          intensity: 4,
          content: '<a data-href="test.md">Test Document</a>',
          metadata: {
            documentCount: 1,
            channels: ['linkedin'],
            documents: [{ name: 'test.md', path: 'test.md', channels: ['linkedin'] }]
          }
        }
      };

      const result = getBoxes(2023, entriesWithContentAndMetadata, mockColorsList, mockTrackerData, mockSettings);
      
      const contentBox = result.find(box => box.content && box.metadata);
      expect(contentBox).toBeDefined();
      expect(contentBox?.content).toBeTruthy();
      expect(contentBox?.metadata?.documentCount).toBe(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle leap year correctly', () => {
      const result = getBoxes(2024, {}, mockColorsList, mockTrackerData, mockSettings);
      
      // Leap year should have 366 days
      const dataBoxes = result.filter(box => !box.isSpaceBetweenBox);
      expect(dataBoxes.length).toBeGreaterThanOrEqual(366);
    });

    it('should handle empty entries gracefully', () => {
      const result = getBoxes(2023, {}, mockColorsList, mockTrackerData, mockSettings);
      
      expect(result.length).toBeGreaterThan(0);
      const hasDataBoxes = result.filter(box => box.hasData);
      expect(hasDataBoxes.length).toBe(0);
    });

    it('should handle invalid year gracefully', () => {
      // Should not throw for reasonable invalid years
      expect(() => getBoxes(0, {}, mockColorsList, mockTrackerData, mockSettings)).not.toThrow();
      expect(() => getBoxes(-1, {}, mockColorsList, mockTrackerData, mockSettings)).not.toThrow();
    });

    it('should handle malformed entries', () => {
      const malformedEntries = {
        100: {
          date: '2023-04-10',
          intensity: 5,
          metadata: {
            // Missing documentCount
            channels: ['twitter'],
            documents: []
          }
        }
      };

      expect(() => getBoxes(2023, malformedEntries, mockColorsList, mockTrackerData, mockSettings)).not.toThrow();
    });

    it('should handle very large datasets', () => {
      const largeEntries: Record<number, any> = {};
      for (let i = 1; i <= 365; i++) {
        largeEntries[i] = {
          date: `2023-${String(Math.floor((i-1) / 31) + 1).padStart(2, '0')}-${String(((i-1) % 31) + 1).padStart(2, '0')}`,
          intensity: Math.floor(Math.random() * 10)
        };
      }

      const startTime = Date.now();
      const result = getBoxes(2023, largeEntries, mockColorsList, mockTrackerData, mockSettings);
      const endTime = Date.now();
      
      expect(result.length).toBeGreaterThan(365);
      expect(endTime - startTime).toBeLessThan(500); // Should process reasonably quickly
    });
  });

  describe('Box Content and Link Handling', () => {
    it('should preserve HTML content for legacy support', () => {
      const entriesWithHtmlContent = {
        100: {
          date: '2023-04-10',
          intensity: 5,
          content: '<a data-href="legacy-note.md">Legacy Note</a>'
        }
      };

      const result = getBoxes(2023, entriesWithHtmlContent, mockColorsList, mockTrackerData, mockSettings);
      
      const contentBox = result.find(box => box.content);
      expect(contentBox).toBeDefined();
      expect(contentBox?.content).toContain('legacy-note.md');
    });

    it('should handle mixed content types', () => {
      const mixedEntries = {
        100: {
          date: '2023-04-10',
          intensity: 3,
          content: 'Simple text content'
        },
        200: {
          date: '2023-07-19',
          intensity: 7,
          content: '<div><a href="test.md">Link Content</a></div>'
        }
      };

      const result = getBoxes(2023, mixedEntries, mockColorsList, mockTrackerData, mockSettings);
      
      const textBox = result.find(box => box.content === 'Simple text content');
      const htmlBox = result.find(box => typeof box.content === 'object');
      
      expect(textBox).toBeDefined();
      expect(htmlBox || result.find(box => typeof box.content === 'string' && (box.content as string).includes('<div>'))).toBeDefined();
    });
  });
});