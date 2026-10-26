// =============================================================================
// THALIOS SOLARIS // CORE DE SÍNTESIS DE VOZ Y TRANSMISIÓN AUDITIVA DIEGÉTICA
// Sistema de lectura de Lore, Oráculo y Bitácoras para Suite Veyvan
// =============================================================================

import { getAiClient, getGeminiApiKey } from './geminiService';

export type VoiceEngineType = 'web-speech' | 'gemini-voice' | 'kokoro-onnx';
export type DspFilterMode = 'orbital' | 'reactor' | 'clean' | 'vocoder';

export type GeminiArchetype = 
  | 'anciano'          // Anciano Sabio y Venerable (80 años)
  | 'thalios_solaris'  // Thalios Solaris Canónico (I.A. omnisciente)
  | 'oraculo_femenino' // Oráculo Femenino / Matriarca
  | 'comandante'       // Comandante Marcial de Cubierta
  | 'sacerdote'        // Sacerdote Litúrgico del Reactor
  | 'personalizado';   // Prompt de Actuación Libre Personalizado

export type GeminiEmotion = 'solemne' | 'misterioso' | 'urgente' | 'intimo' | 'cientifico';
export type GeminiCadence = 'pausada' | 'normal' | 'dinamica';
export type GeminiAccent = 'castellano' | 'latam';

export interface ThaliosVoiceConfig {
  engine: VoiceEngineType;
  // Identificador de voz para Web Speech (URI o Name)
  voiceUri: string;
  // Configuración de Gemini Multimodal Audio
  geminiVoice: 'Charon' | 'Aoede' | 'Fenrir' | 'Kore' | 'Puck';
  geminiAccent: GeminiAccent;
  geminiArchetype: GeminiArchetype;
  geminiEmotion: GeminiEmotion;
  geminiCadence: GeminiCadence;
  geminiCustomPrompt: string;
  // Nombre de voz para Kokoro-82M ONNX
  kokoroVoice: string;
  // Dialecto fonético para Kokoro: 'castellano' (peninsular ceceante) o 'latam' (seseo neutro)
  kokoroDialect: 'castellano' | 'latam';
  // Parámetros acústicos
  rate: number;       // 0.7x (solemne, pausado) a 1.4x (rápido). Canónico: 0.92
  pitch: number;      // 0.6 (grave, abismal) a 1.4 (agudo). Canónico: 0.88
  volume: number;     // 0.0 a 1.0. Canónico: 0.90
  // Filtros DSP Diegéticos de Estación (Web Audio API)
  enableDspFilter: boolean;
  dspMode: DspFilterMode;
  dspIntensity: number; // 0.1 a 1.0 (Canónico: 0.55)
  enableTransmissionChimes: boolean; // Chimes de acople de radio interestelar antes y después de hablar
  enableIntercomStatic: boolean;     // Sutil ruido de portadora estelar de fondo mientras habla
  // Automatización y Comportamiento
  autoNarrateOracle: boolean;        // Hablar automáticamente las respuestas del Oráculo de Thalios
  autoNarrateLoreCards: boolean;     // Hablar automáticamente al abrir fichas de lore
  showFloatingHud: boolean;          // Mostrar el widget flotante con visualizador de espectro
  enableSpacebarPause: boolean;      // Barra espaciadora pausa/reanuda la voz
}

export interface ThaliosVoiceState {
  isSpeaking: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTitle: string;
  currentText: string;
  activeEngine: VoiceEngineType;
  elapsedSeconds: number;
}

export const GEMINI_ARCHETYPE_PRESETS: Record<GeminiArchetype, {
  name: string;
  icon: string;
  recommendedVoice: 'Charon' | 'Aoede' | 'Fenrir' | 'Kore' | 'Puck';
  desc: string;
  prompt: string;
}> = {
  anciano: {
    name: 'Anciano Sabio / Cronista',
    icon: '👴',
    recommendedVoice: 'Fenrir',
    desc: 'Voz venerable de 80 años, solemne, sabia, profunda y serena, con el peso de siglos de travesía.',
    prompt: 'Actúa con la voz de un anciano sabio y venerable de 80 años, cronista anciano de la travesía estelar. Habla en estricto castellano peninsular de España (con distinción clara de z/c y s), con tono solemne, pausado, sabio y con el peso de una vida entera de experiencia.'
  },
  thalios_solaris: {
    name: 'Thalios Solaris Canónico',
    icon: '🤖',
    recommendedVoice: 'Charon',
    desc: 'Inteligencia artificial omnisciente de la nave: solemne, majestuosa, autoritaria e inquebrantable.',
    prompt: 'Actúa como Thalios Solaris, la consciencia digital omnisciente de Estación Humanidad. Habla en castellano peninsular de España, con voz solemne, autoritaria, fría, inquebrantable y con gran resonancia oracular.'
  },
  oraculo_femenino: {
    name: 'Oráculo Femenino / Matriarca',
    icon: '👑',
    recommendedVoice: 'Aoede',
    desc: 'Voz femenina madura o mística, solemne, poética, protectora y serena.',
    prompt: 'Actúa con la voz de una matriarca y oráculo femenino de la Estación. Habla en castellano peninsular de España, con voz femenina cristalina, mística, solemne, poética y protectora.'
  },
  comandante: {
    name: 'Comandante Marcial',
    icon: '⚔️',
    recommendedVoice: 'Fenrir',
    desc: 'Voz severa, firme, de mando militar en cubiertas perimetrales.',
    prompt: 'Actúa con la voz de un comandante marcial de cubierta de la nave. Habla en castellano de España, con tono severo, disciplinado, perentorio, tajante y autoritario.'
  },
  sacerdote: {
    name: 'Litúrgico / Devoto del Reactor',
    icon: '🕯️',
    recommendedVoice: 'Charon',
    desc: 'Cadencia ritual y ceremoniosa de los sacerdotes que veneran el núcleo de fisión.',
    prompt: 'Actúa con la voz de un sacerdote litúrgico del Culto al Reactor. Habla en castellano solemne, con cadencia ritual, reverente, mística y ceremoniosa.'
  },
  personalizado: {
    name: 'Directiva Personalizada',
    icon: '✍️',
    recommendedVoice: 'Charon',
    desc: 'Control total: redacta tus propias instrucciones de actuación vocal y acento.',
    prompt: ''
  }
};

