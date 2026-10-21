'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Radio,
  Sparkles,
  Building2,
  CreditCard,
  User,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Globe2,
  Newspaper,
  Layers,
  Activity,
  CheckCircle2,
  Orbit,
  Cpu,
  BookOpen,
  Scale,
  Video,
  Gavel,
  Compass,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface EcosystemMapSceneProps {
  onNext: () => void;
}

export type EcosystemCategory = 'ALL' | 'GOVERNANCE' | 'COMMUNITY' | 'MEDIA' | 'SECURITY';

interface ModuleItem {
  id: string;
  name: string;
  category: 'GOVERNANCE' | 'COMMUNITY' | 'MEDIA' | 'SECURITY';
  categoryLabel: string;
  tagline: string;
  description: string;
  status: 'ACTIVE' | 'COMING_SOON';
  icon: any;
  color: string;
  accentHex: string;
  angleDeg: number; // Angle on the circle (0 - 360)
  ringRadiusPercent: number; // Distance from center: inner ring (32%) or outer ring (43%)
  features: string[];
}

// 10 key ecosystem pillars arranged in a true circular radial topology
const MODULES: ModuleItem[] = [
  // Top quadrant - MEDIA & WIRE (Angles around 270°)
  {
    id: 'news',
    name: 'ZEN.NEWS',
    category: 'MEDIA',
    categoryLabel: 'Media & Press Wire',
    tagline: 'Global Real-Time Wire',
    description: 'Live international treaty flashes, youth policy news, and verified editorial dispatches.',
    status: 'ACTIVE',
    icon: Globe2,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    accentHex: '#14b8a6',
    angleDeg: 270, // 12 o'clock
    ringRadiusPercent: 42,
    features: ['Breaking Wire Feeds', 'Source Citations', 'Youth Geo-Politics'],
  },
  {
    id: 'press',
    name: 'ZEN.PRESS',
    category: 'MEDIA',
    categoryLabel: 'Media & Press Wire',
    tagline: 'Investigative Press Enclave',
    description: 'In-depth longform manifestos, strategic analyses, and youth-led investigative journalism.',
    status: 'ACTIVE',
    icon: Newspaper,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    accentHex: '#6366f1',
    angleDeg: 306, // ~1 o'clock
    ringRadiusPercent: 42,
    features: ['Editorial Bureaus', 'Verifiable Citations', 'Community Journals'],
  },

  // Right quadrant - GOVERNANCE & SIMULATION (Angles around 0° / 360°)
  {
    id: 'mun',
    name: 'ZEN.MUN',
    category: 'GOVERNANCE',
    categoryLabel: 'Governance & Summits',
    tagline: 'Conference & Committee Engine',
    description: 'Experience diplomacy, debate, live matrix rosters, and parliamentary simulations.',
    status: 'ACTIVE',
    icon: Building2,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    accentHex: '#06b6d4',
    angleDeg: 342, // ~2 o'clock
    ringRadiusPercent: 42,
    features: ['Dais Floor Timers', 'Resolution Drafts', 'Live GSL Rosters'],
  },
  {
    id: 'solutions',
    name: 'ZEN.SOLUTIONS',
    category: 'GOVERNANCE',
    categoryLabel: 'Governance & Summits',
    tagline: 'Sovereign Bill Drafting',
    description: 'Draft, publish, and deliberate real-world legislative solutions and youth proposals.',
    status: 'ACTIVE',
    icon: Scale,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    accentHex: '#f59e0b',
    angleDeg: 18, // ~2:30 o'clock
    ringRadiusPercent: 42,
    features: ['Operative Clauses', 'Trademark Certification', 'Public Voting'],
  },
  {
    id: 'leaderboard',
    name: 'LEADERBOARD',
    category: 'GOVERNANCE',
    categoryLabel: 'Governance & Summits',
    tagline: 'Diplomatic Karma & Merit Ranks',
    description: 'Live leaderboard honoring top speech contributions, policy draft passes, and caucus impact.',
    status: 'ACTIVE',
    icon: Trophy,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    accentHex: '#f43f5e',
    angleDeg: 54, // ~4 o'clock
    ringRadiusPercent: 42,
    features: ['Merit Ledger', 'Seasonal Distinctions', 'Institution Standings'],
  },

  // Bottom quadrant - SECURITY & PROTOCOL (Angles around 90°)
  {
    id: 'payments',
    name: 'ZEN.PAYMENTS',
    category: 'SECURITY',
    categoryLabel: 'Security & Protocol',
    tagline: 'Pass Tiers & Cashfree Gateway',
    description: 'Instant delegate pass procurement, dynamic tiers, and frictionless Cashfree checkout.',
    status: 'ACTIVE',
    icon: CreditCard,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    accentHex: '#fbbf24',
    angleDeg: 90, // 6 o'clock
    ringRadiusPercent: 42,
    features: ['Cashfree PG v3', 'Tier Allocations', 'Cryptographic Passes'],
  },
  {
    id: 'passport',
    name: 'ZEN.PASSPORT',
    category: 'SECURITY',
    categoryLabel: 'Security & Protocol',
    tagline: 'Sovereign Credentials & Ledger',
    description: 'Cryptographic proof of participation, tier points, committee honors, and verified accolades.',
    status: 'ACTIVE',
    icon: ShieldCheck,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    accentHex: '#10b981',
    angleDeg: 126, // ~7 o'clock
    ringRadiusPercent: 42,
    features: ['Genesis Tier Points', 'Permanent Accreditation', 'Tamper-Proof QR'],
  },

  // Left quadrant - COMMUNITY & DISPATCH (Angles around 180°)
  {
    id: 'chat',
    name: 'ZEN.CHAT',
    category: 'COMMUNITY',
    categoryLabel: 'Community & Mesh',
    tagline: 'Encrypted Caucus Channels',
    description: 'Peer-to-peer delegation chits, secretarial chambers, and secured committee rooms.',
    status: 'ACTIVE',
    icon: MessageSquare,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    accentHex: '#3b82f6',
    angleDeg: 162, // ~8:30 o'clock
    ringRadiusPercent: 42,
    features: ['Confidential Chits', 'Dais Broadcasts', 'Unmod Caucus Rooms'],
  },
  {
    id: 'pulse',
    name: 'ZEN.PULSE',
    category: 'COMMUNITY',
    categoryLabel: 'Community & Mesh',
    tagline: 'Sovereign Community Commons',
    description: 'Share ideas, publish diplomatic dispatches, and engage in real-time threaded caucuses.',
    status: 'ACTIVE',
    icon: Radio,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    accentHex: '#a855f7',
    angleDeg: 198, // ~9:30 o'clock
    ringRadiusPercent: 42,
    features: ['Threaded Debates', 'Soundtrack Stories', 'Verified Feed'],
  },
  {
    id: 'docs',
    name: 'ZEN.DOCS',
    category: 'GOVERNANCE',
    categoryLabel: 'Governance & Summits',
    tagline: 'Diplomatic Drafting OS',
    description: 'Synchronized collaborative editor for multilateral resolutions, working papers, and reports.',
    status: 'ACTIVE',
    icon: BookOpen,
    color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    accentHex: '#22d3ee',
    angleDeg: 234, // ~10:30 o'clock
    ringRadiusPercent: 42,
    features: ['Live Clause Numbering', 'Sponsor Sign-offs', 'Instant PDF Export'],
  },
];

