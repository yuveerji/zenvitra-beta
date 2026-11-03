import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.trim() || '';
    const formId = searchParams.get('formId') || 'zenith-secretariat-2026';

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query parameter is required' }, { status: 400 });
    }

    const cleanQuery = query.toLowerCase();

    // 1. Search in data/forms/*.json
    const formsDir = path.join(process.cwd(), 'data', 'forms');
    const matchedSubmissions: any[] = [];

    if (fs.existsSync(formsDir)) {
      const files = fs.readdirSync(formsDir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(formsDir, file), 'utf-8');
          const subs = JSON.parse(content);
          if (Array.isArray(subs)) {
            for (const sub of subs) {
              const d = sub.data || {};
              const match =
                (sub.id && sub.id.toLowerCase() === cleanQuery) ||
                (d.ticketId && String(d.ticketId).toLowerCase() === cleanQuery) ||
                (d.q4_email && String(d.q4_email).toLowerCase() === cleanQuery) ||
                (d.email && String(d.email).toLowerCase() === cleanQuery) ||
                (d.q5_phone && String(d.q5_phone).replace(/\s+/g, '') === cleanQuery.replace(/\s+/g, '')) ||
                (d.q1_full_name && String(d.q1_full_name).toLowerCase() === cleanQuery);

              if (match) {
                matchedSubmissions.push(sub);
              }
            }
          }
        } catch (_) {}
      }
    }

    // 2. Search in data/sheets_backup_ledger.jsonl
    const ledgerPath = path.join(process.cwd(), 'data', 'sheets_backup_ledger.jsonl');
    if (fs.existsSync(ledgerPath)) {
      try {
        const lines = fs.readFileSync(ledgerPath, 'utf-8').split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const entry = JSON.parse(line);
            const match =
              (entry.submissionId && entry.submissionId.toLowerCase() === cleanQuery) ||
              (entry.ticketId && String(entry.ticketId).toLowerCase() === cleanQuery) ||
              (entry.q4_email && String(entry.q4_email).toLowerCase() === cleanQuery) ||
              (entry.email && String(entry.email).toLowerCase() === cleanQuery) ||
              (entry.q1_full_name && String(entry.q1_full_name).toLowerCase() === cleanQuery);

            if (match && !matchedSubmissions.some((m) => m.id === entry.submissionId)) {
              matchedSubmissions.push({
                id: entry.submissionId,
                formId: entry.formId || formId,
                submittedAt: entry.timestamp || new Date().toISOString(),
                data: entry
              });
            }
          } catch (_) {}
        }
      } catch (_) {}
    }

    if (matchedSubmissions.length === 0) {
      return NextResponse.json({
        success: true,
        found: false,
        message: 'No application matching this Reference ID, Ticket ID, or Email was found.'
      });
    }

    // Sort by latest submitted
    matchedSubmissions.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    const latest = matchedSubmissions[0];
    const d = latest.data || {};

    return NextResponse.json({
      success: true,
      found: true,
      application: {
        id: latest.id,
        ticketId: d.ticketId || latest.id,
        submittedAt: latest.submittedAt,
        fullName: d.q1_full_name || d.fullName || 'Secretariat Applicant',
        email: d.q4_email || d.email || '',
        phone: d.q5_phone || d.phoneNumber || '',
        location: d.q3_location || d.city || '',
        institution: d.q6_institution || d.institution || '',
        primaryDept: d.q11_primary_dept || d.preferredSector || 'General Secretariat',
        secondaryDept: d.q11_secondary_dept || d.secondarySector || 'None Specified',
        status: 'UNDER_EVALUATION',
        statusLabel: 'Under Evaluation (100% Merit Review)',
        scorecardActive: true,
        scorecardStage: 'Stage 1 — Application Screening',
        notes: 'Your application and department-specific practical assessment have been securely recorded in the Secretariat ledger and routed to the Department Evaluation Dais.'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
