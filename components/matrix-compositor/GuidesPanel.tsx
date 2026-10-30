import React from 'react';
import { GuidesConfig, SnapModesConfig, FibonacciSpiralConfig } from './types/matrix';
import { playSoftClick } from './utils/audioEngine';
import {
  Maximize2, 
  RotateCw, 
  RotateCcw, 
  Compass, 
  Magnet, 
  Grid, 
  Hexagon, 
  Sparkles, 
  CircleDot, 
  Sliders, 
  Layers, 
  Eye 

} from 'lucide-react';

interface Props {
  guides: GuidesConfig;
  onChange: (updated: Partial<GuidesConfig>) => void;
}

export const GuidesPanel: React.FC<Props> = ({ guides, onChange }) => {
  const toggle = (key: keyof GuidesConfig) => {
    playSoftClick();
    onChange({ [key]: !guides[key] });
  };

  const toggleSnapMode = (modeKey: keyof SnapModesConfig) => {
    playSoftClick();
    const currentModes = guides.snapModes || {
      grid: true,
      hexGrid: false,
      axes: true,
      goldenRatio: true,
      circles: true,
      fibonacci: true,
      slots: true,
      interNode: true,
    };
    onChange({
      snapModes: {
        ...currentModes,
        [modeKey]: !currentModes[modeKey],
      },
    });
  };

  const updateFibonacci = (updated: Partial<FibonacciSpiralConfig>) => {
    const currentFibo = guides.fibonacciConfig || {
      scale: 1.0,
      rotation: 0,
      turns: 2.5,
      direction: 'clockwise',
    };
    onChange({
      fibonacciConfig: {
        ...currentFibo,
        ...updated,
      },
    });
  };

  const setOrientation = (orientation: 'horizontal' | 'vertical') => {
    playSoftClick();
    onChange({
      goldenRatioOrientation: orientation,
      goldenRatioAngle: 0,
    });
  };

  const snapModes = guides.snapModes || {
    grid: true,
    hexGrid: false,
    axes: true,
    goldenRatio: true,
    circles: true,
    fibonacci: true,
    slots: true,
    interNode: true,
  };

  const fiboConfig = guides.fibonacciConfig || {
    scale: 1.0,
    rotation: 0,
    turns: 2.5,
    direction: 'clockwise',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
          <Sliders size={12} />
          <span>Guías Sagradas & Snaps</span>
        </label>
        <span className="text-[9px] font-mono text-slate-500">Geometría Activa</span>
      </div>

      {/* 1. MASTER SNAP & ADVANCED MODES */}
      <div className="p-3 bg-[#0a121e] border border-amber-900/40 rounded space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={guides.snap}
              onChange={() => toggle('snap')}
              className="accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
              <Magnet size={13} />
              <span>Snap Magnético Maestro</span>
            </span>
          </label>
          <span className="text-[9px] font-mono text-slate-500">Shift desactiva</span>
        </div>

        {/* Individual Snap Target Modes */}
        {guides.snap && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>Objetivos de Magnetismo:</span>
              <div className="flex items-center gap-1">
                <span>Paso Cuadrícula:</span>
                <select
                  value={guides.snapStep || 25}
                  onChange={e => onChange({ snapStep: Number(e.target.value) })}
                  className="bg-[#070c14] border border-slate-700 text-amber-300 px-1 py-0.5 rounded text-[9px] font-mono outline-none"
                >
                  <option value={10}>10 px</option>
                  <option value={15}>15 px</option>
                  <option value={20}>20 px</option>
                  <option value={25}>25 px</option>
                  <option value={30}>30 px</option>
                  <option value={50}>50 px</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              {/* Cuadrícula */}
              <label className={`p-1.5 rounded border cursor-pointer flex items-center gap-1.5 transition-colors ${
                snapModes.grid ? 'bg-slate-900 border-amber-500/50 text-amber-200' : 'bg-[#070c14] border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={snapModes.grid}
                  onChange={() => toggleSnapMode('grid')}
                  className="accent-amber-400 rounded cursor-pointer"
                />
                <span className="truncate">Cuadrícula Ortogonal</span>
              </label>

              {/* Malla Hexagonal */}
              <label className={`p-1.5 rounded border cursor-pointer flex items-center gap-1.5 transition-colors ${
                snapModes.hexGrid ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200' : 'bg-[#070c14] border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={snapModes.hexGrid}
                  onChange={() => toggleSnapMode('hexGrid')}
                  className="accent-cyan-400 rounded cursor-pointer"
                />
                <span className="truncate">Malla Hexagonal</span>
              </label>

              {/* Ranuras de Plantilla */}
              <label className={`p-1.5 rounded border cursor-pointer flex items-center gap-1.5 transition-colors ${
                snapModes.slots ? 'bg-slate-900 border-amber-500/50 text-amber-200' : 'bg-[#070c14] border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={snapModes.slots}
                  onChange={() => toggleSnapMode('slots')}
                  className="accent-amber-400 rounded cursor-pointer"
                />
                <span className="truncate">Ranuras del Patrón</span>
              </label>

              {/* Marco Áureo */}
              <label className={`p-1.5 rounded border cursor-pointer flex items-center gap-1.5 transition-colors ${
                snapModes.goldenRatio ? 'bg-amber-950/40 border-amber-400 text-amber-200' : 'bg-[#070c14] border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={snapModes.goldenRatio}
                  onChange={() => toggleSnapMode('goldenRatio')}
                  className="accent-amber-400 rounded cursor-pointer"
                />
                <span className="truncate">Marco Áureo φ</span>
              </label>

              {/* Espiral Fibonacci */}
              <label className={`p-1.5 rounded border cursor-pointer flex items-center gap-1.5 transition-colors ${
                snapModes.fibonacci ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200' : 'bg-[#070c14] border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={snapModes.fibonacci}
                  onChange={() => toggleSnapMode('fibonacci')}
                  className="accent-cyan-400 rounded cursor-pointer"
                />
                <span className="truncate">Espiral Fibonacci</span>
              </label>

              {/* Círculos Concéntricos */}
              <label className={`p-1.5 rounded border cursor-pointer flex items-center gap-1.5 transition-colors ${
                snapModes.circles ? 'bg-purple-950/40 border-purple-400 text-purple-200' : 'bg-[#070c14] border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={snapModes.circles}
                  onChange={() => toggleSnapMode('circles')}
                  className="accent-purple-400 rounded cursor-pointer"
                />
                <span className="truncate">Círculos Armónicos</span>
              </label>

              {/* Ejes & Diagonales */}
              <label className={`p-1.5 rounded border cursor-pointer flex items-center gap-1.5 transition-colors ${
                snapModes.axes ? 'bg-slate-900 border-amber-500/50 text-amber-200' : 'bg-[#070c14] border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={snapModes.axes}
                  onChange={() => toggleSnapMode('axes')}
                  className="accent-amber-400 rounded cursor-pointer"
                />
                <span className="truncate">Ejes & Diagonales</span>
              </label>

              {/* Imán Inter-Nodos */}
              <label className={`p-1.5 rounded border cursor-pointer flex items-center gap-1.5 transition-colors ${
                snapModes.interNode ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200' : 'bg-[#070c14] border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={snapModes.interNode}
                  onChange={() => toggleSnapMode('interNode')}
                  className="accent-emerald-400 rounded cursor-pointer"
                />
                <span className="truncate">Guías Entre Nodos</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 2. ESPIRAL DE FIBONACCI PERSONALIZABLE */}
      <div className="p-3 bg-[#0a121e] border border-cyan-900/40 rounded space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={guides.fibonacciSpiral}
              onChange={() => toggle('fibonacciSpiral')}
              className="accent-cyan-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Espiral de Fibonacci Paramétrica</span>
            </span>
          </label>
          <span className="text-[9px] font-mono text-cyan-400">Nautilus</span>
        </div>

        {guides.fibonacciSpiral && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5 pl-1">
            {/* Scale Slider */}
            <div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                <span>Escala / Amplitud</span>
                <span className="text-cyan-300">{Math.round((fiboConfig.scale || 1.0) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={2.5}
                step={0.05}
                value={fiboConfig.scale || 1.0}
                onChange={e => updateFibonacci({ scale: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Rotation Slider */}
            <div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                <span>Rotación Angular</span>
                <span className="text-cyan-300">{fiboConfig.rotation || 0}°</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                step={5}
                value={fiboConfig.rotation || 0}
                onChange={e => updateFibonacci({ rotation: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Turns Slider */}
            <div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                <span>Vueltas / Espiras</span>
                <span className="text-cyan-300">{(fiboConfig.turns || 2.5).toFixed(1)} vueltas</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={5.0}
                step={0.25}
                value={fiboConfig.turns || 2.5}
                onChange={e => updateFibonacci({ turns: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Direction Selector & Reset */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] font-mono text-slate-400">Giro:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    playSoftClick();
                    updateFibonacci({ direction: 'clockwise' });
                  }}
                  className={`px-2 py-0.5 text-[9px] font-mono rounded border ${
                    fiboConfig.direction !== 'counterclockwise'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Horario ↻
                </button>
                <button
                  onClick={() => {
                    playSoftClick();
                    updateFibonacci({ direction: 'counterclockwise' });
                  }}
                  className={`px-2 py-0.5 text-[9px] font-mono rounded border ${
                    fiboConfig.direction === 'counterclockwise'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Antihorario ↺
                </button>
                <button
                  onClick={() => {
                    playSoftClick();
                    updateFibonacci({ scale: 1.0, rotation: 0, turns: 2.5, direction: 'clockwise' });
                  }}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-mono rounded"
                  title="Restaurar parámetros originales de la espiral"
                >
                  <RotateCcw size={10} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. RECTÁNGULO ÁUREO PHI CON ORIENTACIÓN & ROTACIÓN */}
      <div className="p-3 bg-[#0a121e] border border-amber-900/40 rounded space-y-2.5">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={guides.goldenRatio}
              onChange={() => toggle('goldenRatio')}
              className="accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
              <Compass size={13} />
              <span>Marco Áureo φ (1.618)</span>
            </span>
          </div>
          <span className="text-[9px] font-mono text-amber-400/80 uppercase">
            {guides.goldenRatioOrientation === 'vertical' ? 'Común (Vertical)' : 'Algante (Horiz)'}
          </span>
        </label>

        {guides.goldenRatio && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5 pl-1">
            {/* Orientación */}
            <div>
              <span className="text-[9px] font-mono text-slate-400 block mb-1">
                Orientación Canónica:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setOrientation('horizontal')}
                  className={`p-1.5 text-[10px] font-mono rounded border flex items-center justify-center gap-1 transition-all ${
                    guides.goldenRatioOrientation === 'horizontal'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                      : 'bg-[#070c14] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Algante (6×4 Horiz)
                </button>
                <button
                  onClick={() => setOrientation('vertical')}
                  className={`p-1.5 text-[10px] font-mono rounded border flex items-center justify-center gap-1 transition-all ${
                    guides.goldenRatioOrientation === 'vertical'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-[#070c14] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Común (4×6 Vert)
                </button>
              </div>
            </div>

            {/* Rotación libre */}
            <div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  <RotateCw size={11} />
                  <span>Rotación Libre del Marco</span>
                </span>
                <span className="text-amber-300">{guides.goldenRatioAngle || 0}°</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                step={5}
                value={guides.goldenRatioAngle || 0}
                onChange={e => onChange({ goldenRatioAngle: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Escala */}
            <div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  <Maximize2 size={11} />
                  <span>Escala del Marco</span>
                </span>
                <span className="text-amber-300">{Math.round((guides.goldenRatioScale || 1.0) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.6}
                step={0.05}
                value={guides.goldenRatioScale || 1.0}
                onChange={e => onChange({ goldenRatioScale: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Subdivisiones */}
            <label className="flex items-center gap-2 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={guides.goldenRatioSubdivisions}
                onChange={() => toggle('goldenRatioSubdivisions')}
                className="accent-amber-400 rounded cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-300">Subdivisiones Áureas Anidadas</span>
            </label>
          </div>
        )}
      </div>

      {/* 4. REJILLAS Y GUÍAS VISUALES */}
      <div className="p-3 bg-[#0a121e] border border-slate-800 rounded space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300 block mb-1">
          Rejillas Guía en Lienzo
        </span>

        {/* Ver Malla Hexagonal en Lienzo */}
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={guides.hexGridVisible}
              onChange={() => toggle('hexGridVisible')}
              className="accent-cyan-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
              <Hexagon size={12} className="text-cyan-400" />
              <span>Ver Malla Hexagonal</span>
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400">Geometría Sagrada</span>
        </label>

        {/* Ver Cuadrícula Ortogonal en Lienzo */}
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={guides.gridVisible}
              onChange={() => toggle('gridVisible')}
              className="accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
              <Grid size={12} className="text-amber-400" />
              <span>Ver Cuadrícula Regular</span>
            </span>
          </div>
          <span className="text-[9px] font-mono text-amber-400">{guides.snapStep || 25}px</span>
        </label>

        {/* Ejes Cartesianos */}
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={guides.axes}
              onChange={() => toggle('axes')}
              className="accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-200">Ejes Cartesianos (X/Y)</span>
          </div>
        </label>

        {/* Círculos Armónicos */}
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={guides.concentricCircles}
              onChange={() => toggle('concentricCircles')}
              className="accent-purple-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-200">Círculos Concéntricos (75/150/225)</span>
          </div>
        </label>
      </div>

      {/* 5. ETIQUETAS Y LECTURA */}
      <div className="p-3 bg-[#0a121e] border border-slate-800 rounded space-y-2">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={guides.letterLabels}
              onChange={() => toggle('letterLabels')}
              className="accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-200">Mostrar Fonemas (Letras)</span>
          </div>
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={guides.indices}
              onChange={() => toggle('indices')}
              className="accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-200">Mostrar Índices (01–24)</span>
          </div>
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={guides.sequentialConnections}
              onChange={() => toggle('sequentialConnections')}
              className="accent-purple-400 rounded cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-200">Conectar Nodos (01 → 24)</span>
          </div>
        </label>
      </div>
    </div>
  );
};