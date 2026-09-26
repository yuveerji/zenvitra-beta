import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export interface MatrixPortfolioItem {
  id: string;
  committee: 'AIPPM' | 'EMI' | 'UNSC' | 'UNODC';
  title: string;
  subTitle?: string;
  category: string;
  status: string;
  allocatedTo?: string;
  allocatedEmail?: string;
  waitingCount?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Crisis';
}

const DEFAULT_PORTFOLIOS: MatrixPortfolioItem[] = [
  // AIPPM
  { id: 'aippm_1', committee: 'AIPPM', title: 'Narendra Modi', subTitle: 'Prime Minister of India / Varanasi MP', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_2', committee: 'AIPPM', title: 'Amit Shah', subTitle: 'Minister of Home Affairs / Gandhinagar MP', category: 'Government & Cabinet', status: 'Allocated', allocatedTo: 'Assigned Delegate', difficulty: 'Advanced' },
  { id: 'aippm_3', committee: 'AIPPM', title: 'Rahul Gandhi', subTitle: 'Leader of Opposition (Lok Sabha)', category: 'Opposition Alliance', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_4', committee: 'AIPPM', title: 'Rajnath Singh', subTitle: 'Minister of Defence', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_5', committee: 'AIPPM', title: 'Nirmala Sitharaman', subTitle: 'Minister of Finance', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_6', committee: 'AIPPM', title: 'Mallikarjun Kharge', subTitle: 'Leader of Opposition (Rajya Sabha)', category: 'Opposition Alliance', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_7', committee: 'AIPPM', title: 'Akhilesh Yadav', subTitle: 'Samajwadi Party Chief / Kannauj MP', category: 'Regional Opposition', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_8', committee: 'AIPPM', title: 'Mamata Banerjee', subTitle: 'All India Trinamool Congress (TMC)', category: 'Regional Alliance', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_9', committee: 'AIPPM', title: 'Nitin Gadkari', subTitle: 'Minister of Road Transport & Highways', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'aippm_10', committee: 'AIPPM', title: 'Asaduddin Owaisi', subTitle: 'AIMIM Chief / Hyderabad MP', category: 'Independent MPs', status: 'Vacant', difficulty: 'Crisis' },

  // EMI
  { id: 'emi_1', committee: 'EMI', title: 'Dharmendra Pradhan', subTitle: 'Union Minister of Education', category: 'Union Ministry', status: 'Allocated', allocatedTo: 'Assigned Delegate', difficulty: 'Advanced' },
  { id: 'emi_2', committee: 'EMI', title: 'Prof. M. Jagadesh Kumar', subTitle: 'Chairman, University Grants Commission (UGC)', category: 'Statutory Regulatory Authority', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'emi_3', committee: 'EMI', title: 'Prof. T.G. Sitharam', subTitle: 'Chairman, AICTE', category: 'Technical Regulatory Authority', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_4', committee: 'EMI', title: 'Director, NCERT', subTitle: 'Curriculum & Textbook Framework Directorate', category: 'Academic Directorate', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'emi_5', committee: 'EMI', title: 'Director, IIT Delhi', subTitle: 'Institutes of National Importance (INIs)', category: 'Higher Education Leadership', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_6', committee: 'EMI', title: 'Vice-Chancellor, Delhi University', subTitle: 'Central Universities Consortium', category: 'Higher Education Leadership', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_7', committee: 'EMI', title: 'State Education Secretary (Tamil Nadu)', subTitle: 'State Language & Curriculum Autonomy Board', category: 'State Stakeholder', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'emi_8', committee: 'EMI', title: 'National Student Union Representative', subTitle: 'Youth Democratic Student Body', category: 'Student Federation', status: 'Vacant', difficulty: 'Beginner' },

  // UNSC
  { id: 'unsc_1', committee: 'UNSC', title: 'United States of America', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Allocated', allocatedTo: 'Confirmed P5 Diplomat', difficulty: 'Crisis' },
  { id: 'unsc_2', committee: 'UNSC', title: 'United Kingdom', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unsc_3', committee: 'UNSC', title: 'French Republic', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unsc_4', committee: 'UNSC', title: 'Russian Federation', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unsc_5', committee: 'UNSC', title: 'People’s Republic of China', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unsc_6', committee: 'UNSC', title: 'Republic of India', subTitle: 'Special Invitee & G4 Candidate Member', category: 'Elected Members & Observers', status: 'Allocated', allocatedTo: 'Assigned Delegate', difficulty: 'Advanced' },
  { id: 'unsc_7', committee: 'UNSC', title: 'Japan', subTitle: 'Non-Permanent Member (Asia-Pacific)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unsc_8', committee: 'UNSC', title: 'Republic of Korea', subTitle: 'Non-Permanent Member (Asia-Pacific)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unsc_9', committee: 'UNSC', title: 'Swiss Confederation', subTitle: 'Non-Permanent Member (WEOG)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'unsc_10', committee: 'UNSC', title: 'Republic of Sierra Leone', subTitle: 'Non-Permanent Member (African Group)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Beginner' },

  // UNODC
  { id: 'unodc_1', committee: 'UNODC', title: 'Republic of Colombia', subTitle: 'Andean Narcotics & Crop Substitution Board', category: 'Key Producer/Transit States', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unodc_2', committee: 'UNODC', title: 'United Mexican States', subTitle: 'Transnational Cartel Border & Maritime Taskforce', category: 'Key Producer/Transit States', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unodc_3', committee: 'UNODC', title: 'Kingdom of the Netherlands', subTitle: 'Port of Rotterdam Interception Directorate', category: 'European Gateway States', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unodc_4', committee: 'UNODC', title: 'Republic of the Union of Myanmar', subTitle: 'Golden Triangle Synthetic Drug Precursor Taskforce', category: 'Southeast Asia Transit', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unodc_5', committee: 'UNODC', title: 'Federal Republic of Nigeria', subTitle: 'West African Transshipment Command', category: 'African Transit Hubs', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'unodc_6', committee: 'UNODC', title: 'INTERPOL Secretariat', subTitle: 'Transnational Organized Crime Taskforce', category: 'International Observer Agencies', status: 'Allocated', allocatedTo: 'Assigned Delegate', difficulty: 'Advanced' },
  { id: 'unodc_7', committee: 'UNODC', title: 'Islamic Republic of Afghanistan', subTitle: 'Opiate Eradication Directorate', category: 'Central Asian Production Corridor', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unodc_8', committee: 'UNODC', title: 'Commonwealth of Australia', subTitle: 'Pacific Border & Darknet Interdiction Branch', category: 'Destination & Consumer States', status: 'Vacant', difficulty: 'Beginner' },
];

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
    const { portfolioId, portfolioTitle, title, status, allocatedTo, allocatedEmail, committee } = body;

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
