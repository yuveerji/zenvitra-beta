import { auth } from '@/lib/auth';

export type AppRole = "OWNER" | "EVENT_ADMIN" | "CAPACITY_MANAGER" | "STAFF" | "DELEGATE";
export type Actor = { id: string; role: AppRole };

export async function requireActor(): Promise<Actor> {
  try {
    const session = await auth();
    if (session?.user) {
      const userRole = (session.user.role || '').toUpperCase();
      const mappedRole: AppRole =
        userRole === 'FOUNDER' || userRole === 'ADMIN' ? 'OWNER' :
        userRole === 'ORGANIZER' ? 'EVENT_ADMIN' : 'STAFF';

      return {
        id: session.user.id || 'usr_session',
        role: mappedRole,
      };
    }
  } catch (_) {}

  // Local development / testing mode fallback
  if (process.env.NODE_ENV !== 'production') {
    return {
      id: 'local_dev_admin',
      role: 'EVENT_ADMIN',
    };
  }

  throw new Error("Authentication required. Please sign in to manage capacity.");
}

export function canManageCapacity(role: AppRole) {
  return role === "OWNER" || role === "EVENT_ADMIN" || role === "CAPACITY_MANAGER";
}
