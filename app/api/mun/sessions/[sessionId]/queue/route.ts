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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = await db.munSession.findFirst({
      where: { OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }] },
      select: { id: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const queue = await db.munSpeakerQueue.findMany({
      where: { sessionId: session.id, status: 'QUEUED' },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ queue });
  } catch (error: any) {
    console.error('Error fetching speaker queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { delegateId, countryOrSeat, delegateName } = body;

    if (!countryOrSeat || !delegateName) {
      return NextResponse.json({ error: 'Missing country or delegate name' }, { status: 400 });
    }

    const session = await db.munSession.findFirst({
      where: { OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }] },
      select: { id: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check if delegation already in queue
    const existingEntry = await db.munSpeakerQueue.findFirst({
      where: {
        sessionId: session.id,
        countryOrSeat,
        status: 'QUEUED',
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Delegation is already in the speaking queue' },
        { status: 409 }
      );
    }

    // Determine next position
    const lastItem = await db.munSpeakerQueue.findFirst({
      where: { sessionId: session.id, status: 'QUEUED' },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const nextPosition = (lastItem?.position || 0) + 1;

    const newEntry = await db.munSpeakerQueue.create({
      data: {
        sessionId: session.id,
        delegateId: delegateId || `del_${Date.now()}`,
        countryOrSeat,
        delegateName,
        position: nextPosition,
        status: 'QUEUED',
      },
    });

    await db.munSessionAudit.create({
      data: {
        sessionId: session.id,
        actorUserId: 'queue_authority',
        action: 'SPEAKER_ADDED',
        summary: `Added ${countryOrSeat} (${delegateName}) to queue at position #${nextPosition}`,
      },
    });

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error: any) {
    console.error('Error adding to speaker queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { searchParams } = new URL(req.url);
    const entryId = searchParams.get('id');

    if (!entryId) {
      return NextResponse.json({ error: 'Missing entry id' }, { status: 400 });
    }

    const session = await db.munSession.findFirst({
      where: { OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }] },
      select: { id: true, committeeId: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const caller = await getCallerIdentity(req);
    const perms = await getEffectiveUserChairPermissions({
      userId: caller.userId,
      email: caller.userEmail,
      platformRole: caller.userRole,
      committeeId: session.committeeId,
    });

    // Check if item belongs to the caller or caller has manage_speakers_list
    const targetEntry = await db.munSpeakerQueue.findUnique({
      where: { id: entryId },
    });

    const isOwnEntry = targetEntry && caller.userId && targetEntry.delegateId === caller.userId;
    const hasChairPerm = perms.permissions.includes(CHAIR_PERMISSIONS.MANAGE_SPEAKERS_LIST);

    if (!isOwnEntry && !hasChairPerm) {
      await logAuthAuditEvent({
        actorUserId: caller.userId || 'anonymous',
        targetUserId: targetEntry?.delegateId || 'unknown',
        action: 'ACCESS_DENIED',
        committeeId: session.committeeId,
        permission: CHAIR_PERMISSIONS.MANAGE_SPEAKERS_LIST,
        reason: 'Attempted to remove another delegation from queue without permission',
      });
      return NextResponse.json(
        { error: 'Forbidden: Missing chair_console.manage_speakers_list permission' },
        { status: 403 }
      );
    }

    await db.munSpeakerQueue.deleteMany({
      where: { id: entryId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error removing from speaker queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
