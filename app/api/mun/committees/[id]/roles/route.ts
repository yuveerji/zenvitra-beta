import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jwtVerify } from 'jose';
import {
  CHAIR_PERMISSIONS,
  getEffectiveUserChairPermissions,
  logAuthAuditEvent,
} from '@/lib/mun/permissions';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'zenvitra_sovereign_secret_key_development_32_bytes_min';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

async function getCallerIdentity(req: NextRequest) {
  let userId: string | null = null;
  let userEmail: string | null = null;
  let userRole: string | null = null;

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

  if (!userRole) {
    userRole = req.cookies.get('zenvitra_clearance_role')?.value || null;
  }

  const authHeaderUserId = req.headers.get('x-zenvitra-user-id');
  const authHeaderEmail = req.headers.get('x-zenvitra-email');
  if (!userId && authHeaderUserId) userId = authHeaderUserId;
  if (!userEmail && authHeaderEmail) userEmail = authHeaderEmail;

  return { userId, userEmail, userRole };
}

// ── GET /api/mun/committees/[id]/roles ──
// Returns all active role assignments for the specified committee
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: committeeId } = await params;
    const assignments = await db.munRoleAssignment.findMany({
      where: {
        OR: [{ committeeId }, { committeeId: null }],
        status: 'ACTIVE',
      },
      orderBy: { assignedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      committeeId,
      assignments,
    });
  } catch (error) {
    console.error('Failed to fetch committee roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

// ── POST /api/mun/committees/[id]/roles ──
// Assign or Revoke a role for a user on this committee
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: committeeId } = await params;
    const caller = await getCallerIdentity(req);

    // Verify caller permissions for roles.assign
    const callerPerms = await getEffectiveUserChairPermissions({
      userId: caller.userId,
      email: caller.userEmail,
      platformRole: caller.userRole,
      committeeId,
    });

    const isAuthorized =
      callerPerms.permissions.includes(CHAIR_PERMISSIONS.ROLES_ASSIGN) ||
      callerPerms.assignedRole === 'SUPER_ADMIN' ||
      callerPerms.assignedRole === 'SECRETARIAT_ADMIN';

    if (!isAuthorized) {
      await logAuthAuditEvent({
        actorUserId: caller.userId || 'anonymous',
        targetUserId: 'none',
        action: 'ACCESS_DENIED',
        committeeId,
        reason: 'Attempted to assign or revoke role without roles.assign permission',
      });
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to assign or revoke roles for this committee.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { targetUserId, role, action = 'ASSIGN', reason, expiresAt } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400 });
    }

    if (action === 'REVOKE') {
      // Revoke all active assignments for this user in this committee
      await db.munRoleAssignment.updateMany({
        where: {
          userId: targetUserId,
          committeeId,
          status: 'ACTIVE',
        },
        data: {
          status: 'REVOKED',
          revokedAt: new Date(),
          reason: reason || 'Revoked by authorized administrator',
        },
      });

      await logAuthAuditEvent({
        actorUserId: caller.userId || 'admin',
        targetUserId,
        action: 'ROLE_REVOKED',
        committeeId,
        reason: reason || 'Revocation executed',
      });

      return NextResponse.json({
        success: true,
        action: 'REVOKE',
        targetUserId,
        committeeId,
      });
    }

    // Default: ASSIGN
    if (!role) {
      return NextResponse.json({ error: 'Missing role for assignment' }, { status: 400 });
    }

    // Prevent ordinary chairs from promoting someone to SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && callerPerms.assignedRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Administrators can grant Super Admin clearance.' },
        { status: 403 }
      );
    }

    const newAssignment = await db.munRoleAssignment.create({
      data: {
        userId: targetUserId,
        committeeId,
        role: role.toUpperCase(),
        status: 'ACTIVE',
        assignedBy: caller.userId || caller.userEmail || 'system_admin',
        reason: reason || 'Official appointment',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    await logAuthAuditEvent({
      actorUserId: caller.userId || 'admin',
      targetUserId,
      action: 'ROLE_ASSIGNED',
      role: role.toUpperCase(),
      committeeId,
      reason: reason || 'Official appointment',
    });

    return NextResponse.json({
      success: true,
      action: 'ASSIGN',
      assignment: newAssignment,
    });
  } catch (error) {
    console.error('Failed to update committee role:', error);
    return NextResponse.json({ error: 'Failed to process role action' }, { status: 500 });
  }
}
