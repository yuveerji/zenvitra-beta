import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function appendInboundAudit(entry: Record<string, any>) {
  try {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const logPath = path.join(dir, 'sheets_inbound_audit.jsonl');
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n', 'utf-8');
  } catch (_) {}
}

/**
 * POST /api/sheets/inbound
 * Receives cell edit notifications streamed from the connected Google Sheet.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      editUuid,
      eventId,
      spreadsheetId,
      tabName,
      row,
      column,
      columnHeader,
      recordId,
      oldValue,
      newValue,
      userEmail,
      timestamp,
    } = body;

    const auditEntry = {
      editUuid: editUuid || `INBOUND-${Date.now()}`,
      eventId: eventId || 'GLOBAL',
      spreadsheetId,
      tabName,
      row,
      column,
      columnHeader,
      recordId,
      oldValue,
      newValue,
      userEmail: userEmail || 'anonymous_editor',
      receivedAt: new Date().toISOString(),
      timestamp: timestamp || new Date().toISOString(),
      status: 'PROCESSED',
    };

    appendInboundAudit(auditEntry);

    // Also forward to event-specific inbound handler if eventId is provided
    if (eventId && eventId !== 'ZEN_MASTER' && eventId !== 'GLOBAL') {
      try {
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        await fetch(`${protocol}://${host}/api/events/sheets/inbound`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).catch(() => null);
      } catch (_) {}
    }

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Inbound sheet update processed and audited.',
      editUuid: auditEntry.editUuid,
      receivedAt: auditEntry.receivedAt,
    });
  } catch (error: any) {
    console.error('[SHEETS-INBOUND-ERROR]', error);
    return NextResponse.json(
      { status: 'ERROR', error: error?.message || 'Failed to process inbound sheet edit' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sheets/inbound
 * Returns recent inbound edit audits for inspection
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const logPath = path.join(process.cwd(), 'data', 'sheets_inbound_audit.jsonl');

    if (!fs.existsSync(logPath)) {
      return NextResponse.json({ success: true, count: 0, audits: [] });
    }

    const lines = fs
      .readFileSync(logPath, 'utf-8')
      .split('\n')
      .filter((l) => l.trim().length > 0)
      .slice(-limit)
      .reverse();

    const audits = lines.map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return { raw: l };
      }
    });

    return NextResponse.json({
      success: true,
      count: audits.length,
      audits,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve inbound audits' },
      { status: 500 }
    );
  }
}
