export interface InterestFormData {
  name: string;
  email: string;
  city: string;
  interest_type: string;
  institution?: string;
  instagram?: string;
}

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface SocialLinks {
  instagram: string;
  instagramHandle: string;
  twitter?: string;
  linkedin?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  subTagline: string;
  description: string;
  url: string;
  socials: SocialLinks;
}