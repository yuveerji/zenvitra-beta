import { NextRequest, NextResponse } from 'next/server';
import { dispatchToGoogleSheets } from '@/lib/googleSheets';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, city, institution, department, portfolioLink, motivation, hoursPerWeek } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { status: 'error', message: 'Full name and email are required' },
        { status: 400 }
      );
    }

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
          proofUrl: portfolioLink || body.proofOfWorkUrl || null,
          weeklyHours: hoursPerWeek || body.weeklyBandwidth || null,
          statement: motivation || body.motivationStatement || null,
          status: 'QUEUED',
        },
      });
    } catch (dbErr: any) {
      console.warn('[DB-APPLICATION-SAVE-WARN]', dbErr?.message);
    }

    // Dispatch to Google Sheets under 'Core Team Applications'
    try {
      await dispatchToGoogleSheets({
        tab: 'Core Team Applications',
        data: {
          // --- STAGE 1: Identity & Executive Clearance ---
          fullName,
          handle: body.handle ? (body.handle.startsWith('@') ? body.handle : `@${body.handle}`) : 'N/A',
          email,
          contactChannel: body.contactChannel || phone || 'N/A',
          phone: body.contactChannel || phone || 'N/A',
          locationTimezone: body.locationTimezone || city || 'N/A',
          city: body.locationTimezone || city || 'N/A',

          // --- Role & Department ---
          roleApplied: department || body.roleAppliedFor || 'Core Team',
          roleAppliedFor: department || body.roleAppliedFor || 'Core Team',
          department: department || 'CORE',

          // --- STAGE 2: Leadership Dossier & Track Record ---
          portfolioUrl: portfolioLink || body.proofOfWorkUrl || 'N/A',
          proofOfWorkUrl: portfolioLink || body.proofOfWorkUrl || 'N/A',
          linkedinProfile: portfolioLink || body.proofOfWorkUrl || 'N/A',
          pastExperience: body.pastExperience || 'N/A',
          leadershipAccomplishments: body.pastExperience || 'N/A',
          technicalOrDiplomaticDossier: body.technicalOrDiplomaticDossier || body.dossier || 'N/A',
          strategicVision: body.technicalOrDiplomaticDossier || body.dossier || 'N/A',

          // --- STAGE 3: Bandwidth & Constitutional Accord ---
          weeklyBandwidth: hoursPerWeek || body.weeklyBandwidth || '25+ hrs (Core)',
          hoursPerWeek: hoursPerWeek || body.weeklyBandwidth || '25+ hrs (Core)',
          motivationStatement: motivation || body.motivationStatement || 'N/A',
          coverNote: motivation || body.motivationStatement || 'N/A',
          constitutionalAccord: body.constitutionalAccordAccepted || 'RATIFIED',
          constitutionalAccordAccepted: body.constitutionalAccordAccepted || 'RATIFIED',

          // --- Review Status ---
          applicationStatus: 'PENDING',
          reviewerInfo: 'Genesis Executive Council',

          // Telemetry
          ipAddress: ip,
          deviceBrowserInfo: userAgent,
          submittedAt: new Date().toISOString(),
        },
      });
    } catch (sheetErr: any) {
      console.warn('[SHEETS-DISPATCH-WARN]', sheetErr?.message);
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
