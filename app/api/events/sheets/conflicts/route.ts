import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { resolveConflict } from '@/lib/sheets/syncEngine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const conflicts = await prisma.syncConflict.findMany({
      where: {
        workbook: { eventId },
        status: 'UNRESOLVED',
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, conflicts });
  } catch (err: any) {
    console.error('[SHEETS-CONFLICTS-GET-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch conflicts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conflictId, resolution, mergedValue, resolvedBy } = body;

    if (!conflictId || !resolution) {
      return NextResponse.json(
        { success: false, error: 'Conflict ID and resolution type are required' },
        { status: 400 }
      );
    }

    const result = await resolveConflict({
      conflictId,
      resolution,
      mergedValue,
      resolvedBy,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[SHEETS-CONFLICTS-POST-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to resolve conflict' }, { status: 500 });
  }
}
