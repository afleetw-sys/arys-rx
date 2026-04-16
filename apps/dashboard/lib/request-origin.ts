import type { NextRequest } from 'next/server';

/**
 * Public origin the browser used (Host / forwarded headers).
 * `req.url` / `nextUrl.origin` often stay `localhost` in dev when you open the app via LAN IP.
 */
export function requestOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();

  if (forwardedHost) {
    const proto = forwardedProto ?? 'https';
    return `${proto}://${forwardedHost}`;
  }

  const host = req.headers.get('host');
  if (host) {
    const proto =
      forwardedProto ?? (req.nextUrl.protocol === 'https:' ? 'https' : 'http');
    return `${proto}://${host}`;
  }

  return req.nextUrl.origin;
}

export function redirectTo(req: NextRequest, pathname: string): URL {
  return new URL(pathname, `${requestOrigin(req)}/`);
}
