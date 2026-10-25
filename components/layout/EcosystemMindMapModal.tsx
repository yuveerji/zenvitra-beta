'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Search,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Scale,
  Newspaper,
  FileText,
  Gavel,
  Layers,
  Video,
  Calendar,
  ShieldCheck,
  Globe,
  Award,
  Trophy,
  Heart,
  Radio,
  MessageSquare,
  Send,
  CreditCard,
  LifeBuoy,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Compass,
  ArrowUpRight,
  Lock,
  CheckCircle2,
  Share2,
  Cpu,
  Orbit,
  Network,
  LayoutGrid,
  GitBranch,
} from 'lucide-react';

export interface EcosystemPortalNode {
  id: string;
  name: string;
  category: 'workspaces' | 'diplomacy' | 'civic' | 'social';
  categoryLabel: string;
  href: string;
  isExternal?: boolean;
  icon: React.ElementType;
  tag: string;
  tagColor: string;
  badge: string;
  badgeColor: string;
  desc: string;
  capabilities: string[];
  gradient: string;
  borderHover: string;
}

export const ECOSYSTEM_NODES: EcosystemPortalNode[] = [
  // 1. Workspaces & Collaborative OS
  {
    id: 'docs',
    name: 'ZEN.DOCS',
    category: 'workspaces',
    categoryLabel: 'Workspaces & OS',
    href: '/docs',
    icon: BookOpen,
    tag: 'Drafting OS',
    tagColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    badge: 'COLLABORATIVE DRAFTING',
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    desc: 'Sovereign diplomatic drafting workspace with real-time clauses, legal numbering & tier exports.',
    capabilities: [
      'Pre-ambulatory & Operative clause structuring',
      'Live synchronized delegate editing',
      'Direct trademark watermark document exports'
    ],
    gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    borderHover: 'hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
  },
  {
    id: 'solutions',
    name: 'ZEN.SOLUTIONS',
    category: 'workspaces',
    categoryLabel: 'Workspaces & OS',
    href: '/solutions',
    icon: Scale,
    tag: 'Civic Engine',
    tagColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    badge: 'LEGISLATIVE ENGINE',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    desc: 'Sovereign solution repository, public bill publishing, chamber voting & authentic ledger certification.',
    capabilities: [
      'Document parsing & clause extraction engine',
      'Tier-based trademark & author attribution export',
      'Verified citizen upvoting & debate threads'
    ],
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderHover: 'hover:border-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]'
  },
  {
    id: 'press',
    name: 'ZEN.PRESS',
    category: 'workspaces',
    categoryLabel: 'Workspaces & OS',
    href: '/press',
    icon: Newspaper,
    tag: 'Press Wire',
    tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    badge: 'MEDIA BUREAU',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    desc: 'Investigative bureau, verifiable citations, authentic press releases & transparent editorial publishing.',
    capabilities: [
      'Open journalism desks & syndicate feeds',
      'Direct citation verification & fact audits',
      'Editorial dispatches across the platform'
    ],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderHover: 'hover:border-emerald-400 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
  },
  {
    id: 'forms',
    name: 'ZEN.FORMS',
    category: 'workspaces',
    categoryLabel: 'Workspaces & OS',
    href: '/forms',
    icon: FileText,
    tag: 'Form Studio',
    tagColor: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
    badge: 'STUDIO & SURVEYS',
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    desc: 'Sovereign form builder, shareable registration links, custom questions & direct ledger exports.',
    capabilities: [
      'Drag-and-drop form creation studio',
      'Exportable attendee rosters & CSV ledgers',
      'Automated registration ticket passes'
    ],
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    borderHover: 'hover:border-purple-400 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
  },
  {
    id: 'legislate',
    name: 'ZEN.LEGISLATE',
    category: 'workspaces',
    categoryLabel: 'Workspaces & OS',
    href: '/legislate',
    icon: Scale,
    tag: 'Parliament',
    tagColor: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30',
    badge: 'PARLIAMENTARY OS',
    badgeColor: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    desc: 'Lok Sabha, Rajya Sabha & parliamentary bill drafting, motion dispatches & legislative amendments.',
    capabilities: [
      'Official legislative bill formats & numbering',
      'Chamber motion drafting & clause revisions',
      'Parliamentary committee records'
    ],
    gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    borderHover: 'hover:border-yellow-400 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]'
  },

  // 2. Diplomatic & MUN Chambers
  {
    id: 'matrix',
    name: 'Committee Matrix',
    category: 'diplomacy',
    categoryLabel: 'Diplomacy & MUN',
    href: '/mun/matrix',
    icon: Layers,
    tag: 'Allocations',
    tagColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    badge: 'CONFERENCE MATRIX',
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    desc: 'Live conference country matrix, real-time portfolio allocations, delegate reservation & CSV exports.',
    capabilities: [
      'Requires active conference to populate allocations',
      'Canonical ministerial & country seat data',
      'Instant reservation & delegate tier passes'
    ],
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderHover: 'hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
  },
  {
    id: 'committee',
    name: 'Chamber Dais',
    category: 'diplomacy',
    categoryLabel: 'Diplomacy & MUN',
    href: '/committee',
    icon: Gavel,
    tag: 'Live Dais',
    tagColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    badge: 'EXECUTIVE BOARD',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    desc: 'Active committee chamber dais, real-time speaker queue, formal motions & live roll-call voting.',
    capabilities: [
      'General Speakers List (GSL) timing controls',
      'Unmoderated & Moderated caucus motions',
      'Substantive resolution & draft voting'
    ],
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    borderHover: 'hover:border-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]'
  },
  {
    id: 'conference',
    name: 'Conference OS',
    category: 'diplomacy',
    categoryLabel: 'Diplomacy & MUN',
    href: '/mun/conference',
    icon: Calendar,
    tag: 'Secretariat',
    tagColor: 'text-pink-300 bg-pink-500/10 border-pink-500/30',
    badge: 'COMMAND CENTER',
    badgeColor: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    desc: 'Secretariat command center, liveboard controls, multi-day schedule progression & awards management.',
    capabilities: [
      'Multi-day conference advancement engine',
      'Secretariat notices & broadcast announcements',
      'Live plenary dashboard and room oversight'
    ],
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    borderHover: 'hover:border-pink-400 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]'
  },
  {
    id: 'meet',
    name: 'ZEN.MEET',
    category: 'diplomacy',
    categoryLabel: 'Diplomacy & MUN',
    href: '/meet',
    icon: Video,
    tag: 'Coming Soon',
    tagColor: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
    badge: 'IN DEVELOPMENT',
    badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    desc: 'Sovereign virtual chamber scheduler, video conference provisioning, waiting room gate & voice rooms.',
    capabilities: [
      'Standard Room, MUN Committee & Voice Room flows',
      'Encrypted peer audio-visual transmission',
      'In-chamber agenda notes & screen sharing'
    ],
    gradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    borderHover: 'hover:border-teal-400 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.2)]'
  },
  {
    id: 'call',
    name: 'ZEN.CALL',
    category: 'diplomacy',
    categoryLabel: 'Diplomacy & MUN',
    href: '/call',
    icon: Radio,
    tag: 'Coming Soon',
    tagColor: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
    badge: 'IN DEVELOPMENT',
    badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    desc: 'High-fidelity sovereign diplomatic voice and video channels with floor intervention controls.',
    capabilities: [
      'Low-latency acoustic channel transmission',
      'Dais floor queue & delegate intervention',
      'Persistent or single-use meeting sessions'
    ],
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    borderHover: 'hover:border-sky-400 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]'
  },

  // 3. Civic Engine & Identity
  {
    id: 'passport',
    name: 'ZEN.PASSPORT',
    category: 'civic',
    categoryLabel: 'Civics & Identity',
    href: '/passport',
    icon: ShieldCheck,
    tag: 'Identity',
    tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    badge: 'VERIFIED CREDENTIAL',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    desc: 'Permanent sovereign digital passport, cryptographic credentials & scannable event terminal QR code.',
    capabilities: [
      'Universal biometric-style diplomatic passport card',
      'Verified institution accreditations & certificates',
      'Instant attendee verification at summit check-in'
    ],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderHover: 'hover:border-emerald-400 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
  },
  {
    id: 'space',
    name: 'ZEN.SPACE',
    category: 'civic',
    categoryLabel: 'Civics & Identity',
    href: '/space',
    icon: Globe,
    tag: 'Civic Bio',
    tagColor: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
    badge: 'PUBLIC BIO HUB',
    badgeColor: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    desc: 'Personalized civic profile hub, custom portfolio links, diplomatic accomplishments & theme styling.',
    capabilities: [
      'Custom theme engine (Sand, Obsidian, Matrix, Aurora)',
      'Verified social links & contact badges',
      'Dynamic spotlight cards & portfolio modules'
    ],
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    borderHover: 'hover:border-violet-400 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]'
  },
  {
    id: 'cv',
    name: 'Model UN CV',
    category: 'civic',
    categoryLabel: 'Civics & Identity',
    href: '/cv',
    icon: Award,
    tag: 'Dossier',
    tagColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    badge: 'DIPLOMATIC DOSSIER',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    desc: 'Comprehensive diplomatic track record, awards, committee experience & exportable credentials.',
    capabilities: [
      'Best Delegate, High Commendation & Special Mention ledger',
      'Verified conference participation history',
      'Shareable digital diplomatic resume'
    ],
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    borderHover: 'hover:border-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]'
  },
  {
    id: 'leaderboard',
    name: 'ZEN.LEADERBOARD',
    category: 'civic',
    categoryLabel: 'Civics & Identity',
    href: '/leaderboard',
    icon: Trophy,
    tag: 'Rankings',
    tagColor: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30',
    badge: 'GLOBAL MERIT',
    badgeColor: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    desc: 'Verified youth leadership rankings, active seasons, institutional standings & civic impact points.',
    capabilities: [
      'Citizens, Institutions & Delegations leaderboards',
      'Monthly & seasonal recognition cycles',
      'Verified activity merit calculations'
    ],
    gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    borderHover: 'hover:border-yellow-400 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]'
  },
  {
    id: 'impact',
    name: 'Impact Ledger',
    category: 'civic',
    categoryLabel: 'Civics & Identity',
    href: '/impact',
    icon: Heart,
    tag: 'Civic Escrow',
    tagColor: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    badge: 'TRANSPARENT ENDOWMENT',
    badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    desc: '10% profit endowment distributed every 6 months to verified causes with transparent video proof.',
    capabilities: [
      'Immutable cryptographic disbursement ledger',
      'Direct public audits & financial proof',
      'Youth civic grant endowments'
    ],
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    borderHover: 'hover:border-rose-400 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]'
  },

  // 4. Communication & Social Media
  {
    id: 'pulse',
    name: 'ZEN.PULSE',
    category: 'social',
    categoryLabel: 'Social & Communication',
    href: '/pulse',
    icon: Radio,
    tag: 'Social Platform',
    tagColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    badge: 'SOVEREIGN FEED',
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    desc: 'Sovereign social feed, diplomatic stories, verified citizen discussions & peer interactions.',
    capabilities: [
      'Story creation with background soundtrack sync',
      'Structured discussions & policy threads',
      'Followers, bookmarks & verified notifications'
    ],
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderHover: 'hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
  },
  {
    id: 'chat',
    name: 'ZEN.CHAT',
    category: 'social',
    categoryLabel: 'Social & Communication',
    href: '/chat',
    icon: MessageSquare,
    tag: 'Coming Soon',
    tagColor: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
    badge: 'IN DEVELOPMENT',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    desc: 'Confidential caucus channels, direct delegate chats, media dispatches & voice debriefs.',
    capabilities: [
      'Committee caucus channels & unmoderated huddles',
      'Direct encrypted delegate messaging',
      'Document & resolution link sharing'
    ],
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    borderHover: 'hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    categoryLabel: 'Social & Communication',
    href: 'https://instagram.com/zenvitra',
    isExternal: true,
    icon: Instagram,
    tag: 'Visual Dispatch',
    tagColor: 'text-pink-300 bg-pink-500/10 border-pink-500/30',
    badge: 'OFFICIAL MEDIA',
    badgeColor: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    desc: 'Official visual dispatches, summit recaps, youth movement initiatives & behind-the-scenes.',
    capabilities: [
      'Conference photo archives & keynote reels',
      'Summit speaker announcements',
      'Ecosystem community spotlights'
    ],
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    borderHover: 'hover:border-pink-400 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'social',
    categoryLabel: 'Social & Communication',
    href: 'https://youtube.com/@zenvitrafoundation',
    isExternal: true,
    icon: Youtube,
    tag: 'Video Broadcast',
    tagColor: 'text-red-300 bg-red-500/10 border-red-500/30',
    badge: 'OFFICIAL BROADCAST',
    badgeColor: 'bg-red-500/10 text-red-300 border-red-500/30',
    desc: 'High-definition keynote recordings, complete debate sessions, docuseries & summit live streams.',
    capabilities: [
      'Full symposium keynote broadcasts',
      'Youth-led systemic solution documentaries',
      'Dais procedure guides & training series'
    ],
    gradient: 'from-red-500/20 via-rose-500/10 to-transparent',
    borderHover: 'hover:border-red-400 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    categoryLabel: 'Social & Communication',
    href: 'https://chat.whatsapp.com/Cmn9ihpEbRs7kLO1G83Fez',
    isExternal: true,
    icon: MessageSquare,
    tag: 'Community',
    tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    badge: 'OFFICIAL DISPATCH',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    desc: 'Official delegate announcements, real-time summit coordination & verified community broadcast groups.',
    capabilities: [
      'Direct announcements from Secretariat',
      'Live attendee coordination during events',
      'Exclusive community updates'
    ],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderHover: 'hover:border-emerald-400 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    category: 'social',
    categoryLabel: 'Social & Communication',
    href: 'https://x.com/zenvitra_',
    isExternal: true,
    icon: Twitter,
    tag: 'Realtime Wire',
    tagColor: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
    badge: 'POLICY WIRE',
    badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    desc: 'Live draft threads, policy commentary, breaking civic alerts & real-time public discourse spaces.',
    capabilities: [
      'Real-time debate spaces & highlights',
      'Breaking policy news & youth civic alerts',
      'Verified discourse & commentary'
    ],
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    borderHover: 'hover:border-sky-400 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]'
  }
];

