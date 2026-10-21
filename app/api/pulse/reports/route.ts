import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reporterId, reporterName, reportedEntity, reportedId, reason, details } = body;

    if (!reporterId || !reportedEntity || !reportedId || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required report fields' },
        { status: 400 }
      );
    }

    const report = await db.pulseReport.create({
      data: {
        reporterId,
        reporterName: reporterName || 'Anonymous Citizen',
        reportedEntity: (reportedEntity || 'POST').toUpperCase(),
        reportedId,
        reason,
        details: details || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error('Error in POST /api/pulse/reports:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const reports = await db.pulseReport.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, reports });
  } catch (err: any) {
    console.error('Error in GET /api/pulse/reports:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
