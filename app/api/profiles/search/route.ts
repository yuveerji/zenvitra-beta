import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeHandle } from '@/lib/utils';
import { isFoundingMember, MASTER_BADGES } from '@/lib/badgeSystem';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = (searchParams.get('q') || '').trim();

    if (!rawQuery) {
      return NextResponse.json({ profiles: [] });
    }

    const cleanQuery = rawQuery.toLowerCase().replace(/^@/, '');

    // Search in SQLite db.user
    const users = await db.user.findMany({
      where: {
        OR: [
          { username: { contains: cleanQuery } },
          { handle: { contains: cleanQuery } },
          { name: { contains: cleanQuery } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        handle: true,
        role: true,
        roleBadge: true,
        bio: true,
        verified: true,
      },
      take: 12,
    }).catch(() => []);

    // Search in db.pulseProfile
    const pulseProfiles = await db.pulseProfile.findMany({
      where: {
        OR: [
          { username: { contains: cleanQuery } },
          { displayName: { contains: cleanQuery } },
        ],
      },
      select: {
        id: true,
        userId: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        profileType: true,
        isVerified: true,
        verifiedBadge: true,
      },
      take: 12,
    }).catch(() => []);

    // Merge and deduplicate by username
    const profileMap = new Map<string, any>();

    for (const u of users) {
      const uname = (u.username || u.handle || '').toLowerCase().replace(/^@/, '');
      if (!uname) continue;
      const isFounderHandle = uname === 'yuveer' || uname === 'founder';
      const badgeKey = isFounderHandle ? 'FOUNDER' : (isFoundingMember(uname) ? 'FOUNDING MEMBER' : (u.roleBadge || 'DELEGATE'));

      profileMap.set(uname, {
        id: u.id,
        username: uname,
        displayName: u.name || uname,
        avatarUrl: undefined,
        bio: u.bio,
        role: u.role || 'MEMBER',
        badge: badgeKey,
        isVerified: u.verified,
      });
    }

    for (const p of pulseProfiles) {
      const uname = (p.username || '').toLowerCase().replace(/^@/, '');
      if (!uname) continue;
      const isFounderHandle = uname === 'yuveer' || uname === 'founder';
      const badgeKey = isFounderHandle ? 'FOUNDER' : (isFoundingMember(uname) ? 'FOUNDING MEMBER' : (p.verifiedBadge || 'DELEGATE'));

      const existing = profileMap.get(uname);
      if (existing) {
        if (p.avatarUrl) existing.avatarUrl = p.avatarUrl;
        if (p.displayName) existing.displayName = p.displayName;
        if (p.bio && !existing.bio) existing.bio = p.bio;
        if (badgeKey) existing.badge = badgeKey;
      } else {
        profileMap.set(uname, {
          id: p.userId || p.id,
          username: uname,
          displayName: p.displayName || uname,
          avatarUrl: p.avatarUrl,
          bio: p.bio,
          role: p.profileType || 'MEMBER',
          badge: badgeKey,
          isVerified: p.isVerified,
        });
      }
    }

    return NextResponse.json({
      profiles: Array.from(profileMap.values()),
    });
  } catch (error: any) {
    console.error('[PROFILE SEARCH ERROR]', error);
    return NextResponse.json({ profiles: [], error: error.message }, { status: 500 });
  }
}
