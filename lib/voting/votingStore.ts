import { MultiversalElection, AuditLogEntry } from '@/types/voting';
import { RawBallotSubmission } from './countingEngine';

/**
 * Shared In-Memory Store for ZENVITRA Multiversal Voting
 * Clean state by default: zero seeded elections, zero mock ballots.
 */

const electionsStore: MultiversalElection[] = [];
const submittedBallotsMap = new Map<string, RawBallotSubmission[]>();
const userVotedEntitlements = new Set<string>(); // "electionId:userHandle"
const auditLogsStore: AuditLogEntry[] = [];

export function getAllElections(): MultiversalElection[] {
  return electionsStore;
}

export function getElectionById(id: string): MultiversalElection | undefined {
  return electionsStore.find(e => e.id === id);
}

export function addElection(election: MultiversalElection): void {
  electionsStore.unshift(election);
}

export function updateElection(id: string, updater: (e: MultiversalElection) => MultiversalElection): MultiversalElection | null {
  const index = electionsStore.findIndex(e => e.id === id);
  if (index === -1) return null;
  const updated = updater(electionsStore[index]);
  electionsStore[index] = updated;
  return updated;
}

export function getSubmittedBallots(electionId: string): RawBallotSubmission[] {
  return submittedBallotsMap.get(electionId) || [];
}

export function recordBallotSubmission(electionId: string, ballot: RawBallotSubmission): void {
  const current = submittedBallotsMap.get(electionId) || [];
  current.push(ballot);
  submittedBallotsMap.set(electionId, current);
}

export function hasUserVoted(electionId: string, handle: string): boolean {
  return userVotedEntitlements.has(`${electionId}:${handle.toLowerCase()}`);
}

export function markUserVoted(electionId: string, handle: string): void {
  userVotedEntitlements.add(`${electionId}:${handle.toLowerCase()}`);
}

export function addAuditLog(entry: AuditLogEntry): void {
  auditLogsStore.unshift(entry);
}

export function getAuditLogs(electionId?: string): AuditLogEntry[] {
  if (electionId) {
    return auditLogsStore.filter(a => a.electionId === electionId);
  }
  return auditLogsStore;
}
