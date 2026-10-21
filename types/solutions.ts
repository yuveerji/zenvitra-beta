export type SolutionStatus = 
  | 'PROPOSED'
  | 'UNDER_DISCUSSION'
  | 'UNDER_REVIEW'
  | 'PUBLISHED'
  | 'IMPLEMENTATION'
  | 'IMPACT_MEASURED';

export type SolutionCategory = 
  | 'EDUCATION'
  | 'GOVERNANCE'
  | 'CLIMATE_ENVIRONMENT'
  | 'JUSTICE_RIGHTS'
  | 'DIGITAL_CIVICS'
  | 'YOUTH_EMPLOYMENT'
  | 'HEALTH_WELLBEING'
  | 'GLOBAL_DIPLOMACY';

export type DocumentType = 
  | 'LEGISLATIVE_BILL'
  | 'DRAFT_RESOLUTION'
  | 'POLICY_WHITEPAPER'
  | 'TREATY_CHARTER'
  | 'CONSTITUTION'
  | 'RULEBOOK'
  | 'REPORT'
  | 'PROPOSAL'
  | 'AGREEMENT'
  | 'AMENDMENT'
  | 'DIRECTIVE'
  | 'PRESS_RELEASE'
  | 'MANIFESTO'
  | 'PAPER'
  | 'WORKING_PAPER';

export interface ClauseSubItem {
  number: string; // e.g. "6.1", "(a)", "(1)"
  text: string;
}

export type AmendmentActionType = 'MODIFY' | 'INSERT' | 'STRIKE';
export type AmendmentProceduralClass = 'FRIENDLY' | 'UNFRIENDLY';
export type AmendmentDisposition = 'TABLED' | 'INCORPORATED_FRIENDLY' | 'ADOPTED_DIVISION' | 'REJECTED' | 'WITHDRAWN';
export type AmendmentImpactCategory = 'FISCAL' | 'PENALTY' | 'TIMELINE' | 'COMPLIANCE' | 'HUMAN_RIGHTS' | 'GENERAL';

export interface ClauseAmendedCredit {
  handles: string[];              // e.g. ['@yuveer', '@seconder']
  totalPoints: number;            // e.g. 100
  pointsPerUser: number;          // e.g. 50
  adoptedAt: string;              // ISO timestamp
  amendmentId: string;
  docketNumber?: string;          // e.g. "#AMD-1"
}

export interface ClauseAmendment {
  id: string;
  author: string;
  authorUsername?: string;
  authorDelegation?: string;
  secondedBy?: string;
  contributorHandles?: string[];  // e.g. ['@yuveer', '@seconder']
  proceduralClass?: AmendmentProceduralClass;
  actionType?: AmendmentActionType;
  targetSubClause?: string;
  targetSubClauseIndex?: number;
  originalText?: string;
  proposedText: string;
  rationale: string;
  impactAssessment?: string;
  impactCategory?: AmendmentImpactCategory;
  disposition?: AmendmentDisposition;
  votingDeadline?: string;        // ISO timestamp for countdown end
  votingDurationSeconds?: number; // e.g. 60 or 90
  totalPointsAwarded?: number;    // e.g. 100
  votes: number;
  votingRecord?: {
    aye: number;
    no: number;
    abstain: number;
    voters?: { [usernameOrId: string]: 'AYE' | 'NO' | 'ABSTAIN' };
  };
  votedUserIds?: string[];
  createdAt: string;
}

export interface ClauseDiscussion {
  id: string;
  author: string;
  authorUsername?: string;
  text: string;
  createdAt: string;
}

export type ChartType = 'bar' | 'horizontal-bar' | 'line' | 'donut' | 'pie' | 'progress';

export interface DocumentChartItem {
  label: string;
  value: number;
  color?: string;
  subtext?: string;
}

export interface DocumentChart {
  id: string;
  type: ChartType;
  title: string;
  unit?: string;
  items: DocumentChartItem[];
  description?: string;
}

export interface DocumentTableColumn {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
}

export interface DocumentTable {
  id: string;
  title?: string;
  columns: DocumentTableColumn[];
  rows: Record<string, string | number>[];
  caption?: string;
}

export interface DataChapterMetric {
  id: string;
  value: string;
  label: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string; // 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose'
}

