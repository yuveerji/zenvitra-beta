import fs from 'fs';
import path from 'path';
import { 
  CommitteeMatrixRoom, 
  CreateMatrixRoomPayload, 
  UpdateMatrixRoomPayload, 
  MatrixAuditLogEntry, 
  MatrixRoomStatus 
} from '@/types/matrixChat';

const DEFAULT_SERVER_NAME = 'matrix.zenvitra.xyz';

function getDataFilePath(): string {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'matrix_committee_rooms.json');
}

/**
 * Reads all stored Matrix committee room mappings.
 */
export function readMatrixRooms(): CommitteeMatrixRoom[] {
  try {
    const file = getDataFilePath();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[MATRIX-ROOMS-READ-WARN]', err);
  }
  return [];
}

/**
 * Saves all Matrix committee room mappings atomically.
 */
export function writeMatrixRooms(rooms: CommitteeMatrixRoom[]): void {
  try {
    const file = getDataFilePath();
    fs.writeFileSync(file, JSON.stringify(rooms, null, 2), 'utf-8');
  } catch (err) {
    console.error('[MATRIX-ROOMS-WRITE-ERROR]', err);
    throw new Error('Failed to persist Matrix rooms');
  }
}

/**
 * Sanitize strings into valid Matrix alias identifiers
 */
