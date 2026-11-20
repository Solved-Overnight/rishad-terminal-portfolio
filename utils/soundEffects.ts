// Mechanical Keyboard & System Sound Effects Engine using Web Audio API

export type SoundProfile = 'thocky' | 'clicky' | 'linear' | 'buckling' | 'cyber';

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  profile: SoundProfile;
}

const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.5,
  profile: 'thocky',
};

// Local storage helper
export function getSoundSettings(): SoundSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem('terminal_sound_settings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSoundSettings(settings: Partial<SoundSettings>): SoundSettings {
  const current = getSoundSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('terminal_sound_settings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('sound-settings-changed', { detail: updated }));
    } catch (e) {
      // ignore
    }
  }
  return updated;
}

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Global user gesture unlocker to ensure AudioContext resumes reliably on first user interaction
if (typeof window !== 'undefined') {
  const unlock = () => {
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          window.removeEventListener('pointerdown', unlock);
          window.removeEventListener('keydown', unlock);
          window.removeEventListener('touchstart', unlock);
        }).catch(() => {});
      } else {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
      }
    }
  };
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
}

// Play keypress sound based on current settings and key
export function playMechanicalKeySound(key: string = 'a') {
  const settings = getSoundSettings();
  if (!settings.enabled || settings.volume <= 0) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const vol = settings.volume;
    const isSpace = key === ' ' || key === 'Spacebar';
    const isEnter = key === 'Enter';
    const isBackspace = key === 'Backspace' || key === 'Delete';

    // Micro variation pitch shift (+/- 6%)
    const pitch = 0.94 + Math.random() * 0.12;

    switch (settings.profile) {
      case 'clicky': { // Cherry MX Blue
        // Dual click transient (switch bump + actuation)
        const bufferSize = Math.floor(ctx.sampleRate * 0.02);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(4500 * pitch, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35 * vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        // High frequency tactile click oscillation
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(2800 * pitch, now + 0.003);
        clickOsc.frequency.exponentialRampToValueAtTime(800 * pitch, now + 0.018);

        clickGain.gain.setValueAtTime(0.15 * vol, now + 0.003);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now + 0.003);
        clickOsc.stop(now + 0.022);
        break;
      }

      case 'linear': { // Soft Linear / Red
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const startFreq = (isSpace ? 110 : isEnter ? 140 : 180) * pitch;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.03);

        gain.gain.setValueAtTime(0.3 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'buckling': { // IBM Model M Buckling Spring
        // Spring ping ring + clack
        const pingOsc = ctx.createOscillator();
        const pingGain = ctx.createGain();
        pingOsc.type = 'sawtooth';
        pingOsc.frequency.setValueAtTime(3200 * pitch, now);
        pingOsc.frequency.exponentialRampToValueAtTime(1400 * pitch, now + 0.04);

        pingGain.gain.setValueAtTime(0.25 * vol, now);
        pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        pingOsc.connect(pingGain);
        pingGain.connect(ctx.destination);
        pingOsc.start(now);
        pingOsc.stop(now + 0.05);

        // Clack impact
        const thockOsc = ctx.createOscillator();
        const thockGain = ctx.createGain();
        thockOsc.type = 'triangle';
        thockOsc.frequency.setValueAtTime(250 * pitch, now);
        thockOsc.frequency.exponentialRampToValueAtTime(60, now + 0.025);

        thockGain.gain.setValueAtTime(0.3 * vol, now);
        thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        thockOsc.connect(thockGain);
        thockGain.connect(ctx.destination);
        thockOsc.start(now);
        thockOsc.stop(now + 0.035);
        break;
      }

      case 'cyber': { // Retro Sci-Fi Terminal Synth
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        const baseFreq = isEnter ? 880 : isBackspace ? 330 : isSpace ? 520 : 660 + (Math.random() * 200 - 100);
        osc.frequency.setValueAtTime(baseFreq * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5 * pitch, now + 0.025);

        gain.gain.setValueAtTime(0.12 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
        break;
      }

      case 'thocky':
      default: { // Deep Custom Cream Thock
        // 1. Tactile Bump Noise Transient
        const bufferSize = Math.floor(ctx.sampleRate * 0.025);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200 * pitch, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.28 * vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        // 2. Low-end Thock Resonance
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = isSpace ? 'triangle' : 'sine';
        const startFreq = (isSpace ? 140 : isEnter ? 210 : isBackspace ? 240 : 320) * pitch;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.035);

        oscGain.gain.setValueAtTime(0.35 * vol, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
        break;
      }
    }
  } catch (e) {
    // Silent catch
  }
}

// Special sound effect for Enter / Command submission
export function playEnterSound() {
  const settings = getSoundSettings();
  if (!settings.enabled || settings.volume <= 0) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const vol = settings.volume;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.06);

    gain.gain.setValueAtTime(0.4 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {}
}

// Special sound effect for System Boot / Reboot
export function playBootSound() {
  const settings = getSoundSettings();
  if (!settings.enabled || settings.volume <= 0) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const vol = settings.volume;

    // Vintage Arpeggio Arp / Chime
    const freqs = [220, 330, 440, 660, 880];
    freqs.forEach((f, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + index * 0.06);

      gain.gain.setValueAtTime(0.18 * vol, now + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.3);
    });
  } catch (e) {}
}

