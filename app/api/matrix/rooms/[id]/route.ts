import { NextRequest, NextResponse } from 'next/server';
import { 
  readMatrixRooms, 
  updateCommitteeMatrixRoom, 
  isActorSecretariat 
} from '@/lib/matrixChatService';
import { UpdateMatrixRoomPayload } from '@/types/matrixChat';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * GET /api/matrix/rooms/[id]
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    const rooms = readMatrixRooms();
    const room = rooms.find(r => r.id === id);

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, room });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/matrix/rooms/[id]
 * Approves, Rejects, Reconfigures or Disconnects a Matrix committee room
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await req.json();

    const actor = body.actor;
    if (!actor || !actor.role) {
      return NextResponse.json(
        { success: false, error: 'Actor credentials with role are required' },
        { status: 400 }
      );
    }

    if (!isActorSecretariat(actor.role, actor.roles)) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Only Secretariat or Conference Administrators have discretion authority.' },
        { status: 403 }
      );
    }

    const payload: UpdateMatrixRoomPayload = {
      roomId: id,
      action: body.action,
      actor,
      committeeId: body.committeeId,
      committeeName: body.committeeName,
      committeeShort: body.committeeShort,
      eventDate: body.eventDate,
      matrixRoomAlias: body.matrixRoomAlias,
      reason: body.reason,
      notes: body.notes
    };

    const result = updateCommitteeMatrixRoom(payload);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      room: result.room,
      message: `Matrix room successfully updated with action: ${body.action}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update Matrix room' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/matrix/rooms/[id]
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    const actor = {
      id: req.headers.get('x-user-id') || 'unknown',
      name: req.headers.get('x-user-name') || 'Administrator',
      username: req.headers.get('x-user-handle') || 'admin',
      role: req.headers.get('x-user-role') || 'SECRETARIAT'
    };

    const result = updateCommitteeMatrixRoom({
      roomId: id,
      action: 'DISCONNECT',
      actor
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Matrix room disconnected' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
