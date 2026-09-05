'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sun, BookOpen, Users, HeartHandshake, ArrowRight, Zap } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { AnimatedSection, StaggerChildren, StaggerItem } from '@/components/ui/AnimatedSection';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Navbar } from '@/components/layout/Navbar';

export default function ImpactPage() {
  const grantDeployments = [
    { title: 'Rural School Solar Grids', location: 'Rajasthan & Odisha', allocated: '₹14,50,000', metric: '6 Schools Powered', icon: Sun },
    { title: 'Youth Media Fellowships', location: 'Pan-India & Global', allocated: '₹8,20,000', metric: '42 Student Reporters', icon: BookOpen },
    { title: 'Model UN & Summit Passes', location: 'Global Delegations', allocated: '₹6,40,000', metric: '280 Passes Sponsored', icon: Users },
    { title: 'Civic Innovation Grants', location: 'Grassroots Labs', allocated: '₹11,00,000', metric: '18 Youth Projects', icon: HeartHandshake },
  ];

  return (
    <div className="min-h-screen bg-[#030405] text-white overflow-x-hidden font-sans relative pt-16 sm:pt-20">
      <Navbar />
      <AuroraBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-12 space-y-16">

        <AnimatedSection className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>THE 25% PROFIT CIVIC ENDOWMENT</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight leading-[1.08]">
            Audited, verifiable <span className="text-neutral-300 font-serif italic font-light">youth grants ledger.</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed font-sans">
            Exactly <strong className="text-white font-semibold">25% of all net platform profits</strong> on ZENVITRA is directly returned to students, rural school computer labs, and delegate scholarships. Executed <strong className="text-amber-300 font-semibold">every 4 months</strong> with radical accountability: offline handover videos and itemized purchase receipts broadcast publicly across <strong className="text-cyan-300 font-semibold">ZEN.FLUX</strong> and official social channels.
          </p>
        </AnimatedSection>

        {/* Live Sovereign Escrow Architecture */}
        <AnimatedSection>
          <SpotlightCard paddingClassName="p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">PROFIT ENDOWMENT RATIO</span>
                <div className="font-display font-bold text-3xl sm:text-4xl text-emerald-400">
                  25.0%
                </div>
                <p className="text-[11px] font-mono text-neutral-400">Net Platform Profits</p>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">DISTRIBUTION CADENCE</span>
                <div className="font-display font-bold text-3xl sm:text-4xl text-amber-400">
                  Every 4 Mos
                </div>
                <p className="text-[11px] font-mono text-neutral-400">3 Cycles Every Year</p>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">ACCOUNTABILITY PROOF</span>
                <div className="font-display font-bold text-3xl sm:text-4xl text-cyan-400">
                  ZEN.FLUX
                </div>
                <p className="text-[11px] font-mono text-neutral-400">Offline Videos &amp; Receipts</p>
              </div>
            </div>
          </SpotlightCard>
        </AnimatedSection>

        {/* Deployments Architecture */}
        <div className="space-y-6 text-left">
          <AnimatedSection className="flex items-center justify-between pb-4 border-b border-white/10">
            <h2 className="font-display font-bold text-2xl text-white">Grant Allocation Vectors</h2>
            <span className="font-mono text-xs text-neutral-500">CONSTITUTIONAL VECTORS</span>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6" staggerDelay={0.1}>
            {grantDeployments.map((g, idx) => {
              const Icon = g.icon;
              return (
                <StaggerItem key={idx}>
                  <SpotlightCard paddingClassName="p-7">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs text-emerald-300 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                          25% ALLOCATION
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-display font-medium text-lg text-white group-hover:text-emerald-200 transition-colors">{g.title}</h3>
                        <p className="text-xs text-cyan-300/80 font-mono">{g.location}</p>
                      </div>
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-300">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          MANDATE: DIRECT YOUTH
                        </span>
                        <span className="text-neutral-400 font-medium">{g.metric}</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>

        {/* CTA */}
        <AnimatedSection>
          <SpotlightCard paddingClassName="p-8 sm:p-12">
            <div className="text-center space-y-4">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">Support or Apply for a Youth Grant</h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-sans font-light">
                Are you a student building clean tech, media, or community diplomacy? Apply for direct funding.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <Link
                  href="/invest-donate"
                  className="px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition btn-glow"
                >
                  Contribute to Grant Pool
                </Link>
              </div>
            </div>
          </SpotlightCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
