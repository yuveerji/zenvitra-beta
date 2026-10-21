import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getOrCreateWorkbook, getWorkbookStatus } from '@/lib/sheets/syncEngine';
import { generateAppsScriptCode } from '@/lib/sheets/appsScriptGenerator';
import { WorkbookTemplateKey } from '@/lib/sheets/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    // Auto-create or get existing workbook
    await getOrCreateWorkbook({ eventId });
    const status = await getWorkbookStatus(eventId);

    if (!status || !status.workbook) {
      return NextResponse.json({ success: false, error: 'Could not load workbook status' }, { status: 404 });
    }

    const host = req.headers.get('host') || 'zenvitra.org';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const webhookEndpoint = `${protocol}://${host}/api/events/sheets/inbound`;

    const appsScriptCode = generateAppsScriptCode({
      eventId,
      webhookEndpoint,
      webhookSecret: status.workbook.webhookSecret || 'zs_default_secret',
    });

    return NextResponse.json({
      success: true,
      workbook: status.workbook,
      unresolvedConflictsCount: status.unresolvedConflictsCount,
      pendingJobsCount: status.pendingJobsCount,
      healthScore: status.healthScore,
      recentAudits: status.recentAudits,
      webhookEndpoint,
      appsScriptCode,
    });
  } catch (err: any) {
    console.error('[SHEETS-CONFIG-GET-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, accountEmail, templateKey, action, status } = body;

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const workbook = await getOrCreateWorkbook({
      eventId,
      templateKey: templateKey as WorkbookTemplateKey,
      accountEmail,
    });

    if (!workbook) {
      return NextResponse.json({ success: false, error: 'Could not create or locate workbook' }, { status: 404 });
    }

    if (action === 'PAUSE_SYNC') {
      await prisma.spreadsheetWorkbook.update({
        where: { id: workbook.id },
        data: { status: 'PAUSED' },
      });
      await prisma.auditSyncEvent.create({
        data: {
          eventId,
          workbookId: workbook.id,
          action: 'SYNC_PAUSED',
          details: 'Organiser paused active synchronization',
        },
      });
    } else if (action === 'RESUME_SYNC') {
      await prisma.spreadsheetWorkbook.update({
        where: { id: workbook.id },
        data: { status: 'SYNCED' },
      });
      await prisma.auditSyncEvent.create({
        data: {
          eventId,
          workbookId: workbook.id,
          action: 'SYNC_RESUMED',
          details: 'Organiser resumed active synchronization',
        },
      });
    } else if (templateKey) {
      await prisma.spreadsheetWorkbook.update({
        where: { id: workbook.id },
        data: { templateKey },
      });
    }

    const updated = await getWorkbookStatus(eventId);
    return NextResponse.json({ success: true, workbook: updated?.workbook });
  } catch (err: any) {
    console.error('[SHEETS-CONFIG-POST-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to update workbook config' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const workbook = await prisma.spreadsheetWorkbook.findUnique({ where: { eventId } });
    if (workbook) {
      await prisma.spreadsheetWorkbook.update({
        where: { id: workbook.id },
        data: { status: 'DISCONNECTED' },
      });

      await prisma.auditSyncEvent.create({
        data: {
          eventId,
          workbookId: workbook.id,
          action: 'PERMISSION_REVOKED',
          details: 'Organiser disconnected Google Sheets integration',
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Google Sheets integration disconnected successfully.' });
  } catch (err: any) {
    console.error('[SHEETS-CONFIG-DELETE-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to disconnect integration' }, { status: 500 });
  }
}
