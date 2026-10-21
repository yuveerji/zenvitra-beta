import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ stageId: string }> }
) {
  try {
    const { stageId } = await params;

    // Find session corresponding to stageId or create one if not yet initialized
    let session = await db.callSession.findFirst({
      where: {
        OR: [
          { roomCode: stageId },
          { id: stageId }
        ]
      },
      include: {
        speakerQueue: {
          orderBy: { queuedAt: 'asc' }
        }
      }
    });

    if (!session) {
      session = await db.callSession.create({
        data: {
          callNumber: `STAGE-${Date.now().toString().slice(-4)}`,
          type: 'STAGE',
          title: `Plenary Stage Chamber: ${stageId}`,
          status: 'CONNECTED',
          hostId: 'dais_secretariat',
          hostName: 'Dais Secretariat',
          roomCode: stageId,
          isStage: true,
          participantsCount: 1
        },
        include: {
          speakerQueue: true
        }
      });
    }

    return NextResponse.json({ success: true, session, queue: session.speakerQueue });
  } catch (error: any) {
    console.error('[STAGE_QUEUE_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch stage queue' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ stageId: string }> }
) {
  try {
    const { stageId } = await params;
    const body = await req.json();
    const { action, userId, userName, delegationCountry, speakDurationSeconds = 90, queueItemId } = body;

    let session = await db.callSession.findFirst({
      where: {
        OR: [
          { roomCode: stageId },
          { id: stageId }
        ]
      }
    });

    if (!session) {
      session = await db.callSession.create({
        data: {
          callNumber: `STAGE-${Date.now().toString().slice(-4)}`,
          type: 'STAGE',
          title: `Plenary Stage Chamber: ${stageId}`,
          status: 'CONNECTED',
          hostId: 'dais_secretariat',
          hostName: 'Dais Secretariat',
          roomCode: stageId,
          isStage: true,
          participantsCount: 1
        }
      });
    }

    if (action === 'ENQUEUE') {
      const entry = await db.callSpeakerQueueRecord.create({
        data: {
          sessionId: session.id,
          userId: userId || 'delegate_id',
          userName: userName || 'Delegate',
          delegationCountry: delegationCountry || 'Delegation',
          speakDurationSeconds: Number(speakDurationSeconds),
          status: 'QUEUED'
        }
      });
      return NextResponse.json({ success: true, entry });
    }

    if (action === 'START_SPEECH' && queueItemId) {
      // Mark current active speeches as CONCLUDED
      await db.callSpeakerQueueRecord.updateMany({
        where: { sessionId: session.id, status: 'SPEAKING' },
        data: { status: 'CONCLUDED' }
      });

      const entry = await db.callSpeakerQueueRecord.update({
        where: { id: queueItemId },
        data: {
          status: 'SPEAKING',
          startedAt: new Date()
        }
      });
      return NextResponse.json({ success: true, entry });
    }

    if (action === 'CONCLUDE_SPEECH' && queueItemId) {
      const entry = await db.callSpeakerQueueRecord.update({
        where: { id: queueItemId },
        data: { status: 'CONCLUDED' }
      });
      return NextResponse.json({ success: true, entry });
    }

    if (action === 'YIELD_TIME' && queueItemId) {
      const entry = await db.callSpeakerQueueRecord.update({
        where: { id: queueItemId },
        data: { status: 'YIELDED' }
      });
      return NextResponse.json({ success: true, entry });
    }

    if (action === 'REMOVE' && queueItemId) {
      await db.callSpeakerQueueRecord.delete({
        where: { id: queueItemId }
      });
      return NextResponse.json({ success: true, message: 'Removed from queue' });
    }

    return NextResponse.json({ success: false, error: 'Invalid queue action' }, { status: 400 });
  } catch (error: any) {
    console.error('[STAGE_QUEUE_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update queue' }, { status: 500 });
  }
}
