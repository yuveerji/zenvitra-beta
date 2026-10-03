import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || typeof identifier !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter both your identifier and passphrase.' },
        { status: 400 }
      );
    }

    const clean = identifier.toLowerCase().trim().replace(/^@/, '');
    const cleanPw = password.trim();
    const cleanPwUpper = cleanPw.toUpperCase();

    // 1. Strict Founder Check
    const isFounder =
      clean === 'founder@zenvitra.org' ||
      clean === 'founder@zenvitra.xyz' ||
      clean === 'founder@zenvitra.com' ||
      clean === 'founder' ||
      clean === 'yuveer' ||
      clean === (process.env.FOUNDER_EMAIL?.toLowerCase() || '');

    if (isFounder) {
      const isFounderPassword =
        password === 'Yuveer@5747R' ||
        cleanPwUpper === 'YUV-ROOT-MASTER-777' ||
        cleanPwUpper === 'YUVEER-FOUNDER-2026' ||
        cleanPwUpper === 'YUV-SOVEREIGN-KEY' ||
        cleanPwUpper === 'ROOT-YUVEER' ||
        cleanPwUpper === 'ZEN-FOUNDER-PASSKEY-999' ||
        cleanPw === '5747' ||
        cleanPw === '574729' ||
        cleanPw === '7788' ||
        cleanPwUpper === 'ZNV@2026!FOUNDER#99' ||
        cleanPwUpper === 'ZEN#99$FNDR!2026' ||
        cleanPwUpper === 'ZENVITRA#FOUNDER!2026' ||
        cleanPw === (process.env.ADMIN_MASTER_PIN || '5747');

      if (!isFounderPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid founder credentials. Access denied.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: 'zen_founder_root',
          username: 'yuveer',
          name: 'Yuveer Chhatwani',
          email: 'founder@zenvitra.org',
          role: 'FOUNDER',
        },
      });
    }

    // 2. Strict QA / Test User Check
    const isTestUser =
      clean === 'test' ||
      clean === 'tester' ||
      clean === 'testuser' ||
      clean === 'demo' ||
      clean === 'test@zenvitra.org' ||
      clean === 'test@zenvitra.xyz';

    if (isTestUser) {
      const isAllowedTestPassword =
        cleanPw.toLowerCase() === 'test1234' ||
        cleanPw.toLowerCase() === 'test' ||
        cleanPw.toLowerCase() === 'test123' ||
        cleanPw.toLowerCase() === 'test@123';

      if (!isAllowedTestPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid test credentials. Use "test1234" to authenticate.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: 'zen_test_delegate',
          username: 'test',
          name: 'Test Delegate',
          email: 'test@zenvitra.org',
          role: 'DELEGATE',
        },
      });
    }

    // 3. Database User Check (Prisma db.user)
    try {
      const dbUser = await db.user.findFirst({
        where: {
          OR: [
            { email: clean },
            { username: clean },
            { handle: clean },
          ],
        },
      });

      if (dbUser && dbUser.password) {
        const isValid = await bcrypt.compare(password, dbUser.password);
        if (!isValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid password. Please check your credentials.' },
            { status: 401 }
          );
        }

        return NextResponse.json({
          success: true,
          user: {
            id: dbUser.id,
            username: dbUser.username || dbUser.handle || clean.split('@')[0],
            name: dbUser.name || dbUser.username || clean.split('@')[0],
            email: dbUser.email,
            role: dbUser.role || 'USER',
          },
        });
      }
    } catch (dbErr) {
      console.error('[AUTH-VERIFY-DB-ERROR]', dbErr);
    }

    // 4. If user not found in local DB
    return NextResponse.json(
      { success: false, error: 'Account not found. Please register or verify your details.' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('[AUTH-VERIFY-ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service encountered an internal error.' },
      { status: 500 }
    );
  }
}
