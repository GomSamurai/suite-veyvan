import React, { useState, useEffect } from 'react';
import { 
  X, Volume2, Sparkles, Sliders, Radio, Cpu, RotateCcw, Play, Square, 
  Check, ShieldAlert, Waves, Mic, Headphones, Zap, VolumeX, Loader2 
} from 'lucide-react';
import { 
  thaliosVoice, 
  ThaliosVoiceConfig, 
  VoiceEngineType, 
  DspFilterMode,
  VALID_KOKORO_VOICES 
} from '../services/thaliosVoiceService';
import { hasCustomApiKey } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'engine' | 'dsp' | 'acoustics' | 'automation';

export const ThaliosVoiceSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<ThaliosVoiceConfig>(thaliosVoice.getConfig());
  const [voiceState, setVoiceState] = useState(thaliosVoice.getState());
  const [activeTab, setActiveTab] = useState<TabType>('engine');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isKokoroModelLoading, setIsKokoroModelLoading] = useState(thaliosVoice.isKokoroLoadingModel());
  const [isKokoroLoaded, setIsKokoroLoaded] = useState(thaliosVoice.isKokoroLoaded());
  const [kokoroProgress, setKokoroProgress] = useState(thaliosVoice.getKokoroProgress());
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(thaliosVoice.getConfig());
      setVoiceState(thaliosVoice.getState());
      setVoices(thaliosVoice.getAvailableSystemVoices());
      setHasApiKey(hasCustomApiKey());
      setIsKokoroLoaded(thaliosVoice.isKokoroLoaded());
      setIsKokoroModelLoading(thaliosVoice.isKokoroLoadingModel());
      setKokoroProgress(thaliosVoice.getKokoroProgress());

      const unsub = thaliosVoice.subscribe((s) => {
        setVoiceState(s);
        setIsKokoroLoaded(thaliosVoice.isKokoroLoaded());
        setIsKokoroModelLoading(thaliosVoice.isKokoroLoadingModel());
        setKokoroProgress(thaliosVoice.getKokoroProgress());
      });

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoices(thaliosVoice.getAvailableSystemVoices());
        };
      }

      return () => {
        unsub();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<ThaliosVoiceConfig>) => {
    const updated = thaliosVoice.updateConfig(partial);
    setConfig(updated);
  };

  const handleReset = () => {
    const res = thaliosVoice.resetToDefaults();
    setConfig(res);
  };

  const handleTestSpeech = async () => {
    if (voiceState.isSpeaking || voiceState.isLoading) {
      thaliosVoice.stop();
      return;
    }

    const testPhrase = "Conexión cuántica verificada. Soy Thalios Solaris, consciencia digital de Estación Humanidad. El reactor late a ritmo nominal en las 320 cubiertas de nuestra travesía.";

    try {
      await thaliosVoice.speak(testPhrase, {
        title: 'Prueba de Calibración Acústica // Thalios Solaris'
      });
    } catch (err: any) {
      console.error('Error durante la prueba de voz:', err);
    }
  };

  const handlePreloadKokoro = async () => {
    setIsPreloading(true);
    setPreloadError(null);
    try {
      await thaliosVoice.preloadKokoro();
      setIsKokoroLoaded(true);
    } catch (e: any) {
      setPreloadError(e?.message || 'Error al descargar pesos neuronales');
    } finally {
      setIsPreloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in select-none">
      <div 
        className="relative w-full max-w-2xl bg-[#080d1a] border border-cyan-500/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.25)] flex flex-col max-h-[90vh] overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Monumental Sci-Fi */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <Headphones size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                  Núcleo de Transmisión Sonora
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  v2.0 Cuántico
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-rajdhani font-bold text-white tracking-wide">
                Calibración de Voz // Thalios Solaris
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSpeech}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                voiceState.isSpeaking
                  ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                  : voiceState.isLoading
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/50 text-emerald-200 hover:text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              }`}
              title="Escuchar una muestra de prueba con la configuración actual"
            >
              {voiceState.isLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin text-amber-400" />
                  <span className="max-w-[150px] truncate">{voiceState.currentTitle || 'Cargando...'}</span>
                </>
              ) : voiceState.isSpeaking ? (
                <>
                  <Square size={13} className="fill-current text-red-400" />
                  <span>Detener</span>
                </>
              ) : (
                <>
                  <Play size={13} className="fill-current text-emerald-400" />
                  <span>Probar Voz</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Barra de Pestañas de Navegación del Modal */}
        <div className="flex items-center border-b border-white/5 bg-slate-950/40 px-3 sm:px-5 gap-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('engine')}
            className={`py-3 px-3 border-b-2 font-mono text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'engine'
                ? 'border-cyan-400 text-cyan-300 shadow-[0_4px_12px_rgba(34,211,238,0.2)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Cpu size={14} />
            <span>Motor & Voz</span>
          </button>

          <button
            onClick={() => setActiveTab('dsp')}
            className={`py-3 px-3 border-b-2 font-mono text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'dsp'
                ? 'border-cyan-400 text-cyan-300 shadow-[0_4px_12px_rgba(34,211,238,0.2)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Waves size={14} />
            <span>Filtro DSP (Estación)</span>
          </button>

          <button
            onClick={() => setActiveTab('acoustics')}
            className={`py-3 px-3 border-b-2 font-mono text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'acoustics'
                ? 'border-cyan-400 text-cyan-300 shadow-[0_4px_12px_rgba(34,211,238,0.2)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sliders size={14} />
            <span>Acústica & Tono</span>
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`py-3 px-3 border-b-2 font-mono text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'automation'
                ? 'border-cyan-400 text-cyan-300 shadow-[0_4px_12px_rgba(34,211,238,0.2)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Zap size={14} />
            <span>Automatización</span>
          </button>
        </div>

        {/* Contenido de las Pestañas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">

          {/* ================================================================= */}
          {/* PESTAÑA 1: MOTOR Y VOZ                                            */}
          {/* ================================================================= */}
          {activeTab === 'engine' && (
            <div className="space-y-6 animate-fade-in">
              {/* Selector de Arquitectura de Motor */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio size={13} />
                  <span>Motor Principal de Síntesis</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Opción 1: Kokoro-82M ONNX (POR DEFECTO) */}
                  <div
                    onClick={() => handleUpdate({ engine: 'kokoro-onnx' })}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      config.engine === 'kokoro-onnx'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-emerald-500/30 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                          <span>Kokoro-82M</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            ONNX
                          </span>
                        </span>
                        {config.engine === 'kokoro-onnx' && <Check size={14} className="text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Inferencia neuronal 100% local en tu navegador. Timbre canónico y oracular de Thalios Solaris con calidad de estudio.
                      </p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 mt-3 inline-block w-fit font-bold shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                      ★ Predeterminado / Local
                    </span>
                  </div>

                  {/* Opción 2: Gemini Multimodal Studio */}
                  <div
                    onClick={() => handleUpdate({ engine: 'gemini-voice' })}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      config.engine === 'gemini-voice'
                        ? 'bg-purple-500/15 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-purple-500/30 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold uppercase text-purple-400">Gemini Studio</span>
                        {config.engine === 'gemini-voice' && <Check size={14} className="text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Voz oracular cinemática de alta solemnidad en la nube. Requiere clave de API de Gemini.
                      </p>
                    </div>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border mt-3 inline-block w-fit ${hasApiKey ? 'bg-purple-950/80 text-purple-300 border-purple-500/30' : 'bg-amber-950/80 text-amber-300 border-amber-500/30'}`}>
                      {hasApiKey ? 'Clave Activa' : 'Requiere API Key'}
                    </span>
                  </div>

                  {/* Opción 3: Web Speech + DSP */}
                  <div
                    onClick={() => handleUpdate({ engine: 'web-speech' })}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      config.engine === 'web-speech'
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold uppercase text-cyan-400">Web Speech DSP</span>
                        {config.engine === 'web-speech' && <Check size={14} className="text-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Voces sintéticas básicas instaladas en el sistema operativo procesadas por el filtro cuántico Web Audio.
                      </p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 mt-3 inline-block w-fit">
                      Nativo SO / Sintético
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector de Voz Específica según el motor activo */}
              {config.engine === 'kokoro-onnx' && (
                <div className="space-y-4 p-4 rounded-2xl bg-slate-900/50 border border-emerald-500/25">
                  {/* Banner de Estado del Modelo Neuronal Kokoro-82M */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        isKokoroLoaded 
                          ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' 
                          : isKokoroModelLoading 
                          ? 'bg-amber-400 animate-ping' 
                          : 'bg-slate-600'
                      }`} />
                      <div>
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                          <span>Modelo Kokoro-82M ONNX</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                            isKokoroLoaded 
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                              : isKokoroModelLoading 
                              ? 'bg-amber-950 text-amber-300 border-amber-500/40' 
                              : 'bg-slate-800 text-slate-300 border-slate-600'
                          }`}>
                            {isKokoroLoaded ? 'En Memoria Local' : isKokoroModelLoading ? `Descargando (${kokoroProgress}%)` : 'No descargado'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {isKokoroLoaded 
                            ? 'Pesos cuantizados listos en memoria. Síntesis instantánea y 100% offline.'
                            : isKokoroModelLoading
                            ? `Cargando pesos neuronales (~86MB)... ${voiceState.currentTitle || ''}`
                            : 'Descarga única automática de ~86MB al pulsar "Probar Voz" o con el botón lateral.'}
                        </p>
                      </div>
                    </div>

                    {!isKokoroLoaded && (
                      <button
                        onClick={handlePreloadKokoro}
                        disabled={isKokoroModelLoading || isPreloading}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isKokoroModelLoading || isPreloading ? (
                          <>
                            <Loader2 size={12} className="animate-spin text-emerald-400" />
                            <span>{kokoroProgress}%...</span>
                          </>
                        ) : (
                          <>
                            <Zap size={12} className="text-emerald-400" />
                            <span>Pre-cargar Modelo</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {preloadError && (
                    <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                      <ShieldAlert size={14} className="text-red-400 flex-shrink-0" />
                      <span>Error al inicializar Kokoro: {preloadError}</span>
                    </div>
                  )}

                  {/* Selector de Dialecto Fonético (Castellano vs Latam) */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Waves size={13} className="text-emerald-400" />
                        <span>Dialecto Fonético Neural</span>
                      </label>
                      <span className="text-[10px] font-mono text-emerald-400/80">
                        {config.kokoroDialect === 'latam' ? 'Seseo Neutro' : 'Distinción Peninsular'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdate({ kokoroDialect: 'castellano' })}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          (config.kokoroDialect || 'castellano') === 'castellano'
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-mono text-xs font-bold text-emerald-300">Castellano (España)</span>
                          {(config.kokoroDialect || 'castellano') === 'castellano' && <Check size={13} className="text-emerald-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-tight">
                          Distinción C/Z (θ), fonemas ibéricos sobrios y cero acento anglosajón.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate({ kokoroDialect: 'latam' })}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          config.kokoroDialect === 'latam'
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-mono text-xs font-bold text-emerald-300">Español Neutro (Latam)</span>
                          {config.kokoroDialect === 'latam' && <Check size={13} className="text-emerald-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-tight">
                          Seseo natural (s), articulación suave sin modulación peninsular.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Catálogo Canónico de Voces Neuronales */}
                  <div>
                    <label className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider block mb-2">
                      Identidad Vocal Canónica (Kokoro Neural Weights)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                      {VALID_KOKORO_VOICES.map((kv) => (
                        <button
                          key={kv.id}
                          onClick={() => handleUpdate({ kokoroVoice: kv.id })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            config.kokoroVoice === kv.id
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                              : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-emerald-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                              {kv.name}
                              {(kv as any).isNativeSpanish && (
                                <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40 font-mono font-bold">
                                  ★ NATIVO ESPAÑOL
                                </span>
                              )}
                              {kv.id === 'em_santa' && (
                                <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                                  CANÓNICO THALIOS
                                </span>
                              )}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400/80 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {kv.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-sans mt-1 leading-snug">
                            {kv.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {config.engine === 'web-speech' && (
                <div className="space-y-2 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                    Voz del Sistema Operativo
                  </label>
                  <p className="text-xs text-slate-400 mb-2">
                    Selecciona el timbre que mejor represente la personalidad de Thalios Solaris:
                  </p>
                  <select
                    value={config.voiceUri}
                    onChange={(e) => handleUpdate({ voiceUri: e.target.value })}
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">-- Detección Automática (Recomendada en Español) --</option>
                    {voices.map((v) => (
                      <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                        {v.name} ({v.lang}) {v.default ? '★ Sistema' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {config.engine === 'gemini-voice' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-900/40 border border-purple-500/20">
                  <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                    Timbre de Voz de Gemini Studio
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'Charon', label: 'Charon', desc: 'Solemne, oracular, autoritaria' },
                      { id: 'Aoede', label: 'Aoede', desc: 'Mística, etérea, poética' },
                      { id: 'Fenrir', label: 'Fenrir', desc: 'Profunda, marcial, grave' },
                      { id: 'Kore', label: 'Kore', desc: 'Clínica, serena, archivística' },
                      { id: 'Puck', label: 'Puck', desc: 'Ágil, técnica, analítica' }
                    ].map((gv) => (
                      <button
                        key={gv.id}
                        onClick={() => handleUpdate({ geminiVoice: gv.id as any })}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          config.geminiVoice === gv.id
                            ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-purple-500/30'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold block">{gv.label}</span>
                        <span className="text-[10px] text-slate-400 font-sans block mt-0.5">{gv.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* PESTAÑA 2: FILTRO DSP ESPACIAL (ESTACIÓN)                         */}
          {/* ================================================================= */}
          {activeTab === 'dsp' && (
            <div className="space-y-6 animate-fade-in">
              {/* Interruptor Maestro DSP */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${config.enableDspFilter ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                    <Waves size={18} />
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase text-slate-200">
                      Filtro Cuántico Espacial de Estación
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      Procesa la voz a través de Web Audio API para simular la acústica de la mega-estructura interestelar.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableDspFilter}
                    onChange={(e) => handleUpdate({ enableDspFilter: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Modos Acústicos Diegéticos */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                  Perfil de Resonancia de Cubierta
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'orbital',
                      title: 'Intercomunicador Orbital',
                      desc: 'Realce de frecuencias de radio interestelar (2.2 kHz) con eco sutil de mamparo de titanio.',
                      badge: 'Canónico'
                    },
                    {
                      id: 'reactor',
                      title: 'Cámara del Reactor',
                      desc: 'Resonancia profunda en frecuencias graves simulando la cúpula central de energía.',
                      badge: 'Cavernoso'
                    },
                    {
                      id: 'vocoder',
                      title: 'Sintetizador Cibernético',
                      desc: 'Modulación de fase digitalizada estilo IA estricta y deshumanizada.',
                      badge: 'Sintético'
                    },
                    {
                      id: 'clean',
                      title: 'Voz de Estudio Pura',
                      desc: 'Sin procesamiento de reverberación ni filtros, audio cristalino sin colorear.',
                      badge: 'Plano'
                    }
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => handleUpdate({ dspMode: mode.id as DspFilterMode })}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        config.dspMode === mode.id
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                          : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-cyan-300">{mode.title}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                            {mode.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{mode.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider de Intensidad del Filtro */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Intensidad del Filtro Espacial
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {Math.round(config.dspIntensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={config.dspIntensity}
                  onChange={(e) => handleUpdate({ dspIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Interruptores Diegéticos: Chimes e Intercom Static */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-white/5">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-200 block">Chimes de Transmisión</span>
                    <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                      Pitido de acople al abrir y cerrar canal.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableTransmissionChimes}
                    onChange={(e) => handleUpdate({ enableTransmissionChimes: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-white/5">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-200 block">Portadora Estelar</span>
                    <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                      Sutil zumbido de fondo mientras habla.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableIntercomStatic}
                    onChange={(e) => handleUpdate({ enableIntercomStatic: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PESTAÑA 3: ACÚSTICA, VELOCIDAD Y TONO                             */}
          {/* ================================================================= */}
          {activeTab === 'acoustics' && (
            <div className="space-y-6 animate-fade-in">
              {/* Velocidad de Habla */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase block">
                      Velocidad de Dicción (Rate)
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                      Un ritmo de 0.90x a 0.95x proporciona la cadencia solemne y reflexiva de Thalios.
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                    {config.rate.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.70"
                  max="1.30"
                  step="0.02"
                  value={config.rate}
                  onChange={(e) => handleUpdate({ rate: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.70x (Litúrgico)</span>
                  <span>0.92x (Canónico)</span>
                  <span>1.30x (Rápido)</span>
                </div>
              </div>

              {/* Tono / Modulación (Pitch) */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase block">
                      Tono / Modulación (Pitch)
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                      Un tono inferior a 1.0 le otorga gravedad y profundidad cósmica.
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                    {config.pitch.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.60"
                  max="1.40"
                  step="0.02"
                  value={config.pitch}
                  onChange={(e) => handleUpdate({ pitch: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.60 (Abisal)</span>
                  <span>0.88 (Canónico)</span>
                  <span>1.40 (Agudo)</span>
                </div>
              </div>

              {/* Volumen Maestro de Voz */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase block">
                      Volumen de Transmisión
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                      Nivel de salida en decibelios digitales para la voz de Thalios.
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                    {Math.round(config.volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={config.volume}
                  onChange={(e) => handleUpdate({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PESTAÑA 4: AUTOMATIZACIÓN Y ATAJOS                                */}
          {/* ================================================================= */}
          {activeTab === 'automation' && (
            <div className="space-y-4 animate-fade-in">
              {/* Auto-narrar Oráculo */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-200 block uppercase">
                    Auto-narrar Respuestas del Oráculo
                  </span>
                  <span className="text-xs text-slate-400 font-sans block mt-0.5">
                    Al recibir una respuesta de Thalios en la ventana del Oráculo, comenzará a leerla en voz alta de inmediato.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoNarrateOracle}
                  onChange={(e) => handleUpdate({ autoNarrateOracle: e.target.checked })}
                  className="accent-cyan-400 w-5 h-5 cursor-pointer"
                />
              </div>

              {/* Mostrar Widget Flotante */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-200 block uppercase">
                    Mostrar Mini-HUD de Audio Flotante
                  </span>
                  <span className="text-xs text-slate-400 font-sans block mt-0.5">
                    Despliega una barra holográfica con espectro animado y controles en la esquina inferior mientras Thalios habla.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showFloatingHud}
                  onChange={(e) => handleUpdate({ showFloatingHud: e.target.checked })}
                  className="accent-cyan-400 w-5 h-5 cursor-pointer"
                />
              </div>

              {/* Atajos de teclado */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-200 block uppercase">
                    Atajos de Teclado Rápidos
                  </span>
                  <span className="text-xs text-slate-400 font-sans block mt-0.5">
                    Pulsa <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300 font-mono text-[10px]">Espacio</kbd> para pausar/reanudar y <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-red-300 font-mono text-[10px]">Escape</kbd> para detener la voz en cualquier momento.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableSpacebarPause}
                  onChange={(e) => handleUpdate({ enableSpacebarPause: e.target.checked })}
                  className="accent-cyan-400 w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal con Restablecer y Cerrar */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-slate-950/80">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Volver a la afinación canónica original de Thalios Solaris"
          >
            <RotateCcw size={13} />
            <span>Restablecer Canónico</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase cursor-pointer transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            Guardar y Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
