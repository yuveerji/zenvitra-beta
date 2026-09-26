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

    const isSec = formId?.toLowerCase().includes('secretariat') || formSlug?.toLowerCase().includes('secretariat');
    const isMun = formId?.toLowerCase().includes('diplomacy') || formId?.toLowerCase().includes('mun') || formSlug?.toLowerCase().includes('diplomacy');

    const rawData = data || {};
    let committeeTab = '';
    if (isMun) {
      const commChoice = String(rawData.step3_primary_committee || rawData.firstCommitteeChoice || '').toUpperCase();
      if (commChoice.includes('AIPPM')) committeeTab = 'AIPPM';
      else if (commChoice.includes('EMI')) committeeTab = 'EMI';
      else if (commChoice.includes('UNSC')) committeeTab = 'UNSC';
      else if (commChoice.includes('UNODC')) committeeTab = 'UNODC';
    }

    const targetTab = body.targetTab || body.sheetTab || (isSec ? 'Secretariat Applications' : (committeeTab || (isMun ? 'ZEN DIPLOMACY MUN' : (formSlug ? `ZEN_${formSlug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}` : 'ZEN_FORMS'))));
    const sheetTab = targetTab;

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
      action: 'add_row',
      tab: targetTab,
      targetTab,
      sheetTab,
      formId,
      formTitle: body.formTitle || formSlug || formId,
      submissionId: subId,
      ticketId: rawData.ticketId || `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      submitterHandle: submitterHandle || 'anonymous',
      googleUserEmail: googleUserEmail || '',
      customSheetUrl: customSheetUrl || '',
      // Delegate Aliases
      fullName: rawData.step1_fullname || rawData.step2_fullname || rawData.fullName || rawData.name || '',
      email: rawData.step1_email || rawData.step2_email || rawData.email || '',
      phoneNumber: rawData.step1_phone || rawData.step2_phone || rawData.phoneNumber || rawData.phone || '',
      institution: rawData.step1_institution || rawData.step2_institution || rawData.institution || '',
      city: rawData.step1_city || rawData.step2_city || rawData.step2_city_country || rawData.city || '',
      track: rawData.step2_track || rawData.track || '',
      experienceLevel: rawData.step2_experience_level || rawData.experienceLevel || '',
      firstCommitteeChoice: rawData.step3_primary_committee || rawData.firstCommitteeChoice || '',
      secondCommitteeChoice: rawData.step4_secondary_committee || rawData.secondCommitteeChoice || '',
      portfolioPreferences: rawData.step5_portfolios || rawData.portfolioPreferences || '',
      priorAccolades: rawData.step6_prior_accolades || rawData.priorAccolades || '',
      resolutionExperience: rawData.step7_resolution_experience || rawData.resolutionExperience || '',
      researchLink: rawData.step8_research_paper_link || rawData.researchLink || '',
      accreditationPlacard: rawData.step9_accreditation_dossier || rawData.accreditationPlacard || '',
      motivation: rawData.step10_motivation_statement || rawData.motivation || '',
      accommodation: rawData.step11_accommodation_assistance || rawData.accommodation || 'NO',
      emergencyContact: rawData.step12_emergency_contact || rawData.emergencyContact || '',
      dietaryPreference: rawData.step13_dietary_pref || rawData.dietaryPreference || 'Vegetarian',
      participationTier: rawData.step15_participation_tier || rawData.participationTier || rawData.passTier || 'Delegate Pass (₹499)',
      utr: rawData.step15_payment_reference || rawData.utr || '',
      paymentScreenshot: rawData.step15_receipt_link || rawData.step15_payment_screenshot || rawData.paymentScreenshot || '',
      // Secretariat Aliases
      preferredSector: rawData.step1_primary_sector || rawData.step1_preferred_department || rawData.preferredSector || '',
      secondarySector: rawData.step1_secondary_sector || rawData.step1_secondary_department || rawData.secondarySector || '',
      priorMunExperience: rawData.step3_prior_muns_count || rawData.priorMunExperience || '',
      numberOfMunsAttended: rawData.step3_prior_muns_count || rawData.numberOfMunsAttended || '',
      priorOrganizingExperience: rawData.step3_organizing_experience || rawData.priorOrganizingExperience || '',
      weeklyBandwidth: rawData.step3_weekly_bandwidth || rawData.weeklyBandwidth || '',
      availabilityOct2425: rawData.step4_availability_oct2425 || rawData.availabilityOct2425 || 'YES',
      statementOfPurpose: rawData.step3_sop || rawData.statementOfPurpose || '',
      practicalTaskResponse: rawData.step3_practical_response || rawData.practicalTaskResponse || '',
      portfolioUrl: rawData.step3_portfolio_url || rawData.portfolioUrl || '',
      discordHandle: rawData.step4_discord_handle || rawData.discordHandle || '',
      sovereignAccordAccepted: rawData.step4_accord_agreement || rawData.sovereignAccordAccepted || 'CONFIRMED',
      ...rawData,
    };

    // 2. Always persist to backup ledger immediately
    appendToLocalLedger(ledgerEntry);

    // 3. Forward to Google Sheets webhook
    const targetWebhook = body.webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbwMJVccvxnhbk13ppFVu44gpA9cZ95nR1oojq-c4P1r6YWK45hKp0f3Tydk4RJO6v0Q/exec';
    if (targetWebhook && typeof targetWebhook === 'string' && targetWebhook.startsWith('http')) {
      try {
        await fetch(targetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ledgerEntry),
        });
      } catch (webhookErr: any) {
        console.warn('[SHEETS-ZENFORMS-WEBHOOK-WARN]', webhookErr?.message);
      }
    }

    return NextResponse.json({ success: true, submissionId: subId, submission: structuredSub });
  } catch (err: any) {
    console.error('[ZEN-FORMS-SUBMIT-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
