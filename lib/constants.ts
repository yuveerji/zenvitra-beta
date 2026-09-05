import type { SiteConfig } from '@/types';

export const TARGET_LAUNCH_DATE = '2026-11-08T00:00:00+05:30';

export const SITE_CONFIG: SiteConfig = {
  name: 'Zenvitra',
  tagline: 'Meaningful Change Starts With Youth.',
  subTagline: 'DIALOGUE. DEBATE. IMPACT.',
  description: 'Zenvitra is a youth-driven ecosystem where ideas turn into dialogue, dialogue turns into collaboration, and collaboration creates real-world impact.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zenvitra.xyz',
  socials: {
    instagram: 'https://instagram.com/zenvitrafoundation',
    instagramHandle: '@zenvitrafoundation',
  },
};