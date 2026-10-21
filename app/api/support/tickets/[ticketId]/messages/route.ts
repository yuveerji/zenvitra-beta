import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const body = await req.json();
    const {
      senderId,
      senderName,
      senderRole = 'USER',
      content,
      attachments = [],
      isOfficial = false
    } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Message content cannot be empty' }, { status: 400 });
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

    const newMessage = await db.supportMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: senderId || 'user',
        senderName: senderName || (senderRole === 'USER' ? 'Requester' : 'Staff Officer'),
        senderRole,
        content: content.trim(),
        attachments: JSON.stringify(attachments || []),
        isOfficial: senderRole === 'STAFF' || senderRole === 'ADMIN' || senderRole === 'FOUNDER' || senderRole === 'HOST' || senderRole === 'ORGANIZER' || isOfficial
      }
    });

    // Update ticket status based on message flow
    let nextStatus = ticket.status;
    if (senderRole === 'USER') {
      // If user replies and ticket was waiting on them or resolved, move back to IN_PROGRESS or OPEN
      if (ticket.status === 'WAITING_USER' || ticket.status === 'RESOLVED') {
        nextStatus = 'IN_PROGRESS';
      }
    } else if (senderRole === 'STAFF' || senderRole === 'ADMIN' || senderRole === 'FOUNDER' || senderRole === 'HOST' || senderRole === 'ORGANIZER') {
      // If staff or host replies, move to WAITING_USER if awaiting user confirmation
      if (ticket.status === 'NEW' || ticket.status === 'OPEN') {
        nextStatus = 'WAITING_USER';
      }
    }

    await db.supportTicket.update({
      where: { id: ticket.id },
      data: {
        status: nextStatus,
        updatedAt: new Date(),
        auditLogs: {
          create: {
            actorId: senderId || 'user',
            actorName: senderName || 'User',
            actorRole: senderRole,
            action: 'REPLY_SENT',
            details: JSON.stringify({ messageId: newMessage.id, isOfficial })
          }
        }
      }
    });

    return NextResponse.json({ success: true, message: newMessage, status: nextStatus }, { status: 201 });
  } catch (error: any) {
    console.error('[SUPPORT_MESSAGES_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to send message' }, { status: 500 });
  }
}
