'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  CreditCard, 
  Globe, 
  Calendar, 
  Users, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  LifeBuoy, 
  Plus,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface HelpArticle {
  id: string;
  category: string;
  categorySlug: 'account' | 'payments' | 'mun' | 'events' | 'tickets';
  title: string;
  summary: string;
  content: string[];
}

const ARTICLES: HelpArticle[] = [
  {
    id: 'art-1',
    category: 'Payments & Taxation',
    categorySlug: 'payments',
    title: 'How does the 0% GST Student Exemption work?',
    summary: 'Under ZENVITRA Article 12, youth aged 18 and below pay 0% GST on all conference registrations.',
    content: [
      'ZENVITRA operates an age-aware dynamic taxation engine that adheres to National Youth Empowerment directives.',
      'Students declaring age $\\le$ 18 during registration are completely exempt from GST (0% GST applied).',
      'Attendees older than 18 (general observers, adult advisors, corporate attendees) are levied the standard 6% state event surcharge.',
      'Organizers receive the exact net settlement into their linked bank accounts via Cashfree Payout rails with T+1 bank settlement speeds.'
    ]
  },
  {
    id: 'art-2',
    category: 'Payments & Refunds',
    categorySlug: 'payments',
    title: 'Requesting a Refund for Duplicate or Cancelled Passes',
    summary: 'Refunds must be requested via a verified support ticket or organizer direct request.',
    content: [
      'If you were debited twice by your bank during UPI or NetBanking checkout, our Cashfree auto-reconciliation rail will automatically refund duplicate charges within 24 to 48 hours.',
      'If your pass was cancelled by the host institution, open a ticket under Category: Payments & Refunds.',
      'Our finance team verifies the transaction ID (TXN/UTR) against the Cashfree ledger and issues an instant credit back to the source bank account.'
    ]
  },
  {
    id: 'art-3',
    category: 'MUN Dais & Secretariat',
    categorySlug: 'mun',
    title: 'Executive Board Dais Controls & Roll Call Quorum',
    summary: 'How Chairs and Vice Chairs manage speakers, roll calls, and draft resolution voting.',
    content: [
      'The Dais Chamber provides live attendance radar (Present vs Present & Voting).',
      'The speaker queue can be reordered in real-time with customizable speech timers (e.g. 90 seconds, 60 seconds).',
      'Draft resolutions can be submitted directly by delegate blocs and locked by the dais before the plenary vote commences.'
    ]
  },
  {
    id: 'art-4',
    category: 'Event Gate Passes',
    categorySlug: 'tickets',
    title: 'Cryptographic HMAC Anti-Fake QR Ticket Verification',
    summary: 'Preventing counterfeit tickets at conference registration gates.',
    content: [
      'Every ticket generated on ZENVITRA is signed with a high-entropy SHA256 HMAC cryptographic seal.',
      'Gate operators utilize the Host Command Center scanner (/events/manage) to scan attendee QR codes.',
      'If an attendee attempts to use a cloned QR code, altered ticket number, or re-enter with a checked-in badge, the scanner instantly flashes a Red Warning and logs the incident.'
    ]
  },
  {
    id: 'art-5',
    category: 'Account & Identity',
    categorySlug: 'account',
    title: 'Recovering Access or Resetting Sovereign Passwords',
    summary: 'How to recover account access without compromising security.',
    content: [
      'ZENVITRA accounts are tied to your verified email and cryptographic session credentials.',
      'If you lose access to your primary device, use the password reset link at /login.',
      'If you suspect unauthorized account access, submit an Account & Access ticket immediately. Our security operations desk can issue an emergency session revocation.'
    ]
  },
  {
    id: 'art-6',
    category: 'ZEN.CHAT vs ZEN.SUPPORT',
    categorySlug: 'account',
    title: 'What is the difference between ZEN.CHAT and ZEN.SUPPORT?',
    summary: 'Understanding community conversation vs official dispute resolution.',
    content: [
      'ZEN.CHAT (/chat) is our community communication platform: direct messaging, group discussions, MUN committee channels, and broadcast lists.',
      'ZEN.SUPPORT (/support) is the official helpdesk for case resolution, payment discrepancies, event verification, and technical bugs.',
      'A message sent in ZEN.CHAT does NOT create an official support ticket. To obtain authorized assistance, always open a case in ZEN.SUPPORT.'
    ]
  }
];

export default function HelpKnowledgeBasePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('art-1');

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.categorySlug === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.content.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link href="/support" className="hover:text-cyan-400 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Support Helpdesk</span>
          </Link>
          <span>/</span>
          <span className="text-white">Knowledge Base &amp; FAQ</span>
        </div>

        {/* Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
            SELF-SERVICE DOCUMENTATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
            Knowledge Base &amp; FAQ
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans">
            Search comprehensive operational guides covering MUN committee procedures, 0% student taxation, Cashfree settlements, and gate scanning.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides (e.g. GST, refunds, gate pass, dais)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono shadow-xl"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          {[
            { id: 'all', label: 'All Articles' },
            { id: 'payments', label: 'Payments & GST' },
            { id: 'mun', label: 'MUN & Dais' },
            { id: 'tickets', label: 'Gate Passes' },
            { id: 'account', label: 'Account & Platform' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl border transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Accordion */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-black/40 border border-white/10 text-neutral-400 text-xs font-mono">
              No matching help articles found. Please try another query or create a ticket below.
            </div>
          ) : (
            filteredArticles.map((art) => {
              const isExpanded = expandedId === art.id;
              return (
                <div
                  key={art.id}
                  className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : art.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                        {art.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                        {art.title}
                      </h3>
                      <p className="text-xs text-neutral-400 font-sans">
                        {art.summary}
                      </p>
                    </div>

                    <div className="p-1 rounded-lg text-neutral-400 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-white/5 bg-white/[0.01] space-y-2 text-xs text-neutral-300 font-sans leading-relaxed">
                      {art.content.map((p, i) => (
                        <p key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-mono mt-0.5">&bull;</span>
                          <span>{p}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Didn't Find What You Need? CTA Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-emerald-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 max-w-3xl mx-auto">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-display">
              Still need personalized assistance?
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Open an official support ticket. Our team responds within 2 to 24 hours depending on urgency.
            </p>
          </div>

          <Link
            href="/support/new"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-neutral-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-neutral-950" />
            <span>Open Support Ticket</span>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
