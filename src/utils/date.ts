
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function getDayOfYear(date: Date): number {
  const startOfYear = Date.UTC(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getShiftedWeekdays(weekdays: string[], weekStartDay: number): string[] {
  if (weekStartDay < 0 || weekStartDay > 6) {
    throw new Error('weekStartDay must be between 0 and 6');
  }

  return weekdays.slice(weekStartDay).concat(weekdays.slice(0, weekStartDay));
}

export function getFirstDayOfYear(year: number): Date {
  return new Date(Date.UTC(year, 0, 1));
}

export function getNumberOfEmptyDaysBeforeYearStarts(year: number, weekStartDay: number): number {
  if (isNaN(weekStartDay) || weekStartDay < 0 || weekStartDay > 6) {
    throw new Error('weekStartDay must be a number between 0 and 6');
  }

  if (isNaN(year)) {
    throw new Error('year must be a number');
  }

  const firstDayOfYear = getFirstDayOfYear(year);
  const firstWeekday = firstDayOfYear.getUTCDay();
  return (firstWeekday - weekStartDay + 7) % 7;
}

export function getLastDayOfYear(year: number): Date {
  return new Date(Date.UTC(year, 11, 31));
}

export function isToday(day: number) {
  const todaysDayNumberLocal = getDayOfYear(new Date());

  return day === todaysDayNumberLocal;
}