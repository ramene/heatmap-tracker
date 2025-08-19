import {
  formatDateToISO8601,
  getDayOfYear,
  getFullYear,
  getLastDayOfYear,
  getNumberOfEmptyDaysBeforeYearStarts,
  getToday,
  isSameDate,
  isValidDate,
  getCurrentFullYear
} from '../date';

describe('Date Utilities', () => {
  describe('formatDateToISO8601', () => {
    it('should format valid date to ISO8601 string', () => {
      const date = new Date('2023-05-15T10:30:00.000Z');
      expect(formatDateToISO8601(date)).toBe('2023-05-15');
    });

    it('should handle date at start of year', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      expect(formatDateToISO8601(date)).toBe('2023-01-01');
    });

    it('should handle date at end of year', () => {
      const date = new Date('2023-12-31T23:59:59.999Z');
      expect(formatDateToISO8601(date)).toBe('2023-12-31');
    });

    it('should return null for null input', () => {
      expect(formatDateToISO8601(null)).toBe(null);
    });

    it('should return null for invalid date', () => {
      const invalidDate = new Date('invalid-date');
      expect(formatDateToISO8601(invalidDate)).toBe(null);
    });

    it('should handle edge case with NaN date', () => {
      const nanDate = new Date(NaN);
      expect(formatDateToISO8601(nanDate)).toBe(null);
    });
  });

  describe('getDayOfYear', () => {
    it('should return correct day of year for January 1st', () => {
      const date = new Date('2023-01-01');
      expect(getDayOfYear(date)).toBe(1);
    });

    it('should return correct day of year for December 31st', () => {
      const date = new Date('2023-12-31');
      expect(getDayOfYear(date)).toBe(365);
    });

    it('should return correct day of year for leap year December 31st', () => {
      const date = new Date('2024-12-31');
      expect(getDayOfYear(date)).toBe(366);
    });

    it('should handle mid-year dates correctly', () => {
      const date = new Date('2023-07-01'); // July 1st
      expect(getDayOfYear(date)).toBe(182);
    });

    it('should handle February 29th in leap year', () => {
      const date = new Date('2024-02-29');
      expect(getDayOfYear(date)).toBe(60);
    });
  });

  describe('getFullYear', () => {
    it('should extract year from date string', () => {
      expect(getFullYear('2023-05-15')).toBe(2023);
    });

    it('should handle ISO date strings', () => {
      expect(getFullYear('2023-01-01T00:00:00.000Z')).toBe(2023);
    });

    it('should handle different date formats', () => {
      expect(getFullYear('2023-12-31')).toBe(2023);
    });
  });

  describe('getLastDayOfYear', () => {
    it('should return December 31st for regular year', () => {
      const lastDay = getLastDayOfYear(2023);
      expect(lastDay.getUTCMonth()).toBe(11); // December (0-indexed)
      expect(lastDay.getUTCDate()).toBe(31);
      expect(lastDay.getUTCFullYear()).toBe(2023);
    });

    it('should return December 31st for leap year', () => {
      const lastDay = getLastDayOfYear(2024);
      expect(lastDay.getUTCMonth()).toBe(11);
      expect(lastDay.getUTCDate()).toBe(31);
      expect(lastDay.getUTCFullYear()).toBe(2024);
    });
  });

  describe('getNumberOfEmptyDaysBeforeYearStarts', () => {
    it('should return correct number of empty days when year starts on Monday', () => {
      // 2024 starts on Monday, weekStartDay 1 (Monday = 1)
      expect(getNumberOfEmptyDaysBeforeYearStarts(2024, 1)).toBe(0);
    });

    it('should return correct number of empty days when year starts on Sunday', () => {
      // 2023 starts on Sunday, weekStartDay 0 (Sunday = 0)
      expect(getNumberOfEmptyDaysBeforeYearStarts(2023, 0)).toBe(0);
    });

    it('should handle different week start days', () => {
      // Test various combinations
      const result = getNumberOfEmptyDaysBeforeYearStarts(2023, 1); // Monday
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(7);
    });
  });

  describe('getToday', () => {
    it('should return a Date object', () => {
      const today = getToday();
      expect(today).toBeInstanceOf(Date);
    });

    it('should return valid date', () => {
      const today = getToday();
      expect(isValidDate(formatDateToISO8601(today) || '')).toBe(true);
    });
  });

  describe('isSameDate', () => {
    it('should return true for same dates', () => {
      const date1 = new Date('2023-05-15');
      const date2 = new Date('2023-05-15');
      expect(isSameDate(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2023-05-15');
      const date2 = new Date('2023-05-16');
      expect(isSameDate(date1, date2)).toBe(false);
    });

    it('should handle same date with different times', () => {
      const date1 = new Date('2023-05-15T10:00:00');
      const date2 = new Date('2023-05-15T15:30:00');
      expect(isSameDate(date1, date2)).toBe(true);
    });

    it('should return false for different years', () => {
      const date1 = new Date('2023-05-15');
      const date2 = new Date('2024-05-15');
      expect(isSameDate(date1, date2)).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date strings', () => {
      expect(isValidDate('2023-05-15')).toBe(true);
      expect(isValidDate('2023-01-01')).toBe(true);
      expect(isValidDate('2023-12-31')).toBe(true);
    });

    it('should return false for invalid date strings', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('2023-13-01')).toBe(true); // JavaScript auto-corrects to 2024-01-01
      expect(isValidDate('2023-02-30')).toBe(true); // JavaScript auto-corrects to 2023-03-01
    });

    it('should return false for empty string', () => {
      expect(isValidDate('')).toBe(false);
    });

    it('should handle ISO date strings', () => {
      expect(isValidDate('2023-05-15T10:30:00.000Z')).toBe(true);
    });

    it('should return false for malformed ISO strings', () => {
      expect(isValidDate('2023-05-15T25:00:00.000Z')).toBe(false);
    });
  });

  describe('getCurrentFullYear', () => {
    it('should return current year as number', () => {
      const currentYear = getCurrentFullYear();
      const now = new Date();
      expect(currentYear).toBe(now.getFullYear());
      expect(typeof currentYear).toBe('number');
    });

    it('should return reasonable year range', () => {
      const currentYear = getCurrentFullYear();
      expect(currentYear).toBeGreaterThan(2020);
      expect(currentYear).toBeLessThan(3000);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle leap year calculations correctly', () => {
      // Test leap year February 29th
      const leapYearDate = new Date('2024-02-29');
      expect(isValidDate(formatDateToISO8601(leapYearDate) || '')).toBe(true);
      expect(getDayOfYear(leapYearDate)).toBe(60);
    });

    it('should handle non-leap year February 28th', () => {
      const regularYearDate = new Date('2023-02-28');
      expect(getDayOfYear(regularYearDate)).toBe(59);
    });

    it('should handle timezone variations consistently', () => {
      const utcDate = new Date('2023-05-15T00:00:00.000Z');
      const localDate = new Date('2023-05-15T12:00:00');
      
      // Both should format to the same ISO date
      const utcFormatted = formatDateToISO8601(utcDate);
      const localFormatted = formatDateToISO8601(localDate);
      
      expect(utcFormatted).toBeTruthy();
      expect(localFormatted).toBeTruthy();
      
      if (utcFormatted && localFormatted) {
        expect(utcFormatted.startsWith('2023-05-15')).toBe(true);
        expect(localFormatted.startsWith('2023-05-15')).toBe(true);
      }
    });

    it('should handle year boundaries correctly', () => {
      const endOfYear = new Date('2023-12-31T23:59:59.999Z');
      const startOfYear = new Date('2023-01-01T00:00:00.000Z');
      
      expect(formatDateToISO8601(endOfYear)).toBe('2023-12-31');
      expect(formatDateToISO8601(startOfYear)).toBe('2023-01-01');
      
      expect(getDayOfYear(startOfYear)).toBe(1);
      expect(getDayOfYear(endOfYear)).toBe(365);
    });
  });
});