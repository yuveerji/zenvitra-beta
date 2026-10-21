import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySession, requireAuth } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const feed = searchParams.get('feed') || 'for_you';
    const author = searchParams.get('author');
    const topic = searchParams.get('topic');
    const communityId = searchParams.get('communityId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (author) {
      where.authorUsername = author.toLowerCase().replace(/^@/, '');
    }

    if (communityId) {
      where.communityId = communityId;
    }

    if (topic) {
      where.OR = [
        { topic: { contains: topic } },
        { tagsJson: { contains: topic } },
        { content: { contains: topic } }
      ];
    }

    // ── Anti-IDOR Private Feeds (Server-Verified Session Only) ──
    if (feed === 'saved' || feed === 'following') {
      const session = await verifySession();
      if (!session.isAuth || !session.userId) {
        return NextResponse.json({ error: 'Authentication required to view private feed.' }, { status: 401 });
      }

      if (feed === 'saved') {
        const bookmarks = await db.pulseBookmark.findMany({
          where: { userId: session.userId },
          select: { postId: true },
          orderBy: { createdAt: 'desc' },
        });
        const bookmarkedIds = bookmarks.map((b) => b.postId);
        if (bookmarkedIds.length === 0) {
          return NextResponse.json({ success: true, posts: [], total: 0 });
        }
        where.id = { in: bookmarkedIds };
      } else if (feed === 'following') {
        const followingList = await db.pulseFollow.findMany({
          where: { followerId: session.userId },
          select: { followingId: true },
        });
        const followingIds = followingList.map((f) => f.followingId);
        if (followingIds.length === 0) {
          return NextResponse.json({ success: true, posts: [], total: 0, notice: 'No following accounts yet' });
        }
        where.authorId = { in: followingIds };
      }
    }

    // Order by strategy
    let orderBy: any = { publishedAt: 'desc' };
    if (feed === 'trending') {
      orderBy = [
        { likesCount: 'desc' },
        { commentsCount: 'desc' },
        { publishedAt: 'desc' },
      ];
    }

    const [posts, total] = await Promise.all([
      db.pulsePostRecord.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      db.pulsePostRecord.count({ where }),
    ]);

    // Parse JSON fields
    const parsedPosts = posts.map((p) => ({
      ...p,
      mediaUrls: p.mediaUrlsJson ? JSON.parse(p.mediaUrlsJson) : [],
      tags: p.tagsJson ? JSON.parse(p.tagsJson) : [],
      citations: p.citationsJson ? JSON.parse(p.citationsJson) : [],
      pollData: p.pollDataJson ? JSON.parse(p.pollDataJson) : null,
    }));

    return NextResponse.json({
      success: true,
      posts: parsedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching pulse posts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // ── Cryptographic Server-Side Authentication (Zero Client Trust) ──
    const session = await requireAuth();

    const body = await request.json();
    const {
      postType = 'STANDARD',
      title,
      content,
      coverImage,
      mediaUrls = [],
      mediaType,
      topic,
      tags = [],
      communityId,
      communityName,
      audience = 'PUBLIC',
      citations = [],
      pollData,
    } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Post content cannot be empty' },
        { status: 400 }
      );
    }

    // Author attributes are bound STRICTLY from cryptographic session
    const verifiedAuthorId = session.userId;
    const verifiedUsername = session.username || 'delegate';
    const verifiedRole = session.role || 'DELEGATE';

    const wordCount = content.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

    // Create canonical post record bound to verified session
    const post = await db.pulsePostRecord.create({
      data: {
        authorId: verifiedAuthorId,
        authorUsername: verifiedUsername,
        authorName: verifiedUsername,
        authorAvatar: null,
        authorRole: verifiedRole,
        postType,
        title: title?.trim() || null,
        content: content.trim(),
        coverImage: coverImage || null,
        mediaUrlsJson: mediaUrls.length > 0 ? JSON.stringify(mediaUrls) : null,
        mediaType: mediaType || null,
        topic: topic || null,
        tagsJson: tags.length > 0 ? JSON.stringify(tags) : null,
        communityId: communityId || null,
        communityName: communityName || null,
        audience,
        status: 'PUBLISHED',
        readingTimeMinutes,
        citationsJson: citations.length > 0 ? JSON.stringify(citations) : null,
        pollDataJson: pollData ? JSON.stringify(pollData) : null,
        canonicalUrl: `/pulse/post/${Date.now()}`,
      },
    });

    // Increment profile post count
    await db.pulseProfile.upsert({
      where: { username: verifiedUsername },
      update: {
        postsCount: { increment: 1 },
      },
      create: {
        userId: verifiedAuthorId,
        username: verifiedUsername,
        displayName: verifiedUsername,
        avatarUrl: null,
        postsCount: 1,
      },
    });

    const parsedPost = {
      ...post,
      mediaUrls,
      tags,
      citations,
      pollData,
    };

    return NextResponse.json({
      success: true,
      post: parsedPost,
    });
  } catch (error: any) {
    if (error.message?.includes('UNAUTHORIZED')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid' }, { status: 401 });
    }
    console.error('Error creating pulse post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to publish post' },
      { status: 500 }
    );
  }
}
