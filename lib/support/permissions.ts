export type SupportPermission =
  | "support:read:own"
  | "support:create"
  | "support:reply:own"
  | "support:read:assigned"
  | "support:read:all"
  | "support:reply:all"
  | "support:assign"
  | "support:manage"
  | "support:read:sensitive";

const rolePermissions: Record<string, SupportPermission[]> = {
  FOUNDER: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:all",
    "support:reply:all",
    "support:assign",
    "support:manage",
    "support:read:sensitive",
  ],
  CO_FOUNDER: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:all",
    "support:reply:all",
    "support:assign",
    "support:manage",
    "support:read:sensitive",
  ],
  ADMIN: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:all",
    "support:reply:all",
    "support:assign",
    "support:manage",
    "support:read:sensitive",
  ],
  CORE_TEAM: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:all",
    "support:reply:all",
    "support:assign",
    "support:manage",
  ],
  SUPPORT_LEAD: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:all",
    "support:reply:all",
    "support:assign",
    "support:manage",
  ],
  SUPPORT_AGENT: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:assigned",
    "support:reply:all",
  ],
  STAFF: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:assigned",
    "support:reply:all",
  ],
  SECRETARIAT: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:assigned",
    "support:reply:all",
  ],
  CHAIR: [
    "support:read:own",
    "support:create",
    "support:reply:own",
    "support:read:assigned",
    "support:reply:all",
  ],
  DELEGATE: [
    "support:read:own",
    "support:create",
    "support:reply:own",
  ],
  USER: [
    "support:read:own",
    "support:create",
    "support:reply:own",
  ],
};

export function hasPermission(
  role: string | undefined | null,
  permission: SupportPermission
): boolean {
  if (!role) return false;
  const upperRole = role.toUpperCase().trim();
  return rolePermissions[upperRole]?.includes(permission) ?? false;
}
