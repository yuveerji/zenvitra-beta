import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { action, durationSec } = body; // action: 'START' | 'PAUSE' | 'RESET' | 'SET_DURATION'

    const session = await db.munSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }],
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const now = BigInt(Date.now());
    let nextAnchor: bigint | null = session.timerAnchorEpochMs;
    let nextRemaining = session.timerRemainingAtMs;
    let nextRunning = session.isTimerRunning;
    let nextDuration = session.timerDurationSec;

    if (action === 'START') {
      if (!session.isTimerRunning) {
        nextAnchor = now;
        nextRunning = true;
      }
    } else if (action === 'PAUSE') {
      if (session.isTimerRunning && session.timerAnchorEpochMs) {
        const elapsed = now - session.timerAnchorEpochMs;
        const remaining = session.timerRemainingAtMs - elapsed;
        nextRemaining = remaining > BigInt(0) ? remaining : BigInt(0);
        nextAnchor = null;
        nextRunning = false;
      }
    } else if (action === 'RESET') {
      const dur = durationSec ? Number(durationSec) : session.timerDurationSec;
      nextDuration = dur;
      nextRemaining = BigInt(dur * 1000);
      nextAnchor = null;
      nextRunning = false;
    } else if (action === 'SET_DURATION') {
      if (durationSec) {
        nextDuration = Number(durationSec);
        nextRemaining = BigInt(Number(durationSec) * 1000);
        nextAnchor = null;
        nextRunning = false;
      }
    }

    const updated = await db.munSession.update({
      where: { id: session.id },
      data: {
        timerDurationSec: nextDuration,
        timerAnchorEpochMs: nextAnchor,
        timerRemainingAtMs: nextRemaining,
        isTimerRunning: nextRunning,
      },
    });

    return NextResponse.json({
      success: true,
      timer: {
        durationSec: updated.timerDurationSec,
        anchorEpochMs: updated.timerAnchorEpochMs ? updated.timerAnchorEpochMs.toString() : null,
        remainingAtMs: updated.timerRemainingAtMs.toString(),
        isRunning: updated.isTimerRunning,
      },
    });
  } catch (error: any) {
    console.error('Error modifying MUN timer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
