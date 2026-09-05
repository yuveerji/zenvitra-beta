'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Users, FileText, Zap, Shield, HeartHandshake, ArrowRight, Radio, Sparkles } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface LiveFeedItem {
  id: string;
  category: string;
  icon: React.ElementType;
  text: string;
  time: string;
  badgeColor: string;
  link: string;
}

export function LiveActivity() {
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);

  // 100% Genuine, honest Genesis Phase 1 milestones (0% Fakeness)
  const liveFeeds: LiveFeedItem[] = [
    {
      id: 'f1',
      category: 'GENESIS LAUNCH',
      icon: Sparkles,
      text: 'Phase 1 Open for Sovereign Youth: thinkers, writers, creators, leaders & innovators',
      time: 'Phase 01 Active',
      badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
      link: '/pulse',
    },
    {
      id: 'f2',
      category: '25% ESCROW MANDATE',
      icon: HeartHandshake,
      text: 'Constitutional Charter Active: First grant cycle unlocks at ₹50,000 milestone for Rural School Labs',
      time: 'In Progress',
      badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
      link: '/donate/govt-schools',
    },
    {
      id: 'f3',
      category: 'POLICY REPOSITORY',
      icon: FileText,
      text: 'Draft Solutions Chamber open for youth policy briefs, research papers & community resolutions',
      time: 'Open for Drafts',
      badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
      link: '/solutions',
    },
    {
      id: 'f4',
      category: 'PRESS BUREAU',
      icon: Radio,
      text: 'Open Newsroom accepting youth investigations, essays, dispatches & reports backed by sources',
      time: 'Accepting Submissions',
      badgeColor: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
      link: '/press',
    },
    {
      id: 'f5',
      category: 'SOVEREIGN CHARTER',
      icon: Shield,
      text: 'Zero-tracker, zero-ad privacy architecture active across all platform matrix nodes',
      time: '100% Operational',
      badgeColor: 'text-zinc-300 bg-white/10 border-white/20',
      link: '/manifesto',
    },
  ];

  // Rotate live activity feed every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeedIndex((prev) => (prev + 1) % liveFeeds.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [liveFeeds.length]);

  const stats = [
    { label: 'NETWORK STAGE', value: 'PHASE 01', sub: 'Genesis Assembly Initialized', icon: Globe },
    { label: 'POLICY REPOSITORY', value: 'OPEN', sub: 'Accepting Youth Draft Briefs', icon: FileText },
    { label: '25% ESCROW TARGET', value: '₹50,000', sub: 'Cycle 1 Rural School Lab Fund Goal', icon: HeartHandshake },
    { label: 'SOVEREIGN CORE', value: '100% OPEN', sub: 'Zero tracking • Fully transparent', icon: Zap },
  ];

  const currentFeed = liveFeeds[activeFeedIndex];
  const FeedIcon = currentFeed.icon;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 text-left space-y-4">
      
      {/* ─── LIVE REAL-TIME TELEMETRY TICKER ─── */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#08090d] border border-white/15 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            </span>
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-emerald-400">
              GENESIS PLATFORM WIRE:
            </span>
          </div>

          <div className="relative h-6 flex-1 overflow-hidden min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeed.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center gap-2 truncate"
              >
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border shrink-0 ${currentFeed.badgeColor}`}>
                  {currentFeed.category}
                </span>
                <span className="text-xs text-white truncate font-medium">
                  {currentFeed.text}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                  • {currentFeed.time}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Link
          href={currentFeed.link}
          className="shrink-0 font-mono text-[11px] font-semibold text-neutral-300 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
        >
          <span>Explore Wire</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ─── GENUINE GENESIS METRICS GRID (0% FAKENESS) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <SpotlightCard key={stat.label} className="p-5 flex flex-col justify-between min-h-[120px] rounded-2xl bg-zinc-950/80 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                  {stat.label}
                </span>
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="pt-2">
                <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="text-[10px] font-sans text-neutral-400 mt-0.5 truncate">
                  {stat.sub}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}

export default LiveActivity;