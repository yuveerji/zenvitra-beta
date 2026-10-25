import { db } from '@/lib/db';

/**
 * Server-safe sovereign clearance matching without importing client modules
 */
function isServerFounderOrCoFounder(email?: string | null, role?: string | null): boolean {
  if (!email && !role) return false;
  const clean = (email || '').toLowerCase().trim().replace(/^@/, '');
  const cleanRole = (role || '').toUpperCase().trim();

  if (cleanRole === 'FOUNDER' || cleanRole === 'CO_FOUNDER' || cleanRole === 'COFOUNDER') {
    return true;
  }

  const isFounderMatch =
    clean === 'founder@zenvitra.xyz' ||
    clean === 'founder@zenvitra.org' ||
    clean === 'founder@zenvitra.com' ||
    clean === 'yuveer@zenvitra.xyz' ||
    clean === 'yuveer@zenvitra.org' ||
    clean === 'yuveer@zenvitra.com' ||
    clean === 'zen_founder_root';

  const isCoFounderMatch =
    clean === 'aarush@zenvitra.xyz' ||
    clean === 'aarush@zenvitra.com' ||
    clean === 'aarush@zenvitra.org' ||
    clean === 'zen_cofounder_aarush' ||
    clean === 'aarush-vijayivargiya-cofounder' ||
    clean === 'khushi@zenvitra.xyz' ||
    clean === 'khushi@zenvitra.org' ||
    clean === 'khushi@zenvitra.com' ||
    clean === 'zen_cofounder_khushi' ||
    clean === 'khushi-rb-cofounder' ||
    clean === 'cofounder-cto-partner' ||
    clean === 'cofounder-alliances';

  return isFounderMatch || isCoFounderMatch;
}

function isServerAdmin(email?: string | null, role?: string | null): boolean {
  const cleanRole = (role || '').toUpperCase().trim();
  if (cleanRole === 'ADMIN' || cleanRole === 'SUPER_ADMIN') return true;
  return isServerFounderOrCoFounder(email, role);
}

/**
 * ─── 1. CENTRALIZED PERMISSION REGISTRY ───
 */
export const CHAIR_PERMISSIONS = {
  ACCESS: 'chair_console.access',
  VIEW_COMMITTEE: 'chair_console.view_committee',
  MANAGE_SPEAKERS_LIST: 'chair_console.manage_speakers_list',
  MANAGE_MOTIONS: 'chair_console.manage_motions',
  CONTROL_SESSION: 'chair_console.control_session',
  CONTROL_TIMER: 'chair_console.control_timer',
  MANAGE_VOTING: 'chair_console.manage_voting',
  VIEW_DELEGATE_INFO: 'chair_console.view_delegate_information',
  MANAGE_DOCUMENTS: 'chair_console.manage_documents',
  SEND_ANNOUNCEMENTS: 'chair_console.send_announcements',
  MANAGE_COMMITTEE_SETTINGS: 'chair_console.manage_committee_settings',
  ROLES_ASSIGN: 'roles.assign',
  ROLES_REVOKE: 'roles.revoke',
  AUDIT_LOGS_VIEW: 'audit_logs.view',
} as const;

export type ChairPermissionKey = typeof CHAIR_PERMISSIONS[keyof typeof CHAIR_PERMISSIONS];

export type SystemMunRole =
  | 'SUPER_ADMIN'
  | 'SECRETARIAT_ADMIN'
  | 'CHAIR'
  | 'VICE_CHAIR'
  | 'DELEGATE'
  | 'PRESS'
  | 'OBSERVER';

/**
 * ─── 2. DEFAULT ROLE-TO-PERMISSION MATRIX ───
 */
