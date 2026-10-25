import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { subject, voteType, isSecretBallot, totalEligible, motionId, billId } = body;

    const session = await db.munSession.findFirst({
      where: { OR: [{ id: sessionId }, { sessionCode: sessionId.toUpperCase() }] },
      select: { id: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const vote = await db.munVoteSession.create({
      data: {
        sessionId: session.id,
        subject,
        voteType: voteType || 'PROCEDURAL',
        isSecretBallot: Boolean(isSecretBallot),
        totalEligible: Number(totalEligible) || 0,
        motionId: motionId || null,
        billId: billId || null,
        status: 'ACTIVE',
      },
    });

    await db.munSessionAudit.create({
      data: {
        sessionId: session.id,
        actorUserId: 'chair_authority',
        action: 'VOTE_OPENED',
        summary: `Opened ${voteType || 'procedural'} vote on: "${subject}"`,
      },
    });

    return NextResponse.json({ success: true, vote });
  } catch (error: any) {
    console.error('Error creating vote session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Submit ballot
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const body = await req.json();
    const { voteSessionId, choice, voterSeat, userId } = body;

    const voteSession = await db.munVoteSession.findUnique({
      where: { id: voteSessionId },
    });

    if (!voteSession || voteSession.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Voting is not active' }, { status: 400 });
    }

    // Confidentiality enforcement: if secret ballot, strip user ID
    const recordedUserId = voteSession.isSecretBallot ? null : (userId || null);
    const recordedSeat = voteSession.isSecretBallot ? null : (voterSeat || null);

    const ballot = await db.munBallot.create({
      data: {
        voteSessionId,
        choice,
        voterUserId: recordedUserId,
        voterSeat: recordedSeat,
      },
    });

    return NextResponse.json({ success: true, ballotId: ballot.id });
  } catch (error: any) {
    console.error('Error submitting ballot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Close and tally vote
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const body = await req.json();
    const { voteSessionId, majorityRule } = body; // 'SIMPLE' | 'TWO_THIRDS'

    const voteSession = await db.munVoteSession.findUnique({
      where: { id: voteSessionId },
      include: { ballots: true },
    });

    if (!voteSession) {
      return NextResponse.json({ error: 'Vote session not found' }, { status: 404 });
    }

    let yesCount = 0;
    let noCount = 0;
    let abstainCount = 0;

    for (const b of voteSession.ballots) {
      if (b.choice === 'YES' || b.choice === 'YES_WITH_RESERVATIONS') yesCount++;
      else if (b.choice === 'NO') noCount++;
      else if (b.choice === 'ABSTAIN') abstainCount++;
    }

    const totalVotesCast = yesCount + noCount;
    let isPassed = false;

    if (majorityRule === 'TWO_THIRDS') {
      isPassed = totalVotesCast > 0 && yesCount >= Math.ceil((2 / 3) * totalVotesCast);
    } else {
      isPassed = yesCount > noCount;
    }

    const outcome = isPassed ? 'PASSED' : 'FAILED';

    const updated = await db.munVoteSession.update({
      where: { id: voteSessionId },
      data: {
        status: 'CLOSED',
        votesInFavor: yesCount,
        votesAgainst: noCount,
        abstentions: abstainCount,
        resultOutcome: outcome,
      },
    });

    await db.munSessionAudit.create({
      data: {
        sessionId: voteSession.sessionId,
        actorUserId: 'chair_authority',
        action: 'VOTE_CLOSED',
        summary: `Vote on "${voteSession.subject}" concluded: ${outcome} (YES: ${yesCount}, NO: ${noCount}, ABSTAIN: ${abstainCount})`,
      },
    });

    return NextResponse.json({
      success: true,
      result: {
        outcome,
        yesCount,
        noCount,
        abstainCount,
        totalVotesCast,
      },
    });
  } catch (error: any) {
    console.error('Error concluding vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
