const TZ = 'Asia/Tokyo';

// Fixed abbreviation table rather than Intl's locale-provided short month name:
// CLDR data shipped with newer ICU versions renders en-GB's short September as
// "Sept" instead of "Sep" (en-US still gives "Sep"), which would silently drift
// this output depending on the Node/ICU version running the build. Day/year and
// the JST conversion still go through Intl.DateTimeFormat.formatToParts.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function jstDateParts(d: Date): { day: string; month: number; year: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: TZ,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return { day: get('day'), month: Number(get('month')) - 1, year: get('year') };
}

export function formatDate(d: Date): string {
  const { day, month, year } = jstDateParts(d);
  return `${day} ${MONTHS[month]} ${year}`;
}

export function formatMonth(d: Date): string {
  const { month, year } = jstDateParts(d);
  return `${MONTHS[month]} ${year}`;
}

export function jstClock(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(d);
}
