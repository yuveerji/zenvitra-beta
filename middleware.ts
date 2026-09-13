import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public website routes accessible without login
const PUBLIC_PREFIXES = [
  '/_next',
  '/api',
  '/icons',
  '/brand',
  '/fonts',
  '/assets',
  '/images',
  '/auth',
  '/mun',
  '/events',
  '/news',
  '/press',
  '/docs',
  '/solutions',
  '/donate',
  '/about',
  '/campus-ambassador',
  '/chamber',
  '/constitution',
  '/contact',
  '/countdown',
  '/discussions',
  '/guidelines',
  '/impact',
  '/invest-donate',
  '/join-core-team',
  '/manifesto',
  '/mission',
  '/pricing',
  '/privacy',
  '/statusregister',
  '/statussignin',
  '/terms',
  '/vision',
  '/login',
  '/register',
  '/join',
  '/faq',
  '/legal',
  '/team',
  '/careers',
];

const PUBLIC_EXACT = new Set([
  '/',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
]);

const STATIC_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
  '.wav',
  '.mp3',
  '.mp4',
  '.webm',
  '.css',
  '.js',
  '.map',
  '.txt',
  '.xml',
  '.json',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
];

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

  // Always allow static files & Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext)) ||
    PUBLIC_EXACT.has(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if visitor has an active authenticated session
  const hasSession = Boolean(
    request.cookies.get('zenvitra_session')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('sb-access-token')?.value ||
    request.cookies.get('zenvitra_admin_override_token')?.value ||
    request.cookies.get('zenvitra_clearance')?.value === 'SOVEREIGN_GRANTED' ||
    request.cookies.getAll().some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))
  );

  // Check if requested path is a public website page
  const isPublicWebsitePage = PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // If visitor is NOT logged in:
  // Public website pages are accessible, but any protected page (like /admin, /dashboard, /profile, /settings, /chat, etc.)
  // OR any arbitrary/unmapped route (e.g. /abc, /xyz, /test) redirects them to /login
  if (!hasSession) {
    if (isPublicWebsitePage) {
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl, { status: 307 });
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
