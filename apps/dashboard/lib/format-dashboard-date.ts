/** Fixed locale + timezone so server HTML matches client hydration (avoids env locale/TZ drift). */

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

const TIME_OPTS: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

const dateFmt = new Intl.DateTimeFormat('en-US', DATE_OPTS);
const timeFmt = new Intl.DateTimeFormat('en-US', TIME_OPTS);

export function formatDashboardDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return dateFmt.format(d);
}

export function formatDashboardTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return timeFmt.format(d);
}

/** Numeric calendar date in UTC (M/D/YYYY) for compact tables. */
export function formatDashboardDateNumeric(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const y = d.getUTCFullYear();
  return `${m}/${day}/${y}`;
}
