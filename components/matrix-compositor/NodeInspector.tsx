import React from 'react';
import { MatrixNode } from './types/matrix';
import { PHONEME_DATA } from './constants/phonemes';
import { playPhonemeTone, playSoftClick } from './utils/audioEngine';
import { Lock, Unlock, Volume2, Crosshair } from 'lucide-react';

interface Props {
  selectedNode: MatrixNode | null;
  onUpdateCoords: (x: number, y: number) => void;
  onToggleLock: () => void;
}

export const NodeInspector: React.FC<Props> = ({
  selectedNode,
  onUpdateCoords,
  onToggleLock,
}) => {
  if (!selectedNode) {
    return (
      <div className="p-4 bg-[#0a121e] border border-slate-800 rounded text-center text-slate-500 font-mono text-xs">
        Selecciona un nodo en el lienzo para inspeccionar sus coordenadas y resonancia.
      </div>
    );
  }

  const lore = PHONEME_DATA[selectedNode.letter.toLowerCase()];

  return (
    <div className="space-y-3.5 bg-[#0a121e] border border-slate-800 p-3.5 rounded">
      {/* Header with Letter & Concept */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-300 font-mono font-extrabold text-2xl shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            {selectedNode.letter.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-500">
                NODO #{String(selectedNode.index + 1).padStart(2, '0')}
              </span>
              {selectedNode.locked && (
                <span className="px-1 py-0.2 bg-purple-950 border border-purple-700 text-purple-300 font-mono text-[9px] rounded">
                  BLOQUEADO
                </span>
              )}
            </div>
            <h4 className="text-xs font-mono font-bold text-white uppercase">
              {lore?.concept || 'Fonema Sagrado'}
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">
              {lore?.family || 'Consonante'} · {lore?.freq || 256} Hz
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            playPhonemeTone(selectedNode.letter);
          }}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 rounded transition-colors"
          title="Escuchar Tono Resonante a 432Hz"
        >
          <Volume2 size={15} />
        </button>
      </div>

      {/* Lore Description */}
      {lore && (
        <p className="text-[11px] font-sans text-slate-300 leading-relaxed italic bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
          «{lore.desc}»
        </p>
      )}

      {/* Exact Coordinates Input */}
      <div>
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
          Coordenadas de Posición (PX)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[9px] font-mono text-slate-500 block mb-0.5">EJE X</span>
            <input
              type="number"
              step={1}
              value={Math.round(selectedNode.x)}
              disabled={selectedNode.locked}
              onChange={e => onUpdateCoords(Number(e.target.value), selectedNode.y)}
              className="w-full bg-[#060a12] border border-slate-700 focus:border-amber-400 p-1.5 rounded font-mono text-xs text-amber-200 outline-none"
            />
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 block mb-0.5">EJE Y</span>
            <input
              type="number"
              step={1}
              value={Math.round(selectedNode.y)}
              disabled={selectedNode.locked}
              onChange={e => onUpdateCoords(selectedNode.x, Number(e.target.value))}
              className="w-full bg-[#060a12] border border-slate-700 focus:border-amber-400 p-1.5 rounded font-mono text-xs text-amber-200 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Lock Button */}
      <button
        onClick={() => {
          playSoftClick();
          onToggleLock();
        }}
        className={`w-full py-2 px-3 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
          selectedNode.locked
            ? 'bg-purple-950/60 border-purple-600 text-purple-200 hover:bg-purple-900/80'
            : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
        }`}
      >
        {selectedNode.locked ? <Unlock size={13} /> : <Lock size={13} />}
        <span>{selectedNode.locked ? 'Desbloquear Nodo' : 'Bloquear Posición'}</span>
      </button>
    </div>
  );
};
