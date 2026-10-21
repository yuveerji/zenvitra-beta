import { NextRequest, NextResponse } from 'next/server';
import {
  isGoogleOAuthConfigured,
  getGoogleOAuthConsentUrl,
} from '@/lib/sheets/googleOAuthManager';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId') || undefined;
    const returnUrl = searchParams.get('returnUrl') || undefined;
    const redirectDirectly = searchParams.get('redirect') === 'true';

    const origin = req.nextUrl.origin;
    const isConfigured = isGoogleOAuthConfigured();

    if (!isConfigured) {
      return NextResponse.json({
        success: true,
        isConfigured: false,
        message: 'Google OAuth Client ID & Secret not yet detected in environment. One-click instant setup is active.',
        consentUrl: null,
      });
    }

    const consentUrl = getGoogleOAuthConsentUrl({
      origin,
      eventId,
      returnUrl,
    });

    if (redirectDirectly) {
      return NextResponse.redirect(consentUrl);
    }

    return NextResponse.json({
      success: true,
      isConfigured: true,
      consentUrl,
    });
  } catch (err: any) {
    console.error('[SHEETS-OAUTH-AUTHORIZE-ERROR]', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to generate Google OAuth consent URL.' },
      { status: 500 }
    );
  }
}
