import { NextRequest, NextResponse } from 'next/server';
import { verifyCashfreeWebhookSignature } from '@/lib/cashfreeServer';
import { getServerPassportByUsername, saveServerPassport } from '@/lib/passportsStorage';
import { WalletCredential } from '@/lib/passport';
import { sheetSync } from '@/lib/googleSheets';
import { prisma } from '@/lib/db';
import { generateQrCodeToken } from '@/lib/ticketCrypto';

export async function GET() {
  return NextResponse.json({ status: 'OK', message: 'Zenvitra Cashfree Webhook Active' }, { status: 200 });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');
    const webhookVersion = req.headers.get('x-webhook-version');
    const idempotencyKey = req.headers.get('x-idempotency-key');

    let payload: any = {};
    try {
      if (rawBody && rawBody.trim()) {
        payload = JSON.parse(rawBody);
      }
    } catch (_) {}

    const eventType = payload?.type || payload?.event;
    console.log(`[Cashfree Webhook] Event received: ${eventType || 'PING'}, Idempotency: ${idempotencyKey}`);

    // If Cashfree Dashboard is performing an endpoint test verification ping
    if (eventType === 'TEST' || payload?.test === true || (!rawBody.trim() && !signature)) {
      console.log('[Cashfree Webhook] Dashboard test ping acknowledged');
      return NextResponse.json({ status: 'OK', test: true }, { status: 200 });
    }

    // Signature verification is mandatory for security
    if (!signature || !timestamp) {
      console.warn('Cashfree webhook received without signature or timestamp header');
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
    }

    const isValid = verifyCashfreeWebhookSignature(rawBody, timestamp, signature);
    if (!isValid) {
      // Acknowledge test events if sent with mock signatures during dashboard tests
      if (eventType === 'TEST') {
        return NextResponse.json({ status: 'OK', test: true }, { status: 200 });
      }
      console.error('Invalid Cashfree webhook signature received');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Handle payment events
    switch (eventType) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
      case 'ORDER_PAID': {
        const orderData = payload.data?.order || payload.data || {};
        const paymentData = payload.data?.payment || {};
        const customerDetails = payload.data?.customer_details || {};
        const orderId = orderData.order_id || '';
        const orderAmount = orderData.order_amount;
        const productId = orderData.order_tags?.productId || 'EVENT_PASS';
        const rawUsername = orderData.order_tags?.username || customerDetails.customer_email?.split('@')[0] || '';
        const cleanUsername = rawUsername.toLowerCase().replace(/^@/, '').trim();

        console.log(`[Cashfree Webhook] Payment Successful for Order ${orderId}, Amount: ${orderAmount}, User: ${cleanUsername}`);

        // 1. Update CashfreePaymentOrder in Prisma Database
        try {
          await prisma.cashfreePaymentOrder.upsert({
            where: { orderId },
            update: {
              orderStatus: 'PAID',
              cfPaymentId: paymentData.cf_payment_id ? String(paymentData.cf_payment_id) : null,
              paymentMethod: paymentData.payment_group || null,
              bankReference: paymentData.bank_reference ? String(paymentData.bank_reference) : null,
              paidAt: new Date(),
              rawWebhookData: rawBody.substring(0, 3000),
            },
            create: {
              orderId,
              orderAmount: Number(orderAmount) || 0,
              orderStatus: 'PAID',
              customerId: customerDetails.customer_id || 'cust_webhook',
              customerEmail: customerDetails.customer_email || 'delegate@zenvitra.xyz',
              customerPhone: customerDetails.customer_phone || '9999999999',
              customerName: customerDetails.customer_name || 'Delegate',
              username: cleanUsername || null,
              productId,
              cfPaymentId: paymentData.cf_payment_id ? String(paymentData.cf_payment_id) : null,
              paymentMethod: paymentData.payment_group || null,
              paidAt: new Date(),
              rawWebhookData: rawBody.substring(0, 3000),
            }
          });
        } catch (dbErr) {
          console.error('[Cashfree Webhook] Error updating CashfreePaymentOrder:', dbErr);
        }

        // 2. Issue Tamper-Proof HMAC Offline Gate Ticket in Database
        try {
          const ticketNumber = `ZVN-${orderId.slice(-6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const eventId = orderData.order_tags?.eventId || productId || 'summit-2026';
          const { qrCodeToken, securityHash } = generateQrCodeToken({
            ticketNumber,
            eventId,
            attendeeEmail: customerDetails.customer_email || 'delegate@zenvitra.xyz',
            isStudent: true,
            tierName: productId,
          });

          await prisma.eventTicket.create({
            data: {
              ticketNumber,
              qrCodeToken,
              eventId,
              eventTitle: productId === 'DIPLOMACY_MUN' ? 'ZENVITRA Diplomacy MUN 2026' : `ZENVITRA ${productId}`,
              attendeeName: customerDetails.customer_name || 'Distinguished Delegate',
              attendeeEmail: customerDetails.customer_email || 'delegate@zenvitra.xyz',
              attendeeHandle: cleanUsername ? `@${cleanUsername}` : null,
              attendeePhone: customerDetails.customer_phone || null,
              tierName: productId,
              isStudent: true,
              price: Number(orderAmount) || 0,
              currency: 'INR',
              paymentId: paymentData.cf_payment_id ? String(paymentData.cf_payment_id) : orderId,
              orderId,
              status: 'VALID',
              securityHash,
            }
          });
          console.log(`[Cashfree Webhook] Minted HMAC-SHA256 Ticket ${ticketNumber} for Order ${orderId}`);
        } catch (ticketErr) {
          console.warn('[Cashfree Webhook] Could not auto-mint EventTicket in DB:', ticketErr);
        }

        // Provision pass/credential to user's sovereign passport wallet on server
        if (cleanUsername) {
          try {
            const passport = getServerPassportByUsername(cleanUsername);
            if (passport) {
              let credTitle = `${productId} Verified Access Pass`;
              let credType: 'EVENT_PASS' | 'CERTIFICATE' | 'AWARD' | 'LETTER' | 'STUDENT_BADGE' = 'EVENT_PASS';

              if (productId === 'ZEN_PRO') {
                credTitle = 'ZEN.PRO Verified Scholar Badge';
                credType = 'STUDENT_BADGE';
              } else if (productId === 'DIPLOMACY_MUN') {
                credTitle = 'ZEN.DIPLOMACY 2026 Sovereign Delegate Pass';
                credType = 'EVENT_PASS';
              } else if (productId === 'PULSE_MEMBERSHIP') {
                credTitle = 'ZEN.PULSE Annual Delegate Pass';
                credType = 'EVENT_PASS';
              } else if (productId === 'WORKSHOP') {
                credTitle = 'Diplomatic Protocol & Resolution Masterclass Pass';
                credType = 'EVENT_PASS';
              } else if (productId === 'LEGAL_FILING') {
                credTitle = 'Sovereign Treaty & Legal Filing Credential';
                credType = 'CERTIFICATE';
              }

              const newCredential: WalletCredential = {
                id: `PASS-${orderId.slice(-8).toUpperCase()}`,
                title: credTitle,
                type: credType,
                issuedBy: 'ZENVITRA Directorate (Cashfree Verified)',
                issuedAt: new Date().toISOString(),
                isVerified: true,
                metadata: {
                  transactionId: paymentData.cf_payment_id || orderId,
                  orderId: orderId,
                  product: productId,
                  amount: `₹${orderAmount}`,
                  paymentMethod: paymentData.payment_group || 'CASHFREE',
                  recipient: customerDetails.customer_name || passport.fullName,
                  status: 'ISSUED & ACTIVE'
                }
              };

              const existingWallet = passport.wallet || [];
              const isAlreadyPresent = existingWallet.some(
                (c) => c.metadata?.orderId === orderId || c.metadata?.transactionId === paymentData.cf_payment_id
              );

              if (!isAlreadyPresent) {
                passport.wallet = [newCredential, ...existingWallet];

                const now = new Date();
                const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                passport.timeline = [
                  {
                    id: `milestone-wh-${Date.now()}`,
                    year: now.getFullYear(),
                    month: monthNames[now.getMonth()],
                    icon: credType === 'STUDENT_BADGE' ? '🎓' : '🎫',
                    title: `Acquired ${credTitle}`,
                    subtitle: `Cashfree Verified Webhook • Order #${orderId}`,
                    category: 'COMMUNITY',
                    isVerified: true
                  },
                  ...(passport.timeline || [])
                ];

                saveServerPassport(passport);
                console.log(`[Cashfree Webhook] Auto-provisioned wallet credential ${newCredential.id} to @${cleanUsername}`);
              }
            }
          } catch (storageErr) {
            console.error('[Cashfree Webhook] Error updating passport wallet:', storageErr);
          }

          // Dispatch payment record to 18 Payments tab in Google Sheets
          try {
            sheetSync.dispatchRaw({
              tab: '18 Payments',
              data: {
                Payment_ID: `PAY-${Date.now()}`,
                Person_ID: cleanUsername ? `PER-${cleanUsername}` : '',
                Event_ID: orderData?.order_tags?.eventId || '',
                Registration_ID: orderData?.order_tags?.planId || orderData?.order_tags?.productId || '',
                Order_ID: orderId,
                Gateway: 'Cashfree',
                Gateway_Transaction_Ref: paymentData?.cf_payment_id || '',
                Gross_Amount_INR: paymentData?.payment_amount || orderData?.order_amount || 0,
                Tax_Amount_INR: 0,
                Platform_Fee_INR: 0,
                Net_Amount_INR: paymentData?.payment_amount || orderData?.order_amount || 0,
                Currency: paymentData?.payment_currency || 'INR',
                Payment_Status: 'Success',
                Payment_Date: new Date().toISOString(),
                Refund_Amount_INR: 0,
                Refund_Status: 'Not_Applicable',
                Invoice_ID: `INV-${orderId}`,
                Reconciliation_Status: 'Matched',
                Finance_Owner: 'System Auto',
                Notes: `Auto-recorded from Cashfree Webhook for @${cleanUsername}`
              }
            }).catch(() => {});
          } catch (_) {}
        }
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

      case 'PAYMENT_LINK_EVENT': {
        const linkData = payload.data || {};
        console.log(`[Cashfree Webhook] Payment Link Event: ${linkData.link_id}, Status: ${linkData.link_status}, Paid: ${linkData.link_amount_paid}`);
        if (linkData.link_status === 'PAID') {
          const notes = linkData.link_notes || {};
          const eventId = notes.eventId;
          const planName = notes.planName || 'Registration Pass';
          console.log(`[Cashfree Webhook] Payment link ${linkData.link_id} fully paid for event ${eventId} (${planName})`);
        }
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
