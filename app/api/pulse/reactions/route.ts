import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, userId, type = 'LIKE', action = 'toggle' } = body;

    if (!postId || !userId) {
      return NextResponse.json(
        { success: false, error: 'postId and userId are required' },
        { status: 400 }
      );
    }

    // Check existing reaction
    const existing = await db.pulseReaction.findUnique({
      where: {
        postId_userId_type: {
          postId,
          userId,
          type,
        },
      },
    });

    if (existing) {
      // Remove reaction (unlike)
      await db.pulseReaction.delete({
        where: { id: existing.id },
      });
      await db.pulsePostRecord.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        reacted: false,
        type,
      });
    } else {
      // Add reaction (like)
      await db.pulseReaction.create({
        data: {
          postId,
          userId,
          type,
        },
      });
      await db.pulsePostRecord.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        reacted: true,
        type,
      });
    }
  } catch (error: any) {
    console.error('Error in pulse reaction:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process reaction' },
      { status: 500 }
    );
  }
}