interface EcosystemMindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EcosystemMindMapModal({ isOpen, onClose }: EcosystemMindMapModalProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'workspaces' | 'diplomacy' | 'civic' | 'social'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'mindmap' | 'grid'>('mindmap');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Close on Escape key
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

  const filteredNodes = useMemo(() => {
    return ECOSYSTEM_NODES.filter((node) => {
      const matchesCategory = activeCategory === 'all' || node.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        node.name.toLowerCase().includes(q) ||
        node.desc.toLowerCase().includes(q) ||
        node.badge.toLowerCase().includes(q) ||
        node.capabilities.some(c => c.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6 lg:p-8">
        
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-7xl max-h-[94vh] rounded-2xl sm:rounded-[2.5rem] bg-[#07090f]/98 border border-white/15 p-4 sm:p-8 lg:p-10 shadow-[0_35px_120px_rgba(0,0,0,0.98)] z-10 flex flex-col justify-between overflow-y-auto text-left font-sans"
        >
          {/* Ambient Background Auras */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px]" />

          {/* Top Bar Header */}
          <div className="relative z-10 pb-6 mb-6 border-b border-white/10 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <div className="w-3.5 h-3.5 rounded-md bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-500 p-[1px] flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-[#07090e] rounded-[4px] flex items-center justify-center">
                      <Cpu className="w-2 h-2 text-cyan-300 animate-pulse" />
                    </div>
                  </div>
                  <span>ZENVITRA NEXUS CORE &bull; PROTOCOL ECOSYSTEM</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                  Nexus Command Deck &amp; <span className="font-serif italic font-normal text-cyan-200">Platform Ecosystem</span>
                </h2>
                <p className="font-sans text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">
                  Unified constellation of sovereign portals, collaborative workspaces, dais chambers, identity ledgers, and verified external communication channels.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/apps"
                  onClick={onClose}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500/20 via-cyan-500/15 to-purple-500/20 hover:from-purple-500/30 hover:to-cyan-500/25 border border-purple-500/40 text-purple-200 font-mono text-xs font-bold transition shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  title="Open Interactive Circular Mind Map"
                >
                  <Orbit className="w-3.5 h-3.5 text-purple-300 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Interactive Circular Map (ZEN.APPS) ↗</span>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer shrink-0"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Bar, View Mode Toggle & Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {/* Left: View Mode Segmented Switcher & Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {/* View Switcher: Mind Map vs Directory */}
                <div className="flex items-center gap-1 bg-black/70 border border-white/15 rounded-xl p-1 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setViewMode('mindmap')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
                      viewMode === 'mindmap'
                        ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Switch to Interactive Mind Map View"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Mind Map</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Switch to Directory Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Directory</span>
                  </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono uppercase tracking-wider">
                  {[
                    { id: 'all', label: `All Portals (${ECOSYSTEM_NODES.length})` },
                    { id: 'workspaces', label: 'Workspaces' },
                    { id: 'diplomacy', label: 'Diplomacy' },
                    { id: 'civic', label: 'Civics' },
                    { id: 'social', label: 'Social' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategory(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                        activeCategory === tab.id
                          ? 'bg-white/15 text-white border-white/40 font-bold shadow-sm'
                          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Search Input */}
              <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs w-full sm:w-64">
                <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search portals, features..."
                  className="bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none w-full font-mono"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-neutral-500 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: INTERACTIVE NEURAL MIND MAP TREE */}
          {viewMode === 'mindmap' && (
            <div className="relative z-10 pb-8 space-y-8">
              {/* Central ZENVITRA Nexus Core Anchor Hub */}
              <div className="flex flex-col items-center justify-center text-center relative py-4">
                <div className="relative p-6 sm:p-7 rounded-3xl bg-[#060812] border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.35)] flex flex-col items-center justify-center space-y-2 max-w-sm w-full mx-auto backdrop-blur-2xl group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 p-[1.5px] flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-[#04060d] rounded-[14px] flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-cyan-300 animate-pulse" />
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>ZENVITRA NEXUS CORE</span>
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-white tracking-widest uppercase">
                    ONE ECOSYSTEM
                  </h3>
                  <p className="text-[10px] font-mono text-neutral-400 max-w-xs">
                    Connected youth experiences &bull; Verifiable civic impact &bull; BY YOUTH. FOR YOUTH.
                  </p>
                </div>
              </div>

              {/* Four Neural Category Constellations */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  {
                    id: 'workspaces',
                    name: 'Workspaces & Drafting OS',
                    accentColor: '#06b6d4',
                    borderClass: 'border-cyan-500/30 hover:border-cyan-400',
                    headerBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
                    badge: 'OS & LEGISLATION',
                    nodes: filteredNodes.filter((n) => n.category === 'workspaces'),
                  },
                  {
                    id: 'diplomacy',
                    name: 'Diplomacy & MUN Chambers',
                    accentColor: '#ec4899',
                    borderClass: 'border-pink-500/30 hover:border-pink-400',
                    headerBg: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
                    badge: 'CHAMBERS & MEETS',
                    nodes: filteredNodes.filter((n) => n.category === 'diplomacy'),
                  },
                  {
                    id: 'civic',
                    name: 'Civics, Identity & Accolades',
                    accentColor: '#10b981',
                    borderClass: 'border-emerald-500/30 hover:border-emerald-400',
                    headerBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
                    badge: 'LEDGERS & MERIT',
                    nodes: filteredNodes.filter((n) => n.category === 'civic'),
                  },
                  {
                    id: 'social',
                    name: 'Social, Media & Community',
                    accentColor: '#3b82f6',
                    borderClass: 'border-blue-500/30 hover:border-blue-400',
                    headerBg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
                    badge: 'FEEDS & WIRE',
                    nodes: filteredNodes.filter((n) => n.category === 'social'),
                  },
                ]
                  .filter((cat) => activeCategory === 'all' || activeCategory === cat.id)
                  .map((cluster) => {
                    return (
                      <div
                        key={cluster.id}
                        className="space-y-3 p-4 rounded-3xl bg-[#060812]/90 border border-white/10 flex flex-col justify-between"
                      >
                        {/* Cluster Gateway Header */}
                        <div className="pb-3 border-b border-white/10 flex items-center justify-between gap-2">
                          <div>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${cluster.headerBg}`}>
                              {cluster.badge}
                            </span>
                            <h4 className="font-display font-bold text-sm text-white mt-1.5">
                              {cluster.name}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {cluster.nodes.length} Apps
                          </span>
                        </div>

                        {/* Cluster Portal Nodes (Mind Map Leaf Capsules) */}
                        <div className="space-y-2.5 flex-1">
                          {cluster.nodes.map((node) => {
                            const Icon = node.icon;
                            const isExt = node.isExternal;
                            const isHovered = hoveredNodeId === node.id;

                            return (
                              <div
                                key={node.id}
                                onMouseEnter={() => setHoveredNodeId(node.id)}
                                onMouseLeave={() => setHoveredNodeId(null)}
                                className={`p-3 rounded-2xl bg-neutral-900/80 border transition-all duration-200 flex flex-col gap-2 ${
                                  isHovered
                                    ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.02] bg-neutral-900'
                                    : 'border-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white shrink-0">
                                      <Icon className="w-4 h-4 text-cyan-300" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-display font-bold text-xs text-white block truncate">
                                        {node.name}
                                      </span>
                                      <span className="text-[9px] font-mono text-neutral-500 block truncate">
                                        {node.tag}
                                      </span>
                                    </div>
                                  </div>

                                  {isExt ? (
                                    <a
                                      href={node.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-white flex items-center gap-1 shrink-0"
                                    >
                                      <span>Open</span>
                                      <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <Link
                                      href={node.href}
                                      onClick={onClose}
                                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1 shrink-0"
                                    >
                                      <span>Launch</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  )}
                                </div>

                                <p className="text-[11px] text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                                  {node.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: DIRECTORY GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {filteredNodes.map((node) => {
                const Icon = node.icon;
                const isExt = node.isExternal;

                return (
                  <div
                    key={node.id}
                    className={`group relative p-5 rounded-3xl bg-neutral-950/70 border border-white/10 transition-all duration-200 flex flex-col justify-between space-y-4 hover:scale-[1.01] ${node.borderHover}`}
                  >
                    {/* Top Subtle Gradient Glow */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${node.gradient} rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <div className="space-y-3">
                      {/* Header: Icon + Category Badge + External Arrow */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 group-hover:border-white/20 transition-all shrink-0">
                            <Icon className="w-5 h-5 text-neutral-200 group-hover:text-cyan-400 transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display font-bold text-base text-white group-hover:text-cyan-200 transition-colors truncate">
                              {node.name}
                            </h4>
                            <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wider truncate">
                              {node.categoryLabel}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border ${node.badgeColor} shrink-0 whitespace-nowrap`}>
                          {node.tag}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        {node.desc}
                      </p>

                      {/* Capabilities List */}
                      <div className="space-y-1.5 pt-1">
                        {node.capabilities.map((cap, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-neutral-300 font-mono">
                            <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                            <span className="truncate">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action CTA */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Protocol Active
                      </span>

                      {isExt ? (
                        <a
                          href={node.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs font-mono font-semibold text-white transition hover:text-cyan-300"
                        >
                          <span>Open Channel</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={node.href}
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono font-semibold text-cyan-300 transition hover:border-cyan-400"
                        >
                          <span>Launch Portal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredNodes.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <Compass className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-mono text-neutral-400">No ecosystem portals match "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Bottom Footer Info Bar */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>All 20 Zenvitra Protocol Portals Connected</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/mun/matrix"
                onClick={onClose}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>MUN Matrix Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/pulse"
                onClick={onClose}
                className="text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <span>Sovereign Feed</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
