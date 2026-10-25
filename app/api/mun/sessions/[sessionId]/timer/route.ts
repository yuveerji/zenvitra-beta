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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { action, durationSec } = body; // action: 'START' | 'PAUSE' | 'RESET' | 'SET_DURATION'

    const session = await db.munSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }],
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Authorization check for chair_console.control_timer
    const caller = await getCallerIdentity(req);
    const perms = await getEffectiveUserChairPermissions({
      userId: caller.userId,
      email: caller.userEmail,
      platformRole: caller.userRole,
      committeeId: session.committeeId,
    });

    if (!perms.permissions.includes(CHAIR_PERMISSIONS.CONTROL_TIMER)) {
      await logAuthAuditEvent({
        actorUserId: caller.userId || 'anonymous',
        targetUserId: 'none',
        action: 'ACCESS_DENIED',
        committeeId: session.committeeId,
        permission: CHAIR_PERMISSIONS.CONTROL_TIMER,
        reason: 'Attempted to control timer without permission',
      });
      return NextResponse.json(
        { error: 'Forbidden: Missing chair_console.control_timer permission' },
        { status: 403 }
      );
    }

    const now = BigInt(Date.now());
    let nextAnchor: bigint | null = session.timerAnchorEpochMs;
    let nextRemaining = session.timerRemainingAtMs;
    let nextRunning = session.isTimerRunning;
    let nextDuration = session.timerDurationSec;

    if (action === 'START') {
      if (!session.isTimerRunning) {
        nextAnchor = now;
        nextRunning = true;
      }
    } else if (action === 'PAUSE') {
      if (session.isTimerRunning && session.timerAnchorEpochMs) {
        const elapsed = now - session.timerAnchorEpochMs;
        const remaining = session.timerRemainingAtMs - elapsed;
        nextRemaining = remaining > BigInt(0) ? remaining : BigInt(0);
        nextAnchor = null;
        nextRunning = false;
      }
    } else if (action === 'RESET') {
      const dur = durationSec ? Number(durationSec) : session.timerDurationSec;
      nextDuration = dur;
      nextRemaining = BigInt(dur * 1000);
      nextAnchor = null;
      nextRunning = false;
    } else if (action === 'SET_DURATION') {
      if (durationSec) {
        nextDuration = Number(durationSec);
        nextRemaining = BigInt(Number(durationSec) * 1000);
        nextAnchor = null;
        nextRunning = false;
      }
    }

    const updated = await db.munSession.update({
      where: { id: session.id },
      data: {
        timerDurationSec: nextDuration,
        timerAnchorEpochMs: nextAnchor,
        timerRemainingAtMs: nextRemaining,
        isTimerRunning: nextRunning,
      },
    });

    return NextResponse.json({
      success: true,
      timer: {
        durationSec: updated.timerDurationSec,
        remainingSec: Math.max(0, Math.round(Number(updated.timerRemainingAtMs) / 1000)),
        isRunning: updated.isTimerRunning,
        anchorEpochMs: updated.timerAnchorEpochMs ? Number(updated.timerAnchorEpochMs) : null,
      },
    });
  } catch (error) {
    console.error('Timer route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
