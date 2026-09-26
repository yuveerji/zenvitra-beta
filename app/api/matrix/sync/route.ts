import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

import { OFFICIAL_240_PORTFOLIOS, MatrixPortfolioItem } from '@/lib/matrixPortfoliosData';

export type { MatrixPortfolioItem };

const DEFAULT_PORTFOLIOS: MatrixPortfolioItem[] = OFFICIAL_240_PORTFOLIOS;

function getLedgerPath(): string {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'matrix_portfolios_ledger.json');
}

function readLocalPortfolios(): MatrixPortfolioItem[] {
  try {
    const file = getLedgerPath();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[MATRIX-LEDGER-READ-WARN]', err);
  }
  return DEFAULT_PORTFOLIOS;
}

function writeLocalPortfolios(portfolios: MatrixPortfolioItem[]): void {
  try {
    const file = getLedgerPath();
    fs.writeFileSync(file, JSON.stringify(portfolios, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[MATRIX-LEDGER-WRITE-WARN]', err);
  }
}

const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwMJVccvxnhbk13ppFVu44gpA9cZ95nR1oojq-c4P1r6YWK45hKp0f3Tydk4RJO6v0Q/exec';

/**
 * GET: Reads portfolios from Google Sheets (or fallback to local persistent ledger)
 */
export async function GET(req: NextRequest) {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
    let portfolios = readLocalPortfolios();
    let syncedWithGoogleSheets = false;
    let spreadsheetUrl = '';

    if (webhookUrl) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(`${webhookUrl}?action=GET_MATRIX_PORTFOLIOS`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          redirect: 'follow',
          signal: controller.signal,
          cache: 'no-store'
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.portfolios) && data.portfolios.length > 0) {
            portfolios = data.portfolios;
            syncedWithGoogleSheets = true;
            spreadsheetUrl = data.spreadsheetUrl || '';
            writeLocalPortfolios(portfolios);
          }
        }
      } catch (fetchErr: any) {
        console.warn('[MATRIX-SHEETS-GET-WARN]', fetchErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      portfolios,
      count: portfolios.length,
      syncedWithGoogleSheets,
      spreadsheetUrl,
      lastSyncedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[MATRIX-SYNC-GET-ERROR]', error);
    return NextResponse.json({
      success: true,
      portfolios: DEFAULT_PORTFOLIOS,
      count: DEFAULT_PORTFOLIOS.length,
      syncedWithGoogleSheets: false,
      lastSyncedAt: new Date().toISOString()
    });
  }
}

/**
 * POST: Updates portfolio status/allocation and synchronizes to Google Sheets
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, portfolioId, portfolioTitle, title, status, allocatedTo, allocatedEmail, committee } = body;

    // A. Reset all portfolios to vacant
    if (action === 'RESET_ALL_VACANT' || action === 'SEED_OFFICIAL_MATRIX') {
      const resetPortfolios = OFFICIAL_240_PORTFOLIOS.map((item) => ({
        ...item,
        status: 'Vacant',
        allocatedTo: undefined,
        allocatedEmail: undefined,
        waitingCount: 0,
      }));
      writeLocalPortfolios(resetPortfolios);

      // Notify Google Sheets
      const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
      let sheetUpdated = false;
      if (webhookUrl) {
        try {
          const gRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'SYNC_ALL_PORTFOLIOS',
              portfolios: resetPortfolios,
              totalCount: resetPortfolios.length,
            }),
            redirect: 'follow',
            cache: 'no-store'
          });
          if (gRes.ok) sheetUpdated = true;
        } catch (err: any) {
          console.warn('[MATRIX-RESET-SHEETS-WARN]', err?.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'All 240 portfolios reset to Vacant across AIPPM, EMI, UNSC & ECOSOC',
        count: resetPortfolios.length,
        portfolios: resetPortfolios,
        sheetUpdated,
        syncedAt: new Date().toISOString()
      });
    }

    const targetId = (portfolioId || '').toLowerCase();
    const targetTitle = (portfolioTitle || title || '').toLowerCase();

    // 1. Update local persistent ledger
    let portfolios = readLocalPortfolios();
    let updatedItem: MatrixPortfolioItem | null = null;

    portfolios = portfolios.map((item) => {
      const matchId = targetId && item.id.toLowerCase() === targetId;
      const matchTitle = targetTitle && item.title.toLowerCase() === targetTitle;
      if (matchId || matchTitle) {
        const nextStatus = status || item.status;
        updatedItem = {
          ...item,
          status: nextStatus,
          allocatedTo: nextStatus === 'Allocated' ? (allocatedTo || item.allocatedTo) : undefined,
          allocatedEmail: nextStatus === 'Allocated' ? (allocatedEmail || item.allocatedEmail) : undefined,
        };
        return updatedItem;
      }
      return item;
    });

    writeLocalPortfolios(portfolios);

    // 2. Dispatch update to Google Sheets Webhook
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
    let sheetUpdated = false;

    if (webhookUrl) {
      try {
        const gRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'UPDATE_MATRIX_PORTFOLIO',
            portfolioId: targetId || (updatedItem ? (updatedItem as MatrixPortfolioItem).id : ''),
            portfolioTitle: targetTitle || (updatedItem ? (updatedItem as MatrixPortfolioItem).title : ''),
            title: targetTitle || (updatedItem ? (updatedItem as MatrixPortfolioItem).title : ''),
            status,
            allocatedTo: allocatedTo || '',
            allocatedEmail: allocatedEmail || '',
            committee: committee || (updatedItem ? (updatedItem as MatrixPortfolioItem).committee : '')
          }),
          redirect: 'follow',
          cache: 'no-store'
        });

        if (gRes.ok) {
          const gData = await gRes.json();
          sheetUpdated = Boolean(gData?.updated);
        }
      } catch (err: any) {
        console.warn('[MATRIX-SHEETS-POST-WARN]', err?.message);
      }
    }

    return NextResponse.json({
      success: true,
      updatedItem,
      sheetUpdated,
      syncedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[MATRIX-SYNC-POST-ERROR]', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update portfolio' }, { status: 500 });
  }
}
