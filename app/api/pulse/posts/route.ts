import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const feed = searchParams.get('feed') || 'for_you';
    const author = searchParams.get('author');
    const topic = searchParams.get('topic');
    const communityId = searchParams.get('communityId');
    const userId = searchParams.get('userId');
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

    // Handle Feed views
    if (feed === 'saved' && userId) {
      const bookmarks = await db.pulseBookmark.findMany({
        where: { userId },
        select: { postId: true },
        orderBy: { createdAt: 'desc' },
      });
      const bookmarkedIds = bookmarks.map((b) => b.postId);
      if (bookmarkedIds.length === 0) {
        return NextResponse.json({ success: true, posts: [], total: 0 });
      }
      where.id = { in: bookmarkedIds };
    } else if (feed === 'following' && userId) {
      const followingList = await db.pulseFollow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = followingList.map((f) => f.followingId);
      if (followingIds.length === 0) {
        return NextResponse.json({ success: true, posts: [], total: 0, notice: 'No following accounts yet' });
      }
      where.authorId = { in: followingIds };
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
      limit,
    });
  } catch (error: any) {
    console.error('Error fetching pulse posts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch pulse posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      authorId,
      authorUsername,
      authorName,
      authorAvatar,
      authorRole = 'DELEGATE',
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

    if (!authorUsername || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Author and content are mandatory' },
        { status: 400 }
      );
    }

    const cleanUsername = authorUsername.toLowerCase().replace(/^@/, '').trim();
    const cleanAuthorId = authorId || `user_${cleanUsername}`;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

    // Create canonical post record
    const post = await db.pulsePostRecord.create({
      data: {
        authorId: cleanAuthorId,
        authorUsername: cleanUsername,
        authorName: authorName || cleanUsername,
        authorAvatar: authorAvatar || null,
        authorRole,
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

    // Ensure profile exists and increment post count
    await db.pulseProfile.upsert({
      where: { username: cleanUsername },
      update: {
        postsCount: { increment: 1 },
      },
      create: {
        userId: cleanAuthorId,
        username: cleanUsername,
        displayName: authorName || cleanUsername,
        avatarUrl: authorAvatar || null,
        postsCount: 1,
      },
    });

    // Parse back response
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
    console.error('Error creating pulse post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to publish post' },
      { status: 500 }
    );
  }
}