export const ROLE_PERMISSIONS_MAP: Record<SystemMunRole, ChairPermissionKey[]> = {
  SUPER_ADMIN: Object.values(CHAIR_PERMISSIONS),
  SECRETARIAT_ADMIN: [
    CHAIR_PERMISSIONS.ACCESS,
    CHAIR_PERMISSIONS.VIEW_COMMITTEE,
    CHAIR_PERMISSIONS.MANAGE_SPEAKERS_LIST,
    CHAIR_PERMISSIONS.MANAGE_MOTIONS,
    CHAIR_PERMISSIONS.CONTROL_SESSION,
    CHAIR_PERMISSIONS.CONTROL_TIMER,
    CHAIR_PERMISSIONS.MANAGE_VOTING,
    CHAIR_PERMISSIONS.VIEW_DELEGATE_INFO,
    CHAIR_PERMISSIONS.MANAGE_DOCUMENTS,
    CHAIR_PERMISSIONS.SEND_ANNOUNCEMENTS,
    CHAIR_PERMISSIONS.MANAGE_COMMITTEE_SETTINGS,
    CHAIR_PERMISSIONS.ROLES_ASSIGN,
    CHAIR_PERMISSIONS.ROLES_REVOKE,
    CHAIR_PERMISSIONS.AUDIT_LOGS_VIEW,
  ],
  CHAIR: [
    CHAIR_PERMISSIONS.ACCESS,
    CHAIR_PERMISSIONS.VIEW_COMMITTEE,
    CHAIR_PERMISSIONS.MANAGE_SPEAKERS_LIST,
    CHAIR_PERMISSIONS.MANAGE_MOTIONS,
    CHAIR_PERMISSIONS.CONTROL_SESSION,
    CHAIR_PERMISSIONS.CONTROL_TIMER,
    CHAIR_PERMISSIONS.MANAGE_VOTING,
    CHAIR_PERMISSIONS.VIEW_DELEGATE_INFO,
    CHAIR_PERMISSIONS.MANAGE_DOCUMENTS,
    CHAIR_PERMISSIONS.SEND_ANNOUNCEMENTS,
    CHAIR_PERMISSIONS.MANAGE_COMMITTEE_SETTINGS,
  ],
  VICE_CHAIR: [
    CHAIR_PERMISSIONS.ACCESS,
    CHAIR_PERMISSIONS.VIEW_COMMITTEE,
    CHAIR_PERMISSIONS.MANAGE_SPEAKERS_LIST,
    CHAIR_PERMISSIONS.MANAGE_MOTIONS,
    CHAIR_PERMISSIONS.CONTROL_TIMER,
    CHAIR_PERMISSIONS.VIEW_DELEGATE_INFO,
  ],
  DELEGATE: [],
  PRESS: [],
  OBSERVER: [],
};

export interface EffectivePermissionResult {
  canAccessChairConsole: boolean;
  assignedRole: SystemMunRole | 'NONE';
  permissions: ChairPermissionKey[];
  isRevoked: boolean;
  reason?: string;
}

/**
 * ─── 3. AUTHORITATIVE SERVER-SIDE ACCESS CHECK ───
 * Validates whether a user can access the Chair Console for a specific committee / conference.
 */
