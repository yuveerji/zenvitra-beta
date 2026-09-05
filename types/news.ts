export type NewsCategory = 
  | 'BREAKING'
  | 'INDIA'
  | 'WORLD'
  | 'YOUTH'
  | 'TECHNOLOGY'
  | 'AI'
  | 'EDUCATION'
  | 'ECONOMY'
  | 'SOCIETY'
  | 'ENVIRONMENT'
  | 'SCIENCE'
  | 'INTERNATIONAL_AFFAIRS';

export interface NewsTimelineUpdate {
  id: string;
  time: string;
  headline: string;
  content: string;
  sourceName: string;
  sourceUrl?: string;
  isConfirmed: boolean;
}

export interface NewsStory {
  id: string;
  slug: string;
  headline: string;
  category: NewsCategory;
  isBreaking: boolean;
  isDeveloping: boolean;
  publishedAt: string;
  lastUpdatedAt: string;
  location: string;
  coverImage: string;
  summary: string;
  whatHappened: string;
  timeline: NewsTimelineUpdate[];
  whatWeKnow: string[];
  whatRemainsUnclear: string[];
  contextExplanation: {
    background: string;
    keyTerms: { term: string; definition: string }[];
    relevantInstitutions: string[];
    previousDevelopments: string[];
  };
  linkedDiscussionId?: string; // One-click bridge into Open Discussions
  linkedSolutionId?: string; // Bridge to youth solution proposal
  readCount: number;
}
