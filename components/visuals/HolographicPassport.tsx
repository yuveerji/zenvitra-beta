'use client';

import React, { useState } from 'react';
import { ShieldCheck, QrCode, Cpu, Sparkles, Key, CheckCircle2 } from 'lucide-react';

interface HolographicPassportProps {
  delegateEmail: string;
  authCode: string;
  onFlip?: () => void;
}

export function HolographicPassport({
  delegateEmail,
  authCode,
  onFlip,
}: HolographicPassportProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div
      className="perspective-1000 w-full max-w-sm mx-auto cursor-pointer select-none"
      onClick={toggleFlip}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`relative w-full aspect-[1.586] rounded-2xl transition-transform duration-700 preserve-3d shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-amber-400/30 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c0f17] via-[#05070a] to-[#121824] p-5 flex flex-col justify-between backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Holographic Sheen Layer */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(217, 119, 6, 0.45) 0%, rgba(16, 185, 129, 0.25) 40%, transparent 70%)`,
            }}
          />

          {/* Micro Guilloche grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-300 block">
                  DIPLOMATIC PASSPORT
                </span>
                <span className="text-[9px] font-mono text-neutral-400">
                  REPUBLIC OF ZENVITRA
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              SOVEREIGN VALIDATED
            </span>
          </div>

          {/* Center Chip & NFC Signature */}
          <div className="relative z-10 flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              {/* Gold Chip Graphic */}
              <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/60 p-1 flex flex-col justify-between shadow-inner">
                <div className="flex justify-between border-b border-amber-700/40 pb-0.5">
                  <span className="h-1 w-2 bg-amber-700/40 rounded-xs" />
                  <span className="h-1 w-2 bg-amber-700/40 rounded-xs" />
                </div>
                <div className="flex justify-between">
                  <span className="h-1 w-2 bg-amber-700/40 rounded-xs" />
                  <span className="h-1 w-2 bg-amber-700/40 rounded-xs" />
                </div>
              </div>
              <div className="text-[10px] font-mono text-neutral-300 space-y-0.5">
                <div className="text-[8px] uppercase tracking-wider text-neutral-500">CLEARANCE ID</div>
                <div className="font-bold text-amber-300">{authCode}</div>
              </div>
            </div>

            <QrCode className="h-9 w-9 text-amber-400/80 p-0.5 bg-black/40 rounded-lg border border-white/10" />
          </div>

          {/* Footer Delegate Meta */}
          <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-2 font-mono">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-neutral-500 block">ENVOY / DELEGATE</span>
              <span className="text-[11px] font-semibold text-white truncate max-w-[190px] block">
                {delegateEmail}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8px] uppercase tracking-wider text-neutral-500 block">ACCESS TIER</span>
              <span className="text-[10px] text-amber-400 font-bold">SOVEREIGN OMNI</span>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#06080e] via-[#080b12] to-[#040608] p-5 flex flex-col justify-between backface-hidden rotate-y-180 border border-amber-400/20"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Micro Guilloche */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[9px]">
            <span>SECURITY CHIP: NXP-SOVEREIGN-V4</span>
            <span>RATIFIED: 2026</span>
          </div>

          {/* Magnetic Stripe / Machine-readable zone */}
          <div className="space-y-2">
            <div className="h-6 w-full bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 rounded border border-white/5 flex items-center px-2">
              <span className="text-[8px] font-mono tracking-widest text-neutral-500">
                |||||||||| ||||| |||||||||||||||| ||||||||
              </span>
            </div>
            <div className="font-mono text-[9px] text-neutral-400 leading-tight tracking-wider bg-black/40 p-2 rounded-lg border border-white/5">
              P&lt;ZENVITRA&lt;&lt;SOVEREIGN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              <br />
              ZV20261002&lt;IND990928M2610024&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06
            </div>
          </div>

          {/* Footer Warning */}
          <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500">
            <span>CLICK TO FLIP CARD</span>
            <span className="text-amber-400/80 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              ECC-256 SIGNED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
