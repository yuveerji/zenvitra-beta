'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Shield, CheckCircle2, Terminal } from 'lucide-react';

export default function JoinCoreTeamSection() {
  const [role, setRole] = useState('engineering');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    proofOfWork: '',
  });

  const domains = [
    { id: 'engineering', label: 'Systems & Engineering' },
    { id: 'design', label: 'Visual & Product Design' },
    { id: 'strategy', label: 'Strategy & Initiatives' },
    { id: 'operations', label: 'Ecosystem Operations' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
      <div className="rounded-[2.2rem] bg-[#07080b] border border-white/[0.08] p-8 sm:p-12 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-white/[0.03] blur-3xl rounded-full" />

        {/* Section Header */}
        <div className="space-y-3 text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/[0.05] border border-amber-400/20 text-[10px] font-mono tracking-widest text-amber-300 uppercase">
            <Sparkles className="w-3 h-3" />
            <span>GENESIS COUNCIL</span>
          </div>

          <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
            Build With The Core Team
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            We are looking for uncompromising builders, designers, and strategists to shape the foundation of Zenvitra.
          </p>
        </div>

        {submitted ? (
          /* Confirmation State */
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-white text-base font-medium tracking-wide">
              Application Ingested
            </h3>
            <p className="text-neutral-400 text-xs max-w-sm font-sans font-light">
              Your profile has been routed to the Founding Council. If there is alignment, an invite will be dispatched.
            </p>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
            {/* Domain Selection Tabs */}
            <div className="grid grid-cols-2 gap-2">
              {domains.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setRole(d.id)}
                  className={`py-2.5 px-3 rounded-xl border text-[11px] font-mono tracking-wide transition-all ${
                    role === d.id
                      ? 'bg-white text-black font-semibold border-white shadow-sm'
                      : 'bg-black/40 text-neutral-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full Name / Handle"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-white/30 transition"
              />

              <input
                type="text"
                required
                placeholder="Email or Telegram / Discord Handle"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-white/30 transition"
              />

              <textarea
                rows={3}
                required
                placeholder="Proof of Work (GitHub, Portfolio, Previous Impact, or why you want to build this)"
                value={formData.proofOfWork}
                onChange={(e) => setFormData({ ...formData, proofOfWork: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-white/30 transition resize-none"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.12)]"
            >
              <span>Submit Core Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-[10px] font-mono text-neutral-600 text-center tracking-wider">
              Meritocratic evaluation. High proof-of-work required.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}