import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const cleanUsername = username.toLowerCase().replace(/^@/, '').trim();

    let profile = await db.pulseProfile.findUnique({
      where: { username: cleanUsername },
    });

    if (!profile) {
      // Check User table fallback
      const user = await db.user.findFirst({
        where: {
          OR: [
            { username: cleanUsername },
            { handle: cleanUsername },
          ],
        },
      });

      if (user) {
        profile = await db.pulseProfile.create({
          data: {
            userId: user.id,
            username: cleanUsername,
            displayName: user.name || cleanUsername,
            bio: user.bio || null,
            isVerified: user.verified || false,
            verifiedBadge: user.roleBadge || 'DELEGATE',
          },
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        );
      }
    }

    // Fetch user's published posts, credentials, and communities
    const [posts, credentials, communities] = await Promise.all([
      db.pulsePostRecord.findMany({
        where: { authorUsername: cleanUsername, status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 30,
      }),
      db.pulseCredential.findMany({
        where: { userUsername: cleanUsername, isPublicOnPassport: true },
        orderBy: { issuedAt: 'desc' },
      }),
      db.pulseCommunityMember.findMany({
        where: { userId: profile.userId },
        take: 10,
      }),
    ]);

    const parsedPosts = posts.map((p) => ({
      ...p,
      mediaUrls: p.mediaUrlsJson ? JSON.parse(p.mediaUrlsJson) : [],
      tags: p.tagsJson ? JSON.parse(p.tagsJson) : [],
      citations: p.citationsJson ? JSON.parse(p.citationsJson) : [],
      pollData: p.pollDataJson ? JSON.parse(p.pollDataJson) : null,
    }));

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        interests: profile.interestsJson ? JSON.parse(profile.interestsJson) : [],
      },
      posts: parsedPosts,
      credentials,
      communities,
    });
  } catch (error: any) {
    console.error('Error fetching pulse profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const cleanUsername = username.toLowerCase().replace(/^@/, '').trim();
    const body = await request.json();

    const {
      displayName,
      bio,
      website,
      location,
      interests,
      profileType,
      organisationName,
      bannerUrl,
      avatarUrl,
      privacySettings,
    } = body;

    const data: any = {};
    if (displayName !== undefined) data.displayName = displayName.trim();
    if (bio !== undefined) data.bio = bio.trim();
    if (website !== undefined) data.website = website.trim();
    if (location !== undefined) data.location = location.trim();
    if (interests !== undefined) data.interestsJson = JSON.stringify(interests);
    if (profileType !== undefined) data.profileType = profileType;
    if (organisationName !== undefined) data.organisationName = organisationName.trim();
    if (bannerUrl !== undefined) data.bannerUrl = bannerUrl;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
    if (privacySettings !== undefined) data.privacySettingsJson = JSON.stringify(privacySettings);

    const updated = await db.pulseProfile.upsert({
      where: { username: cleanUsername },
      update: data,
      create: {
        userId: `user_${cleanUsername}`,
        username: cleanUsername,
        displayName: displayName || cleanUsername,
        ...data,
      },
    });

    return NextResponse.json({
      success: true,
      profile: updated,
    });
  } catch (error: any) {
    console.error('Error updating pulse profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
