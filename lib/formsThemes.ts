import { ZenFormCustomStyle, ZenFormFontFamily, ZenFormTheme } from '@/types/forms';

export interface FontOption {
  name: ZenFormFontFamily;
  category: 'Modern Sans' | 'Editorial Serif' | 'Futuristic / Tech' | 'Expressive / Headline';
  cssFamily: string;
  previewSample: string;
}

export const ZEN_FORM_FONTS: FontOption[] = [
  {
    name: 'Space Grotesk',
    category: 'Modern Sans',
    cssFamily: "var(--font-space), 'Space Grotesk', sans-serif",
    previewSample: 'Diplomacy & Modern Tech',
  },
  {
    name: 'Playfair Display',
    category: 'Editorial Serif',
    cssFamily: "var(--font-playfair), 'Playfair Display', serif",
    previewSample: 'Sovereign Treaty & Dialogue',
  },
  {
    name: 'Syne',
    category: 'Expressive / Headline',
    cssFamily: "'Syne', sans-serif",
    previewSample: 'Avant-Garde Architecture',
  },
  {
    name: 'Outfit',
    category: 'Modern Sans',
    cssFamily: "var(--font-outfit), 'Outfit', sans-serif",
    previewSample: 'Sleek Minimalist Form',
  },
  {
    name: 'Clash Display',
    category: 'Expressive / Headline',
    cssFamily: "'Clash Display', sans-serif",
    previewSample: 'Bold Editorial Punch',
  },
  {
    name: 'JetBrains Mono',
    category: 'Futuristic / Tech',
    cssFamily: "var(--font-mono), 'JetBrains Mono', monospace",
    previewSample: 'const sovereignty = true;',
  },
  {
    name: 'Bebas Neue',
    category: 'Expressive / Headline',
    cssFamily: "'Bebas Neue', sans-serif",
    previewSample: 'GLOBAL SUMMIT 2026',
  },
  {
    name: 'Prata',
    category: 'Editorial Serif',
    cssFamily: "'Prata', Georgia, serif",
    previewSample: 'Classical Dignity & Grace',
  },
  {
    name: 'Orbitron',
    category: 'Futuristic / Tech',
    cssFamily: "'Orbitron', sans-serif",
    previewSample: 'CYBER WARFARE DAIS',
  },
  {
    name: 'Dancing Script',
    category: 'Expressive / Headline',
    cssFamily: "'Dancing Script', cursive",
    previewSample: 'Artisanal & Handwritten Signature',
  },
  {
    name: 'Inter',
    category: 'Modern Sans',
    cssFamily: "var(--font-inter), 'Inter', sans-serif",
    previewSample: 'Crisp Global Standard',
  },
];

export function getFontCssFamily(fontName?: ZenFormFontFamily): string {
  const found = ZEN_FORM_FONTS.find((f) => f.name === fontName);
  return found ? found.cssFamily : "var(--font-inter), 'Inter', sans-serif";
}

export interface GradientPreset {
  id: string;
  name: string;
  css: string;
  glow: string;
  defaultAccent: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'amber_dawn',
    name: 'Diplomatic Gold',
    css: 'linear-gradient(180deg, #131722 0%, #0c0f17 50%, #05070a 100%)',
    glow: 'rgba(245, 158, 11, 0.15)',
    defaultAccent: '#f59e0b',
  },
  {
    id: 'midnight_cyan',
    name: 'Cyber Midnight',
    css: 'linear-gradient(180deg, #071326 0%, #040a14 50%, #02050a 100%)',
    glow: 'rgba(6, 182, 212, 0.15)',
    defaultAccent: '#06b6d4',
  },
  {
    id: 'obsidian_noir',
    name: 'Obsidian Stealth',
    css: 'linear-gradient(180deg, #141414 0%, #0a0a0a 50%, #020202 100%)',
    glow: 'rgba(255, 255, 255, 0.08)',
    defaultAccent: '#ffffff',
  },
  {
    id: 'emerald_matrix',
    name: 'Emerald Oasis',
    css: 'linear-gradient(180deg, #061c14 0%, #030e0a 50%, #010604 100%)',
    glow: 'rgba(16, 185, 129, 0.15)',
    defaultAccent: '#10b981',
  },
  {
    id: 'royal_purple',
    name: 'Royal Sovereign',
    css: 'linear-gradient(180deg, #1a0c2e 0%, #0f071b 50%, #05020a 100%)',
    glow: 'rgba(139, 92, 246, 0.15)',
    defaultAccent: '#8b5cf6',
  },
  {
    id: 'crimson_dusk',
    name: 'Crimson Velvet',
    css: 'linear-gradient(180deg, #240812 0%, #13040a 50%, #070104 100%)',
    glow: 'rgba(244, 63, 94, 0.15)',
    defaultAccent: '#f43f5e',
  },
  {
    id: 'deep_ocean',
    name: 'Deep Oceanic Abyss',
    css: 'linear-gradient(180deg, #091a2e 0%, #050d17 50%, #010408 100%)',
    glow: 'rgba(59, 130, 246, 0.15)',
    defaultAccent: '#3b82f6',
  },
  {
    id: 'sunset_horizon',
    name: 'Warm Sunset Glow',
    css: 'linear-gradient(180deg, #26141a 0%, #150a0e 50%, #080305 100%)',
    glow: 'rgba(251, 146, 60, 0.15)',
    defaultAccent: '#fb923c',
  },
];

export const ACCENT_COLOR_PALETTES = [
  { name: 'Amber Gold', hex: '#f59e0b', textHex: '#000000' },
  { name: 'Electric Cyan', hex: '#06b6d4', textHex: '#000000' },
  { name: 'Matrix Emerald', hex: '#10b981', textHex: '#000000' },
  { name: 'Sovereign Violet', hex: '#8b5cf6', textHex: '#ffffff' },
  { name: 'Neon Rose', hex: '#f43f5e', textHex: '#ffffff' },
  { name: 'Deep Azure', hex: '#3b82f6', textHex: '#ffffff' },
  { name: 'Sunset Orange', hex: '#fb923c', textHex: '#000000' },
  { name: 'Pure Pearl', hex: '#ffffff', textHex: '#000000' },
];

export const CARD_BORDER_RADIUS_MAP = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
  '3xl': 'rounded-[2.5rem]',
  full: 'rounded-[3rem]',
};

export const APPS_SCRIPT_TEMPLATE = `// ════════════════════════════════════════════════════════════════
// ZENVITRA ZENFORMS — REAL-TIME GOOGLE SHEETS CONNECTOR (10 SECONDS)
// 1. In your Google Sheet, click: Extensions > Apps Script
// 2. Delete existing code, paste this script, click Save
// 3. Click Deploy > New deployment
// 4. Select type: Web app
// 5. Execute as: Me | Who has access: Anyone
// 6. Click Deploy, authorize, and copy the Web App URL!
// ════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var payload = JSON.parse(raw);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0 && payload.headers && payload.headers.length > 0) {
      sheet.appendRow(payload.headers);
      var headerRange = sheet.getRange(1, 1, 1, payload.headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#111827");
      headerRange.setFontColor("#f9fafb");
    }
    
    // Append rows
    if (payload.rows && payload.rows.length > 0) {
      for (var i = 0; i < payload.rows.length; i++) {
        sheet.appendRow(payload.rows[i]);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", count: payload.rows.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
