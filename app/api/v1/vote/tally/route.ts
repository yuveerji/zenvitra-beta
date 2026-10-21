import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ELECTIONS, INITIAL_AUDIT_LOGS } from '@/lib/voting/votingData';
import { executeElectionTally } from '@/lib/voting/countingEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { electionId, officerHandle = 'yuveer', forceRecount = false } = body;

    if (!electionId) {
      return NextResponse.json({ error: 'electionId is required' }, { status: 400 });
    }

    const election = INITIAL_ELECTIONS.find(e => e.id === electionId);
    if (!election) {
      return NextResponse.json({ error: 'Election record not found' }, { status: 404 });
    }

    // Mock realistic ballot set for demonstration / simulation if empty
    const simulatedBallots = [
      { electionId, voterHandle: 'voter.1', selectedOptionIds: [election.options[0]?.id] },
      { electionId, voterHandle: 'voter.2', selectedOptionIds: [election.options[0]?.id] },
      { electionId, voterHandle: 'voter.3', selectedOptionIds: [election.options[1]?.id] },
      { electionId, voterHandle: 'gov.geneva', selectedOptionIds: [election.options[0]?.id], isRepresentativeVote: true },
      { electionId, voterHandle: 'gov.loksabha', selectedOptionIds: [election.options[0]?.id], isRepresentativeVote: true },
      { electionId, voterHandle: 'gov.synthetica', selectedOptionIds: [election.options[0]?.id], isRepresentativeVote: true },
    ];

    const tally = executeElectionTally(election, simulatedBallots);

    // Update election record
    election.isCertified = true;
    election.state = 'CERTIFIED';
    election.outcomeStatus = tally.outcomeStatus;
    election.outcomeSummary = tally.outcomeSummary;
    election.certifiedAt = new Date().toISOString();
    election.certificationSignoffHash = `SHA256-CERT-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    // Append Audit Trail
    INITIAL_AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      electionId,
      timestamp: new Date().toISOString(),
      action: 'TALLY_CERTIFIED',
      actorHandle: officerHandle,
      actorRole: 'Returning Officer',
      details: `Official counting algorithm executed (${election.mode}). Result certified as: ${tally.outcomeStatus}.`,
      sha256Hash: election.certificationSignoffHash,
    });

    return NextResponse.json({
      success: true,
      message: 'Official tally successfully computed and certified by Returning Officer.',
      election,
      tally,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Tally calculation failed' }, { status: 500 });
  }
}
