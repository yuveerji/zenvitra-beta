import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllEnclaveInvites, 
  getEnclaveInviteById, 
  claimEnclaveInvite, 
  createEnclaveInvite, 
  revokeEnclaveInvite 
} from '@/lib/globalProtocolState';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const inviteId = searchParams.get('invite');

  if (inviteId) {
    const invite = getEnclaveInviteById(inviteId);
    if (!invite) {
      return NextResponse.json({ valid: false, error: 'Enclave link does not exist.' }, { status: 404 });
    }
    if (!invite.active) {
      return NextResponse.json({ valid: false, error: 'This access link has been revoked.' }, { status: 403 });
    }

    return NextResponse.json({
      valid: true,
      id: invite.id,
      adminName: invite.adminName,
      role: invite.role,
      singleUse: invite.singleUse,
      isClaimed: invite.isClaimed,
      createdAt: invite.createdAt,
    }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  // If fetching all invites (for Founder Dashboard)
  const allInvites = getAllEnclaveInvites();
  return NextResponse.json({ success: true, invites: allInvites }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'CLAIM';

    // 1. CREATE INVITE (Founder Action)
    if (action === 'CREATE') {
      const { adminName, passcode, role, singleUse } = body;
      if (!adminName || !passcode) {
        return NextResponse.json({ error: 'Missing admin name or secret passcode' }, { status: 400 });
      }

      const newInvite = createEnclaveInvite(adminName, passcode, role || 'ADMIN', singleUse !== false);
      return NextResponse.json({ success: true, invite: newInvite }, { status: 200 });
    }

    // 2. CLAIM INVITE (Admin Action)
    if (action === 'CLAIM') {
      const { inviteId, passcode, deviceId } = body;
      if (!inviteId || !passcode) {
        return NextResponse.json({ error: 'Missing access link token or authorization code.' }, { status: 400 });
      }

      const userAgent = req.headers.get('user-agent') || 'Browser Device';
      const cleanDeviceId = deviceId || `dev_${Math.random().toString(36).slice(2)}`;

      const result = claimEnclaveInvite(inviteId, passcode, cleanDeviceId, userAgent);

      if (!result.success) {
        return NextResponse.json({ error: result.error || 'Claim rejected' }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        message: 'Enclave clearance authorized successfully.',
        role: result.invite?.role || 'ADMIN',
        adminName: result.invite?.adminName || 'Staff Admin',
        inviteId: result.invite?.id,
        singleUse: result.invite?.singleUse,
      }, { status: 200 });
    }

    // 3. REVOKE INVITE
    if (action === 'REVOKE') {
      const { inviteId } = body;
      if (!inviteId) {
        return NextResponse.json({ error: 'Missing inviteId' }, { status: 400 });
      }
      const ok = revokeEnclaveInvite(inviteId);
      return NextResponse.json({ success: ok }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Enclave mutation failed' }, { status: 500 });
  }
}
