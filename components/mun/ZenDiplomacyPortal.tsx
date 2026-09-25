'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowUpRight,
  ExternalLink, 
  CheckCircle2, 
  Grid,
  Scale, 
  BookOpen, 
  Award, 
  Video, 
  Clock, 
  Download, 
  FileText, 
  Copy, 
  Check, 
  AlertCircle, 
  Flame, 
  Globe2, 
  HelpCircle,
  GraduationCap,
  MessageSquare,
  Landmark,
  Share2,
  BellRing,
  Loader2,
  Search,
  Send,
  UserCheck
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { broadcastActivitySync, subscribeToActivitySync } from '@/lib/reactiveActivityHub';
import { ZenDiplomacyCover } from '@/components/mun/ZenDiplomacyCover';
import { PortfolioMatrixView } from '@/components/mun/PortfolioMatrixView';
import {
  registerDelegate,
  allocatePortfolioAndNotify,
  getStoredRegistrations,
  DelegateRegistration,
  DEFAULT_MATRIX_URL
} from '@/lib/zenDiplomacyService';

// Default Google Sheet for Portfolio Matrix
const DEFAULT_MATRIX_SHEET_URL = DEFAULT_MATRIX_URL;
const LS_MATRIX_URL = 'zenvitra_zendiplomacy_matrix_url';
const LS_REGISTRATIONS = 'zenvitra_zendiplomacy_registrations_v1';

