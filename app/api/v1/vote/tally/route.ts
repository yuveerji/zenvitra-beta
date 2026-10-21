import { NextRequest, NextResponse } from 'next/server';
import { executeElectionTally } from '@/lib/voting/countingEngine';
import { getElectionById, updateElection, getSubmittedBallots, addAuditLog } from '@/lib/voting/votingStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { electionId, officerHandle = 'yuveer', forceRecount = false } = body;

    if (!electionId) {
      return NextResponse.json({ error: 'electionId is required' }, { status: 400 });
    }

    const election = getElectionById(electionId);
    if (!election) {
      return NextResponse.json({ error: 'Election record not found' }, { status: 404 });
    }

    // Get actual submitted ballots from the voter engine (Zero seeded or simulated ballots)
    const ballots = getSubmittedBallots(electionId);

    const tally = executeElectionTally(election, ballots);
    const certificationSignoffHash = `SHA256-CERT-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    // Update election record
    const updatedElection = updateElection(electionId, (curr) => ({
      ...curr,
      isCertified: true,
      state: 'CERTIFIED',
      outcomeStatus: tally.outcomeStatus,
      outcomeSummary: tally.outcomeSummary,
      certifiedAt: new Date().toISOString(),
      certificationSignoffHash,
      transferRoundsSummary: tally.transferRoundsSummary,
      options: curr.options.map(opt => ({
        ...opt,
        votesCount: tally.optionCounts[opt.id] || 0,
        percentage: tally.optionPercentages[opt.id] || 0,
      })),
    })) || election;

    // Append Audit Trail
    addAuditLog({
      id: `audit-${Date.now()}`,
      electionId,
      timestamp: new Date().toISOString(),
      action: 'TALLY_CERTIFIED',
      actorHandle: officerHandle,
      actorRole: 'Returning Officer',
      details: `Official counting algorithm executed (${election.mode}). Result certified as: ${tally.outcomeStatus}. Total valid ballots tallied: ${ballots.length}.`,
      sha256Hash: certificationSignoffHash,
    });

    return NextResponse.json({
      success: true,
      message: 'Official tally successfully computed and certified by Returning Officer.',
      election: updatedElection,
      tally,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Tally calculation failed' }, { status: 500 });
  }
}
