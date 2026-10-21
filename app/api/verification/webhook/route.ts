import { NextRequest, NextResponse } from 'next/server';
import { verifySecureIdWebhookSignature } from '@/lib/cashfreeSecureId';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Cashfree Secure ID Webhook Endpoint
 * Receives asynchronous events such as:
 * - BANK_ACCOUNT_VERIFICATION_SUCCESS
 * - BANK_ACCOUNT_VERIFICATION_REJECTED
 * - BANK_ACCOUNT_VERIFICATION_FAILED
 * - DIGILOCKER_VERIFICATION_SUCCESS
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';

    // Verify HMAC-SHA256 signature if credentials and signature headers are present
    const isAuthentic = verifySecureIdWebhookSignature({
      rawBody,
      timestamp,
      signature,
    });

    if (!isAuthentic && process.env.NODE_ENV === 'production' && signature) {
      console.warn('[CASHFREE_SECURE_ID_WEBHOOK_INVALID_SIGNATURE]');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody || '{}');
    const { event, data } = payload;

    console.log('[CASHFREE_SECURE_ID_WEBHOOK_EVENT]', event, data?.reference_id || data?.bank_account);

    // Handle BAV Async outcome
    if (event === 'BANK_ACCOUNT_VERIFICATION_SUCCESS') {
      const bankAccount = data?.bank_account;
      if (bankAccount) {
        await db.organizerKyc.updateMany({
          where: { bankAccountNumber: String(bankAccount) },
          data: {
            status: 'VERIFIED',
            verifiedBy: 'CASHFREE_SECURE_ID_ASYNC',
            verifiedAt: new Date(),
          },
        });
      }
    } else if (
      event === 'BANK_ACCOUNT_VERIFICATION_REJECTED' ||
      event === 'BANK_ACCOUNT_VERIFICATION_FAILED'
    ) {
      const bankAccount = data?.bank_account;
      if (bankAccount) {
        await db.organizerKyc.updateMany({
          where: { bankAccountNumber: String(bankAccount) },
          data: {
            status: 'REJECTED',
            rejectionReason: data?.rejection_reason || data?.message || 'Bank account rejected by issuing bank',
          },
        });
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('[CASHFREE_SECURE_ID_WEBHOOK_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal webhook error' },
      { status: 500 }
    );
  }
}
