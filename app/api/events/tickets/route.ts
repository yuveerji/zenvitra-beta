import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateQrCodeToken } from '@/lib/ticketCrypto';
import { sheetSync } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const attendeeHandle = searchParams.get('attendeeHandle') || searchParams.get('username') || searchParams.get('handle');
    const attendeeEmail = searchParams.get('attendeeEmail') || searchParams.get('email');

    const whereClause: any = {};
    if (eventId) {
      whereClause.eventId = eventId;
    }

    if (attendeeHandle && attendeeEmail) {
      whereClause.OR = [
        { attendeeHandle },
        { attendeeEmail },
      ];
    } else if (attendeeHandle) {
      whereClause.attendeeHandle = attendeeHandle;
    } else if (attendeeEmail) {
      whereClause.attendeeEmail = attendeeEmail;
    }

    const tickets = await db.eventTicket.findMany({
      where: whereClause,
      orderBy: { issuedAt: 'desc' },
    });

    const totalTickets = tickets.length;
    const checkedInCount = tickets.filter((t) => t.status === 'CHECKED_IN').length;
    const studentCount = tickets.filter((t) => t.isStudent).length;
    const generalCount = totalTickets - studentCount;
    const grossRevenue = tickets.reduce((sum, t) => sum + (t.price || 0), 0);

    return NextResponse.json({
      success: true,
      tickets,
      stats: {
        totalTickets,
        checkedInCount,
        studentCount,
        generalCount,
        grossRevenue,
        checkInRate: totalTickets > 0 ? Math.round((checkedInCount / totalTickets) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error('[GET_TICKETS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      eventId,
      eventTitle,
      attendeeName,
      attendeeEmail,
      attendeeHandle,
      attendeePhone,
      tierName = 'General Delegate',
      isStudent = false,
      studentIdUrl,
      price = 0,
      currency = 'INR',
      paymentId,
      orderId,
    } = body;

    if (!eventId || !attendeeName || !attendeeEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required ticket fields (eventId, attendeeName, attendeeEmail)' },
        { status: 400 }
      );
    }

    // Generate ticket number: ZEN-TKT-XXXXX
    const randomTicketNum = `ZEN-TKT-${Math.floor(10000 + Math.random() * 90000)}`;

    // Generate tamper-proof cryptographic token & HMAC seal
    const { qrCodeToken, securityHash } = generateQrCodeToken({
      ticketNumber: randomTicketNum,
      eventId,
      attendeeEmail,
      isStudent,
      tierName,
    });

    // Save into database
    const newTicket = await db.eventTicket.create({
      data: {
        ticketNumber: randomTicketNum,
        qrCodeToken,
        eventId,
        eventTitle: eventTitle || 'Conference Assembly',
        attendeeName,
        attendeeEmail,
        attendeeHandle: attendeeHandle || null,
        attendeePhone: attendeePhone || null,
        tierName,
        isStudent: Boolean(isStudent),
        studentIdUrl: studentIdUrl || null,
        price: Number(price) || 0,
        currency,
        paymentId: paymentId || null,
        orderId: orderId || null,
        status: 'VALID',
        securityHash,
      },
    });

    // Asynchronously dispatch to Register 12_EVENT_REGISTRATIONS
    sheetSync.dispatchRaw({
      tab: '12_EVENT_REGISTRATIONS',
      data: {
        Registration_ID: newTicket.ticketNumber,
        Event_ID: newTicket.eventId,
        Person_ID: newTicket.attendeeHandle || newTicket.attendeeEmail,
        Full_Name: newTicket.attendeeName,
        Email: newTicket.attendeeEmail,
        Phone: newTicket.attendeePhone || '',
        Pass_Tier: newTicket.tierName,
        Ticket_Price_Paid: newTicket.price,
        Payment_Status: newTicket.price > 0 ? (newTicket.paymentId ? 'Paid' : 'Pending') : 'Exempt',
        Payment_Ref: newTicket.paymentId || newTicket.orderId || 'FREE_PASS',
        Registration_Date: newTicket.issuedAt.toISOString(),
        Attendance_Status: 'Registered',
        Checkin_Time: '',
        Allotted_Role_Or_Seat: newTicket.tierName,
        Notes: `Student: ${newTicket.isStudent ? 'Yes' : 'No'} | Hash: ${newTicket.securityHash.slice(0, 8)}`
      }
    }).catch((err) => console.warn('[SHEETS-EVENT-REGISTRATION-SYNC-WARN]', err));

    return NextResponse.json({
      success: true,
      ticket: newTicket,
    });
  } catch (error: any) {
    console.error('[CREATE_TICKET_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to issue ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, status, operatorName } = body;

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Missing ticketId' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (status) {
      updates.status = status;
      if (status === 'CHECKED_IN') {
        updates.checkedInAt = new Date();
        updates.checkedInBy = operatorName || 'Host Dashboard';
      } else if (status === 'VALID') {
        updates.checkedInAt = null;
        updates.checkedInBy = null;
      }
    }

    const updated = await db.eventTicket.update({
      where: { id: ticketId },
      data: updates,
    });

    if (status === 'CHECKED_IN') {
      sheetSync.dispatchRaw({
        tab: '12_EVENT_REGISTRATIONS',
        data: {
          Registration_ID: updated.ticketNumber,
          Event_ID: updated.eventId,
          Attendance_Status: 'Checked_In',
          Checkin_Time: new Date().toISOString(),
          Notes: `Checked in by ${operatorName || 'Host Dashboard'}`
        }
      }).catch((err) => console.warn('[SHEETS-TICKET-CHECKIN-SYNC-WARN]', err));
    }

    return NextResponse.json({
      success: true,
      ticket: updated,
    });
  } catch (error: any) {
    console.error('[PATCH_TICKET_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
