'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

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
  priority = false,
}: ZenDiplomacyCoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);
  const normX = useMotionValue<number>(0);
  const normY = useMotionValue<number>(0);

  const springConfig = { damping: 26, stiffness: 200, mass: 0.5 };

  // Smooth 3D tilt movement on cursor interaction
  const rotateX = useSpring(useTransform(normY, [-0.5, 0.5], [3.5, -3.5]), springConfig);
  const rotateY = useSpring(useTransform(normX, [-0.5, 0.5], [-3.5, 3.5]), springConfig);

  // Subtle artwork parallax shift
  const parallaxX = useSpring(useTransform(normX, [-0.5, 0.5], [-6, 6]), springConfig);
  const parallaxY = useSpring(useTransform(normY, [-0.5, 0.5], [-5, 5]), springConfig);

  const cursorLight = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(450px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.16) 0%, rgba(34, 211, 238, 0.09) 35%, transparent 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    mouseX.set(currentX);
    mouseY.set(currentY);

    normX.set(currentX / rect.width - 0.5);
    normY.set(currentY / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    normX.set(0);
    normY.set(0);
  };

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className={`relative w-full overflow-hidden select-none bg-black text-white ${
        isHero
          ? 'aspect-[16/9] sm:aspect-[21/9] max-h-[540px] min-h-[380px]'
          : isCompact
          ? 'aspect-[16/9] min-h-[220px]'
          : 'aspect-[16/9] min-h-[280px]'
      } ${className}`}
    >
      {/* ── THE ORIGINAL PRISTINE HIGH-RESOLUTION MASTER ARTWORK ── */}
      <motion.div
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          x: interactive ? parallaxX : 0,
          y: interactive ? parallaxY : 0,
          scale: interactive ? 1.025 : 1,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full"
      >
        <Image
          src="/assets/zen-diplomacy-mun-2026.png"
          alt="ZEN.DIPLOMACY MUN 2026 - 24th and 25th of October 2026"
          fill
          priority={priority || isHero}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1600px"
          quality={100}
          className="object-cover object-center"
        />

        {/* ── DYNAMIC MOUSE CURSOR LIGHT SPOTLIGHT SHEEN ── */}
        {interactive && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: cursorLight,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </motion.div>

      {/* ── OPTIONAL FLOATING BADGES ── */}
      {showBadge && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            OFFICIAL ONLINE ASSEMBLY
          </span>
        </div>
      )}

      {/* Subtle Bottom Fade into dark background */}
      <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-[#050711] to-transparent pointer-events-none" />
    </div>
  );
}
