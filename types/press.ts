export type PressCategory =
  | 'MANIFESTO'
  | 'ARCHITECTURE'
  | 'UPDATES'
  | 'EDITORIAL'
  | 'COMMUNITY';

export type ArticleStatus = 'draft' | 'published';

export type PressSortBy = 'latest' | 'popular' | 'oldest';

export type PressView = 'feed' | 'article' | 'editor' | 'bookmarks' | 'my-articles';

export interface CommentReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface PressComment {
  id: string;
  articleId: string;
  parentId?: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  content: string;
  createdAt: string;
  reactions: CommentReaction[];
}

export interface PressArticle {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML
  excerpt: string;
  coverImage?: string;
  sourceName: string;
  sourceUrl: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  category: PressCategory;
  tags: string[];
  status: ArticleStatus;
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  readingTimeMinutes: number;
  upvotes: number;
  upvotedBy: string[];
  bookmarkedBy: string[];
  commentCount: number;
}
