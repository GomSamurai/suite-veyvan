import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Volume2, 
  Sliders, 
  Layers, 
  Eye, 
  Maximize2, 
  Compass, 
  Feather, 
  CircleDot, 
  Triangle, 
  Square, 
  Infinity as InfinityIcon, 
  Wind, 
  Play, 
  Pause, 
  Move, 
  RotateCw, 
  ZoomIn, 
  Palette, 
  Radio, 
  Link, 
  Undo2,
  Spline,
  Crosshair,
  Bookmark,
  BookmarkPlus,
  FolderOpen,
  Upload,
  Trash2,
  Search,
  Filter,
  Route,
  PenTool,
  Droplets,
  Grid3X3,
  Wand2,
  Circle,
  Hash,
  ArrowRight,
  BoxSelect,
  Plus,
  X,
  Zap,
  Scale,
  Orbit,
  MousePointer
} from 'lucide-react';
import { TAELIM_MORPHEMES } from '../data/taelimRules';
import { useLexicon } from '../context/LexiconContext';
import { 
  CalligramConfig, 
  CalligramGeometry, 
  CalligramPalette, 
  CalligramAiInsight,
  CalligramPreset,
  StrokeStyleMode,
  ArcStyleMode,
  ArcColorMode,
  UnitCustomTransform
} from '../types';
import { generateCalligramSvg, computeCalligramBounds, PALETTES } from '../utils/calligramSvgEngine';
import { parseTaelimExpression } from '../utils/taelimParser';
import { 
  analyzeCalligramOntology, 
  getHeuristicCalligramInsight,
  generateSigilFromPrompt,
  autoHarmonizeComposition,
  GeneratedSigilResult
} from '../services/calligramAiService';
import { playWordResonance } from '../utils/taelimAudio';
import { thaliosVoice } from '../services/thaliosVoiceService';
import { 
  CANONICAL_PRESETS, 
  loadCustomPresets, 
  saveCustomPreset, 
  deleteCustomPreset, 
  exportPresetsToJson, 
  importPresetsFromJson 
} from '../utils/calligramPresets';

export interface CanonicalFormulaItem {
  id: string;
  label: string;
  text: string;
  isDefault?: boolean;
}

const DEFAULT_CANONICAL_SIGILS: CanonicalFormulaItem[] = [
  { id: 'sigil-1', label: "Amor y Distancia Sagrada", text: "Thima · Varin'Vim ·· Vor'aen · Nu-Dar", isDefault: true },
  { id: 'sigil-2', label: "Juramento Alévoro", text: "Dun'Val'Thy", isDefault: true },
  { id: 'sigil-3', label: "Despertar Colectivo", text: "Kael'Dran ·· Sol'Khor", isDefault: true },
  { id: 'sigil-4', label: "Energía del Vacío", text: "Vael'nu'Siv ·· Vael'Vim", isDefault: true },
  { id: 'sigil-5', label: "Luz en el Centro", text: "Koa'na'Eli", isDefault: true },
  { id: 'sigil-6', label: "Memoria y Futuro", text: "Min'Nu-Sha · Vor-Rhea", isDefault: true },
  { id: 'sigil-7', label: "Fricción y Ascenso", text: "Dran'Valniae ·· Kael'Vas", isDefault: true },
  { id: 'sigil-8', label: "Silencio del Templo", text: "Khuva'na'Siv · Dua'Khaen", isDefault: true }
];

const GEOMETRY_INFO: Record<CalligramGeometry, { label: string; desc: string; icon: any }> = {
  mandala: {
    label: "Mandala Orbital",
    desc: "Sello concéntrico del Rhea. Los radicales orbitan el núcleo sagrado (Koa) unidos por arcos circulares.",
    icon: CircleDot
  },
  estela: {
    label: "Estela Monolítica",
    desc: "Tótem vertical entrelazado. Formato ceremonial de la casta Algante grabado en monolitos de obsidiana.",
    icon: Layers
  },
  delta: {
    label: "Delta Sagrado",
    desc: "Triángulo de fricción y salto evolutivo (Dran / Kael). La tensión material transmuta en despertar.",
    icon: Triangle
  },
  diamante: {
    label: "Diamante de Contención",
    desc: "Rombo de templo interior (Khaen / Dua). Cuatro esquinas de invulnerabilidad ante el abismo.",
    icon: Square
  },
  infinito: {
    label: "Lazo de Kosmir",
    desc: "Lemniscata universal de retorno cíclico. Disuelve los límites individuales en la red de almas.",
    icon: InfinityIcon
  },
  asemic: {
    label: "Monotrazado Asémico",
    desc: "Pincelada continua del aliento (Vira). Un solo trazo fluido que unifica todos los nexos fónicos.",
    icon: Wind
  }
};

const STROKE_STYLES: { id: StrokeStyleMode; label: string; desc: string }[] = [
  {
    id: 'plasma',
    label: 'Plasma Litúrgico',
    desc: 'Luminiscencia fluida y viva. Trazo de energía pura propio de los santuarios centrales de la Estación.'
  },
  {
    id: 'filigrana',
    label: 'Filigrana Áurea',
    desc: 'Bordes pulidos con nervio dorado central. Inscripción ceremonial de alta jerarquía Algante.'
  },
  {
    id: 'organico',
    label: 'Orgánico Algante',
    desc: 'Pincelada tradicional con modulaciones naturales de grosor según la presión del cálamo.'
  },
  {
    id: 'precision',
    label: 'Precisión de Obsidiana',
    desc: 'Corte vectorial afilado y riguroso. Geometría pura de los ingenieros de mamparo.'
  }
];

const ARC_STYLES: { id: ArcStyleMode; label: string; desc: string }[] = [
  {
    id: 'continuo',
    label: 'Continuo Sagrado',
    desc: 'Arco Bézier inquebrantable fluido que canaliza la resonancia entre fonemas contiguos.'
  },
  {
    id: 'punteado',
    label: 'Punteado Rítmico',
    desc: 'Puntuación fónica de cadencia Veyvān. Marca las pausas sagradas de respiración.'
  },
  {
    id: 'pulsos',
    label: 'Pulsos Cuánticos',
    desc: 'Segmentos de transferencia energética entre radicales distantes.'
  },
  {
    id: 'doble',
    label: 'Doble Concéntrico',
    desc: 'Canal ceremonial dual de alta jerarquía. Refuerza los lazos inquebrantables del juramento.'
  }
];

const ARC_COLORS: { id: ArcColorMode | 'violet' | 'cyan'; label: string; color: string }[] = [
  { id: 'sincronizado', label: 'Sincronizado', color: '#22d3ee' },
  { id: 'dorado', label: 'Oro Algante', color: '#fbbf24' },
  { id: 'plata', label: 'Plata Mamparo', color: '#e2e8f0' },
  { id: 'esmeralda', label: 'Esmeralda Veyvān', color: '#34d399' },
  { id: 'violet', label: 'Violeta Kosmir', color: '#a855f7' },
  { id: 'cyan', label: 'Cian Cuántico', color: '#06b6d4' }
];

export type CalligramTab = 'vinculos' | 'morfologia' | 'trazo' | 'fisica' | 'matriz' | 'color' | 'estilos';

const DEFAULT_CONFIG: CalligramConfig = {
  geometry: 'mandala',
  palette: 'uniae',
  gridMode: 'algante',
  matrixGap: 130,
  intertwineLevel: 35,
  strokeWidth: 3.5,
  arcTension: 55,
  glowIntensity: 65,
  showNexuses: true,
  showDiacritics: true,
  showParticles: true,
  showChromaticResonance: true,
  stelaRotation: 0,
  sacredScale: 1.0,
  breathingAnimation: false, // Iniciar en reposo estático para diseño sin molestias
  globalRadius: 260,
  penAngle: 45,
  calligraphyInfluence: 40,
  strokeRenderMode: 'plasma',
  arcThickness: 2.5,
  arcStyle: 'continuo',
  arcColorMode: 'sincronizado',
  arcOpacity: 85,
  arcGlow: 6,
  showArcTerminals: true,
  showSacredGuides: true,
  smoothEnds: true,
  nodeStartPressure: 1.0,
  nodeMidPressure: 1.0,
  nodeEndPressure: 1.0,
  tension: 0.35,
  fluidity: 15,
  waveFreq: 0,
  waveAmp: 0,
  echoes: 0,
  echoOffset: 10,
  inkDensity: 0,
  particles: 0,
  erosion: 0,
  colorMode: 'palette',
  customColorPrimary: '#06b6d4',
  customColorSecondary: '#a5f3fc',
  customColorBackground: '#030712',
  customColorArc: '',
  isGradient: false,
  gradientColors: { start: '#06b6d4', end: '#a855f7' },
  diacriticScale: 1.0,
  diacriticThickness: 2.0,
  customTransforms: {}
};

