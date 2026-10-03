import { NextRequest, NextResponse } from 'next/server';
import { getAllServerPassports } from '@/lib/passportsStorage';
import { 
  calculateZenPoints, 
  getRecognitionPillar, 
  LeaderboardCategory, 
  LeaderboardPeriod, 
  LeaderboardEntry,
  InstitutionEntry,
  TeamEntry
} from '@/lib/leaderboard';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = (searchParams.get('category') || 'global') as LeaderboardCategory;
    const period = (searchParams.get('period') || 'season') as LeaderboardPeriod;

    const allPassports = getAllServerPassports();

    // Compute leaderboard entries strictly from verified passports
    const rawEntries: LeaderboardEntry[] = allPassports.map((passport) => {
      const points = calculateZenPoints(passport, category);
      return {
        rank: 0,
        passportId: passport.passportId,
        username: passport.username,
        fullName: passport.fullName,
        avatarUrl: passport.avatarUrl,
        points,
        recentGain: Math.min(points, 75),
        primaryPillar: getRecognitionPillar(points, 1),
        institution: passport.education?.institution,
        badges: passport.badges.filter((b) => b.isUnlocked).map((b) => `${b.icon} ${b.name}`),
        verifiedActivitiesCount: passport.timeline.filter((m) => m.isVerified).length,
      };
    });

    // Sort descending by points, secondary by verified activities
    rawEntries.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.verifiedActivitiesCount - a.verifiedActivitiesCount;
    });

    // Assign rank and update recognition pillar based on real rank
    const entries = rawEntries.map((e, idx) => {
      const rank = idx + 1;
      return {
        ...e,
        rank,
        primaryPillar: getRecognitionPillar(e.points, rank)
      };
    });

    // Compute institution standings
    const institutionMap = new Map<string, { points: number; count: number }>();
    allPassports.forEach((p) => {
      const inst = p.education?.institution;
      if (inst && inst.trim()) {
        const key = inst.trim();
        const current = institutionMap.get(key) || { points: 0, count: 0 };
        const pts = calculateZenPoints(p, category);
        institutionMap.set(key, {
          points: current.points + pts,
          count: current.count + 1
        });
      }
    });

    const institutions: InstitutionEntry[] = Array.from(institutionMap.entries())
      .map(([name, data], idx) => ({
        rank: idx + 1,
        name,
        points: data.points,
        verifiedStudentCount: data.count
      }))
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    // Compute teams standings
    const teams: TeamEntry[] = [];

    return NextResponse.json({
      success: true,
      category,
      period,
      count: entries.length,
      entries,
      institutions,
      teams
    });
  } catch (err: any) {
    console.error('[API-LEADERBOARD-GET-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
