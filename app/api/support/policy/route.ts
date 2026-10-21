import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let policy = await db.supportPolicy.findUnique({
      where: { id: 'GLOBAL_SUPPORT_POLICY' }
    });

    if (!policy) {
      policy = await db.supportPolicy.create({
        data: {
          id: 'GLOBAL_SUPPORT_POLICY',
          p1SlaHours: 2,
          p2SlaHours: 8,
          p3SlaHours: 24,
          p4SlaHours: 72,
          autoCloseDays: 5,
          maintenanceNotice: null,
          activeIncidents: JSON.stringify([])
        }
      });
    }

    return NextResponse.json({ success: true, policy });
  } catch (error: any) {
    console.error('[SUPPORT_POLICY_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch support policy' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      p1SlaHours,
      p2SlaHours,
      p3SlaHours,
      p4SlaHours,
      autoCloseDays,
      maintenanceNotice,
      activeIncidents
    } = body;

    const updated = await db.supportPolicy.upsert({
      where: { id: 'GLOBAL_SUPPORT_POLICY' },
      update: {
        ...(p1SlaHours !== undefined ? { p1SlaHours: Number(p1SlaHours) } : {}),
        ...(p2SlaHours !== undefined ? { p2SlaHours: Number(p2SlaHours) } : {}),
        ...(p3SlaHours !== undefined ? { p3SlaHours: Number(p3SlaHours) } : {}),
        ...(p4SlaHours !== undefined ? { p4SlaHours: Number(p4SlaHours) } : {}),
        ...(autoCloseDays !== undefined ? { autoCloseDays: Number(autoCloseDays) } : {}),
        ...(maintenanceNotice !== undefined ? { maintenanceNotice } : {}),
        ...(activeIncidents !== undefined ? { activeIncidents: JSON.stringify(activeIncidents) } : {})
      },
      create: {
        id: 'GLOBAL_SUPPORT_POLICY',
        p1SlaHours: p1SlaHours ? Number(p1SlaHours) : 2,
        p2SlaHours: p2SlaHours ? Number(p2SlaHours) : 8,
        p3SlaHours: p3SlaHours ? Number(p3SlaHours) : 24,
        p4SlaHours: p4SlaHours ? Number(p4SlaHours) : 72,
        autoCloseDays: autoCloseDays ? Number(autoCloseDays) : 5,
        maintenanceNotice: maintenanceNotice || null,
        activeIncidents: JSON.stringify(activeIncidents || [])
      }
    });

    return NextResponse.json({ success: true, policy: updated });
  } catch (error: any) {
    console.error('[SUPPORT_POLICY_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update support policy' }, { status: 500 });
  }
}
