import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // ── Cryptographic Server-Side Authentication (Anti-IDOR) ──
    const session = await requireAuth();
    const verifiedUserId = session.userId;

    const body = await request.json();
    const { postId, type = 'LIKE' } = body;

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'postId is required' },
        { status: 400 }
      );
    }

    // Check existing reaction for this authenticated user
    const existing = await db.pulseReaction.findUnique({
      where: {
        postId_userId_type: {
          postId,
          userId: verifiedUserId,
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
          userId: verifiedUserId,
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
    if (error.message?.includes('UNAUTHORIZED')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid' }, { status: 401 });
    }
    console.error('Error in pulse reaction:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update reaction' },
      { status: 500 }
    );
  }
}
