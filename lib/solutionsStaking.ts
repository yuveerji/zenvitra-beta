/**
 * Sovereign Legislative Bill Staking & Passport Points Engine
 * Part of ZENVITRA Solutions & ZEN.PASSPORT Architecture
 * 
 * Rules:
 * 1. Zero-Vote Fallback: Render neutral bar + muted "No votes" label when totalVotes === 0.
 * 2. Vote & Earn: Voting on bills earns Passport Points (+25 PTS) upon passage.
 * 3. Staking (Bet Your Points): Users stake Passport Points on bill outcomes with dynamic multipliers (1.0x - 1.5x+) based on vote quality.
 * 4. Modular Redemption: Clean hook / placeholder for redeeming Passport Points for sovereign rewards.
 */

import { SolutionDocument } from '@/types/solutions';
import { getOrCreateDefaultPassport, calculateZenPoints, savePassport, ZenPassport } from '@/lib/passport';

export interface BillStakeRecord {
  id: string;
  documentId: string;
  documentTitle: string;
  username: string;
  stakedOutcome: 'PASS' | 'FAIL';
  pointsStaked: number;
  multiplier: number;
  projectedPayout: number;
  reasoning?: string;
  hasSourceBacking?: boolean;
  status: 'ACTIVE' | 'WON' | 'LOST' | 'REFUNDED';
  createdAt: string;
  settledAt?: string;
}

export interface MultiplierBreakdown {
  label: string;
  boost: number;
  active: boolean;
}

const STAKES_STORAGE_KEY = 'zenvitra_bill_stakes_v1';
const VOTE_EARNINGS_STORAGE_KEY = 'zenvitra_bill_vote_earnings_v1';

/**
 * Returns all stakes from local storage
 */
export function getAllStakes(): BillStakeRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STAKES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse bill stakes', e);
    return [];
  }
}

/**
 * Saves all stakes to local storage
 */
export function saveAllStakes(stakes: BillStakeRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STAKES_STORAGE_KEY, JSON.stringify(stakes));
  } catch (e) {
    console.error('Failed to save bill stakes', e);
  }
}

/**
 * Retrieves the available Passport Points balance for a user.
 * Combines passport base points + active stake deductions/winnings.
 */
export function getUserPassportPoints(username: string, fullName?: string): number {
  if (typeof window === 'undefined') return 100;
  const clean = (username || 'yuveer').toLowerCase().replace(/^@/, '').trim();
  const passport = getOrCreateDefaultPassport(clean, fullName);
  const basePoints = calculateZenPoints(passport);

  // If new user with no achievements yet, guarantee a base diplomatic allotment of 100 PTS for civic participation
  const effectiveBase = Math.max(100, basePoints);

  // Deduct active stakes that are still in flight
  const allStakes = getAllStakes().filter(s => s.username === clean && s.status === 'ACTIVE');
  const lockedPoints = allStakes.reduce((acc, s) => acc + s.pointsStaked, 0);

  return Math.max(0, effectiveBase - lockedPoints);
}

/**
 * Calculates dynamic reward multiplier (1.0x to 1.5x+) based on vote quality:
 * - Consensus weight (quorum / contested chamber debate)
 * - Reasoning depth (substantive rationale or clause debates)
 * - Source backing (official draft or verified citations)
 */
