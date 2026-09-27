import { NextRequest, NextResponse } from 'next/server';
import { verifyCashfreeWebhookSignature } from '@/lib/cashfreeServer';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');
    const webhookVersion = req.headers.get('x-webhook-version');
    const idempotencyKey = req.headers.get('x-idempotency-key');

    // Signature verification is mandatory for security
    if (!signature || !timestamp) {
      console.warn('Cashfree webhook received without signature or timestamp header');
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
    }

    const isValid = verifyCashfreeWebhookSignature(rawBody, timestamp, signature);
    if (!isValid) {
      console.error('Invalid Cashfree webhook signature received');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (_) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventType = payload.type || payload.event;
    console.log(`[Cashfree Webhook] Event received: ${eventType}, Idempotency: ${idempotencyKey}`);

    // Handle payment events
    switch (eventType) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
      case 'ORDER_PAID': {
        const orderData = payload.data?.order || payload.data;
        const paymentData = payload.data?.payment || {};
        console.log(`[Cashfree Webhook] Payment Successful for Order ${orderData?.order_id}, Amount: ${orderData?.order_amount}`);
        // Business logic hook here (dispatch confirmation email, provision service, update database)
        break;
      }

      case 'PAYMENT_FAILED_WEBHOOK': {
        const orderData = payload.data?.order || payload.data;
        console.warn(`[Cashfree Webhook] Payment Failed for Order ${orderData?.order_id}`);
        break;
      }

      case 'PAYMENT_USER_DROPPED_WEBHOOK': {
        const orderData = payload.data?.order || payload.data;
        console.log(`[Cashfree Webhook] Customer dropped off for Order ${orderData?.order_id}`);
        break;
      }

      default:
        console.log(`[Cashfree Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    // Cashfree expects immediate HTTP 200 acknowledge
    return NextResponse.json({ status: 'OK', received: true });

  } catch (error: any) {
    console.error('Cashfree Webhook Processing Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
