'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAudio } from '@/components/audio/usePortalAudio';

interface UseLaunchSequenceOptions {
  targetTimestamp: number;
  isSimulated?: boolean;
  onRedirect?: () => void;
}

export function useLaunchSequence({
  targetTimestamp,
  isSimulated = false,
  onRedirect,
}: UseLaunchSequenceOptions) {
  const router = useRouter();
  const portalAudio = usePortalAudio();

  // Stable refs to prevent effect recreation loops
  const portalAudioRef = useRef(portalAudio);
  portalAudioRef.current = portalAudio;

  const onRedirectRef = useRef(onRedirect);
  onRedirectRef.current = onRedirect;

  const [simulatedOffsetMs, setSimulatedOffsetMs] = useState<number | null>(null);
  const [totalRemainingMs, setTotalRemainingMs] = useState<number>(() => {
    return Math.max(0, targetTimestamp - Date.now());
  });

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const lastSecRef = useRef<number>(-1);

  const [phase, setPhase] = useState<'idle' | 'rumble' | 'expanding' | 'portal_video' | 'bloom' | 'flash_redirect'>('idle');
  const [isDimmed, setIsDimmed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isPortalBlooming, setIsPortalBlooming] = useState(false);
  const [isWhiteFlashActive, setIsWhiteFlashActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Track if triggers have fired in current sequence
  const hasTriggeredRumbleRef = useRef(false);
  const hasTriggeredExpandRef = useRef(false);
  const hasTriggeredVideoRef = useRef(false);
  const hasTriggeredBloomRef = useRef(false);
  const hasTriggeredFlashRef = useRef(false);

  // Jump to specific remaining milliseconds for testing
  const jumpToRemainingMs = useCallback((remainingMs: number) => {
    hasTriggeredRumbleRef.current = remainingMs <= 60000;
    hasTriggeredExpandRef.current = remainingMs <= 12000;
    hasTriggeredVideoRef.current = remainingMs <= 10000;
    hasTriggeredBloomRef.current = remainingMs <= 1200;
    hasTriggeredFlashRef.current = false;

    setIsWhiteFlashActive(false);
    setIsPortalBlooming(remainingMs <= 1200);

    if (remainingMs <= 1200) {
      setIsDimmed(true);
      setIsExpanded(true);
      setIsVideoVisible(true);
      setPhase('bloom');
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min(9.8, Math.max(0, (10000 - remainingMs) / 1000));
        videoRef.current.play().catch(() => {});
      }
      portalAudioRef.current.playPortalFlashAudio();
    } else if (remainingMs <= 10000) {
      setIsDimmed(true);
      setIsExpanded(true);
      setIsVideoVisible(true);
      setPhase('portal_video');
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, (10000 - remainingMs) / 1000);
        videoRef.current.play().catch(() => {});
      }
      portalAudioRef.current.playPortalFlashAudio();
    } else if (remainingMs <= 12000) {
      setIsDimmed(true);
      setIsExpanded(true);
      setIsVideoVisible(false);
      setPhase('expanding');
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    } else if (remainingMs <= 60000) {
      setIsDimmed(true);
      setIsExpanded(false);
      setIsVideoVisible(false);
      setPhase('rumble');
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      portalAudioRef.current.startRumbleAudio();
      const monolith = document.getElementById('monolith-section');
      monolith?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.body.classList.add('overflow-hidden');
    } else {
      setIsDimmed(false);
      setIsExpanded(false);
      setIsVideoVisible(false);
      setIsPortalBlooming(false);
      setPhase('idle');
      document.body.classList.remove('overflow-hidden');
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      portalAudioRef.current.stopAllAudio(100);
    }

    const currentWallClock = Date.now();
    const desiredTarget = currentWallClock + remainingMs;
    setSimulatedOffsetMs(desiredTarget - targetTimestamp);
  }, [targetTimestamp]);

  // Reset entire sequence
  const resetSequence = useCallback(() => {
    document.body.classList.remove('overflow-hidden');
    hasTriggeredRumbleRef.current = false;
    hasTriggeredExpandRef.current = false;
    hasTriggeredVideoRef.current = false;
    hasTriggeredBloomRef.current = false;
    hasTriggeredFlashRef.current = false;

    setIsDimmed(false);
    setIsExpanded(false);
    setIsVideoVisible(false);
    setIsPortalBlooming(false);
    setIsWhiteFlashActive(false);
    setPhase('idle');
    lastSecRef.current = -1;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    portalAudioRef.current.stopAllAudio(100);
    setSimulatedOffsetMs(null);
  }, []);

  // Main time-sync loop (runs at 100ms interval with zero render loop)
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const effectiveTarget = simulatedOffsetMs !== null 
        ? targetTimestamp + simulatedOffsetMs 
        : targetTimestamp;

      const remaining = Math.max(0, effectiveTarget - now);
      setTotalRemainingMs(remaining);

      // Only update timeLeft when the integer second changes
      const currentSec = Math.floor(remaining / 1000);
      if (currentSec !== lastSecRef.current) {
        lastSecRef.current = currentSec;
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remaining / 1000 / 60) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }

      // Phase 1: T - 60s (1:59:00 PM) -> Auto-scroll & Tectonic Rumble
      if (remaining <= 60000 && remaining > 12000 && !hasTriggeredRumbleRef.current) {
        hasTriggeredRumbleRef.current = true;
        setPhase('rumble');
        setIsDimmed(true);

        const monolith = document.getElementById('monolith-section');
        if (monolith) {
          monolith.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        document.body.classList.add('overflow-hidden');
        portalAudioRef.current.startRumbleAudio();
      }

      // Phase 1.5: T - 12s (1:59:48 PM) -> Monolith Frame Size Increases Smoothly
      if (remaining <= 12000 && remaining > 10000 && !hasTriggeredExpandRef.current) {
        hasTriggeredExpandRef.current = true;
        setPhase('expanding');
        setIsExpanded(true);
      }

      // Phase 2: T - 10s (1:59:50 PM) -> 10-Second Portal Video Starts Playing
      if (remaining <= 10000 && remaining > 1200 && !hasTriggeredVideoRef.current) {
        hasTriggeredVideoRef.current = true;
        setPhase('portal_video');
        setIsExpanded(true);
        setIsVideoVisible(true);

        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
        portalAudioRef.current.playPortalFlashAudio();
      }

      // Phase 2.5: T - 1.2s -> Portal Luminous Bloom (Smooth aura expansion)
      if (remaining <= 1200 && remaining > 100 && !hasTriggeredBloomRef.current) {
        hasTriggeredBloomRef.current = true;
        setPhase('bloom');
        setIsPortalBlooming(true);
      }

      // Phase 3: T - 100ms / 2:00:00 PM -> Smooth Crossfade & Homepage Redirect
      if (remaining <= 100 && !hasTriggeredFlashRef.current) {
        hasTriggeredFlashRef.current = true;
        setPhase('flash_redirect');
        setIsWhiteFlashActive(true);
        portalAudioRef.current.stopAllAudio(600);

        try {
          sessionStorage.setItem('from_portal_flash', 'true');
          document.cookie = 'from_portal_flash=true; path=/; max-age=60';
        } catch {}

        setTimeout(() => {
          document.body.classList.remove('overflow-hidden');
          if (onRedirectRef.current) {
            onRedirectRef.current();
          } else {
            router.push('/');
          }
        }, 180);
      }
    };

    tick();
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [simulatedOffsetMs, targetTimestamp, router]);

  // Video Time Update fallback check for apex bloom at >= 8.8s
  const handleVideoTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const ct = videoRef.current.currentTime;
    if (ct >= 8.8 && !hasTriggeredBloomRef.current) {
      hasTriggeredBloomRef.current = true;
      setIsPortalBlooming(true);
    }
    if (ct >= 9.85 && !hasTriggeredFlashRef.current) {
      hasTriggeredFlashRef.current = true;
      setPhase('flash_redirect');
      setIsWhiteFlashActive(true);
      portalAudioRef.current.stopAllAudio(600);

      try {
        sessionStorage.setItem('from_portal_flash', 'true');
          document.cookie = 'from_portal_flash=true; path=/; max-age=60';
      } catch {}

      setTimeout(() => {
        document.body.classList.remove('overflow-hidden');
        if (onRedirectRef.current) {
          onRedirectRef.current();
        } else {
          router.push('/');
        }
      }, 180);
    }
  }, [router]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return {
    timeLeft,
    totalRemainingMs,
    phase,
    isDimmed,
    isExpanded,
    isVideoVisible,
    isPortalBlooming,
    isWhiteFlashActive,
    videoRef,
    handleVideoTimeUpdate,
    portalAudio,
    jumpToRemainingMs,
    resetSequence,
  };
}
