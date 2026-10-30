import React from 'react';
import { MatrixParameters, PatternType } from './types/matrix';
import { playSoftClick } from './utils/audioEngine';
import { RotateCcw } from 'lucide-react';

interface Props {
  params: MatrixParameters;
  pattern: PatternType;
  onChange: (updated: Partial<MatrixParameters>) => void;
  onReset: () => void;
}

export const ParametricControls: React.FC<Props> = ({
  params,
  pattern,
  onChange,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
          Transformaciones & Parámetros
        </label>
        <button
          onClick={() => { playSoftClick(); onReset(); }}
          className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          title="Restaurar parámetros por defecto"
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>

      <div className="space-y-3.5">
        {/* Escala */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Escala Global</span>
            <span className="text-amber-400 font-bold">{Math.round(params.scale * 100)}%</span>
          </div>
          <input
            type="range"
            min={40}
            max={220}
            value={Math.round(params.scale * 100)}
            onChange={e => onChange({ scale: Number(e.target.value) / 100 })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        {/* Rotación */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Rotación Angular</span>
            <span className="text-amber-400 font-bold">{params.rotation}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            value={params.rotation}
            onChange={e => onChange({ rotation: Number(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        {/* Separación */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Separación / Tensión</span>
            <span className="text-amber-400 font-bold">{Math.round(params.spacing * 100)}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={180}
            value={Math.round(params.spacing * 100)}
            onChange={e => onChange({ spacing: Number(e.target.value) / 100 })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        {/* Radio Base */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Radio Base</span>
            <span className="text-amber-400 font-bold">{params.radius} px</span>
          </div>
          <input
            type="range"
            min={80}
            max={360}
            step={5}
            value={params.radius}
            onChange={e => onChange({ radius: Number(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        {/* Ángulo Dorado (para familias polar y fibonacci) */}
        {['polar', 'fibonacci', 'triple'].includes(pattern) && (
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Ángulo Dorado (φ)</span>
              <span className="text-cyan-400 font-bold">{params.angle}°</span>
            </div>
            <input
              type="range"
              min={90}
              max={180}
              step={0.1}
              value={params.angle}
              onChange={e => onChange({ angle: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
            />
          </div>
        )}

        {/* Parámetros de Onda Senoidal */}
        {pattern === 'wave' && (
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Frecuencia</label>
              <input
                type="number"
                min={1}
                max={12}
                value={params.waveFreq}
                onChange={e => onChange({ waveFreq: Number(e.target.value) })}
                className="w-full bg-[#0a121e] border border-slate-700 p-1.5 rounded text-xs font-mono text-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Amplitud</label>
              <input
                type="number"
                min={10}
                max={200}
                value={params.waveAmp}
                onChange={e => onChange({ waveAmp: Number(e.target.value) })}
                className="w-full bg-[#0a121e] border border-slate-700 p-1.5 rounded text-xs font-mono text-white"
              />
            </div>
          </div>
        )}

        {/* Tamaño del Núcleo de los Nodos */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Calibre de Nodo</span>
            <span className="text-amber-400 font-bold">{params.nodeSize} px</span>
          </div>
          <input
            type="range"
            min={7}
            max={24}
            value={params.nodeSize}
            onChange={e => onChange({ nodeSize: Number(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>
      </div>
    </div>
  );
};
