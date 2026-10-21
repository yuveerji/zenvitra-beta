import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    const where: any = {};
    if (category) where.category = category;

    const communities = await db.pulseCommunity.findMany({
      where,
      orderBy: { membersCount: 'desc' },
      take: 30,
    });

    let myMemberships: string[] = [];
    if (userId) {
      const joined = await db.pulseCommunityMember.findMany({
        where: { userId, status: 'ACTIVE' },
        select: { communityId: true },
      });
      myMemberships = joined.map((j) => j.communityId);
    }

    return NextResponse.json({
      success: true,
      communities,
      myMemberships,
    });
  } catch (error: any) {
    console.error('Error fetching pulse communities:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      ownerId,
      ownerUsername,
      category = 'GENERAL',
      type = 'PUBLIC',
      avatarUrl,
      bannerUrl,
      rules = [],
      linkedEventId,
    } = body;

    if (!name?.trim() || !ownerId) {
      return NextResponse.json(
        { success: false, error: 'Name and ownerId are required' },
        { status: 400 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const community = await db.pulseCommunity.create({
      data: {
        slug,
        name: name.trim(),
        description: description?.trim() || '',
        category,
        type,
        ownerId,
        ownerUsername: ownerUsername || null,
        avatarUrl: avatarUrl || null,
        bannerUrl: bannerUrl || null,
        rulesJson: rules.length > 0 ? JSON.stringify(rules) : null,
        linkedEventId: linkedEventId || null,
        membersCount: 1,
      },
    });

    // Add owner as active OWNER member
    await db.pulseCommunityMember.create({
      data: {
        communityId: community.id,
        userId: ownerId,
        role: 'OWNER',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      community,
    });
  } catch (error: any) {
    console.error('Error creating pulse community:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create community' },
      { status: 500 }
    );
  }
}
