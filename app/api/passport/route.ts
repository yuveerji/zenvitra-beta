import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllServerPassports, 
  getServerPassportByUsername, 
  getServerPassportById, 
  saveServerPassport 
} from '@/lib/passportsStorage';
import { createDefaultPassport, ZenPassport } from '@/lib/passport';

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
    return NextResponse.json({ success: true, passport: saved });
  } catch (err: any) {
    console.error('[API-PASSPORT-POST-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
