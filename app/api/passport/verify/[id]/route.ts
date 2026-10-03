import { NextRequest, NextResponse } from 'next/server';
import { verifyServerPassport } from '@/lib/passportsStorage';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const rawId = (resolvedParams?.id || '').toUpperCase().trim();

    if (!rawId) {
      return NextResponse.json({ success: false, error: 'Passport ID required' }, { status: 400 });
    }

    const verification = verifyServerPassport(rawId);

    return NextResponse.json({
      success: true,
      verified: verification.verified,
      passport: verification.passport,
      verificationHash: verification.hash,
      verifiedAt: verification.verifiedAt,
      passportId: rawId
    });
  } catch (err: any) {
    console.error('[API-PASSPORT-VERIFY-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
