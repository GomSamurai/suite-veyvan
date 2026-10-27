import React, { useState, useMemo, useEffect } from 'react';
import { Term, CATEGORIES, TOMOS, Tonality } from '../types';
import { useLexicon } from '../context/LexiconContext';
import { 
  deepAnalyzeRadical, 
  generateRadicalConcepts, 
  fuseRadicalsAI,
  RadicalProposal,
  RadicalFusionResult,
  DeepRadicalAnalysis
} from '../services/geminiService';
import { thaliosVoice } from '../services/thaliosVoiceService';
import { 
  playWordResonance, 
  playPhoneme, 
  playHarmonicChime, 
  playDissonance, 
  playSoftClick 
} from '../utils/taelimAudio';
import MiniTaelim from './MiniTaelim';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  Loader2, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Compass, 
  Layers, 
  PenTool, 
  ArrowRight, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  Info,
  ShieldCheck,
  RefreshCw,
  Search,
  BookOpen,
  Eye,
  Sliders
} from 'lucide-react';

interface Props {
  onAddTerm?: (term: Term) => void;
  existingTerms?: Term[];
}

// -------------------------------------------------------------
// MATRIZ DE 24 FONEMAS CANÓNICOS Y SU LORE ONTOLÓGICO
// -------------------------------------------------------------
const CANONICAL_PHONEMES = ['a', 'e', 'i', 'o', 'u', 'y', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'z'];

const PHONEME_LORE: Record<string, { concept: string; axis: string; desc: string }> = {
  a: { concept: 'Alma / Expansión', axis: 'Vocal Primordial', desc: 'Apertura incondicional de la consciencia hacia el abismo.' },
  e: { concept: 'Esencia sutil', axis: 'Vocal Central', desc: 'La verdad destilada tras el colapso de lo material.' },
  i: { concept: 'Inspiración aguda', axis: 'Vocal Ascendente', desc: 'La chispa intelectual que penetra la oscuridad.' },
  o: { concept: 'Observador desapegado', axis: 'Vocal Reflexiva', desc: 'La mirada neutral que contempla el universo sin juicio.' },
  u: { concept: 'Fluidez profunda', axis: 'Vocal Descendente', desc: 'El curso del Rhea en las profundidades de la memoria.' },
  y: { concept: 'Centro sutil', axis: 'Semivocal Neutra', desc: 'Punto de equilibrio entre el interior y la proyección.' },
  b: { concept: 'Origen y Génesis', axis: 'Consonante Base', desc: 'El primer latido antes de la fragmentación.' },
  c: { concept: 'Calma y Sosiego', axis: 'Consonante Serena', desc: 'La quietud que sobrevive a las tormentas del reactor.' },
  d: { concept: 'Dualidad', axis: 'Consonante Dialéctica', desc: 'La tensión necesaria entre dos polos complementarios.' },
  f: { concept: 'Fuego y Aliento', axis: 'Consonante Fricativa', desc: 'El calor sagrado que desafía el cero absoluto.' },
  g: { concept: 'Gusto y Materia', axis: 'Consonante Raíz', desc: 'El anclaje terrenal y la experiencia sensorial.' },
  h: { concept: 'Eco y Resonancia', axis: 'Consonante Aérea', desc: 'El susurro del aliento que persiste en el vacío.' },
  j: { concept: 'Júbilo sagrado', axis: 'Consonante Elevada', desc: 'El gozo de existir a pesar de la finitud.' },
  k: { concept: 'Fuerza y Estructura', axis: 'Consonante Firme', desc: 'La columna de titanio y la voluntad inquebrantable.' },
  l: { concept: 'Luz y Manifestación', axis: 'Consonante Radiante', desc: 'El despertar visible y la emanación del núcleo.' },
  m: { concept: 'Memoria de la Cuna', axis: 'Consonante Labial', desc: 'El recuerdo de la Vieja Tierra custodiado en el alma.' },
  n: { concept: 'Nexo y Enlace', axis: 'Consonante Relacional', desc: 'El puente sintáctico que une voluntades.' },
  p: { concept: 'Sombra y Contención', axis: 'Consonante Límite', desc: 'El silencio necesario para que la luz sea visible.' },
  q: { concept: 'Contención grave', axis: 'Consonante Abisal', desc: 'La presión del abismo en las cubiertas polares.' },
  r: { concept: 'Resonancia del Rhea', axis: 'Consonante de Flujo', desc: 'La vibración armónica que esculpe la realidad.' },
  s: { concept: 'Silencio sagrado', axis: 'Consonante Sibilante', desc: 'La ausencia de ruido donde la verdad se revela.' },
  t: { concept: 'Tierra y Firmeza', axis: 'Consonante Ancla', desc: 'La solidez necesaria para sostener el tránsito.' },
  v: { concept: 'Límite y Umbral', axis: 'Consonante Puerta', desc: 'La frontera entre el ser y el no-ser.' },
  z: { concept: 'Ciclo infinito', axis: 'Consonante Espiral', desc: 'El retorno eterno de los ciclos del cronosistema.' }
};

// Cálculo de distancia de Levenshtein para auditoría anti-duplicación
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

type ConstructorTab = 'crisol' | 'canalizador' | 'fusion' | 'boveda';

const LORE_INSPIRATIONS = [
  "El anhelo de contemplar la luz de una estrella real tras 344 años de tránsito",
  "El susurro del metal goteando en la penumbra polar del Nivel 320",
  "El tabú sagrado del Fuego y el pánico arquetípico a la extinción",
  "La memoria heredada del océano y la lluvia de la Vieja Tierra",
  "El instante de ingravidez al cruzar entre los arcos de plasma del reactor",
  "El pacto silencioso de lealtad entre las castas Veyvān ante la escasez"
];

