import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllServerDocuments, 
  getServerDocumentById, 
  saveServerDocument 
} from '@/lib/solutionsStorage';
import { SolutionDocument } from '@/types/solutions';

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
    return NextResponse.json({ success: true, document: saved });
  } catch (err: any) {
    console.error('[API-SOLUTIONS-POST-ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
