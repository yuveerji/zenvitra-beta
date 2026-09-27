import { NextRequest, NextResponse } from 'next/server';
import { createCashfreeOrder, CashfreeOrderPayload } from '@/lib/cashfreeServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      amount, 
      currency = 'INR', 
      customerName, 
      customerEmail, 
      customerPhone,
      orderNote,
      productId,
      returnUrl
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const cleanAmount = Math.round(Number(amount) * 100) / 100;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const customerId = customerEmail 
      ? `cust_${customerEmail.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45)}`
      : `cust_${Date.now()}`;

    // Clean phone number (needs 10 digits for Indian numbers)
    const rawPhone = (customerPhone || '').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9999999999';

    // Construct base return URL if not provided
    const host = req.headers.get('host') || 'zenvitra.xyz';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const finalReturnUrl = returnUrl || `${protocol}://${host}/payments?order_id={order_id}&status=completed`;

    const payload: CashfreeOrderPayload = {
      order_id: orderId,
      order_amount: cleanAmount,
      order_currency: currency.toUpperCase(),
      customer_details: {
        customer_id: customerId,
        customer_name: (customerName || 'Zenvitra Member').trim().substring(0, 100),
        customer_email: (customerEmail || 'delegate@zenvitra.org').trim().substring(0, 100),
        customer_phone: cleanPhone,
      },
      order_meta: {
        return_url: finalReturnUrl,
        notify_url: `${protocol}://${host}/api/payments/cashfree/webhook`,
      },
      order_note: orderNote || `Zenvitra Checkout - ${productId || 'Platform Service'}`,
      order_tags: {
        platform: 'zenvitra',
        productId: productId || 'membership',
      }
    };

    const orderResponse = await createCashfreeOrder(payload);

    return NextResponse.json({
      success: true,
      orderId: orderResponse.order_id,
      paymentSessionId: orderResponse.payment_session_id,
      orderAmount: orderResponse.order_amount,
      orderCurrency: orderResponse.order_currency,
      orderStatus: orderResponse.order_status,
      customerDetails: orderResponse.customer_details,
    });

  } catch (error: any) {
    console.error('Create Cashfree Order Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