export async function getEffectiveUserChairPermissions({
  userId,
  email,
  platformRole,
  committeeId,
  conferenceId,
}: {
  userId?: string | null;
  email?: string | null;
  platformRole?: string | null;
  committeeId?: string | null;
  conferenceId?: string | null;
}): Promise<EffectivePermissionResult> {
  // If not authenticated, instantly deny
  if (!userId && !email) {
    return {
      canAccessChairConsole: false,
      assignedRole: 'NONE',
      permissions: [],
      isRevoked: false,
      reason: 'User is not authenticated',
    };
  }

  // 1. Sovereign Founder / Co-Founder Clearance (Zenvitra Sovereign Law)
  if (isServerFounderOrCoFounder(email, platformRole)) {
    return {
      canAccessChairConsole: true,
      assignedRole: 'SUPER_ADMIN',
      permissions: Object.values(CHAIR_PERMISSIONS),
      isRevoked: false,
      reason: 'Sovereign Founder clearance',
    };
  }

  // 2. Global Platform Admin Clearance
  if (platformRole === 'ADMIN' || platformRole === 'SUPER_ADMIN' || isServerAdmin(email, platformRole)) {
    return {
      canAccessChairConsole: true,
      assignedRole: 'SUPER_ADMIN',
      permissions: Object.values(CHAIR_PERMISSIONS),
      isRevoked: false,
      reason: 'Platform administrator clearance',
    };
  }

  if (!userId) {
    return {
      canAccessChairConsole: false,
      assignedRole: 'NONE',
      permissions: [],
      isRevoked: false,
      reason: 'Missing user identifier for committee role check',
    };
  }

  try {
    const now = new Date();

    // 3. Check Explicit Committee or Conference Role Assignments in database
    const assignments = await db.munRoleAssignment.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        OR: [
          { committeeId: committeeId || undefined },
          { conferenceId: conferenceId || undefined },
          { committeeId: null, conferenceId: null }, // Universal MUN role
        ],
      },
      orderBy: { assignedAt: 'desc' },
    });

    // Filter out expired assignments
    const activeAssignments = assignments.filter((a) => !a.expiresAt || a.expiresAt > now);

    // If an assignment was revoked
    const revoked = assignments.find((a) => a.status === 'REVOKED');
    if (revoked && activeAssignments.length === 0) {
      return {
        canAccessChairConsole: false,
        assignedRole: 'NONE',
        permissions: [],
        isRevoked: true,
        reason: 'Chair assignment has been explicitly revoked',
      };
    }

    // Check for Chair / Vice Chair / Secretariat Admin assignments
    const chairRole = activeAssignments.find((a) =>
      ['SUPER_ADMIN', 'SECRETARIAT_ADMIN', 'CHAIR', 'VICE_CHAIR'].includes(a.role)
    );

    if (chairRole) {
      const roleKey = chairRole.role as SystemMunRole;
      let basePermissions = ROLE_PERMISSIONS_MAP[roleKey] ? [...ROLE_PERMISSIONS_MAP[roleKey]] : [];

      // Check for custom permission overrides in MunCustomPermission
      const customPerms = await db.munCustomPermission.findMany({
        where: {
          userId,
          OR: [
            { committeeId: committeeId || undefined },
            { conferenceId: conferenceId || undefined },
          ],
        },
      });

      customPerms.forEach((cp) => {
        const permKey = cp.permission as ChairPermissionKey;
        if (cp.isGranted && !basePermissions.includes(permKey)) {
          basePermissions.push(permKey);
        } else if (!cp.isGranted) {
          basePermissions = basePermissions.filter((p) => p !== permKey);
        }
      });

      const canAccess = basePermissions.includes(CHAIR_PERMISSIONS.ACCESS);

      return {
        canAccessChairConsole: canAccess,
        assignedRole: roleKey,
        permissions: basePermissions,
        isRevoked: false,
        reason: `Authorized via active ${roleKey} assignment`,
      };
    }

    // 4. Also check MunMembership as fallback for backward compatibility
    if (conferenceId) {
      const membership = await db.munMembership.findUnique({
        where: {
          conferenceId_userId: {
            conferenceId,
            userId,
          },
        },
      });

      if (
        membership &&
        membership.status === 'ACTIVE' &&
        ['CHAIR', 'VICE_CHAIR', 'SEC_GEN', 'SUPER_ADMIN'].includes(membership.role)
      ) {
        const roleKey = (membership.role === 'SEC_GEN' ? 'SECRETARIAT_ADMIN' : membership.role) as SystemMunRole;
        return {
          canAccessChairConsole: true,
          assignedRole: roleKey,
          permissions: ROLE_PERMISSIONS_MAP[roleKey] || [CHAIR_PERMISSIONS.ACCESS],
          isRevoked: false,
          reason: `Authorized via conference membership role: ${membership.role}`,
        };
      }
    }

    // Deny access by default
    return {
      canAccessChairConsole: false,
      assignedRole: 'DELEGATE',
      permissions: [],
      isRevoked: false,
      reason: 'No active Chair or Secretariat role assignment found for this committee',
    };
  } catch (err) {
    console.error('Error checking user chair permissions:', err);
    return {
      canAccessChairConsole: false,
      assignedRole: 'NONE',
      permissions: [],
      isRevoked: false,
      reason: 'Internal error resolving permissions',
    };
  }
}

/**
 * ─── 4. LOG AUTHORIZATION AUDIT EVENT ───
 */
export async function logAuthAuditEvent({
  actorUserId,
  targetUserId,
  action,
  role,
  permission,
  committeeId,
  conferenceId,
  reason,
}: {
  actorUserId: string;
  targetUserId: string;
  action: 'ROLE_ASSIGNED' | 'ROLE_REVOKED' | 'PERMISSION_GRANTED' | 'PERMISSION_REVOKED' | 'ACCESS_DENIED' | 'CHAIR_SWITCH_ACCESSED';
  role?: string;
  permission?: string;
  committeeId?: string;
  conferenceId?: string;
  reason?: string;
}) {
  try {
    await db.munAuthAuditLog.create({
      data: {
        actorUserId,
        targetUserId,
        action,
        role,
        permission,
        committeeId,
        conferenceId,
        reason,
      },
    });
  } catch (e) {
    console.warn('Failed to record auth audit log:', e);
  }
}
