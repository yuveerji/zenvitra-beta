import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { sheetSync } from '@/lib/googleSheets';

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
      clean === 'founder@zenvitra.xyz' ||
      clean === 'founder@zenvitra.org' ||
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
          email: 'founder@zenvitra.xyz',
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
      clean === 'test@zenvitra.xyz' ||
      clean === 'test@zenvitra.org';

    if (isTestUser) {
      // Official Test Node Closure Date: 19th November 2026
      const TEST_NODE_EXPIRY = new Date('2026-11-19T23:59:59+05:30');
      if (new Date() > TEST_NODE_EXPIRY) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'The Test Node officially closed on 19th November 2026. Please register or sign in with your permanent sovereign account.' 
          },
          { status: 403 }
        );
      }

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
          email: 'test@zenvitra.xyz',
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
            { handle: `@${clean}` },
            { username: `@${clean}` },
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

        const responseUser = {
          id: dbUser.id,
          username: dbUser.username || dbUser.handle || clean.split('@')[0],
          name: dbUser.name || dbUser.username || clean.split('@')[0],
          email: dbUser.email,
          role: dbUser.role || 'USER',
        };

        // Dispatch login metadata to Google Sheets 03_LOGIN_ACTIVITY / Login Data Core
        try {
          const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
          const userAgent = req.headers.get('user-agent') || 'Browser Client';
          sheetSync.login({
            userId: responseUser.id,
            fullName: responseUser.name,
            email: responseUser.email,
            authProvider: 'CREDENTIALS',
            ipAddress: ip,
            deviceBrowserInfo: userAgent,
            loginStatus: 'SUCCESS',
          }).catch(() => {});
        } catch (_) {}

        return NextResponse.json({
          success: true,
          user: responseUser,
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
