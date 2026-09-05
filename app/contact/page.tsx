'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Send,
  MessageSquare,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Building,
  Terminal
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Navbar } from '@/components/layout/Navbar';
import { sheetSync } from '@/lib/googleSheets';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Inquiries & Partnerships',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    // Dispatch to Google Sheets (Contact Inquiries tab)
    sheetSync.contact({
      fullName: formData.name || 'Anonymous Inquirer',
      email: formData.email,
      subject: formData.subject || formData.department,
      queryType: formData.department,
      message: formData.message,
      sourceUrl: '/contact',
      status: 'PENDING_REVIEW',
    });

    setSubmitted(true);
  };

  const dispatchChannels = [
    {
      title: 'Secretariat & Partnerships',
      email: 'secretariat@zenvitra.org',
      detail: 'Model UN alliances, school partnerships & delegation logistics.',
    },
    {
      title: 'Press & Research Bureau',
      email: 'press@zenvitra.org',
      detail: 'Student journalistic submissions, columns & editorial inquiries.',
    },
    {
      title: 'Genesis Council Core',
      email: 'council@zenvitra.org',
      detail: 'Executive recruitment, architectural oversight & grant auditing.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden flex flex-col justify-between pt-16 sm:pt-20">
      <Navbar />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-white/[0.04] to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-16 flex-1">
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.02] font-mono text-[10px] text-neutral-300 uppercase tracking-widest">
            <Mail className="w-3 h-3 text-amber-300" />
            <span>DIRECT SOVEREIGN DISPATCH</span>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-6xl text-white tracking-tight leading-[1.05]">
            Connect With the <br />
            <span className="font-serif italic font-normal text-neutral-200">Network.</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Reach out to our leadership council, submit research dispatches, or initiate institutional partnerships.
          </p>
        </div>

        {/* 2-Column Split: Info Cards & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-7 rounded-[2.2rem] bg-[#07080b] border border-white/10 space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest block">
                  TRANSPARENT DIRECTORY
                </span>
                <h3 className="font-display font-medium text-xl text-white">Official Bureaus</h3>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {dispatchChannels.map((channel, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase block">{channel.title}</span>
                    <a href={`mailto:${channel.email}`} className="text-white hover:text-amber-300 transition font-medium block">
                      {channel.email}
                    </a>
                    <p className="text-[11px] text-neutral-400 font-sans font-light pt-1">
                      {channel.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-[11px] text-neutral-300 font-light leading-snug font-sans">
                  All messages are routed directly to active council members with a sub-24h turnaround.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <SpotlightCard className="p-8 sm:p-10 rounded-[2.5rem]">
              {submitted ? (
                <div className="text-center py-12 space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 mx-auto flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-medium text-2xl text-white">Dispatch Transmitted</h3>
                    <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                      Your transmission has been ingested into our council dispatch queue. A representative will contact you at <strong className="text-white">{formData.email}</strong> shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-display font-medium text-2xl text-white">Transmit Dispatch</h3>
                    <p className="text-xs text-neutral-400 font-light">Fill out the transmission fields below.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[11px] text-neutral-300 uppercase block">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[11px] text-neutral-300 uppercase block">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="your.email@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] text-neutral-300 uppercase block">Target Bureau *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:outline-none"
                    >
                      <option>General Inquiries & Partnerships</option>
                      <option>Model UN & Summit OS Inquiries</option>
                      <option>ZEN.PRESS Journalistic Submissions</option>
                      <option>Government School Grants & 25% Ledger</option>
                      <option>Genesis Council Executive Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] text-neutral-300 uppercase block">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Collaboration on Youth Summit 2026"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] text-neutral-300 uppercase block">Transmission Details *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Outline your proposal, dispatch notes, or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-white/30 resize-none font-light"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
                  >
                    <span>Transmit Dispatch</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </SpotlightCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
        <span>&copy; 2026 Zenvitra Foundation</span>
        <span className="uppercase tracking-widest text-neutral-400">COMMUNICATION LAYER</span>
      </footer>
    </div>
  );
}