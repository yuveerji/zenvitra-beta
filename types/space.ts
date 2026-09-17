export type ZenSpaceTheme = 
  | 'cyberpunk'
  | 'obsidian'
  | 'geneva'
  | 'aurora'
  | 'solar'
  | 'nordic';

export type ZenSpaceEffect = 
  | 'none'
  | 'stardust'
  | 'grid'
  | 'aurora'
  | 'geometry';

export interface ZenSpaceSocials {
  instagram?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  discord?: string;
  spotify?: string;
  whatsapp?: string;
  telegram?: string;
  substack?: string;
  email?: string;
  website?: string;
}

export type ZenSpaceBlockType = 
  | 'link'
  | 'music'
  | 'press'
  | 'event'
  | 'text'
  | 'quote'
  | 'docs';

export interface ZenSpaceBlock {
  id: string;
  type: ZenSpaceBlockType;
  title: string;
  subtitle?: string;
  url?: string;
  icon?: string;
  highlight?: boolean;
  clicks?: number;
  metadata?: {
    artist?: string;
    albumArt?: string;
    audioUrl?: string;
    category?: string;
    readTime?: string;
    date?: string;
    venue?: string;
    docSummary?: string;
  };
}

export interface ZenSpaceProfile {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  bannerUrl?: string;
  role: string;
  verified: boolean;
  clearance?: string;
  location?: string;
  pronouns?: string;
  badges: string[];
  theme: ZenSpaceTheme;
  effect: ZenSpaceEffect;
  socials: ZenSpaceSocials;
  blocks: ZenSpaceBlock[];
  stats: {
    views: number;
    connections: number;
    shares: number;
  };
}
