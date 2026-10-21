export type MatrixRoomStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'DISCONNECTED';
export type MatrixConnectionMode = 'DIRECT' | 'SECRETARIAT_DISCRETION';

export interface MatrixAuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorUsername: string;
  actorRole: string;
  action: 
    | 'CREATE_ROOM'
    | 'REQUEST_DISCRETION'
    | 'APPROVE_ROOM'
    | 'REJECT_ROOM'
    | 'RECONFIGURE_ROOM'
    | 'JOIN_ROOM'
    | 'DISCONNECT_ROOM';
  details: string;
  metadata?: Record<string, any>;
}

export interface CommitteeMatrixRoom {
  id: string;
  munId: string;
  munName: string;
  edition: string;
  eventDate: string; // ISO date string YYYY-MM-DD
  committeeId: string;
  committeeName: string;
  committeeShort: string;
  committeeType: string;
  matrixRoomId: string; // e.g. "!unsc_20261019:matrix.zenvitra.xyz"
  matrixRoomAlias: string; // e.g. "#zen-unsc-20261019:zenvitra.xyz"
  serverName: string; // e.g. "matrix.zenvitra.xyz" or "matrix.org"
  status: MatrixRoomStatus;
  connectionMode: MatrixConnectionMode;
  discretionNotes?: string;
  discretionPendingReason?: string;
  requestedBy: {
    id: string;
    name: string;
    username: string;
    role: string;
    requestedAt: string;
  };
  approvedBy?: {
    id: string;
    name: string;
    username: string;
    role: string;
    approvedAt: string;
  };
  rejectedBy?: {
    id: string;
    name: string;
    username: string;
    role: string;
    rejectedAt: string;
    reason?: string;
  };
  authorizedRoles: string[]; // ['DELEGATE', 'EXECUTIVE_BOARD', 'SECRETARIAT', 'CHAIR', 'ORGANIZER']
  allowedUserIds?: string[];
  conversationId: string; // linked ZEN.CHAT conversation ID
  memberCount: number;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
  auditLog: MatrixAuditLogEntry[];
}

export interface CreateMatrixRoomPayload {
  munId: string;
  munName: string;
  edition?: string;
  eventDate: string;
  committeeId: string;
  committeeName: string;
  committeeShort: string;
  committeeType?: string;
  connectionMode: MatrixConnectionMode;
  discretionNotes?: string;
  serverName?: string;
  customAlias?: string;
  requester: {
    id: string;
    name: string;
    username: string;
    role: string;
  };
}

export interface UpdateMatrixRoomPayload {
  roomId: string;
  action: 'APPROVE' | 'REJECT' | 'RECONFIGURE' | 'DISCONNECT';
  actor: {
    id: string;
    name: string;
    username: string;
    role: string;
  };
  committeeId?: string;
  committeeName?: string;
  committeeShort?: string;
  eventDate?: string;
  matrixRoomAlias?: string;
  reason?: string;
  notes?: string;
}
