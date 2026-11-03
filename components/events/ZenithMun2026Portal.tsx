'use client';

import React, { useState, useEffect } from 'react';
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
  Scale, 
  BookOpen, 
  Award, 
  Clock, 
  FileText, 
  Copy, 
  Check, 
  Flame, 
  Globe2, 
  GraduationCap, 
  Share2, 
  Building2,
  Briefcase,
  HelpCircle,
  Radio,
  FileCheck2,
  SlidersHorizontal,
  ChevronRight,
  Grid,
  Ticket,
  Gift,
  Trophy,
  Hotel,
  Coins,
  HeartHandshake,
  Star,
  Layers
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { ZenithApplicationStatusModal } from './ZenithApplicationStatusModal';

export function ZenithMun2026Portal() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'secretariat' | 'perks' | 'committees' | 'venue'>('overview');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('check_status') === 'true' || params.get('status') === 'true') {
        setShowStatusModal(true);
      }
    }
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;
    setWaitlistSubmitted(true);
    setTimeout(() => {
      setWaitlistEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-white flex flex-col justify-between font-sans text-left selection:bg-amber-500/20">
      <Navbar />

      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[450px] bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/5 blur-[180px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 flex-1">
        
        {/* Top Breadcrumb & Share Navigation */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition"
          >
            <span>&larr;</span>
            <span>All Gatherings &amp; Summits</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>OFFLINE SUMMIT • UDAIPUR • REGISTRATION OPENING SOON</span>
            </span>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* ── HERO BANNER: ROYAL UDAIPUR SUMMIT ── */}
        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-white/[0.04] via-[#090c14] to-[#04060a] border border-amber-500/30 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(245,158,11,0.1)] space-y-8">
          
          {/* Official Zenith MUN 2026 Poster Artwork */}
          <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative group">
            <img
              src="/images/events/zenith-mun-2026-poster.png"
              alt="ZENITH MODEL UNITED NATIONS 2026 Official Banner"
              className="w-full h-auto object-cover max-h-[420px] transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 right-4 font-mono text-[10px] text-amber-300/80 bg-black/70 px-2.5 py-1 rounded-full border border-amber-500/30">
              OFFICIAL SUMMIT POSTER &bull; UDAIPUR
            </div>
          </div>

          {/* Subtle Graphic Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>A NEW ZEN BEGINS.</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs uppercase tracking-wider">
              PRESENTED BY ZENVITRA | BY YOUTH. FOR YOUTH.
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.08] uppercase">
              ZENITH MODEL UNITED NATIONS <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">2026</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 font-sans font-light leading-relaxed max-w-3xl">
              An uncompromised offline diplomatic assembly convening in the historic royal city of <strong className="text-white font-medium">Udaipur, Rajasthan</strong>. Bringing together nationwide youth delegates, debaters, and future statesmen for rigorous parliamentary committee chambers and real-time crisis leadership.
            </p>
          </div>

          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Summit Location
              </span>
              <p className="font-bold text-amber-300 text-sm">Coming Soon</p>
              <p className="text-[11px] text-neutral-400">Offline In-Person Assembly</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Convening Timeline
              </span>
              <p className="font-bold text-amber-300 text-sm">Summer 2027</p>
              <p className="text-[11px] text-neutral-400">Dates Announcing Soon (Udaipur)</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Summit Itinerary
              </span>
              <p className="font-bold text-amber-300 text-sm">Itinerary Coming Soon</p>
              <p className="text-[11px] text-neutral-400">Detailed schedule revealing soon</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                Recruitment Status
              </span>
              <p className="font-bold text-emerald-400 text-sm">Secretariat Form Live</p>
              <p className="text-[11px] text-neutral-400">7 Leadership Tracks • Scorecard</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                Delegate Admission
              </span>
              <p className="font-bold text-amber-300 text-sm">Registration Opening Soon</p>
              <p className="text-[11px] text-neutral-400">Delegate Passes &amp; Tiers</p>
            </div>
          </div>

          {/* Primary Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/forms/zenith-secretariat-2026"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 fill-black" />
              <span>Apply for Secretariat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setShowStatusModal(true)}
              className="px-7 py-3.5 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 border border-amber-400/40 hover:border-amber-400/60 font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.15)] flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>See Your Status</span>
            </button>

            <div className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs font-semibold flex items-center gap-2 select-none">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Registration Opening Soon</span>
            </div>

            <a
              href="#secretariat-info"
              onClick={() => setActiveTab('secretariat')}
              className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-mono text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Secretariat Overview</span>
            </a>

            <button
              type="button"
              onClick={() => setActiveTab('perks')}
              className="px-6 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/30 font-mono text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Secretariat Perks</span>
            </button>

            <a
              href="mailto:secretariat@zenvitra.xyz?subject=ZENITH%20MUN%202026%20Inquiry"
              className="px-5 py-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/5 text-neutral-300 hover:text-white border border-white/10 font-mono text-xs transition flex items-center gap-2"
            >
              <span>Contact Secretariat</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none font-sans">
          {[
            { id: 'overview', label: 'Summit Overview & Vision', icon: Sparkles },
            { id: 'secretariat', label: 'Secretariat Application', icon: Crown },
            { id: 'perks', label: 'Secretariat Perks & Awards', icon: Gift },
            { id: 'committees', label: 'Committees (Coming Soon)', icon: Scale },
            { id: 'venue', label: 'Location (Coming Soon)', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                  active
                    ? 'bg-amber-400 text-black shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-black' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: OVERVIEW & VISION ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Vision Statement */}
              <div className="lg:col-span-7 space-y-6">
                <SpotlightCard className="p-6 sm:p-8 rounded-3xl bg-[#080b12] border border-white/10 space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>THE ZENITH ETHOS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight uppercase">
                    By Youth. For Youth. A New Zen Begins.
                  </h2>
                  <p className="text-sm text-neutral-300 font-light leading-relaxed">
                    ZENITH MUN 2026 is built on the belief that student diplomacy should not be confined to superficial speeches or pre-scripted resolutions. We are gathering committed young thinkers in the heart of Udaipur to tackle real geopolitical crises, pass binding treaties, and forge lifelong intellectual networks.
                  </p>
                  <p className="text-sm text-neutral-300 font-light leading-relaxed">
                    Powered by ZENVITRA&apos;s digital Dais OS, acoustic gavel synthesizers, and verified diplomatic CV passports, Zenith MUN bridges classical procedural tradition with modern civic technology.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-bold">Offline Experience</strong>
                        <span className="text-neutral-400 text-[11px]">2-day physical deliberations in scenic Udaipur</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-bold">10 Leadership Wings</strong>
                        <span className="text-neutral-400 text-[11px]">Comprehensive operational secretarial departments</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-bold">Verified Recognition</strong>
                        <span className="text-neutral-400 text-[11px]">Permanent accolades on ZENVITRA Diplomatic Passport</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-bold">Crisis War Rooms</strong>
                        <span className="text-neutral-400 text-[11px]">Rapid incursion directives &amp; breaking press wire</span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>

                {/* Priority Dates Notification Box */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-transparent to-cyan-500/5 border border-amber-500/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                      Registration Opening Soon &bull; Priority Waitlist
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Be the first to receive confirmed summit dates, venue coordinates, and early-bird delegate allocations when calendar dates lock.
                  </p>
                  
                  {waitlistSubmitted ? (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Thank you! You are enrolled in the Zenith MUN 2026 priority notification list.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition shrink-0 cursor-pointer"
                      >
                        Notify Me
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column: Secretariat Callout Spotlight */}
              <div className="lg:col-span-5 space-y-6" id="secretariat-info">
                <div className="rounded-3xl bg-gradient-to-b from-[#10141f] via-[#090c14] to-[#04060a] border border-amber-500/30 p-6 sm:p-7 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      <Crown className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">
                      NOW ACCEPTING APPLICATIONS
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display text-white tracking-tight uppercase">
                      Secretariat &amp; Executive Board Intake
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed font-light">
                      We are looking for committed, responsible and driven individuals who are ready to contribute to building a meaningful conference.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-mono">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                      Application Highlights:
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-neutral-300">
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>7 Specialized Operational Wings &amp; Leadership Tracks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>100% Objective Selection Scorecard Evaluation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>Practical Assessments &amp; Work Sample Verification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>Direct Online Submission via Official ZenForms</span>
                      </li>
                    </ul>
                  </div>

                  <Link
                    href="/forms/zenith-secretariat-2026"
                    className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                  >
                    <span>Open Secretariat Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-[10px] text-neutral-500 text-center font-mono">
                    Direct form URL: /forms/zenith-secretariat-2026
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 2: SECRETARIAT QUESTIONS BREAKDOWN ── */}
        {activeTab === 'secretariat' && (
          <div className="space-y-8 text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080b12] border border-amber-500/25 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Crown className="w-3.5 h-3.5" />
                    <span>OFFICIAL APPLICATION &amp; EVALUATION FRAMEWORK</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                    Secretariat Intake &amp; Evaluation Scorecard
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Below is the official 100% evaluation rubric and merit framework for the ZENITH MUN 2026 Secretariat.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(true)}
                    className="px-5 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-display font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>See Your Status</span>
                  </button>

                  <Link
                    href="/forms/zenith-secretariat-2026"
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Launch Live Form</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* ── FLAGSHIP RECOGNITION CALLOUT: ₹5,000 CASH PRIZE ── */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-black to-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-black shrink-0 font-black shadow-lg shadow-amber-500/20">
                    <Trophy className="w-6 h-6 fill-black" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                        FLAGSHIP SECRETARIAT RECOGNITION
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
                        ₹5,000 Cash Prize
                      </span>
                    </div>
                    <h3 className="text-white font-display font-bold text-base sm:text-lg uppercase tracking-tight">
                      Best Secretariat Member Award &bull; Zenith MUN 2026
                    </h3>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-2xl">
                      Awarded to the Secretariat member demonstrating exceptional dedication, leadership, execution, coordination, and overall contribution. Decided via a transparent 100% performance rubric rather than designation or seniority.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('perks')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 border border-amber-500/20 font-mono text-xs font-semibold transition shrink-0 self-start sm:self-center cursor-pointer"
                >
                  Explore All Perks &rarr;
                </button>
              </div>

              {/* ── 1. OFFICIAL SELECTION SCORECARD (100% EVALUATION RUBRIC) ── */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-black to-[#0a0d17] border border-amber-500/30 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold block">
                      RECRUITMENT PRINCIPLE
                    </span>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight uppercase">
                      The ZENITH Selection Scorecard (100% Merit)
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold">
                    Execution &gt; Designations
                  </span>
                </div>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  We don&apos;t select people purely on the basis of MUN count or impressive past titles. Every candidate is evaluated through a consistent 100-point rubric:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Relevant Experience</span>
                      <strong className="text-white text-xs">Prior conferences &amp; initiatives</strong>
                    </div>
                    <span className="text-base font-bold text-amber-300">15%</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-amber-200 block text-[11px]">Skills &amp; Dept Suitability</span>
                      <strong className="text-white text-xs">Technical / creative alignment</strong>
                    </div>
                    <span className="text-base font-bold text-amber-400">20%</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Motivation &amp; Vision</span>
                      <strong className="text-white text-xs">Specific contributions to Zenith</strong>
                    </div>
                    <span className="text-base font-bold text-amber-300">15%</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-amber-200 block text-[11px]">Situational Judgement</span>
                      <strong className="text-white text-xs">Crisis &amp; teammate dynamics</strong>
                    </div>
                    <span className="text-base font-bold text-amber-400">20%</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-amber-200 block text-[11px]">Commitment &amp; Reliability</span>
                      <strong className="text-white text-xs">Time balance &amp; academic sync</strong>
                    </div>
                    <span className="text-base font-bold text-amber-400">20%</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Communication</span>
                      <strong className="text-white text-xs">Clarity, tone &amp; professionalism</strong>
                    </div>
                    <span className="text-base font-bold text-amber-300">10%</span>
                  </div>
                </div>

                {/* 3 Pillars Banner */}
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-2 text-xs font-sans">
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Three Recruitment Decisions Every Applicant Should Know:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-neutral-300">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <strong className="text-white block font-mono text-[11px]">1. Mandatory Dept Qs</strong>
                      <p className="text-[11px] leading-relaxed">
                        Department-specific execution questions appear dynamically and are required for every candidate.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <strong className="text-white block font-mono text-[11px]">2. Tangible Work Samples</strong>
                      <p className="text-[11px] leading-relaxed">
                        Actual portfolios, code repos, writing samples, or design creatives are required wherever relevant.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <strong className="text-white block font-mono text-[11px]">3. Practical Round</strong>
                      <p className="text-[11px] leading-relaxed">
                        Shortlisted candidates advance to a brief interview or practical task rather than selection solely on paper.
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-amber-300/90 pt-1 italic">
                    &ldquo;ZENITH selects people who can get work done, not simply people who have held impressive titles before.&rdquo;
                  </p>
                </div>
              </div>

              {/* ── 2. ONLINE APPLICATION CTA ── */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-black to-cyan-500/5 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                    ONLINE APPLICATION PORTAL
                  </span>
                  <h4 className="text-lg font-bold font-display text-white tracking-tight uppercase">
                    Ready to Build ZENITH MUN 2026?
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
                    Submit your credentials, select department preferences, and attach your CV via our official 20-question online application portal.
                  </p>
                </div>

                <Link
                  href="/forms/zenith-secretariat-2026"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Crown className="w-4 h-4 fill-black" />
                  <span>Fill Out Application Online</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: SECRETARIAT PERKS, HOSPITALITY & AWARDS FRAMEWORK ── */}
        {activeTab === 'perks' && (
          <div className="space-y-8 text-left">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#080b12] border border-amber-500/25 space-y-8">
              
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>OFFICIAL SECRETARIAT INCENTIVES &bull; POWERED BY ZENVITRA.XYZ</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase">
                      LEADERSHIP DIRECTORATE
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
                    Secretariat Perks, Honors &amp; Leadership Recognition
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-3xl leading-relaxed">
                    Building ZENITH MUN 2026 takes committed, responsible, and driven youth leaders. The individuals architecting this conference deserve tangible recognition, executive hospitality, and career-defining incentives. Explore the complete benefits and awards framework structured exclusively for the Secretariat and Executive Board.
                  </p>
                </div>

                {/* Three Pillars Badge */}
                <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 shrink-0 space-y-1 text-center font-mono">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                    ZENITH LEADERSHIP TRIAD
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 justify-center">
                    <span>Hospitality</span>
                    <span className="text-neutral-500">&bull;</span>
                    <span>Excellence</span>
                    <span className="text-neutral-500">&bull;</span>
                    <span>Recognition</span>
                  </div>
                </div>
              </div>

              {/* ── 1. THREE-TIER BENEFIT STRUCTURE (SECRETARIAT FOCUSED) ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                    Secretariat &amp; Executive Board Benefit Tiers
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
                  {/* Tier 1: General Secretariat */}
                  <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                          TIER 01 &bull; ALL MEMBERS
                        </span>
                        <Crown className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h4 className="text-base font-bold font-display text-white uppercase">
                        General Secretariat
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Conferred upon every inducted Secretariat member across our 7 specialized operating departments.
                      </p>
                      <ul className="space-y-2 text-xs text-neutral-300 font-mono pt-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Official Secretariat Appointment Certificate</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Official Secretariat Executive Kit &amp; Lanyard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Verified leadership designation on Zenvitra Passport</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Official Letter of Appreciation (LOA)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Public profile recognition on conference portal</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-neutral-400">
                      Standard Secretariat induction
                    </div>
                  </div>

                  {/* Tier 2: Outstation Hospitality */}
                  <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-500/30 space-y-4 flex flex-col justify-between shadow-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase">
                          TIER 02 &bull; OUTSTATION FOCUS
                        </span>
                        <Hotel className="w-4 h-4 text-amber-400" />
                      </div>
                      <h4 className="text-base font-bold font-display text-white uppercase">
                        Outstation Secretariat &amp; EB
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Dedicated hospitality arrangements for organizers and chairs traveling to the summit city.
                      </p>
                      <ul className="space-y-2 text-xs text-neutral-300 font-mono pt-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong>Organiser-arranged accommodation</strong> (subject to eligibility)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>Dedicated on-ground logistical concierge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>Summit working meals &amp; high-tea refreshments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>Emergency safety assistance &amp; transit guidance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>All General Secretariat benefits included</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-amber-500/20 text-[11px] font-mono text-amber-300/80">
                      *Travel tickets borne by members
                    </div>
                  </div>

                  {/* Tier 3: Excellence & Merit */}
                  <div className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/30 space-y-4 flex flex-col justify-between shadow-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold uppercase">
                          TIER 03 &bull; MERIT HONORS
                        </span>
                        <Trophy className="w-4 h-4 text-purple-400" />
                      </div>
                      <h4 className="text-base font-bold font-display text-white uppercase">
                        Excellence &amp; Leadership
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Prestigious merit-based recognition honoring extraordinary dedication and operational execution.
                      </p>
                      <ul className="space-y-2 text-xs text-neutral-300 font-mono pt-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span><strong>₹5,000 Cash Prize</strong> (Best Secretariat Member)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>Merit-based Letters of Recommendation (LOR)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>Permanent induction into <strong>Zenith Hall of Fame</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>Best Department Award &amp; Team Trophy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>Zenith Fellowship &amp; National Ambassador pathway</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-purple-500/20 text-[11px] font-mono text-purple-300/80">
                      Strictly performance-evaluated
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 2. FLAGSHIP SECRETARIAT CASH AWARD CARD ── */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-black to-amber-500/5 border border-amber-500/40 space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider">
                        FLAGSHIP SECRETARIAT AWARD
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs">
                        Merit-Based &bull; 100% Performance Rubric
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
                      ₹5,000 Cash Prize
                    </h3>

                    <h4 className="text-base font-bold text-amber-300 font-display uppercase tracking-tight">
                      Best Secretariat Member &ndash; Zenith MUN 2026
                    </h4>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Conferred upon the Secretariat member who demonstrates exemplary dedication, leadership, crisis resolution, execution, and inter-departmental coordination. Decided through transparent performance evaluation rather than designation or seniority.
                    </p>

                    {/* Secondary Secretariat Recognitions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                        &bull; Outstanding Secretariat Member
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                        &bull; Best Department Award
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                        &bull; Excellence in Leadership
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                        &bull; Official LOA &amp; LOR
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      href="/forms/zenith-secretariat-2026"
                      className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Crown className="w-4 h-4 fill-black" />
                      <span>Apply for Secretariat</span>
                    </Link>
                    <span className="text-[10px] font-mono text-neutral-400 text-center">
                      Applications currently reviewed on merit
                    </span>
                  </div>
                </div>
              </div>

              {/* ── 3. FULL SECRETARIAT PERKS GRID (9 CORE PROVISIONS) ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                    Comprehensive Secretariat Perks &amp; Provisions
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Hotel className="w-4 h-4" />
                      <span>Outstation Accommodation</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Arranged or provided by the organisers for eligible outstation Secretariat members and chairs, subject to eligibility criteria and availability.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Gift className="w-4 h-4" />
                      <span>Executive Secretariat Kit</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Official conference apparel, executive stationery, summit notepad, official Secretariat lanyard, badge &amp; leadership dossier.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <FileCheck2 className="w-4 h-4" />
                      <span>Official Appointment Certificate</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Legally recognized Secretariat appointment certificate authenticated digitally with permanent cryptographic verification ID on Zenvitra.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Coins className="w-4 h-4" />
                      <span>₹5,000 Cash Prize Eligibility</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Direct eligibility for the flagship Best Secretariat Member cash award, evaluated on dedication, execution, and team coordination.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-400 font-bold">
                      <Award className="w-4 h-4" />
                      <span>Merit-Based LORs</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Tailored Letters of Recommendation issued by authorized leadership for university admissions, internships, and corporate placements.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Letters of Appreciation (LOA)</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Formal recognition of organizational contribution, crisis handling, and dedicated service to the successful execution of the summit.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold">
                      <Hotel className="w-4 h-4" />
                      <span>Summit Catering &amp; Hospitality</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Complimentary working lunches, high-tea refreshments, and dedicated hospitality coordination during conference operational hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <Globe2 className="w-4 h-4" />
                      <span>Zenith Hall of Fame</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Permanent induction into the online Zenith Merit Registry, highlighting your designated role and leadership impact for posterity.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-neutral-400 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>Travel Support Notice</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] font-sans leading-relaxed">
                      Travel tickets to and from the summit city are to be directly booked and borne by attending Secretariat members and chairs.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── 4. SECRETARIAT & LEADERSHIP RECOGNITION ROSTER ── */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                      HONORS &amp; DISTINCTIONS
                    </span>
                    <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                      Official Secretariat &amp; Leadership Honors Roster
                    </h3>
                  </div>
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 font-mono text-xs">
                  {[
                    { name: 'Best Secretariat Member', badge: '₹5,000 Cash Prize', color: 'text-amber-400 border-amber-400/50 bg-amber-400/10' },
                    { name: 'Best Department Award', badge: 'Team Trophy', color: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/5' },
                    { name: 'Outstanding Secretariat Member', badge: 'Operational Excellence', color: 'text-amber-300 border-amber-500/30' },
                    { name: 'Excellence in Leadership', badge: 'Strategic Impact', color: 'text-purple-300 border-purple-500/30' },
                    { name: 'Best Executive Board Member', badge: 'Dais Excellence', color: 'text-blue-300 border-blue-500/30' },
                    { name: 'Outstanding Crisis Director', badge: 'War Room Mastery', color: 'text-rose-300 border-rose-500/30' },
                    { name: 'Best Tech & Web Innovation', badge: 'Digital Systems', color: 'text-emerald-300 border-emerald-500/30' },
                    { name: 'Best Outreach & PR Lead', badge: 'National Growth', color: 'text-cyan-300 border-cyan-500/30' },
                    { name: 'Best Creative & Visual Design', badge: 'Brand Identity', color: 'text-orange-300 border-orange-500/30' },
                    { name: 'Best Research Director', badge: 'Academic Rigor', color: 'text-amber-300 border-amber-500/30' },
                    { name: 'Outstanding Institution Trophy', badge: 'Delegation Support', color: 'text-emerald-400 border-emerald-400/40' },
                    { name: "Convenor's Special Commendation", badge: 'Distinguished Service', color: 'text-white border-white/20' },
                  ].map((award, i) => (
                    <div key={i} className={`p-3 rounded-xl bg-white/[0.02] border ${award.color} space-y-1`}>
                      <span className="text-[10px] text-neutral-400 block uppercase">{award.badge}</span>
                      <strong className="text-white block text-xs">{award.name}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 5. LOR & LOA FRAMEWORK (SECRETARIAT FOCUSED) ── */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#080d1a] to-[#0a101d] border border-cyan-500/30 space-y-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    CAREER &amp; ACADEMIC ACCREDITATION
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white uppercase tracking-tight">
                    Secretariat Letter of Appreciation (LOA) &amp; Letter of Recommendation (LOR)
                  </h3>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-3xl">
                    One of Zenith&apos;s strongest incentives for student organizers. LORs and LOAs are strictly merit-based and issued by authorized leadership signatories who can genuinely attest to the recipient&apos;s organizational competence, execution speed, and leadership character.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-cyan-400 font-bold block uppercase text-[11px]">Letter of Appreciation (LOA)</span>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Conferred for disciplined execution, team dependability, and outstanding contribution to the conference operations.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
                    <span className="text-amber-400 font-bold block uppercase text-[11px]">Letter of Recommendation (LOR)</span>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Individual evaluation of exceptional leadership, crisis handling, and verified management achievements for higher education and careers.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-purple-400 font-bold block uppercase text-[11px]">Special Recognition Letter</span>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Awarded for breakthrough initiative, unprecedented problem-solving, or exceptional departmental turnaround during the summit.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-emerald-400 font-bold block uppercase text-[11px]">Executive Board LOR</span>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Formal attestation of committee moderation, rules-of-procedure mastery, and diplomatic leadership for EB chairs.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300/90 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Authenticity Protocol:</strong> Zenith LORs are issued by authorized signatories and verifiable through a digital credential hash on Zenvitra. They are never granted as automatic participation handouts.
                  </span>
                </div>
              </div>

              {/* ── 6. DEPARTMENTAL TRACKS OVERVIEW ── */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-base font-bold font-display text-white uppercase tracking-tight">
                      The 7 Secretariat Operating Departments
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">Apply for your primary and secondary preferences</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-amber-400 block uppercase">1. Delegate Affairs &amp; Outreach</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Liaison with nationwide school &amp; university delegations, inquiry management, and registration tracking.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-cyan-400 block uppercase">2. Public Relations &amp; Marketing</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      National awareness campaigns, strategic institutional partnerships, and high-impact social presence.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-purple-400 block uppercase">3. Design &amp; Creative</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Brand identity, social creatives, visual style guides, merchandise production, and stage design.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-emerald-400 block uppercase">4. Media &amp; Communications</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Formal press releases, official announcements, International Press Corps supervision, and photography.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-blue-400 block uppercase">5. Technical &amp; Website</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Zenvitra platform integrations, registration systems, digital ledger, and conference IT infrastructure.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-rose-400 block uppercase">6. Events &amp; Conference Operations</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      In-person venue coordination, dais protocol, accommodation logistics, hospitality desks &amp; safety.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 sm:col-span-2 lg:col-span-3">
                    <strong className="text-amber-300 block uppercase">7. Research &amp; Content</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Authoring committee background guides, policy research, rules of procedure handbooks, and resolution vetting.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── 7. ZENITH EXCLUSIVE PLATFORM PRIVILEGES ── */}
              <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-amber-500/20 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                    EXCLUSIVE INITIATIVES
                  </span>
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                    Zenith Sovereign Ecosystem Privileges
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-amber-400 block uppercase">Zenith Hall of Fame</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Permanent online tribute honoring exceptional Secretariat members, chairs, and organizers for posterity.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-cyan-400 block uppercase">Zenith Merit Registry</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Immutable digital archive recording every award winner, leadership citation, and verified achievement.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-purple-400 block uppercase">Zenith Ambassador Programme</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Leadership representation channel empowering outstanding organizers to represent Zenith across institutions.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-emerald-400 block uppercase">Zenvitra Platform Privileges</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Special platform privileges across civic tools, resolution templates, and verified diplomatic CV profiles.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-rose-400 block uppercase">Zenith Fellowship</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Prestigious recognition and policy mentorship for top student organizers, researchers, and convenors.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-amber-300 block uppercase">Outstanding Institution Trophy</strong>
                    <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                      Honor bestowed on the school, university, or delegation achieving the highest cumulative score.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-black to-cyan-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-bold font-display text-white uppercase">
                    Join the Leadership Directorate
                  </h4>
                  <p className="text-xs text-neutral-300">
                    Apply for Secretariat today to qualify for the ₹5,000 Best Secretariat Member Award &amp; merit-based LORs.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/forms/zenith-secretariat-2026"
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4 fill-black" />
                    <span>Apply for Secretariat</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 4: CHAMBERS & COMMITTEES (COMING SOON) ── */}
        {activeTab === 'committees' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080b12] border border-amber-500/20 space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                    <Scale className="w-3.5 h-3.5" />
                    <span>CHAMBERS &amp; AGENDAS &bull; COMING SOON</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                    Committees &amp; Chambers Revealing Soon
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                    The official committee matrices, study guides, and Executive Board appointments for <strong className="text-white">Summer 2027 in Udaipur</strong> are currently in progress. Agendas will be locked in direct collaboration with the incoming Secretariat and Academic Affairs Directorate.
                  </p>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-xs font-bold text-center shrink-0">
                  <span>SUMMER 2027 &bull; UDAIPUR</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                      TRACK 01 &bull; MULTILATERAL
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">REVEALING SOON</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Multilateral Diplomatic Plenary (UNGA / ECOSOC)</h4>
                  <p className="text-neutral-400 leading-relaxed font-light">
                    Large-chamber multilateral diplomacy focusing on global treaties, sustainable development, and digital sovereignty under classical rules of procedure.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold">
                      TRACK 02 &bull; SECURITY &amp; CRISIS
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">REVEALING SOON</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Security Council &amp; Continuous Crisis War Room</h4>
                  <p className="text-neutral-400 leading-relaxed font-light">
                    Fast-paced geopolitical crisis simulation reacting dynamically to intelligence communiques, emergency directives, and live international press updates.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                      TRACK 03 &bull; PARLIAMENTARY
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">REVEALING SOON</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Indian Legislative / All India Youth Assembly</h4>
                  <p className="text-neutral-400 leading-relaxed font-light">
                    Dedicated simulation of Indian parliamentary procedure, Question Hour, legislative bills, and national policy debates with Lok Sabha seating protocols.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold">
                      TRACK 04 &bull; SPECIALISED
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">REVEALING SOON</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Specialised Directorate &amp; International Press Corps</h4>
                  <p className="text-neutral-400 leading-relaxed font-light">
                    Investigative journalism, live press conferences, photographic framing, and editorial wire reporting examining committee proceedings in real time.
                  </p>
                </div>
              </div>

              {/* Callout Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                <div className="space-y-1">
                  <strong className="text-amber-300 font-mono block">Propose a Committee Agenda or Lead an Executive Board:</strong>
                  <p className="text-neutral-300 leading-relaxed">
                    Have an idea for a committee topic or want to chair a council? State your vision in your Secretariat Application (Question 16).
                  </p>
                </div>

                <Link
                  href="/forms/zenith-secretariat-2026"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition shrink-0 text-center"
                >
                  Apply Now &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: SUMMIT VENUE & LOCATION (COMING SOON) ── */}
        {activeTab === 'venue' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080b12] border border-white/10 space-y-6 text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>LOCATION COMING SOON</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                  Summit Location &amp; Venue (Coming Soon)
                </h2>
                <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-3xl">
                  The official offline summit coordinates, debate chambers, and delegate accommodations are currently being finalized. Full venue details, transit directions, and verified student lodging advisories will be unveiled soon.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-amber-400 font-bold block uppercase">Historic Heritage</span>
                  <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                    Uncompromising in-person multilateral chambers set in a regal, historic setting.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-cyan-400 font-bold block uppercase">Seamless Connectivity</span>
                  <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                    Accessible via direct rail, road, and flight connections from all major metropolitan hubs.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-emerald-400 font-bold block uppercase">Youth Assembly Hub</span>
                  <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                    Vetted delegate hospitality network, security protocols, and curated transport coordination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <ZenithApplicationStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      />

      <Footer />
    </div>
  );
}

export default ZenithMun2026Portal;
