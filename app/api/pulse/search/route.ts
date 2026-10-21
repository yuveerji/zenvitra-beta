import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();
    const type = searchParams.get('type') || 'all'; // all, people, posts, communities, credentials
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    if (!query) {
      return NextResponse.json({
        success: true,
        results: {
          people: [],
          posts: [],
          communities: [],
          credentials: [],
        },
      });
    }

    const results: any = {
      people: [],
      posts: [],
      communities: [],
      credentials: [],
    };

    // 1. Search People / Profiles
    if (type === 'all' || type === 'people') {
      const people = await db.pulseProfile.findMany({
        where: {
          OR: [
            { username: { contains: query } },
            { displayName: { contains: query } },
            { bio: { contains: query } },
            { organisationName: { contains: query } },
          ],
        },
        take: limit,
      });
      results.people = people;
    }

    // 2. Search Posts
    if (type === 'all' || type === 'posts') {
      const posts = await db.pulsePostRecord.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { content: { contains: query } },
            { title: { contains: query } },
            { topic: { contains: query } },
            { tagsJson: { contains: query } },
          ],
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });
      results.posts = posts.map((p) => ({
        ...p,
        mediaUrls: p.mediaUrlsJson ? JSON.parse(p.mediaUrlsJson) : [],
        tags: p.tagsJson ? JSON.parse(p.tagsJson) : [],
      }));
    }

    // 3. Search Communities (ZEN.CIRCLES)
    if (type === 'all' || type === 'communities') {
      const communities = await db.pulseCommunity.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { slug: { contains: query } },
          ],
        },
        take: limit,
      });
      results.communities = communities;
    }

    // 4. Search Credentials (ZEN.PASSPORT)
    if (type === 'all' || type === 'credentials') {
      const credentials = await db.pulseCredential.findMany({
        where: {
          isPublicOnPassport: true,
          verificationStatus: 'VERIFIED',
          OR: [
            { title: { contains: query } },
            { issuerName: { contains: query } },
            { credentialId: { contains: query } },
            { userUsername: { contains: query } },
          ],
        },
        take: limit,
      });
      results.credentials = credentials;
    }

    return NextResponse.json({
      success: true,
      query,
      results,
    });
  } catch (error: any) {
    console.error('Error in pulse search:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Search execution failed' },
      { status: 500 }
    );
  }
}
