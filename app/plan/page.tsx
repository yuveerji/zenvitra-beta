'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Unlock, 
  Crown, 
  Radio, 
  Video, 
  Calendar, 
  Award, 
  FileText, 
  TrendingUp, 
  Bot, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isAdmin } from '@/lib/founderControl';
import { 
  FEATURE_ENTITLEMENTS, 
  FeatureKey, 
  checkFeatureAccess, 
  getActiveUserSubscription, 
  SubscriptionRecord 
} from '@/lib/subscriptionTiers';

export default function PlanHubPage() {
  const { user, profile } = useAuth();
  const [activeSub, setActiveSub] = useState<SubscriptionRecord | null>(null);

  const isPrivileged = Boolean(
    isFounder(profile?.username || profile?.email || '', profile?.role) ||
    isAdmin(profile?.username || profile?.email || '', profile?.role)
  );

  useEffect(() => {
    const syncSub = () => {
      const username = profile?.username || profile?.email || '';
      if (username) {
        const record = getActiveUserSubscription(username);
        setActiveSub(record);
      }
    };
    syncSub();
    window.addEventListener('zenvitra_subscription_allotted', syncSub);
    window.addEventListener('storage', syncSub);
    return () => {
      window.removeEventListener('zenvitra_subscription_allotted', syncSub);
      window.removeEventListener('storage', syncSub);
    };
  }, [profile]);

  const featureKeys = Object.keys(FEATURE_ENTITLEMENTS) as FeatureKey[];

  const getFeatureIcon = (key: FeatureKey) => {
    switch (key) {
      case 'STAGE_BROADCASTING': return <Radio className="w-5 h-5 text-purple-400" />;
      case 'HD_VIDEO_MEET': return <Video className="w-5 h-5 text-cyan-400" />;
      case 'ORGANIZER_SHOWCASE': return <Crown className="w-5 h-5 text-amber-400" />;
      case 'EVENT_MANAGEMENT_CONSOLE': return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'VERIFIABLE_CERTIFICATES': return <Award className="w-5 h-5 text-emerald-400" />;
      case 'SOVEREIGN_PRESS_WIRE': return <FileText className="w-5 h-5 text-rose-400" />;
      case 'ADVANCED_ANALYTICS': return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      case 'ZEN_AI_MONTHLY_ALLOWANCE': return <Bot className="w-5 h-5 text-teal-400" />;
      case 'PRIORITY_PLENARY_QUEUE': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'CUSTOM_REGISTRATION_EMBED': return <ExternalLink className="w-5 h-5 text-violet-400" />;
      case 'UNLIMITED_CATEGORY_SUBSCRIPTIONS': return <Globe className="w-5 h-5 text-pink-400" />;
      case 'MULTI_COUNCIL_EXECUTIVE_BOARD': return <Layers className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getFeatureRoute = (key: FeatureKey) => {
    switch (key) {
      case 'STAGE_BROADCASTING': return '/stage/general-assembly';
      case 'HD_VIDEO_MEET': return '/call';
      case 'ORGANIZER_SHOWCASE': return '/profile?tab=events_showcase';
      case 'EVENT_MANAGEMENT_CONSOLE': return '/events/manage';
      case 'VERIFIABLE_CERTIFICATES': return '/passport';
      case 'SOVEREIGN_PRESS_WIRE': return '/press';
      case 'ADVANCED_ANALYTICS': return '/dashboard/pro';
      case 'ZEN_AI_MONTHLY_ALLOWANCE': return '/pulse';
      case 'PRIORITY_PLENARY_QUEUE': return '/mun';
      case 'CUSTOM_REGISTRATION_EMBED': return '/events';
      case 'UNLIMITED_CATEGORY_SUBSCRIPTIONS': return '/news';
      case 'MULTI_COUNCIL_EXECUTIVE_BOARD': return '/chamber';
      default: return '/platform';
    }
  };

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 pt-6 sm:pt-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>ZENVITRA ENTITLEMENTS &amp; FEATURE MATRIX</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Your Membership &amp;{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Feature Clearance
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed">
            All ZENVITRA features are dynamically locked or unlocked per your verified Cashfree PG subscription. 
            Upgrade anytime on <Link href="/pricing" className="text-cyan-400 underline hover:text-cyan-300 font-semibold">/pricing</Link> to unlock executive powers across the platform.
          </p>
        </div>

        {/* Current Active Plan Status Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/30 via-black to-[#080912] border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/10 blur-[80px] pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                ACTIVE ACCOUNT CLEARANCE:
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${
                isPrivileged || activeSub?.status === 'ACTIVE'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300'
              }`}>
                {isPrivileged 
                  ? '⚡ FOUNDER / UNIVERSAL ROOT (ALL UNLOCKED)' 
                  : activeSub 
                  ? `${activeSub.planName} (ACTIVE)` 
                  : 'ZEN FREE FOUNDATION'}
              </span>
            </div>

            <h3 className="text-2xl font-display font-bold text-white">
              {isPrivileged
                ? 'Universal Founder Clearance'
                : activeSub
                ? activeSub.planName
                : 'ZEN FREE — Permanent Ecosystem Foundation'}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {isPrivileged
                ? 'As a constitutional founder or administrator, all procedural podiums, multi-chamber broadcast engines, and secretarial suites are permanently active.'
                : activeSub
                ? `Subscription verified via Cashfree PG. Order Ref: ${activeSub.paymentId || activeSub.orderId || 'CF-VERIFIED'}. All associated executive privileges are active.`
                : 'Core participation, 1-on-1 chats, and open publishing are 100% Free. Upgrade to unlock Stage broadcasting, HD video meets, and verified organizer tools.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            >
              <span>Explore / Upgrade Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Lock / Unlock Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                Feature Clearance Matrix
              </h2>
              <p className="text-xs text-neutral-400">
                Connected directly to your account tier. Real-time status updates upon Cashfree PG payment verification.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-500 hidden sm:inline-block">
              {featureKeys.length} Monitored Ecosystem Capabilities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureKeys.map((key) => {
              const entitlement = FEATURE_ENTITLEMENTS[key];
              const { hasAccess, requiredTierLabel } = checkFeatureAccess(key, profile || user, isPrivileged);
              const targetRoute = getFeatureRoute(key);

              return (
                <div
                  key={key}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    hasAccess
                      ? 'bg-[#080911] border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
                      : 'bg-black/60 border-white/10 hover:border-white/20 opacity-90'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                        {getFeatureIcon(key)}
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 ${
                        hasAccess
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                      }`}>
                        {hasAccess ? (
                          <>
                            <Unlock className="w-3 h-3 text-emerald-400" />
                            <span>UNLOCKED</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-rose-400" />
                            <span>LOCKED</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-base text-white">
                        {entitlement.name}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px]">
                        {entitlement.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-neutral-500">Requirement:</span>
                      <span className="text-neutral-300 font-semibold">{requiredTierLabel}</span>
                    </div>

                    {hasAccess ? (
                      <Link
                        href={targetRoute}
                        className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Launch Feature</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href="/pricing"
                        className="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Unlock with Subscription</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cashfree Verified Guarantee Card */}
        <div className="p-6 rounded-3xl bg-[#090b12] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-white">
                Cashfree PG Payment Verification Guarantee
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Subscriptions are allotted strictly and automatically upon backend verification of your Cashfree PG order or webhook receipt. Zero fake tier allotments.
              </p>
            </div>
          </div>
          <Link
            href="/payments"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold shrink-0 transition"
          >
            Audit Transaction Ledger
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
