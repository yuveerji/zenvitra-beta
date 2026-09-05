'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveTelemetryBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl mx-auto rounded-2xl glass-panel-glow p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
    >
      {/* Subtle animated gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 gradient-divider" />

      <div className="space-y-1.5 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-emerald-400 uppercase">
            NETWORK STATUS: OPERATIONAL
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight font-display">
          Sovereign mesh active. <span className="text-gradient-shimmer">Initializing global nodes.</span>
        </h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right font-mono text-[11px] text-neutral-400 gap-0.5">
          <div className="flex items-center gap-1.5 justify-end">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-neutral-300">CONSENSUS: 100%</span>
          </div>
          <span>LATENCY: &lt;12ms</span>
        </div>
        <Link
          href="/pulse"
          className="group px-6 py-3 rounded-xl bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-100 transition-all duration-300 flex items-center gap-2 btn-glow shadow-[0_0_30px_rgba(255,255,255,0.12)]"
        >
          <span>Enter Network</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}