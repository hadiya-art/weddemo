/**
 * Timezone-proof date helpers. Dates are plain `YYYY-MM-DD` strings and are
 * always interpreted in UTC so server and client render identical output.
 */
import { DEMO_NOW, DEMO_TODAY } from "./catalog";

const DAY_MS = 86_400_000;

export function toUTC(iso: string): number {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function fromUTC(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  return fromUTC(toUTC(iso) + days * DAY_MS);
}

/** Whole days from `a` to `b` (b − a). */
export function diffDays(a: string, b: string): number {
  return Math.round((toUTC(b) - toUTC(a)) / DAY_MS);
}

export function daysFromToday(iso: string): number {
  return diffDays(DEMO_TODAY, iso);
}

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = JSON.stringify(options);
  let f = fmtCache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat("en-IN", { ...options, timeZone: "UTC" });
    fmtCache.set(key, f);
  }
  return f;
}

/** "Sat, 21 Nov 2026" */
export function formatLongDate(iso: string): string {
  return fmt({ weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(toUTC(iso));
}
/** "21 Nov" */
export function formatShortDate(iso: string): string {
  return fmt({ day: "numeric", month: "short" }).format(toUTC(iso));
}
/** "21 Nov 2026" */
export function formatMediumDate(iso: string): string {
  return fmt({ day: "numeric", month: "short", year: "numeric" }).format(toUTC(iso));
}
/** "Saturday" */
export function formatWeekday(iso: string): string {
  return fmt({ weekday: "long" }).format(toUTC(iso));
}
/** "November 2026" */
export function formatMonthYear(year: number, month: number): string {
  return fmt({ month: "long", year: "numeric" }).format(Date.UTC(year, month, 1));
}

/** "18:30" → "6:30 pm" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function addMinutesToTime(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function stampToMinutes(stamp: string): number {
  const [date, time = "00:00"] = stamp.split("T");
  const [h, m] = time.split(":").map(Number);
  return toUTC(date) / 60_000 + h * 60 + m;
}

/** Relative time against the fixed demo clock. */
export function relativeTime(stamp: string): string {
  const diff = stampToMinutes(DEMO_NOW) - stampToMinutes(stamp);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 24 * 60) return `${Math.floor(diff / 60)}h ago`;
  const days = Math.floor(diff / (24 * 60));
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

/** 42 ISO dates (6 weeks, Monday-first) covering the given month. */
export function monthGrid(year: number, month: number): string[] {
  const first = Date.UTC(year, month, 1);
  const weekday = new Date(first).getUTCDay(); // 0 = Sunday
  const offset = (weekday + 6) % 7; // Monday-first
  const start = first - offset * DAY_MS;
  return Array.from({ length: 42 }, (_, i) => fromUTC(start + i * DAY_MS));
}

export function monthOf(iso: string): { year: number; month: number } {
  const [y, m] = iso.split("-").map(Number);
  return { year: y, month: m - 1 };
}

export function isoMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}
