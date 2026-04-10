import { type NextRequest, NextResponse } from 'next/server';

const HR_ROUTES = ['/hr'];
const PBM_ROUTES = ['/pbm'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get('arys_role')?.value;

  // Not signed in → redirect to sign-in
  if (!role && pathname !== '/sign-in') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // HR trying to access PBM routes
  if (role === 'hr' && PBM_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/hr', req.url));
  }

  // PBM trying to access HR routes
  if (role === 'pbm' && HR_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/pbm', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
