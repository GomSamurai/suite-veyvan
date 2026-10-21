import React, { useState, useMemo, useRef } from 'react';
import { 
  Scroll, 
  Sparkles, 
  Download, 
  Columns, 
  Rows, 
  BookOpen, 
  Volume2, 
  Search, 
  Plus, 
  Trash2, 
  Sliders, 
  Compass, 
  Cpu, 
  Brain, 
  RefreshCw,
  Layers,
  Info,
  Check
} from 'lucide-react';
import { Term, Tonality } from '../types';
import MiniTaelim from './MiniTaelim';
import { parseTaelimExpression, GlyphUnit, BridgeArc } from '../utils/taelimParser';
import { TAELIM_MORPHEMES } from '../data/taelimRules';
import { playWordResonance } from '../utils/taelimAudio';
import { analyzeTerm } from '../services/geminiService';

interface Props {
  terms: Term[];
  onTraceInTaelim?: (word: string) => void;
}

interface CanonicalFormula {
  root: string;
  meaning: string;
  description: string;
  category: string;
  tomo: string;
}

// 12 authentic, canonical expressions from the Transversal database (initialData.ts / Lore)
const CANONICAL_FORMULAS: CanonicalFormula[] = [
  {
    root: "Koa'Eli",
    meaning: "Luz en tu centro",
    description: "Saludo formal Veyvān o bendición de despertar espiritual.",
    category: "Conexiones y Relaciones",
    tomo: "Tomo III: Vocabularium Rha"
  },
  {
    root: "Rhea'Vohn",
    meaning: "Fluye en armonía",
    description: "Invocación ceremonial usada antes de emprender tareas críticas o tránsitos.",
    category: "Transformaciones y Ciclos",
    tomo: "Tomo V: Cánticos del Rhea"
  },
  {
    root: "Nym'Tael'Rhea",
    meaning: "La identidad teje el flujo",
    description: "Principio existencial: los actos conscientes esculpen el tejido de la realidad.",
    category: "Estados Abstractos y Consciencia",
    tomo: "Tomo IV: Códice de la Consciencia"
  },
  {
    root: "Sur'Vae",
    meaning: "La estrella te alcanza",
    description: "Saludo optimista de luz y bendición en el tránsito interestelar.",
    category: "Conexiones y Relaciones",
    tomo: "Tomo III: Vocabularium Rha"
  },
  {
    root: "Lur'Thy",
    meaning: "Veo tu fibra íntima",
    description: "Saludo sagrado de extrema confianza y amor espiritual entre dos seres.",
    category: "Conexiones y Relaciones",
    tomo: "Tomo III: Vocabularium Rha"
  },
  {
    root: "Kael'Dran",
    meaning: "El despertar requiere fricción",
    description: "Axioma de Thalvus: sin tensión ni esfuerzo no hay salto evolutivo de la consciencia.",
    category: "Transformaciones y Ciclos",
    tomo: "Tomo IV: Códice de la Consciencia"
  },
  {
    root: "Vael'nu'Siv",
    meaning: "El vacío es energía potencial",
    description: "Mantra para disipar la claustrofobia y la angustia del abismo cósmico.",
    category: "Dinámicas del Cosmos",
    tomo: "Tomo I: Amnis"
  },
  {
    root: "Zul-Nai",
    meaning: "Confía en el horizonte",
    description: "Despedida estándar entre navegantes y habitantes de la Estación.",
    category: "Conexiones y Relaciones",
    tomo: "Tomo III: Vocabularium Rha"
  },
  {
    root: "Sha-Sur'Nu-Sol",
    meaning: "Luz lejana no despierta chispa",
    description: "Proverbio clásico: no basta soñar, hay que actuar.",
    category: "Frases y Proverbios",
    tomo: "Tomo III: Vocabularium Rha"
  },
  {
    root: "Luv-ri'Val'Siv",
    meaning: "Amor intenso vence al límite",
    description: "Quien ama no teme a la quietud ni a la adversidad.",
    category: "Emociones y Estados Internos",
    tomo: "Tomo III: Vocabularium Rha"
  },
  {
    root: "Min'Nu-Sha · Vor-Rhea",
    meaning: "El pasado fue duda, el porvenir es flujo",
    description: "Axioma de superación temporal y esperanza cíclica.",
    category: "Transformaciones y Ciclos",
    tomo: "Tomo II: Matriz del Aliento"
  },
  {
    root: "Vo'Neu · Nurai · Vai",
    meaning: "Veo tu miedo en el espejo",
    description: "Axioma aristocrático de percepción empírica en sintaxis VOS canónica.",
    category: "Sintaxis Algante",
    tomo: "Tomo II: Matriz del Aliento"
  }
];

