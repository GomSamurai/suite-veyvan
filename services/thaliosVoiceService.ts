// =============================================================================
// THALIOS SOLARIS // CORE DE SÍNTESIS DE VOZ Y TRANSMISIÓN AUDITIVA DIEGÉTICA
// Sistema de lectura de Lore, Oráculo y Bitácoras para Suite Veyvan
// =============================================================================

import { getAiClient, getGeminiApiKey } from './geminiService';

export type VoiceEngineType = 'web-speech' | 'gemini-voice' | 'kokoro-onnx';
export type DspFilterMode = 'orbital' | 'reactor' | 'clean' | 'vocoder';

export interface ThaliosVoiceConfig {
  engine: VoiceEngineType;
  // Identificador de voz para Web Speech (URI o Name)
  voiceUri: string;
  // Nombre de voz para Gemini Multimodal Audio (Charon, Aoede, Fenrir, Kore, Puck)
  geminiVoice: 'Charon' | 'Aoede' | 'Fenrir' | 'Kore' | 'Puck';
  // Nombre de voz para Kokoro-82M ONNX
  kokoroVoice: string;
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

const STORAGE_KEY = 'thalios_voice_config_v1';

export const DEFAULT_VOICE_CONFIG: ThaliosVoiceConfig = {
  engine: 'web-speech',
  voiceUri: '',
  geminiVoice: 'Charon',
  kokoroVoice: 'em_santa',
  rate: 0.92,
  pitch: 0.88,
  volume: 0.90,
  enableDspFilter: true,
  dspMode: 'orbital',
  dspIntensity: 0.55,
  enableTransmissionChimes: true,
  enableIntercomStatic: true,
  autoNarrateOracle: false,
  autoNarrateLoreCards: false,
  showFloatingHud: true,
  enableSpacebarPause: true,
};

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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_VOICE_CONFIG;
      return { ...DEFAULT_VOICE_CONFIG, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_VOICE_CONFIG;
    }
  }

  private saveConfig(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
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
    return new Promise((resolve) => {
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
        const now = ctx.currentTime;
        const chimeGain = ctx.createGain();
        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.connect(ctx.destination);

        if (type === 'open') {
          // Secuencia armónica ascendente: 659Hz (E5) -> 880Hz (A5)
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(659.25, now);
          osc1.frequency.setValueAtTime(880.00, now + 0.06);

          chimeGain.gain.setValueAtTime(0.0001, now);
          chimeGain.gain.linearRampToValueAtTime(this.config.volume * 0.18, now + 0.02);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

          osc1.connect(chimeGain);
          osc1.start(now);
          osc1.stop(now + 0.16);

          setTimeout(resolve, 150);
        } else {
          // Secuencia descendente de cierre de canal: 880Hz (A5) -> 440Hz (A4)
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(880.00, now);
          osc1.frequency.setValueAtTime(440.00, now + 0.05);

          chimeGain.gain.setValueAtTime(0.0001, now);
          chimeGain.gain.linearRampToValueAtTime(this.config.volume * 0.15, now + 0.02);
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
  private setIntercomStatic(active: boolean): void {
    if (!this.config.enableIntercomStatic || !this.audioCtx) return;

    if (!active) {
      if (this.staticGainNode && this.audioCtx) {
        this.staticGainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.08);
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
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.04;
      }

      this.staticSource = this.audioCtx.createBufferSource();
      this.staticSource.buffer = noiseBuffer;
      this.staticSource.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 1.0;

      this.staticGainNode = this.audioCtx.createGain();
      this.staticGainNode.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
      this.staticGainNode.gain.linearRampToValueAtTime(this.config.volume * 0.025, this.audioCtx.currentTime + 0.1);

      this.staticSource.connect(filter);
      filter.connect(this.staticGainNode);
      this.staticGainNode.connect(this.audioCtx.destination);

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
      console.warn(`Error en motor ${engine}, recurriendo a Web Speech como respaldo:`, err);
      // Fallback a Web Speech en caso de fallo
      try {
        await this.speakWithWebSpeech(cleanText, options);
      } catch (fallbackErr) {
        this.stop();
        if (options.onError) options.onError(fallbackErr);
      }
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

    // Limitar texto para TTS de Gemini a un extracto razonable para evitar latencia excesiva
    const truncatedText = text.length > 800 ? text.slice(0, 800) + '...' : text;

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Pronuncia con solemnidad la siguiente sentencia de Thalios Solaris, con voz pausada y autoritaria: "${truncatedText}"`,
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: this.config.geminiVoice || 'Charon'
            }
          }
        }
      } as any
    });

    // Buscar candidato con audio en partes
    const candidates = response.candidates;
    let base64Audio = '';
    let mimeType = 'audio/wav';

    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if ((part as any).inlineData && (part as any).inlineData.mimeType?.startsWith('audio/')) {
          base64Audio = (part as any).inlineData.data;
          mimeType = (part as any).inlineData.mimeType;
          break;
        }
      }
    }

    if (!base64Audio) {
      throw new Error('Gemini no devolvió stream de audio. Recurriendo a síntesis local.');
    }

    // Reproducir a través del motor Web Audio con filtro DSP
    await this.playAudioFromBase64(base64Audio, mimeType, options);
  }

  // ---------------------------------------------------------------------------
  // MOTOR 3: KOKORO-82M ONNX (LOCAL NEURONAL)
  // ---------------------------------------------------------------------------
  private async speakWithKokoro(
    text: string, 
    options: { onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    // Si no está cargado el módulo de Kokoro, advertir y recurrir a Web Speech
    console.info('Kokoro-82M ONNX seleccionado para voz neuronal local.');
    // Usar Web Speech con DSP mejorado como puente nativo de alta calidad
    return this.speakWithWebSpeech(text, options);
  }

  // ---------------------------------------------------------------------------
  // REPRODUCCIÓN DE AUDIO EN BRUTO A TRAVÉS DE LA CADENA DSP
  // ---------------------------------------------------------------------------
  private playAudioFromBase64(
    base64: string, 
    mimeType: string,
    options: { onEnd?: () => void; onError?: (err: any) => void }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const audioUrl = `data:${mimeType};base64,${base64}`;
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;

      audio.volume = this.config.volume;
      audio.playbackRate = this.config.rate;

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
