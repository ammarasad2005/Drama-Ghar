/**
 * Timezone-aware date formatting utilities
 * Replicates the formatInTimeZone (q) and formatDateKey (qD) functions from pakdrama.pk
 */
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

/**
 * Format a date in a specific timezone using date-fns format strings.
 * This is equivalent to the `q` function in the original pakdrama.pk source.
 */
export function formatInTimeZone(
  date: Date,
  timeZone: string,
  formatStr: string
): string {
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, formatStr);
}

/**
 * Format a date into a date key string (yyyy-MM-dd) in a given timezone.
 * This is equivalent to the `qD` function in the original pakdrama.pk source.
 */
export function formatDateKey(
  date: Date,
  timeZone: string,
  formatStr: string = "yyyy-MM-dd"
): string {
  return formatInTimeZone(date, timeZone, formatStr);
}

/**
 * Get the base date (midnight) in Asia/Karachi timezone for a given JS Date.
 * Returns a Date object set to 00:00:00+05:00 for that PKT day.
 */
export function getPktBaseDate(referenceDate: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(referenceDate)
    .split("/");

  const [month, day, year] = parts;
  return new Date(`${year}-${month}-${day}T00:00:00+05:00`);
}

/**
 * Generate rolling dates from yesterday to +5 days in PKT timezone.
 */
export function getRollingDates(referenceDate: Date = new Date()): {
  rollingDates: Date[];
  todayBase: Date;
  yestBase: Date;
} {
  const todayBase = getPktBaseDate(referenceDate);
  const yestBase = new Date(todayBase);
  yestBase.setDate(yestBase.getDate() - 1);

  const rollingDates: Date[] = [];
  for (let i = -1; i <= 5; i++) {
    const d = new Date(todayBase);
    d.setDate(d.getDate() + i);
    rollingDates.push(d);
  }

  return { rollingDates, todayBase, yestBase };
}