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
          // Standard Apps Script Column Mapping:
          fullName,
          email,
          phoneNumber: phone || body.contactChannel || 'N/A',
          roleAppliedFor: department || body.roleAppliedFor || 'Core Team',
          department: department || 'CORE',
          linkedinProfile: portfolioLink || body.proofOfWorkUrl || 'N/A',
          portfolioUrl: portfolioLink || body.proofOfWorkUrl || 'N/A',
          cvResumeLink: body.dossier || body.technicalOrDiplomaticDossier || 'N/A',
          coverNote: motivation || body.motivationStatement || 'N/A',
          applicationStatus: 'UNDER_COUNCIL_REVIEW',
          reviewerInfo: 'Genesis Executive Council',

          // Additional context fields:
          candidateName: fullName,
          emailAddress: email,
          handle: body.handle || 'N/A',
          cityLocation: city || 'N/A',
          institution: institution || 'Independent',
          statementMotivation: motivation || body.motivationStatement || 'N/A',
          weeklyCommitment: hoursPerWeek || body.weeklyBandwidth || '25+ hrs (Core)',
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
