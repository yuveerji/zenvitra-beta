import { ZenSpaceProfile } from '@/types/space';

export const DEFAULT_PROFILES: Record<string, ZenSpaceProfile> = {
  yuveer: {
    username: 'yuveer',
    displayName: 'Yuveer',
    bio: 'Founder & Lead Architect of Zenvitra. Designing sovereign digital architecture, international diplomacy systems, and high-frequency communication protocols.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
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
        title: 'Starboy (Cyber-Acoustic Edit)',
        subtitle: 'The Weeknd, Daft Punk',
        url: 'https://music.youtube.com',
        highlight: true,
        clicks: 420,
        bentoSpan: '2',
        metadata: {
          artist: 'The Weeknd & Daft Punk',
          albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80',
          audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
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
        clicks: 189,
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
        clicks: 864,
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
        clicks: 312,
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
        clicks: 98,
        bentoSpan: '2'
      }
    ],
    stats: {
      views: 14280,
      connections: 1890,
      shares: 642,
      submissions: 87
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
        clicks: 3200
      },
      {
        id: 'zen-form-join',
        type: 'form',
        title: 'Register Interest / Early Sovereign Node',
        subtitle: 'Join the waitlist for sovereign community access',
        highlight: true,
        metadata: {
          formSubmitText: 'Join Waitlist',
          formSuccessMsg: 'You have been registered for network node activation!',
          formWebhookTab: 'INTEREST',
          formFields: [
            { id: 'name', label: 'Name or Pseudonym', placeholder: 'Explorer', type: 'text', required: true },
            { id: 'email', label: 'Email Address', placeholder: 'you@domain.com', type: 'email', required: true },
            { id: 'interest', label: 'Area of Interest', type: 'select', options: ['Autonomous Intelligence', 'Diplomatic Chambers', 'Civic Media', 'Decentralized Cloud'] }
          ]
        }
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
      shares: 1940,
      submissions: 340
    }
  },
  thejharokhaforum: {
    username: 'thejharokhaforum',
    displayName: '@thejharokhaforum',
    bio: 'Where Worlds are Wrought of Words',
    avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
    role: 'Diplomatic & Literary Youth Forum',
    verified: true,
    isOrganization: true,
    organizationType: 'Secretariat & Model UN Organization',
    location: 'Global / National Circuit',
    badges: ['ORGANIZATION', 'LITERARY_FORUM', 'SECRETARIAT_NODE'],
    theme: 'minimal_sand',
    effect: 'none',
    layout: 'stream',
    socials: {
      instagram: 'https://instagram.com/thejharokhaforum',
      email: 'secretariat@thejharokhaforum.org',
      phone: '+91 98765 43210'
    },
    blocks: [
      {
        id: 'block-jf-secretariat',
        type: 'form',
        title: 'Join Jharokha Forum 2026 Secretariat',
        subtitle: 'Executive board & organizing committee application dossier',
        highlight: true,
        clicks: 1420,
        metadata: {
          formMode: 'embed',
          formSubmitText: 'Submit Secretariat Application',
          formSuccessMsg: 'Your Secretariat application has been registered with Jharokha Forum 2026!',
          formWebhookTab: 'SECRETARIAT',
          formFields: [
            { id: 'fullName', label: 'Full Legal Name', placeholder: 'Enter your full name', type: 'text', required: true },
            { id: 'email', label: 'Primary Contact Email', placeholder: 'yourname@domain.com', type: 'email', required: true },
            { id: 'phone', label: 'WhatsApp / Phone Number', placeholder: '+91 98765 43210', type: 'text', required: true },
            { id: 'institution', label: 'Institution / School / University', placeholder: 'e.g. Modern School / Delhi University', type: 'text', required: true },
            { id: 'prefDept', label: 'Preferred Department', type: 'select', options: ['Delegate Affairs', 'Logistics & Hospitality', 'Public Relations & Social Media', 'Finance & Sponsorship', 'Research & Substantive Policy'] },
            { id: 'statement', label: 'Why do you want to join the Secretariat?', placeholder: 'Describe your vision, past MUN experience and skill sets...', type: 'textarea', required: true }
          ]
        }
      },
      {
        id: 'block-jf-offline-delegate',
        type: 'form',
        title: 'Offline Delegate Application- THE JHAROKHA FORUM 2026',
        subtitle: 'In-person parliamentary caucus & committee delegate registration',
        highlight: false,
        clicks: 2150,
        metadata: {
          formMode: 'embed',
          formSubmitText: 'Register as Offline Delegate',
          formSuccessMsg: 'Delegate registration received! Allotment matrix will be communicated shortly.',
          formWebhookTab: 'DELEGATES',
          formFields: [
            { id: 'name', label: 'Delegate Full Name', placeholder: 'Your full name', type: 'text', required: true },
            { id: 'email', label: 'Email Address', placeholder: 'delegate@school.edu', type: 'email', required: true },
            { id: 'phone', label: 'Contact Phone Number', placeholder: '+91 ...', type: 'text', required: true },
            { id: 'committeePref', label: 'Committee 1st Preference', type: 'select', options: ['UNSC (United Nations Security Council)', 'UNHRC (Human Rights Council)', 'Lok Sabha (Indian Parliament)', 'AIPPM (All India Political Parties Meet)', 'IP (International Press)'] },
            { id: 'experience', label: 'Prior MUN Experience (No. of conferences & awards)', placeholder: 'e.g. 3 MUNs (Executive Board / Delegate awards)', type: 'text' }
          ]
        }
      },
      {
        id: 'block-jf-online-delegate',
        type: 'form',
        title: 'Online Delegate Application- THE JHAROKHA FORUM 2026',
        subtitle: 'Virtual international cohort & digital diplomacy session registration',
        highlight: false,
        clicks: 1680,
        metadata: {
          formMode: 'embed',
          formSubmitText: 'Register for Online Session',
          formSuccessMsg: 'Online delegate registration confirmed. Digital session links will be dispatched.',
          formWebhookTab: 'ONLINE_DELEGATES',
          formFields: [
            { id: 'name', label: 'Delegate Full Name', placeholder: 'Your full name', type: 'text', required: true },
            { id: 'email', label: 'Email Address', placeholder: 'online.delegate@example.com', type: 'email', required: true },
            { id: 'country', label: 'Country & City of Residence', placeholder: 'e.g. London, UK or New Delhi, India', type: 'text', required: true },
            { id: 'committeePref', label: 'Committee Choice', type: 'select', options: ['UNSC Virtual Node', 'UNEP Climate Working Group', 'Digital Compact Assembly'] }
          ]
        }
      },
      {
        id: 'block-jf-committee-status',
        type: 'link',
        title: 'Jharokha Forum 2026: Committee Status',
        subtitle: 'View live allotment matrix, study guides, agendas & background guides',
        url: '/mun',
        highlight: false,
        clicks: 3410
      }
    ],
    stats: {
      views: 8940,
      connections: 1420,
      shares: 430,
      submissions: 382
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
    layout: 'stream',
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
        id: 'block-form-contact',
        type: 'form',
        title: `Send Message to @${cleanUser}`,
        subtitle: 'Drop an encrypted note, collaboration inquiry or contact request',
        metadata: {
          formSubmitText: 'Send Message',
          formSuccessMsg: 'Your message has been dispatched!',
          formWebhookTab: 'CONTACT',
          formFields: [
            { id: 'name', label: 'Your Name', placeholder: 'Name or handle', type: 'text', required: true },
            { id: 'email', label: 'Your Email', placeholder: 'you@example.com', type: 'email', required: true },
            { id: 'message', label: 'Message', placeholder: 'Write your message...', type: 'textarea', required: true }
          ]
        }
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
