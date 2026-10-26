import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  PenTool, Download, ZoomIn, ZoomOut, Dice5, 
  Eye, Activity, Wand2, Droplets, Move, Save, X, Upload, ArrowRight, Layers, Circle, Image as ImageIcon, Check, Play, Pause, RotateCcw, Hash, Palette,
  Grid3X3, Route, Sun, Moon, Focus, Type, Compass, Sparkles, Volume2
} from 'lucide-react';
import { Term, TaelimPreset } from '../types';
import { TAELIM_MORPHEMES, Morpheme, MorphemeType } from '../data/taelimRules';
import { parseTaelimExpression, parseTaelimWord, GlyphUnit, BridgeArc, ParsedExpression } from '../utils/taelimParser';
import { getGridMap, getBezierPointsWithWeight, getBrushPath, SegmentPressure } from '../utils/taelimMath';
import TaelimExportModal, { ExportConfig } from './TaelimExportModal';
import TaelimControls from './TaelimControls';
import { useLexicon } from '../context/LexiconContext';
import { thaliosVoice } from '../services/thaliosVoiceService';

type GridMode = 'algante' | 'comun';
type RenderEngine = 'plasma' | 'tech' | 'pluma' | 'nexo';

interface Props {
  terms?: Term[];
  customPresets?: TaelimPreset[];
  onSavePreset?: (preset: TaelimPreset) => void;
  onDeletePreset?: (id: string) => void;
  onImportSession?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// --- CONFIGURACIÓN DE LOS GRIDS CANÓNICOS ---
// Algante: Matriz Horizontal (6 columnas x 4 filas) -> Se compone en Descenso Vertical
const ALGANTE_GRID: string[][] = [
  ['P', 'V', 'U', 'Y', 'M', 'B'],
  ['F', 'R', 'E', 'A', 'D', 'C'],
  ['H', 'N', 'I', 'L', 'Z', 'Q'],
  ['K', 'S', 'O', 'T', 'G', 'J']
];

// Común: Matriz Vertical (4 columnas x 6 filas) -> Se compone en Secuencia Horizontal
const COMUN_GRID: string[][] = [
  ['B', 'L', 'A', 'V'],
  ['C', 'N', 'E', 'S'],
  ['D', 'R', 'I', 'T'],
  ['F', 'M', 'O', 'Z'],
  ['G', 'K', 'U', 'H'],
  ['J', 'P', 'Y', 'Q'] 
];

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

interface UnitPointData {
  unitIndex: number;
  unit: GlyphUnit;
  offset: { x: number; y: number };
  points: { x: number; y: number; char: string; originalX: number; originalY: number }[];
}

const Taelim: React.FC<Props> = ({ terms = [], customPresets = [], onSavePreset, onDeletePreset, onImportSession }) => {
  const { targetTaelimWord, setTargetTaelimWord, forgeCalligram } = useLexicon();
  const [text, setText] = useState('Vaes');
  const [mode, setMode] = useState<GridMode>('algante');
  const [engine, setEngine] = useState<RenderEngine>('plasma');

  useEffect(() => {
    if (targetTaelimWord) {
      setText(targetTaelimWord);
      setTargetTaelimWord('');
    }
  }, [targetTaelimWord, setTargetTaelimWord]);

  const [zoom, setZoom] = useState(1);
  const [showGuides, setShowGuides] = useState(true);
  
  // --- GRID SETTINGS ---
  const [showGridLines, setShowGridLines] = useState(true);
  const [showGridLabels, setShowGridLabels] = useState(true);
  const [showGridPoints, setShowGridPoints] = useState(true);
  const [gridPointMode, setGridPointMode] = useState<'all' | 'active'>('all');
  const [gridPointSize, setGridPointSize] = useState(4);
  const [gridPointColor, setGridPointColor] = useState('#334155');

  // --- VISUALIZATION SETTINGS ---
  const [gridOpacity, setGridOpacity] = useState(0.2);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [lightMode, setLightMode] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#22d3ee');

  // --- EXPORT STATE ---
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    bgColor: '#020617',
    strokeColor: '#22d3ee',
    includeMetadata: false,
    includeGuides: false,
    includeStartEnd: false,
    isTransparent: false,
    useGradient: false
  });

  // --- DIDACTIC STATE ---
  const [showSequence, setShowSequence] = useState(false);
  const [isGradient, setIsGradient] = useState(false);
  const [gradientColors, setGradientColors] = useState({ start: '#22d3ee', end: '#a855f7' });
  
  // Animation State
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationRef = useRef<number>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- PARÁMETROS CALIGRÁFICOS ---
  const [tension, setTension] = useState(0.2); 
  const [fluidity, setFluidity] = useState(0); 
  const [waveFreq, setWaveFreq] = useState(0); 
  const [waveAmp, setWaveAmp] = useState(0);   
  const [smoothEnds, setSmoothEnds] = useState(true);

  // Dinámica del Trazo (Presiones por Segmento)
  const [segmentPressures, setSegmentPressures] = useState<SegmentPressure[]>([]);
  
  const [penAngle, setPenAngle] = useState(45);
  const [calligraphyAmount, setCalligraphyAmount] = useState(0);

  // Efectos y Florituras
  const [glow, setGlow] = useState(5);
  const [echoes, setEchoes] = useState(0);
  const [echoOffset, setEchoOffset] = useState(10); 
  const [inkDensity, setInkDensity] = useState(0); 
  const [erosion, setErosion] = useState(0); 
  const [particles, setParticles] = useState(0); 

  // Presets
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  // Morfología Individual
  const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);
  const [selectedInfix, setSelectedInfix] = useState<string | null>(null);
  const [selectedSuffix, setSelectedSuffix] = useState<string | null>(null);
  const [autoCompose, setAutoCompose] = useState(true);

  // Individual configurations
  const [prefixConfig, setPrefixConfig] = useState({ size: 40, thickness: 2, x: 0, y: 0, rotation: 0, flipX: false, flipY: false, useCustomColor: false, color: '#22d3ee' });
  const [infixConfig, setInfixConfig] = useState({ size: 40, thickness: 2, x: 0, y: 0, rotation: 0, flipX: false, flipY: false, useCustomColor: false, color: '#22d3ee' });
  const [suffixConfig, setSuffixConfig] = useState({ size: 40, thickness: 2, x: 0, y: 0, rotation: 0, flipX: false, flipY: false, useCustomColor: false, color: '#22d3ee' });
  const [activeMorphemeTab, setActiveMorphemeTab] = useState(0);

  const svgRef = useRef<SVGSVGElement>(null);

  // --- ARCOS DE VÍNCULO SETTINGS ---
  const [matrixGap, setMatrixGap] = useState(130);
  const [arcOpacity, setArcOpacity] = useState(0.85);
  const [arcThickness, setArcThickness] = useState(2.5);
  const [arcCurvature, setArcCurvature] = useState(80);
  const [arcStrokeStyle, setArcStrokeStyle] = useState<'solid' | 'dashed' | 'dotted' | 'pulse'>('solid');
  const [showArcTerminals, setShowArcTerminals] = useState(true);
  const [arcGlow, setArcGlow] = useState(6);
  const [arcColorMode, setArcColorMode] = useState<'sync' | 'cyan' | 'emerald' | 'gold' | 'violet'>('sync');

  // --- GRID SETUP & MATRIX METRICS ---
  const CELL_SIZE = 95;
  const PADDING = 70;
  const currentGrid = mode === 'algante' ? ALGANTE_GRID : COMUN_GRID;
  const matrixWidth = (currentGrid[0].length - 1) * CELL_SIZE;
  const matrixHeight = (currentGrid.length - 1) * CELL_SIZE;
  const gridMap = useMemo(() => getGridMap(currentGrid), [currentGrid]);

  // Sync Stroke Color with Mode for UX defaults
  useEffect(() => {
    if (mode === 'algante') {
      setStrokeColor('#22d3ee'); // Cyan
    } else {
      setStrokeColor('#34d399'); // Emerald
    }
  }, [mode]);

  // --- PARSE EXPRESSION INTO MULTI-GLYPH UNITS ---
  const parsedExpression = useMemo<ParsedExpression>(() => {
    return parseTaelimExpression(text);
  }, [text]);

  const units = useMemo<GlyphUnit[]>(() => {
    if (parsedExpression.units.length > 0) return parsedExpression.units;
    const cleanOnly = text.toUpperCase().replace(/[^A-Z]/g, '');
    return [{
      id: 'unit_0',
      originalText: text,
      rootText: text,
      cleanRoot: cleanOnly,
      prefixId: selectedPrefix,
      infixId: selectedInfix,
      suffixId: selectedSuffix
    }];
  }, [parsedExpression, text, selectedPrefix, selectedInfix, selectedSuffix]);

  // Automatically update single-word morphemes when autoCompose is active
  useEffect(() => {
    if (!autoCompose || units.length === 0) return;
    const first = units[0];
    setSelectedPrefix(first.prefixId);
    setSelectedInfix(first.infixId);
    setSelectedSuffix(first.suffixId);
  }, [units, autoCompose]);

  // --- VIEWBOX DIMENSIONS BASED ON MODE AND UNITS ---
  // In Algante: Matrices are stacked VERTICALLY (one below another)
  // In Común: Matrices are placed HORIZONTALLY (side by side)
  const numUnits = Math.max(1, units.length);

  const viewWidth = useMemo(() => {
    if (mode === 'algante') {
      return matrixWidth + (PADDING * 2) + Math.max(0, arcCurvature - 30);
    } else {
      return numUnits * matrixWidth + (numUnits - 1) * matrixGap + (PADDING * 2);
    }
  }, [mode, matrixWidth, numUnits, matrixGap, arcCurvature]);

  const viewHeight = useMemo(() => {
    if (mode === 'algante') {
      return numUnits * matrixHeight + (numUnits - 1) * matrixGap + (PADDING * 2);
    } else {
      return matrixHeight + (PADDING * 2) + Math.max(0, arcCurvature - 40);
    }
  }, [mode, matrixHeight, numUnits, matrixGap, arcCurvature]);

  const getUnitOffset = (unitIndex: number) => {
    if (mode === 'algante') {
      return {
        x: PADDING,
        y: PADDING + unitIndex * (matrixHeight + matrixGap)
      };
    } else {
      return {
        x: PADDING + unitIndex * (matrixWidth + matrixGap),
        y: PADDING + (mode === 'comun' ? Math.max(0, arcCurvature - 50) : 0)
      };
    }
  };

  // --- CALCULATE ACTIVE POINTS PER UNIT ---
  const unitPointsData = useMemo<UnitPointData[]>(() => {
    return units.map((unit, uIdx) => {
      const offset = getUnitOffset(uIdx);
      const clean = unit.cleanRoot;
      const points: { x: number; y: number; char: string; originalX: number; originalY: number }[] = [];
      let lastPos: { x: number; y: number } | null = null;

      clean.split('').forEach((char, idx) => {
        const possiblePositions = gridMap.get(char);
        if (!possiblePositions || possiblePositions.length === 0) return;
        let chosenPos = possiblePositions[0];

        if (lastPos && possiblePositions.length > 1) {
          let minDist = Infinity;
          possiblePositions.forEach(pos => {
            const dist = Math.sqrt(Math.pow(pos.x - lastPos!.x, 2) + Math.pow(pos.y - lastPos!.y, 2));
            if (dist < minDist) { minDist = dist; chosenPos = pos; }
          });
        }

        const seed = (uIdx * 100 + idx) * 1337;
        const wobbleX = fluidity > 0 ? (Math.sin(seed) * fluidity) : 0;
        const wobbleY = fluidity > 0 ? (Math.cos(seed) * fluidity) : 0;

        const px = offset.x + chosenPos.x * CELL_SIZE;
        const py = offset.y + chosenPos.y * CELL_SIZE;

        points.push({ 
          x: px + wobbleX, 
          y: py + wobbleY, 
          originalX: px,
          originalY: py,
          char 
        });
        lastPos = chosenPos;
      });

      return {
        unitIndex: uIdx,
        unit,
        offset,
        points
      };
    });
  }, [units, gridMap, fluidity, mode, matrixWidth, matrixHeight, matrixGap, arcCurvature]);

  // Flattened active points for animation and pressure indexing
  const fullActivePoints = useMemo(() => {
    return unitPointsData.flatMap(u => u.points);
  }, [unitPointsData]);

  // Determine active points based on animation frame
  const activePoints = useMemo(() => {
    if (!isAnimating) return fullActivePoints;
    if (fullActivePoints.length === 0) return [];
    const limit = Math.max(1, Math.floor(animationFrame));
    return fullActivePoints.slice(0, limit + 1);
  }, [fullActivePoints, isAnimating, animationFrame]);

  // --- ANIMATION LOOP ---
  useEffect(() => {
    if (isAnimating) {
      if (animationFrame < fullActivePoints.length) {
        animationRef.current = window.setTimeout(() => {
          setAnimationFrame(prev => prev + 0.5);
        }, 100);
      } else {
        setIsAnimating(false);
      }
    }
    return () => clearTimeout(animationRef.current);
  }, [isAnimating, animationFrame, fullActivePoints.length]);

  const toggleAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
      setAnimationFrame(fullActivePoints.length);
    } else {
      setAnimationFrame(0);
      setIsAnimating(true);
    }
  };

  // --- SYNC SEGMENT PRESSURES ---
  useEffect(() => {
    const targetLen = Math.max(1, fullActivePoints.length - 1);
    setSegmentPressures(prev => {
      if (prev.length === targetLen) return prev;
      const next = [...prev];
      if (next.length < targetLen) {
        for (let i = next.length; i < targetLen; i++) {
          next.push({ start: 15, mid: 6, end: 15 });
        }
      } else {
        return next.slice(0, targetLen);
      }
      return next;
    });
  }, [fullActivePoints.length]);

  const updateSegment = (index: number, field: keyof SegmentPressure, value: number) => {
    setSegmentPressures(prev => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const updateAllNodes = (value: number) => {
    setSegmentPressures(prev => prev.map(s => ({ ...s, start: value, end: value })));
  };

  const updateAllMids = (value: number) => {
    setSegmentPressures(prev => prev.map(s => ({ ...s, mid: value })));
  };

  // --- PRESETS SYSTEM ---
  const applyPresetState = (p: Partial<TaelimPreset>) => {
    if (p.tension !== undefined) setTension(p.tension);
    if (p.fluidity !== undefined) setFluidity(p.fluidity);
    if (p.waveFreq !== undefined) setWaveFreq(p.waveFreq);
    if (p.waveAmp !== undefined) setWaveAmp(p.waveAmp);
    if (p.glow !== undefined) setGlow(p.glow);
    if (p.echoes !== undefined) setEchoes(p.echoes);
    if (p.echoOffset !== undefined) setEchoOffset(p.echoOffset);
    if (p.inkDensity !== undefined) setInkDensity(p.inkDensity);
    if (p.erosion !== undefined) setErosion(p.erosion);
    if (p.particles !== undefined) setParticles(p.particles);
    if (p.penAngle !== undefined) setPenAngle(p.penAngle);
    if (p.calligraphyAmount !== undefined) setCalligraphyAmount(p.calligraphyAmount);
    if (p.engine !== undefined) setEngine(p.engine);
    if (p.smoothEnds !== undefined) setSmoothEnds(p.smoothEnds);
    else setSmoothEnds(true);
    if (p.isGradient !== undefined) setIsGradient(p.isGradient);
    if (p.gradientColors !== undefined) setGradientColors(p.gradientColors);

    if (p.baseNodeThickness !== undefined && p.baseStrokeThickness !== undefined) {
      setSegmentPressures(prev => prev.map(() => ({
        start: p.baseNodeThickness!,
        mid: p.baseStrokeThickness!,
        end: p.baseNodeThickness!
      })));
    } else {
      let s = 10, m = 10, e = 10;
      if (p.engine === 'pluma') { s = 15; m = 5; e = 15; } 
      if (p.name === 'ink') { s = 20; m = 8; e = 2; }
      if (p.engine === 'tech') { s = 3; m = 3; e = 3; setSmoothEnds(false); } 
      setSegmentPressures(prev => prev.map(() => ({ start: s, mid: m, end: e })));
    }

    if (p.showGridLines !== undefined) setShowGridLines(p.showGridLines);
    if (p.showGridLabels !== undefined) setShowGridLabels(p.showGridLabels);
    if (p.showGridPoints !== undefined) setShowGridPoints(p.showGridPoints);
    if (p.gridPointMode !== undefined) setGridPointMode(p.gridPointMode);
    if (p.gridPointSize !== undefined) setGridPointSize(p.gridPointSize);
    if (p.gridPointColor !== undefined) setGridPointColor(p.gridPointColor);

    // Arcos de Vínculo
    if (p.matrixGap !== undefined) setMatrixGap(p.matrixGap);
    if (p.arcOpacity !== undefined) setArcOpacity(p.arcOpacity);
    if (p.arcThickness !== undefined) setArcThickness(p.arcThickness);
    if (p.arcCurvature !== undefined) setArcCurvature(p.arcCurvature);
    if (p.arcStrokeStyle !== undefined) setArcStrokeStyle(p.arcStrokeStyle);
    if (p.showArcTerminals !== undefined) setShowArcTerminals(p.showArcTerminals);
    if (p.arcGlow !== undefined) setArcGlow(p.arcGlow);
    if (p.arcColorMode !== undefined) setArcColorMode(p.arcColorMode);
  };

  const loadSystemPreset = (type: string) => {
    setIsGradient(false);
    switch(type) {
      case 'ink': 
        applyPresetState({ name: 'ink', tension: 0.25, fluidity: 5, waveAmp: 0, calligraphyAmount: 90, penAngle: 30, echoes: 0, glow: 0, inkDensity: 60, erosion: 5, particles: 0, engine: 'pluma', arcThickness: 3.5, arcStrokeStyle: 'solid' });
        break;
      case 'calligraphy':
        applyPresetState({ name: 'calligraphy', tension: 0.2, fluidity: 0, waveAmp: 0, calligraphyAmount: 100, penAngle: 45, echoes: 0, glow: 0, inkDensity: 0, erosion: 0, particles: 0, engine: 'pluma', arcThickness: 2.5, arcStrokeStyle: 'solid' });
        break;
      case 'marker':
        applyPresetState({ name: 'marker', tension: 0.3, fluidity: 2, waveAmp: 0, calligraphyAmount: 10, penAngle: 90, echoes: 0, glow: 0, inkDensity: 5, erosion: 2, particles: 0, engine: 'pluma', arcThickness: 4, arcStrokeStyle: 'solid' });
        break;
      case 'liquid':
        applyPresetState({ name: 'liquid', tension: 0.5, fluidity: 0, waveFreq: 2, waveAmp: 15, calligraphyAmount: 0, echoes: 1, echoOffset: 5, glow: 8, inkDensity: 0, erosion: 0, particles: 10, engine: 'plasma', arcThickness: 3, arcCurvature: 110 });
        break;
      case 'tech':
        applyPresetState({ name: 'tech', tension: 0, fluidity: 0, waveAmp: 0, calligraphyAmount: 0, echoes: 2, echoOffset: 8, glow: 12, inkDensity: 0, erosion: 0, particles: 30, engine: 'tech', arcThickness: 2, arcStrokeStyle: 'dashed', arcGlow: 10 });
        break;
      case 'chaos':
        applyPresetState({ name: 'chaos', tension: 0.8, fluidity: 20, waveFreq: 10, waveAmp: 5, calligraphyAmount: 50, echoes: 0, glow: 8, inkDensity: 80, erosion: 15, particles: 20, engine: 'nexo', arcThickness: 3.5, arcCurvature: 140, arcStrokeStyle: 'pulse' });
        break;
      case 'ghost':
        applyPresetState({ name: 'ghost', tension: 0.3, fluidity: 5, waveAmp: 5, calligraphyAmount: 0, echoes: 4, echoOffset: 15, glow: 20, inkDensity: 0, erosion: 3, particles: 10, engine: 'plasma', arcThickness: 2, arcOpacity: 0.5, arcGlow: 15 });
        break;
      case 'void':
        applyPresetState({ name: 'void', tension: 0.3, fluidity: 0, waveAmp: 0, calligraphyAmount: 0, echoes: 3, echoOffset: 5, glow: 5, inkDensity: 0, erosion: 1, particles: 5, engine: 'tech', arcThickness: 1.5, arcStrokeStyle: 'dotted' });
        break;
    }
  };

  const applyColorPreset = (start: string, end: string) => {
    setGradientColors({ start, end });
    setIsGradient(true);
  };

  const saveCurrentAsPreset = () => {
    if (!newPresetName || !onSavePreset) return;
    const newPreset: TaelimPreset = {
      id: crypto.randomUUID(),
      name: newPresetName,
      tension, fluidity, waveFreq, waveAmp, glow, echoes, echoOffset,
      inkDensity, erosion, particles, penAngle, calligraphyAmount, engine,
      smoothEnds,
      isGradient,
      gradientColors: isGradient ? gradientColors : undefined,
      baseNodeThickness: segmentPressures.length > 0 ? segmentPressures[0].start : 10,
      baseStrokeThickness: segmentPressures.length > 0 ? segmentPressures[0].mid : 10,
      showGridLines,
      showGridLabels,
      showGridPoints,
      gridPointMode,
      gridPointSize,
      gridPointColor,
      matrixGap,
      arcOpacity,
      arcThickness,
      arcCurvature,
      arcStrokeStyle,
      showArcTerminals,
      arcGlow,
      arcColorMode
    };
    onSavePreset(newPreset);
    setIsSavingPreset(false);
    setNewPresetName('');
  };

  // --- RENDER LOGIC: GLYPH STROKES FOR EACH MATRIX ---
  const renderedTrace = useMemo(() => {
    if (unitPointsData.length === 0) return null;
    const baseColor = isGradient ? 'url(#traceGradient)' : strokeColor;
    const totalLayers = 1 + echoes;
    const filterUrl = erosion > 0 ? "url(#erosion-filter)" : undefined;

    return (
      <g className="all-unit-traces">
        {unitPointsData.map((uData, uIdx) => {
          if (uData.points.length === 0) return null;

          // Single point fallback: small glowing harmonic node
          if (uData.points.length === 1) {
            const p = uData.points[0];
            return (
              <circle 
                key={`single-node-${uIdx}`} 
                cx={p.x} 
                cy={p.y} 
                r={12} 
                fill={baseColor} 
                filter="url(#neon-glow)" 
              />
            );
          }

          // Compute spline for this unit's points
          const unitSplinePoints = getBezierPointsWithWeight(
            uData.points,
            segmentPressures,
            tension,
            20,
            waveFreq,
            waveAmp,
            smoothEnds
          );

          const layerPaths = [];

          for (let i = 0; i < totalLayers; i++) {
            let layerPoints = unitSplinePoints;
            let opacity = 1;
            let widthMultiplier = 1;

            if (i > 0) {
              const offset = i * echoOffset;
              layerPoints = unitSplinePoints.map(p => ({ ...p, x: p.x + offset, y: p.y + offset }));
              opacity = 0.4 / i;
              widthMultiplier = 0.6;
            }

            const finalLayerPoints = layerPoints.map(p => ({ ...p, w: p.w * widthMultiplier }));

            const pathData = getBrushPath(finalLayerPoints, {
              angleInfluence: calligraphyAmount / 100,
              penAngleDeg: penAngle,
              roundedCaps: smoothEnds
            });

            layerPaths.push(
              <path 
                key={`path-${uIdx}-${i}`} 
                d={pathData} 
                fill={baseColor} 
                opacity={engine === 'tech' && i > 0 ? 0.8 : 0.85 * opacity}
                fillRule="nonzero"
              />
            );
          }

          return (
            <g key={`unit-trace-${uIdx}`} filter={filterUrl}>
              {layerPaths}

              {engine === 'tech' && (
                <path 
                  key={`wireframe-${uIdx}`}
                  d={`M ${uData.points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke={baseColor}
                  strokeWidth={1}
                  opacity={0.5}
                  strokeDasharray="4 4"
                />
              )}

              {inkDensity > 0 && uData.points.map((p, idx) => {
                const seed = (p.x * p.y) + idx;
                const count = Math.floor((inkDensity / 10) * ((seed % 10) / 10 + 0.5)); 
                const dots = [];
                for (let k = 0; k < count; k++) {
                  const angle = (seed * k) % (Math.PI * 2);
                  const dist = 10 + (seed * k * 7) % 50;
                  const size = 3 * (((seed + k) % 10) / 10);
                  dots.push(
                    <circle 
                      key={`spat-${uIdx}-${idx}-${k}`} 
                      cx={p.x + Math.cos(angle) * dist} 
                      cy={p.y + Math.sin(angle) * dist} 
                      r={size} 
                      fill={baseColor} 
                      opacity={0.6} 
                    />
                  );
                }
                return <g key={`spats-group-${uIdx}-${idx}`}>{dots}</g>;
              })}

              {particles > 0 && uData.points.map((p, idx) => {
                const count = Math.floor(particles / 2);
                const dots = [];
                for (let k = 0; k < count; k++) {
                  const angle = (p.x * k) % (Math.PI * 2);
                  const dist = 15 + (p.y * k) % 60;
                  dots.push(
                    <circle 
                      key={`part-${uIdx}-${idx}-${k}`} 
                      cx={p.x + Math.cos(angle) * dist} 
                      cy={p.y + Math.sin(angle) * dist} 
                      r={1 + (k % 2)} 
                      fill={baseColor} 
                      opacity={0.4} 
                    />
                  );
                }
                return <g key={`parts-group-${uIdx}-${idx}`} filter="url(#neon-glow)">{dots}</g>;
              })}
            </g>
          );
        })}
      </g>
    );
  }, [
    unitPointsData, segmentPressures, tension, waveFreq, waveAmp, smoothEnds,
    isGradient, strokeColor, echoes, echoOffset, calligraphyAmount, penAngle,
    engine, inkDensity, particles, erosion
  ]);

  // --- RENDER LOGIC: ARCOS DE VÍNCULO (BRIDGE ARCS) ---
  const renderedArcs = useMemo(() => {
    if (parsedExpression.arcs.length === 0) return null;

    // Determine arc color based on arcColorMode
    let arcColor = isGradient ? 'url(#traceGradient)' : strokeColor;
    if (arcColorMode === 'cyan') arcColor = '#22d3ee';
    else if (arcColorMode === 'emerald') arcColor = '#34d399';
    else if (arcColorMode === 'gold') arcColor = '#fbbf24';
    else if (arcColorMode === 'violet') arcColor = '#c084fc';

    // Stroke dasharray mapping
    let dashArray: string | undefined = undefined;
    if (arcStrokeStyle === 'dashed') dashArray = '9 6';
    else if (arcStrokeStyle === 'dotted') dashArray = '3 6';
    else if (arcStrokeStyle === 'pulse') dashArray = '15 5 4 5';

    return (
      <g className="bridge-arcs-layer">
        {parsedExpression.arcs.map((arc, aIdx) => {
          const fromUnit = unitPointsData[arc.fromIndex];
          const toUnit = unitPointsData[arc.toIndex];
          if (!fromUnit || !toUnit || fromUnit.points.length === 0 || toUnit.points.length === 0) return null;

          const pStart = fromUnit.points[fromUnit.points.length - 1];
          const pEnd = toUnit.points[0];

          let d = '';
          let midX = 0;
          let midY = 0;

          if (mode === 'comun') {
            // Horizontal flow: arch sweeps gracefully over the horizontal gap
            const dx = pEnd.x - pStart.x;
            const archH = Math.min(220, Math.max(25, (arcCurvature / 80) * Math.max(50, Math.abs(dx) * 0.28)));
            midX = (pStart.x + pEnd.x) / 2;
            midY = Math.min(pStart.y, pEnd.y) - archH;
            const cp1X = pStart.x + dx * 0.35;
            const cp1Y = midY;
            const cp2X = pStart.x + dx * 0.65;
            const cp2Y = midY;
            d = `M ${pStart.x} ${pStart.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${pEnd.x} ${pEnd.y}`;
          } else {
            // Algante: Vertical descending flow: arch sweeps gracefully to the side of the column
            const dy = pEnd.y - pStart.y;
            midY = (pStart.y + pEnd.y) / 2;
            const curveOut = Math.max(25, arcCurvature);
            midX = Math.max(pStart.x, pEnd.x) + curveOut;
            const cp1X = midX;
            const cp1Y = pStart.y + dy * 0.35;
            const cp2X = midX;
            const cp2Y = pStart.y + dy * 0.65;
            d = `M ${pStart.x} ${pStart.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${pEnd.x} ${pEnd.y}`;
          }

          const finalDash = arc.pauseType === 'pause' ? '6 6' : dashArray;

          return (
            <g key={`bridge-arc-${aIdx}`}>
              {/* Ethereal Outer Glow */}
              {arcGlow > 0 && (
                <path 
                  d={d} 
                  fill="none" 
                  stroke={arcColor} 
                  strokeWidth={arcThickness * 2.4} 
                  strokeDasharray={finalDash}
                  opacity={arcOpacity * 0.35 * (arcGlow / 10)} 
                  filter="url(#neon-glow)" 
                />
              )}
              {/* Core Harmonic Arch */}
              <path 
                d={d} 
                fill="none" 
                stroke={arcColor} 
                strokeWidth={arcThickness} 
                strokeDasharray={finalDash}
                opacity={arcOpacity} 
              />
              {/* Terminal Connectors */}
              {showArcTerminals && (
                <>
                  <circle cx={pStart.x} cy={pStart.y} r={Math.max(2.5, arcThickness * 1.5)} fill={arcColor} opacity={arcOpacity} />
                  <circle cx={pEnd.x} cy={pEnd.y} r={Math.max(2.5, arcThickness * 1.5)} fill={arcColor} opacity={arcOpacity} />
                </>
              )}

              {/* Pausa Litúrgica Especular (··) */}
              {arc.pauseType === 'pause' && (
                <g transform={`translate(${midX}, ${midY})`}>
                  <circle cx={-4} cy={0} r={2.5} fill={arcColor} />
                  <circle cx={4} cy={0} r={2.5} fill={arcColor} />
                </g>
              )}

              {/* Partícula Relacional Canónica sobre el Arco ('na, 'vi, 'zo, 'da) */}
              {arc.particleId && (() => {
                const partMorpheme = TAELIM_MORPHEMES.find(m => m.id === arc.particleId);
                if (!partMorpheme) return null;
                return (
                  <g className="arc-relational-particle" opacity={arcOpacity}>
                    {partMorpheme.render({
                      x: midX,
                      y: midY,
                      size: 22,
                      color: arcColor,
                      strokeWidth: Math.max(1.8, arcThickness * 0.9)
                    })}
                  </g>
                );
              })()}
            </g>
          );
        })}
      </g>
    );
  }, [
    parsedExpression.arcs, unitPointsData, mode, isGradient, strokeColor,
    arcOpacity, arcThickness, arcCurvature, arcStrokeStyle,
    showArcTerminals, arcGlow, arcColorMode
  ]);

  // --- RENDER MORPHEMES (Attached to each unit) ---
  const renderMorphemes = () => {
    const color = strokeColor;

    return (
      <g className="morphemes-layer" style={{ pointerEvents: 'none' }}>
        {unitPointsData.map((uData, uIdx) => {
          if (uData.points.length === 0) return null;
          const startPoint = uData.points[0];
          const endPoint = uData.points[uData.points.length - 1];

          // Determine morphemes for this unit
          const prefId = autoCompose ? uData.unit.prefixId : (uIdx === 0 ? selectedPrefix : null);
          const infId = autoCompose ? uData.unit.infixId : (uIdx === 0 ? selectedInfix : null);
          const suffId = autoCompose ? uData.unit.suffixId : (uIdx === 0 ? selectedSuffix : null);

          const morphemesToRender = [
            { m: TAELIM_MORPHEMES.find(m => m.id === prefId), config: prefixConfig },
            { m: TAELIM_MORPHEMES.find(m => m.id === infId), config: infixConfig },
            { m: TAELIM_MORPHEMES.find(m => m.id === suffId), config: suffixConfig }
          ].filter(item => item.m) as { m: Morpheme, config: typeof prefixConfig }[];

          return morphemesToRender.map(({ m, config }, mIdx) => {
            let baseX = (m.type === 'prefix' || m.type === 'infix') ? startPoint.x : endPoint.x;
            let baseY = (m.type === 'prefix' || m.type === 'infix') ? startPoint.y : endPoint.y;

            const finalX = baseX + config.x;
            const finalY = baseY + config.y;
            const finalColor = config.useCustomColor ? config.color : color;

            const transforms = [
              `translate(${finalX}, ${finalY})`,
              `rotate(${config.rotation})`,
              `scale(${config.flipX ? -1 : 1}, ${config.flipY ? -1 : 1})`,
              `translate(${-finalX}, ${-finalY})`
            ].join(' ');

            return (
              <g key={`morpheme-${uIdx}-${m.id}-${mIdx}`} transform={transforms}>
                {m.render({ 
                  x: finalX, 
                  y: finalY, 
                  size: config.size, 
                  color: finalColor, 
                  strokeWidth: config.thickness 
                })}
              </g>
            );
          });
        })}
      </g>
    );
  };

  const handleRandomWord = () => {
    if (terms.length > 0) setText(terms[Math.floor(Math.random() * terms.length)].root);
  };

  const performExport = () => {
    if (!svgRef.current) return;
    const clonedSvg = svgRef.current.cloneNode(true) as SVGSVGElement;
    
    const coloredGroups = clonedSvg.querySelectorAll(`[class*="text-"]`);
    coloredGroups.forEach(el => {
      const classes = el.getAttribute('class') || '';
      const newClasses = classes.replace(/text-\w+-\d+/g, '').trim();
      el.setAttribute('class', newClasses);
      if (!exportConfig.useGradient) {
        (el as SVGElement).style.color = exportConfig.strokeColor;
      }
    });

    if (exportConfig.useGradient) {
      const gradStop1 = clonedSvg.querySelector('#traceGradient stop:nth-child(1)');
      const gradStop2 = clonedSvg.querySelector('#traceGradient stop:nth-child(2)');
      if (gradStop1) gradStop1.setAttribute('stop-color', gradientColors.start);
      if (gradStop2) gradStop2.setAttribute('stop-color', gradientColors.end);
    } else {
      const paths = clonedSvg.querySelectorAll('path');
      paths.forEach(p => {
        if (p.getAttribute('fill') === 'url(#traceGradient)') {
          p.setAttribute('fill', exportConfig.strokeColor);
        }
      });
    }

    if (!exportConfig.includeGuides) {
      const gridGroup = clonedSvg.querySelector('.grid-layer-bg');
      if (gridGroup) gridGroup.remove();
      const fgGroup = clonedSvg.querySelector('.grid-layer-fg');
      if (fgGroup) fgGroup.remove();
      const guidesGroup = clonedSvg.querySelector('.guides-layer');
      if (guidesGroup) guidesGroup.remove();
    }

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const scaleFactor = 3;
    const paddingBottom = exportConfig.includeMetadata ? 300 : 0;
    
    canvas.width = viewWidth * scaleFactor;
    canvas.height = (viewHeight * scaleFactor) + paddingBottom;

    img.onload = () => {
      if (ctx) {
        if (!exportConfig.isTransparent) {
          ctx.fillStyle = exportConfig.bgColor; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, viewWidth * scaleFactor, viewHeight * scaleFactor);

        if (exportConfig.includeMetadata) {
          ctx.textAlign = 'center';
          ctx.fillStyle = exportConfig.useGradient ? gradientColors.start : exportConfig.strokeColor; 
          ctx.font = "bold 80px 'Rajdhani', sans-serif";
          ctx.fillText(text.toUpperCase(), canvas.width / 2, (viewHeight * scaleFactor) + 100);
          
          ctx.fillStyle = exportConfig.bgColor === '#ffffff' ? '#64748b' : '#94a3b8';
          ctx.font = "40px 'Rajdhani', sans-serif";
          ctx.fillText(`Transversal // Caligrafía Tael'im (${mode === 'algante' ? 'Algante' : 'Común'})`, canvas.width / 2, (viewHeight * scaleFactor) + 180);
        }

        const link = document.createElement("a");
        link.download = `Taelim_${text.replace(/[^a-zA-Z0-9]/g, '_') || 'Export'}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        setShowExportModal(false);
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleImportClick = () => {
    if (onImportSession && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Gradient coordinates
  const gradientCoords = useMemo(() => {
    if (fullActivePoints.length === 0) return { x1: 0, y1: 0, x2: viewWidth, y2: viewHeight };
    const start = fullActivePoints[0];
    const end = fullActivePoints[fullActivePoints.length - 1];
    return {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    };
  }, [fullActivePoints, viewWidth, viewHeight]);

  return (
    <div className="max-w-[1920px] mx-auto p-4 font-sans h-[calc(100vh-140px)] lg:h-[calc(100vh-100px)] relative">
      <input type="file" ref={fileInputRef} onChange={onImportSession} className="hidden" accept="application/json" />
      <TaelimExportModal 
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
        exportConfig={exportConfig}
        setExportConfig={setExportConfig}
        performExport={performExport}
      />    

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
        
        {/* --- PANEL DE CONTROLES --- */}
        <TaelimControls 
          text={text} setText={setText} isAnimating={isAnimating} handleRandomWord={handleRandomWord}
          mode={mode} setMode={setMode} selectedPrefix={selectedPrefix} setSelectedPrefix={setSelectedPrefix}
          selectedInfix={selectedInfix} setSelectedInfix={setSelectedInfix} selectedSuffix={selectedSuffix} setSelectedSuffix={setSelectedSuffix}
          activeMorphemeTab={activeMorphemeTab} setActiveMorphemeTab={setActiveMorphemeTab}
          prefixConfig={prefixConfig} setPrefixConfig={setPrefixConfig} infixConfig={infixConfig} setInfixConfig={setInfixConfig} suffixConfig={suffixConfig} setSuffixConfig={setSuffixConfig}
          toggleAnimation={toggleAnimation} showSequence={showSequence} setShowSequence={setShowSequence}
          isGradient={isGradient} setIsGradient={setIsGradient} gradientColors={gradientColors} setGradientColors={setGradientColors} applyColorPreset={applyColorPreset}
          strokeColor={strokeColor} setStrokeColor={setStrokeColor}
          handleImportClick={handleImportClick} isSavingPreset={isSavingPreset} setIsSavingPreset={setIsSavingPreset}
          newPresetName={newPresetName} setNewPresetName={setNewPresetName} saveCurrentAsPreset={saveCurrentAsPreset}
          loadSystemPreset={loadSystemPreset} customPresets={customPresets} applyPresetState={applyPresetState} onDeletePreset={onDeletePreset}
          smoothEnds={smoothEnds} setSmoothEnds={setSmoothEnds} activePoints={activePoints} segmentPressures={segmentPressures}
          updateSegment={updateSegment} updateAllNodes={updateAllNodes} updateAllMids={updateAllMids}
          calligraphyAmount={calligraphyAmount} setCalligraphyAmount={setCalligraphyAmount} penAngle={penAngle} setPenAngle={setPenAngle}
          showGridLines={showGridLines} setShowGridLines={setShowGridLines} showGridLabels={showGridLabels} setShowGridLabels={setShowGridLabels}
          showGridPoints={showGridPoints} setShowGridPoints={setShowGridPoints} gridPointMode={gridPointMode} setGridPointMode={setGridPointMode}
          gridPointSize={gridPointSize} setGridPointSize={setGridPointSize} gridPointColor={gridPointColor} setGridPointColor={setGridPointColor}
          gridOpacity={gridOpacity} setGridOpacity={setGridOpacity}
          tension={tension} setTension={setTension} fluidity={fluidity} setFluidity={setFluidity}
          waveFreq={waveFreq} setWaveFreq={setWaveFreq} waveAmp={waveAmp} setWaveAmp={setWaveAmp}
          inkDensity={inkDensity} setInkDensity={setInkDensity} erosion={erosion} setErosion={setErosion}
          particles={particles} setParticles={setParticles} echoes={echoes} setEchoes={setEchoes}
          echoOffset={echoOffset} setEchoOffset={setEchoOffset} glow={glow} setGlow={setGlow}
          autoCompose={autoCompose} setAutoCompose={setAutoCompose}
          matrixGap={matrixGap} setMatrixGap={setMatrixGap}
          arcOpacity={arcOpacity} setArcOpacity={setArcOpacity}
          arcThickness={arcThickness} setArcThickness={setArcThickness}
          arcCurvature={arcCurvature} setArcCurvature={setArcCurvature}
          arcStrokeStyle={arcStrokeStyle} setArcStrokeStyle={setArcStrokeStyle}
          showArcTerminals={showArcTerminals} setShowArcTerminals={setShowArcTerminals}
          arcGlow={arcGlow} setArcGlow={setArcGlow}
          arcColorMode={arcColorMode} setArcColorMode={setArcColorMode}
          parsedArcs={parsedExpression.arcs}
        />

        {/* --- VISUALIZADOR --- */}
        <div className="xl:col-span-9 flex flex-col h-full relative">
          
          <div className="absolute top-6 right-6 z-20 flex gap-2 bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] items-center">
            
            {/* Grid & View Controls */}
            <div className="flex items-center gap-1 mr-2 bg-black/40 border border-white/5 rounded-xl px-2 py-1 shadow-inner">
              <button onClick={() => setShowGridLines(!showGridLines)} className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${showGridLines ? 'text-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500'}`} title="Líneas de la Matriz">
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setShowGridPoints(!showGridPoints)} className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${showGridPoints ? 'text-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500'}`} title="Puntos de la Matriz">
                <Circle size={16} />
              </button>
              <button onClick={() => setShowGridLabels(!showGridLabels)} className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${showGridLabels ? 'text-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500'}`} title="Fonemas de la Matriz">
                <Type size={16} />
              </button>
              
              <div className="w-px h-5 bg-white/10 mx-1"></div>
              
              <button onClick={() => setShowGuides(!showGuides)} className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${showGuides ? 'text-emerald-400 bg-emerald-900/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'text-slate-500'}`} title="Nodos Activos">
                <Eye size={16} />
              </button>
              <button onClick={() => setShowSkeleton(!showSkeleton)} className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${showSkeleton ? 'text-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500'}`} title="Esqueleto Conectivo">
                <Route size={16} />
              </button>

              <div className="w-px h-5 bg-white/10 mx-1"></div>
              
              <div className="flex items-center gap-2 group px-1" title="Opacidad de la Matriz">
                <div className="w-16 h-2 relative flex items-center">
                  <div className="absolute w-full h-1 bg-slate-600/50 rounded-full ring-1 ring-white/10"></div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={gridOpacity} 
                    onChange={e => setGridOpacity(Number(e.target.value))} 
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute h-1 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] pointer-events-none transition-all" style={{ width: `${gridOpacity * 100}%` }}></div>
                  <div className="absolute w-2.5 h-2.5 bg-white rounded-full shadow-md pointer-events-none transition-all transform -translate-x-1/2" style={{ left: `${gridOpacity * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-black/40 rounded-xl border border-white/5 p-1">
              <button 
                onClick={() => setMode('algante')} 
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-all rounded-lg tracking-widest ${mode === 'algante' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
                title="Algante: Matriz Horizontal (6x4) en Descenso Vertical"
              >
                Algante
              </button>
              <div className="w-px h-5 bg-white/10 mx-1 self-center"></div>
              <button 
                onClick={() => setMode('comun')} 
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-all rounded-lg tracking-widest ${mode === 'comun' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
                title="Común: Matriz Vertical (4x6) en Secuencia Horizontal"
              >
                Común
              </button>
            </div>
            
            <div className="flex bg-black/40 rounded-xl border border-white/5 p-1 ml-1">
              <button onClick={() => setZoom(Math.max(0.15, zoom - 0.1))} className="p-1.5 text-slate-500 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"><ZoomOut size={16}/></button>
              <span className="text-[10px] text-cyan-500 font-mono w-10 text-center flex items-center justify-center font-bold">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-1.5 text-slate-500 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"><ZoomIn size={16}/></button>
              <div className="w-px h-5 bg-white/10 mx-1 self-center"></div>
              <button onClick={() => setZoom(1)} className="p-1.5 text-slate-500 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors" title="Restablecer Escala"><Focus size={16} /></button>
            </div>
            
            <button title="Alternar Fondo Claro/Oscuro" onClick={() => setLightMode(!lightMode)} className="p-2 ml-1 bg-black/40 border border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-300 rounded-xl transition-all shadow-inner">
              {lightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            
            <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-400 border border-emerald-500/30 px-4 py-2 text-xs font-bold uppercase tracking-widest ml-1 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer">
              <ImageIcon size={14} /> Exportar
            </button>

            <button 
              onClick={() => forgeCalligram(text)} 
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/60 to-amber-900/50 hover:from-amber-900/80 hover:to-amber-800/70 text-amber-300 border border-amber-500/40 px-3.5 py-2 text-xs font-bold uppercase tracking-widest ml-1 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer"
              title="Forjar Caligrama Sagrado y Sigilo del Rhea con esta expresión"
            >
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>Forjar Caligrama</span>
            </button>
          </div>

          {/* Term Info Overlay */}
          {text && (
            <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1 max-w-md pointer-events-none">
              {(() => {
                if (parsedExpression.isMultiUnit) {
                  return (
                    <div className="bg-black/75 backdrop-blur-xl border border-white/10 border-l-4 border-l-cyan-500 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] pointer-events-auto">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase block">
                          EXPRESIÓN COMPUESTA // {mode === 'algante' ? 'ALGANTE (DESCENSO VERTICAL)' : 'COMÚN (SECUENCIA HORIZONTAL)'}
                        </span>
                        <button
                          onClick={() => thaliosVoice.speak(text, { title: `Expresión Tael'im // ${text}` })}
                          className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                          title="Pronunciar expresión en Transversal"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-widest font-rajdhani mb-2 uppercase">{text}</h2>
                      <div className="space-y-1.5 border-t border-white/10 pt-2.5 max-h-40 overflow-y-auto">
                        {units.map((u, i) => {
                          const found = terms.find(t => t.root.toLowerCase() === u.cleanRoot.toLowerCase());
                          return (
                            <div key={i} className="flex items-center justify-between text-[11px] font-mono gap-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-cyan-400 font-bold">[{ROMAN_NUMERALS[i] || i + 1}]</span>
                                <span className="text-white font-bold">{u.rootText}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    thaliosVoice.speak(u.rootText || u.cleanRoot, { title: `Radical // ${u.rootText}` });
                                  }}
                                  className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-white/10 rounded transition-all cursor-pointer"
                                  title={`Pronunciar ${u.rootText}`}
                                >
                                  <Volume2 size={11} />
                                </button>
                              </div>
                              <span className="text-slate-400 truncate text-[10px] text-right">
                                {found ? found.meaning : 'Raíz Canónica'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span>{units.length} MATRICES ENLAZADAS</span>
                        <span>{parsedExpression.arcs.length} ARCOS DE VÍNCULO</span>
                      </div>
                    </div>
                  );
                }

                const currentTerm = terms.find(t => t.root.toLowerCase() === text.toLowerCase());
                return currentTerm ? (
                  <div className="bg-black/75 backdrop-blur-xl border border-white/10 border-l-4 border-l-cyan-500 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] pointer-events-auto">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block">
                        ID: {(currentTerm.id || 'N/A').slice(-4)} // {currentTerm.category}
                      </span>
                      <button
                        onClick={() => thaliosVoice.speak(`${currentTerm.root}. ${currentTerm.meaning}. ${currentTerm.description || ''}`, { title: `Radical Tael'im // ${currentTerm.root}` })}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                        title={`Narrar ${currentTerm.root} con la voz de Thalios`}
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-white tracking-widest font-rajdhani">{currentTerm.root}</h2>
                      <button
                        onClick={() => thaliosVoice.speak(currentTerm.root, { title: `Pronunciación // ${currentTerm.root}` })}
                        className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-white/10 rounded transition-all cursor-pointer"
                        title={`Pronunciar ${currentTerm.root}`}
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>
                    <p className="text-sm text-slate-300 font-medium mb-2 leading-tight">{currentTerm.meaning}</p>
                    {currentTerm.description && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-[10px] text-slate-400 font-mono leading-relaxed line-clamp-3">{currentTerm.description}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-black/75 backdrop-blur-xl border border-white/10 border-l-4 border-l-slate-500 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] pointer-events-auto">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">TRAZO_LIBRE</span>
                      <button
                        onClick={() => thaliosVoice.speak(text, { title: `Trazo Libre // ${text}` })}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                        title="Pronunciar texto en Transversal"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-widest font-rajdhani uppercase mb-1">{text}</h2>
                    <p className="text-xs text-slate-500 mt-1 italic font-mono">Composición libre en matriz única.</p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Canvas Wrapper */}
          <div className={`flex-1 overflow-hidden relative flex items-center justify-center transition-colors duration-500 rounded-3xl border shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] ${lightMode ? 'bg-[#f8fafc] border-slate-300' : 'bg-black/20 backdrop-blur-md border-white/10'}`}>
            
            <div className="w-full h-full overflow-auto flex items-center justify-center custom-scrollbar p-10 relative z-10 text-glow">
              <div style={{ width: viewWidth, height: viewHeight, transform: `scale(${zoom})`, transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <svg ref={svgRef} viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="w-full h-full drop-shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-visible">
                  <defs>
                    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation={glow} result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="erosion-filter" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale={erosion} />
                    </filter>
                    <linearGradient id="traceGradient" x1={gradientCoords.x1} y1={gradientCoords.y1} x2={gradientCoords.x2} y2={gradientCoords.y2} gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={gradientColors.start} />
                      <stop offset="100%" stopColor={gradientColors.end} />
                    </linearGradient>
                  </defs>
                  
                  {/* --- MATRICES DE FONDO (Grid Lines & Frames) --- */}
                  {showGridLines && (
                    <g className="grid-layer-bg" style={{ opacity: gridOpacity, transition: 'opacity 0.2s' }}>
                      {unitPointsData.map((uData, uIdx) => (
                        <g key={`grid-frame-unit-${uIdx}`}>
                          {/* Subtle Matrix Frame */}
                          <rect 
                            x={uData.offset.x - 14} 
                            y={uData.offset.y - 14} 
                            width={matrixWidth + 28} 
                            height={matrixHeight + 28} 
                            rx={16} 
                            fill={lightMode ? 'rgba(241,245,249,0.7)' : 'rgba(0,0,0,0.35)'} 
                            stroke={mode === 'algante' ? 'rgba(34,211,238,0.18)' : 'rgba(52,211,153,0.18)'} 
                            strokeWidth="1"
                          />

                          {/* Matrix Header Tag */}
                          <text 
                            x={uData.offset.x} 
                            y={uData.offset.y - 20} 
                            fill={mode === 'algante' ? '#22d3ee' : '#34d399'} 
                            opacity={0.8} 
                            fontSize="11" 
                            fontFamily="Rajdhani, sans-serif" 
                            fontWeight="bold" 
                            letterSpacing="0.2em"
                          >
                            {`[${ROMAN_NUMERALS[uIdx] || uIdx + 1} · ${uData.unit.rootText.toUpperCase()}]`}
                          </text>

                          {/* Horizontal Lines */}
                          {currentGrid.map((row, y) => (
                            <line 
                              key={`hline-${uIdx}-${y}`} 
                              x1={uData.offset.x} 
                              y1={uData.offset.y + y * CELL_SIZE} 
                              x2={uData.offset.x + matrixWidth} 
                              y2={uData.offset.y + y * CELL_SIZE} 
                              stroke={lightMode ? '#cbd5e1' : 'rgba(255,255,255,0.06)'} 
                              strokeWidth="1" 
                            />
                          ))}

                          {/* Vertical Lines */}
                          {currentGrid[0].map((_, x) => (
                            <line 
                              key={`vline-${uIdx}-${x}`} 
                              x1={uData.offset.x + x * CELL_SIZE} 
                              y1={uData.offset.y} 
                              x2={uData.offset.x + x * CELL_SIZE} 
                              y2={uData.offset.y + matrixHeight} 
                              stroke={lightMode ? '#cbd5e1' : 'rgba(255,255,255,0.06)'} 
                              strokeWidth="1" 
                            />
                          ))}

                          {/* Intersection Points */}
                          {currentGrid.map((row, y) => row.map((char, x) => (
                            <rect 
                              key={`node-${uIdx}-${x}-${y}`} 
                              x={uData.offset.x + x * CELL_SIZE - 2} 
                              y={uData.offset.y + y * CELL_SIZE - 2} 
                              width="4" 
                              height="4" 
                              fill={lightMode ? '#94a3b8' : 'rgba(34,211,238,0.4)'} 
                            />
                          )))}
                        </g>
                      ))}
                    </g>
                  )}

                  {/* --- TRAZOS DE LOS GLIFOS --- */}
                  <g filter={glow > 0 ? "url(#neon-glow)" : ""} className={mode === 'algante' ? 'text-cyan-400' : 'text-emerald-400'}>
                    {renderedTrace}
                  </g>

                  {/* --- ARCOS DE VÍNCULO (Puente entre matrices) --- */}
                  {renderedArcs}

                  {/* --- MORFEMAS LAYER --- */}
                  <g filter={glow > 0 ? "url(#neon-glow)" : ""} className={mode === 'algante' ? 'text-cyan-400' : 'text-emerald-400'}>
                    {renderMorphemes()}
                  </g>

                  {/* --- PUNTOS Y ETIQUETAS DE LA MATRIZ (Primer Plano) --- */}
                  <g className="grid-layer-fg" style={{ opacity: gridOpacity, transition: 'opacity 0.2s' }}>
                    {unitPointsData.map((uData, uIdx) => (
                      <g key={`fg-unit-${uIdx}`}>
                        {currentGrid.map((row, y) => row.map((char, x) => {
                          const px = uData.offset.x + x * CELL_SIZE;
                          const py = uData.offset.y + y * CELL_SIZE;
                          const isActive = uData.points.some(p => Math.abs(p.originalX - px) < 1 && Math.abs(p.originalY - py) < 1);
                          const shouldShowPoint = showGridPoints && (gridPointMode === 'all' || (gridPointMode === 'active' && isActive));

                          return (
                            <g key={`fg-point-${uIdx}-${x}-${y}`}>
                              {shouldShowPoint && (
                                <circle 
                                  cx={px} 
                                  cy={py} 
                                  r={gridPointSize} 
                                  fill={gridPointColor} 
                                />
                              )}

                              {showGridLabels && (
                                <text 
                                  x={px} 
                                  y={py + 38} 
                                  textAnchor="middle" 
                                  fill={lightMode ? '#94a3b8' : '#475569'} 
                                  fontSize="10" 
                                  fontFamily="monospace" 
                                  opacity={0.5}
                                >
                                  {char}
                                </text>
                              )}
                            </g>
                          );
                        }))}
                      </g>
                    ))}
                  </g>

                  {/* --- NODOS ACTIVOS & ESQUELETO --- */}
                  {showGuides && (
                    <g className="guides-layer">
                      {unitPointsData.map((uData, uIdx) => (
                        <g key={`guides-unit-${uIdx}`}>
                          {showSkeleton && uData.points.length > 1 && (
                            <polyline 
                              points={uData.points.map(p => `${p.x},${p.y}`).join(' ')}
                              fill="none"
                              stroke={lightMode ? "#94a3b8" : "#475569"}
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                              opacity="0.6"
                            />
                          )}

                          {uData.points.map((p, i) => (
                            <g key={`active-node-${uIdx}-${i}`}>
                              <rect x={p.x - 4} y={p.y - 4} width="8" height="8" fill={mode === 'algante' ? '#06b6d4' : '#10b981'} opacity={0.8} />
                              {showSkeleton && fluidity > 0 && (
                                <line x1={p.originalX} y1={p.originalY} x2={p.x} y2={p.y} stroke={lightMode ? "#cbd5e1" : "#334155"} strokeWidth="1" opacity="0.3" />
                              )}
                              <text x={p.x} y={p.y - 15} textAnchor="middle" fill={lightMode ? "#334155" : "white"} fontSize="12" fontWeight="bold">
                                {p.char}
                              </text>
                              {showSequence && (
                                <g transform={`translate(${p.x + 15}, ${p.y - 15})`}>
                                  <circle r={8} fill="#f59e0b" />
                                  <text dy="3" textAnchor="middle" fontSize="10" fontWeight="bold" fill="black">{i + 1}</text>
                                </g>
                              )}
                            </g>
                          ))}
                        </g>
                      ))}
                    </g>
                  )}

                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Taelim;
