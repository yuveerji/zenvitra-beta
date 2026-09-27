import { NextRequest, NextResponse } from 'next/server';
import { getCashfreeOrder, getCashfreeOrderPayments } from '@/lib/cashfreeServer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'order_id query parameter is required' }, { status: 400 });
    }

    const order = await getCashfreeOrder(orderId);
    let payments: any[] = [];
    try {
      payments = await getCashfreeOrderPayments(orderId);
    } catch (_) {}

    const successfulPayment = payments.find((p) => p.payment_status === 'SUCCESS');
    const isPaid = order.order_status === 'PAID' || Boolean(successfulPayment);

    return NextResponse.json({
      success: true,
      orderId: order.order_id,
      orderStatus: order.order_status,
      isPaid,
      orderAmount: order.order_amount,
      orderCurrency: order.order_currency,
      paymentMethod: successfulPayment?.payment_group || 'UPI/Card',
      paymentId: successfulPayment?.cf_payment_id || null,
      paymentTime: successfulPayment?.payment_completion_time || order.created_at,
      paymentsCount: payments.length,
    });

  } catch (error: any) {
    console.error('Verify Cashfree Order Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify payment status' },
      { status: 500 }
    );
  }
}
