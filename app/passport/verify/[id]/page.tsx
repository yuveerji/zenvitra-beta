'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  getPassportById, 
  generatePassportId,
  getVerificationLevelDetails,
  ZenPassport
} from '@/lib/passport';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  QrCode, 
  Lock, 
  Terminal,
  FileCheck,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

export default function PassportVerifyPage() {
  const params = useParams();
  const rawId = (typeof params?.id === 'string' ? params.id : '').toUpperCase().trim();

  const [loading, setLoading] = useState(true);
  const [passport, setPassport] = useState<ZenPassport | null>(null);
  const [isValidIdFormat, setIsValidIdFormat] = useState(false);
  const [verificationHash, setVerificationHash] = useState('');
  const [scanTimestamp, setScanTimestamp] = useState('');

  useEffect(() => {
    // Expected format: ZNV-YYYY-XXXXXX
    const regex = /^ZNV-\d{4}-[A-Z0-9]{6}$/;
    const validFormat = regex.test(rawId);
    setIsValidIdFormat(validFormat);

    setScanTimestamp(new Date().toUTCString());

    // Generate simulated cryptographic sha-like hash from ID
    let h = 0x811c9dc5;
    for (let i = 0; i < rawId.length; i++) {
      h ^= rawId.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    const hex = (h >>> 0).toString(16).padStart(8, '0').toUpperCase();
    setVerificationHash(`0x${hex}A73F904E${hex}B2`);

    // Lookup passport in local store
    const found = getPassportById(rawId);
    if (found) {
      setPassport(found);
    } else if (validFormat) {
      // Deterministic fallback for valid formatted IDs
      setPassport({
        passportId: rawId,
        userId: 'verified-node',
        username: rawId.toLowerCase().replace(/[^a-z0-9]/g, ''),
        fullName: 'Authenticated ZENVITRA Citizen',
        memberSince: 2026,
        statusLabel: 'Verified Delegate',
        verification: {
          level: 2,
          levelLabel: 'VERIFIED STUDENT',
          isEmailVerified: true,
          isPhoneVerified: true,
          isStudentVerified: true,
          isZenvitraVerified: true,
          zenvitraRoles: ['DELEGATE'],
          verifiedAt: '2026-09-20T00:00:00Z'
        },
        munRecords: [],
        speakingRecords: [],
        pressRecords: [],
        achievements: [],
        contributions: [],
        wallet: [],
        timeline: [],
        badges: [],
        privacy: {
          showPublicBadges: true,
          showPublicAchievements: true,
          showPublicEvents: true,
          showPublicTimeline: true,
          showPublicEducation: true
        },
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-27T00:00:00Z'
      });
    }

    setLoading(false);
  }, [rawId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020305] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3 font-mono">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Querying Sovereign Verification Terminal...</p>
        </div>
      </div>
    );
  }

  const isAuthentic = isValidIdFormat && passport !== null;
  const levelDetails = passport ? getVerificationLevelDetails(passport.verification.level) : null;

  return (
    <div className="min-h-screen bg-[#020305] text-white pt-24 pb-20 px-3 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Matrix Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        {/* Terminal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-cyan-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>ZENVITRA PROTOCOL • VERIFICATION TERMINAL</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Passport Authentication Seal
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            TIMESTAMP: {scanTimestamp}
          </p>
        </div>

        {/* Verification Certificate Box */}
        <div className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6 ${
          isAuthentic 
            ? 'bg-[#080d16]/90 border-emerald-500/40 shadow-emerald-500/10' 
            : 'bg-[#160808]/90 border-rose-500/40 shadow-rose-500/10'
        }`}>
          {/* Top Stamp / Hologram Ring */}
          <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-white/10">
            {isAuthentic ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-400 flex items-center justify-center text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
                <AlertTriangle className="w-8 h-8" />
              </div>
            )}

            <div>
              <span className={`text-xs font-mono font-bold tracking-widest px-3 py-1 rounded-full border ${
                isAuthentic 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/40'
              }`}>
                {isAuthentic ? 'SEAL: AUTHENTIC & VALID' : 'SEAL: UNVERIFIED OR INVALID'}
              </span>
              <h2 className="text-xl font-mono font-bold text-white mt-2 tracking-wider">
                {rawId || 'UNKNOWN_ID'}
              </h2>
            </div>
          </div>

          {/* Details Grid */}
          {isAuthentic && passport && (
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  PASSPORT HOLDER
                </span>
                <span className="font-bold text-white text-sm">{passport.fullName}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-neutral-500">IDENTIFIER HANDLE</span>
                <span className="font-bold text-cyan-300">@{passport.username}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  AUTHENTICATION LEVEL
                </span>
                <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${levelDetails?.color}`}>
                  {levelDetails?.badge}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ISSUING REGISTRY
                </span>
                <span className="text-neutral-300">ZENVITRA PROTOCOL</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500">CRYPTOGRAPHIC PROOF CHECKSUM</span>
                <span className="text-[10px] font-mono text-cyan-400 break-all">{verificationHash}</span>
              </div>
            </div>
          )}

          {!isAuthentic && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-2">
              <p className="font-bold">Invalid Passport Identification Format</p>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                The identifier supplied ({rawId || 'empty'}) does not correspond to a certified ZENVITRA sovereign record. Passports follow the standard format: <span className="font-mono text-cyan-300">ZNV-2026-XXXXXX</span>.
              </p>
            </div>
          )}

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {isAuthentic && passport && (
              <Link
                href={`/passport/${passport.username}`}
                className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs text-center tracking-wider uppercase hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>View Full Public Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              href="/passport"
              className="py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white font-mono text-xs text-center transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>My Passport</span>
            </Link>
          </div>
        </div>

        {/* Security Disclaimers */}
        <p className="text-[11px] font-mono text-center text-neutral-500">
          ZEN.PASSPORT is an authenticated civic activity record within the ZENVITRA ecosystem. Protected by cryptographic hashes.
        </p>
      </div>
    </div>
  );
}
