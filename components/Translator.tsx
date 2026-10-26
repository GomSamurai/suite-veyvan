import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Volume2, PenTool, Copy, Check, BookOpen, Feather, 
  MessageSquare, HelpCircle, Key, RefreshCw, Send, ArrowRightLeft, 
  Shield, Compass, Sparkle, Flame, Terminal, Lightbulb, CheckCircle2,
  Eye, EyeOff, Activity, AlertTriangle, RotateCcw, Zap, Scroll, Layers,
  ArrowDown, ArrowRight, ChevronRight, Info, Hash, Square
} from 'lucide-react';
import { thaliosVoice } from '../services/thaliosVoiceService';
import { TranslationResult, MorphemeToken } from '../types';
import { 
  translateSpanishToTransversal, 
  translateTransversalToSpanish, 
  consultVeyvanOracle,
  CANONICAL_PROVERBS,
  ROOT_MAP
} from '../services/translationEngine';
import { initialData } from '../data/initialData';
import { parseTaelimExpression, GlyphUnit } from '../utils/taelimParser';
import { TAELIM_MORPHEMES } from '../data/taelimRules';
import { 
  getGeminiApiKey, 
  setGeminiApiKey, 
  clearCustomApiKey, 
  hasCustomApiKey,
  getGeminiModel, 
  setGeminiModel, 
  CURATED_MODELS, 
  testGeminiConnection, 
  ConnectionTestResult 
} from '../services/geminiService';
import { useLexicon } from '../context/LexiconContext';
import { playWordResonance } from '../utils/taelimAudio';
import { CANONICAL_DOCUMENTS_SYNCED } from '../data/canonicalLoreConstruccion';
import MiniTaelim from './MiniTaelim';

type ConsultantMode = 'compose' | 'interpret' | 'oracle';

const SUGGESTED_SPARKS = [
  {
    label: "Cuidado con el frenesí del amor",
    query: "Cuidado con el frenesí del amor, pues a menudo lleva a la falta de respeto.",
    mode: 'compose' as const
  },
  {
    label: "Mucha coraza, poco aliento",
    query: "Mucha coraza, poco aliento; personas duras por fuera pero vacías en su interior.",
    mode: 'compose' as const
  },
  {
    label: "La fricción precede a la evolución",
    query: "La fricción antecede a la evolución; ningún alma despierta sin el dolor del abismo.",
    mode: 'compose' as const
  },
  {
    label: "Resistencia de la penuria",
    query: "En el silencio de la penuria, las almas sencillas hallaron la profunda unión que nace de sufrir juntos.",
    mode: 'compose' as const
  },
  {
    label: "Alquimia del perdón",
    query: "La comunidad unida comprende que soltar el rencor engendra la verdadera calma tras la tormenta del ego.",
    mode: 'compose' as const
  },
  {
    label: "Meditación del aliento",
    query: "En la breve pausa de la respiración habita la eternidad; el alma se abre en quietud receptiva.",
    mode: 'compose' as const
  },
  {
    label: "Juramento Dun'Val'Thy",
    query: "Dun'Val'Thy",
    mode: 'interpret' as const
  },
  {
    label: "Sin dulzura en el ruido",
    query: "Nis'Rha ·· Nu-Miel",
    mode: 'interpret' as const
  }
];

const ORACLE_QUESTIONS = [
  "¿Cómo distinguiría un sabio Veyvān entre el amor posesivo y la comunión sagrada?",
  "¿Por qué el Transversal coloca siempre el verbo antes que al sujeto?",
  "¿Qué raíz expresa mejor el anhelo del sol ausente tras 344 años de viaje?",
  "¿Cómo formularía un habitante de las cubiertas polares el juramento de sobrevivir?"
];

