import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Email address is required' },
        { status: 400 }
      );
    }

    let isApproved = false;
    let clearanceRole = 'Core Delegate';
    let statusText = 'PENDING_REVIEW';

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
          if (
            json && (
              json.isApproved === true || 
              ['APPROVED', 'ACCEPTED', 'VERIFIED', 'ACTIVE', 'CONFIRM', 'CONFIRMED'].includes(sheetStatus)
            )
          ) {
            isApproved = true;
            statusText = sheetStatus || 'CONFIRM';
            if (json.role) clearanceRole = json.role;

            // Sync database status if sheet was approved
            try {
              await db.application.updateMany({
                where: { email: { equals: email } },
                data: { status: 'APPROVED' },
              });
            } catch {}
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

      if (roleUpper.includes('COFOUNDER') || roleUpper.includes('CO-FOUNDER') || roleUpper.includes('EXECUTIVE')) {
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
          targetUser = await db.user.update({
            where: { id: targetUser.id },
            data: {
              role: platformRole,
              roleBadge: roleBadge,
              verified: true,
            },
          });
        } else {
          // If applicant hasn't registered yet, create active user with granted role
          const baseHandle = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
          targetUser = await db.user.create({
            data: {
              email,
              name: clearanceRole,
              handle: baseHandle,
              username: baseHandle,
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
          username: targetUser.username,
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

      return response;
    }

    return NextResponse.json({
      status: statusText,
      isApproved: false,
      unlocked: false,
      message: statusText === 'QUEUED' || statusText === 'PENDING_REVIEW'
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

