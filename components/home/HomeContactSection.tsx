'use client';

import React from 'react';
import Link from 'next/link';
import {
  Mail,
  Building2,
  Terminal,
  Radio,
  Users,
  ArrowRight,
  Headphones,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useLanguage } from '@/context/LanguageContext';
import { SITE_CONFIG } from '@/lib/constants';

export function HomeContactSection() {
  const { locale, t } = useLanguage();

  const desks = [
    {
      title: locale === 'hi' ? 'कार्यकारी सचिवालय' : 'Executive Secretariat',
      email: 'secretariat@zenvitra.xyz',
      desc: locale === 'hi' ? 'सामान्य नीति, संस्थागत शासन एवं रणनीतिक दिशा।' : 'General governance, policy mandates, and strategic alliances.',
      icon: Building2,
      tag: 'DIRECTORATE',
    },
    {
      title: locale === 'hi' ? 'प्रौद्योगिकी व नवाचार लैब' : 'Tech & Innovation Labs',
      email: 'tech@zenvitra.xyz',
      desc: locale === 'hi' ? 'ओपन-सोर्स अवसंरचना, एआई शासन एवं इंजीनियरिंग।' : 'Open-source youth digital infrastructure & platform architecture.',
      icon: Terminal,
      tag: 'VENTURES',
    },
    {
      title: locale === 'hi' ? 'अध्याय विस्तार व नेटवर्किंग' : 'Chapter Expansion Guild',
      email: 'chapters@zenvitra.xyz',
      desc: locale === 'hi' ? 'विद्यालय व विश्वविद्यालय स्तर पर संस्थागत अध्याय स्थापना।' : 'Institutional chapter onboarding across schools & universities.',
      icon: Users,
      tag: 'NETWORK',
    },
    {
      title: locale === 'hi' ? 'प्रेस, मीडिया व प्रकाशन' : 'Press & Publications',
      email: 'press@zenvitra.xyz',
      desc: locale === 'hi' ? 'आधिकारिक प्रेस विज्ञप्तियां, युवा पत्रकारिता एवं साक्षात्कार।' : 'Official communiqués, youth investigative journalism & media.',
      icon: Radio,
      tag: 'MEDIA',
    },
  ];

  return (
    <section id="contact-desks" className="w-full max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32 relative z-10 text-left space-y-16 border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase text-neutral-300">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>{locale === 'hi' ? 'संस्थागत संपर्क द्वार' : 'INSTITUTIONAL DIRECTORY & LIAISON'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {locale === 'hi' ? 'सचिवालय से सीधा संवाद स्थापित करें' : 'Direct Line to the Secretariat'}
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            {locale === 'hi'
              ? 'चाहे आप नीति शोधकर्ता हों, संस्थागत अध्याय संस्थापक हों या प्रौद्योगिकी भागीदार, संबंधित विभाग से तुरंत जुड़ें।'
              : 'Connect directly with designated executive directorates, research commissions, and chapter onboarding officers.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link href="/contact">
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg">
              <span>{locale === 'hi' ? 'सम्पूर्ण संपर्क प्रपत्र' : 'Open Full Contact Dossier'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* 4-Desk Departmental Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {desks.map((desk) => {
          const Icon = desk.icon;
          return (
            <SpotlightCard key={desk.email} className="p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white shadow-inner">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
                    {desk.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">{desk.title}</h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">{desk.desc}</p>
                </div>
              </div>

              <a
                href={`mailto:${desk.email}`}
                className="text-xs font-mono text-neutral-300 hover:text-white underline underline-offset-4 flex items-center gap-1.5 transition pt-2"
              >
                <span>{desk.email}</span>
                <ExternalLink className="w-3 h-3 text-neutral-500" />
              </a>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Physical Headquarters & Quick Inquiries Strip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#08090d] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-bold">Zenvitra Foundation Directorate</p>
            <p className="text-neutral-500 font-light">Udaipur, Rajasthan, India • Sovereign Youth Movement</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-neutral-500 hidden md:inline">Instant Support Available 24/7:</span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Zen.chat Active
          </span>
        </div>
      </div>
    </section>
  );
}

export default HomeContactSection;