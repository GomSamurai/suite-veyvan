import React from 'react';
import { WordTraceConfig, PressureMode } from './types/matrix';
import { playSoftClick } from './utils/audioEngine';
import { PenTool, Volume2, Sparkles, Feather } from 'lucide-react';

interface Props {
  config: WordTraceConfig;
  onChange: (updated: Partial<WordTraceConfig>) => void;
  onPlayWordSound: (word: string) => void;
}

const COLOR_OPTIONS = [
  { label: 'Dorado', value: '#e9c47e' },
  { label: 'Cian', value: '#75e4de' },
  { label: 'Púrpura', value: '#c084fc' },
  { label: 'Esmeralda', value: '#34d399' },
  { label: 'Rubí', value: '#f87171' },
];

const SAMPLE_WORDS = [
  'KAEL',
  'NYM',
  'TAEL',
  'RHEA',
  'THIM',
  'ALU',
  'VEHLAEN',
  'KOA'
];

const PRESSURE_MODES: { id: PressureMode; label: string; desc: string }[] = [
  { id: 'uniform', label: 'Uniforme', desc: 'Calibre plano constante' },
  { id: 'crescendo', label: 'Fino → Grueso', desc: 'Presión creciente de inicio a fin' },
  { id: 'decrescendo', label: 'Grueso → Fino', desc: 'Presión menguante de inicio a fin' },
  { id: 'tapered', label: 'Huso Pincel', desc: 'Fino en extremos, grueso en el cuerpo' },
  { id: 'nib', label: 'Cálamo Biselado', desc: 'Grosor dinámico según inclinación de pluma' },
];

export const WordTraceComposer: React.FC<Props> = ({
  config,
  onChange,
  onPlayWordSound,
}) => {
  const pressureMode = config.pressureMode || 'uniform';
  const intensity = config.pressureIntensity ?? 1.0;
  const nibAngle = config.nibAngle ?? 45;

  return (
    <div className="space-y-3.5 bg-[#0a121e] border border-slate-800 p-3.5 rounded">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
          <PenTool size={12} />
          <span>Trazado Glífico en Vivo</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={e => {
              playSoftClick();
              onChange({ enabled: e.target.checked });
            }}
            className="accent-amber-400 rounded cursor-pointer"
          />
          <span className="text-[10px] font-mono text-slate-300">Activar Trazo</span>
        </label>
      </div>

      {/* Word Input */}
      <div>
        <div className="relative">
          <input
            type="text"
            value={config.word}
            onChange={e => onChange({ word: e.target.value.toUpperCase() })}
            placeholder="Escribe palabra (ej. KAEL, NYM, RHEA)..."
            className="w-full bg-[#060a12] border border-slate-700 focus:border-cyan-400 px-3 py-2 text-sm font-mono font-bold text-cyan-200 outline-none uppercase tracking-wider rounded"
          />
          {config.word.trim() && (
            <button
              onClick={() => onPlayWordSound(config.word)}
              className="absolute right-2 top-2 p-1 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Escuchar pronunciación armónica de la palabra"
            >
              <Volume2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Word Chips */}
      <div className="flex flex-wrap gap-1">
        {SAMPLE_WORDS.map(sample => (
          <button
            key={sample}
            onClick={() => {
              playSoftClick();
              onChange({ word: sample, enabled: true });
              onPlayWordSound(sample);
            }}
            className="px-2 py-0.5 bg-[#060a12] hover:bg-cyan-950 border border-slate-800 hover:border-cyan-700 text-slate-400 hover:text-cyan-200 text-[10px] font-mono rounded transition-colors"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Color & Stroke Options */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        <div>
          <span className="text-[9px] font-mono text-slate-400 block mb-1">Color de Trazo</span>
          <div className="flex items-center gap-1.5">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c.value}
                onClick={() => {
                  playSoftClick();
                  onChange({ color: c.value });
                }}
                className={`w-5 h-5 rounded-full border transition-all ${
                  config.color === c.value ? 'scale-125 border-white' : 'border-transparent opacity-60'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
            <span>Calibre Base</span>
            <span className="text-amber-300">{config.strokeWidth} px</span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={0.5}
            value={config.strokeWidth}
            onChange={e => onChange({ strokeWidth: Number(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>
      </div>

      {/* Calligraphic Pressure & Nib Simulation */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Feather size={11} />
            <span>Presión & Caligrafía Tael'im</span>
          </label>
          <span className="text-[9px] font-mono text-slate-400">
            {PRESSURE_MODES.find(m => m.id === pressureMode)?.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {PRESSURE_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                playSoftClick();
                onChange({ pressureMode: mode.id });
              }}
              title={mode.desc}
              className={`py-1 px-1.5 text-[9px] font-mono rounded border text-center transition-all truncate ${
                pressureMode === mode.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-[#060a12] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Pressure Intensity Slider (when not uniform) */}
        {pressureMode !== 'uniform' && (
          <div className="space-y-2 pt-1">
            <div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                <span>Modulación de Presión</span>
                <span className="text-cyan-300">{intensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={2.5}
                step={0.1}
                value={intensity}
                onChange={e => onChange({ pressureIntensity: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Nib Angle for Chisel Pen mode */}
            {pressureMode === 'nib' && (
              <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                  <span>Ángulo de Pluma / Bisel</span>
                  <span className="text-purple-300">{nibAngle}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={nibAngle}
                  onChange={e => onChange({ nibAngle: Number(e.target.value) })}
                  className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};