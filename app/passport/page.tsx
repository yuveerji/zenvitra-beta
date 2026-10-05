'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ZenPassport, 
  getOrCreateDefaultPassport, 
  savePassport, 
  calculateZenPoints, 
  getVerificationLevelDetails,
  VerificationLevel
} from '@/lib/passport';
import ZenPassportCard from '@/components/passport/ZenPassportCard';
import PassportQrModal from '@/components/passport/PassportQrModal';
import PassportWalletTab from '@/components/passport/PassportWalletTab';
import PassportTimelineTab from '@/components/passport/PassportTimelineTab';
import PassportSectionsTab from '@/components/passport/PassportSectionsTab';
import PassportVerificationModal from '@/components/passport/PassportVerificationModal';
import { 
  ShieldCheck, 
  QrCode, 
  ExternalLink, 
  Share2, 
  Copy, 
  Check, 
  Trophy, 
  Wallet, 
  Clock, 
  ListTree, 
  Eye, 
  Lock,
  Sparkles,
  LogOut,
  Fingerprint,
  Award,
  ChevronRight
} from 'lucide-react';

export default function PassportPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [passport, setPassport] = useState<ZenPassport | null>(null);
  const [activeTab, setActiveTab] = useState<'CARD' | 'WALLET' | 'TIMELINE' | 'SECTIONS' | 'PRIVACY'>('CARD');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPublicLink, setCopiedPublicLink] = useState(false);

  useEffect(() => {
    // Retrieve real logged-in session user
    let username = 'test';
    let fullName = 'Test Node';

    try {
      const storedSession = localStorage.getItem('zenvitra_session_user');
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed.username) username = parsed.username;
        if (parsed.display_name || parsed.name || parsed.displayName) {
          fullName = parsed.display_name || parsed.name || parsed.displayName;
        } else if (username === 'yuveer') {
          fullName = 'Yuveer Chhatwani';
        } else if (username === 'test') {
          fullName = 'Test Node';
        } else {
          fullName = username.charAt(0).toUpperCase() + username.slice(1);
        }
      }
    } catch (_) {}

    if (username === 'test') {
      fullName = 'Test Node';
      try {
        const storedTest = localStorage.getItem('zenvitra_passport_test');
        if (storedTest) {
          const p = JSON.parse(storedTest);
          if (p.fullName !== 'Test Node' || p.statusLabel !== 'Test Node') {
            p.fullName = 'Test Node';
            p.statusLabel = 'Test Node';
            localStorage.setItem('zenvitra_passport_test', JSON.stringify(p));
          }
        }
      } catch (_) {}
    }

    const userPassport = getOrCreateDefaultPassport(username, fullName);
    if (username === 'test') {
      userPassport.fullName = 'Test Node';
      userPassport.statusLabel = 'Test Node';
    }
    setPassport(userPassport);
  }, []);

  if (!passport) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 font-sans text-sm text-cyan-400">
          <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span>Synchronising Sovereign Passport Ledger...</span>
        </div>
      </div>
    );
  }

  const points = calculateZenPoints(passport);
  const levelDetails = getVerificationLevelDetails(passport.verification.level);

  const handleCopyPassportId = () => {
    navigator.clipboard.writeText(passport.passportId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPublicLink = () => {
    const link = `${window.location.origin}/passport/${passport.username}`;
    navigator.clipboard.writeText(link);
    setCopiedPublicLink(true);
    setTimeout(() => setCopiedPublicLink(false), 2000);
  };

  const handleUpdatePassport = (updated: ZenPassport) => {
    setPassport(updated);
    savePassport(updated);
  };

  const handleUpgradeLevel = (newLevel: VerificationLevel, details: { studentDocType?: string; zenvitraRoles?: string[] }) => {
    const updated: ZenPassport = {
      ...passport,
      verification: {
        ...passport.verification,
        level: newLevel,
        levelLabel: getVerificationLevelDetails(newLevel).tag,
        isEmailVerified: true,
        isPhoneVerified: true,
        isStudentVerified: newLevel >= 2,
        studentDocType: details.studentDocType || passport.verification.studentDocType,
        isZenvitraVerified: newLevel >= 3,
        zenvitraRoles: details.zenvitraRoles || passport.verification.zenvitraRoles,
        verifiedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };
    handleUpdatePassport(updated);
  };

  return (
    <div className="min-h-screen bg-[#030407] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-600/10 via-purple-600/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#080a11]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          
          <div className="flex items-start gap-4">
            {/* Sovereign Crest Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400/20 via-purple-500/10 to-transparent border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
              <Fingerprint className="w-6 h-6 text-cyan-300" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
                  ZENVITRA PASSPORT
                </h1>
                <span className="text-[11px] font-sans font-semibold px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  SOVEREIGN RECORD
                </span>
              </div>
              <p className="text-sm text-neutral-400 font-sans max-w-xl">
                Decentralized diplomatic identity, verified summit credentials, and immutable provenance ledger.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Passport ID Copy Pill */}
            <button
              type="button"
              onClick={handleCopyPassportId}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs font-mono text-neutral-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              title="Click to copy Universal Passport ID"
            >
              <span className="text-cyan-400 font-bold">{passport.passportId}</span>
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            </button>

            {/* QR Scanner Trigger */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs font-sans font-semibold text-neutral-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>QR Terminal</span>
            </button>

            {/* Share / Public View Link */}
            <button
              type="button"
              onClick={handleCopyPublicLink}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs font-sans font-semibold text-neutral-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>{copiedPublicLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            {/* Public View Link */}
            <Link
              href={`/passport/${passport.username}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-all hover:scale-[1.02] shadow-lg shadow-white/10 cursor-pointer active:scale-95"
            >
              <Eye className="w-4 h-4 text-black" />
              <span>Public View</span>
            </Link>

            {/* Sign Out (Test node or session) */}
            {passport.username === 'test' && (
              <button
                type="button"
                onClick={async () => {
                  await signOut({ forceFullLogout: true });
                  router.push('/login');
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-sans font-bold hover:bg-rose-500/25 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Sign out of Test Node"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Test Node Lifecycle Announcement Banner */}
        {passport.username === 'test' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 shadow-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-sans font-bold text-sm text-white">
                  Test Node Lifecycle Notice: Closing on 19th November 2026
                </p>
                <p className="font-sans text-xs text-amber-200/80 mt-0.5">
                  This test node is temporary and will officially sunset on 19th November 2026. Register a permanent sovereign citizen profile to preserve your records and credentials.
                </p>
              </div>
            </div>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-sans font-bold text-xs uppercase tracking-wider transition shrink-0 self-start sm:self-auto shadow-md"
            >
              Register Citizen Profile
            </Link>
          </div>
        )}

        {/* Bento Quick Identity & Merit Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* 1. Zen Points */}
          <div className="relative group p-5 rounded-2xl bg-[#080a11]/70 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-sans font-medium text-neutral-400 block">ZEN MERIT POINTS</span>
              <span className="text-2xl sm:text-3xl font-display font-black text-cyan-300 tracking-tight">{points}</span>
            </div>
            <Link 
              href="/leaderboard" 
              className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:scale-105 transition-all"
              title="View Sovereign Leaderboard"
            >
              <Trophy className="w-5 h-5" />
            </Link>
          </div>

          {/* 2. Tier Status */}
          <div className="relative group p-5 rounded-2xl bg-[#080a11]/70 border border-white/10 hover:border-amber-500/30 transition-all duration-300 flex items-center justify-between">
            <div className="space-y-1 min-w-0 pr-2">
              <span className="text-xs font-sans font-medium text-neutral-400 block">SOVEREIGN TIER</span>
              <span className="text-sm sm:text-base font-display font-extrabold text-amber-300 block truncate">
                {levelDetails.tag}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setVerificationModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-sans font-semibold hover:bg-amber-500/20 transition-all cursor-pointer shrink-0"
            >
              UPGRADE
            </button>
          </div>

          {/* 3. Wallet Passes */}
          <div className="relative group p-5 rounded-2xl bg-[#080a11]/70 border border-white/10 hover:border-purple-500/30 transition-all duration-300 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-sans font-medium text-neutral-400 block">CREDENTIAL WALLET</span>
              <span className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">{passport.wallet.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* 4. Journey Stones */}
          <div className="relative group p-5 rounded-2xl bg-[#080a11]/70 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-sans font-medium text-neutral-400 block">LIVING MILESTONES</span>
              <span className="text-2xl sm:text-3xl font-display font-black text-emerald-400 tracking-tight">{passport.timeline.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Modern Segmented Navigation Tabs */}
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
            <span>Identity Card</span>
          </button>

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
            <span>Credentials &amp; Wallet ({passport.wallet.length})</span>
          </button>

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

          <button
            type="button"
            onClick={() => setActiveTab('SECTIONS')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'SECTIONS'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <ListTree className="w-4 h-4 text-amber-400" />
            <span>Diplomatic Records</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PRIVACY')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'PRIVACY'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Privacy &amp; Shield</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'CARD' && (
            <div className="space-y-8">
              {/* Sovereign Passport Card Display */}
              <div className="flex flex-col items-center py-4">
                <ZenPassportCard
                  passport={passport}
                  onOpenQr={() => setQrModalOpen(true)}
                  onOpenVerifyModal={() => setVerificationModalOpen(true)}
                />
              </div>

              {/* Verified Activity Badges */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#080a11]/80 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-extrabold text-white tracking-wide flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span>VERIFIED DIPLOMATIC ACCREDITATIONS</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Permanent soulbound accolades earned exclusively through verified summit attendance, dais leadership, and publications.
                    </p>
                  </div>
                  <span className="text-xs font-sans font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shrink-0 self-start sm:self-auto">
                    {passport.badges.filter(b => b.isUnlocked).length} / {passport.badges.length} UNLOCKED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                  {passport.badges.map((b) => (
                    <div
                      key={b.id}
                      className={`p-4 rounded-2xl border text-center space-y-2 transition-all duration-300 ${
                        b.isUnlocked
                          ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-white/20 text-white shadow-lg shadow-white/5 hover:border-cyan-400/40 hover:-translate-y-0.5'
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
            </div>
          )}

          {activeTab === 'WALLET' && (
            <PassportWalletTab
              passport={passport}
              isOwner={true}
              onAddCredential={(cred) => {
                const updated: ZenPassport = {
                  ...passport,
                  wallet: [cred, ...passport.wallet]
                };
                handleUpdatePassport(updated);
              }}
            />
          )}

          {activeTab === 'TIMELINE' && (
            <PassportTimelineTab
              passport={passport}
              isOwner={true}
              onAddMilestone={(milestone) => {
                const updated: ZenPassport = {
                  ...passport,
                  timeline: [milestone, ...passport.timeline]
                };
                handleUpdatePassport(updated);
              }}
            />
          )}

          {activeTab === 'SECTIONS' && (
            <PassportSectionsTab
              passport={passport}
              isOwner={true}
              onUpdatePassport={handleUpdatePassport}
              onRequestVerificationModal={() => setVerificationModalOpen(true)}
            />
          )}

          {activeTab === 'PRIVACY' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080a11]/80 border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  <span>Public Passport Visibility Controls</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Granular controls to determine which authenticated records and achievements appear on your shareable public dossier.
                </p>
              </div>

              {/* Immutable Shield Note */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm">Guaranteed Zero Exposure for Sensitive Personal Identifiers</p>
                  <p className="text-neutral-300 leading-relaxed">
                    Personal telephone numbers, raw primary email addresses, physical government documents, and student card scans are permanently air-gapped and are never exposed via the public API or public passport URLs.
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {[
                  { key: 'showPublicBadges', label: 'Display Verified Activity Badges', desc: 'Display badges like 🗣️ DEBATER, 🏛️ DIPLOMAT on your public card' },
                  { key: 'showPublicAchievements', label: 'Display Verified Accolades & Merits', desc: 'Publicly show authenticated conference awards and citations' },
                  { key: 'showPublicEvents', label: 'Display Events & Summits Attended', desc: 'Show verified participation credentials in your public wallet' },
                  { key: 'showPublicTimeline', label: 'Display Living Journey Timeline', desc: 'Permit public viewers to view your chronological career milestones' },
                  { key: 'showPublicEducation', label: 'Display Verified Education Status', desc: 'Show school/university affiliation and Student Verified status' },
                ].map((item) => {
                  const val = (passport.privacy as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-colors"
                    >
                      <div>
                        <h4 className="text-sm font-sans font-bold text-white">{item.label}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated: ZenPassport = {
                            ...passport,
                            privacy: {
                              ...passport.privacy,
                              [item.key]: !val
                            }
                          };
                          handleUpdatePassport(updated);
                        }}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                          val ? 'bg-cyan-500' : 'bg-neutral-800'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            val ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Verification Modal */}
      <PassportQrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        passportId={passport.passportId}
        fullName={passport.fullName}
        username={passport.username}
        verificationLevel={passport.verification.level}
      />

      {/* Verification Level Upgrade Modal */}
      <PassportVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        passport={passport}
        onUpgradeLevel={handleUpgradeLevel}
      />
    </div>
  );
}
