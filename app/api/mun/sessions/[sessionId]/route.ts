import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    const session = await db.munSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }],
      },
      include: {
        committee: {
          include: {
            config: true,
            bills: {
              include: {
                clauses: {
                  include: {
                    amendments: true,
                  },
                },
              },
            },
          },
        },
        speakerQueue: {
          orderBy: { position: 'asc' },
        },
        auditEvents: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Convert BigInts for JSON serialization
    const serialized = {
      ...session,
      timerAnchorEpochMs: session.timerAnchorEpochMs ? session.timerAnchorEpochMs.toString() : null,
      timerRemainingAtMs: session.timerRemainingAtMs.toString(),
    };

    return NextResponse.json({ session: serialized });
  } catch (error: any) {
    console.error('Error fetching MUN session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { status, activeMode, currentSpeakerId, currentSpeakerName, currentSpeakerRole, auditAction, auditSummary } = body;

    const existing = await db.munSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const updated = await db.munSession.update({
      where: { id: existing.id },
      data: {
        ...(status && { status }),
        ...(activeMode && { activeMode }),
        ...(currentSpeakerId !== undefined && { currentSpeakerId }),
        ...(currentSpeakerName !== undefined && { currentSpeakerName }),
        ...(currentSpeakerRole !== undefined && { currentSpeakerRole }),
      },
    });

    if (auditAction && auditSummary) {
      await db.munSessionAudit.create({
        data: {
          sessionId: existing.id,
          actorUserId: 'chair_authority',
          action: auditAction,
          summary: auditSummary,
        },
      });
    }

    return NextResponse.json({
      success: true,
      session: {
        ...updated,
        timerAnchorEpochMs: updated.timerAnchorEpochMs ? updated.timerAnchorEpochMs.toString() : null,
        timerRemainingAtMs: updated.timerRemainingAtMs.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error updating MUN session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
