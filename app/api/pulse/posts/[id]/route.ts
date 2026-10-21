import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.pulsePostRecord.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    db.pulsePostRecord.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    // Fetch comments for this canonical post
    const comments = await db.pulseComment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'asc' },
    });

    const parsedPost = {
      ...post,
      mediaUrls: post.mediaUrlsJson ? JSON.parse(post.mediaUrlsJson) : [],
      tags: post.tagsJson ? JSON.parse(post.tagsJson) : [],
      citations: post.citationsJson ? JSON.parse(post.citationsJson) : [],
      pollData: post.pollDataJson ? JSON.parse(post.pollDataJson) : null,
      comments,
    };

    return NextResponse.json({
      success: true,
      post: parsedPost,
    });
  } catch (error: any) {
    console.error('Error fetching pulse post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, title, isPinned, status, citations, pollData } = body;

    const data: any = {};
    if (content !== undefined) data.content = content.trim();
    if (title !== undefined) data.title = title.trim();
    if (isPinned !== undefined) data.isPinned = Boolean(isPinned);
    if (status !== undefined) data.status = status;
    if (citations !== undefined) data.citationsJson = JSON.stringify(citations);
    if (pollData !== undefined) data.pollDataJson = JSON.stringify(pollData);

    const updated = await db.pulsePostRecord.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      post: updated,
    });
  } catch (error: any) {
    console.error('Error updating pulse post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await db.pulsePostRecord.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Cascade delete associated comments, reactions, bookmarks
    await Promise.all([
      db.pulseComment.deleteMany({ where: { postId: id } }),
      db.pulseReaction.deleteMany({ where: { postId: id } }),
      db.pulseBookmark.deleteMany({ where: { postId: id } }),
      db.pulsePostRecord.delete({ where: { id } }),
    ]);

    // Decrement author's postsCount
    await db.pulseProfile.updateMany({
      where: { username: post.authorUsername },
      data: { postsCount: { decrement: 1 } },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Post permanently deleted',
    });
  } catch (error: any) {
    console.error('Error deleting pulse post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
