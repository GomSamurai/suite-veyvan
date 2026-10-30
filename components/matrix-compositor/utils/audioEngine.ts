import { PHONEME_DATA } from '../constants/phonemes';
import { MatrixNode } from '../types/matrix';

let audioCtx: AudioContext | null = null;
let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let isHumming = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPhonemeTone(letter: string, volume = 0.22) {
  try {
    const ctx = getAudioContext();
    const clean = letter.toLowerCase();
    const info = PHONEME_DATA[clean];
    const freq = info ? info.freq : 256;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Pure crystal flute / sine sound
    osc.type = ['a', 'e', 'i', 'o', 'u', 'y'].includes(clean) ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle breath envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    // Audio context not ready
  }
}

export function playMatrixArpeggio(nodes: MatrixNode[], durationPerNote = 0.12) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.2, now);
    masterGain.connect(ctx.destination);

    nodes.forEach((n, idx) => {
      const startTime = now + idx * durationPerNote;
      const clean = n.letter.toLowerCase();
      const freq = PHONEME_DATA[clean]?.freq || 256;

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = ['a', 'e', 'i', 'o', 'u', 'y'].includes(clean) ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      oscGain.gain.setValueAtTime(0.0001, startTime);
      oscGain.gain.linearRampToValueAtTime(0.16, startTime + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationPerNote * 2.5);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + durationPerNote * 2.8);
    });
  } catch (e) {}
}

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
      filter.frequency.setValueAtTime(85, ctx.currentTime);

      ambientOsc.type = 'sine';
      ambientOsc.frequency.setValueAtTime(48, ctx.currentTime); // 48Hz Sub-bass reactor drone

      ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);

      ambientOsc.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOsc.start();
      isHumming = true;
      return true;
    }
  } catch (err) {
    return false;
  }
}

export function playSoftClick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

export function playSnapChime() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(864, ctx.currentTime); // 2x 432Hz harmonic
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.065);
  } catch (e) {}
}
