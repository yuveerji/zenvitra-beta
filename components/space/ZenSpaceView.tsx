'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ZenSpaceProfile, 
  ZenSpaceTheme, 
  ZenSpaceEffect, 
  ZenSpaceBlock,
  ZenSpaceBlockType
} from '@/types/space';
import { 
  getZenSpaceProfile, 
  saveZenSpaceProfile, 
  trackBlockClick, 
  recordFormSubmission
} from '@/lib/spaceStorage';
import { 
  suggestSmartThemes, 
  BACKGROUND_PRESETS, 
  ThemeRecommendation,
  BackgroundPreset 
} from '@/lib/spaceStylistAlgo';
import { useAuth } from '@/context/AuthContext';
import { 
  Share2, 
  Check, 
  ExternalLink, 
  Video, 
  MessageSquare, 
  Music, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Palette, 
  Smartphone, 
  Monitor, 
  Plus, 
  Play, 
  Pause, 
  Globe, 
  Twitter, 
  Github, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Mail, 
  Send, 
  Award, 
  Zap, 
  ChevronRight, 
  X,
  Heart,
  Calendar,
  Clock,
  LayoutGrid,
  List,
  CheckCircle2,
  Lock,
  Phone,
  Building2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Volume2,
  Film,
  Trash2,
  Wand2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// Live Soundbar Waves Visualizer Component
function LiveSoundbarWaves({ isPlaying, isLight }: { isPlaying: boolean; isLight?: boolean }) {
  const barClass = isLight ? 'bg-neutral-900' : 'bg-cyan-400';
  return (
    <div 
      className={`flex items-end gap-[3px] h-4.5 px-2 py-0.5 rounded-full backdrop-blur-xs border ${
        isLight ? 'bg-black/5 border-black/10' : 'bg-white/10 border-white/10'
      }`}
      title={isPlaying ? "Audio playing live" : "Soundbar paused"}
    >
      <span
        className={`w-[2.5px] rounded-full transition-all duration-300 ${barClass} ${
          isPlaying ? 'animate-[zenWave1_0.6s_ease-in-out_infinite_alternate] h-3.5' : 'h-[3px] opacity-40'
        }`}
      />
      <span
        className={`w-[2.5px] rounded-full transition-all duration-300 ${barClass} ${
          isPlaying ? 'animate-[zenWave2_0.5s_ease-in-out_infinite_alternate_0.15s] h-4' : 'h-[4px] opacity-40'
        }`}
      />
      <span
        className={`w-[2.5px] rounded-full transition-all duration-300 ${barClass} ${
          isPlaying ? 'animate-[zenWave3_0.7s_ease-in-out_infinite_alternate_0.3s] h-2.5' : 'h-[3px] opacity-40'
        }`}
      />
      <span
        className={`w-[2.5px] rounded-full transition-all duration-300 ${barClass} ${
          isPlaying ? 'animate-[zenWave4_0.45s_ease-in-out_infinite_alternate_0.1s] h-4' : 'h-[5px] opacity-40'
        }`}
      />
      <span
        className={`w-[2.5px] rounded-full transition-all duration-300 ${barClass} ${
          isPlaying ? 'animate-[zenWave5_0.55s_ease-in-out_infinite_alternate_0.25s] h-3' : 'h-[3px] opacity-40'
        }`}
      />
    </div>
  );
}

interface ZenSpaceViewProps {
  username: string;
}

const THEME_CONFIG: Record<ZenSpaceTheme, {
  bg: string;
  cardBg: string;
  border: string;
  accent: string;
  accentGlow: string;
  textPrimary: string;
  textMuted: string;
  badgeBg: string;
  inputBg: string;
  isLight?: boolean;
}> = {
  minimal_sand: {
    bg: 'from-[#D8C5AA] via-[#D0BCA0] to-[#C8B294]',
    cardBg: 'bg-white hover:bg-neutral-50 shadow-[0_4px_16px_rgba(0,0,0,0.06)]',
    border: 'border-neutral-900/80 hover:border-black',
    accent: 'text-neutral-900',
    accentGlow: 'shadow-[0_4px_24px_rgba(0,0,0,0.12)]',
    textPrimary: 'text-[#1a1612]',
    textMuted: 'text-neutral-600',
    badgeBg: 'bg-neutral-900 text-white border-neutral-900',
    inputBg: 'bg-white border-neutral-300 text-neutral-900',
    isLight: true
  },
  minimal_cream: {
    bg: 'from-[#F5F2EB] via-[#ECE6DA] to-[#E3DCCB]',
    cardBg: 'bg-white hover:bg-neutral-50 shadow-[0_4px_16px_rgba(0,0,0,0.05)]',
    border: 'border-neutral-300 hover:border-neutral-500',
    accent: 'text-neutral-900',
    accentGlow: 'shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
    textPrimary: 'text-neutral-900',
    textMuted: 'text-neutral-600',
    badgeBg: 'bg-neutral-200 text-neutral-800 border-neutral-300',
    inputBg: 'bg-white border-neutral-300 text-neutral-900',
    isLight: true
  },
  minimal_dark: {
    bg: 'from-[#0e0e11] via-[#121216] to-[#0a0a0c]',
    cardBg: 'bg-zinc-900/90 hover:bg-zinc-850',
    border: 'border-zinc-800 hover:border-zinc-700',
    accent: 'text-white',
    accentGlow: 'shadow-[0_0_20px_rgba(255,255,255,0.08)]',
    textPrimary: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    badgeBg: 'bg-zinc-800 text-zinc-200 border-zinc-700',
    inputBg: 'bg-zinc-800 border-zinc-700 text-white',
    isLight: false
  },
  ceramic_white: {
    bg: 'from-[#FAFAFA] via-[#F4F4F6] to-[#EAEAEF]',
    cardBg: 'bg-white/95 hover:bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
    border: 'border-slate-200 hover:border-slate-400',
    accent: 'text-slate-900',
    accentGlow: 'shadow-[0_4px_20px_rgba(15,23,42,0.08)]',
    textPrimary: 'text-slate-900',
    textMuted: 'text-slate-500',
    badgeBg: 'bg-slate-900 text-white border-slate-900',
    inputBg: 'bg-white border-slate-300 text-slate-900',
    isLight: true
  },
  editorial_paper: {
    bg: 'from-[#FDFBF7] via-[#F6F2E9] to-[#EEE7D8]',
    cardBg: 'bg-white/90 hover:bg-white shadow-[0_2px_12px_rgba(50,40,30,0.06)]',
    border: 'border-[#2C241D]/70 hover:border-[#1A140F]',
    accent: 'text-[#1A140F]',
    accentGlow: 'shadow-[0_4px_16px_rgba(44,36,29,0.12)]',
    textPrimary: 'text-[#1A140F]',
    textMuted: 'text-[#61564C]',
    badgeBg: 'bg-[#1A140F] text-[#FDFBF7] border-[#1A140F]',
    inputBg: 'bg-[#FDFBF7] border-[#2C241D]/40 text-[#1A140F]',
    isLight: true
  },
  matcha_latte: {
    bg: 'from-[#E8EFE8] via-[#DFE9DF] to-[#D2E2D3]',
    cardBg: 'bg-[#F4F9F4]/90 hover:bg-white shadow-[0_4px_20px_rgba(46,76,50,0.08)]',
    border: 'border-[#7D9D80]/40 hover:border-[#527756]',
    accent: 'text-[#2E4C32]',
    accentGlow: 'shadow-[0_4px_24px_rgba(74,115,79,0.18)]',
    textPrimary: 'text-[#1B3020]',
    textMuted: 'text-[#4F6C53]',
    badgeBg: 'bg-[#3A5D3E] text-white border-[#2A472E]',
    inputBg: 'bg-white/90 border-[#A3BFA5] text-[#1B3020]',
    isLight: true
  },
  synthwave: {
    bg: 'from-[#1a0826] via-[#240a34] to-[#0d0218]',
    cardBg: 'bg-[#2b0c3d]/60 hover:bg-[#380e50]/80',
    border: 'border-fuchsia-500/40 hover:border-pink-400',
    accent: 'text-fuchsia-400',
    accentGlow: 'shadow-[0_0_28px_rgba(217,70,239,0.3)]',
    textPrimary: 'text-pink-50',
    textMuted: 'text-pink-300/70',
    badgeBg: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/50',
    inputBg: 'bg-[#220730]/90 border-fuchsia-500/40 text-pink-50',
    isLight: false
  },
  velvet_wine: {
    bg: 'from-[#1e040c] via-[#2d0714] to-[#120207]',
    cardBg: 'bg-[#3d0a1b]/60 hover:bg-[#4d0d23]/80',
    border: 'border-rose-700/50 hover:border-rose-500',
    accent: 'text-rose-400',
    accentGlow: 'shadow-[0_0_26px_rgba(244,63,94,0.22)]',
    textPrimary: 'text-rose-50',
    textMuted: 'text-rose-300/70',
    badgeBg: 'bg-rose-950/90 text-rose-300 border-rose-700/60',
    inputBg: 'bg-[#280511] border-rose-800 text-rose-50',
    isLight: false
  },
  neo_tokyo: {
    bg: 'from-[#080214] via-[#050b1a] to-[#010207]',
    cardBg: 'bg-indigo-950/40 hover:bg-indigo-950/70',
    border: 'border-cyan-400/40 hover:border-fuchsia-400/70',
    accent: 'text-cyan-300',
    accentGlow: 'shadow-[0_0_28px_rgba(34,211,238,0.28)]',
    textPrimary: 'text-white',
    textMuted: 'text-indigo-200/70',
    badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-400/40',
    inputBg: 'bg-indigo-950/60 border-cyan-500/30 text-white',
    isLight: false
  },
  alpine_dusk: {
    bg: 'from-[#0b1322] via-[#101b30] to-[#070b14]',
    cardBg: 'bg-slate-900/70 hover:bg-slate-850',
    border: 'border-sky-600/40 hover:border-sky-400',
    accent: 'text-sky-300',
    accentGlow: 'shadow-[0_0_25px_rgba(56,189,248,0.2)]',
    textPrimary: 'text-slate-100',
    textMuted: 'text-slate-400',
    badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-600/50',
    inputBg: 'bg-slate-900 border-sky-700/50 text-white',
    isLight: false
  },
  cyberpunk: {
    bg: 'from-[#0d071b] via-[#090b1c] to-[#04060f]',
    cardBg: 'bg-black/60 hover:bg-black/80',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    accent: 'text-cyan-400',
    accentGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    textPrimary: 'text-white',
    textMuted: 'text-slate-400',
    badgeBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
    inputBg: 'bg-black/70 border-cyan-500/30 text-white',
    isLight: false
  },
  obsidian: {
    bg: 'from-[#050507] via-[#08080c] to-[#030305]',
    cardBg: 'bg-zinc-950/80 hover:bg-zinc-900/90',
    border: 'border-zinc-800 hover:border-zinc-600',
    accent: 'text-zinc-200',
    accentGlow: 'shadow-[0_0_25px_rgba(255,255,255,0.08)]',
    textPrimary: 'text-zinc-100',
    textMuted: 'text-zinc-500',
    badgeBg: 'bg-zinc-900/90 text-zinc-300 border-zinc-700',
    inputBg: 'bg-zinc-900 border-zinc-700 text-white',
    isLight: false
  },
  geneva: {
    bg: 'from-[#030b1e] via-[#05112c] to-[#020712]',
    cardBg: 'bg-[#061233]/70 hover:bg-[#081740]/90',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    accent: 'text-amber-400',
    accentGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    textPrimary: 'text-amber-50',
    textMuted: 'text-blue-300/70',
    badgeBg: 'bg-amber-950/50 text-amber-300 border-amber-500/40',
    inputBg: 'bg-[#0a1b47] border-amber-500/30 text-white',
    isLight: false
  },
  aurora: {
    bg: 'from-[#021812] via-[#041a1c] to-[#020f12]',
    cardBg: 'bg-emerald-950/40 hover:bg-emerald-950/70',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    accent: 'text-emerald-400',
    accentGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    textPrimary: 'text-emerald-50',
    textMuted: 'text-emerald-300/70',
    badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
    inputBg: 'bg-emerald-950/80 border-emerald-500/40 text-white',
    isLight: false
  },
  solar: {
    bg: 'from-[#190b05] via-[#1f0e07] to-[#0d0503]',
    cardBg: 'bg-orange-950/40 hover:bg-orange-950/70',
    border: 'border-orange-500/30 hover:border-orange-400/60',
    accent: 'text-orange-400',
    accentGlow: 'shadow-[0_0_25px_rgba(249,115,22,0.25)]',
    textPrimary: 'text-orange-50',
    textMuted: 'text-orange-300/70',
    badgeBg: 'bg-orange-950/70 text-orange-300 border-orange-500/40',
    inputBg: 'bg-orange-950/80 border-orange-500/40 text-white',
    isLight: false
  },
  nordic: {
    bg: 'from-[#07131e] via-[#091b2c] to-[#050d14]',
    cardBg: 'bg-sky-950/40 hover:bg-sky-950/70',
    border: 'border-sky-500/30 hover:border-sky-400/60',
    accent: 'text-sky-400',
    accentGlow: 'shadow-[0_0_25px_rgba(14,165,233,0.25)]',
    textPrimary: 'text-sky-50',
    textMuted: 'text-sky-300/70',
    badgeBg: 'bg-sky-950/70 text-sky-300 border-sky-500/40',
    inputBg: 'bg-sky-950/80 border-sky-500/40 text-white',
    isLight: false
  }
};

export function ZenSpaceView({ username }: ZenSpaceViewProps) {
  const router = useRouter();
  const { user: authUser, profile: authProfile, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<ZenSpaceProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'stream' | 'bento'>('stream');
  
  // Real HTML5 Audio State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingBlockId, setPlayingBlockId] = useState<string | null>(null);

  // Modals & Drawers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [modalFormBlock, setModalFormBlock] = useState<ZenSpaceBlock | null>(null);

  // Expandable Accordion Forms state
  const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
  
  // Form submission state tracking per block
  const [formSubmitting, setFormSubmitting] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState<Record<string, boolean>>({});
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({});

  // Editor states
  const [newBlockType, setNewBlockType] = useState<ZenSpaceBlockType>('link');
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockUrl, setNewBlockUrl] = useState('');
  const [newBlockSub, setNewBlockSub] = useState('');
  const [newBlockHighlight, setNewBlockHighlight] = useState(false);
  const [newBlockFormMode, setNewBlockFormMode] = useState<'embed' | 'modal' | 'redirect'>('embed');
  const [newBlockAudioUrl, setNewBlockAudioUrl] = useState('');
  const [newBlockImageUrl, setNewBlockImageUrl] = useState('');

  // Space Profile Edit states (for owner)
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editIsOrg, setEditIsOrg] = useState(false);
  const [editOrgType, setEditOrgType] = useState('Forum / MUN');
  const [editBgType, setEditBgType] = useState<'theme' | 'video' | 'image' | 'custom_color'>('theme');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImageBlur, setEditImageBlur] = useState<'none' | 'sm' | 'md' | 'lg'>('md');
  const [editOverlayOpacity, setEditOverlayOpacity] = useState<number>(0.72);
  const [editInstagram, setEditInstagram] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // New Space Creation Form states
  const [claimUsername, setClaimUsername] = useState('');
  const [claimDisplayName, setClaimDisplayName] = useState('');
  const [claimBio, setClaimBio] = useState('');
  const [claimRole, setClaimRole] = useState('Diplomat & Sovereign Builder');
  const [claimIsOrg, setClaimIsOrg] = useState(false);
  const [claimOrgType, setClaimOrgType] = useState('Forum / MUN');
  const [claimTheme, setClaimTheme] = useState<ZenSpaceTheme>('minimal_sand');

  const [activeEffect, setActiveEffect] = useState<ZenSpaceEffect>('grid');
  const [activeTheme, setActiveTheme] = useState<ZenSpaceTheme>('minimal_sand');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load profile
  useEffect(() => {
    const loaded = getZenSpaceProfile(username);
    setProfile(loaded);
    setActiveTheme(loaded.theme);
    setActiveEffect(loaded.effect);
    setLayoutMode(loaded.layout || 'stream');

    // Populate edit fields
    setEditDisplayName(loaded.displayName || '');
    setEditBio(loaded.bio || '');
    setEditAvatar(loaded.avatar || '');
    setEditRole(loaded.role || '');
    setEditIsOrg(loaded.isOrganization || false);
    setEditOrgType(loaded.organizationType || 'Forum / MUN');
    setEditBgType((loaded.backgroundType as any) || 'theme');
    setEditVideoUrl(loaded.videoBackgroundUrl || '');
    setEditImageUrl(loaded.imageBackgroundUrl || '');
    setEditImageBlur(loaded.imageBlur || 'md');
    setEditOverlayOpacity(loaded.backgroundOverlayOpacity ?? 0.72);
    setEditInstagram(loaded.socials?.instagram || '');
    setEditPhone(loaded.socials?.phone || '');
  }, [username]);

  // AI Theme Stylist Recommendations (calculated reactively based on profile elements & blocks)
  const stylistRecommendations = useMemo<ThemeRecommendation[]>(() => {
    if (!profile) return [];
    return suggestSmartThemes(profile);
  }, [profile]);

  // Apply Stylist Recommendation 1-Click
  const handleApplyRecommendation = (rec: ThemeRecommendation) => {
    if (!profile) return;
    const preset = rec.suggestedPreset;
    const fallbackBgType: 'theme' | 'video' | 'image' | 'custom_color' = 
      profile.backgroundType === 'color' ? 'theme' : (profile.backgroundType || 'theme');
    const newBgType: 'theme' | 'video' | 'image' | 'custom_color' = preset 
      ? (preset.type === 'video' ? 'video' : 'image') 
      : (rec.recommendedBackgroundType || fallbackBgType);
    const newVideoUrl = preset?.type === 'video' ? preset.url : profile.videoBackgroundUrl;
    const newImageUrl = preset?.type === 'image' ? preset.url : profile.imageBackgroundUrl;
    const newImageBlur = preset?.type === 'image' ? (preset.blur || 'md') : profile.imageBlur;
    const targetEffect = rec.suggestedEffect || rec.recommendedEffect || 'none';

    const updated: ZenSpaceProfile = {
      ...profile,
      theme: rec.theme,
      effect: targetEffect,
      backgroundType: newBgType,
      videoBackgroundUrl: newVideoUrl,
      imageBackgroundUrl: newImageUrl,
      imageBlur: newImageBlur,
      backgroundOverlayOpacity: profile.backgroundOverlayOpacity ?? 0.72
    };

    setActiveTheme(rec.theme);
    setActiveEffect(targetEffect);
    setEditBgType(newBgType);
    if (newVideoUrl) setEditVideoUrl(newVideoUrl);
    if (newImageUrl) setEditImageUrl(newImageUrl);
    if (newImageBlur) setEditImageBlur(newImageBlur);

    setProfile(updated);
    saveZenSpaceProfile(updated);
    showToast(`✨ Stylist applied: ${rec.theme.replace(/_/g, ' ')} (${rec.matchScore}% match)`);
  };

  // 1-Click Backdrop Preset Selection
  const handleSelectBackgroundPreset = (preset: BackgroundPreset) => {
    if (!profile) return;
    if (preset.type === 'video') {
      setEditBgType('video');
      setEditVideoUrl(preset.url);
      const updated: ZenSpaceProfile = {
        ...profile,
        backgroundType: 'video',
        videoBackgroundUrl: preset.url
      };
      setProfile(updated);
      saveZenSpaceProfile(updated);
      showToast(`Backdrop video set: ${preset.name}`);
    } else {
      setEditBgType('image');
      setEditImageUrl(preset.url);
      setEditImageBlur(preset.blur || 'md');
      const updated: ZenSpaceProfile = {
        ...profile,
        backgroundType: 'image',
        imageBackgroundUrl: preset.url,
        imageBlur: preset.blur || 'md'
      };
      setProfile(updated);
      saveZenSpaceProfile(updated);
      showToast(`Backdrop image set: ${preset.name}`);
    }
  };

  // Root Device Direct Upload Handlers
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditAvatar(reader.result);
        showToast('Avatar photo loaded from root device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBackdropFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditImageUrl(reader.result);
        setEditBgType('image');
        showToast('Backdrop canvas loaded from root device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewBlockAudioUrl(reader.result);
        showToast('Audio track loaded from root device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBlockImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewBlockImageUrl(reader.result);
        showToast('Block image loaded from root device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearSeededBlocks = () => {
    if (!profile) return;
    if (confirm('Purge all seeded blocks and start fresh with your own device elements?')) {
      const updated: ZenSpaceProfile = {
        ...profile,
        blocks: []
      };
      setProfile(updated);
      saveZenSpaceProfile(updated);
      showToast('Seeded blocks purged! Clean canvas ready.');
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Determine if visitor is owner or admin
  const isOwner = useMemo(() => {
    if (!profile) return false;
    if (!isAuthenticated) return false;
    const currentUid = authProfile?.id || authUser?.id;
    const currentUname = authProfile?.username || authUser?.username;
    
    if (authProfile?.role === 'admin' || authProfile?.role === 'core_team' || (authProfile?.role as string) === 'FOUNDER') return true;
    if (profile.ownerId && currentUid && profile.ownerId === currentUid) return true;
    if (profile.ownerUsername && currentUname && profile.ownerUsername.toLowerCase() === currentUname.toLowerCase()) return true;
    if (currentUname && profile.username && currentUname.toLowerCase() === profile.username.toLowerCase()) return true;
    return false;
  }, [profile, isAuthenticated, authProfile, authUser]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://zenvitra.xyz/space/${username}`;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.displayName || username}'s Space on Zenvitra`,
          text: profile?.bio || 'Explore my sovereign Zen.Space',
          url: currentUrl
        });
        return;
      } catch {
        // fallback to modal
      }
    }
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('Space link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Real Audio Toggle Handler
  const handleTogglePlay = (blockId: string, trackUrl?: string) => {
    const fallbackUrl = 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3';
    const targetUrl = trackUrl || fallbackUrl;

    if (playingBlockId === blockId && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(targetUrl);
      } else if (audioRef.current.src !== targetUrl) {
        audioRef.current.pause();
        audioRef.current.src = targetUrl;
      }

      audioRef.current.volume = 0.85;
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayingBlockId(null);
      };

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setPlayingBlockId(blockId);
            if (profile) trackBlockClick(profile.username, blockId);
          })
          .catch((err) => {
            console.warn('Audio play request interrupted:', err);
            setIsPlaying(true);
            setPlayingBlockId(blockId);
          });
      }
    } catch (err) {
      console.warn('Audio playback error:', err);
      setIsPlaying(!isPlaying);
    }
  };

  const handleBlockClick = (block: ZenSpaceBlock) => {
    if (profile) {
      trackBlockClick(profile.username, block.id);
    }

    // Interactive form modes
    if (block.type === 'form') {
      const mode = block.metadata?.formMode || 'embed';
      if (mode === 'embed') {
        setExpandedFormId(expandedFormId === block.id ? null : block.id);
        return;
      }
      if (mode === 'modal') {
        setModalFormBlock(block);
        return;
      }
      if (mode === 'redirect') {
        const dest = block.metadata?.formExternalUrl || block.url;
        if (dest) {
          window.open(dest, '_blank', 'noopener,noreferrer');
        }
        return;
      }
    }

    if (block.url) {
      if (block.url.startsWith('http')) {
        window.open(block.url, '_blank', 'noopener,noreferrer');
      } else {
        router.push(block.url);
      }
    }
  };

  // Handle Form Submission
  const handleFormSubmit = async (block: ZenSpaceBlock, e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const blockId = block.id;
    const currentValues = formValues[blockId] || {};

    setFormSubmitting((prev) => ({ ...prev, [blockId]: true }));

    try {
      // 1. Dispatch to sheets webhook API
      const tab = block.metadata?.formWebhookTab || 'INTEREST';
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab,
          source: `ZEN.SPACE (@${profile.username})`,
          blockId,
          ...currentValues
        })
      });

      // 2. Record submission locally in space storage
      recordFormSubmission(profile.username, blockId, currentValues);

      setFormSubmitted((prev) => ({ ...prev, [blockId]: true }));
      showToast(block.metadata?.formSuccessMsg || 'Form submitted successfully!');
    } catch (err) {
      console.warn('Form dispatch fallback:', err);
      recordFormSubmission(profile.username, blockId, currentValues);
      setFormSubmitted((prev) => ({ ...prev, [blockId]: true }));
      showToast('Form saved successfully!');
    } finally {
      setFormSubmitting((prev) => ({ ...prev, [blockId]: false }));
    }
  };

  const handleFormInputChange = (blockId: string, fieldId: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        [fieldId]: value
      }
    }));
  };

  const handleThemeChange = (t: ZenSpaceTheme) => {
    setActiveTheme(t);
    if (profile) {
      const updated = { ...profile, theme: t };
      setProfile(updated);
      saveZenSpaceProfile(updated);
      showToast(`Theme changed to ${t.replace(/_/g, ' ')}`);
    }
  };

  const handleEffectChange = (e: ZenSpaceEffect) => {
    setActiveEffect(e);
    if (profile) {
      const updated = { ...profile, effect: e };
      setProfile(updated);
      saveZenSpaceProfile(updated);
      showToast(`Atmosphere effect: ${e}`);
    }
  };

  const handleLayoutChange = (l: 'stream' | 'bento') => {
    setLayoutMode(l);
    if (profile) {
      const updated = { ...profile, layout: l };
      setProfile(updated);
      saveZenSpaceProfile(updated);
      showToast(`Layout set to ${l === 'bento' ? 'Bento Grid' : 'Classic Stream'}`);
    }
  };

  // Save profile updates from Studio
  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updated: ZenSpaceProfile = {
      ...profile,
      displayName: editDisplayName.trim() || profile.displayName,
      bio: editBio.trim() || profile.bio,
      avatar: editAvatar.trim() || profile.avatar,
      role: editRole.trim() || profile.role,
      isOrganization: editIsOrg,
      organizationType: editOrgType,
      backgroundType: editBgType,
      videoBackgroundUrl: editVideoUrl.trim() || undefined,
      imageBackgroundUrl: editImageUrl.trim() || undefined,
      imageBlur: editImageBlur,
      backgroundOverlayOpacity: editOverlayOpacity,
      socials: {
        ...profile.socials,
        instagram: editInstagram.trim() || undefined,
        phone: editPhone.trim() || undefined
      }
    };

    setProfile(updated);
    saveZenSpaceProfile(updated);
    showToast('Space profile settings saved!');
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!profile) return;
    const updated: ZenSpaceProfile = {
      ...profile,
      blocks: profile.blocks.filter(b => b.id !== blockId)
    };
    setProfile(updated);
    saveZenSpaceProfile(updated);
    showToast('Block removed from your Space');
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle || !profile) return;

    const newBlock: ZenSpaceBlock = {
      id: `block-${Date.now()}`,
      type: newBlockType,
      title: newBlockTitle,
      subtitle: newBlockSub || undefined,
      url: newBlockUrl ? (newBlockUrl.startsWith('http') || newBlockUrl.startsWith('/') ? newBlockUrl : `https://${newBlockUrl}`) : undefined,
      highlight: newBlockHighlight,
      clicks: 0,
      bentoSpan: newBlockType === 'form' || newBlockType === 'donate' ? '2' : '1',
      metadata: newBlockType === 'form' ? {
        formSubmitText: 'Submit Inquiry',
        formSuccessMsg: 'Thank you! Your submission has been received.',
        formWebhookTab: 'INTEREST',
        formMode: newBlockFormMode,
        formExternalUrl: newBlockFormMode === 'redirect' ? newBlockUrl : undefined,
        formFields: [
          { id: 'name', label: 'Name', placeholder: 'Your Name', type: 'text', required: true },
          { id: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email', required: true },
          { id: 'message', label: 'Message', placeholder: 'How can we collaborate?', type: 'textarea' }
        ]
      } : newBlockType === 'music' ? {
        artist: newBlockSub || profile.displayName,
        category: 'Audio Track',
        audioUrl: newBlockAudioUrl || 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
      } : newBlockType === 'image' ? {
        imageUrl: newBlockImageUrl || newBlockUrl || undefined,
        imageCaption: newBlockSub || undefined
      } : undefined
    };

    const updated: ZenSpaceProfile = {
      ...profile,
      blocks: [newBlock, ...profile.blocks]
    };

    setProfile(updated);
    saveZenSpaceProfile(updated);
    setNewBlockTitle('');
    setNewBlockUrl('');
    setNewBlockSub('');
    setNewBlockHighlight(false);
    setNewBlockAudioUrl('');
    setNewBlockImageUrl('');
    showToast('New block added to your Space from device!');
  };

  // Claim & Create Space Handler (Requires logged in account)
  const handleCreateSpaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to claim your sovereign Zen.Space.');
      return;
    }

    const clean = claimUsername.toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
    if (!clean) {
      showToast('Please specify a valid handle.');
      return;
    }

    const currentUid = authProfile?.id || authUser?.id || `user-${Date.now()}`;
    const currentUname = authProfile?.username || authUser?.username || clean;

    const newProfile: ZenSpaceProfile = {
      username: clean,
      displayName: claimDisplayName.trim() || (claimIsOrg ? 'Sovereign Organisation' : clean.charAt(0).toUpperCase() + clean.slice(1)),
      bio: claimBio.trim() || (claimIsOrg ? 'Official sovereign space & modular portal on Zenvitra.' : 'Civic builder, diplomat, and explorer on Zenvitra Sovereign Cloud.'),
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80`,
      role: claimRole.trim() || (claimIsOrg ? 'Official Forum' : 'Zen Explorer'),
      verified: true,
      badges: claimIsOrg ? ['ORGANIZATION', 'VERIFIED_PORTAL'] : ['SOVEREIGN_NODE', 'VERIFIED_CITIZEN'],
      isOrganization: claimIsOrg,
      organizationType: claimIsOrg ? claimOrgType : undefined,
      ownerId: currentUid,
      ownerUsername: currentUname,
      theme: claimTheme,
      effect: 'none',
      layout: 'stream',
      socials: {
        twitter: 'https://x.com/zenvitra',
        github: 'https://github.com/zenvitra',
        instagram: 'https://instagram.com/zenvitra'
      },
      blocks: [
        {
          id: 'block-welcome',
          type: 'text',
          title: `Welcome to ${claimDisplayName.trim() || '@' + clean}`,
          subtitle: 'Sovereign link hub with embedded interactive forms, multimedia, and audio preview.',
          bentoSpan: '2'
        },
        {
          id: 'block-form-connect',
          type: 'form',
          title: 'Connect & Inquire',
          subtitle: 'Drop an encrypted dispatch directly to our desk',
          bentoSpan: '2',
          metadata: {
            formSubmitText: 'Send Dispatch',
            formSuccessMsg: 'Note delivered successfully to the sovereign ledger!',
            formWebhookTab: 'CONTACT',
            formMode: 'embed',
            formFields: [
              { id: 'name', label: 'Your Name', placeholder: 'Name or Delegate Handle', type: 'text', required: true },
              { id: 'email', label: 'Your Email', placeholder: 'you@domain.com', type: 'email', required: true },
              { id: 'message', label: 'Message / Inquiry', placeholder: 'Write your message...', type: 'textarea', required: true }
            ]
          }
        },
        {
          id: 'block-call-me',
          type: 'link',
          title: 'Direct Call on ZEN.CALL',
          subtitle: '1-click encrypted sovereign chamber',
          url: `/call/${clean}-chamber`,
          highlight: true,
          bentoSpan: '1'
        }
      ],
      stats: {
        views: 1,
        connections: 1,
        shares: 0,
        submissions: 0
      }
    };

    saveZenSpaceProfile(newProfile);
    setShowCreateSpaceModal(false);
    showToast(`Space @${clean} claimed successfully! Navigating...`);
    router.push(`/space/${clean}`);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Initializing Sovereign Space...</span>
        </div>
      </div>
    );
  }

  const themeStyle = THEME_CONFIG[activeTheme] || THEME_CONFIG.minimal_sand;
  const isLight = themeStyle.isLight || false;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeStyle.bg} ${themeStyle.textPrimary} relative font-sans selection:bg-neutral-800 selection:text-white transition-colors duration-500 pb-16`}>
      
      {/* Dynamic Keyframe Styles for Audio Soundbar Waves */}
      <style jsx global>{`
        @keyframes zenWave1 { 0% { height: 3px; } 100% { height: 16px; } }
        @keyframes zenWave2 { 0% { height: 5px; } 100% { height: 18px; } }
        @keyframes zenWave3 { 0% { height: 3px; } 100% { height: 11px; } }
        @keyframes zenWave4 { 0% { height: 4px; } 100% { height: 17px; } }
        @keyframes zenWave5 { 0% { height: 3px; } 100% { height: 13px; } }
      `}</style>

      {/* Video Background if configured */}
      {profile.backgroundType === 'video' && profile.videoBackgroundUrl && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={profile.videoBackgroundUrl} type="video/mp4" />
          </video>
          <div 
            className="absolute inset-0 transition-opacity duration-700" 
            style={{
              backgroundColor: isLight ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.70)'
            }}
          />
        </div>
      )}

      {/* Image Backdrop if configured */}
      {profile.backgroundType === 'image' && profile.imageBackgroundUrl && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={profile.imageBackgroundUrl} 
            alt="Space Backdrop"
            className={`w-full h-full object-cover transition-all duration-700 ${
              profile.imageBlur === 'lg' ? 'blur-xl scale-110' :
              profile.imageBlur === 'md' ? 'blur-md scale-105' :
              profile.imageBlur === 'sm' ? 'blur-xs scale-102' : 'blur-none'
            }`}
          />
          <div 
            className="absolute inset-0 transition-opacity duration-700" 
            style={{
              backgroundColor: isLight 
                ? `rgba(255,255,255,${profile.backgroundOverlayOpacity ?? 0.72})` 
                : `rgba(0,0,0,${profile.backgroundOverlayOpacity ?? 0.72})`
            }}
          />
        </div>
      )}

      {/* Atmosphere Effects */}
      {activeEffect === 'grid' && (
        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      )}
      {activeEffect === 'stardust' && (
        <div className="fixed inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      )}
      {activeEffect === 'aurora' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[130px] animate-pulse" />
          <div className="absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] animate-pulse" />
        </div>
      )}
      {activeEffect === 'geometry' && (
        <div className="fixed inset-0 pointer-events-none opacity-15 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)]" />
      )}

      {/* Top Sovereign Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full transition-colors ${
        isLight ? 'border-b border-black/10 text-neutral-900' : 'border-b border-white/10 text-white'
      }`}>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="font-black text-xs font-mono">Z</span>
          </div>
          <span className={`text-xs font-mono tracking-wider transition-colors ${isLight ? 'text-neutral-700 group-hover:text-black' : 'text-zinc-400 group-hover:text-white'}`}>
            ZEN<span className="font-bold">.SPACE</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Owner Edit Space Quick Trigger */}
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 text-white shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Edit Your Space"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Space</span>
            </button>
          )}

          {/* Claim / Create Space Button */}
          <button
            type="button"
            onClick={() => setShowCreateSpaceModal(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isLight 
                ? 'bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-900 border border-neutral-900/20' 
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Claim Space</span>
          </button>

          {/* Layout Mode (Stream vs Bento) */}
          <button
            onClick={() => handleLayoutChange(layoutMode === 'stream' ? 'bento' : 'stream')}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isLight 
                ? 'bg-white/60 border-black/10 text-neutral-700 hover:text-black hover:bg-white' 
                : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title={layoutMode === 'stream' ? 'Switch to Bento Grid' : 'Switch to Stream'}
          >
            {layoutMode === 'stream' ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Preview Frame Toggle */}
          <button
            onClick={() => setMobilePreview(!mobilePreview)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all border ${
              mobilePreview 
                ? isLight ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                : isLight ? 'bg-white/60 border-black/10 text-neutral-700 hover:text-black' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Toggle Device Preview Frame"
          >
            {mobilePreview ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{mobilePreview ? 'Full View' : 'Phone View'}</span>
          </button>

          {/* Theme & Customizer Trigger */}
          <button
            onClick={() => setIsEditorOpen(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
              isLight 
                ? 'bg-white/60 border-black/10 text-neutral-800 hover:bg-white' 
                : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title="Space Studio"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio</span>
          </button>

          {/* Share Trigger */}
          <button
            onClick={handleShare}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isLight 
                ? 'bg-white/60 border-black/10 text-neutral-800 hover:bg-white' 
                : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title="Share Space"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Device Frame */}
      <main className="relative z-10 px-4 py-8 flex justify-center">
        <div 
          className={`w-full transition-all duration-300 ${
            mobilePreview 
              ? 'max-w-sm rounded-[48px] border-[8px] border-zinc-800 bg-neutral-900/95 shadow-2xl p-6 relative overflow-hidden my-4 ring-1 ring-white/10' 
              : layoutMode === 'bento' ? 'max-w-3xl mx-auto' : 'max-w-xl mx-auto'
          }`}
        >
          {/* Mobile phone notch mockup */}
          {mobilePreview && (
            <div className="flex justify-center mb-6">
              <div className="w-28 h-4 bg-zinc-800 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 mr-2" />
                <div className="w-2 h-2 rounded-full bg-blue-950/80" />
              </div>
            </div>
          )}

          {/* Profile Card Header */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* Avatar with Halo */}
            <div className="relative mb-4 group">
              <div className={`absolute -inset-1 rounded-full opacity-60 blur-xs transition-opacity ${
                isLight ? 'bg-neutral-900/20' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
              }`} />
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 shadow-xl ${
                  isLight ? 'border-neutral-900/80 bg-white' : 'border-white/20'
                }`}
              />
              {profile.verified && (
                <div 
                  className={`absolute bottom-1 right-1 p-1.5 rounded-full shadow-lg border-2 ${
                    isLight ? 'bg-neutral-900 text-white border-white' : 'bg-cyan-500 text-black border-black'
                  }`} 
                  title="Verified Sovereign Identity"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Names & Organisation Badge */}
            <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.displayName}</h1>
              {profile.isOrganization && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase flex items-center gap-1 border ${
                  isLight ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                }`}>
                  <Building2 className="w-3 h-3" />
                  <span>{profile.organizationType || 'ORGANIZATION'}</span>
                </span>
              )}
            </div>

            <p className={`text-sm font-mono mb-2 ${themeStyle.textMuted}`}>
              @{profile.username}
              {profile.pronouns && <span className="opacity-60 ml-2">({profile.pronouns})</span>}
            </p>

            <p className="text-xs sm:text-sm font-medium max-w-md leading-relaxed mb-4">
              {profile.bio}
            </p>

            {/* Badges Shelf */}
            {profile.badges && profile.badges.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
                {profile.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border ${themeStyle.badgeBg}`}
                  >
                    {badge.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Live Stats Pill */}
            <div className={`flex items-center justify-center gap-4 text-xs font-mono px-4 py-1.5 rounded-full mb-6 border ${
              isLight ? 'bg-white/80 border-black/10 text-neutral-700' : 'bg-white/5 border-white/10 text-zinc-400'
            }`}>
              <span>{profile.stats.views.toLocaleString()} views</span>
              <span>&bull;</span>
              <span>{profile.stats.connections.toLocaleString()} connects</span>
              {profile.stats.submissions !== undefined && profile.stats.submissions > 0 && (
                <>
                  <span>&bull;</span>
                  <span className={isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'}>
                    {profile.stats.submissions} responses
                  </span>
                </>
              )}
            </div>

            {/* Quick Action Matrix (Direct Call & Chat) */}
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-md mb-6">
              <Link
                href={`/call/${profile.username}-chamber`}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-xs tracking-wide shadow-md transition-all group ${
                  isLight 
                    ? 'bg-neutral-900 text-white hover:bg-black' 
                    : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black shadow-cyan-500/20'
                }`}
              >
                <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Call on ZEN.CALL</span>
              </Link>

              <Link
                href={`/chat?user=${profile.username}`}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-xs tracking-wide transition-all group border ${
                  isLight 
                    ? 'bg-white text-neutral-900 border-neutral-900/40 hover:bg-neutral-50' 
                    : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Message</span>
              </Link>
            </div>

            {/* Social Icons Row (with Instagram, Phone, WhatsApp) */}
            {profile.socials && (
              <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                {profile.socials.instagram && (
                  <a 
                    href={profile.socials.instagram.startsWith('http') ? profile.socials.instagram : `https://instagram.com/${profile.socials.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-neutral-800 hover:bg-black hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 text-zinc-400'
                    }`}
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.phone && (
                  <a 
                    href={`tel:${profile.socials.phone}`} 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-neutral-800 hover:bg-black hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 text-zinc-400'
                    }`}
                    title={`Call ${profile.socials.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.twitter && (
                  <a 
                    href={profile.socials.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-neutral-800 hover:bg-black hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 text-zinc-400'
                    }`}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.github && (
                  <a 
                    href={profile.socials.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-neutral-800 hover:bg-black hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 text-zinc-400'
                    }`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.linkedin && (
                  <a 
                    href={profile.socials.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-neutral-800 hover:bg-black hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 text-zinc-400'
                    }`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.youtube && (
                  <a 
                    href={profile.socials.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-neutral-800 hover:bg-black hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 text-zinc-400'
                    }`}
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.whatsapp && (
                  <a 
                    href={profile.socials.whatsapp} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:text-emerald-300 text-zinc-400'
                    }`}
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.email && (
                  <a 
                    href={`mailto:${profile.socials.email}`} 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-neutral-800 hover:bg-black hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 text-zinc-400'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.website && (
                  <a 
                    href={profile.socials.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-full border transition-all ${
                      isLight 
                        ? 'bg-white border-black/20 text-neutral-800 hover:bg-black hover:text-white shadow-xs' 
                        : 'bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 text-zinc-400'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Blocks Stream or Bento Grid */}
          <div className={layoutMode === 'bento' ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full' : 'space-y-3.5 w-full'}>
            {profile.blocks.map((block) => {
              const bentoSpanClass = layoutMode === 'bento' && block.bentoSpan === '2' ? 'md:col-span-2' : '';

              // INTERACTIVE FORM / RSVP / INQUIRY BLOCK (Accordion Expandable + Modal + Redirect)
              if (block.type === 'form') {
                const isDone = formSubmitted[block.id];
                const isSubmitting = formSubmitting[block.id];
                const mode = block.metadata?.formMode || 'embed';
                const isExpanded = expandedFormId === block.id;
                const fields = block.metadata?.formFields || [
                  { id: 'name', label: 'Name', type: 'text', placeholder: 'Your Name', required: true },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
                  { id: 'message', label: 'Message', type: 'textarea', placeholder: 'Your message...' }
                ];

                return (
                  <div
                    key={block.id}
                    className={`rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-5 transition-all duration-300 ${bentoSpanClass} ${block.highlight ? themeStyle.accentGlow : ''}`}
                  >
                    {/* Header Row: Click to expand if embed, or open modal/redirect */}
                    <div 
                      onClick={() => handleBlockClick(block)}
                      className="cursor-pointer flex items-center justify-between gap-3 group select-none"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                            isLight ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          }`}>
                            {mode === 'redirect' ? 'External Application' : mode === 'modal' ? 'Application Form' : 'Interactive Form'}
                          </span>
                          {mode === 'embed' && (
                            <span className="text-[10px] font-mono opacity-60">
                              {isExpanded ? '(Click to collapse)' : '(Click to open)'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold mb-0.5">{block.title}</h3>
                        {block.subtitle && <p className={`text-xs ${themeStyle.textMuted}`}>{block.subtitle}</p>}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isOwner && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlock(block.id);
                            }}
                            className="p-1.5 rounded-lg opacity-40 hover:opacity-100 hover:text-rose-500 transition-opacity"
                            title="Remove block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {mode === 'embed' ? (
                          <div className={`p-1.5 rounded-full border ${isLight ? 'border-black/20 bg-black/5' : 'border-white/10 bg-white/5'}`}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        ) : (
                          <div className={`p-1.5 rounded-full border ${isLight ? 'border-black/20 bg-black/5' : 'border-white/10 bg-white/5'}`}>
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Accordion Expand Body */}
                    {mode === 'embed' && isExpanded && (
                      <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 animate-fade-in space-y-4">
                        {/* Optional General Instructions (matching Jharokha forum style) */}
                        {block.metadata?.formInstructions && (
                          <div className={`p-3.5 rounded-2xl text-xs space-y-1.5 leading-relaxed border ${
                            isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-white/5 border-white/10 text-zinc-300'
                          }`}>
                            <span className="font-mono font-bold text-[10px] uppercase tracking-wider block opacity-70">
                              Instructions & Guidelines
                            </span>
                            <p>{block.metadata.formInstructions}</p>
                          </div>
                        )}

                        {isDone ? (
                          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                            <h4 className="text-xs font-bold">
                              {block.metadata?.formSuccessMsg || 'Submission received!'}
                            </h4>
                            <p className="text-[11px] opacity-70">
                              Your response has been registered on the sovereign dispatch ledger.
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleFormSubmit(block, e)} className="space-y-3">
                            {fields.map((f) => (
                              <div key={f.id}>
                                <label className="text-[11px] font-mono uppercase opacity-75 block mb-1">
                                  {f.label} {f.required && <span className="text-rose-500">*</span>}
                                </label>
                                {f.type === 'textarea' ? (
                                  <textarea
                                    value={formValues[block.id]?.[f.id] || ''}
                                    onChange={(e) => handleFormInputChange(block.id, f.id, e.target.value)}
                                    placeholder={f.placeholder}
                                    rows={3}
                                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition ${themeStyle.inputBg}`}
                                    required={f.required}
                                  />
                                ) : f.type === 'select' ? (
                                  <select
                                    value={formValues[block.id]?.[f.id] || ''}
                                    onChange={(e) => handleFormInputChange(block.id, f.id, e.target.value)}
                                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition ${themeStyle.inputBg}`}
                                    required={f.required}
                                  >
                                    <option value="">Select option...</option>
                                    {(f.options || []).map((opt) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={f.type}
                                    value={formValues[block.id]?.[f.id] || ''}
                                    onChange={(e) => handleFormInputChange(block.id, f.id, e.target.value)}
                                    placeholder={f.placeholder}
                                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition ${themeStyle.inputBg}`}
                                    required={f.required}
                                  />
                                )}
                              </div>
                            ))}

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer ${
                                isLight ? 'bg-neutral-900 hover:bg-black text-white' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black'
                              }`}
                            >
                              {isSubmitting ? (
                                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{block.metadata?.formSubmitText || 'Submit Application'}</span>
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // MUSIC BLOCK (With Real Audio Playback & Live Soundbar Waves)
              if (block.type === 'music') {
                const trackIsPlaying = isPlaying && playingBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    className={`rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] ${bentoSpanClass} ${block.highlight ? themeStyle.accentGlow : ''}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-black/10 dark:border-white/10">
                          {block.metadata?.albumArt ? (
                            <img src={block.metadata.albumArt} alt={block.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-neutral-900 text-white flex items-center justify-center">
                              <Music className="w-6 h-6" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleTogglePlay(block.id, block.metadata?.audioUrl)}
                            className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors text-white cursor-pointer"
                            title={trackIsPlaying ? "Pause preview" : "Play live audio"}
                          >
                            {trackIsPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                          </button>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                              isLight ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            }`}>
                              {block.metadata?.category || 'Music Rotation'}
                            </span>
                            {/* Live Jumping Soundbar Waves */}
                            <LiveSoundbarWaves isPlaying={trackIsPlaying} isLight={isLight} />
                          </div>
                          <h3 className="text-sm font-bold truncate">{block.title}</h3>
                          <p className={`text-xs truncate ${themeStyle.textMuted}`}>{block.subtitle || block.metadata?.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-2 rounded-xl opacity-40 hover:opacity-100 hover:text-rose-500 transition-opacity"
                            title="Remove block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={block.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2.5 rounded-xl border transition-colors ${
                            isLight ? 'bg-neutral-100 border-black/10 hover:bg-neutral-200' : 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white'
                          }`}
                          title="Open on YouTube Music"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] opacity-60 font-mono">
                      <span>Music preview powered via ytmusic-api / Mixkit</span>
                      <span>© Original Artists</span>
                    </div>
                  </div>
                );
              }

              // IMAGE BLOCK (Root Device Photo Upload / Custom Graphic)
              if (block.type === 'image') {
                const imgSource = block.metadata?.imageUrl || block.url;
                return (
                  <div
                    key={block.id}
                    className={`rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] ${bentoSpanClass} ${block.highlight ? themeStyle.accentGlow : ''}`}
                  >
                    {imgSource && (
                      <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-3 border border-black/10 dark:border-white/10 bg-black/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={imgSource} 
                          alt={block.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold">{block.title}</h3>
                        {block.subtitle && (
                          <p className={`text-xs mt-0.5 ${themeStyle.textMuted}`}>{block.subtitle}</p>
                        )}
                      </div>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-2 rounded-xl opacity-40 hover:opacity-100 hover:text-rose-500 transition-opacity"
                          title="Remove block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              }

              // VIDEO BLOCK
              if (block.type === 'video') {
                return (
                  <div
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] ${bentoSpanClass} group`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-rose-500 font-bold">Video Showcase</span>
                          <h3 className="text-sm font-bold mt-0.5">{block.title}</h3>
                          {block.subtitle && <p className={`text-xs ${themeStyle.textMuted}`}>{block.subtitle}</p>}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </div>
                  </div>
                );
              }

              // DOCS BLOCK
              if (block.type === 'docs') {
                return (
                  <div
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] ${bentoSpanClass} group`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-blue-500 uppercase tracking-wide">
                            {block.metadata?.category || 'Official Document'}
                          </span>
                          <h3 className="text-sm font-bold transition-colors">
                            {block.title}
                          </h3>
                          <p className={`text-xs mt-0.5 ${themeStyle.textMuted}`}>{block.subtitle}</p>
                          {block.metadata?.docSummary && (
                            <p className={`text-xs mt-2 rounded-xl p-2.5 border font-sans leading-relaxed ${
                              isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-white/5 border-white/5 text-zinc-300'
                            }`}>
                              {block.metadata.docSummary}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                );
              }

              // PRESS BLOCK
              if (block.type === 'press') {
                return (
                  <div
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] ${bentoSpanClass} group`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-amber-500 uppercase">Press Dispatch</span>
                            {block.metadata?.date && (
                              <span className="text-[10px] font-mono opacity-60">&bull; {block.metadata.date}</span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold">
                            {block.title}
                          </h3>
                          <p className={`text-xs ${themeStyle.textMuted}`}>{block.subtitle}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                    </div>
                  </div>
                );
              }

              // QUOTE BLOCK
              if (block.type === 'quote') {
                return (
                  <div
                    key={block.id}
                    className={`rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-5 text-center relative overflow-hidden ${bentoSpanClass}`}
                  >
                    <p className="text-sm italic font-serif leading-relaxed mb-2">
                      &ldquo;{block.title}&rdquo;
                    </p>
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                      — {block.subtitle}
                    </span>
                  </div>
                );
              }

              // STANDARD / FEATURED LINK BLOCK
              return (
                <div
                  key={block.id}
                  onClick={() => handleBlockClick(block)}
                  className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] flex items-center justify-between gap-3 group ${bentoSpanClass} ${
                    block.highlight ? themeStyle.accentGlow : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 ${
                      isLight ? 'bg-neutral-100 border-black/10 text-neutral-900' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                    }`}>
                      {block.icon === 'Video' ? <Video className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold truncate">
                        {block.title}
                      </h3>
                      {block.subtitle && (
                        <p className={`text-xs truncate mt-0.5 ${themeStyle.textMuted}`}>{block.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {block.clicks !== undefined && block.clicks > 0 && (
                      <span className="text-[10px] font-mono opacity-50 hidden sm:inline">
                        {block.clicks} clicks
                      </span>
                    )}
                    {isOwner && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlock(block.id);
                        }}
                        className="p-1.5 rounded-lg opacity-30 hover:opacity-100 hover:text-rose-500 transition-opacity"
                        title="Remove block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isLight ? 'bg-neutral-100 group-hover:bg-neutral-200' : 'bg-white/5 group-hover:bg-white/15'
                    }`}>
                      <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Mark & Create My Space Prompt */}
          <footer className="mt-12 pt-6 border-t border-black/10 dark:border-white/5 flex flex-col items-center gap-3 text-center text-xs font-mono opacity-80">
            <button
              onClick={() => setShowCreateSpaceModal(true)}
              className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer ${
                isLight 
                  ? 'bg-white text-neutral-900 border-black/20 shadow-xs hover:bg-neutral-50' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Create or claim your sovereign Space on Zenvitra &rarr;</span>
            </button>

            <div className="flex items-center gap-1.5 opacity-60 mt-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sovereign Link Mesh &bull; Zero Tracker Fingerprints &bull; Encrypted Form Ledgers</span>
            </div>
          </footer>
        </div>
      </main>

      {/* MODAL: FULL FORM SUBMISSION (When block has formMode: 'modal') */}
      {modalFormBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-neutral-950 border border-neutral-800 p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">Application Dispatch</span>
                <h3 className="text-base font-bold text-white">{modalFormBlock.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalFormBlock(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalFormBlock.metadata?.formInstructions && (
              <p className="text-xs text-zinc-300 bg-neutral-900 p-3 rounded-2xl border border-neutral-800 leading-relaxed">
                {modalFormBlock.metadata.formInstructions}
              </p>
            )}

            {formSubmitted[modalFormBlock.id] ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">
                  {modalFormBlock.metadata?.formSuccessMsg || 'Form submitted successfully!'}
                </h4>
                <p className="text-xs text-zinc-400">Your response has been routed directly to the recipient.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleFormSubmit(modalFormBlock, e)} className="space-y-3">
                {(modalFormBlock.metadata?.formFields || []).map((f) => (
                  <div key={f.id}>
                    <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                      {f.label} {f.required && <span className="text-cyan-400">*</span>}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={formValues[modalFormBlock.id]?.[f.id] || ''}
                        onChange={(e) => handleFormInputChange(modalFormBlock.id, f.id, e.target.value)}
                        placeholder={f.placeholder}
                        rows={3}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        required={f.required}
                      />
                    ) : (
                      <input
                        type={f.type}
                        value={formValues[modalFormBlock.id]?.[f.id] || ''}
                        onChange={(e) => handleFormInputChange(modalFormBlock.id, f.id, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        required={f.required}
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={formSubmitting[modalFormBlock.id]}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting[modalFormBlock.id] ? (
                    <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{modalFormBlock.metadata?.formSubmitText || 'Submit Form'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: SHARE & QR CODE */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-950 border border-neutral-800 p-6 shadow-2xl relative space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Share @{profile.username}</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Generated QR Code Vector Mock */}
            <div className="p-4 bg-white rounded-2xl mx-auto w-44 h-44 flex flex-col items-center justify-center shadow-lg">
              <div className="w-36 h-36 border-4 border-black p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-black" />
                  <div className="w-8 h-8 bg-black" />
                </div>
                <div className="text-center font-mono font-black text-[10px] text-black">
                  ZEN.SPACE
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-black" />
                  <div className="w-4 h-4 bg-black self-end" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400">Scan to visit on mobile device or story</p>

            {/* Link Copy */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="flex-1 px-2 text-xs font-mono text-cyan-300 truncate text-left">
                {currentUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* WhatsApp Share Button */}
            <button
              onClick={() => {
                const text = encodeURIComponent(`Explore my sovereign Zen.Space:\n${currentUrl}`);
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CLAIM & CREATE YOUR OWN SPACE (Requires logged-in account, supports custom handles & org names) */}
      {showCreateSpaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-neutral-950 border border-neutral-800 p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Claim Your Sovereign Space</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateSpaceModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">Logged-In Account Required</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  To claim a custom sovereign handle, bind ownership, and receive encrypted form submissions, please sign in or create a Zenvitra account.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateSpaceModal(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Link
                    href={`/auth?callbackUrl=${encodeURIComponent(`/space/${username}`)}`}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold hover:opacity-95 transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>Sign In / Join</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateSpaceSubmit} className="space-y-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2 text-xs text-cyan-300">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Logged in as <strong>@{authProfile?.username || authUser?.username}</strong>. Space ownership will bind to your account.</span>
                </div>

                {/* Organisation / Company Toggle */}
                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Representing an Organisation / Company?</span>
                    <span className="text-[11px] text-zinc-400">Display company or forum badges on your Space</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={claimIsOrg}
                    onChange={(e) => setClaimIsOrg(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 cursor-pointer"
                  />
                </div>

                {claimIsOrg && (
                  <div>
                    <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Entity Category</label>
                    <select
                      value={claimOrgType}
                      onChange={(e) => setClaimOrgType(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="Forum / MUN">Forum / Model UN</option>
                      <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                      <option value="Enterprise / Company">Enterprise / Company</option>
                      <option value="DAO / Council">DAO / Sovereign Council</option>
                      <option value="Academic Institution">Academic Institution</option>
                      <option value="Media & Press">Media & Press</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Custom Handle / URL *</label>
                  <div className="flex items-center rounded-xl bg-neutral-900 border border-neutral-800 focus-within:border-cyan-400 px-3 py-2">
                    <span className="text-xs text-zinc-500 font-mono mr-1">zenvitra.xyz/space/</span>
                    <input
                      type="text"
                      value={claimUsername}
                      onChange={(e) => setClaimUsername(e.target.value)}
                      placeholder="thejharokhaforum"
                      className="flex-1 bg-transparent text-xs text-white outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                    {claimIsOrg ? 'Organisation / Company Display Name *' : 'Display Name *'}
                  </label>
                  <input
                    type="text"
                    value={claimDisplayName}
                    onChange={(e) => setClaimDisplayName(e.target.value)}
                    placeholder={claimIsOrg ? "The Jharokha Forum" : "Your Name or Title"}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Role / Tagline</label>
                  <input
                    type="text"
                    value={claimRole}
                    onChange={(e) => setClaimRole(e.target.value)}
                    placeholder={claimIsOrg ? "Official Sovereign MUN & Youth Forum" : "Lead Diplomat & Sovereign Builder"}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Bio / Mission Statement</label>
                  <textarea
                    value={claimBio}
                    onChange={(e) => setClaimBio(e.target.value)}
                    placeholder="Tell visitors about your mission, initiatives, and upcoming events..."
                    rows={2}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Initial Theme</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['minimal_sand', 'minimal_cream', 'minimal_dark', 'ceramic_white', 'editorial_paper', 'matcha_latte', 'synthwave', 'velvet_wine', 'neo_tokyo', 'alpine_dusk', 'cyberpunk', 'obsidian', 'geneva'] as ZenSpaceTheme[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setClaimTheme(t)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-mono capitalize border transition-all cursor-pointer ${
                          claimTheme === t 
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' 
                            : 'border-neutral-800 bg-neutral-900 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {t.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateSpaceModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold hover:opacity-95 transition-all shadow-md cursor-pointer"
                  >
                    Initialize Space
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DRAWER: SPACE STUDIO / OWNER CUSTOMIZER */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-neutral-950 border border-neutral-800 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">Space Creator Studio</h2>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Settings Form (Available for Owner / Admin) */}
            <form onSubmit={handleSaveProfileSettings} className="space-y-3 pb-4 border-b border-neutral-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-bold">
                <Edit3 className="w-3.5 h-3.5" />
                Space Identity & Background
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Display Name</label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Role / Headline</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Avatar Photo</label>
                  <label className="cursor-pointer text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold">
                    <Upload className="w-3 h-3" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://... or choose photo from device"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>

              {/* Background Visual Style: Theme vs Video vs Image */}
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Backdrop Canvas</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditBgType('theme')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                        editBgType === 'theme' ? 'bg-amber-400 text-black font-bold' : 'bg-neutral-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Theme
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditBgType('video')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                        editBgType === 'video' ? 'bg-amber-400 text-black font-bold' : 'bg-neutral-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditBgType('image')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                        editBgType === 'image' ? 'bg-amber-400 text-black font-bold' : 'bg-neutral-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Image
                    </button>
                  </div>
                </div>

                {editBgType === 'video' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Looping Video URL (.mp4)</label>
                    <input
                      type="text"
                      value={editVideoUrl}
                      onChange={(e) => setEditVideoUrl(e.target.value)}
                      placeholder="https://assets.mixkit.co/.../video.mp4"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                    />
                  </div>
                )}

                {editBgType === 'image' && (
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-mono text-zinc-400 uppercase">Image Backdrop</label>
                        <label className="cursor-pointer text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold">
                          <Upload className="w-3 h-3" />
                          <span>Upload from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBackdropFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        placeholder="https://... or choose photo from device"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">Blur Depth</span>
                      <div className="flex gap-1">
                        {(['none', 'sm', 'md', 'lg'] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setEditImageBlur(b)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer ${
                              editImageBlur === b ? 'bg-cyan-400 text-black font-bold' : 'bg-neutral-800 text-zinc-400'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">Readability Tint</span>
                      <div className="flex gap-1">
                        {[0.55, 0.72, 0.85].map((op) => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setEditOverlayOpacity(op)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                              editOverlayOpacity === op ? 'bg-amber-400 text-black font-bold' : 'bg-neutral-800 text-zinc-400'
                            }`}
                          >
                            {Math.round(op * 100)}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1-Click Curated Backdrop Presets */}
                <div className="pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      1-Click Curated Presets
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">Video & Images</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {BACKGROUND_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectBackgroundPreset(p)}
                        className="p-1.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400/80 text-left transition-all cursor-pointer flex items-center gap-2 group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400/20 text-zinc-400 group-hover:text-amber-400">
                          {p.type === 'video' ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-semibold text-white block truncate">{p.name}</span>
                          <span className="text-[9px] text-zinc-500 font-mono block capitalize">{p.type} &bull; {p.category || p.vibe}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Handles */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Instagram Handle</label>
                  <input
                    type="text"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    placeholder="@thejharokhaforum"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Contact Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Save Identity Updates
              </button>
            </form>

            {/* AI Theme Stylist Recommendations */}
            {stylistRecommendations.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">AI Theme & Backdrop Stylist</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Adaptive Algo
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Tailored palettes based on your active elements (music blocks, forms, videos, and organization profile):
                </p>

                <div className="space-y-2">
                  {stylistRecommendations.map((rec) => (
                    <div 
                      key={rec.theme}
                      className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-400/50 transition-all flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono capitalize">
                            {rec.theme.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {rec.matchScore}% Match
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyRecommendation(rec)}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold font-mono hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>Apply</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        {rec.reason}
                      </p>
                      {rec.suggestedPreset && (
                        <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-mono pt-0.5">
                          <span>Includes backdrop preset: <strong>{rec.suggestedPreset.name}</strong> ({rec.suggestedPreset.type})</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout Mode */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block">
                Layout Grid Architecture
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLayoutChange('stream')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    layoutMode === 'stream' 
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' 
                      : 'border-neutral-800 bg-neutral-900 text-zinc-400'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Classic Stream</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLayoutChange('bento')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    layoutMode === 'bento' 
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' 
                      : 'border-neutral-800 bg-neutral-900 text-zinc-400'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Bento Modular Grid</span>
                </button>
              </div>
            </div>

            {/* Theme Selector (All 16 Visual Themes) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  All Visual Themes (16)
                </label>
                <span className="text-[10px] text-amber-400 font-mono capitalize">
                  Active: {activeTheme.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {(['minimal_sand', 'minimal_cream', 'minimal_dark', 'ceramic_white', 'editorial_paper', 'matcha_latte', 'synthwave', 'velvet_wine', 'neo_tokyo', 'alpine_dusk', 'cyberpunk', 'obsidian', 'geneva', 'aurora', 'solar', 'nordic'] as ZenSpaceTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`py-2 px-1.5 rounded-xl text-[11px] font-mono capitalize border transition-all cursor-pointer text-center truncate ${
                      activeTheme === t 
                        ? 'border-amber-400 bg-amber-500/25 text-amber-300 font-bold shadow-xs' 
                        : 'border-neutral-800 bg-neutral-900/90 text-zinc-400 hover:text-white hover:border-neutral-700'
                    }`}
                    title={t.replace(/_/g, ' ')}
                  >
                    {t.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Effect Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block">
                Atmosphere Effect
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'grid', 'stardust', 'aurora', 'geometry'] as ZenSpaceEffect[]).map((e) => (
                  <button
                    key={e}
                    onClick={() => handleEffectChange(e)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono capitalize border transition-all cursor-pointer ${
                      activeEffect === e 
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' 
                        : 'border-neutral-800 bg-neutral-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Add New Block Form */}
            <form onSubmit={handleAddBlock} className="pt-4 border-t border-neutral-800 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                Add New Modular Block
              </h3>

              <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
                {(['link', 'form', 'image', 'music', 'quote'] as ZenSpaceBlockType[]).map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => setNewBlockType(bt)}
                    className={`py-1.5 rounded-lg capitalize border transition-all cursor-pointer ${
                      newBlockType === bt
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'border-neutral-800 bg-neutral-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>

              {newBlockType === 'form' && (
                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[11px] font-mono uppercase text-cyan-300 font-bold block">Form Interaction Mode</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewBlockFormMode('embed')}
                      className={`py-1 rounded text-[10px] font-mono border cursor-pointer ${
                        newBlockFormMode === 'embed' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-neutral-800 text-zinc-400'
                      }`}
                    >
                      In-Card Accordion
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewBlockFormMode('modal')}
                      className={`py-1 rounded text-[10px] font-mono border cursor-pointer ${
                        newBlockFormMode === 'modal' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-neutral-800 text-zinc-400'
                      }`}
                    >
                      Popup Modal
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewBlockFormMode('redirect')}
                      className={`py-1 rounded text-[10px] font-mono border cursor-pointer ${
                        newBlockFormMode === 'redirect' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-neutral-800 text-zinc-400'
                      }`}
                    >
                      External Redirect
                    </button>
                  </div>
                </div>
              )}

              <div>
                <input
                  type="text"
                  value={newBlockTitle}
                  onChange={(e) => setNewBlockTitle(e.target.value)}
                  placeholder={newBlockType === 'form' ? 'Form Title (e.g. Delegate Registration)' : newBlockType === 'image' ? 'Image Title / Label' : 'Block Title'}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  value={newBlockSub}
                  onChange={(e) => setNewBlockSub(e.target.value)}
                  placeholder={newBlockType === 'image' ? 'Image caption or description (optional)' : 'Subtitle or description (optional)'}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {newBlockType === 'image' && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">Card Image Source</span>
                    <label className="cursor-pointer text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold">
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBlockImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={newBlockImageUrl}
                    onChange={(e) => setNewBlockImageUrl(e.target.value)}
                    placeholder="https://... or choose photo from your device"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              )}

              {newBlockType === 'music' && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">Audio Track Source</span>
                    <label className="cursor-pointer text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold">
                      <Upload className="w-3 h-3" />
                      <span>Upload Audio from Device</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={newBlockAudioUrl}
                    onChange={(e) => setNewBlockAudioUrl(e.target.value)}
                    placeholder="Direct audio preview URL (.mp3) or choose from device"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              )}

              {newBlockType !== 'quote' && newBlockType !== 'image' && (
                <div>
                  <input
                    type="text"
                    value={newBlockUrl}
                    onChange={(e) => setNewBlockUrl(e.target.value)}
                    placeholder={newBlockFormMode === 'redirect' ? "External Form URL (Google Forms / Typeform)" : "Destination URL (e.g. https://... or /call/...)"}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-zinc-300 pt-1">
                <input
                  type="checkbox"
                  id="highlightToggle"
                  checked={newBlockHighlight}
                  onChange={(e) => setNewBlockHighlight(e.target.checked)}
                  className="rounded bg-neutral-900 border-neutral-800 text-cyan-500 cursor-pointer"
                />
                <label htmlFor="highlightToggle" className="cursor-pointer">Highlight card with emphasis glow</label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Insert Block to Space</span>
              </button>
            </form>

            {/* Clean Slate: Purge Seeded Blocks */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Clean Slate Canvas</span>
                <span className="text-[10px] text-zinc-400">Purge default seeded blocks to use only your root device elements</span>
              </div>
              <button
                type="button"
                onClick={handleClearSeededBlocks}
                className="px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge Seeded</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 border border-amber-500/40 text-amber-300 px-4 py-2.5 rounded-full text-xs font-mono shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
