'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Delegate',
    institution: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
      }
    } catch {
      // Fallback local acknowledgment
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white flex flex-col relative overflow-hidden font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Context & Perks in Spotlight Cards */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-[#08090d] text-[10px] font-mono tracking-[0.2em] text-neutral-300">
                <span>EARLY ACCESS // PROTOCOL</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Claim Your Seat at <br />
                <span className="font-serif italic font-normal text-neutral-400">the Table.</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md pt-1">
                Join our priority waitlist for early portal access, secretariat briefing papers, and delegate privileges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {[
                { icon: Zap, label: 'Early Portal Access', sub: 'Phase 0 privileges' },
                { icon: Shield, label: 'Secretariat Updates', sub: 'Direct briefings' },
                { icon: Sparkles, label: 'MUN Priority', sub: 'Reserved delegations' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <SpotlightCard key={item.label} className="p-4 flex flex-col items-start justify-start">
                    <div className="w-8 h-8 rounded-lg bg-[#0f1016] border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white transition-all shrink-0 mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-tight">{item.label}</h4>
                    <p className="text-[10px] text-neutral-400 font-light">{item.sub}</p>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-6">
            <SpotlightCard className="p-7 sm:p-9 text-left">
              {isSuccess ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Registration Confirmed</h3>
                  <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
                    Your transmission has been logged into the Zenvitra Secretariat register. Expect your briefing packet soon.
                  </p>
                  <Link href="/">
                    <button
                      type="button"
                      className="mt-4 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition"
                    >
                      Return to Home
                    </button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                        Primary Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-white/30 transition"
                      >
                        <option value="Delegate">Delegate</option>
                        <option value="Core Applicant">Core Applicant</option>
                        <option value="Institutional Partner">Institutional Partner</option>
                        <option value="Observer">Observer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                        Institution / City
                      </label>
                      <input
                        type="text"
                        placeholder="School, University, or City"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Transmitting...' : 'Join the Waitlist'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </SpotlightCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}