const Translator: React.FC = () => {
  const [mode, setMode] = useState<ConsultantMode>('compose');
  const [inputText, setInputText] = useState('Cuidado con el frenesí del amor, pues a menudo lleva a la falta de respeto.');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [oracleAnswer, setOracleAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Dynamic Calligraphy & Synthesis Views
  const [expressionView, setExpressionView] = useState<'canonical' | 'compact'>('canonical');
  const [calligraphyView, setCalligraphyView] = useState<'composition' | 'breakdown'>('composition');
  const [calligraphyOrientation, setCalligraphyOrientation] = useState<'algante' | 'comun'>('algante');
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [playingUnitIndex, setPlayingUnitIndex] = useState<number | null>(null);

  // Active expression derived state
  const isCompact = expressionView === 'compact' && Boolean(result?.compactTransversal);
  const activeTransversal = isCompact 
    ? (result?.compactTransversal || result?.transversalText || '') 
    : (result?.transversalText || '');
  const activePoetic = isCompact 
    ? (result?.compactPoetic || result?.poeticSpanish) 
    : result?.poeticSpanish;
  const activeLiteral = isCompact 
    ? (result?.compactLiteral || result?.literalSpanish) 
    : result?.literalSpanish;
  const activeTokens = isCompact 
    ? (result?.compactTokens || result?.tokens) 
    : result?.tokens;

  // Parsed Tael'im structure for the active expression
  const parsedTaelim = useMemo(() => {
    if (!activeTransversal) return { units: [], arcs: [], isMultiUnit: false };
    return parseTaelimExpression(activeTransversal);
  }, [activeTransversal]);

  const currentUnits = parsedTaelim.units;
  const safeUnitIndex = Math.min(selectedUnitIndex, Math.max(0, currentUnits.length - 1));
  const selectedUnit: GlyphUnit | null = currentUnits[safeUnitIndex] || null;

  // Dictionary lookup for selected radical in breakdown view
  const selectedTerm = useMemo(() => {
    if (!selectedUnit) return null;
    const clean = selectedUnit.cleanRoot.toLowerCase();
    const orig = selectedUnit.rootText.toLowerCase();
    return ROOT_MAP.get(clean) || ROOT_MAP.get(orig) || initialData.find(t => t.root.toLowerCase() === clean || t.root.toLowerCase() === orig) || null;
  }, [selectedUnit]);

  // Key configuration & Quantum Link diagnostic modal state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showCorpusModal, setShowCorpusModal] = useState(false);
  const [customKey, setCustomKey] = useState(() => {
    return typeof window !== 'undefined' 
      ? localStorage.getItem('gemini_api_key') || getGeminiApiKey()
      : getGeminiApiKey();
  });
  const [selectedModel, setSelectedModel] = useState<string>(() => getGeminiModel());
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const { traceInTaelim, setActiveTab, forgeCalligram } = useLexicon();

  // Gestión de voz de Thalios Solaris para respuestas del oráculo
  const [isSpeakingOracle, setIsSpeakingOracle] = useState(false);

  useEffect(() => {
    const unsub = thaliosVoice.subscribe((s) => {
      if (!s.isSpeaking && !s.isPaused) {
        setIsSpeakingOracle(false);
      }
    });
    return () => unsub();
  }, []);

  const handleToggleSpeakOracleAnswer = () => {
    if (!oracleAnswer) return;
    if (isSpeakingOracle && thaliosVoice.getState().isSpeaking) {
      thaliosVoice.stop();
      setIsSpeakingOracle(false);
      return;
    }
    setIsSpeakingOracle(true);
    thaliosVoice.speak(oracleAnswer, {
      title: 'Consultor Lingüístico Veyvān // Thalios Solaris',
      onEnd: () => setIsSpeakingOracle(false),
      onError: () => setIsSpeakingOracle(false)
    });
  };

  const handleConsult = async (overrideText?: string, overrideMode?: ConsultantMode) => {
    const textToProcess = overrideText !== undefined ? overrideText : inputText;
    const activeMode = overrideMode || mode;
    if (!textToProcess.trim()) return;

    setIsLoading(true);
    setResult(null);
    setOracleAnswer(null);
    setSelectedUnitIndex(0);

    try {
      if (activeMode === 'compose') {
        const res = await translateSpanishToTransversal(textToProcess);
        setResult(res);
        setSelectedUnitIndex(0);
      } else if (activeMode === 'interpret') {
        const res = await translateTransversalToSpanish(textToProcess);
        setResult(res);
        setSelectedUnitIndex(0);
      } else {
        const ans = await consultVeyvanOracle(textToProcess);
        setOracleAnswer(ans);
      }
    } catch (err) {
      console.error("Consultation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSparkClick = (spark: typeof SUGGESTED_SPARKS[0]) => {
    setMode(spark.mode);
    setInputText(spark.query);
    handleConsult(spark.query, spark.mode);
  };

  const handleOracleQuestionClick = (q: string) => {
    setMode('oracle');
    setInputText(q);
    handleConsult(q, 'oracle');
  };

  const handleCopy = (customText?: string) => {
    const textToCopy = customText || (mode === 'compose' ? activeTransversal : (activePoetic || ''));
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaySound = (customText?: string) => {
    const textToPlay = customText || activeTransversal;
    if (!textToPlay || isPlayingAudio) return;
    setIsPlayingAudio(true);
    const words = textToPlay.replace(/[···,]/g, ' ').split(/\s+/).filter(Boolean);
    let delay = 0;
    words.forEach(w => {
      setTimeout(() => playWordResonance(w), delay);
      delay += 380;
    });
    setTimeout(() => setIsPlayingAudio(false), delay + 400);
  };

  const handlePlayUnitSound = (unit: GlyphUnit, idx: number) => {
    setPlayingUnitIndex(idx);
    playWordResonance(unit.cleanRoot || unit.rootText);
    setTimeout(() => setPlayingUnitIndex(null), 1000);
  };

  const handleTraceSentence = (customText?: string) => {
    const textToTrace = customText || activeTransversal;
    if (!textToTrace) return;
    traceInTaelim(textToTrace);
  };

  const handleTraceUnit = (unit: GlyphUnit) => {
    traceInTaelim(unit.originalText || unit.cleanRoot);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiConnection(customKey, selectedModel);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Error inesperado durante la verificación de enlace.',
        modelUsed: selectedModel,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveApiKey = () => {
    setGeminiApiKey(customKey.trim());
    setGeminiModel(selectedModel);
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleResetToSystemKey = () => {
    clearCustomApiKey();
    setCustomKey('');
    setSelectedModel('gemini-2.5-flash');
    setGeminiModel('gemini-2.5-flash');
    setTestResult(null);
  };

  const getTokenBadgeClass = (type: MorphemeToken['type']) => {
    switch (type) {
      case 'root': return 'bg-cyan-950/70 text-cyan-200 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]';
      case 'time': return 'bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      case 'evidence': return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(168,85,247,0.15)]';
      case 'aspect': return 'bg-purple-950/70 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.15)]';
      case 'particle': return 'bg-blue-950/70 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.15)]';
      case 'pronoun': return 'bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.15)]';
      case 'plural': return 'bg-teal-950/70 text-teal-300 border-teal-500/50 shadow-[0_0_10px_rgba(20,184,166,0.15)]';
      default: return 'bg-slate-900/80 text-slate-300 border-slate-700';
    }
  };

  const activeApiKey = getGeminiApiKey();
  const isAiConnected = Boolean(activeApiKey && activeApiKey.length > 10);
  const isCustomKeyActive = hasCustomApiKey();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-7 animate-fade-in pb-16">
      
      {/* HUD Header with Veyvān Consultation Persona */}
      <div className="border border-white/10 bg-gradient-to-b from-black/60 via-slate-950/40 to-black/60 backdrop-blur-2xl rounded-2xl p-6 md:p-7 relative overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 p-4 flex items-center gap-2 opacity-50">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] text-cyan-400 font-mono tracking-[0.25em] uppercase font-bold flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400 animate-spin-slow" />
                CONSULTOR LINGÜÍSTICO VEYVĀN // THALIOS SOLARIS
              </span>
              <button
                onClick={() => setShowCorpusModal(true)}
                className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                title="Ver los 6 documentos de construcción canónicos sincronizados"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Bóveda Construcción Sincronizada (6 Documentos)</span>
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-rajdhani uppercase tracking-wider text-slate-100 flex items-center gap-3">
              Traductor & Oráculo Veyvān
            </h1>
            <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed">
              Composición concisa, bella y musical guiada por las Leyes del Tratado de Joren Thalvus, la Matriz de 24 Fonemas y el Glosario Maestro de Estación Humanidad.
            </p>
          </div>

          {/* AI Status & Key Configuration Button */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              id="btn-open-key-modal"
              type="button"
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-xs font-mono group cursor-pointer ${
                isAiConnected 
                  ? 'border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 text-cyan-200 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]' 
                  : 'border-white/10 hover:border-cyan-500/40 bg-white/5 text-slate-300 hover:text-cyan-200'
              }`}
              title="Configurar Clave de IA y Modelo Cuántico"
            >
              <div className="relative flex items-center justify-center">
                <Key size={15} className={isAiConnected ? "text-cyan-400 group-hover:scale-110 transition-transform" : "text-amber-400"} />
                {isAiConnected && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold font-rajdhani uppercase tracking-wider text-slate-100">
                    {isCustomKeyActive ? "Clave Personalizada" : "Enlace Cuántico"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <span className="text-[9px] text-cyan-300 font-mono tracking-wide">
                  {getGeminiModel()}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Interactive Mode Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              setMode('compose');
              if (mode === 'interpret') setInputText('Cuidado con el frenesí del amor, pues a menudo lleva a la falta de respeto.');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-rajdhani uppercase tracking-wider font-bold transition-all ${
              mode === 'compose'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                : 'bg-white/5 text-slate-400 hover:text-cyan-200 hover:bg-white/10 border border-white/5'
            }`}
          >
            <Feather size={14} />
            <span>Componer en Transversal (Español ➔ Vehlaen)</span>
          </button>

          <button
            onClick={() => {
              setMode('interpret');
              if (mode === 'compose') setInputText("Thima · Varin'Vim ·· Vor'aen · Nu-Dar");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-rajdhani uppercase tracking-wider font-bold transition-all ${
              mode === 'interpret'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                : 'bg-white/5 text-slate-400 hover:text-cyan-200 hover:bg-white/10 border border-white/5'
            }`}
          >
            <BookOpen size={14} />
            <span>Interpretar Enunciación (Vehlaen ➔ Español)</span>
          </button>

          <button
            onClick={() => {
              setMode('oracle');
              setInputText("¿Cómo distinguiría un sabio Veyvān entre el amor posesivo y la comunión sagrada?");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-rajdhani uppercase tracking-wider font-bold transition-all ${
              mode === 'oracle'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                : 'bg-white/5 text-slate-400 hover:text-cyan-200 hover:bg-white/10 border border-white/5'
            }`}
          >
            <MessageSquare size={14} />
            <span>Consultar al Oráculo Veyvān (Preguntas Abiertas)</span>
          </button>
        </div>

        {/* Preset Sparks */}
        <div className="mt-4 pt-3 flex flex-wrap items-center gap-2">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono flex items-center gap-1 mr-1">
            <Lightbulb size={10} className="text-amber-400" /> Semillas de Inspiración:
          </span>
          {mode !== 'oracle' ? (
            SUGGESTED_SPARKS.map((spark, idx) => (
              <button
                key={idx}
                onClick={() => handleSparkClick(spark)}
                className="text-[10px] font-mono px-3 py-1 rounded-lg border border-white/5 bg-black/40 text-slate-400 hover:text-cyan-200 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all whitespace-nowrap"
              >
                {spark.label}
              </button>
            ))
          ) : (
            ORACLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleOracleQuestionClick(q)}
                className="text-[10px] font-mono px-3 py-1 rounded-lg border border-white/5 bg-black/40 text-slate-400 hover:text-cyan-200 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all truncate max-w-xs"
                title={q}
              >
                {q}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Input Box Console */}
      <div className="border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl p-5 md:p-6 space-y-4 shadow-inner relative">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-rajdhani tracking-widest text-cyan-300 font-bold flex items-center gap-2">
            <Terminal size={14} className="text-cyan-400" />
            {mode === 'compose' && '¿Qué concepto, emoción o estado del ser deseas traducir?'}
            {mode === 'interpret' && 'Enunciación o expresión en dialecto Transversal (Vehlaen):'}
            {mode === 'oracle' && 'Pregunta o consulta ontológica para Thalios Solaris:'}
          </label>
          <span className="text-[10px] font-mono text-slate-500">{inputText.length} caracteres</span>
        </div>

        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleConsult();
            }
          }}
          placeholder={
            mode === 'compose'
              ? 'Escribe una frase, proverbio, mandato o reflexión emocional en español (Ej: "Cuidado con el frenesí del amor, pues a menudo lleva a la falta de respeto")...'
              : mode === 'interpret'
              ? "Introduce una expresión en Vehlaen (Ej: Thima · Varin'Vim ·· Vor'aen · Nu-Dar o Dun'Val'Thy)..."
              : "Formula cualquier consulta sobre la gramática, raíces o historia del Transversal..."
          }
          rows={3}
          className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-slate-100 placeholder-slate-600 outline-none focus:border-cyan-500/50 text-base font-rajdhani tracking-wide transition-all resize-none shadow-inner"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Ctrl + Enter</kbd> para consultar al Oráculo
          </span>

          <button
            onClick={() => handleConsult()}
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-slate-950 font-bold font-rajdhani uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_25px_rgba(34,211,238,0.35)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Canalizando el Aliento...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>
                  {mode === 'compose' && 'Componer Enunciación'}
                  {mode === 'interpret' && 'Interpretar con Oráculo'}
                  {mode === 'oracle' && 'Transmitir al Oráculo'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Oracle Response View (For Open Questions) */}
      {oracleAnswer && (
        <div className="border border-cyan-500/30 bg-black/60 backdrop-blur-2xl rounded-2xl p-6 md:p-8 space-y-5 shadow-[0_10px_50px_rgba(8,145,178,0.2)] animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold font-rajdhani uppercase tracking-wider text-cyan-200">
                Respuesta del Oráculo Thalios Solaris
              </h3>
            </div>
            <button
              onClick={handleToggleSpeakOracleAnswer}
              className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSpeakingOracle
                  ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/40 text-cyan-200 hover:text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]'
              }`}
              title={isSpeakingOracle ? "Detener voz" : "Escuchar respuesta de Thalios Solaris"}
            >
              {isSpeakingOracle ? (
                <>
                  <Square size={11} className="fill-current text-red-400" />
                  <span>Detener</span>
                </>
              ) : (
                <>
                  <Volume2 size={12} className="text-cyan-400" />
                  <span>Escuchar Veredicto</span>
                </>
              )}
            </button>
          </div>
          <div className="prose prose-invert max-w-none text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
            {oracleAnswer}
          </div>
        </div>
      )}

      {/* Translation & Composition Result Card */}
      {result && (
        <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-2xl rounded-2xl p-6 md:p-8 space-y-7 shadow-[0_15px_60px_rgba(8,145,178,0.25)] animate-fade-in relative">
          
          {/* Top Result Actions & Mode Switcher Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-mono bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/30">
                {result.syntaxOrder}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                Casta: {result.sociolect.toUpperCase()}
              </span>
            </div>

            {/* Mode Selector: Canónica vs Síntesis Aforística (Máxima Brevedad) */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950/90 border border-white/10 shadow-inner">
              <button
                onClick={() => setExpressionView('canonical')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rajdhani uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  expressionView === 'canonical'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scroll size={13} className="text-cyan-400" />
                <span>Canónica Resonante</span>
              </button>
              <button
                onClick={() => setExpressionView('compact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rajdhani uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  expressionView === 'compact'
                    ? 'bg-gradient-to-r from-amber-500/25 to-cyan-500/25 text-amber-200 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
                title="Directiva Sagrada de Brevedad: máxima condensación conceptual y sonora"
              >
                <Zap size={13} className="text-amber-400 animate-pulse" />
                <span>Síntesis Aforística</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono tracking-widest">
                  MÁX. BREVEDAD
                </span>
              </button>
            </div>

            {/* Action buttons for active expression */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlaySound()}
                className={`p-2.5 rounded-xl border border-white/10 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 bg-white/5 transition-all cursor-pointer ${isPlayingAudio ? 'animate-pulse text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : ''}`}
                title={`Escuchar Cadencia del Aliento (${expressionView === 'compact' ? 'Síntesis Aforística' : 'Canónica'})`}
              >
                <Volume2 size={16} />
              </button>
              <button
                onClick={() => handleTraceSentence()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-500/30 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 transition-all text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(34,211,238,0.15)] cursor-pointer"
                title="Cargar la expresión activa en el Lienzo Tael'im"
              >
                <PenTool size={13} />
                <span>Trazar en Tael'im</span>
              </button>
              <button
                onClick={() => handleCopy()}
                className="p-2.5 rounded-xl border border-white/10 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 bg-white/5 transition-all cursor-pointer"
                title="Copiar Enunciación activa"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Main Transversal Expression Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-1.5">
                <Sparkle size={12} className={isCompact ? "text-amber-400" : "text-cyan-400"} />
                {isCompact 
                  ? 'Fórmula de Máxima Síntesis Aforística (Regla de Brevedad & Belleza Veyvān):' 
                  : 'Enunciación Canónica Formal en Dialecto Transversal (Vehlaen):'}
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {currentUnits.length} {currentUnits.length === 1 ? 'radical' : 'radicales/matrices'} enlazados
              </span>
            </div>

            <div className={`p-6 md:p-7 rounded-2xl bg-black/80 border transition-all shadow-inner relative overflow-hidden ${
              isCompact 
                ? 'border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)]' 
                : 'border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.15)]'
            }`}>
              <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
                <span className="text-5xl font-mono select-none font-bold">
                  {isCompact ? 'Σ' : 'Ω'}
                </span>
              </div>
              <p className={`text-2xl sm:text-3xl md:text-5xl font-bold font-rajdhani tracking-[0.16em] leading-tight ${
                isCompact 
                  ? 'text-amber-100 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]' 
                  : 'text-cyan-100 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]'
              }`}>
                {activeTransversal}
              </p>
            </div>

            {/* Quick-switch pill for comparing Canonical vs Synthesis */}
            {result.compactTransversal && (
              <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                isCompact 
                  ? 'bg-cyan-950/20 border-cyan-500/25' 
                  : 'bg-amber-950/20 border-amber-500/25 hover:border-amber-500/40'
              }`}>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isCompact 
                      ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300' 
                      : 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                  }`}>
                    <Zap size={11} className={isCompact ? "text-cyan-400" : "text-amber-400"} />
                    {isCompact ? 'Versión Canónica Completa:' : 'Síntesis Aforística (Máxima Brevedad):'}
                  </span>
                  <span className="text-sm font-bold font-rajdhani text-slate-100 tracking-wider">
                    {isCompact ? result.transversalText : result.compactTransversal}
                  </span>
                  <span className="text-xs text-slate-400 italic font-sans hidden md:inline">
                    — {isCompact ? result.poeticSpanish : result.compactPoetic}
                  </span>
                </div>
                <button
                  onClick={() => setExpressionView(isCompact ? 'canonical' : 'compact')}
                  className={`text-[10px] font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isCompact
                      ? 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-400/30'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-400/30'
                  }`}
                >
                  {isCompact ? 'Ver Canónica Completa ➔' : 'Ver Síntesis Aforística ➔'}
                </button>
              </div>
            )}
          </div>

          {/* DYNAMIC TAEL'IM CALLIGRAPHY SUITE (ESTELA & DESGLOSE INDIVIDUAL) */}
          <div className="border border-white/10 bg-black/60 backdrop-blur-xl rounded-2xl p-5 md:p-6 space-y-5 shadow-inner">
            {/* Suite Header with Dynamic Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                  <PenTool size={13} className="text-cyan-400" />
                  VISOR CALIGRÁFICO TAEL'IM // SISTEMA SAGRADO
                </span>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  {calligraphyView === 'composition' 
                    ? `Composición completa de la expresión (${currentUnits.length} matrices enlazadas)` 
                    : `Inspección morfológica y sigilo individual (${safeUnitIndex + 1} de ${currentUnits.length})`}
                </p>
              </div>

              {/* View Switchers: Composición Completa vs Desglose por Radicales */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-white/10">
                  <button
                    onClick={() => setCalligraphyView('composition')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      calligraphyView === 'composition'
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers size={12} />
                    <span>Composición Completa</span>
                  </button>
                  <button
                    onClick={() => setCalligraphyView('breakdown')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      calligraphyView === 'breakdown'
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen size={12} />
                    <span>Por Radicales ({currentUnits.length})</span>
                  </button>
                </div>

                {/* If in composition view: allow toggling Algante (vertical stela) vs Comun (horizontal stream) */}
                {calligraphyView === 'composition' && (
                  <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-white/10">
                    <button
                      onClick={() => setCalligraphyOrientation('algante')}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        calligraphyOrientation === 'algante'
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Estela Algante (Descenso Vertical Ceremonial)"
                    >
                      Estela Vertical
                    </button>
                    <button
                      onClick={() => setCalligraphyOrientation('comun')}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        calligraphyOrientation === 'comun'
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Flujo Común (Secuencia Horizontal)"
                    >
                      Flujo Horizontal
                    </button>
                  </div>
                )}

                {/* Launch full Tael'im studio button */}
                <button
                  onClick={() => handleTraceSentence()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                  title="Abrir en Estudio Tael'im completo"
                >
                  <PenTool size={12} />
                  <span>Estudio</span>
                </button>

                {/* Forjar Caligrama Sagrado (Tael'vohn) */}
                <button
                  onClick={() => forgeCalligram(activeTransversal)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 to-amber-900/40 hover:from-amber-900/80 hover:to-amber-800/60 text-amber-300 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)] font-bold"
                  title="Forjar Caligrama Sagrado y Sigilo del Rhea"
                >
                  <Sparkles size={13} className="text-amber-400 animate-pulse" />
                  <span>Forjar Caligrama</span>
                </button>
              </div>
            </div>

            {/* VIEW CONTENT */}
            {calligraphyView === 'composition' ? (
              /* MODE 1: COMPOSICIÓN COMPLETA (ESTELA CALIGRÁFICA) */
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-black/80 border border-cyan-500/25 flex items-center justify-center min-h-[220px] max-h-[460px] overflow-auto custom-scrollbar relative shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
                  <div className={calligraphyOrientation === 'algante' ? 'py-4 max-w-sm w-full flex justify-center' : 'px-4 py-4 max-w-full overflow-x-auto flex justify-center'}>
                    <MiniTaelim 
                      root={activeTransversal}
                      mode={calligraphyOrientation}
                      showMorphemes={true}
                      showArcs={true}
                      strokeGlow={true}
                      strokeStartWidth={4.8}
                      strokeEndWidth={2.2}
                      className={calligraphyOrientation === 'algante' ? 'w-full max-h-[420px]' : 'h-44 max-w-full'}
                    />
                  </div>
                </div>

                {/* Enlace en Cadena de Radicales */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 hide-scrollbar">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 whitespace-nowrap mr-1">
                    Cadena Fónica:
                  </span>
                  {currentUnits.map((u, i) => (
                    <React.Fragment key={u.id || i}>
                      <button
                        onClick={() => {
                          setSelectedUnitIndex(i);
                          setCalligraphyView('breakdown');
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/50 transition-all cursor-pointer whitespace-nowrap group"
                        title={`Inspeccionar radical: ${u.rootText}`}
                      >
                        <span className="text-[9px] text-cyan-400/60 font-bold">{i + 1}.</span>
                        <span className="font-semibold">{u.rootText}</span>
                        {u.prefixId && <span className="text-[8px] text-amber-400 font-mono">pref</span>}
                        {u.suffixId && <span className="text-[8px] text-purple-400 font-mono">suf</span>}
                      </button>
                      {i < currentUnits.length - 1 && (
                        <span className="text-slate-600 text-xs font-mono">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              /* MODE 2: DESGLOSE POR RADICALES (INTERACTIVE INSPECTOR) */
              <div className="space-y-5">
                {/* Unit Selector Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/5 custom-scrollbar">
                  {currentUnits.map((u, i) => (
                    <button
                      key={u.id || i}
                      onClick={() => setSelectedUnitIndex(i)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                        safeUnitIndex === i
                          ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                          : 'bg-white/5 text-slate-400 hover:text-cyan-200 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <span className="text-[9px] opacity-75 font-bold">[{i + 1}]</span>
                      <span>{u.rootText}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Radical Showcase */}
                {selectedUnit && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-black/80 border border-cyan-500/20 rounded-2xl p-5 md:p-6 shadow-inner">
                    {/* Left: HD Solo Glyph */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-cyan-500/30 shadow-[0_0_25px_rgba(8,145,178,0.15)] relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:12px_12px] opacity-15 pointer-events-none"></div>
                      <div className="w-44 h-44 flex items-center justify-center z-10">
                        <MiniTaelim 
                          root={selectedUnit.originalText}
                          mode="algante"
                          showMorphemes={true}
                          showArcs={true}
                          strokeGlow={true}
                          strokeStartWidth={5.0}
                          strokeEndWidth={2.4}
                          className="w-full h-full text-cyan-400"
                        />
                      </div>
                      <div className="mt-2 text-center z-10 space-y-0.5">
                        <span className="text-xs font-bold font-mono tracking-widest text-cyan-300">
                          {selectedUnit.cleanRoot}
                        </span>
                        <p className="text-[9px] text-slate-500 font-mono">
                          {selectedUnit.originalText !== selectedUnit.cleanRoot ? `Formulación: ${selectedUnit.originalText}` : 'Raíz Pura'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Linguistic & Semantic Details */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xl font-bold font-rajdhani uppercase tracking-wider text-slate-100">
                            {selectedUnit.rootText}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                            {selectedTerm?.category || 'Raíz Canónica'}
                          </span>
                          {selectedTerm?.tonality && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                              {selectedTerm.tonality}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-sans text-cyan-200 mt-1 font-medium">
                          {selectedTerm?.meaning || 'Elemento morfológico en el dialecto Transversal.'}
                        </p>
                      </div>

                      {selectedTerm?.description && (
                        <p className="text-xs text-slate-400 font-sans leading-relaxed border-l-2 border-cyan-500/40 pl-3 italic">
                          {selectedTerm.description}
                        </p>
                      )}

                      {/* Affix Decomposition Badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedUnit.prefixId && (
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>Prefijo: {TAELIM_MORPHEMES.find(m => m.id === selectedUnit.prefixId)?.label || selectedUnit.prefixId}</span>
                          </span>
                        )}
                        {selectedUnit.infixId && (
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>Infijo: {TAELIM_MORPHEMES.find(m => m.id === selectedUnit.infixId)?.label || selectedUnit.infixId}</span>
                          </span>
                        )}
                        {selectedUnit.suffixId && (
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                            <span>Sufijo: {TAELIM_MORPHEMES.find(m => m.id === selectedUnit.suffixId)?.label || selectedUnit.suffixId}</span>
                          </span>
                        )}
                        {!selectedUnit.prefixId && !selectedUnit.infixId && !selectedUnit.suffixId && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-500">
                            Sin afijos adicionales (Raíz despojada)
                          </span>
                        )}
                      </div>

                      {/* Actions for this individual radical */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handlePlayUnitSound(selectedUnit, safeUnitIndex)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-cyan-500/50 bg-white/5 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all cursor-pointer ${
                            playingUnitIndex === safeUnitIndex ? 'text-cyan-400 border-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.3)] animate-pulse' : ''
                          }`}
                          title={`Escuchar resonancia de ${selectedUnit.rootText}`}
                        >
                          <Volume2 size={13} />
                          <span>Resonancia Fónica</span>
                        </button>

                        <button
                          onClick={() => handleTraceUnit(selectedUnit)}
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                          title={`Trazar ${selectedUnit.rootText} en el Lienzo Tael'im`}
                        >
                          <PenTool size={13} />
                          <span>Trazar este Radical</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Poetic & Literal Translations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Poetic Joren Thalvus Translation */}
            <div className="border border-amber-500/20 bg-gradient-to-br from-amber-950/10 to-black/40 rounded-2xl p-5 md:p-6 space-y-2.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <Feather size={13} className="text-amber-400" /> Interpretación Poética ({isCompact ? 'Síntesis Aforística' : 'Estilo Joren Thalvus'})
              </span>
              <p className="text-sm md:text-base text-slate-100 italic font-sans leading-relaxed">
                {activePoetic}
              </p>
            </div>

            {/* Literal Morphological Decomposition */}
            <div className="border border-white/10 bg-black/40 rounded-2xl p-5 md:p-6 space-y-2.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                <BookOpen size={13} className="text-slate-400" /> Desglose Literal Morfosintáctico
              </span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed opacity-90">
                {activeLiteral}
              </p>
            </div>
          </div>

          {/* Sociolect Comparison: Algante vs Oxidado */}
          <div className="border border-white/10 bg-black/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Compass size={13} className="text-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold">
                Contraste de Casta / Geometría Social:
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-cyan-950/15 border border-cyan-500/20 space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  Casta Algante (Émulo / Alta Cultura):
                </span>
                <p className="text-slate-300 italic">
                  {result.sociolectAlgante || 'Pronombres de estatus preservados; cadencia ceremonial extendida.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-950/15 border border-orange-500/20 space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-orange-400 font-bold block">
                  Dialecto Oxidado (Cubiertas Bajas Periféricas):
                </span>
                <p className="text-slate-300 italic">
                  {result.sociolectOxidado || 'Supresión de pronombres; economía de aliento y foco en la supervivencia pura.'}
                </p>
              </div>
            </div>
          </div>

          {/* Morpheme Anatomy Tokens */}
          {activeTokens && activeTokens.length > 0 && (
            <div className="space-y-3 pt-1">
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase block">
                Anatomía de los Nexos Fónicos ({isCompact ? 'Fórmula Sintetizada' : 'Formulación Canónica'}):
              </span>
              <div className="flex flex-wrap gap-2.5">
                {activeTokens.map((token, i) => (
                  <div 
                    key={i} 
                    className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex flex-col gap-0.5 ${getTokenBadgeClass(token.type)}`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-sm">{token.part}</span>
                      <span className="text-[8px] opacity-75 uppercase tracking-widest font-mono">({token.type})</span>
                    </div>
                    <span className="text-[10px] opacity-90 leading-tight">{token.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Philosophical Note */}
          {result.philosophicalNote && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono text-cyan-200/90 leading-relaxed shadow-sm">
              <span className="font-bold text-cyan-400">Exégesis del Oráculo Veyvān: </span>
              {result.philosophicalNote}
            </div>
          )}
        </div>
      )}

      {/* API Key & Quantum Link Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 md:p-7 space-y-6 shadow-[0_0_60px_rgba(8,145,178,0.35)] max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-rajdhani uppercase tracking-wider text-slate-100 flex items-center gap-2">
                    <span>Enlace Cuántico // Google Gemini</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
                      2026 Core
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Configuración de clave API personalizada y telemetría de latencia
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs font-mono transition-colors"
              >
                ✕
              </button>
            </div>

            {/* API Key Input Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <span>Clave API de Gemini (Google AI Studio)</span>
                </label>
                {isCustomKeyActive ? (
                  <span className="text-[9px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                    Clave de Usuario Activa
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                    Clave Canónica de Sistema
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="input-gemini-api-key"
                  type={showPassword ? "text" : "password"}
                  value={customKey}
                  onChange={e => setCustomKey(e.target.value)}
                  placeholder="Introduce tu clave API de Google Gemini (AI Studio)..."
                  className="w-full bg-black/70 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 pr-11 text-xs font-mono text-cyan-200 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors p-1"
                  title={showPassword ? "Ocultar clave" : "Mostrar clave"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans pt-0.5">
                <span>Tu clave queda guardada localmente en tu navegador sin enviarse a servidores externos.</span>
              </div>
            </div>

            {/* Model Selection Section */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center justify-between">
                <span>Selección de Modelo Neuronal</span>
                <span className="text-[9px] text-slate-400 font-normal">Arquitectura Gemini 2026</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CURATED_MODELS.map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-rajdhani uppercase tracking-wider text-slate-100">
                          {m.label}
                        </span>
                        {m.badge && (
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                            m.badge === 'Recomendado' 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                              : 'bg-white/10 text-slate-300'
                          }`}>
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-sans leading-tight text-slate-400">
                        {m.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Connection Test Button & Diagnostics */}
            <div className="space-y-3 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Activity size={13} className="text-cyan-400" />
                  Prueba de Conexión & Diagnóstico
                </span>

                <button
                  id="btn-test-connection"
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !customKey.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-pointer"
                >
                  <Zap size={13} className={isTesting ? "animate-spin text-cyan-300" : "text-cyan-400"} />
                  <span>{isTesting ? "Midiendo enlace..." : "Probar Conexión"}</span>
                </button>
              </div>

              {/* Diagnostic Result Card */}
              {testResult && (
                <div className={`p-4 rounded-xl border animate-fade-in space-y-2 text-xs font-sans ${
                  testResult.success 
                    ? 'bg-emerald-950/25 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                    : 'bg-rose-950/25 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {testResult.success ? (
                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
                      )}
                      <span className={`font-bold font-rajdhani uppercase tracking-wider text-sm ${
                        testResult.success ? 'text-emerald-300' : 'text-rose-300'
                      }`}>
                        {testResult.success ? '¡Enlace Cuántico Verificado!' : 'Diagnóstico de Error'}
                      </span>
                    </div>

                    {testResult.latencyMs !== undefined && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-slate-300 flex items-center gap-1">
                        <Zap size={11} className={testResult.success ? "text-emerald-400" : "text-rose-400"} />
                        <span>{testResult.latencyMs} ms</span>
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed font-sans">
                    {testResult.message}
                  </p>

                  {testResult.oracleSample && (
                    <div className="pt-1.5 flex items-center gap-2 text-[11px] font-mono text-cyan-300/90 border-t border-emerald-500/20">
                      <span className="text-slate-400">Respuesta ceremonial:</span>
                      <strong className="text-emerald-300">"{testResult.oracleSample}"</strong>
                      <span className="text-slate-500 text-[10px] ml-auto">{testResult.timestamp}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification message */}
            {keySavedMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={15} />
                <span>Configuración de clave y modelo guardados exitosamente.</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                id="btn-reset-system-key"
                type="button"
                onClick={handleResetToSystemKey}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title="Volver a la clave de respaldo del sistema"
              >
                <RotateCcw size={13} />
                <span>Restablecer a Clave de Sistema</span>
              </button>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all"
                >
                  Cerrar
                </button>
                <button
                  id="btn-save-key-config"
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold font-rajdhani uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)] cursor-pointer"
                >
                  Guardar Configuración
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Canonical Corpus Documents Modal */}
      {showCorpusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 md:p-7 space-y-5 shadow-[0_0_60px_rgba(16,185,129,0.3)] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Shield size={18} className="text-emerald-400" />
                <h3 className="text-sm md:text-base font-bold font-rajdhani uppercase tracking-wider text-slate-100">
                  Bóveda Canónica de Construcción (6 Documentos Sincronizados)
                </h3>
              </div>
              <button 
                onClick={() => setShowCorpusModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            {/* Portability / Autonomous Status Badge */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 font-sans leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-[11px] uppercase tracking-wider">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Núcleo Autónomo, Embebido y 100% Portable</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                El 100% de los códices, las leyes gramaticales VOS, la matriz fonológica y el catálogo maestro de <strong>404 raíces canónicas</strong> auditadas han sido <strong>compilados directamente en el código del ejecutable</strong>.
              </p>
              <div className="text-[11px] text-slate-400 leading-relaxed border-t border-emerald-500/20 pt-2 space-y-1">
                <p>
                  <strong className="text-emerald-300">Independencia total del sistema:</strong> Esta aplicación no lee archivos externos en tiempo de ejecución. Puedes cambiar tus carpetas de sitio, instalar la aplicación en otro ordenador o compartir el instalador con cualquier persona: la IA y el motor heurístico funcionarán de forma idéntica e inmediata en cualquier equipo.
                </p>
              </div>
            </div>

            {/* Source Origin Info */}
            <div className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">
                Cuna Editorial del Lore (Taller de Construcción Original):
              </span>
              <code className="text-[10px] text-cyan-400/80 block break-all">
                c:\VSCODE\OBSIDIAN\ESTACION_HUMANIDAD\lore\transversal\construccion\
              </code>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">
                Códices Sincronizados en Memoria:
              </span>

              <div className="grid grid-cols-1 gap-2.5 text-xs font-mono">
                {CANONICAL_DOCUMENTS_SYNCED.map((doc, idx) => {
                  const [title, desc] = doc.split(' (');
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 text-cyan-300 font-bold">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span>{title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 pl-5">
                        {desc ? desc.replace(')', '') : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCorpusModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-rajdhani uppercase tracking-wider text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Cerrar Bóveda
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Translator;
