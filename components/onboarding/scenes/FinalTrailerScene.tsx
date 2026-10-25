'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, LayoutDashboard, Radio } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FinalTrailerSceneProps {
  onComplete: (targetRoute?: string) => void;
}

export function FinalTrailerScene({ onComplete }: FinalTrailerSceneProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500); // THIS ISN'T JUST A WEBSITE
    const t2 = setTimeout(() => setPhase(2), 1700); // IT'S A PLACE TO PARTICIPATE
    const t3 = setTimeout(() => setPhase(3), 2700); // TO CREATE
    const t4 = setTimeout(() => setPhase(4), 3600); // TO DEBATE
    const t5 = setTimeout(() => setPhase(5), 4500); // TO CONNECT
    const t6 = setTimeout(() => setPhase(6), 5400); // TO LEAD
    const t7 = setTimeout(() => setPhase(7), 6500); // Final ZENVITRA reveal

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[500px] flex flex-col items-center justify-center text-center px-4 py-8 select-none">
      {/* Background ambient deep pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Kinetic Text Stack Before Final Logo Reveal */}
      {phase < 7 ? (
        <div className="space-y-4 max-w-2xl">
          {phase >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-lg sm:text-2xl font-mono text-neutral-400 tracking-wider uppercase"
            >
              THIS ISN&apos;T JUST A WEBSITE.
            </motion.p>
          )}

          {phase >= 2 && (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-4xl font-black font-display text-white uppercase tracking-tight"
            >
              IT&apos;S A PLACE TO PARTICIPATE.
            </motion.p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {phase >= 3 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xl sm:text-3xl font-black font-display text-cyan-400 uppercase tracking-tight"
              >
                TO CREATE.
              </motion.span>
            )}

            {phase >= 4 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xl sm:text-3xl font-black font-display text-emerald-400 uppercase tracking-tight"
              >
                TO DEBATE.
              </motion.span>
            )}

            {phase >= 5 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xl sm:text-3xl font-black font-display text-purple-400 uppercase tracking-tight"
              >
                TO CONNECT.
              </motion.span>
            )}
          </div>

          {phase >= 6 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pt-6"
            >
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase bg-gradient-to-r from-amber-300 via-rose-400 to-cyan-300 bg-clip-text text-transparent">
                TO LEAD.
              </h2>
            </motion.div>
          )}

          {/* Skip animation button */}
          <div className="pt-8">
            <button
              type="button"
              onClick={() => setPhase(7)}
              className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 uppercase tracking-widest cursor-pointer transition"
            >
              Fast-Forward &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* Final ZENVITRA Reveal State */
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 max-w-2xl"
        >
          {/* Emblem with Official Logo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-amber-400 p-[2px] shadow-[0_0_50px_rgba(6,182,212,0.4)] mx-auto">
            <div className="w-full h-full rounded-[22px] bg-[#07090e] flex items-center justify-center p-3 sm:p-3.5">
              <img
                src="/assets/logo.png"
                alt="Zenvitra Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white uppercase leading-none">
              WELCOME TO <span className="bg-gradient-to-r from-white via-cyan-200 to-neutral-400 bg-clip-text text-transparent">ZENVITRA.</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.3em] uppercase text-cyan-400">
              BY YOUTH. FOR YOUTH.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-md mx-auto leading-relaxed">
            Your credentials are live. The chambers are open. Your sovereign journey begins now.
          </p>

          {/* Final Action CTAs */}
          <div className="pt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/what-is-zenvitra"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#C5A46D] via-[#DFBA73] to-[#C5A46D] hover:opacity-95 text-[#08090C] font-display font-black text-xs sm:text-sm tracking-wide shadow-[0_0_30px_rgba(197,164,109,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#08090C]" />
              <span>WHAT IS ZENVITRA? (READ CHARTER)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => onComplete('/pulse')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-display font-black text-xs sm:text-sm tracking-wide shadow-[0_0_40px_rgba(6,182,212,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>ENTER ZENVITRA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => onComplete('/dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 text-white font-mono text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPLORE DASHBOARD</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
