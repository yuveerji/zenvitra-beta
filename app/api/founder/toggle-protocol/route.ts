import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'FOUNDER') {
      return NextResponse.json({ error: 'INSUFFICIENT CLEARANCE. FOUNDER LEVEL 0 REQUIRED.' }, { status: 403 });
    }

    const { protocol, state } = await req.json();

    if (!['PULSE', 'CHAT', 'EVENTS', 'PRESS'].includes(protocol) || typeof state !== 'boolean') {
      return NextResponse.json({ error: 'Invalid protocol payload.' }, { status: 400 });
    }

    const fieldMap: Record<string, string> = {
      PULSE: 'pulseActive',
      CHAT: 'chatActive',
      EVENTS: 'eventsActive',
      PRESS: 'pressActive',
    };

    const targetField = fieldMap[protocol];

    // Upsert the singleton configuration document
    const updatedState = await db.systemProtocolState.upsert({
      where: { id: 'GLOBAL_CONFIG' },
      update: { [targetField]: state },
      create: { id: 'GLOBAL_CONFIG', [targetField]: state },
    });

    return NextResponse.json({ 
      message: `Protocol ${protocol} mutation executed.`, 
      state: updatedState 
    }, { status: 200 });
  } catch (error: any) {
    console.error('[FOUNDER PROTOCOL TOGGLE ERROR]', error);
    return NextResponse.json({ error: 'Internal system override failed.' }, { status: 500 });
  }
}