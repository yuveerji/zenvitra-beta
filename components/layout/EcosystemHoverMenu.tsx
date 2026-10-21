'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  Flame, 
  ArrowUpRight, 
  ShieldCheck, 
  BookOpen, 
  Globe2, 
  Gavel, 
  MessageSquare, 
  Video, 
  Calendar, 
  Scale, 
  Newspaper, 
  Trophy, 
  Users, 
  Heart, 
  Radio, 
  FileText,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  Cpu,
  Orbit,
} from 'lucide-react';

interface EcosystemHoverMenuProps {
  onOpenSocialModal?: () => void;
  onOpenFullModal?: () => void;
}

export function EcosystemHoverMenu({ onOpenSocialModal, onOpenFullModal }: EcosystemHoverMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'workspaces' | 'civics' | 'external'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Sovereign Internal Nodes
  const ecosystemNodes = [
    {
      name: 'ZEN.DOCS',
      category: 'workspaces',
      href: '/docs',
      icon: BookOpen,
      tag: 'Drafting OS',
      tagColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
      glow: 'group-hover:border-cyan-500/40 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      desc: 'Collaborative diplomatic drafting with real-time clauses & legal hierarchy.',
    },
    {
      name: 'ZEN.SOLUTIONS',
      category: 'civics',
      href: '/solutions',
      icon: Scale,
      tag: 'Civic Engine',
      tagColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
      glow: 'group-hover:border-amber-500/40 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      desc: 'Sovereign legislative bill publishing, chamber voting & trademark export.',
    },
    {
      name: 'ZEN.PRESS',
      category: 'workspaces',
      href: '/press',
      icon: Newspaper,
      tag: 'Press Wire',
      tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
      glow: 'group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      desc: 'Investigative bureaus, verified citations & transparent editorial desks.',
    },
    {
      name: 'ZEN.PASSPORT',
      category: 'civics',
      href: '/passport',
      icon: ShieldCheck,
      tag: 'Identity',
      tagColor: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
      glow: 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      desc: 'Tamper-proof verifiable identity, credentials, awards & QR terminal.',
    },
    {
      name: 'Model UN CV',
      category: 'workspaces',
      href: '/cv',
      icon: Trophy,
      tag: 'Dossier',
      tagColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
      glow: 'group-hover:border-amber-500/40 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      desc: 'Diplomatic portfolio with verified awards, summits & chaired daises.',
    },
    {
      name: 'ZEN.SPACE',
      category: 'civics',
      href: '/space',
      icon: Globe2,
      tag: 'Bio & Hub',
      tagColor: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
      glow: 'group-hover:border-rose-500/40 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
      desc: 'Customizable civic bio, experiences, verified links & sovereign widgets.',
    },
    {
      name: 'ZEN.CALL',
      category: 'workspaces',
      href: '/call',
      icon: Video,
      tag: 'In Development',
      tagColor: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
      glow: 'group-hover:border-blue-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      desc: 'High-fidelity diplomatic chamber audio/video with dais floor controls.',
    },
    {
      name: 'Impact Escrow',
      category: 'civics',
      href: '/impact',
      icon: Heart,
      tag: '10% Endowment',
      tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
      glow: 'group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      desc: '10% platform profit endowment distributed every 6 months with video proof.',
    },
    {
      name: 'Country Matrix',
      category: 'workspaces',
      href: '/mun/matrix',
      icon: Layers,
      tag: 'Allocations',
      tagColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
      glow: 'group-hover:border-cyan-500/40 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      desc: 'Live allocation ledgers, delegate quotas & committee country assignments.',
    },
  ];

  // 2. High-Octane Social Media Presence Nodes
  const socialNodes = [
    {
      name: 'Instagram',
      handle: '@zenvitra',
      category: 'external',
      href: 'https://instagram.com/zenvitra',
      color: 'from-pink-500/20 via-rose-500/20 to-purple-500/20',
      badge: 'VISUAL STORIES',
      badgeColor: 'text-pink-300 bg-pink-500/15 border-pink-500/30',
      desc: 'Reels, summit recaps, student highlights & ecosystem releases.',
    },
    {
      name: 'YouTube',
      handle: '@ZenvitraFoundation',
      category: 'external',
      href: 'https://youtube.com/@zenvitrafoundation',
      color: 'from-red-500/20 via-rose-500/20 to-orange-500/20',
      badge: 'BROADCAST',
      badgeColor: 'text-red-300 bg-red-500/15 border-red-500/30',
      desc: 'Full plenary recordings, open debates & keynote symposium streams.',
    },
    {
      name: 'WhatsApp',
      handle: 'Official Community',
      category: 'external',
      href: 'https://chat.whatsapp.com/Cmn9ihpEbRs7kLO1G83Fez',
      color: 'from-emerald-500/20 via-teal-500/20 to-green-500/20',
      badge: 'COMMUNITY CHAT',
      badgeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
      desc: 'Delegate updates, secretarial announcements & summit caucuses.',
    },
    {
      name: 'X (Twitter)',
      handle: '@zenvitra_',
      category: 'external',
      href: 'https://x.com/zenvitra_',
      color: 'from-sky-500/20 via-blue-500/20 to-cyan-500/20',
      badge: 'REALTIME WIRE',
      badgeColor: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
      desc: 'Policy briefs, live discussion spaces & youth civic commentary.',
    },
  ];

  // Filter nodes
  const filteredEcosystem = ecosystemNodes.filter((node) => {
    const matchesCategory = activeCategory === 'all' || activeCategory === node.category;
    const matchesSearch = !searchFilter.trim() || 
      node.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.desc.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSocial = socialNodes.filter((node) => {
    const matchesCategory = activeCategory === 'all' || activeCategory === 'external';
    const matchesSearch = !searchFilter.trim() || 
      node.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.desc.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isCurrentActive = ecosystemNodes.some(n => pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href)));

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button with Nexus Core Styling */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          if (onOpenFullModal) {
            onOpenFullModal();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={`group relative px-2.5 xl:px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1 shrink-0 cursor-pointer ${
          isCurrentActive || isOpen
            ? 'bg-white/[0.08] text-white font-medium'
            : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
        }`}
      >
        <span className="font-display uppercase text-[11px] xl:text-xs font-bold tracking-[0.14em] transition-colors whitespace-nowrap">
          Ecosystem
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : 'text-neutral-400 group-hover:text-white'
          }`}
        />

        {/* Active Underline Glow */}
        <div
          className={`absolute -bottom-1 left-2.5 right-2.5 h-[2px] rounded-full transition-all duration-300 origin-center ${
            isCurrentActive
              ? 'opacity-100 scale-x-100 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]'
              : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.5)]'
          }`}
        />
      </button>

      {/* Flabbergasting Social & Ecosystem Command Deck */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-12 md:-right-20 lg:-right-24 top-full mt-3 w-[720px] max-w-[calc(100vw-1.5rem)] rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_35px_120px_rgba(0,0,0,1),0_0_50px_rgba(6,182,212,0.08)] p-5 z-[150] text-left overflow-hidden"
          >
            {/* Ambient Background Radial Glows */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Deck Header */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-500 p-[1.5px] flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-cyan-300 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest text-white flex items-center gap-1.5">
                    NEXUS CORE &bull; ECOSYSTEM DECK
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] font-mono text-neutral-400">
                    Sovereign Workspaces, Civic Engines &amp; Verified Social Feeds
                  </p>
                </div>
              </div>

              {/* Actions: Expand to Full Modal & Live Search */}
              <div className="flex items-center gap-2">
                <Link
                  href="/apps"
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/35 text-purple-200 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  title="Open Interactive Circular Mind Map"
                >
                  <Orbit className="w-3 h-3 text-purple-300 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Mind Map (ZEN.APPS) ↗</span>
                </Link>

                {onOpenFullModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenFullModal();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                    title="Expand to Full Sovereign Command Modal"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Expand Deck ↗</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
                  <Search className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter nodes..."
                    className="bg-transparent text-[11px] font-mono text-white placeholder:text-neutral-500 focus:outline-none w-24 sm:w-28"
                  />
                </div>
              </div>
            </div>

            {/* Category Tab Selector */}
            <div className="relative z-10 flex items-center gap-1 mb-3.5 pb-1 border-b border-white/5 overflow-x-auto text-[10px] font-mono uppercase tracking-wider">
              {[
                { id: 'all', label: 'All Portals' },
                { id: 'workspaces', label: 'Workspaces & OS' },
                { id: 'civics', label: 'Civics & Escrow' },
                { id: 'external', label: 'Social & Media' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Section 1: Social Media Hub Cards (Rich Visual Grid) */}
            {(activeCategory === 'all' || activeCategory === 'external') && (
              <div className="relative z-10 mb-4 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-pink-400 animate-pulse" />
                    Verified Social Channels &amp; Dispatches
                  </span>
                  {onOpenSocialModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenSocialModal();
                      }}
                      className="text-[10px] font-mono text-neutral-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer hover:underline"
                    >
                      <span>Full Directory</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {filteredSocial.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.08] hover:to-white/[0.03] border border-white/10 hover:border-white/25 transition-all duration-200 flex flex-col justify-between space-y-2 shadow-lg hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-xs text-white group-hover:text-cyan-200 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-300 transition-colors">
                          {item.handle}
                        </p>
                      </div>

                      <p className="text-[9px] text-neutral-400 leading-snug line-clamp-2 border-t border-white/5 pt-1.5">
                        {item.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Core Platform & Civic Workspace Grid */}
            {(activeCategory === 'all' || activeCategory === 'workspaces' || activeCategory === 'civics') && (
              <div className="relative z-10 space-y-2">
                <div className="px-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                    <Layers className="w-3 h-3" />
                    Diplomatic OS &amp; Sovereign Workspaces
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500">
                    {filteredEcosystem.length} Core Nodes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredEcosystem.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`group p-2.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                          isCurrent
                            ? 'bg-white/[0.12] border-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                            : `bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.07] ${item.glow}`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-1.5 rounded-xl border ${
                            isCurrent
                              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                              : 'bg-white/[0.06] border-white/10 text-cyan-400 group-hover:scale-105 transition-transform'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${item.tagColor}`}>
                            {item.tag}
                          </span>
                        </div>

                        <div>
                          <div className="font-display font-bold text-xs text-white group-hover:text-cyan-200 transition-colors">
                            {item.name}
                          </div>
                          <p className="text-[10px] text-neutral-400 leading-snug line-clamp-2 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Sovereign Guarantee Footer */}
            <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2 text-neutral-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>100% Sovereign Protocol &bull; Zero Behavioral Tracking</span>
              </div>
              <div className="flex items-center gap-3">
                {onOpenFullModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenFullModal();
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Command Deck ↗</span>
                  </button>
                )}
                <Link
                  href="/manifesto"
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 font-semibold transition group"
                >
                  <span>Manifesto</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
