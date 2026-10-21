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

  // Clean register names (zero numbers, zero underscores)
  if (upper.includes('PEOPLE') || upper === 'USERS') resolved = 'People';
  else if (upper.includes('CORE REG') || upper.includes('REGISTER_CORE') || upper.includes('REGISTER DATA')) resolved = 'Core Registrations';
  else if (upper.includes('CORE TEAM') || upper.includes('CORE_TEAM')) resolved = 'Core Team Applications';
  else if (upper.includes('TEAM APPL') || upper.includes('TEAM_APPL')) resolved = 'Team Applications';
  else if (upper.includes('TEAM_ROLES') || upper.includes('TEAM ROLES') || upper.includes('ROLES ACCESS')) resolved = 'Team Roles Access';
  else if (upper.includes('CONTACT') || upper.includes('INQUIR')) resolved = 'Contact Inquiries';
  else if (upper.includes('NEWSLETTER')) resolved = 'Newsletter Subscribers';
  else if (upper.includes('COLLAB') || upper.includes('PARTNERSHIP')) resolved = 'Collaborations';
  else if (upper.includes('COMMUNITY')) resolved = 'Community Members';
  else if (upper.includes('CAMPUS') || upper.includes('AMBASSADOR')) resolved = 'Campus Ambassadors';
  else if (upper.includes('EVENT REGISTRATIONS') || upper.includes('EVENT_REGISTRATIONS') || upper.includes('PASS') || upper.includes('TICKET')) resolved = 'Event Registrations';
  else if (upper === 'EVENTS' || upper.includes('CONFERENCE') || upper.includes('MUN') || upper.includes('DIPLOMACY')) resolved = 'Events';
  else if (upper.includes('COMMITTEE')) resolved = 'Committees';
  else if (upper.includes('DELEGATE') || upper.includes('ROSTER') || upper.includes('MATRIX') || upper.includes('PORTFOLIO') || upper === 'AIPPM' || upper === 'EMI' || upper === 'UNSC' || upper === 'UNODC') resolved = 'Delegate Rosters';
  else if (upper.includes('SECRETARIAT') || upper.includes('DAIS') || upper.includes('EB')) resolved = 'EB Secretariat';
  else if (upper.includes('ATTENDANCE') || upper.includes('ROLLCALL')) resolved = 'Attendance Rollcall';
  else if (upper.includes('AWARDS') || upper.includes('CERTIFICATE')) resolved = 'Awards Certificates';
  else if (upper.includes('PAYMENT') || upper.includes('CASHFREE') || upper.includes('TRANSACTION')) resolved = 'Payments';
  else if (upper.includes('EXPENSE')) resolved = 'Expenses';
  else if (upper.includes('BUDGET')) resolved = 'Budgets';
  else if (upper.includes('TASK')) resolved = 'Tasks';
  else if (upper.includes('FEEDBACK') || upper.includes('GRIEVANCE')) resolved = 'Feedback';
  else if (upper.includes('SUPPORT') || upper.includes('TICKET') || upper.includes('CASE')) resolved = 'Support Cases';
  else if (upper.includes('AUDIT') || upper.includes('LOG')) resolved = 'Audit Logs';
  else if (upper.includes('CHIT') && upper.includes('ARCHIVE')) resolved = 'Chits Archive';
  else if (upper.includes('CHIT')) resolved = 'Chits Active Roster';
  else if (upper.includes('MEET') && upper.includes('ATTENDEE')) resolved = 'Meet Attendees';
  else if (upper.includes('MEET') || upper.includes('CALL')) resolved = 'Meet Sessions';
  else if (upper.includes('PULSE') && upper.includes('CHANNEL')) resolved = 'Pulse Channels';
  else if (upper.includes('PULSE') && upper.includes('COMMENT')) resolved = 'Pulse Comments';
  else if (upper.includes('PULSE') || upper.includes('POST')) resolved = 'Pulse Posts';
  else if (upper.includes('CONTENT') || upper.includes('EDITORIAL') || upper.includes('NEWS')) resolved = 'Content Editorial';
  else if (upper.includes('FEATURE') || upper.includes('BUG') || upper.includes('ISSUE')) resolved = 'Feature Bugs';
  else if (upper.includes('MODULE')) resolved = 'Module Catalog';
  else if (upper.includes('BILL') && upper.includes('AMENDMENT')) resolved = 'Bill Amendments';
  else if (upper.includes('BILL') || upper.includes('LEGISLATION') || upper.includes('SOLUTION')) resolved = 'Legislation Bills';
  else if (upper.includes('FORM')) resolved = 'Form Submissions';
  else if (upper.includes('DOCS')) resolved = 'Zen Docs Metrics';
  else resolved = rawTab || 'Core Registrations';

  // Strip any leading numbers (e.g. "01 ", "02_") and underscores
  return resolved.replace(/^\d+[\s_-]*/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
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
