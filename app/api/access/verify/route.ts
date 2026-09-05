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
          statusText === 'ACTIVE'
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
          if (json && (json.isApproved === true || ['APPROVED', 'ACCEPTED', 'VERIFIED'].includes(String(json.userStatus || '').toUpperCase()))) {
            isApproved = true;
            statusText = json.userStatus || 'APPROVED';
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
      // Create response and set clearance cookie (accessible by middleware for 30 days)
      const response = NextResponse.json({
        status: 'APPROVED',
        message: 'Security clearance granted. Welcome to Zenvitra.',
        email,
        role: clearanceRole,
        unlocked: true,
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

