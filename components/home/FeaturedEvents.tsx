'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Users } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export function FeaturedEvents() {
  const events = [
    {
      slug: 'young.gazette',
      name: 'Young Gazette Youth Summit',
      date: 'Oct 14-16, 2026',
      venue: 'National Center, New Delhi & Hybrid',
      type: 'Summit & Press',
      participants: '350+ Seats',
    },
    {
      slug: 'sassyetc',
      name: 'SassyEtc Leadership Forum',
      date: 'Nov 04-06, 2026',
      venue: 'Sovereign Hall, Mumbai',
      type: 'MUN / Forum',
      participants: '200+ Seats',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 text-left">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            EVENT HOSTING ENGINE
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Active Conferences & Portals
          </h2>
        </div>

        <Link href="/events">
          <button
            type="button"
            className="px-4 py-2 rounded-full border border-white/15 bg-[#0e0f14] text-neutral-300 text-xs font-light hover:bg-white/10 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <SpotlightCard
            key={event.slug}
            className="p-6 flex flex-col justify-between min-h-[190px] text-left"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white font-semibold">
                  zenvitra.xyz/{event.slug}
                </span>
                <span className="text-neutral-400">{event.type}</span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                {event.name}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-light">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-300" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-300" />
                  {event.venue}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-300" />
                  {event.participants}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">
                Direct Portal Ready
              </span>
              <Link href={`/${event.slug}`}>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Event Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

export default FeaturedEvents;