import { ZenSpaceProfile, ZenSpaceTheme } from '@/types/space';

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'video' | 'image';
  url: string;
  thumbnailUrl: string;
  vibe: string;
  category?: string;
  blur?: 'none' | 'sm' | 'md' | 'lg';
}

export interface ThemeRecommendation {
  theme: ZenSpaceTheme;
  name: string;
  reason: string;
  matchScore: number;
  recommendedBackgroundType: 'theme' | 'video' | 'image';
  recommendedBackgroundUrl?: string;
  recommendedEffect?: 'none' | 'grid' | 'stardust' | 'aurora' | 'geometry';
  suggestedEffect?: 'none' | 'grid' | 'stardust' | 'aurora' | 'geometry';
  paletteDescription: string;
  vibeTag: string;
  suggestedPreset?: BackgroundPreset;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // Video Presets
  {
    id: 'video-rain',
    name: 'Lo-Fi Rain & Reflection',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-close-up-1188-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=80',
    vibe: 'Audio / Ambient'
  },
  {
    id: 'video-cyber',
    name: 'Cyber Grid Horizon',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-graphs-and-data-31913-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    vibe: 'Tech / Sovereign'
  },
  {
    id: 'video-sunset-clouds',
    name: 'Cosmic Sunset Clouds',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-the-clouds-in-the-sunset-sky-40431-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    vibe: 'Dreamy / Sunset'
  },
  {
    id: 'video-beach-waves',
    name: 'Calm Ocean Waves',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80',
    vibe: 'Minimal / Clean'
  },

  // Image Presets
  {
    id: 'img-sandstone',
    name: 'Sandstone Architecture',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    vibe: 'Linktree Minimal Sand'
  },
  {
    id: 'img-prism',
    name: 'Prism Glass Flow',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    vibe: 'Modern Fluid'
  },
  {
    id: 'img-monochrome',
    name: 'Moody Studio Charcoal',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80',
    vibe: 'Stealth Pro'
  },
  {
    id: 'img-canopy',
    name: 'Emerald Moss Forest',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
    vibe: 'Earth & Organic'
  },
  {
    id: 'img-tokyo-night',
    name: 'Tokyo Cyber Neon',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80',
    vibe: 'Neo Tokyo'
  },
  {
    id: 'img-parchment',
    name: 'Antique Archive Paper',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80',
    vibe: 'Editorial Serif'
  }
];

/**
 * Intelligent Theme Stylist Algorithm
 * Evaluates block content types, organization status, and profile biography to suggest
 * optimal visual themes and background aesthetics.
 */
