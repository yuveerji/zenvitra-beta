'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function MonolithCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue<number>(0);
  const y = useMotionValue<number>(0);

  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);

  // Smooth spring physics for 3D card tilt
  const springConfig = { damping: 26, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  // Parallax artwork translation
  const parallaxX = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  const parallaxY = useSpring(useTransform(y, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const currentMouseX = e.clientX - rect.left;
    const currentMouseY = e.clientY - rect.top;

    mouseX.set(currentMouseX);
    mouseY.set(currentMouseY);

    const normalizedX = currentMouseX / width - 0.5;
    const normalizedY = currentMouseY / height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-[4/5.2] select-none mx-auto py-2"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full rounded-[2.2rem] bg-[#050608] border border-white/15 p-7 sm:p-8 flex flex-col justify-between overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] hover:shadow-[0_0_50px_rgba(255,255,255,0.12)] transition-shadow duration-300 group cursor-pointer"
      >
        {/* Dynamic Cursor Spotlight Radial Glow Sheen */}
        <motion.div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-20 opacity-0 group-hover:opacity-100"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([latestX, latestY]) =>
                `radial-gradient(450px circle at ${latestX}px ${latestY}px, rgba(255, 255, 255, 0.16), transparent 75%)`
            ),
          }}
        />

        {/* Full-Bleed Monolith Artwork with Parallax Translation */}
        <motion.div
          style={{
            x: parallaxX,
            y: parallaxY,
            scale: 1.05,
          }}
          className="absolute inset-0 z-0 select-none pointer-events-none"
        >
          <Image
            src="/assets/hero-monolith.png"
            alt="Zenvitra Monolith Portal"
            fill
            priority
            className="object-cover object-center brightness-[0.95] contrast-[1.06] group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Obsidian Gradient Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
        </motion.div>

        {/* Top Header Layer */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="relative z-10 flex items-start justify-between pointer-events-none"
        >
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black text-sm text-white tracking-tighter">Z</span>
              <span className="font-display font-medium text-xs tracking-[0.22em] text-white">
                ZENVITRA
              </span>
            </div>
            <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.24em] text-neutral-300 leading-snug uppercase">
              <p>DIALOGUE.</p>
              <p>DEBATE.</p>
              <p>IMPACT.</p>
            </div>
          </div>

          {/* Archetype Pill Button */}
          <div className="px-3.5 py-1 rounded-full border border-white/15 bg-black/60 backdrop-blur-md shadow-sm">
            <span className="text-[9px] font-mono tracking-[0.22em] text-neutral-200 uppercase font-medium">
              ARCHETYPE 01
            </span>
          </div>
        </div>

        {/* Bottom Left-Aligned Status Block */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="relative z-10 flex flex-col items-start gap-2 text-left pb-1 pointer-events-none"
        >
          {/* Status Badge with Emerald Light */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/15 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.2em] text-neutral-300 uppercase font-medium">
              STATUS
            </span>
          </div>

          {/* Left-Aligned Status Text */}
          <h3 className="font-mono font-medium text-[11px] sm:text-[12px] tracking-[0.28em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            SOVEREIGN PORTAL ACTIVE
          </h3>
        </div>
      </motion.div>
    </div>
  );
}