import { NextRequest, NextResponse } from 'next/server';
import { performOutboundSync, runReconciliation } from '@/lib/sheets/syncEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, mode = 'OUTBOUND', actorEmail = 'organizer@zenvitra.org' } = body;

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    if (mode === 'RECONCILE') {
      const report = await runReconciliation(eventId, actorEmail);
      return NextResponse.json({
        success: true,
        mode: 'RECONCILE',
        report,
      });
    }

    // Default: Outbound live push
    const result = await performOutboundSync({ eventId, actorEmail });
    return NextResponse.json({
      success: true,
      mode: 'OUTBOUND',
      result,
    });
  } catch (err: any) {
    console.error('[SHEETS-SYNC-POST-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Synchronization failed' }, { status: 500 });
  }
}
