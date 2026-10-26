import React, { useState, useEffect } from 'react';
import { 
  X, Volume2, Sparkles, Sliders, Radio, Cpu, RotateCcw, Play, Square, 
  Check, ShieldAlert, Waves, Mic, Headphones, Zap, VolumeX, Loader2,
  Key, Eye, EyeOff, ExternalLink, AlertCircle, CheckCircle2, RefreshCw
} from 'lucide-react';
import { 
  thaliosVoice, 
  ThaliosVoiceConfig, 
  VoiceEngineType, 
  DspFilterMode,
  VALID_KOKORO_VOICES,
  GEMINI_ARCHETYPE_PRESETS,
  GeminiArchetype,
  GeminiEmotion,
  GeminiCadence,
  GeminiAccent,
  detectWebGpuSupport 
} from '../services/thaliosVoiceService';
import { 
  hasCustomApiKey, 
  getGeminiApiKey, 
  setGeminiApiKey, 
  clearCustomApiKey, 
  testGeminiConnection, 
  ConnectionTestResult 
} from '../services/geminiService';

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
  const [inputApiKey, setInputApiKey] = useState<string>(getGeminiApiKey());
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [keyTestResult, setKeyTestResult] = useState<ConnectionTestResult | null>(null);
  const [keySavedFeedback, setKeySavedFeedback] = useState<boolean>(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [isKokoroModelLoading, setIsKokoroModelLoading] = useState(thaliosVoice.isKokoroLoadingModel());
  const [isKokoroLoaded, setIsKokoroLoaded] = useState(thaliosVoice.isKokoroLoaded());
  const [kokoroProgress, setKokoroProgress] = useState(thaliosVoice.getKokoroProgress());
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState<string | null>(null);
  const [gpuHardwareInfo, setGpuHardwareInfo] = useState<{ isAvailable: boolean; description: string; hasFp16: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(thaliosVoice.getConfig());
      setVoiceState(thaliosVoice.getState());
      setVoices(thaliosVoice.getAvailableSystemVoices());
      setInputApiKey(getGeminiApiKey());
      setHasApiKey(hasCustomApiKey());
      setTestError(null);
      setKeyTestResult(null);
      setIsKokoroLoaded(thaliosVoice.isKokoroLoaded());
      setIsKokoroModelLoading(thaliosVoice.isKokoroLoadingModel());
      setKokoroProgress(thaliosVoice.getKokoroProgress());

      detectWebGpuSupport().then(info => {
        setGpuHardwareInfo(info);
      });

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

  const handleSaveApiKey = () => {
    if (inputApiKey.trim()) {
      setGeminiApiKey(inputApiKey.trim());
      setHasApiKey(true);
      setKeySavedFeedback(true);
      setTimeout(() => setKeySavedFeedback(false), 3000);
      handleTestGeminiKey(inputApiKey.trim());
    }
  };

  const handleClearApiKey = () => {
    clearCustomApiKey();
    setInputApiKey('');
    setHasApiKey(false);
    setKeyTestResult(null);
  };

  const handleTestGeminiKey = async (keyOverride?: string) => {
    const keyToTest = keyOverride || inputApiKey;
    if (!keyToTest || keyToTest.trim().length < 5) {
      setKeyTestResult({
        success: false,
        message: 'Introduce una clave de API válida para probar conexión.'
      });
      return;
    }
    setIsTestingKey(true);
    setKeyTestResult(null);
    try {
      const res = await testGeminiConnection(keyToTest.trim());
      setKeyTestResult(res);
      if (res.success) {
        setHasApiKey(true);
      }
    } catch (err: any) {
      setKeyTestResult({
        success: false,
        message: err?.message || 'Error al conectar con los servidores de Google AI',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleTestSpeech = async () => {
    if (voiceState.isSpeaking || voiceState.isLoading) {
      thaliosVoice.stop();
      return;
    }
    setTestError(null);

    const testPhrase = "Conexión cuántica verificada. Soy Thalios Solaris, consciencia digital de Estación Humanidad. El reactor late a ritmo nominal en las 320 cubiertas de nuestra travesía.";

    try {
      await thaliosVoice.speak(testPhrase, {
        title: 'Prueba de Calibración Acústica // Thalios Solaris'
      });
    } catch (err: any) {
      console.error('Error durante la prueba de voz:', err);
      setTestError(err?.message || 'Error durante la síntesis de voz.');
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

          {/* Banner de Error en Prueba / Síntesis si ocurre */}
          {testError && (
            <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 flex items-start justify-between gap-3 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
                    Aviso de Calibración de Voz
                  </div>
                  <p className="text-xs text-red-200/90 font-sans mt-0.5">
                    {testError}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setTestError(null)}
                className="p-1 rounded-lg text-red-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

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
                  {/* Opción 1: Web Speech + DSP (RECOMENDADO / INSTANTÁNEO) */}
                  <div
                    onClick={() => handleUpdate({ engine: 'web-speech' })}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      config.engine === 'web-speech'
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                          <span>Web Speech DSP</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                            Instantáneo
                          </span>
                        </span>
                        {config.engine === 'web-speech' && <Check size={14} className="text-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Respuesta instantánea (0 ms) sin esperas de cálculo. Habla directamente de forma continua con las voces nativas del sistema procesadas por el filtro cuántico.
                      </p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 mt-3 inline-block w-fit font-bold shadow-[0_0_8px_rgba(34,211,238,0.25)]">
                      ★ Recomendado / Cero Esperas
                    </span>
                  </div>

                  {/* Opción 2: Kokoro-82M ONNX (LOCAL NEURAL CON ACELERACIÓN GPU) */}
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
                            {gpuHardwareInfo?.isAvailable ? '⚡ GPU WebGPU' : 'ONNX Neural'}
                          </span>
                        </span>
                        {config.engine === 'kokoro-onnx' && <Check size={14} className="text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Inferencia neuronal local asistida por GPU (WebGPU / DirectX 12). Timbre oracular de estudio (Santa Castellano / Alex / Dora).
                      </p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 mt-3 inline-block w-fit font-bold shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                      {gpuHardwareInfo?.isAvailable ? '★ Aceleración por GPU Activa' : 'Calidad Estudio / Local'}
                    </span>
                  </div>

                  {/* Opción 3: Gemini Multimodal Studio */}
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
                </div>
              </div>

              {/* Selector de Voz Específica según el motor activo */}
              {config.engine === 'kokoro-onnx' && (
                <div className="space-y-4 p-4 rounded-2xl bg-slate-900/50 border border-emerald-500/25">
                  {/* Banner de Diagnóstico de Hardware GPU */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 flex-shrink-0">
                        <Cpu size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                          <span>Acelerador Hardware:</span>
                          <span className="text-emerald-300">
                            {gpuHardwareInfo?.isAvailable 
                              ? gpuHardwareInfo.description 
                              : 'CPU WebAssembly'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {gpuHardwareInfo?.isAvailable
                            ? `Inferencia en núcleos de cómputo de tarjeta gráfica física con WebGPU (${gpuHardwareInfo.hasFp16 ? 'FP16' : 'FP32'}). Generación ultra-rápida.`
                            : 'Navegador sin acceso directo a WebGPU; el modelo se ejecutará en CPU (WASM) como respaldo seguro.'}
                        </p>
                      </div>
                    </div>
                    {gpuHardwareInfo?.isAvailable && (
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-400/50 uppercase tracking-wider font-bold flex-shrink-0">
                        GPU Activa
                      </span>
                    )}
                  </div>

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
                            {isKokoroLoaded 
                              ? (gpuHardwareInfo?.isAvailable ? 'Listo en GPU (VRAM)' : 'Listo en CPU') 
                              : isKokoroModelLoading 
                              ? `Descargando (${kokoroProgress}%)` 
                              : 'No descargado'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {isKokoroLoaded 
                            ? 'Pesos neuronales cargados y listos. Síntesis continua sin esperas y 100% offline.'
                            : isKokoroModelLoading
                            ? `Cargando pesos neuronales... ${voiceState.currentTitle || ''}`
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
                              {kv.id === 'am_fenrir' && (
                                <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                                  CANÓNICO THALIOS
                                </span>
                              )}
                              {kv.id === 'am_santa' && (
                                <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-mono font-bold">
                                  ANCIANO SABIO
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
                <div className="space-y-4">
                  {/* Tarjeta de Gestión de API Key */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    hasApiKey 
                      ? 'bg-purple-950/30 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                      : 'bg-amber-950/30 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Key size={16} className={hasApiKey ? 'text-purple-400' : 'text-amber-400'} />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                          Clave de API de Gemini Studio
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold flex items-center gap-1 ${
                        hasApiKey 
                          ? 'bg-purple-950 text-purple-300 border-purple-500/40' 
                          : 'bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse'
                      }`}>
                        {hasApiKey ? (
                          <>
                            <CheckCircle2 size={11} className="text-emerald-400" />
                            <span>Clave Activa</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={11} className="text-amber-400" />
                            <span>Requiere Clave</span>
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-3">
                      Para la síntesis oracular cinemática de Google Gemini en la nube, introduce tu clave de API gratuita de <span className="text-purple-300 font-medium">Google AI Studio</span> (incluye hasta 1.500 lecturas diarias a 0 €).
                    </p>

                    <div className="space-y-2.5">
                      <div className="relative flex items-center">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={inputApiKey}
                          onChange={(e) => setInputApiKey(e.target.value)}
                          placeholder="Pega aquí tu API Key (AIzaSy...)"
                          className="w-full bg-slate-950/90 border border-purple-500/40 focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-purple-200 placeholder:text-slate-600 focus:outline-none pr-12 shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-2 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                          title={showApiKey ? 'Ocultar clave' : 'Mostrar clave'}
                        >
                          {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSaveApiKey}
                            disabled={!inputApiKey.trim() || isTestingKey}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all disabled:opacity-40 cursor-pointer"
                          >
                            <Check size={13} />
                            <span>{keySavedFeedback ? '¡Guardada!' : 'Guardar Clave'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTestGeminiKey()}
                            disabled={!inputApiKey.trim() || isTestingKey}
                            className="px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-950/60 hover:bg-purple-900/40 text-purple-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                          >
                            {isTestingKey ? (
                              <>
                                <Loader2 size={13} className="animate-spin text-purple-400" />
                                <span>Verificando...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw size={13} className="text-purple-400" />
                                <span>Probar Conexión</span>
                              </>
                            )}
                          </button>

                          {hasApiKey && (
                            <button
                              type="button"
                              onClick={handleClearApiKey}
                              className="px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all cursor-pointer"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>

                        <a
                          href="https://aistudio.google.com/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline flex items-center gap-1 transition-colors"
                        >
                          <span>Obtener clave gratis en AI Studio</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>

                      {/* Resultado de la prueba de conexión */}
                      {keyTestResult && (
                        <div className={`mt-2 p-2.5 rounded-xl text-xs font-mono flex items-start gap-2 border ${
                          keyTestResult.success 
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                            : 'bg-red-950/60 border-red-500/40 text-red-300'
                        }`}>
                          {keyTestResult.success ? (
                            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <ShieldAlert size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 leading-relaxed">
                            <span className="font-bold">{keyTestResult.success ? 'Conexión Exitosa:' : 'Fallo de Enlace:'} </span>
                            <span>{keyTestResult.message}</span>
                            {keyTestResult.latencyMs && (
                              <span className="opacity-80 block text-[10px] mt-0.5">
                                Latencia de respuesta: {keyTestResult.latencyMs} ms
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1. Selector de Acento y Dicción */}
                  <div className="space-y-2 p-4 rounded-2xl bg-slate-900/40 border border-purple-500/20">
                    <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                      Acento y Dicción Regional
                    </label>
                    <p className="text-[11px] text-slate-400 font-sans mb-2">
                      Fuerza al modelo multimodal a pronunciar con fonética de España o internacional:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdate({ geminiAccent: 'castellano' })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          config.geminiAccent === 'castellano'
                            ? 'bg-purple-600/25 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                            <span>🇪🇸 Castellano de España</span>
                            <span className="text-[8px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">
                              RECOMENDADO
                            </span>
                          </span>
                          {config.geminiAccent === 'castellano' && <Check size={14} className="text-purple-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-tight">
                          Distinción clara entre 'z/c' y 's' (fonética peninsular sobria sin modulación latina).
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate({ geminiAccent: 'latam' })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          config.geminiAccent === 'latam'
                            ? 'bg-purple-600/25 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-white">
                            🌎 Español Neutro Internacional
                          </span>
                          {config.geminiAccent === 'latam' && <Check size={14} className="text-purple-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-tight">
                          Seseo cinematográfico internacional neutro y templado.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* 2. Arquetipos Vocales de Estación */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900/40 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                          Arquetipo de Interpretación Vocal
                        </label>
                        <p className="text-[11px] text-slate-400 font-sans">
                          Configura la edad, género y personalidad dramática que interpretará la I.A.:
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {(Object.keys(GEMINI_ARCHETYPE_PRESETS) as GeminiArchetype[]).map((archKey) => {
                        const preset = GEMINI_ARCHETYPE_PRESETS[archKey];
                        const isSelected = (config.geminiArchetype || 'thalios_solaris') === archKey;
                        return (
                          <button
                            key={archKey}
                            type="button"
                            onClick={() => {
                              handleUpdate({
                                geminiArchetype: archKey,
                                geminiVoice: preset.recommendedVoice,
                                geminiCustomPrompt: preset.prompt
                              });
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-purple-600/25 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                                : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-purple-500/30'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{preset.icon}</span>
                                  <span>{preset.name}</span>
                                </span>
                                {isSelected && <Check size={13} className="text-purple-400" />}
                              </div>
                              <p className="text-[10px] text-slate-400 font-sans leading-tight mt-1">
                                {preset.desc}
                              </p>
                            </div>
                            <span className="text-[9px] font-mono text-purple-400/80 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30 self-start mt-2">
                              Timbre: {preset.recommendedVoice}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Timbre Base de Síntesis */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900/40 border border-purple-500/20">
                    <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                      Timbre Base Acústico de Google Gemini
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'Charon', label: 'Charon', desc: 'Masculino grave, solemne, deidad' },
                        { id: 'Fenrir', label: 'Fenrir', desc: 'Masculino maduro / anciano / marcial' },
                        { id: 'Aoede', label: 'Aoede', desc: 'Femenino oracular, poética, mística' },
                        { id: 'Kore', label: 'Kore', desc: 'Femenino suave, clínico, sereno' },
                        { id: 'Puck', label: 'Puck', desc: 'Masculino ágil, técnico, analítico' }
                      ].map((gv) => (
                        <button
                          key={gv.id}
                          type="button"
                          onClick={() => handleUpdate({ geminiVoice: gv.id as any })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            config.geminiVoice === gv.id
                              ? 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                              : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-purple-500/30'
                          }`}
                        >
                          <span className="font-mono text-xs font-bold block">{gv.label}</span>
                          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">{gv.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Matiz Emocional y Cadencia */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-purple-500/20 space-y-2">
                      <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                        Matiz Emocional
                      </label>
                      <select
                        value={config.geminiEmotion || 'solemne'}
                        onChange={(e) => handleUpdate({ geminiEmotion: e.target.value as GeminiEmotion })}
                        className="w-full bg-slate-950 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-400 cursor-pointer"
                      >
                        <option value="solemne">Solemne, oracular y trascendente</option>
                        <option value="misterioso">Misterioso, susurrante y críptico</option>
                        <option value="urgente">Alerta militar perentoria y tajante</option>
                        <option value="intimo">Íntimo, reflexivo y nostálgico</option>
                        <option value="cientifico">Clínico, analítico y neutral</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-purple-500/20 space-y-2">
                      <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                        Cadencia y Ritmo
                      </label>
                      <select
                        value={config.geminiCadence || 'pausada'}
                        onChange={(e) => handleUpdate({ geminiCadence: e.target.value as GeminiCadence })}
                        className="w-full bg-slate-950 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-400 cursor-pointer"
                      >
                        <option value="pausada">Pausada y ceremonial (con pausas marcadas)</option>
                        <option value="normal">Normal, equilibrada y articulada</option>
                        <option value="dinamica">Dinámica, continua y fluida</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Prompt de Dirección de Voz Personalizable */}
                  <div className="space-y-2 p-4 rounded-2xl bg-slate-900/40 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                        Prompt de Dirección Escénica y Actuación Vocal
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentArch = config.geminiArchetype || 'thalios_solaris';
                          const preset = GEMINI_ARCHETYPE_PRESETS[currentArch];
                          handleUpdate({ geminiCustomPrompt: preset?.prompt || '' });
                        }}
                        className="text-[10px] font-mono text-purple-400 hover:text-purple-300 underline cursor-pointer"
                      >
                        Restaurar prompt del arquetipo
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans mb-1.5 leading-snug">
                      Instrucción exacta enviada a Gemini para dirigir su edad, tono, acento y emoción. Puedes escribir tus propias directrices:
                    </p>
                    <textarea
                      rows={3}
                      value={config.geminiCustomPrompt !== undefined ? config.geminiCustomPrompt : (GEMINI_ARCHETYPE_PRESETS[config.geminiArchetype || 'thalios_solaris']?.prompt || '')}
                      onChange={(e) => handleUpdate({ geminiCustomPrompt: e.target.value })}
                      placeholder="Escribe aquí las instrucciones de cómo debe actuar la voz de Gemini..."
                      className="w-full bg-slate-950 border border-purple-500/30 focus:border-purple-400 rounded-xl p-3 text-xs font-mono text-purple-200 placeholder:text-slate-600 focus:outline-none custom-scrollbar leading-relaxed"
                    />
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
