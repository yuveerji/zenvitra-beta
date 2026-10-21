'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  ChevronDown, 
  UserCheck, 
  ShieldCheck, 
  Ticket, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  category: 'DELEGATE' | 'ORGANIZER' | 'TICKETS';
}

const FAQS: FAQItem[] = [
  {
    id: 'who-needs-organizer',
    question: 'Do I need an Organizer account to register for events or attend MUNs?',
    category: 'DELEGATE',
    answer: (
      <div className="space-y-2">
        <p>
          <strong className="text-emerald-400 font-bold">No, absolutely not!</strong> Any registered student, delegate, or community citizen account can freely browse all summits, register for conferences, select committees, and purchase or receive passes.
        </p>
        <p className="text-neutral-400 text-xs">
          You only need your standard citizen login to get your official ZenPass and attend conferences.
        </p>
      </div>
    ),
  },
  {
    id: 'who-needs-event-account',
    question: 'Who needs an Event / Professional account?',
    category: 'ORGANIZER',
    answer: (
      <div className="space-y-2">
        <p>
          Event and Professional accounts are reserved specifically for <strong className="text-white">Secretariats, School/Collegiate Clubs, and Conference Organizers</strong> who want to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
          <li>Create and list new public summits and conferences</li>
          <li>Access the Executive Board Dais Operating System &amp; live GSL timer</li>
          <li>Configure delegate matrices, council rosters, and digital chits</li>
          <li>Issue tiered passes and accept Cashfree / UPI registrations directly</li>
          <li>Scan attendees at the door with the Gate Scanner</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'how-to-register-pass',
    question: 'How do delegates register and get their event pass?',
    category: 'DELEGATE',
    answer: (
      <p>
        Simply select any event from the directory below, click <span className="text-cyan-400 font-bold">"Get Pass / Register"</span> or <span className="text-white font-bold">"View Details"</span>, choose your preferred pass tier (free or tiered delegate pass), and confirm. Your holographic <strong className="text-cyan-300">ZenPass ticket with a secure entry QR code</strong> will instantly be added to your account wallet under <span className="text-amber-400 font-mono">My Passes</span>.
      </p>
    ),
  },
  {
    id: 'organizer-pricing-fees',
    question: 'Are there any platform fees for MUN secretariats using the dais OS?',
    category: 'ORGANIZER',
    answer: (
      <p>
        The <strong className="text-cyan-400">ZEN.MUN Dais Matrix &amp; Committee Operating System</strong> is 100% free for educational and collegiate conferences. For paid delegate tickets, ZENVITRA provides transparent dual-sided settlements with zero hidden charges.
      </p>
    ),
  },
  {
    id: 'where-is-my-pass',
    question: 'Where can I see and present my booked passes on the event day?',
    category: 'TICKETS',
    answer: (
      <p>
        Click the <span className="text-amber-400 font-bold">"My Passes"</span> button located at the top right of the Events Hub or tap <span className="text-emerald-400 font-bold">"Show Entry QR"</span>. You can present your holographic dynamic pass directly from your phone at the registration desk for instant gate verification.
      </p>
    ),
  },
];

export function EventsFaqSection() {
  const [openIds, setOpenIds] = useState<string[]>(['who-needs-organizer']);

  const toggle = (id: string) => {
    setOpenIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="mt-14 rounded-3xl bg-[#090b14] border border-white/10 p-6 sm:p-10 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-1/4 w-72 h-44 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-60 h-40 bg-purple-500/10 blur-[80px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono tracking-widest uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CLARIFICATION &amp; GUIDELINES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Everything you need to know about delegate registration versus hosting an event as a secretariat.
          </p>
        </div>

        {/* Roles Quick Pill */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Delegates: 100% Free Access</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <Building2 className="w-3.5 h-3.5" />
            <span>Organizers: Create &amp; Host</span>
          </span>
        </div>
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-white/5 pt-4 relative z-10">
        {FAQS.map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <div key={item.id} className="py-4">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                    item.category === 'DELEGATE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : item.category === 'ORGANIZER'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-sm font-semibold text-neutral-200 group-hover:text-white transition">
                    {item.question}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {isOpen && (
                <div className="mt-3 pl-2 sm:pl-4 text-xs sm:text-sm text-neutral-300 leading-relaxed border-l-2 border-cyan-500/40 ml-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Callout */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs relative z-10">
        <span className="text-neutral-400 font-mono text-[11px]">
          Want to host a Model UN or summit with your institution?
        </span>
        <Link
          href="/register/professional"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition"
        >
          <span>Apply for Secretariat / Organizer Accreditation</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </Link>
      </div>
    </section>
  );
}
