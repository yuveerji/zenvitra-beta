'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Compass,
  Mic,
  Award
} from 'lucide-react';
import Link from 'next/link';

export interface EventMiniTourData {
  eventId: string;
  eventName: string;
  committeeName?: string;
  portfolioOrCountry?: string;
  agenda?: string;
  dates?: string;
  venueOrFormat?: string;
}

interface EventMiniTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: EventMiniTourData;
}

export function EventMiniTourModal({ isOpen, onClose, eventData }: EventMiniTourModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const STEPS = [
    {
      num: '01',
      title: 'YOUR COMMITTEE & ALLOCATION',
      headline: eventData.committeeName || 'Committee Chamber Assigned',
      desc: eventData.portfolioOrCountry
        ? `You are representing ${eventData.portfolioOrCountry}. Your portfolio credentials and dais voting rights are linked.`
        : 'Your committee floor participation and dais voting rights are activated for this assembly.',
      icon: Layers,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      num: '02',
      title: 'YOUR AGENDA MANDATE',
      headline: eventData.agenda || 'Floor Deliberations & Working Papers',
      desc: 'Deliberate, submit draft resolutions, raise points of order, and contribute to bilateral working directives.',
      icon: Mic,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      num: '03',
      title: 'EVENT SCHEDULE',
      headline: eventData.dates || 'Upcoming Convening',
      desc: `Convenes at: ${eventData.venueOrFormat || 'Digital Plenary / Physical Enclave'}. Arrive on time for roll call attendance.`,
      icon: Calendar,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      num: '04',
      title: 'YOUR EVENT SPACE',
      headline: 'Live Country Matrix & Dais Tools',
      desc: 'Access your live committee chamber, speaker queues, caucus timers, and working resolution editors.',
      icon: Compass,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    },
    {
      num: '05',
      title: 'YOUR PARTICIPATION',
      headline: 'Attend • Debate • Collaborate • Perform',
      desc: 'Your speeches, votes, and resolutions become verifiable stamps inside your permanent ZENVITRA Passport.',
      icon: Award,
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
  ];

  const current = STEPS[activeStep];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#080a10] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-left shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden space-y-6"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block font-bold">
                CONFIRMED REGISTRATION &bull; MINI-TOUR
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                {eventData.eventName}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Progress Pills */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] relative z-10">
            {STEPS.map((s, idx) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`flex-1 py-1 text-center rounded-lg border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                    : idx < activeStep
                    ? 'bg-white/5 text-neutral-400 border-white/10'
                    : 'bg-transparent text-neutral-600 border-transparent'
                }`}
              >
                {s.num}
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <motion.div
            key={current.num}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative z-10"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-neutral-400 tracking-wider">
                {current.num} &mdash; {current.title}
              </span>
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${current.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              {current.headline}
            </h3>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              {current.desc}
            </p>
          </motion.div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 relative z-10">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono text-neutral-400 hover:text-white cursor-pointer transition"
            >
              Close
            </button>

            {activeStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep((p) => p + 1)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                href={`/${eventData.eventId}/matrix`}
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-display font-bold text-xs tracking-wide shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Enter Event Space &rarr;</span>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