// Cached procedural reverb impulse buffer for rich OS startup chimes
let winReverbBuffer: AudioBuffer | null = null;

function getWindowsReverbBuffer(ctx: AudioContext): AudioBuffer {
  if (winReverbBuffer && winReverbBuffer.sampleRate === ctx.sampleRate) {
    return winReverbBuffer;
  }
  const duration = 1.6;
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const t = i / ctx.sampleRate;
      const decay = Math.exp(-3.4 * t);
      data[i] = (Math.random() * 2 - 1) * decay * 0.45;
    }
  }
  winReverbBuffer = buffer;
  return buffer;
}

// Authentic Windows 11 Startup Sound (Warm GbMaj9 Glassy Rhodes/Bell Motif: Db5 -> Ab4 -> Bb4 -> F5)
export function playWindowsBootSound() {
  const settings = getSoundSettings();
  if (!settings.enabled || settings.volume <= 0) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const start = ctx.currentTime + 0.05;
    const vol = Math.min(1, Math.max(0.05, settings.volume));

    // Master bus -> gentle low-pass warmth + dry/wet reverb -> destination
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85 * vol, start);

    const warmthFilter = ctx.createBiquadFilter();
    warmthFilter.type = 'lowpass';
    warmthFilter.frequency.setValueAtTime(4200, start);
    warmthFilter.Q.setValueAtTime(0.5, start);

    const dryGain = ctx.createGain();
    dryGain.gain.setValueAtTime(0.75, start);

    const wetGain = ctx.createGain();
    wetGain.gain.setValueAtTime(0.38, start);

    const convolver = ctx.createConvolver();
    convolver.buffer = getWindowsReverbBuffer(ctx);

    masterGain.connect(warmthFilter);
    warmthFilter.connect(dryGain);
    warmthFilter.connect(convolver);
    convolver.connect(wetGain);
    dryGain.connect(ctx.destination);
    wetGain.connect(ctx.destination);

    // 1. Soft underlying GbMaj9 warm pad bloom (Gb3 + Db4 + Bb3)
    const padNotes = [
      { f: 185.00, g: 0.14 }, // Gb3
      { f: 233.08, g: 0.09 }, // Bb3
      { f: 277.18, g: 0.11 }, // Db4
    ];

    padNotes.forEach(({ f, g }) => {
      const osc = ctx.createOscillator();
      const padFilter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, start);

      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(620, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(g, start + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0005, start + 2.35);

      osc.connect(padFilter);
      padFilter.connect(gain);
      gain.connect(masterGain);

      osc.start(start);
      osc.stop(start + 2.45);
    });

    // Helper to synthesize a glassy Rhodes / electric-piano bell tone
    const playBellNote = (freq: number, delay: number, dur: number, level: number) => {
      const t0 = start + delay;

      // Fundamental + subtle detuned chorus pair for rich width
      [-2.5, 2.5].forEach((cents) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        osc.detune.setValueAtTime(cents, t0);

        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(level * 0.5, t0 + 0.014);
        gain.gain.exponentialRampToValueAtTime(level * 0.22, t0 + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
      });

      // Soft 2nd harmonic (Rhodes tine warmth)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, t0);

      gain2.gain.setValueAtTime(0.0001, t0);
      gain2.gain.linearRampToValueAtTime(level * 0.24, t0 + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.min(0.45, dur * 0.45));

      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(t0);
      osc2.stop(t0 + Math.min(0.5, dur * 0.5));

      // Delicate 3rd harmonic attack shimmer
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, t0);

      gain3.gain.setValueAtTime(0.0001, t0);
      gain3.gain.linearRampToValueAtTime(level * 0.08, t0 + 0.005);
      gain3.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);

      osc3.connect(gain3);
      gain3.connect(masterGain);
      osc3.start(t0);
      osc3.stop(t0 + 0.18);
    };

    // 2. Signature 4-note Windows 11 melody: Db5 -> Ab4 -> Bb4 -> F5 (with soft Gb4/Db5 bloom)
    playBellNote(554.37, 0.02, 0.95, 0.28); // Db5
    playBellNote(415.30, 0.22, 0.85, 0.24); // Ab4
    playBellNote(466.16, 0.40, 0.95, 0.26); // Bb4
    playBellNote(698.46, 0.62, 1.85, 0.32); // F5 (resolving Maj7 bloom)
    playBellNote(369.99, 0.63, 1.75, 0.16); // Gb4 (warm root support)
    playBellNote(554.37, 0.65, 1.65, 0.11); // Db5 (gentle fifth shimmer)
  } catch (e) {}
}

// Sound effect for Command Errors
export function playErrorSound() {
  const settings = getSoundSettings();
  if (!settings.enabled || settings.volume <= 0) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const vol = settings.volume;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.2 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) {}
}

// UI Click sound for buttons/modal options
export function playUIClickSound() {
  const settings = getSoundSettings();
  if (!settings.enabled || settings.volume <= 0) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const vol = settings.volume;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

    gain.gain.setValueAtTime(0.15 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  } catch (e) {}
}
