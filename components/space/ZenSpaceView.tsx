'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ZenSpaceProfile, 
  ZenSpaceTheme, 
  ZenSpaceEffect, 
  ZenSpaceBlock 
} from '@/types/space';
import { 
  getZenSpaceProfile, 
  saveZenSpaceProfile, 
  trackBlockClick 
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
  X
} from 'lucide-react';

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
}> = {
  cyberpunk: {
    bg: 'from-[#0d071b] via-[#090b1c] to-[#04060f]',
    cardBg: 'bg-black/60 hover:bg-black/80',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    accent: 'text-cyan-400',
    accentGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    textPrimary: 'text-white',
    textMuted: 'text-slate-400',
    badgeBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
  },
  obsidian: {
    bg: 'from-[#050507] via-[#08080c] to-[#030305]',
    cardBg: 'bg-zinc-950/80 hover:bg-zinc-900/90',
    border: 'border-zinc-800 hover:border-zinc-600',
    accent: 'text-zinc-200',
    accentGlow: 'shadow-[0_0_25px_rgba(255,255,255,0.08)]',
    textPrimary: 'text-zinc-100',
    textMuted: 'text-zinc-500',
    badgeBg: 'bg-zinc-900/90 text-zinc-300 border-zinc-700'
  },
  geneva: {
    bg: 'from-[#030b1e] via-[#05112c] to-[#020712]',
    cardBg: 'bg-[#061233]/70 hover:bg-[#081740]/90',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    accent: 'text-amber-400',
    accentGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    textPrimary: 'text-amber-50',
    textMuted: 'text-blue-300/70',
    badgeBg: 'bg-amber-950/50 text-amber-300 border-amber-500/40'
  },
  aurora: {
    bg: 'from-[#021812] via-[#041a1c] to-[#020f12]',
    cardBg: 'bg-emerald-950/40 hover:bg-emerald-950/70',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    accent: 'text-emerald-400',
    accentGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    textPrimary: 'text-emerald-50',
    textMuted: 'text-emerald-300/70',
    badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
  },
  solar: {
    bg: 'from-[#190b05] via-[#1f0e07] to-[#0d0503]',
    cardBg: 'bg-orange-950/40 hover:bg-orange-950/70',
    border: 'border-orange-500/30 hover:border-orange-400/60',
    accent: 'text-orange-400',
    accentGlow: 'shadow-[0_0_25px_rgba(249,115,22,0.25)]',
    textPrimary: 'text-orange-50',
    textMuted: 'text-orange-300/70',
    badgeBg: 'bg-orange-950/70 text-orange-300 border-orange-500/40'
  },
  nordic: {
    bg: 'from-[#07131e] via-[#091b2c] to-[#050d14]',
    cardBg: 'bg-sky-950/40 hover:bg-sky-950/70',
    border: 'border-sky-500/30 hover:border-sky-400/60',
    accent: 'text-sky-400',
    accentGlow: 'shadow-[0_0_25px_rgba(14,165,233,0.25)]',
    textPrimary: 'text-sky-50',
    textMuted: 'text-sky-300/70',
    badgeBg: 'bg-sky-950/70 text-sky-300 border-sky-500/40'
  }
};

