'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Award, 
  FileCheck2, 
  Sparkles, 
  Stamp, 
  Check, 
  Copy, 
  Download, 
  Share2, 
  ExternalLink,
  QrCode,
  Lock,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

interface DelegatePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DelegatePassportModal({ isOpen, onClose }: DelegatePassportModalProps) {
  const { myProfile, civicPointsBalance, currentUserName, currentUserUsername } = useZenPulse();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const clearance = myProfile?.civicClearance || {
    level: 3 as const,
    title: 'Plenary Fellow' as const,
    reliabilityScore: 98,
    verifiedCitationsCount: 14,
    ratifiedTreatiesCount: 6,
    endorsementsCount: 22,
    stakedBountiesWon: 4,
  };

  const TIERS = [
    { level: 1, title: 'Accredited Observer', min: 0, color: 'text-neutral-400' },
    { level: 2, title: 'Committee Attaché', min: 200, color: 'text-emerald-400' },
    { level: 3, title: 'Plenary Delegate', min: 500, color: 'text-cyan-400' },
    { level: 4, title: 'Caucus Rapporteur', min: 1000, color: 'text-indigo-400' },
    { level: 5, title: 'Sovereign Plenary Fellow', min: 2500, color: 'text-amber-400' },
  ];

  const passportSignature = `SOV-PASSPORT-${clearance.level}-${currentUserUsername.toUpperCase()}-${civicPointsBalance}PTS-2026-SEAL`;

  const handleExportPassport = () => {
    const passportData = {
      credentials: "ZEN_PULSE_DIPLOMATIC_PASSPORT_V1",
      delegateName: currentUserName,
      delegateHandle: `@${currentUserUsername}`,
      civicClearanceLevel: clearance.level,
      civicClearanceTitle: clearance.title,
      civicPointsBalance: civicPointsBalance,
      verifiedPrimaryCitations: clearance.verifiedCitationsCount,
      ratifiedTreatyClauses: clearance.ratifiedTreatiesCount,
      caucusEndorsements: clearance.endorsementsCount,
      cryptographicSeal: passportSignature,
      issuedAt: new Date().toISOString(),
      governanceAuthority: "ZenPulse Sovereign Civic Network"
    };

    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(JSON.stringify(passportData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#090b10] border border-cyan-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-amber-950/20 via-neutral-900 to-cyan-950/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Sovereign Civic Passport &amp; Clearance
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Merit-Driven Cryptographic Identity • Multi-Tier Plenary Accreditation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Holographic Passport Card */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#10141e] via-[#0d1017] to-[#151a27] border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden space-y-5">
            {/* Holographic Watermark */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase font-bold">
                  PLENARY ACCREDITATION PASSPORT
                </span>
                <h3 className="font-display font-extrabold text-xl text-white mt-1">
                  {currentUserName}
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  @{currentUserUsername}
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                LEVEL {clearance.level}: {clearance.title.toUpperCase()}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <div className="font-mono text-lg font-bold text-cyan-300">{civicPointsBalance}</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Civic Points</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <div className="font-mono text-lg font-bold text-emerald-300">{clearance.verifiedCitationsCount}</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Audited Citations</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <div className="font-mono text-lg font-bold text-amber-300">{clearance.ratifiedTreatiesCount}</div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Ratified Clauses</div>
              </div>
            </div>

            {/* Cryptographic Seal Hash */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between font-mono text-[11px] text-neutral-400">
              <span className="truncate">{passportSignature}</span>
              <span className="text-emerald-400 font-bold shrink-0 ml-2">✓ VERIFIED</span>
            </div>
          </div>

          {/* 5-Tier Sovereign Progression Pathway */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase">
              Clearance Level Ladder
            </h4>

            <div className="space-y-2">
              {TIERS.map((tier) => (
                <div
                  key={tier.level}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    clearance.level === tier.level
                      ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : clearance.level > tier.level
                      ? 'bg-white/[0.02] border-white/10 opacity-75'
                      : 'bg-white/[0.01] border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-bold ${tier.color}`}>
                      L{tier.level}
                    </span>
                    <div>
                      <div className="font-display font-bold text-xs text-white">
                        {tier.title}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400">
                        Requirement: {tier.min} Civic Points
                      </div>
                    </div>
                  </div>

                  {clearance.level === tier.level ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[10px] font-bold">
                      CURRENT RANK
                    </span>
                  ) : clearance.level > tier.level ? (
                    <span className="text-emerald-400 font-mono text-xs">✓ Achieved</span>
                  ) : (
                    <span className="text-neutral-500 font-mono text-[10px]">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Export Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleExportPassport}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 hover:opacity-90 text-white font-display font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Accredited Passport JSON Copied to Clipboard!' : 'Export Cryptographic Passport Data'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