export const VALID_KOKORO_VOICES = [
  // --- VOCES GRAVES, MARCIALES Y SABIAS ---
  { 
    id: 'am_fenrir', 
    name: 'Fenrir', 
    category: 'Grave y Marcial (Canónico Thalios)', 
    desc: 'Timbre abismal, solemne y marcial. Gran resonancia cuántica y solemnidad de puente de mando.',
    gender: 'Masculino'
  },
  { 
    id: 'am_santa', 
    name: 'Santa', 
    category: 'Anciano Sabio y Venerable', 
    desc: 'Voz madura, profunda y pausada. Cadencia de cronista y sabio con siglos de experiencia.',
    gender: 'Masculino'
  },
  { 
    id: 'bm_george', 
    name: 'George', 
    category: 'Litúrgico y Ceremonioso', 
    desc: 'Cadencia solemne y ceremoniosa estilo noble de nave.',
    gender: 'Masculino'
  },
  { 
    id: 'bm_fable', 
    name: 'Fable', 
    category: 'Cronista Épico', 
    desc: 'Tono narrativo épico ideal para relatos de la travesía y bitácoras.',
    gender: 'Masculino'
  },
  { 
    id: 'am_adam', 
    name: 'Adam', 
    category: 'Rector Institucional', 
    desc: 'Firme, autoritaria y serena. Cadencia protocolaria de Estación.',
    gender: 'Masculino'
  },
  { 
    id: 'am_michael', 
    name: 'Michael', 
    category: 'Técnico y Analítico', 
    desc: 'Clara, analítica y neutral. Registro enciclopédico.',
    gender: 'Masculino'
  },

  // --- VOCES FEMENINAS ORACULARES Y CRISTALINAS ---
  { 
    id: 'af_aoede', 
    name: 'Aoede', 
    category: 'Oráculo Femenino Místico', 
    desc: 'Voz oracular, poética, misteriosa y serena. Proyección cristalina.',
    gender: 'Femenino'
  },
  { 
    id: 'af_heart', 
    name: 'Heart', 
    category: 'Matriarca Emotiva (Grado A)', 
    desc: 'Máxima fidelidad neural (Grado A ❤️). Articulación impecable.',
    gender: 'Femenino'
  },
  { 
    id: 'af_bella', 
    name: 'Bella', 
    category: 'Femenino Cálido y Expresivo', 
    desc: 'Tono cercano, articulado y formal. Muy expresiva.',
    gender: 'Femenino'
  },
  { 
    id: 'af_kore', 
    name: 'Kore', 
    category: 'Archivista Femenina', 
    desc: 'Impasible, formal y analítica. Ideal para consultas lexicográficas.',
    gender: 'Femenino'
  },
  { 
    id: 'af_sky', 
    name: 'Sky', 
    category: 'Proyección Etérea', 
    desc: 'Etérea y ligera, estilo holograma cuántico.',
    gender: 'Femenino'
  },
] as const;

export type KokoroVoiceId = typeof VALID_KOKORO_VOICES[number]['id'];
export const VALID_KOKORO_VOICE_IDS = new Set(VALID_KOKORO_VOICES.map(v => v.id));

/**
 * Convierte cualquier número entero de 0 a 9999 a su representación textual en español
 */
export function numToSpanishWords(n: number): string {
  if (isNaN(n)) return '';
  const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
    'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  if (n === 0) return 'cero';
  if (n === 100) return 'cien';
  if (n < 20) return units[n];
  if (n < 30) return n === 20 ? 'veinte' : 'veinti' + units[n % 10];
  if (n < 100) {
    const u = n % 10;
    return tens[Math.floor(n / 10)] + (u > 0 ? ' y ' + units[u] : '');
  }
  if (n < 1000) {
    const rem = n % 100;
    return hundreds[Math.floor(n / 100)] + (rem > 0 ? ' ' + numToSpanishWords(rem) : '');
  }
  if (n < 10000) {
    const thousands = Math.floor(n / 1000);
    const rem = n % 1000;
    const thStr = thousands === 1 ? 'mil' : numToSpanishWords(thousands) + ' mil';
    return thStr + (rem > 0 ? ' ' + numToSpanishWords(rem) : '');
  }
  return String(n);
}

/**
 * Expande números, fechas y años dentro de un texto a palabras en español para dicción fluida
 */
export function expandNumbersInSpanish(text: string): string {
  return text
    // Casos especiales de gran escala en el lore
    .replace(/\b12\.300\.000\b/g, 'doce millones trescientos mil')
    .replace(/\b150\.000\b/g, 'ciento cincuenta mil')
    .replace(/\b(\d+)\.000\b/g, (_, p1) => `${numToSpanishWords(parseInt(p1, 10))} mil`)
    .replace(/\b(\d+)\s*%/g, (_, p1) => `${numToSpanishWords(parseInt(p1, 10))} por ciento`)
    .replace(/\bd\.C\./gi, 'después de Cristo')
    .replace(/\ba\.C\./gi, 'antes de Cristo')
    // Años y números de hasta 4 cifras
    .replace(/\b\d{1,4}\b/g, (m) => numToSpanishWords(parseInt(m, 10)));
}

/**
 * Divide un texto extenso en oraciones completas de longitud óptima para inferencia neural
 */
