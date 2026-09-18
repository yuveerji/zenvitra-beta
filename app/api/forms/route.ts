import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ZenForm } from '@/types/forms';

export const dynamic = 'force-dynamic';

const FORMS_FILE = path.join(process.cwd(), 'data', 'forms', 'forms_registry.json');

function ensureFormsDir() {
  const dir = path.dirname(FORMS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getStoredForms(): ZenForm[] {
  try {
    ensureFormsDir();
    if (fs.existsSync(FORMS_FILE)) {
      const content = fs.readFileSync(FORMS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[FORMS-REGISTRY-READ-ERROR]', err);
  }
  return [];
}

function saveStoredForms(forms: ZenForm[]) {
  try {
    ensureFormsDir();
    fs.writeFileSync(FORMS_FILE, JSON.stringify(forms, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[FORMS-REGISTRY-WRITE-ERROR]', err);
  }
}

function getSubmissionsCount(formId: string): number {
  try {
    const safeId = formId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const p = path.join(process.cwd(), 'data', 'forms', `submissions_${safeId}.json`);
    if (fs.existsSync(p)) {
      const arr = JSON.parse(fs.readFileSync(p, 'utf-8'));
      return Array.isArray(arr) ? arr.length : 0;
    }
  } catch (_) {}
  return 0;
}

export async function GET() {
  try {
    const forms = getStoredForms();
    // Augment with real submission counts from disk
    const enriched = forms.map((f) => {
      const diskCount = getSubmissionsCount(f.id);
      return {
        ...f,
        submissionsCount: Math.max(f.submissionsCount || 0, diskCount)
      };
    });

    return NextResponse.json({ success: true, forms: enriched });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const form: ZenForm = body.form || body;

    if (!form || !form.id) {
      return NextResponse.json({ success: false, error: 'Invalid form payload' }, { status: 400 });
    }

    const forms = getStoredForms();
    const idx = forms.findIndex((f) => f.id === form.id);
    if (idx >= 0) {
      forms[idx] = { ...form, updatedAt: new Date().toISOString() };
    } else {
      forms.unshift({ ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    saveStoredForms(forms);
    return NextResponse.json({ success: true, form });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
