'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function PortalScene3D() {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue<number>(0);
  const y = useMotionValue<number>(0);

  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);

  // Subtle spring physics - strictly calibrated max 4.5 degree tilt
  const springConfig = { damping: 26, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4.5, -4.5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4.5, 4.5]), springConfig);

  // Parallax depth
  const parallaxX = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);
  const parallaxY = useSpring(useTransform(y, [-0.5, 0.5], [-6, 6]), springConfig);

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
      style={{ perspective: 1400 }}
      className="relative w-full max-w-[440px] sm:max-w-[480px] mx-auto py-4"
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
        className="relative rounded-[32px] overflow-hidden border border-white/15 bg-[#08090d] shadow-[0_25px_80px_rgba(0,0,0,0.95)] cursor-pointer group select-none transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]"
      >
        <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
          {/* Monolith Artwork with Parallax Translation */}
          <motion.img
            src="/images/hero-monolith.jpg"
            alt="Zenvitra Monolith Portal"
            style={{
              x: parallaxX,
              y: parallaxY,
              scale: 1.04,
            }}
            className="w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Interactive Dynamic Spotlight Sheen */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([latestX, latestY]) =>
                  `radial-gradient(350px circle at ${latestX}px ${latestY}px, rgba(255,255,255,0.14), transparent 75%)`
              ),
            }}
          />

          {/* Top Telemetry Overlay */}
          <div
            style={{ transform: 'translateZ(20px)' }}
            className="absolute top-6 left-6 right-6 flex items-start justify-between z-10 pointer-events-none"
          >
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 4h18v3.5L8.5 16.5H21V20H3v-3.5L15.5 7.5H3V4z" />
                </svg>
                <span className="text-[11px] font-bold tracking-[0.25em] text-white uppercase">
                  ZENVITRA
                </span>
              </div>
              <div className="text-[8px] font-mono tracking-widest text-neutral-400 space-y-0.5 pt-0.5">
                <div>DIALOGUE.</div>
                <div>DEBATE.</div>
                <div>IMPACT.</div>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[9px] font-mono tracking-[0.2em] text-neutral-300 backdrop-blur-md">
              ARCHETYPE 01
            </div>
          </div>

          {/* Bottom Telemetry Status */}
          <div
            style={{ transform: 'translateZ(18px)' }}
            className="absolute bottom-6 left-6 z-10 flex flex-col items-start gap-2 text-left pointer-events-none"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_#ffffff]" />
              <span className="text-[9px] font-mono tracking-widest text-white font-bold uppercase">
                STATUS
              </span>
            </div>
            <div className="text-xs font-mono font-bold tracking-[0.25em] text-white uppercase">
              PORTAL OPENING SOON
            </div>
          </div>

          {/* Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}

export default PortalScene3D;