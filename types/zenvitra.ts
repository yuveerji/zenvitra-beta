import { UserProfile, UserRole } from './auth';

// 1. ZEN.PULSE Data Types
export interface PulsePost {
  id: string;
  author_id: string;
  author: UserProfile;
  content: string;
  media_urls?: string[];
  media_type?: 'image' | 'video' | 'none';
  tags?: string[];
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  is_liked?: boolean;
  is_saved?: boolean;
  event_tag?: {
    event_id: string;
    event_title: string;
  };
  created_at: string;
}

// 2. EVENTS Data Types
export interface ZenvitraEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: 'MUN' | 'CONFERENCE' | 'SUMMIT' | 'WORKSHOP' | 'DEBATE' | 'YOUTH_FORUM';
  organizer_id: string;
  organizer_name: string;
  organizer_avatar?: string;
  banner_url: string;
  location: string;
  city: string;
  is_virtual: boolean;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  committees?: {
    id: string;
    name: string;
    agenda: string;
    seats_total: number;
    seats_filled: number;
  }[];
  participants_count: number;
  ticket_price?: number;
  currency?: string;
}

// 3. INTERNATIONAL PRESS Data Types
export interface PressArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: 'INVESTIGATION' | 'OPINION' | 'POLICY_ANALYSIS' | 'EVENT_COVERAGE' | 'INTERVIEW';
  author_id: string;
  author: UserProfile;
  read_time_minutes: number;
  published_at: string;
  views_count: number;
  claps_count: number;
  tags: string[];
}

// 4. ZEN.FLUX Data Types
export interface FluxVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  creator_id: string;
  creator: UserProfile;
  audio_title?: string;
  duration_seconds: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
}

// 5. ACHIEVEMENTS & CERTIFICATES
export interface UserAchievement {
  id: string;
  user_id: string;
  title: string;
  issuer: string;
  category: 'BEST_DELEGATE' | 'SECRETARIAT_HONOR' | 'EDITORIAL_BOARD' | 'FELLOWSHIP' | 'FOUNDATION_HONOR';
  icon: string;
  date_awarded: string;
  verification_url?: string;
}

// 6. COMMUNITIES & ORGANIZATIONS
export interface CommunityOrg {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo_url: string;
  banner_url?: string;
  category: 'MUN_CIRCUIT' | 'DEBATE_SOCIETY' | 'JOURNALISM_CLUB' | 'NGO' | 'UNIVERSITY_CHAPTER';
  members_count: number;
  is_verified: boolean;
  leader_username: string;
}

// 7. ECOSYSTEM APPS DEFINITION
export interface EcosystemApp {
  id: string;
  name: string;
  code: string;
  version: string;
  tagline: string;
  description: string;
  href: string;
  iconName: string;
  accentColor: string;
  badge?: string;
  isLive: boolean;
}
