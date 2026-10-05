'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  QrCode, 
  Share2, 
  Sparkles, 
  Award, 
  Calendar, 
  Activity, 
  Check, 
  ExternalLink,
  GraduationCap,
  Fingerprint
} from 'lucide-react';
import { ZenPassport, getVerificationLevelDetails } from '@/lib/passport';
import { PassportQrModal } from './PassportQrModal';

interface ZenPassportCardProps {
  passport: ZenPassport;
  isOwner?: boolean;
  onOpenQr?: () => void;
  onOpenVerifyModal?: () => void;
}

export function ZenPassportCard({ passport, isOwner = false, onOpenQr, onOpenVerifyModal }: ZenPassportCardProps) {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const verificationMeta = getVerificationLevelDetails(passport.verification.level);

  const eventCount = passport.munRecords.length;
  const awardCount = passport.achievements.length + passport.munRecords.filter((m) => Boolean(m.award)).length;
  const activityCount = passport.timeline.length;
  const contributionCount = passport.contributions.length;

  const handleShare = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/passport/${passport.username}`
      : `https://zenvitra.xyz/passport/${passport.username}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <>
      <div className="relative group w-full max-w-xl mx-auto select-none">
        {/* Holographic Glowing Ambient Aura */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-purple-500/25 rounded-[2.8rem] blur-2xl opacity-50 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none" />

        {/* Outer Iridescent Foil Border */}
        <div className="relative p-[1px] rounded-[2.2rem] sm:rounded-[2.6rem] bg-gradient-to-br from-white/30 via-cyan-400/20 to-amber-400/30 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)]">
          {/* Card Body */}
          <div className="relative rounded-[2.15rem] sm:rounded-[2.55rem] bg-gradient-to-b from-[#0f121a] via-[#090b11] to-[#040507] p-5 sm:p-8 backdrop-blur-3xl overflow-hidden space-y-6 text-left">
            
            {/* Background Guilloche / Security Pattern Watermark */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" 
              aria-hidden="true" 
            />
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Security Header Band */}
            <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                {/* Biometric Passport Symbol */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400/20 to-cyan-400/10 border border-white/15 flex items-center justify-center shadow-inner">
                  <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                    <span className="font-sans text-[10px] tracking-[0.22em] font-bold text-neutral-400 uppercase">
                      ZENVITRA PROTOCOL
                    </span>
                  </div>
                  <h3 className="font-display text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
                    SOVEREIGN DIPLOMATIC PASSPORT
                  </h3>
                </div>
              </div>

              {/* Status / Level Pill */}
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] sm:text-[11px] font-sans font-bold tracking-wide px-3 py-1 rounded-full border shadow-sm ${verificationMeta.color}`}>
                  {verificationMeta.badge}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                  LEVEL {passport.verification.level} • DIPLOMAT
                </span>
              </div>
            </div>

            {/* Profile Identity & Smart Chip Section */}
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                {/* Avatar / Biometric Frame */}
                <div className="relative shrink-0">
                  <div className="p-[2px] rounded-2xl sm:rounded-[1.4rem] bg-gradient-to-tr from-amber-400/40 via-white/20 to-cyan-400/40 shadow-xl">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[0.95rem] sm:rounded-[1.3rem] bg-gradient-to-br from-[#1a1e29] via-[#0d0f14] to-black overflow-hidden flex items-center justify-center text-2xl sm:text-3xl font-display font-black text-white">
                      {passport.avatarUrl ? (
                        <img src={passport.avatarUrl} alt={passport.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{passport.fullName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-400 text-black shadow-lg" title="Verified Cryptographic Node">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Identity Information */}
                <div className="space-y-1.5 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight truncate leading-tight">
                    {passport.fullName}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-xs font-sans text-neutral-400 truncate">
                    <span className="text-cyan-300 font-semibold truncate">@{passport.username}</span>
                    <span className="text-neutral-600">&bull;</span>
                    <span className="shrink-0 text-neutral-400">Node since {passport.memberSince}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold tracking-wide uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span className="truncate">{passport.statusLabel}</span>
                    </span>

                    {passport.education?.institution && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans text-neutral-300 bg-white/[0.04] border border-white/10 truncate max-w-[200px]">
                        <GraduationCap className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{passport.education.institution}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hardware Biometric Security Chip Visual */}
              <div className="hidden sm:flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-br from-amber-400/10 via-amber-300/5 to-transparent border border-amber-400/20 shadow-inner">
                {/* Golden Microchip Graphic */}
                <div className="w-11 h-9 rounded-md bg-gradient-to-br from-amber-400/30 via-amber-300/20 to-amber-600/30 border border-amber-300/40 p-1 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between">
                    <div className="w-2.5 h-1.5 rounded-xs border-b border-r border-amber-300/60" />
                    <div className="w-2.5 h-1.5 rounded-xs border-b border-l border-amber-300/60" />
                  </div>
                  <div className="w-full h-2 rounded-xs border border-amber-300/60 bg-amber-400/10" />
                  <div className="flex justify-between">
                    <div className="w-2.5 h-1.5 rounded-xs border-t border-r border-amber-300/60" />
                    <div className="w-2.5 h-1.5 rounded-xs border-t border-l border-amber-300/60" />
                  </div>
                </div>
                <span className="text-[8px] font-mono tracking-widest text-amber-300/70 mt-1 uppercase font-semibold">
                  SECURE CHIP
                </span>
              </div>
            </div>

            {/* Permanent Ledger Identifier Strip */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-sans font-semibold">
                  PERMANENT PASSPORT IDENTIFIER
                </span>
                <span className="text-sm sm:text-base font-mono font-bold tracking-widest text-cyan-300 truncate block">
                  {passport.passportId}
                </span>
              </div>
              <div className="text-right shrink-0 flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 block font-sans font-semibold">
                    SECURITY
                  </span>
                  <span className="text-[10px] font-mono font-bold text-neutral-300">
                    ED25519 • SHA-256
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
                  <Fingerprint className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Verified Merits & Activity Stats Grid */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="space-y-0.5">
                <span className="text-base sm:text-xl font-display font-black text-white">{eventCount}</span>
                <span className="text-[10px] font-sans font-medium tracking-wider text-neutral-400 block uppercase">
                  EVENTS
                </span>
              </div>
              <div className="space-y-0.5 border-l border-white/10">
                <span className="text-base sm:text-xl font-display font-black text-amber-400">{awardCount}</span>
                <span className="text-[10px] font-sans font-medium tracking-wider text-neutral-400 block uppercase">
                  HONORS
                </span>
              </div>
              <div className="space-y-0.5 border-l border-white/10">
                <span className="text-base sm:text-xl font-display font-black text-cyan-400">{activityCount}</span>
                <span className="text-[10px] font-sans font-medium tracking-wider text-neutral-400 block uppercase">
                  JOURNEY
                </span>
              </div>
              <div className="space-y-0.5 border-l border-white/10">
                <span className="text-base sm:text-xl font-display font-black text-purple-300">{contributionCount}</span>
                <span className="text-[10px] font-sans font-medium tracking-wider text-neutral-400 block uppercase">
                  MERITS
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <Link
                href={`/passport/${passport.username}`}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-white/10 text-center truncate active:scale-[0.98]"
              >
                <span>View Dossier</span>
              </Link>
              
              <button
                type="button"
                onClick={() => {
                  if (onOpenQr) onOpenQr();
                  else setIsQrOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-sans font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate active:scale-[0.98]"
              >
                <QrCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Verify QR</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-sans font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate active:scale-[0.98]"
              >
                {copiedShare ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                )}
                <span>{copiedShare ? 'Copied' : 'Share'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* QR Verification Modal */}
      <PassportQrModal
        passport={passport}
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />
    </>
  );
}

export default ZenPassportCard;
