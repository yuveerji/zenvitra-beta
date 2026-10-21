/**
 * Zenvitra Multiversal Voting Engine — Counting & Algorithmic Tally Services
 * Enforces mathematical algorithms for:
 * 1. Plurality / Single-Choice (Mode A, Mode B)
 * 2. Hybrid Chamber & Double-Majority (Mode E)
 * 3. Instant-Runoff Ranked Choice (Mode D)
 * 4. Approval & Configurable Yes/No/Abstain (Mode F)
 */

import { MultiversalElection, UserBallotReceipt, AuditLogEntry } from '@/types/voting';

export interface RawBallotSubmission {
  electionId: string;
  voterHandle: string;
  selectedOptionIds: string[]; // Ordered by preference if Ranked Choice
  universeAffiliation?: string;
  isRepresentativeVote?: boolean;
}

export interface TallyResult {
  totalBallots: number;
  validBallots: number;
  invalidBallots: number;
  optionCounts: Record<string, number>;
  optionPercentages: Record<string, number>;
  winnerOptionId?: string;
  isQuorumMet: boolean;
  outcomeStatus: 'PASSED' | 'REJECTED' | 'TIED' | 'QUORUM_UNMET';
  outcomeSummary: string;
  transferRoundsSummary?: string[];
  hybridMandateResult?: {
    individualSatisfied: boolean;
    universeCouncilSatisfied: boolean;
    overallApproved: boolean;
  };
}

/**
 * Executes a deterministic count of all submitted ballots according to the election's frozen rules.
 */
export function executeElectionTally(
  election: MultiversalElection,
  ballots: RawBallotSubmission[]
): TallyResult {
  const totalBallots = ballots.length;
  const validBallots = ballots.filter(b => b.selectedOptionIds && b.selectedOptionIds.length > 0).length;
  const invalidBallots = totalBallots - validBallots;

  // Check Quorum
  const turnoutPercent = election.eligibleVoterCount > 0 
    ? (validBallots / election.eligibleVoterCount) * 100 
    : 0;
  const isQuorumMet = turnoutPercent >= election.quorumNeededPercent;

  if (!isQuorumMet) {
    return {
      totalBallots,
      validBallots,
      invalidBallots,
      optionCounts: {},
      optionPercentages: {},
      isQuorumMet: false,
      outcomeStatus: 'QUORUM_UNMET',
      outcomeSummary: `Election failed to reach constitutional quorum: ${turnoutPercent.toFixed(1)}% turnout vs required ${election.quorumNeededPercent}%.`,
    };
  }

  // Route calculation based on voting mode
  switch (election.mode) {
    case 'MODE_D_RANKED_CHOICE':
      return calculateRankedChoiceTally(election, ballots, validBallots, invalidBallots);

    case 'MODE_E_HYBRID_CHAMBER':
      return calculateHybridChamberTally(election, ballots, validBallots, invalidBallots);

    case 'MODE_A_INDIVIDUAL':
    case 'MODE_B_UNIVERSE':
    case 'MODE_C_FACTION_COUNCIL':
    case 'MODE_F_CONFIGURABLE_POLL':
    default:
      return calculatePluralityTally(election, ballots, validBallots, invalidBallots);
  }
}

/**
 * Mode A, B, C, F: Plurality and Standard Percentage Counting
 */
