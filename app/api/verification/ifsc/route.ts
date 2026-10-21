import { NextRequest, NextResponse } from 'next/server';
import { verifyIfsc } from '@/lib/cashfreeSecureId';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ifsc = searchParams.get('ifsc');

    if (!ifsc) {
      return NextResponse.json(
        { success: false, error: 'IFSC parameter is required' },
        { status: 400 }
      );
    }

    const cleanIfsc = ifsc.trim().toUpperCase();
    const details = await verifyIfsc(cleanIfsc);

    return NextResponse.json({
      success: true,
      details,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'IFSC resolution failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ifsc } = body;

    if (!ifsc) {
      return NextResponse.json(
        { success: false, error: 'IFSC code is required' },
        { status: 400 }
      );
    }

    const cleanIfsc = String(ifsc).trim().toUpperCase();
    const details = await verifyIfsc(cleanIfsc);

    return NextResponse.json({
      success: true,
      details,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'IFSC verification failed' },
      { status: 500 }
    );
  }
}
