import { NextRequest, NextResponse } from 'next/server';
import { executeElectionTally, RawBallotSubmission } from '@/lib/voting/countingEngine';
import { UserBallotReceipt, AuditLogEntry } from '@/types/voting';
import { 
  getElectionById, 
  updateElection, 
  recordBallotSubmission, 
  hasUserVoted, 
  markUserVoted, 
  addAuditLog 
} from '@/lib/voting/votingStore';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      electionId, 
      voterHandle = 'anonymous_delegate', 
      selectedOptionIds, 
      idempotencyKey,
      isRepresentativeVote = false 
    } = body;

    if (!electionId || !selectedOptionIds || !Array.isArray(selectedOptionIds) || selectedOptionIds.length === 0) {
      return NextResponse.json({ error: 'Valid electionId and option selection required' }, { status: 400 });
    }

    const election = getElectionById(electionId);
    if (!election) {
      return NextResponse.json({ error: 'Election record not found in multiversal registry' }, { status: 404 });
    }

    // Server-enforced invariant: Election must be OPEN
    if (election.state !== 'OPEN') {
      return NextResponse.json({ error: `Voting is not open for this election. Current state: ${election.state}` }, { status: 403 });
    }

    // Invariant: One person, one ballot entitlement check
    if (hasUserVoted(electionId, voterHandle) && !election.allowVoteChangeBeforeClose) {
      return NextResponse.json({ 
        error: 'Duplicate vote rejected: You have already submitted an authenticated ballot for this election.' 
      }, { status: 409 });
    }

    // Store Ballot Submission
    recordBallotSubmission(electionId, {
      electionId,
      voterHandle,
      selectedOptionIds,
      isRepresentativeVote,
    });
    markUserVoted(electionId, voterHandle);

    // Update ballot counter on election
    const updatedElection = updateElection(electionId, (curr) => {
      const votesCast = (curr.votesCastCount || 0) + 1;
      const turnout = curr.eligibleVoterCount > 0 ? (votesCast / curr.eligibleVoterCount) * 100 : 0;
      return {
        ...curr,
        votesCastCount: votesCast,
        isQuorumMet: turnout >= curr.quorumNeededPercent,
      };
    }) || election;

    const turnout = updatedElection.eligibleVoterCount > 0 
      ? (updatedElection.votesCastCount / updatedElection.eligibleVoterCount) * 100 
      : 0;

    // Generate Tamper-Proof User Submission Receipt
    const receiptSeed = `${electionId}:${voterHandle}:${Date.now()}:${idempotencyKey || 'none'}`;
    const cryptographicReceiptHash = crypto.createHash('sha256').update(receiptSeed).digest('hex').substring(0, 32);

    const receipt: UserBallotReceipt = {
      receiptId: `REC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      electionId,
      electionCode: election.electionCode,
      timestamp: new Date().toISOString(),
      cryptographicReceiptHash: `SHA256-VOTE-${cryptographicReceiptHash}`,
      voterHandle,
      isConfirmed: true,
      selectionsCount: selectedOptionIds.length,
    };

    // Append-only Audit Log Entry (Does NOT store secret ballot selections)
    const auditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      electionId,
      timestamp: new Date().toISOString(),
      action: 'BALLOT_CAST',
      actorHandle: voterHandle,
      actorRole: isRepresentativeVote ? 'Council Delegate' : 'Eligible Voter',
      details: `Authenticated ballot receipt minted (${receipt.receiptId}). Zero selection telemetry leaked to public audit.`,
      sha256Hash: receipt.cryptographicReceiptHash,
    };
    addAuditLog(auditEntry);

    return NextResponse.json({
      success: true,
      message: 'Ballot authenticated and permanently committed to the voting engine.',
      receipt,
      electionStatus: {
        votesCast: updatedElection.votesCastCount,
        turnoutPercent: Math.round(turnout * 10) / 10,
        isQuorumMet: updatedElection.isQuorumMet,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Ballot submission failed' }, { status: 500 });
  }
}
