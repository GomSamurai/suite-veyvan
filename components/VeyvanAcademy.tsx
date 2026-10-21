import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Compass, 
  Eye, 
  PenTool, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Volume2, 
  Award, 
  Brain, 
  Flame, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Layers,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { Term } from '../types';
import MiniTaelim from './MiniTaelim';
import { 
  playPhoneme, 
  playWordResonance, 
  playHarmonicChime, 
  playDissonance, 
  playSoftClick 
} from '../utils/taelimAudio';
import { parseTaelimExpression } from '../utils/taelimParser';
import { TAELIM_MORPHEMES } from '../data/taelimRules';

interface Props {
  terms: Term[];
}

// -------------------------------------------------------------
// MATRICES CANÓNICAS DE LA ESTACIÓN
// -------------------------------------------------------------
// ALGANTE (6 cols x 4 rows) - Matriz Horizontal de la Élite Veyvān
const ALGANTE_GRID = [
  ['P', 'V', 'U', 'Y', 'M', 'B'],
  ['F', 'R', 'E', 'A', 'D', 'C'],
  ['H', 'N', 'I', 'L', 'Z', 'Q'],
  ['K', 'S', 'O', 'T', 'G', 'J']
];

const ALGANTE_COL_LABELS = ['Cénit', 'Visión', 'Aliento', 'Base', 'Raíz', 'Abismo'];
const ALGANTE_ROW_LABELS = ['Interior', 'Conexión', 'Acción', 'Exterior'];

// COMÚN (4 cols x 6 rows) - Matriz Vertical del Aliento General
const COMUN_GRID = [
  ['B', 'L', 'A', 'V'],
  ['C', 'N', 'E', 'S'],
  ['D', 'R', 'I', 'T'],
  ['F', 'M', 'O', 'Z'],
  ['G', 'K', 'U', 'H'],
  ['J', 'P', 'Y', 'Q']
];

const COMUN_COL_LABELS = ['Base/Raíz', 'Estructura', 'Núcleo Vocal', 'Límite/Acción'];
const COMUN_ROW_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

// SIGNIFICADO ONTOLÓGICO DE LOS 24 FONEMAS
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

// -------------------------------------------------------------
// RANGOS INICIÁTICOS VEYVĀN
// -------------------------------------------------------------
interface VeyvanRank {
  rank: number;
  title: string;
  minPoints: number;
  description: string;
  badgeColor: string;
}

const VEYVAN_RANKS: VeyvanRank[] = [
  {
    rank: 1,
    title: "Acólito del Aliento",
    minPoints: 0,
    description: "Iniciado que aprende a localizar los 24 nexos fónicos en las matrices sagradas.",
    badgeColor: "border-slate-500/40 text-slate-300 bg-slate-900/60"
  },
  {
    rank: 2,
    title: "Escriba del Rha",
    minPoints: 160,
    description: "Dominio de la forja secuencial y decodificación visual de glifos radicales individuales.",
    badgeColor: "border-cyan-500/40 text-cyan-300 bg-cyan-950/60"
  },
  {
    rank: 3,
    title: "Artífice de Vehlaen",
    minPoints: 420,
    description: "Maestro en la sintaxis VOS, arcos de vínculo y modulación morfológica de la realidad.",
    badgeColor: "border-amber-500/40 text-amber-300 bg-amber-950/60"
  },
  {
    rank: 4,
    title: "Maestro Litúrgico Veyvān",
    minPoints: 850,
    description: "Guardián de la Geometría del Ego en Algante y exégesis oracular de la Estación Humanidad.",
    badgeColor: "border-purple-500/50 text-purple-300 bg-purple-950/70"
  }
];

// Persistent state structure
interface AcademyStorage {
  resonance: number;
  streak: number;
  bestStreak: number;
  masteredRoots: string[];
  matrixAttempts: number;
  matrixSuccess: number;
  forgeSuccess: number;
  decodeSuccess: number;
  syntaxSuccess: number;
  completedOracleJudgments: number;
}

const DEFAULT_STORAGE: AcademyStorage = {
  resonance: 40,
  streak: 0,
  bestStreak: 0,
  masteredRoots: ['Koa', 'Rhea'],
  matrixAttempts: 0,
  matrixSuccess: 0,
  forgeSuccess: 0,
  decodeSuccess: 0,
  syntaxSuccess: 0,
  completedOracleJudgments: 0
};

type AcademyChamber = 'matrix' | 'forge' | 'decode' | 'syntax' | 'oracle';

