import { fillEntriesWithIntensity, getEntriesIntensities, getIntensitiesRanges } from '../intensity';
import { Entry, IntensityConfig, ColorsList } from '../../types';

describe('Intensity Utilities', () => {
  const mockColorsList: ColorsList = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  
  const basicIntensityConfig: IntensityConfig = {
    scaleStart: 0,
    scaleEnd: 10,
    defaultIntensity: 1,
    showOutOfRange: true
  };

  describe('getEntriesIntensities', () => {
    it('should extract intensities from entries', () => {
      const entries: Entry[] = [
        { date: '2023-05-15', intensity: 5 },
        { date: '2023-05-16', intensity: 3 },
        { date: '2023-05-17', intensity: 5 }, // duplicate
        { date: '2023-05-18', value: 2 } // no intensity
      ];
      
      const result = getEntriesIntensities(entries);
      expect(result).toEqual([5, 3]);
    });

    it('should handle empty entries array', () => {
      const result = getEntriesIntensities([]);
      expect(result).toEqual([]);
    });

    it('should filter out undefined intensities', () => {
      const entries: Entry[] = [
        { date: '2023-05-15', intensity: 5 },
        { date: '2023-05-16' }, // no intensity
        { date: '2023-05-17', intensity: 3 }
      ];
      
      const result = getEntriesIntensities(entries);
      expect(result).toEqual([5, 3]);
    });
  });

  describe('getIntensitiesRanges', () => {
    it('should generate correct intensity ranges', () => {
      const result = getIntensitiesRanges(3, 0, 100);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ min: 0, max: 33.333333333333336, intensity: 1 });
      expect(result[1]).toEqual({ min: 33.333333333333336, max: 66.66666666666667, intensity: 2 });
      expect(result[2]).toEqual({ min: 66.66666666666667, max: 100, intensity: 3 });
    });

    it('should handle single range', () => {
      const result = getIntensitiesRanges(1, 0, 10);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ min: 0, max: 10, intensity: 1 });
    });

    it('should handle inverted ranges', () => {
      const result = getIntensitiesRanges(2, 10, 0);
      expect(result).toHaveLength(2);
      expect(result[0].min).toBeGreaterThan(result[0].max);
    });
  });

  describe('Multi-Channel Intensity Processing', () => {
    it('should process entries with multi-channel metadata', () => {
      const entries: Entry[] = [{
        date: '2023-05-15',
        intensity: 2,
        metadata: {
          documentCount: 2,
          channels: ['twitter', 'linkedin'],
          documents: [
            { name: 'doc1.md', path: 'doc1.md', channels: ['twitter'] },
            { name: 'doc2.md', path: 'doc2.md', channels: ['linkedin'] }
          ]
        }
      }];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      const processedEntry = Object.values(result)[0];
      
      expect(processedEntry.metadata).toBeDefined();
      expect(processedEntry.metadata?.documentCount).toBe(2);
      expect(processedEntry.metadata?.channels).toEqual(['twitter', 'linkedin']);
    });

    it('should preserve multi-channel structure for single documents', () => {
      const entries: Entry[] = [{
        date: '2023-05-15',
        intensity: 3,
        metadata: {
          documentCount: 1,
          channels: ['twitter', 'instagram', 'linkedin'],
          documents: [
            { name: 'doc1.md', path: 'doc1.md', channels: ['twitter', 'instagram', 'linkedin'] }
          ]
        }
      }];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      const processedEntry = Object.values(result)[0];
      
      expect(processedEntry.metadata?.documentCount).toBe(1);
      expect(processedEntry.metadata?.channels).toHaveLength(3);
    });

    it('should handle overlapping channel configurations', () => {
      const entries: Entry[] = [{
        date: '2023-05-15',
        intensity: 5,
        metadata: {
          documentCount: 3,
          channels: ['twitter', 'linkedin', 'substack'],
          documents: [
            { name: 'doc1.md', path: 'doc1.md', channels: ['twitter', 'linkedin'] },
            { name: 'doc2.md', path: 'doc2.md', channels: ['twitter', 'substack'] },
            { name: 'doc3.md', path: 'doc3.md', channels: ['linkedin'] }
          ]
        }
      }];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      const processedEntry = Object.values(result)[0];
      
      expect(processedEntry.metadata?.channels).toEqual(['twitter', 'linkedin', 'substack']);
      expect(processedEntry.metadata?.documents).toHaveLength(3);
    });
  });

  describe('fillEntriesWithIntensity', () => {
    it('should process array of entries correctly', () => {
      const entries: Entry[] = [
        { date: '2023-05-15', intensity: 3 },
        { date: '2023-05-16', intensity: 7 },
        { date: '2023-05-17', value: 5 }
      ];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      
      expect(Object.keys(result)).toHaveLength(3);
      expect(result[135]).toBeDefined(); // Day 135 of year for May 15
      expect(result[136]).toBeDefined(); // Day 136 of year for May 16
      expect(result[137]).toBeDefined(); // Day 137 of year for May 17
    });

    it('should handle entries with custom colors', () => {
      const entries: Entry[] = [
        { date: '2023-05-15', intensity: 3, customColor: '#ff0000' }
      ];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      const entry = Object.values(result)[0];
      
      expect(entry.customColor).toBe('#ff0000');
    });

    it('should handle entries with metadata', () => {
      const entries: Entry[] = [
        { 
          date: '2023-05-15', 
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
      ];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      const entry = Object.values(result)[0];
      
      expect(entry.metadata).toBeDefined();
      expect(entry.metadata?.documentCount).toBe(2);
      expect(entry.metadata?.channels).toHaveLength(2);
    });

    it('should handle empty entries array', () => {
      const result = fillEntriesWithIntensity([], basicIntensityConfig, mockColorsList);
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should handle entries with invalid dates', () => {
      const entries: Entry[] = [
        { date: 'invalid-date', intensity: 3 },
        { date: '2023-05-15', intensity: 5 }
      ];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      
      // Should only process valid date
      expect(Object.keys(result)).toHaveLength(1);
    });
  });

  describe('Intensity Configuration Edge Cases', () => {
    it('should handle custom scale ranges', () => {
      const customConfig: IntensityConfig = {
        scaleStart: 1,
        scaleEnd: 100,
        defaultIntensity: 1,
        showOutOfRange: true
      };

      const entries: Entry[] = [{
        date: '2023-05-15',
        intensity: 50
      }];

      const result = fillEntriesWithIntensity(entries, customConfig, mockColorsList);
      expect(Object.keys(result)).toHaveLength(1);
    });

    it('should handle inverted scale ranges', () => {
      const invertedConfig: IntensityConfig = {
        scaleStart: 10,
        scaleEnd: 1,
        defaultIntensity: 5,
        showOutOfRange: true
      };

      const entries: Entry[] = [{
        date: '2023-05-15',
        intensity: 5
      }];

      const result = fillEntriesWithIntensity(entries, invertedConfig, mockColorsList);
      expect(Object.keys(result)).toHaveLength(1);
    });

    it('should handle zero scale range', () => {
      const zeroConfig: IntensityConfig = {
        scaleStart: 5,
        scaleEnd: 5,
        defaultIntensity: 5,
        showOutOfRange: false
      };

      const entries: Entry[] = [{
        date: '2023-05-15',
        intensity: 10
      }];

      const result = fillEntriesWithIntensity(entries, zeroConfig, mockColorsList);
      expect(Object.keys(result)).toHaveLength(1);
    });
  });

  describe('Multi-Channel Aggregation Strategies', () => {
    it('should aggregate intensity by document count', () => {
      const entries: Entry[] = [
        { 
          date: '2023-05-15',
          metadata: {
            documentCount: 3,
            channels: ['twitter', 'linkedin'],
            documents: Array(3).fill(0).map((_, i) => ({
              name: `doc${i}.md`,
              path: `doc${i}.md`,
              channels: ['twitter']
            }))
          }
        }
      ];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      const entry = Object.values(result)[0];
      
      expect(entry.metadata?.documentCount).toBe(3);
    });

    it('should aggregate intensity by channel diversity', () => {
      const entries: Entry[] = [
        { 
          date: '2023-05-15',
          metadata: {
            documentCount: 1,
            channels: ['twitter', 'instagram', 'linkedin', 'substack'],
            documents: [{
              name: 'doc1.md',
              path: 'doc1.md',
              channels: ['twitter', 'instagram', 'linkedin', 'substack']
            }]
          }
        }
      ];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      const entry = Object.values(result)[0];
      
      expect(entry.metadata?.channels).toHaveLength(4);
    });

    it('should handle mixed content strategies', () => {
      const entries: Entry[] = [
        { 
          date: '2023-05-15',
          metadata: {
            documentCount: 2,
            channels: ['twitter', 'linkedin', 'substack'],
            documents: [
              { name: 'blog-post.md', path: 'blog-post.md', channels: ['substack'] },
              { name: 'social-update.md', path: 'social-update.md', channels: ['twitter', 'linkedin'] }
            ]
          }
        }
      ];

      const result = fillEntriesWithIntensity(entries, basicIntensityConfig, mockColorsList);
      const entry = Object.values(result)[0];
      
      expect(entry.metadata?.documentCount).toBe(2);
      expect(entry.metadata?.channels).toHaveLength(3);
      expect(entry.metadata?.channels).toContain('twitter');
      expect(entry.metadata?.channels).toContain('linkedin');
      expect(entry.metadata?.channels).toContain('substack');
    });
  });

  describe('Performance and Large Data Sets', () => {
    it('should handle large number of entries efficiently', () => {
      const largeEntries: Entry[] = Array(365).fill(0).map((_, index) => ({
        date: `2023-${String(Math.floor(index / 31) + 1).padStart(2, '0')}-${String((index % 31) + 1).padStart(2, '0')}`,
        intensity: Math.floor(Math.random() * 10)
      }));

      const startTime = Date.now();
      const result = fillEntriesWithIntensity(largeEntries, basicIntensityConfig, mockColorsList);
      const endTime = Date.now();
      
      // Should process large dataset reasonably quickly (under 100ms)
      expect(endTime - startTime).toBeLessThan(100);
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should handle entries with many channels efficiently', () => {
      const manyChannelsEntry: Entry = {
        date: '2023-05-15',
        metadata: {
          documentCount: 1,
          channels: ['twitter', 'instagram', 'tiktok', 'facebook', 'linkedin', 'substack', 'youtube', 'pinterest'],
          documents: [{
            name: 'doc1.md',
            path: 'doc1.md',
            channels: ['twitter', 'instagram', 'tiktok', 'facebook', 'linkedin', 'substack', 'youtube', 'pinterest']
          }]
        }
      };

      const result = fillEntriesWithIntensity([manyChannelsEntry], basicIntensityConfig, mockColorsList);
      const entry = Object.values(result)[0];
      
      expect(entry.metadata?.channels).toHaveLength(8);
    });
  });
});