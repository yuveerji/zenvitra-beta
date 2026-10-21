'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Orbit, 
  Layers, 
  Maximize2,
  RefreshCw
} from 'lucide-react';

interface TestNodeOrbProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onEnter?: () => void;
}

const MATRIX_STRINGS = [
  'const TEST_NODE = new SovereignSandbox();',
  'initCommittee("UNSC", { delegates: 15, quorum: "2/3" });',
  'cashfree.simulateCheckout({ mode: "SANDBOX_MOCK", fee: 1499 });',
  'dispatchGavelStrike({ sound: true, motionId: "M-402" });',
  'verifyPassportToken("PASSPORT-FRA-9921", "MOCK_VALID");',
  'generateClause("Operative 1: Cryptographic Safeguards");',
  'auditTrail.log("SEC-GEN Directive Emitted", { mock: true });',
  'zenChamber.telemetry({ latency: "0.4ms", isolated: true });',
];

export function TestNodeOrb({ size = 'lg', interactive = true, onEnter }: TestNodeOrbProps) {
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCodeLine((prev) => (prev + 1) % MATRIX_STRINGS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72',
    lg: 'w-80 h-80 sm:w-96 sm:h-96',
  }[size];

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      {/* Outer Glow Halo */}
      <div
        className={`absolute rounded-full transition-all duration-700 pointer-events-none ${
          isHovered
            ? 'w-[420px] h-[420px] bg-cyan-500/25 blur-[120px]'
            : 'w-80 h-80 bg-cyan-500/15 blur-[90px]'
        }`}
      />
      <div className="absolute w-72 h-72 bg-purple-600/15 blur-[100px] pointer-events-none rounded-full" />

      {/* 3D Orbiting Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative ${sizeClasses} rounded-full flex items-center justify-center p-3 cursor-pointer perspective-[1000px]`}
        onClick={onEnter}
      >
        {/* Ring 1 - Equator */}
        <div
          className="absolute inset-0 rounded-full border border-cyan-400/40 animate-spin"
          style={{
            animationDuration: isHovered ? '8s' : '18s',
            borderStyle: 'dashed',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.3)',
          }}
        />

        {/* Ring 2 - Polar Latitude */}
        <div
          className="absolute inset-3 rounded-full border border-purple-400/30"
          style={{
            animation: 'spin 24s linear infinite reverse',
            transform: 'rotateX(65deg) rotateY(25deg)',
          }}
        />

        {/* Ring 3 - Meridian Longitudinal */}
        <div
          className="absolute inset-6 rounded-full border border-teal-300/30"
          style={{
            animation: 'spin 16s linear infinite',
            transform: 'rotateX(25deg) rotateY(65deg)',
          }}
        />

        {/* Core Spherical Orb Body */}
        <div className="relative w-4/5 h-4/5 rounded-full bg-gradient-to-br from-[#0c1324] via-[#050811] to-[#020306] border border-cyan-400/50 shadow-[inset_0_0_40px_rgba(6,182,212,0.4),0_0_50px_rgba(6,182,212,0.25)] flex flex-col items-center justify-center overflow-hidden p-6 text-center">
          {/* Holographic Wireframe Grid Overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, rgba(6,182,212,0.4) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Internal Plasma Energy Wave */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.35, 0.6, 0.35],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: 'easeInOut',
            }}
            className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 blur-2xl pointer-events-none"
          />

          {/* Center Orb Content: Floating Code & Telemetry */}
          <div className="relative z-10 space-y-2 max-w-[220px]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[9px] font-mono text-cyan-300 uppercase tracking-widest font-bold">
              <Orbit className="w-3 h-3 text-cyan-400 animate-spin" />
              <span>TEST NODE ORB</span>
            </div>

            <div className="text-sm sm:text-base font-black text-white font-display tracking-tight uppercase leading-tight">
              ISOLATED SANDBOX
            </div>

            {/* Cycling Matrix Code */}
            <div className="h-9 flex items-center justify-center">
              <div className="text-[10px] font-mono text-cyan-300/90 bg-black/60 px-2 py-1 rounded-lg border border-cyan-500/30 font-semibold truncate max-w-[210px]">
                {MATRIX_STRINGS[activeCodeLine]}
              </div>
            </div>

            <div className="text-[9px] font-mono text-neutral-400">
              STATUS: <span className="text-emerald-400 font-bold">SEPARATE ENCLAVE</span>
            </div>
          </div>

          {/* Shimmer Scanline */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none"
            style={{
              animation: 'pulse 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Floating Satellites (Tiny Nodes) */}
        <div
          className="absolute -top-1 right-8 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-ping"
          style={{ animationDuration: '3s' }}
        />
        <div className="absolute -bottom-1 left-8 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" />
      </div>

      {/* Orb Label / Microcopy */}
      <div className="mt-4 text-center space-y-1">
        <span className="text-xs font-mono text-cyan-400 font-bold flex items-center justify-center gap-1.5">
          <span>SPHERICAL PARALLEL ENVIRONMENT</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
        </span>
        <p className="text-[11px] text-neutral-400 font-sans max-w-xs">
          Click the Orb to launch the isolated Test Node sandbox without touching production records.
        </p>
      </div>
    </div>
  );
}

export default TestNodeOrb;
