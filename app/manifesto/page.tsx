'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  ScrollText, 
  Newspaper,
  Flame,
  Radio,
  BookOpen,
  Globe2,
  CheckCircle2,
  Lock,
  Layers,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { EnterZenvitraButton } from '@/components/ui/EnterZenvitraButton';
import { Navbar } from '@/components/layout/Navbar';
import { InteractiveWordHover } from '@/components/home/InteractiveWordHover';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden pt-16 sm:pt-20">
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* ── Main Manifesto Content ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-28 text-left">
        
        {/* 1. MASTER STATEMENT */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <p className="text-xs uppercase font-mono tracking-[0.34em] text-neutral-400">
              The Declaration
            </p>
            <div className="h-px w-24 bg-white/20" />
          </div>

          <div className="space-y-4">
            <h1 className="font-display font-black text-6xl sm:text-8xl lg:text-9xl text-white tracking-tight leading-[0.88] uppercase">
              WE WERE
              <br />
              GIVEN
              <br />
              OPINIONS.
            </h1>
            <h2 className="font-serif italic font-light text-5xl sm:text-7xl lg:text-8xl text-neutral-300 leading-[0.92] tracking-tight">
              Not enough
              <br />
              platforms.
            </h2>
          </div>

          <div className="pt-10 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 text-neutral-400 font-sans text-sm sm:text-base leading-relaxed">
            <div className="lg:col-span-4">
              <div className="font-mono text-xs text-white uppercase tracking-wider leading-relaxed">
                Zenvitra exists because conversations shaping the future deserve{' '}
                <InteractiveWordHover termKey="truth-and-youth">
                  <span className="text-white underline decoration-amber-400/50 underline-offset-4 hover:decoration-amber-300 cursor-pointer transition">
                    youth participation
                  </span>
                </InteractiveWordHover>.
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4 font-light">
              <div>
                Most platforms reward outrage, polarization, and{' '}
                <InteractiveWordHover termKey="zero-surveillance">
                  <span className="underline decoration-purple-400/50 underline-offset-4 hover:decoration-purple-300 cursor-pointer transition">
                    algorithmic noise
                  </span>
                </InteractiveWordHover>.
              </div>
              <p>
                Nuanced discussions are buried beneath performance and engagement cycles.
              </p>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="text-white font-light">
                Zenvitra was built to preserve{' '}
                <InteractiveWordHover termKey="meaningful-change">
                  <span className="text-white font-medium underline decoration-purple-400/50 underline-offset-4 hover:decoration-purple-300 cursor-pointer transition">
                    meaningful change
                  </span>
                </InteractiveWordHover>{' '}
                through open dialogue, documentation, and permanent public memory.
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHY WE EXIST */}
        <section className="space-y-8 p-8 sm:p-12 rounded-3xl bg-[#08080a] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-300 font-bold">
              Why We Exist
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight">
              THE INTERNET GAVE EVERYONE A VOICE. <br />
              <span className="text-[#efe7dc] font-serif italic font-normal">NOT ENOUGH SPACE TO THINK.</span>
            </h2>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed font-light font-sans">
            <p>
              Modern discourse rewards speed, outrage, polarization, and performance. Thoughtful participation is buried beneath algorithms optimized for engagement, reactions, and attention cycles.
            </p>
            <div>
              <InteractiveWordHover termKey="youth">
                <span className="text-white font-medium underline decoration-amber-400/50 underline-offset-4 hover:decoration-amber-300 cursor-pointer transition">
                  Young people
                </span>
              </InteractiveWordHover>{' '}
              are constantly asked to inherit the future while being excluded from shaping conversations around it.
            </div>
            <div className="text-emerald-400 font-medium">
              We did not build Zenvitra to become another platform competing for attention. We built it to preserve{' '}
              <InteractiveWordHover termKey="meaningful-change">
                <span className="underline decoration-emerald-400/60 underline-offset-4 hover:decoration-emerald-300 cursor-pointer transition">
                  meaningful participation
                </span>
              </InteractiveWordHover>.
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
            <SpotlightCard paddingClassName="p-5">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">01 // FORUM</span>
                <h3 className="font-display font-medium text-lg text-white">Discussions</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  Open discussions that encourage nuance, disagreement, participation, and critical thought.
                </p>
              </div>
            </SpotlightCard>
            <SpotlightCard paddingClassName="p-5">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">02 // ARCHIVE</span>
                <h3 className="font-display font-medium text-lg text-white">Documentation</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  Public archives preserving discussions, resolutions, articles, and civic participation as permanent records.
                </p>
              </div>
            </SpotlightCard>
            <SpotlightCard paddingClassName="p-5">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">03 // CIVIC</span>
                <h3 className="font-display font-medium text-lg text-white">Participation</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  A platform where youth participation becomes visible, documented, collaborative, and publicly accessible.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* 3. THE PROBLEM */}
        <section className="space-y-10">
          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
              The Problem
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight">
              EVERYONE TALKS ABOUT THE FUTURE. <br />
              <span className="text-[#efe7dc] font-serif italic font-normal">VERY FEW BUILD IT PUBLICLY.</span>
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed font-light font-sans">
            <p>
              Public discourse today is fragmented into trends, outrage cycles, political branding, and short-form reactions. Platforms are optimized for visibility, not understanding.
            </p>
            <p>
              Most conversations disappear within hours. The few that survive are often reduced to performance instead of participation. Narrow discourse creates narrow participation.
            </p>
            <p className="text-white font-medium">
              We are not interested in covering only one issue, one ideology, or one kind of conversation. Every issue affecting young people deserves participation, documentation, and public discussion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <SpotlightCard paddingClassName="p-6">
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-purple-300 uppercase font-bold">Algorithms</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  Most online systems reward speed, outrage, virality, and emotional reaction over depth and nuance.
                </p>
              </div>
            </SpotlightCard>
            <SpotlightCard paddingClassName="p-6">
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-cyan-300 uppercase font-bold">Institutions</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  Young people are expected to inherit political, cultural, and economic systems while remaining excluded from shaping them.
                </p>
              </div>
            </SpotlightCard>
            <SpotlightCard paddingClassName="p-6">
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-emerald-300 uppercase font-bold">Participation</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  Participation should not disappear after conferences, discussions, debates, or temporary online trends.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* 4. THE COCKROACH PHILOSOPHY */}
        <section className="space-y-10 p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#18132c]/85 to-[#0b0916]/95 border border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(168,85,247,0.12)] relative overflow-hidden">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>THE COCKROACH PHILOSOPHY</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.92] uppercase">
              THEY CALL IT RESILIENCE WHEN INSTITUTIONS DO IT. <br />
              <span className="text-amber-300 font-serif italic font-normal">THEY CALL IT A PROBLEM WHEN YOUTH DOES.</span>
            </h2>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed font-light font-sans">
            <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-white font-mono text-sm">
              <p className="font-bold text-amber-300">Why the cockroach?</p>
              <p>Because cockroaches survive systems designed to eliminate them.</p>
              <p>Because they adapt. Because they persist. Because they refuse to disappear.</p>
              <p className="text-neutral-400">
                Because no matter how many times they are ignored, pushed away, stepped on, mocked, dismissed, or treated as insignificant — <strong>they return.</strong>
              </p>
            </div>

            <p className="text-white font-semibold text-lg font-display">
              This is not branding. This is symbolism.
            </p>

            <p>
              Young people are constantly told they are &ldquo;the future&rdquo; while being denied influence over the present. Institutions ask for participation only when it is convenient, marketable, or politically useful.
            </p>
            <p>
              The moment participation becomes disruptive, uncomfortable, independent, or difficult to control — it becomes unwanted.
            </p>
            <p>
              Entire systems are built to make people feel temporary. Conversations disappear. Movements dissolve. Attention shifts. Algorithms move on. Public memory becomes shorter every single year.
            </p>
            <p className="text-white font-medium">
              The cockroach symbolizes the opposite of disappearance. It survives hostile environments. It survives neglect. It survives systems designed to erase it. And that is exactly why it matters to us.
            </p>
            <p>
              Zenvitra is built on the belief that participation should persist beyond trends, beyond outrage cycles, beyond institutions deciding when youth voices are acceptable.
            </p>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 font-mono text-xs text-purple-200">
              You can suppress participation. You can ignore a generation. You can reduce discourse into spectacle. But eventually, people build platforms of their own.
            </div>
          </div>
        </section>

        {/* 5. PARTICIPATION SHOULD NOT REQUIRE PERMISSION */}
        <section className="space-y-10">
          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
              Public Infrastructure
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight">
              PARTICIPATION SHOULD NOT REQUIRE PERMISSION.
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl font-light font-sans">
              Zenvitra is designed as public infrastructure for participation. Not a closed institution. Not a gatekept publication. Not a platform dependent on proximity, influence, or political convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard paddingClassName="p-6">
              <div className="space-y-3">
                <span className="font-mono text-2xl font-bold text-purple-300">01</span>
                <h3 className="font-display font-medium text-lg text-white">Discuss</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  Participate in open conversations around politics, education, media, culture, governance, technology, and issues shaping everyday life.
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard paddingClassName="p-6">
              <div className="space-y-3">
                <span className="font-mono text-2xl font-bold text-cyan-300">02</span>
                <h3 className="font-display font-medium text-lg text-white">Document</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  Publish resolutions, articles, position papers, press releases, research, reports, and discussions as permanent public records.
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard paddingClassName="p-6">
              <div className="space-y-3">
                <span className="font-mono text-2xl font-bold text-emerald-300">03</span>
                <h3 className="font-display font-medium text-lg text-white">Contribute</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                  Zenvitra is not designed to speak for young people. It is designed to create infrastructure where participation becomes visible.
                </p>
              </div>
            </SpotlightCard>
          </div>

          <div className="p-6 rounded-2xl bg-[#060608] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs shadow-md">
            <span className="text-neutral-400">Discussions disappear. <strong className="text-emerald-400">Documentation survives.</strong></span>
            <span className="text-neutral-300">That is why participation must be archived publicly.</span>
          </div>
        </section>

        {/* 6. CLOSING STATEMENT: THE BEGINNING OF PUBLIC MEMORY */}
        <section className="space-y-8 pt-12 border-t border-white/10">
          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">
              Closing Statement
            </span>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase leading-[0.9]">
              THIS IS NOT THE END OF A CONVERSATION. <br />
              <span className="text-neutral-300 font-serif italic font-normal">IT IS THE BEGINNING OF PUBLIC MEMORY.</span>
            </h2>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed font-light font-sans">
            <p>
              Why this matters: <strong>Discussions are temporary. Documentation changes history.</strong>
            </p>
            <p>
              Every resolution archived, every article published, every disagreement documented, every conversation preserved — becomes evidence that participation existed.
            </p>
            <p>
              Platforms disappear. Algorithms evolve. Trends collapse. But documented participation survives beyond the systems that originally hosted it.
            </p>
            <p className="text-white font-medium">
              The goal is not to speak on behalf of a generation. The goal is to ensure a generation remains impossible to erase from public discourse.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#08080a] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-base">Built for participation. Built to survive.</h4>
              <p className="text-xs text-neutral-400 font-mono">Discussions fade. Public memory should not.</p>
            </div>
            
            <EnterZenvitraButton 
              className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition flex items-center gap-2 cursor-pointer shadow-lg"
            />
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 py-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">ZENVITRA © 2026</span>
          <span>•</span>
          <span>Built for open participation</span>
        </div>

        <div className="flex items-center gap-6 text-neutral-400">
          <Link href="/manifesto" className="hover:text-white transition">Manifesto</Link>
          <Link href="/pulse" className="hover:text-white transition">Discussions</Link>
          <Link href="/press" className="hover:text-white transition">Archive</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
        </div>
      </footer>
    </div>
  );
}