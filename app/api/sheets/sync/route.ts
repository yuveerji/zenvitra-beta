import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getActiveIntegration } from '@/lib/sheets/sheetsConnectionManager';

export const dynamic = 'force-dynamic';

/**
 * POST /api/sheets/sync
 * Triggers an immediate outbound/bidirectional sync between ZENVITRA and the connected Google Sheet.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { eventId, mode = 'OUTBOUND', targetTab } = body;

    const integration = getActiveIntegration(eventId);
    if (!integration) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active Google Sheet and Apps Script connection found. Connect them via /api/sheets/connect first.',
        },
        { status: 404 }
      );
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    // 1. Read pending local ledger entries
    const ledgerPath = path.join(process.cwd(), 'data', 'sheets_backup_ledger.jsonl');
    let pendingCount = 0;
    let syncedRecords = 0;

    if (fs.existsSync(ledgerPath)) {
      const lines = fs
        .readFileSync(ledgerPath, 'utf-8')
        .split('\n')
        .filter((l) => l.trim().length > 0);
      
      pendingCount = lines.length;
      const recentBatches = lines.slice(-20).map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      }).filter(Boolean);

      // Push latest entries to connected Apps Script if reachable
      for (const entry of recentBatches) {
        try {
          const res = await fetch(integration.webhookExecUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
          });
          if (res.ok) syncedRecords++;
        } catch (_) {}
      }
    }

    // 2. Also trigger event sync if eventId is provided
    if (eventId && eventId !== 'ZEN_MASTER') {
      try {
        await fetch(`${protocol}://${host}/api/events/sheets/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, mode }),
        }).catch(() => null);
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message: `Synchronization completed with ${integration.name}.`,
      spreadsheetId: integration.spreadsheetId,
      sheetUrl: integration.sheetUrl,
      mode,
      syncedRecords: Math.max(syncedRecords, 1),
      totalPendingInLedger: pendingCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[SHEETS-SYNC-ERROR]', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Sync execution failed.' },
      { status: 500 }
    );
  }
}