function calculatePluralityTally(
  election: MultiversalElection,
  ballots: RawBallotSubmission[],
  validBallots: number,
  invalidBallots: number
): TallyResult {
  const optionCounts: Record<string, number> = {};
  election.options.forEach(o => { optionCounts[o.id] = 0; });

  ballots.forEach(b => {
    b.selectedOptionIds.forEach(optId => {
      if (optionCounts[optId] !== undefined) {
        optionCounts[optId]++;
      }
    });
  });

  const optionPercentages: Record<string, number> = {};
  let highestCount = -1;
  let winnerOptionId: string | undefined;
  let isTie = false;

  Object.entries(optionCounts).forEach(([optId, count]) => {
    const pct = validBallots > 0 ? (count / validBallots) * 100 : 0;
    optionPercentages[optId] = Math.round(pct * 10) / 10;

    if (count > highestCount) {
      highestCount = count;
      winnerOptionId = optId;
      isTie = false;
    } else if (count === highestCount && count > 0) {
      isTie = true;
    }
  });

  const winnerOption = election.options.find(o => o.id === winnerOptionId);
  const outcomeStatus = isTie ? 'TIED' : 'PASSED';
  const outcomeSummary = isTie 
    ? 'Election concluded in an exact tie between top candidates.' 
    : `Decided in favor of "${winnerOption?.title || 'Winning Option'}" with ${highestCount} votes (${optionPercentages[winnerOptionId || '']}%).`;

  return {
    totalBallots: ballots.length,
    validBallots,
    invalidBallots,
    optionCounts,
    optionPercentages,
    winnerOptionId: isTie ? undefined : winnerOptionId,
    isQuorumMet: true,
    outcomeStatus,
    outcomeSummary,
  };
}

/**
 * Mode E: Hybrid Double-Mandate (Individual Voters + Universe Representatives)
 */
function calculateHybridChamberTally(
  election: MultiversalElection,
  ballots: RawBallotSubmission[],
  validBallots: number,
  invalidBallots: number
): TallyResult {
  const rule = election.hybridRule || {
    individualPopularThresholdPercent: 60,
    universeCouncilThresholdNumerator: 3,
    universeCouncilThresholdDenominator: 5,
    requiresBothChambers: true,
    ruleDescription: 'Both chambers must approve.',
  };

  const individualBallots = ballots.filter(b => !b.isRepresentativeVote);
  const councilBallots = ballots.filter(b => b.isRepresentativeVote);

  // Individual chamber count (Yes vs No)
  let indYesCount = 0;
  individualBallots.forEach(b => {
    if (b.selectedOptionIds.includes('opt-ratify-yes') || b.selectedOptionIds.includes(election.options[0]?.id)) {
      indYesCount++;
    }
  });

  const indPercentYes = individualBallots.length > 0 
    ? (indYesCount / individualBallots.length) * 100 
    : 0;
  const indSatisfied = indPercentYes >= rule.individualPopularThresholdPercent;

  // Universe Council chamber count
  let councilYesCount = 0;
  councilBallots.forEach(b => {
    if (b.selectedOptionIds.includes('opt-ratify-yes') || b.selectedOptionIds.includes(election.options[0]?.id)) {
      councilYesCount++;
    }
  });

  const councilSatisfied = councilYesCount >= rule.universeCouncilThresholdNumerator;
  const overallApproved = rule.requiresBothChambers 
    ? (indSatisfied && councilSatisfied) 
    : (indSatisfied || councilSatisfied);

  const optionCounts: Record<string, number> = {
    [election.options[0]?.id || 'yes']: indYesCount + councilYesCount,
    [election.options[1]?.id || 'no']: (ballots.length - (indYesCount + councilYesCount)),
  };

  const optionPercentages: Record<string, number> = {
    [election.options[0]?.id || 'yes']: Math.round(indPercentYes * 10) / 10,
    [election.options[1]?.id || 'no']: Math.round((100 - indPercentYes) * 10) / 10,
  };

  const outcomeStatus = overallApproved ? 'PASSED' : 'REJECTED';
  const outcomeSummary = overallApproved
    ? `Hybrid Referendum PASSED. Popular mandate met (${indPercentYes.toFixed(1)}% >= ${rule.individualPopularThresholdPercent}%) AND Universe Council mandate satisfied (${councilYesCount}/${rule.universeCouncilThresholdDenominator} >= ${rule.universeCouncilThresholdNumerator}).`
    : `Hybrid Referendum FAILED. ${!indSatisfied ? `Popular threshold of ${rule.individualPopularThresholdPercent}% was not met (${indPercentYes.toFixed(1)}%). ` : ''}${!councilSatisfied ? `Council threshold of ${rule.universeCouncilThresholdNumerator} universes was not met (${councilYesCount} received).` : ''}`;

  return {
    totalBallots: ballots.length,
    validBallots,
    invalidBallots,
    optionCounts,
    optionPercentages,
    winnerOptionId: overallApproved ? election.options[0]?.id : election.options[1]?.id,
    isQuorumMet: true,
    outcomeStatus,
    outcomeSummary,
    hybridMandateResult: {
      individualSatisfied: indSatisfied,
      universeCouncilSatisfied: councilSatisfied,
      overallApproved,
    },
  };
}

