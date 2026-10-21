'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  CheckCircle2,
  KeyRound,
  Mic,
  Award,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

interface EventJourneySceneProps {
  onNext: () => void;
}

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'REGISTRATION',
    quote: 'You’re officially registered.',
    details: 'You select your pass tier, enter your credentials, and reserve your place in the chamber.',
    icon: FileCheck2,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    step: '02',
    title: 'CONFIRMATION',
    quote: 'Your registration & payment are recorded.',
    details: 'Verified order receipt generated via Cashfree. Your gate ticket barcode is minted immediately.',
    icon: CheckCircle2,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    step: '03',
    title: 'EVENT ACCESS',
    quote: 'Event-specific resources unlock.',
    details: 'Access live country matrix, committee dossier, background guides, and chair instructions.',
    icon: KeyRound,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  {
    step: '04',
    title: 'PARTICIPATE',
    quote: 'Attend, debate, collaborate or compete.',
    details: 'Floor speeches, moderated caucuses, electronic dais voting, and crisis simulations live.',
    icon: Mic,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    step: '05',
    title: 'RESULTS',
    quote: 'Participation & outcomes recorded.',
    details: 'Roll call records, motion voting tallies, and committee resolutions are permanently archived.',
    icon: Award,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    step: '06',
    title: 'RECOGNITION',
    quote: 'Certificates & credentials (where configured).',
    details: 'Organizers issue verified digital certificates and commendations based on each event’s rules.',
    icon: ShieldCheck,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
  {
    step: '07',
    title: 'YOUR PASSPORT',
    quote: 'Your achievements join your permanent record.',
    details: 'Every verified experience is stamped into your sovereign ZENVITRA Passport dossier for life.',
    icon: Compass,
    color: 'text-amber-300 border-amber-400/40 bg-amber-400/10',
  },
];

export function EventJourneyScene({ onNext }: EventJourneySceneProps) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-6 sm:py-10 select-none">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
          04 &bull; YOUR EVENT JOURNEY
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase max-w-2xl leading-tight">
          SO… YOU REGISTERED. <span className="text-cyan-400">WHAT NOW?</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          &ldquo;From registration to permanent passport credentials — here is how your journey unfolds.&rdquo;
        </p>
      </div>

      {/* Interactive 7-Step Timeline Sequence with Unified Horizontal Alignment */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 my-4">
        {JOURNEY_STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStepIdx === idx;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStepIdx(idx)}
              className={`h-[152px] p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-start ${
                isSelected
                  ? 'bg-white/[0.08] border-cyan-400 ring-1 ring-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {/* Slot 1: Step Number & Icon (Strictly aligned height) */}
              <div className="h-7 w-full flex items-center justify-between mb-2 shrink-0">
                <span className="text-[10px] font-mono font-bold text-neutral-500">{s.step}</span>
                <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 ${s.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Slot 2: Title (Strictly aligned height & baseline) */}
              <div className="h-8 w-full flex items-center shrink-0">
                <span className="text-[11px] font-mono font-bold text-white block uppercase leading-snug line-clamp-2">
                  {s.title}
                </span>
              </div>

              {/* Subtle slot divider */}
              <div className="w-full h-px bg-white/10 my-1.5 shrink-0" />

              {/* Slot 3: Quote / Description (Strictly aligned baseline) */}
              <div className="h-10 w-full flex items-start overflow-hidden shrink-0">
                <span className="text-[10px] text-neutral-400 font-sans block leading-tight line-clamp-2">
                  {s.quote}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Showcase Box */}
      <motion.div
        key={activeStepIdx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full p-5 sm:p-6 rounded-3xl bg-[#090c14] border border-white/15 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left my-2"
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase">
            <span>STEP {JOURNEY_STEPS[activeStepIdx].step} &bull; {JOURNEY_STEPS[activeStepIdx].title}</span>
          </div>
          <p className="text-base font-bold text-white font-display">
            &ldquo;{JOURNEY_STEPS[activeStepIdx].quote}&rdquo;
          </p>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            {JOURNEY_STEPS[activeStepIdx].details}
          </p>
        </div>
        <div className="text-[11px] font-mono text-neutral-500 border-l border-white/10 pl-4 shrink-0 sm:max-w-xs">
          Notice: Awards and certificates reflect individual organizer settings and participation criteria.
        </div>
      </motion.div>

      {/* Next CTA */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer group"
        >
          <span>EXPLORE THE ECOSYSTEM</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
