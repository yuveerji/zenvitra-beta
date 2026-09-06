'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageSquare,
  Send,
  Github,
  Mail,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  Globe2,
  Radio,
  Share2,
  BookOpen,
  Layers
} from 'lucide-react';

export interface ExternalPlatformNode {
  id: string;
  name: string;
  handle: string;
  category: string;
  icon: React.ElementType;
  url: string;
  badgeColor: string;
  iconColor: string;
  iconBg: string;
  buttonColor: string;
  lineColor: string;
  howItConnects: string[];
}

export const MAIN_EXTERNAL_PLATFORMS: ExternalPlatformNode[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@zenvitra',
    category: 'VISUAL DISPATCH & REELS',
    icon: Instagram,
    url: 'https://instagram.com/zenvitra',
    badgeColor: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/20',
    buttonColor: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white',
    lineColor: '#f43f5e',
    howItConnects: [
      'Visual stories & youth movement highlights',
      'Summit recaps & photo archives',
      'Behind-the-scenes team & community updates',
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@ZenvitraFoundation',
    category: 'SUMMIT BROADCAST & ARCHIVES',
    icon: Youtube,
    url: 'https://youtube.com/@zenvitrafoundation',
    badgeColor: 'bg-red-500/10 text-red-300 border-red-500/30',
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10 border-red-500/20',
    buttonColor: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white',
    lineColor: '#ef4444',
    howItConnects: [
      'High-definition keynote summit live streams',
      'Complete debate recordings & panel sessions',
      'Docuseries on youth-led systemic solutions',
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Zenvitra Foundation',
    category: 'GOVERNANCE & INSTITUTIONAL PARTNERSHIPS',
    icon: Linkedin,
    url: 'https://linkedin.com/company/zenvitra',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    buttonColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white',
    lineColor: '#3b82f6',
    howItConnects: [
      'Institutional alliances & university partnerships',
      'Youth diplomatic governance & delegate appointments',
      'Executive leadership rosters & organizational briefs',
    ],
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    handle: '@zenvitra_',
    category: 'REAL-TIME POLICY WIRE',
    icon: Twitter,
    url: 'https://x.com/zenvitrafoundation',
    badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    buttonColor: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white',
    lineColor: '#38bdf8',
    howItConnects: [
      'Live draft threads & policy commentary',
      'Breaking youth civic alerts & public discourse',
      'Real-time debate spaces & highlights',
    ],
  },
];

export type SocialHandleNode = ExternalPlatformNode;
export const SOCIAL_HANDLES = MAIN_EXTERNAL_PLATFORMS;

export const SECONDARY_CHANNELS = [
  {
    name: 'Telegram Wire',
    handle: 't.me/zenvitrafoundation',
    icon: Send,
    url: 'https://t.me/zenvitrafoundation',
    badge: 'DIRECT BULLETIN',
    badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    tag: 'Direct announcements & sovereign dispatches',
  },
  {
    name: 'GitHub Core',
    handle: 'github.com/zenvitra',
    icon: Github,
    url: 'https://github.com/zenvitra',
    badge: 'OPEN SOURCE',
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    tag: 'Open-source protocols & UI packages',
  },
  {
    name: 'Substack Dispatch',
    handle: 'zenvitra.substack.com',
    icon: BookOpen,
    url: 'https://zenvitra.substack.com',
    badge: 'POLICY JOURNAL',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'In-depth essays, editorial reviews & research papers',
  },
  {
    name: 'Press Office Email',
    handle: 'press@zenvitra.org',
    icon: Mail,
    url: 'mailto:press@zenvitra.org',
    badge: 'PRESS WIRE',
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    tag: 'Accredited journalism dispatches & syndication',
  },
  {
    name: 'Civic Research Desk',
    handle: 'research@zenvitra.org',
    icon: Globe2,
    url: 'mailto:research@zenvitra.org',
    badge: 'ACADEMIC',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    tag: 'Quantitative data sets & policy whitepapers',
  },
];

interface SocialMindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SocialMindMapModal({ isOpen, onClose }: SocialMindMapModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 lg:p-8">
        
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl max-h-[92vh] rounded-3xl bg-[#090a0f] border border-white/15 p-6 sm:p-10 lg:p-12 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto text-left font-sans"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between gap-4 relative z-10 pb-6 border-b border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                  External Network &amp; Social Channels
                </h3>
              </div>
              <p className="font-mono text-xs text-neutral-400">
                Official external platforms, verified media accounts &amp; community directory.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CENTRAL FLOWCHART: ROOT @zenvitra & 4 CORE HANDLES */}
          <div className="relative my-8 sm:my-10 flex flex-col items-center">
            
            {/* 1. ROOT HUB NODE: zenvitra.xyz */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 rounded-full bg-white/[0.04] border border-white/20 text-white font-mono text-xs sm:text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="tracking-wide">zenvitra.xyz</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 text-[10px] uppercase tracking-wider font-semibold border border-white/10">
                  ROOT ECOSYSTEM
                </span>
              </div>
            </div>

            {/* 2. BRANCHING SVG CONNECTOR TREE (Desktop) */}
            <div className="hidden lg:block w-full max-w-5xl h-12 relative my-1">
              <svg className="w-full h-full" viewBox="0 0 1000 48" preserveAspectRatio="none">
                <line x1="500" y1="0" x2="500" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <line x1="125" y1="24" x2="875" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="125" y1="24" x2="125" y2="48" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="375" y1="24" x2="375" y2="48" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="625" y1="24" x2="625" y2="48" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="875" y1="24" x2="875" y2="48" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="125" cy="24" r="3.5" fill="#f43f5e" />
                <circle cx="375" cy="24" r="3.5" fill="#ef4444" />
                <circle cx="500" cy="24" r="3.5" fill="#10b981" />
                <circle cx="625" cy="24" r="3.5" fill="#3b82f6" />
                <circle cx="875" cy="24" r="3.5" fill="#38bdf8" />
              </svg>
            </div>

            {/* 3. THE 4 DEDICATED EXTERNAL PLATFORM CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full pt-4 lg:pt-0">
              {MAIN_EXTERNAL_PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isCopied = copiedId === platform.id;

                return (
                  <div
                    key={platform.id}
                    className="group relative rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-200 p-5 sm:p-6 space-y-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/25"
                  >
                    {/* Top Content */}
                    <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3.5">
                        
                        {/* Header: Logo Icon & Category Tag */}
                        <div className="flex items-center justify-between gap-2">
                          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center group-hover:scale-105 transition-transform ${platform.iconBg} ${platform.iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${platform.badgeColor}`}>
                            {platform.name}
                          </span>
                        </div>

                        {/* Name & Handle with Copy Action */}
                        <div className="space-y-0.5">
                          <h4 className="font-display font-bold text-base text-white">
                            {platform.name}
                          </h4>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs text-neutral-400 truncate">
                              {platform.handle}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isCopied && (
                                <span className="text-[10px] font-mono text-emerald-400 font-bold animate-pulse">
                                  Link Copied!
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleCopy(platform.url, platform.id, e)}
                                title={isCopied ? `Copied ${platform.name} link to clipboard!` : `Copy ${platform.name} link`}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                                  isCopied
                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/15 hover:border-white/20'
                                }`}
                                aria-label={`Copy ${platform.name} link`}
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* How it connects */}
                        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                          <span className="text-[9.5px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                            HOW IT CONNECTS:
                          </span>
                          <ul className="space-y-1.5 text-xs text-neutral-300 font-light leading-snug">
                            {platform.howItConnects.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-neutral-500 text-xs leading-none shrink-0 mt-0.5">&#x2022;</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Direct External Connect Button */}
                      <div className="pt-4 mt-4 border-t border-white/[0.06]">
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-2.5 px-4 rounded-xl ${platform.buttonColor} font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer`}
                        >
                          <span>Connect on {platform.name}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Extra Community & Governance Handles */}
          <div className="relative z-10 pt-6 border-t border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                EXTRA ECOSYSTEM HANDLES &amp; DIRECT DIRECTORY
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                Direct bulletins, open source dev, forums &amp; publications
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              {SECONDARY_CHANNELS.map((channel, idx) => {
                const Icon = channel.icon;
                const isSecCopied = copiedId === `sec-${idx}`;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-white/25 flex items-center justify-between gap-3 transition group"
                  >
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${channel.iconBg} ${channel.iconColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold block truncate group-hover:text-cyan-300 transition">
                            {channel.name}
                          </span>
                          <span className={`text-[8.5px] px-1.5 py-0.5 rounded border font-bold ${channel.badgeColor}`}>
                            {channel.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 truncate block">
                          {channel.tag}
                        </span>
                      </div>
                    </a>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleCopy(channel.url, `sec-${idx}`, e)}
                        title={isSecCopied ? `Copied ${channel.name} link!` : `Copy ${channel.name} link`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                          isSecCopied
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/15'
                        }`}
                        aria-label={`Copy ${channel.name} link`}
                      >
                        {isSecCopied ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-neutral-400 hover:text-white transition"
                        title={`Open ${channel.name}`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SocialMindMapModal;
