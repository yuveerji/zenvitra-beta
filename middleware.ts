import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // Handle m.zenvitra.xyz mobile subdomain redirection to canonical URL
  if (host.startsWith('m.zenvitra.xyz')) {
    url.host = 'zenvitra.xyz';
    url.port = '';
    return NextResponse.redirect(url, { status: 308 });
  }

  // Handle local dev testing for m.localhost
  if (host.startsWith('m.localhost')) {
    const port = host.split(':')[1] || '3000';
    url.host = `localhost:${port}`;
    return NextResponse.redirect(url, { status: 307 });
  }

  // SYSTEM-WIDE LOCKDOWN UNTIL 18TH SEPTEMBER 5:00 PM IST
  // Whitelist: /join-core-team, /countdown, /api/core-team, /api/sheets, static files, and admin secret enclave
  const isAllowedPath = 
    pathname === '/countdown' ||
    pathname.startsWith('/join-core-team') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/brand') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.wav') ||
    pathname.endsWith('.mp3') ||
    pathname === '/manifest.json' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml';

  if (!isAllowedPath) {
    url.pathname = '/countdown';
    return NextResponse.redirect(url, { status: 307 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)',
  ],
};
