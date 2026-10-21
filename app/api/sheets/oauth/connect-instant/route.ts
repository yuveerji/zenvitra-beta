import { NextRequest, NextResponse } from 'next/server';
import { setupConnectedGoogleAccount } from '@/lib/sheets/googleOAuthManager';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      accountEmail,
      accountName,
      eventId,
      eventTitle,
      spreadsheetId,
      spreadsheetUrl,
    } = body;

    if (!accountEmail) {
      return NextResponse.json(
        { success: false, error: 'Google Account Email is required for connection.' },
        { status: 400 }
      );
    }

    const hostUrl = req.nextUrl.origin;

    const result = await setupConnectedGoogleAccount({
      accountEmail: accountEmail.trim().toLowerCase(),
      accountName: accountName?.trim() || accountEmail.split('@')[0],
      eventId: eventId || undefined,
      eventTitle: eventTitle || undefined,
      spreadsheetId: spreadsheetId?.trim() || undefined,
      spreadsheetUrl: spreadsheetUrl?.trim() || undefined,
      hostUrl,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[SHEETS-OAUTH-INSTANT-CONNECT-ERROR]', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to auto-setup Google Sheets connection.' },
      { status: 500 }
    );
  }
}
