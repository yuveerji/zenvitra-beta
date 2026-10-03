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
  GraduationCap
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
      : `https://zenvitra.com/passport/${passport.username}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <>
      <div className="relative group w-full max-w-lg mx-auto">
        {/* Holographic Glowing Ambient Aura */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/25 via-purple-500/25 to-cyan-500/25 rounded-[2.8rem] blur-2xl opacity-40 group-hover:opacity-75 transition duration-500 pointer-events-none" />

        {/* Tactile Sovereign Passport Card */}
        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#0d0f14] via-[#07080b] to-[#040406] border border-white/15 p-4 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-3xl overflow-hidden space-y-5 sm:space-y-6 text-left">
          
          {/* Top Foil Band */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs tracking-widest font-black text-white uppercase">
                ZEN.PASSPORT
              </span>
            </div>
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${verificationMeta.color}`}>
              {verificationMeta.badge}
            </span>
          </div>

          {/* Profile Identity Row */}
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Avatar / Holographic Portrait */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500/30 via-neutral-800 to-black border-2 border-white/20 overflow-hidden shadow-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                {passport.avatarUrl ? (
                  <img src={passport.avatarUrl} alt={passport.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{passport.fullName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 p-0.5 sm:p-1 rounded-full bg-emerald-400 text-black shadow-md" title="Verified Sovereign Node">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Name, Handle, Status */}
            <div className="flex-1 min-w-0 space-y-1">
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate font-sans">
                {passport.fullName}
              </h2>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-neutral-400 truncate">
                <span className="text-purple-300 font-semibold truncate">@{passport.username}</span>
                <span>&bull;</span>
                <span className="shrink-0">Since {passport.memberSince}</span>
              </div>

              {/* Status Pill */}
              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                  <span className="truncate">{passport.statusLabel}</span>
                </span>
                {passport.education?.institution && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono text-neutral-300 bg-white/5 border border-white/10 truncate max-w-[150px] sm:max-w-[200px]">
                    <GraduationCap className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{passport.education.institution}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Permanent Identifier Band */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 font-mono">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-500 block font-semibold truncate">
                PERMANENT IDENTIFIER
              </span>
              <span className="text-xs sm:text-base font-black tracking-widest text-cyan-400 truncate block">
                {passport.passportId}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-500 block font-semibold">
                SECURITY
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-neutral-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                SHA-256
              </span>
            </div>
          </div>

          {/* Verified Activity Stats Grid */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1 border-t border-white/10 font-mono text-center">
            <div className="space-y-0.5">
              <span className="text-sm sm:text-base font-black text-white">{eventCount}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400 block font-medium">EVENTS</span>
            </div>
            <div className="space-y-0.5 border-l border-white/10">
              <span className="text-sm sm:text-base font-black text-amber-400">{awardCount}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400 block font-medium">AWARDS</span>
            </div>
            <div className="space-y-0.5 border-l border-white/10">
              <span className="text-sm sm:text-base font-black text-cyan-400">{activityCount}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400 block font-medium">JOURNEY</span>
            </div>
            <div className="space-y-0.5 border-l border-white/10">
              <span className="text-sm sm:text-base font-black text-purple-300">{contributionCount}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400 block font-medium">AIDS</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2">
            <Link
              href={`/passport/${passport.username}`}
              className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md text-center truncate"
            >
              <span>View Dossier</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (onOpenQr) onOpenQr();
                else setIsQrOpen(true);
              }}
              className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] sm:text-xs flex items-center justify-center gap-1 transition cursor-pointer truncate"
            >
              <QrCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
              <span>Verify QR</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] sm:text-xs flex items-center justify-center gap-1 transition cursor-pointer truncate"
            >
              {copiedShare ? (
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 shrink-0" />
              )}
              <span>{copiedShare ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <PassportQrModal
        passport={passport}
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />
    </>
  );
}

export default ZenPassportCard;
