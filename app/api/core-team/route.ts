import { NextRequest, NextResponse } from 'next/server';
import { dispatchToGoogleSheets } from '@/lib/googleSheets';

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

    // Dispatch to Google Sheets under 'Core Team Applications'
    await dispatchToGoogleSheets({
      tab: 'Core Team Applications',
      data: {
        candidateName: fullName,
        emailAddress: email,
        phoneNumber: phone || 'N/A',
        cityLocation: city || 'N/A',
        institution: institution || 'Independent',
        departmentPreferred: department || 'General Secretariat',
        portfolioUrl: portfolioLink || 'N/A',
        statementMotivation: motivation || 'N/A',
        weeklyCommitment: hoursPerWeek || '10-15 hrs',
        ipAddress: ip,
        deviceBrowserInfo: userAgent,
        submittedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Core team application dossier received and verified by Secretariat gateway.',
      data: { email, receivedAt: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('[API-CORE-TEAM-ROUTE-ERROR]', error);
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to submit core team application' },
      { status: 500 }
    );
  }
}