export function ZenDiplomacyPortal() {
  const { user, profile, isAuthenticated } = useAuth();
  const [matrixUrl, setMatrixUrl] = useState<string>(DEFAULT_MATRIX_SHEET_URL);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMatrix, setCopiedMatrix] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedCommitteeModal, setSelectedCommitteeModal] = useState<string | null>(null);

  // Delegate Allocation Status Checker State
  const [searchEmail, setSearchEmail] = useState('');
  const [checkedResult, setCheckedResult] = useState<DelegateRegistration | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Secretariat Allocation Console State
  const [allRegistrations, setAllRegistrations] = useState<DelegateRegistration[]>([]);
  const [allocEmail, setAllocEmail] = useState('');
  const [allocName, setAllocName] = useState('');
  const [allocCommittee, setAllocCommittee] = useState('AIPPM');
  const [allocPortfolio, setAllocPortfolio] = useState('');
  const [allocNotes, setAllocNotes] = useState('');
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocationSuccessMsg, setAllocationSuccessMsg] = useState<string | null>(null);
  const [isSecretariatExpanded, setIsSecretariatExpanded] = useState(false);

  // Workshop notification state
  const [workshopEmail, setWorkshopEmail] = useState('');
  const [workshopNotified, setWorkshopNotified] = useState(false);

  // Load dynamic matrix url if overridden
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_MATRIX_URL);
      if (stored && stored.trim().startsWith('http')) {
        setMatrixUrl(stored.trim());
      }
    } catch {}
  }, []);


  // Countdown to October 24, 2026, 09:00 AM IST
  const targetDate = useMemo(() => new Date('2026-10-24T09:00:00+05:30').getTime(), []);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleCopyPortalLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyMatrixLink = () => {
    navigator.clipboard.writeText(matrixUrl);
    setCopiedMatrix(true);
    setTimeout(() => setCopiedMatrix(false), 2000);
  };

  // Load initial registrations & keep in sync
  const refreshAllocations = () => {
    const list = getStoredRegistrations();
    setAllRegistrations(list);
  };

  useEffect(() => {
    refreshAllocations();
    const unsub = subscribeToActivitySync(() => {
      refreshAllocations();
    });
    return () => unsub();
  }, []);

  const handleCheckAllocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = (searchEmail || user?.email || profile?.email || '').trim().toLowerCase();
    if (!query) return;
    const list = getStoredRegistrations();
    const found = list.find((r) => r.email.toLowerCase() === query);
    setCheckedResult(found || null);
    setHasSearched(true);
  };

  const handleAllocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocEmail.trim() || !allocPortfolio.trim()) return;
    setIsAllocating(true);
    setAllocationSuccessMsg(null);

    try {
      const updated = await allocatePortfolioAndNotify({
        email: allocEmail.trim(),
        name: allocName.trim() || undefined,
        committee: allocCommittee,
        portfolio: allocPortfolio.trim(),
        allottedBy: 'Executive Secretariat (@yuveer)',
        notes: allocNotes.trim() || undefined,
      });

      refreshAllocations();
      if ((searchEmail || '').trim().toLowerCase() === allocEmail.trim().toLowerCase()) {
        setCheckedResult(updated);
        setHasSearched(true);
      }

      setAllocationSuccessMsg(
        `✓ Success: Portfolio "${allocPortfolio}" in ${allocCommittee} has been officially allocated to ${allocEmail}. Recorded on Sovereign Assembly Matrix and urgent notification dispatched!`
      );
      setAllocPortfolio('');
      setAllocNotes('');
    } catch (err) {
      console.error('Allocation error:', err);
    } finally {
      setIsAllocating(false);
    }
  };

  const handleWorkshopSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopEmail.trim()) return;
    setWorkshopNotified(true);
    setTimeout(() => setWorkshopNotified(false), 5000);
    setWorkshopEmail('');
  };

  const committees = [
    {
      id: 'aippm',
      code: 'AIPPM',
      title: 'All India Political Parties Meet',
      subtitle: 'National Parliamentary Council',
      badge: 'HISTORIC & POLICY COUNCIL',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      agenda: 'REVEALING SOON',
      agendaDescription: 'Comprehensive national deliberations covering inter-state governance, electoral integrity, and federal policy consensus with active legislative bill tabling.',
      format: 'Moderated Parliamentary Debate & Bi-cameral Motions',
      portfolios: 'Union Ministers, Opposition Leaders, State Representatives, Independent MPs',
      delegates: 'Single Delegation • Limited Portfolios'
    },
    {
      id: 'education-ministry',
      code: 'EDU.MINISTRY',
      title: 'Education Ministry of India',
      subtitle: 'Special Ministerial Assembly',
      badge: 'MINISTERIAL OVERSIGHT',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      agenda: 'REVEALING SOON',
      agendaDescription: 'Special ministerial panel addressing systemic examination integrity, paper-leak prevention frameworks, digital curriculum equity, and direct public school modernization capital.',
      format: 'Sovereign Ministerial Council & Direct Policy Blueprints',
      portfolios: 'Ministry Officials, State Education Secretaries, Academic Chancellors, Student Stakeholders',
      delegates: 'Single Delegation • Priority Allotment'
    },
    {
      id: 'unesco',
      code: 'UNESCO',
      title: 'United Nations Educational, Scientific and Cultural Organization',
      subtitle: 'Specialized UN Agency',
      badge: 'MULTILATERAL PLENARY',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      agenda: 'REVEALING SOON',
      agendaDescription: 'International consensus building around preserving cultural heritage in conflict zones, establishing universal ethics for AI in education, and open-source scientific knowledge sharing.',
      format: 'UNGA Rules of Procedure (ROP) & Draft Resolution Tabling',
      portfolios: 'UN Member States & Specialized Observer Delegations',
      delegates: 'Single / Double Delegation Supported'
    },
    {
      id: 'unsc',
      code: 'UNSC',
      title: 'United Nations Security Council',
      subtitle: 'Flagship Crisis & Security Body',
      badge: 'CRISIS & SECURITY COUNCIL',
      badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      agenda: 'REVEALING SOON',
      agendaDescription: 'High-urgency diplomatic assembly addressing international security breaches, territorial sovereignty disputes, non-proliferation treaties, and binding international directives.',
      format: 'Continuous Crisis Procedure (CCP) & Presidential Directives',
      portfolios: 'P5 Permanent Members + 10 Elected Non-Permanent Members',
      delegates: 'Single Delegation • High-Experience Tier'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030407] text-neutral-200 font-sans selection:bg-cyan-500/30 flex flex-col justify-between pt-20 sm:pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-16 text-left">
        
        {/* ── 1. OFFICIAL HERO BANNER SECTION ── */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.9)] bg-black">
          {/* Official Vector Code Recreated Banner */}
          <div className="relative w-full overflow-hidden bg-black">
            <ZenDiplomacyCover variant="hero" showBadge={false} interactive={true} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030407] via-black/25 to-transparent pointer-events-none" />
          </div>

          {/* Hero Header Content Overlay */}
          <div className="relative p-6 sm:p-10 -mt-16 sm:-mt-24 z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-cyan-400" />
                OFFICIAL ONLINE MUN
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-200 border border-white/15 text-xs font-mono tracking-wider uppercase">
                OCTOBER 24TH &amp; 25TH, 2026
              </span>
              <span className="px-3 py-1 rounded-full bg-[#e2f952]/15 text-[#e2f952] border border-[#e2f952]/40 text-xs font-mono font-bold tracking-wider uppercase inline-flex items-center gap-1.5 animate-pulse shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#e2f952]" />
                DEL REGISTRATIONS GO LIVE: 1ST OCTOBER ONWARDS
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-sm">
                COLLEGE &amp; SCHOOL DELEGATIONS AVAILABLE
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img 
                    src="/assets/logo.png" 
                    alt="ZENVITRA Logo" 
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] shrink-0"
                  />
                  <img 
                    src="/assets/brochure/zenvitra-seal.png" 
                    alt="ZENVITRA Official Seal" 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#e2f952]/40 shadow-[0_0_25px_rgba(226,249,82,0.2)] shrink-0 object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#e2f952] uppercase font-bold">ZENVITRA FOUNDATION // SOVEREIGN SEAL</span>
                    <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-none uppercase">
                      ZEN.DIPLOMACY <span className="text-neutral-400 font-light">MUN 2026</span>
                    </h1>
                  </div>
                </div>
                <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                  The sovereign virtual Model United Nations and parliamentary assembly convening young thinkers, delegates, and policy researchers across the globe. Online participation makes school and college students participation easier everywhere; itinerary tells the rest. Live collaborative resolution authoring on <strong className="text-white">ZEN.DOCS</strong>.
                </p>
              </div>

              {/* Action Buttons Stack */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/forms/zen-diplomacy-2026"
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Register as Delegate</span>
                </Link>

                <Link
                  href="/zen-diplomacy/secretariat"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer hover:scale-105"
                  title="Apply for Secretariat across 10 specialized departments"
                >
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span>Join Secretariat</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>

                <Link
                  href="/matrix"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer hover:scale-105"
                  title="Open live Interactive Portfolio Matrix"
                >
                  <Grid className="w-4 h-4 text-emerald-400" />
                  <span>Live Portfolio Matrix</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>

                <Link
                  href="/zen-diplomacy/brochure"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer hover:scale-105"
                  title="View official ZEN.DIPLOMACY Brochure & Prospectus"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Official Brochure</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleCopyPortalLink}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                  title="Share Event Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Metadata Bar & Countdown Timer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Assembly Dates
                </span>
                <p className="font-bold text-white text-sm">October 24 &amp; 25, 2026</p>
                <p className="text-[11px] text-neutral-400">Two Days &bull; 09:00 – 19:00 IST</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  Host Platform
                </span>
                <p className="font-bold text-white text-sm">Online &bull; Virtual Chambers</p>
                <Link href="/call" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
                  <span>ZEN.CALL + Zenvitra Dais</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Organizer &amp; Host
                </span>
                <Link href="/pulse?user=yuveer" className="font-bold text-white text-sm hover:text-cyan-300 transition flex items-center gap-1">
                  <span>Yuveer</span>
                  <span className="text-[10px] text-cyan-400 font-mono">(@yuveer)</span>
                </Link>
                <p className="text-[11px] text-neutral-400">Organizer ID: <strong className="text-white">yuveer</strong></p>
              </div>

              {/* Countdown Tile */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-black to-purple-950/30 border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Assembly Countdown
                </span>
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <span>{timeLeft.days}d</span>
                  <span className="text-neutral-500">:</span>
                  <span>{timeLeft.hours}h</span>
                  <span className="text-neutral-500">:</span>
                  <span>{timeLeft.minutes}m</span>
                  <span className="text-neutral-500">:</span>
                  <span>{timeLeft.seconds}s</span>
                </div>
                <p className="text-[10px] text-cyan-400/80 font-mono">Gavel drops 24 Oct 09:00 IST</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. IN-APP INTERACTIVE PORTFOLIO MATRIX & ALLOTMENT TRACKER ── */}
        <section id="matrix" className="space-y-6">
          <PortfolioMatrixView 
            onSelectPortfolio={(portfolioTitle, committee) => {
              window.location.href = `/forms/zen-diplomacy-2026?committee=${committee}&portfolio=${encodeURIComponent(portfolioTitle)}`;
            }} 
          />

          {/* Additional Delegate Status Lookup Container */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0c1424] via-[#080d1a] to-[#0d1627] border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-6">

          {/* ── 2.A: INTERACTIVE DELEGATE ALLOCATION STATUS CHECKER ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-white font-display font-bold text-lg flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Delegate Portfolio Status &amp; Live Verification</span>
                </h3>
                <p className="text-xs text-neutral-400 font-sans">
                  Query your registered email address to check your allotted committee, portfolio, and sovereign allotment status.
                </p>
              </div>

              {isAuthenticated && (user?.email || profile?.email) && (
                <button
                  type="button"
                  onClick={() => {
                    const myEmail = user?.email || profile?.email || '';
                    setSearchEmail(myEmail);
                    const list = getStoredRegistrations();
                    const found = list.find((r) => r.email.toLowerCase() === myEmail.toLowerCase());
                    setCheckedResult(found || null);
                    setHasSearched(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Check My Logged Email ({user?.email || profile?.email})</span>
                </button>
              )}
            </div>

            <form onSubmit={handleCheckAllocation} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter registered delegate email (e.g. delegate@institution.edu)..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Check Allocation Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Status Results Display */}
            {hasSearched && (
              <div className="mt-4 transition-all duration-300">
                {checkedResult ? (
                  checkedResult.status === 'ALLOCATED' ? (
                    <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold tracking-wider uppercase">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>OFFICIALLY ALLOCATED &amp; RATIFIED</span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                          ID: <span className="text-white">{checkedResult.id}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-mono text-xs">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Allocated Portfolio</span>
                          <p className="text-base font-bold text-emerald-300 font-display">{checkedResult.allocatedPortfolio}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Committee Chamber</span>
                          <p className="text-base font-bold text-white">{checkedResult.allocatedCommittee}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Secretariat Authority</span>
                          <p className="text-sm font-semibold text-cyan-300">{checkedResult.allottedBy || 'Executive Secretariat (@yuveer)'}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Assembly Ledger Sync</span>
                          <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Synchronized &amp; Ratified</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-300 border-t border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <BellRing className="w-4 h-4 text-emerald-400 animate-pulse" />
                          <span>Notification dispatched to your bell with urgent priority.</span>
                        </div>
                        <Link
                          href="/matrix"
                          className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition flex items-center gap-1.5"
                        >
                          <Grid className="w-3.5 h-3.5" />
                          <span>Verify in Portfolio Matrix</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-amber-950/25 border border-amber-500/30 space-y-3 font-mono text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>APPLICATION LOGGED &bull; UNDER SECRETARIAT REVIEW</span>
                        </div>
                        <span className="text-neutral-400">Delegate: <strong className="text-white">{checkedResult.name}</strong> ({checkedResult.email})</span>
                      </div>
                      <p className="text-neutral-300 text-xs font-sans leading-relaxed">
                        Your application is logged. The Secretariat is matching your committee preferences (<strong className="text-white">{checkedResult.firstCommitteeChoice}</strong> / <strong className="text-white">{checkedResult.secondCommitteeChoice}</strong>) against the live vacancy ledger.
                      </p>
                      <p className="text-amber-300/90 text-[11px] flex items-center gap-2 pt-1 border-t border-amber-500/20">
                        <BellRing className="w-3.5 h-3.5 text-amber-400" />
                        <span>The moment your seat is assigned, the Assembly Matrix will update live and you will receive a real-time notification in your notification bell.</span>
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-neutral-400 shrink-0" />
                      <div>
                        <p className="text-white font-bold">No Application Found for &quot;{searchEmail}&quot;</p>
                        <p className="text-neutral-400 text-[11px]">You can register immediately to claim your committee seat.</p>
                      </div>
                    </div>
                    <Link
                      href="/forms/zen-diplomacy-2026"
                      className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold uppercase tracking-wider transition cursor-pointer shrink-0"
                    >
                      Register Now &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 2.B: EXECUTIVE SECRETARIAT ALLOTMENT CONSOLE (@yuveer) ── */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsSecretariatExpanded(!isSecretariatExpanded)}
                className="inline-flex items-center gap-2 text-left text-neutral-300 hover:text-white transition cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-white flex items-center gap-2">
                    <span>Executive Secretariat Allotment Console</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono text-[10px]">@yuveer</span>
                  </span>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    {isSecretariatExpanded ? 'Click to collapse Secretariat tools' : 'Assign portfolios, push ledger updates & fire real-time notifications'}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-400">
                  {allRegistrations.length} Applicant{allRegistrations.length === 1 ? '' : 's'} Total
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {allRegistrations.filter(r => r.status === 'ALLOCATED').length} Allocated
                </span>
              </div>
            </div>

            {isSecretariatExpanded && (
              <div className="p-6 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-Time Allotment &amp; Dais Ledger Ratification</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-sans">
                    Assigning a portfolio updates the sovereign ledger, updates the Assembly Matrix, and sends an instantaneous high-priority notification to the delegate&apos;s notification bell.
                  </p>
                </div>

                {allocationSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="flex-1">{allocationSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAllocateSubmit} className="space-y-4 font-mono text-xs">
                  {/* Select from existing applicants or enter manually */}
                  {allRegistrations.length > 0 && (
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
                        Quick-Select Registered Delegate:
                      </label>
                      <select
                        onChange={(e) => {
                          const selected = allRegistrations.find(r => r.email === e.target.value);
                          if (selected) {
                            setAllocEmail(selected.email);
                            setAllocName(selected.name);
                            setAllocCommittee(selected.firstCommitteeChoice || 'AIPPM');
                            if (selected.allocatedPortfolio) {
                              setAllocPortfolio(selected.allocatedPortfolio);
                            }
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101a] border border-white/15 text-white focus:outline-none focus:border-cyan-400 transition"
                      >
                        <option value="">-- Choose from {allRegistrations.length} registered delegates --</option>
                        {allRegistrations.map((reg) => (
                          <option key={reg.id} value={reg.email}>
                            {reg.name} &bull; {reg.email} [{reg.status}] ({reg.firstCommitteeChoice} / {reg.secondCommitteeChoice})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Delegate Email *</label>
                      <input
                        type="email"
                        required
                        value={allocEmail}
                        onChange={(e) => setAllocEmail(e.target.value)}
                        placeholder="delegate@institution.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Delegate Name</label>
                      <input
                        type="text"
                        value={allocName}
                        onChange={(e) => setAllocName(e.target.value)}
                        placeholder="Full Delegate Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Committee Assignment *</label>
                      <select
                        value={allocCommittee}
                        onChange={(e) => setAllocCommittee(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101a] border border-white/15 text-white focus:outline-none focus:border-cyan-400 transition"
                      >
                        <option value="AIPPM">AIPPM (All India Political Parties Meet)</option>
                        <option value="EDU.MINISTRY">Education Ministry of India</option>
                        <option value="UNESCO">UNESCO (Plenary)</option>
                        <option value="UNSC">UNSC (Security Council)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Allocated Portfolio / Country *</label>
                      <input
                        type="text"
                        required
                        value={allocPortfolio}
                        onChange={(e) => setAllocPortfolio(e.target.value)}
                        placeholder="e.g. Prime Minister Narendra Modi / Delegate of USA / Union Secretary"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Secretariat Directives / Allocation Notes</label>
                    <input
                      type="text"
                      value={allocNotes}
                      onChange={(e) => setAllocNotes(e.target.value)}
                      placeholder="Optional notes or guidelines for the delegate..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500">
                      Authorized as: <strong className="text-cyan-400">Executive Secretariat (@yuveer)</strong>
                    </span>
                    <button
                      type="submit"
                      disabled={isAllocating}
                      className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isAllocating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Ratifying Allotment &amp; Notifying...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-black" />
                          <span>Allocate, Ratify Allotment &amp; Notify Delegate</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          </div>
        </section>

        {/* ── 3. FOUR COMMITTEE CARDS SECTION ── */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-bold">
                DIPLOMATIC CHAMBERS
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight">
                Committees &amp; Agendas
              </h2>
            </div>
            <p className="text-xs font-mono text-neutral-400 max-w-sm">
              Agendas across all 4 committees are finalized by the executive board and revealing very soon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map((comm) => (
              <div
                key={comm.id}
                className="rounded-3xl p-6 sm:p-8 bg-[#090c14] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group hover:-translate-y-1"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${comm.badgeColor}`}>
                      {comm.badge}
                    </span>
                    <span className="font-mono text-xs text-neutral-500 uppercase font-bold">
                      {comm.code}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                      {comm.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      {comm.subtitle} &bull; {comm.format}
                    </p>
                  </div>

                  {/* Agenda Revealing Soon Banner */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        AGENDA: {comm.agenda}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-amber-400/80">
                        Stay Tuned
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans font-light">
                      {comm.agendaDescription}
                    </p>
                  </div>

                  {/* Portfolios & Format breakdown */}
                  <div className="space-y-2 pt-2 text-xs font-mono text-neutral-400">
                    <div>
                      <span className="text-neutral-500 block uppercase text-[10px] tracking-wider">Eligible Portfolios</span>
                      <span className="text-neutral-200 font-sans text-xs">{comm.portfolios}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase text-[10px] tracking-wider">Delegation Rules</span>
                      <span className="text-cyan-300 text-xs">{comm.delegates}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <Link
                    href="/matrix"
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Check Available Portfolios &rarr;</span>
                  </Link>

                  <Link
                    href={`/forms/zen-diplomacy-2026?committee=${comm.code}`}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition cursor-pointer inline-flex items-center gap-1"
                  >
                    Apply for {comm.code} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. WHAT WE WILL GAIN (DELEGATE VALUE ACCREDITATION) ── */}
        <section className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#0c0d16] via-black to-[#0a101b] border border-white/10 space-y-10 text-left">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-bold">
              DELEGATE TAKEAWAYS &amp; MERIT
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              What You Will Gain From ZEN.DIPLOMACY
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              Beyond traditional trophies—Zenvitra embeds your achievements directly into immutable civic archives and accredited credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Cryptographic Certificate</h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed font-light">
                Official Certificate of Merit / Participation with QR verification endorsed by Zenvitra and the Secretariat for your college &amp; career CV.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Resolution Publication</h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed font-light">
                Passed draft resolutions &amp; working papers are preserved in the public <strong className="text-white">ZEN.SOLUTIONS</strong> vault with your authorship recorded.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Executive Accreditations</h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed font-light">
                Best Delegate, High Commendation, Special Mention, and Best Delegation awards with formal letters of recommendation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Sovereign Youth Network</h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed font-light">
                Direct entry into Zenvitra&apos;s diplomatic youth network connecting national debaters, collegiate chairs, and policy advocates.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. HOW IT WILL BE HOSTED (VIRTUAL INFRASTRUCTURE) ── */}
        <section className="rounded-3xl p-8 sm:p-12 bg-[#080a10] border border-white/10 space-y-8 text-left">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-[10px] text-purple-400 uppercase tracking-[0.3em] font-bold">
              VIRTUAL OS INFRASTRUCTURE
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              How ZEN.DIPLOMACY Will Be Hosted
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We eliminate chaotic third-party links with a unified, state-of-the-art virtual Model UN operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold">01</div>
              <h4 className="font-display font-bold text-base text-white">Sovereign Dais Suite</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Dual-screen dais console with live caucus countdown timers, GSL speakers queue, and automated gavel controls.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">02</div>
              <h4 className="font-display font-bold text-base text-white">ZEN.CALL Virtual Chambers</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Dedicated high-bandwidth encrypted video and audio caucusing chambers natively hosted on ZEN.CALL with live dais integration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono text-xs font-bold">03</div>
              <h4 className="font-display font-bold text-base text-white">Live ZEN.DOCS Drafting</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Co-author working papers, operative clauses, and amendments in real time without version collisions or lost files.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-xs font-bold">04</div>
              <h4 className="font-display font-bold text-base text-white">Audited Roll Call &amp; Voting</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                One-tap quorum verification, Present &amp; Voting roll calls, and transparent substantive resolution voting.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. PRE-CONFERENCE WORKSHOP UPDATES (COMING SOON) ── */}
        <section className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#17122a] via-[#0e0c1a] to-[#17122a] border border-purple-500/30 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-mono font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>Pre-Conference Training</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Delegate Training Workshop &bull; Updates Coming Soon
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                Prior to Day 1, the Secretariat will host an intensive orientation masterclass covering Rules of Procedure (ROP), foreign policy citation standards, bilateral lobbying tactics, and draft resolution composition.
              </p>
            </div>

            {/* Notification Subscription Box */}
            <div className="w-full lg:w-96 p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-purple-400" />
                Get Notified on Workshop Release
              </span>

              {workshopNotified ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>You are on the priority workshop notification list!</span>
                </div>
              ) : (
                <form onSubmit={handleWorkshopSubscribe} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={workshopEmail}
                    onChange={(e) => setWorkshopEmail(e.target.value)}
                    placeholder="Enter your email for dates & schedule..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition font-mono"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-mono text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
                  >
                    Subscribe for Workshop Alert
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ── 7. OFFICIAL GUIDELINES & CODE OF CONDUCT ── */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-[0.3em] font-bold">
              CONFERENCE PROTOCOL
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Official Guidelines &amp; Code of Conduct
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
            <div className="p-6 rounded-3xl bg-[#090b12] border border-white/10 space-y-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>1. Rules of Procedure (ROP)</span>
              </h3>
              <p className="text-neutral-400 leading-relaxed font-light">
                Deliberations strictly follow conventional Parliamentary and UN General Assembly debate formats. Moderated caucuses require recognized speaker slips; unmoderated caucuses facilitate informal bilateral lobbying.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#090b12] border border-white/10 space-y-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2. Decorum &amp; Speaking Etiquette</span>
              </h3>
              <p className="text-neutral-400 leading-relaxed font-light">
                Diplomacy demands absolute mutual respect. Third-person pronouns are compulsory in international committees. Webcams must remain turned on during all formal recognized speeches.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#090b12] border border-white/10 space-y-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>3. Academic Integrity &amp; Research</span>
              </h3>
              <p className="text-neutral-400 leading-relaxed font-light">
                Pre-written resolutions or uncredited AI generated content are strictly prohibited. All draft resolutions must be collaboratively authored inside committee sessions on ZEN.DOCS.
              </p>
            </div>
          </div>
        </section>

        {/* ── 8. ORGANIZER ACCOUNTABILITY HERO CARD ── */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-[#0d101a] via-black to-[#0d101a] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-0.5 shrink-0 shadow-lg">
              <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center font-display font-bold text-lg text-white">
                Y
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-lg text-white">Hosted by Yuveer</h4>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono text-[10px] font-bold">
                  VERIFIED ORGANIZER
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Organizer ID: <strong className="text-white">yuveer</strong> &bull; Sovereign Platform Lead &bull; Real Raw Data Policy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pulse?user=yuveer"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-semibold transition flex items-center gap-2"
            >
              <span>View Organizer Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/forms/zen-diplomacy-2026"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-md inline-block cursor-pointer"
            >
              Register as Delegate &rarr;
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default ZenDiplomacyPortal;
