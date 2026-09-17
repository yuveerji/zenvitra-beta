import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formId, submissionId, submittedAt, data, submitterHandle } = body;

    const ledgerEntry = {
      timestamp: submittedAt || new Date().toISOString(),
      tab: 'ZEN_FORMS',
      formId,
      submissionId,
      submitterHandle: submitterHandle || 'anonymous',
      data: data || {},
    };

    // Always persist to local ledger immediately
    appendToLocalLedger(ledgerEntry);

    // If Google Sheets webhook is configured, forward asynchronously
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ledgerEntry),
      }).catch((e) => console.warn('[SHEETS-ZENFORMS-WEBHOOK-WARN]', e.message));
    }

    return NextResponse.json({ success: true, submissionId });
  } catch (err: any) {
    console.error('[ZEN-FORMS-SUBMIT-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
