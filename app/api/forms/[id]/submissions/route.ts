import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ZenFormSubmission } from '@/types/forms';

export const dynamic = 'force-dynamic';

function getSubmissionsFilePath(formId: string) {
  const dir = path.join(process.cwd(), 'data', 'forms');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // Sanitize formId for file name
  const safeId = formId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(dir, `submissions_${safeId}.json`);
}

function getSubmissionsFromDisk(formId: string): ZenFormSubmission[] {
  try {
    const filePath = getSubmissionsFilePath(formId);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[SERVER-SUBMISSIONS-READ-ERROR]', err);
  }

  // Fallback: check sheets_backup_ledger.jsonl
  try {
    const ledgerPath = path.join(process.cwd(), 'data', 'sheets_backup_ledger.jsonl');
    if (fs.existsSync(ledgerPath)) {
      const lines = fs.readFileSync(ledgerPath, 'utf-8').split('\n').filter(Boolean);
      const matched: ZenFormSubmission[] = [];
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (entry.formId === formId) {
            // Reconstruct submission
            const data: Record<string, any> = {};
            for (const [k, v] of Object.entries(entry)) {
              if (!['timestamp', 'tab', 'targetTab', 'formId', 'submissionId', 'submitterHandle', 'googleUserEmail', 'customSheetUrl'].includes(k)) {
                data[k] = v;
              }
            }
            matched.push({
              id: entry.submissionId || `sub_${Date.now()}`,
              formId,
              submittedAt: entry.timestamp || new Date().toISOString(),
              data,
              submitterHandle: entry.submitterHandle || 'anonymous'
            });
          }
        } catch (_) {}
      }
      return matched;
    }
  } catch (_) {}

  return [];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing form ID' }, { status: 400 });
    }

    const submissions = getSubmissionsFromDisk(id);
    return NextResponse.json({
      success: true,
      formId: id,
      count: submissions.length,
      submissions,
    });
  } catch (err: any) {
    console.error('[GET-FORM-SUBMISSIONS-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing form ID' }, { status: 400 });
    }

    const url = new URL(req.url);
    const submissionId = url.searchParams.get('submissionId');

    const filePath = getSubmissionsFilePath(id);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: true, count: 0, submissions: [] });
    }

    let existing = getSubmissionsFromDisk(id);
    if (submissionId) {
      existing = existing.filter((s) => s.id !== submissionId);
    } else {
      existing = [];
    }

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      formId: id,
      count: existing.length,
      submissions: existing,
    });
  } catch (err: any) {
    console.error('[DELETE-FORM-SUBMISSIONS-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
