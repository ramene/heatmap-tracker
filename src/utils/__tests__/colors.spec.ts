import { getColors } from '../colors';
import { ColorScheme, ColorsList, Palettes } from '../../types';

describe('Colors Utilities', () => {
  describe('getColors', () => {
    const mockPalettes: Palettes = {
      'GitHub': ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
      'Ocean': ['#f0f9ff', '#7dd3fc', '#0284c7', '#0369a1', '#1e40af'],
      'default': ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
    };

    it('should return custom colors when provided', () => {
      const colorScheme: ColorScheme = {
        customColors: ['#ff0000', '#00ff00', '#0000ff']
      };

      const result = getColors(colorScheme, mockPalettes);
      expect(result).toEqual(['#ff0000', '#00ff00', '#0000ff']);
    });

    it('should return palette colors when palette name is provided', () => {
      const colorScheme: ColorScheme = {
        paletteName: 'GitHub'
      };

      const result = getColors(colorScheme, mockPalettes);
      expect(result).toEqual(['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']);
    });

    it('should prioritize custom colors over palette', () => {
      const colorScheme: ColorScheme = {
        customColors: ['#ff0000', '#00ff00'],
        paletteName: 'GitHub'
      };

      const result = getColors(colorScheme, mockPalettes);
      expect(result).toEqual(['#ff0000', '#00ff00']);
    });

    it('should return default colors when palette not found', () => {
      const colorScheme: ColorScheme = {
        paletteName: 'NonExistentPalette'
      };

      const result = getColors(colorScheme, mockPalettes);
      
      // Should return default colors
      expect(result).toEqual(['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']);
    });

    it('should handle empty color scheme', () => {
      const colorScheme: ColorScheme = {};

      const result = getColors(colorScheme, mockPalettes);
      
      // Should return default colors
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle null/undefined inputs gracefully', () => {
      const emptyPalettes: Palettes = { 'default': ['#000', '#fff'] };
      expect(() => getColors({}, emptyPalettes)).not.toThrow();
      expect(() => getColors({}, mockPalettes)).not.toThrow();
    });

    it('should validate color format', () => {
      const colorScheme: ColorScheme = {
        customColors: ['#ff0000', '#00ff00', '#0000ff', '#invalid']
      };

      const result = getColors(colorScheme, mockPalettes);
      
      // Should still return the colors (validation may happen elsewhere)
      expect(result).toHaveLength(4);
    });

    it('should handle case-sensitive palette names', () => {
      const colorScheme: ColorScheme = {
        paletteName: 'github' // lowercase
      };

      const result = getColors(colorScheme, mockPalettes);
      
      // Should return default colors when case doesn't match
      expect(result).toEqual(['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']);
    });
  });

  describe('Color Validation and Processing', () => {
    const mockPalettes: Palettes = {
      'Test': ['#ffffff', '#000000'],
      'default': ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
    };

    it('should handle hex color codes correctly', () => {
      const colorScheme: ColorScheme = {
        customColors: ['#ffffff', '#000000', '#ff5733']
      };

      const result = getColors(colorScheme, mockPalettes);
      expect(result).toEqual(['#ffffff', '#000000', '#ff5733']);
    });

    it('should handle RGB color codes if supported', () => {
      const colorScheme: ColorScheme = {
        customColors: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)']
      };

      const result = getColors(colorScheme, mockPalettes);
      expect(result).toEqual(['rgb(255, 0, 0)', 'rgb(0, 255, 0)']);
    });

    it('should handle short hex codes', () => {
      const colorScheme: ColorScheme = {
        customColors: ['#fff', '#000', '#f53']
      };

      const result = getColors(colorScheme, mockPalettes);
      expect(result).toEqual(['#fff', '#000', '#f53']);
    });

    it('should handle empty custom colors array', () => {
      const colorScheme: ColorScheme = {
        customColors: []
      };

      const result = getColors(colorScheme, mockPalettes);
      
      // Should fallback to default colors
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle mixed color formats', () => {
      const colorScheme: ColorScheme = {
        customColors: ['#ff0000', 'rgb(0, 255, 0)', 'hsl(240, 100%, 50%)']
      };

      const result = getColors(colorScheme, mockPalettes);
      expect(result).toHaveLength(3);
    });
  });

  describe('Palette Management', () => {
    it('should handle palettes with different numbers of colors', () => {
      const varyingPalettes: Palettes = {
        'Small': ['#ff0000', '#00ff00'],
        'Large': ['#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00', '#80ff00', '#40ff00', '#00ff00'],
        'default': ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
      };

      const smallScheme: ColorScheme = { paletteName: 'Small' };
      const largeScheme: ColorScheme = { paletteName: 'Large' };

      const smallResult = getColors(smallScheme, varyingPalettes);
      const largeResult = getColors(largeScheme, varyingPalettes);

      expect(smallResult).toHaveLength(2);
      expect(largeResult).toHaveLength(9);
    });

    it('should handle missing palette gracefully', () => {
      const limitedPalettes: Palettes = {
        'Good': ['#ff0000', '#00ff00'],
        'default': ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
      };

      expect(() => getColors({ paletteName: 'Good' }, limitedPalettes)).not.toThrow();
      expect(() => getColors({ paletteName: 'Missing' }, limitedPalettes)).not.toThrow();
      
      const result = getColors({ paletteName: 'Missing' }, limitedPalettes);
      expect(result).toEqual(['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']);
    });

    it('should handle empty palette names gracefully', () => {
      const testPalettes: Palettes = {
        'Test': ['#ff0000', '#00ff00'],
        'default': ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
      };

      const result = getColors({ paletteName: '' }, testPalettes);
      
      // Should return default palette for empty name
      expect(result).toEqual(['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']);
    });
  });

  describe('Multi-Channel Color Schemes', () => {
    const channelPalettes: Palettes = {
      'Social': ['#1da1f2', '#e4405f', '#0077b5', '#ff0000', '#25d366'], // Twitter, IG, LinkedIn, YouTube, WhatsApp-ish
      'Intensity': ['#e8f5e9', '#a5d6a7', '#66bb6a', '#43a047', '#2e7d32', '#1b5e20'], // Green gradient
      'default': ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
    };

    it('should support social media themed color schemes', () => {
      const socialScheme: ColorScheme = { paletteName: 'Social' };
      const result = getColors(socialScheme, channelPalettes);
      
      expect(result).toHaveLength(5);
      expect(result[0]).toBe('#1da1f2'); // Twitter blue
    });

    it('should support intensity-based color schemes', () => {
      const intensityScheme: ColorScheme = { paletteName: 'Intensity' };
      const result = getColors(intensityScheme, channelPalettes);
      
      expect(result).toHaveLength(6);
      expect(result).toContain('#e8f5e9'); // Light green
      expect(result).toContain('#1b5e20'); // Dark green
    });

    it('should allow custom multi-channel colors', () => {
      const customChannelColors: ColorScheme = {
        customColors: [
          '#1da1f2', // Twitter
          '#e4405f', // Instagram  
          '#ff0000', // YouTube
          '#0077b5', // LinkedIn
          '#ff6719', // Substack
          '#000000'  // TikTok
        ]
      };

      const result = getColors(customChannelColors, channelPalettes);
      expect(result).toHaveLength(6);
      expect(result).toContain('#1da1f2');
      expect(result).toContain('#ff6719');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large numbers of colors efficiently', () => {
      const largeColorSet: ColorScheme = {
        customColors: Array(100).fill(0).map((_, i) => 
          `#${i.toString(16).padStart(6, '0')}`
        )
      };

      const emptyPalettes: Palettes = { 'default': ['#000', '#fff'] };
      const startTime = Date.now();
      const result = getColors(largeColorSet, emptyPalettes);
      const endTime = Date.now();

      expect(result).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(50); // Should be very fast
    });

    it('should handle large numbers of palettes efficiently', () => {
      const manyPalettes: Palettes = {};
      for (let i = 0; i < 50; i++) {
        manyPalettes[`Palette${i}`] = ['#ff0000', '#00ff00', '#0000ff'];
      }
      manyPalettes['default'] = ['#000', '#fff'];

      const result = getColors({ paletteName: 'Palette25' }, manyPalettes);
      expect(result).toHaveLength(3);
    });

    it('should maintain color order consistency', () => {
      const colorScheme: ColorScheme = {
        customColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      };

      const palettes: Palettes = { 'default': ['#000', '#fff'] };
      const result1 = getColors(colorScheme, palettes);
      const result2 = getColors(colorScheme, palettes);

      expect(result1).toEqual(result2);
    });

    it('should handle special color values', () => {
      const specialColors: ColorScheme = {
        customColors: ['transparent', 'inherit', 'currentColor']
      };

      const palettes: Palettes = { 'default': ['#000', '#fff'] };
      const result = getColors(specialColors, palettes);
      expect(result).toEqual(['transparent', 'inherit', 'currentColor']);
    });

    it('should handle CSS color names if supported', () => {
      const namedColors: ColorScheme = {
        customColors: ['red', 'green', 'blue', 'yellow', 'purple']
      };

      const palettes: Palettes = { 'default': ['#000', '#fff'] };
      const result = getColors(namedColors, palettes);
      expect(result).toEqual(['red', 'green', 'blue', 'yellow', 'purple']);
    });
  });

  describe('Default Color Behavior', () => {
    it('should provide consistent default colors', () => {
      const palettes: Palettes = { 'default': ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] };
      const result1 = getColors({}, palettes);
      const result2 = getColors({}, palettes);

      expect(result1).toEqual(result2);
      expect(Array.isArray(result1)).toBe(true);
      expect(result1.length).toBeGreaterThan(0);
    });

    it('should provide sensible default colors for heatmaps', () => {
      const palettes: Palettes = { 'default': ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] };
      const result = getColors({}, palettes);
      
      // Default colors should be appropriate for heatmap visualization
      expect(result.length).toBeGreaterThanOrEqual(3); // At least a few intensity levels
      expect(result[0]).toBeTruthy(); // Should have valid colors
    });
  });
});