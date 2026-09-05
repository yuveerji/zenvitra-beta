export interface StoryFont {
  id: string;
  name: string;
  sample: string;
  category: 'Luxury' | 'Futuristic' | 'Editorial' | 'Street' | 'Mono' | 'Script' | 'Classic';
  fontFamily: string;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: number | string;
  letterSpacing?: string;
  cssClass?: string;
}

export const STORY_FONTS: StoryFont[] = [
  {
    id: 'clash',
    name: 'Zenvitra Sovereign',
    sample: 'SOVEREIGN',
    category: 'Luxury',
    fontFamily: "'Clash Display', var(--font-space), sans-serif",
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  {
    id: 'syne',
    name: 'ZenPulse Hyper',
    sample: 'ZENPULSE',
    category: 'Futuristic',
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    letterSpacing: '-0.01em',
  },
  {
    id: 'marker',
    name: 'ZenStreet Rebel',
    sample: 'REBEL',
    category: 'Street',
    fontFamily: "'Permanent Marker', cursive, sans-serif",
    fontWeight: 400,
  },
  {
    id: 'bebas',
    name: 'Pulse Vanguard',
    sample: 'VANGUARD',
    category: 'Editorial',
    fontFamily: "'Bebas Neue', sans-serif",
    fontWeight: 700,
    letterSpacing: '0.06em',
  },
  {
    id: 'script',
    name: 'Zenvitra Atelier',
    sample: 'Atelier',
    category: 'Script',
    fontFamily: "'Dancing Script', cursive",
    fontWeight: 700,
  },
  {
    id: 'orbitron',
    name: 'ZenMatrix Cyber',
    sample: 'MATRIX',
    category: 'Futuristic',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.05em',
  },
  {
    id: 'serif',
    name: 'Zenvitra Editorial',
    sample: 'Editorial',
    category: 'Editorial',
    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
    fontStyle: 'italic',
    fontWeight: 600,
  },
  {
    id: 'mono',
    name: 'ZenCipher Ledger',
    sample: 'CIPHER',
    category: 'Mono',
    fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
    fontWeight: 600,
  },
  {
    id: 'typewriter',
    name: 'Pulse Telegraph',
    sample: 'DISPATCH',
    category: 'Classic',
    fontFamily: "'Special Elite', cursive, monospace",
    fontWeight: 400,
  },
  {
    id: 'prata',
    name: 'ZenDynasty Royale',
    sample: 'ROYALE',
    category: 'Luxury',
    fontFamily: "'Prata', 'Cinzel Decorative', serif",
    fontWeight: 400,
    letterSpacing: '0.02em',
  },
];

export interface StoryGradient {
  id: string;
  name: string;
  gradientClass: string;
  previewColor: string;
}

export const STORY_GRADIENTS: StoryGradient[] = [
  { id: 'nebula', name: 'Midnight Nebula', gradientClass: 'from-purple-950 via-indigo-950 to-black', previewColor: '#581c87' },
  { id: 'ember', name: 'Sunset Ember', gradientClass: 'from-rose-950 via-amber-950 to-black', previewColor: '#881337' },
  { id: 'emerald', name: 'Cyber Emerald', gradientClass: 'from-emerald-950 via-teal-950 to-black', previewColor: '#064e3b' },
  { id: 'ocean', name: 'Electric Cyan', gradientClass: 'from-cyan-950 via-blue-950 to-black', previewColor: '#083344' },
  { id: 'gold', name: 'Obsidian Gold', gradientClass: 'from-amber-950 via-zinc-950 to-black', previewColor: '#78350f' },
  { id: 'velvet', name: 'Deep Velvet', gradientClass: 'from-fuchsia-950 via-purple-950 to-black', previewColor: '#701a75' },
];

export const STORY_STICKERS = [
  '⚡ Treaty 2026',
  '🏛️ Sovereign Grid',
  '🌍 Global Youth',
  '🔥 Trending Alert',
  '✨ Innovation Lab',
  '✊ Civic Wire',
  '📍 Geneva Node',
  '🎙️ UN Delegate',
  '🔒 E2EE Mesh',
];

export function getStoryFontStyle(fontId?: string): React.CSSProperties | undefined {
  if (!fontId || fontId === 'sans' || fontId === 'default' || fontId === 'standard') {
    return undefined;
  }
  const font = STORY_FONTS.find((f) => f.id === fontId);
  if (!font) return undefined;
  return {
    fontFamily: font.fontFamily,
    fontStyle: font.fontStyle || 'normal',
    fontWeight: font.fontWeight || 600,
    letterSpacing: font.letterSpacing || 'normal',
  };
}

