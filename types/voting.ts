/**
 * ZENVITRA MULTIVERSAL VOTING SYSTEM — PRODUCT BLUEPRINT V1.0
 * Types & Domain Specifications
 */

export type VotingMode = 
  | 'MODE_A_INDIVIDUAL'     // 1 Person = 1 Eligible Ballot
  | 'MODE_B_UNIVERSE'       // Defined vote/weight exercised by authorized representative
  | 'MODE_C_FACTION_COUNCIL'// Member vote within faction or council
  | 'MODE_D_RANKED_CHOICE'  // Instant-Runoff / Ranked preferences
  | 'MODE_E_HYBRID_CHAMBER' // Popular vote + Universe Council double-mandate
  | 'MODE_F_CONFIGURABLE_POLL'; // Yes/No/Abstain, single-choice, multiple-choice, scale

export interface VoterRollEntry {
  id: string;
  voterHandle: string;
  fullName: string;
  universeAffiliation?: string;
  roleScope: 'INDIVIDUAL_VOTER' | 'COUNCIL_DELEGATE' | 'UNIVERSE_GOVERNOR' | 'RETURNING_OFFICER';
  mandateWeight: number; // Defaults to 1.0
  isEntitled: boolean;
  hasVoted: boolean;
  enrolledAt: string;
}

export type ResultVisibilityPreset = 
  | 'OPEN_COUNT'        // Live totals during voting, final tally after close
  | 'SECRET_BALLOT'      // Participation totals only during voting, results revealed after verification
  | 'DELAYED_REVEAL'    // Turnout updates during, full results after close
  | 'MULTI_CHAMBER'     // Each chamber's statistics separate, combined outcome calculated
  | 'CONFIDENTIAL'      // Restricted election metadata, results for authorized officers only
  | 'LIVE_COMMUNITY';   // Live percentages & totals open to all

export type ElectionLifecycleState = 
  | 'DRAFT'         // 01: Configure rules, options & charter
  | 'REVIEW'        // 02: Validate charter, eligibility & dual approvals
  | 'SCHEDULED'     // 03: Freeze configuration, locks voter roll snapshot
  | 'OPEN'          // 04: Accepting valid ballots
  | 'CLOSED'        // 05: Reject new submissions
  | 'TALLYING'      // 06: Validate ballots & execute counting algorithm
  | 'VERIFICATION'  // 07: Reconcile counts, quorum & chamber mandates
  | 'CERTIFIED'     // 08: Authorized officer signs off
  | 'PUBLISHED'     // 09: Release certified results per visibility rules
  | 'CHALLENGED'    // Procedural dispute filed
  | 'SUSPENDED';    // Emergency safety pause

export interface UniverseGovernanceSpace {
  id: string;
  name: string;
  slug: string;
  description: string;
  charterVersion: string;
  charterPreamble: string;
  governorHandle: string;
  councilCount: number;
  factionsCount: number;
  totalVoters: number;
  badgeColor: string;
  universeWeight: number; // For Mode B / Mode E representation
}

export interface FactionOrCouncil {
  id: string;
  universeId: string;
  universeName: string;
  name: string;
  type: 'FACTION' | 'COUNCIL';
  mandateDescription: string;
  seats: number;
  chairHandle: string;
  membersCount: number;
}

export interface BallotOption {
  id: string;
  title: string;
  description?: string;
  universeAffiliation?: string;
  faction?: string;
  votesCount?: number; // Shown only if visibility permits
  percentage?: number;
}

export interface HybridMandateRule {
  individualPopularThresholdPercent: number; // e.g. 60%
  universeCouncilThresholdNumerator: number; // e.g. 3
  universeCouncilThresholdDenominator: number; // e.g. 5
  ruleDescription: string;
  requiresBothChambers: boolean;
}

export interface MultiversalElection {
  id: string;
  electionCode: string; // e.g. "ELEC-2026-UNIV-004"
  title: string;
  summary: string;
  universeId?: string; // If universe-scoped, or null for cross-multiverse
  universeName?: string;
  governanceLevel: 'MULTIVERSE_REFERENDUM' | 'UNIVERSE_ASSEMBLY' | 'COUNCIL_CHAMBER' | 'COMMUNITY_CONSULTATION';
  mode: VotingMode;
  state: ElectionLifecycleState;
  visibilityPreset: ResultVisibilityPreset;
  charterVersion: string;
  options: BallotOption[];
  hybridRule?: HybridMandateRule;
  
  // Timing
  opensAt: string;
  closesAt: string;
  publishedAt?: string;

  // Quorum & Suffrage
  eligibleVoterCount: number;
  votesCastCount: number;
  quorumNeededPercent: number;
  isQuorumMet: boolean;
  voterRollSnapshot?: VoterRollEntry[];
  isVoterRollFrozen?: boolean;
  frozenAt?: string;

  // Authorities
  commissionerHandle: string;
  returningOfficerHandle: string;
  certifiedAt?: string;
  certificationSignoffHash?: string;

  // Tally & Outcome
  isCertified: boolean;
  outcomeStatus?: 'PASSED' | 'REJECTED' | 'TIED' | 'QUORUM_UNMET' | 'PENDING_TALLY';
  outcomeSummary?: string;
  transferRoundsSummary?: string[]; // For Ranked Choice Mode D
  individualMandateResult?: {
    yesCount: number;
    totalValidVotes: number;
    percentYes: number;
    isSatisfied: boolean;
  };
  universeCouncilMandateResult?: {
    yesUniverses: number;
    totalUniverses: number;
    isSatisfied: boolean;
  };

  // Secrecy & Security
  isSecretBallot: boolean;
  allowVoteChangeBeforeClose: boolean;
  maxSelectionsAllowed?: number; // For multi-select Mode F
}

export interface UserBallotReceipt {
  receiptId: string;
  electionId: string;
  electionCode: string;
  timestamp: string;
  cryptographicReceiptHash: string;
  voterHandle: string;
  isConfirmed: boolean;
  selectionsCount: number;
  // Note: For secret ballots, option selections are NOT stored on the public receipt
}

export interface AuditLogEntry {
  id: string;
  electionId: string;
  timestamp: string;
  action: 'ELECTION_CREATED' | 'RULES_FROZEN' | 'VOTING_OPENED' | 'BALLOT_CAST' | 'VOTING_CLOSED' | 'TALLY_COMPLETED' | 'TALLY_CERTIFIED' | 'CHALLENGE_FILED' | 'EMERGENCY_SUSPENDED';
  actorHandle: string;
  actorRole: string;
  details: string;
  sha256Hash: string;
}
