import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jwtVerify } from 'jose';
import { getEffectiveUserChairPermissions } from '@/lib/mun/permissions';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'zenvitra_sovereign_secret_key_development_32_bytes_min';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    // 1. Resolve Session and Committee
    const session = await db.munSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }],
      },
      include: {
        committee: true,
      },
    });

    const committeeId = session?.committeeId || null;
    const conferenceId = session?.committee?.conferenceId || null;

    // 2. Extract Authenticated User from Session Cookies or Authorization Header
    let userId: string | null = null;
    let userEmail: string | null = null;
    let userRole: string | null = null;

    // A. Check zenvitra_session_token (JWT)
    const token = req.cookies.get('zenvitra_session_token')?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
        if (payload) {
          userId = (payload.userId || payload.id || payload.sub) as string;
          userEmail = (payload.email || null) as string;
          userRole = (payload.role || null) as string;
        }
      } catch {}
    }

    // B. Check clearance role cookie or headers as fallback
    if (!userRole) {
      userRole = req.cookies.get('zenvitra_clearance_role')?.value || null;
    }

    // C. Check query params or custom client auth headers for local testing
    const authHeaderUserId = req.headers.get('x-zenvitra-user-id');
    const authHeaderEmail = req.headers.get('x-zenvitra-email');
    if (!userId && authHeaderUserId) userId = authHeaderUserId;
    if (!userEmail && authHeaderEmail) userEmail = authHeaderEmail;

    // 3. Evaluate Effective Permissions using Central RBAC
    const perms = await getEffectiveUserChairPermissions({
      userId,
      email: userEmail,
      platformRole: userRole,
      committeeId,
      conferenceId,
    });

    return NextResponse.json({
      success: true,
      sessionId,
      committeeId,
      canAccessChairConsole: perms.canAccessChairConsole,
      assignedRole: perms.assignedRole,
      permissions: perms.permissions,
      isRevoked: perms.isRevoked,
      reason: perms.reason,
    });
  } catch (error) {
    console.error('Failed to resolve session permissions:', error);
    return NextResponse.json({
      success: false,
      canAccessChairConsole: false,
      assignedRole: 'NONE',
      permissions: [],
      error: 'Failed to verify session permissions',
    }, { status: 500 });
  }
}
