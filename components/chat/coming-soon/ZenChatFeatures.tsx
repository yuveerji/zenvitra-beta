'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Layers, 
  Radio, 
  Users, 
  Megaphone, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface FeatureCardProps {
  number: string;
  title: string;
  headline: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
}

const features: FeatureCardProps[] = [
  {
    number: '01',
    title: 'EVENT WORKSPACES',
    headline: 'Every conference. Its own space. Everything connected.',
    description:
      'Dedicated workspaces for individual MUN events, with independent memberships, channels, and event-specific communication.',
    icon: <Building2 className="w-5 h-5 text-blue-400" />,
    tag: 'WORKSPACE ARCHITECTURE',
  },
  {
    number: '02',
    title: 'COMMITTEE CHANNELS',
    headline: 'Your committee. Your agenda. Your conversation.',
    description:
      'Dedicated channels for delegates and authorized Executive Board members, with committee-specific resources and discussions.',
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
    tag: 'DELEGATE GOVERNANCE',
  },
  {
    number: '03',
    title: 'OFFICIAL ANNOUNCEMENTS',
    headline: 'Important information deserves its own space.',
    description:
      'A structured channel for authorized event announcements, procedural updates, schedules, and essential notices.',
    icon: <Megaphone className="w-5 h-5 text-blue-400" />,
    tag: 'VERIFIED DISPATCH',
  },
  {
    number: '04',
    title: 'COMMUNITY & INFORMAL CHAT',
    headline: 'Beyond the agenda, there are people to meet.',
    description:
      'A space for introductions, networking, casual conversations, and community interaction.',
    icon: <Users className="w-5 h-5 text-blue-400" />,
    tag: 'SOVEREIGN NETWORK',
  },
];

export function ZenChatFeatures() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-mono tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Planned Capabilities</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-4"
          style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
        >
          Built for Every Conversation
        </h2>
        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
          Four foundational pillars engineered to elevate diplomatic debate, eliminate fragmented messaging, and bring order to conference communication.
        </p>
      </div>

      {/* Grid of 4 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-8 sm:p-9 rounded-2xl sm:rounded-3xl bg-[#070a13] border border-white/10 hover:border-blue-500/35 transition-all duration-300 hover:shadow-[0_12px_45px_rgba(37,99,235,0.12)] flex flex-col justify-between overflow-hidden"
          >
            {/* Subtle card glow on hover */}
            <div 
              className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
              aria-hidden="true" 
            />

            <div className="relative z-10 space-y-6">
              {/* Top Row: Number & Icon */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest text-blue-400/90 uppercase px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                  {feature.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-blue-400/30 group-hover:scale-105 transition-all">
                  {feature.icon}
                </div>
              </div>

              {/* Title & Tag */}
              <div>
                <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 mb-1">
                  {feature.tag}
                </p>
                <h3
                  className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase"
                  style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
                >
                  {feature.title}
                </h3>
              </div>

              {/* Headline Quote */}
              <p className="text-base sm:text-lg font-medium text-blue-200/95 leading-snug">
                “{feature.headline}”
              </p>

              {/* Body Description */}
              <p className="text-sm text-neutral-300 leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* Bottom Status Indicator */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="uppercase tracking-wider">In Active Roadmap</span>
              <span className="text-blue-400/80">ZENVITRA Protocol</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
