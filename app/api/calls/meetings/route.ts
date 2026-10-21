import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hostId = searchParams.get('hostId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: any = {};
    if (hostId) where.hostId = hostId;
    if (status && status !== 'ALL') where.status = status;
    if (type && type !== 'ALL') where.type = type;

    const meetings = await db.callMeeting.findMany({
      where,
      orderBy: { scheduledStart: 'asc' },
      take: 100
    });

    return NextResponse.json({ success: true, meetings });
  } catch (error: any) {
    console.error('[CALL_MEETINGS_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      scheduledStart,
      scheduledEnd,
      hostId,
      hostName,
      hostEmail,
      passcode,
      waitingRoom = true,
      invitees = [],
      type = 'GROUP'
    } = body;

    if (!title || !scheduledStart || !scheduledEnd) {
      return NextResponse.json({ success: false, error: 'Title, start time, and end time are required.' }, { status: 400 });
    }

    // Generate readable meeting ID: e.g. mtg-392-817
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    const meetingId = `mtg-${randomSuffix.slice(0, 3)}-${randomSuffix.slice(3)}`;
    const roomUrl = `/meet/${meetingId}`;

    const meeting = await db.callMeeting.create({
      data: {
        meetingId,
        title: title.trim(),
        description: description?.trim() || null,
        scheduledStart: new Date(scheduledStart),
        scheduledEnd: new Date(scheduledEnd),
        hostId: hostId || 'user_host',
        hostName: hostName || 'Delegate',
        hostEmail: hostEmail || null,
        passcode: passcode?.trim() || null,
        waitingRoom: !!waitingRoom,
        inviteesJson: JSON.stringify(invitees || []),
        roomUrl,
        type,
        status: 'SCHEDULED'
      }
    });

    return NextResponse.json({ success: true, meeting }, { status: 201 });
  } catch (error: any) {
    console.error('[CALL_MEETINGS_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to schedule meeting' }, { status: 500 });
  }
}