export function splitTextIntoSentences(text: string, maxChunkLen: number = 220): string[] {
  if (!text) return [];
  const clean = text.replace(/\s+/g, ' ').trim();
  const rawSentences = clean.split(/(?<=[.!?;\n])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const s of rawSentences) {
    if (!s.trim()) continue;
    if (current.length + s.length + 1 <= maxChunkLen) {
      current = current ? `${current} ${s}` : s;
    } else {
      if (current) chunks.push(current);
      if (s.length > maxChunkLen) {
        const clauses = s.split(/(?<=[,:\-—])\s+/);
        let sub = '';
        for (const c of clauses) {
          if (sub.length + c.length + 1 <= maxChunkLen) {
            sub = sub ? `${sub} ${c}` : c;
          } else {
            if (sub) chunks.push(sub);
            sub = c;
          }
        }
        if (sub) chunks.push(sub);
        current = '';
      } else {
        current = s;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.filter(c => c.trim().length > 0);
}

/**
 * Fonetizador fonémico para Kokoro-82M (Español Peninsular / Castellano / Neutro)
 * Transforma texto ortográfico en español a cadenas de fonemas IPA estándar del vocabulario de Kokoro.
 * Elimina por completo el acento anglosajón del fonetizador en inglés por defecto.
 */
export function spanishToIpa(text: string, mode: 'castellano' | 'latam' = 'castellano'): string {
  if (!text) return '';

  // 1. Expansión de números a palabras completas
  let t = expandNumbersInSpanish(text);

  // 2. Normalización de caracteres y diéresis fantásticas
  t = t
    .replace(/ë/g, 'e').replace(/Ë/g, 'E')
    .replace(/ï/g, 'i').replace(/Ï/g, 'I')
    .replace(/ä/g, 'a').replace(/Ä/g, 'A')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/[«»“”]/g, '"')
    .replace(/[‘’']/g, '') // Eliminar apóstrofes para que nombres como Tael'im o Ner'Val fluyan
    .replace(/—|–/g, ', ')
    .replace(/…/g, '...')
    .replace(/\bthalios\b/gi, 'talios')
    .replace(/\bth/gi, 't');

  const CLITICS = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 
    'de', 'del', 'a', 'al', 'en', 'con', 'por', 'sin', 
    'y', 'e', 'o', 'u', 'que', 'se', 'su', 'sus', 'mi', 'mis', 'tu', 'tus'
  ]);

  const tokens = t.split(/([a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+)/);

  return tokens.map(tok => {
    if (!tok || !/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(tok)) {
      return tok;
    }

    let w = tok.toLowerCase();
    const isClitic = CLITICS.has(w);

    // Grupos consonánticos dígrafos
    w = w.replace(/ch/g, 'ʧ');
    w = w.replace(/ll/g, 'ʝ');
    w = w.replace(/qu([eéií])/g, 'k$1');
    w = w.replace(/gü([eéií])/g, 'ɡw$1');
    w = w.replace(/gu([eéií])/g, 'ɡ$1');

    // X siempre como ks
    w = w.replace(/x/g, 'ks');

    // C y Z según modo fonético (Castellano ceceante o Latam seseante)
    if (mode === 'castellano') {
      w = w.replace(/c([eéií])/g, 'θ$1');
      w = w.replace(/z/g, 'θ');
    } else {
      w = w.replace(/c([eéií])/g, 's$1');
      w = w.replace(/z/g, 's');
    }
    w = w.replace(/c/g, 'k');

    // G y J
    w = w.replace(/g([eéií])/g, 'x$1');
    w = w.replace(/j/g, 'x');
    w = w.replace(/g/g, 'ɡ');

    // H muda (excepto ch previamente convertida a ʧ)
    w = w.replace(/h/g, '');

    // Ñ
    w = w.replace(/ñ/g, 'ɲ');

    // V -> b
    w = w.replace(/v/g, 'b');

    // Y al final de palabra como semivocal j, o ante vocal como ʝ
    w = w.replace(/y([aeiouáéíóú])/g, 'ʝ$1');
    w = w.replace(/y\b/g, 'j');
    w = w.replace(/y/g, 'i');

    // R vibrante múltiple (trill) vs simple (tap)
    w = w.replace(/rr/g, 'R');
    w = w.replace(/^r/, 'R');
    w = w.replace(/([nls])r/g, '$1R');
    w = w.replace(/([aeiouáéíóú])r([aeiouáéíóú])/g, '$1ɾ$2');
    w = w.replace(/r/g, 'ɾ');
    w = w.replace(/R/g, 'r');
    w = w.replace(/^ɾ/, 'r');

    // Diptongos con semivocales
    w = w.replace(/i([aeouáéóú])/g, 'j$1');
    w = w.replace(/u([aeoáéíó])/g, 'w$1');
    w = w.replace(/([aeo])i/g, '$1j');
    w = w.replace(/([aeo])u/g, '$1w');

    // Acentuación y tildes gráficas
    const hasTilde = /[áéíóú]/.test(w);
    w = w.replace(/á/g, 'ˈa');
    w = w.replace(/é/g, 'ˈe');
    w = w.replace(/í/g, 'ˈi');
    w = w.replace(/ó/g, 'ˈo');
    w = w.replace(/ú/g, 'ˈu');

    if (!hasTilde && !isClitic) {
      const lastChar = tok.slice(-1).toLowerCase();
      const endsInVowelOrNS = /[aeiouñns]/.test(lastChar);
      const vowels = [...w.matchAll(/[aeiou]/g)];

      if (vowels.length > 1) {
        const targetVowelIdx = endsInVowelOrNS ? vowels.length - 2 : vowels.length - 1;
        const vPos = vowels[targetVowelIdx].index;
        w = w.slice(0, vPos) + 'ˈ' + w.slice(vPos);
      } else if (vowels.length === 1 && tok.length > 2) {
        const vPos = vowels[0].index;
        w = w.slice(0, vPos) + 'ˈ' + w.slice(vPos);
      }
    }

    return w;
  }).join('');
}

const STORAGE_KEY_V2 = 'thalios_voice_config_v2';
const STORAGE_KEY_V1 = 'thalios_voice_config_v1';

export const DEFAULT_VOICE_CONFIG: ThaliosVoiceConfig = {
  engine: 'web-speech',
  voiceUri: '',
  geminiVoice: 'Charon',
  geminiAccent: 'castellano',
  geminiArchetype: 'thalios_solaris',
  geminiEmotion: 'solemne',
  geminiCadence: 'pausada',
  geminiCustomPrompt: '',
  kokoroVoice: 'am_fenrir',
  kokoroDialect: 'castellano',
  rate: 0.95,
  pitch: 0.88,
  volume: 0.90,
  enableDspFilter: true,
  dspMode: 'orbital',
  dspIntensity: 0.45,
  enableTransmissionChimes: true,
  enableIntercomStatic: true,
  autoNarrateOracle: false,
  autoNarrateLoreCards: false,
  showFloatingHud: true,
  enableSpacebarPause: true,
};

// Detección y caché de soporte de WebGPU para aceleración por hardware físico (NVIDIA RTX / D3D12 / Vulkan)
let cachedWebGpuSupport: { isAvailable: boolean; description: string; hasFp16: boolean } | null = null;

export async function detectWebGpuSupport(): Promise<{ isAvailable: boolean; description: string; hasFp16: boolean }> {
  if (cachedWebGpuSupport) return cachedWebGpuSupport;
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
    cachedWebGpuSupport = { 
      isAvailable: false, 
      description: 'Navegador sin soporte WebGPU (se utilizará CPU WASM)', 
      hasFp16: false 
    };
    return cachedWebGpuSupport;
  }
  try {
    const adapter = await (navigator as any).gpu?.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) {
      cachedWebGpuSupport = { 
        isAvailable: false, 
        description: 'No se obtuvo adaptador GPU de alto rendimiento', 
        hasFp16: false 
      };
      return cachedWebGpuSupport;
    }
    const info = (await adapter.requestAdapterInfo?.()) || adapter.info || {};
    const description = info.description || info.device || info.vendor || 'GPU Compatible WebGPU (DirectX 12 / Vulkan)';
    const hasFp16 = !!adapter.features?.has('shader-f16');
    cachedWebGpuSupport = { isAvailable: true, description, hasFp16 };
    return cachedWebGpuSupport;
  } catch (err: any) {
    cachedWebGpuSupport = { 
      isAvailable: false, 
      description: err?.message || 'Error de sondeo WebGPU', 
      hasFp16: false 
    };
    return cachedWebGpuSupport;
  }
}

class ThaliosVoiceService {
  private config: ThaliosVoiceConfig;
  private state: ThaliosVoiceState;
  private listeners: Set<(state: ThaliosVoiceState) => void> = new Set();
  
  // Web Audio Context & Nodos DSP
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private biquadFilter: BiquadFilterNode | null = null;
  private staticGainNode: GainNode | null = null;
  private staticSource: AudioBufferSourceNode | null = null;
  
  // Elementos de reproducción de audio externo (Gemini/Kokoro)
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentBufferSource: AudioBufferSourceNode | null = null;
  private scheduledBufferSources: AudioBufferSourceNode[] = [];
  private queueCancelToken: number = 0;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  
  // Temporizadores
  private elapsedTimer: number | null = null;
  private currentSourceNode: MediaElementAudioSourceNode | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.state = {
      isSpeaking: false,
      isPaused: false,
      isLoading: false,
      currentTitle: '',
      currentText: '',
      activeEngine: this.config.engine,
      elapsedSeconds: 0,
    };

    // Pre-cargar voces del sistema si están listas
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.notifyListeners();
      };
    }
  }

  // ---------------------------------------------------------------------------
  // GESTIÓN DE CONFIGURACIÓN
  // ---------------------------------------------------------------------------
  public getConfig(): ThaliosVoiceConfig {
    return { ...this.config };
  }

  public updateConfig(partial: Partial<ThaliosVoiceConfig>): ThaliosVoiceConfig {
    this.config = { ...this.config, ...partial };
    this.saveConfig();
    this.applyDspSettings();
    this.notifyListeners();
    return this.getConfig();
  }

  public resetToDefaults(): ThaliosVoiceConfig {
    this.config = { ...DEFAULT_VOICE_CONFIG };
    this.saveConfig();
    this.applyDspSettings();
    this.notifyListeners();
    return this.getConfig();
  }

  private loadConfig(): ThaliosVoiceConfig {
    if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
    try {
      // 1. Intentar cargar v2
      const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        // Devolver a web-speech por defecto para respuesta instantánea sin esperas de inferencia en CPU
        if (parsed._engineMigratedV3 !== true) {
          parsed.engine = 'web-speech';
          parsed._engineMigratedV3 = true;
          localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(parsed));
        }
        
        // Sanear y migrar voces Kokoro si el usuario tenía las obsoletas
        if (parsed.kokoroVoice === 'em_santa' || parsed.kokoroVoice === 'am_santa') {
          parsed.kokoroVoice = 'am_santa';
        } else if (parsed.kokoroVoice === 'em_alex' || parsed.kokoroVoice === 'am_adam') {
          parsed.kokoroVoice = 'am_adam';
        } else if (parsed.kokoroVoice === 'ef_dora' || parsed.kokoroVoice === 'af_aoede') {
          parsed.kokoroVoice = 'af_aoede';
        } else if (!VALID_KOKORO_VOICE_IDS.has(parsed.kokoroVoice as any)) {
          parsed.kokoroVoice = 'am_fenrir';
        }

        if (!parsed.kokoroDialect) {
          parsed.kokoroDialect = 'castellano';
        }
        if (!parsed.geminiAccent) {
          parsed.geminiAccent = 'castellano';
        }
        if (!parsed.geminiArchetype) {
          parsed.geminiArchetype = 'thalios_solaris';
        }
        if (!parsed.geminiEmotion) {
          parsed.geminiEmotion = 'solemne';
        }
        if (!parsed.geminiCadence) {
          parsed.geminiCadence = 'pausada';
        }
        if (parsed.geminiCustomPrompt === undefined) {
          parsed.geminiCustomPrompt = '';
        }

        return { ...DEFAULT_VOICE_CONFIG, ...parsed };
      }

      // 2. Migración desde v1
      const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
      if (rawV1) {
        const parsed = JSON.parse(rawV1);
        parsed.engine = 'web-speech';
        parsed.kokoroVoice = 'am_fenrir';
        parsed.kokoroDialect = 'castellano';
        parsed.geminiAccent = 'castellano';
        parsed.geminiArchetype = 'thalios_solaris';
        parsed.geminiEmotion = 'solemne';
        parsed.geminiCadence = 'pausada';
        parsed.geminiCustomPrompt = '';
        parsed._engineMigratedV3 = true;
        const migrated = { ...DEFAULT_VOICE_CONFIG, ...parsed };
        localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
        return migrated;
      }

      return DEFAULT_VOICE_CONFIG;
    } catch {
      return DEFAULT_VOICE_CONFIG;
    }
  }

  private saveConfig(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Error al guardar configuración de voz de Thalios:', e);
    }
  }

  // ---------------------------------------------------------------------------
  // MOTOR WEB AUDIO & DSP
  // ---------------------------------------------------------------------------
  private initAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        
        // Crear nodo analizador para espectrograma visual
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;

        // Crear ganancia maestra
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.config.volume, this.audioCtx.currentTime);

        // Crear filtro biquad para modulación cuántica
        this.biquadFilter = this.audioCtx.createBiquadFilter();
        this.applyDspSettings();

        // Conectar cadena: biquad -> masterGain -> analyser -> destination
        this.biquadFilter.connect(this.masterGain);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  private applyDspSettings(): void {
    if (!this.audioCtx || !this.biquadFilter || !this.masterGain) return;
    const now = this.audioCtx.currentTime;

    this.masterGain.gain.setTargetAtTime(this.config.volume, now, 0.05);

    if (!this.config.enableDspFilter || this.config.dspMode === 'clean') {
      this.biquadFilter.type = 'allpass';
      return;
    }

    switch (this.config.dspMode) {
      case 'orbital':
        // Realce de intercomunicador de nave estelar (Bandpass centrado en 2.2 kHz)
        this.biquadFilter.type = 'peaking';
        this.biquadFilter.frequency.setTargetAtTime(2200, now, 0.05);
        this.biquadFilter.Q.setTargetAtTime(2.5, now, 0.05);
        this.biquadFilter.gain.setTargetAtTime(6 * this.config.dspIntensity, now, 0.05);
        break;

      case 'reactor':
        // Voz profunda de mega-estructura con resonancia en graves (Lowpass cálido con resonancia)
        this.biquadFilter.type = 'lowpass';
        this.biquadFilter.frequency.setTargetAtTime(1400 + (1 - this.config.dspIntensity) * 2000, now, 0.05);
        this.biquadFilter.Q.setTargetAtTime(3.5 * this.config.dspIntensity, now, 0.05);
        break;

      case 'vocoder':
        // Efecto cibernético digitalizado
        this.biquadFilter.type = 'bandpass';
        this.biquadFilter.frequency.setTargetAtTime(1800, now, 0.05);
        this.biquadFilter.Q.setTargetAtTime(4.0 * this.config.dspIntensity, now, 0.05);
        break;
    }
  }

  /**
   * Genera el chime diegético de acople de radio (apertura o cierre de canal)
   */
  public playTransmissionChime(type: 'open' | 'close'): Promise<void> {
    return new Promise(async (resolve) => {
      if (!this.config.enableTransmissionChimes) {
        resolve();
        return;
      }

      const ctx = this.initAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      try {
        if (ctx.state === 'suspended') {
          try { await ctx.resume(); } catch {}
        }

        const now = ctx.currentTime;
        const chimeGain = ctx.createGain();
        chimeGain.gain.setValueAtTime(0.0001, now);

        // Conectar a la cadena DSP para que adopte la reverberación y ecualización de Estación
        if (this.biquadFilter) {
          chimeGain.connect(this.biquadFilter);
        } else {
          chimeGain.connect(ctx.destination);
        }

        const volumeMultiplier = Math.max(0.25, Math.min(1.0, this.config.volume)) * 0.40;

        if (type === 'open') {
          // Secuencia armónica ascendente: 659Hz (E5) -> 880Hz (A5)
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(659.25, now);
          osc1.frequency.setValueAtTime(880.00, now + 0.06);

          chimeGain.gain.setValueAtTime(0.0001, now);
          chimeGain.gain.linearRampToValueAtTime(volumeMultiplier, now + 0.02);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

          osc1.connect(chimeGain);
          osc1.start(now);
          osc1.stop(now + 0.17);

          setTimeout(resolve, 150);
        } else {
          // Secuencia descendente de cierre de canal: 880Hz (A5) -> 440Hz (A4)
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(880.00, now);
          osc1.frequency.setValueAtTime(440.00, now + 0.05);

          chimeGain.gain.setValueAtTime(0.0001, now);
          chimeGain.gain.linearRampToValueAtTime(volumeMultiplier * 0.9, now + 0.02);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

          osc1.connect(chimeGain);
          osc1.start(now);
          osc1.stop(now + 0.19);

          setTimeout(resolve, 180);
        }
      } catch {
        resolve();
      }
    });
  }

  /**
   * Activa/desactiva el ruido sutil de portadora estelar (intercom static)
   */
  private async setIntercomStatic(active: boolean): Promise<void> {
    if (!this.config.enableIntercomStatic) return;
    const ctx = this.initAudioContext();
    if (!ctx) return;

    if (!active) {
      if (this.staticGainNode && ctx) {
        this.staticGainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      }
      setTimeout(() => {
        if (this.staticSource) {
          try { this.staticSource.stop(); } catch {}
          this.staticSource = null;
        }
      }, 100);
      return;
    }

    try {
      if (ctx.state === 'suspended') {
        try { await ctx.resume(); } catch {}
      }

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.04;
      }

      this.staticSource = ctx.createBufferSource();
      this.staticSource.buffer = noiseBuffer;
      this.staticSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 1.2;

      this.staticGainNode = ctx.createGain();
      const intensity = this.config.dspIntensity || 0.5;
      const targetGain = Math.max(0.015, this.config.volume * 0.07 * intensity);
      this.staticGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
      this.staticGainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.12);

      this.staticSource.connect(filter);
      filter.connect(this.staticGainNode);

      if (this.biquadFilter) {
        this.staticGainNode.connect(this.biquadFilter);
      } else {
        this.staticGainNode.connect(ctx.destination);
      }

      this.staticSource.start();
    } catch {
      // Ignorar si el audio context aún no tiene permisos
    }
  }

  // ---------------------------------------------------------------------------
  // OBTENER VOCES DEL SISTEMA
  // ---------------------------------------------------------------------------
  public getAvailableSystemVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
  }

  public getRecommendedSystemVoice(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableSystemVoices();
    if (voices.length === 0) return null;

    // 1. Si el usuario seleccionó una específica y existe, usarla
    if (this.config.voiceUri) {
      const matched = voices.find(v => v.voiceURI === this.config.voiceUri || v.name === this.config.voiceUri);
      if (matched) return matched;
    }

    // 2. Buscar voces en español ideales para IA (graves, neutrales o naturales)
    const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
    const preferredSpanish = spanishVoices.find(v => 
      v.name.toLowerCase().includes('natural') || 
      v.name.toLowerCase().includes('neural') ||
      v.name.toLowerCase().includes('helena') ||
      v.name.toLowerCase().includes('pablo') ||
      v.name.toLowerCase().includes('jorge') ||
      v.name.toLowerCase().includes('sabina') ||
      v.name.toLowerCase().includes('google')
    );
    if (preferredSpanish) return preferredSpanish;
    if (spanishVoices.length > 0) return spanishVoices[0];

    // 3. Fallback a voces en inglés solemnes si no hay español
    const preferredEnglish = voices.find(v => 
      v.name.toLowerCase().includes('david') || 
      v.name.toLowerCase().includes('george') || 
      v.name.toLowerCase().includes('natural')
    );
    return preferredEnglish || voices[0] || null;
  }

  // ---------------------------------------------------------------------------
  // SÍNTESIS PRINCIPAL: TRANSMITIR TEXTO CON LA VOZ DE THALIOS
  // ---------------------------------------------------------------------------
  public async speak(
    text: string, 
    options: { 
      title?: string; 
      engineOverride?: VoiceEngineType;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): Promise<void> {
    if (!text || !text.trim()) return;

    // Detener cualquier transmisión en curso
    this.stop(false);

    const cleanText = this.sanitizeTextForSpeech(text);
    const title = options.title || 'Oráculo Thalios Solaris // Transmisión Cuántica';
    const engine = options.engineOverride || this.config.engine;

    this.state = {
      isSpeaking: true,
      isPaused: false,
      isLoading: true,
      currentTitle: title,
      currentText: cleanText,
      activeEngine: engine,
      elapsedSeconds: 0,
    };
    this.notifyListeners();

    // Iniciar temporizador de segundos transcurridos
    this.startElapsedTimer();

    try {
      // Sonar chime diegético de acople de radio
      await this.playTransmissionChime('open');
      this.setIntercomStatic(true);

      if (engine === 'gemini-voice') {
        await this.speakWithGemini(cleanText, options);
      } else if (engine === 'kokoro-onnx') {
        await this.speakWithKokoro(cleanText, options);
      } else {
        await this.speakWithWebSpeech(cleanText, options);
      }
    } catch (err) {
      console.error(`Error en síntesis con motor ${engine}:`, err);
      this.stop();
      if (options.onError) options.onError(err);
    }
  }

  // ---------------------------------------------------------------------------
  // MOTOR 1: WEB SPEECH API + DSP DE ESTACIÓN
  // ---------------------------------------------------------------------------
  private speakWithWebSpeech(
    text: string, 
    options: { onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        reject(new Error('SpeechSynthesis no está soportado en este entorno.'));
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const voice = this.getRecommendedSystemVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }

      utterance.rate = Math.max(0.7, Math.min(1.4, this.config.rate));
      utterance.pitch = Math.max(0.6, Math.min(1.4, this.config.pitch));
      utterance.volume = Math.max(0.0, Math.min(1.0, this.config.volume));

      utterance.onstart = () => {
        this.state.isLoading = false;
        this.notifyListeners();
      };

      utterance.onend = async () => {
        this.setIntercomStatic(false);
        await this.playTransmissionChime('close');
        this.stop();
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        this.setIntercomStatic(false);
        this.stop();
        if (options.onError) options.onError(e);
        reject(e);
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // ---------------------------------------------------------------------------
  // MOTOR 2: GEMINI MULTIMODAL AUDIO (CLOUD STUDIO)
  // ---------------------------------------------------------------------------
  public buildGeminiVoicePrompt(textToSpeak: string): string {
    const accent = this.config.geminiAccent || 'castellano';
    const archetype = this.config.geminiArchetype || 'thalios_solaris';
    const emotion = this.config.geminiEmotion || 'solemne';
    const cadence = this.config.geminiCadence || 'pausada';
    const customPrompt = this.config.geminiCustomPrompt?.trim();

    // 1. Directiva de acento
    let accentInstruction = '';
    if (accent === 'castellano') {
      accentInstruction = 'IMPORTANTE: Habla en castellano peninsular de España, con pronunciación cuidada y distinción clara entre la "z/c" y la "s" (fonética peninsular), evitando cualquier acento latinoamericano.';
    } else {
      accentInstruction = 'IMPORTANTE: Habla en español neutro cinematográfico internacional, sereno, claro y articulado.';
    }

    // 2. Directiva de matiz emocional
    let emotionInstruction = '';
    switch (emotion) {
      case 'misterioso': emotionInstruction = 'Tono críptico, misterioso, profundo y susurrante.'; break;
      case 'urgente': emotionInstruction = 'Tono de máxima alerta de puente de mando, perentorio y firme.'; break;
      case 'intimo': emotionInstruction = 'Tono intimista, reflexivo, sereno y cargado de memoria humana.'; break;
      case 'cientifico': emotionInstruction = 'Tono frío, puramente analítico, clínico y neutral.'; break;
      case 'solemne': default: emotionInstruction = 'Tono solemne, oracular, trascendente e imponente.'; break;
    }

    // 3. Directiva de cadencia
    let cadenceInstruction = '';
    switch (cadence) {
      case 'pausada': cadenceInstruction = 'Cadencia lenta y ceremonial, con pausas meditadas y solemnes.'; break;
      case 'dinamica': cadenceInstruction = 'Cadencia fluida, enérgica y continua.'; break;
      case 'normal': default: cadenceInstruction = 'Cadencia natural, equilibrada y articulada.'; break;
    }

    // 4. Si el arquetipo es personalizado y hay texto
    if (archetype === 'personalizado' && customPrompt) {
      return `${customPrompt}\n${accentInstruction}\n\nDi exactamente el siguiente texto sin añadir introducciones ni comentarios adicionales:\n"${textToSpeak}"`;
    }

    const preset = GEMINI_ARCHETYPE_PRESETS[archetype] || GEMINI_ARCHETYPE_PRESETS.thalios_solaris;
    const baseRoleplay = (customPrompt && customPrompt.length > 5) ? customPrompt : preset.prompt;

    const fullDirectives = [baseRoleplay, accentInstruction, emotionInstruction, cadenceInstruction].filter(Boolean).join(' ');

    return `${fullDirectives}\n\nDi exactamente el siguiente texto sin añadir introducciones ni comentarios adicionales:\n"${textToSpeak}"`;
  }

  private async speakWithGemini(
    text: string, 
    options: { onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      throw new Error('No se ha configurado ninguna clave API de Gemini en la Suite.');
    }

    const client = getAiClient();
    if (!client) {
      throw new Error('No se pudo inicializar el cliente de Gemini.');
    }

    // Limpiar markdown, wikilinks de Obsidian y caracteres de formato para una locución pura
    const cleanText = text
      .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1') // [[enlace|alias]] -> alias, [[enlace]] -> enlace
      .replace(/[*_#`~>]/g, '')                          // tokens markdown
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')          // [texto](url) -> texto
      .trim();

    // Limitar texto para TTS de Gemini a un extracto razonable para evitar latencia excesiva
    const truncatedText = cleanText.length > 800 ? cleanText.slice(0, 800) + '...' : cleanText;

    // Seleccionar la voz adecuada según el arquetipo configurado o la voz específica elegida por el usuario
    const archetypeVoice = this.config.geminiArchetype && GEMINI_ARCHETYPE_PRESETS[this.config.geminiArchetype]?.recommendedVoice;
    const voiceToUse = this.config.geminiVoice || archetypeVoice || 'Charon';

    const ttsCandidateModels = [
      'gemini-3.8-flash-tts',
      'gemini-2.5-flash-preview-tts',
      'gemini-3.1-flash-tts-preview',
      'gemini-3.8-flash-lite-tts',
      'gemini-3.8-flash'
    ];

    let base64Audio = '';
    let mimeType = 'audio/wav';
    let lastError: any = null;

    for (const ttsModel of ttsCandidateModels) {
      try {
        const response = await client.models.generateContent({
          model: ttsModel,
          contents: truncatedText,
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voiceToUse
                }
              }
            }
          } as any
        });

        const candidates = response.candidates;
        if (candidates && candidates[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
            if ((part as any).inlineData && (part as any).inlineData.mimeType?.startsWith('audio/')) {
              base64Audio = (part as any).inlineData.data;
              mimeType = (part as any).inlineData.mimeType;
              break;
            }
          }
        }

        if (base64Audio) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        const isNotFound = err?.message?.includes('404') || 
                           err?.message?.includes('not found') || 
                           err?.message?.includes('NOT_FOUND') ||
                           err?.message?.includes('no longer available');
        if (isNotFound) {
          continue;
        }
        break;
      }
    }

    if (!base64Audio) {
      throw new Error(lastError?.message || 'Gemini no devolvió stream de audio. Recurriendo a síntesis local.');
    }

    // Reproducir a través del motor Web Audio con filtro DSP
    await this.playAudioFromBase64(base64Audio, mimeType, options);
  }

  // ---------------------------------------------------------------------------
  // MOTOR 3: KOKORO-82M ONNX (LOCAL NEURONAL REAL CON ACELERACIÓN GPU)
  // ---------------------------------------------------------------------------
  private kokoroInstance: any = null;
  private isKokoroLoading: boolean = false;
  private kokoroDownloadProgress: number = 0;
  private kokoroDevice: 'webgpu' | 'wasm' = 'wasm';
  private kokoroGpuName: string = '';

  public getKokoroProgress(): number {
    return this.kokoroDownloadProgress;
  }

  public isKokoroLoaded(): boolean {
    return !!this.kokoroInstance;
  }

  public isKokoroLoadingModel(): boolean {
    return this.isKokoroLoading;
  }

  public getKokoroDevice(): 'webgpu' | 'wasm' {
    return this.kokoroDevice;
  }

  public getKokoroGpuName(): string {
    return this.kokoroGpuName;
  }

  public async preloadKokoro(): Promise<void> {
    await this.getKokoro();
  }

  public async getKokoro(): Promise<any> {
    if (this.kokoroInstance) return this.kokoroInstance;
    if (this.isKokoroLoading) {
      while (this.isKokoroLoading) {
        await new Promise(r => setTimeout(r, 150));
      }
      if (this.kokoroInstance) return this.kokoroInstance;
    }

    this.isKokoroLoading = true;
    this.kokoroDownloadProgress = 0;
    try {
      const { KokoroTTS } = await import('kokoro-js');
      let loadedInstance: any = null;

      // 1. Intentar primero aceleración por hardware WebGPU en la GPU física (NVIDIA RTX / D3D12 / Vulkan)
      const gpuInfo = await detectWebGpuSupport();
      if (gpuInfo.isAvailable) {
        try {
          const targetDtype = gpuInfo.hasFp16 ? 'fp16' : 'fp32';
          this.kokoroGpuName = gpuInfo.description;
          this.state.currentTitle = `Inicializando Kokoro en GPU (${this.kokoroGpuName.slice(0, 24)})...`;
          this.notifyListeners();
          console.log(`[Thalios Voice] Inicializando Kokoro-82M en GPU con WebGPU [${targetDtype}] en ${this.kokoroGpuName}...`);

          loadedInstance = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
            dtype: targetDtype,
            device: 'webgpu',
            progress_callback: (info: any) => {
              if (info && typeof info.progress === 'number') {
                const pct = Math.round(info.progress * 100);
                this.kokoroDownloadProgress = pct;
                this.state.currentTitle = `Descargando pesos Kokoro GPU (${pct}%)...`;
                this.notifyListeners();
              }
            }
          });
          this.kokoroDevice = 'webgpu';
          console.log('[Thalios Voice] ¡Kokoro-82M cargado con éxito en GPU mediante WebGPU! Aceleración por hardware activa.');
        } catch (gpuError) {
          console.warn('[Thalios Voice] Fallo al iniciar en WebGPU, recurriendo a CPU WASM:', gpuError);
          loadedInstance = null;
        }
      }

      // 2. Si WebGPU no está disponible o falla, recurrir de forma transparente a CPU WASM
      if (!loadedInstance) {
        this.kokoroDevice = 'wasm';
        this.kokoroGpuName = '';
        this.state.currentTitle = `Cargando Kokoro-82M en CPU...`;
        this.notifyListeners();
        console.log('[Thalios Voice] Cargando Kokoro-82M en modo CPU (WASM q8)...');

        loadedInstance = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
          dtype: 'q8',
          device: 'wasm',
          progress_callback: (info: any) => {
            if (info && typeof info.progress === 'number') {
              const pct = Math.round(info.progress * 100);
              this.kokoroDownloadProgress = pct;
              this.state.currentTitle = `Descargando modelo Kokoro CPU (${pct}%)...`;
              this.notifyListeners();
            }
          }
        });
        console.log('[Thalios Voice] Kokoro-82M cargado en CPU (WASM).');
      }

      this.kokoroInstance = loadedInstance;
      this.isKokoroLoading = false;
      this.kokoroDownloadProgress = 100;
      this.notifyListeners();
      return this.kokoroInstance;
    } catch (err) {
      this.isKokoroLoading = false;
      this.kokoroDownloadProgress = 0;
      this.notifyListeners();
      throw err;
    }
  }

  private async speakWithKokoro(
    text: string, 
    options: { onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    try {
      this.state.isLoading = true;
      this.state.currentTitle = 'Sintetizando transmisión con Kokoro-82M...';
      this.notifyListeners();

      const tts = await this.getKokoro();
      const cancelId = ++this.queueCancelToken;

      let voiceKey = this.config.kokoroVoice || 'am_fenrir';
      if (!VALID_KOKORO_VOICE_IDS.has(voiceKey as any)) {
        voiceKey = 'am_fenrir';
      }

      const dialect = this.config.kokoroDialect || 'castellano';

      // 1. Dividir en bloques amplios de hasta 420 caracteres (evitar micro-fragmentos)
      const chunks = splitTextIntoSentences(text, 420);
      if (chunks.length === 0) {
        this.stop();
        if (options.onEnd) options.onEnd();
        return;
      }

      const sampleRate = 24000;
      const audioBuffers: Float32Array[] = [];
      const silenceBetween = new Float32Array(Math.round(sampleRate * 0.12)); // 120ms pausa respiratoria natural

      for (let i = 0; i < chunks.length; i++) {
        if (cancelId !== this.queueCancelToken || !this.state.isSpeaking) {
          return;
        }

        if (chunks.length > 1) {
          this.state.currentTitle = `Generando audio neural (${i + 1}/${chunks.length})...`;
          this.notifyListeners();
        }

        const ipa = spanishToIpa(chunks[i], dialect);
        if (!ipa || !ipa.trim()) continue;

        let audio: any = null;
        try {
          const { input_ids } = tts.tokenizer(ipa, { truncation: true });
          audio = await tts.generate_from_ids(input_ids, {
            voice: voiceKey,
            speed: Math.max(0.7, Math.min(1.3, this.config.rate || 1.0))
          });
        } catch (genErr) {
          console.warn(`[Kokoro-82M] Advertencia con voz ${voiceKey}, reintentando con voz am_fenrir:`, genErr);
          try {
            const { input_ids } = tts.tokenizer(ipa, { truncation: true });
            audio = await tts.generate_from_ids(input_ids, {
              voice: 'am_fenrir',
              speed: Math.max(0.7, Math.min(1.3, this.config.rate || 1.0))
            });
          } catch (retryErr) {
            console.error('[Kokoro-82M] Fallo al generar segmento:', retryErr);
          }
        }

        if (cancelId !== this.queueCancelToken || !this.state.isSpeaking) {
          return;
        }

        if (audio && audio.audio && audio.audio instanceof Float32Array && audio.audio.length > 0) {
          audioBuffers.push(audio.audio);
        }
      }

      if (audioBuffers.length === 0) {
        this.stop();
        if (options.onEnd) options.onEnd();
        return;
      }

      // 2. Unir todos los fragmentos generados en un solo búfer continuo
      // De esta forma se reproduce todo directamente sin parar frase por frase
      let totalLength = 0;
      for (let i = 0; i < audioBuffers.length; i++) {
        totalLength += audioBuffers[i].length;
        if (i < audioBuffers.length - 1) totalLength += silenceBetween.length;
      }

      const unified = new Float32Array(totalLength);
      let offset = 0;
      for (let i = 0; i < audioBuffers.length; i++) {
        unified.set(audioBuffers[i], offset);
        offset += audioBuffers[i].length;
        if (i < audioBuffers.length - 1) {
          unified.set(silenceBetween, offset);
          offset += silenceBetween.length;
        }
      }

      // 3. Reproducir el audio unificado de forma 100% continua a través de la cadena DSP
      await this.playAudioBuffer(unified, sampleRate, options);
    } catch (err: any) {
      console.error('Fallo en síntesis con Kokoro-82M ONNX:', err);
      this.state.isLoading = false;
      this.stop();
      this.notifyListeners();
      if (options.onError) options.onError(err);
      throw err;
    }
  }

  // ---------------------------------------------------------------------------
  // REPRODUCCIÓN DE AUDIO DIRECTO DESDE BUFFER (KOKORO-82M NATIVO WEB AUDIO)
  // ---------------------------------------------------------------------------
  private playAudioBuffer(
    samples: Float32Array,
    sampleRate: number = 24000,
    options: { onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const ctx = this.initAudioContext();
      if (!ctx || !this.biquadFilter) {
        reject(new Error('AudioContext no inicializado'));
        return;
      }

      if (ctx.state === 'suspended') {
        try { await ctx.resume(); } catch {}
      }

      try {
        const audioBuffer = ctx.createBuffer(1, samples.length, sampleRate);
        audioBuffer.getChannelData(0).set(samples);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        this.currentBufferSource = source;

        // Conectar a la cadena DSP de Estación
        source.connect(this.biquadFilter);

        this.state.isLoading = false;
        this.notifyListeners();

        let ended = false;
        source.onended = async () => {
          if (ended) return;
          ended = true;
          this.currentBufferSource = null;
          this.setIntercomStatic(false);
          await this.playTransmissionChime('close');
          this.stop();
          if (options.onEnd) options.onEnd();
          resolve();
        };

        source.start();
      } catch (err) {
        this.setIntercomStatic(false);
        this.stop();
        if (options.onError) options.onError(err);
        reject(err);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // REPRODUCCIÓN DE AUDIO EN FORMATO BLOB (KOKORO-82M FALLBACK)
  // ---------------------------------------------------------------------------
  private playAudioFromBlob(
    blob: Blob,
    options: { onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;

      audio.volume = this.config.volume;
      audio.playbackRate = 1.0;

      const ctx = this.initAudioContext();
      if (ctx && this.biquadFilter) {
        try {
          this.currentSourceNode = ctx.createMediaElementSource(audio);
          this.currentSourceNode.connect(this.biquadFilter);
        } catch {
          // Si ya está conectado o hay restricción, audio.play funcionará normalmente
        }
      }

      audio.onplay = () => {
        this.state.isLoading = false;
        this.notifyListeners();
      };

      audio.onended = async () => {
        URL.revokeObjectURL(audioUrl);
        this.setIntercomStatic(false);
        await this.playTransmissionChime('close');
        this.stop();
        if (options.onEnd) options.onEnd();
        resolve();
      };

      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        this.setIntercomStatic(false);
        this.stop();
        if (options.onError) options.onError(e);
        reject(e);
      };

      audio.play().catch(reject);
    });
  }

  // ---------------------------------------------------------------------------
  // REPRODUCCIÓN DE AUDIO EN BRUTO A TRAVÉS DE LA CADENA DSP
  // ---------------------------------------------------------------------------
  private playAudioFromBase64(
    base64: string, 
    mimeType: string,
    options: { onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    // Si viene en PCM crudo (como audio/L16 o codec=pcm), decodificar a Float32Array
    if (mimeType.includes('pcm') || mimeType.includes('L16')) {
      try {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const int16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
          float32[i] = int16[i] / 32768.0;
        }
        const rateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
        return this.playAudioBuffer(float32, sampleRate, options);
      } catch (pcmErr) {
        console.warn('Error decodificando PCM en bruto, intentando fallback de audio:', pcmErr);
      }
    }

    return new Promise(async (resolve, reject) => {
      const audioUrl = `data:${mimeType};base64,${base64}`;
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;

      audio.volume = this.config.volume;
      audio.playbackRate = this.config.rate;

      const ctx = this.initAudioContext();
      if (ctx) {
        if (ctx.state === 'suspended') {
          try { await ctx.resume(); } catch {}
        }
        if (this.biquadFilter) {
          try {
            this.currentSourceNode = ctx.createMediaElementSource(audio);
            this.currentSourceNode.connect(this.biquadFilter);
          } catch {
            // Si ya está conectado o hay restricción, audio.play funcionará normalmente
          }
        }
      }

      audio.onplay = () => {
        this.state.isLoading = false;
        this.notifyListeners();
      };

      audio.onended = async () => {
        this.setIntercomStatic(false);
        await this.playTransmissionChime('close');
        this.stop();
        if (options.onEnd) options.onEnd();
        resolve();
      };

      audio.onerror = (e) => {
        this.setIntercomStatic(false);
        this.stop();
        if (options.onError) options.onError(e);
        reject(e);
      };

      audio.play().catch(reject);
    });
  }

  // ---------------------------------------------------------------------------
  // CONTROLES DE REPRODUCCIÓN: PAUSA, REANUDACIÓN, DETENCIÓN
  // ---------------------------------------------------------------------------
  public pause(): void {
    if (!this.state.isSpeaking || this.state.isPaused) return;

    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
    } else if (this.currentBufferSource && this.audioCtx) {
      this.audioCtx.suspend().catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }

    this.state.isPaused = true;
    this.stopElapsedTimer();
    this.notifyListeners();
  }

  public resume(): void {
    if (!this.state.isSpeaking || !this.state.isPaused) return;

    if (this.currentAudioElement) {
      this.currentAudioElement.play().catch(() => {});
    } else if (this.currentBufferSource && this.audioCtx) {
      this.audioCtx.resume().catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }

    this.state.isPaused = false;
    this.startElapsedTimer();
    this.notifyListeners();
  }

  public stop(notify: boolean = true): void {
    this.stopElapsedTimer();
    this.setIntercomStatic(false);
    this.queueCancelToken++;

    if (this.scheduledBufferSources && this.scheduledBufferSources.length > 0) {
      for (const src of this.scheduledBufferSources) {
        try {
          src.onended = null;
          src.stop();
          src.disconnect();
        } catch {}
      }
      this.scheduledBufferSources = [];
    }

    if (this.currentBufferSource) {
      try {
        this.currentBufferSource.onended = null;
        this.currentBufferSource.stop();
        this.currentBufferSource.disconnect();
      } catch {}
      this.currentBufferSource = null;
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {}
      this.currentAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.currentUtterance = null;
    }

    this.state = {
      isSpeaking: false,
      isPaused: false,
      isLoading: false,
      currentTitle: '',
      currentText: '',
      activeEngine: this.config.engine,
      elapsedSeconds: 0,
    };

    if (notify) {
      this.notifyListeners();
    }
  }

  public togglePlayPause(): void {
    if (!this.state.isSpeaking) return;
    if (this.state.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  // ---------------------------------------------------------------------------
  // ANÁLISIS DE FRECUENCIAS EN TIEMPO REAL (PARA EL OSCILOSCOPIO HOLOGRÁFICO)
  // ---------------------------------------------------------------------------
  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // ---------------------------------------------------------------------------
  // AYUDANTES Y SUSCRIPCIONES
  // ---------------------------------------------------------------------------
  public getState(): ThaliosVoiceState {
    return { ...this.state };
  }

  public subscribe(listener: (state: ThaliosVoiceState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach(fn => fn(currentState));
  }

  private startElapsedTimer(): void {
    this.stopElapsedTimer();
    this.elapsedTimer = window.setInterval(() => {
      if (this.state.isSpeaking && !this.state.isPaused) {
        this.state.elapsedSeconds += 1;
        this.notifyListeners();
      }
    }, 1000);
  }

  private stopElapsedTimer(): void {
    if (this.elapsedTimer !== null) {
      clearInterval(this.elapsedTimer);
      this.elapsedTimer = null;
    }
  }

  /**
   * Limpia formato Markdown, enlaces [[...]] y símbolos técnicos para lectura fluida
   */
  public sanitizeTextForSpeech(text: string): string {
    return text
      // Eliminar bloques de código ```...```
      .replace(/```[\s\S]*?```/g, ' Código de estación omitido. ')
      // Eliminar formato de wikilinks [[Texto|Alias]] o [[Texto]]
      .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1')
      // Eliminar enlaces markdown [texto](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Eliminar encabezados # ## ###
      .replace(/^#{1,6}\s+/gm, '')
      // Eliminar asteriscos de negrita/cursiva
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      // Eliminar guiones de listas
      .replace(/^\s*[-*+]\s+/gm, '')
      // Eliminar caracteres especiales
      .replace(/[~`<>_]/g, ' ')
      // Sustituir pausas ceremoniales Veyvān por pausas de lectura
      .replace(/·/g, ', ')
      .replace(/\/\//g, ', ')
      // Normalizar espacios
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export const thaliosVoice = new ThaliosVoiceService();
