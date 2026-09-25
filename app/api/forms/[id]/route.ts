import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ZenForm } from '@/types/forms';
import { DEFAULT_ZEN_FORMS } from '@/lib/formsStorage';

export const dynamic = 'force-dynamic';

const FORMS_FILE = path.join(process.cwd(), 'data', 'forms', 'forms_registry.json');

function getStoredForms(): ZenForm[] {
  try {
    if (fs.existsSync(FORMS_FILE)) {
      const content = fs.readFileSync(FORMS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (_) {}
  return [];
}

function saveStoredForms(forms: ZenForm[]) {
  try {
    const dir = path.dirname(FORMS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(FORMS_FILE, JSON.stringify(forms, null, 2), 'utf-8');
  } catch (_) {}
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clean = id.trim().toLowerCase();

    // Check default sovereign templates first
    const defaultTemplate = DEFAULT_ZEN_FORMS.find(
      (f) => f.id.toLowerCase() === clean || f.slug?.toLowerCase() === clean
    );
    if (defaultTemplate) {
      const count = getSubmissionsCount(defaultTemplate.id);
      return NextResponse.json({
        success: true,
        form: {
          ...defaultTemplate,
          submissionsCount: Math.max(defaultTemplate.submissionsCount || 0, count)
        }
      });
    }

    const forms = getStoredForms();
    const form = forms.find((f) => f.id === id || f.slug === id);

    if (!form) {
      return NextResponse.json({ success: false, error: 'Form not found' }, { status: 404 });
    }

    const count = getSubmissionsCount(form.id);
    return NextResponse.json({
      success: true,
      form: {
        ...form,
        submissionsCount: Math.max(form.submissionsCount || 0, count)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const forms = getStoredForms();
    const filtered = forms.filter((f) => f.id !== id && f.slug !== id);
    saveStoredForms(filtered);
    return NextResponse.json({ success: true, deleted: id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
