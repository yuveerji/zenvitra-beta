'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
  Shield,
  Layers,
  Crown,
  Zap,
  Info
} from 'lucide-react';
import {
  ONBOARDING_REWARD_TIERS,
  getActiveSignTierMetrics,
  getOnboardingRewardClaimStatus,
  claimOnboardingReward,
  markPointsAddedScreenSeen,
  syncServerOnboardingRewardStatus,
  OnboardingRewardTier
} from '@/lib/onboardingRewards';
import PointsHistoryModal from '@/components/passport/PointsHistoryModal';

interface OnboardingRewardsSceneProps {
  onNext: () => void;
  userName?: string;
  roleTrack?: string;
}

export function OnboardingRewardsScene({ onNext, userName, roleTrack }: OnboardingRewardsSceneProps) {
  const [metrics, setMetrics] = useState(() => getActiveSignTierMetrics(userName));
  const [claimStatus, setClaimStatus] = useState(() => getOnboardingRewardClaimStatus(userName));
  const [isClaiming, setIsClaiming] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  useEffect(() => {
    setMetrics(getActiveSignTierMetrics(userName));
    setClaimStatus(getOnboardingRewardClaimStatus(userName));
    
    // Sync with server registry so cache clears never reset claim status
    syncServerOnboardingRewardStatus(userName).then((res) => {
      if (res.claimed) {
        setClaimStatus({
          claimed: true,
          points: res.points,
          tierId: res.tierId,
          userNumber: res.userNumber
        });
        markPointsAddedScreenSeen(userName);
      }
    });

    markPointsAddedScreenSeen(userName);
  }, [userName]);

  const handleClaimAndContinue = () => {
    if (isClaiming) return;
    setIsClaiming(true);

    if (!claimStatus.claimed) {
      claimOnboardingReward(userName);
      setJustClaimed(true);
      setClaimStatus({
        claimed: true,
        points: metrics.activeTier.points,
        tierId: metrics.activeTier.id,
        userNumber: metrics.userNumber
      });
      // Short delay for visual affirmation before transitioning
      setTimeout(() => {
        setIsClaiming(false);
        onNext();
      }, 700);
    } else {
      setIsClaiming(false);
      onNext();
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-4 py-6 sm:py-8 select-none">
      {/* Background radial ambient glow - Monochrome Brushed Silver */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Section */}
      <div className="text-center space-y-2 mb-6 sm:mb-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase mb-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>WELCOME BACK &bull; REWARD REDEMPTION &bull; TIERED POINT GRANTS</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white uppercase leading-tight"
        >
          OH, SO YOU ARE BACK! <span className="font-serif italic font-normal bg-gradient-to-r from-cyan-300 via-white to-amber-300 bg-clip-text text-transparent tracking-normal">Let&apos;s Redeem Your Rewards.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-xs sm:text-sm text-neutral-300 font-mono max-w-2xl mx-auto leading-relaxed"
        >
          You&apos;ve explored the Test Node sandbox. Now let&apos;s unlock your official Early Citizen Passport Points and immutably credit them to your live identity ledger.
        </motion.p>
      </div>

      {/* Live Slot Counter / Urgency Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="w-full max-w-4xl p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-700/80 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)] mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-200"></span>
            </span>
            <div className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-200">
              CURRENT TIER: <span className="text-white underline decoration-zinc-400 underline-offset-4">{metrics.activeTier.name} ({metrics.activeTier.rangeLabel})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white text-black font-mono font-black text-[10px] sm:text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(255,255,255,0.35)] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-zinc-900" />
              <span>{metrics.spotsRemainingInActiveTier} SPOTS REMAINING</span>
            </span>
          </div>
        </div>

        {/* Brushed Silver Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${metrics.progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-zinc-400 via-white to-zinc-300 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span>
              {claimStatus.claimed 
                ? `Citizen Slot #${claimStatus.userNumber || metrics.userNumber} claimed & permanently registered`
                : `Slot #${metrics.userNumber} of ${metrics.activeTier.maxUser === Infinity ? '500+' : metrics.activeTier.maxUser} available`}
            </span>
            <span className="font-bold text-zinc-300">
              {claimStatus.claimed ? '100% Secured' : `${metrics.progressPercent}% allocated`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 4 Reward Tiers Display - Grid / Scannable Progression */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
        {ONBOARDING_REWARD_TIERS.map((tier, idx) => {
          const isActive = tier.id === metrics.activeTier.id;
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
              className={`relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                isActive
                  ? 'bg-gradient-to-b from-white/[0.08] via-zinc-900/90 to-black border-2 border-zinc-200 shadow-[0_0_35px_rgba(255,255,255,0.16)] scale-[1.02]'
                  : 'bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40 text-neutral-400'
              }`}
            >
              {/* Active Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                  TIER {tier.tierNumber}
                </span>

                {isActive ? (
                  <span className="px-2 py-0.5 rounded-full bg-white text-black font-mono font-black text-[9px] tracking-widest uppercase shadow-[0_0_12px_rgba(255,255,255,0.5)]">
                    ACTIVE NOW
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-neutral-500 uppercase px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5">
                    {tier.badgeLabel}
                  </span>
                )}
              </div>

              {/* Tier Name & Sign-Up Range */}
              <div className="space-y-1 mb-4">
                <h3 className={`text-base sm:text-lg font-bold font-display tracking-tight uppercase ${isActive ? 'text-white' : 'text-neutral-200'}`}>
                  {tier.name}
                </h3>
                <div className="inline-block text-[11px] font-mono text-zinc-400 font-semibold">
                  {tier.rangeLabel}
                </div>
              </div>

              {/* Point Award Badge */}
              <div className="mb-4 p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Grant</span>
                <span className={`text-xl font-black font-display tracking-tight ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                  +{tier.points} PTS
                </span>
              </div>

              {/* Perks List */}
              <div className="space-y-2 mb-4 text-[11px] font-sans flex-1">
                {tier.perks.map((perk, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-1.5 leading-tight">
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-zinc-200' : 'text-zinc-600'}`} />
                    <span className={isActive ? 'text-neutral-200' : 'text-neutral-400'}>
                      {perk}
                    </span>
                  </div>
                ))}
              </div>

              {/* Card Footer Status */}
              <div className="pt-3 border-t border-white/10 text-[10px] font-mono flex items-center justify-between">
                <span className="text-neutral-500">Allocation</span>
                <span className={isActive ? 'text-zinc-200 font-bold' : 'text-neutral-500'}>
                  {isActive ? `${metrics.spotsRemainingInActiveTier} spots left` : tier.userRange}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sovereign Ledger Qualification & Claim Action */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.45 }}
        className="w-full max-w-4xl p-5 sm:p-6 rounded-2xl bg-zinc-950/90 border border-zinc-700 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-5 text-left"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-300" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-bold">
              {claimStatus.claimed ? 'SOVEREIGN GRANT RECORDED & AUDITED' : 'YOUR SOVEREIGN QUALIFICATION'}
            </span>
          </div>
          <p className="text-sm font-semibold text-white">
            {userName ? `@${userName}` : 'New Citizen'} {claimStatus.claimed ? 'has received' : 'qualifies for'}{' '}
            <strong className="text-white underline decoration-zinc-400">{metrics.activeTier.name}</strong> &bull;{' '}
            <span className="text-zinc-200 font-mono font-bold">+{claimStatus.points || metrics.activeTier.points} Passport Points</span>
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
            <Info className="w-3 h-3 text-neutral-500" />
            <span>
              {claimStatus.claimed
                ? 'Your point grant is permanently secured in your sovereign passport ledger.'
                : 'Passport Points can be redeemed for conference rewards or staked in legislative votes.'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="shrink-0 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5">
          {claimStatus.claimed && (
            <button
              type="button"
              onClick={() => setHistoryModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/20 hover:border-white/40 bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Point History</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClaimAndContinue}
            disabled={isClaiming}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 ${
              claimStatus.claimed || justClaimed
                ? 'bg-zinc-200 hover:bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.35)]'
                : 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_25px_rgba(255,255,255,0.4)]'
            }`}
          >
            {justClaimed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Points Claimed! Continuing...</span>
              </>
            ) : claimStatus.claimed ? (
              <>
                <span>Continue Tour</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-zinc-900" />
                <span>Claim &amp; Continue (+{metrics.activeTier.points} PTS)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Point History Modal */}
      <PointsHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        username={userName}
      />
    </div>
  );
}
