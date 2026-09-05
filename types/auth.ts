export type UserRole =
  | 'delegate'
  | 'journalist'
  | 'creator'
  | 'organizer'
  | 'core_team'
  | 'admin'
  | 'guest'
  | 'GUEST';

export type OAuthProvider =
  | 'google'
  | 'github'
  | 'discord'
  | 'linkedin'
  | 'instagram'
  | 'facebook';

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  website?: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  email_notifications: boolean;
  pulse_digest: boolean;
  event_reminders: boolean;
  press_alerts: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url?: string | null;
  banner_url?: string | null;
  bio?: string | null;
  role: UserRole;
  institution?: string | null;
  city?: string | null;
  country?: string | null;
  website?: string | null;
  social_links?: SocialLinks;
  impact_score: number;
  followers_count: number;
  following_count: number;
  is_verified: boolean;
  is_onboarded: boolean;
  isGuest?: boolean;
  badge?: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at?: string;
}

export interface ConnectedAccount {
  id: string;
  user_id: string;
  provider: OAuthProvider;
  provider_user_id: string;
  provider_username?: string;
  provider_email?: string;
  avatar_url?: string;
  connected_at: string;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, unknown>;
  } | null;
  profile: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type ChatCategory =
  | 'GENERAL_SECRETARIAT'
  | 'MUN_DELEGATION_DOUBTS'
  | 'POLICY_RESEARCH_LABS'
  | 'CORE_TEAM_RECRUITMENT'
  | 'TECHNICAL_PLATFORM_SUPPORT'
  | 'PRESS_MEDIA_ACCREDITATION';

export interface ChatThread {
  id: string;
  user_id?: string;
  visitor_name: string;
  visitor_email: string;
  category: ChatCategory;
  status: 'OPEN' | 'RESOLVED' | 'PENDING_SECRETARIAT';
  last_message_at: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  sender_type: 'USER' | 'SUPPORT' | 'SYSTEM';
  sender_id?: string;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}