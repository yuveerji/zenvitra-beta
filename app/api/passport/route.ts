import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllServerPassports, 
  getServerPassportByUsername, 
  getServerPassportById, 
  saveServerPassport 
} from '@/lib/passportsStorage';
import { createDefaultPassport, ZenPassport } from '@/lib/passport';
import { sheetSync } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

/**
 * GET /api/passport
 * Query params: ?username=... OR ?id=...
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const id = searchParams.get('id');

    if (id) {
      const passport = getServerPassportById(id);
      if (passport) {
        return NextResponse.json({ success: true, passport });
      }
      return NextResponse.json({ success: false, error: 'Passport not found by ID' }, { status: 404 });
    }

    if (username) {
      const clean = username.toLowerCase().replace(/^@/, '').trim();
      let passport = getServerPassportByUsername(clean);

      // If not yet saved on server, generate default and save it
      if (!passport) {
        const defaultName = clean === 'test' ? 'Test Node' : (clean === 'yuveer' ? 'Yuveer Chhatwani' : clean.charAt(0).toUpperCase() + clean.slice(1));
        const created = createDefaultPassport({
          id: `zen_user_${clean}`,
          username: clean,
          fullName: defaultName,
          role: clean === 'yuveer' ? 'FOUNDER' : 'DELEGATE',
          isVerified: true
        });
        passport = saveServerPassport(created);
      }

      return NextResponse.json({ success: true, passport });
    }

    // If no params, return all public passports list
    const all = getAllServerPassports();
    return NextResponse.json({ success: true, count: all.length, passports: all });
  } catch (err: any) {
    console.error('[API-PASSPORT-GET-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/passport
 * Body: { passport: ZenPassport }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const passport: ZenPassport = body?.passport || body;

    if (!passport || !passport.username || !passport.passportId) {
      return NextResponse.json({ success: false, error: 'Invalid passport payload' }, { status: 400 });
    }

    const saved = saveServerPassport(passport);

    // Asynchronously dispatch to Register 46_PASSPORT_LEDGER
    sheetSync.passport({
      Passport_ID: saved.passportId,
      Person_ID: saved.userId || `zen_user_${saved.username}`,
      Username: saved.username,
      Full_Name: saved.fullName,
      Role: (saved.verification?.zenvitraRoles && saved.verification.zenvitraRoles[0]) || (saved as any).role || 'DELEGATE',
      Verification_Level: saved.verification?.level !== undefined ? `Level ${saved.verification.level}` : 'Level 0',
      Total_Points: (saved as any).points ?? (saved.contributions || []).reduce((acc: number, c: any) => acc + (c.pointsEarned || 0), 0),
      Staked_Points: (saved as any).stakedPoints ?? 0,
      User_Number: (saved as any).userNumber ?? '',
      Onboarding_Tier: (saved as any).onboardingTier ?? '',
      Onboarding_Claimed: (saved as any).onboardingClaimed ? 'Yes' : 'No',
      Contributed_Count: (saved.contributions || []).length,
      QR_Token: (saved as any).qrCodeData || saved.passportId,
      Last_Synced_At: new Date().toISOString(),
      Notes: 'Server-side passport sync'
    }).catch((err) => console.warn('[SHEETS-PASSPORT-SYNC-WARN]', err));

    return NextResponse.json({ success: true, passport: saved });
  } catch (err: any) {
    console.error('[API-PASSPORT-POST-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
