import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getOverridesPath() {
  const dir = path.join(process.cwd(), 'data', 'forms');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'zenith_status_overrides.json');
}

function readOverrides(): Record<string, any> {
  try {
    const p = getOverridesPath();
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (_) {}
  return {};
}

function saveOverrides(overrides: Record<string, any>) {
  try {
    const p = getOverridesPath();
    fs.writeFileSync(p, JSON.stringify(overrides, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[STATUS-OVERRIDES-WRITE-ERROR]', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, status, notes, totalScore, department, email } = body;

    if (!ticketId && !email) {
      return NextResponse.json({ success: false, error: 'ticketId or email is required' }, { status: 400 });
    }

    const overrides = readOverrides();
    const key = (ticketId || email).toString().trim().toUpperCase();

    overrides[key] = {
      ticketId,
      email,
      status: status || 'UNDER REVIEW',
      notes: notes || '',
      totalScore: totalScore || '',
      department: department || '',
      updatedAt: new Date().toISOString()
    };

    // If email is provided, also index by email
    if (email && String(email).toLowerCase() !== key.toLowerCase()) {
      overrides[String(email).trim().toLowerCase()] = overrides[key];
    }

    saveOverrides(overrides);

    return NextResponse.json({
      success: true,
      message: `Status updated successfully for ${key}`,
      record: overrides[key]
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
