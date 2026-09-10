'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type AmbientSoundscape = 'TICKING' | 'DEEP_VOID' | 'QUANTUM_PULSE' | 'OFF';

export interface SovereignAudioState {
  soundscape: AmbientSoundscape;
  isMuted: boolean;
  frequencyData: Uint8Array;
  cycleSoundscape: () => void;
  toggleMute: () => void;
  setSoundscape: (soundscape: AmbientSoundscape) => void;
  playTickSound: () => void;
  playTactileClick: () => void;
  playAccessGranted: () => void;
  playWarningChime: () => void;
  playKeystroke: () => void;
}

export function useSovereignAudio(): SovereignAudioState {
  const [soundscape, setSoundscape] = useState<AmbientSoundscape>('OFF');
  const [isMuted, setIsMuted] = useState(true);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(16));

  const isMutedRef = useRef(true);
  const soundscapeRef = useRef<AmbientSoundscape>('OFF');

  // Keep refs immediately synchronized
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    soundscapeRef.current = soundscape;
  }, [soundscape]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const droneNodesRef = useRef<{
    oscs: OscillatorNode[];
    biquad: BiquadFilterNode;
    gain: GainNode;
  } | null>(null);
  const tickAudioBufferRef = useRef<AudioBuffer | null>(null);

  const rafRef = useRef<number | null>(null);

  // Initialize Web Audio Context on first user gesture
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.85;

      master.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
      analyserRef.current = analyser;

      // Preload user's ticking audio file
      if (!tickAudioBufferRef.current) {
        fetch('/assets/ticking.mp3')
          .then((res) => res.arrayBuffer())
          .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
          .then((decoded) => {
            tickAudioBufferRef.current = decoded;
          })
          .catch(() => {
            // Fallback handled if network/file unavailable
          });
      }

      return ctx;
    } catch {
      return null;
    }
  }, []);

  // Update frequency visualizer frame
  useEffect(() => {
    const updateSpectrum = () => {
      if (analyserRef.current) {
        const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(buffer);
        // Take 16 bins for UI bars
        setFrequencyData(buffer.slice(0, 16));
      }
      rafRef.current = requestAnimationFrame(updateSpectrum);
    };

    rafRef.current = requestAnimationFrame(updateSpectrum);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Ambient Drone synthesis
  const startDrone = useCallback((mode: AmbientSoundscape) => {
    const ctx = initAudio();
    if (!ctx || !masterGainRef.current) return;

    // Stop current drone if exists
    if (droneNodesRef.current) {
      const { oscs, gain } = droneNodesRef.current;
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      setTimeout(() => {
        oscs.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {
            // Already stopped
          }
        });
      }, 850);
      droneNodesRef.current = null;
    }

    if (mode === 'OFF' || mode === 'TICKING') {
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
      }
      return;
    }

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(mode === 'DEEP_VOID' ? 180 : 320, ctx.currentTime);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    // Harmonic chords
    // DEEP_VOID: 55Hz (A1), 110Hz (A2), 164.81Hz (E3)
    // QUANTUM_PULSE: 65.41Hz (C2), 98.0Hz (G2), 130.81Hz (C3), 196Hz (G3)
    const freqs = mode === 'DEEP_VOID' ? [55, 110, 164.81] : [65.41, 98.0, 130.81, 196.0];
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle detune for lush cinematic thickness
      osc.detune.setValueAtTime(idx * 3 - 4, ctx.currentTime);

      osc.connect(filter);
      osc.start();
      oscs.push(osc);
    });

    filter.connect(droneGain);
    droneGain.connect(masterGainRef.current);

    droneNodesRef.current = { oscs, biquad: filter, gain: droneGain };
    masterGainRef.current.gain.setTargetAtTime(1.0, ctx.currentTime, 0.1);
  }, [initAudio]);

  const cycleSoundscape = useCallback(() => {
    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') ctx.resume();

    setSoundscape((prev) => {
      let next: AmbientSoundscape = 'TICKING';
      if (prev === 'OFF') next = 'TICKING';
      else if (prev === 'TICKING') next = 'DEEP_VOID';
      else if (prev === 'DEEP_VOID') next = 'QUANTUM_PULSE';
      else next = 'OFF';

      const nextMuted = next === 'OFF';
      isMutedRef.current = nextMuted;
      soundscapeRef.current = next;
      setIsMuted(nextMuted);

      if (masterGainRef.current && ctx) {
        if (nextMuted) {
          masterGainRef.current.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
        } else {
          masterGainRef.current.gain.setTargetAtTime(1.0, ctx.currentTime, 0.05);
        }
      }

      startDrone(next);
      return next;
    });
  }, [initAudio, startDrone]);

  const toggleMute = useCallback(() => {
    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') ctx.resume();

    setIsMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      isMutedRef.current = nextMuted;

      if (nextMuted) {
        if (masterGainRef.current && ctx) {
          masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
          masterGainRef.current.gain.setTargetAtTime(0.00001, ctx.currentTime, 0.02);
        }
      } else {
        if (masterGainRef.current && ctx) {
          masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
          masterGainRef.current.gain.setTargetAtTime(1.0, ctx.currentTime, 0.05);
        }
        if (soundscapeRef.current === 'OFF') {
          soundscapeRef.current = 'TICKING';
          setSoundscape('TICKING');
        }
      }
      return nextMuted;
    });
  }, [initAudio]);

  const setExplicitSoundscape = useCallback(
    (mode: AmbientSoundscape) => {
      const ctx = initAudio();
      if (ctx && ctx.state === 'suspended') ctx.resume();

      const muted = mode === 'OFF';
      isMutedRef.current = muted;
      soundscapeRef.current = mode;
      setSoundscape(mode);
      setIsMuted(muted);

      if (masterGainRef.current && ctx) {
        masterGainRef.current.gain.setTargetAtTime(muted ? 0.00001 : 1.0, ctx.currentTime, 0.05);
      }

      startDrone(mode);
    },
    [initAudio, startDrone]
  );

  // User-provided ticking sound player with synthesized fallback
  const playTickSound = useCallback(() => {
    // Instant synchronous check against current ref states
    if (isMutedRef.current || soundscapeRef.current === 'OFF') return;

    const ctx = initAudio();
    if (!ctx || !masterGainRef.current) return;

    if (tickAudioBufferRef.current) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = tickAudioBufferRef.current;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.75, ctx.currentTime);

        source.connect(gainNode);
        // Connect to masterGainRef so muting instantly silences this sound
        gainNode.connect(masterGainRef.current);

        source.start(ctx.currentTime);
      } catch {
        // Fallback below
      }
    } else {
      // Procedural fallback until buffer finishes loading
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
      } catch {
        // Ignore
      }
    }
  }, [initAudio]);

  // SFX Synthesizers
  const playTactileClick = useCallback(() => {
    if (isMutedRef.current || soundscapeRef.current === 'OFF') return;
    const ctx = initAudio();
    if (!ctx || !masterGainRef.current) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(masterGainRef.current);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext failure recovery
    }
  }, [initAudio]);

  const playKeystroke = useCallback(() => {
    if (isMutedRef.current || soundscapeRef.current === 'OFF') return;
    const ctx = initAudio();
    if (!ctx || !masterGainRef.current) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = 1200 + Math.random() * 400;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(masterGainRef.current);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Non-critical SFX failure
    }
  }, [initAudio]);

  const playAccessGranted = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch {
      // Ignore
    }
  }, [initAudio]);

  const playWarningChime = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [220, 207.65].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);

        gain.gain.setValueAtTime(0.09, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
    } catch {
      // Ignore
    }
  }, [initAudio]);

  return {
    soundscape,
    isMuted,
    frequencyData,
    cycleSoundscape,
    toggleMute,
    setSoundscape: setExplicitSoundscape,
    playTickSound,
    playTactileClick,
    playAccessGranted,
    playWarningChime,
    playKeystroke,
  };
}