const Constructor: React.FC<Props> = ({ onAddTerm, existingTerms }) => {
  const { 
    terms: contextTerms, 
    addTerm: contextAddTerm, 
    traceInTaelim, 
    forgeCalligram, 
    setActiveTab 
  } = useLexicon();

  // Todos los términos canónicos de la suite
  const allTerms = existingTerms || contextTerms || [];

  // Pestaña activa del taller
  const [activeTabMode, setActiveTabMode] = useState<ConstructorTab>('crisol');

  // Estado del Crisol de Forja
  const [root, setRoot] = useState('');
  const [meaning, setMeaning] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tonality, setTonality] = useState<Tonality>(Tonality.NEUTRAL);
  const [tomo, setTomo] = useState<string>(TOMOS[3] || "Tomo III: Vocabularium Rha");
  const [level, setLevel] = useState<string>("Iniciado Veyvān");
  const [syllables, setSyllables] = useState(1);
  const [phonetics, setPhonetics] = useState('');
  const [ontologicalDomain, setOntologicalDomain] = useState('Aliento');
  const [gridMode, setGridMode] = useState<'algante' | 'comun'>('algante');

  // Derivaciones y Sintaxis VOS
  const [derivatives, setDerivatives] = useState<{ noun: string; verb: string; state: string; transcendent: string }>({
    noun: '',
    verb: '',
    state: '',
    transcendent: ''
  });
  const [vosSentence, setVosSentence] = useState<{ transversal: string; literal: string; poetic: string }>({
    transversal: '',
    literal: '',
    poetic: ''
  });

  // Estados de IA & Procesamiento
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChanneling, setIsChanneling] = useState(false);
  const [isFusing, setIsFusing] = useState(false);
  const [complianceNotes, setComplianceNotes] = useState<string>('');

  // Notificación de consagración exitosa
  const [consecratedTerm, setConsecratedTerm] = useState<Term | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Estado del Canalizador por Conceptos
  const [channelPrompt, setChannelPrompt] = useState('');
  const [proposals, setProposals] = useState<RadicalProposal[]>([]);

  // Estado de Fusión e Injerto Alquímico
  const [fuseSearchA, setFuseSearchA] = useState('');
  const [fuseSearchB, setFuseSearchB] = useState('');
  const [selectedTermA, setSelectedTermA] = useState<Term | null>(null);
  const [selectedTermB, setSelectedTermB] = useState<Term | null>(null);
  const [fusionResult, setFusionResult] = useState<RadicalFusionResult | null>(null);

  // Registro de términos creados en esta sesión
  const [createdSessionTerms, setCreatedSessionTerms] = useState<Term[]>([]);

  // Fonema hover para tooltip lore
  const [activePhonemeHover, setActivePhonemeHover] = useState<string | null>(null);

  // -------------------------------------------------------------
  // VALIDACIÓN FONÉTICA Y AUDITORÍA DE DUPLICACIÓN EN VIVO
  // -------------------------------------------------------------
  const phoneticAudit = useMemo(() => {
    const clean = root.trim().toLowerCase();
    if (!clean) {
      return {
        isValid: true,
        warnings: [],
        phonemes: [],
        purityScore: 100,
        exactCollision: null as Term | null,
        similarTerms: [] as { term: Term; distance: number }[]
      };
    }

    const warnings: string[] = [];
    if (clean.includes('x')) warnings.push("La 'x' está prohibida en Transversal. Utiliza 'ks' (ej. Taksa).");
    if (clean.includes('rr')) warnings.push("La vibrante múltiple 'rr' está prohibida. Utiliza la 'r' simple.");
    if (clean.includes('w')) warnings.push("La 'w' es ajena al Rhea. Sustitúyela por 'v' o 'u'.");
    if (clean.includes('ñ')) warnings.push("La 'ñ' no pertenece a la Matriz. Utiliza 'ny' o 'ni'.");
    if (/[0-9]/.test(clean)) warnings.push("Los números no son admitidos en raíces puras.");

    // Extraer fonemas canónicos
    const letters = clean.replace(/[^a-zā'-]/g, '').split('');
    const invalidLetters = letters.filter(l => !CANONICAL_PHONEMES.includes(l) && l !== "'" && l !== '-' && l !== 'ā');
    if (invalidLetters.length > 0) {
      warnings.push(`Caracteres ajenos al Rhea detectados: ${Array.from(new Set(invalidLetters)).join(', ')}.`);
    }

    const purityScore = Math.max(0, 100 - warnings.length * 25);

    // Auditoría de Duplicación contra los 412+ términos
    const exactCollision = allTerms.find(t => t.root.trim().toLowerCase() === clean) || null;

    const similarTerms = allTerms
      .filter(t => t.root.trim().toLowerCase() !== clean)
      .map(t => ({ term: t, distance: levenshteinDistance(clean, t.root.trim().toLowerCase()) }))
      .filter(item => item.distance <= 1 || (clean.length > 4 && item.distance <= 2))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    return {
      isValid: warnings.length === 0,
      warnings,
      phonemes: letters,
      purityScore,
      exactCollision,
      similarTerms
    };
  }, [root, allTerms]);

  // Actualizar derivaciones morfológicas por defecto cuando cambia la raíz
  useEffect(() => {
    const clean = root.trim();
    if (clean) {
      setDerivatives(prev => ({
        noun: prev.noun || clean,
        verb: prev.verb || `Th-${clean}`,
        state: prev.state || `${clean}-ae`,
        transcendent: prev.transcendent || `${clean}'aen`
      }));
      if (!phonetics) {
        setPhonetics(clean.toLowerCase().split('').join('-'));
      }
    }
  }, [root]);

  // Reproducir resonancia de la raíz
  const handlePlayResonance = () => {
    if (!root.trim()) return;
    playSoftClick();
    playWordResonance(root.trim());
  };

  // Pronunciar con voz Thalios
  const handlePlayVoice = (textToSpeak: string, label: string) => {
    if (!textToSpeak.trim()) return;
    playSoftClick();
    thaliosVoice.speak(textToSpeak, { title: label });
  };

  // -------------------------------------------------------------
  // MÓDULO DE IA: AUTO-ARMONIZACIÓN PROFUNDA
  // -------------------------------------------------------------
  const handleDeepAnalyze = async () => {
    if (!root.trim()) {
      alert("Por favor ingresa al menos la Raíz para auto-armonizar con el Oráculo.");
      return;
    }

    setIsAnalyzing(true);
    playSoftClick();

    const sampleRoots = allTerms.slice(0, 30).map(t => t.root);
    const result = await deepAnalyzeRadical(root.trim(), meaning.trim(), sampleRoots);
    setIsAnalyzing(false);

    if (result) {
      playHarmonicChime();
      setTonality(result.tonality);
      setSyllables(result.syllables);
      setDescription(result.expandedDescription);
      if (CATEGORIES.includes(result.categorySuggestion)) {
        setCategory(result.categorySuggestion);
      }
      if (result.tomo) setTomo(result.tomo);
      if (result.level) setLevel(result.level);
      if (result.phonetics) setPhonetics(result.phonetics);
      if (result.ontologicalDomain) setOntologicalDomain(result.ontologicalDomain);
      if (result.derivatives) setDerivatives(result.derivatives);
      if (result.sampleVosSentence) setVosSentence(result.sampleVosSentence);
      if (result.canonicalComplianceNotes) setComplianceNotes(result.canonicalComplianceNotes);
    } else {
      playDissonance();
    }
  };

  // -------------------------------------------------------------
  // CONSAGRAR AL GLOSARIO
  // -------------------------------------------------------------
  const handleConsagrar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!root.trim()) {
      alert("La raíz no puede estar vacía.");
      return;
    }
    if (!meaning.trim()) {
      alert("Debes asignar un significado primario a la raíz.");
      return;
    }

    if (phoneticAudit.exactCollision) {
      if (!confirm(`La raíz '${root.trim()}' ya existe en el Glosario canónico ('${phoneticAudit.exactCollision.meaning}'). ¿Deseas consagrarla igualmente como variante o acepción homófona?`)) {
        return;
      }
    }

    const newTerm: Term = {
      id: crypto.randomUUID(),
      root: root.trim(),
      meaning: meaning.trim(),
      description: description.trim() || meaning.trim(),
      category: category || CATEGORIES[0],
      tonality: tonality || Tonality.NEUTRAL,
      syllables: Number(syllables) || 1,
      addedAt: new Date().toISOString(),
      tomo: tomo || "Tomo III: Vocabularium Rha",
      phonetics: phonetics || root.trim().toLowerCase().split('').join('-'),
      level: level || "Iniciado Veyvān"
    };

    // Agregar al estado global
    if (onAddTerm) {
      onAddTerm(newTerm);
    } else {
      contextAddTerm(newTerm);
    }

    // Registrar en la sesión del usuario
    setCreatedSessionTerms(prev => [newTerm, ...prev]);
    setConsecratedTerm(newTerm);
    playHarmonicChime();

    // Locución ritual opcional
    thaliosVoice.speak(`Radical ${newTerm.root} consagrado en el Códice. Significado: ${newTerm.meaning}.`, {
      title: `Consagración // ${newTerm.root}`
    });
  };

  // Resetear el Crisol
  const handleResetForm = () => {
    playSoftClick();
    setRoot('');
    setMeaning('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setTonality(Tonality.NEUTRAL);
    setSyllables(1);
    setPhonetics('');
    setComplianceNotes('');
    setConsecratedTerm(null);
    setDerivatives({ noun: '', verb: '', state: '', transcendent: '' });
    setVosSentence({ transversal: '', literal: '', poetic: '' });
  };

  // Cargar una propuesta o término en el Crisol
  const handleLoadIntoCrisol = (termData: Partial<Term> & { derivatives?: any; sampleVosSentence?: any }) => {
    playSoftClick();
    if (termData.root) setRoot(termData.root);
    if (termData.meaning) setMeaning(termData.meaning);
    if (termData.description) setDescription(termData.description);
    if (termData.category && CATEGORIES.includes(termData.category)) setCategory(termData.category);
    if (termData.tonality) setTonality(termData.tonality);
    if (termData.tomo) setTomo(termData.tomo);
    if (termData.level) setLevel(termData.level);
    if (termData.syllables) setSyllables(termData.syllables);
    if (termData.phonetics) setPhonetics(termData.phonetics);
    if (termData.derivatives) setDerivatives(termData.derivatives);
    if (termData.sampleVosSentence) setVosSentence(termData.sampleVosSentence);
    setActiveTabMode('crisol');
    setConsecratedTerm(null);
  };

  // -------------------------------------------------------------
  // CANALIZADOR DE NUEVOS CONCEPTOS
  // -------------------------------------------------------------
  const handleChannelConcepts = async () => {
    if (!channelPrompt.trim()) {
      alert("Ingresa un concepto o anhelo para canalizar con el Oráculo.");
      return;
    }

    setIsChanneling(true);
    playSoftClick();

    const existingRoots = allTerms.map(t => t.root);
    const results = await generateRadicalConcepts(channelPrompt.trim(), existingRoots);
    setIsChanneling(false);

    if (results && results.length > 0) {
      playHarmonicChime();
      setProposals(results);
    } else {
      playDissonance();
      alert("El Oráculo no pudo generar propuestas en este instante. Revisa tu clave API o conexión.");
    }
  };

  // -------------------------------------------------------------
  // INJERTO Y FUSIÓN ALQUÍMICA
  // -------------------------------------------------------------
  const handleExecuteFusion = async () => {
    if (!selectedTermA || !selectedTermB) {
      alert("Selecciona dos términos canónicos para realizar el injerto.");
      return;
    }

    if (selectedTermA.id === selectedTermB.id) {
      alert("Debes seleccionar dos términos distintos para el injerto.");
      return;
    }

    setIsFusing(true);
    playSoftClick();

    const result = await fuseRadicalsAI(selectedTermA, selectedTermB);
    setIsFusing(false);

    if (result) {
      playHarmonicChime();
      setFusionResult(result);
    } else {
      playDissonance();
      alert("Error al ejecutar el injerto alquímico con Gemini.");
    }
  };

  // Copiar al portapapeles
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playSoftClick();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Obtener estilo visual según tonalidad
  const getTonalityColor = (t: Tonality) => {
    switch (t) {
      case Tonality.POSITIVE:
        return '#38bdf8'; // Sky blue / Golden aura
      case Tonality.TRANSFORMATIVE:
        return '#c084fc'; // Purple plasma
      case Tonality.NEGATIVE:
        return '#f87171'; // Red oxide
      case Tonality.MIXED:
        return '#fbbf24'; // Amber dual
      default:
        return '#22d3ee'; // Cyan Thalios
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER PRINCIPAL: CONSOLA DE FORJA VEYVĀN 5.0 */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-950/95 border border-cyan-900/60 p-6 md:p-8 relative overflow-hidden backdrop-blur-md rounded-none shadow-[0_0_40px_rgba(6,182,212,0.08)]">
        {/* Glow de fondo */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Flame size={12} className="text-cyan-400 animate-pulse" />
                Protocolo Tael'vohn // Canon Veyvān 5.0
              </span>
              <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                {allTerms.length} Radicales Indexados
              </span>
              <span className={`px-2.5 py-0.5 border font-mono text-[10px] uppercase flex items-center gap-1 ${
                phoneticAudit.isValid 
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                  : 'bg-amber-950/40 border-amber-800 text-amber-300'
              }`}>
                <ShieldCheck size={11} />
                Pureza Fonética: {phoneticAudit.purityScore}%
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider font-sans flex items-center gap-3">
              <span>Forja Ontológica de Radicales</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
              Consagración de nuevas raíces para el Códice Transversal. Auditoría anti-duplicación, matriz de 24 fonemas del Rhea, derivación morfológica viva y vinculación directa con Tael'im.
            </p>
          </div>

          {/* Botonera de Modos Operativos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            <button
              onClick={() => { playSoftClick(); setActiveTabMode('crisol'); }}
              className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1.5 border ${
                activeTabMode === 'crisol'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <PenTool size={16} className={activeTabMode === 'crisol' ? 'text-cyan-400' : ''} />
              <span>Crisol de Forja</span>
            </button>

            <button
              onClick={() => { playSoftClick(); setActiveTabMode('canalizador'); }}
              className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1.5 border ${
                activeTabMode === 'canalizador'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Compass size={16} className={activeTabMode === 'canalizador' ? 'text-cyan-400' : ''} />
              <span>Canalizador IA</span>
            </button>

            <button
              onClick={() => { playSoftClick(); setActiveTabMode('fusion'); }}
              className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1.5 border ${
                activeTabMode === 'fusion'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Layers size={16} className={activeTabMode === 'fusion' ? 'text-cyan-400' : ''} />
              <span>Injerto Alquímico</span>
            </button>

            <button
              onClick={() => { playSoftClick(); setActiveTabMode('boveda'); }}
              className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1.5 border ${
                activeTabMode === 'boveda'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <BookOpen size={16} className={activeTabMode === 'boveda' ? 'text-cyan-400' : ''} />
              <span>Bóveda ({createdSessionTerms.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* NOTIFICACIÓN DE CONSAGRACIÓN EXITOSA */}
      {/* ------------------------------------------------------------- */}
      {consecratedTerm && (
        <div className="bg-emerald-950/60 border border-emerald-500/80 p-5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-900/80 border border-emerald-600 flex items-center justify-center text-emerald-300">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-200 font-mono uppercase tracking-wider">
                ¡Radical [{consecratedTerm.root}] consagrado con éxito en el Códice!
              </p>
              <p className="text-xs text-emerald-400/80 font-mono">
                {consecratedTerm.meaning} · {consecratedTerm.category} · {consecratedTerm.tomo}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handlePlayVoice(consecratedTerm.root, `Raíz // ${consecratedTerm.root}`)}
              className="px-3 py-1.5 bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-700 text-emerald-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 size={13} />
              <span>Pronunciar</span>
            </button>

            <button
              onClick={() => traceInTaelim(consecratedTerm.root)}
              className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700 text-cyan-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool size={13} />
              <span>Trazar en Tael'im</span>
            </button>

            <button
              onClick={() => forgeCalligram(consecratedTerm.root)}
              className="px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700 text-purple-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Compass size={13} />
              <span>Forjar Sigilo</span>
            </button>

            <button
              onClick={() => setActiveTab('glossary')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen size={13} />
              <span>Ver en Glosario</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 1: CRISOL DE FORJA MANUAL GUIADO */}
      {/* ------------------------------------------------------------- */}
      {activeTabMode === 'crisol' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO PRINCIPAL DE MODELADO (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-slate-950/90 border border-slate-800 p-6 md:p-8 space-y-6 relative">
            
            {/* Header del Formulario */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse" />
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest">
                  Parámetros Ontológicos Primarios
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-1 text-slate-500 hover:text-white border border-transparent hover:border-slate-700 text-[11px] font-mono uppercase flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw size={12} /> Limpiar
                </button>
              </div>
            </div>

            <form onSubmit={handleConsagrar} className="space-y-6">
              
              {/* ENTRADA 01: RAÍZ Y AUDITORÍA DE COLISIÓN */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span>Entrada 01: Raíz Sagrada (Vehlaen)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {root.trim() && (
                      <>
                        <button
                          type="button"
                          onClick={handlePlayResonance}
                          className="px-2 py-0.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                          title="Reproducir acorde armónico a 432Hz"
                        >
                          <Volume2 size={12} />
                          <span>Acorde 432Hz</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlayVoice(root.trim(), `Raíz // ${root.trim()}`)}
                          className="px-2 py-0.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                          title="Pronunciar con voz Thalios"
                        >
                          <Volume2 size={12} />
                          <span>Voz Thalios</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-cyan-500 font-mono text-lg font-bold">&gt; //</span>
                  <input
                    type="text"
                    value={root}
                    onChange={e => setRoot(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900/90 border border-slate-700 pl-14 pr-12 py-3.5 text-white focus:border-cyan-400 focus:bg-slate-900 outline-none text-xl font-mono font-extrabold tracking-widest uppercase transition-all"
                    placeholder="KAEL · NYM · VEYR..."
                  />
                  {root.trim() && (
                    <button
                      type="button"
                      onClick={handlePlayResonance}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-cyan-300 transition-colors p-1"
                      title="Probar fonética"
                    >
                      <Volume2 size={18} />
                    </button>
                  )}
                </div>

                {/* BANNER DE AUDITORÍA EN TIEMPO REAL */}
                {root.trim() && (
                  <div className="space-y-1.5 pt-1">
                    {/* Alerta de Colisión Exacta */}
                    {phoneticAudit.exactCollision ? (
                      <div className="p-3 bg-red-950/60 border border-red-700/80 text-red-200 text-xs font-mono flex items-start gap-2.5">
                        <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold uppercase tracking-wider text-red-300">
                            ¡Colisión Canónica Detectada!
                          </p>
                          <p>
                            La raíz <span className="font-bold text-white underline">'{phoneticAudit.exactCollision.root}'</span> ya existe en el Glosario:
                            <span className="italic text-red-200 ml-1">"{phoneticAudit.exactCollision.meaning}"</span> ({phoneticAudit.exactCollision.tomo || 'Glosario'}).
                          </p>
                          <p className="text-[10px] text-red-400">
                            Regla Canónica: En Transversal no se crean raíces duplicadas salvo que sea una acepción homófona deliberada.
                          </p>
                        </div>
                      </div>
                    ) : phoneticAudit.similarTerms.length > 0 ? (
                      /* Alerta de Proximidad Armónica */
                      <div className="p-2.5 bg-amber-950/40 border border-amber-800/80 text-amber-200 text-[11px] font-mono flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Info size={14} className="text-amber-400" />
                          <span>
                            Proximidad fonética con: {phoneticAudit.similarTerms.map(s => `'${s.term.root}' (${s.term.meaning})`).join(', ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-400/80 uppercase">Distancia mínima: {phoneticAudit.similarTerms[0].distance}</span>
                      </div>
                    ) : (
                      /* Raíz Inédita y Válida */
                      <div className="p-2 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>Raíz inédita y consagrada. Sin colisiones en los 412 términos del Códice.</span>
                      </div>
                    )}

                    {/* Advertencias de Fonemas Prohibidos */}
                    {phoneticAudit.warnings.map((w, idx) => (
                      <div key={idx} className="p-2 bg-rose-950/40 border border-rose-900/60 text-rose-300 text-[11px] font-mono flex items-center gap-2">
                        <AlertTriangle size={13} className="text-rose-400 shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* DESGLOSE INTERACTIVO DE FONEMAS */}
                {phoneticAudit.phonemes.length > 0 && (
                  <div className="p-3 bg-slate-900/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                      <span>Desglose de Fonemas (Pulsa para oír su resonancia elemental):</span>
                      <span>24 Fonemas del Rhea</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {phoneticAudit.phonemes.map((char, cIdx) => {
                        const lore = PHONEME_LORE[char.toLowerCase()];
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => {
                              playPhoneme(char);
                              setActivePhonemeHover(char.toLowerCase());
                            }}
                            onMouseEnter={() => setActivePhonemeHover(char.toLowerCase())}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-600 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer group"
                            title={lore ? `${lore.concept} (${lore.axis})` : char}
                          >
                            <span className="text-cyan-400 group-hover:scale-110 transition-transform">{char.toUpperCase()}</span>
                            {lore && (
                              <span className="text-[9px] text-slate-400 font-normal hidden sm:inline">
                                {lore.concept.split('/')[0]}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tooltip explicativo del fonema activo */}
                    {activePhonemeHover && PHONEME_LORE[activePhonemeHover] && (
                      <div className="p-2 bg-cyan-950/50 border border-cyan-800 text-[11px] font-mono text-cyan-200 animate-fade-in flex items-start justify-between">
                        <div>
                          <span className="font-bold text-white uppercase">{activePhonemeHover.toUpperCase()} // </span>
                          <span className="font-bold text-cyan-300">{PHONEME_LORE[activePhonemeHover].concept}</span>
                          <span className="text-slate-400 ml-1.5">({PHONEME_LORE[activePhonemeHover].axis}): </span>
                          <span className="text-slate-300">{PHONEME_LORE[activePhonemeHover].desc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActivePhonemeHover(null)}
                          className="text-slate-500 hover:text-white ml-2 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ENTRADA 02: DEFINICIÓN BASE */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Entrada 02: Definición Base / Significado Primario</span>
                  <span className="text-[10px] text-slate-500 font-normal">Máxima concisión y rigor ontológico</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-cyan-600 font-mono">&gt;</span>
                  <input
                    type="text"
                    value={meaning}
                    onChange={e => setMeaning(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 pl-8 pr-4 py-2.5 text-white focus:border-cyan-400 outline-none font-mono text-sm"
                    placeholder="Micro-salto evolutivo, anhelo de fuego, vacío sagrado..."
                  />
                </div>
              </div>

              {/* BOTONERA IA: AUTO-ARMONIZACIÓN CON EL ORÁCULO GEMINI */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-cyan-950/40 border border-cyan-800/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-900/40 border border-cyan-700 text-cyan-300">
                    <Sparkles size={20} className={isAnalyzing ? 'animate-spin' : ''} />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-cyan-200 uppercase tracking-wider">
                      Oráculo de Armonización Ontológica (Gemini)
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Calcula tonalidad, tomo, descripción expandida, derivaciones y oración VOS en un solo click.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDeepAnalyze}
                  disabled={isAnalyzing || !root.trim()}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] shrink-0"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{isAnalyzing ? 'Armonizando...' : 'Auto-Armonizar con IA'}</span>
                </button>
              </div>

              {/* ENTRADA 03: DESCRIPCIÓN EXPANDIDA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    Entrada 03: Descripción Poética y Filosófica (Lore de la Estación)
                  </label>
                  {description.trim() && (
                    <button
                      type="button"
                      onClick={() => handlePlayVoice(description, `Exégesis // ${root}`)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 size={12} />
                      <span>Escuchar Exégesis</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 p-3.5 text-slate-200 focus:border-cyan-400 outline-none resize-none font-sans text-sm leading-relaxed"
                  placeholder="Describe el matiz espiritual, la vivencia de la nave, el eco en los mamparos o el significado sensorial de esta raíz..."
                />
              </div>

              {/* PARÁMETROS CANÓNICOS EN GRID DE 4 COLUMNAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                
                {/* Categoría */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-wider">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-white focus:border-cyan-400 outline-none text-xs font-sans uppercase font-medium"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Tonalidad */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-wider">
                    Tonalidad Sacra
                  </label>
                  <select
                    value={tonality}
                    onChange={e => setTonality(e.target.value as Tonality)}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-white focus:border-cyan-400 outline-none text-xs font-sans uppercase font-medium"
                  >
                    {Object.values(Tonality).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Tomo Canónico */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-wider">
                    Tomo Asignado
                  </label>
                  <select
                    value={tomo}
                    onChange={e => setTomo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-white focus:border-cyan-400 outline-none text-xs font-sans uppercase font-medium"
                  >
                    {TOMOS.filter(t => t !== "Todos los Tomos").map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Sílabas & Nivel */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-wider">
                    Métrica Silábica
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={syllables}
                      onChange={e => setSyllables(parseInt(e.target.value) || 1)}
                      className="w-16 bg-slate-900 border border-slate-700 p-2.5 text-white focus:border-cyan-400 outline-none font-mono text-center text-xs"
                    />
                    <select
                      value={level}
                      onChange={e => setLevel(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 p-2.5 text-white focus:border-cyan-400 outline-none text-xs font-sans uppercase"
                    >
                      <option value="Iniciado Veyvān">Iniciado Veyvān</option>
                      <option value="Adepto del Códice">Adepto del Códice</option>
                      <option value="Maestro de Sigilos">Maestro de Sigilos</option>
                      <option value="Custodio de Vórtices">Custodio de Vórtices</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN DE DERIVADAS MORFOLÓGICAS Y EJEMPLO VOS */}
              <div className="border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} />
                    <span>Derivaciones Morfológicas Canónicas</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    Sustantivo · Verbo Th- · Estado -ae · Sagrado 'aen
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Sustantivo */}
                  <div className="p-3 bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                      <span>Sustantivo</span>
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(derivatives.noun || root, 'Sustantivo')}
                        className="text-cyan-400 hover:text-cyan-200"
                        title="Oír"
                      >
                        <Volume2 size={11} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={derivatives.noun}
                      onChange={e => setDerivatives(d => ({ ...d, noun: e.target.value }))}
                      className="w-full bg-transparent text-sm font-mono font-bold text-white outline-none"
                      placeholder={root || "Raíz"}
                    />
                  </div>

                  {/* Verbo Activo Th- */}
                  <div className="p-3 bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase">
                      <span>Acción (Th-)</span>
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(derivatives.verb || `Th-${root}`, 'Verbo')}
                        className="text-cyan-400 hover:text-cyan-200"
                        title="Oír"
                      >
                        <Volume2 size={11} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={derivatives.verb}
                      onChange={e => setDerivatives(d => ({ ...d, verb: e.target.value }))}
                      className="w-full bg-transparent text-sm font-mono font-bold text-cyan-200 outline-none"
                      placeholder={root ? `Th-${root}` : "Th-Raíz"}
                    />
                  </div>

                  {/* Estado -ae */}
                  <div className="p-3 bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 uppercase">
                      <span>Estado (-ae)</span>
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(derivatives.state || `${root}-ae`, 'Estado')}
                        className="text-amber-400 hover:text-amber-200"
                        title="Oír"
                      >
                        <Volume2 size={11} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={derivatives.state}
                      onChange={e => setDerivatives(d => ({ ...d, state: e.target.value }))}
                      className="w-full bg-transparent text-sm font-mono font-bold text-amber-200 outline-none"
                      placeholder={root ? `${root}-ae` : "Raíz-ae"}
                    />
                  </div>

                  {/* Trascendente 'aen */}
                  <div className="p-3 bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 uppercase">
                      <span>Sagrado ('aen)</span>
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(derivatives.transcendent || `${root}'aen`, 'Forma Sagrada')}
                        className="text-purple-400 hover:text-purple-200"
                        title="Oír"
                      >
                        <Volume2 size={11} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={derivatives.transcendent}
                      onChange={e => setDerivatives(d => ({ ...d, transcendent: e.target.value }))}
                      className="w-full bg-transparent text-sm font-mono font-bold text-purple-200 outline-none"
                      placeholder={root ? `${root}'aen` : "Raíz'aen"}
                    />
                  </div>
                </div>

                {/* Oración VOS de Muestra */}
                {vosSentence.transversal && (
                  <div className="p-3 bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        Sintaxis VOS (Verbo · Objeto · Sujeto):
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(`${vosSentence.transversal}. ${vosSentence.poetic}`, `Oración VOS // ${root}`)}
                        className="text-cyan-400 hover:text-cyan-200 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={12} />
                        <span>Recitar Oración VOS</span>
                      </button>
                    </div>
                    <p className="text-base font-mono font-bold text-cyan-300">
                      {vosSentence.transversal}
                    </p>
                    <p className="text-xs font-mono text-slate-400">
                      {vosSentence.literal}
                    </p>
                    <p className="text-xs font-serif italic text-amber-200/90">
                      «{vosSentence.poetic}»
                    </p>
                  </div>
                )}
              </div>

              {/* BARRA DE BOTONES INFERIOR */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Info size={14} className="text-cyan-500" />
                  <span>El término quedará indexado para Traductor, Glosario, Tael'im y Caligramas.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-5 py-3 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer w-full sm:w-auto text-center"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-mono font-extrabold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    <Save size={16} />
                    <span>Consagrar Radical</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* COLUMNA DERECHA: MINI-LIENZO TAEL'IM & CONSOLA VISUAL (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
            {/* CARD 01: PREVISUALIZACIÓN DE GLIFO SAGRADO */}
            <div className="bg-slate-950/90 border border-slate-800 p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <PenTool size={14} className="text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Glifo Tael'im en Vivo
                  </h3>
                </div>

                {/* Selector de Matriz */}
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => { playSoftClick(); setGridMode('algante'); }}
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase transition-colors ${
                      gridMode === 'algante' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    Algante (6x4)
                  </button>
                  <button
                    type="button"
                    onClick={() => { playSoftClick(); setGridMode('comun'); }}
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase transition-colors ${
                      gridMode === 'comun' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    Común (4x6)
                  </button>
                </div>
              </div>

              {/* Mini Lienzo de Dibujo Sagrado */}
              <div className="w-full h-52 bg-slate-900/80 border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden">
                {/* Cuadrícula sutil de fondo */}
                <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

                <MiniTaelim
                  root={root.trim() || 'KAEL'}
                  className="w-full h-full max-h-48"
                  strokeColor={getTonalityColor(tonality)}
                  mode={gridMode}
                  showMorphemes={true}
                  showArcs={true}
                  strokeGlow={true}
                />

                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500">
                  {root.trim() || 'KAEL'} // {gridMode.toUpperCase()}
                </div>
              </div>

              {/* Botones de Exportación Directa */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => traceInTaelim(root.trim() || 'KAEL')}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Abrir en el Taller Tael'im"
                >
                  <PenTool size={13} />
                  <span>Trazar Tael'im</span>
                </button>

                <button
                  type="button"
                  onClick={() => forgeCalligram(root.trim() || 'KAEL')}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Abrir en la Forja de Caligramas"
                >
                  <Compass size={13} />
                  <span>Forjar Sigilo</span>
                </button>
              </div>
            </div>

            {/* CARD 02: OBSERVACIONES CANÓNICAS DE LA ORÁCULO */}
            {complianceNotes && (
              <div className="bg-slate-950/90 border border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Dictamen de Pureza Ontológica</span>
                </h4>
                <p className="text-xs font-sans text-slate-300 leading-relaxed italic">
                  "{complianceNotes}"
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>Dominio: {ontologicalDomain}</span>
                  <span>Registro: {level}</span>
                </div>
              </div>
            )}

            {/* CARD 03: RADICALES CANÓNICOS AFINES PARA INSPIRACIÓN */}
            <div className="bg-slate-950/90 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
                <span>Radicales Canónicos de Referencia</span>
                <span className="text-[10px] text-cyan-500">Muestra Veyvān</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {allTerms.slice(0, 6).map(sample => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleLoadIntoCrisol(sample)}
                    className="p-2 bg-slate-900 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-800 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-white group-hover:text-cyan-300">
                        {sample.root}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">{sample.syllables}s</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {sample.meaning}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 2: CANALIZADOR DE NUEVOS CONCEPTOS (LORE DE LA NAVE) */}
      {/* ------------------------------------------------------------- */}
      {activeTabMode === 'canalizador' && (
        <div className="bg-slate-950/90 border border-slate-800 p-6 md:p-8 space-y-6">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass size={18} className="text-cyan-400" />
              <span>Canalizador Oracular de Conceptos e Impulsos del Lore</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Escribe cualquier emoción, tabú, paisaje o anhelo de Estación Humanidad. El Oráculo de Gemini canalizará 3 propuestas canónicas originales respetando los 24 fonemas y la sintaxis VOS.
            </p>
          </div>

          {/* Chips de Inspiración Rápida */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Inspiraciones de la Nave (Pulsa para cargar):
            </span>
            <div className="flex flex-wrap gap-2">
              {LORE_INSPIRATIONS.map((insp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { playSoftClick(); setChannelPrompt(insp); }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-700 text-slate-300 hover:text-cyan-200 text-xs font-sans text-left transition-colors cursor-pointer"
                >
                  «{insp}»
                </button>
              ))}
            </div>
          </div>

          {/* Input del Canalizador */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={channelPrompt}
                onChange={e => setChannelPrompt(e.target.value)}
                placeholder="Escribe el concepto, tabú o experiencia de la Estación que deseas expresar en dialecto Transversal..."
                className="w-full bg-slate-900 border border-slate-700 p-4 text-white focus:border-cyan-400 outline-none resize-none font-sans text-sm leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleChannelConcepts}
                disabled={isChanneling || !channelPrompt.trim()}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                {isChanneling ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{isChanneling ? 'Canalizando...' : 'Invocar 3 Propuestas Canónicas'}</span>
              </button>
            </div>
          </div>

          {/* Propuestas Generadas */}
          {proposals.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                Propuestas Canalizadas por Thalios Solaris ({proposals.length}):
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {proposals.map((prop, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-slate-900/80 border border-slate-800 hover:border-cyan-600 p-5 space-y-4 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                            Propuesta #{pIdx + 1}
                          </span>
                          <h4 className="text-2xl font-mono font-extrabold text-white tracking-widest uppercase">
                            {prop.root}
                          </h4>
                        </div>
                        <div className="w-16 h-16 bg-slate-950 border border-slate-800 p-1 flex items-center justify-center">
                          <MiniTaelim root={prop.root} className="w-full h-full" strokeColor="#22d3ee" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-bold text-cyan-200 font-sans">
                          {prop.meaning}
                        </p>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {prop.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono pt-2 border-t border-slate-800">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300">{prop.tonality}</span>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300">{prop.category}</span>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300">{prop.syllables}s</span>
                      </div>

                      {prop.sampleVosSentence && (
                        <div className="p-2 bg-slate-950 border border-slate-850 text-xs font-mono text-slate-300 space-y-0.5">
                          <p className="text-cyan-400 font-bold">{prop.sampleVosSentence.transversal}</p>
                          <p className="text-slate-400 italic">«{prop.sampleVosSentence.poetic}»</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(prop.root, `Propuesta // ${prop.root}`)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                        title="Oír"
                      >
                        <Volume2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadIntoCrisol(prop)}
                        className="flex-1 px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Cargar al Crisol</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 3: INJERTO Y FUSIÓN ALQUÍMICA DE RADICALES */}
      {/* ------------------------------------------------------------- */}
      {activeTabMode === 'fusion' && (
        <div className="bg-slate-950/90 border border-slate-800 p-6 md:p-8 space-y-6">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={18} className="text-cyan-400" />
              <span>Injerto Alquímico de Radicales Canónicos</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Combina dos raíces existentes del Glosario. La IA aplicará las leyes de asimilación fonética del Transversal para sugerir una nueva raíz armónica y su significado emergente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SELECTOR RADICAL A */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Radical A (Matriz Base)
                </span>
                {selectedTermA && (
                  <span className="text-[10px] font-mono text-cyan-300">{selectedTermA.category}</span>
                )}
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={fuseSearchA}
                  onChange={e => setFuseSearchA(e.target.value)}
                  placeholder="Buscar raíz A (ej. NYM, KOA, VAES)..."
                  className="w-full bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 text-white font-mono text-xs outline-none focus:border-cyan-400"
                />
              </div>

              {/* Lista filtrada A */}
              <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                {allTerms
                  .filter(t => !fuseSearchA.trim() || t.root.toLowerCase().includes(fuseSearchA.toLowerCase()) || t.meaning.toLowerCase().includes(fuseSearchA.toLowerCase()))
                  .slice(0, 10)
                  .map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { playSoftClick(); setSelectedTermA(t); }}
                      className={`w-full p-2 text-left font-mono text-xs flex items-center justify-between transition-colors border ${
                        selectedTermA?.id === t.id
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="font-bold">{t.root}</span>
                      <span className="text-slate-400 text-[11px] truncate max-w-[180px]">{t.meaning}</span>
                    </button>
                  ))}
              </div>

              {selectedTermA && (
                <div className="p-3 bg-slate-950 border border-cyan-900/50 flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 p-1 shrink-0">
                    <MiniTaelim root={selectedTermA.root} className="w-full h-full" strokeColor="#22d3ee" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-white text-sm">{selectedTermA.root}</p>
                    <p className="text-xs text-slate-400 truncate">{selectedTermA.meaning}</p>
                  </div>
                </div>
              )}
            </div>

            {/* SELECTOR RADICAL B */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Radical B (Matriz Complementaria)
                </span>
                {selectedTermB && (
                  <span className="text-[10px] font-mono text-amber-300">{selectedTermB.category}</span>
                )}
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={fuseSearchB}
                  onChange={e => setFuseSearchB(e.target.value)}
                  placeholder="Buscar raíz B (ej. TAEL, RHEA, VIM)..."
                  className="w-full bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 text-white font-mono text-xs outline-none focus:border-amber-400"
                />
              </div>

              {/* Lista filtrada B */}
              <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                {allTerms
                  .filter(t => !fuseSearchB.trim() || t.root.toLowerCase().includes(fuseSearchB.toLowerCase()) || t.meaning.toLowerCase().includes(fuseSearchB.toLowerCase()))
                  .slice(0, 10)
                  .map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { playSoftClick(); setSelectedTermB(t); }}
                      className={`w-full p-2 text-left font-mono text-xs flex items-center justify-between transition-colors border ${
                        selectedTermB?.id === t.id
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="font-bold">{t.root}</span>
                      <span className="text-slate-400 text-[11px] truncate max-w-[180px]">{t.meaning}</span>
                    </button>
                  ))}
              </div>

              {selectedTermB && (
                <div className="p-3 bg-slate-950 border border-amber-900/50 flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 p-1 shrink-0">
                    <MiniTaelim root={selectedTermB.root} className="w-full h-full" strokeColor="#fbbf24" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-white text-sm">{selectedTermB.root}</p>
                    <p className="text-xs text-slate-400 truncate">{selectedTermB.meaning}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleExecuteFusion}
              disabled={isFusing || !selectedTermA || !selectedTermB}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-600 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(192,132,252,0.3)] flex items-center gap-2 cursor-pointer transition-all"
            >
              {isFusing ? <Loader2 size={16} className="animate-spin" /> : <Layers size={16} />}
              <span>{isFusing ? 'Fusionando Raíces...' : 'Ejecutar Injerto Alquímico'}</span>
            </button>
          </div>

          {/* Resultado de la Fusión */}
          {fusionResult && (
            <div className="bg-slate-900 border border-purple-800/80 p-6 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/60 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                    Raíz Sintética Emergente
                  </span>
                  <h3 className="text-3xl font-mono font-extrabold text-white tracking-widest uppercase">
                    {fusionResult.suggestedRoot}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-slate-950 border border-purple-700 p-1">
                    <MiniTaelim root={fusionResult.suggestedRoot} className="w-full h-full" strokeColor="#c084fc" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-base font-bold text-purple-200 font-sans">
                  {fusionResult.meaning}
                </p>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {fusionResult.description}
                </p>
                <p className="text-xs font-mono text-purple-300/80 italic">
                  Leyes de Asimilación: {fusionResult.fusionRationale}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handlePlayVoice(fusionResult.suggestedRoot, `Fusión // ${fusionResult.suggestedRoot}`)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 size={13} />
                  <span>Pronunciar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadIntoCrisol({
                    root: fusionResult.suggestedRoot,
                    meaning: fusionResult.meaning,
                    description: fusionResult.description,
                    category: fusionResult.category,
                    tonality: fusionResult.tonality,
                    tomo: fusionResult.tomo,
                    level: fusionResult.level,
                    syllables: fusionResult.syllables,
                    sampleVosSentence: fusionResult.sampleVosSentence
                  })}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Cargar al Crisol</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 4: BÓVEDA DE RADICALES FORJADOS */}
      {/* ------------------------------------------------------------- */}
      {activeTabMode === 'boveda' && (
        <div className="bg-slate-950/90 border border-slate-800 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={18} className="text-cyan-400" />
                <span>Bóveda de Radicales Forjados ({createdSessionTerms.length})</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Términos consagrados por el autor en esta sesión. Disponibles para caligrafía, sigilos y oraciones.
              </p>
            </div>

            {createdSessionTerms.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const dataStr = JSON.stringify(createdSessionTerms, null, 2);
                  const blob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `radicales_forjados_${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={13} />
                <span>Exportar Forjas JSON</span>
              </button>
            )}
          </div>

          {createdSessionTerms.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <PenTool size={36} className="text-slate-600 mx-auto stroke-1" />
              <p className="text-sm font-mono text-slate-400 uppercase tracking-wider">
                Aún no has consagrado ningún radical en esta sesión.
              </p>
              <button
                type="button"
                onClick={() => setActiveTabMode('crisol')}
                className="px-5 py-2.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                Abrir el Crisol de Forja
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdSessionTerms.map(term => (
                <div
                  key={term.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-700 p-5 space-y-3 transition-colors relative group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-mono font-bold text-white tracking-widest uppercase">
                        {term.root}
                      </h4>
                      <p className="text-xs font-sans text-cyan-300 font-bold">
                        {term.meaning}
                      </p>
                    </div>

                    <div className="w-14 h-14 bg-slate-950 border border-slate-800 p-1 shrink-0">
                      <MiniTaelim root={term.root} className="w-full h-full" strokeColor={getTonalityColor(term.tonality)} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {term.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300">{term.tonality}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 truncate max-w-[120px]">{term.category}</span>
                  </div>

                  <div className="flex items-center justify-between gap-1 pt-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(term.root, `Raíz // ${term.root}`)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Pronunciar"
                      >
                        <Volume2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => traceInTaelim(term.root)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                        title="Trazar en Tael'im"
                      >
                        <PenTool size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => forgeCalligram(term.root)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-300 transition-colors"
                        title="Forjar Caligrama"
                      >
                        <Compass size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(term.root, term.id)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Copiar raíz"
                      >
                        {copiedKey === term.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLoadIntoCrisol(term)}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-mono uppercase"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Constructor;