export function ZenSpaceView({ username }: ZenSpaceViewProps) {
  const [profile, setProfile] = useState<ZenSpaceProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockUrl, setNewBlockUrl] = useState('');
  const [newBlockSub, setNewBlockSub] = useState('');
  const [activeEffect, setActiveEffect] = useState<ZenSpaceEffect>('grid');
  const [activeTheme, setActiveTheme] = useState<ZenSpaceTheme>('cyberpunk');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getZenSpaceProfile(username);
    setProfile(loaded);
    setActiveTheme(loaded.theme);
    setActiveEffect(loaded.effect);
  }, [username]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://zenvitra.org/space/${username}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.displayName || username}'s Space on Zenvitra`,
          text: profile?.bio || 'Explore my sovereign Zen.Space',
          url
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
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
        window.location.href = block.url;
      }
    }
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

  const handleAddLinkBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle || !newBlockUrl || !profile) return;

    const newBlock: ZenSpaceBlock = {
      id: `block-${Date.now()}`,
      type: 'link',
      title: newBlockTitle,
      subtitle: newBlockSub || undefined,
      url: newBlockUrl.startsWith('http') ? newBlockUrl : `https://${newBlockUrl}`,
      clicks: 0
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
    showToast('New block added to your Space!');
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
    <div className={`min-h-screen bg-gradient-to-b ${themeStyle.bg} ${themeStyle.textPrimary} relative font-sans selection:bg-cyan-500/30 selection:text-white transition-colors duration-500`}>
      
      {/* Background Cybernetic Effects */}
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
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="text-black font-black text-xs font-mono">Z</span>
          </div>
          <span className="text-xs font-mono tracking-wider text-zinc-400 group-hover:text-white transition-colors">
            ZEN<span className="text-cyan-400">.SPACE</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile frame toggle */}
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
            <span className="hidden sm:inline">{mobilePreview ? 'Desktop' : 'Mobile Frame'}</span>
          </button>

          {/* Theme & Customizer Trigger */}
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
            title="Customize Space"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Customize</span>
          </button>

          {/* Direct Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
            title="Share this Space"
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

      {/* Main Container or Device Frame */}
      <main className="relative z-10 px-4 py-8 flex justify-center">
        <div 
          className={`w-full transition-all duration-300 ${
            mobilePreview 
              ? 'max-w-sm rounded-[48px] border-[8px] border-zinc-800 bg-black/90 shadow-2xl p-6 relative overflow-hidden my-4 ring-1 ring-white/10' 
              : 'max-w-xl mx-auto'
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
            {/* Avatar with Cyber Halo */}
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
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.displayName}</h1>
              {profile.clearance && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                  {profile.clearance.replace(/_/g, ' ')}
                </span>
              )}
            </div>

            <p className="text-sm font-mono text-zinc-400 mb-3">
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
                    <Send className="w-4 h-4" />
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

          {/* Blocks Stream */}
          <div className="space-y-3.5 w-full">
            {profile.blocks.map((block) => {
              // MUSIC BLOCK
              if (block.type === 'music') {
                return (
                  <div
                    key={block.id}
                    className={`rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] ${block.highlight ? themeStyle.accentGlow : ''}`}
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
                            className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors text-white"
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

                    {/* Legal Music Attribution Note */}
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                      <span>Music preview powered via ytmusic-api / GitHub</span>
                      <span>© Original Artists</span>
                    </div>
                  </div>
                );
              }

              // DOCS / DIPLOMATIC RESOLUTION BLOCK
              if (block.type === 'docs') {
                return (
                  <div
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] group`}
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

              // PRESS DISPATCH BLOCK
              if (block.type === 'press') {
                return (
                  <div
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] group`}
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
                              <span className="text-[10px] font-mono text-zinc-400">• {block.metadata.date}</span>
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
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 text-center relative overflow-hidden"
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
                  className={`cursor-pointer rounded-3xl border ${themeStyle.border} ${themeStyle.cardBg} backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.01] flex items-center justify-between gap-3 group ${
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

          {/* Footer Sovereign Mark */}
          <footer className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-2 text-center text-zinc-400 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sovereign Link-in-Bio Powered by Zenvitra</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Encrypted Real-Time Mesh • Zero Tracker Fingerprints
            </p>
          </footer>
        </div>
      </main>

      {/* CUSTOMIZER DRAWER */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Customize Your Space</h2>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Selector */}
            <div className="mb-5">
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
            <div className="mb-6">
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

            {/* Add New Custom Block */}
            <form onSubmit={handleAddLinkBlock} className="pt-4 border-t border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                Add Custom Link Block
              </h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={newBlockTitle}
                    onChange={(e) => setNewBlockTitle(e.target.value)}
                    placeholder="Block Title (e.g. My Newsletter, Substack)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newBlockSub}
                    onChange={(e) => setNewBlockSub(e.target.value)}
                    placeholder="Subtitle or Description (Optional)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newBlockUrl}
                    onChange={(e) => setNewBlockUrl(e.target.value)}
                    placeholder="Destination URL (e.g. https://...)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Block</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-cyan-500/40 text-cyan-300 px-4 py-2.5 rounded-full text-xs font-mono shadow-2xl backdrop-blur-xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
