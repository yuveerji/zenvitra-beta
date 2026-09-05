import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'FOUNDER') {
      return NextResponse.json({ error: 'INSUFFICIENT CLEARANCE. FOUNDER LEVEL 0 REQUIRED.' }, { status: 403 });
    }

    const { message } = await req.json();

    // Pass null/empty string to clear the broadcast
    const updatedState = await db.systemProtocolState.upsert({
      where: { id: 'GLOBAL_CONFIG' },
      update: { broadcastNotice: message || null },
      create: { id: 'GLOBAL_CONFIG', broadcastNotice: message || null },
    });

    return NextResponse.json({ 
      message: 'Network-wide decree broadcasted to all edge nodes.',
      broadcast: updatedState.broadcastNotice
    }, { status: 200 });
  } catch (error: any) {
    console.error('[FOUNDER BROADCAST ERROR]', error);
    return NextResponse.json({ error: 'Broadcast transmission failed.' }, { status: 500 });
  }
}