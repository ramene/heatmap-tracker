import moment from "moment";

// Assume the user format is known (e.g. "DD/MM/YYYY")
type UserDateFormat = string;

class DateTransformer {
  private userFormat: UserDateFormat;

  constructor(userFormat: UserDateFormat) {
    this.userFormat = userFormat;
  }

  // Parse user date input and convert to ISO
  toISO(dateStr: string): string | null {
    const parsed = moment(dateStr, this.userFormat, true);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
  }

  // Convert internal ISO date to user-friendly format
  fromISO(isoDateStr: string): string | null {
    const parsed = moment(isoDateStr, "YYYY-MM-DD", true);
    return parsed.isValid() ? parsed.format(this.userFormat) : null;
  }

  // Optional: validate user date
  isValidUserDate(userDateStr: string): boolean {
    return moment(userDateStr, this.userFormat, true).isValid();
  }
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function getDayOfYear(date: Date): number {
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 1);

  const current = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );

  const diff = current - startOfYear;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
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

export function getToday() {
  const todayUTC = new Date();

  return todayUTC;
}

export function formatDateToISO8601(date: Date | null): string | null {
  if (!date) {
    return null;
  }

  const formattedDate = date?.toISOString?.()?.split('T')?.[0];

  return formattedDate;
}

export function getFullYear(date: string) {
  return new Date(date).getUTCFullYear();
}

export function getCurrentFullYear() {
  return new Date().getUTCFullYear();
}

export function isSameDate(d1: Date, d2: Date): boolean {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}