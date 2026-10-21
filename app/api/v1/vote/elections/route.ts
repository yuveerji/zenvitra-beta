import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ELECTIONS, INITIAL_UNIVERSES, INITIAL_FACTIONS_AND_COUNCILS } from '@/lib/voting/votingData';
import { MultiversalElection } from '@/types/voting';

// In-memory / dynamic election registry for the platform
let electionsCache: MultiversalElection[] = [...INITIAL_ELECTIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universeId = searchParams.get('universeId');
    const state = searchParams.get('state');
    const mode = searchParams.get('mode');

    let filtered = [...electionsCache];

    if (universeId) {
      filtered = filtered.filter(e => e.universeId === universeId || !e.universeId);
    }
    if (state) {
      filtered = filtered.filter(e => e.state === state);
    }
    if (mode) {
      filtered = filtered.filter(e => e.mode === mode);
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      elections: filtered,
      universes: INITIAL_UNIVERSES,
      factionsAndCouncils: INITIAL_FACTIONS_AND_COUNCILS,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch elections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      summary,
      universeId,
      governanceLevel,
      mode,
      visibilityPreset,
      options,
      hybridRule,
      eligibleVoterCount = 1000,
      quorumNeededPercent = 50,
      isSecretBallot = true,
      commissionerHandle = 'commissioner.general',
      returningOfficerHandle = 'yuveer',
    } = body;

    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Valid title and at least two voting options are required' },
        { status: 400 }
      );
    }

    const newElection: MultiversalElection = {
      id: `elec-${Date.now()}`,
      electionCode: `ELEC-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      title,
      summary: summary || '',
      universeId,
      universeName: universeId ? INITIAL_UNIVERSES.find(u => u.id === universeId)?.name : 'Cross-Multiverse',
      governanceLevel: governanceLevel || 'COMMUNITY_CONSULTATION',
      mode: mode || 'MODE_A_INDIVIDUAL',
      state: 'DRAFT',
      visibilityPreset: visibilityPreset || 'OPEN_COUNT',
      charterVersion: 'CHARTER-2026.V1',
      options: options.map((opt: any, idx: number) => ({
        id: `opt-${idx}-${Date.now()}`,
        title: opt.title || opt,
        description: opt.description || '',
        votesCount: 0,
        percentage: 0,
      })),
      hybridRule,
      opensAt: new Date(Date.now() + 86400000).toISOString(),
      closesAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      eligibleVoterCount: Number(eligibleVoterCount) || 1000,
      votesCastCount: 0,
      quorumNeededPercent: Number(quorumNeededPercent) || 50,
      isQuorumMet: false,
      commissionerHandle,
      returningOfficerHandle,
      isCertified: false,
      outcomeStatus: 'PENDING_TALLY',
      isSecretBallot: Boolean(isSecretBallot),
      allowVoteChangeBeforeClose: false,
    };

    electionsCache.unshift(newElection);

    return NextResponse.json({
      success: true,
      message: 'Election Draft initialized in multiversal registry',
      election: newElection,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create election' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      electionId,
      voterRollSnapshot,
      isVoterRollFrozen,
      state,
      commissionerHandle,
    } = body;

    if (!electionId) {
      return NextResponse.json({ error: 'electionId is required' }, { status: 400 });
    }

    const index = electionsCache.findIndex(e => e.id === electionId);
    if (index === -1) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    const election = electionsCache[index];

    // If attempting to mutate roll while already frozen
    if (election.isVoterRollFrozen && voterRollSnapshot && isVoterRollFrozen !== false) {
      return NextResponse.json(
        { error: 'Voter roll is frozen and immutable under Article II' },
        { status: 403 }
      );
    }

    const updatedElection: MultiversalElection = {
      ...election,
      voterRollSnapshot: voterRollSnapshot !== undefined ? voterRollSnapshot : election.voterRollSnapshot,
      eligibleVoterCount: voterRollSnapshot ? voterRollSnapshot.length : election.eligibleVoterCount,
      isVoterRollFrozen: isVoterRollFrozen !== undefined ? isVoterRollFrozen : election.isVoterRollFrozen,
      frozenAt: isVoterRollFrozen ? new Date().toISOString() : (isVoterRollFrozen === false ? undefined : election.frozenAt),
      state: state || election.state,
    };

    electionsCache[index] = updatedElection;

    return NextResponse.json({
      success: true,
      message: 'Election roll updated successfully',
      election: updatedElection,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update election' }, { status: 500 });
  }
}
