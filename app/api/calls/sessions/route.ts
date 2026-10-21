import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const hostId = searchParams.get('hostId');
    const isStage = searchParams.get('isStage');

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (type && type !== 'ALL') where.type = type;
    if (hostId) where.hostId = hostId;
    if (isStage === 'true') where.isStage = true;

    const sessions = await db.callSession.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: 50,
      include: {
        participants: true,
        speakerQueue: true
      }
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error: any) {
    console.error('[CALL_SESSIONS_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = 'VIDEO',
      title = 'Instant Secure Call',
      hostId,
      hostName = 'Delegate',
      roomCode,
      isStage = false,
      committeeId
    } = body;

    const code = roomCode || `zen-call-${Date.now().toString(36)}`;
    const count = await db.callSession.count();
    const callNumber = `CALL-${1000 + count + 1}`;

    const session = await db.callSession.create({
      data: {
        callNumber,
        type,
        title: title.trim(),
        status: 'CONNECTED',
        hostId: hostId || 'anonymous_host',
        hostName: hostName.trim(),
        roomCode: code,
        isStage: !!isStage,
        committeeId: committeeId || null,
        participantsCount: 1,
        participants: {
          create: {
            userId: hostId || 'anonymous_host',
            userName: hostName.trim(),
            userRole: isStage ? 'CHAIR' : 'HOST',
            isMuted: false,
            isCameraOn: type !== 'VOICE',
            isScreenSharing: false,
            isHandRaised: false
          }
        }
      },
      include: {
        participants: true
      }
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error: any) {
    console.error('[CALL_SESSIONS_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create call session' }, { status: 500 });
  }
}
