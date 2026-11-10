/**
 * Browser-Synthesized Audio Engine for Swarm Cursors (Web Audio API)
 * Inspired by Joel Califa's "Swarm" and Dhvanil Patel's "swarm-cursors".
 * Generates all sound effects (mechanical keyboard clicks, snapping clicks,
 * spatial E-major pentatonic glass piano notes, and transition chords)
 * completely in-browser without any external audio files.
 */

class SwarmAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private pentatonicScale = [329.63, 369.99, 415.30, 493.88, 554.37, 659.25, 739.99, 830.61]; // E-Major Pentatonic

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Mechanical typewriter / switch click
   */
  public playTypingClick(isSpace: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isSpace ? 600 : 1800 + Math.random() * 400, now);
      filter.Q.setValueAtTime(2.5, now);

      osc.type = isSpace ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(isSpace ? 140 : 380 + Math.random() * 120, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

      gain.gain.setValueAtTime(isSpace ? 0.08 : 0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // AudioContext policy suppression
    }
  }

  /**
   * Crisp snapping click when ruler guides or element bounding boxes snap
   */
  public playSnapClick(panX: number = 0.5) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.025);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      if (typeof this.ctx.createStereoPanner === 'function') {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, (panX - 0.5) * 2)), now);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // AudioContext policy suppression
    }
  }

  /**
   * E-Major Pentatonic glass-piano note spatially mapped to cursor position
   */
  public playGlassNote(noteIndex?: number, panX: number = 0.5) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const idx = typeof noteIndex === 'number' 
        ? noteIndex % this.pentatonicScale.length 
        : Math.floor(Math.random() * this.pentatonicScale.length);
      const freq = this.pentatonicScale[idx];

      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      if (typeof this.ctx.createStereoPanner === 'function') {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, (panX - 0.5) * 2)), now);
        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(panner);
        panner.connect(this.ctx.destination);
      } else {
        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(this.ctx.destination);
      }

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.36);
      overtone.stop(now + 0.36);
    } catch {
      // AudioContext policy suppression
    }
  }

  /**
   * Harmonious E-Major chord upon completing the swarm rebuild
   */
  public playCompletionChord() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chord = [329.63, 415.30, 493.88, 659.25]; // E4, G#4, B4, E5

      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0.08, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + 1.3);
      });
    } catch {
      // AudioContext policy suppression
    }
  }
}

export const swarmAudio = new SwarmAudioEngine();
