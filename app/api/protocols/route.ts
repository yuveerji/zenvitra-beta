import { NextRequest, NextResponse } from 'next/server';
import { getGlobalServerProtocols, updateGlobalServerProtocols } from '@/lib/globalProtocolState';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const protocols = getGlobalServerProtocols();
  return NextResponse.json(protocols, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateGlobalServerProtocols(body);
    return NextResponse.json({ success: true, protocols: updated }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update server protocols' }, { status: 500 });
  }
}
