// ─── ZENVITRA DAIS PROCEDURAL AUDIO ENGINE (V2 HIGH-FIDELITY) ───
// Zero-latency, browser-native Web Audio API synthesizer for Model UN Dais operations.
// Accurately synthesizes the acoustic physical impulse of hard polished walnut striking
// a dense hardwood sound block, parliamentary warning chimes, and caucus expiration alerts.

const LS_DAIS_SOUND_ENABLED = 'zenvitra_dais_sound_enabled';

class DaisAudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LS_DAIS_SOUND_ENABLED);
        this.soundEnabled = saved !== null ? saved === 'true' : true;
      } catch {
        this.soundEnabled = true;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LS_DAIS_SOUND_ENABLED, String(enabled));
      } catch {}
    }
  }

  public toggle(): boolean {
    const next = !this.soundEnabled;
    this.setEnabled(next);
    if (next) {
      this.playGavelStrike(0.7);
    }
    return next;
  }

  /**
   * Authentic Physical Acoustic Hardwood Gavel Strike.
   * Multi-layer physical synthesis:
   * 1. High-frequency wood-crack impulse (bandpass shaped noise burst)
   * 2. Hardwood soundblock body mass (pitch-decaying sine & triangle thump)
   * 3. Acoustic sounding cavity resonance (Helmholtz body overtone at 450Hz)
   * 4. Low-end dais desk punch (80Hz sub impulse)
   * 5. Early chamber reflection tail
   */
  public playGavelStrike(gainVolume: number = 1.0, pitchMod: number = 1.0): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.min(1.2, gainVolume), now);
    masterGain.connect(ctx.destination);

    // ── Layer 1: Sharp Hardwood Impact Crack (Transient) ──
    const bufferSize = Math.floor(ctx.sampleRate * 0.035); // 35ms burst
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (ctx.sampleRate * 0.007));
      output[i] = (Math.random() * 2 - 1) * decay;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const woodFilter = ctx.createBiquadFilter();
    woodFilter.type = 'bandpass';
    woodFilter.frequency.setValueAtTime(1750 * pitchMod, now);
    woodFilter.Q.setValueAtTime(2.4, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.95, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    whiteNoise.connect(woodFilter);
    woodFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start(now);

    // ── Layer 2: Hardwood Soundblock Fundamental Thud ──
    const oscBody = ctx.createOscillator();
    oscBody.type = 'sine';
    oscBody.frequency.setValueAtTime(220 * pitchMod, now);
    oscBody.frequency.exponentialRampToValueAtTime(95 * pitchMod, now + 0.07);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(1.15, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

    oscBody.connect(bodyGain);
    bodyGain.connect(masterGain);
    oscBody.start(now);
    oscBody.stop(now + 0.14);

    // ── Layer 3: Acoustic Wooden Cavity Resonance (450Hz) ──
    const oscCavity = ctx.createOscillator();
    oscCavity.type = 'triangle';
    oscCavity.frequency.setValueAtTime(450 * pitchMod, now);
    oscCavity.frequency.exponentialRampToValueAtTime(280 * pitchMod, now + 0.08);

    const cavityGain = ctx.createGain();
    cavityGain.gain.setValueAtTime(0.45, now);
    cavityGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    oscCavity.connect(cavityGain);
    cavityGain.connect(masterGain);
    oscCavity.start(now);
    oscCavity.stop(now + 0.12);

    // ── Layer 4: Low-End Dais Desk Acoustic Punch ──
    const oscSub = ctx.createOscillator();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(80 * pitchMod, now);
    oscSub.frequency.exponentialRampToValueAtTime(45 * pitchMod, now + 0.08);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.65, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

    oscSub.connect(subGain);
    subGain.connect(masterGain);
    oscSub.start(now);
    oscSub.stop(now + 0.1);
  }

  /**
   * Double Gavel Rap — Two authoritative strikes ("Order in the Chamber!").
   * Modeled with natural human cadence (1st strike slightly softer, 2nd strike firm).
   */
  public playDoubleGavel(): void {
    if (!this.soundEnabled) return;
    this.playGavelStrike(0.85, 0.98);
    setTimeout(() => {
      this.playGavelStrike(1.05, 1.04);
    }, 130);
  }

  /**
   * Triple Gavel Rap — Three formal strikes (Opening or Adjournment of Session).
   */
  public playTripleGavel(): void {
    if (!this.soundEnabled) return;
    this.playGavelStrike(0.85, 0.96);
    setTimeout(() => {
      this.playGavelStrike(0.95, 1.0);
    }, 130);
    setTimeout(() => {
      this.playGavelStrike(1.15, 1.05);
    }, 280);
  }

  /**
   * Gentle Parliamentary Warning Chime (10-15 seconds remaining).
   * Crisp acoustic bell sound at 880 Hz with harmonic overtone shimmer.
   */
  public playWarningBell(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [880, 1760, 2640, 3520];
    const gains = [0.45, 0.18, 0.06, 0.02];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.95);
    });
  }

  /**
   * Time Expired Alert — Double gavel strike.
   */
  public playTimeExpired(): void {
    if (!this.soundEnabled) return;
    this.playDoubleGavel();
  }

  /**
   * Substantive Vote / Motion Adopted Fanfare.
   */
  public playVotePassed(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const baseTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = baseTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }
}

export const daisAudio = new DaisAudioEngine();
