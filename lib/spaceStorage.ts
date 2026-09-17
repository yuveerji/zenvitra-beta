import { ZenSpaceProfile } from '@/types/space';

export const DEFAULT_PROFILES: Record<string, ZenSpaceProfile> = {
  yuveer: {
    username: 'yuveer',
    displayName: 'Yuveer',
    bio: 'Founder & Lead Architect of Zenvitra. Designing sovereign digital architecture, international diplomacy systems, and high-frequency communication protocols.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    role: 'Founder & Chief Architect',
    verified: true,
    clearance: 'ROOT_FOUNDER_ALPHA',
    location: 'Geneva / New Delhi',
    pronouns: 'he/him',
    badges: ['FOUNDER', 'SOVEREIGN_ARCHITECT', 'UNSC_CHAIR', 'ROOT_ACCESS'],
    theme: 'cyberpunk',
    effect: 'grid',
    socials: {
      twitter: 'https://x.com/zenvitra',
      github: 'https://github.com/zenvitra',
      linkedin: 'https://linkedin.com/in/yuveer',
      email: 'yuveer@zenvitra.org',
      whatsapp: 'https://wa.me/?text=Connecting%20via%20Zen.Space'
    },
    blocks: [
      {
        id: 'block-music-1',
        type: 'music',
        title: 'Starboy (Cyber-Acoustic Edit)',
        subtitle: 'The Weeknd, Daft Punk',
        url: 'https://music.youtube.com',
        highlight: true,
        clicks: 420,
        metadata: {
          artist: 'The Weeknd & Daft Punk',
          albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80',
          category: 'Current Rotation'
        }
      },
      {
        id: 'block-unsc-res',
        type: 'docs',
        title: 'Draft Resolution 2741 (2026)',
        subtitle: 'UNSC Working Group on Autonomous Systems & Sovereign AI',
        url: '/platform/docs',
        highlight: false,
        clicks: 189,
        metadata: {
          category: 'Diplomatic Dispatch',
          docSummary: 'Operational framework on establishing verified cryptosecure corridors in non-signatory territories.'
        }
      },
      {
        id: 'block-zen-call',
        type: 'link',
        title: 'Join Direct Chamber on ZEN.CALL',
        subtitle: 'Encrypted HD Video & Voice • Instant Room Link',
        url: '/call/founder-chamber',
        highlight: true,
        clicks: 864,
        icon: 'Video'
      },
      {
        id: 'block-press-1',
        type: 'press',
        title: 'Zenvitra Unveils Sovereign Protocol v2.0',
        subtitle: 'Geneva Digital Gazette • Sept 2026',
        url: '/press',
        clicks: 312,
        metadata: {
          date: 'Sept 2026',
          category: 'Official Statement'
        }
      },
      {
        id: 'block-quote-1',
        type: 'quote',
        title: '"The future of communication belongs to those who build architectures of calm, sovereign resonance."',
        subtitle: 'Founding Axiom 01',
        clicks: 98
      }
    ],
    stats: {
      views: 14280,
      connections: 1890,
      shares: 642
    }
  },
  zenvitra: {
    username: 'zenvitra',
    displayName: 'Zenvitra Collective',
    bio: 'The next-generation unified communication, intelligence, and diplomatic operating system.',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    role: 'Official Platform Core',
    verified: true,
    clearance: 'NETWORK_SYSTEM',
    location: 'Decentralized Sovereign Cloud',
    badges: ['OFFICIAL', 'CORE_ENGINE', 'NETWORK_VERIFIED'],
    theme: 'obsidian',
    effect: 'stardust',
    socials: {
      twitter: 'https://x.com/zenvitra',
      github: 'https://github.com/zenvitra',
      website: 'https://zenvitra.org'
    },
    blocks: [
      {
        id: 'zen-portal',
        type: 'link',
        title: 'Access Zenvitra Platform',
        subtitle: 'Omni-channel workspaces, secure chats & rooms',
        url: '/platform',
        highlight: true,
        clicks: 3200
      },
      {
        id: 'zen-call-launch',
        type: 'link',
        title: 'ZEN.CALL Realtime Engine',
        subtitle: 'Experience spatial acoustic video calls',
        url: '/call',
        clicks: 2150
      },
      {
        id: 'zen-press',
        type: 'press',
        title: 'Platform Architecture Whitepaper v4.8',
        subtitle: 'Technical specifications for zero-latency pipelines',
        url: '/press',
        clicks: 980
      }
    ],
    stats: {
      views: 45900,
      connections: 5820,
      shares: 1940
    }
  }
};

const STORAGE_KEY = 'zen_space_profiles_v1';

export function getZenSpaceProfile(username: string): ZenSpaceProfile {
  const cleanUser = (username || '').toLowerCase().replace('@', '').trim();
  
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${cleanUser}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load space profile from storage:', e);
    }
  }

  if (DEFAULT_PROFILES[cleanUser]) {
    return DEFAULT_PROFILES[cleanUser];
  }

  // Generate fallback profile for any username
  const formattedName = cleanUser ? cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1) : 'Zen Traveler';
  return {
    username: cleanUser || 'traveler',
    displayName: formattedName,
    bio: 'Explorer of sovereign cybernetics and open communication protocols on Zenvitra.',
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser || 'zen'}`,
    role: 'Zen Explorer',
    verified: false,
    badges: ['VERIFIED_NODE'],
    theme: 'obsidian',
    effect: 'geometry',
    socials: {},
    blocks: [
      {
        id: 'block-welcome',
        type: 'text',
        title: `Welcome to @${cleanUser}'s Space`,
        subtitle: 'This space is newly initialized on the Zenvitra decentralized mesh.',
        clicks: 1
      },
      {
        id: 'block-call',
        type: 'link',
        title: 'Connect on ZEN.CALL',
        subtitle: 'Start an instant encrypted session',
        url: `/call/${cleanUser}-chamber`,
        highlight: true,
        clicks: 0
      }
    ],
    stats: {
      views: 12,
      connections: 3,
      shares: 0
    }
  };
}

export function saveZenSpaceProfile(profile: ZenSpaceProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanUser = profile.username.toLowerCase().replace('@', '').trim();
    localStorage.setItem(`${STORAGE_KEY}_${cleanUser}`, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save space profile:', e);
  }
}

export function trackBlockClick(username: string, blockId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const profile = getZenSpaceProfile(username);
    const block = profile.blocks.find(b => b.id === blockId);
    if (block) {
      block.clicks = (block.clicks || 0) + 1;
      profile.stats.views = (profile.stats.views || 0) + 1;
      saveZenSpaceProfile(profile);
    }
  } catch (e) {
    // Non-blocking
  }
}
