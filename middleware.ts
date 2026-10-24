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

  // ── Stealth 404 for Founder & Admin Enclaves (Zero-Knowledge Security) ──
  // If an account is at normal status or not in the core team / admin list,
  // return an identical 404 Not Found error (never redirect to login).
  const FOUNDER_CLEARANCE_ROLES = ['FOUNDER', 'CO_FOUNDER', 'founder', 'co_founder'];
  const ADMIN_CORE_CLEARANCE_ROLES = [
    'FOUNDER',
    'CO_FOUNDER',
    'CHIEF_OF_STAFF',
    'ADMIN',
    'SECRETARY_GENERAL',
    'DIRECTOR_GENERAL',
    'CHAIRPERSON',
    'VICE_CHAIR',
    'TECH_LEAD',
    'FULLSTACK_DEV',
    'DESIGN_LEAD',
    'POLICY_RESEARCHER',
    'FINANCE_LEAD',
    'OUTREACH_LEAD',
    'OPERATIONS_LEAD',
    'COMMUNITY_LEAD',
    'MODERATOR',
    'SECRETARIAT_CHAIR',
    'CORE_TEAM',
    'founder',
    'co_founder',
    'admin',
    'core_team',
  ];

  // ── PRE-LAUNCH STRICT LOCKDOWN PROTOCOL ──
  // Target Launch Time: 2:00:00 PM IST on October 25, 2026.
  // Before 2:00:00 PM IST, no page unlocks except /countdown and connected portals:
  // - /countdown
  // - /countdown-test
  // - /pre-register
  // - /pre-login
  // - /join-core-team
  // - /forms
  // - /statusregister
  // - /statussignin
  // - /api/*
  // All other pages strictly redirect to /countdown until official launch.
  const LAUNCH_TIMESTAMP = new Date('2026-10-25T14:00:00+05:30').getTime();
  const isPreLaunch = Date.now() < LAUNCH_TIMESTAMP;

  if (isPreLaunch) {
    const COUNTDOWN_WHITELIST_PREFIXES = [
      '/countdown',
      '/countdown-test',
      '/pre-register',
      '/pre-login',
      '/join-core-team',
      '/forms',
      '/statusregister',
      '/statussignin',
      '/api',
    ];

    const isCountdownWhitelisted = COUNTDOWN_WHITELIST_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    const userRole = sessionCheck.payload?.role;
    const isFounderOrAdmin = Boolean(sessionCheck.valid && userRole && (
      FOUNDER_CLEARANCE_ROLES.includes(userRole) || ADMIN_CORE_CLEARANCE_ROLES.includes(userRole)
    ));
    const hasPortalFlashBypass = Boolean(
      request.cookies.get('from_portal_flash')?.value === 'true' ||
      request.cookies.get('zenvitra_launch_preview')?.value === 'true' ||
      request.nextUrl.searchParams.get('preview') === 'genesis_founder'
    );

    if (!isCountdownWhitelisted && !isFounderOrAdmin && !hasPortalFlashBypass) {
      const countdownUrl = new URL('/countdown', request.url);
      return NextResponse.redirect(countdownUrl, { status: 307 });
    }
  }

  const isFounderPath = pathname.startsWith('/zen-vault-root') || pathname.startsWith('/founder');
  const isAdminCorePath = (
    pathname.startsWith('/core-team-panel') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/admin-access') ||
    pathname.startsWith('/enclave') ||
    pathname.startsWith('/enclave-access')
  );

  if (isFounderPath) {
    const role = sessionCheck.payload?.role;
    if (!sessionCheck.valid || !role || !FOUNDER_CLEARANCE_ROLES.includes(role)) {
      return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
    }
  }

  if (isAdminCorePath) {
    const role = sessionCheck.payload?.role;
    if (!sessionCheck.valid || !role || !ADMIN_CORE_CLEARANCE_ROLES.includes(role)) {
      return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
    }
  }

  // Stealth 404 if an unauthorized or normal user probes administrative access links
  const adminQueryParam = request.nextUrl.searchParams.get('admin_key') || request.nextUrl.searchParams.get('founder_key');
  const accessKeyParam = request.nextUrl.searchParams.get('access_key') || request.nextUrl.searchParams.get('key') || request.nextUrl.searchParams.get('bypass_key');
  const hasAdminQueryProbe = Boolean(
    adminQueryParam ||
    (accessKeyParam && (accessKeyParam.toUpperCase().includes('ADMIN') || accessKeyParam.toUpperCase().includes('FOUNDER') || accessKeyParam.toUpperCase().includes('SECRET') || accessKeyParam.toUpperCase().includes('OPERATOR')))
  );

  if (hasAdminQueryProbe) {
    const role = sessionCheck.payload?.role;
    if (!sessionCheck.valid || !role || !ADMIN_CORE_CLEARANCE_ROLES.includes(role)) {
      return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
    }
  }

  // Enforce Protected Routes for standard authenticated members
  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl, { status: 307 });
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
