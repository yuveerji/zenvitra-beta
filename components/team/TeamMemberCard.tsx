'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Crown,
  Sparkles,
  Zap,
  ArrowUpRight,
  Github,
  Linkedin,
  Twitter,
  Mail,
  UserCheck,
  PlusCircle,
  ShieldCheck,
  Terminal,
  Compass,
  Layers,
  Newspaper,
  Shield
} from 'lucide-react';
import { CoreTeamMember } from '@/lib/coreTeamData';

interface TeamMemberCardProps {
  member: CoreTeamMember;
  isHero?: boolean;
  className?: string;
}

export function TeamMemberCard({ member, isHero = false, className = '' }: TeamMemberCardProps) {
  const [imgError, setImgError] = useState(false);

  const isFounder = member.category === 'founder';
  const isCofounder = member.category === 'cofounder';
  const isVacant = member.isVacancy;

  // Department icon mapping
  const getDeptIcon = () => {
    switch (member.department) {
      case 'Executive':
        return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      case 'Engineering':
        return <Terminal className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Secretariat':
        return <Compass className="w-3.5 h-3.5 text-purple-400" />;
      case 'Design & Media':
        return <Layers className="w-3.5 h-3.5 text-pink-400" />;
      case 'Press':
        return <Newspaper className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Impact':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      case 'Operations':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  // Border & Glow styling
  const cardBorder = isFounder
    ? 'border-amber-500/40 hover:border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.12)] hover:shadow-[0_0_50px_rgba(245,158,11,0.22)]'
    : isCofounder
    ? 'border-indigo-500/30 hover:border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.08)] hover:shadow-[0_0_40px_rgba(99,102,241,0.18)]'
    : 'border-white/10 hover:border-white/25 shadow-lg';

  const glowBg = isFounder
    ? 'bg-gradient-to-br from-amber-500/10 via-[#0a0d17]/90 to-[#070910]'
    : isCofounder
    ? 'bg-gradient-to-br from-indigo-500/10 via-[#0a0d17]/90 to-[#070910]'
    : 'bg-[#080a12]/80 hover:bg-[#0b0e1a]/90';

  if (isHero) {
    return (
      <div
        className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${glowBg} backdrop-blur-2xl transition-all duration-300 p-6 sm:p-10 ${className}`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Photo & Founder Crest */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden bg-black/60 border-2 border-amber-400/60 shadow-2xl">
                {member.avatarUrl && !imgError ? (
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 192px, 240px"
                    className="object-cover object-top transition duration-500 group-hover:scale-105"
                    priority
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900/40 to-black text-amber-300 font-serif text-5xl font-bold">
                    YC
                  </div>
                )}
                {/* Sovereign Crest Watermark */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-400/40 text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  SOVEREIGN
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold font-mono">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                FOUNDING ARCHITECT
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE STEWARD
              </div>
            </div>
          </div>

          {/* Founder Bio, Thesis & Links */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
                  {member.name}
                </h2>
                {member.handle && (
                  <Link
                    href={`/passport/${member.handle}`}
                    className="inline-flex items-center gap-1 text-sm font-mono text-amber-400/90 hover:text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 transition"
                  >
                    @{member.handle}
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <p className="text-lg font-medium text-amber-400/90 mt-1">
                {member.role}
              </p>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base border-l-2 border-amber-500/40 pl-4 py-1">
              &ldquo;{member.bio}&rdquo;
            </p>

            {/* Focus Pillars */}
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 block mb-2">
                Core Domains & Oversight
              </span>
              <div className="flex flex-wrap gap-2">
                {member.focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions & Social */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/passport/yuveer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-sm hover:opacity-95 shadow-lg shadow-amber-500/20 transition"
              >
                <UserCheck className="w-4 h-4" />
                View Founder Passport
              </Link>
              <Link
                href="/pulse?user=yuveer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm transition"
              >
                Founder Pulse Broadcasts
              </Link>

              {member.socialLinks && (
                <div className="flex items-center gap-2 ml-auto">
                  {member.socialLinks.x && (
                    <a
                      href={member.socialLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
                      aria-label="X profile"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.socialLinks.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
                      aria-label="GitHub profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
                      aria-label="LinkedIn profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CO-FOUNDER & CORE TEAM CARDS ──
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${cardBorder} ${glowBg} backdrop-blur-xl p-6 transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300">
            {getDeptIcon()}
            <span>{member.department}</span>
          </div>

          {isCofounder && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-[11px] font-mono font-bold text-indigo-300">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              CO-FOUNDER
            </div>
          )}

          {!isCofounder && !isFounder && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[11px] font-mono text-cyan-300">
              <Zap className="w-3 h-3 text-cyan-400" />
              CORE LEAD
            </div>
          )}
        </div>

        {/* Member Header */}
        <div className="flex items-start gap-4 mb-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/15 flex-shrink-0 flex items-center justify-center">
            {member.avatarUrl && !imgError ? (
              <Image
                src={member.avatarUrl}
                alt={member.name}
                fill
                sizes="56px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-sm font-mono font-bold ${
                  isCofounder
                    ? 'bg-gradient-to-br from-indigo-950 to-black text-indigo-300'
                    : 'bg-gradient-to-br from-slate-900 to-black text-cyan-300'
                }`}
              >
                {isVacant ? '+' : member.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white truncate group-hover:text-amber-200 transition">
              {member.name}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-zinc-400 line-clamp-1">
              {member.role}
            </p>
            {member.handle && (
              <Link
                href={`/passport/${member.handle}`}
                className="inline-flex items-center gap-0.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 mt-0.5"
              >
                @{member.handle}
              </Link>
            )}
          </div>
        </div>

        {/* Description / Bio */}
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3">
          {member.bio}
        </p>

        {/* Focus Areas */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {member.focusAreas.map((focus, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Call To Action */}
      <div className="pt-3 border-t border-white/10 mt-auto">
        {isVacant ? (
          <Link
            href={`/join-core-team?track=${member.applyTrack || 'other'}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-indigo-600/20 text-zinc-200 hover:text-indigo-200 border border-white/15 hover:border-indigo-400/40 text-xs font-mono font-bold transition group-hover:border-white/30"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
            Apply For This Seat
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70" />
          </Link>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Verified Core Member
            </span>
            {member.handle && (
              <Link
                href={`/passport/${member.handle}`}
                className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1"
              >
                Passport <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
