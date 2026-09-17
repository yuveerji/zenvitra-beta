'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  QrCode,
  Sliders,
  CheckCircle2,
  Lock,
  Copy
} from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

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
}> = {
  cyberpunk: {
    bg: 'from-[#0d071b] via-[#090b1c] to-[#04060f]',
    cardBg: 'bg-black/60 hover:bg-black/80',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    accent: 'text-cyan-400',
    accentGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    textPrimary: 'text-white',
    textMuted: 'text-slate-400',
    badgeBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
    inputBg: 'bg-black/70 border-cyan-500/30 text-white'
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
    inputBg: 'bg-zinc-900 border-zinc-700 text-white'
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
    inputBg: 'bg-[#0a1b47] border-amber-500/30 text-white'
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
    inputBg: 'bg-emerald-950/80 border-emerald-500/40 text-white'
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
    inputBg: 'bg-orange-950/80 border-orange-500/40 text-white'
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
    inputBg: 'bg-sky-950/80 border-sky-500/40 text-white'
  }
};

export function ZenSpaceView({ username }: ZenSpaceViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<ZenSpaceProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'stream' | 'bento'>('stream');
  
  // Modals & Drawers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  
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

  // New Space Creation Form states
  const [claimUsername, setClaimUsername] = useState('');
  const [claimDisplayName, setClaimDisplayName] = useState('');
  const [claimBio, setClaimBio] = useState('');
  const [claimRole, setClaimRole] = useState('Diplomat & Sovereign Builder');
  const [claimTheme, setClaimTheme] = useState<ZenSpaceTheme>('cyberpunk');

  const [activeEffect, setActiveEffect] = useState<ZenSpaceEffect>('grid');
  const [activeTheme, setActiveTheme] = useState<ZenSpaceTheme>('cyberpunk');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getZenSpaceProfile(username);
    setProfile(loaded);
    setActiveTheme(loaded.theme);
    setActiveEffect(loaded.effect);
    setLayoutMode(loaded.layout || 'stream');
  }, [username]);

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
        // fallback
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

  const handleTogglePlay = (blockId: string) => {
    setIsPlaying(!isPlaying);
    if (profile) {
      trackBlockClick(profile.username, blockId);
    }
  };

  const handleBlockClick = (block: ZenSpaceBlock) => {
    if (profile) {
      trackBlockClick(profile.username, block.id);
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
      showToast(`Theme changed to ${t}`);
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
      showToast(`Layout set to ${l === 'bento' ? 'Bento Grid' : 'Stream'}`);
    }
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
        formFields: [
          { id: 'name', label: 'Name', placeholder: 'Your Name', type: 'text', required: true },
          { id: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email', required: true },
          { id: 'message', label: 'Message', placeholder: 'How can we collaborate?', type: 'textarea' }
        ]
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
    showToast('New block added to your Space!');
  };

  // Claim & Create Space Handler
  const handleCreateSpaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = claimUsername.toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
    if (!clean) return;

    const newProfile: ZenSpaceProfile = {
      username: clean,
      displayName: claimDisplayName.trim() || clean.charAt(0).toUpperCase() + clean.slice(1),
      bio: claimBio.trim() || 'Civic builder, diplomat, and explorer on Zenvitra Sovereign Cloud.',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${clean}`,
      role: claimRole.trim() || 'Zen Explorer',
      verified: true,
      badges: ['SOVEREIGN_NODE', 'VERIFIED_CITIZEN'],
      theme: claimTheme,
      effect: 'grid',
      layout: 'stream',
      socials: {
        twitter: 'https://x.com/zenvitra',
        github: 'https://github.com/zenvitra'
      },
      blocks: [
        {
          id: 'block-welcome',
          type: 'text',
          title: `Welcome to @${clean}'s Sovereign Space`,
          subtitle: 'Decentralized link-in-bio hub with encrypted video & interactive forms.',
          bentoSpan: '2'
        },
        {
          id: 'block-form-connect',
          type: 'form',
          title: 'Connect & Inquire',
          subtitle: 'Drop an encrypted dispatch directly to my inbox',
          bentoSpan: '2',
          metadata: {
            formSubmitText: 'Send Note',
            formSuccessMsg: 'Note delivered successfully!',
            formWebhookTab: 'CONTACT',
            formFields: [
              { id: 'name', label: 'Your Name', placeholder: 'Name or Handle', type: 'text', required: true },
              { id: 'email', label: 'Your Email', placeholder: 'you@domain.com', type: 'email', required: true },
              { id: 'message', label: 'Message', placeholder: 'Write a note...', type: 'textarea', required: true }
            ]
          }
        },
        {
          id: 'block-call-me',
          type: 'link',
          title: 'Direct Call on ZEN.CALL',
          subtitle: '1-click secure HD video room',
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
    showToast(`Space @${clean} created successfully! Navigating...`);
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

  const themeStyle = THEME_CONFIG[activeTheme] || THEME_CONFIG.cyberpunk;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeStyle.bg} ${themeStyle.textPrimary} relative font-sans selection:bg-cyan-500/30 selection:text-white transition-colors duration-500 pb-16`}>
      
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
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="text-black font-black text-xs font-mono">Z</span>
          </div>
          <span className="text-xs font-mono tracking-wider text-zinc-400 group-hover:text-white transition-colors">
            ZEN<span className="text-cyan-400">.SPACE</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Create Space Button */}
          <button
            type="button"
            onClick={() => setShowCreateSpaceModal(true)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Claim Space</span>
          </button>

          {/* Layout Mode (Stream vs Bento) */}
          <button
            onClick={() => handleLayoutChange(layoutMode === 'stream' ? 'bento' : 'stream')}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title={layoutMode === 'stream' ? 'Switch to Bento Grid' : 'Switch to Stream'}
          >
            {layoutMode === 'stream' ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Preview Frame Toggle */}
          <button
            onClick={() => setMobilePreview(!mobilePreview)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all border ${
              mobilePreview 
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Device Preview Frame"
          >
            {mobilePreview ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{mobilePreview ? 'Full View' : 'Phone View'}</span>
          </button>

          {/* Theme & Customizer Trigger */}
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Customize Space"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Studio</span>
          </button>

          {/* Share & QR Trigger */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Share & QR Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          {/* Open in Platform */}
          <Link
            href="/platform"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/30 text-xs font-mono text-cyan-300 transition-all"
          >
            <span>Platform</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Container / Mobile Device Frame */}
      <main className="relative z-10 px-4 py-8 flex justify-center">
        <div 
          className={`w-full transition-all duration-300 ${
            mobilePreview 
              ? 'max-w-sm rounded-[48px] border-[8px] border-zinc-800 bg-black/90 shadow-2xl p-6 relative overflow-hidden my-4 ring-1 ring-white/10' 
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
            {/* Avatar with Animated Cyber Halo */}
            <div className="relative mb-5 group">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-70 blur-md group-hover:opacity-100 transition-opacity" />
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-white/20 shadow-2xl"
              />
              {profile.verified && (
                <div 
                  className="absolute bottom-1 right-1 bg-cyan-500 text-black p-1.5 rounded-full shadow-lg border-2 border-black" 
                  title="Verified Sovereign Identity"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Names & Clearance */}
            <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.displayName}</h1>
              {profile.clearance && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                  {profile.clearance.replace(/_/g, ' ')}
                </span>
              )}
            </div>

            <p className="text-sm font-mono text-zinc-400 mb-2">
              @{profile.username}
              {profile.pronouns && <span className="opacity-60 ml-2">({profile.pronouns})</span>}
            </p>

            <p className="text-xs sm:text-sm font-medium text-zinc-300 max-w-md leading-relaxed mb-4">
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
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-zinc-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
              <span>{profile.stats.views.toLocaleString()} views</span>
              <span>&bull;</span>
              <span>{profile.stats.connections.toLocaleString()} connects</span>
              {profile.stats.submissions !== undefined && profile.stats.submissions > 0 && (
                <>
                  <span>&bull;</span>
                  <span className="text-emerald-400">{profile.stats.submissions} responses</span>
                </>
              )}
            </div>

            {/* Quick Action Matrix (Direct Call & Chat) */}
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-md mb-6">
              <Link
                href={`/call/${profile.username}-chamber`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all group"
              >
                <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Call on ZEN.CALL</span>
              </Link>

              <Link
                href={`/chat?user=${profile.username}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs tracking-wide transition-all group"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Message</span>
              </Link>
            </div>

            {/* Social Icons Row */}
            {profile.socials && (
              <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                {profile.socials.twitter && (
                  <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all text-zinc-400">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.github && (
                  <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all text-zinc-400">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.linkedin && (
                  <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all text-zinc-400">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.instagram && (
                  <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all text-zinc-400">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.youtube && (
                  <a href={profile.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all text-zinc-400">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.whatsapp && (
                  <a href={profile.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:text-emerald-300 transition-all text-zinc-400">
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.email && (
                  <a href={`mailto:${profile.socials.email}`} className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.website && (
                  <a href={profile.socials.website} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-all text-zinc-400">
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

              // INTERACTIVE FORM / RSVP / INQUIRY BLOCK
              if (block.type === 'form') {
                const isDone = formSubmitted[block.id];
                const isSubmitting = formSubmitting[block.id];
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Interactive Form
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-0.5">{block.title}</h3>
                    {block.subtitle && <p className="text-xs text-zinc-400 mb-4">{block.subtitle}</p>}

                    {isDone ? (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <h4 className="text-xs font-bold text-white">
                          {block.metadata?.formSuccessMsg || 'Submission received!'}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          Your response has been registered on the sovereign dispatch ledger.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleFormSubmit(block, e)} className="space-y-3">
                        {fields.map((f) => (
                          <div key={f.id}>
                            <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                              {f.label} {f.required && <span className="text-cyan-400">*</span>}
                            </label>
                            {f.type === 'textarea' ? (
                              <textarea
                                value={formValues[block.id]?.[f.id] || ''}
                                onChange={(e) => handleFormInputChange(block.id, f.id, e.target.value)}
                                placeholder={f.placeholder}
                                rows={3}
                                className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-cyan-400 transition ${themeStyle.inputBg}`}
                                required={f.required}
                              />
                            ) : f.type === 'select' ? (
                              <select
                                value={formValues[block.id]?.[f.id] || ''}
                                onChange={(e) => handleFormInputChange(block.id, f.id, e.target.value)}
                                className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-cyan-400 transition ${themeStyle.inputBg}`}
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
                                className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-cyan-400 transition ${themeStyle.inputBg}`}
                                required={f.required}
                              />
                            )}
                          </div>
                        ))}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>{block.metadata?.formSubmitText || 'Submit'}</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                );
              }

              // DONATE / CIVIC IMPACT BLOCK
              if (block.type === 'donate') {
                return (
                  <div
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.01] ${bentoSpanClass} group`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                          <Heart className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">Civic Support</span>
                            {block.metadata?.donateGoal && (
                              <span className="text-[10px] font-mono text-zinc-400">&bull; {block.metadata.donateGoal}</span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors mt-0.5">
                            {block.title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1">{block.subtitle}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                );
              }

              // BOOKING / CONSULTATION BLOCK
              if (block.type === 'booking') {
                return (
                  <div
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] ${bentoSpanClass} group`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase text-purple-400">Schedule Session</span>
                            {block.metadata?.bookingDuration && (
                              <span className="text-[10px] font-mono text-zinc-400">&bull; {block.metadata.bookingDuration}</span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {block.title}
                          </h3>
                          <p className="text-xs text-zinc-400">{block.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                );
              }

              // MUSIC BLOCK
              if (block.type === 'music') {
                return (
                  <div
                    key={block.id}
                    className={`rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] ${bentoSpanClass} ${block.highlight ? themeStyle.accentGlow : ''}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                          {block.metadata?.albumArt ? (
                            <img src={block.metadata.albumArt} alt={block.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-purple-900/40 flex items-center justify-center">
                              <Music className="w-6 h-6 text-purple-400" />
                            </div>
                          )}
                          <button
                            onClick={() => handleTogglePlay(block.id)}
                            className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors text-white cursor-pointer"
                          >
                            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                          </button>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {block.metadata?.category || 'Music Rotation'}
                            </span>
                            {isPlaying && (
                              <div className="flex items-end gap-0.5 h-3">
                                <div className="w-0.5 h-full bg-cyan-400 animate-pulse" />
                                <div className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-75" />
                                <div className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-150" />
                              </div>
                            )}
                          </div>
                          <h3 className="text-sm font-bold truncate text-white">{block.title}</h3>
                          <p className="text-xs text-zinc-400 truncate">{block.subtitle || block.metadata?.artist}</p>
                        </div>
                      </div>

                      <a
                        href={block.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Open on YouTube Music"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                      <span>Music preview powered via ytmusic-api / GitHub</span>
                      <span>© Original Artists</span>
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
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wide">
                            {block.metadata?.category || 'Official Document'}
                          </span>
                          <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {block.title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-0.5">{block.subtitle}</p>
                          {block.metadata?.docSummary && (
                            <p className="text-xs text-zinc-300 mt-2 bg-white/5 rounded-xl p-2.5 border border-white/5 font-sans leading-relaxed">
                              {block.metadata.docSummary}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors flex-shrink-0 mt-1" />
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
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-amber-400 uppercase">Press Dispatch</span>
                            {block.metadata?.date && (
                              <span className="text-[10px] font-mono text-zinc-400">&bull; {block.metadata.date}</span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {block.title}
                          </h3>
                          <p className="text-xs text-zinc-400">{block.subtitle}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors flex-shrink-0" />
                    </div>
                  </div>
                );
              }

              // QUOTE BLOCK
              if (block.type === 'quote') {
                return (
                  <div
                    key={block.id}
                    className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 text-center relative overflow-hidden ${bentoSpanClass}`}
                  >
                    <p className="text-sm italic font-serif text-zinc-200 leading-relaxed mb-2">
                      {block.title}
                    </p>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80">
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
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      {block.icon === 'Video' ? <Video className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {block.title}
                      </h3>
                      {block.subtitle && (
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{block.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {block.clicks !== undefined && block.clicks > 0 && (
                      <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                        {block.clicks} clicks
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Mark & Create My Space Prompt */}
          <footer className="mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-3 text-center text-zinc-400 text-xs font-mono">
            <button
              onClick={() => setShowCreateSpaceModal(true)}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Create your own sovereign Space on Zenvitra &rarr;</span>
            </button>

            <div className="flex items-center gap-1.5 text-zinc-500 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sovereign Link-in-Bio Mesh &bull; Zero Tracker Fingerprints</span>
            </div>
          </footer>
        </div>
      </main>

      {/* MODAL: SHARE & QR CODE */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
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
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800">
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

      {/* MODAL: CLAIM & CREATE YOUR OWN SPACE */}
      {showCreateSpaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handleCreateSpaceSubmit} className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
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

            <p className="text-xs text-zinc-400 leading-relaxed">
              Build your personal sovereign link-in-bio with interactive inquiry forms, encrypted video rooms, and audio showcase.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Handle / Username *</label>
                <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-cyan-400 px-3 py-2">
                  <span className="text-xs text-zinc-500 font-mono mr-1">zenvitra.xyz/space/</span>
                  <input
                    type="text"
                    value={claimUsername}
                    onChange={(e) => setClaimUsername(e.target.value)}
                    placeholder="yourhandle"
                    className="flex-1 bg-transparent text-xs text-white outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Display Name *</label>
                <input
                  type="text"
                  value={claimDisplayName}
                  onChange={(e) => setClaimDisplayName(e.target.value)}
                  placeholder="Your Full Name or Handle"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Role / Headline</label>
                <input
                  type="text"
                  value={claimRole}
                  onChange={(e) => setClaimRole(e.target.value)}
                  placeholder="e.g. Lead Researcher / Diplomat"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Bio</label>
                <textarea
                  value={claimBio}
                  onChange={(e) => setClaimBio(e.target.value)}
                  placeholder="Tell visitors about your mission and work..."
                  rows={2}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Theme</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['cyberpunk', 'obsidian', 'geneva', 'aurora', 'solar', 'nordic'] as ZenSpaceTheme[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setClaimTheme(t)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono capitalize border transition-all ${
                        claimTheme === t 
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold' 
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateSpaceModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white"
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
        </div>
      )}

      {/* DRAWER: SPACE STUDIO / CUSTOMIZER */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Space Creator Studio</h2>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Layout Mode */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block">
                Layout Grid Architecture
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLayoutChange('stream')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono border flex items-center justify-center gap-2 transition-all ${
                    layoutMode === 'stream' 
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Classic Stream</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLayoutChange('bento')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono border flex items-center justify-center gap-2 transition-all ${
                    layoutMode === 'bento' 
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Bento Modular Grid</span>
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block">
                Cybernetic Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['cyberpunk', 'obsidian', 'geneva', 'aurora', 'solar', 'nordic'] as ZenSpaceTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono capitalize border transition-all ${
                      activeTheme === t 
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold' 
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t}
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
                {(['grid', 'stardust', 'aurora', 'geometry', 'none'] as ZenSpaceEffect[]).map((e) => (
                  <button
                    key={e}
                    onClick={() => handleEffectChange(e)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono capitalize border transition-all ${
                      activeEffect === e 
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold' 
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Add New Block Form */}
            <form onSubmit={handleAddBlock} className="pt-4 border-t border-zinc-800 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                Add New Modular Block
              </h3>

              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {(['link', 'form', 'music', 'quote'] as ZenSpaceBlockType[]).map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => setNewBlockType(bt)}
                    className={`py-1.5 rounded-lg capitalize border transition-all ${
                      newBlockType === bt
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  value={newBlockTitle}
                  onChange={(e) => setNewBlockTitle(e.target.value)}
                  placeholder={newBlockType === 'form' ? 'Form Title (e.g. RSVP, Contact Me)' : 'Block Title'}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  value={newBlockSub}
                  onChange={(e) => setNewBlockSub(e.target.value)}
                  placeholder="Subtitle or description (optional)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {newBlockType !== 'form' && newBlockType !== 'quote' && (
                <div>
                  <input
                    type="text"
                    value={newBlockUrl}
                    onChange={(e) => setNewBlockUrl(e.target.value)}
                    placeholder="URL (e.g. https://... or /call/...)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-zinc-300 pt-1">
                <input
                  type="checkbox"
                  id="highlightToggle"
                  checked={newBlockHighlight}
                  onChange={(e) => setNewBlockHighlight(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-800 text-cyan-500"
                />
                <label htmlFor="highlightToggle" className="cursor-pointer">Highlight with neon glow aura</label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Insert Block to Space</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-cyan-500/40 text-cyan-300 px-4 py-2.5 rounded-full text-xs font-mono shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
