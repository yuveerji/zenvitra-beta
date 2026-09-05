'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Building2,
  Sparkles,
  Award,
  Globe2,
  CheckCircle2,
  Send,
  Loader2,
  Shield,
  FileText,
  UserPlus
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Navbar } from '@/components/layout/Navbar';
import { sheetSync } from '@/lib/googleSheets';

export default function CampusAmbassadorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    collegeName: '',
    cityState: '',
    degreeYear: '',
    studentIdProof: '',
    leadershipExperience: '',
    proposedStrategy: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.collegeName) return;

    setLoading(true);

    // Dispatch to Google Sheets (Campus Ambassadors tab)
    sheetSync.campusAmbassador({
      fullName: formData.fullName,
      collegeUniversityName: formData.collegeName,
      cityState: formData.cityState || 'India / Global',
      degreeYearOfStudy: formData.degreeYear || 'Undergraduate',
      studentIdProof: formData.studentIdProof || 'Pending Verification',
      leadershipExperience: formData.leadershipExperience,
      proposedStrategy: formData.proposedStrategy,
      approvalStatus: 'APPLIED_GENESIS_COHORT',
    });

    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
  };

  const perks = [
    {
      title: 'Institutional Chapter Authority',
      desc: 'Lead official Zenvitra youth summits, model UN chambers & policy debates on your campus.',
      icon: GraduationCap,
    },
    {
      title: 'Direct Diplomatic Grants',
      desc: 'Access seed funding & 25% Profit Endowment support for public school library and lab initiatives.',
      icon: Award,
    },
    {
      title: 'Executive Network & Letter of Credence',
      desc: 'Receive official ambassador credentials, letter of recommendation & priority council entry.',
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden pt-16 sm:pt-20 flex flex-col justify-between">
      <Navbar />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-400/[0.04] to-transparent blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-16 flex-1 text-left">
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.02] font-mono text-[10px] text-amber-300 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>CAMPUS DIPLOMATIC CORPS &bull; GENESIS COHORT</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase leading-[1.02]">
            BECOME THE VOICE <br />
            <span className="font-serif italic font-normal text-neutral-300">ON YOUR CAMPUS.</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Represent Zenvitra at your school, college, or university. Onboard delegations, organize grassroots summits, and lead sovereign student discourse.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <SpotlightCard key={i} className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-white">{perk.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{perk.desc}</p>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto rounded-[2.8rem] bg-[#07080b] border border-white/10 p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          {submitted ? (
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/35 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Ambassador Application Received</h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto">
                Thank you for applying to lead the Zenvitra Genesis Chapter at <span className="text-white font-mono">{formData.collegeName}</span>. Our secretariat will review your credentials and reach out within 48 hours.
              </p>
              <Link
                href="/pulse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
              >
                <span>Enter Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold">APPLICATION DOSSIER</span>
                <h3 className="font-display font-bold text-xl text-white">Campus Ambassador Application</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300">OFFICIAL / STUDENT EMAIL *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300">COLLEGE / UNIVERSITY NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Stephen's / IIT / Ashoka / Oxford"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300">CITY &amp; STATE / COUNTRY *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi, India"
                    value={formData.cityState}
                    onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300">DEGREE &amp; YEAR OF STUDY *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.A. Political Science, 2nd Year (Class of 2027)"
                  value={formData.degreeYear}
                  onChange={(e) => setFormData({ ...formData, degreeYear: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300">LEADERSHIP &amp; MUN EXPERIENCE</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about student societies, MUN executive boards, debating clubs, or youth initiatives you have participated in or led..."
                  value={formData.leadershipExperience}
                  onChange={(e) => setFormData({ ...formData, leadershipExperience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300">PROPOSED CAMPUS CHAPTER STRATEGY</label>
                <textarea
                  rows={3}
                  placeholder="How do you plan to introduce Zenvitra to students on your campus? (e.g. delegation pass onboarding, local debates, inter-college caucuses)..."
                  value={formData.proposedStrategy}
                  onChange={(e) => setFormData({ ...formData, proposedStrategy: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>DISPATCHING APPLICATION...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT AMBASSADOR DOSSIER</span>
                    <Send className="w-3.5 h-3.5 text-black" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
