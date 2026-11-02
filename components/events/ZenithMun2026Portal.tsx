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
  ChevronRight
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
              <span>OFFLINE SUMMIT • UDAIPUR</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Venue &amp; City
              </span>
              <p className="font-bold text-white text-sm">Udaipur, Rajasthan</p>
              <p className="text-[11px] text-neutral-400">Offline In-Person Assembly</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Convening Timeline
              </span>
              <p className="font-bold text-amber-300 text-sm">Dates Coming Soon</p>
              <p className="text-[11px] text-neutral-400">To Be Announced (Late 2026)</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                Recruitment Status
              </span>
              <p className="font-bold text-emerald-400 text-sm">Secretariat Form Live</p>
              <p className="text-[11px] text-neutral-400">20 Questions • 6 Sections</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Format &amp; Protocol
              </span>
              <p className="font-bold text-white text-sm">In-Person Delegate Plenary</p>
              <p className="text-[11px] text-neutral-400">UN4MUN &amp; Classical RoP</p>
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

            <a
              href="#secretariat-info"
              onClick={() => setActiveTab('secretariat')}
              className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-mono text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Review Form Questions</span>
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
            { id: 'secretariat', label: 'Secretariat Application (20 Qs)', icon: Crown },
            { id: 'committees', label: 'Chambers & Committees', icon: Scale },
            { id: 'venue', label: 'Host City: Udaipur', icon: MapPin },
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
                      Dates Announcement Priority Waitlist
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
                      Form Structure (6 Sections &bull; 20 Questions):
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-neutral-300">
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>Sec 1: Personal &amp; Academic Information (Q1-6)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>Sec 2: Experience, Prior MUNs &amp; Skills (Q7-10)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>Sec 3: 1st &amp; 2nd Dept Preferences &amp; Tools (Q11-13)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>Sec 4: Motivation, Ethos &amp; Contributions (Q14-16)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>Sec 5: Situational Scenarios &amp; Dedication (Q17-20)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>Sec 6: Resume / CV PDF Upload &amp; Declaration</span>
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
                    Secretariat Intake, Scorecard &amp; Departmental Questions
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Below is the complete evaluation rubric, the 100% selection scorecard, and department-specific practical assessment questions.
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

              {/* ── 2. DEPARTMENT-SPECIFIC QUESTIONS BREAKDOWN ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pt-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                    Department-Specific Question Tracks (Appearing Conditionally)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Track 1 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <span className="text-amber-400 font-bold block uppercase tracking-wider text-xs">
                      1. Delegate Affairs &amp; Outreach
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                      <li>How would you attract and engage potential delegates?</li>
                      <li>How would you handle a delegate dissatisfied with registration?</li>
                      <li>How would you build outreach beyond your immediate MUN network?</li>
                      <li>How would you track and follow up on registrations?</li>
                    </ul>
                  </div>

                  {/* Track 2 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <span className="text-cyan-400 font-bold block uppercase tracking-wider text-xs">
                      2. Public Relations &amp; Marketing
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                      <li>How to create awareness among students who never attended MUN?</li>
                      <li>Suggest a campaign idea to increase registrations.</li>
                      <li>How would you handle negative feedback or public criticism?</li>
                      <li>What makes an MUN&apos;s social media presence effective?</li>
                    </ul>
                  </div>

                  {/* Track 3 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <span className="text-purple-400 font-bold block uppercase tracking-wider text-xs">
                      3. Design &amp; Creative
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                      <li>Which design tools do you use?</li>
                      <li>Share links to three relevant samples of your work.</li>
                      <li>How to maintain visual consistency across all conference creatives?</li>
                      <li>How would you approach a last-minute creative requirement?</li>
                    </ul>
                  </div>

                  {/* Track 4 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <span className="text-emerald-400 font-bold block uppercase tracking-wider text-xs">
                      4. Media &amp; Communications
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                      <li>How comfortable are you with formal writing and proofreading?</li>
                      <li>Draft a short announcement introducing ZENITH MUN 2026.</li>
                      <li>How to ensure official communications remain consistent and accurate?</li>
                      <li>How to handle an urgent correction to a published announcement?</li>
                    </ul>
                  </div>

                  {/* Track 5 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <span className="text-blue-400 font-bold block uppercase tracking-wider text-xs">
                      5. Technical &amp; Website
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                      <li>Mention programming languages, platforms and tools you know.</li>
                      <li>Share links to projects or websites you have worked on.</li>
                      <li>Troubleshooting a website issue during live registration.</li>
                      <li>Ensuring information displayed on website remains accurate.</li>
                    </ul>
                  </div>

                  {/* Track 6 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <span className="text-rose-400 font-bold block uppercase tracking-wider text-xs">
                      6. Events &amp; Conference Operations
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                      <li>How would you plan and coordinate a large offline conference in Udaipur?</li>
                      <li>What would you include in a conference-day contingency plan?</li>
                      <li>Coordination between Executive Board, delegates and Secretariat.</li>
                      <li>Handling unexpected technical or stage disruptions.</li>
                    </ul>
                  </div>

                  {/* Track 7 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 md:col-span-2">
                    <span className="text-amber-300 font-bold block uppercase tracking-wider text-xs">
                      7. Research &amp; Content
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                      <li>How would you research and verify information before publication?</li>
                      <li>What makes a good committee background guide?</li>
                      <li>How would you ensure research material is unbiased and comprehensive?</li>
                      <li>Share a short writing or research sample.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6 font-mono text-xs">
                {/* SECTION 1 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-amber-400 font-bold block uppercase tracking-wider text-xs">
                    SECTION 1 — PERSONAL INFORMATION
                  </span>
                  <ol className="list-decimal list-inside space-y-2 text-neutral-300 leading-relaxed">
                    <li><strong className="text-white">Full Name</strong> (Required legal identity)</li>
                    <li><strong className="text-white">Age</strong> (Candidate age)</li>
                    <li><strong className="text-white">City, State and Country</strong> (Location details)</li>
                    <li><strong className="text-white">Email Address</strong> (Primary correspondence)</li>
                    <li><strong className="text-white">WhatsApp / Contact Number</strong> (Emergency &amp; rapid updates)</li>
                    <li><strong className="text-white">School / College / Institution and Current Academic Year</strong></li>
                  </ol>
                </div>

                {/* SECTION 2 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-cyan-400 font-bold block uppercase tracking-wider text-xs">
                    SECTION 2 — EXPERIENCE &amp; BACKGROUND
                  </span>
                  <ol start={7} className="list-decimal list-inside space-y-2 text-neutral-300 leading-relaxed">
                    <li><strong className="text-white">Have you participated in any MUN conferences?</strong> Mention the number of conferences and your notable experiences.</li>
                    <li><strong className="text-white">Have you previously served in an MUN Secretariat, Executive Board or Organising Committee?</strong> Mention your roles and responsibilities.</li>
                    <li><strong className="text-white">Have you held any leadership positions or been involved in organising events, projects or initiatives outside MUNs?</strong> Elaborate briefly.</li>
                    <li><strong className="text-white">What are your strongest skills?</strong> Mention at least three relevant skills.</li>
                  </ol>
                </div>

                {/* SECTION 3 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-purple-400 font-bold block uppercase tracking-wider text-xs">
                    SECTION 3 — DEPARTMENT PREFERENCES
                  </span>
                  <ol start={11} className="list-decimal list-inside space-y-2 text-neutral-300 leading-relaxed">
                    <li><strong className="text-white">Which department(s) would you prefer to work in?</strong> Mention your first and second preferences.</li>
                    <li><strong className="text-white">Why have you chosen these departments, and what makes you suitable for them?</strong></li>
                    <li><strong className="text-white">What relevant tools, software, technical abilities or creative skills do you possess?</strong></li>
                  </ol>
                </div>

                {/* SECTION 4 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-emerald-400 font-bold block uppercase tracking-wider text-xs">
                    SECTION 4 — MOTIVATION &amp; VISION
                  </span>
                  <ol start={14} className="list-decimal list-inside space-y-2 text-neutral-300 leading-relaxed">
                    <li><strong className="text-white">Why do you want to become a part of the ZENITH MUN 2026 Secretariat?</strong></li>
                    <li><strong className="text-white">What does being a Secretariat member mean to you beyond holding a designation?</strong></li>
                    <li><strong className="text-white">What is one specific contribution or idea you would like to bring to ZENITH MUN 2026?</strong></li>
                  </ol>
                </div>

                {/* SECTION 5 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-rose-400 font-bold block uppercase tracking-wider text-xs">
                    SECTION 5 — SITUATIONAL JUDGEMENT &amp; COMMITMENT
                  </span>
                  <ol start={17} className="list-decimal list-inside space-y-2 text-neutral-300 leading-relaxed">
                    <li><strong className="text-white">If a team member repeatedly fails to complete assigned responsibilities, how would you handle the situation?</strong></li>
                    <li><strong className="text-white">If you are assigned an important task with a tight deadline and encounter unexpected difficulties, what would you do?</strong></li>
                    <li><strong className="text-white">How much time can you realistically dedicate to ZENITH MUN, and how will you balance your responsibilities with academics and other commitments?</strong></li>
                    <li><strong className="text-white">Why should the selection committee choose you over other applicants?</strong></li>
                  </ol>
                </div>

                {/* SECTION 6 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-amber-400 font-bold block uppercase tracking-wider text-xs">
                    SECTION 6 — RESUME / CURRICULUM VITAE &amp; DECLARATION
                  </span>
                  <div className="space-y-2 text-neutral-300 leading-relaxed">
                    <p><strong className="text-white">Resume Upload — Mandatory (PDF):</strong> Attach academic background, MUN experience, leadership roles, skills, and portfolio.</p>
                    <p><strong className="text-white">Portfolio / LinkedIn / Work Samples:</strong> Optional URL link.</p>
                    <p><strong className="text-white">Final Declaration:</strong> Confirmation of truthfulness, Applicant Name, Date, and Digital Signature confirmation.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <Link
                  href="/forms/zenith-secretariat-2026"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-black" />
                  <span>Fill Out Application Online</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: CHAMBERS & COMMITTEES ── */}
        {activeTab === 'committees' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080b12] border border-white/10 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                  Provisional Diplomatic Chambers
                </h2>
                <p className="text-xs text-neutral-400">
                  Agendas will be officially revealed once the Academic Affairs directorate locks primary study guides.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                      MULTILATERAL PLENARY
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">UN4MUN</span>
                  </div>
                  <h4 className="text-base font-bold text-white">United Nations General Assembly (UNGA)</h4>
                  <p className="text-neutral-400 leading-relaxed font-light">
                    Sovereign deliberation on international cyber warfare frameworks, AI governance treaties, and equitable access to digital public infrastructure.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold">
                      P5 VETO COUNCIL
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">15 NATIONS</span>
                  </div>
                  <h4 className="text-base font-bold text-white">United Nations Security Council (UNSC)</h4>
                  <p className="text-neutral-400 leading-relaxed font-light">
                    High-stakes negotiations on de-escalation in critical maritime straits, peacekeeper mandate enforcement, and non-proliferation protocols.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                      INDIAN LEGISLATIVE
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">PARLIAMENTARY RoP</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Lok Sabha / All India Youth Assembly</h4>
                  <p className="text-neutral-400 leading-relaxed font-light">
                    National legislative simulation debating youth economic resilience, education reform, and federal data sovereignty with Question Hour protocols.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold">
                      CONTINUOUS CRISIS
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">RAPID DIRECTIVES</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Historic Crisis Committee (HCC) &amp; IPC Wire</h4>
                  <p className="text-neutral-400 leading-relaxed font-light">
                    Real-time geopolitical war room reacting to simulated intelligence communiques, covert directives, and investigative press wire disclosures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: HOST CITY UDAIPUR ── */}
        {activeTab === 'venue' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080b12] border border-white/10 space-y-6 text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>THE VENICE OF THE EAST</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                  Udaipur: A Sovereign Heritage Backdrop
                </h2>
                <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-3xl">
                  Renowned globally for its historic palaces, serene lakes, and architectural majesty, Udaipur provides the ideal environment for intellectual reflection, high-level diplomacy, and student leadership.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-amber-400 font-bold block uppercase">Historic Heritage</span>
                  <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                    Debate surrounded by centuries of cultural grandeur, creating an unforgettable summit memory.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-cyan-400 font-bold block uppercase">Seamless Connectivity</span>
                  <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                    Direct rail, road, and airport connectivity (Maharana Pratap Airport) from all major Indian metropolitan hubs.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-emerald-400 font-bold block uppercase">Youth Assembly Hub</span>
                  <p className="text-neutral-300 text-[11px] font-sans leading-relaxed">
                    A vibrant student hospitality network with vetted accommodations, security, and transport coordination.
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
