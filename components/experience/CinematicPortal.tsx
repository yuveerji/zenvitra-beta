'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Radio, Gavel, Crown, ArrowRight, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { ZenParticleField } from '@/components/experience/ZenParticleField';
import { ParticleMorphState } from '@/components/experience/ExperienceContext';
import { ZenSpatialCard } from '@/components/experience/ZenSpatialCard';

export function CinematicPortal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particleState, setParticleState] = useState<ParticleMorphState>('VOID');
  const [activeAct, setActiveAct] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track scroll and trigger continuous morphing acts
  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      if (v < 0.12) {
        setParticleState('VOID');
        setActiveAct(0);
      } else if (v < 0.28) {
        setParticleState('NOISE');
        setActiveAct(1);
      } else if (v < 0.48) {
        setParticleState('NETWORK');
        setActiveAct(2);
      } else if (v < 0.70) {
        setParticleState('LOGO');
        setActiveAct(3);
      } else {
        setParticleState('CONSTELLATION');
        setActiveAct(4);
      }
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative bg-[#020305] text-white">
      {/* Universal Morphing Particle Field */}
      <ZenParticleField state={particleState} interactive={true} />

      {/* ACT 01: THE SILENT VOID */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center z-10 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400">
              GENESIS PROTOCOL
            </span>
          </div>

          <h1
            className="text-4xl sm:text-7xl font-bold tracking-tight text-white"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            ZENVITRA
          </h1>

          <p className="font-outfit text-sm sm:text-base text-neutral-400 max-w-sm mx-auto tracking-wide leading-relaxed">
            The screen responds to your motion. Scroll to begin the genesis sequence.
          </p>

          <div className="pt-8 flex flex-col items-center gap-2 text-neutral-600 animate-bounce">
            <span className="font-mono text-[9px] tracking-widest uppercase">DISCOVER</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </motion.div>
      </section>

      {/* ACT 02: THE FRACTURED NOISE */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center z-10">
        <div className="max-w-2xl space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-rose-400">
            ACT 02 // THE FRACTURE
          </span>
          <h2
            className="text-3xl sm:text-5xl font-bold text-white leading-tight uppercase"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            WE WERE CONNECTED.
            <br />
            <span className="text-neutral-500">BUT WERE WE TRULY TOGETHER?</span>
          </h2>
          <p className="font-outfit text-neutral-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Conversations scattered across corporate silos. Algorithms designed for outrage. Youth discourse reduced to ephemeral 5-second attention spans.
          </p>
        </div>
      </section>

      {/* ACT 03: THE SPATIAL AWAKENING */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center z-10">
        <div className="max-w-3xl space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
            ACT 03 // THE QUESTION
          </span>
          <h2
            className="text-3xl sm:text-6xl font-bold text-white uppercase tracking-tight"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            WHAT IF THE INTERNET
            <br />
            COULD FEEL <span className="text-cyan-400 underline decoration-cyan-400/40">HUMAN AGAIN</span>?
          </h2>
          <p className="font-outfit text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Not another feed to numb you. A sovereign operating universe for discourse, parliamentary caucuses, and real civic impact.
          </p>
        </div>
      </section>

      {/* ACT 04: THE FOUR WORLDS UNVEILED */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 py-24 z-10">
        <div className="max-w-5xl w-full space-y-12">
          <div className="text-center space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
              ACT 04 // SPATIAL WORLDS
            </span>
            <h2
              className="text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              ONE UNIVERSE. THREE SOVEREIGN SANCTUARIES.
            </h2>
            <p className="font-outfit text-sm sm:text-base text-neutral-400 max-w-lg mx-auto">
              Every environment designed with its own atmosphere, purpose, and gravity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* World 1: ZEN.PULSE */}
            <ZenSpatialCard maxTilt={8} glowColor="rgba(244, 63, 94, 0.15)">
              <div className="p-8 space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Radio className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-rose-400 block font-bold">
                    LIVING FLOW
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white">ZEN.PULSE</h3>
                  <p className="font-outfit text-xs text-neutral-300 leading-relaxed">
                    Zero-algorithm public square. Real-time topic constellation maps, Sparks dispatches, and vertical FLUX reels without corporate censorship.
                  </p>
                </div>
                <Link
                  href="/pulse"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-rose-400 hover:text-rose-300 transition"
                >
                  <span>EXPLORE PULSE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ZenSpatialCard>

            {/* World 2: ZEN.CHAMBER */}
            <ZenSpatialCard maxTilt={8} glowColor="rgba(167, 139, 250, 0.15)">
              <div className="p-8 space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-purple-400 block font-bold">
                    DECISION SANCTUARY
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white">ZEN.CHAMBER</h3>
                  <p className="font-outfit text-xs text-neutral-300 leading-relaxed">
                    Structured deliberation. Relational member graphs, spatial rooms (Discussion, Ideas, Polls), and automated Conversation Memory summaries.
                  </p>
                </div>
                <Link
                  href="/committee"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-400 hover:text-purple-300 transition"
                >
                  <span>ENTER CHAMBER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ZenSpatialCard>

            {/* World 3: ZEN.MUN */}
            <ZenSpatialCard maxTilt={8} glowColor="rgba(245, 158, 11, 0.15)">
              <div className="p-8 space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Crown className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-amber-400 block font-bold">
                    CONFERENCE OS
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white">ZEN.MUN</h3>
                  <p className="font-outfit text-xs text-neutral-300 leading-relaxed">
                    Complete Model UN operating system. Real-time speaker queues, Executive Board command center, and verified participation vectors.
                  </p>
                </div>
                <Link
                  href="/mun"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  <span>LAUNCH MUN OS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ZenSpatialCard>
          </div>
        </div>
      </section>

      {/* ACT 05: THE CONSTITUTIONAL MANDATE & GATE */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center z-10 py-20">
        <div className="max-w-2xl space-y-8">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
              <Shield className="w-3 h-3" />
              <span>THE 25% CONSTITUTIONAL ESCROW</span>
            </div>
            <h3
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Technology Rooted in Civic Trust
            </h3>
            <p className="font-outfit text-xs sm:text-sm text-neutral-300 leading-relaxed">
              25% of all net platform profits are permanently bound to student scholarships, classroom kits, and computer labs every four months—backed by public receipts and verifiable video proofs.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/pulse"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200 transition shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            >
              <span>ENTER THE UNIVERSE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="font-mono text-[10px] text-neutral-500 tracking-widest">
              ZENVITRA v1.0 • SOVEREIGN OPERATING ENVIRONMENT
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
