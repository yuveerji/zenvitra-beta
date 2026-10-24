'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export function usePortalAudio() {
  const [isArmed, setIsArmed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Rumble nodes
  const rumbleGainRef = useRef<GainNode | null>(null);
  const rumbleFilterRef = useRef<BiquadFilterNode | null>(null);
  const rumbleOsc1Ref = useRef<OscillatorNode | null>(null);
  const rumbleOsc2Ref = useRef<OscillatorNode | null>(null);
  const rumbleNoiseRef = useRef<AudioBufferSourceNode | null>(null);

  // Portal flash nodes
  const flashGainRef = useRef<GainNode | null>(null);
  const flashOscRef = useRef<OscillatorNode | null>(null);
  const flashNoiseRef = useRef<AudioBufferSourceNode | null>(null);

  // AudioBuffer cache
  const rumbleBufferRef = useRef<AudioBuffer | null>(null);
  const flashBufferRef = useRef<AudioBuffer | null>(null);

  // Ensure AudioContext initialized
  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const master = ctx.createGain();
        master.gain.setValueAtTime(1, ctx.currentTime);
        master.connect(ctx.destination);
        audioCtxRef.current = ctx;
        masterGainRef.current = master;
      }
    }
    return audioCtxRef.current;
  }, []);

  // Unlock AudioContext on first user gesture
  const unlockAudio = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        setIsArmed(true);
      }).catch(() => {});
    } else if (ctx && ctx.state === 'running') {
      setIsArmed(true);
    }
  }, [getAudioContext]);

  // Global gesture listener
  useEffect(() => {
    const handleGesture = () => unlockAudio();
    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [unlockAudio]);

  // Buffer Preloader for optional sound files
  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const loadBuffer = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const arrayBuffer = await res.arrayBuffer();
        return await ctx.decodeAudioData(arrayBuffer);
      } catch {
        return null;
      }
    };

    loadBuffer('/sounds/monolith-rumble.mp3').then((buf) => {
      if (buf) rumbleBufferRef.current = buf;
    });
    loadBuffer('/sounds/portal-flash.mp3').then((buf) => {
      if (buf) flashBufferRef.current = buf;
    });
  }, [getAudioContext]);

  // Procedural Brown Noise generator for stone vibration
  const createBrownNoiseBuffer = (ctx: AudioContext, duration = 60) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  };

  // Phase 1 — Start Tectonic Rumble (1:59:00 PM / T - 60s)
  const startRumbleAudio = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || !masterGainRef.current || isMuted) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop existing rumble if any
    try {
      rumbleOsc1Ref.current?.stop();
      rumbleOsc2Ref.current?.stop();
      rumbleNoiseRef.current?.stop();
    } catch {}

    const now = ctx.currentTime;

    // Rumble Gain (ramps exponentially 0.001 -> 0.65 over 3s, then grows to 0.85 toward T - 5s)
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.001, now);
    rumbleGain.gain.exponentialRampToValueAtTime(0.65, now + 3);
    rumbleGain.gain.linearRampToValueAtTime(0.85, now + 55);
    rumbleGain.connect(masterGainRef.current);
    rumbleGainRef.current = rumbleGain;

    // If pre-recorded audio buffer exists, use it
    if (rumbleBufferRef.current) {
      const source = ctx.createBufferSource();
      source.buffer = rumbleBufferRef.current;
      source.loop = true;
      source.connect(rumbleGain);
      source.start();
      rumbleNoiseRef.current = source;
      return;
    }

    // Fallback: Procedural Tectonic Synth
    // Filter sweeping from 60Hz to 240Hz over 55s
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(60, now);
    filter.frequency.exponentialRampToValueAtTime(240, now + 55);
    filter.Q.setValueAtTime(4, now);
    filter.connect(rumbleGain);
    rumbleFilterRef.current = filter;

    // Sub-bass Oscillator 1: 38Hz Sine
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(38, now);
    osc1.frequency.linearRampToValueAtTime(44, now + 55);
    osc1.connect(filter);
    osc1.start(now);
    rumbleOsc1Ref.current = osc1;

    // Sub-bass Oscillator 2: 52Hz Triangle (detuned)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(52, now);
    osc2.frequency.linearRampToValueAtTime(64, now + 55);
    osc2.connect(filter);
    osc2.start(now);
    rumbleOsc2Ref.current = osc2;

    // Layered Brown Noise for stone vibration
    const noiseBuf = createBrownNoiseBuffer(ctx, 60);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuf;
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(100, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 55);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(rumbleGain);
    noiseSource.start(now);
    rumbleNoiseRef.current = noiseSource;
  }, [getAudioContext, isMuted]);

  // Phase 2 — Portal Rupture & Flash Audio (1:59:50 PM / T - 10s for 10-second video)
  const playPortalFlashAudio = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || !masterGainRef.current || isMuted) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Crossfade: Ramp down rumble over 2s
    if (rumbleGainRef.current) {
      rumbleGainRef.current.gain.cancelScheduledValues(now);
      rumbleGainRef.current.gain.setValueAtTime(rumbleGainRef.current.gain.value, now);
      rumbleGainRef.current.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    }

    // Flash Gain Node across 10-second video
    const flashGain = ctx.createGain();
    flashGain.gain.setValueAtTime(0.001, now);
    flashGain.gain.exponentialRampToValueAtTime(0.85, now + 8.5);
    flashGain.gain.linearRampToValueAtTime(1.0, now + 9.8);
    flashGain.connect(masterGainRef.current);
    flashGainRef.current = flashGain;

    // If pre-recorded audio buffer exists
    if (flashBufferRef.current) {
      const source = ctx.createBufferSource();
      source.buffer = flashBufferRef.current;
      source.connect(flashGain);
      source.start();
      return;
    }

    // Fallback: Procedural Portal Rupture & Flash Synth (10-second riser)
    const riserOsc = ctx.createOscillator();
    riserOsc.type = 'sawtooth';
    riserOsc.frequency.setValueAtTime(80, now);
    riserOsc.frequency.exponentialRampToValueAtTime(2800, now + 9.8);

    const riserFilter = ctx.createBiquadFilter();
    riserFilter.type = 'bandpass';
    riserFilter.frequency.setValueAtTime(160, now);
    riserFilter.frequency.exponentialRampToValueAtTime(3600, now + 9.8);
    riserFilter.Q.setValueAtTime(3, now);

    riserOsc.connect(riserFilter);
    riserFilter.connect(flashGain);
    riserOsc.start(now);
    riserOsc.stop(now + 10.5);
    flashOscRef.current = riserOsc;

    // White Noise Burst at climax (peaking at 9.2s - 9.9s)
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const burstSource = ctx.createBufferSource();
    burstSource.buffer = noiseBuffer;

    const burstGain = ctx.createGain();
    burstGain.gain.setValueAtTime(0.0001, now);
    burstGain.gain.setValueAtTime(0.0001, now + 7.5);
    burstGain.gain.exponentialRampToValueAtTime(0.9, now + 9.8);
    burstGain.gain.exponentialRampToValueAtTime(0.001, now + 10.4);

    burstSource.connect(burstGain);
    burstGain.connect(masterGainRef.current);
    burstSource.start(now + 7.0);
    flashNoiseRef.current = burstSource;
  }, [getAudioContext, isMuted]);

  // Smooth fade out master audio
  const stopAllAudio = useCallback((fadeMs = 600) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const fadeSec = fadeMs / 1000;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.0001, now + fadeSec);

    setTimeout(() => {
      try {
        rumbleOsc1Ref.current?.stop();
        rumbleOsc2Ref.current?.stop();
        rumbleNoiseRef.current?.stop();
        flashOscRef.current?.stop();
        flashNoiseRef.current?.stop();
      } catch {}
    }, fadeMs + 50);
  }, []);

  const toggleSound = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    setIsArmed(true);
    setIsMuted((prev) => {
      const next = !prev;
      if (masterGainRef.current && ctx) {
        masterGainRef.current.gain.setValueAtTime(next ? 0 : 1, ctx.currentTime);
      }
      return next;
    });
  }, [getAudioContext]);

  return useMemo(() => ({
    isArmed,
    isMuted,
    unlockAudio,
    toggleSound,
    startRumbleAudio,
    playPortalFlashAudio,
    stopAllAudio,
  }), [
    isArmed,
    isMuted,
    unlockAudio,
    toggleSound,
    startRumbleAudio,
    playPortalFlashAudio,
    stopAllAudio,
  ]);
}
