// Audio Engine for Transversal / Tael'im using native Web Audio API
// Zero external dependencies, pure synthesis of breath and harmonic resonance

let audioCtx: AudioContext | null = null;
let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let isHumming = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Map 24 phonemes to harmonic resonant frequencies (Sacred Veyvān scale based on 432Hz tuning)
const PHONEME_FREQUENCIES: Record<string, number> = {
  a: 216.0,  // A3 - Alma / Expansión
  e: 288.0,  // D4 - Esencia
  i: 324.0,  // E4 - Inspiración aguda
  o: 243.0,  // B3 - Observador
  u: 162.0,  // E3 - Fluidez profunda
  y: 364.5,  // F#4 - Centro sutil
  b: 144.0,  // Origen base
  c: 192.0,  // Calma
  d: 216.0,  // Dualidad
  f: 384.0,  // Fuego/Soplido
  g: 180.0,  // Tierra
  h: 432.0,  // Eco del aliento
  j: 320.0,  // Júbilo
  k: 270.0,  // Fuerza
  l: 360.0,  // Luz
  m: 240.0,  // Memoria labial
  n: 300.0,  // Nexo
  p: 405.0,  // Sombra inicial
  q: 135.0,  // Contención grave
  r: 256.0,  // Resonancia
  s: 480.0,  // Silencio siseado
  t: 337.5,  // Firmeza
  v: 225.0,  // Límite/Umbral
  z: 450.0   // Ciclo
};

/**
 * Plays a resonant chord/sequence of the letters in a Transversal root.
 * Creates the feeling of "hearing the breath and soul" of the word.
 */
export function playWordResonance(word: string, durationPerLetter = 0.16) {
  try {
    const ctx = getAudioContext();
    const cleanLetters = word.toLowerCase().replace(/[^a-z]/g, '').split('');
    if (cleanLetters.length === 0) return;

    const now = ctx.currentTime;

    // Master bus with gentle reverb-like feedback
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.25, now);
    masterGain.connect(ctx.destination);

    cleanLetters.forEach((char, idx) => {
      const startTime = now + idx * durationPerLetter;
      const freq = PHONEME_FREQUENCIES[char] || 250;

      // Primary tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Flute / crystal bell timbre: sine with subtle harmonic
      osc.type = ['a', 'e', 'i', 'o', 'u', 'y'].includes(char) ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope: gentle breath attack and smooth release
      oscGain.gain.setValueAtTime(0.0001, startTime);
      oscGain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationPerLetter * 2.2);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + durationPerLetter * 2.5);

      // Subtle breath noise for aspirates and sibilants (Th, Kh, S, H)
      if (['s', 'h', 'f'].includes(char) || word.toLowerCase().includes('th') || word.toLowerCase().includes('kh')) {
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = freq * 3;
        filter.Q.value = 3;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.04, startTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);

        whiteNoise.start(startTime);
        whiteNoise.stop(startTime + 0.15);
      }
    });
  } catch (err) {
    console.warn("Web Audio not supported or blocked", err);
  }
}

/**
 * Ambient reactor hum of Estación Humanidad (very soft 48Hz drone)
 */
export function toggleAmbientHum(): boolean {
  try {
    const ctx = getAudioContext();
    if (isHumming) {
      if (ambientGain) {
        ambientGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1);
        setTimeout(() => {
          ambientOsc?.stop();
          ambientOsc?.disconnect();
          ambientOsc = null;
        }, 1000);
      }
      isHumming = false;
      return false;
    } else {
      ambientOsc = ctx.createOscillator();
      ambientGain = ctx.createGain();

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(90, ctx.currentTime);

      ambientOsc.type = 'sine';
      ambientOsc.frequency.setValueAtTime(48, ctx.currentTime); // Sub-bass drone

      ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2); // Soft background presence

      ambientOsc.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOsc.start();
      isHumming = true;
      return true;
    }
  } catch (err) {
    console.warn("Could not toggle ambient hum", err);
    return false;
  }
}

export function playSoftClick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch (e) {
    // Ignore audio errors
  }
}

/**
 * Play single phoneme resonant tone based on the 432Hz Veyvān scale
 */
export function playPhoneme(char: string) {
  try {
    const ctx = getAudioContext();
    const clean = char.toLowerCase();
    const freq = PHONEME_FREQUENCIES[clean] || 250;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = ['a', 'e', 'i', 'o', 'u', 'y'].includes(clean) ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (e) {
    // Ignore
  }
}

/**
 * Play transcendent double chime for correct answers and mastery
 */
export function playHarmonicChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const freqs = [554.37, 830.61]; // C#5 and G#5 (Quintal harmony)
    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  } catch (e) {
    // Ignore
  }
}

/**
 * Play subtle atmospheric low-frequency discord for error feedback
 */
export function playDissonance() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(110, now);
    osc2.frequency.setValueAtTime(117, now); // Microtonal beating

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
  } catch (e) {
    // Ignore
  }
}
