import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;

    const reports = await db.callReportRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        session: true
      }
    });

    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    console.error('[CALL_REPORTS_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, reporterId, reporterName, reportedUserId, reason } = body;

    if (!sessionId || !reason) {
      return NextResponse.json({ success: false, error: 'Session ID and reason are required' }, { status: 400 });
    }

    const report = await db.callReportRecord.create({
      data: {
        sessionId,
        reporterId: reporterId || 'user',
        reporterName: reporterName || 'Anonymous',
        reportedUserId: reportedUserId || null,
        reason: reason.trim(),
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error: any) {
    console.error('[CALL_REPORTS_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to file report' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportId, status } = body;

    if (!reportId || !status) {
      return NextResponse.json({ success: false, error: 'Report ID and status are required' }, { status: 400 });
    }

    const report = await db.callReportRecord.update({
      where: { id: reportId },
      data: { status }
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('[CALL_REPORTS_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update report status' }, { status: 500 });
  }
}