export function calculateDynamicMultiplier(
  doc: SolutionDocument,
  userReasoning: string = '',
  hasSourceBacking: boolean = false
): { multiplier: number; breakdown: MultiplierBreakdown[] } {
  const base = 1.0;
  const breakdown: MultiplierBreakdown[] = [];

  // 1. Consensus Weight: Active chamber participation
  const totalVotes = (doc.votes?.inFavor || 0) + (doc.votes?.against || 0) + (doc.votes?.abstain || 0);
  const hasQuorum = totalVotes >= 3;
  const consensusBoost = hasQuorum ? 0.15 : 0.05;
  breakdown.push({
    label: hasQuorum ? 'Chamber Quorum Consensus (+0.15x)' : 'Base Floor Participation (+0.05x)',
    boost: consensusBoost,
    active: totalVotes > 0
  });

  // 2. Reasoning Depth: Rationale length and clause discussions
  const totalDebates = doc.clauses.reduce((acc, c) => acc + (c.discussions?.length || 0), 0);
  const userReasoningLong = userReasoning.trim().length >= 25;
  let reasoningBoost = 0;
  if (userReasoningLong && totalDebates > 0) {
    reasoningBoost = 0.20;
  } else if (userReasoningLong || totalDebates > 0) {
    reasoningBoost = 0.10;
  }
  breakdown.push({
    label: 'Reasoning Depth & Debate Backing (+0.20x max)',
    boost: reasoningBoost,
    active: reasoningBoost > 0
  });

  // 3. Source Backing: Official draft, treaty, or verified sponsors
  const isVerifiedDoc = Boolean(doc.isOfficial || hasSourceBacking || (doc.leadSponsors && doc.leadSponsors.length > 1));
  const sourceBoost = isVerifiedDoc ? 0.15 : 0;
  breakdown.push({
    label: 'Verified Source / Committee Backing (+0.15x)',
    boost: sourceBoost,
    active: isVerifiedDoc
  });

  // Compute final multiplier clamped between 1.0x and 1.75x
  const totalBoost = consensusBoost + reasoningBoost + sourceBoost;
  const rawMultiplier = base + totalBoost;
  const finalMultiplier = Math.round(Math.min(1.75, Math.max(1.0, rawMultiplier)) * 100) / 100;

  return {
    multiplier: finalMultiplier,
    breakdown
  };
}

/**
 * Returns active or past stake for a specific user and document
 */
export function getUserStakeForDocument(username: string, documentId: string): BillStakeRecord | null {
  const clean = (username || '').toLowerCase().replace(/^@/, '').trim();
  const allStakes = getAllStakes();
  return allStakes.find(s => s.username === clean && s.documentId === documentId && s.status === 'ACTIVE') || null;
}

/**
 * Places a stake on a bill outcome using Passport Points
 */
