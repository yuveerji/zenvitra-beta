'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { OnboardingSceneId, ONBOARDING_SCENES, OnboardingState } from './types';
import { hasSeenPointsAddedScreen, syncServerOnboardingRewardStatus } from '@/lib/onboardingRewards';
import {
  hasSeenCategorySubscriptionsScreen,
  getTotalSubscriptionsCount,
  markCategorySubscriptionsScreenSeen
} from '@/lib/categorySubscriptionService';

// Scenes
import { WelcomeScene } from './scenes/WelcomeScene';
import { OnboardingRewardsScene } from './scenes/OnboardingRewardsScene';
import { IntroScene } from './scenes/IntroScene';
import { DashboardPreviewScene } from './scenes/DashboardPreviewScene';
import { EventsParticipationScene } from './scenes/EventsParticipationScene';
import { EventJourneyScene } from './scenes/EventJourneyScene';
import { EcosystemMapScene } from './scenes/EcosystemMapScene';
import { TestNodeScene } from './scenes/TestNodeScene';
import { IdentityPassportScene } from './scenes/IdentityPassportScene';
import { CommunityExpressionScene } from './scenes/CommunityExpressionScene';
import { CategorySubscriptionsScene } from './scenes/CategorySubscriptionsScene';
import { FirstFiveMinutesScene } from './scenes/FirstFiveMinutesScene';
import { FinalTrailerScene } from './scenes/FinalTrailerScene';

export const LS_ONBOARDING_KEY = 'zenvitra_onboarding_state_v1';

