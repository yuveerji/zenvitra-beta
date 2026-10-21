import crypto from 'crypto';

const SECRET_SALT = process.env.ZENPASS_CRYPTO_SECRET || 'ZENVITRA_SECURE_TICKET_VAULT_KEY_2026';

export interface TicketSignatureParams {
  ticketNumber: string;
  eventId: string;
  attendeeEmail: string;
  isStudent?: boolean;
  tierName?: string;
}

/**
 * Computes an HMAC-SHA256 digital cryptographic seal for a ticket.
 * Any modification to the ticket number, event ID, attendee email, or tier
 * completely invalidates this hash, rendering fake QR codes immediately detectable.
 */
export function generateTicketSignature(params: TicketSignatureParams): string {
  const normTicket = (params.ticketNumber || '').trim().toUpperCase();
  const normEvent = (params.eventId || '').trim().toLowerCase();
  const normEmail = (params.attendeeEmail || '').trim().toLowerCase();
  const normTier = (params.tierName || 'GENERAL').trim().toUpperCase();
  const stuFlag = params.isStudent ? 'STUDENT' : 'GENERAL';

  const payload = `${normTicket}:${normEvent}:${normEmail}:${stuFlag}:${normTier}`;
  return crypto.createHmac('sha256', SECRET_SALT).update(payload).digest('hex').substring(0, 24);
}

/**
 * Generates the full tamper-proof QR code token string to embed in delegate passes.
 */
export function generateQrCodeToken(params: TicketSignatureParams): { qrCodeToken: string; securityHash: string } {
  const securityHash = generateTicketSignature(params);
  const cleanTicket = (params.ticketNumber || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const cleanEvent = (params.eventId || 'event').replace(/[^A-Za-z0-9_-]/g, '').toLowerCase();
  const stuTag = params.isStudent ? 'STU' : 'GEN';

  const qrCodeToken = `ZVN-TKT-${cleanTicket}-${cleanEvent}-${stuTag}-${securityHash}`;
  return { qrCodeToken, securityHash };
}

/**
 * Verifies that the provided signature matches the ticket record using constant-time comparison.
 */
export function verifyTicketSignature(params: TicketSignatureParams, signatureToVerify: string): boolean {
  if (!signatureToVerify || typeof signatureToVerify !== 'string') return false;
  const expected = generateTicketSignature(params);
  if (expected.length !== signatureToVerify.length) return false;

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureToVerify));
  } catch {
    return false;
  }
}

/**
 * Parses any incoming scanned string (camera OCR, 2D barcode, or manual input).
 */
export function parseScannedQrToken(rawScan: string): {
  isZvnToken: boolean;
  ticketNumber?: string;
  eventId?: string;
  isStudent?: boolean;
  signature?: string;
  raw: string;
} {
  const trimmed = (rawScan || '').trim();
  
  // Format: ZVN-TKT-{ticketNumber}-{eventId}-{stuTag}-{signature}
  if (trimmed.startsWith('ZVN-TKT-')) {
    const parts = trimmed.split('-');
    // Expected: ["ZVN", "TKT", ticketNumber, eventId..., stuTag, signature]
    if (parts.length >= 5) {
      const ticketNumber = parts[2];
      const signature = parts[parts.length - 1];
      const stuTag = parts[parts.length - 2];
      const eventId = parts.slice(3, parts.length - 2).join('-');
      return {
        isZvnToken: true,
        ticketNumber,
        eventId,
        isStudent: stuTag.toUpperCase() === 'STU',
        signature,
        raw: trimmed
      };
    }
  }

  // Fallback for standard ticket numbers like "ZEN-TKT-12345" or "ZEN-PASS-12345"
  return {
    isZvnToken: false,
    ticketNumber: trimmed.toUpperCase(),
    raw: trimmed
  };
}
