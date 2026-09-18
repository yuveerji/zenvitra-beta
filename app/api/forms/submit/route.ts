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

function saveStructuredSubmission(formId: string, submission: any) {
  try {
    const dir = path.join(process.cwd(), 'data', 'forms');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const safeId = formId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(dir, `submissions_${safeId}.json`);
    let existing: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (_) {
        existing = [];
      }
    }
    // Prepend new submission
    existing.unshift(submission);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[STRUCTURED-SUBMISSION-SAVE-ERROR]', err);
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

    const timestamp = submittedAt || new Date().toISOString();
    const subId = submissionId || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const structuredSub = {
      id: subId,
      formId,
      submittedAt: timestamp,
      data: data || {},
      submitterHandle: submitterHandle || 'anonymous',
    };

    // 1. Save structured submission for web responses viewer
    saveStructuredSubmission(formId, structuredSub);

    const ledgerEntry = {
      timestamp,
      tab: targetTab,
      targetTab,
      formId,
      submissionId: subId,
      submitterHandle: submitterHandle || 'anonymous',
      googleUserEmail: googleUserEmail || '',
      customSheetUrl: customSheetUrl || '',
      ...data,
    };

    // 2. Always persist to backup ledger immediately
    appendToLocalLedger(ledgerEntry);

    // 3. If creator or system Google Sheets webhook is configured, forward asynchronously
    const targetWebhook = body.webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (targetWebhook && typeof targetWebhook === 'string' && targetWebhook.startsWith('http')) {
      fetch(targetWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ledgerEntry),
      }).catch((e) => console.warn('[SHEETS-ZENFORMS-WEBHOOK-WARN]', e.message));
    }

    return NextResponse.json({ success: true, submissionId: subId, submission: structuredSub });
  } catch (err: any) {
    console.error('[ZEN-FORMS-SUBMIT-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
