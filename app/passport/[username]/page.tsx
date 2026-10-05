'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ZenPassport, 
  getPassport, 
  getOrCreateDefaultPassport,
  fetchServerPassport, 
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
  ExternalLink,
  Fingerprint
} from 'lucide-react';

export default function PublicPassportPage() {
  const params = useParams();
  const router = useRouter();
  const username = (typeof params?.username === 'string' ? params.username : 'yuveer').toLowerCase();

  const [passport, setPassport] = useState<ZenPassport | null>(null);
  const [activeTab, setActiveTab] = useState<'CARD' | 'WALLET' | 'TIMELINE' | 'ACCOLADES'>('CARD');
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    // 1. Instant load from local cache or fallback
    const existing = getPassport(username);
    if (existing) {
      if (username === 'test') {
        existing.fullName = 'Test Node';
        existing.statusLabel = 'Test Node';
      }
      setPassport(existing);
    } else {
      const name = username === 'test' ? 'Test Node' : (username === 'yuveer' ? 'Yuveer Chhatwani' : username.charAt(0).toUpperCase() + username.slice(1));
      const generated = getOrCreateDefaultPassport(username, name);
      if (username === 'test') {
        generated.fullName = 'Test Node';
        generated.statusLabel = 'Test Node';
      }
      setPassport(generated);
    }

    // 2. Query authentic passport record from server API
    fetchServerPassport(username).then((serverRecord) => {
      if (serverRecord) {
        if (username === 'test') {
          serverRecord.fullName = 'Test Node';
          serverRecord.statusLabel = 'Test Node';
        }
        setPassport(serverRecord);
      }
    });
  }, [username]);

  if (!passport) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center">
        <div className="text-center space-y-3 font-sans">
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
    <div className="min-h-screen bg-[#030407] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-600/10 via-purple-600/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        
        {/* Back and Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-500 uppercase">AUTHENTICATED DOSSIER</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          </div>
        </div>

        {/* Public Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080a11]/90 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                {passport.fullName}
              </h1>
              <span className="text-xs font-sans font-semibold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
                @{passport.username}
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {passport.passportId}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              Verified ZENVITRA Diplomatic Passport • Node active since {passport.memberSince}
            </p>

            {passport.privacy.showPublicEducation && passport.education && (
              <div className="flex items-center gap-2 text-xs text-neutral-300 font-sans pt-1">
                <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-semibold">{passport.education.institution}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">{passport.education.degreeOrGrade}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/15 border border-white/15 text-xs font-sans font-semibold text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Verify QR</span>
            </button>

            <Link
              href={`/passport/verify/${passport.passportId}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-all hover:scale-[1.02] shadow-lg shadow-white/10 cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographic Proof</span>
            </Link>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#080a11]/80 border border-white/10 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('CARD')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'CARD'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Identity Credential</span>
          </button>

          {passport.privacy.showPublicEvents && (
            <button
              type="button"
              onClick={() => setActiveTab('WALLET')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'WALLET'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Wallet className="w-4 h-4 text-purple-400" />
              <span>Verified Credentials ({visibleWallet.length})</span>
            </button>
          )}

          {passport.privacy.showPublicTimeline && (
            <button
              type="button"
              onClick={() => setActiveTab('TIMELINE')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'TIMELINE'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Journey Timeline</span>
            </button>
          )}

          {passport.privacy.showPublicAchievements && (
            <button
              type="button"
              onClick={() => setActiveTab('ACCOLADES')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'ACCOLADES'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Accolades &amp; MUN</span>
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
                <div className="w-full p-6 sm:p-8 rounded-3xl bg-[#080a11]/80 border border-white/10 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-display font-extrabold text-white tracking-wide flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>VERIFIED ACCREDITATIONS</span>
                    </h3>
                    <span className="text-xs font-sans font-semibold text-cyan-300">
                      {passport.badges.filter(b => b.isUnlocked).length} Unlocked
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                    {passport.badges.map((b) => (
                      <div
                        key={b.id}
                        className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                          b.isUnlocked
                            ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-white/20 text-white shadow-md'
                            : 'bg-black/40 border-white/5 text-neutral-600 opacity-50'
                        }`}
                        title={b.description}
                      >
                        <span className="text-3xl block filter drop-shadow">{b.icon}</span>
                        <p className="text-xs font-sans font-bold tracking-tight truncate">{b.name}</p>
                        <span className={`text-[10px] font-sans font-semibold block uppercase tracking-wider ${
                          b.isUnlocked ? 'text-emerald-400' : 'text-neutral-500'
                        }`}>
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
              <div className="p-6 sm:p-8 rounded-3xl bg-[#080a11]/80 border border-white/10 space-y-5">
                <h3 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Authenticated Accolades &amp; Multilateral Records</span>
                </h3>

                {passport.achievements.length === 0 && passport.munRecords.length === 0 ? (
                  <p className="text-xs text-neutral-400 font-sans">No public accolades recorded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {passport.munRecords.map((m) => (
                      <div key={m.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-display font-bold text-white">{m.conferenceName}</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                            {m.role}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans">{m.committee} • {m.portfolio}</p>
                        {m.award && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-sans font-semibold flex items-center gap-2 mt-2">
                            <Award className="w-4 h-4 text-amber-400" />
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
