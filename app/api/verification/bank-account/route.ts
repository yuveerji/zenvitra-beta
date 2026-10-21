import { NextRequest, NextResponse } from 'next/server';
import { verifyBankAccountSync } from '@/lib/cashfreeSecureId';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bankAccount, ifsc, name, phone } = body;

    if (!bankAccount || !ifsc) {
      return NextResponse.json(
        { success: false, error: 'Bank account number and IFSC code are required' },
        { status: 400 }
      );
    }

    const cleanAccount = String(bankAccount).trim();
    const cleanIfsc = String(ifsc).trim().toUpperCase();

    if (cleanAccount.length < 9 || cleanAccount.length > 18) {
      return NextResponse.json(
        { success: false, error: 'Bank account number must be between 9 and 18 digits' },
        { status: 400 }
      );
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      return NextResponse.json(
        { success: false, error: 'Invalid IFSC code format (must be 11 characters, e.g. HDFC0001234)' },
        { status: 400 }
      );
    }

    const verification = await verifyBankAccountSync({
      bankAccount: cleanAccount,
      ifsc: cleanIfsc,
      name: name?.trim(),
      phone,
    });

    return NextResponse.json({
      success: verification.valid,
      verification,
      message: verification.message,
    });
  } catch (error: any) {
    console.error('[API_VERIFY_BANK_ACCOUNT_ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Cashfree Bank Account Verification failed',
      },
      { status: 500 }
    );
  }
}
