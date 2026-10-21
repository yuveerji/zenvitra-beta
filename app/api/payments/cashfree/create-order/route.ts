import { NextRequest, NextResponse } from 'next/server';
import { createCashfreeOrder, CashfreeOrderPayload } from '@/lib/cashfreeServer';
import { prisma } from '@/lib/db';

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
      returnUrl,
      username,
      idempotencyKey
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
    // Cashfree Production and Sandbox API strictly enforce HTTPS for return_url and notify_url.
    let baseOrigin = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;
    if (!baseOrigin || baseOrigin.includes('localhost')) {
      const host = req.headers.get('host') || 'zenvitra.xyz';
      baseOrigin = host.includes('localhost') ? 'https://zenvitra.xyz' : `https://${host}`;
    } else if (!baseOrigin.startsWith('https://')) {
      baseOrigin = baseOrigin.replace(/^http:\/\//, 'https://');
    }
    baseOrigin = baseOrigin.replace(/\/+$/, '');

    // If client supplied a returnUrl starting with http://, upgrade it to https://
    let finalReturnUrl = returnUrl;
    if (finalReturnUrl) {
      if (finalReturnUrl.startsWith('http://localhost')) {
        finalReturnUrl = finalReturnUrl.replace(/^http:\/\/localhost(:\d+)?/, 'https://zenvitra.xyz');
      } else if (finalReturnUrl.startsWith('http://')) {
        finalReturnUrl = finalReturnUrl.replace(/^http:\/\//, 'https://');
      }
    } else {
      finalReturnUrl = `${baseOrigin}/payments?order_id={order_id}&status=completed`;
    }

    const payload: CashfreeOrderPayload = {
      order_id: orderId,
      order_amount: cleanAmount,
      order_currency: currency.toUpperCase(),
      customer_details: {
        customer_id: customerId,
        customer_name: (customerName || 'Zenvitra Member').trim().substring(0, 100),
        customer_email: (customerEmail || 'delegate@zenvitra.xyz').trim().substring(0, 100),
        customer_phone: cleanPhone,
      },
      order_meta: {
        return_url: finalReturnUrl,
        notify_url: `${baseOrigin}/api/payments/cashfree/webhook`,
      },
      order_note: orderNote || `Zenvitra Checkout - ${productId || 'Platform Service'}`,
      order_tags: {
        platform: 'zenvitra',
        productId: productId || 'membership',
        planId: productId || 'membership',
        username: (username || '').toLowerCase().replace(/^@/, '').trim(),
      }
    };

    // Idempotency Check: prevent duplicate charges if already requested
    const effectiveIdempotencyKey = idempotencyKey || `idemp_${customerId}_${productId || 'prod'}_${cleanAmount}_${Math.floor(Date.now() / 60000)}`;

    if (idempotencyKey) {
      const existingOrder = await prisma.cashfreePaymentOrder.findUnique({
        where: { idempotencyKey }
      });
      if (existingOrder && existingOrder.paymentSessionId) {
        return NextResponse.json({
          success: true,
          orderId: existingOrder.orderId,
          paymentSessionId: existingOrder.paymentSessionId,
          orderAmount: existingOrder.orderAmount,
          orderCurrency: existingOrder.orderCurrency,
          orderStatus: existingOrder.orderStatus,
          isExisting: true
        });
      }
    }

    const orderResponse = await createCashfreeOrder(payload);

    // Persist order ledger in database immediately
    try {
      await prisma.cashfreePaymentOrder.create({
        data: {
          orderId: orderResponse.order_id,
          orderAmount: cleanAmount,
          orderCurrency: currency.toUpperCase(),
          orderStatus: orderResponse.order_status || 'PENDING',
          customerId,
          customerEmail: (customerEmail || 'delegate@zenvitra.xyz').trim().substring(0, 100),
          customerPhone: cleanPhone,
          customerName: (customerName || 'Zenvitra Member').trim().substring(0, 100),
          username: (username || '').toLowerCase().replace(/^@/, '').trim() || null,
          productId: productId || 'membership',
          planId: productId || 'membership',
          paymentSessionId: orderResponse.payment_session_id || null,
          idempotencyKey: effectiveIdempotencyKey,
        }
      });
    } catch (dbErr) {
      console.warn('Could not persist pending CashfreePaymentOrder to database:', dbErr);
    }

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
