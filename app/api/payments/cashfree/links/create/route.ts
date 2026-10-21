import { NextRequest, NextResponse } from 'next/server';
import { createCashfreePaymentLink, CashfreePaymentLinkPayload } from '@/lib/cashfreeServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = 'INR',
      purpose,
      customerName,
      customerEmail,
      customerPhone,
      expiryMinutes,
      autoReminders = true,
      sendSms = false,
      sendEmail = true,
      eventId,
      planId,
      planName,
      organizer,
    } = body;

    if (!amount || Number(amount) < 1) {
      return NextResponse.json(
        { error: 'Valid payment amount is required (min ₹1)' },
        { status: 400 }
      );
    }

    let originUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;
    if (!originUrl || originUrl.includes('localhost')) {
      const host = req.headers.get('host') || 'zenvitra.xyz';
      originUrl = host.includes('localhost') ? 'https://zenvitra.xyz' : `https://${host}`;
    } else if (!originUrl.startsWith('https://')) {
      originUrl = originUrl.replace(/^http:\/\//, 'https://');
    }
    originUrl = originUrl.replace(/\/+$/, '');

    const linkId = `link_${eventId ? eventId.substring(0, 8).replace(/[^a-zA-Z0-9]/g, '') : 'ev'}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Calculate expiry if requested (default 30 days)
    let expiryIso: string | undefined = undefined;
    if (expiryMinutes && Number(expiryMinutes) > 0) {
      const expDate = new Date(Date.now() + Number(expiryMinutes) * 60 * 1000);
      expiryIso = expDate.toISOString();
    }

    const rawPhone = (customerPhone || '').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9999999999';

    const payload: CashfreePaymentLinkPayload = {
      link_id: linkId,
      link_amount: Math.round(Number(amount) * 100) / 100,
      link_currency: currency.toUpperCase(),
      link_purpose: (purpose || `Registration Pass - ${planName || 'Event'}`).substring(0, 500),
      customer_details: {
        customer_phone: cleanPhone,
        customer_email: (customerEmail || 'delegate@zenvitra.xyz').trim(),
        customer_name: (customerName || 'Attendee').trim(),
      },
      link_expiry_time: expiryIso,
      link_auto_reminders: Boolean(autoReminders),
      link_notify: {
        send_sms: Boolean(sendSms),
        send_email: Boolean(sendEmail),
      },
      link_meta: {
        return_url: `${originUrl}/pay/${encodeURIComponent(linkId)}?status=success&order_id={order_id}`,
        notify_url: `${originUrl}/api/payments/cashfree/webhook`,
        upi_intent: 'true',
        payment_methods: 'cc,dc,upi,nb',
      },
      link_notes: {
        platform: 'zenvitra',
        eventId: eventId || '',
        planId: planId || '',
        planName: planName || '',
        organizer: organizer || '',
      },
    };

    const linkResponse = await createCashfreePaymentLink(payload, originUrl);

    return NextResponse.json({
      success: true,
      linkId: linkResponse.link_id,
      cfLinkId: linkResponse.cf_link_id,
      linkUrl: linkResponse.link_url,
      linkStatus: linkResponse.link_status,
      linkAmount: linkResponse.link_amount,
      linkCurrency: linkResponse.link_currency,
      linkPurpose: linkResponse.link_purpose,
      linkQrCode: linkResponse.link_qrcode,
      isGatewayFallback: Boolean(linkResponse.isGatewayOrderFallback),
      paymentSessionId: linkResponse.paymentSessionId,
    });
  } catch (error: any) {
    console.error('Create Cashfree Payment Link Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate Cashfree Payment Link' },
      { status: 500 }
    );
  }
}
