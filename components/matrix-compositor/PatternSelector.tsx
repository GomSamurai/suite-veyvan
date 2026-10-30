import React from 'react';
import { PatternType } from './types/matrix';
import { PATTERN_CATEGORIES } from './constants/presets';
import { playSoftClick } from './utils/audioEngine';

interface Props {
  activePattern: PatternType;
  onSelectPattern: (pattern: PatternType) => void;
}

export const PatternSelector: React.FC<Props> = ({ activePattern, onSelectPattern }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
          Familia Geométrica
        </label>
        <span className="text-[9px] font-mono text-slate-500">16 Patrones</span>
      </div>

      <div className="relative">
        <select
          value={activePattern}
          onChange={e => {
            playSoftClick();
            onSelectPattern(e.target.value as PatternType);
          }}
          className="w-full bg-[#0a121e] border border-slate-700 hover:border-cyan-500 text-slate-100 rounded p-2.5 text-xs font-mono font-medium outline-none transition-colors cursor-pointer"
        >
          {PATTERN_CATEGORIES.map(cat => (
            <optgroup key={cat.category} label={cat.category}>
              {cat.items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label} ({item.sublabel})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Quick Pattern Chips Grid */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {PATTERN_CATEGORIES.flatMap(c => c.items).map(item => (
          <button
            key={item.id}
            onClick={() => {
              playSoftClick();
              onSelectPattern(item.id);
            }}
            className={`p-2 text-left rounded border transition-all text-[11px] font-mono flex flex-col justify-between ${
              activePattern === item.id
                ? 'bg-amber-950/50 border-amber-500 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-[#09111c] hover:bg-slate-800/80 border-slate-800 text-slate-300'
            }`}
          >
            <span className="font-bold truncate">{item.label}</span>
            <span className="text-[9px] text-slate-400 truncate">{item.sublabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
