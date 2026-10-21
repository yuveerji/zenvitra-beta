'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Star,
  QrCode,
  Globe2,
  Fingerprint,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';

interface IdentityPassportSceneProps {
  onNext: () => void;
  userName?: string;
  roleTrack?: string;
}

const PASSPORT_STAMPS = [
  {
    id: 'stamp_1',
    event: 'UNSC SUMMIT 2026',
    role: 'BEST DELEGATE',
    chamber: 'Security Council Plenary',
    color: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300',
    sealColor: 'text-cyan-400',
    date: 'OCT 2026',
  },
  {
    id: 'stamp_2',
    event: 'GLOBAL CLIMATE COP',
    role: 'LEAD SPONSOR',
    chamber: 'Resolution Res-04',
    color: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300',
    sealColor: 'text-emerald-400',
    date: 'SEP 2026',
  },
  {
    id: 'stamp_3',
    event: 'YOUTH POLICY ARENA',
    role: 'KEYNOTE SPEAKER',
    chamber: 'Education Reform Bill',
    color: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
    sealColor: 'text-amber-400',
    date: 'AUG 2026',
  },
  {
    id: 'stamp_4',
    event: 'REGIONAL MUN CONCLAVE',
    role: 'HIGH COMMENDATION',
    chamber: 'Human Rights Council',
    color: 'border-purple-400/40 bg-purple-500/10 text-purple-300',
    sealColor: 'text-purple-400',
    date: 'JUL 2026',
  },
];

const SKILL_TAGS = [
  'International Law',
  'Crisis Strategy',
  'Drafting & Resolution',
  'GSL Oratory',
  'Caucus Leadership',
  'Bilateral Diplomacy',
];

export function IdentityPassportScene({ onNext, userName, roleTrack }: IdentityPassportSceneProps) {
  const displayHandle = userName || 'yuveer';
  const nodeNumber = Math.abs(displayHandle.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1672));

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-6 sm:py-10 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
          06 &bull; IDENTITY &amp; PASSPORT
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase max-w-2xl leading-tight">
          YOU ARE MORE THAN <span className="text-amber-400">A REGISTRATION.</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          &ldquo;Your profile becomes your sovereign identity across the platform.&rdquo;
        </p>
      </div>

      {/* Expanded Holographic Sovereign Passport Card */}
      <div className="w-full max-w-4xl p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121622] via-[#0c0f16] to-[#07090e] border border-amber-500/30 shadow-[0_0_90px_rgba(245,158,11,0.18)] relative overflow-hidden text-left space-y-6">
        {/* Subtle decorative security grid & watermark */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />

        {/* Top Official Passport Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-amber-500/20 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-300">
            <Globe2 className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-widest uppercase text-[11px]">
              REPUBLIC OF ZENVITRA &bull; SOVEREIGN DELEGATE DOSSIER
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto text-right">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] tracking-wider uppercase">
              CHIP-AUTHENTICATED
            </span>
            <div>
              <span className="text-[9px] text-neutral-500 block uppercase">NODE IDENTIFIER</span>
              <span className="text-xs font-bold text-white block">ZEN-NODE-{nodeNumber}</span>
            </div>
          </div>
        </div>

        {/* Master Two-Column Passport Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Left Column (5 cols): Identity, Role, Clearance & Level XP */}
          <div className="lg:col-span-5 space-y-4">
            {/* User Profile Card Snapshot */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3.5">
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 p-0.5 shadow-xl shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#090c12] flex items-center justify-center text-2xl font-black font-display text-white">
                    {displayHandle[0].toUpperCase()}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white font-display truncate">@{displayHandle}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase shrink-0">
                      {roleTrack || 'ADMIN'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-snug">
                    Active Diplomat &bull; Youth Delegate Node &bull; Verified Account
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono text-cyan-400/90 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                    Chapter: National Youth Delegation
                  </span>
                </div>
              </div>

              {/* Diplomatic Level & XP Progression Bar */}
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-cyan-400" />
                    <span>RANK: TIER II DIPLOMAT</span>
                  </span>
                  <span className="text-amber-300 font-bold">1,450 / 2,000 XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 w-[72%]" />
                </div>
              </div>

              {/* Cryptographic Security Hash */}
              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 pt-1 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-amber-400/80" />
                  <span>SHA-256 LEDGER HASH</span>
                </span>
                <span className="text-neutral-400">0x7F9B...4D2E (VERIFIED)</span>
              </div>
            </div>

            {/* Quick Metrics Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-neutral-500 block uppercase">STAMPS</span>
                <span className="font-bold text-amber-300 text-sm">4 Verified</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-neutral-500 block uppercase">COMMITTEES</span>
                <span className="font-bold text-cyan-300 text-sm">8 Debates</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-neutral-500 block uppercase">RESOLUTIONS</span>
                <span className="font-bold text-emerald-300 text-sm">5 Co-Sponsored</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-neutral-500 block uppercase">SOVEREIGN KARMA</span>
                <span className="font-bold text-purple-300 text-sm">185 Score</span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Verifiable Passport Stamps Showcase & Skills */}
          <div className="lg:col-span-7 space-y-4">
            {/* Verified Stamps Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>VERIFIED PASSPORT STAMPS &bull; IMMUTABLE RECORDS</span>
                </span>
                <span className="text-[10px] text-emerald-400">4 OF 4 UNLOCKED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PASSPORT_STAMPS.map((stamp) => (
                  <div
                    key={stamp.id}
                    className={`p-3 rounded-2xl border ${stamp.color} space-y-1 transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className="font-bold uppercase tracking-wider">{stamp.date}</span>
                      <ShieldCheck className={`w-3.5 h-3.5 ${stamp.sealColor}`} />
                    </div>
                    <span className="text-xs font-bold font-display text-white block truncate">
                      {stamp.event}
                    </span>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                      <span className="font-semibold">{stamp.role}</span>
                      <span className="text-[9px] text-neutral-400 truncate max-w-[100px]">{stamp.chamber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diplomatic Specializations & Endorsements */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                ENDORSED DIPLOMATIC SKILLS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_TAGS.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] font-mono text-neutral-200"
                  >
                    &bull; {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Passport Ledger Pipeline */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-1 text-center font-mono text-[9px] sm:text-[10px]">
              <div className="space-y-0.5">
                <span className="text-neutral-500 block text-[8px] uppercase">EVENT</span>
                <span className="font-bold text-white">Summit Entry</span>
              </div>
              <span className="text-neutral-600">&rarr;</span>
              <div className="space-y-0.5">
                <span className="text-neutral-500 block text-[8px] uppercase">PARTICIPATION</span>
                <span className="font-bold text-cyan-300">Floor Caucuses</span>
              </div>
              <span className="text-neutral-600">&rarr;</span>
              <div className="space-y-0.5">
                <span className="text-neutral-500 block text-[8px] uppercase">ACHIEVEMENT</span>
                <span className="font-bold text-amber-300">Resolutions</span>
              </div>
              <span className="text-neutral-600">&rarr;</span>
              <div className="space-y-0.5">
                <span className="text-neutral-500 block text-[8px] uppercase">RECORD</span>
                <span className="font-bold text-emerald-300">Permanent ID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passport Footer Guarantee */}
        <div className="pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-neutral-400">
          <span>Official Sovereign Passport authenticated under the ZENVITRA Charter.</span>
          <span className="text-amber-400 font-bold uppercase tracking-wider">Zero Fake Credentials Guaranteed</span>
        </div>
      </div>

      {/* Next CTA */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-400 hover:to-rose-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer group"
        >
          <span>COMMUNITY &amp; EXPRESSION</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