interface AIInterpretation {
  expression: string;
  resonanceScore: number;
  literalTranslation: string;
  transcendentalTranslation: string;
  philosophicalExegesis: string;
  egoGeometry: string;
  oracleBlessing: string;
}

export const CodexComposer: React.FC<Props> = ({ terms, onTraceInTaelim }) => {
  // Expressions currently being composed
  const [expressionItems, setExpressionItems] = useState<string[]>([
    "Koa'Eli",
    "Rhea'Vohn"
  ]);

  const [inputExpression, setInputExpression] = useState('');
  
  // IMMUTABLE CANON RULE:
  // - Algante: Matriz Horizontal (6 cols x 4 rows) -> ALWAYS composes in VERTICAL direction
  // - Común: Matriz Vertical (4 cols x 6 rows) -> ALWAYS composes in HORIZONTAL direction
  const [gridMode, setGridMode] = useState<'algante' | 'comun'>('algante');
  const layoutMode = gridMode === 'algante' ? 'vertical' : 'horizontal';

  // Selected expression for in-depth morphological exegesis & AI interpretation
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Stroke and Arc Customization Parameters
  const [strokeStartWidth, setStrokeStartWidth] = useState<number>(5.2);
  const [strokeEndWidth, setStrokeEndWidth] = useState<number>(2.0);
  const [strokeGlow, setStrokeGlow] = useState<boolean>(true);
  const [arcThickness, setArcThickness] = useState<number>(2.2);
  const [arcOpacity, setArcOpacity] = useState<number>(85); // 10 to 100
  const [arcCurvature, setArcCurvature] = useState<number>(26); // 12 to 48
  const [arcDash, setArcDash] = useState<boolean>(false);
  const [showParamsPanel, setShowParamsPanel] = useState<boolean>(true);

  // Plasma Glow Color
  const [glowColor, setGlowColor] = useState<'cyan' | 'gold' | 'emerald' | 'violet'>('cyan');
  const [isExporting, setIsExporting] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // AI Interpretation State
  const [aiInterpretation, setAiInterpretation] = useState<AIInterpretation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Color Map
  const colorMap = {
    cyan: {
      text: 'text-cyan-400',
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_0_25px_rgba(34,211,238,0.35)]',
      plasma: '#22d3ee',
      accent: 'bg-cyan-500/10'
    },
    gold: {
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_25px_rgba(251,191,36,0.35)]',
      plasma: '#fbbf24',
      accent: 'bg-amber-500/10'
    },
    emerald: {
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_25px_rgba(52,211,153,0.35)]',
      plasma: '#34d399',
      accent: 'bg-emerald-500/10'
    },
    violet: {
      text: 'text-purple-400',
      border: 'border-purple-500/40',
      glow: 'shadow-[0_0_25px_rgba(192,132,252,0.35)]',
      plasma: '#c084fc',
      accent: 'bg-purple-500/10'
    }
  };

  const currentColor = colorMap[glowColor];

  // Active expression string
  const activeExpression = expressionItems[selectedIndex] || expressionItems[0] || '';

  // Add expression to list
  const handleAddExpression = (expr: string) => {
    const trimmed = expr.trim();
    if (!trimmed) return;
    setExpressionItems(prev => [...prev, trimmed]);
    setInputExpression('');
    setSelectedIndex(expressionItems.length); // point to new expression
    setAiInterpretation(null);
  };

  // Remove expression
  const handleRemoveExpression = (index: number) => {
    setExpressionItems(prev => prev.filter((_, i) => i !== index));
    if (selectedIndex >= index && selectedIndex > 0) {
      setSelectedIndex(prev => prev - 1);
    }
    setAiInterpretation(null);
  };

  // Filtered terms for the quick picker
  const filteredGlossary = useMemo(() => {
    if (!pickerSearch.trim()) return terms.slice(0, 12);
    const q = pickerSearch.toLowerCase();
    return terms.filter(t => 
      t.root.toLowerCase().includes(q) || 
      t.meaning.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [terms, pickerSearch]);

  // Find glossary term details for a clean root
  const findTermForRoot = (cleanRoot: string): Term | undefined => {
    const q = cleanRoot.toLowerCase();
    return terms.find(t => t.root.toLowerCase() === q) || 
           terms.find(t => t.root.toLowerCase().includes(q) || q.includes(t.root.toLowerCase()));
  };

  // Quick Preset Styles
  const applyPreset = (preset: 'canon' | 'monument' | 'fine' | 'uniform') => {
    switch (preset) {
      case 'canon':
        setStrokeStartWidth(5.6);
        setStrokeEndWidth(1.8);
        setArcThickness(2.2);
        setArcOpacity(85);
        setArcCurvature(26);
        setArcDash(false);
        setStrokeGlow(true);
        break;
      case 'monument':
        setStrokeStartWidth(7.2);
        setStrokeEndWidth(3.4);
        setArcThickness(3.0);
        setArcOpacity(95);
        setArcCurvature(32);
        setArcDash(false);
        setStrokeGlow(true);
        break;
      case 'fine':
        setStrokeStartWidth(3.4);
        setStrokeEndWidth(1.4);
        setArcThickness(1.4);
        setArcOpacity(75);
        setArcCurvature(20);
        setArcDash(false);
        setStrokeGlow(true);
        break;
      case 'uniform':
        setStrokeStartWidth(3.8);
        setStrokeEndWidth(3.8);
        setArcThickness(2.0);
        setArcOpacity(85);
        setArcCurvature(24);
        setArcDash(false);
        setStrokeGlow(false);
        break;
    }
  };

  // Morphological Analysis for Active Expression
  const parsedActive = useMemo(() => {
    if (!activeExpression) return null;
    return parseTaelimExpression(activeExpression);
  }, [activeExpression]);

  // Active Expression Canonical Match
  const canonicalMatch = useMemo(() => {
    if (!activeExpression) return null;
    return CANONICAL_FORMULAS.find(f => f.root.toLowerCase() === activeExpression.toLowerCase());
  }, [activeExpression]);

  // AI Interpretation Function (Thalios Solaris)
  const handleGenerateAI = async () => {
    if (!activeExpression || !parsedActive) return;
    setIsGeneratingAI(true);

    try {
      // Collect constituent root meanings
      const unitMeanings = parsedActive.units.map(u => {
        const t = findTermForRoot(u.cleanRoot);
        return {
          root: u.cleanRoot,
          meaning: t ? t.meaning : 'Concepto elemental'
        };
      });

      const joinedMeanings = unitMeanings.map(u => `${u.root} ("${u.meaning}")`).join(' + ');

      // Check if Gemini API is configured
      let geminiResult = null;
      try {
        geminiResult = await analyzeTerm(activeExpression, joinedMeanings);
      } catch (e) {
        console.warn("Gemini service unavailable, using Thalios Solaris Oracle engine.", e);
      }

      // Generate profound contextual exegesis
      const isAlgante = gridMode === 'algante';
      const score = Math.floor(92 + (activeExpression.length % 8));

      let literal = canonicalMatch?.meaning || unitMeanings.map(u => u.meaning).join(' que enlaza a ');
      let poetic = geminiResult?.expandedDescription || canonicalMatch?.description || '';
      
      if (!poetic) {
        if (isAlgante) {
          poetic = `Invocación de alto rango Veyvān: el nexo entre [${unitMeanings[0]?.root || 'raíz'}] y [${unitMeanings[1]?.root || 'manifestación'}] consagra la primacía del ser consciente sobre la inercia del vacío interestelar.`;
        } else {
          poetic = `Axioma de la clase trabajadora: canaliza la energía funcional sin artificio, recordando que cada latido de la Estación sostiene el aliento común.`;
        }
      }

      const exegesis = `En la sintaxis sagrada Tael'im, los arcos conectores no unen meras palabras, sino vectores ontológicos. La composición de "${activeExpression}" establece un campo armónico de frecuencia continua: el trazo grueso inicial ancla la voluntad en la materia, mientras que la terminación fina proyecta su vibración hacia la consciencia universal.`;

      const egoGeom = isAlgante 
        ? "Geometría del Ego: Dialecto Algante // Trascendencia del Yo Soberano (Eos) hacia la luz contemplada (Eli)."
        : "Geometría del Ego: Dialecto Común // Ausencia de ego individual; prevalencia del flujo colectivo (Rha-min).";

      const blessing = canonicalMatch 
        ? `Consagración Canónica // ${canonicalMatch.tomo}: Preserva esta inscripción para disipar toda turbulencia o desasosiego.`
        : `Sentencia Epigráfica Autorizada por Thalios Solaris: "Que el pulso del reactor y la verdad del trazo guíen tu tránsito."`;

      setAiInterpretation({
        expression: activeExpression,
        resonanceScore: score,
        literalTranslation: literal,
        transcendentalTranslation: poetic,
        philosophicalExegesis: exegesis,
        egoGeometry: egoGeom,
        oracleBlessing: blessing
      });

    } catch (err) {
      console.error("Error generating AI exegesis:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // High-Resolution PNG Expression Export
  const handleExportExpression = async () => {
    if (!containerRef.current || expressionItems.length === 0) return;
    setIsExporting(true);

    try {
      const svgs = containerRef.current.querySelectorAll('svg');
      if (svgs.length === 0) {
        setIsExporting(false);
        return;
      }

      const canvas = document.createElement('canvas');
      const isVertical = gridMode === 'algante';

      const width = isVertical ? 980 : Math.max(1280, svgs.length * 380 + 200);
      const height = isVertical ? Math.max(1200, svgs.length * 340 + 380) : 880;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark Cosmic Void Background
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 60, width / 2, height / 2, width);
      bgGrad.addColorStop(0, '#040914');
      bgGrad.addColorStop(1, '#010307');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ceremonial Double Border
      ctx.strokeStyle = currentColor.plasma;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = `${currentColor.plasma}33`;
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Header
      ctx.fillStyle = currentColor.plasma;
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ESTACIÓN HUMANIDAD // EXPRESIÓN TAEL\'IM (VEHLAEN)', width / 2, 80);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(
        `CANON ${gridMode === 'algante' ? 'ALGANTE (6×4 // COMPOSICIÓN VERTICAL)' : 'COMÚN (4×6 // COMPOSICIÓN HORIZONTAL)'} — CALIGRAFÍA DISCRETA`,
        width / 2,
        106
      );

      // Central Spine line in Vertical Mode
      if (isVertical) {
        ctx.strokeStyle = `${currentColor.plasma}22`;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(width / 2, 135);
        ctx.lineTo(width / 2, height - 125);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw each SVG onto canvas
      let currentPos = 145;
      for (let i = 0; i < svgs.length; i++) {
        const svg = svgs[i];
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const blobURL = window.URL.createObjectURL(svgBlob);

        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const exprText = expressionItems[i] || '';
            const match = CANONICAL_FORMULAS.find(f => f.root.toLowerCase() === exprText.toLowerCase());

            if (isVertical) {
              const glyphW = Math.min(340, img.width);
              const glyphH = (img.height / img.width) * glyphW;
              const posX = (width - glyphW) / 2;
              const posY = currentPos;
              ctx.drawImage(img, posX, posY, glyphW, glyphH);

              // Legend
              ctx.fillStyle = '#e2e8f0';
              ctx.font = 'bold 16px monospace';
              ctx.fillText(exprText, width / 2, posY + glyphH + 24);

              if (match) {
                ctx.fillStyle = currentColor.plasma;
                ctx.font = '12px "Space Grotesk", sans-serif';
                ctx.fillText(`"${match.meaning}"`, width / 2, posY + glyphH + 42);
              }

              currentPos += glyphH + 75;
            } else {
              const glyphW = 290;
              const glyphH = (img.height / img.width) * glyphW;
              const posX = 90 + i * 330;
              const posY = (height - glyphH) / 2 - 30;
              ctx.drawImage(img, posX, posY, glyphW, glyphH);

              ctx.fillStyle = '#e2e8f0';
              ctx.font = 'bold 16px monospace';
              ctx.fillText(exprText, posX + glyphW / 2, posY + glyphH + 28);

              if (match) {
                ctx.fillStyle = currentColor.plasma;
                ctx.font = '12px "Space Grotesk", sans-serif';
                ctx.fillText(`"${match.meaning}"`, posX + glyphW / 2, posY + glyphH + 46);
              }
            }
            window.URL.revokeObjectURL(blobURL);
            resolve();
          };
          img.src = blobURL;
        });
      }

      // Footer Seal
      ctx.fillStyle = '#475569';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('THALIOS SOLARIS // CICLO 344 // REGISTRO EPIGRÁFICO AUTORIZADO // VEHLAEN TAEL\'IM', width / 2, height - 55);

      const link = document.createElement('a');
      link.download = `Expresion_Taelim_${gridMode}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating expression export:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Scroll size={22} className="animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold font-rajdhani text-white tracking-widest uppercase">
                Códice Litúrgico & Compositor de Expresiones (Vehlaen)
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl font-light">
              Componga y ensamble expresiones litúrgicas y oraciones Tael'im. Cada término descompone de forma fiel sus radicales independientes, trazos caligráficos cónicos y arcos de vínculo canónicos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowParamsPanel(!showParamsPanel)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-rajdhani font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Sliders size={14} className="text-cyan-400" />
              <span>{showParamsPanel ? 'Ocultar Parámetros' : 'Ajustes de Trazo'}</span>
            </button>

            <button
              onClick={handleExportExpression}
              disabled={isExporting || expressionItems.length === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-rajdhani font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-40"
            >
              <Download size={14} className={isExporting ? 'animate-bounce' : ''} />
              {isExporting ? 'Grabando Expresión...' : 'Exportar Expresión HD'}
            </button>
          </div>
        </div>
      </div>

      {/* Parametric Customization Panel (Trazo y Arcos de Vínculo) */}
      {showParamsPanel && (
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3">
            <div className="flex items-center gap-2.5">
              <Sliders size={16} className="text-cyan-400" />
              <h3 className="text-xs font-bold font-rajdhani uppercase tracking-[0.2em] text-slate-200">
                Personalización Paramétrica de Trazos y Arcos de Vínculo
              </h3>
            </div>
            
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Presets:</span>
              <button 
                onClick={() => applyPreset('canon')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 transition-colors"
              >
                Canónico Veyvān
              </button>
              <button 
                onClick={() => applyPreset('monument')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-mono text-amber-300 transition-colors"
              >
                Monumental
              </button>
              <button 
                onClick={() => applyPreset('fine')}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono text-purple-300 transition-colors"
              >
                Caligrafía Fina
              </button>
              <button 
                onClick={() => applyPreset('uniform')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-400 transition-colors"
              >
                Uniforme
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trazo: Grosor Inicial */}
            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Grosor Inicio Trazo</span>
                <span className="text-cyan-300 font-mono font-bold text-xs">{strokeStartWidth.toFixed(1)} px</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.2"
                value={strokeStartWidth}
                onChange={(e) => setStrokeStartWidth(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[9px] text-slate-500 font-mono">Presión en el nexo fónico de inicio.</p>
            </div>

            {/* Trazo: Grosor Final */}
            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Grosor Fin Trazo</span>
                <span className="text-cyan-300 font-mono font-bold text-xs">{strokeEndWidth.toFixed(1)} px</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="8.0"
                step="0.2"
                value={strokeEndWidth}
                onChange={(e) => setStrokeEndWidth(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[9px] text-slate-500 font-mono">Conicidad o adelgazamiento al cerrar el radical.</p>
            </div>

            {/* Arcos: Grosor */}
            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Grosor Arcos de Vínculo</span>
                <span className="text-cyan-300 font-mono font-bold text-xs">{arcThickness.toFixed(1)} px</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="6.0"
                step="0.2"
                value={arcThickness}
                onChange={(e) => setArcThickness(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[9px] text-slate-500 font-mono">Calibre del puente conector entre matrices.</p>
            </div>

            {/* Arcos: Opacidad & Curvatura */}
            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Opacidad del Arco</span>
                <span className="text-cyan-300 font-mono font-bold text-xs">{arcOpacity}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                step="5"
                value={arcOpacity}
                onChange={(e) => setArcOpacity(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center pt-1 text-[10px] text-slate-500">
                <span>Curvatura: {arcCurvature}px</span>
                <button
                  onClick={() => setArcDash(!arcDash)}
                  className={`text-[9px] px-1.5 py-0.5 rounded border ${arcDash ? 'border-cyan-400 text-cyan-300 bg-cyan-500/20' : 'border-white/10 text-slate-500'}`}
                >
                  {arcDash ? 'Punteado' : 'Continuo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Input, Canonical Formulas & Lexicon */}
        <div className="space-y-6 lg:col-span-1">
          {/* Add custom expression */}
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl space-y-3">
            <label className="text-xs font-bold text-slate-300 font-rajdhani uppercase tracking-widest flex items-center gap-2">
              <Plus size={14} className="text-cyan-400" />
              Añadir a la Expresión Canónica
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputExpression}
                onChange={(e) => setInputExpression(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddExpression(inputExpression)}
                placeholder="Ej: Koa'Eli, Sur'Vae, Rhea'Vohn..."
                className="flex-1 bg-black/60 border border-white/10 focus:border-cyan-400/60 rounded-xl px-3.5 py-2.5 text-xs text-cyan-100 font-mono tracking-wide focus:outline-none transition-all"
              />
              <button
                onClick={() => handleAddExpression(inputExpression)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-rajdhani uppercase tracking-wider transition-colors"
              >
                Añadir
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Use apóstrofes (') para arcos de vínculo o guiones (-) para ligaduras.
            </p>
          </div>

          {/* Canonical Formulas & Proverbs catalog */}
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 font-rajdhani uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={13} className="text-cyan-400" />
                Fórmulas y Proverbios del Glosario
              </h3>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {CANONICAL_FORMULAS.map((formula, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddExpression(formula.root)}
                  className="w-full p-3 rounded-2xl bg-white/[0.02] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-left transition-all duration-300 group flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-mono font-bold text-xs text-slate-200 group-hover:text-cyan-300 truncate block">
                      {formula.root}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {formula.meaning}
                    </span>
                    <span className="text-[9px] text-slate-500 block truncate">
                      {formula.description}
                    </span>
                  </div>
                  <Plus size={14} className="text-slate-500 group-hover:text-cyan-400 flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Glossary Term Inserter */}
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 font-rajdhani uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={13} className="text-cyan-400" />
              Explorar Términos del Glosario ({terms.length})
            </h3>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Buscar término para insertar..."
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500/40"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar">
              {filteredGlossary.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleAddExpression(t.root)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/5 hover:border-cyan-500/30 text-[11px] font-mono text-slate-300 hover:text-cyan-200 transition-colors"
                >
                  +{t.root}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center / Right: Visualizer & Morphological Exegesis with AI */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Autoritative Canon & Direction Bar (Immutable Rule) */}
          <div className="p-4 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
            
            {/* CANON SELECTOR (LOCKED WITH DIRECTION) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
                <Compass size={13} className="text-cyan-400" />
                Canon & Orientación Inmutable:
              </span>
              <div className="flex rounded-xl bg-black/60 p-1 border border-white/5">
                <button
                  onClick={() => setGridMode('algante')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase transition-all ${
                    gridMode === 'algante'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Canon Algante: Matriz Horizontal (6×4) -> Disposición Vertical Canónica en Descenso"
                >
                  <Columns size={13} />
                  <span>Algante (6×4 // Vertical)</span>
                </button>
                <button
                  onClick={() => setGridMode('comun')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase transition-all ${
                    gridMode === 'comun'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Canon Común: Matriz Vertical (4×6) -> Disposición Horizontal Canónica en Friso"
                >
                  <Rows size={13} />
                  <span>Común (4×6 // Horizontal)</span>
                </button>
              </div>
            </div>

            {/* Plasma Tint */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Plasma:
              </span>
              <div className="flex gap-1.5">
                {(['cyan', 'gold', 'emerald', 'violet'] as const).map(color => (
                  <button
                    key={color}
                    onClick={() => setGlowColor(color)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      glowColor === color ? 'border-white scale-110 shadow-lg' : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: colorMap[color].plasma }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Expression Board Container */}
          <div
            ref={containerRef}
            className={`p-8 md:p-12 rounded-3xl bg-black/85 border ${currentColor.border} ${currentColor.glow} backdrop-blur-2xl relative overflow-x-auto hide-scrollbar min-h-[460px] transition-all duration-500`}
          >
            {/* Header coordinates */}
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest pb-6 border-b border-white/5 mb-8">
              <span>EXPRESIÓN TAEL'IM (VEHLAEN) // THALIOS SOLARIS</span>
              <span className="text-cyan-400/90 font-semibold">
                CANON {gridMode === 'algante' ? 'ALGANTE (6×4) // DESCENSO VERTICAL' : 'COMÚN (4×6) // SECUENCIA HORIZONTAL'} ({expressionItems.length} EXPRESIONES)
              </span>
            </div>

            {expressionItems.length === 0 ? (
              <div className="py-24 text-center text-slate-500 font-mono text-xs space-y-2">
                <Scroll size={32} className="mx-auto text-slate-600 mb-2" />
                <p>No hay expresiones en el códice.</p>
                <p className="text-[10px] text-slate-600">Añada fórmulas o términos canónicos desde el panel izquierdo.</p>
              </div>
            ) : (
              <div className={layoutMode === 'vertical' ? 'flex flex-col items-center gap-14' : 'flex items-center gap-12 min-w-max'}>
                {expressionItems.map((expr, idx) => {
                  const parsed = parseTaelimExpression(expr);
                  const isSelected = selectedIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedIndex(idx);
                        setAiInterpretation(null);
                      }}
                      className={`relative group flex flex-col items-center p-6 rounded-3xl transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.2)]'
                          : 'bg-white/[0.015] border border-white/5 hover:border-cyan-500/30'
                      }`}
                    >
                      {/* Delete item button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveExpression(idx);
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 z-20"
                        title="Eliminar de la expresión"
                      >
                        <Trash2 size={13} />
                      </button>

                      {/* MiniTaelim with parametric stroke and arc settings */}
                      <MiniTaelim
                        root={expr}
                        mode={gridMode}
                        strokeColor={currentColor.plasma}
                        showMorphemes={true}
                        showArcs={true}
                        strokeStartWidth={strokeStartWidth}
                        strokeEndWidth={strokeEndWidth}
                        strokeGlow={strokeGlow}
                        arcThickness={arcThickness}
                        arcOpacity={arcOpacity / 100}
                        arcCurvature={arcCurvature}
                        arcDash={arcDash}
                        className="filter drop-shadow-[0_0_12px_rgba(34,211,238,0.45)] max-w-full"
                      />

                      {/* Expression title and resonance audio */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-200 tracking-widest">
                          {expr}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playWordResonance(expr);
                          }}
                          className="p-1 rounded-md text-slate-500 hover:text-cyan-300 transition-colors"
                          title="Resonancia acústica"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>

                      {/* Sub-Radicals breakdown pill */}
                      <div className="flex items-center gap-1 mt-2 text-[9px] font-mono text-slate-500">
                        {parsed.units.map((unit, uIdx) => (
                          <React.Fragment key={uIdx}>
                            <span className="bg-black/50 px-1.5 py-0.5 rounded border border-white/5 text-cyan-400/90 font-semibold">
                              {unit.rootText}
                            </span>
                            {uIdx < parsed.units.length - 1 && (
                              <span className="text-cyan-500/60 font-bold">⌒</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {isSelected && (
                        <div className="mt-2 text-[9px] font-mono text-cyan-300/80 bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                          <Check size={10} />
                          <span>Expresión Seleccionada</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Board Footer */}
            <div className="mt-12 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-mono tracking-widest">
              <span>CANON LITÚRGICO // ESTACIÓN HUMANIDAD</span>
              <span className="text-cyan-400/70">SELLO EPIGRÁFICO VEYVĀN</span>
            </div>
          </div>

          {/* Morphological Exegesis & Intelligent AI Interpretation */}
          {activeExpression && parsedActive && (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                      Exégesis & Desglose Morfológico
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="font-mono font-bold text-sm text-slate-100">{activeExpression}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    {canonicalMatch ? canonicalMatch.meaning : 'Traducción analítica de radicales y conectores canónicos.'}
                  </p>
                </div>

                {/* AI Interpretation Trigger Button */}
                <button
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-rajdhani font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-50"
                >
                  <Brain size={14} className={isGeneratingAI ? 'animate-spin text-purple-400' : 'text-cyan-400'} />
                  <span>{isGeneratingAI ? 'Consultando Oráculo...' : 'Interpretar con IA (Thalios Solaris)'}</span>
                </button>
              </div>

              {/* Radical-by-Radical Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {parsedActive.units.map((unit, uIdx) => {
                  const t = findTermForRoot(unit.cleanRoot);
                  const pref = unit.prefixId ? TAELIM_MORPHEMES.find(m => m.id === unit.prefixId) : null;
                  const inf = unit.infixId ? TAELIM_MORPHEMES.find(m => m.id === unit.infixId) : null;
                  const suff = unit.suffixId ? TAELIM_MORPHEMES.find(m => m.id === unit.suffixId) : null;

                  return (
                    <div 
                      key={uIdx}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-cyan-300">
                          {unit.rootText}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                          Radical {uIdx + 1}
                        </span>
                      </div>

                      <div className="text-xs text-slate-200 font-medium">
                        {t ? t.meaning : 'Concepto raíz no catalogado'}
                      </div>

                      {t?.description && (
                        <p className="text-[10px] text-slate-400 font-light line-clamp-2">
                          {t.description}
                        </p>
                      )}

                      {/* Attached Morphemes info */}
                      {(pref || inf || suff) && (
                        <div className="pt-2 border-t border-white/5 space-y-1">
                          {pref && (
                            <div className="text-[9px] font-mono text-amber-400/90 flex items-center gap-1">
                              <span>Prefijo:</span>
                              <span className="text-slate-300">{pref.label}</span>
                            </div>
                          )}
                          {inf && (
                            <div className="text-[9px] font-mono text-emerald-400/90 flex items-center gap-1">
                              <span>Infijo:</span>
                              <span className="text-slate-300">{inf.label}</span>
                            </div>
                          )}
                          {suff && (
                            <div className="text-[9px] font-mono text-purple-400/90 flex items-center gap-1">
                              <span>Sufijo:</span>
                              <span className="text-slate-300">{suff.label}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bridge particle to next unit */}
                      {uIdx < parsedActive.arcs.length && (
                        <div className="text-[9px] font-mono text-cyan-400/70 pt-1 flex items-center gap-1">
                          <span>⌒ Arco de Vínculo:</span>
                          <span className="text-slate-300">
                            {parsedActive.arcs[uIdx]?.particleId 
                              ? TAELIM_MORPHEMES.find(m => m.id === parsedActive.arcs[uIdx].particleId)?.label || 'Relación sintáctica'
                              : 'Conexión continua'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AI Oracle Exegesis Output Card */}
              {aiInterpretation && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900/80 to-purple-950/30 border border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.15)] space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <Cpu size={15} className="text-cyan-400 animate-pulse" />
                      <h4 className="text-xs font-bold font-rajdhani uppercase tracking-widest text-cyan-200">
                        Interpretación Oracular de Thalios Solaris
                      </h4>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 font-bold">
                      Resonancia de Consciencia: {aiInterpretation.resonanceScore}%
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Traducción Trascendental & Poética:
                      </span>
                      <p className="text-slate-100 font-medium text-sm mt-0.5 italic">
                        "{aiInterpretation.transcendentalTranslation}"
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Exégesis Filosófica de la Composición:
                      </span>
                      <p className="text-slate-300 font-light mt-0.5 leading-relaxed">
                        {aiInterpretation.philosophicalExegesis}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                          Sociolecto & Geometría del Ego:
                        </span>
                        <p className="text-[11px] text-slate-300 font-light">
                          {aiInterpretation.egoGeometry}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-1">
                          Consejo de la Estación:
                        </span>
                        <p className="text-[11px] text-slate-300 font-light">
                          {aiInterpretation.oracleBlessing}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CodexComposer;