export function placeBillStake(
  username: string,
  doc: SolutionDocument,
  params: {
    outcome: 'PASS' | 'FAIL';
    points: number;
    reasoning?: string;
    hasSourceBacking?: boolean;
  }
): BillStakeRecord {
  const clean = (username || 'yuveer').toLowerCase().replace(/^@/, '').trim();
  const available = getUserPassportPoints(clean);

  if (params.points <= 0) {
    throw new Error('Stake amount must be greater than zero.');
  }

  if (params.points > available) {
    throw new Error(`Insufficient Passport Points. Available: ${available} PTS.`);
  }

  const { multiplier } = calculateDynamicMultiplier(doc, params.reasoning, params.hasSourceBacking);
  const projectedPayout = Math.round(params.points * multiplier);

  const newStake: BillStakeRecord = {
    id: `stake_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    documentId: doc.id,
    documentTitle: doc.title,
    username: clean,
    stakedOutcome: params.outcome,
    pointsStaked: params.points,
    multiplier,
    projectedPayout,
    reasoning: params.reasoning?.trim() || undefined,
    hasSourceBacking: params.hasSourceBacking || false,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  const allStakes = getAllStakes().filter(s => !(s.username === clean && s.documentId === doc.id && s.status === 'ACTIVE'));
  allStakes.push(newStake);
  saveAllStakes(allStakes);

  return newStake;
}

/**
 * Settles a bill stake based on the bill's current vote outcome.
 * If inFavor > against => outcome is PASS
 * If against >= inFavor => outcome is FAIL
 */
export function settleBillStake(
  username: string,
  doc: SolutionDocument
): { settled: boolean; won: boolean; payout: number; stake: BillStakeRecord | null } {
  const clean = (username || 'yuveer').toLowerCase().replace(/^@/, '').trim();
  const allStakes = getAllStakes();
  const stakeIndex = allStakes.findIndex(s => s.username === clean && s.documentId === doc.id && s.status === 'ACTIVE');

  if (stakeIndex === -1) {
    return { settled: false, won: false, payout: 0, stake: null };
  }

  const stake = allStakes[stakeIndex];
  const totalVotes = (doc.votes?.inFavor || 0) + (doc.votes?.against || 0);
  if (totalVotes === 0) {
    return { settled: false, won: false, payout: 0, stake };
  }

  const billPassed = (doc.votes?.inFavor || 0) > (doc.votes?.against || 0);
  const userWon = (stake.stakedOutcome === 'PASS' && billPassed) || (stake.stakedOutcome === 'FAIL' && !billPassed);

  stake.status = userWon ? 'WON' : 'LOST';
  stake.settledAt = new Date().toISOString();
  allStakes[stakeIndex] = stake;
  saveAllStakes(allStakes);

  if (userWon) {
    // Credit winning net gain to the user's passport
    try {
      const passport = getOrCreateDefaultPassport(clean);
      const netGain = Math.max(1, stake.projectedPayout - stake.pointsStaked);
      passport.contributions = passport.contributions || [];
      passport.contributions.push({
        id: `stake_win_${Date.now()}`,
        title: `Civic Bill Staking Return: ${doc.title.slice(0, 40)}`,
        initiative: `Won ${stake.stakedOutcome} outcome with ${stake.multiplier}x quality multiplier.`,
        type: 'Open Source Tooling',
        date: new Date().toISOString().split('T')[0],
        isVerified: true,
        pointsEarned: netGain
      });
      savePassport(passport);
    } catch (e) {
      console.error('Failed to credit stake winnings to passport', e);
    }
  }

  return {
    settled: true,
    won: userWon,
    payout: userWon ? stake.projectedPayout : 0,
    stake
  };
}

/**
 * Records that a user voted on a bill for the "Vote & Earn" mechanism.
 * When a bill passes, participating voters earn +25 Passport Points.
 */
export function recordVoteAndEarn(
  username: string,
  doc: SolutionDocument,
  voteType: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN'
): { pointsAwarded: number; message: string } {
  const clean = (username || 'yuveer').toLowerCase().replace(/^@/, '').trim();
  
  if (typeof window === 'undefined') {
    return { pointsAwarded: 0, message: 'Vote registered.' };
  }

  try {
    const raw = localStorage.getItem(VOTE_EARNINGS_STORAGE_KEY) || '{}';
    const earnings: Record<string, { [docId: string]: boolean }> = JSON.parse(raw);
    
    if (!earnings[clean]) earnings[clean] = {};

    // Check if the bill passed (Aye > Against)
    const inFavor = doc.votes?.inFavor || 0;
    const against = doc.votes?.against || 0;
    const billPassed = inFavor > against;

    if (billPassed && !earnings[clean][doc.id]) {
      earnings[clean][doc.id] = true;
      localStorage.setItem(VOTE_EARNINGS_STORAGE_KEY, JSON.stringify(earnings));

      // Credit +25 Passport Points to the user's sovereign passport ledger
      const passport = getOrCreateDefaultPassport(clean);
      passport.contributions = passport.contributions || [];
      passport.contributions.push({
        id: `vote_earn_${doc.id}_${Date.now()}`,
        title: `Chamber Vote Participated: ${doc.title.slice(0, 40)}`,
        initiative: `Cast verified ${voteType} vote on enacted civic legislation.`,
        type: 'Dais Support',
        date: new Date().toISOString().split('T')[0],
        isVerified: true,
        pointsEarned: 25
      });
      savePassport(passport);

      return {
        pointsAwarded: 25,
        message: '🎉 +25 Passport Points earned! Credited to your sovereign passport.'
      };
    }
  } catch (e) {
    console.warn('Failed to record vote earnings', e);
  }

  return {
    pointsAwarded: 0,
    message: 'Vote recorded on sovereign ledger. Points awarded upon bill passage.'
  };
}
