import { NextRequest, NextResponse } from 'next/server';
import { voteServerDocument } from '@/lib/solutionsStorage';
import { sheetSync } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docId, voteType, userId, stakedPoints, multiplier } = body;

    if (!docId || !voteType || !userId) {
      return NextResponse.json(
        { success: false, error: 'docId, voteType, and userId are required' },
        { status: 400 }
      );
    }

    if (!['IN_FAVOR', 'AGAINST', 'ABSTAIN'].includes(voteType)) {
      return NextResponse.json({ success: false, error: 'Invalid voteType' }, { status: 400 });
    }

    const updated = voteServerDocument(docId, voteType, userId);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // Asynchronously dispatch updated vote tallies to Register 43 Legislation Bills
    sheetSync.bill({
      Bill_ID: updated.id,
      Document_Code: updated.documentCode || (updated as any).documentNumber || updated.id,
      Title: updated.title,
      Category: updated.category || updated.documentType || 'POLICY',
      Committee: updated.committee || 'General Assembly',
      Status: updated.status || 'PROPOSED',
      Lead_Sponsors: (updated.leadSponsors || []).join(', '),
      Proposed_By_Username: updated.proposedByUsername || 'yuveer',
      Votes_In_Favor: updated.votes?.inFavor ?? 0,
      Votes_Against: updated.votes?.against ?? 0,
      Votes_Abstain: updated.votes?.abstain ?? 0,
      Total_Staked_Points: stakedPoints ?? (updated as any).totalStakedPoints ?? 0,
      Multiplier: multiplier ?? (updated as any).multiplier ?? '1.0x',
      Is_Official: updated.isOfficial ? 'Yes' : 'No',
      Created_At: updated.createdAt,
      Updated_At: updated.updatedAt,
      Notes: `Voter: ${userId} voted ${voteType}`
    }).catch((err) => console.warn('[SHEETS-BILL-VOTE-SYNC-WARN]', err));

    return NextResponse.json({ success: true, document: updated });
  } catch (err: any) {
    console.error('[API-SOLUTIONS-VOTE-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
