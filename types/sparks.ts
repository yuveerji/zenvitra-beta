export interface ZenSpark {
  id: string;
  title: string;
  summary: string;
  readingTimeMinutes: number;
  category: 'Geopolitics' | 'Climate Diplomacy' | 'Civic Tech' | 'Bioethics' | 'Youth Governance' | 'Economics' | 'AI Ethics' | 'International Law';
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  keyTakeaways: string[];
  fullDossier: string;
  treatyClauseReference?: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  saves: number;
  savedBy: string[];
  createdAt: string;
}

export const INITIAL_SPARKS: ZenSpark[] = [];