export function sanitizeMatrixSegment(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generates canonical Matrix Room ID and Alias
 */
export function generateMatrixIdentifiers(
  munId: string, 
  committeeShort: string, 
  eventDate: string,
  serverName: string = DEFAULT_SERVER_NAME
) {
  const cleanMun = sanitizeMatrixSegment(munId) || 'mun';
  const cleanComm = sanitizeMatrixSegment(committeeShort) || 'chamber';
  const cleanDate = eventDate.replace(/[^0-9]/g, '').slice(0, 8) || 'current';

  const alias = `#zen-${cleanMun}-${cleanComm}-${cleanDate}:${serverName.replace(/^matrix\./, '')}`;
  const roomId = `!${cleanMun}_${cleanComm}_${cleanDate}:${serverName}`;
  const conversationId = `matrix-conv-${cleanMun}-${cleanComm}-${cleanDate}`;

  return { alias, roomId, conversationId };
}

/**
 * Checks whether an actor has Secretariat, Founder, or Admin clearance.
 */
export function isActorSecretariat(actorRole?: string, actorRoles?: string[]): boolean {
  const roles = [
    ...(actorRole ? [actorRole.toUpperCase()] : []),
    ...(actorRoles ? actorRoles.map(r => r.toUpperCase()) : [])
  ];

  const secRoles = [
    'SECRETARIAT',
    'SECRETARY_GENERAL',
    'DIRECTOR_GENERAL',
    'USG',
    'ORGANISER',
    'ORGANIZER',
    'ADMIN',
    'FOUNDER',
    'CHAIR',
    'EXECUTIVE_BOARD'
  ];

  return roles.some(r => secRoles.includes(r));
}

/**
 * Find existing room matching MUN, Committee, and Event Date
 */
export function findMatchingRoom(
  rooms: CommitteeMatrixRoom[],
  munId: string,
  committeeId: string,
  eventDate: string
): CommitteeMatrixRoom | undefined {
  const normDate = eventDate.slice(0, 10);
  return rooms.find(r => 
    r.munId.toLowerCase() === munId.toLowerCase() &&
    (r.committeeId.toLowerCase() === committeeId.toLowerCase() || r.committeeShort.toLowerCase() === committeeId.toLowerCase()) &&
    r.eventDate.slice(0, 10) === normDate &&
    r.status !== 'DISCONNECTED'
  );
}

/**
 * Creates or submits a new Committee Matrix room
 */
export function createCommitteeMatrixRoom(payload: CreateMatrixRoomPayload): {
  success: boolean;
  room?: CommitteeMatrixRoom;
  error?: string;
  isDuplicate?: boolean;
} {
  const {
    munId,
    munName,
    edition = 'Current Edition',
    eventDate,
    committeeId,
    committeeName,
    committeeShort,
    committeeType = 'PARLIAMENTARY',
    connectionMode,
    discretionNotes,
    serverName = DEFAULT_SERVER_NAME,
    customAlias,
    requester
  } = payload;

  if (!munId || !committeeId || !eventDate) {
    return { success: false, error: 'MUN, Committee, and Event Date are strictly required' };
  }

  const rooms = readMatrixRooms();

  // Duplicate Check: Prevent duplicate rooms for the same MUN, Committee, and Date
  const existing = findMatchingRoom(rooms, munId, committeeId, eventDate);
  if (existing) {
    return { 
      success: false, 
      error: `A Matrix room already exists for ${committeeShort} on ${eventDate} (${existing.matrixRoomAlias}).`,
      isDuplicate: true,
      room: existing
    };
  }

  const { alias: defaultAlias, roomId, conversationId } = generateMatrixIdentifiers(
    munId, 
    committeeShort, 
    eventDate, 
    serverName
  );

  const finalAlias = customAlias ? (customAlias.startsWith('#') ? customAlias : `#${customAlias}`) : defaultAlias;
  const now = new Date().toISOString();
  const roomInternalId = `mat_room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const isSecretariat = isActorSecretariat(requester.role);
  const isDirect = connectionMode === 'DIRECT';
  
  // Direct connection instantly activates; Secretariat Discretion places in PENDING_APPROVAL unless requester is already Secretariat
  const initialStatus: MatrixRoomStatus = isDirect ? 'ACTIVE' : (isSecretariat ? 'ACTIVE' : 'PENDING_APPROVAL');

  const auditEntry: MatrixAuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    actorId: requester.id,
    actorName: requester.name,
    actorUsername: requester.username,
    actorRole: requester.role,
    action: isDirect ? 'CREATE_ROOM' : 'REQUEST_DISCRETION',
    details: isDirect
      ? `Connected official Matrix room ${finalAlias} for ${committeeName} (${eventDate}) via Direct Connect.`
      : `Submitted Secretariat Discretion request for ${committeeName} on ${eventDate}. Notes: "${discretionNotes || 'None specified'}"`,
    metadata: {
      munId,
      committeeId,
      eventDate,
      connectionMode
    }
  };

  const newRoom: CommitteeMatrixRoom = {
    id: roomInternalId,
    munId,
    munName,
    edition,
    eventDate,
    committeeId,
    committeeName,
    committeeShort: committeeShort.toUpperCase(),
    committeeType,
    matrixRoomId: roomId,
    matrixRoomAlias: finalAlias,
    serverName,
    status: initialStatus,
    connectionMode,
    discretionNotes: discretionNotes || undefined,
    requestedBy: {
      id: requester.id,
      name: requester.name,
      username: requester.username,
      role: requester.role,
      requestedAt: now
    },
    approvedBy: isDirect || isSecretariat ? {
      id: requester.id,
      name: requester.name,
      username: requester.username,
      role: requester.role,
      approvedAt: now
    } : undefined,
    authorizedRoles: ['DELEGATE', 'EXECUTIVE_BOARD', 'SECRETARIAT', 'CHAIR', 'ORGANIZER'],
    conversationId,
    memberCount: 1,
    createdAt: now,
    updatedAt: now,
    auditLog: [auditEntry]
  };

  rooms.push(newRoom);
  writeMatrixRooms(rooms);

  return { success: true, room: newRoom };
}

/**
 * Updates or decides a Committee Matrix room (Secretariat Approval / Rejection / Reconfiguration)
 */
export function updateCommitteeMatrixRoom(payload: UpdateMatrixRoomPayload): {
  success: boolean;
  room?: CommitteeMatrixRoom;
  error?: string;
} {
  const { roomId, action, actor, committeeId, committeeName, committeeShort, eventDate, matrixRoomAlias, reason, notes } = payload;
  const rooms = readMatrixRooms();
  const index = rooms.findIndex(r => r.id === roomId);

  if (index === -1) {
    return { success: false, error: 'Matrix room not found' };
  }

  const current = rooms[index];
  const now = new Date().toISOString();

  // Secretariat Authorization Guard
  if (!isActorSecretariat(actor.role)) {
    return { success: false, error: 'Only authorized Secretariat members and Administrators can configure or approve Matrix rooms.' };
  }

  let auditAction: MatrixAuditLogEntry['action'] = 'RECONFIGURE_ROOM';
  let details = '';

  if (action === 'APPROVE') {
    current.status = 'ACTIVE';
    current.approvedBy = {
      id: actor.id,
      name: actor.name,
      username: actor.username,
      role: actor.role,
      approvedAt: now
    };
    current.rejectedBy = undefined;
    auditAction = 'APPROVE_ROOM';
    details = `Secretariat approved Matrix connection for ${current.committeeName} on ${current.eventDate}. Notes: ${notes || 'Approved'}`;
  } else if (action === 'REJECT') {
    current.status = 'REJECTED';
    current.rejectedBy = {
      id: actor.id,
      name: actor.name,
      username: actor.username,
      role: actor.role,
      rejectedAt: now,
      reason: reason || 'Not approved by Secretariat'
    };
    auditAction = 'REJECT_ROOM';
    details = `Secretariat rejected Matrix connection for ${current.committeeName}. Reason: ${reason || 'Denied'}`;
  } else if (action === 'RECONFIGURE') {
    if (committeeId) current.committeeId = committeeId;
    if (committeeName) current.committeeName = committeeName;
    if (committeeShort) current.committeeShort = committeeShort.toUpperCase();
    if (eventDate) current.eventDate = eventDate;
    if (matrixRoomAlias) current.matrixRoomAlias = matrixRoomAlias;
    if (notes) current.discretionNotes = notes;
    auditAction = 'RECONFIGURE_ROOM';
    details = `Secretariat reconfigured room: Committee=${current.committeeShort}, Date=${current.eventDate}, Alias=${current.matrixRoomAlias}`;
  } else if (action === 'DISCONNECT') {
    current.status = 'DISCONNECTED';
    auditAction = 'DISCONNECT_ROOM';
    details = `Matrix room was disconnected by ${actor.name} (${actor.role}).`;
  }

  current.updatedAt = now;

  const auditEntry: MatrixAuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    actorId: actor.id,
    actorName: actor.name,
    actorUsername: actor.username,
    actorRole: actor.role,
    action: auditAction,
    details,
    metadata: { action, reason, notes }
  };

  current.auditLog.unshift(auditEntry);
  rooms[index] = current;
  writeMatrixRooms(rooms);

  return { success: true, room: current };
}
