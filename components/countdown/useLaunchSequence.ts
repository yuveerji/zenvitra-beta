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

  const [phase, setPhase] = useState<'idle' | 'rumble' | 'portal_video' | 'flash_redirect'>('idle');
  const [isDimmed, setIsDimmed] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isWhiteFlashActive, setIsWhiteFlashActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // Track if triggers have fired in this sequence run
  const hasTriggeredRumbleRef = useRef(false);
  const hasTriggeredVideoRef = useRef(false);
  const hasTriggeredFlashRef = useRef(false);

  // Jump to specific remaining time (e.g. 64000ms for T-64s, 9000ms for T-9s)
  const jumpToRemainingMs = useCallback((remainingMs: number) => {
    // Reset flags
    hasTriggeredRumbleRef.current = remainingMs <= 60000;
    hasTriggeredVideoRef.current = remainingMs <= 5000;
    hasTriggeredFlashRef.current = false;

    setIsWhiteFlashActive(false);

    if (remainingMs <= 5000) {
      setIsDimmed(true);
      setIsVideoVisible(true);
      setPhase('portal_video');
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, (5000 - remainingMs) / 1000);
        videoRef.current.play().catch(() => {});
      }
      portalAudio.playPortalFlashAudio();
    } else if (remainingMs <= 60000) {
      setIsDimmed(true);
      setIsVideoVisible(false);
      setPhase('rumble');
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      portalAudio.startRumbleAudio();
      const monolith = document.getElementById('monolith-section');
      monolith?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.body.classList.add('overflow-hidden');
    } else {
      setIsDimmed(false);
      setIsVideoVisible(false);
      setPhase('idle');
      document.body.classList.remove('overflow-hidden');
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      portalAudio.stopAllAudio(100);
    }

    // Set virtual simulated offset
    const currentWallClock = Date.now();
    const desiredTarget = currentWallClock + remainingMs;
    setSimulatedOffsetMs(desiredTarget - targetTimestamp);
  }, [portalAudio, targetTimestamp]);

  // Reset entire test sequence
  const resetSequence = useCallback(() => {
    document.body.classList.remove('overflow-hidden');
    hasTriggeredRumbleRef.current = false;
    hasTriggeredVideoRef.current = false;
    hasTriggeredFlashRef.current = false;

    setIsDimmed(false);
    setIsVideoVisible(false);
    setIsWhiteFlashActive(false);
    setPhase('idle');

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    portalAudio.stopAllAudio(100);
    setSimulatedOffsetMs(null);
  }, [portalAudio]);

  // Main time-sync loop
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const effectiveTarget = simulatedOffsetMs !== null 
        ? targetTimestamp + simulatedOffsetMs 
        : targetTimestamp;

      const remaining = Math.max(0, effectiveTarget - now);
      setTotalRemainingMs(remaining);

      // Break down days, hours, mins, secs
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });

      // Phase 1: T - 60s (1:59:00 PM) -> Auto-scroll & Tectonic Rumble
      if (remaining <= 60000 && remaining > 5000 && !hasTriggeredRumbleRef.current) {
        hasTriggeredRumbleRef.current = true;
        setPhase('rumble');
        setIsDimmed(true);

        const monolith = document.getElementById('monolith-section');
        if (monolith) {
          monolith.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        document.body.classList.add('overflow-hidden');
        portalAudio.startRumbleAudio();
      }

      // Phase 2: T - 5s (1:59:55 PM) -> Monolith Video Swap & Portal Riser
      if (remaining <= 5000 && remaining > 150 && !hasTriggeredVideoRef.current) {
        hasTriggeredVideoRef.current = true;
        setPhase('portal_video');
        setIsVideoVisible(true);

        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
        portalAudio.playPortalFlashAudio();
      }

      // Phase 3: T - 150ms / 2:00:00 PM -> White Flash & Redirect
      if (remaining <= 150 && !hasTriggeredFlashRef.current) {
        hasTriggeredFlashRef.current = true;
        setPhase('flash_redirect');
        setIsWhiteFlashActive(true);
        portalAudio.stopAllAudio(400);

        try {
          sessionStorage.setItem('from_portal_flash', 'true');
        } catch {}

        setTimeout(() => {
          document.body.classList.remove('overflow-hidden');
          if (onRedirect) {
            onRedirect();
          } else {
            router.push('/');
          }
        }, 150);
      }
    };

    tick();
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [simulatedOffsetMs, targetTimestamp, portalAudio, router, onRedirect]);

  // Video Time Update fallback check for apex flash at >= 4.85s
  const handleVideoTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.currentTime >= 4.85 && !hasTriggeredFlashRef.current) {
      hasTriggeredFlashRef.current = true;
      setPhase('flash_redirect');
      setIsWhiteFlashActive(true);
      portalAudio.stopAllAudio(400);

      try {
        sessionStorage.setItem('from_portal_flash', 'true');
      } catch {}

      setTimeout(() => {
        document.body.classList.remove('overflow-hidden');
        if (onRedirect) {
          onRedirect();
        } else {
          router.push('/');
        }
      }, 150);
    }
  }, [onRedirect, portalAudio, router]);

  // Cleanup on unmount
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
    isVideoVisible,
    isWhiteFlashActive,
    videoRef,
    handleVideoTimeUpdate,
    portalAudio,
    jumpToRemainingMs,
    resetSequence,
  };
}
