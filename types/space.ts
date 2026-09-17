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
  | 'docs'
  | 'form'
  | 'donate'
  | 'booking';

export interface ZenSpaceFormField {
  id: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
}

export interface ZenSpaceBlock {
  id: string;
  type: ZenSpaceBlockType;
  title: string;
  subtitle?: string;
  url?: string;
  icon?: string;
  highlight?: boolean;
  clicks?: number;
  bentoSpan?: '1' | '2' | 'full';
  metadata?: {
    artist?: string;
    albumArt?: string;
    audioUrl?: string;
    category?: string;
    readTime?: string;
    date?: string;
    venue?: string;
    docSummary?: string;
    formFields?: ZenSpaceFormField[];
    formSubmitText?: string;
    formSuccessMsg?: string;
    formWebhookTab?: string;
    donateGoal?: string;
    donateUrl?: string;
    bookingDuration?: string;
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
  layout?: 'stream' | 'bento';
  socials: ZenSpaceSocials;
  blocks: ZenSpaceBlock[];
  stats: {
    views: number;
    connections: number;
    shares: number;
    submissions?: number;
  };
}
