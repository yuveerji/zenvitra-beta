'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

interface ZenDiplomacyCoverProps {
  variant?: 'hero' | 'card' | 'compact';
  className?: string;
  showBadge?: boolean;
  interactive?: boolean;
  priority?: boolean;
}

export function ZenDiplomacyCover({
  variant = 'hero',
  className = '',
  showBadge = false,
  interactive = true,
}: ZenDiplomacyCoverProps) {
  // Deterministic starfield for crisp, zero-jitter cosmic background
  const stars = useMemo(() => {
    const starList = [];
    const count = variant === 'hero' ? 85 : 55;
    for (let i = 0; i < count; i++) {
      const x = ((i * 37 + 13) % 98) + 1;
      const y = ((i * 59 + 7) % 94) + 1;
      const size = (i % 5 === 0 ? 2.2 : i % 3 === 0 ? 1.6 : 1.0);
      const opacity = (0.35 + (i % 7) * 0.09).toFixed(2);
      const twinkle = i % 4 === 0;
      const delay = (i % 5) * 0.8;
      starList.push({ id: i, x, y, size, opacity, twinkle, delay });
    }
    return starList;
  }, [variant]);

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';

  return (
    <div
      className={`relative w-full overflow-hidden select-none bg-black text-white font-sans ${
        isHero
          ? 'aspect-[16/9] sm:aspect-[21/9] max-h-[540px] min-h-[380px]'
          : isCompact
          ? 'aspect-[16/9] min-h-[220px]'
          : 'aspect-[16/9] min-h-[280px]'
      } ${className}`}
    >
      {/* ── 1. DEEP SPACE GRADIENT BASE ── */}
      <div 
        className="absolute inset-0 bg-radial from-[#060814] via-[#020307] to-[#000000]"
        style={{
          background: 'radial-gradient(circle at 50% 70%, #0a0e1c 0%, #030408 55%, #000000 100%)'
        }}
      />

      {/* ── 2. COSMIC NEBULAR DUST CLOUDS ── */}
      <div 
        className="absolute top-0 left-0 w-1/2 h-full opacity-35 pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(ellipse at 15% 25%, rgba(140, 165, 210, 0.18) 0%, transparent 60%)'
        }}
      />
      <div 
        className="absolute top-0 right-0 w-1/3 h-2/3 opacity-25 pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 85% 20%, rgba(200, 220, 255, 0.15) 0%, transparent 55%)'
        }}
      />

      {/* ── 3. CRISP SVG COSMIC LAYER (Stars, Moon, Flares & Terrain) ── */}
      <svg
        viewBox="0 0 1200 675"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Planet Horizon Corona Glow */}
          <radialGradient id="sunburstCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="15%" stopColor="#FFF7E6" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#D9E6FF" stopOpacity="0.65" />
            <stop offset="65%" stopColor="#7F9CF5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Horizontal Lens Flare Gradient */}
          <linearGradient id="horizontalFlare" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="25%" stopColor="#A5B4FC" stopOpacity="0.2" />
            <stop offset="48%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#A5B4FC" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Planet Atmosphere Rim Gradient */}
          <linearGradient id="planetRimGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#C7D2FE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#030408" stopOpacity="0" />
          </linearGradient>

          {/* Moon Gradient */}
          <linearGradient id="moonCrescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#64748B" stopOpacity="0.1" />
          </linearGradient>

          {/* Metallic Typography Gradient */}
          <linearGradient id="silverTitleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="28%" stopColor="#F1F5F9" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="75%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* 4-Point Diamond Sparkle Symbol */}
          <g id="diamondStar">
            <path
              d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"
              fill="url(#silverTitleGrad)"
            />
            <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        </defs>

        {/* ── STARS ── */}
        <g className="stars-layer">
          {stars.map((s) => (
            <circle
              key={s.id}
              cx={`${s.x * 12}`}
              cy={`${s.y * 6.75}`}
              r={s.size}
              fill="#FFFFFF"
              opacity={s.opacity}
              className={s.twinkle && interactive ? 'animate-pulse' : ''}
              style={s.twinkle ? { animationDuration: `${2.5 + (s.id % 3)}s`, animationDelay: `${s.delay}s` } : undefined}
            />
          ))}
        </g>

        {/* ── CORNER / FLANK 4-POINT STARS (Exact match to original artwork) ── */}
        {/* Bottom-Right Prominent Diamond Star */}
        <g transform="translate(1090, 560) scale(1.1)" opacity="0.85">
          <use href="#diamondStar" />
          <circle cx="0" cy="0" r="14" fill="#FFFFFF" opacity="0.12" filter="blur(3px)" />
        </g>
        {/* Top-Left Subtle Diamond Star */}
        <g transform="translate(130, 110) scale(0.65)" opacity="0.55">
          <use href="#diamondStar" />
        </g>
        {/* Mid-Left Faint Star */}
        <g transform="translate(240, 280) scale(0.4)" opacity="0.4">
          <use href="#diamondStar" />
        </g>

        {/* ── TOP RIGHT CRESCENT MOON ── */}
        <g transform="translate(1090, 120)" opacity="0.9">
          {/* Faint Earthshine Body */}
          <circle cx="0" cy="0" r="48" fill="#0A0F1D" opacity="0.75" />
          <circle cx="0" cy="0" r="48" stroke="#1E293B" strokeWidth="0.75" fill="none" opacity="0.4" />
          
          {/* Realistic Crescent Moon Curve */}
          <path
            d="M 28 -39 A 48 48 0 0 1 28 39 A 46 46 0 0 0 28 -39 Z"
            fill="url(#moonCrescentGrad)"
            filter="drop-shadow(0 0 12px rgba(255,255,255,0.45))"
          />
          {/* Subtle Crater Pits on Crescent */}
          <circle cx="33" cy="-12" r="3" fill="#64748B" opacity="0.35" />
          <circle cx="36" cy="10" r="4.5" fill="#475569" opacity="0.3" />
          <circle cx="38" cy="0" r="2.5" fill="#64748B" opacity="0.4" />
          <circle cx="30" cy="22" r="2" fill="#475569" opacity="0.3" />
        </g>

        {/* ── CENTRAL SOLAR CORONA & SUNBURST FLARE (Behind Planet Crest) ── */}
        <g transform="translate(600, 435)">
          {/* Radial Corona Glow */}
          <circle cx="0" cy="0" r="280" fill="url(#sunburstCore)" opacity="0.75" />
          <circle cx="0" cy="0" r="140" fill="url(#sunburstCore)" opacity="0.95" />
          <circle cx="0" cy="0" r="45" fill="#FFFFFF" opacity="1" filter="blur(4px)" />

          {/* Vertical Solar Beam Pillar */}
          <polygon
            points="-18,0 18,0 8,-260 -8,-260"
            fill="url(#silverTitleGrad)"
            opacity="0.18"
            filter="blur(5px)"
          />
          <polygon
            points="-6,0 6,0 3,-300 -3,-300"
            fill="#FFFFFF"
            opacity="0.45"
            filter="blur(2px)"
          />

          {/* Wide Radiant Diagonal Rays */}
          <line x1="-350" y1="30" x2="350" y2="-30" stroke="#FFFFFF" strokeWidth="1" opacity="0.12" />
          <line x1="-280" y1="-50" x2="280" y2="50" stroke="#FFFFFF" strokeWidth="1" opacity="0.12" />
          <line x1="-120" y1="-200" x2="120" y2="200" stroke="#FFFFFF" strokeWidth="1" opacity="0.08" />

          {/* Razor Horizontal Lens Flare Streaks */}
          <rect
            x="-550"
            y="-1"
            width="1100"
            height="2"
            fill="url(#horizontalFlare)"
            opacity="0.85"
          />
          <rect
            x="-350"
            y="-3"
            width="700"
            height="6"
            fill="url(#horizontalFlare)"
            opacity="0.35"
            filter="blur(2px)"
          />
        </g>

        {/* ── THE MAJESTIC PLANETARY HORIZON ── */}
        <g>
          {/* Curving Planet Rim with Atmosphere Glow */}
          <path
            d="M -100 750 Q 600 405 1300 750 L 1300 750 L -100 750 Z"
            fill="#05070E"
          />
          
          {/* Atmospheric Rim Highlight Stroke */}
          <path
            d="M -100 750 Q 600 405 1300 750"
            fill="none"
            stroke="url(#planetRimGlow)"
            strokeWidth="3.5"
            opacity="0.9"
            filter="drop-shadow(0 0 10px rgba(255,255,255,0.7))"
          />

          {/* Secondary Soft Atmospheric Haze */}
          <path
            d="M -100 750 Q 600 403 1300 750"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="8"
            opacity="0.25"
            filter="blur(4px)"
          />

          {/* Dark Lunar Surface Relief & Craters */}
          <g opacity="0.18">
            <ellipse cx="600" cy="495" rx="35" ry="8" fill="#000000" stroke="#475569" strokeWidth="1" />
            <ellipse cx="520" cy="520" rx="48" ry="10" fill="#000000" stroke="#334155" strokeWidth="1" />
            <ellipse cx="680" cy="515" rx="55" ry="12" fill="#000000" stroke="#334155" strokeWidth="1" />
            <ellipse cx="440" cy="545" rx="60" ry="14" fill="#000000" stroke="#1E293B" strokeWidth="1" />
            <ellipse cx="760" cy="550" rx="70" ry="15" fill="#000000" stroke="#1E293B" strokeWidth="1" />
          </g>
        </g>

        {/* ── FOREGROUND JAGGED MOUNTAIN PEAKS & RIDGES ── */}
        <g opacity="0.95">
          {/* Distant Ridge Silhouette (Midground) */}
          <path
            d="M 0 675 L 0 610 L 45 595 L 95 620 L 160 580 L 230 635 L 310 590 L 380 625 L 490 645 L 710 645 L 820 620 L 890 585 L 970 630 L 1040 575 L 1110 615 L 1160 590 L 1200 615 L 1200 675 Z"
            fill="#090D18"
          />

          {/* Sharp Foreground Obsidian Rocks & Craters */}
          <path
            d="M 0 675 L 0 625 L 60 610 L 120 645 L 185 595 L 250 655 L 340 615 L 420 660 L 780 660 L 860 620 L 940 650 L 1020 590 L 1090 640 L 1150 605 L 1200 635 L 1200 675 Z"
            fill="#000000"
          />
          {/* Subtle rim highlight on rock edges */}
          <path
            d="M 0 625 L 60 610 L 120 645 L 185 595 L 250 655 M 940 650 L 1020 590 L 1090 640 L 1150 605 L 1200 635"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.2"
            opacity="0.3"
          />
        </g>
      </svg>

      {/* ── 4. OFFICIAL HIGH-DEFINITION VECTOR TYPOGRAPHY OVERLAY ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none">
        
        {/* TOP BRAND EMBLEM: ZENVITRA */}
        <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 transform translate-y-[-10px] sm:translate-y-[-16px]">
          {/* High-Resolution Monogram Icon */}
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(255,255,255,0.45)]">
            <Image
              src="/assets/logo.png"
              alt="Zenvitra Emblem"
              fill
              sizes="(max-width: 768px) 48px, 64px"
              priority={true}
              className="object-contain"
            />
          </div>

          {/* Tracked Wordmark */}
          <span className="font-mono text-[9px] sm:text-[11px] lg:text-xs font-bold tracking-[0.45em] sm:tracking-[0.55em] text-neutral-200 uppercase pl-[0.55em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            ZENVITRA
          </span>

          {/* Delicate Diamond Divider */}
          <div className="flex items-center gap-2 sm:gap-3 w-40 sm:w-56 justify-center opacity-80 pt-0.5">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
            <span className="text-[9px] sm:text-[11px] text-white">✦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          </div>
        </div>

        {/* MAIN HEADLINE: ZEN.DIPLOMACY MUN 2026 */}
        <div className="space-y-0.5 sm:space-y-1 my-1 sm:my-2">
          <h1
            className="font-serif font-black tracking-[0.04em] sm:tracking-[0.06em] uppercase leading-none text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 28%, #E2E8F0 50%, #CBD5E1 72%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 14px rgba(255,255,255,0.35)) drop-shadow(0 4px 30px rgba(0,0,0,0.9))',
              textShadow: '0 0 35px rgba(255,255,255,0.2)'
            }}
          >
            ZEN.DIPLOMACY
          </h1>
          <h2
            className="font-serif font-black tracking-[0.08em] sm:tracking-[0.1em] uppercase leading-none text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 40%, #CBD5E1 70%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 14px rgba(255,255,255,0.3)) drop-shadow(0 4px 25px rgba(0,0,0,0.9))'
            }}
          >
            MUN 2026
          </h2>
        </div>

        {/* SUBTITLE RULE & OFFICIAL DATE */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 w-full max-w-xl sm:max-w-2xl mt-2 sm:mt-4 opacity-90 px-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-white/70" />
          <span className="font-mono text-[9px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.35em] text-neutral-200 font-light uppercase whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            24TH AND 25TH OF OCTOBER 2026
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-neutral-300 to-white/70" />
        </div>
      </div>

      {/* ── 5. OPTIONAL FLOATING BADGES ── */}
      {showBadge && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            OFFICIAL ONLINE ASSEMBLY
          </span>
        </div>
      )}

      {/* Subtle Bottom Fade to match page backgrounds seamlessly */}
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-16 bg-gradient-to-t from-[#030407] to-transparent pointer-events-none" />
    </div>
  );
}
