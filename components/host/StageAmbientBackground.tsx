'use client';

import React from 'react';

interface StageAmbientBackgroundProps {
  theme?: 'host' | 'mun' | 'display' | 'dais';
}

export default function StageAmbientBackground({ theme = 'host' }: StageAmbientBackgroundProps) {
  const isMun = theme === 'mun';
  const isDisplay = theme === 'display';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
      {/* ── 1. RAZOR HORIZON LASER BEAM (TOP EDGE GLOW) ── */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1.5px] z-50 ${
          isMun
            ? 'bg-gradient-to-r from-transparent via-amber-400/90 via-yellow-300/80 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.8)]'
            : 'bg-gradient-to-r from-transparent via-cyan-400/90 via-teal-300/80 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.8)]'
        }`}
      />

      {/* ── 2. THEATRICAL OVERHEAD STAGE CONE (AUDITORIUM SPOTLIGHT) ── */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] blur-[120px] transition-all duration-1000 ${
          isMun
            ? 'opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.45),rgba(217,119,6,0.15),transparent_70%)]'
            : isDisplay
            ? 'opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.5),rgba(6,182,212,0.25),transparent_70%)]'
            : 'opacity-35 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.4),rgba(20,184,166,0.18),rgba(245,158,11,0.1),transparent_70%)]'
        }`}
      />

      {/* ── 3. FLOATING AURORA DRIFT ORBS ── */}
      {/* Top Left Sphere (Cyan / Teal) */}
      <div
        className={`absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full blur-[130px] opacity-25 animate-[pulse_8s_ease-in-out_infinite] ${
          isMun ? 'bg-amber-600/30' : 'bg-cyan-500/35'
        }`}
      />

      {/* Bottom Right Sphere (Warm Gold / Amber) */}
      <div
        className={`absolute -bottom-32 -right-20 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 animate-[pulse_10s_ease-in-out_infinite] ${
          isMun ? 'bg-orange-500/35' : 'bg-amber-500/30'
        }`}
      />

      {/* Center Deep Ambient Glow (Indigo / Violet depth) */}
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[400px] rounded-full blur-[160px] opacity-15 bg-indigo-600/25 pointer-events-none" />

      {/* ── 4. ARCHITECTURAL PERSPECTIVE CEILING & FLOOR TECH-GRID ── */}
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_50%,transparent_100%)]" />

      {/* ── 5. MICRO-STARDUST / CONSTELLATION DOT MATRIX ── */}
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]" />

      {/* ── 6. VIGNETTE DARK OBSIDIAN BORDER DROP ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,3,7,0.7)_85%,rgba(1,2,5,0.95)_100%)] pointer-events-none" />
    </div>
  );
}
