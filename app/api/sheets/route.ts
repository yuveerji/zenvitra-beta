import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeForGoogleSheets } from '@/lib/googleSheets';
import { getActiveIntegration } from '@/lib/sheets/sheetsConnectionManager';

export const dynamic = 'force-dynamic';

function appendToLocalLedger(entry: Record<string, any>) {
  try {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, 'sheets_backup_ledger.jsonl');
    fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8');
  } catch (err) {
    console.warn('[LOCAL-LEDGER-WRITE-ERROR]', err);
  }
}

/**
 * Normalized tab target mapping to ensure compatibility with Apps Script
 */
function mapTabToTarget(rawTab: string): string {
  const upper = (rawTab || '').toUpperCase().trim();
  let resolved = '';

  if (upper.includes('REGISTER') || upper.includes('CORE REG')) resolved = 'Register Data Core';
  else if (upper.includes('LOGIN') || upper.includes('AUTH')) resolved = 'Login Data Core';
  else if (upper.includes('EVENT REG') || upper.includes('PASS') || upper.includes('TICKET')) resolved = 'Event Registrations';
  else if (upper === 'EVENTS' || upper.includes('CONFERENCE') || upper.includes('MUN') || upper.includes('DIPLOMACY')) resolved = 'Event Registrations';
  else if (upper.includes('CAMPUS') || upper.includes('AMBASSADOR')) resolved = 'Campus Ambassadors';
  else if (upper.includes('CORE TEAM') || upper.includes('TEAM APPL') || upper.includes('CAREER')) resolved = 'Core Team Applications';
  else if (upper.includes('CONTACT') || upper.includes('INQUIR')) resolved = 'Contact Inquiries';
  else if (upper.includes('NEWSLETTER') || upper.includes('SUBSCRIB')) resolved = 'Newsletter Subscribers';
  else if (upper.includes('COLLAB') || upper.includes('PARTNER')) resolved = 'Collab & Partnerships';
  else if (upper.includes('COMMUNITY')) resolved = 'Community Members';
  else if (upper.includes('DONAT')) resolved = 'Donations';
  else if (upper.includes('IMPACT')) resolved = 'Impact Ledger';
  else if (upper.includes('FEEDBACK') || upper.includes('GRIEVANCE')) resolved = 'Feedback & Grievance';
  else if (upper.includes('FORM') || upper.includes('SUBMISSION')) resolved = 'Form Submissions';
  else if (upper.includes('PEOPLE') || upper === 'USERS') resolved = '01 People';
  else resolved = rawTab || 'Register Data Core';

  return resolved.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * POST: Forwards events & registrations to Google Sheets Apps Script Webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action ? String(body.action).toUpperCase() : undefined;
    const rawTab = body.targetTab || body.tab || body.target;
    const rawData = body.data || body;

    if (!rawTab && !action) {
      return NextResponse.json(
        { error: 'Missing targetTab or action parameter' },
        { status: 400 }
      );
    }

    const targetTab = rawTab ? mapTabToTarget(rawTab) : undefined;
    const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxRZ_ZUCZmxgTiZ2zHc9GaPWvioPyST9iLUBLdeqI7UM--3MWSiXyUcnh1vFW1d6exH/exec';
    const activeIntegration = getActiveIntegration(body.eventId || body.formId);
    const webhookUrl = activeIntegration?.webhookExecUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SCRIPT_URL || DEFAULT_WEBHOOK_URL;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser Client';

    // Standardized payload matching Apps Script doPost(e)
    const appsScriptPayload = sanitizeForGoogleSheets({
      ...(action ? { action } : {}),
      ...(targetTab ? { targetTab, tab: targetTab } : {}),
      ...rawData,
      ipAddress: rawData.ipAddress || ip,
      deviceInfo: rawData.deviceInfo || rawData.deviceBrowserInfo || userAgent,
      sourceUrl: rawData.sourceUrl || req.headers.get('referer') || '/',
      timestamp: new Date().toISOString()
    });

    // 1. Immediately persist to local zero-loss ledger
    appendToLocalLedger(appsScriptPayload);

    if (webhookUrl) {
      try {
        const googleRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appsScriptPayload),
          redirect: 'follow',
          cache: 'no-store'
        });

        const resText = await googleRes.text();
        let parsedRes: any = {};
        try { parsedRes = JSON.parse(resText); } catch (_) { parsedRes = { raw: resText }; }

        return NextResponse.json({
          success: true,
          targetTab,
          action,
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
      action,
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
    const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxRZ_ZUCZmxgTiZ2zHc9GaPWvioPyST9iLUBLdeqI7UM--3MWSiXyUcnh1vFW1d6exH/exec';
    const activeIntegration = getActiveIntegration(searchParams.get('eventId') || undefined);
    const webhookUrl = activeIntegration?.webhookExecUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SCRIPT_URL || DEFAULT_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const scriptUrlWithQuery = `${webhookUrl}?action=${encodeURIComponent(action)}&tab=${encodeURIComponent(tab)}&q=${encodeURIComponent(query)}`;
        const res = await fetch(scriptUrlWithQuery, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          redirect: 'follow',
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
