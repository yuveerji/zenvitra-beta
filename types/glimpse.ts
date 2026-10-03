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

export const INITIAL_GLIMPSES: ZenGlimpse[] = [
  {
    id: 'glimpse_init_1',
    authorId: 'zen_council',
    authorName: 'Diplomatic Secretariat',
    authorUsername: 'secretariat',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80',
    mediaType: 'photo',
    caption: 'Plenary chamber in full session • Gavel struck in order ⚡',
    locationTag: 'National Youth Assembly',
    chapterCampus: 'Zen Diplomacy 2026',
    selfDestructHours: 24,
    track: 'radar',
    createdAt: '12m ago',
    expiresAt: '23h remaining',
    likes: 24,
    likedBy: ['delegate_node']
  },
  {
    id: 'glimpse_init_2',
    authorId: 'zen_del_unsc',
    authorName: 'UNSC Dais Directorate',
    authorUsername: 'dais_unsc',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=900&auto=format&fit=crop&q=80',
    mediaType: 'photo',
    caption: 'Drafting resolution working papers on the floor 📜',
    locationTag: 'Security Council Hall',
    chapterCampus: 'Global Civic Commons',
    selfDestructHours: 24,
    track: 'radar',
    createdAt: '35m ago',
    expiresAt: '22h remaining',
    likes: 19,
    likedBy: []
  },
  {
    id: 'glimpse_init_3',
    authorId: 'zen_chapter_delhi',
    authorName: 'Delhi Chapter Hub',
    authorUsername: 'delhi_civic',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop&q=80',
    mediaType: 'photo',
    caption: 'Open research sprint & youth delegation preparations 🔥',
    locationTag: 'Open Research Lab',
    chapterCampus: 'City Forum',
    selfDestructHours: 24,
    track: 'community',
    createdAt: '1h ago',
    expiresAt: '21h remaining',
    likes: 31,
    likedBy: []
  },
  {
    id: 'glimpse_init_4',
    authorId: 'zen_stage_mic',
    authorName: 'Open Stage Directorate',
    authorUsername: 'zen_stage',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80',
    mediaType: 'photo',
    caption: 'Valedictory keynote & multilateral award declarations 🏆',
    locationTag: 'Youth Assembly',
    chapterCampus: 'Innovation Studio',
    selfDestructHours: 24,
    track: 'community',
    createdAt: '2h ago',
    expiresAt: '20h remaining',
    likes: 42,
    likedBy: []
  }
];
