import { redirectTo } from '@/lib/request-origin';
import { type NextRequest, NextResponse } from 'next/server';

const HR_ROUTES = ['/hr'];
const PBM_ROUTES = ['/pbm'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // All Next.js internals (HMR, RSC payloads, manifests, etc.) must bypass auth or
  // dev breaks and you can see "missing required error components, refreshing...".
  if (pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const role = req.cookies.get('arys_role')?.value;

  const isPublicPath =
    pathname === '/sign-in' ||
    pathname.startsWith('/api/auth/sign-out');

  // Not signed in → redirect to sign-in (allow sign-out API so cookies can be cleared)
  if (!role && !isPublicPath) {
    return NextResponse.redirect(redirectTo(req, '/sign-in'));
  }

  // HR trying to access PBM routes
  if (role === 'hr' && PBM_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(redirectTo(req, '/hr'));
  }

  // PBM trying to access HR routes
  if (role === 'pbm' && HR_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(redirectTo(req, '/pbm'));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon\\.ico).*)'],
};
