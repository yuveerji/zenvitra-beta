// ─── ZENVITRA DAIS PROCEDURAL AUDIO ENGINE ───
// Zero-latency, browser-native Web Audio API synthesizer for Model UN Dais operations.
// Provides realistic acoustic gavel strikes, parliamentary warning chimes, timer expiration bells,
// and vote ratification fanfares with zero external audio assets required.

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
      // Play a quick test tap on enable
      this.playGavelStrike(0.6);
    }
    return next;
  }

  /**
   * Authentic wooden Gavel strike sound.
   * Synthesizes an initial wooden crack (filtered noise burst) + resonant wooden body resonance (140-280Hz).
   */
  public playGavelStrike(gainVolume: number = 1.0): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Transient click (the strike of the wood face)
    const bufferSize = ctx.sampleRate * 0.025; // 25ms noise burst
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7 * gainVolume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);

    // 2. Fundamental wood body thud (130Hz decaying rapidly)
    const oscBody = ctx.createOscillator();
    oscBody.type = 'triangle';
    oscBody.frequency.setValueAtTime(160, now);
    oscBody.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.85 * gainVolume, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    oscBody.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    oscBody.start(now);
    oscBody.stop(now + 0.18);

    // 3. Wooden soundboard overtone (290Hz)
    const oscOvertone = ctx.createOscillator();
    oscOvertone.type = 'sine';
    oscOvertone.frequency.setValueAtTime(290, now);
    oscOvertone.frequency.exponentialRampToValueAtTime(190, now + 0.1);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.4 * gainVolume, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    oscOvertone.connect(overtoneGain);
    overtoneGain.connect(ctx.destination);
    oscOvertone.start(now);
    oscOvertone.stop(now + 0.14);
  }

  /**
   * Double Gavel Wrap — Two quick authoritative strikes ("Order in the Chamber!")
   */
  public playDoubleGavel(): void {
    if (!this.soundEnabled) return;
    this.playGavelStrike(0.9);
    setTimeout(() => {
      this.playGavelStrike(1.0);
    }, 140);
  }

  /**
   * Triple Gavel Wrap — Three formal strikes (Opening or Adjournment of Session)
   */
  public playTripleGavel(): void {
    if (!this.soundEnabled) return;
    this.playGavelStrike(0.85);
    setTimeout(() => {
      this.playGavelStrike(0.95);
    }, 150);
    setTimeout(() => {
      this.playGavelStrike(1.1);
    }, 310);
  }

  /**
   * Gentle Warning Chime (10-15 seconds remaining)
   * Crisp acoustic bell sound at 880 Hz with long shimmering decay.
   */
  public playWarningBell(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [880, 1760, 2640];
    const gains = [0.4, 0.15, 0.05];

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
   * Time Expired Alert — Double gavel strike + deep warning chime
   */
  public playTimeExpired(): void {
    if (!this.soundEnabled) return;
    this.playDoubleGavel();
  }

  /**
   * Substantive Vote / Motion Adopted Fanfare
   * Major triad arpeggio (C5 -> E5 -> G5 -> C6) with warm reverb
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
