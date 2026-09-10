/**
 * Prefix an internal path with the configured base, collapsing duplicate
 * slashes and appending a trailing slash (the site uses `trailingSlash:
 * "always"`) — except when the path's last segment names a file (contains a
 * `.`, e.g. `/rss.xml`, `/og.png`), which is returned without one. Already
 * having a trailing slash is a no-op; slashes are never doubled. A trailing
 * `?query` or `#hash` is split off first and re-appended after the trailing
 * slash, so `href('/#contact')` returns `/real-portfolio/#contact` rather
 * than inserting the slash after the hash.
 */
export function href(path: string, base: string = import.meta.env.BASE_URL ?? '/'): string {
  const match = path.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] ?? path;
  const suffix = match?.[2] ?? '';
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const isFile = lastSegment?.includes('.') ?? false;
  const joined = `${base}/${pathname}/`.replace(/\/+/g, '/');
  const result = isFile ? joined.replace(/\/$/, '') : joined;
  return `${result}${suffix}`;
}
