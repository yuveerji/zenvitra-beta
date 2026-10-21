'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Gavel, 
  FileText, 
  Award, 
  ShieldCheck, 
  Radio, 
  Users,
  Compass,
  Zap
} from 'lucide-react';

interface IntroSceneProps {
  onNext: () => void;
}

interface KeywordItem {
  id: string;
  text: string;
  color: string;
  activeColor: string;
  title: string;
  desc: string;
}

const KEYWORDS: KeywordItem[] = [
  {
    id: 'discuss',
    text: 'DISCUSS',
    color: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
    activeColor: 'border-cyan-400 bg-cyan-500/25 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)]',
    title: 'Open Dialogue & Deliberation',
    desc: 'Engage in structured community channels, bilateral dialogues, and multilateral caucus discussions without corporate echo-chambers.',
  },
  {
    id: 'create',
    text: 'CREATE',
    color: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
    activeColor: 'border-emerald-400 bg-emerald-500/25 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]',
    title: 'Universal Policy & Content Engine',
    desc: 'Author comprehensive legislative bills, draft resolutions, redline amendments, and publish investigative journalism on ZenPress.',
  },
  {
    id: 'debate',
    text: 'DEBATE',
    color: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
    activeColor: 'border-amber-400 bg-amber-500/25 text-white shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    title: 'Live MUN & Parliamentary Daises',
    desc: 'Take the floor in real-time committee chambers, manage General Speakers Lists, timed interventions, and floor motions.',
  },
  {
    id: 'participate',
    text: 'PARTICIPATE',
    color: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
    activeColor: 'border-purple-400 bg-purple-500/25 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    title: 'Verified Global Summits & Hackathons',
    desc: 'Register for physical and virtual youth events, pay seamlessly via Cashfree, and claim cryptographic zero-counterfeit tickets.',
  },
  {
    id: 'connect',
    text: 'CONNECT',
    color: 'border-blue-500/30 text-blue-300 bg-blue-500/10',
    activeColor: 'border-blue-400 bg-blue-500/25 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]',
    title: 'Cross-Border Delegate Network',
    desc: 'Collaborate with student diplomats, chairs, researchers, and youth leaders spanning schools, universities, and international delegations.',
  },
  {
    id: 'lead',
    text: 'LEAD',
    color: 'border-rose-500/30 text-rose-300 bg-rose-500/10 font-black',
    activeColor: 'border-rose-400 bg-rose-500/25 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]',
    title: 'Secretariats, Organizers & Chairs',
    desc: 'Direct entire conferences, issue verified digital credentials, manage attendance roll-calls, and shape global youth policy.',
  },
];

const PLATFORM_PILLARS = [
  {
    icon: Gavel,
    tag: 'DIPLOMACY & MUN',
    title: 'Live Chamber Daises',
    desc: 'Electronic dais management, timed GSL queues, roll-call voting, and unmoderated caucus collaboration.',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    bg: 'bg-cyan-500/5',
    accent: 'text-cyan-400',
  },
  {
    icon: FileText,
    tag: 'POLICY ENGINE',
    title: 'Universal Bills & Charters',
    desc: 'Clause-by-clause scrutiny, redline diffs, student co-sponsorships, and community-ratified resolutions.',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    bg: 'bg-emerald-500/5',
    accent: 'text-emerald-400',
  },
  {
    icon: ShieldCheck,
    tag: 'PASSPORT & PASSES',
    title: 'Verifiable Credentials',
    desc: 'Cryptographic gate tickets, immutable delegate achievement stamps, and a sovereign lifelong dossier.',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    bg: 'bg-amber-500/5',
    accent: 'text-amber-400',
  },
];

export function IntroScene({ onNext }: IntroSceneProps) {
  const [selectedKeywordId, setSelectedKeywordId] = useState<string>('discuss');
  const activeKeyword = KEYWORDS.find((k) => k.id === selectedKeywordId) || KEYWORDS[0];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12 select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Chapter Index */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.25em] text-cyan-300 uppercase mb-4"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>01 &bull; THE PLATFORM</span>
      </motion.div>

      {/* Primary Statement */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white uppercase leading-none"
      >
        THIS IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">ZENVITRA.</span>
      </motion.h2>

      {/* Mission Definition - Detailed & Comprehensive */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22 }}
        className="mt-6 max-w-3xl space-y-3"
      >
        <p className="text-base sm:text-xl text-neutral-200 font-sans leading-relaxed font-light">
          A sovereign, real-time operating ecosystem built for <strong className="text-white font-semibold">youth participation</strong>,{' '}
          <strong className="text-cyan-300 font-semibold">global diplomacy</strong>,{' '}
          <strong className="text-emerald-300 font-semibold">collaborative expression</strong>, and{' '}
          <strong className="text-amber-300 font-semibold">unbounded opportunity</strong>.
        </p>

        <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-2xl mx-auto">
          ZENVITRA connects real-world Model United Nations conferences, parliamentary youth forums, policy bill drafts, and autonomous event ticketing into a single unified platform. No fragmented tools, no counterfeit tickets, and no discarded debate records — every speech, vote, and resolution is permanently recognized.
        </p>
      </motion.div>

      {/* 3 Core Architecture Pillars */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full text-left"
      >
        {PLATFORM_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className={`p-4 rounded-2xl border ${pillar.border} ${pillar.bg} backdrop-blur-md transition-all duration-300 space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${pillar.accent}`}>
                  {pillar.tag}
                </span>
                <Icon className={`w-4 h-4 ${pillar.accent}`} />
              </div>
              <h4 className="text-sm font-bold font-display text-white">{pillar.title}</h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Kinetic Keyword Grid (Interactive Capabilities) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="mt-8 w-full max-w-2xl space-y-3"
      >
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>INTERACTIVE CAPABILITIES &bull; CLICK TO INSPECT</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {KEYWORDS.map((item) => {
            const isSelected = selectedKeywordId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedKeywordId(item.id)}
                className={`px-4 py-2 rounded-2xl border text-xs sm:text-sm font-mono tracking-wider transition-all cursor-pointer ${
                  isSelected ? item.activeColor : item.color
                } hover:scale-105 active:scale-95`}
              >
                {item.text}
              </button>
            );
          })}
        </div>

        {/* Dynamic Capability Context Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKeyword.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-left flex items-start gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-mono font-bold text-white block uppercase">
                {activeKeyword.title}
              </span>
              <p className="text-xs text-neutral-300 font-sans mt-0.5 leading-relaxed">
                {activeKeyword.desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Transitional Line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 space-y-1"
      >
        <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-neutral-400">
          AND THIS IS WHERE YOUR JOURNEY STARTS.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-6"
      >
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer group mx-auto"
        >
          <span>LET&apos;S GO</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
