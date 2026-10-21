import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let policy = await db.callPolicy.findUnique({
      where: { id: 'GLOBAL_CALL_POLICY' }
    });

    if (!policy) {
      policy = await db.callPolicy.create({
        data: {
          id: 'GLOBAL_CALL_POLICY',
          callsActive: true,
          maxParticipantsPerCall: 50,
          screenShareAllowed: true,
          recordingAllowed: true,
          p2pMeshLimit: 12,
          emergencyCallLockdown: false
        }
      });
    }

    return NextResponse.json({ success: true, policy });
  } catch (error: any) {
    console.error('[CALL_POLICY_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch call policy' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      callsActive,
      maxParticipantsPerCall,
      screenShareAllowed,
      recordingAllowed,
      p2pMeshLimit,
      emergencyCallLockdown
    } = body;

    const policy = await db.callPolicy.upsert({
      where: { id: 'GLOBAL_CALL_POLICY' },
      update: {
        ...(callsActive !== undefined ? { callsActive: !!callsActive } : {}),
        ...(maxParticipantsPerCall !== undefined ? { maxParticipantsPerCall: Number(maxParticipantsPerCall) } : {}),
        ...(screenShareAllowed !== undefined ? { screenShareAllowed: !!screenShareAllowed } : {}),
        ...(recordingAllowed !== undefined ? { recordingAllowed: !!recordingAllowed } : {}),
        ...(p2pMeshLimit !== undefined ? { p2pMeshLimit: Number(p2pMeshLimit) } : {}),
        ...(emergencyCallLockdown !== undefined ? { emergencyCallLockdown: !!emergencyCallLockdown } : {})
      },
      create: {
        id: 'GLOBAL_CALL_POLICY',
        callsActive: callsActive ?? true,
        maxParticipantsPerCall: maxParticipantsPerCall ? Number(maxParticipantsPerCall) : 50,
        screenShareAllowed: screenShareAllowed ?? true,
        recordingAllowed: recordingAllowed ?? true,
        p2pMeshLimit: p2pMeshLimit ? Number(p2pMeshLimit) : 12,
        emergencyCallLockdown: emergencyCallLockdown ?? false
      }
    });

    return NextResponse.json({ success: true, policy });
  } catch (error: any) {
    console.error('[CALL_POLICY_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update policy' }, { status: 500 });
  }
}
