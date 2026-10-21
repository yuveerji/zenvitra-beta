import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const session = await db.callSession.findFirst({
      where: {
        OR: [
          { id: sessionId },
          { roomCode: sessionId },
          { callNumber: sessionId }
        ]
      },
      include: {
        participants: true,
        speakerQueue: {
          orderBy: { queuedAt: 'asc' }
        },
        reports: true
      }
    });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    console.error('[CALL_SESSION_DETAIL_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch session' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { status, durationSeconds, recordingUrl, participantsCount } = body;

    const session = await db.callSession.findFirst({
      where: {
        OR: [
          { id: sessionId },
          { roomCode: sessionId },
          { callNumber: sessionId }
        ]
      }
    });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    const updated = await db.callSession.update({
      where: { id: session.id },
      data: {
        ...(status ? { status } : {}),
        ...(status === 'ENDED' ? { endedAt: new Date() } : {}),
        ...(durationSeconds !== undefined ? { durationSeconds: Number(durationSeconds) } : {}),
        ...(recordingUrl !== undefined ? { recordingUrl } : {}),
        ...(participantsCount !== undefined ? { participantsCount: Number(participantsCount) } : {})
      },
      include: {
        participants: true,
        speakerQueue: true
      }
    });

    return NextResponse.json({ success: true, session: updated });
  } catch (error: any) {
    console.error('[CALL_SESSION_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update session' }, { status: 500 });
  }
}
