import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const { searchParams } = new URL(req.url);
    const isStaff = searchParams.get('isStaff') === 'true';

    // Strict security enforcement: regular users cannot read internal notes
    if (!isStaff) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Internal notes are restricted to verified staff.' }, { status: 403 });
    }

    const ticket = await db.supportTicket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { ticketNumber: ticketId }
        ]
      }
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    const notes = await db.supportInternalNote.findMany({
      where: { ticketId: ticket.id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, notes });
  } catch (error: any) {
    console.error('[SUPPORT_INTERNAL_NOTES_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch internal notes' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const body = await req.json();
    const {
      authorId,
      authorName = 'Staff Investigator',
      authorRole = 'STAFF',
      note
    } = body;

    // Strict role check
    if (authorRole !== 'STAFF' && authorRole !== 'ADMIN' && authorRole !== 'FOUNDER') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Only staff or administrators can create internal notes.' }, { status: 403 });
    }

    if (!note || !note.trim()) {
      return NextResponse.json({ success: false, error: 'Internal note cannot be empty' }, { status: 400 });
    }

    const ticket = await db.supportTicket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { ticketNumber: ticketId }
        ]
      }
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    const internalNote = await db.supportInternalNote.create({
      data: {
        ticketId: ticket.id,
        authorId: authorId || 'staff_member',
        authorName,
        authorRole,
        note: note.trim()
      }
    });

    await db.supportTicket.update({
      where: { id: ticket.id },
      data: {
        auditLogs: {
          create: {
            actorId: authorId || 'staff_member',
            actorName: authorName,
            actorRole: authorRole,
            action: 'NOTE_ADDED',
            details: JSON.stringify({ noteId: internalNote.id })
          }
        }
      }
    });

    return NextResponse.json({ success: true, note: internalNote }, { status: 201 });
  } catch (error: any) {
    console.error('[SUPPORT_INTERNAL_NOTES_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to add internal note' }, { status: 500 });
  }
}