export const VeyvanAcademy: React.FC<Props> = ({ terms }) => {
  // Load / Save persistent progress
  const [academyData, setAcademyData] = useState<AcademyStorage>(() => {
    try {
      const saved = localStorage.getItem('transversal_academy_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load academy progress", e);
    }
    return DEFAULT_STORAGE;
  });

  useEffect(() => {
    try {
      localStorage.setItem('transversal_academy_progress', JSON.stringify(academyData));
    } catch (e) {
      console.warn("Could not save academy progress", e);
    }
  }, [academyData]);

  // Active Chamber Tab
  const [activeChamber, setActiveChamber] = useState<AcademyChamber>('matrix');

  // Matrix Chamber state
  const [matrixCanon, setMatrixCanon] = useState<'algante' | 'comun'>('algante');
  const [hoveredPhoneme, setHoveredPhoneme] = useState<string | null>(null);
  const [matrixQuizActive, setMatrixQuizActive] = useState<boolean>(false);
  const [matrixTargetPhoneme, setMatrixTargetPhoneme] = useState<string>('K');
  const [matrixFeedback, setMatrixFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Forge Chamber state (Click-to-Stroke sequential writing)
  const [forgeRootIndex, setForgeRootIndex] = useState<number>(0);
  const [forgeClickedChars, setForgeClickedChars] = useState<string[]>([]);
  const [forgeCompleted, setForgeCompleted] = useState<boolean>(false);
  const [forgeError, setForgeError] = useState<string | null>(null);

  // Decode Chamber state (Visual glyph reading)
  const [decodeTargetTerm, setDecodeTargetTerm] = useState<Term | null>(null);
  const [decodeOptions, setDecodeOptions] = useState<Term[]>([]);
  const [decodeAnswered, setDecodeAnswered] = useState<boolean>(false);
  const [decodeSelectedId, setDecodeSelectedId] = useState<string | null>(null);

  // Syntax Chamber state (VOS sentence ordering & affixes)
  const [syntaxQuestionIndex, setSyntaxQuestionIndex] = useState<number>(0);
  const [syntaxSelectedSlots, setSyntaxSelectedSlots] = useState<{ verb: string; obj: string; subj: string }>({ verb: '', obj: '', subj: '' });
  const [syntaxFeedback, setSyntaxFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

  // Oracle Chamber state (AI / Thalios Solaris Judgment)
  const [oracleDilemmaIndex, setOracleDilemmaIndex] = useState<number>(0);
  const [oracleUserReflection, setOracleUserReflection] = useState<string>('');
  const [oracleVerdict, setOracleVerdict] = useState<{ score: number; title: string; commentary: string } | null>(null);
  const [isConsultingOracle, setIsConsultingOracle] = useState<boolean>(false);

  // Clean monosyllabic terms for forge & decode practice (2-4 letters)
  const forgeableTerms = useMemo(() => {
    return terms.filter(t => {
      const clean = t.root.replace(/[^a-zA-Z]/g, '');
      return clean.length >= 2 && clean.length <= 5 && !t.root.includes("'") && !t.root.includes("-");
    });
  }, [terms]);

  const currentForgeTerm = forgeableTerms[forgeRootIndex % Math.max(1, forgeableTerms.length)] || terms[0];

  // Current Rank Calculation
  const currentRank = useMemo(() => {
    for (let i = VEYVAN_RANKS.length - 1; i >= 0; i--) {
      if (academyData.resonance >= VEYVAN_RANKS[i].minPoints) {
        return VEYVAN_RANKS[i];
      }
    }
    return VEYVAN_RANKS[0];
  }, [academyData.resonance]);

  // Next Rank Progress
  const nextRank = useMemo(() => {
    const nextIdx = VEYVAN_RANKS.findIndex(r => r.rank === currentRank.rank) + 1;
    return nextIdx < VEYVAN_RANKS.length ? VEYVAN_RANKS[nextIdx] : null;
  }, [currentRank]);

  const rankProgressPercent = useMemo(() => {
    if (!nextRank) return 100;
    const currentMin = currentRank.minPoints;
    const nextMin = nextRank.minPoints;
    const progress = ((academyData.resonance - currentMin) / (nextMin - currentMin)) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
  }, [academyData.resonance, currentRank, nextRank]);

  // -------------------------------------------------------------
  // HELPER REWARD & FEEDBACK SYSTEM
  // -------------------------------------------------------------
  const awardResonance = (points: number, reason: string) => {
    playHarmonicChime();
    setAcademyData(prev => ({
      ...prev,
      resonance: prev.resonance + points,
      streak: prev.streak + 1,
      bestStreak: Math.max(prev.bestStreak, prev.streak + 1)
    }));
  };

  const registerDissonance = () => {
    playDissonance();
    setAcademyData(prev => ({
      ...prev,
      streak: 0
    }));
  };

  // Reset Progress confirm
  const handleResetProgress = () => {
    if (window.confirm("¿Deseas reiniciar tu progreso iniciático en la Academia Veyvān?")) {
      setAcademyData(DEFAULT_STORAGE);
      localStorage.removeItem('transversal_academy_progress');
    }
  };

  // -------------------------------------------------------------
  // CHAMBER 1: MATRIX QUIZ GENERATOR
  // -------------------------------------------------------------
  const generateNewMatrixQuestion = () => {
    const grid = matrixCanon === 'algante' ? ALGANTE_GRID : COMUN_GRID;
    const allChars = grid.flat();
    const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
    setMatrixTargetPhoneme(randomChar);
    setMatrixFeedback(null);
    setMatrixQuizActive(true);
  };

  const handleMatrixCellClick = (char: string) => {
    playPhoneme(char);

    if (!matrixQuizActive) {
      setHoveredPhoneme(char.toLowerCase());
      return;
    }

    if (char.toUpperCase() === matrixTargetPhoneme.toUpperCase()) {
      awardResonance(20, "Nexo localizado con precisión");
      setAcademyData(prev => ({
        ...prev,
        matrixAttempts: prev.matrixAttempts + 1,
        matrixSuccess: prev.matrixSuccess + 1
      }));
      setMatrixFeedback({
        isCorrect: true,
        message: `¡Precisión absoluta! El nexo de [${char}] ha sido fijado en tu memoria espiritual (+20 Resonancia).`
      });
      setTimeout(() => {
        generateNewMatrixQuestion();
      }, 1500);
    } else {
      registerDissonance();
      setAcademyData(prev => ({
        ...prev,
        matrixAttempts: prev.matrixAttempts + 1
      }));
      setMatrixFeedback({
        isCorrect: false,
        message: `Disonancia: Pulsaste [${char}]. El nexo de [${matrixTargetPhoneme}] aguarda en otro vector ontológico.`
      });
    }
  };

  // -------------------------------------------------------------
  // CHAMBER 2: FORGE (CLICK-TO-STROKE) SEQUENTIAL WRITING
  // -------------------------------------------------------------
  const requiredChars = useMemo(() => {
    if (!currentForgeTerm) return [];
    return currentForgeTerm.root.toUpperCase().replace(/[^A-Z]/g, '').split('');
  }, [currentForgeTerm]);

  const handleForgeNodeClick = (char: string) => {
    if (forgeCompleted) return;

    const nextExpected = requiredChars[forgeClickedChars.length];
    if (char.toUpperCase() === nextExpected) {
      playPhoneme(char);
      const nextArr = [...forgeClickedChars, char.toUpperCase()];
      setForgeClickedChars(nextArr);
      setForgeError(null);

      // Completed the entire root?
      if (nextArr.length === requiredChars.length) {
        setForgeCompleted(true);
        playHarmonicChime();
        setTimeout(() => {
          playWordResonance(currentForgeTerm.root);
        }, 300);

        awardResonance(35, `Forja de ${currentForgeTerm.root}`);
        setAcademyData(prev => ({
          ...prev,
          forgeSuccess: prev.forgeSuccess + 1,
          masteredRoots: prev.masteredRoots.includes(currentForgeTerm.root) 
            ? prev.masteredRoots 
            : [...prev.masteredRoots, currentForgeTerm.root]
        }));
      }
    } else {
      registerDissonance();
      setForgeError(`Disonancia: Pulsaste [${char}]. El trazo requiere visitar primero el nexo [${nextExpected}].`);
    }
  };

  const handleNextForgeTerm = () => {
    setForgeRootIndex(prev => prev + 1);
    setForgeClickedChars([]);
    setForgeCompleted(false);
    setForgeError(null);
  };

  // -------------------------------------------------------------
  // CHAMBER 3: DECODE (EPIGRAPHIC VISUAL READING)
  // -------------------------------------------------------------
  const generateNewDecodeQuestion = () => {
    if (forgeableTerms.length < 4) return;
    const target = forgeableTerms[Math.floor(Math.random() * forgeableTerms.length)];
    // Pick 3 random distractors
    const distractors = forgeableTerms
      .filter(t => t.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [target, ...distractors].sort(() => 0.5 - Math.random());
    setDecodeTargetTerm(target);
    setDecodeOptions(options);
    setDecodeAnswered(false);
    setDecodeSelectedId(null);
  };

  useEffect(() => {
    if (activeChamber === 'decode' && !decodeTargetTerm) {
      generateNewDecodeQuestion();
    }
  }, [activeChamber, decodeTargetTerm]);

  const handleDecodeOptionSelect = (option: Term) => {
    if (decodeAnswered || !decodeTargetTerm) return;
    setDecodeAnswered(true);
    setDecodeSelectedId(option.id);

    if (option.id === decodeTargetTerm.id) {
      awardResonance(25, "Decodificación visual correcta");
      setAcademyData(prev => ({
        ...prev,
        decodeSuccess: prev.decodeSuccess + 1
      }));
    } else {
      registerDissonance();
    }
  };

  // -------------------------------------------------------------
  // CHAMBER 4: SYNTAX VOS & AFFIXES
  // -------------------------------------------------------------
  const SYNTAX_CHALLENGES = [
    {
      id: 1,
      instruction: "Construya en orden canónico VOS (Verbo-Objeto-Sujeto) la siguiente sentencia sagrada:",
      spanishPrompt: "«El porvenir despierta con luz al navegante valiente»",
      correctVerb: "Vor'Eli",
      correctObj: "Sur",
      correctSubj: "Kori",
      verbLabel: "Vor'Eli (Despertar futuro)",
      objLabel: "Sur (Luz / Estrella alcanzada)",
      subjLabel: "Kori (El valiente que se atreve)",
      explanation: "En la arquitectura sagrada de Veyvān, el Verbo (la acción transformadora) ocurre primero, seguido del impacto directo (Objeto) y finalmente el actor (Sujeto), diluyendo el ego individual."
    },
    {
      id: 2,
      instruction: "Construya en orden canónico VOS la sentencia de resolución ontológica:",
      spanishPrompt: "«La identidad teje el flujo constante»",
      correctVerb: "Tael'aen",
      correctObj: "Rhea",
      correctSubj: "Nym",
      verbLabel: "Tael'aen (Tejiendo continuamente)",
      objLabel: "Rhea (El flujo armónico)",
      subjLabel: "Nym (La identidad / consciencia)",
      explanation: "Tael'aen lleva el sufijo de aspecto continuo '-aen', seguido de Rhea (el flujo) y Nym (la identidad que lo esculpe)."
    },
    {
      id: 3,
      instruction: "Construya la máxima de resistencia de las cubiertas inferiores:",
      spanishPrompt: "«La quietud contiene el dolor del frío»",
      correctVerb: "Val're",
      correctObj: "Dran",
      correctSubj: "Siv",
      verbLabel: "Val're (Limitar habitualmente)",
      objLabel: "Dran (Fricción / Dolor evolutivo)",
      subjLabel: "Siv (El silencio de la nave)",
      explanation: "El verbo habitual Val're antecede al dolor (Dran) sostenido por el silencio consciente (Siv)."
    }
  ];

  const currentSyntax = SYNTAX_CHALLENGES[syntaxQuestionIndex % SYNTAX_CHALLENGES.length];

  const handleSyntaxSlotClick = (type: 'verb' | 'obj' | 'subj', val: string) => {
    playSoftClick();
    setSyntaxSelectedSlots(prev => ({
      ...prev,
      [type]: prev[type] === val ? '' : val
    }));
    setSyntaxFeedback(null);
  };

  const handleVerifySyntax = () => {
    if (!syntaxSelectedSlots.verb || !syntaxSelectedSlots.obj || !syntaxSelectedSlots.subj) {
      alert("Asigne los tres componentes: Verbo, Objeto y Sujeto.");
      return;
    }

    const isMatch = 
      syntaxSelectedSlots.verb === currentSyntax.correctVerb &&
      syntaxSelectedSlots.obj === currentSyntax.correctObj &&
      syntaxSelectedSlots.subj === currentSyntax.correctSubj;

    if (isMatch) {
      awardResonance(40, "Sintaxis VOS ensamblada con maestría");
      setAcademyData(prev => ({
        ...prev,
        syntaxSuccess: prev.syntaxSuccess + 1
      }));
      setSyntaxFeedback({
        isCorrect: true,
        explanation: `¡Armonía VOS absoluta! ${currentSyntax.explanation}`
      });
    } else {
      registerDissonance();
      setSyntaxFeedback({
        isCorrect: false,
        explanation: `Disonancia sintáctica: El orden VOS exige [Verbo: ${currentSyntax.correctVerb}] + [Objeto: ${currentSyntax.correctObj}] + [Sujeto: ${currentSyntax.correctSubj}].`
      });
    }
  };

  // -------------------------------------------------------------
  // CHAMBER 5: ORACLE OF THALIOS SOLARIS (AI JUDGMENT)
  // -------------------------------------------------------------
  const ORACLE_DILEMMAS = [
    {
      title: "El Exilio en la Cubierta Polar C308",
      context: "En las cubiertas polares C308, un anciano operador de nodos de energía robada está a punto de desfallecer por la angustia del abismo y el frío glacial. Te pide una inscripción para su pecho.",
      question: "¿Qué fórmula litúrgica invocarías: Vael'nu'Siv (El vacío es energía potencial) o Sur'Vae (La estrella te alcanza)? ¿Cómo aplicarías los afijos de evidencialidad?",
      expectedConcepts: ['vael', 'siv', 'evidencialidad', 'vacio', 'energia', 'frio', 'cubierta']
    },
    {
      title: "El Juramento de la Sombra Blanca",
      context: "Un sirviente de élite (Alévoro) debe renunciar a su propio centro ontológico (Koa) para ser el silencio que hace visible la luz de su líder.",
      question: "Explica por qué la sentencia 'Vas'ka'Siv ·· Ael'vo'Lunea' utiliza el infijo sensorial 'ka' para el servidor y el infijo empírico 'vo' para el elevado.",
      expectedConcepts: ['vas', 'ka', 'vo', 'siv', 'lunea', 'ael', 'sensorial', 'empirico', 'ego']
    }
  ];

  const currentDilemma = ORACLE_DILEMMAS[oracleDilemmaIndex % ORACLE_DILEMMAS.length];

  const handleEvaluateOracle = async () => {
    if (!oracleUserReflection.trim()) return;
    setIsConsultingOracle(true);

    try {
      // Simulate intelligent contextual evaluation based on lore
      await new Promise(r => setTimeout(r, 1200));

      const inputLower = oracleUserReflection.toLowerCase();
      let matchCount = 0;
      currentDilemma.expectedConcepts.forEach(c => {
        if (inputLower.includes(c)) matchCount++;
      });

      const score = Math.min(100, Math.max(65, 70 + matchCount * 8));

      let comm = "";
      if (score >= 88) {
        comm = "Tu discernimiento refleja la pura mirada de Joren Thalvus. Has comprendido que en Transversal la evidencialidad modula el nivel de verdad del alma y que el vacío nunca es ausencia, sino lienzo de energía latente.";
      } else {
        comm = "Tu juicio posee intuición sincera, pero recuerda que el dialecto Algante exige extrema precisión con los infijos de certeza y la renuncia al ego individual en la arquitectura oracional.";
      }

      setOracleVerdict({
        score,
        title: score >= 85 ? "Consagración Aprobada por Thalios Solaris" : "Reflexión Aceptada con Advertencia Litúrgica",
        commentary: comm
      });

      awardResonance(50, "Juicio Oracular de Consciencia");
      setAcademyData(prev => ({
        ...prev,
        completedOracleJudgments: prev.completedOracleJudgments + 1
      }));

    } catch (e) {
      console.error(e);
    } finally {
      setIsConsultingOracle(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Academy Header Banner */}
      <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <GraduationCap size={24} className="animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold font-rajdhani text-white tracking-widest uppercase">
                Academia Veyvān & Escuela de Escribas
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl font-light">
              Iniciación completa en la comprensión y maestría del sistema Transversal. Memorice las matrices fónicas, aprenda el orden de trazo por nexos, decodifique glifos epigráficos y ensamble la sintaxis VOS.
            </p>
          </div>

          {/* Scribe Status Pill */}
          <div className="flex items-center gap-4 bg-black/60 p-3.5 rounded-2xl border border-white/10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${currentRank.badgeColor}`}>
                  {currentRank.title}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles size={12} /> {academyData.resonance} Pts
                </span>
              </div>
              {nextRank && (
                <div className="w-44 bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-purple-400 h-full transition-all duration-500" 
                    style={{ width: `${rankProgressPercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* Streak Counter */}
            <div className="pl-3 border-l border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                <Flame size={14} className={academyData.streak > 0 ? 'animate-bounce text-amber-400' : 'text-slate-600'} />
                <span>{academyData.streak}</span>
              </div>
              <span className="text-[8px] font-mono text-slate-500 uppercase">Racha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chamber Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => setActiveChamber('matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeChamber === 'matrix'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
              : 'text-slate-400 hover:text-white bg-slate-950/60 border border-white/5'
          }`}
        >
          <Compass size={14} />
          <span>I. Cartografía de Nexos</span>
        </button>

        <button
          onClick={() => setActiveChamber('forge')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeChamber === 'forge'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
              : 'text-slate-400 hover:text-white bg-slate-950/60 border border-white/5'
          }`}
        >
          <PenTool size={14} />
          <span>II. Forja de Glifos (Escritura)</span>
        </button>

        <button
          onClick={() => setActiveChamber('decode')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeChamber === 'decode'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
              : 'text-slate-400 hover:text-white bg-slate-950/60 border border-white/5'
          }`}
        >
          <Eye size={14} />
          <span>III. Decodificación Epigráfica (Lectura)</span>
        </button>

        <button
          onClick={() => setActiveChamber('syntax')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeChamber === 'syntax'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
              : 'text-slate-400 hover:text-white bg-slate-950/60 border border-white/5'
          }`}
        >
          <Layers size={14} />
          <span>IV. Sintaxis VOS & Vehlaen</span>
        </button>

        <button
          onClick={() => setActiveChamber('oracle')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeChamber === 'oracle'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-[0_0_15px_rgba(192,132,252,0.2)]'
              : 'text-slate-400 hover:text-white bg-slate-950/60 border border-white/5'
          }`}
        >
          <Brain size={14} />
          <span>V. Tribunal de Thalios Solaris</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CÁMARA I: CARTOGRAFÍA DE LOS NEXOS FÓNICOS                     */}
      {/* ------------------------------------------------------------- */}
      {activeChamber === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Left: Matrix Grid Display & Interactive Map */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-4">
              <div>
                <h3 className="text-xs font-bold font-rajdhani uppercase tracking-[0.2em] text-slate-200">
                  Matriz Fónica Canónica ({matrixCanon === 'algante' ? 'Algante 6×4' : 'Común 4×6'})
                </h3>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">
                  {matrixCanon === 'algante' 
                    ? 'Estructura Horizontal de la Élite Veyvān: 6 columnas dimensionales y 4 filas ontológicas.' 
                    : 'Estructura Vertical del Aliento General: 4 columnas con núcleo vocálico central fluido.'}
                </p>
              </div>

              {/* Canon switch */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-xl bg-black/60 p-1 border border-white/10">
                  <button
                    onClick={() => {
                      setMatrixCanon('algante');
                      setMatrixFeedback(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase transition-all ${
                      matrixCanon === 'algante'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Algante (6×4)
                  </button>
                  <button
                    onClick={() => {
                      setMatrixCanon('comun');
                      setMatrixFeedback(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase transition-all ${
                      matrixCanon === 'comun'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Común (4×6)
                  </button>
                </div>
              </div>
            </div>

            {/* Matrix Board */}
            <div className="relative p-6 rounded-2xl bg-black/70 border border-white/5 flex flex-col items-center">
              
              {/* Column header labels for Algante */}
              {matrixCanon === 'algante' && (
                <div className="grid grid-cols-6 gap-3 sm:gap-6 mb-3 text-center text-[9px] font-mono text-cyan-400/70 uppercase tracking-wider w-full max-w-lg">
                  {ALGANTE_COL_LABELS.map((lbl, idx) => (
                    <div key={idx} className="truncate">{lbl}</div>
                  ))}
                </div>
              )}

              {/* Grid Nodes */}
              <div className={`grid gap-3 sm:gap-4 w-full max-w-lg ${matrixCanon === 'algante' ? 'grid-cols-6' : 'grid-cols-4'}`}>
                {(matrixCanon === 'algante' ? ALGANTE_GRID : COMUN_GRID).map((row, rIdx) => (
                  <React.Fragment key={rIdx}>
                    {row.map((char, cIdx) => {
                      const isHovered = hoveredPhoneme === char.toLowerCase();
                      const isTarget = matrixQuizActive && char.toUpperCase() === matrixTargetPhoneme.toUpperCase();

                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          onClick={() => handleMatrixCellClick(char)}
                          onMouseEnter={() => setHoveredPhoneme(char.toLowerCase())}
                          className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 relative group ${
                            isHovered 
                              ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                              : 'bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10'
                          }`}
                        >
                          <span className="font-mono font-bold text-sm sm:text-base text-slate-100 group-hover:text-cyan-300">
                            {matrixQuizActive ? '•' : char}
                          </span>
                          <span className="text-[8px] font-mono text-slate-500 mt-0.5">
                            {rIdx},{cIdx}
                          </span>

                          {/* Glow node dot */}
                          <div className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`} />
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              {/* Row header labels for Algante */}
              {matrixCanon === 'algante' && (
                <div className="flex justify-between w-full max-w-lg mt-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2">
                  <span>Interior (Arriba)</span>
                  <span>Exterior (Abajo)</span>
                </div>
              )}
            </div>

            {/* Matrix Quiz Bar */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Brain size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold block">
                    {matrixQuizActive ? 'Desafío de Memoria Espacial Activo' : 'Modo Exploración Mnemotécnica'}
                  </span>
                  <p className="text-xs text-slate-300 font-light">
                    {matrixQuizActive 
                      ? `Localice en la matriz el nexo fónico de [ ${matrixTargetPhoneme} ]`
                      : 'Haga clic en un nexo para escuchar su resonancia a 432Hz o inicie un desafío.'}
                  </p>
                </div>
              </div>

              <button
                onClick={matrixQuizActive ? () => setMatrixQuizActive(false) : generateNewMatrixQuestion}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {matrixQuizActive ? 'Detener Desafío' : 'Iniciar Desafío Espacial'}
              </button>
            </div>

            {/* Feedback alert */}
            {matrixFeedback && (
              <div className={`p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2 animate-fade-in ${
                matrixFeedback.isCorrect 
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
              }`}>
                {matrixFeedback.isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                <span>{matrixFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Right: Phoneme Lore & Acoustic Analysis Card */}
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <Volume2 size={16} className="text-cyan-400" />
                <h4 className="text-xs font-bold font-rajdhani uppercase tracking-[0.2em] text-slate-200">
                  Ficha Ontológica del Nexo
                </h4>
              </div>

              {hoveredPhoneme && PHONEME_LORE[hoveredPhoneme] ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-bold text-cyan-400 uppercase">
                      {hoveredPhoneme}
                    </span>
                    <button
                      onClick={() => playPhoneme(hoveredPhoneme)}
                      className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                      title="Resonancia a 432Hz"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Concepto:</span>
                    <span className="text-sm font-bold text-slate-200">{PHONEME_LORE[hoveredPhoneme].concept}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Eje Sónico:</span>
                    <span className="text-xs font-mono text-cyan-400/90">{PHONEME_LORE[hoveredPhoneme].axis}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Exégesis:</span>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {PHONEME_LORE[hoveredPhoneme].desc}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 font-mono text-xs space-y-2">
                  <Compass size={24} className="mx-auto text-slate-600 mb-1 animate-spin" />
                  <p>Pose el cursor o pulse un nexo fónico en la matriz para contemplar su resonancia.</p>
                </div>
              )}
            </div>

            {/* Quick Scribe Stats for Chamber 1 */}
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Estadísticas de la Cámara
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-base font-bold font-mono text-cyan-300">{academyData.matrixSuccess}</span>
                  <span className="text-[9px] font-mono text-slate-500 block mt-0.5">Nexos Fijados</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-base font-bold font-mono text-purple-300">{academyData.streak}</span>
                  <span className="text-[9px] font-mono text-slate-500 block mt-0.5">Racha Actual</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CÁMARA II: FORJA DE GLIFOS (ESCRITURA SECUENCIAL POR CLICS)    */}
      {/* ------------------------------------------------------------- */}
      {activeChamber === 'forge' && currentForgeTerm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Left / Center: Interactive Grid for Forging */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Forja de Radical // Trazo Secuencial por Nexos
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="text-xl font-bold font-mono text-slate-100">{currentForgeTerm.root}</h3>
                  <span className="text-xs text-slate-400">"{currentForgeTerm.meaning}"</span>
                </div>
              </div>

              <button
                onClick={handleNextForgeTerm}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-rajdhani font-bold uppercase tracking-wider text-slate-300 transition-colors"
              >
                <RefreshCw size={13} />
                <span>Siguiente Raíz</span>
              </button>
            </div>

            {/* Sequence Progress Bar */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/60 border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-2">Secuencia:</span>
              <div className="flex items-center gap-2">
                {requiredChars.map((char, idx) => {
                  const isDone = idx < forgeClickedChars.length;
                  const isCurrent = idx === forgeClickedChars.length;

                  return (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center transition-all ${
                        isDone 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                          : isCurrent 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 animate-pulse' 
                            : 'bg-white/[0.02] text-slate-600 border border-white/5'
                      }`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matrix Board for Clicking */}
            <div className="relative p-6 rounded-2xl bg-black/70 border border-white/5 flex flex-col items-center">
              <div className={`grid gap-3 sm:gap-4 w-full max-w-lg ${matrixCanon === 'algante' ? 'grid-cols-6' : 'grid-cols-4'}`}>
                {(matrixCanon === 'algante' ? ALGANTE_GRID : COMUN_GRID).map((row, rIdx) => (
                  <React.Fragment key={rIdx}>
                    {row.map((char, cIdx) => {
                      const isClicked = forgeClickedChars.includes(char.toUpperCase());
                      const isNext = requiredChars[forgeClickedChars.length] === char.toUpperCase();

                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          onClick={() => handleForgeNodeClick(char)}
                          disabled={forgeCompleted}
                          className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 relative group ${
                            isClicked 
                              ? 'bg-cyan-500/25 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105' 
                              : isNext
                                ? 'bg-amber-500/10 border border-amber-400/60 text-amber-200 animate-pulse'
                                : 'bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10'
                          }`}
                        >
                          <span className="font-mono font-bold text-sm sm:text-base">
                            {char}
                          </span>
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Error or Completion Banner */}
            {forgeError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-2 animate-fade-in">
                <XCircle size={15} />
                <span>{forgeError}</span>
              </div>
            )}

            {forgeCompleted && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>¡Glifo de [{currentForgeTerm.root}] forjado con pureza! Masterizado en tu códice personal (+35 Resonancia).</span>
                </div>
                <button
                  onClick={handleNextForgeTerm}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-bold font-rajdhani uppercase text-xs transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>

          {/* Right: Mastered Glyph & Meaning Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl flex flex-col items-center text-center space-y-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Glifo Tael'im Resultante
              </span>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 w-44 h-44 flex items-center justify-center">
                <MiniTaelim
                  root={currentForgeTerm.root}
                  mode={matrixCanon}
                  strokeColor="#22d3ee"
                  strokeStartWidth={5.2}
                  strokeEndWidth={2.0}
                  className="filter drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                />
              </div>

              <div>
                <span className="font-mono font-bold text-lg text-slate-100">{currentForgeTerm.root}</span>
                <span className="text-xs text-cyan-300 block font-light mt-0.5">"{currentForgeTerm.meaning}"</span>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">{currentForgeTerm.tomo}</span>
              </div>

              {currentForgeTerm.description && (
                <p className="text-[11px] text-slate-400 font-light leading-relaxed border-t border-white/5 pt-3">
                  {currentForgeTerm.description}
                </p>
              )}
            </div>

            {/* Mastered Terms Pill List */}
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Términos Dominados ({academyData.masteredRoots.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                {academyData.masteredRoots.map((r, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CÁMARA III: DECODIFICACIÓN EPIGRÁFICA (LECTURA VISUAL)        */}
      {/* ------------------------------------------------------------- */}
      {activeChamber === 'decode' && decodeTargetTerm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Left: Visual Projection of the Glyph */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Inscripción Tael'im a Decodificar
            </span>

            <div className="p-6 rounded-3xl bg-black/80 border border-cyan-500/30 w-52 h-52 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <MiniTaelim
                root={decodeTargetTerm.root}
                mode="algante"
                strokeColor="#22d3ee"
                strokeStartWidth={5.6}
                strokeEndWidth={2.0}
                className="filter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              />
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Contemple la trayectoria del trazo entre los nexos fónicos de la matriz.
            </p>
          </div>

          {/* Right: Multiple Choice Question */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6">
            <div className="pb-4 border-b border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Examen de Lectura Visual
              </span>
              <h3 className="text-lg font-bold font-rajdhani uppercase tracking-wider text-slate-100 mt-1">
                ¿Qué palabra raíz y concepto ontológico encierra este glifo?
              </h3>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {decodeOptions.map((opt) => {
                const isSelected = decodeSelectedId === opt.id;
                const isCorrect = opt.id === decodeTargetTerm.id;

                let btnStyles = 'bg-white/[0.02] border-white/10 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/10';
                if (decodeAnswered) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-rose-950/50 border-rose-500 text-rose-200';
                  } else {
                    btnStyles = 'opacity-40 border-white/5';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleDecodeOptionSelect(opt)}
                    disabled={decodeAnswered}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-2 ${btnStyles}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-base">{opt.root}</span>
                      <span className="text-[9px] font-mono text-slate-500">{opt.category}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-light line-clamp-2">"{opt.meaning}"</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answered */}
            {decodeAnswered && (
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {decodeSelectedId === decodeTargetTerm.id ? (
                      <span className="text-emerald-400 font-bold font-mono text-xs flex items-center gap-1">
                        <CheckCircle2 size={15} /> ¡Decodificación Perfecta! (+25 Resonancia)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold font-mono text-xs flex items-center gap-1">
                        <XCircle size={15} /> Disonancia en la lectura
                      </span>
                    )}
                  </div>

                  <button
                    onClick={generateNewDecodeQuestion}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Siguiente Glifo
                  </button>
                </div>

                <div className="text-xs text-slate-300 font-light space-y-1">
                  <p><strong className="text-slate-100">{decodeTargetTerm.root}</strong>: {decodeTargetTerm.meaning}</p>
                  <p className="text-[11px] text-slate-400">{decodeTargetTerm.description}</p>
                  <p className="text-[10px] font-mono text-cyan-400/80">{decodeTargetTerm.tomo}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CÁMARA IV: SINTAXIS VOS & VEHLAEN                              */}
      {/* ------------------------------------------------------------- */}
      {activeChamber === 'syntax' && (
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Taller de Morfosintaxis VOS (Verbo - Objeto - Sujeto)
              </span>
              <h3 className="text-lg font-bold font-rajdhani uppercase tracking-wider text-slate-100 mt-1">
                {currentSyntax.instruction}
              </h3>
            </div>

            <button
              onClick={() => {
                setSyntaxQuestionIndex(prev => prev + 1);
                setSyntaxSelectedSlots({ verb: '', obj: '', subj: '' });
                setSyntaxFeedback(null);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-rajdhani font-bold uppercase tracking-wider text-slate-300 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Siguiente Enigma</span>
            </button>
          </div>

          {/* Target Sentence Prompt */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
              Sentencia del Sensorium Humano:
            </span>
            <p className="text-lg font-bold text-cyan-200 mt-1 font-rajdhani tracking-wide">
              {currentSyntax.spanishPrompt}
            </p>
          </div>

          {/* VOS Slots Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Slot 1: VERB */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-center">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest block">
                1. VERBO (Acción Primaria)
              </span>
              <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/30 min-h-[48px] flex items-center justify-center font-mono font-bold text-sm text-cyan-300">
                {syntaxSelectedSlots.verb || <span className="text-slate-600 text-xs">Seleccione Verbo...</span>}
              </div>
              <button
                onClick={() => handleSyntaxSlotClick('verb', currentSyntax.correctVerb)}
                className={`w-full p-2 rounded-xl text-xs font-mono transition-colors ${
                  syntaxSelectedSlots.verb === currentSyntax.correctVerb 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400' 
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {currentSyntax.verbLabel}
              </button>
            </div>

            {/* Slot 2: OBJECT */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-center">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest block">
                2. OBJETO (Impacto en la Realidad)
              </span>
              <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 min-h-[48px] flex items-center justify-center font-mono font-bold text-sm text-amber-300">
                {syntaxSelectedSlots.obj || <span className="text-slate-600 text-xs">Seleccione Objeto...</span>}
              </div>
              <button
                onClick={() => handleSyntaxSlotClick('obj', currentSyntax.correctObj)}
                className={`w-full p-2 rounded-xl text-xs font-mono transition-colors ${
                  syntaxSelectedSlots.obj === currentSyntax.correctObj 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400' 
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {currentSyntax.objLabel}
              </button>
            </div>

            {/* Slot 3: SUBJECT */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-center">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-widest block">
                3. SUJETO (Actor Diluido)
              </span>
              <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30 min-h-[48px] flex items-center justify-center font-mono font-bold text-sm text-purple-300">
                {syntaxSelectedSlots.subj || <span className="text-slate-600 text-xs">Seleccione Sujeto...</span>}
              </div>
              <button
                onClick={() => handleSyntaxSlotClick('subj', currentSyntax.correctSubj)}
                className={`w-full p-2 rounded-xl text-xs font-mono transition-colors ${
                  syntaxSelectedSlots.subj === currentSyntax.correctSubj 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400' 
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {currentSyntax.subjLabel}
              </button>
            </div>

          </div>

          {/* Action Bar */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleVerifySyntax}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/40 text-cyan-300 font-rajdhani font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              Consagrar y Verificar Sintaxis VOS
            </button>
          </div>

          {/* Feedback */}
          {syntaxFeedback && (
            <div className={`p-4 rounded-2xl text-xs font-mono space-y-2 animate-fade-in ${
              syntaxFeedback.isCorrect 
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {syntaxFeedback.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{syntaxFeedback.isCorrect ? 'Arquitectura Canónica Correcta' : 'Disonancia Sintáctica'}</span>
              </div>
              <p className="text-slate-300 font-light leading-relaxed">
                {syntaxFeedback.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CÁMARA V: TRIBUNAL DE THALIOS SOLARIS (JUICIO ORACULAR CON IA) */}
      {/* ------------------------------------------------------------- */}
      {activeChamber === 'oracle' && (
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-2xl shadow-2xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-500/20 gap-3">
            <div className="flex items-center gap-2.5">
              <Brain size={18} className="text-purple-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold font-rajdhani uppercase tracking-[0.2em] text-purple-200">
                  Tribunal de Consciencia de Thalios Solaris
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Evaluación de Discernimiento Veyvān por Inteligencia Oracular</span>
              </div>
            </div>

            <button
              onClick={() => {
                setOracleDilemmaIndex(prev => prev + 1);
                setOracleUserReflection('');
                setOracleVerdict(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-rajdhani font-bold uppercase tracking-wider text-purple-300 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Siguiente Dilema</span>
            </button>
          </div>

          {/* Dilemma Prompt Card */}
          <div className="p-5 rounded-2xl bg-black/70 border border-white/5 space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
              Dilema Litúrgico: {currentDilemma.title}
            </span>
            <p className="text-sm text-slate-200 font-light leading-relaxed">
              {currentDilemma.context}
            </p>
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <span className="text-xs font-bold text-purple-200 font-rajdhani tracking-wide block">
                {currentDilemma.question}
              </span>
            </div>
          </div>

          {/* Scribe's Response Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Tu Reflexión y Resolución Litúrgica:
            </label>
            <textarea
              rows={4}
              value={oracleUserReflection}
              onChange={(e) => setOracleUserReflection(e.target.value)}
              placeholder="Razone su elección basándose en el Sensorium, la evidencialidad ('ka / 'vo) y las reglas de la Estación..."
              className="w-full bg-black/60 border border-white/10 focus:border-purple-500/50 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleEvaluateOracle}
              disabled={isConsultingOracle || !oracleUserReflection.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-rajdhani font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(192,132,252,0.2)] disabled:opacity-40"
            >
              <ShieldCheck size={16} />
              <span>{isConsultingOracle ? 'Procesando en el Reactor...' : 'Someter al Juicio de Thalios Solaris'}</span>
            </button>
          </div>

          {/* Oracle Verdict Output */}
          {oracleVerdict && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-cyan-950/40 border border-purple-500/40 space-y-3 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                <span className="text-xs font-bold font-rajdhani uppercase tracking-widest text-purple-300">
                  {oracleVerdict.title}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  Pureza de Juicio: {oracleVerdict.score}%
                </span>
              </div>
              <p className="text-xs text-slate-200 font-light leading-relaxed">
                {oracleVerdict.commentary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Scribe Footer Controls */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
        <span>ESTACIÓN HUMANIDAD // PROTOCOLO DE INICIACIÓN VEYVĀN // CICLO 344</span>
        <button
          onClick={handleResetProgress}
          className="text-slate-600 hover:text-rose-400 transition-colors flex items-center gap-1"
        >
          <RotateCcw size={11} />
          <span>Reiniciar Progreso de la Academia</span>
        </button>
      </div>

    </div>
  );
};

export default VeyvanAcademy;
