import { NextRequest, NextResponse } from 'next/server';
import { 
  getCashfreePaymentLink, 
  cancelCashfreePaymentLink, 
  getCashfreePaymentLinkOrders 
} from '@/lib/cashfreeServer';

interface Params {
  params: Promise<{ linkId: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { linkId } = await params;
    if (!linkId) {
      return NextResponse.json({ error: 'linkId is required' }, { status: 400 });
    }

    const link = await getCashfreePaymentLink(linkId);
    let orders: any[] = [];
    try {
      orders = await getCashfreePaymentLinkOrders(linkId);
    } catch {
      // ignore orders fetch error
    }

    return NextResponse.json({
      success: true,
      link,
      orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch payment link' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { linkId } = await params;
    if (!linkId) {
      return NextResponse.json({ error: 'linkId is required' }, { status: 400 });
    }

    const result = await cancelCashfreePaymentLink(linkId);
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to cancel payment link' },
      { status: 500 }
    );
  }
}
