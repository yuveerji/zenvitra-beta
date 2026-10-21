import { NextRequest, NextResponse } from 'next/server';
import { dispatchToGoogleSheets } from '@/lib/googleSheets';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

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
    const fullName = body.fullName || body.name;
    const email = body.email;
    const { phone, phoneNumber, city, locationTimezone, institution, department, portfolioLink, motivation, hoursPerWeek } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { status: 'error', message: 'Full name and email are required' },
        { status: 400 }
      );
    }

    const resolvedPhone = phoneNumber || phone || body.contactPhone || 'N/A';
    const resolvedContactChannel = body.contactChannel || 'N/A';
    const resolvedLocation = locationTimezone || city || body.location || 'N/A';
    const resolvedPortfolio = body.portfolioUrl || portfolioLink || body.proofOfWorkUrl || 'N/A';
    const resolvedDossierDoc = body.dossierUploadUrl || body.uploadedDocumentUrl || (body.uploadedDocumentName ? `Uploaded File: ${body.uploadedDocumentName}` : 'N/A');

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser Client';

    // Save application to database first
    let savedApplication = null;
    try {
      savedApplication = await db.application.create({
        data: {
          fullName,
          email,
          handle: body.handle || null,
          roleRequested: department || body.roleAppliedFor || 'Core Team',
          proofUrl: resolvedPortfolio !== 'N/A' ? resolvedPortfolio : (resolvedDossierDoc !== 'N/A' ? resolvedDossierDoc : null),
          weeklyHours: hoursPerWeek || body.weeklyBandwidth || null,
          statement: motivation || body.motivationStatement || null,
          status: 'QUEUED',
        },
      });
    } catch (dbErr: any) {
      console.warn('[DB-APPLICATION-SAVE-WARN]', dbErr?.message);
    }

    // 1. Immediately persist to local zero-loss ledger
    appendToLocalLedger({
      targetTab: 'Core Team Applications',
      fullName,
      handle: body.handle || '',
      email,
      phoneNumber: resolvedPhone,
      department: department || body.roleAppliedFor || 'Core Team',
      roleAppliedFor: department || body.roleAppliedFor || 'Core Team',
      portfolioUrl: resolvedPortfolio,
      dossierUploadUrl: resolvedDossierDoc,
      hoursPerWeek: hoursPerWeek || body.weeklyBandwidth || '',
      motivation: motivation || body.motivationStatement || '',
      ipAddress: ip,
      timestamp: new Date().toISOString()
    });

    // 2. Prepare comprehensive detailed payload for Google Sheets
    const detailedCoreData = {
      // Clean, detailed Title Case headers matching Google Sheets
      'Timestamp': new Date().toISOString(),
      'Application ID': savedApplication?.id || `COR-${Date.now().toString(36).toUpperCase()}`,
      'Full Legal Name': fullName,
      'Desired ZEN Handle': body.handle ? (body.handle.startsWith('@') ? body.handle : `@${body.handle}`) : 'N/A',
      'Primary Email': email,
      'Phone [Whatsapp Active]': resolvedPhone,
      'Phone Number': resolvedPhone,
      'Telegram / Discord Handle': resolvedContactChannel,
      'Location & Timezone': resolvedLocation,
      'Role Applied For': department || body.roleAppliedFor || 'Core Team',
      'Department / Wing': department || body.roleAppliedFor || 'CORE',
      'Portfolio / Proof of Work URL': resolvedPortfolio,
      'Uploaded Dossier Document': resolvedDossierDoc,
      'Past Experience & Track Record': body.pastExperience || 'N/A',
      'Technical / Diplomatic Dossier': body.technicalOrDiplomaticDossier || body.dossier || 'N/A',
      'Weekly Bandwidth': hoursPerWeek || body.weeklyBandwidth || '25+ hrs (Core)',
      'Statement of Purpose & Motivation': motivation || body.motivationStatement || 'N/A',
      'Constitutional Accord Status': body.constitutionalAccordAccepted || 'RATIFIED',
      'Application Status': 'PENDING',
      'Reviewer': 'Genesis Executive Council',
      'Review Notes': 'Verified by Secretariat gateway',
      'IP Address': ip,
      'Device / Browser': userAgent,

      // Flexible camelCase and alias keys for existing sheets
      fullName,
      handle: body.handle || '',
      email,
      phone: resolvedPhone,
      phoneNumber: resolvedPhone,
      contactPhone: resolvedPhone,
      contactChannel: resolvedContactChannel,
      locationTimezone: resolvedLocation,
      city: resolvedLocation,
      roleApplied: department || body.roleAppliedFor || 'Core Team',
      roleAppliedFor: department || body.roleAppliedFor || 'Core Team',
      department: department || 'CORE',
      portfolioUrl: resolvedPortfolio,
      portfolioLink: resolvedPortfolio,
      proofOfWorkUrl: resolvedPortfolio,
      dossierUploadUrl: resolvedDossierDoc,
      uploadedDocumentName: body.uploadedDocumentName || 'N/A',
      pastExperience: body.pastExperience || 'N/A',
      leadershipAccomplishments: body.pastExperience || 'N/A',
      technicalOrDiplomaticDossier: body.technicalOrDiplomaticDossier || body.dossier || 'N/A',
      strategicVision: body.technicalOrDiplomaticDossier || body.dossier || 'N/A',
      weeklyBandwidth: hoursPerWeek || body.weeklyBandwidth || '25+ hrs (Core)',
      hoursPerWeek: hoursPerWeek || body.weeklyBandwidth || '25+ hrs (Core)',
      motivationStatement: motivation || body.motivationStatement || 'N/A',
      motivation: motivation || body.motivationStatement || 'N/A',
      whyLead: motivation || body.motivationStatement || 'N/A',
      constitutionalAccordAccepted: body.constitutionalAccordAccepted || 'RATIFIED',
      constitutionalAccord: body.constitutionalAccordAccepted || 'RATIFIED',
      applicationStatus: 'PENDING',
      status: 'PENDING',
      applicationId: savedApplication?.id || `COR-${Date.now().toString(36).toUpperCase()}`,
      ipAddress: ip,
      deviceBrowserInfo: userAgent,
      submittedAt: new Date().toISOString(),
    };

    // 2. Dispatch to Google Sheets under 'Core Team Applications'
    try {
      await dispatchToGoogleSheets({
        tab: 'Core Team Applications',
        data: detailedCoreData,
      });
    } catch (sheetErr: any) {
      console.warn('[SHEETS-DISPATCH-CORE-WARN]', sheetErr?.message);
    }

    // 3. Parallel fallback dispatch to '04 Team Applications'
    try {
      await dispatchToGoogleSheets({
        tab: '04 Team Applications',
        data: detailedCoreData,
      });
    } catch (sheetErr: any) {
      console.warn('[SHEETS-DISPATCH-04-WARN]', sheetErr?.message);
    }

    return NextResponse.json({
      status: 'success',
      message: 'Core team application dossier received and verified by Secretariat gateway.',
      data: { email, applicationId: savedApplication?.id, receivedAt: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('[API-CORE-TEAM-ROUTE-ERROR]', error);
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to submit core team application' },
      { status: 500 }
    );
  }
}
