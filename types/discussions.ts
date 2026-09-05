export type DiscussionCategory = 
  | 'EDUCATION'
  | 'JUSTICE'
  | 'SOCIETY'
  | 'GOVERNANCE'
  | 'TECHNOLOGY'
  | 'AI'
  | 'ENVIRONMENT'
  | 'YOUTH'
  | 'HUMAN_RIGHTS'
  | 'GLOBAL_AFFAIRS';

export type ArgumentStance = 'PRO' | 'CON' | 'NEUTRAL' | 'EVIDENCE';

export interface DiscussionCitation {
  title: string;
  url: string;
  sourceName: string;
}

export interface DiscussionArgument {
  id: string;
  discussionId: string;
  parentId?: string; // For nested counter-arguments
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  authorRole: string;
  isAnonymous?: boolean;
  stance: ArgumentStance;
  title: string;
  content: string;
  evidenceLinks: DiscussionCitation[];
  upvotes: number;
  downvotes: number;
  upvotedBy: string[];
  createdAt: string;
  replies?: DiscussionArgument[];
}

export interface OpenDiscussion {
  id: string;
  title: string;
  slug: string;
  question: string;
  contextSummary: string;
  category: DiscussionCategory;
  councilId?: string; // Linked Youth Forum Council
  relatedNewsId?: string; // Linked News Story
  proposedSolutionId?: string; // Linked Solution
  tags: string[];
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  participantCount: number;
  proCount: number;
  conCount: number;
  evidenceCount: number;
  isFeatured?: boolean;
  status: 'ACTIVE' | 'CONSENSUS_REACHED' | 'CONVERTED_TO_SOLUTION' | 'ARCHIVED';
  arguments: DiscussionArgument[];
}
