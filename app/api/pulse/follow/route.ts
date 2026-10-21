import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // ── Cryptographic Server-Side Authentication (Anti-IDOR) ──
    const session = await requireAuth();
    const verifiedFollowerId = session.userId;
    const verifiedFollowerUsername = session.username || 'delegate';

    const body = await request.json();
    const { followingId, followingUsername } = body;

    if (!followingId && !followingUsername) {
      return NextResponse.json(
        { success: false, error: 'Target followingId or followingUsername is required' },
        { status: 400 }
      );
    }

    let targetId = followingId;
    const targetUsername = followingUsername;

    if (!targetId && targetUsername) {
      const targetProfile = await db.pulseProfile.findUnique({
        where: { username: targetUsername.toLowerCase().replace(/^@/, '') },
      });
      if (targetProfile) {
        targetId = targetProfile.userId;
      } else {
        targetId = `user_${targetUsername}`;
      }
    }

    if (verifiedFollowerId === targetId) {
      return NextResponse.json(
        { success: false, error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    const existing = await db.pulseFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: verifiedFollowerId,
          followingId: targetId,
        },
      },
    });

    if (existing) {
      // Unfollow
      await db.pulseFollow.delete({
        where: { id: existing.id },
      });

      // Update counters safely
      await Promise.all([
        db.pulseProfile.updateMany({
          where: { userId: verifiedFollowerId },
          data: { followingCount: { decrement: 1 } },
        }).catch(() => {}),
        db.pulseProfile.updateMany({
          where: { userId: targetId },
          data: { followersCount: { decrement: 1 } },
        }).catch(() => {}),
      ]);

      return NextResponse.json({
        success: true,
        isFollowing: false,
      });
    } else {
      // Follow
      await db.pulseFollow.create({
        data: {
          followerId: verifiedFollowerId,
          followingId: targetId,
        },
      });

      // Update counters safely
      await Promise.all([
        db.pulseProfile.updateMany({
          where: { userId: verifiedFollowerId },
          data: { followingCount: { increment: 1 } },
        }).catch(() => {}),
        db.pulseProfile.updateMany({
          where: { userId: targetId },
          data: { followersCount: { increment: 1 } },
        }).catch(() => {}),
      ]);

      // Create notification for target
      await db.pulseNotification.create({
        data: {
          recipientId: targetId,
          actorId: verifiedFollowerId,
          actorUsername: verifiedFollowerUsername,
          type: 'FOLLOW',
          message: `@${verifiedFollowerUsername} started following your sovereign profile`,
          linkUrl: `/pulse?user=${verifiedFollowerUsername}`,
        },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        isFollowing: true,
      });
    }
  } catch (error: any) {
    if (error.message?.includes('UNAUTHORIZED')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid' }, { status: 401 });
    }
    console.error('Error in pulse follow:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update follow relationship' },
      { status: 500 }
    );
  }
}
