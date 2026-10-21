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
      escalatedTo = 'FOUNDER', // 'SENIOR_ADMIN' or 'FOUNDER'
      escalationReason,
      actorId = 'staff',
      actorName = 'Support Officer',
      actorRole = 'STAFF'
    } = body;

    if (!escalationReason || !escalationReason.trim()) {
      return NextResponse.json({ success: false, error: 'Escalation reason is required.' }, { status: 400 });
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

    const updated = await db.supportTicket.update({
      where: { id: ticket.id },
      data: {
        status: 'ESCALATED',
        escalatedTo,
        escalationReason: escalationReason.trim(),
        assignedTeam: escalatedTo === 'FOUNDER' ? 'Founder Executive Desk' : 'Senior Oversight Chamber',
        auditLogs: {
          create: {
            actorId,
            actorName,
            actorRole,
            action: 'ESCALATED',
            details: JSON.stringify({
              previousStatus: ticket.status,
              escalatedTo,
              reason: escalationReason.trim(),
              escalatedBy: actorName
            })
          }
        }
      },
      include: {
        messages: true,
        internalNotes: true,
        auditLogs: true
      }
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    console.error('[SUPPORT_ESCALATE_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to escalate ticket' }, { status: 500 });
  }
}
