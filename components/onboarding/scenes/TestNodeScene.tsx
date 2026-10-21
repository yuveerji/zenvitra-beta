'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Radio,
  Building,
  CreditCard,
  FileText,
  Compass,
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  RotateCcw,
  Zap,
  Globe2
} from 'lucide-react';
import { TestNodeOrb } from '@/components/test-node/TestNodeOrb';

interface TestNodeSceneProps {
  onNext: () => void;
  userName?: string;
}

export function TestNodeScene({ onNext, userName }: TestNodeSceneProps) {
  const [selectedRolePreview, setSelectedRolePreview] = useState<'DELEGATE' | 'CHAIR' | 'SECRETARIAT' | 'ORGANIZER'>('DELEGATE');

  const rolePreviews = {
    DELEGATE: {
      title: 'Delegate Persona • Aanya Sharma (@aanya.demo)',
      desc: 'Simulate full caucus motions, join speakers list queues, cast roll-call votes on draft resolutions, and test ₹199 mock checkouts.',
      modules: ['ZEN.MUN Chamber', 'Mock Cashfree PG', 'ZEN.CHAT Backchannel', 'Policy Studio'],
      badge: 'Chamber Participant',
      accentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    },
    CHAIR: {
      title: 'Executive Board Persona • Rohan Mehra (@rohan.eb)',
      desc: 'Control dais GSL timers, recognize delegates, moderate moderated caucuses with procedural acoustic gavels, and approve working papers.',
      modules: ['Dais Timer & Audio', 'Speakers Management', 'Resolution Review', 'Roll-Call Tally'],
      badge: 'Presiding Officer',
      accentColor: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    },
    SECRETARIAT: {
      title: 'Secretariat Persona • Kavita Nair (@kavita.sec)',
      desc: 'Screen incoming Executive Board candidate dossiers, issue approval decrees, allocate chamber capacities, and broadcast emergency bulletins.',
      modules: ['EB Dossier Screening', 'Global Broadcast Wire', 'Chamber Quorum Metrics', 'Run of Show'],
      badge: 'Secretary-General',
      accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    },
    ORGANIZER: {
      title: 'Event Organiser Persona • Vikram Patel (@vikram.org)',
      desc: 'Track simulated Cashfree revenue pipelines, test UPI/card success and refund flows, and issue holographic delegate access passes.',
      modules: ['Mock Revenue Analytics', 'Pass Tier Configuration', 'Cashfree Webhooks', 'Gate Scanner'],
      badge: 'Operations & FinOps',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
  };

  const activeRole = rolePreviews[selectedRolePreview];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-6 sm:py-8 select-none text-left">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>NEW &bull; PARALLEL DIGITAL SANDBOX</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase leading-tight">
          EXPERIENCE BEFORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">YOU PARTICIPATE.</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
          Welcome to the <strong>ZENVITRA Test Node</strong> — an isolated, floating digital enclave where you can experience the entire ecosystem with extensive synthetic conferences, mock transactions, and sample roles.
        </p>
      </div>

      {/* Main Grid: Orb Centerpiece & Sandbox Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-center">
        {/* Left Column: The Floating Code Orb & Isolation Notice */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-[#070c18] to-[#03060c] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden text-center">
          <div className="py-2">
            <TestNodeOrb size="sm" />
          </div>

          <div className="mt-3 space-y-1 text-center">
            <div className="font-display font-black text-white text-base tracking-tight uppercase flex items-center justify-center gap-1.5">
              <span>THE TEST NODE ORB</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              Positioned outside live production. Sealed in isolated browser storage.
            </p>
          </div>

          {/* Strict Data Integrity Guarantee Badge */}
          <div className="mt-4 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-left w-full space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-[10px] font-bold uppercase">
              <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Zero Seeded Data in Production</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
              Your real account stays clean with zero mock accounts or fake passes. Everything tested in the sandbox stays strictly inside the sandbox.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Role Explorer & Key Capabilities */}
        <div className="lg:col-span-7 space-y-4">
          {/* Role Perspective Switcher Pills */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-neutral-400 uppercase font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Role Perspectives:</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 hidden sm:inline">
                Click to explore perspectives
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['DELEGATE', 'CHAIR', 'SECRETARIAT', 'ORGANIZER'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRolePreview(r)}
                  className={`py-2 px-2.5 rounded-xl font-mono text-[11px] font-bold uppercase transition cursor-pointer text-center ${
                    selectedRolePreview === r
                      ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-102'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Active Role Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">{activeRole.title}</h4>
                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase border ${activeRole.accentColor}`}>
                  {activeRole.badge}
                </span>
              </div>

              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {activeRole.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeRole.modules.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px]">
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Two Discovery Tracks: Guided Demo vs Free Sandbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs font-bold uppercase">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>12-Step Guided Demo</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                End-to-end interactive journey from identity selection to mock payments and sovereign policy drafting.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Free Exploration</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                Open sandbox with live committee timers, simulated chat rooms, synthetic feeds, and dais gavels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-4 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Open in Sandbox in New Tab link */}
        <a
          href="/test-node"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition underline-offset-4 hover:underline"
        >
          <span>Open Test Node in new tab &rarr;</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Continue Onboarding Tour CTA */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="/test-node/journey"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Try Guided Demo (New Tab)</span>
          </a>

          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-95 shrink-0"
          >
            <span>Continue &amp; Redeem Rewards &rarr;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
