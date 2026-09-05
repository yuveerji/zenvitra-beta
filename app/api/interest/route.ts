import { NextRequest, NextResponse } from 'next/server';
import { dispatchToGoogleSheets } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, city, institution, instagram, interest_type, role } = body;

    if (!email) {
      return NextResponse.json(
        { status: 'error', message: 'Email address is required' },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser Client';

    // Dispatch to Google Sheets under 'Community Members' or 'Collab & Partnerships'
    await dispatchToGoogleSheets({
      tab: 'Community Members',
      data: {
        fullName: name || 'Anonymous Node',
        emailAddress: email,
        city: city || 'Global',
        institution: institution || 'Independent',
        socialHandle: instagram || 'N/A',
        interestCategory: interest_type || role || 'Delegate Community',
        ipAddress: ip,
        deviceBrowserInfo: userAgent,
        registeredAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Interest transmission successfully registered into Zenvitra Secretariat register.',
      data: { email, receivedAt: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('[API-INTEREST-ROUTE-ERROR]', error);
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to register interest' },
      { status: 500 }
    );
  }
}
