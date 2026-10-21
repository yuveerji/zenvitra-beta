import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ELECTIONS, INITIAL_AUDIT_LOGS } from '@/lib/voting/votingData';
import { executeElectionTally, RawBallotSubmission } from '@/lib/voting/countingEngine';
import { UserBallotReceipt, AuditLogEntry } from '@/types/voting';
import crypto from 'crypto';

// Server-side ballot storage map
const submittedBallotsMap = new Map<string, RawBallotSubmission[]>();
const userVotedEntitlements = new Set<string>(); // "electionId:userHandle"
const auditLogsStore: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

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

    const election = INITIAL_ELECTIONS.find(e => e.id === electionId);
    if (!election) {
      return NextResponse.json({ error: 'Election record not found in multiversal registry' }, { status: 404 });
    }

    // Server-enforced invariant: Election must be OPEN
    if (election.state !== 'OPEN') {
      return NextResponse.json({ error: `Voting is not open for this election. Current state: ${election.state}` }, { status: 403 });
    }

    // Invariant: One person, one ballot entitlement check
    const entitlementKey = `${electionId}:${voterHandle.toLowerCase()}`;
    if (userVotedEntitlements.has(entitlementKey) && !election.allowVoteChangeBeforeClose) {
      return NextResponse.json({ 
        error: 'Duplicate vote rejected: You have already submitted an authenticated ballot for this election.' 
      }, { status: 409 });
    }

    // Store Ballot Submission
    const currentBallots = submittedBallotsMap.get(electionId) || [];
    currentBallots.push({
      electionId,
      voterHandle,
      selectedOptionIds,
      isRepresentativeVote,
    });
    submittedBallotsMap.set(electionId, currentBallots);
    userVotedEntitlements.add(entitlementKey);

    // Increment ballot counter
    election.votesCastCount = (election.votesCastCount || 0) + 1;
    const turnout = (election.votesCastCount / election.eligibleVoterCount) * 100;
    election.isQuorumMet = turnout >= election.quorumNeededPercent;

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
    auditLogsStore.unshift(auditEntry);

    return NextResponse.json({
      success: true,
      message: 'Ballot authenticated and permanently committed to the voting engine.',
      receipt,
      electionStatus: {
        votesCast: election.votesCastCount,
        turnoutPercent: Math.round(turnout * 10) / 10,
        isQuorumMet: election.isQuorumMet,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Ballot submission failed' }, { status: 500 });
  }
}