export function EcosystemMapScene({ onNext }: EcosystemMapSceneProps) {
  const [selectedModule, setSelectedModule] = useState<ModuleItem>(MODULES[2]); // Default ZEN.MUN
  const [hoveredModule, setHoveredModule] = useState<ModuleItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<EcosystemCategory>('ALL');

  const activeFocus = hoveredModule || selectedModule;

  // Filter categories
  const categories: { id: EcosystemCategory; label: string; color: string }[] = [
    { id: 'ALL', label: `All Portals (${MODULES.length})`, color: 'text-white' },
    { id: 'GOVERNANCE', label: 'Governance & MUN', color: 'text-cyan-400' },
    { id: 'COMMUNITY', label: 'Community Commons', color: 'text-purple-400' },
    { id: 'MEDIA', label: 'Media & Wire', color: 'text-teal-400' },
    { id: 'SECURITY', label: 'Security & Pass', color: 'text-emerald-400' },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-4 py-2 sm:py-4 select-none">
      {/* Dynamic ambient background radial glow that shifts based on selected node */}
      <motion.div
        animate={{
          backgroundColor: activeFocus.accentHex,
          opacity: 0.14,
        }}
        transition={{ duration: 0.4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[550px] rounded-full blur-[170px] pointer-events-none"
      />

      {/* Header */}
      <div className="text-center space-y-1.5 mb-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono tracking-widest uppercase mb-0.5">
          <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '14s' }} />
          <span>RADIAL TOPOLOGY &bull; THE ECOSYSTEM</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase max-w-3xl leading-tight">
          THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400">ZENVITRA CONSTELLATION</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-xl mx-auto">
          A circular, unified mind map of sovereign governance, live caucus chambers, verifiable media, and passport ledgers.
        </p>

        {/* Category Pills Filter */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-white/15 border-white/40 text-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet: Circular Mind Map Canvas */}
      <div className="relative w-full aspect-square max-w-[560px] max-h-[560px] rounded-full bg-[#06080d]/90 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl hidden md:flex items-center justify-center my-2">
        {/* Subtle celestial coordinate grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_75%)] pointer-events-none" />
        
        {/* Concentric Orbit Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-white/[0.05] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-dashed border-white/[0.06] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[470px] h-[470px] rounded-full border border-white/[0.04] pointer-events-none" />

        {/* SVG Radial Synaptic Spoke Lines from Center (50%, 50%) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <defs>
            <filter id="mindmapGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {MODULES.map((mod) => {
            const isMatchCategory = categoryFilter === 'ALL' || mod.category === categoryFilter;
            const isTarget = activeFocus.id === mod.id;

            // Polar coordinates to Cartesian: (50 + r * cos, 50 + r * sin)
            const rad = (mod.angleDeg * Math.PI) / 180;
            const x2 = 50 + mod.ringRadiusPercent * Math.cos(rad);
            const y2 = 50 + mod.ringRadiusPercent * Math.sin(rad);

            // Control curve mid-point for aesthetic synaptic curve
            const cx = 50 + (mod.ringRadiusPercent * 0.5) * Math.cos(rad + 0.1);
            const cy = 50 + (mod.ringRadiusPercent * 0.5) * Math.sin(rad + 0.1);

            return (
              <g key={`spoke-${mod.id}`} opacity={isMatchCategory ? 1 : 0.2} className="transition-opacity duration-300">
                {/* Spoke Curve Line */}
                <path
                  d={`M 50 50 Q ${cx} ${cy}, ${x2} ${y2}`}
                  fill="none"
                  stroke={isTarget ? mod.accentHex : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isTarget ? '1.2' : '0.4'}
                  strokeDasharray={isTarget ? 'none' : '1.5 1.5'}
                  filter={isTarget ? 'url(#mindmapGlow)' : undefined}
                />

                {/* Animated travelling pulse along spoke */}
                {isTarget && (
                  <circle r="1" fill={mod.accentHex} filter="url(#mindmapGlow)">
                    <animateMotion
                      dur="2.2s"
                      repeatCount="indefinite"
                      path={`M 50 50 Q ${cx} ${cy}, ${x2} ${y2}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Core Brain Hub: ZENVITRA NEXUS */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
            boxShadow: [
              '0 0 25px rgba(6,182,212,0.25)',
              '0 0 50px rgba(168,85,247,0.4)',
              '0 0 25px rgba(6,182,212,0.25)',
            ],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#0a0d14] border-2 border-white/20 flex flex-col items-center justify-center text-center cursor-default shadow-2xl backdrop-blur-2xl group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-500 p-0.5 flex items-center justify-center mb-1">
            <div className="w-full h-full bg-[#07090e] rounded-full flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-bold font-display tracking-widest text-white uppercase">
            ZENVITRA
          </span>
          <span className="text-[7.5px] font-mono text-cyan-400 tracking-wider uppercase font-semibold">
            NEXUS CORE
          </span>
        </motion.div>

        {/* Circular Orbiting Nodes positioned on the circle */}
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isSelected = selectedModule.id === mod.id;
          const isHovered = hoveredModule?.id === mod.id;
          const isActive = isSelected || isHovered;
          const isMatchCategory = categoryFilter === 'ALL' || mod.category === categoryFilter;

          // Convert angle & radius into percentage positions
          const rad = (mod.angleDeg * Math.PI) / 180;
          const leftPercent = 50 + mod.ringRadiusPercent * Math.cos(rad);
          const topPercent = 50 + mod.ringRadiusPercent * Math.sin(rad);

          return (
            <motion.div
              key={mod.id}
              whileHover={{ scale: 1.12 }}
              onClick={() => setSelectedModule(mod)}
              onMouseEnter={() => setHoveredModule(mod)}
              onMouseLeave={() => setHoveredModule(null)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer p-2.5 rounded-2xl border transition-all duration-300 flex items-center gap-2 backdrop-blur-md ${
                !isMatchCategory ? 'opacity-25 pointer-events-none' : 'opacity-100'
              } ${
                isActive
                  ? 'bg-white/[0.14] shadow-2xl scale-110 z-40'
                  : 'bg-[#090b10]/90 border-white/10 hover:border-white/30 hover:bg-white/[0.06]'
              }`}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                borderColor: isActive ? mod.accentHex : undefined,
                boxShadow: isActive ? `0 0 25px ${mod.accentHex}40` : undefined,
              }}
            >
              <div
                className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-transform ${mod.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="text-left pr-1">
                <span className="text-[11px] font-mono font-bold text-white tracking-wide block leading-none">
                  {mod.name}
                </span>
                <span className="text-[8px] font-mono text-neutral-400 block leading-tight mt-0.5">
                  {mod.category}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile-Friendly Tactile Mind Map Grid (Shown on smaller screens) */}
      <div className="grid grid-cols-2 gap-2.5 w-full md:hidden my-3">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isSelected = selectedModule.id === mod.id;
          const isMatchCategory = categoryFilter === 'ALL' || mod.category === categoryFilter;

          if (!isMatchCategory) return null;

          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setSelectedModule(mod)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between min-h-[90px] relative overflow-hidden ${
                isSelected
                  ? 'bg-white/[0.1] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-[#090b10] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${mod.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${mod.accentHex}20`, color: mod.accentHex }}>
                  {mod.category}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-bold text-white font-mono block truncate">{mod.name}</span>
                <span className="text-[10px] text-neutral-400 font-mono block truncate">{mod.tagline}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Synaptic Inspector Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFocus.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="w-full mt-2 sm:mt-3 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xl"
          style={{ borderLeftColor: activeFocus.accentHex, borderLeftWidth: '4px' }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${activeFocus.color}`}
            >
              <activeFocus.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-bold text-white tracking-wide">
                  {activeFocus.name}
                </span>
                <span
                  className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{
                    backgroundColor: `${activeFocus.accentHex}20`,
                    color: activeFocus.accentHex,
                    border: `1px solid ${activeFocus.accentHex}40`,
                  }}
                >
                  {activeFocus.categoryLabel}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ONLINE</span>
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-sans mt-0.5 leading-relaxed line-clamp-2 max-w-2xl">
                {activeFocus.description}
              </p>
              
              {/* Feature pills */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {activeFocus.features.map((feat, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300"
                  >
                    &bull; {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider hidden sm:inline">
              Click any node on circle to focus
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Continue CTA */}
      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400 hover:opacity-95 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(6,182,212,0.35)] flex items-center gap-2 cursor-pointer group"
        >
          <span>CONTINUE TO PASSPORT IDENTITY</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
