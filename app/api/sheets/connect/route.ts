import { NextRequest, NextResponse } from 'next/server';
import {
  parseGoogleSheetsUrl,
  parseAppsScriptUrl,
  testAppsScriptHandshake,
  saveSheetsIntegration,
  getActiveIntegration,
  listAllIntegrations,
  deleteIntegration,
} from '@/lib/sheets/sheetsConnectionManager';

export const dynamic = 'force-dynamic';

/**
 * POST /api/sheets/connect
 * Receives Google Sheets Link + Google Apps Script Link, validates, handshakes,
 * generates integrated code, and establishes active synchronization.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sheetUrl,
      scriptUrl,
      name,
      scope = 'GLOBAL',
      eventId,
      formId,
      syncMode = 'BI_DIRECTIONAL',
      autoInitTabs = true,
    } = body;

    if (!sheetUrl) {
      return NextResponse.json(
        { success: false, error: 'Google Sheets link is required.' },
        { status: 400 }
      );
    }

    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: 'Google Apps Script deployment link is required.' },
        { status: 400 }
      );
    }

    // Resolve caller's origin/host
    const host = req.headers.get('host') || 'zenvitra.org';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const hostUrl = `${protocol}://${host}`;

    // Connect, handshake, generate integrated code, and persist
    const result = await saveSheetsIntegration({
      sheetUrl,
      scriptUrl,
      name,
      scope,
      eventId,
      formId,
      syncMode,
      hostUrl,
    });

    // Optionally trigger tab initialization if Apps Script is reachable
    let tabsInitResult: any = null;
    if (autoInitTabs && result.handshake.reachable) {
      try {
        const initRes = await fetch(result.integration.webhookExecUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'INIT_TABS',
            spreadsheetId: result.integration.spreadsheetId,
            timestamp: new Date().toISOString(),
          }),
        });
        tabsInitResult = await initRes.json().catch(() => null);
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message: 'Google Sheets and Apps Script connected successfully.',
      integration: result.integration,
      integratedCode: result.integratedCode,
      handshake: result.handshake,
      tabsInitResult,
    });
  } catch (error: any) {
    console.error('[SHEETS-CONNECT-POST-ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to connect Google Sheets and Apps Script.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sheets/connect
 * Returns the active or all connected Google Sheets & Apps Script integrations.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scopeOrId = searchParams.get('id') || searchParams.get('eventId') || searchParams.get('scope') || undefined;
    const all = searchParams.get('all') === 'true';

    if (all) {
      const integrations = listAllIntegrations();
      return NextResponse.json({
        success: true,
        count: integrations.length,
        integrations,
      });
    }

    const active = getActiveIntegration(scopeOrId);
    if (!active) {
      return NextResponse.json({
        success: false,
        message: 'No active Google Sheets integration configured.',
        connected: false,
      });
    }

    return NextResponse.json({
      success: true,
      connected: true,
      integration: active,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch sheets integration.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sheets/connect
 * Disconnects an integration by ID or Spreadsheet ID.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Integration ID or Spreadsheet ID is required to disconnect.' },
        { status: 400 }
      );
    }

    const removed = deleteIntegration(id);
    return NextResponse.json({
      success: removed,
      message: removed ? 'Integration disconnected successfully.' : 'Integration ID not found.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to disconnect integration.' },
      { status: 500 }
    );
  }
}
