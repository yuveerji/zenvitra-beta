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
    const { formId, formTitle, formSlug, submissions, userEmail, customSheetUrl, targetTab } = body;

    const DEFAULT_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbzCit4ReokFJY2qZcIgzeZ0FuuU8wsYVSaaEopmGfpzKKbo1-_yCTedzc0qa3-Maaqr/exec';
    const finalTab = targetTab || (formSlug ? `ZEN_${formSlug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}` : 'ZEN_FORMS');

    const syncedEntries: any[] = [];
    const subsArray = Array.isArray(submissions) ? submissions : [submissions].filter(Boolean);

    for (const sub of subsArray) {
      const payload = {
        targetTab: finalTab,
        tab: finalTab,
        formId,
        formTitle,
        formSlug,
        submissionId: sub.id,
        submittedAt: sub.submittedAt || new Date().toISOString(),
        submitterHandle: sub.submitterHandle || 'anonymous',
        syncedByEmail: userEmail || 'authenticated_user',
        customSheetUrl: customSheetUrl || '',
        ...sub.data,
        timestamp: new Date().toISOString()
      };

      // 1. Write to local backup ledger
      appendToLocalLedger(payload);

      // 2. Dispatch to Google Sheets Webhook
      if (DEFAULT_WEBHOOK_URL && DEFAULT_WEBHOOK_URL.startsWith('http')) {
        try {
          fetch(DEFAULT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch((e) => console.warn('[SHEETS-SYNC-WARN]', e.message));
        } catch (_) {}
      }

      syncedEntries.push(payload);
    }

    return NextResponse.json({
      success: true,
      count: syncedEntries.length,
      targetTab: finalTab,
      syncedAt: new Date().toISOString(),
      masterSheetUrl: 'https://docs.google.com/spreadsheets/d/1gW6uQeX7X6Yc1fW3E_vH-eZq9Q2cM_master/edit'
    });
  } catch (err: any) {
    console.error('[SHEETS-BATCH-SYNC-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