const CalligramStudio: React.FC = () => {
  const { targetCalligramExpression, setTargetCalligramExpression } = useLexicon();

  const [expression, setExpression] = useState<string>(() => {
    return targetCalligramExpression || "Thima · Varin'Vim ·· Vor'aen · Nu-Dar";
  });

  const [config, setConfig] = useState<CalligramConfig>(DEFAULT_CONFIG);
  const [activeTabPanel, setActiveTabPanel] = useState<CalligramTab>('vinculos');

  // Estado del Sistema de Fórmulas Canónicas y Personalizadas
  const [canonicalFormulas, setCanonicalFormulas] = useState<CanonicalFormulaItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taelvohn_canonical_formulas_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return DEFAULT_CANONICAL_SIGILS;
  });
  const [showAddFormulaInput, setShowAddFormulaInput] = useState<boolean>(false);
  const [newFormulaLabel, setNewFormulaLabel] = useState<string>('');

  // Estado del Sistema de Estilos y Presets
  const [customPresets, setCustomPresets] = useState<CalligramPreset[]>(() => loadCustomPresets());
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>('rhea-primordial');
  const [presetSearch, setPresetSearch] = useState<string>('');
  const [presetCategoryFilter, setPresetCategoryFilter] = useState<'todos' | 'liturgico' | 'castas' | 'mistico' | 'asemic' | 'personalizado'>('todos');
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [newPresetDesc, setNewPresetDesc] = useState<string>('');
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado de Selección Múltiple y Arrastre por Marco (Marquee) en el Lienzo
  const [selectedRadicalIndices, setSelectedRadicalIndices] = useState<number[]>([]);
  const selectedRadicalIndex = selectedRadicalIndices.length === 1 ? selectedRadicalIndices[0] : null;
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState<boolean>(false);
  const [marqueeBox, setMarqueeBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number }>({ clientX: 0, clientY: 0 });
  const dragTransformStartMapRef = useRef<Record<number, { offsetX: number; offsetY: number }>>({});
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Estado del Oráculo Ontológico e Inteligencia Artificial
  const [aiInsight, setAiInsight] = useState<CalligramAiInsight | null>(null);
  const [isConsultingAi, setIsConsultingAi] = useState<boolean>(false);
  const [copiedSvg, setCopiedSvg] = useState<boolean>(false);
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);

  // Generador de Sigilos por IA y Auto-Armonización
  const [showAiSigilModal, setShowAiSigilModal] = useState<boolean>(false);
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [isGeneratingSigilAi, setIsGeneratingSigilAi] = useState<boolean>(false);
  const [isAiHarmonizing, setIsAiHarmonizing] = useState<boolean>(false);
  const [aiHarmonizeFeedback, setAiHarmonizeFeedback] = useState<string | null>(null);

  // Sincronizar si cambia desde otra pestaña (ej. Traductor)
  useEffect(() => {
    if (targetCalligramExpression && targetCalligramExpression !== expression) {
      setExpression(targetCalligramExpression);
      setSelectedRadicalIndices([]);
    }
  }, [targetCalligramExpression]);

  // Sincronizar estado reactivo de locución con la Voz de Thalios
  useEffect(() => {
    const unsub = thaliosVoice.subscribe((s) => {
      setIsPlayingSound(s.isSpeaking);
    });
    return () => unsub();
  }, []);

  // Guardar fórmulas canónicas en localStorage
  const saveFormulasToStorage = (updated: CanonicalFormulaItem[]) => {
    setCanonicalFormulas(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('taelvohn_canonical_formulas_v2', JSON.stringify(updated));
    }
  };

  // Lista combinada de todos los presets
  const allPresets = useMemo(() => {
    return [...CANONICAL_PRESETS, ...customPresets];
  }, [customPresets]);

  // Filtrado de presets para el catálogo
  const filteredPresets = useMemo(() => {
    return allPresets.filter(p => {
      const matchCategory = presetCategoryFilter === 'todos' || p.category === presetCategoryFilter;
      const matchSearch = !presetSearch.trim() || 
        p.name.toLowerCase().includes(presetSearch.toLowerCase()) || 
        p.description.toLowerCase().includes(presetSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [allPresets, presetCategoryFilter, presetSearch]);

  // Parsear unidades de la expresión actual
  const parsedExpr = useMemo(() => {
    try {
      return parseTaelimExpression(expression);
    } catch {
      return { units: [], bridgeArcs: [] };
    }
  }, [expression]);

  // Generación SVG Reactiva pasando los índices seleccionados para resaltarlos conjuntamente
  const svgMarkup = useMemo(() => {
    try {
      return generateCalligramSvg(expression, config, selectedRadicalIndices);
    } catch (err) {
      console.error("Error al generar caligrama SVG:", err);
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><text x="500" y="500" fill="#22d3ee" text-anchor="middle" font-family="sans-serif" font-size="18">Sintonizando Sigilo...</text></svg>`;
    }
  }, [expression, config, selectedRadicalIndices]);

  // Aplicar un Preajuste de Estilo
  const handleApplyPreset = (preset: CalligramPreset) => {
    setConfig(prev => ({
      ...prev,
      ...preset.config,
      // Conservar o reiniciar transformaciones individuales según configuración del preset
      customTransforms: preset.config.customTransforms || {}
    }));
    setAppliedPresetId(preset.id);
  };

  // Guardar Nuevo Estilo Personalizado
  const handleSaveCustomPreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: CalligramPreset = {
      id: `usr-estilo-${Date.now()}`,
      name: newPresetName.trim(),
      description: newPresetDesc.trim() || 'Estilo personalizado de la forja Veyvān.',
      category: 'personalizado',
      createdAt: new Date().toLocaleDateString('es-ES'),
      config: {
        ...config,
        customTransforms: { ...(config.customTransforms || {}) }
      }
    };

    const updated = saveCustomPreset(newPreset);
    setCustomPresets(updated);
    setAppliedPresetId(newPreset.id);
    setNewPresetName('');
    setNewPresetDesc('');
    setSaveStatusMsg('¡Estilo guardado con éxito en tu Bóveda Personal!');
    setTimeout(() => setSaveStatusMsg(null), 3000);
  };

  // Eliminar Estilo Personalizado
  const handleDeleteCustomPreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("¿Deseas desvanecer este estilo de tu bóveda personal?")) {
      const updated = deleteCustomPreset(id);
      setCustomPresets(updated);
      if (appliedPresetId === id) {
        setAppliedPresetId(null);
      }
    }
  };

  // Exportar Bóveda de Estilos a JSON
  const handleExportCustomPresets = () => {
    if (customPresets.length === 0) {
      alert("No hay estilos personalizados guardados para exportar.");
      return;
    }
    const jsonStr = exportPresetsToJson(customPresets);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Boveda_Estilos_Taelvohn_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Importar Estilos desde Archivo JSON
  const handleImportCustomPresets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = importPresetsFromJson(content);
        setCustomPresets(imported);
        alert(`¡Se han cargado e integrado los estilos en tu bóveda con éxito!`);
      } catch (err: any) {
        alert("Error al importar el archivo de estilos: " + (err.message || 'Formato no reconocido'));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Manejador de Selección por Marco (Marquee) y Arrastre de Símbolos sobre el Lienzo
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | SVGElement | null;

    // Si el clic es sobre un botón, input, control de interfaz o barra de herramientas, permitir su funcionamiento sin interferir
    if (
      target?.closest('button') || 
      target?.closest('[data-canvas-controls]') || 
      target?.closest('input') || 
      target?.closest('select')
    ) {
      return;
    }

    const radicalEl = target?.closest?.('[data-radical-index]');
    const rect = svgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const svgX = ((e.clientX - rect.left) / rect.width) * 1000;
    const svgY = ((e.clientY - rect.top) / rect.height) * 1000;

    if (radicalEl) {
      // 1. Clic sobre un radical/símbolo
      const idxStr = radicalEl.getAttribute('data-radical-index');
      if (idxStr !== null) {
        const idx = parseInt(idxStr, 10);
        if (!isNaN(idx)) {
          let newSelection = selectedRadicalIndices;

          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            // Alternar selección con teclas modificadoras
            newSelection = selectedRadicalIndices.includes(idx)
              ? selectedRadicalIndices.filter(i => i !== idx)
              : [...selectedRadicalIndices, idx];
            setSelectedRadicalIndices(newSelection);
          } else {
            // Si el elemento no está en la selección actual, seleccionarlo exclusivamente
            // Si ya está seleccionado junto con otros, conservar la selección para arrastrar todos juntos
            if (!selectedRadicalIndices.includes(idx)) {
              newSelection = [idx];
              setSelectedRadicalIndices(newSelection);
            }
          }

          setIsDragging(true);
          dragStartRef.current = { clientX: e.clientX, clientY: e.clientY };

          // Registrar coordenadas iniciales de todos los elementos seleccionados para moverlos en bloque
          const initialMap: Record<number, { offsetX: number; offsetY: number }> = {};
          newSelection.forEach(selIdx => {
            const curT = config.customTransforms?.[selIdx] || {
              index: selIdx,
              offsetX: 0,
              offsetY: 0,
              rotation: 0,
              scale: 1.0
            };
            initialMap[selIdx] = { offsetX: curT.offsetX, offsetY: curT.offsetY };
          });
          dragTransformStartMapRef.current = initialMap;

          try {
            (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          } catch {}
          e.preventDefault();
        }
      }
    } else {
      // 2. Clic sobre el fondo del lienzo: Iniciar selección por marco (Marquee)
      if (!e.shiftKey && !e.ctrlKey) {
        setSelectedRadicalIndices([]);
      }
      setIsMarqueeSelecting(true);
      setMarqueeBox({ startX: svgX, startY: svgY, currentX: svgX, currentY: svgY });
      try {
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      } catch {}
      e.preventDefault();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = svgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isDragging && selectedRadicalIndices.length > 0) {
      // Arrastre conjunto de todos los radicales seleccionados
      const svgScale = 1000 / rect.width;
      const deltaX = (e.clientX - dragStartRef.current.clientX) * svgScale;
      const deltaY = (e.clientY - dragStartRef.current.clientY) * svgScale;

      setConfig(prev => {
        const updatedTransforms = { ...(prev.customTransforms || {}) };
        selectedRadicalIndices.forEach(idx => {
          const startT = dragTransformStartMapRef.current[idx] || { offsetX: 0, offsetY: 0 };
          const current = updatedTransforms[idx] || {
            index: idx,
            offsetX: 0,
            offsetY: 0,
            rotation: 0,
            scale: 1.0
          };
          updatedTransforms[idx] = {
            ...current,
            offsetX: Math.round(startT.offsetX + deltaX),
            offsetY: Math.round(startT.offsetY + deltaY)
          };
        });
        return {
          ...prev,
          customTransforms: updatedTransforms
        };
      });
    } else if (isMarqueeSelecting && marqueeBox) {
      // Actualizar marco de selección rectangular
      const currentX = Math.max(0, Math.min(1000, ((e.clientX - rect.left) / rect.width) * 1000));
      const currentY = Math.max(0, Math.min(1000, ((e.clientY - rect.top) / rect.height) * 1000));

      setMarqueeBox(prev => prev ? { ...prev, currentX, currentY } : null);

      const minX = Math.min(marqueeBox.startX, currentX);
      const maxX = Math.max(marqueeBox.startX, currentX);
      const minY = Math.min(marqueeBox.startY, currentY);
      const maxY = Math.max(marqueeBox.startY, currentY);

      // Detectar radicales que colisionan con el marco mediante sus atributos de posición
      const radicalElements = svgContainerRef.current?.querySelectorAll('[data-radical-index]');
      const insideIndices: number[] = [];
      radicalElements?.forEach(el => {
        const idx = parseInt(el.getAttribute('data-radical-index') || '-1', 10);
        const cx = parseFloat(el.getAttribute('data-cx') || '-9999');
        const cy = parseFloat(el.getAttribute('data-cy') || '-9999');
        if (idx >= 0 && cx >= minX && cx <= maxX && cy >= minY && cy <= maxY) {
          insideIndices.push(idx);
        }
      });

      setSelectedRadicalIndices(insideIndices);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
    }
    if (isMarqueeSelecting) {
      setIsMarqueeSelecting(false);
      setMarqueeBox(null);
    }
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // Transformación del radical activo individual
  const activeTransform: UnitCustomTransform = useMemo(() => {
    if (selectedRadicalIndex === null) {
      return { index: 0, offsetX: 0, offsetY: 0, rotation: 0, scale: 1.0 };
    }
    return config.customTransforms?.[selectedRadicalIndex] || {
      index: selectedRadicalIndex,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      scale: 1.0
    };
  }, [config.customTransforms, selectedRadicalIndex]);

  // Actualizar propiedades del radical seleccionado individualmente
  const updateSelectedTransform = (patch: Partial<UnitCustomTransform>) => {
    if (selectedRadicalIndex === null) return;
    setConfig(prev => {
      const current = prev.customTransforms?.[selectedRadicalIndex] || {
        index: selectedRadicalIndex,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scale: 1.0
      };
      return {
        ...prev,
        customTransforms: {
          ...(prev.customTransforms || {}),
          [selectedRadicalIndex]: {
            ...current,
            ...patch
          }
        }
      };
    });
  };

  // Escalar todos los radicales seleccionados conjuntamente
  const updateGroupScale = (scaleMultiplier: number) => {
    if (selectedRadicalIndices.length === 0) return;
    setConfig(prev => {
      const updated = { ...(prev.customTransforms || {}) };
      selectedRadicalIndices.forEach(idx => {
        const current = updated[idx] || { index: idx, offsetX: 0, offsetY: 0, rotation: 0, scale: 1.0 };
        updated[idx] = {
          ...current,
          scale: Number(Math.min(6.0, Math.max(0.2, current.scale * scaleMultiplier)).toFixed(2))
        };
      });
      return { ...prev, customTransforms: updated };
    });
  };

  // Asignar escala absoluta para toda la selección grupal
  const setGroupAbsoluteScale = (newScale: number) => {
    if (selectedRadicalIndices.length === 0) return;
    setConfig(prev => {
      const updated = { ...(prev.customTransforms || {}) };
      selectedRadicalIndices.forEach(idx => {
        const current = updated[idx] || { index: idx, offsetX: 0, offsetY: 0, rotation: 0, scale: 1.0 };
        updated[idx] = {
          ...current,
          scale: Number(Math.min(6.0, Math.max(0.2, newScale)).toFixed(2))
        };
      });
      return { ...prev, customTransforms: updated };
    });
  };

  // Rotar todos los radicales seleccionados conjuntamente
  const updateGroupRotation = (deltaDeg: number) => {
    if (selectedRadicalIndices.length === 0) return;
    setConfig(prev => {
      const updated = { ...(prev.customTransforms || {}) };
      selectedRadicalIndices.forEach(idx => {
        const current = updated[idx] || { index: idx, offsetX: 0, offsetY: 0, rotation: 0, scale: 1.0 };
        updated[idx] = {
          ...current,
          rotation: (current.rotation + deltaDeg) % 360
        };
      });
      return { ...prev, customTransforms: updated };
    });
  };

  // Asignar rotación absoluta para toda la selección grupal
  const setGroupAbsoluteRotation = (newRot: number) => {
    if (selectedRadicalIndices.length === 0) return;
    setConfig(prev => {
      const updated = { ...(prev.customTransforms || {}) };
      selectedRadicalIndices.forEach(idx => {
        const current = updated[idx] || { index: idx, offsetX: 0, offsetY: 0, rotation: 0, scale: 1.0 };
        updated[idx] = {
          ...current,
          rotation: newRot
        };
      });
      return { ...prev, customTransforms: updated };
    });
  };

  // Restablecer el radical seleccionado
  const handleResetSelectedRadical = () => {
    if (selectedRadicalIndex === null) return;
    setConfig(prev => {
      const copy = { ...(prev.customTransforms || {}) };
      delete copy[selectedRadicalIndex];
      return { ...prev, customTransforms: copy };
    });
  };

  // Restablecer el grupo de radicales seleccionados
  const handleResetSelectedGroup = () => {
    if (selectedRadicalIndices.length === 0) return;
    setConfig(prev => {
      const copy = { ...(prev.customTransforms || {}) };
      selectedRadicalIndices.forEach(idx => {
        delete copy[idx];
      });
      return { ...prev, customTransforms: copy };
    });
  };

  // Seleccionar todos los radicales
  const handleSelectAllRadicals = () => {
    const all = parsedExpr.units.map((_, i) => i);
    setSelectedRadicalIndices(all);
  };

  // Deseleccionar todo
  const handleDeselectAll = () => {
    setSelectedRadicalIndices([]);
  };

  // Restablecer todas las transformaciones dinámicas
  const handleResetAllRadicals = () => {
    setConfig(prev => ({
      ...prev,
      customTransforms: {}
    }));
  };

  // AUTO-AJUSTAR AL LIENZO: Maximiza la composición para ocupar el 80% del lienzo y centrarla
  const handleFitToBounds = () => {
    const bounds = computeCalligramBounds(expression, config);
    const targetDim = 780; // Márgenes estéticos de 110px a los bordes
    const currentDim = Math.max(bounds.width, bounds.height);
    if (currentDim > 20) {
      const factor = targetDim / currentDim;
      const newScale = Math.min(6.0, Math.max(0.2, (config.sacredScale || 1.0) * factor));
      const shiftX = Math.round(500 - bounds.centerX);
      const shiftY = Math.round(500 - bounds.centerY);

      setConfig(prev => {
        const updated = { ...(prev.customTransforms || {}) };
        parsedExpr.units.forEach((_, idx) => {
          const t = updated[idx] || { index: idx, offsetX: 0, offsetY: 0, rotation: 0, scale: 1.0 };
          updated[idx] = {
            ...t,
            offsetX: t.offsetX + shiftX,
            offsetY: t.offsetY + shiftY
          };
        });
        return {
          ...prev,
          sacredScale: Number(newScale.toFixed(2)),
          customTransforms: updated
        };
      });
    }
  };

  // Disposiciones Sagradas Inteligentes (Presets de Geometría)
  const handleApplyGoldenSpiral = () => {
    const count = parsedExpr.units.length;
    if (count === 0) return;
    const updated: Record<number, UnitCustomTransform> = {};
    const phi = 137.5 * (Math.PI / 180);
    for (let i = 0; i < count; i++) {
      const r = 75 * Math.sqrt(i + 1);
      const theta = i * phi;
      updated[i] = {
        index: i,
        offsetX: Math.round(r * Math.cos(theta)),
        offsetY: Math.round(r * Math.sin(theta)),
        rotation: Math.round((theta * 180) / Math.PI),
        scale: Number(Math.max(0.6, 1.35 - (i * 0.12)).toFixed(2))
      };
    }
    setConfig(prev => ({ ...prev, customTransforms: updated }));
  };

  const handleApplySymmetry = () => {
    const count = parsedExpr.units.length;
    if (count === 0) return;
    const updated: Record<number, UnitCustomTransform> = {};
    for (let i = 0; i < count; i++) {
      const isLeft = i % 2 === 0;
      const pairIdx = Math.floor(i / 2);
      const dist = 140 + pairIdx * 90;
      updated[i] = {
        index: i,
        offsetX: isLeft ? -dist : dist,
        offsetY: (pairIdx - (count / 4)) * 70,
        rotation: isLeft ? -15 : 15,
        scale: 1.0
      };
    }
    setConfig(prev => ({ ...prev, customTransforms: updated }));
  };

  const handleApplyPyramid = () => {
    const count = parsedExpr.units.length;
    if (count === 0) return;
    const updated: Record<number, UnitCustomTransform> = {};
    for (let i = 0; i < count; i++) {
      const layer = Math.floor(Math.sqrt(2 * i + 0.25) - 0.5);
      const layerY = (layer - 1) * 160;
      const layerCount = layer + 1;
      const posInLayer = i - (layer * (layer + 1)) / 2;
      const layerX = (posInLayer - (layerCount - 1) / 2) * 200;
      updated[i] = {
        index: i,
        offsetX: Math.round(layerX),
        offsetY: Math.round(layerY),
        rotation: 0,
        scale: Number(Math.max(0.7, 1.35 - layer * 0.2).toFixed(2))
      };
    }
    setConfig(prev => ({ ...prev, customTransforms: updated }));
  };

  // GESTIÓN DE FÓRMULAS CANÓNICAS
  const handleAddCurrentFormula = () => {
    if (!expression.trim()) return;
    const label = newFormulaLabel.trim() || `Sigilo de ${parsedExpr.units[0]?.cleanRoot || 'Pacto'}`;
    const newFormula: CanonicalFormulaItem = {
      id: `usr-sigil-${Date.now()}`,
      label,
      text: expression.trim(),
      isDefault: false
    };
    const updated = [...canonicalFormulas, newFormula];
    saveFormulasToStorage(updated);
    setNewFormulaLabel('');
    setShowAddFormulaInput(false);
  };

  const handleDeleteFormula = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("¿Deseas retirar esta fórmula sagrada de la lista?")) {
      const updated = canonicalFormulas.filter(f => f.id !== id);
      saveFormulasToStorage(updated);
    }
  };

  const handleRestoreDefaultFormulas = () => {
    if (window.confirm("¿Restablecer las fórmulas canónicas predeterminadas del Rhea?")) {
      saveFormulasToStorage(DEFAULT_CANONICAL_SIGILS);
    }
  };

  // IA: INVOCAR GENERADOR DE SIGILOS POR IA
  const handleInvokeAiSigil = async () => {
    if (!aiPromptInput.trim()) return;
    setIsGeneratingSigilAi(true);
    try {
      const res: GeneratedSigilResult = await generateSigilFromPrompt(aiPromptInput);
      setExpression(res.expression);
      setTargetCalligramExpression(res.expression);
      setSelectedRadicalIndices([]);
      setConfig(prev => ({
        ...prev,
        geometry: res.recommendedGeometry,
        palette: res.recommendedPalette,
        arcStyle: res.arcStyle as ArcStyleMode,
        arcTension: res.arcTension,
        sacredScale: res.sacredScale,
        customTransforms: {}
      }));
      setAiPromptInput('');
      setShowAiSigilModal(false);
    } catch (err) {
      console.error("Error al generar sigilo con IA:", err);
    } finally {
      setIsGeneratingSigilAi(false);
    }
  };

  // IA: AUTO-ARMONIZACIÓN SAGRADA POR IA
  const handleAutoHarmonizeComposition = () => {
    setIsAiHarmonizing(true);
    try {
      const result = autoHarmonizeComposition(expression, parsedExpr.units.length, config.geometry);
      setConfig(prev => ({
        ...prev,
        sacredScale: result.recommendedScale,
        matrixGap: result.recommendedGap,
        arcTension: result.recommendedTension,
        intertwineLevel: result.recommendedIntertwine,
        customTransforms: result.customTransforms
      }));
      setAiHarmonizeFeedback(result.explanation);
      setTimeout(() => setAiHarmonizeFeedback(null), 6000);
    } catch (err) {
      console.error("Error en auto-armonización:", err);
    } finally {
      setIsAiHarmonizing(false);
    }
  };

  // Consulta Ontológica de IA al cargar o al solicitar
  const handleConsultOracle = async () => {
    if (!expression.trim()) return;
    setIsConsultingAi(true);
    try {
      const insight = await analyzeCalligramOntology(expression);
      setAiInsight(insight);
    } catch {
      setAiInsight(getHeuristicCalligramInsight(expression));
    } finally {
      setIsConsultingAi(false);
    }
  };

  // Aplicar sugerencias del Oráculo con un clic
  const handleApplyOracleSuggestions = () => {
    if (!aiInsight) return;
    setConfig(prev => ({
      ...prev,
      geometry: aiInsight.recommendedGeometry,
      palette: aiInsight.recommendedPalette
    }));
  };

  // Reproducir enunciación ceremonial de la frase con la Voz de Thalios (Gemini / Kokoro / Web Speech)
  const handlePronounceExpression = async () => {
    if (thaliosVoice.isSpeaking()) {
      thaliosVoice.stop();
      setIsPlayingSound(false);
      return;
    }
    const textToSpeak = expression.trim();
    if (!textToSpeak) return;

    setIsPlayingSound(true);
    try {
      await thaliosVoice.speak(textToSpeak, {
        title: `Fórmula Tael'vohn // ${textToSpeak.slice(0, 36)}`,
        onEnd: () => setIsPlayingSound(false),
        onError: (err) => {
          console.error("Error al pronunciar fórmula:", err);
          setIsPlayingSound(false);
        },
      });
    } catch (err) {
      console.error("Error al sintetizar:", err);
      setIsPlayingSound(false);
    }
  };

  // Reproducir acorde de resonancia fónica y enunciación sagrada
  const handlePlayResonance = async () => {
    if (thaliosVoice.isSpeaking()) {
      thaliosVoice.stop();
      setIsPlayingSound(false);
      return;
    }
    const textToSpeak = expression.trim();
    if (!textToSpeak) return;

    setIsPlayingSound(true);
    // Tocar el acorde armónico característico de los fonemas
    playWordResonance(textToSpeak);

    // Y pronunciar con la voz sagrada de Thalios
    try {
      await thaliosVoice.speak(textToSpeak, {
        title: `Resonancia // ${textToSpeak.slice(0, 36)}`,
        onEnd: () => setIsPlayingSound(false),
        onError: () => setIsPlayingSound(false),
      });
    } catch {
      setIsPlayingSound(false);
    }
  };

  const handlePlaySound = handlePronounceExpression;

  // Descargar SVG
  const handleDownloadSvg = () => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const cleanName = expression.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    a.href = url;
    a.download = `Sigilo_Taelvohn_${cleanName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copiar SVG al portapapeles
  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgMarkup);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    } catch (err) {
      console.error("Error al copiar SVG:", err);
    }
  };

  // Exportar como imagen PNG de alta resolución (2048x2048)
  const handleDownloadPng = () => {
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fondo abisal puro
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, 2048, 2048);
      ctx.drawImage(img, 0, 0, 2048, 2048);

      canvas.toBlob(blob => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanName = expression.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
        a.href = pngUrl;
        a.download = `Caligrama_Taelvohn_${cleanName}_2048.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };

    img.src = url;
  };

  const currentPalette = PALETTES[config.palette] || PALETTES.uniae;

  return (
    <div className="space-y-6 w-full max-w-[99vw] 2xl:max-w-[1920px] mx-auto pb-12 select-none">
      {/* Encabezado Ceremonial */}
      <div className="relative border border-white/10 rounded-3xl p-6 md:p-8 bg-slate-950/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                <Sparkles size={12} className="animate-pulse" />
                <span>Protocolo Tael'vohn // Taller Maestro de Sigilos</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                ● Veyvān Canon 4.8
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-rajdhani text-white uppercase tracking-wider">
              Forja de Caligramas y Sigilos del Rhea
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl leading-relaxed">
              Fusión de radicales, arcos de vínculo y afijos en composiciones sagradas vivas. Manipulación libre de símbolos en el lienzo con arcos dinámicos inquebrantables y bóveda completa de estilos.
            </p>
          </div>

          {/* Acciones Rápidas del Encabezado */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePlayResonance}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                isPlayingSound 
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
              title="Escuchar acorde fónico y resonancia de la enunciación"
            >
              <Volume2 size={14} className={isPlayingSound ? 'animate-bounce text-cyan-300' : ''} />
              <span>Resonancia</span>
            </button>

            {/* Auto-Armonizar Composición por IA */}
            <button
              onClick={handleAutoHarmonizeComposition}
              disabled={isAiHarmonizing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer disabled:opacity-50"
              title="Auto-recalibra escala, tensiones y geometría de forma áurea según las raíces"
            >
              <Zap size={14} className={isAiHarmonizing ? "animate-spin text-cyan-300" : "text-cyan-400"} />
              <span>{isAiHarmonizing ? 'Armonizando...' : 'Auto-Armonizar (IA)'}</span>
            </button>

            {/* Generador de Sigilos por IA */}
            <button
              onClick={() => setShowAiSigilModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-bold font-rajdhani uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)] cursor-pointer"
              title="Crear un sigilo completo a partir de una intención en español"
            >
              <Sparkles size={14} />
              <span>Oráculo de Sigilos (IA)</span>
            </button>

            <button
              onClick={handleConsultOracle}
              disabled={isConsultingAi}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              <Compass size={14} className={isConsultingAi ? "animate-spin text-emerald-400" : "text-slate-400"} />
              <span>{isConsultingAi ? 'Consultando...' : 'Consejo Ontológico'}</span>
            </button>
          </div>
        </div>

        {/* Feedback de Auto-Armonización por IA */}
        {aiHarmonizeFeedback && (
          <div className="mt-4 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-3 text-xs font-mono text-cyan-200 animate-fade-in shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400 shrink-0" />
              <span>{aiHarmonizeFeedback}</span>
            </div>
            <button
              onClick={() => setAiHarmonizeFeedback(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Barra de Entrada de Enunciación Transversal */}
        <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-bold">
            Enunciación en Dialecto Transversal (con apóstrofes y ligaduras):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => {
                setExpression(e.target.value);
                setSelectedRadicalIndices([]);
              }}
              placeholder="Introduce una expresión (ej. Thima · Varin'Vim ·· Vor'aen · Nu-Dar)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
            />
            <button
              onClick={handlePronounceExpression}
              className={`px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                isPlayingSound
                  ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse'
                  : 'border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-950/30 text-cyan-400'
              }`}
              title="Escuchar enunciación de la fórmula sagrada con Voz Thalios"
            >
              <Volume2 size={15} className={isPlayingSound ? 'animate-bounce text-cyan-300' : ''} />
              <span className="hidden sm:inline text-xs font-mono font-bold">Pronunciar</span>
            </button>
            <button
              onClick={() => {
                setConfig(DEFAULT_CONFIG);
                setSelectedRadicalIndices([]);
                setAppliedPresetId('rhea-primordial');
              }}
              className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white text-xs font-mono transition-all"
              title="Restablecer todos los parámetros del cálamo a valores canónicos"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Pastillas y Gestor de Fórmulas Canónicas / Personalizadas */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <Bookmark size={11} className="text-cyan-400" />
                <span>Bóveda de Fórmulas ({canonicalFormulas.length}):</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddFormulaInput(prev => !prev)}
                  className="text-[9px] font-mono px-2 py-1 rounded-lg border border-cyan-500/30 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 transition-all cursor-pointer flex items-center gap-1 font-bold"
                  title="Guardar la fórmula actual en la lista"
                >
                  <Plus size={11} />
                  <span>{showAddFormulaInput ? 'Cancelar' : '+ Guardar Fórmula Actual'}</span>
                </button>

                <button
                  onClick={handleRestoreDefaultFormulas}
                  className="text-[9px] font-mono px-2 py-1 rounded-lg border border-white/5 bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
                  title="Restablecer fórmulas canónicas de fábrica"
                >
                  Restaurar
                </button>
              </div>
            </div>

            {/* Formulario Inline para Añadir la Fórmula Actual */}
            {showAddFormulaInput && (
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/70 border border-cyan-500/40 animate-fade-in">
                <span className="text-[10px] font-mono text-cyan-300 font-bold whitespace-nowrap">Nombre de la Fórmula:</span>
                <input
                  type="text"
                  value={newFormulaLabel}
                  onChange={(e) => setNewFormulaLabel(e.target.value)}
                  placeholder={`Ej. Sigilo de ${parsedExpr.units[0]?.cleanRoot || 'Pacto'}`}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-200 outline-none focus:border-cyan-500/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCurrentFormula();
                  }}
                />
                <button
                  onClick={handleAddCurrentFormula}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                >
                  Guardar
                </button>
              </div>
            )}

            {/* Lista de Fórmulas Canónicas y de Usuario con Colores Semánticos */}
            <div className="flex items-center gap-2 flex-wrap">
              {canonicalFormulas.map((sig, sIdx) => {
                const isActive = expression === sig.text;
                const colorSchemes = [
                  'border-amber-500/60 text-amber-200 bg-amber-950/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
                  'border-rose-500/60 text-rose-200 bg-rose-950/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
                  'border-cyan-500/60 text-cyan-200 bg-cyan-950/50 shadow-[0_0_12px_rgba(34,211,238,0.3)]',
                  'border-emerald-500/60 text-emerald-200 bg-emerald-950/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
                  'border-sky-500/60 text-sky-200 bg-sky-950/50 shadow-[0_0_12px_rgba(14,165,233,0.3)]',
                  'border-purple-500/60 text-purple-200 bg-purple-950/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
                  'border-orange-500/60 text-orange-200 bg-orange-950/50 shadow-[0_0_12px_rgba(249,115,22,0.3)]',
                  'border-teal-500/60 text-teal-200 bg-teal-950/50 shadow-[0_0_12px_rgba(20,184,166,0.3)]'
                ];
                const activeScheme = colorSchemes[sIdx % colorSchemes.length];

                return (
                  <div
                    key={sig.id}
                    className={`group text-xs font-mono px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2 ${
                      isActive 
                        ? `${activeScheme} font-bold` 
                        : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setExpression(sig.text);
                        setTargetCalligramExpression(sig.text);
                        setSelectedRadicalIndices([]);
                      }}
                      className="cursor-pointer text-left flex items-center gap-1.5"
                      title={sig.text}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-current' : 'bg-slate-500'}`} />
                      <span>{sig.label}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          thaliosVoice.speak(sig.text, { title: `Fórmula // ${sig.label}` });
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-300 transition-all p-0.5 rounded cursor-pointer"
                        title={`Pronunciar ${sig.label}`}
                      >
                        <Volume2 size={12} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteFormula(sig.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 transition-all p-0.5 rounded cursor-pointer"
                        title="Eliminar fórmula de la bóveda"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Barra Rápida de Estilos y Presets con Acentos Diferenciados */}
          <div className="pt-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-mono text-slate-300 uppercase tracking-widest shrink-0 flex items-center gap-1.5 font-bold">
              <Bookmark size={13} className="text-cyan-400" />
              <span>Estilos Rápidos:</span>
            </span>
            {allPresets.slice(0, 7).map(p => {
              const isSelected = appliedPresetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.35)] font-bold'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={p.description}
                >
                  <span>{p.name}</span>
                  {p.category === 'personalizado' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              );
            })}
            <button
              onClick={() => setActiveTabPanel('estilos')}
              className="text-xs font-mono px-3 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 font-bold"
            >
              <span>+ Bóveda Completa ({allPresets.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Panel del Consejo Ontológico del Oráculo (si está disponible) */}
      {aiInsight && (
        <div className="border border-emerald-500/30 rounded-3xl p-6 bg-gradient-to-br from-emerald-950/20 via-black/60 to-black/80 backdrop-blur-xl space-y-4 animate-fade-in shadow-[0_10px_35px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              <h3 className="text-sm font-bold font-rajdhani text-emerald-300 uppercase tracking-wider">
                Consejo Ontológico del Oráculo Veyvān
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const speechText = `${aiInsight.sacredMeaning}. Mantra de contemplación: ${aiInsight.contemplationMantra}. Geometría recomendada: ${GEOMETRY_INFO[aiInsight.recommendedGeometry]?.label || aiInsight.recommendedGeometry}. ${aiInsight.geometryRationale}`;
                  thaliosVoice.speak(speechText, { title: "Oráculo Veyvān // Consejo Ontológico" });
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold font-mono text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                title="Escuchar locución del Consejo Ontológico con Voz Thalios"
              >
                <Volume2 size={13} />
                <span>Escuchar Oráculo</span>
              </button>
              <button
                onClick={handleApplyOracleSuggestions}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                <Check size={12} />
                <span>Sintonizar Parámetros según el Oráculo</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                Lectura Sagrada del Sigilo:
              </span>
              <p className="text-slate-200 leading-relaxed italic border-l-2 border-emerald-500/40 pl-3">
                {aiInsight.sacredMeaning}
              </p>
              <div className="pt-2 text-[11px] text-emerald-300/90 font-mono">
                <span className="font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">Mantra de Contemplación:</span>
                «{aiInsight.contemplationMantra}»
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
                  Geometría Correspondiente:
                </span>
                <span className="text-cyan-300 font-mono text-xs font-bold block capitalize">
                  {GEOMETRY_INFO[aiInsight.recommendedGeometry]?.label || aiInsight.recommendedGeometry}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-tight">
                  {aiInsight.geometryRationale}
                </p>
              </div>

              <div className="border-t border-white/5 pt-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
                  Carga Cromática Sugerida:
                </span>
                <span className="text-amber-300 font-mono text-xs font-bold block">
                  {PALETTES[aiInsight.recommendedPalette]?.name || aiInsight.recommendedPalette}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-tight">
                  {aiInsight.paletteRationale}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escenario Principal: Lienzo SVG a la Izquierda, Controles a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lienzo Sagrado (SVG Viewport Interactivo) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div 
            ref={svgContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative border border-white/10 rounded-3xl bg-black/90 p-3 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden aspect-square flex items-center justify-center select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-default'
            }`}
          >
            {/* Fondo de retícula cibernética sutil */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${currentPalette.primary} 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            ></div>

            {/* Resplandor ambiental de la paleta */}
            <div 
              className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
              style={{ backgroundColor: currentPalette.primary }}
            ></div>

            {/* Inyección del SVG reactivo interactivo */}
            <div 
              className="w-full h-full relative z-10 flex items-center justify-center touch-none pointer-events-auto"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />

            {/* Marco de Selección por Arrastre con el Ratón (Marquee Selection) */}
            {marqueeBox && (
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-30" 
                viewBox="0 0 1000 1000"
              >
                <rect
                  x={Math.min(marqueeBox.startX, marqueeBox.currentX)}
                  y={Math.min(marqueeBox.startY, marqueeBox.currentY)}
                  width={Math.max(2, Math.abs(marqueeBox.currentX - marqueeBox.startX))}
                  height={Math.max(2, Math.abs(marqueeBox.currentY - marqueeBox.startY))}
                  fill="rgba(34, 211, 238, 0.15)"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeDasharray="8 5"
                  rx="6"
                />
              </svg>
            )}

            {/* Barra de Herramientas Superior del Lienzo */}
            <div 
              data-canvas-controls="true"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none"
            >
              <div 
                data-canvas-controls="true"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 pointer-events-auto flex-wrap"
              >
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-white/10 text-xs font-mono text-slate-200 uppercase tracking-widest flex items-center gap-2 backdrop-blur-md shadow-lg select-none">
                  <Compass size={13} className="text-cyan-400" />
                  <span className="font-bold">{GEOMETRY_INFO[config.geometry]?.label || config.geometry}</span>
                </span>

                {/* Selector Rápido de Matriz: Algante (6x4) vs Común (4x6) */}
                <div 
                  data-canvas-controls="true"
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex items-center rounded-xl bg-black/85 border border-white/15 p-0.5 backdrop-blur-md shadow-lg"
                >
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfig(prev => ({ ...prev, gridMode: 'algante' }));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                      (config.gridMode || 'algante') === 'algante'
                        ? 'bg-amber-500/25 border border-amber-500/70 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                        : 'text-slate-400 hover:text-amber-200'
                    }`}
                    title="Matriz Sagrada Algante (6×4) - Descenso vertical ceremonial del Émulo"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.9)]"></span>
                    <span>Algante (6×4)</span>
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfig(prev => ({ ...prev, gridMode: 'comun' }));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                      config.gridMode === 'comun'
                        ? 'bg-sky-500/25 border border-sky-500/70 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.35)]'
                        : 'text-slate-400 hover:text-sky-200'
                    }`}
                    title="Matriz Secular Común (4×6) - Secuencia horizontal funcional de pasillos obreros"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(14,165,233,0.9)]"></span>
                    <span>Común (4×6)</span>
                  </button>
                </div>

                {/* Botón de Play / Pausa para la Animación de Respiración */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfig(prev => ({ ...prev, breathingAnimation: !prev.breathingAnimation }));
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                    config.breathingAnimation 
                      ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-pulse font-bold' 
                      : 'bg-black/85 border-white/10 text-slate-300 hover:text-white'
                  }`}
                  title={config.breathingAnimation ? "Pausar pulso para diseñar con tranquilidad" : "Activar pulso de respiración sagrada"}
                >
                  {config.breathingAnimation ? <Pause size={12} className="text-emerald-400" /> : <Play size={12} className="text-slate-300" />}
                  <span>{config.breathingAnimation ? 'Aliento Activo' : 'Aliento Pausado'}</span>
                </button>

                {/* Botón de Auto-Ajustar al Lienzo */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFitToBounds();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-black/85 hover:bg-cyan-950/80 border border-cyan-500/50 text-xs font-mono text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.25)] font-bold"
                  title="Calcula los límites de la composición y la escala para llenar el lienzo sin dejar espacios vacíos"
                >
                  <Scale size={13} className="text-cyan-400" />
                  <span>Ajustar al Lienzo</span>
                </button>
              </div>

              {/* Controles de Selección Activa sobre el Lienzo */}
              <div 
                data-canvas-controls="true"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 pointer-events-auto flex-wrap justify-end"
              >
                {selectedRadicalIndices.length > 0 ? (
                  <div 
                    data-canvas-controls="true"
                    onPointerDown={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 bg-black/85 border border-cyan-500/50 p-1 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    <span className="px-2 py-0.5 text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      {selectedRadicalIndices.length === 1 
                        ? `Radical #${selectedRadicalIndices[0] + 1}` 
                        : `${selectedRadicalIndices.length} Seleccionados`}
                    </span>

                    {/* Escala Rápida del Grupo */}
                    <div className="flex items-center gap-0.5 border-l border-white/10 pl-1.5">
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGroupScale(0.9);
                        }}
                        className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[9px] font-mono text-slate-300 transition-all cursor-pointer"
                        title="Reducir escala de los seleccionados un 10%"
                      >
                        -10%
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGroupScale(1.1);
                        }}
                        className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[9px] font-mono text-cyan-300 transition-all cursor-pointer font-bold"
                        title="Aumentar escala de los seleccionados un 10%"
                      >
                        +10%
                      </button>
                    </div>

                    {/* Giro Rápido del Grupo */}
                    <div className="flex items-center gap-0.5 border-l border-white/10 pl-1.5">
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGroupRotation(-15);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                        title="Girar selección -15°"
                      >
                        <RotateCw size={10} className="-scale-x-100" />
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGroupRotation(15);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                        title="Girar selección +15°"
                      >
                        <RotateCw size={10} />
                      </button>
                    </div>

                    {/* Deseleccionar */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeselectAll();
                      }}
                      className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-[9px] font-mono text-cyan-200 transition-all cursor-pointer"
                      title="Deseleccionar todos"
                    >
                      Listo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAllRadicals();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-white/10 border border-white/10 text-[9px] font-mono text-slate-400 hover:text-slate-200 uppercase tracking-wider flex items-center gap-1 backdrop-blur-md transition-all cursor-pointer"
                    title="Seleccionar todos los radicales simultáneamente"
                  >
                    <BoxSelect size={11} className="text-slate-400" />
                    <span>Seleccionar Todos</span>
                  </button>
                )}

                <span 
                  className="px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-widest font-bold border backdrop-blur-md select-none"
                  style={{
                    color: currentPalette.primary,
                    borderColor: currentPalette.borderStroke,
                    backgroundColor: 'rgba(0,0,0,0.75)'
                  }}
                >
                  ● {currentPalette.name}
                </span>
              </div>
            </div>

            {/* Guía Inferior Discreta de Manipulación */}
            <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5 bg-black/75 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                <MousePointer size={10} className="text-cyan-400" />
                <span>Haz clic sobre un símbolo o arrastra un marco con el ratón sobre el lienzo para seleccionar varios a la vez.</span>
              </span>
            </div>
          </div>

          {/* Barra de Exportación y Descarga */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSvg}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                title="Descargar archivo vectorial SVG para grabados, tatuajes o ilustraciones"
              >
                <Download size={13} />
                <span>Códice Vectorial (SVG)</span>
              </button>

              <button
                onClick={handleDownloadPng}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                title="Exportar imagen rasterizada de alta definición (2048x2048 px)"
              >
                <Maximize2 size={13} />
                <span>Imagen HD (PNG)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {Object.keys(config.customTransforms || {}).length > 0 && (
                <button
                  onClick={handleResetAllRadicals}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-950/40 text-xs font-mono transition-all cursor-pointer"
                  title="Restablecer todos los símbolos a sus posiciones geométricas de base"
                >
                  <Undo2 size={13} />
                  <span>Restablecer Posiciones</span>
                </button>
              )}

              <button
                onClick={handleCopySvg}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  copiedSvg 
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/60' 
                    : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
                }`}
                title="Copiar código SVG al portapapeles"
              >
                {copiedSvg ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedSvg ? 'Copiado' : 'Copiar SVG'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel Lateral de Controles y Parámetros Completos */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navegación por 7 Pestañas Canónicas (Layout idéntico al panel maestro) */}
          <div className="bg-slate-950/90 border border-white/10 rounded-3xl p-2.5 shadow-2xl space-y-2">
            <div className="grid grid-cols-4 gap-2">
              {[
                { 
                  id: 'vinculos' as CalligramTab, 
                  label: 'VÍNCULOS', 
                  icon: <Route size={18} />, 
                  badge: parsedExpr.arcs && parsedExpr.arcs.length > 0 ? `${parsedExpr.arcs.length}` : '0',
                  activeStyle: 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.35)] ring-1 ring-cyan-400/50',
                  iconActive: 'text-cyan-300',
                  iconInactive: 'text-cyan-400/60'
                },
                { 
                  id: 'morfologia' as CalligramTab, 
                  label: 'MORFOLOGÍA', 
                  icon: <Layers size={18} />,
                  activeStyle: 'bg-purple-950/70 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.35)] ring-1 ring-purple-400/50',
                  iconActive: 'text-purple-300',
                  iconInactive: 'text-purple-400/60'
                },
                { 
                  id: 'trazo' as CalligramTab, 
                  label: 'TRAZO', 
                  icon: <PenTool size={18} />,
                  activeStyle: 'bg-sky-950/70 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(14,165,233,0.35)] ring-1 ring-sky-400/50',
                  iconActive: 'text-sky-300',
                  iconInactive: 'text-sky-400/60'
                },
                { 
                  id: 'fisica' as CalligramTab, 
                  label: 'FÍSICA & FX', 
                  icon: <Droplets size={18} />,
                  activeStyle: 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/50',
                  iconActive: 'text-emerald-300',
                  iconInactive: 'text-emerald-400/60'
                }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTabPanel(cat.id)}
                  className={`py-3 px-1.5 rounded-2xl text-xs font-rajdhani uppercase tracking-[0.12em] font-bold transition-all flex flex-col items-center justify-center gap-1.5 border relative cursor-pointer ${
                    activeTabPanel === cat.id
                      ? cat.activeStyle
                      : 'bg-black/40 text-slate-400 border-white/5 hover:text-white hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <div className={activeTabPanel === cat.id ? cat.iconActive : cat.iconInactive}>
                    {cat.icon}
                  </div>
                  <span className="truncate">{cat.label}</span>
                  {cat.badge && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                      {cat.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { 
                  id: 'matriz' as CalligramTab, 
                  label: 'MATRIZ', 
                  icon: <Grid3X3 size={18} />,
                  activeStyle: 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50',
                  iconActive: 'text-amber-300',
                  iconInactive: 'text-amber-400/60'
                },
                { 
                  id: 'color' as CalligramTab, 
                  label: 'COLOR', 
                  icon: <Palette size={18} />,
                  activeStyle: 'bg-fuchsia-950/70 border-fuchsia-400 text-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.35)] ring-1 ring-fuchsia-400/50',
                  iconActive: 'text-fuchsia-300',
                  iconInactive: 'text-fuchsia-400/60'
                },
                { 
                  id: 'estilos' as CalligramTab, 
                  label: 'ESTILOS', 
                  icon: <Wand2 size={18} />,
                  activeStyle: 'bg-rose-950/70 border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.35)] ring-1 ring-rose-400/50',
                  iconActive: 'text-rose-300',
                  iconInactive: 'text-rose-400/60'
                }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTabPanel(cat.id)}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-rajdhani uppercase tracking-[0.12em] font-bold transition-all flex flex-col items-center justify-center gap-1.5 border cursor-pointer ${
                    activeTabPanel === cat.id
                      ? cat.activeStyle
                      : 'bg-black/40 text-slate-400 border-white/5 hover:text-white hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <div className={activeTabPanel === cat.id ? cat.iconActive : cat.iconInactive}>
                    {cat.icon}
                  </div>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenedor de la Pestaña Activa */}
          <div className="border border-white/10 rounded-3xl p-5 bg-slate-950/80 backdrop-blur-xl space-y-5">
            {/* ========================================================================= */}
            {/* PESTAÑA 1: VÍNCULOS (ARCOS DE ENLACE FÓNICO & GAP)                       */}
            {/* ========================================================================= */}
            {activeTabPanel === 'vinculos' && (
              <div className="space-y-4 animate-fade-in">
                {/* Encabezado */}
                <div className="flex items-center justify-between text-cyan-400 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Route size={16} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] font-rajdhani text-cyan-300">Arcos de Vínculo</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
                    {parsedExpr.arcs ? parsedExpr.arcs.length : 0} vínculos
                  </span>
                </div>

                {/* Banner si no hay arcos o lista de arcos detectados */}
                {(!parsedExpr.arcs || parsedExpr.arcs.length === 0) ? (
                  <div className="p-4 rounded-2xl border border-dashed border-white/10 bg-black/40 text-center space-y-3">
                    <p className="text-xs font-mono text-slate-400">Expresión en matriz única sin arcos.</p>
                    <button
                      onClick={() => {
                        setExpression("Dun'Val'Thy");
                        setTargetCalligramExpression("Dun'Val'Thy");
                        setSelectedRadicalIndex(null);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-200 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(34,211,238,0.2)] cursor-pointer"
                    >
                      PROBAR FÓRMULA ENLAZADA: DUN'VAL'THY
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">Vínculos Sagrados Activos:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedExpr.arcs.map((arc, aIdx) => (
                        <span key={aIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-cyan-500/30 text-cyan-300">
                          #{arc.fromIndex + 1} ➔ #{arc.toIndex + 1} {arc.particleId ? `(${arc.particleId.replace('suf_', "'")})` : (arc.pauseType === 'pause' ? '··' : '·')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* DISTANCIA ENTRE MATRICES (GAP) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Distancia entre matrices (GAP)</span>
                    <span className="text-cyan-300 font-bold">{config.matrixGap ?? 130}PX</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="600"
                    step="5"
                    value={config.matrixGap ?? 130}
                    onChange={(e) => setConfig(prev => ({ ...prev, matrixGap: Number(e.target.value) }))}
                    className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-500 ring-1 ring-white/5"
                  />
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { label: 'Compacto', val: 70 },
                      { label: 'Equilibrado', val: 140 },
                      { label: 'Amplio', val: 260 },
                      { label: 'Monumental', val: 420 }
                    ].map(g => (
                      <button
                        key={g.label}
                        onClick={() => setConfig(prev => ({ ...prev, matrixGap: g.val }))}
                        className={`py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                          (config.matrixGap ?? 130) === g.val
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CURVATURA DEL ARCO (FLOW) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Curvatura del arco (FLOW)</span>
                    <span className="text-cyan-300 font-bold">{config.arcTension}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={config.arcTension}
                    onChange={(e) => setConfig(prev => ({ ...prev, arcTension: Number(e.target.value) }))}
                    className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-500 ring-1 ring-white/5"
                  />
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { label: 'Tenso', val: 20 },
                      { label: 'Clásico', val: 55 },
                      { label: 'Pronunciado', val: 90 },
                      { label: 'Bóveda', val: 150 }
                    ].map(f => (
                      <button
                        key={f.label}
                        onClick={() => setConfig(prev => ({ ...prev, arcTension: f.val }))}
                        className={`py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                          config.arcTension === f.val
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GROSOR DEL TRAZO */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Grosor del trazo</span>
                    <span className="text-cyan-300 font-bold">{(config.arcThickness ?? 2.5).toFixed(1)}PX</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="20.0"
                    step="0.5"
                    value={config.arcThickness ?? 2.5}
                    onChange={(e) => setConfig(prev => ({ ...prev, arcThickness: Number(e.target.value) }))}
                    className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-500 ring-1 ring-white/5"
                  />
                </div>

                {/* OPACIDAD DEL VÍNCULO */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Opacidad del vínculo</span>
                    <span className="text-cyan-300 font-bold">{config.arcOpacity ?? 85}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={config.arcOpacity ?? 85}
                    onChange={(e) => setConfig(prev => ({ ...prev, arcOpacity: Number(e.target.value) }))}
                    className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-500 ring-1 ring-white/5"
                  />
                </div>

                {/* PATRÓN DE TRAZO */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Patrón de Trazo</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Sólido', id: 'continuo' as ArcStyleMode },
                      { label: 'Discontinuo', id: 'discontinuo' as ArcStyleMode },
                      { label: 'Punteado', id: 'punteado' as ArcStyleMode },
                      { label: 'Pulso', id: 'pulsos' as ArcStyleMode }
                    ].map(p => (
                      <button
                        key={p.label}
                        onClick={() => setConfig(prev => ({ ...prev, arcStyle: p.id }))}
                        className={`py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                          (config.arcStyle ?? 'continuo') === p.id
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AURA LUMINOSA (GLOW) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Aura luminosa (GLOW)</span>
                    <span className="text-cyan-300 font-bold">{config.arcGlow ?? 6}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={config.arcGlow ?? 6}
                    onChange={(e) => setConfig(prev => ({ ...prev, arcGlow: Number(e.target.value) }))}
                    className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-500 ring-1 ring-white/5 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                  />
                </div>

                {/* PIGMENTO DEL ARCO & COLOR PERSONALIZADO */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Pigmento del Arco:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ARC_COLORS.map(ac => (
                      <button
                        key={ac.id}
                        onClick={() => setConfig(prev => ({ ...prev, arcColorMode: ac.id as any, customColorArc: undefined }))}
                        className={`p-2 rounded-xl border text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                          !config.customColorArc && (config.arcColorMode ?? 'sincronizado') === ac.id
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : 'border-white/5 bg-black/40 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: ac.color }} />
                        <span className="truncate">{ac.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selector de color personalizado para el arco */}
                  <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Personalizado:</span>
                    <div className="relative w-6 h-6 rounded-md overflow-hidden border border-white/10 shrink-0">
                      <input
                        type="color"
                        value={config.customColorArc || '#22d3ee'}
                        onChange={(e) => setConfig(prev => ({ ...prev, customColorArc: e.target.value }))}
                        className="absolute -top-2 -left-2 w-10 h-10 border-none cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={config.customColorArc || ''}
                      placeholder="HEX LIBRE (EJ. #F43F5E)..."
                      onChange={(e) => setConfig(prev => ({ ...prev, customColorArc: e.target.value }))}
                      className="flex-1 bg-transparent border-none text-[10px] font-mono text-cyan-200 uppercase outline-none"
                    />
                    {config.customColorArc && (
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, customColorArc: undefined }))}
                        className="text-[9px] text-slate-500 hover:text-cyan-300 font-mono"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* NODOS TERMINALES Y PARTÍCULAS EN ARCO */}
                <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, showArcTerminals: !prev.showArcTerminals }))}
                    className={`py-2 px-3 rounded-xl border text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      config.showArcTerminals ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.15)]' : 'bg-black/40 text-slate-500 border-white/5'
                    }`}
                  >
                    Nodos Terminales {config.showArcTerminals ? '● ON' : '○ OFF'}
                  </button>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, showParticles: !prev.showParticles }))}
                    className={`py-2 px-3 rounded-xl border text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      config.showParticles ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.15)]' : 'bg-black/40 text-slate-500 border-white/5'
                    }`}
                  >
                    Partículas en Arco {config.showParticles ? '● ON' : '○ OFF'}
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PESTAÑA 2: MORFOLOGÍA (DIACRÍTICOS Y SATÉLITES CANÓNICOS)                 */}
            {/* ========================================================================= */}
            {activeTabPanel === 'morfologia' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-cyan-400 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers size={16} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] font-rajdhani text-cyan-300">Morfología Sagrada & Diacríticos</span>
                  </div>
                </div>

                {/* Toggles de Diacríticos y Resonancia */}
                <div className="space-y-2 text-xs font-mono">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                    <div className="space-y-0.5">
                      <span className="text-slate-200 block font-bold">Diacríticos de Afijos</span>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        Prefijos temporales, infijos de certeza y sufijos de aspecto.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showDiacritics}
                      onChange={(e) => setConfig(prev => ({ ...prev, showDiacritics: e.target.checked }))}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                    <div className="space-y-0.5">
                      <span className="text-slate-200 block font-bold">Punto de Resonancia Cromática</span>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        Sello canónico según la semiótica del color del Sistema Tael'im.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showChromaticResonance}
                      onChange={(e) => setConfig(prev => ({ ...prev, showChromaticResonance: e.target.checked }))}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Escala y Grosor de Diacríticos */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Escala General de Diacríticos:</span>
                      <span className="text-cyan-300 font-bold">{(config.diacriticScale ?? 1.0).toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={config.diacriticScale ?? 1.0}
                      onChange={(e) => setConfig(prev => ({ ...prev, diacriticScale: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Grosor de Trazo de Diacríticos:</span>
                      <span className="text-cyan-300 font-bold">{(config.diacriticThickness ?? 2.0).toFixed(1)} px</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="6.0"
                      step="0.2"
                      value={config.diacriticThickness ?? 2.0}
                      onChange={(e) => setConfig(prev => ({ ...prev, diacriticThickness: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                    />
                  </div>
                </div>

                {/* Morfemas Canónicos Detectados */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Afijos Identificados en la Expresión:
                  </span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {parsedExpr.units.some(u => u.prefixId || u.infixId || u.suffixId) ? (
                      parsedExpr.units.map((u, idx) => {
                        if (!u.prefixId && !u.infixId && !u.suffixId) return null;
                        return (
                          <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                            <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase block">
                              Unidad #{idx + 1} ({u.cleanRoot})
                            </span>
                            <div className="flex flex-wrap gap-1 text-[9px] font-mono">
                              {u.prefixId && <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">Prefijo: {u.prefixId}</span>}
                              {u.infixId && <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">Infijo: {u.infixId}</span>}
                              {u.suffixId && <span className="px-1.5 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-500/30">Sufijo: {u.suffixId}</span>}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[11px] font-mono text-slate-500 italic">No se detectaron afijos en la raíz actual.</p>
                    )}
                  </div>
                </div>

                {/* Catálogo Guía de Morfemas Canónicos */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Morfemas Canónicos Disponibles ({TAELIM_MORPHEMES.length}):
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {TAELIM_MORPHEMES.slice(0, 16).map(m => (
                      <div key={m.id} className="p-1.5 rounded-lg bg-black/30 border border-white/5 text-center" title={`${m.label}: ${m.description}`}>
                        <span className="text-xs font-mono font-bold text-cyan-300 block">{m.symbol}</span>
                        <span className="text-[8px] font-mono text-slate-400 truncate block">{m.label.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PESTAÑA 3: TRAZO (MODULACIÓN DE PRESIÓN & ESTILOS DE CÁLAMO)              */}
            {/* ========================================================================= */}
            {activeTabPanel === 'trazo' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-cyan-400 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <PenTool size={16} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] font-rajdhani text-cyan-300">Modulación de Trazo & Cálamo</span>
                  </div>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, smoothEnds: !prev.smoothEnds }))}
                    className={`p-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
                      config.smoothEnds ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-black/40 text-slate-500 border-white/5'
                    }`}
                    title="Suavizar remates y puntas del cálamo"
                  >
                    <Circle size={12} className={config.smoothEnds ? 'fill-current' : ''} />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Suavizado</span>
                  </button>
                </div>

                {/* Modos de Renderizado de Trazo */}
                <div className="grid grid-cols-1 gap-2">
                  {STROKE_STYLES.map((st) => {
                    const isSelected = (config.strokeRenderMode ?? 'plasma') === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => setConfig(prev => ({ ...prev, strokeRenderMode: st.id }))}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                            : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-200' : 'text-slate-300'}`}>
                            {st.label}
                          </span>
                          {isSelected && <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold">Activo</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                          {st.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Parámetros del Cálamo */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  {/* Calibre / Grosor */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Presión del Cálamo (Grosor Base):</span>
                      <span className="text-cyan-300 font-bold">{config.strokeWidth.toFixed(1)} px</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="24.0"
                      step="0.5"
                      value={config.strokeWidth}
                      onChange={(e) => setConfig(prev => ({ ...prev, strokeWidth: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Ángulo del Cálamo */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Ángulo del Bisel del Cálamo:</span>
                      <span className="text-cyan-300 font-bold">{config.penAngle ?? 45}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="5"
                      value={config.penAngle ?? 45}
                      onChange={(e) => setConfig(prev => ({ ...prev, penAngle: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Influencia de Presión Caligráfica */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Modulación Caligráfica:</span>
                      <span className="text-cyan-300 font-bold">{config.calligraphyInfluence ?? 40}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.calligraphyInfluence ?? 40}
                      onChange={(e) => setConfig(prev => ({ ...prev, calligraphyInfluence: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                    />
                  </div>
                </div>

                {/* Presiones por Segmento (como en Tael'im) */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Presiones Específicas de Nodos:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1 bg-black/30 p-2 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-slate-400">Inicio</span>
                        <span className="text-cyan-300 font-bold">{(config.nodeStartPressure ?? 1.0).toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.1"
                        value={config.nodeStartPressure ?? 1.0}
                        onChange={(e) => setConfig(prev => ({ ...prev, nodeStartPressure: Number(e.target.value) }))}
                        className="w-full accent-cyan-500 bg-white/10 h-1 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1 bg-black/30 p-2 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-slate-400">Medio</span>
                        <span className="text-cyan-300 font-bold">{(config.nodeMidPressure ?? 1.0).toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.1"
                        value={config.nodeMidPressure ?? 1.0}
                        onChange={(e) => setConfig(prev => ({ ...prev, nodeMidPressure: Number(e.target.value) }))}
                        className="w-full accent-cyan-500 bg-white/10 h-1 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1 bg-black/30 p-2 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-slate-400">Final</span>
                        <span className="text-cyan-300 font-bold">{(config.nodeEndPressure ?? 1.0).toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.1"
                        value={config.nodeEndPressure ?? 1.0}
                        onChange={(e) => setConfig(prev => ({ ...prev, nodeEndPressure: Number(e.target.value) }))}
                        className="w-full accent-cyan-500 bg-white/10 h-1 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PESTAÑA 4: FÍSICA & FX (DINÁMICA DE ONDAS & FLUIDOS)                       */}
            {/* ========================================================================= */}
            {activeTabPanel === 'fisica' && (
              <div className="space-y-5 animate-fade-in">
                {/* Geometría Orgánica / Ondulación */}
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 mb-3 border-b border-white/5 pb-2">
                    <Move size={15} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] font-rajdhani text-emerald-300">Geometría Orgánica & Ondas</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-slate-400 uppercase tracking-wider">Tensión de Curva / Spline</span>
                        <span className="text-emerald-300 font-bold">{(config.tension ?? 0.35).toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.80"
                        step="0.01"
                        value={config.tension ?? 0.35}
                        onChange={(e) => setConfig(prev => ({ ...prev, tension: Number(e.target.value) }))}
                        className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-500 ring-1 ring-white/5"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-slate-400 uppercase tracking-wider">Caos de Nodos / Fluidez</span>
                        <span className="text-emerald-300 font-bold">{config.fluidity ?? 15}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={config.fluidity ?? 15}
                        onChange={(e) => setConfig(prev => ({ ...prev, fluidity: Number(e.target.value) }))}
                        className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-500 ring-1 ring-white/5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-slate-400 uppercase tracking-wider">Frec. Onda</span>
                          <span className="text-emerald-300 font-bold">{config.waveFreq ?? 0}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="15"
                          step="0.5"
                          value={config.waveFreq ?? 0}
                          onChange={(e) => setConfig(prev => ({ ...prev, waveFreq: Number(e.target.value) }))}
                          className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-400 ring-1 ring-white/5"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-slate-400 uppercase tracking-wider">Amp. Onda</span>
                          <span className="text-emerald-300 font-bold">{config.waveAmp ?? 0}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="35"
                          step="1"
                          value={config.waveAmp ?? 0}
                          onChange={(e) => setConfig(prev => ({ ...prev, waveAmp: Number(e.target.value) }))}
                          className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-400 ring-1 ring-white/5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dinámica de Fluidos y Plasma FX */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 text-orange-400 mb-3 border-b border-white/5 pb-2">
                    <Droplets size={15} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] font-rajdhani text-orange-300">Dinámica de Fluidos & Plasma FX</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-slate-400 uppercase tracking-wider">Resonancia Bioluminiscente (Glow)</span>
                        <span className="text-orange-300 font-bold">{config.glowIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={config.glowIntensity}
                        onChange={(e) => setConfig(prev => ({ ...prev, glowIntensity: Number(e.target.value) }))}
                        className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-slate-400 uppercase tracking-wider">Densidad de Tinta / Salpicaduras</span>
                        <span className="text-orange-300 font-bold">{config.inkDensity ?? 0}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={config.inkDensity ?? 0}
                        onChange={(e) => setConfig(prev => ({ ...prev, inkDensity: Number(e.target.value) }))}
                        className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-slate-400 uppercase tracking-wider">Partículas Orbitales (Polvo Estelar)</span>
                        <span className="text-orange-300 font-bold">{config.particles ?? 0}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        step="1"
                        value={config.particles ?? 0}
                        onChange={(e) => setConfig(prev => ({ ...prev, particles: Number(e.target.value) }))}
                        className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-slate-400 uppercase tracking-wider">Ecos Plasma</span>
                          <span className="text-orange-300 font-bold">{config.echoes ?? 0}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="1"
                          value={config.echoes ?? 0}
                          onChange={(e) => setConfig(prev => ({ ...prev, echoes: Number(e.target.value) }))}
                          className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-slate-400 uppercase tracking-wider">Offset Ecos</span>
                          <span className="text-orange-300 font-bold">{config.echoOffset ?? 10}px</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="40"
                          step="1"
                          value={config.echoOffset ?? 10}
                          onChange={(e) => setConfig(prev => ({ ...prev, echoOffset: Number(e.target.value) }))}
                          className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-slate-400 uppercase tracking-wider">Erosión / Desgaste de Borde</span>
                        <span className="text-orange-300 font-bold">{config.erosion ?? 0}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.5"
                        value={config.erosion ?? 0}
                        onChange={(e) => setConfig(prev => ({ ...prev, erosion: Number(e.target.value) }))}
                        className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PESTAÑA 5: MATRIZ (GEOMETRÍA SAGRADA & MANIPULACIÓN LIBRE)                 */}
            {/* ========================================================================= */}
            {activeTabPanel === 'matriz' && (
              <div className="space-y-5 animate-fade-in">
                {/* 1. SELECCIÓN DE MATRIZ CANÓNICA: ALGANTE (6x4) vs COMÚN (4x6) */}
                <div className="p-4 rounded-3xl bg-black/60 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.12)] space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-[0.2em] font-rajdhani text-amber-300">
                        Sociolecto de Matriz (Escritura Tael'im)
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/15 border border-amber-500/35 text-amber-300 font-bold">
                      {(config.gridMode || 'algante') === 'algante' ? '6 columnas × 4 filas (Litúrgico)' : '4 columnas × 6 filas (Secular)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Tarjeta Algante */}
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, gridMode: 'algante' }))}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                        (config.gridMode || 'algante') === 'algante'
                          ? 'border-amber-500 bg-gradient-to-br from-amber-950/60 via-slate-950/90 to-black text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/50'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]"></span>
                          <span className="text-xs font-mono font-bold text-amber-300">
                            Algante (6×4)
                          </span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                          Litúrgico
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        Matriz sacerdotal de alta jerarquía. Disposición en descenso vertical sagrado con 6 columnas y 4 filas (24 nodos fónicos). Utilizada en santuarios y el Émulo.
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400/90 pt-1.5 border-t border-amber-500/20">
                        <span>• 6 cols × 4 filas</span>
                        <span>• Descenso Vertical</span>
                        <span>• 24 Nodos</span>
                      </div>
                    </button>

                    {/* Tarjeta Común */}
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, gridMode: 'comun' }))}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                        config.gridMode === 'comun'
                          ? 'border-sky-500 bg-gradient-to-br from-sky-950/60 via-slate-950/90 to-black text-sky-200 shadow-[0_0_20px_rgba(14,165,233,0.25)] ring-1 ring-sky-500/50'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.9)]"></span>
                          <span className="text-xs font-mono font-bold text-sky-300">
                            Común (4×6)
                          </span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold uppercase">
                          Secular
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        Matriz funcional de cubiertas obreras y pasillos. Secuencia horizontal práctica de rápida lectura con 4 columnas y 6 filas (24 nodos fónicos).
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-sky-400/90 pt-1.5 border-t border-sky-500/20">
                        <span>• 4 cols × 6 filas</span>
                        <span>• Secuencia Horizontal</span>
                        <span>• 24 Nodos</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. ARQUETIPOS DE GEOMETRÍA SAGRADA */}
                <div className="flex items-center justify-between text-cyan-400 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Compass size={16} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] font-rajdhani text-cyan-300">Arquetipo de Geometría Sagrada</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(GEOMETRY_INFO) as CalligramGeometry[]).map((geom) => {
                    const info = GEOMETRY_INFO[geom];
                    const IconComp = info.icon;
                    const isSelected = config.geometry === geom;
                    return (
                      <button
                        key={geom}
                        onClick={() => setConfig(prev => ({ ...prev, geometry: geom }))}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected 
                            ? 'border-cyan-500/60 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]' 
                            : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <IconComp size={14} className={isSelected ? 'text-cyan-400' : 'text-slate-400'} />
                          <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-200' : 'text-slate-300'}`}>
                            {info.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-tight line-clamp-2">
                          {info.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Controles Globales de Geometría */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  {/* Radio de Expansión Orbital */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Radio de Expansión Orbital:</span>
                      <span className="text-cyan-300 font-bold">{config.globalRadius ?? 260} px</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="650"
                      step="5"
                      value={config.globalRadius ?? 260}
                      onChange={(e) => setConfig(prev => ({ ...prev, globalRadius: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Orientación Angular */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Orientación Angular Sagrada:</span>
                      <span className="text-cyan-300 font-bold">{config.stelaRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={config.stelaRotation}
                      onChange={(e) => setConfig(prev => ({ ...prev, stelaRotation: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Escala Sacra Global con Límites Ampliados (hasta 6.0x) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Escala Sacra Global (Zoom Libre):</span>
                      <span className="text-cyan-300 font-bold">{config.sacredScale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="6.0"
                      step="0.05"
                      value={config.sacredScale}
                      onChange={(e) => setConfig(prev => ({ ...prev, sacredScale: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    />
                    {/* Botones de Escala Rápida & Ajuste Óptimo */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <button
                        onClick={handleFitToBounds}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-[9px] font-mono font-bold text-cyan-200 hover:bg-cyan-900 transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                        title="Auto-escala y centra la composición llenando el lienzo"
                      >
                        <Scale size={11} className="text-cyan-400" />
                        <span>Ajustar al Lienzo</span>
                      </button>
                      {[1.0, 1.8, 2.5, 3.8, 5.0].map(sVal => (
                        <button
                          key={sVal}
                          onClick={() => setConfig(prev => ({ ...prev, sacredScale: sVal }))}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono transition-all border cursor-pointer ${
                            Math.abs(config.sacredScale - sVal) < 0.05
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {sVal.toFixed(1)}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fusión y Entrelazado */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Fusión y Entrelazado de Líneas:</span>
                      <span className="text-cyan-300 font-bold">{config.intertwineLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.intertwineLevel}
                      onChange={(e) => setConfig(prev => ({ ...prev, intertwineLevel: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                    />
                  </div>
                </div>

                {/* OPCIONES INTELIGENTES DE COMPOSICIÓN SAGRADA */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold flex items-center gap-1.5">
                    <Sparkles size={12} className="text-cyan-400" />
                    <span>Composiciones Armónicas Inteligentes:</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <button
                      onClick={handleFitToBounds}
                      className="p-2 rounded-xl bg-black/40 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-left transition-all cursor-pointer flex flex-col gap-0.5"
                    >
                      <span className="font-bold flex items-center gap-1 text-cyan-300">
                        <Scale size={11} />
                        <span>Ajustar al Lienzo</span>
                      </span>
                      <span className="text-[9px] text-slate-500 font-sans">Elimina huecos vacíos y centra.</span>
                    </button>

                    <button
                      onClick={handleApplyGoldenSpiral}
                      className="p-2 rounded-xl bg-black/40 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-left transition-all cursor-pointer flex flex-col gap-0.5"
                    >
                      <span className="font-bold flex items-center gap-1 text-cyan-300">
                        <Orbit size={11} />
                        <span>Espiral Áurea</span>
                      </span>
                      <span className="text-[9px] text-slate-500 font-sans">Distribución en proporción Fibonacci.</span>
                    </button>

                    <button
                      onClick={handleApplySymmetry}
                      className="p-2 rounded-xl bg-black/40 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-left transition-all cursor-pointer flex flex-col gap-0.5"
                    >
                      <span className="font-bold flex items-center gap-1 text-cyan-300">
                        <Sliders size={11} />
                        <span>Simetría Espejada</span>
                      </span>
                      <span className="text-[9px] text-slate-500 font-sans">Equilibrio bilateral de templanza.</span>
                    </button>

                    <button
                      onClick={handleApplyPyramid}
                      className="p-2 rounded-xl bg-black/40 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-left transition-all cursor-pointer flex flex-col gap-0.5"
                    >
                      <span className="font-bold flex items-center gap-1 text-cyan-300">
                        <Triangle size={11} />
                        <span>Jerarquía Piramidal</span>
                      </span>
                      <span className="text-[9px] text-slate-500 font-sans">Estratos ceremoniales escalonados.</span>
                    </button>
                  </div>
                </div>

                {/* Guías y Aliento */}
                <div className="pt-3 border-t border-white/5 space-y-2 text-xs font-mono">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-slate-200 font-bold">Guías Sagradas de Geometría</span>
                    <input
                      type="checkbox"
                      checked={config.showSacredGuides ?? true}
                      onChange={(e) => setConfig(prev => ({ ...prev, showSacredGuides: e.target.checked }))}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-slate-200 font-bold">Retícula de Nexos Fónicos (24 puntos)</span>
                    <input
                      type="checkbox"
                      checked={config.showNexuses}
                      onChange={(e) => setConfig(prev => ({ ...prev, showNexuses: e.target.checked }))}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-slate-200 font-bold">Ciclo de Aliento (Pulso Vira)</span>
                    <input
                      type="checkbox"
                      checked={config.breathingAnimation}
                      onChange={(e) => setConfig(prev => ({ ...prev, breathingAnimation: e.target.checked }))}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                {/* PANEL DE MANIPULACIÓN DINÁMICA DE SÍMBOLOS (INDIVIDUAL & GRUPAL) */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                      <Crosshair size={12} className="text-cyan-400" />
                      <span>Manipulación de Símbolos:</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleSelectAllRadicals}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
                        title="Seleccionar todos los radicales"
                      >
                        Todos ({parsedExpr.units.length})
                      </button>

                      {selectedRadicalIndices.length > 0 && (
                        <button
                          onClick={handleDeselectAll}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer"
                        >
                          Limpiar ({selectedRadicalIndices.length})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Selector de Radicales por Pastillas */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {parsedExpr.units.length > 0 ? (
                      parsedExpr.units.map((unit, uIdx) => {
                        const isThisSelected = selectedRadicalIndices.includes(uIdx);
                        const hasCustom = !!config.customTransforms?.[uIdx];
                        return (
                          <button
                            key={uIdx}
                            onClick={(e) => {
                              if (e.shiftKey || e.ctrlKey || e.metaKey) {
                                setSelectedRadicalIndices(prev => 
                                  prev.includes(uIdx) ? prev.filter(i => i !== uIdx) : [...prev, uIdx]
                                );
                              } else {
                                setSelectedRadicalIndices(isThisSelected && selectedRadicalIndices.length === 1 ? [] : [uIdx]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isThisSelected
                                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                                : hasCustom
                                ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40'
                                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                            }`}
                            title={`Radical #${uIdx + 1} (${unit.cleanRoot}). Clic para seleccionar, Shift+Clic para selección múltiple.`}
                          >
                            <span>#{uIdx + 1}</span>
                            <span>{unit.cleanRoot}</span>
                            {hasCustom && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-xs text-slate-500 italic font-mono">No hay radicales detectados en la expresión.</span>
                    )}
                  </div>

                  {/* CASO 1: PANEL DE TRANSFORMACIÓN GRUPAL (MÚLTIPLES SELECCIONADOS) */}
                  {selectedRadicalIndices.length > 1 && (
                    <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-3.5 animate-fade-in shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                        <div className="flex items-center gap-1.5">
                          <BoxSelect size={14} className="text-cyan-400" />
                          <span className="text-xs font-mono font-bold text-cyan-200">
                            Transformación Grupal ({selectedRadicalIndices.length} Radicales)
                          </span>
                        </div>
                        <button
                          onClick={handleResetSelectedGroup}
                          className="text-[10px] font-mono text-slate-400 hover:text-amber-300 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Undo2 size={11} />
                          <span>Restablecer Grupo</span>
                        </button>
                      </div>

                      {/* Escala Grupal */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Escala del Grupo:</span>
                          <span className="text-cyan-300 font-bold">Multiplicador Dinámico</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          <button
                            onClick={() => updateGroupScale(0.85)}
                            className="py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all cursor-pointer"
                          >
                            -15%
                          </button>
                          <button
                            onClick={() => updateGroupScale(1.15)}
                            className="py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 font-bold transition-all cursor-pointer"
                          >
                            +15%
                          </button>
                          <button
                            onClick={() => updateGroupScale(1.5)}
                            className="py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 font-bold transition-all cursor-pointer"
                          >
                            x1.5
                          </button>
                          <button
                            onClick={() => updateGroupScale(2.0)}
                            className="py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 font-bold transition-all cursor-pointer"
                          >
                            x2.0
                          </button>
                        </div>
                        <div className="pt-1">
                          <span className="text-[9px] font-mono text-slate-500 block mb-1">Fijar Escala Idéntica en Bloque:</span>
                          <input
                            type="range"
                            min="0.2"
                            max="6.0"
                            step="0.05"
                            defaultValue="1.0"
                            onChange={(e) => setGroupAbsoluteScale(Number(e.target.value))}
                            className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Rotación Grupal */}
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Giro de la Selección Grupal:</span>
                          <span className="text-cyan-300 font-bold">Rotación Conjunta</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          <button
                            onClick={() => updateGroupRotation(-45)}
                            className="py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all cursor-pointer"
                          >
                            -45°
                          </button>
                          <button
                            onClick={() => updateGroupRotation(-15)}
                            className="py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all cursor-pointer"
                          >
                            -15°
                          </button>
                          <button
                            onClick={() => updateGroupRotation(15)}
                            className="py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all cursor-pointer"
                          >
                            +15°
                          </button>
                          <button
                            onClick={() => updateGroupRotation(45)}
                            className="py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all cursor-pointer"
                          >
                            +45°
                          </button>
                        </div>
                        <div className="pt-1">
                          <span className="text-[9px] font-mono text-slate-500 block mb-1">Giro Absoluto:</span>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="5"
                            defaultValue="0"
                            onChange={(e) => setGroupAbsoluteRotation(Number(e.target.value))}
                            className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CASO 2: INSPECTOR DEL RADICAL SELECCIONADO INDIVIDUALMENTE */}
                  {selectedRadicalIndices.length === 1 && selectedRadicalIndex !== null && (
                    <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                        <span className="text-xs font-mono font-bold text-cyan-200">
                          Ajustes de: {parsedExpr.units[selectedRadicalIndex]?.cleanRoot || `Radical #${selectedRadicalIndex + 1}`}
                        </span>
                        <button
                          onClick={handleResetSelectedRadical}
                          className="text-[10px] font-mono text-slate-400 hover:text-amber-300 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Undo2 size={11} />
                          <span>Centrar Símbolo</span>
                        </button>
                      </div>

                      {/* Desplazamiento X / Y con Rangos Ampliados */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Desplazar X:</span>
                            <span className="text-cyan-300">{activeTransform.offsetX}px</span>
                          </div>
                          <input
                            type="range"
                            min="-450"
                            max="450"
                            step="2"
                            value={activeTransform.offsetX}
                            onChange={(e) => updateSelectedTransform({ offsetX: Number(e.target.value) })}
                            className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Desplazar Y:</span>
                            <span className="text-cyan-300">{activeTransform.offsetY}px</span>
                          </div>
                          <input
                            type="range"
                            min="-450"
                            max="450"
                            step="2"
                            value={activeTransform.offsetY}
                            onChange={(e) => updateSelectedTransform({ offsetY: Number(e.target.value) })}
                            className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Giro y Escala Individual con Rangos Ampliados hasta 6.0x */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Giro Local:</span>
                            <span className="text-cyan-300">{activeTransform.rotation}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="5"
                            value={activeTransform.rotation}
                            onChange={(e) => updateSelectedTransform({ rotation: Number(e.target.value) })}
                            className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Escala Local:</span>
                            <span className="text-cyan-300">{activeTransform.scale.toFixed(2)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="6.0"
                            step="0.05"
                            value={activeTransform.scale}
                            onChange={(e) => updateSelectedTransform({ scale: Number(e.target.value) })}
                            className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CASO 3: NINGÚN RADICAL SELECCIONADO */}
                  {selectedRadicalIndices.length === 0 && (
                    <div className="p-3 rounded-xl bg-black/30 border border-dashed border-white/10 text-center">
                      <p className="text-[11px] font-mono text-slate-500">
                        Selecciona radicales en las pastillas superiores o arrastra un marco con el ratón sobre el lienzo para transformar símbolos individual o conjuntamente.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PESTAÑA 6: COLOR (EDITOR COMPLETO: PALETA, COLOR LIBRE Y GRADIENTES)      */}
            {/* ========================================================================= */}
            {activeTabPanel === 'color' && (
              <div className="space-y-5 animate-fade-in">
                {/* Selector de Modo de Color */}
                <div className="flex items-center justify-between text-cyan-400 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Palette size={16} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] font-rajdhani text-cyan-300">Editor Completo de Color</span>
                  </div>
                </div>

                {/* Sub-selector de Modo */}
                <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, colorMode: 'palette', isGradient: false }))}
                    className={`py-2 text-[10px] font-mono uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer ${
                      (config.colorMode ?? 'palette') === 'palette'
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Paleta Canónica
                  </button>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, colorMode: 'custom', isGradient: false }))}
                    className={`py-2 text-[10px] font-mono uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer ${
                      config.colorMode === 'custom'
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Color Libre
                  </button>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, colorMode: 'gradient', isGradient: true }))}
                    className={`py-2 text-[10px] font-mono uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer ${
                      config.colorMode === 'gradient' || config.isGradient
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Gradiente
                  </button>
                </div>

                {/* 1. MODO PALETA CANÓNICA */}
                {(config.colorMode ?? 'palette') === 'palette' && (
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">
                      Paletas Canónicas de Resonancia:
                    </span>
                    <div className="grid grid-cols-1 gap-2 max-h-[360px] overflow-y-auto pr-1">
                      {(Object.keys(PALETTES) as CalligramPalette[]).map((palKey) => {
                        const pal = PALETTES[palKey];
                        const isSelected = config.palette === palKey;
                        return (
                          <button
                            key={palKey}
                            onClick={() => setConfig(prev => ({ ...prev, palette: palKey, colorMode: 'palette', isGradient: false }))}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected 
                                ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                                : 'border-white/5 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span 
                                className="w-4 h-4 rounded-full border shadow-sm shrink-0"
                                style={{ backgroundColor: pal.primary, borderColor: pal.secondary }}
                              />
                              <div>
                                <span className="text-xs font-mono font-bold text-slate-200 block">
                                  {pal.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-sans block">
                                  {pal.loreLabel}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                                Activo
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. MODO COLOR LIBRE / PERSONALIZADO */}
                {config.colorMode === 'custom' && (
                  <div className="space-y-4">
                    {/* Color Primario */}
                    <div className="space-y-2 bg-black/40 p-3.5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                          Color Primario (Pincel & Trazos)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{config.customColorPrimary || '#06b6d4'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-sm">
                          <input
                            type="color"
                            value={config.customColorPrimary || '#06b6d4'}
                            onChange={(e) => setConfig(prev => ({ ...prev, customColorPrimary: e.target.value }))}
                            className="absolute -top-2 -left-2 w-14 h-14 border-none cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.customColorPrimary || '#06b6d4'}
                          onChange={(e) => setConfig(prev => ({ ...prev, customColorPrimary: e.target.value }))}
                          placeholder="#06b6d4"
                          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-cyan-200 font-mono text-xs uppercase outline-none focus:border-cyan-500"
                        />
                      </div>
                      {/* Swatches Rápidos de Muestra */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {[
                          { c: '#06b6d4', name: 'Cian' },
                          { c: '#10b981', name: 'Esmeralda' },
                          { c: '#f59e0b', name: 'Oro' },
                          { c: '#ef4444', name: 'Rubí' },
                          { c: '#8b5cf6', name: 'Violeta' },
                          { c: '#ec4899', name: 'Rosa' },
                          { c: '#e2e8f0', name: 'Plata' },
                          { c: '#ffffff', name: 'Blanco' }
                        ].map((sw, i) => (
                          <button
                            key={i}
                            onClick={() => setConfig(prev => ({ ...prev, customColorPrimary: sw.c }))}
                            className="flex-1 h-5 rounded-md border border-white/15 hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: sw.c }}
                            title={sw.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Color Secundario (Auras & Filigrana) */}
                    <div className="space-y-2 bg-black/40 p-3.5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                          Color Secundario (Auras & Filigrana)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{config.customColorSecondary || '#a5f3fc'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-sm">
                          <input
                            type="color"
                            value={config.customColorSecondary || '#a5f3fc'}
                            onChange={(e) => setConfig(prev => ({ ...prev, customColorSecondary: e.target.value }))}
                            className="absolute -top-2 -left-2 w-14 h-14 border-none cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.customColorSecondary || '#a5f3fc'}
                          onChange={(e) => setConfig(prev => ({ ...prev, customColorSecondary: e.target.value }))}
                          placeholder="#a5f3fc"
                          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs uppercase outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Color de Arcos de Vínculo */}
                    <div className="space-y-2 bg-black/40 p-3.5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                          Color de los Arcos de Vínculo
                        </span>
                        <button
                          onClick={() => setConfig(prev => ({ ...prev, customColorArc: undefined }))}
                          className="text-[9px] font-mono text-cyan-400 hover:underline cursor-pointer"
                        >
                          Sincronizar con Primario
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-sm">
                          <input
                            type="color"
                            value={config.customColorArc || config.customColorPrimary || '#06b6d4'}
                            onChange={(e) => setConfig(prev => ({ ...prev, customColorArc: e.target.value }))}
                            className="absolute -top-2 -left-2 w-14 h-14 border-none cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.customColorArc || ''}
                          placeholder="Sincronizado con primario..."
                          onChange={(e) => setConfig(prev => ({ ...prev, customColorArc: e.target.value }))}
                          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-cyan-200 font-mono text-xs uppercase outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Color de Fondo del Caligrama */}
                    <div className="space-y-2 bg-black/40 p-3.5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                          Fondo del Caligrama (Lienzo & SVG)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{config.customColorBackground || '#030712'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-sm">
                          <input
                            type="color"
                            value={config.customColorBackground || '#030712'}
                            onChange={(e) => setConfig(prev => ({ ...prev, customColorBackground: e.target.value }))}
                            className="absolute -top-2 -left-2 w-14 h-14 border-none cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.customColorBackground || '#030712'}
                          onChange={(e) => setConfig(prev => ({ ...prev, customColorBackground: e.target.value }))}
                          placeholder="#030712"
                          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs uppercase outline-none focus:border-cyan-500"
                        />
                      </div>
                      {/* Presets Rápidos de Fondo */}
                      <div className="flex gap-1.5 pt-1">
                        {[
                          { label: 'Abisal', c: '#030712' },
                          { label: 'Mamparo', c: '#0b1120' },
                          { label: 'Negro', c: '#000000' },
                          { label: 'Obsidiana', c: '#111827' }
                        ].map(bg => (
                          <button
                            key={bg.label}
                            onClick={() => setConfig(prev => ({ ...prev, customColorBackground: bg.c }))}
                            className="flex-1 py-1 text-[9px] font-mono uppercase rounded-lg border border-white/5 bg-black/40 hover:bg-white/5 text-slate-400 hover:text-white"
                          >
                            {bg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MODO GRADIENTE */}
                {(config.colorMode === 'gradient' || config.isGradient) && (
                  <div className="space-y-4">
                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 space-y-3">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                        Gradiente Sagrado Personalizado:
                      </span>

                      {/* Color Inicial y Final */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Inicio (Start)</span>
                          <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 shrink-0">
                              <input
                                type="color"
                                value={config.gradientColors?.start || '#06b6d4'}
                                onChange={(e) => setConfig(prev => ({
                                  ...prev,
                                  isGradient: true,
                                  colorMode: 'gradient',
                                  gradientColors: { start: e.target.value, end: prev.gradientColors?.end || '#a855f7' }
                                }))}
                                className="absolute -top-2 -left-2 w-12 h-12 border-none cursor-pointer"
                              />
                            </div>
                            <input
                              type="text"
                              value={config.gradientColors?.start || '#06b6d4'}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                isGradient: true,
                                colorMode: 'gradient',
                                gradientColors: { start: e.target.value, end: prev.gradientColors?.end || '#a855f7' }
                              }))}
                              className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-cyan-200 font-mono text-[10px] uppercase outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Final (End)</span>
                          <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 shrink-0">
                              <input
                                type="color"
                                value={config.gradientColors?.end || '#a855f7'}
                                onChange={(e) => setConfig(prev => ({
                                  ...prev,
                                  isGradient: true,
                                  colorMode: 'gradient',
                                  gradientColors: { start: prev.gradientColors?.start || '#06b6d4', end: e.target.value }
                                }))}
                                className="absolute -top-2 -left-2 w-12 h-12 border-none cursor-pointer"
                              />
                            </div>
                            <input
                              type="text"
                              value={config.gradientColors?.end || '#a855f7'}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                isGradient: true,
                                colorMode: 'gradient',
                                gradientColors: { start: prev.gradientColors?.start || '#06b6d4', end: e.target.value }
                              }))}
                              className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-cyan-200 font-mono text-[10px] uppercase outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Barra de Previsualización del Gradiente */}
                      <div className="pt-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                          Rampa Cromática Resultante:
                        </span>
                        <div
                          className="w-full h-5 rounded-lg border border-white/20 shadow-inner"
                          style={{
                            background: `linear-gradient(90deg, ${config.gradientColors?.start || '#06b6d4'}, ${config.gradientColors?.end || '#a855f7'})`
                          }}
                        />
                      </div>
                    </div>

                    {/* Presets Rápidos de Gradiente */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                        Preajustes de Gradiente Canónico:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { s: '#06b6d4', e: '#a855f7', name: 'Cyber Rhea' },
                          { s: '#facc15', e: '#ef4444', name: 'Fuego Reactor' },
                          { s: '#10b981', e: '#06b6d4', name: 'Selva Algante' },
                          { s: '#f472b6', e: '#8b5cf6', name: 'Neón Kosmir' },
                          { s: '#fbbf24', e: '#f97316', name: 'Oro Solar' },
                          { s: '#e2e8f0', e: '#475569', name: 'Acero Mamparo' },
                          { s: '#818cf8', e: '#c084fc', name: 'Místico Transversal' },
                          { s: '#38bdf8', e: '#1e1b4b', name: 'Abismo Kosmir' }
                        ].map((gp, i) => (
                          <button
                            key={i}
                            onClick={() => setConfig(prev => ({
                              ...prev,
                              isGradient: true,
                              colorMode: 'gradient',
                              gradientColors: { start: gp.s, end: gp.e }
                            }))}
                            className="p-2 rounded-xl bg-black/40 hover:bg-white/5 border border-white/10 flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                              style={{ background: `linear-gradient(135deg, ${gp.s}, ${gp.e})` }}
                            />
                            <span className="text-[10px] font-mono text-slate-300 truncate">{gp.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fondo en Modo Gradiente */}
                    <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                          Color de Fondo en Modo Gradiente
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 shrink-0">
                          <input
                            type="color"
                            value={config.customColorBackground || '#030712'}
                            onChange={(e) => setConfig(prev => ({ ...prev, customColorBackground: e.target.value }))}
                            className="absolute -top-2 -left-2 w-12 h-12 border-none cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.customColorBackground || '#030712'}
                          onChange={(e) => setConfig(prev => ({ ...prev, customColorBackground: e.target.value }))}
                          className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 font-mono text-xs uppercase outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* PESTAÑA 7: ESTILOS (BÓVEDA DE PRESETS, GUARDADO & JSON)                   */}
            {/* ========================================================================= */}
            {activeTabPanel === 'estilos' && (
              <div className="space-y-4 animate-fade-in">
                {/* Encabezado y Acciones de la Bóveda */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">
                      Bóveda de Estilos y Arquetipos:
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {allPresets.length} estilos disponibles ({customPresets.length} personalizados)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Botón Importar */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImportCustomPresets} 
                      accept=".json" 
                      className="hidden" 
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                      title="Importar archivo JSON de estilos personalizados"
                    >
                      <Upload size={11} />
                      <span>Importar</span>
                    </button>

                    {/* Botón Exportar */}
                    <button
                      onClick={handleExportCustomPresets}
                      className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                      title="Descargar copia de seguridad JSON de tus estilos personalizados"
                    >
                      <Download size={11} />
                      <span>Exportar</span>
                    </button>
                  </div>
                </div>

                {/* FORMULARIO: GUARDAR ESTILO ACTUAL */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-black/60 border border-cyan-500/30 space-y-2.5 shadow-[0_4px_20px_rgba(34,211,238,0.1)]">
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <BookmarkPlus size={13} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Guardar Configuración Actual en Tu Bóveda:
                    </span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      placeholder="Nombre del nuevo estilo (ej. Sigilo de Guerra Algante)"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
                    />

                    <input
                      type="text"
                      value={newPresetDesc}
                      onChange={(e) => setNewPresetDesc(e.target.value)}
                      placeholder="Descripción o significado litúrgico (opcional)"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-300 font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
                    />

                    <div className="flex items-center justify-between pt-1">
                      {saveStatusMsg ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <Check size={11} />
                          <span>{saveStatusMsg}</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500">
                          Guarda cálamo, arcos, paleta y posiciones relativas.
                        </span>
                      )}

                      <button
                        onClick={handleSaveCustomPreset}
                        disabled={!newPresetName.trim()}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                      >
                        Guardar Estilo
                      </button>
                    </div>
                  </div>
                </div>

                {/* FILTROS Y BÚSQUEDA DE ESTILOS */}
                <div className="space-y-2 pt-1">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      placeholder="Buscar estilo por nombre o descripción..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-slate-300 font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                    />
                  </div>

                  {/* Pastillas de Categorías */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px] font-mono">
                    {[
                      { id: 'todos', label: 'Todos' },
                      { id: 'liturgico', label: 'Rhea' },
                      { id: 'castas', label: 'Castas' },
                      { id: 'mistico', label: 'Místicos' },
                      { id: 'asemic', label: 'Asémicos' },
                      { id: 'personalizado', label: 'Mis Estilos' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setPresetCategoryFilter(cat.id as any)}
                        className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                          presetCategoryFilter === cat.id
                            ? 'border-cyan-500/60 bg-cyan-950/60 text-cyan-300'
                            : 'border-white/5 bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CATÁLOGO DE TARJETAS DE ESTILOS */}
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {filteredPresets.map(preset => {
                    const isSelected = appliedPresetId === preset.id;
                    const isCustom = preset.category === 'personalizado';
                    const geomKey = (preset.config.geometry || 'mandala') as CalligramGeometry;
                    const palKey = (preset.config.palette || 'uniae') as CalligramPalette;
                    const pal = PALETTES[palKey] || PALETTES.uniae;

                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0" 
                              style={{ backgroundColor: pal.primary }}
                            />
                            <h4 className="text-xs font-mono font-bold text-slate-200">
                              {preset.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isSelected && (
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 uppercase font-bold">
                                Activo
                              </span>
                            )}

                            {isCustom && (
                              <button
                                onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                                className="text-slate-500 hover:text-rose-400 p-1 transition-all"
                                title="Eliminar este estilo personalizado"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                          {preset.description}
                        </p>

                        {/* Etiquetas Técnicas del Estilo */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[9px] font-mono text-slate-400">
                          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                            {GEOMETRY_INFO[geomKey]?.label || geomKey}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                            Trazo {preset.config.strokeRenderMode || 'plasma'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                            Arco {preset.config.arcStyle || 'continuo'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                            Glow {preset.config.glowIntensity ?? 65}%
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredPresets.length === 0 && (
                    <div className="text-center py-8 text-xs font-mono text-slate-500 italic">
                      No se encontraron estilos que coincidan con la búsqueda.
                    </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Modal del Oráculo de Sigilos (IA Generativa) */}
      {showAiSigilModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] space-y-5 animate-fade-in">
            {/* Encabezado */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-rajdhani text-white uppercase tracking-wider">
                    Oráculo de Sigilos Tael'vohn // IA Generativa
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Concepción e invocación de fórmulas sagradas en Dialecto Transversal
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAiSigilModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Descripción */}
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Describe en tus propias palabras (en español) la intención, juramento o misterio que deseas plasmar. La inteligencia artificial concebirá la fórmula canónica en Dialecto Transversal, determinará la geometría arquetípica sagrada, la carga cromática y el cálamo óptimo para llenar el lienzo con armonía.
            </p>

            {/* Campo de Entrada */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                Tu Intención o Concepto Sagrado:
              </label>
              <textarea
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                rows={3}
                placeholder="Ejemplo: Un juramento de lealtad y protección inquebrantable entre castas ante el frío polar del viaje hacia las estrellas..."
                className="w-full bg-black/60 border border-white/10 focus:border-cyan-500/60 rounded-2xl p-3.5 text-xs font-mono text-cyan-200 placeholder:text-slate-600 outline-none resize-none transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleInvokeAiSigil();
                  }
                }}
              />
            </div>

            {/* Inspiraciones Rápidas */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                Inspiraciones Canónicas Rápidas:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  "Amor y distancia sagrada en las cubiertas",
                  "Juramento inquebrantable de mando Alévoro",
                  "Protección y templanza ante el frío abisal",
                  "Despertar del fuego y fricción evolutiva",
                  "Regeneración de la semilla de la Cuna",
                  "Resonancia y silencio en el vacío cósmico"
                ].map(idea => (
                  <button
                    key={idea}
                    onClick={() => setAiPromptInput(idea)}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-white/5 hover:bg-cyan-950/60 border border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-200 transition-all cursor-pointer"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowAiSigilModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleInvokeAiSigil}
                disabled={isGeneratingSigilAi || !aiPromptInput.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-bold font-rajdhani uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)] cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={14} className={isGeneratingSigilAi ? "animate-spin" : ""} />
                <span>{isGeneratingSigilAi ? 'Concebiendo Sigilo Sagrado...' : 'Concebir y Sintonizar Sigilo (IA)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalligramStudio;
