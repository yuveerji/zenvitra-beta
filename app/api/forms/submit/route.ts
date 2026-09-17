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
    const { 
      formId, 
      formSlug, 
      submissionId, 
      submittedAt, 
      data, 
      submitterHandle,
      googleSheetsConnected,
      googleUserEmail,
      customSheetUrl 
    } = body;

    const targetTab = formSlug 
      ? `ZEN_${formSlug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}` 
      : 'ZEN_FORMS';

    const ledgerEntry = {
      timestamp: submittedAt || new Date().toISOString(),
      tab: targetTab,
      targetTab,
      formId,
      submissionId,
      submitterHandle: submitterHandle || 'anonymous',
      googleUserEmail: googleUserEmail || '',
      customSheetUrl: customSheetUrl || '',
      ...data,
    };

    // Always persist to local ledger immediately
    appendToLocalLedger(ledgerEntry);

    // If creator or system Google Sheets webhook is configured, forward asynchronously
    const targetWebhook = body.webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (targetWebhook && typeof targetWebhook === 'string' && targetWebhook.startsWith('http')) {
      fetch(targetWebhook, {
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
