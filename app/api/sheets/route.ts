import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Normalized tab target mapping to ensure compatibility with Apps Script
 */
function mapTabToTarget(rawTab: string): string {
  const upper = (rawTab || '').toUpperCase().trim();
  if (upper.includes('LOGIN')) return 'LOGIN_CORE';
  if (upper.includes('REGISTER')) return 'REGISTER_CORE';
  if (upper.includes('CONTACT')) return 'CONTACT';
  if (upper.includes('NEWSLETTER')) return 'NEWSLETTER';
  if (upper.includes('COLLAB') || upper.includes('PARTNER')) return 'COLLAB';
  if (upper.includes('CORE_TEAM') || upper.includes('TEAM') || upper.includes('CAREER')) return 'CORE_TEAM';
  if (upper.includes('COMMUNITY')) return 'COMMUNITY';
  if (upper.includes('AMBASSADOR') || upper.includes('CAMPUS')) return 'CAMPUS_AMBASSADOR';
  if (upper.includes('EVENT')) return 'EVENTS';
  if (upper.includes('IMPACT') || upper.includes('DONAT') || upper.includes('LEDGER')) return 'IMPACT_LEDGER';
  if (upper.includes('FEEDBACK') || upper.includes('GRIEVANCE')) return 'FEEDBACK';
  if (upper.includes('PULSE') || upper.includes('POST')) return 'PULSE_POSTS';
  return upper || 'REGISTER_CORE';
}

/**
 * POST: Forwards events & registrations to Google Sheets Apps Script Webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawTab = body.targetTab || body.tab || body.target;
    const rawData = body.data || body;

    if (!rawTab) {
      return NextResponse.json(
        { error: 'Missing targetTab or tab parameter' },
        { status: 400 }
      );
    }

    const targetTab = mapTabToTarget(rawTab);
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SCRIPT_URL;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser Client';

    // Standardized payload matching Apps Script doPost(e)
    const appsScriptPayload = {
      targetTab,
      ...rawData,
      ipAddress: rawData.ipAddress || ip,
      deviceInfo: rawData.deviceInfo || rawData.deviceBrowserInfo || userAgent,
      sourceUrl: rawData.sourceUrl || req.headers.get('referer') || '/',
      timestamp: new Date().toISOString()
    };

    if (webhookUrl) {
      try {
        const googleRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appsScriptPayload),
          cache: 'no-store'
        });

        const resText = await googleRes.text();
        let parsedRes: any = {};
        try { parsedRes = JSON.parse(resText); } catch (_) { parsedRes = { raw: resText }; }

        return NextResponse.json({
          success: true,
          targetTab,
          syncedAt: new Date().toISOString(),
          googleResponse: parsedRes
        });
      } catch (webhookErr: any) {
        console.warn('[SHEETS-WEBHOOK-DISPATCH-WARN]', webhookErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      targetTab,
      syncedAt: new Date().toISOString(),
      mode: 'local_dispatched'
    });
  } catch (error: any) {
    console.error('[SHEETS-API-ROUTE-ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch to Google Sheets' },
      { status: 500 }
    );
  }
}

/**
 * GET: Queries live data from Google Sheets Apps Script Webhook (e.g. registered users, count, etc.)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'Register Data Core';
    const action = searchParams.get('action') || 'GET_DATA';
    const query = searchParams.get('q') || '';
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SCRIPT_URL;

    if (webhookUrl) {
      try {
        const scriptUrlWithQuery = `${webhookUrl}?action=${encodeURIComponent(action)}&tab=${encodeURIComponent(tab)}&q=${encodeURIComponent(query)}`;
        const res = await fetch(scriptUrlWithQuery, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });

        if (res.ok) {
          const json = await res.json();
          return NextResponse.json(json);
        }
      } catch (err: any) {
        console.warn('[SHEETS-GET-FETCH-WARN]', err?.message);
      }
    }

    // Default dynamic structure for registered core users
    return NextResponse.json({
      status: 'SUCCESS',
      tab,
      count: 0,
      rows: [],
      users: [],
      connected: Boolean(webhookUrl)
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to read from Google Sheets' },
      { status: 500 }
    );
  }
}
