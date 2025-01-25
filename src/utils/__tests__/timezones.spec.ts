import moment from 'moment';

const dateFormats = [
  "2025-01-22T10:15:30.000Z", // ISO 8601 with timezone
  "2025-01-22",               // ISO 8601 date only
  "January 22, 2025",         // Full month name, day, year
  "2025-01-22T10:15:30+01:00",// ISO 8601 with timezone offset
  // "2025-01-22T00:00:00+08:00",// ISO 8601 with timezone offset
  "2025-01-22T00:00:00-08:00",// ISO 8601 with timezone offset
  "2025-01-22 10:15:30",      // YYYY-MM-DD HH:mm:ss (no timezone)
  "2025/01/22 10:15:30",      // YYYY/MM/DD HH:mm:ss
  "Wed, 22 Jan 2025 10:15:30 GMT", // RFC 1123 with timezone
  "Wed Jan 22 2025 10:15:30 GMT+0100", // Full weekday and timezone offset
  "2025.01.22",               // YYYY.MM.DD (alternative date format)
  "22-Jan-2025 10:15:30",     // DD-MMM-YYYY HH:mm:ss
  "22 January 2025",          // Day Full Month Year
];

describe('Date format transformations using moment', () => {
  it.each(dateFormats)('should correctly transform date format: %s', (input) => {
    const result = moment(input).format('YYYY-MM-DD');
    
    // Validate that the date is correctly parsed and transformed
    expect(result).toBe('2025-01-22');
  });
});