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
  LogOut
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
        <div className="flex items-center gap-3 font-mono text-sm text-cyan-400">
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span>Synchronising Cryptographic ZEN.PASSPORT...</span>
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
    <div className="min-h-screen bg-[#030407] text-white pt-24 pb-20 px-3 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-cyan-600/10 via-purple-600/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#080a10]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪪</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>ZEN.PASSPORT</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  SOVEREIGN RECORD
                </span>
              </h1>
            </div>
            <p className="text-xs text-neutral-400 font-sans">
              Your identity. Your journey. Your record.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Passport ID Copy Pill */}
            <button
              type="button"
              onClick={handleCopyPassportId}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs font-mono text-neutral-200 hover:text-white transition cursor-pointer"
              title="Click to copy Universal Passport ID"
            >
              <span className="text-cyan-400 font-bold">{passport.passportId}</span>
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            </button>

            {/* QR Scanner Trigger */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs font-mono text-neutral-200 hover:text-white transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>QR Terminal</span>
            </button>

            {/* Share / Public View Link */}
            <button
              type="button"
              onClick={handleCopyPublicLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs font-mono text-neutral-200 hover:text-white transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{copiedPublicLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <Link
              href={`/passport/${passport.username}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all hover:scale-[1.02] shadow-md cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-black" />
              <span>Public View</span>
            </Link>

            {passport.username === 'test' && (
              <button
                type="button"
                onClick={async () => {
                  await signOut({ forceFullLogout: true });
                  router.push('/login');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold hover:bg-rose-500/25 transition cursor-pointer shadow-sm active:scale-95"
                title="Sign out of Test Node"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Identity & Merit Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#080a10]/60 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 block uppercase">ZEN.POINTS</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">{points}</span>
            </div>
            <Link href="/leaderboard" className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:scale-105 transition">
              <Trophy className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-[#080a10]/60 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 block uppercase">TIER STATUS</span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 block truncate">{levelDetails.tag}</span>
            </div>
            <button
              type="button"
              onClick={() => setVerificationModalOpen(true)}
              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-mono hover:bg-amber-500/20 transition cursor-pointer"
            >
              UPGRADE
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#080a10]/60 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 block uppercase">WALLET PASSES</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">{passport.wallet.length}</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080a10]/60 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 block uppercase">JOURNEY STONES</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">{passport.timeline.length}</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('CARD')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'CARD'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <span>🪪 PASSPORT CARD</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('WALLET')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'WALLET'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>ZEN.WALLET ({passport.wallet.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'TIMELINE'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>JOURNEY TIMELINE</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECTIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'SECTIONS'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>RECORD SECTIONS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PRIVACY')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'PRIVACY'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>PRIVACY &amp; VISIBILITY</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'CARD' && (
            <div className="space-y-8">
              {/* Tactile Holographic Card View */}
              <div className="flex flex-col items-center">
                <ZenPassportCard
                  passport={passport}
                  onOpenQr={() => setQrModalOpen(true)}
                  onOpenVerifyModal={() => setVerificationModalOpen(true)}
                />
              </div>

              {/* Verified Activity Badges */}
              <div className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      VERIFIED ACTIVITY BADGES
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Earned exclusively through verified summit attendance, dais leadership, and publications.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">
                    {passport.badges.filter(b => b.isUnlocked).length} / {passport.badges.length} UNLOCKED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {passport.badges.map((b) => (
                    <div
                      key={b.id}
                      className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                        b.isUnlocked
                          ? 'bg-white/[0.04] border-white/20 text-white shadow-md'
                          : 'bg-black/40 border-white/5 text-neutral-600 opacity-60'
                      }`}
                      title={b.description}
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
            <div className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Public Passport Visibility Controls</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Choose which verified achievements and milestones appear on your public shareable profile.
                </p>
              </div>

              {/* Immutable Shield Note */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Guaranteed Zero Exposure for Sensitive Fields</p>
                  <p className="text-neutral-300 mt-1 leading-relaxed">
                    Personal phone numbers, raw email addresses, physical government documents, and student ID scans are permanently air-gapped and are never exposed via the public API or public passport URLs.
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {[
                  { key: 'showPublicBadges', label: 'Display Verified Activity Badges', desc: 'Show badges like 🗣️ DEBATER, 🏛️ DIPLOMAT on public card' },
                  { key: 'showPublicAchievements', label: 'Display Verified Accolades & Merits', desc: 'Publicly show authenticated conference awards' },
                  { key: 'showPublicEvents', label: 'Display Events & Summit Attended', desc: 'Show verified participation credentials in public wallet' },
                  { key: 'showPublicTimeline', label: 'Display Living Journey Timeline', desc: 'Permit public viewers to see chronological career milestones' },
                  { key: 'showPublicEducation', label: 'Display Verified Education Status', desc: 'Show school/university name & Student Verified status' },
                ].map((item) => {
                  const val = (passport.privacy as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.label}</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
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
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
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
