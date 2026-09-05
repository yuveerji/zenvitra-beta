'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Globe,
  Radio,
  Cpu,
  Layers,
  Sparkles,
  Milestone
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Navbar } from '@/components/layout/Navbar';
import { InteractiveWordHover } from '@/components/home/InteractiveWordHover';

export default function VisionPage() {
  const visionEpochs = [
    {
      epoch: 'PHASE I // GENESIS (2026)',
      heading: 'Sovereign Core & Pulse Deployment',
      termKey: 'pulse-protocol',
      description:
        'Establishing the zero-tracker social architecture (ZEN.PULSE), the independent journalistic dispatch wire (ZEN.PRESS), and launching the public 25% grant allocation ledger.',
    },
    {
      epoch: 'PHASE II // SCALING (2026 - 2027)',
      heading: 'Pan-National Summit Operating System',
      termKey: 'assembly-os',
      description:
        'Digitizing student diplomacy through the ZEN.EVENTS ecosystem, onboarding 150+ Model UN conferences, and upgrading 50+ government school smart labs across underserved regions.',
    },
    {
      epoch: 'PHASE III // MATURITY (2027+)',
      heading: 'Global Autonomous Youth Parliament',
      termKey: 'sovereignty',
      description:
        'Creating a decentralized, verifiable global youth legislative chamber producing binding policy research, global whitepapers, and funded humanitarian solutions.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden flex flex-col justify-between pt-16 sm:pt-20">
      <Navbar />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-sky-500/[0.05] to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-20 flex-1">
        {/* Title */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-400/[0.03] font-mono text-[10px] text-sky-300 uppercase tracking-widest">
            <Eye className="w-3 h-3" />
            <span>THE LONG-TERM HORIZON</span>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-6xl text-white tracking-tight leading-[1.05]">
            A{' '}
            <InteractiveWordHover termKey="sovereignty">
              <span className="underline decoration-sky-400/60 underline-offset-8 hover:decoration-sky-300 cursor-pointer transition">
                Sovereign World
              </span>
            </InteractiveWordHover>{' '}
            <br />
            Where Ideas <span className="font-serif italic font-normal text-neutral-200">Matter.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            We envision a digital and physical future where{' '}
            <InteractiveWordHover termKey="youth">
              <span className="text-white font-medium underline decoration-amber-400/50 underline-offset-4 hover:decoration-amber-300 cursor-pointer transition">
                young voices govern their own platforms
              </span>
            </InteractiveWordHover>
            , uncompromised by{' '}
            <InteractiveWordHover termKey="zero-surveillance">
              <span className="text-white font-medium underline decoration-purple-400/50 underline-offset-4 hover:decoration-purple-300 cursor-pointer transition">
                corporate monetization algorithms
              </span>
            </InteractiveWordHover>
            , and equipped with institutional-grade tools to enact{' '}
            <InteractiveWordHover termKey="meaningful-change">
              <span className="text-white font-medium underline decoration-cyan-400/50 underline-offset-4 hover:decoration-cyan-300 cursor-pointer transition">
                real global change
              </span>
            </InteractiveWordHover>.
          </p>
        </div>

        {/* Roadmap Epochs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
              STRATEGIC ROADMAP
            </span>
            <span className="font-mono text-[10px] text-neutral-500">2026 - 2028+</span>
          </div>

          <div className="space-y-4">
            {visionEpochs.map((item, idx) => (
              <SpotlightCard key={idx} className="p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-sky-400 tracking-wider">
                    {item.epoch}
                  </span>
                  <Milestone className="w-4 h-4 text-neutral-600" />
                </div>
                <h3 className="font-display font-medium text-xl text-white">
                  <InteractiveWordHover termKey={item.termKey}>
                    <span className="underline decoration-white/30 underline-offset-4 hover:decoration-white cursor-pointer transition">
                      {item.heading}
                    </span>
                  </InteractiveWordHover>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed font-sans">
                  {item.description}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Vision Manifesto Quote */}
        <div className="p-10 sm:p-14 rounded-[2.5rem] bg-[#07080b] border border-white/[0.09] text-center space-y-4">
          <p className="font-serif italic text-xl sm:text-2xl text-neutral-200 leading-snug max-w-2xl mx-auto">
            &ldquo;When you remove the noise of engagement algorithms, what remains is the pure intellect, passion, and collaborative genius of the youth.&rdquo;
          </p>
          <span className="font-mono text-xs text-neutral-500 block uppercase tracking-widest">
            — THE GENESIS COUNCIL, ZENVITRA
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
        <span>&copy; 2026 Zenvitra Foundation</span>
        <span className="uppercase tracking-widest text-neutral-400">FORWARD TELEMETRY</span>
      </footer>
    </div>
  );
}