import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeatmapBox } from './HeatmapBox';
import { Box } from '../../types';

describe('HeatmapBox Multi-Channel Functionality', () => {
  describe('Single Document Tooltips', () => {
    test('should show document title with channels in tooltip', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 1,
          channels: ['twitter', 'linkedin'],
          documents: [
            {
              name: 'My Blog Post',
              path: 'blog/my-blog-post.md',
              channels: ['twitter', 'linkedin']
            }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      const boxElement = screen.getByTitle('My Blog Post (twitter, linkedin)');
      expect(boxElement).toBeTruthy();
      expect(boxElement.getAttribute('title')).toBe('My Blog Post (twitter, linkedin)');
      expect(boxElement.getAttribute('aria-label')).toBe('My Blog Post (twitter, linkedin)');
    });

    test('should show document title without channels when none specified', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 1,
          channels: [],
          documents: [
            {
              name: 'Simple Document',
              path: 'simple.md',
              channels: []
            }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      const boxElement = screen.getByTitle('Simple Document');
      expect(boxElement.getAttribute('title')).toBe('Simple Document');
    });

    test('should create invisible preview link for single documents', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 1,
          channels: ['twitter'],
          documents: [
            {
              name: 'Test Document',
              path: 'test.md',
              channels: ['twitter']
            }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      // Should contain invisible link for preview
      const linkElement = screen.getByRole('document').querySelector('.heatmap-cell-link');
      expect(linkElement).toBeTruthy();
      expect(linkElement?.getAttribute('data-href')).toBe('Test Document');
    });
  });

  describe('Multi-Document Tooltips', () => {
    test('should show document count and coverage percentage', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 3,
          channels: ['twitter', 'linkedin', 'substack'],
          documents: [
            { name: 'Post 1', path: 'post1.md', channels: ['twitter'] },
            { name: 'Post 2', path: 'post2.md', channels: ['linkedin'] },
            { name: 'Blog Post', path: 'blog.md', channels: ['substack'] }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      // Coverage: 3/6 channels = 50%
      const boxElement = screen.getByTitle('3 posts, 50% coverage (twitter, linkedin, substack)');
      expect(boxElement).toBeTruthy();
    });

    test('should display document count number as superscript', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 5,
          channels: ['twitter', 'instagram'],
          documents: Array(5).fill(0).map((_, i) => ({
            name: `Doc ${i + 1}`,
            path: `doc${i + 1}.md`,
            channels: i % 2 === 0 ? ['twitter'] : ['instagram']
          }))
        }
      };

      render(<HeatmapBox box={box} />);

      const countElement = screen.getByText('5');
      expect(countElement).toBeTruthy();
      expect(countElement.className).toContain('document-count-number');
    });

    test('should create dashboard preview link for multi-documents', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 2,
          channels: ['twitter', 'linkedin'],
          documents: [
            { name: 'Post 1', path: 'post1.md', channels: ['twitter'] },
            { name: 'Post 2', path: 'post2.md', channels: ['linkedin'] }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      // Should contain dashboard preview link
      const dashboardLink = screen.getByRole('document').querySelector('.multi-doc-dashboard-link');
      expect(dashboardLink).toBeTruthy();
      expect(dashboardLink?.getAttribute('data-href')).toBe('Dashboards/Publishing/2024-01-01');
    });
  });

  describe('Channel Coverage Calculations', () => {
    test('should calculate correct coverage percentages', () => {
      const testCases = [
        { channels: ['twitter'], expectedCoverage: 17 }, // 1/6 ≈ 17%
        { channels: ['twitter', 'linkedin'], expectedCoverage: 33 }, // 2/6 ≈ 33%
        { channels: ['twitter', 'instagram', 'linkedin'], expectedCoverage: 50 }, // 3/6 = 50%
        { channels: ['twitter', 'instagram', 'linkedin', 'substack'], expectedCoverage: 67 }, // 4/6 ≈ 67%
        { channels: ['twitter', 'instagram', 'linkedin', 'substack', 'tiktok'], expectedCoverage: 83 }, // 5/6 ≈ 83%
        { channels: ['twitter', 'instagram', 'linkedin', 'substack', 'tiktok', 'facebook'], expectedCoverage: 100 } // 6/6 = 100%
      ];

      testCases.forEach(({ channels, expectedCoverage }) => {
        const box: Box = {
          date: '2024-01-01',
          hasData: true,
          metadata: {
            documentCount: 2,
            channels,
            documents: [
              { name: 'Post 1', path: 'post1.md', channels },
              { name: 'Post 2', path: 'post2.md', channels: [] }
            ]
          }
        };

        render(<HeatmapBox box={box} />);
        
        const tooltip = screen.getByTitle(new RegExp(`${expectedCoverage}% coverage`));
        expect(tooltip).toBeTruthy();
      });
    });

    test('should handle empty channels gracefully', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 1,
          channels: [],
          documents: [
            { name: 'No Channels Doc', path: 'doc.md', channels: [] }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      // Should show 0% coverage
      const tooltip = screen.getByTitle('1 posts, 0% coverage');
      expect(tooltip).toBeTruthy();
    });
  });

  describe('Click Behavior and Event Handling', () => {
    test('should not add React click handlers to single documents', () => {
      const mockOnClick = jest.fn();
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 1,
          channels: ['twitter'],
          documents: [
            { name: 'Single Doc', path: 'single.md', channels: ['twitter'] }
          ]
        }
      };

      render(<HeatmapBox box={box} onClick={mockOnClick} />);

      const boxElement = screen.getByRole('document').firstChild as HTMLElement;
      
      // Single document boxes should not have React click handlers
      expect(boxElement.getAttribute('role')).not.toBe('button');
      expect(boxElement.getAttribute('tabIndex')).not.toBe('0');
    });

    test('should add React click handlers to multi-documents', () => {
      const mockOnClick = jest.fn();
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 2,
          channels: ['twitter', 'linkedin'],
          documents: [
            { name: 'Doc 1', path: 'doc1.md', channels: ['twitter'] },
            { name: 'Doc 2', path: 'doc2.md', channels: ['linkedin'] }
          ]
        }
      };

      render(<HeatmapBox box={box} onClick={mockOnClick} />);

      const boxElement = screen.getByRole('button');
      expect(boxElement).toBeTruthy();
      expect(boxElement.getAttribute('tabIndex')).toBe('0');
    });

    test('should handle click events with modifier keys', () => {
      const mockOnClick = jest.fn();
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 2,
          channels: ['twitter'],
          documents: [
            { name: 'Doc 1', path: 'doc1.md', channels: ['twitter'] },
            { name: 'Doc 2', path: 'doc2.md', channels: ['twitter'] }
          ]
        }
      };

      render(<HeatmapBox box={box} onClick={mockOnClick} />);

      const boxElement = screen.getByRole('button');
      
      // Simulate Shift+Click for force regeneration
      fireEvent.click(boxElement, { shiftKey: true });
      
      expect(mockOnClick).toHaveBeenCalledWith(box, expect.objectContaining({
        shiftKey: true
      }));
    });
  });

  describe('Legacy Compatibility', () => {
    test('should handle legacy HTML content without metadata', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true
      };

      // Create legacy HTML content
      const htmlContent = document.createElement('div');
      htmlContent.innerHTML = '<a data-href="legacy-note.md" class="internal-link">Legacy Note</a>';
      box.content = htmlContent;

      render(<HeatmapBox box={box} />);

      // Check that legacy HTML content is rendered
      const linkElement = screen.getByText('Legacy Note');
      expect(linkElement).toBeTruthy();
      expect(linkElement.getAttribute('data-href')).toBe('legacy-note.md');
      expect(linkElement.className).toContain('internal-link');
    });

    test('should show date as fallback tooltip when no metadata', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: false
      };

      render(<HeatmapBox box={box} />);

      const boxElement = screen.getByTitle('2024-01-01');
      expect(boxElement).toBeTruthy();
    });

    test('should preserve existing content alongside metadata', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        content: 'Some existing content',
        metadata: {
          documentCount: 1,
          channels: ['twitter'],
          documents: [
            { name: 'Test Doc', path: 'test.md', channels: ['twitter'] }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      // Should prioritize metadata over legacy content
      const tooltip = screen.getByTitle('Test Doc (twitter)');
      expect(tooltip).toBeTruthy();
    });
  });

  describe('Accessibility and Screen Reader Support', () => {
    test('should provide proper ARIA labels for screen readers', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 2,
          channels: ['twitter', 'linkedin'],
          documents: [
            { name: 'Post 1', path: 'post1.md', channels: ['twitter'] },
            { name: 'Post 2', path: 'post2.md', channels: ['linkedin'] }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      const boxElement = screen.getByRole('button');
      const ariaLabel = boxElement.getAttribute('aria-label');
      
      expect(ariaLabel).toBe('2 posts, 33% coverage (twitter, linkedin)');
    });

    test('should support keyboard navigation for multi-documents', () => {
      const mockOnClick = jest.fn();
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 2,
          channels: ['twitter'],
          documents: [
            { name: 'Doc 1', path: 'doc1.md', channels: ['twitter'] },
            { name: 'Doc 2', path: 'doc2.md', channels: ['twitter'] }
          ]
        }
      };

      render(<HeatmapBox box={box} onClick={mockOnClick} />);

      const boxElement = screen.getByRole('button');
      
      // Test Enter key
      fireEvent.keyDown(boxElement, { key: 'Enter' });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      
      // Test Space key
      fireEvent.keyDown(boxElement, { key: ' ' });
      expect(mockOnClick).toHaveBeenCalledTimes(2);
      
      // Test other keys (should not trigger)
      fireEvent.keyDown(boxElement, { key: 'Tab' });
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });

    test('should maintain focus management for screen readers', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 3,
          channels: ['twitter', 'linkedin', 'instagram'],
          documents: [
            { name: 'Doc 1', path: 'doc1.md', channels: ['twitter'] },
            { name: 'Doc 2', path: 'doc2.md', channels: ['linkedin'] },
            { name: 'Doc 3', path: 'doc3.md', channels: ['instagram'] }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      const boxElement = screen.getByRole('button');
      
      // Should be focusable
      expect(boxElement.tabIndex).toBe(0);
      
      // Should have proper role
      expect(boxElement.getAttribute('role')).toBe('button');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle malformed metadata gracefully', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          // Missing documentCount
          channels: ['twitter'],
          documents: []
        }
      };

      expect(() => render(<HeatmapBox box={box} />)).not.toThrow();
    });

    test('should handle empty documents array', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 0,
          channels: [],
          documents: []
        }
      };

      render(<HeatmapBox box={box} />);

      // Should fallback to date tooltip
      const tooltip = screen.getByTitle('2024-01-01');
      expect(tooltip).toBeTruthy();
    });

    test('should handle missing document names gracefully', () => {
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 1,
          channels: ['twitter'],
          documents: [
            {
              name: '',
              path: 'unnamed.md',
              channels: ['twitter']
            }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      // Should fallback to date when name is empty, and show channels if present
      const tooltip = screen.getByTitle(' (twitter)');
      expect(tooltip).toBeTruthy();
    });

    test('should handle very long channel lists', () => {
      const manyChannels = [
        'twitter', 'instagram', 'linkedin', 'facebook', 'tiktok', 'substack',
        'youtube', 'pinterest', 'reddit', 'medium', 'dev.to', 'hashnode'
      ];
      
      const box: Box = {
        date: '2024-01-01',
        hasData: true,
        metadata: {
          documentCount: 1,
          channels: manyChannels,
          documents: [
            {
              name: 'Viral Content',
              path: 'viral.md',
              channels: manyChannels
            }
          ]
        }
      };

      render(<HeatmapBox box={box} />);

      const tooltipText = `Viral Content (${manyChannels.join(', ')})`;
      const tooltip = screen.getByTitle(tooltipText);
      expect(tooltip).toBeTruthy();
    });
  });
});