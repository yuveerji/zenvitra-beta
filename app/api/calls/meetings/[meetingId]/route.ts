import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;

    const meeting = await db.callMeeting.findFirst({
      where: {
        OR: [
          { id: meetingId },
          { meetingId }
        ]
      }
    });

    if (!meeting) {
      return NextResponse.json({ success: false, error: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, meeting });
  } catch (error: any) {
    console.error('[CALL_MEETING_DETAIL_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch meeting' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;
    const body = await req.json();
    const { status, title, description, scheduledStart, scheduledEnd, passcode, waitingRoom } = body;

    const meeting = await db.callMeeting.findFirst({
      where: {
        OR: [
          { id: meetingId },
          { meetingId }
        ]
      }
    });

    if (!meeting) {
      return NextResponse.json({ success: false, error: 'Meeting not found' }, { status: 404 });
    }

    const updated = await db.callMeeting.update({
      where: { id: meeting.id },
      data: {
        ...(status ? { status } : {}),
        ...(title ? { title: title.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(scheduledStart ? { scheduledStart: new Date(scheduledStart) } : {}),
        ...(scheduledEnd ? { scheduledEnd: new Date(scheduledEnd) } : {}),
        ...(passcode !== undefined ? { passcode: passcode?.trim() || null } : {}),
        ...(waitingRoom !== undefined ? { waitingRoom: !!waitingRoom } : {})
      }
    });

    return NextResponse.json({ success: true, meeting: updated });
  } catch (error: any) {
    console.error('[CALL_MEETING_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update meeting' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;

    const meeting = await db.callMeeting.findFirst({
      where: {
        OR: [
          { id: meetingId },
          { meetingId }
        ]
      }
    });

    if (!meeting) {
      return NextResponse.json({ success: false, error: 'Meeting not found' }, { status: 404 });
    }

    await db.callMeeting.update({
      where: { id: meeting.id },
      data: { status: 'CANCELLED' }
    });

    return NextResponse.json({ success: true, message: 'Meeting cancelled successfully' });
  } catch (error: any) {
    console.error('[CALL_MEETING_DELETE_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to cancel meeting' }, { status: 500 });
  }
}
