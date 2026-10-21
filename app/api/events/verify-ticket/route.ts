import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseScannedQrToken, verifyTicketSignature, generateTicketSignature } from '@/lib/ticketCrypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tokenOrCode = (body.tokenOrCode || body.qrCode || body.ticketNumber || '').trim();
    const eventId = (body.eventId || '').trim();
    const operatorName = (body.operatorName || 'Dais Gate Scanner #1').trim();
    const markCheckIn = body.markCheckIn !== false; // Default true

    if (!tokenOrCode) {
      return NextResponse.json(
        { valid: false, error: 'EMPTY_CODE', message: 'No QR code or ticket string provided for verification.' },
        { status: 400 }
      );
    }

    // 1. Parse token
    const parsed = parseScannedQrToken(tokenOrCode);

    // 2. Query ticket from persistent database
    // Check by exact qrCodeToken, or ticketNumber
    let ticket = await db.eventTicket.findFirst({
      where: {
        OR: [
          { qrCodeToken: tokenOrCode },
          { ticketNumber: parsed.ticketNumber || tokenOrCode.toUpperCase() },
          { id: tokenOrCode },
        ],
      },
    });

    // Fallback: search if token contains the ticket number
    if (!ticket && parsed.ticketNumber) {
      ticket = await db.eventTicket.findFirst({
        where: {
          ticketNumber: {
            contains: parsed.ticketNumber,
          },
        },
      });
    }

    // 3. Database Check: If ticket record is completely absent in database
    if (!ticket) {
      return NextResponse.json({
        valid: false,
        error: 'TICKET_NOT_FOUND',
        message: 'Security Alert: Fake or Unregistered QR Ticket. This credential does not exist in the ZENVITRA database registry.',
        scannedCode: tokenOrCode,
      }, { status: 404 });
    }

    // 4. Cryptographic HMAC Check: Verify digital seal against stored ticket attributes
    const expectedSignature = generateTicketSignature({
      ticketNumber: ticket.ticketNumber,
      eventId: ticket.eventId,
      attendeeEmail: ticket.attendeeEmail,
      isStudent: ticket.isStudent,
      tierName: ticket.tierName,
    });

    if (ticket.securityHash && ticket.securityHash !== expectedSignature) {
      return NextResponse.json({
        valid: false,
        error: 'CRYPTOGRAPHIC_SEAL_INVALID',
        message: 'Fraud Detected: Cryptographic HMAC signature failed. Ticket payload has been tampered with or forged.',
        ticketNumber: ticket.ticketNumber,
      }, { status: 403 });
    }

    // If client supplied a ZVN token with a signature, verify that signature matches
    if (parsed.isZvnToken && parsed.signature) {
      const isSigValid = verifyTicketSignature({
        ticketNumber: ticket.ticketNumber,
        eventId: ticket.eventId,
        attendeeEmail: ticket.attendeeEmail,
        isStudent: ticket.isStudent,
        tierName: ticket.tierName,
      }, parsed.signature);

      if (!isSigValid) {
        return NextResponse.json({
          valid: false,
          error: 'TOKEN_SIGNATURE_MISMATCH',
          message: 'Counterfeit Ticket: QR token signature does not match the master cryptography vault.',
          ticketNumber: ticket.ticketNumber,
        }, { status: 403 });
      }
    }

    // 5. Event Context Check: Ensure ticket is for this specific conference
    if (eventId && ticket.eventId && ticket.eventId.toLowerCase() !== eventId.toLowerCase()) {
      return NextResponse.json({
        valid: false,
        error: 'WRONG_EVENT',
        message: `Conference Mismatch: Pass is issued for "${ticket.eventTitle}", not this chamber.`,
        ticket: {
          ticketNumber: ticket.ticketNumber,
          eventTitle: ticket.eventTitle,
          attendeeName: ticket.attendeeName,
        },
      }, { status: 400 });
    }

    // 6. Status Checks
    if (ticket.status === 'CHECKED_IN') {
      const checkInTime = ticket.checkedInAt
        ? new Date(ticket.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : 'Earlier';
      return NextResponse.json({
        valid: false,
        error: 'DUPLICATE_ENTRY',
        message: `Pass Already Used! Checked in at ${checkInTime} by ${ticket.checkedInBy || 'Gatekeeper'}. Pass cannot be re-used.`,
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          attendeeName: ticket.attendeeName,
          tierName: ticket.tierName,
          checkedInAt: ticket.checkedInAt,
          checkedInBy: ticket.checkedInBy,
        },
      }, { status: 409 });
    }

    if (ticket.status === 'REFUNDED') {
      return NextResponse.json({
        valid: false,
        error: 'TICKET_REFUNDED',
        message: 'Admission Denied: This ticket was cancelled and refunded by the organizer.',
        ticket: {
          ticketNumber: ticket.ticketNumber,
          attendeeName: ticket.attendeeName,
        },
      }, { status: 400 });
    }

    if (ticket.status === 'CANCELLED' || ticket.status === 'REVOKED') {
      return NextResponse.json({
        valid: false,
        error: 'TICKET_REVOKED',
        message: 'Security Revocation: This pass has been blacklisted or revoked.',
        ticket: {
          ticketNumber: ticket.ticketNumber,
          attendeeName: ticket.attendeeName,
        },
      }, { status: 403 });
    }

    // 7. Success & Check-in Execution
    let updatedTicket = ticket;
    if (markCheckIn) {
      updatedTicket = await db.eventTicket.update({
        where: { id: ticket.id },
        data: {
          status: 'CHECKED_IN',
          checkedInAt: new Date(),
          checkedInBy: operatorName,
        },
      });
    }

    return NextResponse.json({
      valid: true,
      success: true,
      message: `Verified & Admitted: Welcome ${updatedTicket.attendeeName} (${updatedTicket.tierName})`,
      ticket: {
        id: updatedTicket.id,
        ticketNumber: updatedTicket.ticketNumber,
        eventId: updatedTicket.eventId,
        eventTitle: updatedTicket.eventTitle,
        attendeeName: updatedTicket.attendeeName,
        attendeeEmail: updatedTicket.attendeeEmail,
        tierName: updatedTicket.tierName,
        isStudent: updatedTicket.isStudent,
        price: updatedTicket.price,
        status: updatedTicket.status,
        checkedInAt: updatedTicket.checkedInAt,
        checkedInBy: updatedTicket.checkedInBy,
        issuedAt: updatedTicket.issuedAt,
      },
    });
  } catch (error: any) {
    console.error('[VERIFY_TICKET_ERROR]', error);
    return NextResponse.json(
      { valid: false, error: 'SERVER_ERROR', message: error?.message || 'Database verification failed' },
      { status: 500 }
    );
  }
}
