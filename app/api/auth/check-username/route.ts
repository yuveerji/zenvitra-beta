import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeHandle } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const RESERVED_HANDLES = [
  'yuveer',
  'founder',
  'zenvitra',
  'admin',
  'administrator',
  'system',
  'root',
  'support',
  'official',
  'zen_ai',
  'zenpulse',
  'zenpress',
  'zenchat',
  'moderator',
  'security',
  'null',
  'undefined'
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get('username') || searchParams.get('handle') || '';
    const current = sanitizeHandle(searchParams.get('current') || '');
    const clean = sanitizeHandle(raw);

    if (!clean || clean.length < 3) {
      return NextResponse.json({
        available: false,
        reason: 'Handle must be between 3 and 24 characters (letters, numbers, underscores).',
        username: clean
      }, { status: 200 });
    }

    // If this is the user's existing verified handle
    if (current && clean === current) {
      return NextResponse.json({
        available: true,
        reason: 'Your current handle',
        username: clean
      }, { status: 200 });
    }

    // Check reserved handles
    if (RESERVED_HANDLES.includes(clean)) {
      return NextResponse.json({
        available: false,
        reason: 'This sovereign namespace is reserved by system protocols.',
        username: clean
      }, { status: 200 });
    }

    // Check database
    try {
      const existing = await db.user.findFirst({
        where: { username: clean },
        select: { id: true, username: true }
      });

      if (existing) {
        return NextResponse.json({
          available: false,
          reason: 'This username is already taken. Try a different variant.',
          username: clean
        }, { status: 200 });
      }
    } catch (dbErr) {
      console.warn('DB check fallback in check-username route:', dbErr);
    }

    return NextResponse.json({
      available: true,
      reason: 'Username handle is available!',
      username: clean
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      available: false,
      reason: 'Failed to verify username availability.',
      error: error.message
    }, { status: 500 });
  }
}
