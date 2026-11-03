import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getOverrides(): Record<string, any> {
  try {
    const p = path.join(process.cwd(), 'data', 'forms', 'zenith_status_overrides.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (_) {}
  return {};
}

function getStatusDetails(statusRaw: string) {
  const s = (statusRaw || '').toUpperCase().trim();

  if (s.includes('SELECTED') || s.includes('APPOINTED')) {
    return {
      statusKey: 'SELECTED',
      statusLabel: '🎉 Appointed to Secretariat',
      themeColor: '#22c55e',
      stage: 'Selection Confirmed — Appointment Letter Issued',
      notes: 'Congratulations! The Secretariat Selection Committee has formally confirmed your appointment to the ZENITH MUN 2026 Secretariat.'
    };
  }

  if (s.includes('SHORTLISTED') || s.includes('INTERVIEW')) {
    return {
      statusKey: 'SHORTLISTED',
      statusLabel: '🎙️ Shortlisted for Interview',
      themeColor: '#38bdf8',
      stage: 'Stage 2 — Virtual Interview Round',
      notes: 'Your profile and practical assessment have successfully passed the initial evaluation! You have been shortlisted for a brief departmental interview.'
    };
  }

  if (s.includes('PRACTICAL')) {
    return {
      statusKey: 'PRACTICAL_ASSIGNED',
      statusLabel: '📝 Practical Task Active',
      themeColor: '#a855f7',
      stage: 'Stage 2B — Department Practical Task',
      notes: 'A department practical task has been assigned to your candidacy. Please check your registered email and WhatsApp.'
    };
  }

  if (s.includes('REVIEW')) {
    return {
      statusKey: 'UNDER_REVIEW',
      statusLabel: '🔍 Under Active Evaluation',
      themeColor: '#f59e0b',
      stage: 'Stage 1 — Merit Scorecard Evaluation',
      notes: 'Your practical questions and prior experience are currently being scored by your chosen department heads.'
    };
  }

  if (s.includes('WAITLIST')) {
    return {
      statusKey: 'WAITLISTED',
      statusLabel: '⏳ Candidate on Standby / Waitlist',
      themeColor: '#f97316',
      stage: 'Standby Allocation Registry',
      notes: 'Your application has been placed on the standby allocation list. Vacancies in subsequent rounds will be offered in order of merit score.'
    };
  }

  if (s.includes('REJECTED')) {
    return {
      statusKey: 'REJECTED',
      statusLabel: 'Evaluation Completed',
      themeColor: '#ef4444',
      stage: 'Candidacy Concluded',
      notes: 'Thank you for your application to ZENITH MUN 2026. While your candidacy was not selected for this cohort, we deeply appreciate your participation and encourage you to join as a delegate.'
    };
  }

  // Default submitted state
  return {
    statusKey: 'SUBMITTED',
    statusLabel: 'Under Evaluation (100% Merit Review)',
    themeColor: '#fbbf24',
    stage: 'Stage 1 — Application Screening & Routing',
    notes: 'Your application and department-specific practical assessment have been securely recorded in the Secretariat ledger and routed to the Department Evaluation Dais.'
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.trim() || '';
    const formId = searchParams.get('formId') || 'zenith-secretariat-2026';

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query parameter is required' }, { status: 400 });
    }

    const cleanQuery = query.toLowerCase();

    // 1. Check local JSON files (data/forms/*.json)
    const formsDir = path.join(process.cwd(), 'data', 'forms');
    const matchedSubmissions: any[] = [];

    if (fs.existsSync(formsDir)) {
      const files = fs.readdirSync(formsDir).filter((f) => f.endsWith('.json') && !f.includes('overrides'));
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

    // 2. Check data/sheets_backup_ledger.jsonl
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
    const ticketId = d.ticketId || latest.id;
    const email = d.q4_email || d.email || '';

    // 3. Check for Live Overrides synced from Google Sheet (via onEdit webhook or sheet sync)
    const overrides = getOverrides();
    const liveOverride =
      overrides[ticketId.toUpperCase()] ||
      overrides[latest.id.toUpperCase()] ||
      (email ? overrides[email.toLowerCase()] : null);

    // 4. Live fetch from Google Sheet Webhook if configured and override is not recent
    let sheetLiveStatus: string | null = null;
    let sheetNotes: string | null = null;
    let sheetTotalScore: string | null = null;

    const webhookUrl =
      process.env.ZENITH_GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      'https://script.google.com/macros/s/AKfycbyWc4Pxyibs6oh8EWd2xIMjLSOmkhxACuvB3WAVcO1MxRMeRtWJSnJmXliJ0KmrdqIq/exec';

    if (webhookUrl && webhookUrl.includes('script.google.com')) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500); // 3.5s timeout
        const sheetRes = await fetch(
          `${webhookUrl}?query=${encodeURIComponent(ticketId || email)}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (sheetRes.ok) {
          const sheetData = await sheetRes.json();
          if (sheetData && sheetData.found && sheetData.application) {
            sheetLiveStatus = sheetData.application.status;
            sheetNotes = sheetData.application.notes;
            sheetTotalScore = sheetData.application.totalScore;
          }
        }
      } catch (_) {
        // Fallback gracefully to local override or submitted state
      }
    }

    // Determine authoritative status
    const effectiveStatus =
      sheetLiveStatus ||
      liveOverride?.status ||
      d.status ||
      'SUBMITTED';

    const effectiveNotes =
      sheetNotes ||
      liveOverride?.notes ||
      '';

    const effectiveScore =
      sheetTotalScore ||
      liveOverride?.totalScore ||
      '';

    const statusDetails = getStatusDetails(effectiveStatus);

    return NextResponse.json({
      success: true,
      found: true,
      application: {
        id: latest.id,
        ticketId: ticketId,
        submittedAt: latest.submittedAt,
        fullName: d.q1_full_name || d.fullName || 'Secretariat Applicant',
        email: email,
        phone: d.q5_phone || d.phoneNumber || '',
        location: d.q3_location || d.city || '',
        institution: d.q6_institution || d.institution || '',
        primaryDept: d.q11_primary_dept || d.preferredSector || 'General Secretariat',
        secondaryDept: d.q11_secondary_dept || d.secondarySector || 'None Specified',
        status: statusDetails.statusKey,
        statusLabel: statusDetails.statusLabel,
        themeColor: statusDetails.themeColor,
        scorecardActive: true,
        scorecardStage: statusDetails.stage,
        totalScore: effectiveScore,
        reviewerNotes: effectiveNotes,
        notes: effectiveNotes ? `${statusDetails.notes}\n\nReviewer Feedback: "${effectiveNotes}"` : statusDetails.notes
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
