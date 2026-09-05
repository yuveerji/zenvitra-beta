'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Target,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Scale,
  Award,
  Zap
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Navbar } from '@/components/layout/Navbar';
import { InteractiveWordHover } from '@/components/home/InteractiveWordHover';

export default function MissionPage() {
  const missionObjectives = [
    {
      code: 'OBJ-01',
      title: 'Dismantle Algorithmic Distortion',
      termKey: 'zero-surveillance',
      desc: 'Deliver digital communications and discourse tools that rely on authentic chronological timelines instead of engagement-bait or outrage algorithms.',
      icon: Zap,
    },
    {
      code: 'OBJ-02',
      title: 'Institutionalize Verified Meritocracy',
      termKey: 'meritocracy',
      desc: 'Ensure platform clearance, open dialogue, and community roles are awarded solely on research depth, verifiable sources, and authentic contributions.',
      icon: Award,
    },
    {
      code: 'OBJ-03',
      title: 'Deploy the 25% Profit Civic Mandate',
      termKey: 'escrow',
      desc: 'Permanently dedicate 25% of all net platform profits to student scholarships, study kits, and school computer labs—distributed every 4 months with unedited offline handover videos on ZEN.FLUX and public receipts.',
      icon: Scale,
    },
  ];

  const milestones = [
    { target: '100%', detail: 'Sovereign codebase with zero third-party behavioral trackers.' },
    { target: '25%', detail: '25% of all profits disbursed every 4 months with offline video proof and public receipts.' },
    { target: 'Zero', detail: 'External advertiser profiling or sale of student discourse data.' },
    { target: 'Global', detail: 'Accessible summit operating systems for schools and collegiate MUNs.' },
  ];

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden flex flex-col justify-between pt-16 sm:pt-20">
      <Navbar />

      {/* Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-amber-400/[0.05] to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Main Body */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-20 flex-1">
        {/* Title */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/[0.03] font-mono text-[10px] text-amber-300 uppercase tracking-widest">
            <Target className="w-3 h-3" />
            <span>OPERATIONAL CHARTER</span>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-6xl text-white tracking-tight leading-[1.05]">
            Our Defined <br />
            <span className="font-serif italic font-normal text-neutral-200">Mission.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            To construct, defend, and democratize a{' '}
            <InteractiveWordHover termKey="sovereignty">
              <span className="text-white font-medium underline decoration-amber-400/50 underline-offset-4 hover:decoration-amber-300 cursor-pointer transition">
                sovereign digital and civic ecosystem
              </span>
            </InteractiveWordHover>{' '}
            where{' '}
            <InteractiveWordHover termKey="youth">
              <span className="text-white font-medium underline decoration-cyan-400/50 underline-offset-4 hover:decoration-cyan-300 cursor-pointer transition">
                youth transform critical thinking
              </span>
            </InteractiveWordHover>{' '}
            with{' '}
            <InteractiveWordHover termKey="sources-and-senses">
              <span className="text-white font-medium underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300 cursor-pointer transition">
                senses and verifiable sources
              </span>
            </InteractiveWordHover>{' '}
            into{' '}
            <InteractiveWordHover termKey="meaningful-change">
              <span className="text-white font-medium underline decoration-purple-400/50 underline-offset-4 hover:decoration-purple-300 cursor-pointer transition">
                meaningful societal reform
              </span>
            </InteractiveWordHover>.
          </p>
        </div>

        {/* Strategic Objectives */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
              PRIMARY DIRECTIVES
            </span>
            <span className="font-mono text-[10px] text-neutral-500">CANONICAL TARGETS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missionObjectives.map((obj, i) => {
              const Icon = obj.icon;
              return (
                <SpotlightCard key={i} className="p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-amber-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                      {obj.code}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-medium text-base text-white">
                      <InteractiveWordHover termKey={obj.termKey}>
                        <span className="underline decoration-white/30 underline-offset-4 hover:decoration-white cursor-pointer transition">
                          {obj.title}
                        </span>
                      </InteractiveWordHover>
                    </h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed font-sans">
                      {obj.desc}
                    </p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

        {/* Milestone Invariants */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#07080b] border border-white/[0.09] space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
              MEASURABLE ACCOUNTABILITY
            </span>
            <h2 className="font-display font-medium text-2xl text-white">
              The Constitutional Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                <span className="font-display font-medium text-3xl text-white block">
                  {m.target}
                </span>
                <p className="text-[11px] text-neutral-400 font-sans font-light leading-snug">
                  {m.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
        <span>&copy; 2026 Zenvitra Foundation</span>
        <span className="uppercase tracking-widest text-neutral-400">THE 25% IMPACT PRINCIPLE</span>
      </footer>
    </div>
  );
}