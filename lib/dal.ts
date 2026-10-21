import 'server-only';
import { cache } from 'react';
import { db } from '@/lib/db';
import { verifySession, requireAuth } from '@/lib/session';

/**
 * Data Access Layer (DAL): Secure user data access
 * Guarantees that sensitive profile queries are always bound to the verified cryptographic session.
 */
export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        verified: true,
        bio: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error('[DAL ERROR] Failed to fetch current user:', error);
    return null;
  }
});

/**
 * IDOR Prevention Gate:
 * Enforces that a resource can only be mutated or accessed if the authenticated
 * caller owns the resource or has global admin/founder clearance.
 */
export async function assertResourceOwnership(resourceOwnerId: string): Promise<void> {
  const session = await requireAuth();
  const isOwner = session.userId === resourceOwnerId;
  const isFounder = session.role === 'FOUNDER';

  if (!isOwner && !isFounder) {
    throw new Error('FORBIDDEN: You do not possess ownership authorization for this resource.');
  }
}
