import { NextRequest, NextResponse } from 'next/server';
import { 
  readMatrixRooms, 
  createCommitteeMatrixRoom, 
  isActorSecretariat 
} from '@/lib/matrixChatService';
import { CreateMatrixRoomPayload } from '@/types/matrixChat';

export const dynamic = 'force-dynamic';

/**
 * GET /api/matrix/rooms
 * Query params: munId, committeeId, eventDate, status, userRole, userId
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const munId = searchParams.get('munId');
    const committeeId = searchParams.get('committeeId');
    const eventDate = searchParams.get('eventDate');
    const status = searchParams.get('status');
    const userRole = searchParams.get('userRole') || 'DELEGATE';
    const userId = searchParams.get('userId');

    const isSecretariat = isActorSecretariat(userRole);
    let rooms = readMatrixRooms();

    // Exclude disconnected rooms unless explicitly requested
    if (status) {
      rooms = rooms.filter(r => r.status === status);
    } else {
      rooms = rooms.filter(r => r.status !== 'DISCONNECTED');
    }

    if (munId) {
      rooms = rooms.filter(r => r.munId.toLowerCase() === munId.toLowerCase());
    }

    if (committeeId) {
      rooms = rooms.filter(r => 
        r.committeeId.toLowerCase() === committeeId.toLowerCase() ||
        r.committeeShort.toLowerCase() === committeeId.toLowerCase()
      );
    }

    if (eventDate) {
      const normDate = eventDate.slice(0, 10);
      rooms = rooms.filter(r => r.eventDate.slice(0, 10) === normDate);
    }

    // Access control filtering:
    // Non-Secretariat users can only view:
    // 1. ACTIVE or APPROVED rooms
    // 2. Or their own PENDING requests
    if (!isSecretariat) {
      rooms = rooms.filter(r => 
        r.status === 'ACTIVE' || 
        r.status === 'APPROVED' ||
        (userId && r.requestedBy?.id === userId)
      );
    }

    const pendingCount = rooms.filter(r => r.status === 'PENDING_APPROVAL').length;

    return NextResponse.json({
      success: true,
      count: rooms.length,
      pendingCount,
      rooms
    });
  } catch (error: any) {
    console.error('[API-MATRIX-ROOMS-GET-ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Matrix rooms' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/matrix/rooms
 * Body: CreateMatrixRoomPayload
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CreateMatrixRoomPayload;

    if (!body.munId || !body.committeeId || !body.eventDate) {
      return NextResponse.json(
        { success: false, error: 'munId, committeeId, and eventDate are required' },
        { status: 400 }
      );
    }

    if (!body.requester || !body.requester.id || !body.requester.name) {
      return NextResponse.json(
        { success: false, error: 'Requester identity credentials are required' },
        { status: 400 }
      );
    }

    const result = createCommitteeMatrixRoom(body);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error, 
          isDuplicate: result.isDuplicate, 
          room: result.room 
        },
        { status: result.isDuplicate ? 409 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      room: result.room,
      message: result.room?.status === 'ACTIVE' 
        ? 'Matrix room successfully connected and mapped.' 
        : 'Submitted for Secretariat Discretion review.'
    });
  } catch (error: any) {
    console.error('[API-MATRIX-ROOMS-POST-ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create Matrix room' },
      { status: 500 }
    );
  }
}
