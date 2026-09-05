export interface ZenGlimpse {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  caption: string;
  locationTag: string;
  chapterCampus?: string;
  selfDestructHours: 1 | 6 | 12 | 24;
  track: 'community' | 'radar' | 'delegates';
  createdAt: string;
  expiresAt: string;
  likes: number;
  likedBy: string[];
}

export const INITIAL_GLIMPSES: ZenGlimpse[] = [];
