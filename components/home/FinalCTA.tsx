'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 relative z-10 text-left">
      <div className="rounded-3xl bg-gradient-to-b from-[#0c0d14] via-[#08090d] to-[#030405] border border-white/15 p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative overflow-hidden">
        <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
            {(t as any)?.cta?.title || 'Be Part of the Beginning'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            {(t as any)?.cta?.desc ||
              'Join our waitlist and get early access, exclusive updates, and opportunities before anyone else.'}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
            {[
              { icon: Zap, label: 'Early Access' },
              { icon: Shield, label: 'Exclusive Updates' },
              { icon: Sparkles, label: 'Special Opportunities' },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-neutral-300 backdrop-blur-md"
                >
                  <Icon className="w-3 h-3 text-white" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-2.5 z-10">
          <Link href="/join">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-4 rounded-full bg-white text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:bg-neutral-200 transition cursor-pointer"
            >
              <span>{(t as any)?.cta?.button || 'Join the Waitlist'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <span className="text-[10px] font-mono text-neutral-500">
            No spam. Unsubscribe anytime.
          </span>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;