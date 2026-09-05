// ─── ZEN.DOCS SOVEREIGN DOCUMENT TYPE SYSTEM ───

export type ZenDocType = 
  | 'UN_RESOLUTION' 
  | 'INDIAN_BILL' 
  | 'POLICY_WORKING_PAPER' 
  | 'PRESS_ARTICLE' 
  | 'RESEARCH_PAPER'
  | 'MEETING_MINUTES'
  | 'PROPOSAL'
  | 'STUDY_NOTES'
  | 'CONSTITUENT_ARTICLE'
  | 'CRISIS_DIRECTIVE'
  | 'PRESS_RELEASE' 
  | 'FINANCIAL_REPORT'
  | 'STANDARD_DOC';

export type DocStatus = 
  | 'DRAFT' 
  | 'IN_REVIEW'
  | 'TABLED' 
  | 'UNDER_DEBATE' 
  | 'APPROVED'
  | 'PASSED' 
  | 'REJECTED' 
  | 'PUBLISHED';

export interface ZenDocClause {
  id: string;
  clauseNumber: string;
  clausePrefix?: string; // e.g. 'Reaffirming', 'Calls upon', 'Section 1', etc.
  text: string;
  subClauses?: string[];
  sponsorNotes?: string;
}

export interface ZenDocCollaborator {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER' | 'SPONSOR';
  color?: string;
  active?: boolean;
}

export interface ZenDocComment {
  id: string;
  author: string;
  authorHandle?: string;
  avatar?: string;
  text: string;
  createdAt: string;
  resolved: boolean;
}

export interface ZenDocTask {
  id: string;
  title: string;
  assignee: string;
  assigneeHandle?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface ZenDocVersion {
  id: string;
  versionNumber: number;
  label: string;
  timestamp: string;
  author: string;
  summary: string;
  contentHtml?: string;
}

export interface ZenWorkspace {
  id: string;
  name: string;
  icon: string;
  color: string;
  folders: string[];
}

export interface ZenDocument {
  id: string;
  title: string;
  docCode: string;
  docType: ZenDocType;
  committeeOrChamber: string;
  status: DocStatus;
  leadSponsors: string[];
  signatories: string[];
  preambulatoryClauses?: ZenDocClause[];
  operativeClauses?: ZenDocClause[];
  billSections?: ZenDocClause[];
  plainBody?: string;
  contentHtml?: string;
  paperMode?: 'light' | 'dark';
  fontFamily?: string;
  fontSize?: number;
  lineSpacing?: string;
  zoomLevel?: number;
  starred?: boolean;
  collaborators?: ZenDocCollaborator[];
  comments?: ZenDocComment[];
  tasks?: ZenDocTask[];
  versions?: ZenDocVersion[];
  workspaceId?: string;
  tags?: string[];
  publishedToPress?: boolean;
  pressSlug?: string;
  viewCount?: number;
  isTrash?: boolean;
  cryptographicHash?: string;
  sealedAt?: string;
  updatedAt: string;
  createdAt: string;
  version: number;
}
