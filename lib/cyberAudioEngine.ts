// CYBER AUDIO ENGINE — Web Audio API Synthesizer for ZEN.APPS Ecosystem
// 100% synthesized in-browser: zero external audio downloads, zero latency, zero licensing issues.

export class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private ambientLfo: OscillatorNode | null = null;
  private isEnabled: boolean = false;
  private isAmbientOn: boolean = false;
  private volume: number = 0.4;
  private lastSoundTime: number = 0;

  constructor() {
    // Only check storage if running in browser
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zen_apps_cyber_sound');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.volume = typeof parsed.volume === 'number' ? parsed.volume : 0.4;
          // IMPORTANT: Never auto-enable sound on cold page load without explicit interaction
          this.isEnabled = false;
          this.isAmbientOn = !!parsed.isAmbientOn;
        }
      } catch (e) {
        // Safe fallback
      }
    }
  }

  // Lazy initialize AudioContext on explicit user gesture
  private ensureContext(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return false;
        this.ctx = new AudioContextClass();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isEnabled ? this.volume : 0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Ambient Sub-Gain
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) {
      if (this.ensureContext()) {
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
        }
        if (this.isAmbientOn) {
          this.startAmbientDrone();
        }
        this.playActivationTone();
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
      }
      this.stopAmbientDrone();
    }
    this.saveSettings();
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && this.isEnabled) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
    this.saveSettings();
  }

  public getVolume(): number {
    return this.volume;
  }

  public setAmbientOn(on: boolean) {
    this.isAmbientOn = on;
    if (this.isEnabled) {
      if (on) {
        this.startAmbientDrone();
      } else {
        this.stopAmbientDrone();
      }
    }
    this.saveSettings();
  }

  public getIsAmbientOn(): boolean {
    return this.isAmbientOn;
  }

  private saveSettings() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'zen_apps_cyber_sound',
          JSON.stringify({
            volume: this.volume,
            isAmbientOn: this.isAmbientOn,
          })
        );
      } catch (e) {}
    }
  }

  // --- CONTINUOUS AMBIENT DRONE ---
  // A soft, celestial triad (Root A1 55Hz, Fifth E2 82.4Hz, Octave A2 110Hz, Minor Third C3 130.8Hz)
  // routed through a modulated low-pass filter to create a breathing cyber space texture.
  private startAmbientDrone() {
    if (!this.ensureContext() || !this.ctx || !this.ambientGain) return;
    this.stopAmbientDrone();

    try {
      const now = this.ctx.currentTime;

      // Filter: gentle lowpass with subtle resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);
      filter.Q.setValueAtTime(2.5, now);
      filter.connect(this.ambientGain);

      // Low Frequency Oscillator for subtle breathing motion
      this.ambientLfo = this.ctx.createOscillator();
      this.ambientLfo.frequency.setValueAtTime(0.08, now); // ~12 sec cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(60, now);
      this.ambientLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      this.ambientLfo.start();

      // Atmospheric chord frequencies
      const freqs = [55, 82.41, 110, 164.81];
      this.ambientOscs = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        // Detune slightly for lush chorus warmth
        osc.detune.setValueAtTime((i - 1.5) * 3, now);

        oscGain.gain.setValueAtTime(0.08 / freqs.length, now);
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        return osc;
      });

      // Smooth fade-in
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.28, now + 2.0);
    } catch (e) {}
  }

  private stopAmbientDrone() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 1.0);

      setTimeout(() => {
        this.ambientOscs.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch (e) {}
        });
        this.ambientOscs = [];

        if (this.ambientLfo) {
          try {
            this.ambientLfo.stop();
            this.ambientLfo.disconnect();
          } catch (e) {}
          this.ambientLfo = null;
        }
      }, 1050);
    } catch (e) {}
  }

  // --- SOUND INTERACTIONS ---

  // 1. Enter Ecosystem: Soft activation chime
  public playActivationTone() {
    if (!this.isEnabled || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc2.frequency.setValueAtTime(659.25, now); // E5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } catch (e) {}
  }

  // 2. Zoom Sweep (Descending when zooming out / expanding; Ascending when zooming in / focusing)
  public playZoomSweep(direction: 'in' | 'out') {
    if (!this.isEnabled || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    // Throttle sweep sounds so wheel scrolling doesn't spam audio
    const nowMs = Date.now();
    if (nowMs - this.lastSoundTime < 220) return;
    this.lastSoundTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.0, now);

      if (direction === 'out') {
        // Expanding outward: gentle descending sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.28);
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(250, now + 0.28);
      } else {
        // Focusing inward: gentle ascending sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.25);
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(700, now + 0.25);
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // 3. Layer Reveal Shimmer: Synthesized ethereal crystal pulse when crossing detail levels
  public playLayerReveal(levelIndex: number) {
    if (!this.isEnabled || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      // Base root notes per layer: Level 1: F4, Level 2: A4, Level 3: C5, Level 4: E5
      const baseFreqs = [349.23, 440.0, 523.25, 659.25, 783.99];
      const root = baseFreqs[Math.min(levelIndex, baseFreqs.length - 1)];

      const freqs = [root, root * 1.5, root * 2]; // Root, Fifth, Octave
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.14 / (idx + 1), startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch (e) {}
  }

  // 4. Node Selection Tone: Clean, crisp tactile cyber click
  public playSelectNode() {
    if (!this.isEnabled || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // 5. Deepest Layer (Level 4 UNIVERSE): Cinematic celestial chord swell
  public playDeepestLayer() {
    if (!this.isEnabled || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      // Celestial major 9th chord: A3 (220), C#4 (277.18), E4 (329.63), G#4 (415.3), B4 (493.88)
      const chord = [220, 277.18, 329.63, 415.3, 493.88];

      chord.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.03);

        const startTime = now + i * 0.03;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.16 / (i + 1), startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    } catch (e) {}
  }

  // Cleanup on unmount
  public destroy() {
    this.stopAmbientDrone();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}

// Singleton instance
export const cyberAudio = typeof window !== 'undefined' ? new CyberAudioEngine() : (null as any);
