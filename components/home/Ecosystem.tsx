'use client';

import React from 'react';
import { Users, MessageSquare, Calendar, Compass, Cpu, Heart } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useLanguage } from '@/context/LanguageContext';

export function Ecosystem() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: (t as any)?.ecosystem?.community || 'Community',
      desc: (t as any)?.ecosystem?.communityDesc || 'Connect with ambitious youth across the country.',
    },
    {
      icon: MessageSquare,
      title: (t as any)?.ecosystem?.forum || 'Youth Forum',
      desc: (t as any)?.ecosystem?.forumDesc || 'Debate. Discuss. Decide. Drive change.',
    },
    {
      icon: Calendar,
      title: (t as any)?.ecosystem?.events || 'Events & MUN',
      desc: (t as any)?.ecosystem?.eventsDesc || 'Conferences, summits, MUNs, and experiences.',
    },
    {
      icon: Compass,
      title: (t as any)?.ecosystem?.leadership || 'Leadership',
      desc: (t as any)?.ecosystem?.leadershipDesc || 'Develop skills, lead initiatives, inspire others.',
    },
    {
      icon: Cpu,
      title: (t as any)?.ecosystem?.innovation || 'Innovation',
      desc: (t as any)?.ecosystem?.innovationDesc || 'Turn ideas into solutions. Build the future.',
    },
    {
      icon: Heart,
      title: (t as any)?.ecosystem?.impact || 'Impact',
      desc: (t as any)?.ecosystem?.impactDesc || 'Create measurable impact in communities.',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12 text-center">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 space-y-2">
        <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 font-semibold">
          {(t as any)?.ecosystem?.tagline || "WHAT WE'RE BUILDING"}
        </p>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {(t as any)?.ecosystem?.title || 'An ecosystem. Endless possibilities.'}
        </h2>
      </div>

      {/* 6-Node Grid with Fixed Icon-to-Text Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <SpotlightCard
              key={feature.title}
              className="p-5 flex flex-col items-center justify-start text-center min-h-[220px]"
            >
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-xl bg-[#0f1016] border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:border-white/30 transition-all shrink-0 mb-4">
                <Icon className="w-4 h-4" />
              </div>

              {/* Title & Description with tight lockup */}
              <div className="space-y-1 w-full">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-neutral-400 font-light leading-snug">
                  {feature.desc}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}

export default Ecosystem;