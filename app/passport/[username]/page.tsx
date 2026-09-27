'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ZenPassport, 
  getPassport, 
  getOrCreateDefaultPassport,
  calculateZenPoints, 
  getVerificationLevelDetails 
} from '@/lib/passport';
import ZenPassportCard from '@/components/passport/ZenPassportCard';
import PassportQrModal from '@/components/passport/PassportQrModal';
import PassportWalletTab from '@/components/passport/PassportWalletTab';
import PassportTimelineTab from '@/components/passport/PassportTimelineTab';
import { 
  ShieldCheck, 
  QrCode, 
  ArrowLeft, 
  Trophy, 
  Clock, 
  Wallet, 
  GraduationCap, 
  Award, 
  FileText,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function PublicPassportPage() {
  const params = useParams();
  const router = useRouter();
  const username = (typeof params?.username === 'string' ? params.username : 'yuveer').toLowerCase();

  const [passport, setPassport] = useState<ZenPassport | null>(null);
  const [activeTab, setActiveTab] = useState<'CARD' | 'WALLET' | 'TIMELINE' | 'ACCOLADES'>('CARD');
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    // Attempt to load existing passport for this username
    const existing = getPassport(username);
    if (existing) {
      setPassport(existing);
    } else {
      // Deterministically create standard passport for recognized system user
      const name = username.charAt(0).toUpperCase() + username.slice(1);
      const generated = getOrCreateDefaultPassport(username, name);
      setPassport(generated);
    }
  }, [username]);

  if (!passport) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center">
        <div className="text-center space-y-3 font-mono">
          <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Verifying sovereign passport provenance...</p>
        </div>
      </div>
    );
  }

  const points = calculateZenPoints(passport);
  const levelDetails = getVerificationLevelDetails(passport.verification.level);

  // Filtered wallet according to privacy
  const visibleWallet = passport.privacy.showPublicEvents
    ? passport.wallet.filter(w => w.isVerified)
    : [];

  return (
    <div className="min-h-screen bg-[#030407] text-white pt-24 pb-20 px-3 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-cyan-600/10 via-purple-600/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Back and Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">AUTHENTICATED DISPATCH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Public Header Card */}
        <div className="p-6 rounded-3xl bg-[#080a10]/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {passport.fullName}
              </h1>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                @{passport.username}
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                {passport.passportId}
              </span>
            </div>

            <p className="text-xs text-neutral-400">
              Verified ZENVITRA Diplomatic Passport • Member since {passport.memberSince}
            </p>

            {passport.privacy.showPublicEducation && passport.education && (
              <div className="flex items-center gap-2 text-xs text-neutral-300 font-sans pt-1">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>{passport.education.institution}</span>
                <span className="text-neutral-500">•</span>
                <span>{passport.education.degreeOrGrade}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/15 border border-white/15 text-xs font-mono text-white transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Verify QR</span>
            </button>

            <Link
              href={`/passport/verify/${passport.passportId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all hover:scale-[1.02] shadow-md cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographic Proof</span>
            </Link>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('CARD')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'CARD'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white'
            }`}
          >
            🪪 PASSPORT CARD
          </button>

          {passport.privacy.showPublicEvents && (
            <button
              type="button"
              onClick={() => setActiveTab('WALLET')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'WALLET'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>VERIFIED CREDENTIALS</span>
            </button>
          )}

          {passport.privacy.showPublicTimeline && (
            <button
              type="button"
              onClick={() => setActiveTab('TIMELINE')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TIMELINE'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>JOURNEY TIMELINE</span>
            </button>
          )}

          {passport.privacy.showPublicAchievements && (
            <button
              type="button"
              onClick={() => setActiveTab('ACCOLADES')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ACCOLADES'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ACCOLADES &amp; MUN</span>
            </button>
          )}
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'CARD' && (
            <div className="space-y-8 flex flex-col items-center">
              <ZenPassportCard
                passport={passport}
                onOpenQr={() => setQrModalOpen(true)}
              />

              {/* Public Badges if allowed */}
              {passport.privacy.showPublicBadges && (
                <div className="w-full p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    VERIFIED ACTIVITY BADGES
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {passport.badges.map((b) => (
                      <div
                        key={b.id}
                        className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                          b.isUnlocked
                            ? 'bg-white/[0.04] border-white/20 text-white shadow-md'
                            : 'bg-black/40 border-white/5 text-neutral-600 opacity-60'
                        }`}
                      >
                        <span className="text-2xl block">{b.icon}</span>
                        <p className="text-[11px] font-bold font-mono tracking-wider truncate">{b.name}</p>
                        <span className={`text-[9px] font-mono block ${b.isUnlocked ? 'text-emerald-400' : 'text-neutral-500'}`}>
                          {b.isUnlocked ? 'VERIFIED' : 'LOCKED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'WALLET' && passport.privacy.showPublicEvents && (
            <PassportWalletTab
              passport={{
                ...passport,
                wallet: visibleWallet
              }}
              isOwner={false}
            />
          )}

          {activeTab === 'TIMELINE' && passport.privacy.showPublicTimeline && (
            <PassportTimelineTab
              passport={passport}
              isOwner={false}
            />
          )}

          {activeTab === 'ACCOLADES' && passport.privacy.showPublicAchievements && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Authenticated Accolades &amp; Multilateral Records</span>
                </h3>

                {passport.achievements.length === 0 && passport.munRecords.length === 0 ? (
                  <p className="text-xs text-neutral-500">No public accolades posted yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {passport.munRecords.map((m) => (
                      <div key={m.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{m.conferenceName}</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {m.role}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">{m.committee} • {m.portfolio}</p>
                        {m.award && (
                          <div className="p-2 rounded bg-amber-500/10 text-amber-300 text-xs font-semibold flex items-center gap-1.5 mt-2">
                            <Award className="w-3.5 h-3.5" />
                            <span>{m.award}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Modal */}
      <PassportQrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        passportId={passport.passportId}
        fullName={passport.fullName}
        username={passport.username}
        verificationLevel={passport.verification.level}
      />
    </div>
  );
}