export function suggestSmartThemes(profile: ZenSpaceProfile): ThemeRecommendation[] {
  const blocks = profile.blocks || [];
  const hasMusic = blocks.some(b => b.type === 'music');
  const hasForm = blocks.some(b => b.type === 'form');
  const hasVideo = blocks.some(b => b.type === 'video');
  const hasImage = blocks.some(b => b.type === 'image');
  const hasDocs = blocks.some(b => b.type === 'docs');
  const hasPress = blocks.some(b => b.type === 'press');
  const hasDonate = blocks.some(b => b.type === 'donate');
  const hasCustomDeviceBackdrop = profile.backgroundType === 'image' && Boolean(profile.imageBackgroundUrl);
  const isOrg = Boolean(profile.isOrganization);

  const textCorpus = `${profile.displayName} ${profile.role} ${profile.bio} ${profile.organizationType || ''} ${blocks.map(b => `${b.title} ${b.subtitle || ''}`).join(' ')}`.toLowerCase();

  const isDiplomatic = /mun|model un|forum|delegate|diplomat|caucus|treaty|embassy|un|geneva|security council/i.test(textCorpus);
  const isTechBuilder = /tech|developer|builder|sovereign|crypto|blockchain|ai|code|engineer|node/i.test(textCorpus);
  const isCreativeMusic = /music|sound|beat|producer|artist|dj|track|audio|playlist|lo-fi|synth/i.test(textCorpus);
  const isJournalist = /press|dispatch|investigative|editor|writer|author|journalism|gazette/i.test(textCorpus);
  const isOrganic = /eco|green|climate|nature|wellness|earth|sustainable|forest|garden/i.test(textCorpus);

  const candidates: ThemeRecommendation[] = [];

  // 0. Clean Canvas (No seeded blocks - user starting fresh from device)
  if (blocks.length === 0) {
    candidates.push({
      theme: 'minimal_sand',
      name: 'Minimal Sand (Clean Canvas)',
      reason: 'Clean canvas with zero seeded data. High-contrast white cards ready for your custom links, forms, and root device media uploads.',
      matchScore: 99,
      recommendedBackgroundType: 'theme',
      recommendedEffect: 'none',
      paletteDescription: 'Warm Sand #D8C5AA • Ink Black #1a1612 • White Pill Cards',
      vibeTag: 'Pure Canvas'
    });
    candidates.push({
      theme: 'ceramic_white',
      name: 'Ceramic White Minimal',
      reason: 'Ultra-crisp monochrome aesthetic designed for custom photo galleries and device uploads without distraction.',
      matchScore: 95,
      recommendedBackgroundType: 'theme',
      recommendedEffect: 'none',
      paletteDescription: 'Pure Snow #fafafa • Slate Charcoal #0f172a • Minimal Borders',
      vibeTag: 'Architectural'
    });
  }

  // 1. Linktree Minimal Sand Recommendation
  if (hasForm || isOrg || isDiplomatic || hasImage || hasCustomDeviceBackdrop) {
    candidates.push({
      theme: 'minimal_sand',
      name: 'Minimal Sand (Linktree Aesthetic)',
      reason: hasCustomDeviceBackdrop
        ? 'Pairs your custom root-device backdrop image with frosted white cards and dark ink badges for maximum legibility.'
        : isOrg 
          ? 'Best fit for institutional forums & MUN bodies. Warm parchment background with high-contrast white rounded cards and dark ink badges.'
          : 'Pairs crisp white cards with a soothing warm sand canvas, optimizing readability for your interactive forms and device uploads.',
      matchScore: 98,
      recommendedBackgroundType: hasCustomDeviceBackdrop ? 'image' : 'theme',
      recommendedBackgroundUrl: hasCustomDeviceBackdrop ? profile.imageBackgroundUrl : undefined,
      recommendedEffect: 'none',
      paletteDescription: 'Warm Sand #D8C5AA • Ink Black #1a1612 • White Pill Cards',
      vibeTag: 'Clean Editorial'
    });
  }

  // 2. Synthwave / Neo Tokyo Recommendation
  if (hasMusic || isCreativeMusic) {
    candidates.push({
      theme: 'synthwave',
      name: 'Retro Synthwave',
      reason: 'Your space features audio tracks! Synthwave highlights live soundbar waves with vibrant neon magenta, violet glows, and retro 80s dusk.',
      matchScore: 96,
      recommendedBackgroundType: 'video',
      recommendedBackgroundUrl: BACKGROUND_PRESETS[0].url, // Lo-Fi Rain
      recommendedEffect: 'grid',
      paletteDescription: 'Deep Purple #140728 • Neon Fuchsia #f43f5e • Cyan Sparks',
      vibeTag: 'Audio / Cyber Vibe'
    });

    candidates.push({
      theme: 'neo_tokyo',
      name: 'Neo Tokyo Night',
      reason: 'Electric violet and moody obsidian create a futuristic night-market ambiance that makes music blocks feel like a live performance.',
      matchScore: 92,
      recommendedBackgroundType: 'image',
      recommendedBackgroundUrl: BACKGROUND_PRESETS[8].url, // Tokyo Neon
      recommendedEffect: 'aurora',
      paletteDescription: 'Midnight Void #090514 • Electric Violet #a855f7 • Laser Pink',
      vibeTag: 'Futuristic'
    });
  }

  // 3. Geneva Diplomatic Gold
  if (isDiplomatic || hasDocs) {
    candidates.push({
      theme: 'geneva',
      name: 'Geneva Sovereign',
      reason: 'Official diplomatic palette combining deep Swiss navy with brushed diplomatic gold accents, ideal for MUN leaders and secretariat portals.',
      matchScore: 94,
      recommendedBackgroundType: 'theme',
      recommendedEffect: 'grid',
      paletteDescription: 'Diplomatic Navy #030b1e • Royal Gold #f59e0b • Cobalt Borders',
      vibeTag: 'Diplomatic'
    });
  }

  // 4. Editorial Paper
  if (hasPress || isJournalist || hasDocs) {
    candidates.push({
      theme: 'editorial_paper',
      name: 'Editorial Antique Paper',
      reason: 'Modeled after historic gazettes and broadsheets. Subtle aged newsprint texture with serif headings and timeless intellectual presence.',
      matchScore: 90,
      recommendedBackgroundType: 'image',
      recommendedBackgroundUrl: BACKGROUND_PRESETS[9].url, // Antique paper
      recommendedEffect: 'none',
      paletteDescription: 'Antique Parchment #ede4d1 • Lead Ink #1c1815 • Minimal Borders',
      vibeTag: 'Literary & Press'
    });
  }

  // 5. Velvet Wine
  if (isDiplomatic || isOrg || profile.badges.includes('SOVEREIGN_NODE')) {
    candidates.push({
      theme: 'velvet_wine',
      name: 'Bordeaux Velvet Wine',
      reason: 'Deep Cabernet burgundy with rose gold highlights and frosted glass styling, conferring luxury and sovereign distinction.',
      matchScore: 88,
      recommendedBackgroundType: 'theme',
      recommendedEffect: 'stardust',
      paletteDescription: 'Cabernet Red #19050d • Rose Gold #fb7185 • Frosted Merlot Cards',
      vibeTag: 'Luxury'
    });
  }

  // 6. Matcha Latte
  if (isOrganic || hasDonate) {
    candidates.push({
      theme: 'matcha_latte',
      name: 'Matcha Latte Organic',
      reason: 'Calming earthy sage green with warm foam cream cards. Welcoming, organic, and grounded aesthetic for civic initiatives.',
      matchScore: 89,
      recommendedBackgroundType: 'image',
      recommendedBackgroundUrl: BACKGROUND_PRESETS[7].url, // Emerald forest
      recommendedEffect: 'none',
      paletteDescription: 'Matcha Sage #cbd5b8 • Foam Cream #faf8f3 • Leaf Dark #283618',
      vibeTag: 'Organic'
    });
  }

  // 7. Cyberpunk / Obsidian for Tech Builders
  if (isTechBuilder || (!hasMusic && !isDiplomatic)) {
    candidates.push({
      theme: 'cyberpunk',
      name: 'Cyberpunk Matrix',
      reason: 'Neon cyan terminal glowing over deep void black with matrix grid backdrop, perfect for protocol builders and sovereign technologists.',
      matchScore: 87,
      recommendedBackgroundType: 'video',
      recommendedBackgroundUrl: BACKGROUND_PRESETS[1].url, // Cyber grid
      recommendedEffect: 'grid',
      paletteDescription: 'Obsidian #04060f • Neon Cyan #06b6d4 • Indigo Matrix',
      vibeTag: 'High-Tech'
    });
  }

  // 8. Ceramic White
  candidates.push({
    theme: 'ceramic_white',
    name: 'Ceramic White Minimal',
    reason: 'Ultra-pure architectural monochrome with soft micro-shadows, offering an exceptionally crisp, modern presentation.',
    matchScore: 85,
    recommendedBackgroundType: 'image',
    recommendedBackgroundUrl: BACKGROUND_PRESETS[4].url, // Sandstone architecture
    recommendedEffect: 'none',
    paletteDescription: 'Pure Snow #fafafa • Slate Charcoal #0f172a • Razor Borders',
    vibeTag: 'Architectural'
  });

  // 9. Alpine Dusk
  candidates.push({
    theme: 'alpine_dusk',
    name: 'Alpine Dusk',
    reason: 'Misty glacial slate blending with twilight lavender. Subtle, modern, and serene atmosphere.',
    matchScore: 84,
    recommendedBackgroundType: 'theme',
    recommendedEffect: 'aurora',
    paletteDescription: 'Twilight Slate #101426 • Glacial Violet #818cf8 • Cool Fog',
    vibeTag: 'Atmospheric'
  });

  // Populate suggestedPreset and suggestedEffect mappings
  const enriched = candidates.map(c => ({
    ...c,
    suggestedEffect: c.suggestedEffect || c.recommendedEffect || 'none',
    suggestedPreset: c.recommendedBackgroundUrl 
      ? BACKGROUND_PRESETS.find(p => p.url === c.recommendedBackgroundUrl) 
      : undefined
  }));

  // Sort by match score descending
  return enriched.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
}
