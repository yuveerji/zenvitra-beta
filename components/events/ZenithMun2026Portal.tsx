'use client';

import React, { useState } from 'react';
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
  Ticket
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export function ZenithMun2026Portal() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'secretariat' | 'committees' | 'venue'>('overview');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

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

            <div className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs font-semibold flex items-center gap-2 select-none">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Registration Opening Soon</span>
            </div>

            <Link
              href="/events/zenith-mun-2026/mun/matrix"
              className="px-6 py-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 font-mono text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Grid className="w-4 h-4 text-cyan-400" />
              <span>Country Matrix</span>
            </Link>

            <a
              href="#secretariat-info"
              onClick={() => setActiveTab('secretariat')}
              className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-mono text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Secretariat Overview</span>
            </a>

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

                <Link
                  href="/forms/zenith-secretariat-2026"
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Launch Live Form</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
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

        {/* ── TAB 3: CHAMBERS & COMMITTEES (COMING SOON) ── */}
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

      <Footer />
    </div>
  );
}

export default ZenithMun2026Portal;
