import React, { useState } from 'react';
import { PatternType, MatrixNode, MatrixParameters, GuidesConfig } from './types/matrix';
import { 
  snapNodesToPatternSlots, 
  snapNodesToGridStep, 
  snapNodesToHexLattice, 
  snapNodesToFibonacciSpiral, 
  snapNodesToGoldenFrame, 
  snapNodesToHarmonicCircles, 
  alignNearbyAxes 
} from './utils/matrixMath';
import { PATTERN_NAMES } from './constants/presets';
import { playSnapChime, playSoftClick } from './utils/audioEngine';
import { Magnet, Grid, Hexagon, Sparkles, CircleDot, Compass, AlignCenterHorizontal } from 'lucide-react';

interface Props {
  nodes: MatrixNode[];
  activePattern: PatternType;
  params: MatrixParameters;
  guides: GuidesConfig;
  onApplyNewNodes: (newNodes: MatrixNode[], description: string) => void;
}

export const AutoAlignPanel: React.FC<Props> = ({
  nodes,
  activePattern,
  params,
  guides,
  onApplyNewNodes,
}) => {
  const [selectedGridStep, setSelectedGridStep] = useState<number>(25);
  const [targetSlotPattern, setTargetSlotPattern] = useState<PatternType>(activePattern);

  // Keep target slot pattern in sync when active pattern changes
  React.useEffect(() => {
    setTargetSlotPattern(activePattern);
  }, [activePattern]);

  const handleSnapToPattern = () => {
    playSnapChime();
    const result = snapNodesToPatternSlots(nodes, targetSlotPattern, params);
    onApplyNewNodes(result, `Magnetizado a ranuras de "${PATTERN_NAMES[targetSlotPattern]}"`);
  };

  const handleSnapToHex = () => {
    playSnapChime();
    const result = snapNodesToHexLattice(nodes, guides.hexGridSize || 50);
    onApplyNewNodes(result, 'Ajustado a la Malla Hexagonal Sagrada');
  };

  const handleSnapToFibonacci = () => {
    playSnapChime();
    const result = snapNodesToFibonacciSpiral(nodes, guides.fibonacciConfig || {
      scale: 1.0,
      rotation: 0,
      turns: 2.5,
      direction: 'clockwise',
    });
    onApplyNewNodes(result, 'Ajustado a la Espiral de Fibonacci Paramétrica');
  };

  const handleSnapToGrid = () => {
    playSnapChime();
    const result = snapNodesToGridStep(nodes, selectedGridStep);
    onApplyNewNodes(result, `Ajustado a cuadrícula ortogonal de ${selectedGridStep} px`);
  };

  const handleSnapToGolden = () => {
    playSnapChime();
    const result = snapNodesToGoldenFrame(nodes, guides);
    onApplyNewNodes(result, 'Ajustado a proporciones del Marco Áureo φ');
  };

  const handleSnapToCircles = () => {
    playSnapChime();
    const result = snapNodesToHarmonicCircles(nodes);
    onApplyNewNodes(result, 'Ajustado a círculos armónicos concéntricos');
  };

  const handleAlignAxes = () => {
    playSnapChime();
    const result = alignNearbyAxes(nodes, 22);
    onApplyNewNodes(result, 'Ejes horizontales y verticales nivelados');
  };

  return (
    <div className="space-y-3 bg-[#0a121e] border border-slate-800 p-3.5 rounded">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
          <Magnet size={12} />
          <span>Ajuste Automático a Rejillas</span>
        </label>
        <span className="text-[9px] font-mono text-cyan-300">Imán Inteligente</span>
      </div>

      <p className="text-[10px] font-mono text-slate-400 leading-tight">
        Acomoda los fonemas libremente y ajústalos a la geometría perfecta con un solo toque:
      </p>

      {/* 1. Main Action: Snap to Pattern Slots (Nearest-Neighbor Matching) */}
      <div className="p-2.5 bg-[#070c14] border border-amber-500/30 rounded space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold text-slate-300 uppercase">
            Ranuras de Plantilla
          </span>
          <select
            value={targetSlotPattern}
            onChange={e => {
              playSoftClick();
              setTargetSlotPattern(e.target.value as PatternType);
            }}
            className="bg-[#0e1726] border border-slate-700 text-[9px] font-mono text-amber-300 px-1.5 py-0.5 rounded outline-none max-w-[170px] truncate"
          >
            <option value={activePattern}>Actual ({PATTERN_NAMES[activePattern]})</option>
            <option value="grid64">6 × 4 (Algante Horiz)</option>
            <option value="grid46">4 × 6 (Común Vert)</option>
            <option value="hex">Hexágono Sagrado 6+12+6</option>
            <option value="flowerOfLife">Flor de la Vida</option>
            <option value="goldenGrid">Áurea 6 × 4 (Algante)</option>
            <option value="goldenGridVertical">Áurea 4 × 6 (Común)</option>
            <option value="circle">Círculo 24 Divisiones</option>
            <option value="square">Cuadrícula 5 × 5</option>
            <option value="ring">Anillo Doble (8 + 16)</option>
          </select>
        </div>

        <button
          onClick={handleSnapToPattern}
          className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
        >
          <Magnet size={13} />
          <span>Ajustar Fonemas a las Ranuras</span>
        </button>
      </div>

      {/* 2. Secondary Snapping Tools Grid */}
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {/* Snap to Hexagonal Grid */}
        <div className="p-2 bg-[#060a12] border border-cyan-950/60 rounded space-y-1.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-cyan-300">
            <Hexagon size={11} className="text-cyan-400" />
            <span className="font-bold">Malla Hexagonal</span>
          </div>
          <button
            onClick={handleSnapToHex}
            className="w-full py-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/80 text-cyan-200 text-[10px] font-mono rounded transition-colors"
          >
            Ajustar a Hexágono
          </button>
        </div>

        {/* Snap to Fibonacci Spiral */}
        <div className="p-2 bg-[#060a12] border border-cyan-950/60 rounded space-y-1.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-cyan-300">
            <Sparkles size={11} className="text-cyan-400" />
            <span className="font-bold">Espiral Fibonacci</span>
          </div>
          <button
            onClick={handleSnapToFibonacci}
            className="w-full py-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/80 text-cyan-200 text-[10px] font-mono rounded transition-colors"
          >
            Ajustar a Espiral
          </button>
        </div>

        {/* Snap to Grid Step */}
        <div className="p-2 bg-[#060a12] border border-slate-800 rounded space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Grid size={11} className="text-amber-400" />
              <span>Cuadrícula</span>
            </span>
            <select
              value={selectedGridStep}
              onChange={e => setSelectedGridStep(Number(e.target.value))}
              className="bg-[#0e1726] border border-slate-700 text-[9px] font-mono text-amber-300 rounded px-1"
            >
              <option value={15}>15 px</option>
              <option value={20}>20 px</option>
              <option value={25}>25 px</option>
              <option value={40}>40 px</option>
              <option value={50}>50 px</option>
            </select>
          </div>
          <button
            onClick={handleSnapToGrid}
            className="w-full py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-slate-300 hover:text-amber-200 text-[10px] font-mono rounded transition-colors"
          >
            Ajustar a Paso
          </button>
        </div>

        {/* Snap to Golden Ratio Frame */}
        <div className="p-2 bg-[#060a12] border border-slate-800 rounded space-y-1.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
            <Compass size={11} className="text-amber-400" />
            <span>Marco Áureo φ</span>
          </div>
          <button
            onClick={handleSnapToGolden}
            className="w-full py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-slate-300 hover:text-amber-200 text-[10px] font-mono rounded transition-colors"
          >
            Ajustar a Líneas φ
          </button>
        </div>

        {/* Snap to Concentric Harmonic Circles */}
        <div className="p-2 bg-[#060a12] border border-slate-800 rounded space-y-1.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
            <CircleDot size={11} className="text-purple-400" />
            <span>Círculos Armónicos</span>
          </div>
          <button
            onClick={handleSnapToCircles}
            className="w-full py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/60 text-slate-300 hover:text-purple-200 text-[10px] font-mono rounded transition-colors"
          >
            Ajustar a Radios
          </button>
        </div>

        {/* Align Axes */}
        <div className="p-2 bg-[#060a12] border border-slate-800 rounded space-y-1.5">
          <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
            <AlignCenterHorizontal size={11} className="text-emerald-400" />
            <span>Nivelar Ejes X/Y</span>
          </div>
          <button
            onClick={handleAlignAxes}
            className="w-full py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-200 text-[10px] font-mono rounded transition-colors"
          >
            Auto-Nivelar
          </button>
        </div>
      </div>
    </div>
  );
};