import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { followerId, followingId, followingUsername, followerUsername } = body;

    if (!followerId || (!followingId && !followingUsername)) {
      return NextResponse.json(
        { success: false, error: 'followerId and target are required' },
        { status: 400 }
      );
    }

    let targetId = followingId;
    let targetUsername = followingUsername;

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

    if (followerId === targetId) {
      return NextResponse.json(
        { success: false, error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    const existing = await db.pulseFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetId,
        },
      },
    });

    if (existing) {
      // Unfollow
      await db.pulseFollow.delete({
        where: { id: existing.id },
      });

      // Update counters
      await Promise.all([
        db.pulseProfile.updateMany({
          where: { userId: followerId },
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
          followerId,
          followingId: targetId,
        },
      });

      // Update counters
      await Promise.all([
        db.pulseProfile.updateMany({
          where: { userId: followerId },
          data: { followingCount: { increment: 1 } },
        }).catch(() => {}),
        db.pulseProfile.updateMany({
          where: { userId: targetId },
          data: { followersCount: { increment: 1 } },
        }).catch(() => {}),
      ]);

      // Create notification
      await db.pulseNotification.create({
        data: {
          recipientId: targetId,
          actorId: followerId,
          actorUsername: followerUsername || null,
          type: 'FOLLOW',
          message: `@${followerUsername || 'delegate'} started following your sovereign profile`,
          linkUrl: `/pulse?user=${followerUsername}`,
        },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        isFollowing: true,
      });
    }
  } catch (error: any) {
    console.error('Error in pulse follow:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update follow relationship' },
      { status: 500 }
    );
  }
}
