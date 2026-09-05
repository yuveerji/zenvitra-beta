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
  | 'DRAFT_RESOLUTION'
  | 'LEGISLATIVE_BILL'
  | 'PRESS_RELEASE'
  | 'TREATY_CHARTER'
  | 'POLICY_WHITEPAPER'
  | 'WORKING_PAPER';

export interface DocumentClause {
  clauseNumber: string;
  type: 'PREAMBULARY' | 'OPERATIVE' | 'AMENDMENT' | 'ARTICLE';
  text: string;
  sponsorAuthors?: string[];
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
  signatories: string[];
  abstract: string;
  clauses: DocumentClause[];
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
