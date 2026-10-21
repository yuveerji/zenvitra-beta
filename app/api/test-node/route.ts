import { NextRequest, NextResponse } from 'next/server';
import { 
  TEST_CONFERENCE, 
  TEST_COMMITTEES, 
  TEST_DELEGATES, 
  TEST_MOTIONS, 
  TEST_DOCUMENTS, 
  TEST_TRANSACTIONS, 
  TEST_POSTS, 
  TEST_CHAT_CHANNELS, 
  TEST_EB_APPLICATIONS 
} from '@/lib/test-node/testNodeData';

/**
 * ZENVITRA TEST NODE SERVER ENCLAVE ENDPOINT
 * 
 * STRICT PRODUCTION ISOLATION:
 * 1. This endpoint only serves and validates sandbox operations.
 * 2. Writes to production database tables (Prisma) are strictly prohibited.
 * 3. Returns standard sandbox headers: X-Zenvitra-Sandbox: isolated-test-node
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope') || 'all';

    const payload: Record<string, any> = {
      environment: 'ZENVITRA_TEST_NODE_SANDBOX',
      isolated: true,
      productionWritesAllowed: false,
      timestamp: new Date().toISOString(),
    };

    if (scope === 'all' || scope === 'conference') {
      payload.conference = TEST_CONFERENCE;
      payload.committees = TEST_COMMITTEES;
    }
    if (scope === 'all' || scope === 'delegates') {
      payload.delegates = TEST_DELEGATES;
    }
    if (scope === 'all' || scope === 'motions') {
      payload.motions = TEST_MOTIONS;
    }
    if (scope === 'all' || scope === 'documents') {
      payload.documents = TEST_DOCUMENTS;
    }
    if (scope === 'all' || scope === 'transactions') {
      payload.transactions = TEST_TRANSACTIONS;
    }
    if (scope === 'all' || scope === 'posts') {
      payload.posts = TEST_POSTS;
    }
    if (scope === 'all' || scope === 'chat') {
      payload.chatChannels = TEST_CHAT_CHANNELS;
    }
    if (scope === 'all' || scope === 'eb') {
      payload.ebApplications = TEST_EB_APPLICATIONS;
    }

    return NextResponse.json(
      { success: true, data: payload },
      {
        status: 200,
        headers: {
          'X-Zenvitra-Sandbox': 'isolated-test-node',
          'X-Zenvitra-Prod-Protected': 'true',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to serve sandbox data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Guard against any accidental attempt to invoke production mutations through sandbox
  return NextResponse.json(
    {
      success: true,
      message: 'Simulated operation executed inside Test Node sandbox enclave. Production records remain untouched.',
      simulated: true,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'X-Zenvitra-Sandbox': 'isolated-test-node',
        'X-Zenvitra-Prod-Protected': 'true',
      },
    }
  );
}
