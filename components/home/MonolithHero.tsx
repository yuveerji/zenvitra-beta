'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

export default function MonolithCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setRotate({ x: rotateX, y: rotateY });
    setGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlow((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto aspect-[4/5] select-none"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative w-full h-full rounded-2xl bg-[#08090c] border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] group"
      >
        {/* Dynamic Cursor Radial Glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
          style={{
            opacity: glow.opacity,
            background: `radial-gradient(400px circle at ${glow.x}% ${glow.y}%, rgba(255, 255, 255, 0.12), transparent 80%)`,
          }}
        />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ZENVITRA
            </span>
            <p className="font-mono text-[9px] tracking-widest text-neutral-400">
              DIALOGUE. DEBATE. IMPACT.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.04] text-[9px] font-mono text-neutral-300 uppercase tracking-widest">
            CORE OS v1.0
          </span>
        </div>

        {/* Central Monolith Visual Portal */}
        <div className="relative w-full flex-1 my-3 rounded-lg overflow-hidden border border-white/5 bg-black">
          <Image
            src="/assets/hero-monolith.png"
            alt="Zenvitra Monolith"
            fill
            priority
            className="object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent opacity-80" />
        </div>

        {/* Card Bottom Status */}
        <div className="relative z-10 w-full py-2.5 px-3 rounded-lg bg-black/80 border border-white/10 backdrop-blur-md flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>NETWORK PROTOCOLS ONLINE</span>
        </div>
      </div>
    </div>
  );
}