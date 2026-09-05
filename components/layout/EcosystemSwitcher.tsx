'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Shield,
  Zap,
  Calendar,
  MessageSquare,
  Video,
  FileText,
  Users,
  Compass,
  Sparkles,
  ExternalLink,
  Award,
} from 'lucide-react';
import { EcosystemApp } from '@/types/zenvitra';

const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    id: 'zenvitra-id',
    name: 'ZENVITRA ID',
    code: 'AUTH',
    version: 'V-0.0.1',
    tagline: 'Universal Identity',
    description: 'Unified cryptographic profile across all nodes.',
    href: '/profile',
    iconName: 'Shield',
    accentColor: 'from-amber-400/20 to-amber-500/10 border-amber-400/30 text-amber-300',
    badge: 'CORE',
    isLive: true,
  },
  {
    id: 'zen-pulse',
    name: 'ZEN.PULSE',
    code: 'SOCIAL',
    version: 'V-0.0.3',
    tagline: 'Youth Social Network',
    description: 'Post thoughts, event check-ins, debates & feeds.',
    href: '/pulse',
    iconName: 'Zap',
    accentColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    badge: 'BETA',
    isLive: true,
  },
  {
    id: 'events',
    name: 'EVENTS & MUN',
    code: 'HOST',
    version: 'V-0.0.5',
    tagline: 'Event Hosting Engine',
    description: 'Operate MUNs, youth forums, tickets & registrations.',
    href: '/events',
    iconName: 'Calendar',
    accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    badge: 'PILOT',
    isLive: true,
  },
  {
    id: 'zen-chat',
    name: 'ZEN.CHAT',
    code: 'COMMS',
    version: 'V-0.1',
    tagline: 'Comms & Voice Rooms',
    description: '1-to-1, Secretariat channels, audio/video rooms.',
    href: '/contact',
    iconName: 'MessageSquare',
    accentColor: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    badge: 'LIVE',
    isLive: true,
  },
  {
    id: 'zen-flux',
    name: 'ZEN.FLUX',
    code: 'VIDEO',
    version: 'V-0.0.4',
    tagline: 'Short-Form Video',
    description: 'Youth-focused discovery engine & culture clips.',
    href: '/flux',
    iconName: 'Video',
    accentColor: 'from-pink-500/20 to-purple-500/10 border-pink-500/30 text-pink-400',
    badge: 'ROADMAP',
    isLive: false,
  },
  {
    id: 'international-press',
    name: 'INTL. PRESS',
    code: 'JOURNALISM',
    version: 'V-0.2',
    tagline: 'Student Journalism',
    description: 'Independent youth journalism, investigations & blogs.',
    href: '/news',
    iconName: 'FileText',
    accentColor: 'from-indigo-500/20 to-cyan-500/10 border-indigo-500/30 text-indigo-300',
    badge: 'PREVIEW',
    isLive: true,
  },
  {
    id: 'communities',
    name: 'COMMUNITIES',
    code: 'ORGS',
    version: 'V-0.3',
    tagline: 'Youth Organizations',
    description: 'School chapters, NGO clusters & working groups.',
    href: '/core-team',
    iconName: 'Users',
    accentColor: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-300',
    badge: 'ACTIVE',
    isLive: true,
  },
  {
    id: 'opportunities',
    name: 'OPPORTUNITIES',
    code: 'GRANTS',
    version: 'V-0.6',
    tagline: 'Grants & Fellowships',
    description: 'Internships, scholarships & youth delegations.',
    href: '/why-zenvitra',
    iconName: 'Award',
    accentColor: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-300',
    badge: 'SOON',
    isLive: false,
  },
  {
    id: 'discover',
    name: 'DISCOVER',
    code: 'SEARCH',
    version: 'V-0.5',
    tagline: 'Ecosystem Intelligence',
    description: 'Discover people, events, papers & communities.',
    href: '/forum',
    iconName: 'Compass',
    accentColor: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-300',
    badge: 'BETA',
    isLive: true,
  },
];

export function EcosystemSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* 9-Dot Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl border transition flex items-center justify-center cursor-pointer ${
          isOpen
            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
            : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:border-white/25 hover:bg-white/10'
        }`}
        title="ZENVITRA Ecosystem Apps"
      >
        <Grid className="w-4 h-4" />
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-12 w-[340px] sm:w-[420px] rounded-3xl border border-white/15 bg-[#08090d]/95 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-5 z-50 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white tracking-tight uppercase font-mono">
                  ZENVITRA ECOSYSTEM MATRIX
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                1 ID • 9 NODES
              </span>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {ECOSYSTEM_APPS.map((app) => {
                return (
                  <Link
                    key={app.id}
                    href={app.href}
                    onClick={() => setIsOpen(false)}
                    className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.07] hover:border-white/20 transition flex flex-col items-center justify-between text-center group cursor-pointer"
                  >
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-500">
                        {app.code}
                      </span>
                      {app.badge && (
                        <span className="text-[8px] font-mono text-neutral-400 bg-white/10 px-1.5 py-0.2 rounded-full">
                          {app.badge}
                        </span>
                      )}
                    </div>

                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${app.accentColor} border flex items-center justify-center mb-2 group-hover:scale-105 transition shadow`}>
                      {app.id === 'zenvitra-id' && <Shield className="w-4 h-4" />}
                      {app.id === 'zen-pulse' && <Zap className="w-4 h-4" />}
                      {app.id === 'events' && <Calendar className="w-4 h-4" />}
                      {app.id === 'zen-chat' && <MessageSquare className="w-4 h-4" />}
                      {app.id === 'zen-flux' && <Video className="w-4 h-4" />}
                      {app.id === 'international-press' && <FileText className="w-4 h-4" />}
                      {app.id === 'communities' && <Users className="w-4 h-4" />}
                      {app.id === 'opportunities' && <Award className="w-4 h-4" />}
                      {app.id === 'discover' && <Compass className="w-4 h-4" />}
                    </div>

                    <h4 className="text-[11px] font-bold text-neutral-200 group-hover:text-white tracking-tight leading-none mb-1">
                      {app.name}
                    </h4>
                    <p className="text-[9px] text-neutral-500 font-mono leading-tight truncate w-full">
                      {app.tagline}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Matrix Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>UNIFIED ARCHITECTURE V-0.0.1</span>
              <Link
                href="/why-zenvitra"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white underline transition"
              >
                Read Roadmap
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
