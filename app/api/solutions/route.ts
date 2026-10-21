import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllServerDocuments, 
  getServerDocumentById, 
  saveServerDocument 
} from '@/lib/solutionsStorage';
import { SolutionDocument } from '@/types/solutions';
import { sheetSync } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

/**
 * GET /api/solutions
 * Query params: ?id=... &includeTest=true/false
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const includeTest = searchParams.get('includeTest') === 'true';

    if (id) {
      const doc = getServerDocumentById(id);
      if (doc) {
        return NextResponse.json({ success: true, document: doc });
      }
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const documents = getAllServerDocuments(includeTest);
    return NextResponse.json({ success: true, count: documents.length, documents });
  } catch (err: any) {
    console.error('[API-SOLUTIONS-GET-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/solutions
 * Body: { document: SolutionDocument }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc: SolutionDocument = body?.document || body;

    if (!doc || !doc.id || !doc.title) {
      return NextResponse.json({ success: false, error: 'Invalid document payload' }, { status: 400 });
    }

    const saved = saveServerDocument(doc);

    // Asynchronously dispatch to Register 43 Legislation Bills
    sheetSync.bill({
      Bill_ID: saved.id,
      Document_Code: saved.documentCode || (saved as any).documentNumber || saved.id,
      Title: saved.title,
      Category: saved.category || saved.documentType || 'POLICY',
      Committee: saved.committee || 'General Assembly',
      Status: saved.status || 'PROPOSED',
      Lead_Sponsors: (saved.leadSponsors || []).join(', '),
      Proposed_By_Username: saved.proposedByUsername || 'yuveer',
      Votes_In_Favor: saved.votes?.inFavor ?? 0,
      Votes_Against: saved.votes?.against ?? 0,
      Votes_Abstain: saved.votes?.abstain ?? 0,
      Total_Staked_Points: (saved as any).totalStakedPoints ?? 0,
      Multiplier: (saved as any).multiplier ?? '1.0x',
      Is_Official: saved.isOfficial ? 'Yes' : 'No',
      Created_At: saved.createdAt,
      Updated_At: saved.updatedAt,
      Notes: `Clauses: ${(saved.clauses || []).length}`
    }).catch((err) => console.warn('[SHEETS-BILL-SYNC-WARN]', err));

    return NextResponse.json({ success: true, document: saved });
  } catch (err: any) {
    console.error('[API-SOLUTIONS-POST-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
