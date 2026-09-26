import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ZenFormTemplate } from '@/types/forms';
import { OFFICIAL_TEMPLATES } from '@/lib/formsTemplates';

export const dynamic = 'force-dynamic';

const TEMPLATES_FILE = path.join(process.cwd(), 'data', 'forms', 'community_templates.json');

function ensureTemplatesDir() {
  const dir = path.dirname(TEMPLATES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getStoredCommunityTemplates(): ZenFormTemplate[] {
  try {
    ensureTemplatesDir();
    if (fs.existsSync(TEMPLATES_FILE)) {
      const content = fs.readFileSync(TEMPLATES_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[TEMPLATES-REGISTRY-READ-ERROR]', err);
  }
  return [];
}

function saveStoredCommunityTemplates(templates: ZenFormTemplate[]) {
  try {
    ensureTemplatesDir();
    fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[TEMPLATES-REGISTRY-WRITE-ERROR]', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const community = getStoredCommunityTemplates();
    const all = [...OFFICIAL_TEMPLATES, ...community];

    if (id) {
      const clean = id.trim().toLowerCase();
      const found = all.find((t) => t.id.toLowerCase() === clean || t.slug?.toLowerCase() === clean);
      if (found) {
        return NextResponse.json({ success: true, template: found });
      }
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      official: OFFICIAL_TEMPLATES,
      community,
      templates: all
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const template: ZenFormTemplate = body.template || body;

    if (!template || !template.id || !template.form) {
      return NextResponse.json({ success: false, error: 'Invalid template structure' }, { status: 400 });
    }

    const current = getStoredCommunityTemplates();
    const filtered = current.filter((t) => t.id !== template.id && t.slug !== template.slug);
    const updated = [
      {
        ...template,
        isCommunity: true
      },
      ...filtered
    ];

    saveStoredCommunityTemplates(updated);

    return NextResponse.json({ success: true, template });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
