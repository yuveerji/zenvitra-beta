import { NextRequest, NextResponse } from 'next/server';
import { verifyPan } from '@/lib/cashfreeSecureId';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pan, name } = body;

    if (!pan) {
      return NextResponse.json(
        { success: false, error: 'PAN number is required' },
        { status: 400 }
      );
    }

    const cleanPan = String(pan).trim().toUpperCase();

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      return NextResponse.json(
        { success: false, error: 'Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F)' },
        { status: 400 }
      );
    }

    const verification = await verifyPan({
      pan: cleanPan,
      name: name?.trim(),
    });

    return NextResponse.json({
      success: verification.valid,
      verification,
      message: verification.message,
    });
  } catch (error: any) {
    console.error('[API_VERIFY_PAN_ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Cashfree PAN KYC verification failed',
      },
      { status: 500 }
    );
  }
}
