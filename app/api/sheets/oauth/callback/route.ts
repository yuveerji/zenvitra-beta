import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  fetchGoogleUserProfile,
  autoProvisionSpreadsheetWithOAuth,
  setupConnectedGoogleAccount,
} from '@/lib/sheets/googleOAuthManager';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const stateRaw = searchParams.get('state');
  const error = searchParams.get('error');

  // Decode state payload
  let stateData: { eventId?: string; returnUrl?: string; userId?: string } = {};
  if (stateRaw) {
    try {
      stateData = JSON.parse(Buffer.from(stateRaw, 'base64url').toString('utf-8'));
    } catch (_) {}
  }

  const fallbackRedirect = stateData.returnUrl || (stateData.eventId ? `/events/${stateData.eventId}/manage` : '/events');

  if (error) {
    console.warn('[SHEETS-OAUTH-CALLBACK-ERROR]', error);
    return NextResponse.redirect(
      `${origin}${fallbackRedirect}?oauthError=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}${fallbackRedirect}?oauthError=missing_authorization_code`
    );
  }

  try {
    // 1. Exchange code for OAuth tokens
    const tokens = await exchangeCodeForTokens(code, origin);

    // 2. Fetch Google User Profile
    const userProfile = await fetchGoogleUserProfile(tokens.access_token);

    // 3. Automatically create Master Google Spreadsheet in user's Drive
    const title = stateData.eventId ? `Event [${stateData.eventId}]` : 'ZENVITRA Central Command';
    const spreadsheet = await autoProvisionSpreadsheetWithOAuth({
      accessToken: tokens.access_token,
      title,
      eventSlug: stateData.eventId,
    });

    // 4. Save and activate integration in ZENVITRA
    await setupConnectedGoogleAccount({
      accountEmail: userProfile.email,
      accountName: userProfile.name || userProfile.email.split('@')[0],
      eventId: stateData.eventId,
      eventTitle: title,
      spreadsheetId: spreadsheet.spreadsheetId,
      spreadsheetUrl: spreadsheet.spreadsheetUrl,
      tokenReference: `tokens_${userProfile.id}`,
      hostUrl: origin,
    });

    // 5. Redirect back to organizer's workspace with success flags
    const successRedirect = `${origin}${fallbackRedirect}${
      fallbackRedirect.includes('?') ? '&' : '?'
    }sheetsConnected=true&spreadsheetId=${encodeURIComponent(spreadsheet.spreadsheetId)}&accountEmail=${encodeURIComponent(userProfile.email)}`;

    return NextResponse.redirect(successRedirect);
  } catch (err: any) {
    console.error('[SHEETS-OAUTH-CALLBACK-EXCEPTION]', err);
    return NextResponse.redirect(
      `${origin}${fallbackRedirect}?oauthError=${encodeURIComponent(err?.message || 'OAuth setup failed')}`
    );
  }
}
