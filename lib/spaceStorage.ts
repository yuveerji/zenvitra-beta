import { ZenSpaceProfile } from '@/types/space';

export const DEFAULT_PROFILES: Record<string, ZenSpaceProfile> = {};

// Bump to v2 to purge any cached seeded mock cards from localStorage in accordance with NO SEEDED DATA law
const STORAGE_KEY = 'zen_space_profiles_v2';

export function getZenSpaceProfile(username: string): ZenSpaceProfile {
  const cleanUser = (username || '').toLowerCase().replace('@', '').trim();
  
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${cleanUser}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load space profile from storage:', e);
    }
  }

  // Resolve user avatar dynamically: pulse profile -> session user -> default pulse avatar mark
  let userAvatar = '';
  let userBio = 'Explorer of sovereign cybernetics and open communication protocols on Zenvitra.';
  let userDisplayName = cleanUser ? cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1) : 'Zen Traveler';

  if (typeof window !== 'undefined') {
    try {
      // 1. Check user's sovereign passport first
      const pass = JSON.parse(localStorage.getItem(`zenvitra_passport_${cleanUser}`) || '{}');
      if (pass?.avatarUrl && pass.avatarUrl !== '/assets/default-avatar.svg') {
        userAvatar = pass.avatarUrl;
        if (pass.fullName) userDisplayName = pass.fullName;
        if (pass.bio) userBio = pass.bio;
      }

      if (!userAvatar) {
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
