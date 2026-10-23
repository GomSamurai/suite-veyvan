// Procedural Web Audio API sound engine for Horocrono (diegetic sci-fi ship sounds)
class ChronoAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;
  private isReactorHumActive: boolean = false;
  private humGainNode: GainNode | null = null;
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.humGainNode && this.ctx) {
      this.humGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    } else if (!muted && this.isReactorHumActive && this.humGainNode && this.ctx) {
      this.humGainNode.gain.setTargetAtTime(this.volume * 0.15, this.ctx.currentTime, 0.1);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.humGainNode && this.ctx && !this.isMuted && this.isReactorHumActive) {
      this.humGainNode.gain.setTargetAtTime(this.volume * 0.15, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Subtle tick tone for Viras (micro-tick, 10ms, crisp).
   */
  public playViraTick(isHighBeat: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHighBeat ? 880 : 440, now);
      osc.frequency.exponentialRampToValueAtTime(isHighBeat ? 440 : 220, now + 0.015);

      gain.gain.setValueAtTime(this.volume * 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Audio context may be restricted before interaction
    }
  }

  /**
   * Resonant ship intercom chime when a shift timer finishes.
   */
  public playShiftAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Ascending futuristic arpeggio)
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteTime = now + (i * 0.14);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.35, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.65);
      });
    } catch {
      // Audio safeguard
    }
  }

  /**
   * Warning chime for Kroma 8 life-support silence.
   */
  public playKroma8Warning() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.8);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch {
      // Audio safeguard
    }
  }

  /**
   * Ambient generator: low-frequency background ship hum.
   */
  public toggleReactorHum(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isReactorHumActive) {
      if (this.humGainNode) {
        this.humGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
        setTimeout(() => {
          this.humOsc1?.stop();
          this.humOsc2?.stop();
          this.humOsc1?.disconnect();
          this.humOsc2?.disconnect();
          this.humOsc1 = null;
          this.humOsc2 = null;
          this.humGainNode = null;
        }, 150);
      }
      this.isReactorHumActive = false;
      return false;
    } else {
      try {
        const now = this.ctx.currentTime;
        this.humGainNode = this.ctx.createGain();
        this.humGainNode.gain.setValueAtTime(0.0001, now);
        this.humGainNode.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.volume * 0.12, now + 1.0);

        this.humOsc1 = this.ctx.createOscillator();
        this.humOsc1.type = 'sine';
        this.humOsc1.frequency.setValueAtTime(58.5, now); // ~58Hz mains sub-bass

        this.humOsc2 = this.ctx.createOscillator();
        this.humOsc2.type = 'triangle';
        this.humOsc2.frequency.setValueAtTime(117, now); // 2nd harmonic

        const biquad = this.ctx.createBiquadFilter();
        biquad.type = 'lowpass';
        biquad.frequency.setValueAtTime(150, now);

        this.humOsc1.connect(this.humGainNode);
        this.humOsc2.connect(this.humGainNode);
        this.humGainNode.connect(biquad);
        biquad.connect(this.ctx.destination);

        this.humOsc1.start();
        this.humOsc2.start();
        this.isReactorHumActive = true;
        return true;
      } catch {
        return false;
      }
    }
  }

  public isHumming(): boolean {
    return this.isReactorHumActive;
  }
}

export const chronoAudio = new ChronoAudioEngine();
