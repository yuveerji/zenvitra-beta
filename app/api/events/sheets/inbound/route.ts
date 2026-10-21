import { NextRequest, NextResponse } from 'next/server';
import { processInboundEdit } from '@/lib/sheets/syncEngine';
import { InboundEditPayload } from '@/lib/sheets/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const secretHeader = req.headers.get('x-zenvitra-secret') || body.webhookSecret;

    const payload: InboundEditPayload = {
      editUuid: body.editUuid || 'EDIT-' + Date.now().toString(36).toUpperCase(),
      eventId: body.eventId,
      webhookSecret: secretHeader,
      tabName: body.tabName,
      row: parseInt(String(body.row), 10) || 2,
      column: body.column || 'A',
      columnHeader: body.columnHeader || '',
      fieldKey: body.fieldKey || body.columnHeader || '',
      recordId: String(body.recordId || ''),
      oldValue: body.oldValue,
      newValue: body.newValue,
      userEmail: body.userEmail || 'google_sheets_user',
      timestamp: body.timestamp || new Date().toISOString(),
    };

    if (!payload.eventId || !payload.tabName || !payload.recordId) {
      return NextResponse.json(
        { success: false, error: 'Missing required edit parameters (eventId, tabName, recordId)' },
        { status: 400 }
      );
    }

    const result = await processInboundEdit(payload);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('[SHEETS-INBOUND-POST-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Inbound processing error' }, { status: 400 });
  }
}
