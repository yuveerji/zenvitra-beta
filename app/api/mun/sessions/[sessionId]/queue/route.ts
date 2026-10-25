import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // Check if already in queue
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

    await db.munSpeakerQueue.deleteMany({
      where: { id: entryId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error removing from speaker queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
