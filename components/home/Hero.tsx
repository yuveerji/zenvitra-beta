'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PortalScene3D } from '@/components/visuals/PortalScene3D';
import { InteractiveWordHover } from '@/components/home/InteractiveWordHover';

export function Hero() {
  return (
    <section className="relative w-full flex items-center justify-center px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-10 bg-[#030405] text-white font-sans overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left max-w-2xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full border border-white/15 bg-[#0a0b10] text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>A YOUTH MOVEMENT. A GLOBAL IMPACT.</span>
          </div>

          {/* Calibrated Dynamic Clamped Headline: Guaranteed Single Line on all devices */}
          <h1 className="text-[clamp(1.85rem,5.8vw,4.25rem)] font-bold tracking-tight text-white leading-[1.08]">
            Meaningful Change <br />
            <span className="inline-block whitespace-nowrap">
              Starts With{' '}
              <span className="font-serif italic font-normal text-neutral-400">
                Truth and Youth.
              </span>
            </span>
          </h1>

          {/* Narrative Paragraph */}
          <div className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md">
            Zenvitra is a{' '}
            <InteractiveWordHover termKey="sovereignty">
              <span className="text-white font-medium underline decoration-cyan-400/40 underline-offset-4 hover:decoration-cyan-300 cursor-pointer transition">
                youth-driven ecosystem
              </span>
            </InteractiveWordHover>{' '}
            where ideas turn into dialogue, dialogue turns into collaboration, and collaboration creates{' '}
            <InteractiveWordHover termKey="escrow">
              <span className="text-white font-medium underline decoration-emerald-400/40 underline-offset-4 hover:decoration-emerald-300 cursor-pointer transition">
                real-world impact
              </span>
            </InteractiveWordHover>.
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <Link href="/join">
              <button
                type="button"
                className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                <span>Join the Waitlist</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              </button>
            </Link>

            <Link href="/why-zenvitra">
              <button
                type="button"
                className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full border border-white/15 bg-[#0e0f14] text-neutral-300 text-xs sm:text-sm font-light hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Portal Scene */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <PortalScene3D />
        </div>
      </div>
    </section>
  );
}

export default Hero;