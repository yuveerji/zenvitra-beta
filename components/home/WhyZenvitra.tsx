'use client';

import React from 'react';
import { Users, MessageSquare, Sparkles } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useLanguage } from '@/context/LanguageContext';

export function WhyZenvitra() {
  const { locale, t } = useLanguage();

  const pillars = [
    {
      icon: Users,
      title: (t as any)?.why?.forYouthTitle || (t as any)?.why?.p1Title || 'For Youth',
      desc: (t as any)?.why?.forYouthDesc || (t as any)?.why?.p1Desc || 'A space for young people to voice their ideas, represent their communities, and lead with purpose.',
    },
    {
      icon: MessageSquare,
      title: (t as any)?.why?.byYouthTitle || (t as any)?.why?.p2Title || 'By Youth',
      desc: (t as any)?.why?.byYouthDesc || (t as any)?.why?.p2Desc || 'Designed, built, and driven by young leaders who believe in collaboration over competition.',
    },
    {
      icon: Sparkles,
      title: (t as any)?.why?.forImpactTitle || (t as any)?.why?.p3Title || 'For Impact',
      desc: (t as any)?.why?.forImpactDesc || (t as any)?.why?.p3Desc || 'Creating real change through dialogue, leadership, innovation, and collective action.',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12 text-left">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 font-semibold">
          {(t as any)?.why?.badge || (t as any)?.why?.tagline || 'WHY ZENVITRA?'}
        </p>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {locale === 'hi' ? (
            <>
              हम सिर्फ एक मंच नहीं बना रहे हैं। <br />
              <span className="text-neutral-400">हम एक आंदोलन का निर्माण कर रहे हैं।</span>
            </>
          ) : (
            <>
              {(t as any)?.why?.title1 || "We're building more than a platform."} <br />
              <span className="text-neutral-400">{(t as any)?.why?.title2 || "We're building a movement."}</span>
            </>
          )}
        </h2>
      </div>

      {/* 3 Pillar Cards with Fixed Vertical Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <SpotlightCard key={pillar.title} className="p-6 flex flex-col items-start justify-start">
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-xl bg-[#0f1016] border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:border-white/30 transition-colors shrink-0 mb-4">
                <Icon className="w-4 h-4" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 text-left">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}

export default WhyZenvitra;