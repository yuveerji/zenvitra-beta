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
 * Baseline documents: Strictly zero seeded bills in compliance with NO-SEED guidelines
 */
function getBaselineDocuments(): SolutionDocument[] {
  return [];
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
      if (Array.isArray(list)) {
        if (!includeTest) {
          return list.filter((d: any) => !d.isTest && d.proposedByUsername !== 'test');
        }
        return list;
      }
    }
    return [];
  } catch (err) {
    console.warn('[SOLUTIONS-STORAGE-READ-ERROR]', err);
    return [];
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
 * Enforces maximum 2 edits rule per bill
 */
export function saveServerDocument(doc: SolutionDocument): SolutionDocument {
  doc.updatedAt = new Date().toISOString();
  if (!doc.createdAt) doc.createdAt = doc.updatedAt;

  const all = getAllServerDocuments(true);
  const index = all.findIndex(d => d.id === doc.id);

  if (index >= 0) {
    const existing = all[index];
    const previousEditCount = existing.editCount ?? 0;

    // Detect if this update is an author edit (title, clauses, chapters, abstract, preamble modified)
    const isAuthorContentEdit = 
      doc.title !== existing.title ||
      doc.abstract !== existing.abstract ||
      JSON.stringify(doc.clauses) !== JSON.stringify(existing.clauses) ||
      JSON.stringify(doc.chapters) !== JSON.stringify(existing.chapters) ||
      JSON.stringify(doc.schedules) !== JSON.stringify(existing.schedules);

    if (isAuthorContentEdit) {
      if (previousEditCount >= (existing.maxEdits || 2)) {
        throw new Error('This bill has reached its statutory limit of 2 edits and is finalized as an Enacted Draft.');
      }
      doc.editCount = previousEditCount + 1;
    } else {
      doc.editCount = previousEditCount;
    }

    doc.maxEdits = 2;
    all[index] = { ...existing, ...doc };
  } else {
    doc.editCount = doc.editCount ?? 0;
    doc.maxEdits = 2;
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
