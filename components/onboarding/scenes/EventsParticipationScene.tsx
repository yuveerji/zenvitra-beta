'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  CreditCard,
  CheckCircle2,
  Users
} from 'lucide-react';

interface EventsParticipationSceneProps {
  onNext: () => void;
}

const PIPELINE_STEPS = [
  { step: 'DISCOVER', label: 'Browse summits & forums' },
  { step: 'REGISTER', label: 'Claim pass & seat' },
  { step: 'PARTICIPATE', label: 'Chambers & roll calls' },
  { step: 'EXPERIENCE', label: 'Debate & collaborate' },
  { step: 'ACHIEVE', label: 'Passport credentials' },
];

const DISCOVERY_PILLARS = [
  {
    title: 'DISCOVER',
    desc: 'Find Model UNs, youth summits, open mics, hackathons, and parliamentary forums across the ecosystem.',
    icon: Compass,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    title: 'EXPLORE',
    desc: 'Inspect schedule, committee portfolios, dais agendas, organizers, fees, and eligibility in depth.',
    icon: Layers,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    title: 'REGISTER',
    desc: 'Book your delegate pass, claim your portfolio country, and complete checkout via Cashfree PG.',
    icon: CreditCard,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    title: 'PARTICIPATE',
    desc: 'Take the floor, join the speaker list, submit resolutions, and build your sovereign track record.',
    icon: Users,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
];

export function EventsParticipationScene({ onNext }: EventsParticipationSceneProps) {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-6 sm:py-10 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[650px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
          03 &bull; EVENTS &amp; PARTICIPATION
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase max-w-2xl leading-tight">
          FIND SOMETHING WORTH <span className="text-emerald-400">SHOWING UP FOR.</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          &ldquo;Every summit, chamber, and assembly directly connects into your ZENVITRA journey.&rdquo;
        </p>
      </div>

      {/* Visual Pipeline Bar */}
      <div className="w-full mb-8 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none font-mono">
        {PIPELINE_STEPS.map((item, idx) => (
          <React.Fragment key={item.step}>
            <div className="flex flex-col items-center text-center shrink-0 min-w-[90px]">
              <span className="text-xs font-bold text-white tracking-wider">{item.step}</span>
              <span className="text-[9px] text-neutral-400 mt-0.5">{item.label}</span>
            </div>
            {idx < PIPELINE_STEPS.length - 1 && (
              <span className="text-neutral-600 font-bold shrink-0">&rarr;</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {DISCOVERY_PILLARS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
              className="p-5 rounded-3xl bg-[#090b10] border border-white/10 space-y-3 hover:border-white/20 transition-all text-left shadow-lg"
            >
              <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${p.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">{p.title}</h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">{p.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Next CTA */}
      <div className="mt-10">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer group"
        >
          <span>HOW YOUR JOURNEY WORKS</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
