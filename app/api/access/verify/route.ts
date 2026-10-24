import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'zenvitra_sovereign_secret_key_development_32_bytes_min';
const encodedJwtKey = new TextEncoder().encode(JWT_SECRET);

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!email) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Email address is required' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Access Key or Master PIN is required.' },
        { status: 400 }
      );
    }

    // Check Founder & Co-Founder Sovereign Credentials
    const cleanPw = password.trim();
    const cleanPwUpper = cleanPw.toUpperCase();

    // 1. Founder: Yuveer Chhatwani
    const isYuveerFounder =
      email === 'founder@zenvitra.xyz' ||
      email === 'founder@zenvitra.org' ||
      email === 'founder@zenvitra.com' ||
      email === 'yuveer@zenvitra.xyz' ||
      email === 'yuveer@zenvitra.org' ||
      email === 'yuveer@zenvitra.com' ||
      email === 'yuveer' ||
      email === (process.env.FOUNDER_EMAIL?.toLowerCase() || '');

    const isYuveerPasswordMatch =
      cleanPw === 'Yuveer@5747R' ||
      cleanPw === '5747' ||
      cleanPw === '574729' ||
      cleanPw === '7788' ||
      cleanPwUpper === 'YUV-ROOT-MASTER-777' ||
      cleanPwUpper === 'YUVEER-FOUNDER-2026' ||
      cleanPwUpper === 'YUV-SOVEREIGN-KEY' ||
      cleanPwUpper === 'ROOT-YUVEER' ||
      cleanPwUpper === 'ZEN-FOUNDER-PASSKEY-999' ||
      cleanPwUpper === 'ZNV@2026!FOUNDER#99' ||
      cleanPwUpper === 'ZENVITRA#FOUNDER!2026' ||
      cleanPwUpper === 'FOUNDER' ||
      cleanPw === (process.env.ADMIN_MASTER_PIN || '5747');

    // 2. Co-Founder: Aarush Vijayivargiya
    const isAarushCoFounder =
      email === 'aarush@zenvitra.xyz' ||
      email === 'aarush@zenvitra.com' ||
      email === 'aarush@zenvitra.org' ||
      email === 'aarush';

    const isAarushPasswordMatch =
      isYuveerPasswordMatch ||
      cleanPwUpper.includes('AARUSH') ||
      cleanPwUpper.includes('COFOUNDER') ||
      cleanPw === '5747' ||
      cleanPwUpper === 'AARUSH-COFOUNDER-2026' ||
      cleanPwUpper === 'COFOUNDER-AARUSH';

    // 3. Co-Founder: Khushi R B
    const isKhushiCoFounder =
      email === 'khushi@zenvitra.xyz' ||
      email === 'khushi@zenvitra.com' ||
      email === 'khushi@zenvitra.org' ||
      email === 'khushi';

    const isKhushiPasswordMatch =
      isYuveerPasswordMatch ||
      cleanPwUpper.includes('KHUSHI') ||
      cleanPwUpper.includes('COFOUNDER') ||
      cleanPw === '5747' ||
      cleanPwUpper === 'KHUSHI-COFOUNDER-2026' ||
      cleanPwUpper === 'COFOUNDER-KHUSHI';

    const isFounderEmail = isYuveerFounder || isAarushCoFounder || isKhushiCoFounder;
    const isFounderPassword =
      (isYuveerFounder && isYuveerPasswordMatch) ||
      (isAarushCoFounder && isAarushPasswordMatch) ||
      (isKhushiCoFounder && isKhushiPasswordMatch);

    let isApproved = false;
    let clearanceRole = 'Core Delegate';
    let statusText = 'PENDING_REVIEW';

    // Founder & Co-Founders bypass queue automatically with immediate sovereign clearance
    if (isYuveerFounder && isYuveerPasswordMatch) {
      isApproved = true;
      statusText = 'APPROVED';
      clearanceRole = 'Founder & Chief Architect';
    } else if (isAarushCoFounder && isAarushPasswordMatch) {
      isApproved = true;
      statusText = 'APPROVED';
      clearanceRole = 'Co-Founder & Chief Product Officer';
    } else if (isKhushiCoFounder && isKhushiPasswordMatch) {
      isApproved = true;
      statusText = 'APPROVED';
      clearanceRole = 'Co-Founder & Chief Operating Officer';
    }

    // 1. Check local / SQLite Application model first
    try {
      const dbApp = await db.application.findFirst({
        where: { email: { equals: email } },
        orderBy: { appliedAt: 'desc' },
      });

      if (dbApp) {
        statusText = (dbApp.status || '').toUpperCase();
        clearanceRole = dbApp.roleRequested || 'Core Delegate';
        if (
          statusText === 'APPROVED' || 
          statusText === 'ACCEPTED' || 
          statusText === 'VERIFIED' ||
          statusText === 'ACTIVE' ||
          statusText === 'CONFIRM' ||
          statusText === 'CONFIRMED'
        ) {
          isApproved = true;
        }
      }
    } catch (dbErr: any) {
      console.warn('[VERIFY-DB-LOOKUP-WARN]', dbErr?.message);
    }

    // 2. Query Google Apps Script Webhook (Live Google Sheets status)
    const scriptUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SCRIPT_URL;
    if (scriptUrl) {
      try {
        const checkUrl = `${scriptUrl}?email=${encodeURIComponent(email)}&action=CHECK_CLEARANCE`;
        const res = await fetch(checkUrl, {
          method: 'GET',
          cache: 'no-store',
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          const json = await res.json().catch(() => null);
          const sheetStatus = String(json?.userStatus || json?.status || '').toUpperCase().trim();
          
          if (json?.role) {
            clearanceRole = json.role;
          }

          if (
            json && (
              json.isApproved === true || 
              ['APPROVED', 'ACCEPTED', 'VERIFIED', 'ACTIVE', 'CONFIRM', 'CONFIRMED'].includes(sheetStatus)
            )
          ) {
            isApproved = true;
            statusText = 'APPROVED';

            // Sync database status if sheet was approved
            try {
              await db.application.updateMany({
                where: { email: { equals: email } },
                data: { status: 'APPROVED' },
              });
            } catch {}
          } else if (['DENIED', 'REJECTED', 'DECLINED', 'FAILED'].includes(sheetStatus)) {
            statusText = 'DENIED';
          } else if (json?.found === false || sheetStatus === 'NOT_FOUND') {
            statusText = 'NOT_FOUND';
          } else if (sheetStatus) {
            statusText = sheetStatus;
          }
        }
      } catch (sheetErr: any) {
        console.warn('[VERIFY-SHEETS-LOOKUP-WARN]', sheetErr?.message);
      }
    }

    if (isApproved) {
      // Map requested role to PlatformRole & badge
      let platformRole = 'DELEGATE';
      let roleBadge = 'GOLD';
      const roleUpper = clearanceRole.toUpperCase();

      if (isYuveerFounder || roleUpper.includes('FOUNDER &') || roleUpper === 'FOUNDER') {
        platformRole = 'FOUNDER';
        roleBadge = 'GOLD';
      } else if (isAarushCoFounder || isKhushiCoFounder || roleUpper.includes('COFOUNDER') || roleUpper.includes('CO-FOUNDER') || roleUpper.includes('EXECUTIVE')) {
        platformRole = 'CO_FOUNDER';
        roleBadge = 'GOLD';
      } else if (roleUpper.includes('SECRETARIAT') || roleUpper.includes('SEC TEAM')) {
        platformRole = 'SECRETARY_GENERAL';
        roleBadge = 'SECRETARIAT';
      } else if (roleUpper.includes('ENGINEERING') || roleUpper.includes('CTO') || roleUpper.includes('TECH')) {
        platformRole = 'TECH_LEAD';
        roleBadge = 'GOLD';
      } else if (roleUpper.includes('DESIGN')) {
        platformRole = 'DESIGN_LEAD';
        roleBadge = 'BLUE';
      } else if (roleUpper.includes('PRESS')) {
        platformRole = 'PRESS_CORPS';
        roleBadge = 'PRESS';
      } else if (roleUpper.includes('OPS') || roleUpper.includes('OPERATIONS')) {
        platformRole = 'OPERATIONS_LEAD';
        roleBadge = 'BLUE';
      } else if (roleUpper.includes('AMBASSADOR') || roleUpper.includes('CAMPUS')) {
        platformRole = 'CAMPUS_AMBASSADOR';
        roleBadge = 'AMBASSADOR';
      } else {
        platformRole = 'CORE_TEAM';
        roleBadge = 'GOLD';
      }

      // Automatically upgrade or create User record with requested permissions in database
      let targetUser = null;
      try {
        targetUser = await db.user.findFirst({
          where: { email: { equals: email } },
        });

        if (targetUser) {
          // If user has a registered password, verify it
          if (targetUser.password) {
            const isMatch = await bcrypt.compare(password, targetUser.password);
            if (!isMatch && !isFounderPassword) {
              return NextResponse.json(
                { status: 'INVALID_CREDENTIALS', message: 'Invalid Access Key or Master PIN for this email.' },
                { status: 401 }
              );
            }
          } else {
            // First time signin with password, securely store hash
            const hashed = await bcrypt.hash(password, 10);
            targetUser = await db.user.update({
              where: { id: targetUser.id },
              data: { password: hashed },
            });
          }

          targetUser = await db.user.update({
            where: { id: targetUser.id },
            data: {
              role: platformRole,
              roleBadge: roleBadge,
              verified: true,
            },
          });
        } else {
          // If applicant hasn't registered in DB yet, create active user with granted role and password
          const baseHandle = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
          const hashed = await bcrypt.hash(password, 10);
          targetUser = await db.user.create({
            data: {
              email,
              name: clearanceRole,
              handle: baseHandle,
              username: baseHandle,
              password: hashed,
              role: platformRole,
              roleBadge: roleBadge,
              verified: true,
            },
          });
        }
      } catch (userDbErr: any) {
        console.warn('[VERIFY-USER-ROLE-UPDATE-WARN]', userDbErr?.message);
      }

      // Create response and set clearance cookie (accessible by middleware for 30 days)
      const response = NextResponse.json({
        status: 'APPROVED',
        message: `Security clearance granted. You have been assigned the role: ${platformRole} with verified badge.`,
        email,
        role: platformRole,
        roleBadge,
        clearanceRole,
        unlocked: true,
        user: targetUser ? {
          id: targetUser.id,
          username: targetUser.username || email.split('@')[0],
          name: targetUser.name || clearanceRole,
          email: targetUser.email,
          role: targetUser.role,
          roleBadge: targetUser.roleBadge,
          verified: targetUser.verified,
        } : null,
      });

      response.cookies.set('zenvitra_clearance', 'SOVEREIGN_GRANTED', {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      response.cookies.set('zenvitra_clearance_email', email, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      response.cookies.set('zenvitra_clearance_role', platformRole, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      // Generate cryptographically signed Edge JWT session token for instant server middleware unlock
      try {
        const edgeSessionJwt = await new SignJWT({
          userId: targetUser?.id || (isYuveerFounder ? 'zen_founder_root' : isAarushCoFounder ? 'zen_cofounder_aarush' : 'zen_cofounder_khushi'),
          email,
          username: targetUser?.username || (isYuveerFounder ? 'yuveer' : isAarushCoFounder ? 'aarush' : 'khushi'),
          role: platformRole,
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('30d')
          .sign(encodedJwtKey);

        response.cookies.set('zenvitra_session_token', edgeSessionJwt, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
        });
      } catch (jwtErr) {
        console.warn('[VERIFY-JWT-SIGN-WARN]', jwtErr);
      }

      return response;
    }

    return NextResponse.json({
      status: statusText,
      email,
      role: clearanceRole || 'Core Team Candidate',
      isApproved: false,
      unlocked: false,
      found: statusText !== 'NOT_FOUND',
      isRegistered: statusText !== 'NOT_FOUND',
      message: statusText === 'DENIED'
        ? 'Security clearance was not approved for this dossier.'
        : statusText === 'NOT_FOUND'
        ? 'No record found. Please pre-register to join the launch whitelist.'
        : statusText === 'QUEUED' || statusText === 'PENDING' || statusText === 'PENDING_REVIEW'
        ? 'Your dossier is currently under Genesis Council review. Once your status changes to APPROVED in the ledger, clearance will be granted automatically.'
        : `Current dossier status: ${statusText}. Clearance has not been unlocked yet.`,
    });
  } catch (error: any) {
    console.error('[API-ACCESS-VERIFY-ERROR]', error);
    return NextResponse.json(
      { status: 'ERROR', message: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}

