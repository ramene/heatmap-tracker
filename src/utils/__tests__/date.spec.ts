import {
  isValidDate,
  getDayOfYear,
  getFirstDayOfYear,
  getNumberOfEmptyDaysBeforeYearStarts,
  getLastDayOfYear,
} from '../date';

describe('isValidDate', () => {
  test('Valid Date String (ISO Format)', () => {
    expect(isValidDate('2021-12-31')).toBe(true);
  });

  test('Non-Date String', () => {
    expect(isValidDate('not a date')).toBe(false);
  });

  test('Empty String', () => {
    expect(isValidDate('')).toBe(false);
  });

  test('Valid Date in Different Format', () => {
    expect(isValidDate('12/31/2021')).toBe(true);
  });
});

describe('getDayOfYear', () => {
  test('Regular Date (Non-Leap Year)', () => {
    expect(getDayOfYear(new Date('2021-03-01'))).toBe(60);
  });

  test('Beginning of the Year', () => {
    expect(getDayOfYear(new Date('2021-01-01'))).toBe(1);
  });

  test('End of the Year (Non-Leap Year)', () => {
    expect(getDayOfYear(new Date('2021-12-31'))).toBe(365);
  });

  test('End of the Year (Leap Year)', () => {
    expect(getDayOfYear(new Date('2020-12-31'))).toBe(366);
  });

  test('Invalid Date Object', () => {
    expect(getDayOfYear(new Date('invalid date'))).toBeNaN();
  });
});

describe('getFirstDayOfYear', () => {
  test('Typical Year Start', () => {
    expect(getFirstDayOfYear(2021)).toEqual(new Date(Date.UTC(2021, 0, 1)));
  });

  test('Leap Year Start', () => {
    expect(getFirstDayOfYear(2020)).toEqual(new Date(Date.UTC(2020, 0, 1)));
  });

  test('Negative Year (Before Common Era)', () => {
    expect(getFirstDayOfYear(-1)).toEqual(new Date(Date.UTC(-1, 0, 1)));
  });
});

describe('getNumberOfEmptyDaysBeforeYearStarts', () => {
  test('Year Starts on Week Start Day', () => {
    expect(getNumberOfEmptyDaysBeforeYearStarts(2023, 0)).toBe(0);
  });

  test('Year Starts One Day After Week Start Day', () => {
    expect(getNumberOfEmptyDaysBeforeYearStarts(2021, 0)).toBe(5);
  });

  test('Week Starts on Monday', () => {
    expect(getNumberOfEmptyDaysBeforeYearStarts(2021, 1)).toBe(4);
  });
});

describe('getLastDayOfYear', () => {
  test('Typical Year End', () => {
    expect(getLastDayOfYear(2021)).toEqual(new Date(Date.UTC(2021, 11, 31)));
  });

  test('Leap Year End', () => {
    expect(getLastDayOfYear(2020)).toEqual(new Date(Date.UTC(2020, 11, 31)));
  });

  test('Far Future Year', () => {
    expect(getLastDayOfYear(3000)).toEqual(new Date(Date.UTC(3000, 11, 31)));
  });
});
