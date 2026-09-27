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

export interface ClauseAmendment {
  id: string;
  author: string;
  authorUsername?: string;
  proposedText: string;
  rationale: string;
  votes: number;
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

export interface DocumentClause {
  id?: string;
  clauseNumber: string;
  title?: string; // e.g. "Short Title and Commencement", "Student Welfare"
  type: 'PREAMBULARY' | 'OPERATIVE' | 'AMENDMENT' | 'ARTICLE' | 'SECTION' | 'FINDING' | 'RECOMMENDATION' | 'RULE' | 'PROVISION';
  text: string;
  subClauses?: ClauseSubItem[];
  chapterNumber?: string; // e.g. "Chapter I"
  chapterTitle?: string;  // e.g. "Preliminary"
  sponsorAuthors?: string[];
  amendments?: ClauseAmendment[];
  discussions?: ClauseDiscussion[];
}

export interface DocumentChapter {
  id: string;
  number: string; // e.g. "Chapter I", "Part I"
  title: string;  // e.g. "Preliminary", "Student Welfare"
  clauseIds?: string[];
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
  validationIssues?: ValidationIssue[];
  fullText?: string;
  fileName?: string;
  fileSize?: string;
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