export function OnboardingShell() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const userName = profile?.username || user?.username || profile?.display_name || 'delegate';
  const roleTrack = (profile?.role as string) || 'delegate';

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [hasSeenRewardsScreen, setHasSeenRewardsScreen] = useState(false);
  const [hasSeenCatSubsScreen, setHasSeenCatSubsScreen] = useState(false);
  const [isMandatoryFromSkip, setIsMandatoryFromSkip] = useState(false);

  useEffect(() => {
    // 1. Initial fast local check for rewards
    const locallySeenRewards = hasSeenPointsAddedScreen(userName);
    if (locallySeenRewards) {
      setHasSeenRewardsScreen(true);
    }

    // 2. Initial check for category subscriptions screen
    const locallySeenSubs = hasSeenCategorySubscriptionsScreen(userName);
    if (locallySeenSubs) {
      setHasSeenCatSubsScreen(true);
    }

    // 3. Asynchronously verify rewards with server registry
    syncServerOnboardingRewardStatus(userName).then((res) => {
      if (res.claimed) {
        setHasSeenRewardsScreen(true);
      }
    });
  }, [userName]);

  // The points added screen AND category subscriptions screen can be seen ONLY ONCE per account.
  // If already seen or completed, permanently exclude them from subsequent onboarding tour scenes.
  const activeScenes = React.useMemo(() => {
    let scenes = ONBOARDING_SCENES;
    if (hasSeenRewardsScreen) {
      scenes = scenes.filter((s) => s.id !== 'rewards');
    }
    if (hasSeenCatSubsScreen) {
      scenes = scenes.filter((s) => s.id !== 'subscriptions');
    }
    return scenes.map((s, idx) => ({
      ...s,
      number: idx < 10 ? `0${idx}` : `${idx}`,
    }));
  }, [hasSeenRewardsScreen, hasSeenCatSubsScreen]);

  const totalScenes = activeScenes.length;
  const currentScene = activeScenes[currentSceneIndex] || activeScenes[0];

  // Keep index within bounds if activeScenes updates
  useEffect(() => {
    if (currentSceneIndex >= totalScenes) {
      setCurrentSceneIndex(Math.max(0, totalScenes - 1));
    }
  }, [currentSceneIndex, totalScenes]);

  // Helper to guarantee target is a valid route string
  const sanitizeRoute = (rawRoute: unknown, fallback = '/dashboard'): string => {
    if (typeof rawRoute === 'string' && rawRoute.trim().length > 0 && rawRoute.startsWith('/')) {
      return rawRoute.trim();
    }
    return fallback;
  };

  // Persist completion and navigate to platform
  const markCompleted = useCallback((targetRoute: unknown = '/dashboard') => {
    const validRoute = sanitizeRoute(targetRoute, '/dashboard');
    try {
      const state: OnboardingState = {
        completed: true,
        skipped: false,
        version: 'v1',
        completedAt: Date.now(),
      };
      localStorage.setItem(LS_ONBOARDING_KEY, JSON.stringify(state));
      const cleanUser = (userName || 'delegate').toLowerCase().replace(/^@/, '');
      localStorage.setItem(`zenvitra_onboarding_state_${cleanUser}`, JSON.stringify(state));
      localStorage.removeItem('zenvitra_auto_tour_trigger');
    } catch {}
    try {
      router.push(validRoute);
    } catch {}
    if (typeof window !== 'undefined') {
      window.location.href = validRoute;
    }
  }, [router, userName]);

  const markSkipped = useCallback((targetRoute: unknown = '/dashboard') => {
    // If user has not yet completed the category subscriptions screen,
    // they MUST be redirected to it before being allowed to exit the onboarding flow.
    const alreadySeenSubs = hasSeenCatSubsScreen || hasSeenCategorySubscriptionsScreen(userName);
    if (!alreadySeenSubs) {
      const subsIndex = activeScenes.findIndex((s) => s.id === 'subscriptions');
      if (subsIndex !== -1) {
        setIsMandatoryFromSkip(true);
        setCurrentSceneIndex(subsIndex);
        return;
      }
    }

    const validRoute = sanitizeRoute(targetRoute, '/dashboard');
    try {
      const state: OnboardingState = {
        completed: false,
        skipped: true,
        version: 'v1',
        completedAt: Date.now(),
      };
      localStorage.setItem(LS_ONBOARDING_KEY, JSON.stringify(state));
      const cleanUser = (userName || 'delegate').toLowerCase().replace(/^@/, '');
      localStorage.setItem(`zenvitra_onboarding_state_${cleanUser}`, JSON.stringify(state));
      localStorage.removeItem('zenvitra_auto_tour_trigger');
    } catch {}
    try {
      router.push(validRoute);
    } catch {}
    if (typeof window !== 'undefined') {
      window.location.href = validRoute;
    }
  }, [router, userName, hasSeenCatSubsScreen, activeScenes]);

  const handleNext = useCallback(() => {
    // If user is currently on rewards, advancing automatically marks it seen
    if (currentScene.id === 'rewards') {
      setHasSeenRewardsScreen(true);
    }
    // If user completes subscriptions scene, mark it seen and update state
    if (currentScene.id === 'subscriptions') {
      setHasSeenCatSubsScreen(true);
      setIsMandatoryFromSkip(false);
      // If user came here via skip, exiting subscriptions should proceed to finish/exit tour
      if (isMandatoryFromSkip) {
        markCompleted('/dashboard');
        return;
      }
    }
    if (currentSceneIndex < totalScenes - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
    } else {
      markCompleted('/dashboard');
    }
  }, [currentSceneIndex, totalScenes, markCompleted, currentScene.id, isMandatoryFromSkip]);

  const handlePrev = useCallback(() => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  }, [currentSceneIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        markSkipped();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, markSkipped]);

  const progressPercent = Math.round(((currentSceneIndex + 1) / totalScenes) * 100);

  return (
    <div className="min-h-screen bg-[#030508] text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Top Animated Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between z-40 relative">
        {/* Brand Wordmark with Official Logo */}
        <Link href="/" className="group flex items-center gap-2.5 cursor-pointer">
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/logo.png"
              alt="Zenvitra Logo"
              className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)] transition-opacity duration-300"
            />
          </div>
          <span
            className="uppercase text-[#f5f1ea] select-none tracking-[0.12em] sm:tracking-[0.14em] text-sm sm:text-base font-bold whitespace-nowrap group-hover:text-white transition-colors"
            style={{
              fontFamily: 'Clash Display, var(--font-space), sans-serif',
            }}
          >
            ZENVITRA
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 uppercase">
            V1
          </span>
        </Link>

        {/* Scene Index & Label */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
            {currentScene.number} / {totalScenes - 1 < 10 ? `0${totalScenes - 1}` : totalScenes - 1} &bull; {currentScene.label}
          </span>
        </div>

        {/* Exit / Skip CTA */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => markSkipped('/dashboard')}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Skip onboarding tour (ESC) and enter platform"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Cinematic Scene Stage */}
      <main className="flex-1 flex items-center justify-center relative z-20 py-4 sm:py-8 w-full max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -14 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentScene.id === 'welcome' && (
              <WelcomeScene
                onStart={handleNext}
                onSkip={markSkipped}
                userName={userName}
                roleTrack={roleTrack}
              />
            )}

            {currentScene.id === 'rewards' && (
              <OnboardingRewardsScene
                onNext={handleNext}
                userName={userName}
                roleTrack={roleTrack}
              />
            )}

            {currentScene.id === 'platform' && (
              <IntroScene onNext={handleNext} />
            )}

            {currentScene.id === 'home' && (
              <DashboardPreviewScene onNext={handleNext} userName={userName} />
            )}

            {currentScene.id === 'events' && (
              <EventsParticipationScene onNext={handleNext} />
            )}

            {currentScene.id === 'journey' && (
              <EventJourneyScene onNext={handleNext} />
            )}

            {currentScene.id === 'ecosystem' && (
              <EcosystemMapScene onNext={handleNext} />
            )}

            {currentScene.id === 'test_node' && (
              <TestNodeScene onNext={handleNext} userName={userName} />
            )}

            {currentScene.id === 'identity' && (
              <IdentityPassportScene
                onNext={handleNext}
                userName={userName}
                roleTrack={roleTrack}
              />
            )}

            {currentScene.id === 'community' && (
              <CommunityExpressionScene onNext={handleNext} />
            )}

            {currentScene.id === 'subscriptions' && (
              <CategorySubscriptionsScene
                onNext={handleNext}
                userName={userName}
                isFromSkip={isMandatoryFromSkip}
              />
            )}

            {currentScene.id === 'first_5_minutes' && (
              <FirstFiveMinutesScene onNext={handleNext} />
            )}

            {currentScene.id === 'final_trailer' && (
              <FinalTrailerScene onComplete={markCompleted} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Sticky Control Bar (Hidden on Welcome & Final Trailer for cinematic effect) */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between z-40 relative">
        {currentScene.id !== 'welcome' && currentScene.id !== 'final_trailer' ? (
          <>
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentSceneIndex === 0}
              className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-400 hover:text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {activeScenes.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSceneIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    currentSceneIndex === idx
                      ? 'w-6 bg-cyan-400'
                      : idx < currentSceneIndex
                      ? 'bg-neutral-500'
                      : 'bg-white/10'
                  }`}
                  title={s.title}
                />
              ))}
            </div>

            {currentScene.id === 'subscriptions' ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={getTotalSubscriptionsCount() < 5}
                className={`px-5 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg active:scale-95 ${
                  getTotalSubscriptionsCount() >= 5
                    ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 text-black hover:opacity-95 cursor-pointer'
                    : 'bg-white/10 text-neutral-500 border border-white/10 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{getTotalSubscriptionsCount() >= 5 ? 'Confirm & Next' : `Pick 5 Topics (${getTotalSubscriptionsCount()}/5)`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <span>{currentScene.id === 'rewards' ? 'Claim & Continue' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full text-center text-[11px] font-mono text-neutral-500">
            ZENVITRA &bull; BY YOUTH. FOR YOUTH.
          </div>
        )}
      </footer>
    </div>
  );
}
