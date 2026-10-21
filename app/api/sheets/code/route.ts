import { NextRequest, NextResponse } from 'next/server';
import {
  parseGoogleSheetsUrl,
  generateIntegratedAppsScriptCode,
  getActiveIntegration,
} from '@/lib/sheets/sheetsConnectionManager';

export const dynamic = 'force-dynamic';

/**
 * GET or POST /api/sheets/code
 * Generates tailored Google Apps Script code for a specific sheet and apps script link.
 * Query params or JSON body:
 * - sheetUrl / spreadsheetId
 * - eventId / eventName
 * - download=true (triggers direct .js file download)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sheetUrl = searchParams.get('sheetUrl') || searchParams.get('spreadsheetId') || '';
    const eventId = searchParams.get('eventId') || 'ZEN_MASTER';
    const eventName = searchParams.get('eventName') || 'ZENVITRA Ecosystem';
    const download = searchParams.get('download') === 'true';

    // Fall back to active integration if no sheetUrl passed
    let targetSpreadsheetId = '';
    let targetSpreadsheetUrl = '';

    if (sheetUrl) {
      const parsed = parseGoogleSheetsUrl(sheetUrl);
      if (parsed.isValid) {
        targetSpreadsheetId = parsed.spreadsheetId;
        targetSpreadsheetUrl = parsed.canonicalUrl;
      }
    }

    if (!targetSpreadsheetId) {
      const active = getActiveIntegration(eventId);
      if (active) {
        targetSpreadsheetId = active.spreadsheetId;
        targetSpreadsheetUrl = active.sheetUrl;
      } else {
        targetSpreadsheetId = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
        targetSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
      }
    }

    const host = req.headers.get('host') || 'zenvitra.org';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const webhookEndpoint = `${protocol}://${host}/api/sheets/inbound`;
    const webhookSecret = `zs_${Math.random().toString(36).substring(2, 10)}`;

    const code = generateIntegratedAppsScriptCode({
      spreadsheetId: targetSpreadsheetId,
      spreadsheetUrl: targetSpreadsheetUrl,
      webhookEndpoint,
      webhookSecret,
      eventName,
      eventId,
    });

    if (download) {
      return new NextResponse(code, {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Content-Disposition': `attachment; filename="zenvitra_sheet_sync_${targetSpreadsheetId.slice(0, 8)}.js"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      spreadsheetId: targetSpreadsheetId,
      webhookEndpoint,
      filename: `zenvitra_sheet_sync_${targetSpreadsheetId.slice(0, 8)}.js`,
      code,
      instructions: [
        '1. Open your Google Sheet',
        '2. Go to Extensions -> Apps Script',
        '3. Delete any boilerplate and paste this code',
        '4. Click Save, then run "setupZenvitraTriggers" once',
        '5. (Optional) Run "initAllTabs" to generate all operational registers automatically',
        '6. Click Deploy -> New deployment -> Web app (Who has access: Anyone)',
        '7. Copy the Web App URL and link it back in ZENVITRA',
      ],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to generate Apps Script code' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sheetUrl, eventId = 'ZEN_MASTER', eventName = 'ZENVITRA Ecosystem' } = body;

    let targetSpreadsheetId = '';
    let targetSpreadsheetUrl = '';

    if (sheetUrl) {
      const parsed = parseGoogleSheetsUrl(sheetUrl);
      if (parsed.isValid) {
        targetSpreadsheetId = parsed.spreadsheetId;
        targetSpreadsheetUrl = parsed.canonicalUrl;
      }
    }

    if (!targetSpreadsheetId) {
      const active = getActiveIntegration(eventId);
      if (active) {
        targetSpreadsheetId = active.spreadsheetId;
        targetSpreadsheetUrl = active.sheetUrl;
      } else {
        targetSpreadsheetId = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
        targetSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
      }
    }

    const host = req.headers.get('host') || 'zenvitra.org';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const webhookEndpoint = `${protocol}://${host}/api/sheets/inbound`;
    const webhookSecret = `zs_${Math.random().toString(36).substring(2, 10)}`;

    const code = generateIntegratedAppsScriptCode({
      spreadsheetId: targetSpreadsheetId,
      spreadsheetUrl: targetSpreadsheetUrl,
      webhookEndpoint,
      webhookSecret,
      eventName,
      eventId,
    });

    return NextResponse.json({
      success: true,
      spreadsheetId: targetSpreadsheetId,
      webhookEndpoint,
      filename: `zenvitra_sheet_sync_${targetSpreadsheetId.slice(0, 8)}.js`,
      code,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to generate code' },
      { status: 500 }
    );
  }
}
