import { NextRequest, NextResponse } from 'next/server';
import { isGoogleOAuthConfigured } from '@/lib/sheets/googleOAuthManager';
import { getActiveIntegration } from '@/lib/sheets/sheetsConnectionManager';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId') || undefined;

    const isConfigured = isGoogleOAuthConfigured();
    const activeIntegration = getActiveIntegration(eventId);

    return NextResponse.json({
      success: true,
      isConfigured,
      activeIntegration: activeIntegration || null,
      isGoogleConnected: Boolean(
        activeIntegration &&
          (activeIntegration.name.includes('Google') || activeIntegration.sheetUrl.includes('google.com'))
      ),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to check OAuth status' },
      { status: 500 }
    );
  }
}
