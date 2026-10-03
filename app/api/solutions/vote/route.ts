import { NextRequest, NextResponse } from 'next/server';
import { voteServerDocument } from '@/lib/solutionsStorage';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docId, voteType, userId } = body;

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

    return NextResponse.json({ success: true, document: updated });
  } catch (err: any) {
    console.error('[API-SOLUTIONS-VOTE-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
