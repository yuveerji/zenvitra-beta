import { ZenSpaceProfile } from '@/types/space';

export const DEFAULT_PROFILES: Record<string, ZenSpaceProfile> = {
  yuveer: {
    username: 'yuveer',
    displayName: 'Yuveer',
    bio: 'Founder & Lead Architect of Zenvitra. Designing sovereign digital architecture, international diplomacy systems, and high-frequency communication protocols.',
    avatar: '/assets/founder.png',
    bannerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    role: 'Founder & Chief Architect',
    verified: true,
    clearance: 'ROOT_FOUNDER_ALPHA',
    location: 'Geneva / New Delhi',
    pronouns: 'he/him',
    badges: ['FOUNDER', 'SOVEREIGN_ARCHITECT', 'UNSC_CHAIR', 'ROOT_ACCESS'],
    theme: 'cyberpunk',
    effect: 'grid',
    layout: 'stream',
    socials: {
      instagram: 'https://instagram.com/zenvitra',
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
        title: 'Starboy',
        subtitle: 'The Weeknd ft. Daft Punk',
        url: 'https://music.youtube.com/watch?v=34Na4j8AVgA',
        highlight: true,
        clicks: 0,
        bentoSpan: '2',
        metadata: {
          artist: 'The Weeknd ft. Daft Punk',
          albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80',
          audioUrl: '/music/starboy_preview.wav',
          videoId: '34Na4j8AVgA',
          category: 'Current Rotation'
        }
      },
      {
        id: 'block-form-delegate',
        type: 'form',
        title: 'Bilateral Inquiry & Delegate Access',
        subtitle: 'Submit credentials for high-level diplomatic caucus & partnership',
        highlight: true,
        bentoSpan: '2',
        metadata: {
          formSubmitText: 'Submit Credential Dossier',
          formSuccessMsg: 'Your credentials have been securely received by the Founder Enclave.',
          formWebhookTab: 'INTEREST',
          formFields: [
            { id: 'name', label: 'Full Name / Delegate Title', placeholder: 'Ambassador / Lead Researcher', type: 'text', required: true },
            { id: 'email', label: 'Diplomatic / Work Email', placeholder: 'delegate@ministry.gov or name@org.com', type: 'email', required: true },
            { id: 'org', label: 'Entity or Organization', placeholder: 'e.g. UN Department, University, Sovereign Fund', type: 'text', required: true },
            { id: 'purpose', label: 'Inquiry Purpose', type: 'select', options: ['Diplomatic Cooperation', 'Platform Enclave Access', 'Press / Keynote Interview', 'Technology Integration'] },
            { id: 'message', label: 'Message / Briefing Notes', placeholder: 'Summary of discussion objectives...', type: 'textarea' }
          ]
        }
      },
      {
        id: 'block-unsc-res',
        type: 'docs',
        title: 'Draft Resolution 2741 (2026)',
        subtitle: 'UNSC Working Group on Autonomous Systems & Sovereign AI',
        url: '/platform/docs',
        highlight: false,
        clicks: 0,
        bentoSpan: '1',
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
        clicks: 0,
        icon: 'Video',
        bentoSpan: '1'
      },
      {
        id: 'block-booking-1',
        type: 'booking',
        title: 'Request 15-Min Sovereign Briefing',
        subtitle: 'Direct high-bandwidth consultation on sovereign mesh architecture',
        url: '/call/briefing-lounge',
        bentoSpan: '1',
        metadata: {
          bookingDuration: '15 Minutes',
          category: 'Consultation'
        }
      },
      {
        id: 'block-donate-impact',
        type: 'donate',
        title: 'Fund Sovereign Tech & Public Education',
        subtitle: '100% of contributions deploy verified hardware & digital kits to govt schools',
        url: '/donate/govt-schools',
        bentoSpan: '2',
        metadata: {
          donateGoal: '₹1,00,000 Raised for 100 Classrooms',
          donateUrl: '/donate/govt-schools'
        }
      },
      {
        id: 'block-press-1',
        type: 'press',
        title: 'Zenvitra Unveils Sovereign Protocol v2.0',
        subtitle: 'Geneva Digital Gazette • Sept 2026',
        url: '/press',
        clicks: 0,
        bentoSpan: '1',
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
        clicks: 0,
        bentoSpan: '2'
      }
    ],
    stats: {
      views: 0,
      connections: 0,
      shares: 0,
      submissions: 0
    }
  },
  zenvitra: {
    username: 'zenvitra',
    displayName: 'Zenvitra Collective',
    bio: 'The next-generation unified communication, intelligence, and diplomatic operating system.',
    avatar: '/brand/logo.png',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    role: 'Official Platform Core',
    verified: true,
    clearance: 'NETWORK_SYSTEM',
    location: 'Decentralized Sovereign Cloud',
    badges: ['OFFICIAL', 'CORE_ENGINE', 'NETWORK_VERIFIED'],
    theme: 'obsidian',
    effect: 'stardust',
    layout: 'stream',
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
        clicks: 0
      },
      {
        id: 'zen-call-launch',
        type: 'link',
        title: 'ZEN.CALL Realtime Engine',
        subtitle: 'Experience spatial acoustic video calls',
        url: '/call',
        clicks: 0
      }
    ],
    stats: {
      views: 0,
      connections: 0,
      shares: 0,
      submissions: 0
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
        const parsed = JSON.parse(stored);
        // Sanitize legacy seeded unsplash image or misplaced brand logo
        if (parsed.avatar && (
          parsed.avatar.includes('photo-1507003211169-0a1dd7228f2d') ||
          (parsed.avatar === '/brand/logo.png' && cleanUser !== 'zenvitra')
        )) {
          parsed.avatar = '';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load space profile from storage:', e);
    }
  }

  if (DEFAULT_PROFILES[cleanUser]) {
    return DEFAULT_PROFILES[cleanUser];
  }

  // Resolve user avatar dynamically: pulse profile -> session user -> default pulse avatar mark
  let userAvatar = '';
  let userBio = 'Explorer of sovereign cybernetics and open communication protocols on Zenvitra.';
  let userDisplayName = cleanUser ? cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1) : 'Zen Traveler';

  if (cleanUser === 'yuveer') {
    userAvatar = '/assets/founder.png';
  } else if (typeof window !== 'undefined') {
    try {
      const pulseProfile = JSON.parse(localStorage.getItem('zenvitra_pulse_my_profile_v1') || '{}');
      const sessionUser = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
      const pulseProfiles = JSON.parse(localStorage.getItem('zenvitra_pulse_profiles_v9_clean') || '[]');
      
      const foundPulse = Array.isArray(pulseProfiles) 
        ? pulseProfiles.find((p: any) => (p.username || '').toLowerCase().replace(/^@/, '') === cleanUser) 
        : null;

      if (foundPulse?.avatar) {
        userAvatar = foundPulse.avatar;
        if (foundPulse.name) userDisplayName = foundPulse.name;
        if (foundPulse.bio) userBio = foundPulse.bio;
      } else if ((sessionUser.username || sessionUser.handle || '').toLowerCase().replace(/^@/, '') === cleanUser && (sessionUser.avatar || sessionUser.avatar_url)) {
        userAvatar = sessionUser.avatar || sessionUser.avatar_url;
        if (sessionUser.name || sessionUser.display_name) userDisplayName = sessionUser.name || sessionUser.display_name;
      } else if ((pulseProfile.username || '').toLowerCase().replace(/^@/, '') === cleanUser && pulseProfile.avatar) {
        userAvatar = pulseProfile.avatar;
        if (pulseProfile.name) userDisplayName = pulseProfile.name;
        if (pulseProfile.bio) userBio = pulseProfile.bio;
      }
    } catch (_) {}
  }

  // Generate clean real profile for any username
  return {
    username: cleanUser || 'traveler',
    displayName: userDisplayName,
    bio: userBio,
    avatar: userAvatar,
    role: 'Sovereign Node',
    verified: false,
    badges: ['VERIFIED_NODE'],
    theme: 'minimal_sand',
    effect: 'none',
    layout: 'stream',
    socials: {},
    blocks: [],
    stats: {
      views: 0,
      connections: 0,
      shares: 0,
      submissions: 0
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

export function recordFormSubmission(username: string, blockId: string, data: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  try {
    const profile = getZenSpaceProfile(username);
    profile.stats.submissions = (profile.stats.submissions || 0) + 1;
    saveZenSpaceProfile(profile);

    // Save submission locally for owner review
    const subKey = `zen_space_subs_${profile.username}`;
    const existing = JSON.parse(localStorage.getItem(subKey) || '[]');
    existing.unshift({
      id: `sub-${Date.now()}`,
      blockId,
      timestamp: new Date().toISOString(),
      data
    });
    localStorage.setItem(subKey, JSON.stringify(existing.slice(0, 100)));
  } catch (e) {
    console.warn('Failed to record submission:', e);
  }
}
