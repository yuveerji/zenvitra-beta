'use client';

import React, { useState } from 'react';
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  MessageCircle,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  category: string;
  handle: string;
  url: string;
  icon: React.ElementType;
  accentBadge: string;
  tagline: string;
}

interface SocialHoverMenuProps {
  onOpenFullModal?: () => void;
}

export default function SocialHoverMenu({ onOpenFullModal }: SocialHoverMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const socialNodes: SocialPlatform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      category: 'MEDIA & DISPATCH',
      handle: '@zenvitra',
      url: 'https://instagram.com/zenvitra',
      icon: Instagram,
      accentBadge: 'text-pink-300 bg-pink-500/10 border-pink-500/30',
      tagline: 'Visual stories, community initiatives & ecosystem highlights',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      category: 'VIDEO ARCHIVE',
      handle: '@ZenvitraFoundation',
      url: 'https://youtube.com/@zenvitrafoundation',
      icon: Youtube,
      accentBadge: 'text-red-300 bg-red-500/10 border-red-500/30',
      tagline: 'Full symposium keynotes, open panels & docuseries',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      category: 'COMMUNITY CHAT',
      handle: 'Official Community',
      url: 'https://chat.whatsapp.com/Cmn9ihpEbRs7kLO1G83Fez',
      icon: MessageCircle,
      accentBadge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
      tagline: 'Official delegate updates, announcements & community groups',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      category: 'REALTIME WIRE',
      handle: '@zenvitra_',
      url: 'https://x.com/zenvitrafoundation',
      icon: Twitter,
      accentBadge: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
      tagline: 'Policy briefs, live discussion spaces & verified discourse',
    },
  ];

  return (
    <div
      ref={menuRef}
      className="relative hidden md:inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Root Trigger Pill */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          if (onOpenFullModal) {
            onOpenFullModal();
          }
        }}
        title="Click to open full Social & Ecosystem Directory (Telegram, GitHub & more)"
        className={`h-8.5 xl:h-9 px-3 xl:px-4 rounded-full border text-[11px] xl:text-xs font-mono transition-all duration-200 flex items-center gap-1.5 xl:gap-2 cursor-pointer select-none shrink-0 whitespace-nowrap ${
          isOpen
            ? 'border-white/40 bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
            : 'border-white/15 bg-white/[0.04] text-neutral-300 hover:text-white hover:border-white/30 hover:bg-white/[0.08]'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#34d399]" />
        <span className="font-mono font-semibold tracking-tight text-[11px] xl:text-xs">@zenvitra</span>
      </button>

      {/* Pop-Out Flowchart Dropdown (Anchored to right edge so it opens cleanly towards the left) */}
      <div
        className={`absolute top-full right-0 sm:-right-6 md:-right-12 mt-2.5 z-[150] transition-all duration-200 ease-out origin-top-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
        style={{ width: '560px', maxWidth: 'calc(100vw - 40px)' }}
      >
        <div className="w-full rounded-3xl bg-[#08080c]/98 border border-white/15 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] p-4 text-left">
          {/* Header with directory modal link & close button */}
          <div className="flex items-center justify-between px-2 py-1 mb-3 border-b border-white/10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              OFFICIAL EXTERNAL PLATFORMS
            </span>
            <div className="flex items-center gap-2">
              {onOpenFullModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullModal();
                  }}
                  className="font-mono text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 transition cursor-pointer hover:underline"
                >
                  <Layers className="w-3 h-3 text-neutral-400" />
                  <span>Full Directory</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Horizontal Tree Distribution Rail & Vertical Drop Lines */}
          <div className="relative mb-3 px-4">
            {/* Top Horizontal Rail */}
            <div className="w-full h-px bg-gradient-to-r from-pink-500/40 via-emerald-500/40 to-sky-500/40" />
            
            {/* 4 Branch Drop Nodes with Vertical Connecting Lines */}
            <div className="grid grid-cols-4 px-3 -mt-1">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-black border-2 border-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <div className="w-px h-3 bg-gradient-to-b from-pink-400/80 to-transparent" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-black border-2 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                <div className="w-px h-3 bg-gradient-to-b from-red-400/80 to-transparent" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-black border-2 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <div className="w-px h-3 bg-gradient-to-b from-emerald-400/80 to-transparent" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-black border-2 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                <div className="w-px h-3 bg-gradient-to-b from-sky-400/80 to-transparent" />
              </div>
            </div>
          </div>

          {/* 4 Symmetrical Platform Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {socialNodes.map((node) => {
              const Icon = node.icon;
              const iconColors: Record<string, string> = {
                instagram: 'text-pink-400 bg-pink-500/10 border-pink-500/20 group-hover:border-pink-500/40',
                youtube: 'text-red-400 bg-red-500/10 border-red-500/20 group-hover:border-red-500/40',
                whatsapp: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40',
                twitter: 'text-sky-400 bg-sky-500/10 border-sky-500/20 group-hover:border-sky-500/40',
              };
              return (
                <a
                  key={node.id}
                  href={node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-2xl bg-zinc-950/90 hover:bg-zinc-900 border border-white/10 hover:border-white/25 flex flex-col justify-between space-y-2.5 transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  {/* Top Bar: Icon + External Arrow */}
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-xl border flex items-center justify-center group-hover:scale-105 transition duration-200 ${iconColors[node.id] || 'bg-white/5 border-white/10 text-white'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition duration-200" />
                  </div>

                  {/* Body Info */}
                  <div className="space-y-0.5">
                    <span
                      className={`inline-block font-mono text-[7.5px] tracking-wider uppercase px-1.5 py-0.5 rounded-full border font-semibold ${node.accentBadge}`}
                    >
                      {node.category}
                    </span>
                    <h4 className="font-display font-bold text-xs text-white group-hover:text-white transition">
                      {node.name}
                    </h4>
                    <p className="font-mono text-[9.5px] text-neutral-400 group-hover:text-neutral-300 transition truncate">
                      {node.handle}
                    </p>
                  </div>

                  {/* Tagline Footer */}
                  <p className="font-sans text-[8.5px] text-neutral-400 group-hover:text-neutral-300 leading-snug transition font-light border-t border-white/[0.05] pt-1.5 line-clamp-2">
                    {node.tagline}
                  </p>
                </a>
              );
            })}
          </div>

          {/* Directory action footer */}
          {onOpenFullModal && (
            <div
              onClick={() => onOpenFullModal()}
              className="mt-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-center cursor-pointer transition flex items-center justify-center gap-2"
            >
              <span className="text-[10.5px] font-mono text-neutral-300 font-semibold">
                Click to open full social directory with LinkedIn, Telegram, GitHub &amp; more
              </span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}