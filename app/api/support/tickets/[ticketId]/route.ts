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

    const ticket = await db.supportTicket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { ticketNumber: ticketId }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' }
        },
        ...(isStaff
          ? {
              internalNotes: {
                orderBy: { createdAt: 'asc' }
              }
            }
          : {})
      }
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error('[SUPPORT_TICKET_DETAIL_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to retrieve ticket' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const body = await req.json();
    const {
      status,
      priority,
      assignedToId,
      assignedToName,
      assignedTeam,
      resolutionSummary,
      resolutionCode,
      rating,
      feedbackComment,
      actorId = 'system',
      actorName = 'Operator',
      actorRole = 'STAFF'
    } = body;

    const existing = await db.supportTicket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { ticketNumber: ticketId }
        ]
      }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    const updateData: any = {};
    const auditActions: string[] = [];

    if (status && status !== existing.status) {
      updateData.status = status;
      auditActions.push(`Status changed from ${existing.status} to ${status}`);
      if (status === 'RESOLVED') {
        updateData.resolvedAt = new Date();
      } else if (status === 'CLOSED') {
        updateData.closedAt = new Date();
      }
    }

    if (priority && priority !== existing.priority) {
      updateData.priority = priority;
      auditActions.push(`Priority changed to ${priority}`);
    }

    if (assignedToId !== undefined) {
      updateData.assignedToId = assignedToId;
      updateData.assignedToName = assignedToName || null;
      auditActions.push(`Assigned to ${assignedToName || 'Unassigned'}`);
    }

    if (assignedTeam && assignedTeam !== existing.assignedTeam) {
      updateData.assignedTeam = assignedTeam;
      auditActions.push(`Team route changed to ${assignedTeam}`);
    }

    if (resolutionSummary !== undefined) {
      updateData.resolutionSummary = resolutionSummary;
    }

    if (resolutionCode !== undefined) {
      updateData.resolutionCode = resolutionCode;
    }

    if (rating !== undefined) {
      updateData.rating = rating;
      updateData.feedbackComment = feedbackComment || null;
      auditActions.push(`User submitted satisfaction rating: ${rating}/5`);
    }

    const updatedTicket = await db.supportTicket.update({
      where: { id: existing.id },
      data: {
        ...updateData,
        auditLogs: auditActions.length > 0 ? {
          create: {
            actorId,
            actorName,
            actorRole,
            action: status ? 'STATUS_CHANGED' : 'UPDATED',
            details: JSON.stringify(auditActions)
          }
        } : undefined
      },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        auditLogs: { orderBy: { createdAt: 'desc' } }
      }
    });

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (error: any) {
    console.error('[SUPPORT_TICKET_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update ticket' }, { status: 500 });
  }
}
