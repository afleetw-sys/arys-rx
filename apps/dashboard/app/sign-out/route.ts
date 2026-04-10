import { type NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/sign-in', req.url));
  res.cookies.set('arys_role', '', { maxAge: 0, path: '/' });
  return res;
}
