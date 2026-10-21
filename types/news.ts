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

export interface NewsSourceCitation {
  id: string;
  name: string;        // e.g. "TOI - Article X"
  url: string;         // e.g. "https://..."
  label: string;       // e.g. "Source #1"
  domain?: string;
}

export interface NewsCoverAdjustment {
  scale: number;        // e.g. 1.0 - 2.5
  positionX: number;    // 0 - 100%
  positionY: number;    // 0 - 100%
  aspectRatio: string;  // '16:9' | '21:9' | '4:3' | '1:1'
  fit: 'cover' | 'contain';
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
  coverAdjustment?: NewsCoverAdjustment;
  summary: string;
  whatHappened: string;
  timeline: NewsTimelineUpdate[];
  whatWeKnow: string[];
  whatRemainsUnclear: string[];
  sources?: NewsSourceCitation[];
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
