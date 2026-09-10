/**
 * Prefix an internal path with the configured base, collapsing duplicate
 * slashes and appending a trailing slash (the site uses `trailingSlash:
 * "always"`) — except when the path's last segment names a file (contains a
 * `.`, e.g. `/rss.xml`, `/og.png`), which is returned without one. Already
 * having a trailing slash is a no-op; slashes are never doubled.
 */
export function href(path: string, base: string = import.meta.env.BASE_URL ?? '/'): string {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const isFile = lastSegment?.includes('.') ?? false;
  const joined = `${base}/${path}/`.replace(/\/+/g, '/');
  return isFile ? joined.replace(/\/$/, '') : joined;
}
