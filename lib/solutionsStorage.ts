import fs from 'fs';
import path from 'path';
import { SolutionDocument, ClauseAmendment, ClauseDiscussion } from '@/types/solutions';
import { SAMPLE_DRAFTS } from './docEngine/sampleDrafts';
import { parseDocument } from './docEngine/parser';

const SOLUTIONS_DIR = path.join(process.cwd(), 'data', 'solutions');
const SOLUTIONS_FILE = path.join(SOLUTIONS_DIR, 'solutions_registry.json');

function ensureDir() {
  if (!fs.existsSync(SOLUTIONS_DIR)) {
    fs.mkdirSync(SOLUTIONS_DIR, { recursive: true });
  }
}

/**
 * Creates initial official sample bills
 */
function getBaselineDocuments(): SolutionDocument[] {
  const sample = SAMPLE_DRAFTS[0];
  if (!sample) return [];
  const parsed = parseDocument(sample.rawText, 'LEGISLATIVE_BILL');
  return [{
    id: 'doc_coaching_institutes_2026',
    documentCode: 'BILL-2026-COACH-REG',
    title: parsed.title,
    documentType: 'LEGISLATIVE_BILL',
    category: 'EDUCATION',
    committee: 'Parliament of India / Lok Sabha Standing Committee',
    status: 'PROPOSED',
    leadSponsors: ['Hon. Member of Parliament', 'Youth Education Caucus'],
    proposedByUsername: 'parliament_caucus',
    signatories: ['Aarav Mehta', 'Diya Sen', 'Vikramaditya Roy'],
    abstract: parsed.preamble || 'A Bill to provide for mandatory registration, academic regulation, mental health counselors, fee transparency, and holistic student welfare standards in private coaching institutes across India.',
    enactingFormula: parsed.enactingFormula,
    preamble: parsed.preamble,
    chapters: parsed.chapters,
    clauses: parsed.clauses.map(c => ({
      ...c,
      discussions: c.clauseNumber === '7' ? [
        {
          id: 'disc_1',
          author: 'Delegate of Education Policy',
          authorUsername: 'yuveer',
          text: 'Clause 7 must mandate an independent student grievance ombudsman appointed outside institute management.',
          createdAt: new Date().toISOString()
        }
      ] : []
    })),
    votes: {
      inFavor: 142,
      against: 18,
      abstain: 9
    },
    votedUserIds: ['user_yuveer', 'user_arjun'],
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-24T12:00:00Z',
    isOfficial: true
  }];
}

/**
 * Loads all solutions from server storage
 */
export function getAllServerDocuments(includeTest = false): SolutionDocument[] {
  try {
    ensureDir();
    if (fs.existsSync(SOLUTIONS_FILE)) {
      const content = fs.readFileSync(SOLUTIONS_FILE, 'utf-8');
      const list: SolutionDocument[] = JSON.parse(content);
      if (Array.isArray(list) && list.length > 0) {
        if (!includeTest) {
          return list.filter((d: any) => !d.isTest && d.proposedByUsername !== 'test');
        }
        return list;
      }
    }
    const baseline = getBaselineDocuments();
    saveAllServerDocuments(baseline);
    return baseline;
  } catch (err) {
    console.warn('[SOLUTIONS-STORAGE-READ-ERROR]', err);
    return getBaselineDocuments();
  }
}

/**
 * Saves all documents to server disk
 */
export function saveAllServerDocuments(docs: SolutionDocument[]): void {
  try {
    ensureDir();
    fs.writeFileSync(SOLUTIONS_FILE, JSON.stringify(docs, null, 2), 'utf-8');
  } catch (err) {
    console.error('[SOLUTIONS-STORAGE-WRITE-ERROR]', err);
  }
}

/**
 * Retrieves a single document by ID
 */
export function getServerDocumentById(id: string): SolutionDocument | null {
  const all = getAllServerDocuments(true);
  return all.find(d => d.id === id) || null;
}

/**
 * Creates or updates a solution document
 */
export function saveServerDocument(doc: SolutionDocument): SolutionDocument {
  doc.updatedAt = new Date().toISOString();
  if (!doc.createdAt) doc.createdAt = doc.updatedAt;

  const all = getAllServerDocuments(true);
  const index = all.findIndex(d => d.id === doc.id);

  if (index >= 0) {
    all[index] = { ...all[index], ...doc };
  } else {
    all.unshift(doc);
  }

  saveAllServerDocuments(all);
  return doc;
}

/**
 * Records a vote on a document
 */
export function voteServerDocument(
  docId: string,
  voteType: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN',
  userId: string
): SolutionDocument | null {
  const all = getAllServerDocuments(true);
  const doc = all.find(d => d.id === docId);
  if (!doc) return null;

  if (!doc.votes) {
    doc.votes = { inFavor: 0, against: 0, abstain: 0 };
  }
  if (!doc.votedUserIds) {
    doc.votedUserIds = [];
  }

  // Prevent duplicate voting by same user
  if (doc.votedUserIds.includes(userId)) {
    return doc;
  }

  if (voteType === 'IN_FAVOR') doc.votes.inFavor += 1;
  else if (voteType === 'AGAINST') doc.votes.against += 1;
  else if (voteType === 'ABSTAIN') doc.votes.abstain += 1;

  doc.votedUserIds.push(userId);
  doc.updatedAt = new Date().toISOString();

  saveAllServerDocuments(all);
  return doc;
}

/**
 * Adds an amendment to a specific clause
 */
export function addClauseAmendment(
  docId: string,
  clauseNumber: string,
  amendment: ClauseAmendment
): SolutionDocument | null {
  const all = getAllServerDocuments(true);
  const doc = all.find(d => d.id === docId);
  if (!doc) return null;

  const targetClause = doc.clauses.find(c => c.clauseNumber === clauseNumber);
  if (targetClause) {
    if (!targetClause.amendments) targetClause.amendments = [];
    targetClause.amendments.push(amendment);
    doc.updatedAt = new Date().toISOString();
    saveAllServerDocuments(all);
  }

  return doc;
}

/**
 * Adds a discussion entry to a specific clause
 */
export function addClauseDiscussion(
  docId: string,
  clauseNumber: string,
  discussion: ClauseDiscussion
): SolutionDocument | null {
  const all = getAllServerDocuments(true);
  const doc = all.find(d => d.id === docId);
  if (!doc) return null;

  const targetClause = doc.clauses.find(c => c.clauseNumber === clauseNumber);
  if (targetClause) {
    if (!targetClause.discussions) targetClause.discussions = [];
    targetClause.discussions.push(discussion);
    doc.updatedAt = new Date().toISOString();
    saveAllServerDocuments(all);
  }

  return doc;
}
