'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Crown, 
  Radio, 
  FileText, 
  HeartHandshake, 
  MessageSquare,
  Search,
  Filter,
  Zap,
  ExternalLink,
  BookOpen,
  Sun,
  Globe,
  Camera,
  Scale,
  Newspaper
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMun } from '@/context/MunContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';

interface MedalsRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MedalCategory = 'ALL' | 'DIPLOMACY' | 'EDITORIAL' | 'SOLUTIONS' | 'IMPACT' | 'GOVERNANCE';

interface MedalItem {
  id: string;
  title: string;
  category: 'DIPLOMACY' | 'EDITORIAL' | 'SOLUTIONS' | 'IMPACT' | 'GOVERNANCE';
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  description: string;
  isUnlocked: boolean;
  progressText?: string;
  howToEarn: string;
  actionLabel: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export function MedalsRoadmapModal({ isOpen, onClose }: MedalsRoadmapModalProps) {
  const { isAuthenticated, profile, user, isGuest } = useAuth();
  const { registrations, experiences } = useMun();
  const { myPosts, myFluxVideos, savedPostIds } = useZenPulse();
  const { events } = useZenEvents();

  const [activeCategory, setActiveCategory] = useState<MedalCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const isGuestUser = Boolean(
    isGuest ||
    profile?.isGuest ||
    profile?.role === 'guest' ||
    profile?.role === 'GUEST' ||
    (typeof window !== 'undefined' && (() => {
      try {
        const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
        return stored?.isGuest || stored?.role === 'guest' || stored?.role === 'GUEST';
      } catch (_) {
        return false;
      }
    })())
  );

  if (!isOpen) return null;

  /* ─────────── LIVE DYNAMIC EVALUATIONS ─────────── */
  const passesCount = isGuestUser ? 0 : (registrations?.length || 0);
  const publishedCount = isGuestUser ? 0 : ((myPosts?.length || 0) + (myFluxVideos?.length || 0));
  const fluxCount = isGuestUser ? 0 : (myFluxVideos?.length || 0);
  const totalMunRecords = isGuestUser ? 0 : (passesCount + experiences.length);
  const attendedMunCount = isGuestUser ? 0 : (experiences.filter((e) => !e.isHostedByMe).length + passesCount);
  const hostedMunCount = isGuestUser ? 0 : (experiences.filter((e) => e.isHostedByMe || e.role === 'SECRETARIAT' || e.role === 'ORGANIZER_FOUNDER').length);

  const hasBestDelegate = !isGuestUser && experiences.some((e) => e.award === 'BEST_DELEGATE');
  const hasHighCommendation = !isGuestUser && experiences.some((e) => e.award === 'HIGH_COMMENDATION');
  const hasSpecialMention = !isGuestUser && experiences.some((e) => e.award === 'SPECIAL_MENTION');
  const hasPositionPaper = !isGuestUser && experiences.some((e) => e.award === 'BEST_POSITION_PAPER');
  const hasBestChair = !isGuestUser && experiences.some((e) => e.award === 'BEST_CHAIR' || e.role === 'EXECUTIVE_BOARD');
  const isOrganizerOrHost = !isGuestUser && (hostedMunCount > 0 || profile?.role === 'organizer' || profile?.role === 'admin' || profile?.role === 'core_team');
  const hasVerifiedCertificate = !isGuestUser && experiences.some((e) => e.verificationStatus.startsWith('VERIFIED'));
  const hasEscrowContribution = !isGuestUser && (passesCount > 0);
  const isSecretariatRole = !isGuestUser && (profile?.role === 'organizer' || profile?.role === 'admin' || profile?.role === 'core_team');
  const isFounderOrAdmin = !isGuestUser && (profile?.role === 'admin' || profile?.role === 'core_team' || profile?.email?.trim().toLowerCase() === 'founder@zenvitra.org');

  /* ─────────── 28 COMPREHENSIVE SOVEREIGN MEDALS ─────────── */
  const ALL_MEDALS: MedalItem[] = [
    /* ── 1. DIPLOMACY & MODEL UN ── */
    {
      id: 'mun-delegate',
      title: 'Accredited MUN Delegate',
      category: 'DIPLOMACY',
      icon: '🏛️',
      rarity: 'COMMON',
      description: 'Allotted representative in an active Model UN committee simulation.',
      isUnlocked: passesCount > 0 || experiences.some((e) => e.role === 'DELEGATE'),
      progressText: `${passesCount > 0 || experiences.length > 0 ? 1 : 0}/1 Registered`,
      howToEarn: 'Register for any upcoming Model UN committee simulation on Zenvitra.',
      actionLabel: 'Explore MUN Assemblies',
      actionLink: '/events',
    },
    {
      id: 'gavel-laureate',
      title: 'Best Delegate Gavel Laureate',
      category: 'DIPLOMACY',
      icon: '🏆',
      rarity: 'LEGENDARY',
      description: 'Awarded 1st Place (Best Delegate Gavel) in a verified Model UN conference.',
      isUnlocked: hasBestDelegate,
      progressText: hasBestDelegate ? 'Gavel Awarded' : '0/1 Gavel Won',
      howToEarn: 'Win Best Delegate in any assembly and log the verified accolade in your MUN Dossier.',
      actionLabel: 'Log MUN Accolade',
      actionLink: '/(platform)/profile/you',
    },
    {
      id: 'high-commendation',
      title: 'High Commendation Diplomat',
      category: 'DIPLOMACY',
      icon: '🥈',
      rarity: 'EPIC',
      description: 'Awarded 2nd Place (High Commendation) for strategic bilateral negotiations.',
      isUnlocked: hasHighCommendation || hasBestDelegate,
      progressText: hasHighCommendation || hasBestDelegate ? 'Accolade Earned' : '0/1 Earned',
      howToEarn: 'Win High Commendation in an accredited Model UN assembly.',
      actionLabel: 'Add to Dossier',
      actionLink: '/(platform)/profile/you',
    },
    {
      id: 'special-mention',
      title: 'Special Mention Diplomat',
      category: 'DIPLOMACY',
      icon: '🥉',
      rarity: 'RARE',
      description: 'Awarded 3rd Place (Special Mention) for distinguished committee speeches.',
      isUnlocked: hasSpecialMention || hasHighCommendation || hasBestDelegate,
      progressText: hasSpecialMention || hasHighCommendation || hasBestDelegate ? 'Accolade Earned' : '0/1 Earned',
      howToEarn: 'Earn a Special Mention accolade in any recognized Model UN.',
      actionLabel: 'Add to Dossier',
      actionLink: '/(platform)/profile/you',
    },
    {
      id: 'position-paper',
      title: 'Best Position Paper Laureate',
      category: 'DIPLOMACY',
      icon: '📜',
      rarity: 'EPIC',
      description: 'Authored the top-ranked preliminary policy position paper in committee.',
      isUnlocked: hasPositionPaper,
      progressText: hasPositionPaper ? 'Paper Ratified' : '0/1 Awarded',
      howToEarn: 'Submit an exceptional policy research paper and win Best Position Paper award.',
      actionLabel: 'Add Position Paper',
      actionLink: '/(platform)/profile/you',
    },
    {
      id: 'secretariat-host',
      title: 'Secretariat Convener & Host',
      category: 'DIPLOMACY',
      icon: '👑',
      rarity: 'LEGENDARY',
      description: 'Organized, founded, or served on the Executive Dais for a youth summit.',
      isUnlocked: isOrganizerOrHost || isSecretariatRole,
      progressText: isOrganizerOrHost ? 'Assembly Hosted' : '0/1 Hosted',
      howToEarn: 'Host a Model UN summit on Zenvitra or record a hosted assembly in your Dossier.',
      actionLabel: 'Host New Summit',
      actionLink: '/events',
    },
    {
      id: 'eb-chair',
      title: 'Executive Board Dais Moderator',
      category: 'DIPLOMACY',
      icon: '⚖️',
      rarity: 'EPIC',
      description: 'Chaired, moderated, or directed proceedings on an Executive Board dais.',
      isUnlocked: hasBestChair || experiences.some((e) => e.role === 'EXECUTIVE_BOARD'),
      progressText: hasBestChair ? 'Dais Moderated' : '0/1 Chaired',
      howToEarn: 'Serve as Chairperson, Co-Chair, or Committee Director in a conference.',
      actionLabel: 'Log Chair Role',
      actionLink: '/(platform)/profile/you',
    },
    {
      id: 'veteran-diplomat',
      title: 'Distinguished Diplomat (3+ MUNs)',
      category: 'DIPLOMACY',
      icon: '🎖️',
      rarity: 'RARE',
      description: 'Participated in or hosted 3 or more verified Model UN conferences.',
      isUnlocked: totalMunRecords >= 3,
      progressText: `${Math.min(3, totalMunRecords)}/3 Conferences Logged`,
      howToEarn: 'Participate in or add at least 3 Model UN conferences to your Diplomatic Dossier.',
      actionLabel: 'Add to Dossier',
      actionLink: '/(platform)/profile/you',
    },
    {
      id: 'grand-ambassador',
      title: 'Grand Ambassador (10+ MUNs)',
      category: 'DIPLOMACY',
      icon: '🌍',
      rarity: 'LEGENDARY',
      description: 'Participated in or hosted 10 or more verified conferences across diverse caucuses.',
      isUnlocked: totalMunRecords >= 10,
      progressText: `${Math.min(10, totalMunRecords)}/10 Conferences Logged`,
      howToEarn: 'Represent your delegation across 10 or more conferences on the matrix.',
      actionLabel: 'Explore Summits',
      actionLink: '/events',
    },
    {
      id: 'crisis-commander',
      title: 'Crisis Simulation Strategist',
      category: 'DIPLOMACY',
      icon: '⚡',
      rarity: 'EPIC',
      description: 'Navigated high-intensity midnight crisis simulations and historic cabinets.',
      isUnlocked: experiences.some((e) => e.committee.toLowerCase().includes('crisis') || e.committee.toLowerCase().includes('unsc')),
      progressText: 'Crisis Directive Prepared',
      howToEarn: 'Participate in a Continuous Crisis Committee (CCC), UNSC, or Historic War Cabinet.',
      actionLabel: 'Explore Crisis Events',
      actionLink: '/events',
    },

    /* ── 2. EDITORIAL & PRESS ── */
    {
      id: 'civic-publisher',
      title: 'Verified Civic Publisher',
      category: 'EDITORIAL',
      icon: '✍️',
      rarity: 'COMMON',
      description: 'Authored authentic non-partisan dispatches or short-form reels on Pulse wire.',
      isUnlocked: publishedCount > 0,
      progressText: `${publishedCount} Published`,
      howToEarn: 'Create and publish your first article or video dispatch on the platform.',
      actionLabel: 'Create Dispatch',
      actionLink: '/discussions',
    },
    {
      id: 'bureau-editor',
      title: 'Chief Bureau Columnist (5+ Articles)',
      category: 'EDITORIAL',
      icon: '📰',
      rarity: 'EPIC',
      description: 'Published 5 or more verified non-partisan journalistic articles or op-eds.',
      isUnlocked: (myPosts?.length || 0) >= 5,
      progressText: `${Math.min(5, myPosts?.length || 0)}/5 Articles Published`,
      howToEarn: 'Publish 5 high-impact editorial dispatches in the Press wire.',
      actionLabel: 'Write Column',
      actionLink: '/press',
    },
    {
      id: 'flux-broadcaster',
      title: 'SPARK Media Broadcaster',
      category: 'EDITORIAL',
      icon: '🎥',
      rarity: 'RARE',
      description: 'Created and broadcasted original short-form civic documentary or video reels.',
      isUnlocked: fluxCount > 0,
      progressText: `${fluxCount} SPARK Reels`,
      howToEarn: 'Upload an original video reel or speech clip on SPARK.',
      actionLabel: 'Create SPARK Reel',
      actionLink: '/pulse?tab=flux',
    },
    {
      id: 'press-corps',
      title: 'International Press Laureate',
      category: 'EDITORIAL',
      icon: '📸',
      rarity: 'EPIC',
      description: 'Served as an International Press delegate, photojournalist, or IP Editor.',
      isUnlocked: experiences.some((e) => e.role === 'INTERNATIONAL_PRESS' || e.committee.toLowerCase().includes('press')),
      progressText: 'Press Pass Active',
      howToEarn: 'Log an International Press reporting assignment in your Dossier.',
      actionLabel: 'Log Press Experience',
      actionLink: '/(platform)/profile/you',
    },
    {
      id: 'viral-voice',
      title: 'Civic Resonance Voice',
      category: 'EDITORIAL',
      icon: '🎙️',
      rarity: 'RARE',
      description: 'Authored dispatches that generated active bookmarks and civic discussions.',
      isUnlocked: publishedCount > 1 || (savedPostIds?.length || 0) > 1,
      progressText: 'Active Discourse',
      howToEarn: 'Publish thoughtful discourse that resonates with youth delegates.',
      actionLabel: 'Post on Pulse',
      actionLink: '/pulse',
    },

    /* ── 3. POLICY & SOLUTIONS ── */
    {
      id: 'policy-drafter',
      title: 'Open Policy Drafter',
      category: 'SOLUTIONS',
      icon: '📜',
      rarity: 'RARE',
      description: 'Authored a multilateral working paper, draft bill, or treaty resolution.',
      isUnlocked: passesCount > 0 || publishedCount > 0,
      progressText: passesCount > 0 ? 'Resolution Drafted' : '0/1 Drafted',
      howToEarn: 'Draft and upload an open-source policy brief in the Solutions archive.',
      actionLabel: 'Explore Solutions',
      actionLink: '/solutions',
    },
    {
      id: 'treaty-sponsor',
      title: 'Multilateral Treaty Sponsor',
      category: 'SOLUTIONS',
      icon: '🤝',
      rarity: 'EPIC',
      description: 'Co-sponsored 3 or more open-source civic solution frameworks.',
      isUnlocked: (passesCount + publishedCount) >= 3,
      progressText: `${Math.min(3, passesCount + publishedCount)}/3 Sponsored`,
      howToEarn: 'Co-sponsor and ratify 3 multilateral working papers in the Solutions archive.',
      actionLabel: 'Browse Working Papers',
      actionLink: '/solutions',
    },
    {
      id: 'debate-champion',
      title: 'Parliamentary Debate Voice',
      category: 'SOLUTIONS',
      icon: '💬',
      rarity: 'COMMON',
      description: 'Contributed structured argument nodes to open civic debate trees.',
      isUnlocked: (savedPostIds?.length || 0) > 0 || publishedCount > 0,
      progressText: 'Active in Debates',
      howToEarn: 'Participate in structured tree-style open debates on societal issues.',
      actionLabel: 'Join Open Discussions',
      actionLink: '/discussions',
    },
    {
      id: 'consensus-architect',
      title: 'Bipartisan Consensus Architect',
      category: 'SOLUTIONS',
      icon: '🏛️',
      rarity: 'EPIC',
      description: 'Authored a draft resolution that successfully passed committee vote with 2/3 majority.',
      isUnlocked: experiences.some((e) => Boolean(e.award && e.award !== 'PARTICIPATION')) || passesCount >= 2,
      progressText: 'Consensus Ratified',
      howToEarn: 'Build bipartisan consensus on a working paper during an assembly session.',
      actionLabel: 'Solutions Library',
      actionLink: '/solutions',
    },

    /* ── 4. IMPACT & 25% CIVIC ESCROW ── */
    {
      id: 'escrow-patron',
      title: '25% Civic Escrow Patron',
      category: 'IMPACT',
      icon: '💖',
      rarity: 'EPIC',
      description: 'Directed funds to the permanent 25% escrow protocol funding govt schools.',
      isUnlocked: hasEscrowContribution,
      progressText: hasEscrowContribution ? 'Escrow Active' : '₹0 Allocated',
      howToEarn: 'Register for an assembly pass or donate directly to the 25% govt school grant fund.',
      actionLabel: 'Support School Grants',
      actionLink: '/donate/govt-schools',
    },
    {
      id: 'smart-lab-benefactor',
      title: 'Smart Lab & Solar Benefactor',
      category: 'IMPACT',
      icon: '☀️',
      rarity: 'LEGENDARY',
      description: 'Directly supported public school solar grids and smart computer labs.',
      isUnlocked: hasEscrowContribution && passesCount >= 2,
      progressText: 'Grant Tier Active',
      howToEarn: 'Support the computer lab and solar grid deployment projects.',
      actionLabel: 'View Grant Deployments',
      actionLink: '/impact',
    },
    {
      id: 'literacy-champion',
      title: 'Grassroots Literacy Champion',
      category: 'IMPACT',
      icon: '📚',
      rarity: 'RARE',
      description: 'Sponsored library books and science experiment kits for underserved students.',
      isUnlocked: hasEscrowContribution,
      progressText: 'Grant Patron',
      howToEarn: 'Fund library books and science learning packages on the impact ledger.',
      actionLabel: 'Fund Books & Kits',
      actionLink: '/donate/govt-schools',
    },
    {
      id: 'audit-steward',
      title: 'Zero-Overhead Ledger Steward',
      category: 'IMPACT',
      icon: '🔍',
      rarity: 'RARE',
      description: 'Audited transparent on-chain and banking allocation statements for youth grants.',
      isUnlocked: isAuthenticated,
      progressText: 'Public Ledger Verified',
      howToEarn: 'Review the public 25% grant allocation ledger and transparency receipts.',
      actionLabel: 'Audit Impact Ledger',
      actionLink: '/impact',
    },

    /* ── 5. GOVERNANCE, IDENTITY & SECURITY ── */
    {
      id: 'sovereign-node',
      title: 'Sovereign Citizen Node',
      category: 'GOVERNANCE',
      icon: '🛡️',
      rarity: 'COMMON',
      description: 'Authenticated dual-key session on the decentralized Zenvitra matrix.',
      isUnlocked: isAuthenticated,
      howToEarn: 'Sign in to authenticate your cryptographic platform session.',
      actionLabel: isAuthenticated ? 'Active Session' : 'Sign In Now',
      actionLink: '/login',
    },
    {
      id: 'ratified-proof',
      title: 'Ratified Proof Holder',
      category: 'GOVERNANCE',
      icon: '🔒',
      rarity: 'RARE',
      description: 'Attached an official certificate link or verification ID to your diplomatic record.',
      isUnlocked: hasVerifiedCertificate,
      progressText: hasVerifiedCertificate ? 'Proof Ratified' : '0/1 Verified Certificate',
      howToEarn: 'Add a certificate scan link or serial code to any logged MUN in your Dossier.',
      actionLabel: 'Verify Credentials',
      actionLink: '/(platform)/profile/you',
    },
    {
      id: 'zero-tracking-guardian',
      title: 'Zero-Tracking Defender',
      category: 'GOVERNANCE',
      icon: '🌐',
      rarity: 'COMMON',
      description: 'Active citizen utilizing the sovereign, non-partisan, tracker-free network.',
      isUnlocked: isAuthenticated,
      progressText: 'Zero Trackers Active',
      howToEarn: 'Maintain an active sovereign account on Zenvitra.',
      actionLabel: 'Platform Hub',
      actionLink: '/dashboard',
    },
    {
      id: 'manifesto-signatory',
      title: 'Constitutional Signatory',
      category: 'GOVERNANCE',
      icon: '📜',
      rarity: 'RARE',
      description: 'Ratified the Zenvitra Youth Covenant and Sovereign Manifesto charter.',
      isUnlocked: isAuthenticated,
      progressText: 'Covenant Signed',
      howToEarn: 'Read and affirm the youth charter in the Manifesto portal.',
      actionLabel: 'Read Manifesto',
      actionLink: '/manifesto',
    },
    {
      id: 'genesis-founder',
      title: 'Genesis Council Veteran',
      category: 'GOVERNANCE',
      icon: '👑',
      rarity: 'LEGENDARY',
      description: 'Early founding member, executive director, or core council builder.',
      isUnlocked: isFounderOrAdmin,
      progressText: isFounderOrAdmin ? 'Executive Clearance' : 'Council Access Locked',
      howToEarn: 'Join the Core Team or Executive Council through verified contribution.',
      actionLabel: 'Join Core Team',
      actionLink: '/join-core-team',
    },
  ];

  const unlockedCount = ALL_MEDALS.filter((m) => m.isUnlocked).length;
  const totalMedals = ALL_MEDALS.length;
  const progressPercent = Math.round((unlockedCount / totalMedals) * 100);

  const filteredMedals = ALL_MEDALS.filter((medal) => {
    if (activeCategory !== 'ALL' && medal.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        medal.title.toLowerCase().includes(q) ||
        medal.description.toLowerCase().includes(q) ||
        medal.howToEarn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRarityBadge = (rarity: MedalItem['rarity']) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'EPIC':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'RARE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090a0f] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-white font-sans text-left my-8 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        
        {/* ─── TOP HEADER ─── */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest font-bold">
                Sovereign Reputation &amp; Accolades Engine
              </span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Diplomatic Medals &amp; Credentials Registry</span>
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl">
              28 verified sovereign accolades across Model UN diplomacy, youth journalism, policy solutions, public school impact grants, and cryptographic governance.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guest Lockout Notice */}
        {isGuestUser && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-purple-900/40 to-black border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-purple-200 shrink-0">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <p className="font-bold text-white font-display text-sm">Guest Node Accolades Locked</p>
                <p className="text-[11px] text-purple-300/80">Constitutional medals and diplomatic honours are reserved for permanent accounts. Connect your email, phone, or Google/GitHub to unlock verifiable medals.</p>
              </div>
            </div>
            <Link
              href="/register"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shrink-0 shadow-sm whitespace-nowrap"
            >
              Verify Passport &rarr;
            </Link>
          </div>
        )}

        {/* ─── PROGRESS OVERVIEW BAR ─── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Unlocked Credentials: <strong>{unlockedCount} of {totalMedals}</strong></span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{progressPercent}% Unlocked</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden p-0.5 border border-white/5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-500 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ─── SEARCH & FILTER TABS ─── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medals, gavel, crisis, journalism, escrow..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                activeCategory === 'ALL' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({ALL_MEDALS.length})
            </button>
            <button
              onClick={() => setActiveCategory('DIPLOMACY')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                activeCategory === 'DIPLOMACY' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Diplomacy (10)
            </button>
            <button
              onClick={() => setActiveCategory('EDITORIAL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                activeCategory === 'EDITORIAL' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Editorial (5)
            </button>
            <button
              onClick={() => setActiveCategory('SOLUTIONS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                activeCategory === 'SOLUTIONS' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Solutions (4)
            </button>
            <button
              onClick={() => setActiveCategory('IMPACT')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                activeCategory === 'IMPACT' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Impact (4)
            </button>
            <button
              onClick={() => setActiveCategory('GOVERNANCE')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                activeCategory === 'GOVERNANCE' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Governance (5)
            </button>
          </div>
        </div>

        {/* ─── MEDAL CARDS GRID ─── */}
        <div className="overflow-y-auto max-h-[50vh] pr-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredMedals.map((medal) => {
              return (
                <div
                  key={medal.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between space-y-3 ${
                    medal.isUnlocked
                      ? 'bg-zinc-950/90 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                      : 'bg-zinc-950/40 border-zinc-800/80 opacity-80 hover:opacity-100 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-2">
                    
                    {/* Top Status + Rarity Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{medal.icon}</span>
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold uppercase tracking-wider ${getRarityBadge(medal.rarity)}`}>
                          {medal.rarity}
                        </span>
                      </div>

                      {medal.isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-[9px] font-bold flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3 text-zinc-500" />
                          LOCKED
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>{medal.title}</span>
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                        {medal.description}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    {medal.progressText && (
                      <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                        <span>Status:</span>
                        <span className={medal.isUnlocked ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                          {medal.progressText}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* How to Earn Pathway / Action CTA */}
                  <div className="pt-3 border-t border-zinc-900 space-y-2">
                    {!medal.isUnlocked ? (
                      <div className="space-y-2">
                        <div className="text-[11px] text-amber-300/90 leading-tight flex items-start gap-1.5 bg-amber-500/5 p-2 rounded-xl border border-amber-500/15">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong>How to Earn:</strong> {medal.howToEarn}</span>
                        </div>

                        {medal.actionLink && (
                          <Link href={medal.actionLink} onClick={onClose} className="block">
                            <button className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                              <span>{medal.actionLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium pt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Earned &amp; Ratified on Matrix
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── MODAL FOOTER ─── */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Decentralized Sovereign Reputation Layer • 28 Total Medals</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition cursor-pointer"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
