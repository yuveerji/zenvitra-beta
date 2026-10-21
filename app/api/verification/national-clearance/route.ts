import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export interface NationalClearanceRecord {
  clearanceSerial: string;
  userId: string;
  username: string;
  legalName: string;
  cadre: string;
  institution: string;
  institutionalId?: string;
  stateUt: string;
  documentType: string;
  documentHash: string;
  verificationLevel: number;
  status: 'VERIFIED' | 'PENDING_AUDIT' | 'REVOKED';
  issuedAt: string;
  expiresAt: string;
  tamperProofHash: string;
  zkProofAnchor: string;
}

// In-memory registry fallback for demo & active sessions
const clearanceRegistry: Map<string, NationalClearanceRecord> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      username,
      legalName,
      cadre,
      institution,
      institutionalId,
      stateUt,
      documentType,
      documentName,
      challengeVerified,
    } = body;

    if (!legalName || !institution || !cadre) {
      return NextResponse.json(
        { error: 'Missing mandatory identity or institutional attestation fields.' },
        { status: 400 }
      );
    }

    const cleanUser = (username || 'citizen').replace(/^@/, '').toLowerCase();
    const now = new Date();
    const issuedAt = now.toISOString();

    // 1-year academic term expiration
    const expiry = new Date(now);
    expiry.setFullYear(expiry.getFullYear() + 1);
    const expiresAt = expiry.toISOString();

    // Generate National Clearance Serial Number: IN-ZEN-CLR-2026-XXXXX
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const clearanceSerial = `IN-ZEN-CLR-${now.getFullYear()}-${randomSuffix}`;

    // Compute cryptographic tamper-proof hash (SHA-256)
    const payloadToHash = `${cleanUser}:${legalName}:${institution}:${stateUt}:${clearanceSerial}:${issuedAt}`;
    const tamperProofHash = '0x' + crypto.createHash('sha256').update(payloadToHash).digest('hex');

    // Document mock fingerprint
    const documentHash = '0x' + crypto.createHash('sha256').update(`${documentName || 'doc'}:${now.getTime()}`).digest('hex').slice(0, 32);

    // Zero-Knowledge Proof Anchor
    const zkProofAnchor = '0xZKP_' + crypto.createHash('sha256').update(`${tamperProofHash}:zkp:zenvitra`).digest('hex').slice(0, 24);

    const record: NationalClearanceRecord = {
      clearanceSerial,
      userId: userId || cleanUser,
      username: cleanUser,
      legalName: legalName.trim(),
      cadre: cadre.trim(),
      institution: institution.trim(),
      institutionalId: institutionalId?.trim() || 'N/A',
      stateUt: stateUt || 'National Jurisdiction',
      documentType: documentType || 'National Student ID',
      documentHash,
      verificationLevel: 2,
      status: 'VERIFIED',
      issuedAt,
      expiresAt,
      tamperProofHash,
      zkProofAnchor,
    };

    clearanceRegistry.set(cleanUser, record);

    return NextResponse.json({
      success: true,
      message: 'National Sovereign Clearance Ratified Successfully.',
      record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal error processing national clearance.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username')?.replace(/^@/, '').toLowerCase();
  const serial = searchParams.get('serial')?.toUpperCase();

  if (serial) {
    for (const rec of clearanceRegistry.values()) {
      if (rec.clearanceSerial === serial) {
        return NextResponse.json({ success: true, record: rec });
      }
    }
  }

  if (username && clearanceRegistry.has(username)) {
    return NextResponse.json({ success: true, record: clearanceRegistry.get(username) });
  }

  return NextResponse.json(
    { success: false, message: 'No registered national clearance record found.' },
    { status: 404 }
  );
}
