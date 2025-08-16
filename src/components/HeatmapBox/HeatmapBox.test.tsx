import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeatmapBox } from './HeatmapBox';
import { Box } from '../../types';

describe('HeatmapBox Tooltip Customization', () => {
  test('should show only document title in aria-label (no date prefix)', () => {
    const box: Box = {
      date: '2024-01-01',
      hasData: true
    };

    // Create HTML content with a link
    const htmlContent = document.createElement('div');
    htmlContent.innerHTML = '<a data-href="my-document.md">My Document Title</a>';
    box.content = htmlContent;

    render(<HeatmapBox box={box} />);

    // Should show only the document title, not "2024-01-01 - My Document Title"
    const linkElement = screen.getByLabelText('My Document Title');
    expect(linkElement).toBeTruthy();
    
    // Verify it doesn't contain the date
    const ariaLabel = linkElement.getAttribute('aria-label');
    expect(ariaLabel).toBe('My Document Title');
    expect(ariaLabel).not.toContain('2024-01-01');
    expect(ariaLabel).not.toContain(' - ');
  });

  test('should handle link with href attribute when no linkText available', () => {
    const box: Box = {
      date: '2024-01-01',
      hasData: true
    };

    const htmlContent = document.createElement('div');
    htmlContent.innerHTML = '<a data-href="note-filename.md"></a>';
    box.content = htmlContent;

    render(<HeatmapBox box={box} />);

    const linkElement = screen.getByLabelText('note-filename.md');
    expect(linkElement.getAttribute('aria-label')).toBe('note-filename.md');
  });

  test('should preserve navigation functionality with custom tooltips', () => {
    const box: Box = {
      date: '2024-01-01',
      hasData: true
    };

    const htmlContent = document.createElement('div');
    htmlContent.innerHTML = '<a data-href="test-note.md" class="internal-link">Test Note</a>';
    box.content = htmlContent;

    render(<HeatmapBox box={box} />);

    const linkElement = screen.getByLabelText('Test Note');
    
    // Should maintain navigation attributes
    expect(linkElement.getAttribute('data-href')).toBe('test-note.md');
    expect(linkElement.className).toContain('internal-link');
    
    // Should show clean title
    expect(linkElement.getAttribute('aria-label')).toBe('Test Note');
  });
});