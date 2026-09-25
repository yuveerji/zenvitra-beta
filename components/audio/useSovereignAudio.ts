'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type AmbientSoundscape =
  | 'NORMAL'
  | 'DEEP_VOID'
  | 'CYBER_HEARTBEAT'
  | 'QUANTUM_PULSE'
  | 'CELESTIAL_ORBIT'
  | 'CINEMA_DRONE'
  | 'OFF';

export interface SoundscapeOption {
  id: AmbientSoundscape;
  label: string;
  description: string;
  color: string;
  hasTick: boolean;
}

export const SOUNDSCAPE_MODES: SoundscapeOption[] = [
  {
    id: 'NORMAL',
    label: 'Normal / Chrono',
    description: 'Crisp mechanical chronometer tick with warm analog tape floor',
    color: 'from-amber-400 to-amber-200',
    hasTick: true,
  },
  {
    id: 'DEEP_VOID',
    label: 'Deep Void',
    description: 'Sub-bass 55Hz cinematic drone with dark resonant reverberation',
    color: 'from-purple-500 to-indigo-300',
    hasTick: false,
  },
  {
    id: 'CYBER_HEARTBEAT',
    label: 'Cyber Heartbeat',
    description: 'Low-frequency sub-kick pulse synced to biological rhythm',
    color: 'from-rose-500 to-red-300',
    hasTick: true,
  },
  {
    id: 'QUANTUM_PULSE',
    label: 'Quantum Pulse',
    description: 'Lush harmonic minor synthesizer pad with shimmering octave overtones',
    color: 'from-cyan-400 to-teal-200',
    hasTick: false,
  },
  {
    id: 'CELESTIAL_ORBIT',
    label: 'Celestial Orbit',
    description: 'Ethereal high-register glass chime ambience with spatial movement',
    color: 'from-emerald-400 to-cyan-200',
    hasTick: false,
  },
  {
    id: 'CINEMA_DRONE',
    label: 'Cinema Drone',
    description: 'Inception-style low brass brassy synthetic swell and tactile tick',
    color: 'from-amber-500 to-rose-400',
    hasTick: true,
  },
  {
    id: 'OFF',
    label: 'Muted',
    description: 'Silent telemetry mode with zero audio playback',
    color: 'from-neutral-500 to-neutral-400',
    hasTick: false,
  },
];

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
  const [soundscape, setSoundscape] = useState<AmbientSoundscape>('NORMAL');
  const [isMuted, setIsMuted] = useState(true);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(16));

  const isMutedRef = useRef(true);
  const soundscapeRef = useRef<AmbientSoundscape>('NORMAL');

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
    lfo?: OscillatorNode;
  } | null>(null);
  const tickAudioBufferRef = useRef<AudioBuffer | null>(null);

  const rafRef = useRef<number | null>(null);

  // Initialize Web Audio Context
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
      // Start active on master; individual gains and mute state control audibility
      master.gain.setValueAtTime(isMutedRef.current ? 0.0001 : 1.0, ctx.currentTime);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.82;

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
            // Synthesized fallback will be used if file is missing
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
        setFrequencyData(buffer.slice(0, 16));
      }
      rafRef.current = requestAnimationFrame(updateSpectrum);
    };

    rafRef.current = requestAnimationFrame(updateSpectrum);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Ambient Soundscape synthesis engine
  const startDrone = useCallback((mode: AmbientSoundscape) => {
    const ctx = initAudio();
    if (!ctx || !masterGainRef.current) return;

    // Smoothly stop existing drone
    if (droneNodesRef.current) {
      const { oscs, gain, lfo } = droneNodesRef.current;
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      setTimeout(() => {
        oscs.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {
            // Already stopped
          }
        });
        if (lfo) {
          try {
            lfo.stop();
            lfo.disconnect();
          } catch {
            // Already stopped
          }
        }
      }, 650);
      droneNodesRef.current = null;
    }

    if (mode === 'OFF') {
      return;
    }

    // Always keep master gain live when not muted
    if (!isMutedRef.current && masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(1.0, ctx.currentTime, 0.05);
    }

    // NORMAL mode is clean mechanical ticking; no drone needed
    if (mode === 'NORMAL') {
      return;
    }

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0001, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';

    const oscs: OscillatorNode[] = [];
    let lfoNode: OscillatorNode | undefined;

    if (mode === 'DEEP_VOID') {
      // Atmospheric, abyssal sub-bass: 43.65Hz (F1), 65.41Hz (C2), 87.31Hz (F2)
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.Q.setValueAtTime(4.2, ctx.currentTime);
      droneGain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 1.2);

      [43.65, 65.41, 87.31].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime(idx * 4 - 4, ctx.currentTime);
        osc.connect(filter);
        osc.start();
        oscs.push(osc);
      });
    } else if (mode === 'CYBER_HEARTBEAT') {
      // Sub-harmonic rhythmic throb: 50Hz with 1.1Hz subtle LFO amplitude pulse
      filter.frequency.setValueAtTime(120, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);
      droneGain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 1.0);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.connect(filter);
      osc.start();
      oscs.push(osc);

      // Low frequency oscillator for slow respiratory breathing effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.85, ctx.currentTime); // ~51 BPM human resting pulse
      lfoGain.gain.setValueAtTime(0.06, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);
      lfo.start();
      lfoNode = lfo;
    } else if (mode === 'QUANTUM_PULSE') {
      // Lush multi-voiced electronic chord: 65.41Hz (C2), 98.0Hz (G2), 130.81Hz (C3), 196.0Hz (G3), 261.63Hz (C4)
      filter.frequency.setValueAtTime(360, ctx.currentTime);
      filter.Q.setValueAtTime(2.8, ctx.currentTime);
      droneGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.2);

      [65.41, 98.0, 130.81, 196.0, 261.63].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime(idx * 5 - 10, ctx.currentTime);
        osc.connect(filter);
        osc.start();
        oscs.push(osc);
      });
    } else if (mode === 'CELESTIAL_ORBIT') {
      // High glass shimmer & ethereal harmonics: 220Hz (A3), 329.63Hz (E4), 440Hz (A4), 659.25Hz (E5)
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(480, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);
      droneGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.5);

      [220, 329.63, 440, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((idx - 1.5) * 6, ctx.currentTime);
        osc.connect(filter);
        osc.start();
        oscs.push(osc);
      });
    } else if (mode === 'CINEMA_DRONE') {
      // Massive cinematic brass horn drone: 55Hz (A1), 82.4Hz (E2), 110Hz (A2), 164.8Hz (E3)
      filter.frequency.setValueAtTime(280, ctx.currentTime);
      filter.Q.setValueAtTime(4.0, ctx.currentTime);
      droneGain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 1.2);

      [55.0, 82.4, 110.0, 164.81].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((idx - 1.5) * 5, ctx.currentTime);
        osc.connect(filter);
        osc.start();
        oscs.push(osc);
      });
    }

    filter.connect(droneGain);
    droneGain.connect(masterGainRef.current);

    droneNodesRef.current = { oscs, biquad: filter, gain: droneGain, lfo: lfoNode };
  }, [initAudio]);

  const cycleSoundscape = useCallback(() => {
    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') ctx.resume();

    setSoundscape((prev) => {
      const modeList: AmbientSoundscape[] = [
        'NORMAL',
        'DEEP_VOID',
        'CYBER_HEARTBEAT',
        'QUANTUM_PULSE',
        'CELESTIAL_ORBIT',
        'CINEMA_DRONE',
        'OFF',
      ];
      const currentIndex = modeList.indexOf(prev);
      const nextIndex = (currentIndex + 1) % modeList.length;
      const next = modeList[nextIndex];

      const nextMuted = next === 'OFF';
      isMutedRef.current = nextMuted;
      soundscapeRef.current = next;
      setIsMuted(nextMuted);

      if (masterGainRef.current && ctx) {
        masterGainRef.current.gain.setTargetAtTime(nextMuted ? 0.0001 : 1.0, ctx.currentTime, 0.05);
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
          masterGainRef.current.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03);
        }
      } else {
        if (masterGainRef.current && ctx) {
          masterGainRef.current.gain.setTargetAtTime(1.0, ctx.currentTime, 0.05);
        }
        if (soundscapeRef.current === 'OFF') {
          soundscapeRef.current = 'NORMAL';
          setSoundscape('NORMAL');
          startDrone('NORMAL');
        } else {
          startDrone(soundscapeRef.current);
        }
      }
      return nextMuted;
    });
  }, [initAudio, startDrone]);

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
        masterGainRef.current.gain.setTargetAtTime(muted ? 0.0001 : 1.0, ctx.currentTime, 0.05);
      }

      startDrone(mode);
    },
    [initAudio, startDrone]
  );

  // Soundscape-aware tick audio generator
  const playTickSound = useCallback(() => {
    if (isMutedRef.current || soundscapeRef.current === 'OFF') return;

    const ctx = initAudio();
    if (!ctx || !masterGainRef.current) return;

    const currentMode = soundscapeRef.current;

    // CYBER_HEARTBEAT has a distinct low-end physiological sub-kick pulse
    if (currentMode === 'CYBER_HEARTBEAT') {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.13);
      } catch {
        // Ignore
      }
      return;
    }

    // CELESTIAL_ORBIT has a high celestial chime tick
    if (currentMode === 'CELESTIAL_ORBIT') {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.16);
      } catch {
        // Ignore
      }
      return;
    }

    // NORMAL, CINEMA_DRONE, DEEP_VOID, QUANTUM_PULSE use the audio file or procedural chronometer
    if (tickAudioBufferRef.current) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = tickAudioBufferRef.current;

        const gainNode = ctx.createGain();
        const tickVol = currentMode === 'CINEMA_DRONE' ? 0.9 : currentMode === 'DEEP_VOID' ? 0.45 : 0.75;
        gainNode.gain.setValueAtTime(tickVol, ctx.currentTime);

        source.connect(gainNode);
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