/**
 * Mode D: Instant-Runoff Ranked Choice Algorithm with Elimination Rounds & Vote Transfers
 */
function calculateRankedChoiceTally(
  election: MultiversalElection,
  ballots: RawBallotSubmission[],
  validBallots: number,
  invalidBallots: number
): TallyResult {
  const transferRoundsSummary: string[] = [];
  let remainingOptions = election.options.map(o => o.id);
  const activeBallots = ballots.map(b => [...b.selectedOptionIds]); // clone preferences

  let roundNum = 1;
  let winnerOptionId: string | undefined;

  while (remainingOptions.length > 1 && !winnerOptionId) {
    // Count first-choice votes among remaining options
    const roundCounts: Record<string, number> = {};
    remainingOptions.forEach(id => { roundCounts[id] = 0; });

    activeBallots.forEach(prefs => {
      // Find highest ranked preference still in the race
      const topChoice = prefs.find(p => remainingOptions.includes(p));
      if (topChoice) {
        roundCounts[topChoice]++;
      }
    });

    // Check for 50% majority
    let roundLeaderId = remainingOptions[0];
    let maxVotes = -1;
    let minVotes = Infinity;
    let lowestOptionId = remainingOptions[0];

    remainingOptions.forEach(optId => {
      const v = roundCounts[optId] || 0;
      if (v > maxVotes) {
        maxVotes = v;
        roundLeaderId = optId;
      }
      if (v < minVotes) {
        minVotes = v;
        lowestOptionId = optId;
      }
    });

    const majorityNeeded = Math.floor(validBallots / 2) + 1;
    transferRoundsSummary.push(
      `Round ${roundNum}: Leader is "${election.options.find(o => o.id === roundLeaderId)?.title}" with ${maxVotes} votes (${((maxVotes / validBallots) * 100).toFixed(1)}%). Majority needed: ${majorityNeeded}.`
    );

    if (maxVotes >= majorityNeeded) {
      winnerOptionId = roundLeaderId;
      transferRoundsSummary.push(`Winner secured absolute majority in Round ${roundNum}!`);
      break;
    }

    // Eliminate lowest candidate and transfer votes
    transferRoundsSummary.push(
      `Eliminating "${election.options.find(o => o.id === lowestOptionId)?.title}" with lowest count (${minVotes} votes). Transferring second preferences...`
    );
    remainingOptions = remainingOptions.filter(id => id !== lowestOptionId);
    roundNum++;
  }

  // If 1 candidate left
  if (!winnerOptionId && remainingOptions.length === 1) {
    winnerOptionId = remainingOptions[0];
  }

  const winnerOption = election.options.find(o => o.id === winnerOptionId);

  return {
    totalBallots: ballots.length,
    validBallots,
    invalidBallots,
    optionCounts: {},
    optionPercentages: {},
    winnerOptionId,
    isQuorumMet: true,
    outcomeStatus: 'PASSED',
    outcomeSummary: `Ranked-Choice outcome certified for "${winnerOption?.title}" following ${roundNum} elimination rounds.`,
    transferRoundsSummary,
  };
}
