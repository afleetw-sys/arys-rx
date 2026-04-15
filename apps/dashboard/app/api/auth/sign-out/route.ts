import { redirectTo } from '@/lib/request-origin';
import { type NextRequest, NextResponse } from 'next/server';

/** Node route handler (not Edge) — avoids missing-chunk / 404 issues with `app/sign-out` in this monorepo setup. */
export function GET(req: NextRequest) {
  const res = NextResponse.redirect(redirectTo(req, '/sign-in'));
  res.cookies.set('arys_role', '', { maxAge: 0, path: '/' });
  return res;
}