export interface DocumentClause {
  id?: string;
  clauseNumber: string;
  title?: string; // e.g. "Short Title and Commencement", "Student Welfare"
  type: 'PREAMBULARY' | 'OPERATIVE' | 'AMENDMENT' | 'ARTICLE' | 'SECTION' | 'FINDING' | 'RECOMMENDATION' | 'RULE' | 'PROVISION' | 'DATA_ANALYSIS';
  text: string;
  subClauses?: ClauseSubItem[];
  subItems?: ClauseSubItem[];
  chapterNumber?: string; // e.g. "Chapter I"
  chapterTitle?: string;  // e.g. "Preliminary"
  sponsorAuthors?: string[];
  amendments?: ClauseAmendment[];
  discussions?: ClauseDiscussion[];
  amendedBy?: ClauseAmendedCredit;
  tables?: DocumentTable[];
  charts?: DocumentChart[];
  metrics?: DataChapterMetric[];
  isDataChapter?: boolean;
}

export interface DocumentChapter {
  id: string;
  number: string; // e.g. "Chapter I", "Part I"
  title: string;  // e.g. "Preliminary", "Student Welfare"
  clauseIds?: string[];
  clauses?: DocumentClause[];
  description?: string;
  isDataChapter?: boolean;
  metrics?: DataChapterMetric[];
  summary?: string;
}

export interface ValidationIssue {
  id: string;
  type: 'structural' | 'missing_info' | 'numbering' | 'incomplete';
  title: string;
  description: string;
  clauseNumber?: string;
  suggestedFix?: string;
  resolved?: boolean;
}

export interface OriginalSourceDocument {
  name: string;
  type: string; // 'pdf' | 'docx' | 'md' | 'txt' | 'other'
  size?: number; // bytes
  rawContent?: string; // verbatim source text extracted or authored
  dataUrl?: string; // base64 data url for direct downloading if available
  allowDownload: boolean; // whether public users can download the authentic source file
  uploadedAt: string;
}

export interface DocumentSchedule {
  id: string;
  number: string;        // e.g. "THE FIRST SCHEDULE", "SCHEDULE A"
  title: string;         // e.g. "Statutory Fines, Compliance Inspections and Penalty Matrix"
  content: string;       // Markdown table or rich text
  proposedBy?: string;   // author handle e.g. '@yuveer'
  proposedAt?: string;
  isMakerSchedule?: boolean;
}

export interface SolutionDocument {
  id: string;
  documentCode: string; // e.g. "UN-GA/RES/79/AI-GOV", "BILL-2026-EDUSEC", "PRESS-REL-092"
  title: string;
  documentType: DocumentType;
  category: SolutionCategory;
  committee: string; // e.g. "UN General Assembly", "Security Council", "Youth Parliament", "Press Corps"
  status: SolutionStatus;
  leadSponsors: string[]; // e.g. ["Delegate of France", "Delegate of Brazil", "Aarav Mehta"]
  proposedByUsername?: string;
  signatories: string[];
  abstract: string;
  enactingFormula?: string; // e.g. "BE it enacted by Parliament..."
  preamble?: string;        // e.g. Purpose or Preamble text
  chapters?: DocumentChapter[];
  clauses: DocumentClause[];
  schedules?: DocumentSchedule[];
  validationIssues?: ValidationIssue[];
  fullText?: string;
  fileName?: string;
  fileSize?: string;
  originalDocument?: OriginalSourceDocument;
  allowOriginalDownload?: boolean;
  votes: {
    inFavor: number;
    against: number;
    abstain: number;
  };
  votedUserIds?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  linkedDiscussionId?: string;
  isOfficial?: boolean;
  editCount?: number; // Number of author edits applied (max 2)
  maxEdits?: number;  // Fixed statutory edit limit (default 2)
}

export interface SolutionContributor {
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  roleTitle: string;
  contributionType: 'RESEARCHER' | 'PROPOSAL_AUTHOR' | 'POLICY_ANALYST' | 'IMPLEMENTATION_LEAD';
}

export interface SolutionMilestone {
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
}

export interface SolutionProject {
  id: string;
  title: string;
  slug: string;
  category: SolutionCategory;
  status: SolutionStatus;
  statusHistory: {
    status: SolutionStatus;
    timestamp: string;
    note: string;
  }[];
  originDiscussionId?: string; // Linked Open Discussion
  relatedNewsIds?: string[]; // Linked News stories
  relatedEventId?: string; // Linked Model UN or Summit
  problemStatement: string;
  rootCauseAnalysis: string;
  coreRecommendations: string[];
  implementationRoadmap: SolutionMilestone[];
  budgetEstimated?: string;
  impactMetrics: {
    targetBeneficiaries: string;
    verifiedResults?: string;
    charityAllocationGrant?: string;
  };
  votesCount: number;
  votedUserIds: string[];
  contributors: SolutionContributor[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  endorsedByOrganizations?: string[];
}
