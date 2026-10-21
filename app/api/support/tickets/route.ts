import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sheetSync } from '@/lib/googleSheets';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const assignedTeam = searchParams.get('assignedTeam');
    const assignedToId = searchParams.get('assignedToId');
    const isStaff = searchParams.get('isStaff') === 'true';
    const relatedEventId = searchParams.get('relatedEventId');
    const isHost = searchParams.get('isHost') === 'true';

    const where: any = {};

    if (relatedEventId) {
      where.relatedEventId = relatedEventId;
    }

    // If caller is regular user, restrict to their own tickets unless they are staff or host of the event
    if (!isStaff && !isHost) {
      if (userId && userEmail) {
        where.OR = [{ userId }, { userEmail }];
      } else if (userId) {
        where.userId = userId;
      } else if (userEmail) {
        where.userEmail = userEmail;
      }
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (priority && priority !== 'ALL') {
      where.priority = priority;
    }
    if (assignedTeam && assignedTeam !== 'ALL') {
      where.assignedTeam = assignedTeam;
    }
    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    const tickets = await db.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { messages: true, internalNotes: true }
        }
      }
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error('[SUPPORT_TICKETS_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subject,
      category,
      subcategory,
      description,
      priority = 'P3_NORMAL',
      userId,
      userEmail,
      userName,
      userHandle,
      relatedEventId,
      relatedTxnId,
      attachmentUrls = []
    } = body;

    if (!subject || !description || !userEmail || !category) {
      return NextResponse.json(
        { success: false, error: 'Subject, category, description, and userEmail are required.' },
        { status: 400 }
      );
    }

    // Determine initial routing team based on category
    let initialTeam = 'General Helpdesk';
    switch (category) {
      case 'ACCOUNT':
        initialTeam = 'Account & Identity Operations';
        break;
      case 'EVENTS':
        initialTeam = 'Event Operations Desk';
        break;
      case 'MUN':
        initialTeam = 'MUN Dais & Secretariat Support';
        break;
      case 'PAYMENTS':
        initialTeam = 'Finance & Cashfree Verification';
        break;
      case 'TECHNICAL':
        initialTeam = 'Engineering & Systems Desk';
        break;
      case 'SAFETY':
        initialTeam = 'Safety, Safeguarding & Privacy';
        break;
      default:
        initialTeam = 'General Community Helpdesk';
        break;
    }

    // Generate unique sequential ticket number
    const count = await db.supportTicket.count();
    const ticketNumber = `ZEN-${1040 + count + 1}`;

    const newTicket = await db.supportTicket.create({
      data: {
        ticketNumber,
        subject: subject.trim(),
        category,
        subcategory: subcategory?.trim() || null,
        description: description.trim(),
        priority,
        status: 'NEW',
        userId: userId || null,
        userEmail: userEmail.trim().toLowerCase(),
        userName: userName?.trim() || 'Verified Member',
        userHandle: userHandle?.trim() || null,
        assignedTeam: initialTeam,
        relatedEventId: relatedEventId || null,
        relatedTxnId: relatedTxnId || null,
        attachmentUrls: JSON.stringify(attachmentUrls || []),
        messages: {
          create: {
            senderId: userId || 'user',
            senderName: userName || 'Requester',
            senderRole: 'USER',
            content: description.trim(),
            attachments: JSON.stringify(attachmentUrls || []),
            isOfficial: false
          }
        },
        auditLogs: {
          create: {
            actorId: userId || 'user',
            actorName: userName || 'Requester',
            actorRole: 'USER',
            action: 'CREATED',
            details: JSON.stringify({ ticketNumber, category, priority, initialTeam })
          }
        }
      },
      include: {
        messages: true
      }
    });

    // Asynchronously dispatch to Register 25_SUPPORT_CASES
    sheetSync.supportTicket({
      Case_ID: newTicket.ticketNumber,
      Person_ID: newTicket.userId || '',
      Requester_Email: newTicket.userEmail,
      Requester_Name: newTicket.userName,
      Subject: newTicket.subject,
      Category: newTicket.category,
      Priority: newTicket.priority,
      Assigned_Agent: newTicket.assignedTeam,
      Case_Status: newTicket.status,
      Opened_At: newTicket.createdAt.toISOString(),
      First_Response_At: '',
      Closed_At: '',
      Notes: `Initial Team: ${newTicket.assignedTeam} | Subcategory: ${newTicket.subcategory || 'None'}`
    }).catch((err) => console.warn('[SHEETS-SUPPORT-TICKET-SYNC-WARN]', err));

    return NextResponse.json({ success: true, ticket: newTicket }, { status: 201 });
  } catch (error: any) {
    console.error('[SUPPORT_TICKETS_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create ticket' }, { status: 500 });
  }
}
