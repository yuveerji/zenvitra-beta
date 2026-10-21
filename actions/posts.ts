'use server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/session';
import { assertResourceOwnership } from '@/lib/dal';
import { revalidatePath } from 'next/cache';

export interface CreatePostInput {
  content: string;
  title?: string;
  topic?: string;
  tags?: string[];
  postType?: 'STANDARD' | 'DISPATCH' | 'WIRE' | 'RESEARCH';
}

/**
 * Server Action: Create Post
 * Demonstrates strict server-side identity derivation.
 * Does NOT accept authorId or role from client parameters.
 */
export async function createPostAction(input: CreatePostInput) {
  // 1. Enforce verified cryptographic session
  const session = await requireAuth();

  if (!input.content || !input.content.trim()) {
    return { success: false, error: 'Content cannot be empty.' };
  }

  try {
    const post = await db.pulsePostRecord.create({
      data: {
        authorId: session.userId,
        authorUsername: session.username || 'delegate',
        authorName: session.username || 'delegate',
        authorRole: session.role || 'DELEGATE',
        postType: input.postType || 'STANDARD',
        title: input.title?.trim() || null,
        content: input.content.trim(),
        topic: input.topic || null,
        tagsJson: input.tags && input.tags.length > 0 ? JSON.stringify(input.tags) : null,
        status: 'PUBLISHED',
        readingTimeMinutes: Math.max(1, Math.ceil(input.content.trim().split(/\s+/).length / 180)),
        canonicalUrl: `/pulse/post/${Date.now()}`,
      },
    });

    revalidatePath('/pulse');
    return { success: true, post };
  } catch (error: any) {
    console.error('[CREATE POST ACTION ERROR]', error);
    return { success: false, error: 'Failed to create post.' };
  }
}

/**
 * Server Action: Delete Post
 * Demonstrates strict IDOR ownership enforcement:
 * Queries the database for the post, verifies that authorId === session.userId,
 * and rejects any unauthorized deletion attempts.
 */
export async function deletePostAction(postId: string) {
  const session = await requireAuth();

  if (!postId) {
    return { success: false, error: 'Post ID is required.' };
  }

  try {
    const post = await db.pulsePostRecord.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!post) {
      return { success: false, error: 'Post not found.' };
    }

    // 2. Strict IDOR Defense: Assert ownership or Founder clearance
    await assertResourceOwnership(post.authorId);

    // 3. Delete record
    await db.pulsePostRecord.delete({
      where: { id: postId },
    });

    revalidatePath('/pulse');
    return { success: true, message: 'Post successfully deleted.' };
  } catch (error: any) {
    console.error('[DELETE POST ACTION ERROR]', error);
    return { success: false, error: error.message || 'Failed to delete post.' };
  }
}
