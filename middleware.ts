import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for Edge JWT verification
const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'zenvitra_sovereign_secret_key_development_32_bytes_min';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

// Public marketing & informational routes accessible without authentication
const PUBLIC_PREFIXES = [
  '/_next',
  '/api/auth',
  '/api/health',
  '/icons',
  '/brand',
  '/fonts',
  '/assets',
  '/images',
  '/auth',
  '/about',
  '/campus-ambassador',
  '/constitution',
  '/contact',
  '/countdown',
  '/discussions',
  '/docs',
  '/faq',
  '/guidelines',
  '/impact',
  '/join-core-team',
  '/legal',
  '/login',
  '/manifesto',
  '/mission',
  '/news',
  '/pricing',
  '/privacy',
  '/register',
  '/solutions',
  '/terms',
  '/vision',
  '/welcome',
  '/onboarding',
  '/pre-register',
  '/pre-login',
];

const STATIC_EXTENSIONS = [
  '.html',
  '.htm',
  '.pdf',
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

// Routes strictly requiring an authenticated cryptographic session
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/platform',
  '/settings',
  '/admin',
  '/founder',
  '/pulse/create-story',
  '/test-node',
];

/**
 * Edge-compatible cryptographic session validator using jose.
 */
async function verifySessionToken(token?: string): Promise<{ valid: boolean; payload?: any }> {
  if (!token) return { valid: false };
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // Subdomain normalization
  if (host.startsWith('m.zenvitra.xyz')) {
    url.host = 'zenvitra.xyz';
    url.port = '';
    return NextResponse.redirect(url, { status: 308 });
  }

  // Canonical route redirects
  if (pathname === '/signup' || pathname.startsWith('/signup/')) {
    const registerUrl = new URL('/register', request.url);
    registerUrl.search = request.nextUrl.search;
    return NextResponse.redirect(registerUrl, { status: 308 });
  }

  if (pathname === '/platform' || pathname === '/platform/') {
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.search = request.nextUrl.search;
    return NextResponse.redirect(dashboardUrl, { status: 307 });
  }

  // Allow static files and internal Next.js assets immediately
  if (
    pathname.startsWith('/_next') ||
    STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext)) ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json'
  ) {
    return NextResponse.next();
  }

  // ── Cryptographic Session Verification at the Edge ──
  // Check HttpOnly session token
  const sessionCookie = request.cookies.get('zenvitra_session_token')?.value;
  const sessionCheck = await verifySessionToken(sessionCookie);

  // Check NextAuth session tokens as fallback
  const hasNextAuthCookie = Boolean(
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('authjs.session-token')?.value
  );

  const isAuthenticated = sessionCheck.valid || hasNextAuthCookie;

  // Enforce Protected Routes
  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl, { status: 307 });
  }

  // Enforce Founder / Admin Enclave at the Edge
  if (pathname.startsWith('/founder') || pathname.startsWith('/admin')) {
    const role = sessionCheck.payload?.role;
    if (role !== 'FOUNDER' && role !== 'CO_FOUNDER' && role !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'insufficient_clearance');
      return NextResponse.redirect(loginUrl, { status: 307 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons).*)',
  ],
};
