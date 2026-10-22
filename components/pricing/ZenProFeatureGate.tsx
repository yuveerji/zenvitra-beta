'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Sparkles, Crown, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  FeatureKey, 
  FEATURE_ENTITLEMENTS, 
  checkFeatureAccess, 
  getTrialDetails, 
  activatePromotionalProTrial, 
  isPromotionalCampaignActive 
} from '@/lib/subscriptionTiers';
import { isFounder, isAdmin } from '@/lib/founderControl';
import { ZenTrialCardModal } from '@/components/pricing/ZenTrialCardModal';

interface ZenProFeatureGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showCardFallback?: boolean;
}

export function useFeatureGate(feature: FeatureKey) {
  const { user, profile } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFOrA = Boolean(
    isFounder(profile?.username || profile?.email, profile?.role) ||
    isAdmin(profile?.username || profile?.email, profile?.role) ||
    profile?.role === 'founder' ||
    profile?.role === 'admin'
  );

  const check = checkFeatureAccess(feature, profile || user, isFOrA);
  const trial = getTrialDetails(profile?.username || profile?.email);

  return {
    hasAccess: check.hasAccess,
    activePlan: check.activePlan,
    requiredTierLabel: check.requiredTierLabel,
    trial,
    isModalOpen,
    openUpgradeModal: () => setIsModalOpen(true),
    closeUpgradeModal: () => setIsModalOpen(false),
  };
}

export function ZenProFeatureGate({
  feature,
  children,
  fallback,
  showCardFallback = true,
}: ZenProFeatureGateProps) {
  const { user, profile } = useAuth();
  const [isActivatingTrial, setIsActivatingTrial] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [isGateCardModalOpen, setIsGateCardModalOpen] = useState(false);

  const isFOrA = Boolean(
    isFounder(profile?.username || profile?.email, profile?.role) ||
    isAdmin(profile?.username || profile?.email, profile?.role) ||
    profile?.role === 'founder' ||
    profile?.role === 'admin'
  );

  const access = checkFeatureAccess(feature, profile || user, isFOrA);
  const trial = getTrialDetails(profile?.username || profile?.email);
  const entitlement = FEATURE_ENTITLEMENTS[feature];

  const handleActivateTrial = () => {
    const username = profile?.username || profile?.email;
    if (!username) return;
    setIsActivatingTrial(true);
    try {
      activatePromotionalProTrial(username);
      setTrialSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (e) {
      console.error(e);
      setIsActivatingTrial(false);
    }
  };

  if (access.hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showCardFallback) {
    return null;
  }

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#131722]/90 via-[#0d101a]/95 to-[#080a12] border border-amber-500/30 text-white shadow-2xl overflow-hidden text-center space-y-4 max-w-xl mx-auto my-6">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Lock Icon */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
        <Lock className="w-7 h-7 text-amber-400" />
      </div>

      <div className="space-y-1 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>{entitlement?.minimumTierLabel || 'ZEN PRO'} FEATURE</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight">
          {entitlement?.name || 'Exclusive Pro Feature'}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
          {entitlement?.description || 'Upgrade your subscription or activate your 1-month free trial to unlock this feature.'}
        </p>
      </div>

      {/* Promotional Trial Banner if Campaign Active */}
      {isPromotionalCampaignActive() && !trial.isActive && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-cyan-500/10 border border-amber-500/30 text-left relative z-10 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              🎁 3-MONTH LAUNCH CAMPAIGN
            </span>
            <span className="text-xs font-bold text-white block">
              1-Month Free Trial Available
            </span>
            <span className="text-[11px] text-neutral-300 block">
              Get full access to all ZEN PRO features for 30 days. Card verification required (₹0.00 charged today).
            </span>
          </div>
          {profile ? (
            <button
              type="button"
              disabled={isActivatingTrial || trialSuccess}
              onClick={handleActivateTrial}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold shrink-0 transition shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {trialSuccess ? 'Unlocked!' : isActivatingTrial ? 'Activating...' : 'Activate Free'}
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold shrink-0 transition shadow-md active:scale-95 text-center"
            >
              Sign Up
            </Link>
          )}
        </div>
      )}

      <ZenTrialCardModal
        isOpen={isGateCardModalOpen}
        onClose={() => setIsGateCardModalOpen(false)}
        username={profile?.username || profile?.email || ''}
        userEmail={profile?.email}
        userRole={profile?.role}
        onSuccess={() => {
          setTrialSuccess(true);
          setTimeout(() => {
            window.location.reload();
          }, 600);
        }}
      />

      {/* Pricing Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
        <Link
          href="/pricing"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition border border-white/15 flex items-center justify-center gap-2"
        >
          <span>View Pricing &amp; Plans &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export function ZenProLockModal({
  isOpen,
  onClose,
  feature,
}: {
  isOpen: boolean;
  onClose: () => void;
  feature: FeatureKey;
}) {
  const { profile } = useAuth();
  const [isActivating, setIsActivating] = useState(false);
  const [isLockCardModalOpen, setIsLockCardModalOpen] = useState(false);
  const entitlement = FEATURE_ENTITLEMENTS[feature];
  const trial = getTrialDetails(profile?.username || profile?.email);

  if (!isOpen) return null;

  const handleActivate = () => {
    const username = profile?.username || profile?.email;
    if (!username) return;
    setIsLockCardModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="max-w-md w-full bg-[#0c101a] rounded-[28px] border border-amber-500/30 p-6 sm:p-7 shadow-2xl relative text-center space-y-4 text-white animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-6 h-6 text-amber-400" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
            {entitlement?.minimumTierLabel || 'ZEN PRO'} REQUIRED
          </span>
          <h3 className="text-xl font-black font-serif text-white">
            {entitlement?.name || 'Pro Feature Locked'}
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
            {entitlement?.description || 'Unlock this capability with an active ZEN PRO membership.'}
          </p>
        </div>

        {/* 1-Month Free Trial Promo */}
        {isPromotionalCampaignActive() && !trial.isActive && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Campaign Active</span>
            </div>
            <p className="text-xs text-neutral-200">
              You are eligible for a <strong>1-Month Free Trial of ZEN PRO</strong>. Card verification required (₹0.00 charged today).
            </p>
            {profile ? (
              <button
                type="button"
                disabled={isActivating}
                onClick={handleActivate}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                {isActivating ? 'Activating Trial...' : 'Start 1-Month Free Trial'}
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold text-center transition shadow-xs"
              >
                Sign Up / Login to Activate
              </Link>
            )}
          </div>
        )}

        <ZenTrialCardModal
          isOpen={isLockCardModalOpen}
          onClose={() => setIsLockCardModalOpen(false)}
          username={profile?.username || profile?.email || ''}
          userEmail={profile?.email}
          userRole={profile?.role}
          onSuccess={() => {
            setTimeout(() => {
              window.location.reload();
            }, 600);
          }}
        />

        <div className="pt-2 flex items-center justify-center gap-2">
          <Link
            href="/pricing"
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition border border-white/10 text-center"
          >
            Explore All Plans (/pricing)
          </Link>
        </div>
      </div>
    </div>
  );
}
