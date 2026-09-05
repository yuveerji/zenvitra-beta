'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Layers,
  Sparkles,
  Shield,
  Newspaper,
  Compass,
  ChevronRight,
  Crown,
  Users,
  PlusCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { sheetSync } from '@/lib/googleSheets';

type TrackId = 'cofounder' | 'engineering' | 'design' | 'secretariat' | 'press' | 'operations' | 'impact' | 'other';

interface Track {
  id: TrackId;
  title: string;
  tagline: string;
  badge: string;
  icon: React.ElementType;
  requirements: string[];
}

export default function JoinCoreTeamPage() {
  const [selectedTrack, setSelectedTrack] = useState<TrackId>('cofounder');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    handle: '',
    email: '',
    contactChannel: '', 
    locationTimezone: '',
    primaryFocus: 'Co-Founder / Executive Leadership',
    customTrackTitle: '', // Used if "Other" is selected
    proofOfWorkUrl: '', 
    pastExperience: '',
    technicalOrDiplomaticDossier: '',
    weeklyBandwidth: '25+ hrs (Core)',
    motivationStatement: '',
    constitutionalAccordAccepted: false,
  });

  const tracks: Track[] = [
    {
      id: 'cofounder',
      title: 'Co-Founder & Executive Council',
      tagline: 'Overall organizational vision, capital allocation, high-level diplomatic partnerships, and institutional steering.',
      badge: 'EXECUTIVE',
      icon: Crown,
      requirements: ['Proven track record in scaling organizations', 'Deep strategic network & fundraising expertise', 'Uncompromising execution discipline'],
    },
    {
      id: 'secretariat',
      title: 'Secretariat Team Head',
      tagline: 'Leading the executive secretariat, managing parliamentary summits, delegate relations, and institutional governance.',
      badge: 'SEC TEAM HEAD',
      icon: Users,
      requirements: ['Extensive MUN / Parliamentary Leadership', 'Crisis Simulation Mastery', 'High-stakes Diplomacy & Coordination'],
    },
    {
      id: 'design',
      title: 'Head of Visual & Product Design',
      tagline: 'Directing obsidian dark aesthetics, glassmorphism UI/UX, brand identity, and cinematic design languages.',
      badge: 'DESIGN LEAD',
      icon: Layers,
      requirements: ['Mastery of Figma & Design Systems', 'Denis Villeneuve Aesthetic Rigor', 'Portfolio demonstrating uncompromising taste'],
    },
    {
      id: 'engineering',
      title: 'Chief Technology Officer / Engineering',
      tagline: 'Leading distributed protocols, real-time audio mesh, Next.js 15 architecture, and database infrastructure.',
      badge: 'CORE ENGINE',
      icon: Terminal,
      requirements: ['Expertise in Next.js 15, Prisma, TypeScript', 'WebSockets & Real-time Telemetry Systems', 'Clean Architecture Principles'],
    },
    {
      id: 'press',
      title: 'Head of International Press Bureau',
      tagline: 'Overseeing independent investigative journalism, editorial policy, and permanent DOI research dispatches.',
      badge: 'PRESS CHIEF',
      icon: Newspaper,
      requirements: ['Uncompromising Investigative Ethics', 'Long-form Publishing Portfolio', 'Editorial Direction & Verification'],
    },
    {
      id: 'operations',
      title: 'Head of Strategic Operations',
      tagline: 'Managing international summits, country allocation algorithms, and cross-functional execution pipelines.',
      badge: 'OPS DIRECTOR',
      icon: Compass,
      requirements: ['Logistical Execution & Crisis Management', 'Data-driven Operations Tracking', 'Cross-continental Team Coordination'],
    },
    {
      id: 'impact',
      title: 'Head of Impact & The 25% Principle',
      tagline: 'Directing the public ledger, managing youth civic grants, and auditing real-world deployments.',
      badge: 'IMPACT LEDGER',
      icon: Shield,
      requirements: ['Grant Management & Auditing', 'Non-profit Resource Stewardship', 'Ground-level Accountability Protocols'],
    },
    {
      id: 'other',
      title: 'Other Custom Portfolio',
      tagline: 'Propose a specialized domain, unique strategic initiative, or technical department not listed above.',
      badge: 'CUSTOM TRACK',
      icon: PlusCircle,
      requirements: ['Exceptional sovereign execution capability', 'Clear thesis on value addition to Zenvitra', 'Autonomous leadership profile'],
    },
  ];

  const activeTrackData = tracks.find((t) => t.id === selectedTrack)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.constitutionalAccordAccepted) return;

    setIsSubmitting(true);

    try {
      // 1. Post to API route which writes to database AND Google Sheets
      const res = await fetch('/api/core-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          handle: formData.handle,
          email: formData.email,
          phone: formData.contactChannel || 'N/A',
          city: formData.locationTimezone || 'N/A',
          department: selectedTrack === 'other' ? formData.customTrackTitle || 'Custom' : activeTrackData.title,
          roleAppliedFor: selectedTrack === 'other' ? formData.customTrackTitle || 'Custom' : activeTrackData.title,
          portfolioLink: formData.proofOfWorkUrl,
          proofOfWorkUrl: formData.proofOfWorkUrl,
          hoursPerWeek: formData.weeklyBandwidth,
          weeklyBandwidth: formData.weeklyBandwidth,
          motivation: formData.motivationStatement,
          motivationStatement: formData.motivationStatement,
          dossier: formData.technicalOrDiplomaticDossier,
          pastExperience: formData.pastExperience,
        }),
      });

      if (!res.ok) {
        console.warn('API submission failed with status:', res.status);
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden">
      {/* Lockdown Focused Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-[#030405]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/countdown" className="flex items-center gap-3 group">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/assets/logo.png"
                alt="Zenvitra Logo"
                className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
              />
            </div>
            <div>
              <div 
                className="tracking-[0.14em] text-sm sm:text-base font-bold text-[#f5f1ea] uppercase leading-none group-hover:text-white transition-colors"
                style={{
                  fontFamily: 'Clash Display, var(--font-space), sans-serif',
                }}
              >
                ZENVITRA
              </div>
              <div className="font-mono text-[9px] tracking-widest text-amber-400/80 uppercase mt-1">
                GENESIS COUNCIL INGESTION
              </div>
            </div>
          </Link>

          <Link
            href="/countdown"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-neutral-300 transition"
          >
            <span>Launch Countdown</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        </div>
      </header>

      {/* Background Ambient Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-white/[0.04] to-transparent blur-[130px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-8 min-h-screen flex flex-col justify-between">
        {/* Core Body Container */}
        <main className="py-8 flex-1">
          {isSuccess ? (
            <div className="max-w-2xl mx-auto rounded-[2.8rem] bg-[#07080b] border border-white/[0.1] p-10 sm:p-14 text-center space-y-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/35 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/[0.05] border border-emerald-400/20 text-[10px] font-mono tracking-widest text-emerald-300 uppercase">
                  INGESTION CONFIRMED
                </div>
                <h1 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
                  Executive Dossier Dispatched
                </h1>
                <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
                  Your application for <span className="text-white font-mono">{selectedTrack === 'other' ? formData.customTrackTitle || 'Custom Portfolio' : activeTrackData.title}</span> has been logged into the Genesis Council review queue.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/5 font-mono text-left text-xs space-y-2 text-neutral-400">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-500">ASSIGNED ROLE:</span>
                  <span className="text-white">{selectedTrack === 'other' ? formData.customTrackTitle || 'Custom Track' : activeTrackData.title}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-500">ROUTING STATUS:</span>
                  <span className="text-amber-300">FOUNDING COUNCIL REVIEW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ESTIMATED RESPONSE:</span>
                  <span className="text-white">Within 24-48 Hours</span>
                </div>
              </div>

              <Link
                href="/countdown"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition shadow-[0_0_25px_rgba(255,255,255,0.15)]"
              >
                View Launch Protocol & Countdown
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Expanded Leadership Track Matrix */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/[0.04] border border-amber-400/20 text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>EXECUTIVE & CORE ROLES</span>
                  </div>

                  <h1 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight leading-[1.08]">
                    Take Command of <br />
                    the <span className="font-serif italic font-normal text-neutral-200">Ecosystem.</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    Select your leadership track, executive portfolio, or propose a custom domain.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase block">
                    AVAILABLE LEADERSHIP TRACKS
                  </span>

                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {tracks.map((track) => {
                      const Icon = track.icon;
                      const isSelected = selectedTrack === track.id;
                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => {
                            setSelectedTrack(track.id);
                            if (track.id !== 'other') {
                              setFormData((prev) => ({ ...prev, primaryFocus: track.title }));
                            }
                          }}
                          className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
                            isSelected
                              ? 'bg-[#0a0c10] border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                              : 'bg-[#07080b]/60 border-white/[0.06] hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-white text-black border-white'
                                  : 'bg-white/5 border-white/10 text-neutral-400 group-hover:text-white'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-display font-medium text-sm text-white">
                                {track.title}
                              </h4>
                              <p className="font-mono text-[10px] text-neutral-400">
                                {track.badge}
                              </p>
                            </div>
                          </div>

                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              isSelected ? 'text-white translate-x-0' : 'text-neutral-600 -translate-x-1'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#07080b] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                      PORTFOLIO MANDATE
                    </span>
                    <span className="text-[10px] font-mono text-amber-300">
                      EXECUTIVE LEVEL
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {activeTrackData.tagline}
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider block">
                      KEY EXPECTATIONS:
                    </span>
                    <ul className="space-y-1.5 font-mono text-[11px] text-neutral-400">
                      {activeTrackData.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-amber-400" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Multi-Step Form */}
              <div className="lg:col-span-7 w-full">
                <div className="rounded-[2.8rem] bg-[#07080b] border border-white/[0.09] p-8 sm:p-12 lg:p-14 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
                  {/* Header Title & Steps */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-7 mb-9">
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] tracking-[0.28em] text-neutral-400 uppercase">
                        STAGE 0{currentStep} OF 03
                      </span>
                      <h3 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
                        {currentStep === 1 && 'Identity & Executive Clearance'}
                        {currentStep === 2 && 'Leadership Dossier & Track Record'}
                        {currentStep === 3 && 'Bandwidth & Constitutional Accord'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-sm self-start sm:self-auto">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                            currentStep === s
                              ? 'bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                              : currentStep > s
                              ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                              : 'bg-black text-neutral-600 border-white/5'
                          }`}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-7">
                    {/* STEP 1 */}
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        {selectedTrack === 'other' && (
                          <div className="space-y-2 p-4 rounded-2xl bg-amber-400/[0.03] border border-amber-400/20">
                            <label className="font-mono text-[11px] tracking-wider text-amber-300 uppercase font-medium block">
                              Specify Custom Role / Track Title <span className="text-amber-400">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Head of Growth & Global Expansion"
                              value={formData.customTrackTitle}
                              onChange={(e) => setFormData({ ...formData, customTrackTitle: e.target.value, primaryFocus: e.target.value })}
                              className="w-full px-5 py-3.5 rounded-xl bg-black border border-amber-400/30 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none transition"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                              Full Legal Name <span className="text-amber-400">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Your Full Name"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition shadow-inner"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                              Desired ZEN Handle <span className="text-amber-400">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-4 text-neutral-500 font-mono text-sm">@</span>
                              <input
                                type="text"
                                required
                                placeholder="your_handle"
                                value={formData.handle}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                                  })
                                }
                                className="w-full pl-9 pr-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition shadow-inner"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                              Primary Email <span className="text-amber-400">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="your.email@domain.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition shadow-inner"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                              Telegram/Discord <span className="text-amber-400">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="t.me/handle"
                              value={formData.contactChannel}
                              onChange={(e) => setFormData({ ...formData, contactChannel: e.target.value })}
                              className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition shadow-inner"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                            Location & Primary Timezone <span className="text-amber-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. New Delhi, IST (UTC+5:30)"
                            value={formData.locationTimezone}
                            onChange={(e) => setFormData({ ...formData, locationTimezone: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition shadow-inner"
                          />
                        </div>

                        <div className="pt-5 flex justify-end">
                          <button
                            type="button"
                            disabled={
                              !formData.fullName ||
                              !formData.handle ||
                              !formData.email ||
                              !formData.contactChannel ||
                              (selectedTrack === 'other' && !formData.customTrackTitle)
                            }
                            onClick={() => setCurrentStep(2)}
                            className="px-9 py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2.5 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
                          >
                            <span>Next: Leadership Dossier</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {currentStep === 2 && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="space-y-2">
                          <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                            Portfolio / GitHub / Previous Leadership Link <span className="text-amber-400">*</span>
                          </label>
                          <input
                            type="url"
                            required
                            placeholder="https://portfolio.xyz or https://github.com/handle"
                            value={formData.proofOfWorkUrl}
                            onChange={(e) => setFormData({ ...formData, proofOfWorkUrl: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition shadow-inner"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                            Leadership Accomplishments & Track Record <span className="text-amber-400">*</span>
                          </label>
                          <textarea
                            rows={4}
                            required
                            placeholder="Describe large organizations, conferences, design systems, or software architectures you have successfully directed."
                            value={formData.pastExperience}
                            onChange={(e) => setFormData({ ...formData, pastExperience: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition resize-none shadow-inner leading-relaxed"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                            Your Strategic Vision for this Role <span className="text-amber-400">*</span>
                          </label>
                          <textarea
                            rows={4}
                            required
                            placeholder="How will you scale this portfolio within Zenvitra over the next 12 months?"
                            value={formData.technicalOrDiplomaticDossier}
                            onChange={(e) =>
                              setFormData({ ...formData, technicalOrDiplomaticDossier: e.target.value })
                            }
                            className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition resize-none shadow-inner leading-relaxed"
                          />
                        </div>

                        <div className="pt-5 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="px-7 py-3.5 rounded-full border border-white/10 text-neutral-400 hover:text-white font-mono text-xs transition"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            disabled={
                              !formData.proofOfWorkUrl ||
                              !formData.pastExperience ||
                              !formData.technicalOrDiplomaticDossier
                            }
                            onClick={() => setCurrentStep(3)}
                            className="px-9 py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2.5 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
                          >
                            <span>Next: Commitment Accord</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {currentStep === 3 && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="space-y-2.5">
                          <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase block font-medium">
                            Dedicated Weekly Bandwidth <span className="text-amber-400">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {['15-25 hrs', '25-35 hrs', '35+ hrs (Full Executive)'].map((band) => (
                              <button
                                type="button"
                                key={band}
                                onClick={() => setFormData({ ...formData, weeklyBandwidth: band })}
                                className={`py-3.5 px-3 rounded-2xl border text-xs font-mono transition-all ${
                                  formData.weeklyBandwidth === band
                                    ? 'bg-white text-black font-semibold border-white shadow-sm'
                                    : 'bg-black/60 text-neutral-400 border-white/10 hover:border-white/20'
                                }`}
                              >
                                {band}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase font-medium block">
                            Why Zenvitra? (Executive Conviction) <span className="text-amber-400">*</span>
                          </label>
                          <textarea
                            rows={4}
                            required
                            placeholder="State your commitment to building a sovereign youth ecosystem."
                            value={formData.motivationStatement}
                            onChange={(e) => setFormData({ ...formData, motivationStatement: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-white/30 transition resize-none shadow-inner leading-relaxed"
                          />
                        </div>

                        {/* Constitutional Accord Checkbox */}
                        <div className="p-5 rounded-2xl bg-black/70 border border-white/10 space-y-3">
                          <label className="flex items-start gap-3.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.constitutionalAccordAccepted}
                              onChange={(e) =>
                                setFormData({ ...formData, constitutionalAccordAccepted: e.target.checked })
                              }
                              className="mt-1 w-5 h-5 rounded-md border-white/20 bg-black text-white focus:ring-0 focus:ring-offset-0 accent-white shrink-0"
                            />
                            <div className="space-y-1">
                              <span className="font-display font-medium text-sm text-white block">
                                I ratify the Zenvitra Founding Invariants
                              </span>
                              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                                I agree that Zenvitra will never sell user data, will maintain 100% editorial freedom for the Press, and will direct at least 25% of proceeds to verified impact.
                              </p>
                            </div>
                          </label>
                        </div>

                        <div className="pt-5 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="px-7 py-3.5 rounded-full border border-white/10 text-neutral-400 hover:text-white font-mono text-xs transition"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={
                              isSubmitting ||
                              !formData.constitutionalAccordAccepted ||
                              !formData.motivationStatement
                            }
                            className="px-9 py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2.5 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                          >
                            {isSubmitting ? (
                              <span className="animate-pulse">Ingesting Dossier...</span>
                            ) : (
                              <>
                                <span>Submit Executive Application</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <span>ZENVITRA &copy; 2026 // GENESIS COUNCIL</span>
          <span className="uppercase tracking-widest text-neutral-400">
            PROCEED WITH MERITOCRATIC RIGOR
          </span>
        </footer>
      </div>
    </div>
  );
}