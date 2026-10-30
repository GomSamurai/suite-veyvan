import React from 'react';
import { MatrixNode } from './types/matrix';
import { PHONEME_DATA } from './constants/phonemes';
import { playPhonemeTone, playSoftClick } from './utils/audioEngine';
import { ArrowLeftRight } from 'lucide-react';

interface Props {
  nodes: MatrixNode[];
  selectedIndex: number;
  onSelectNode: (index: number) => void;
  onSwapNodes: (indexA: number, indexB: number) => void;
}

export const PhonemePalette: React.FC<Props> = ({
  nodes,
  selectedIndex,
  onSelectNode,
  onSwapNodes,
}) => {
  const selectedLetter = nodes[selectedIndex]?.letter?.toUpperCase() || '';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
          <ArrowLeftRight size={12} />
          <span>Matriz de los 24 Fonemas</span>
        </label>
        <span className="text-[9px] font-mono text-slate-500">Orden Canónico</span>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {nodes.map((node, idx) => {
          const isSelected = idx === selectedIndex;
          const isLocked = node.locked;
          const lore = PHONEME_DATA[node.letter.toLowerCase()];

          const tooltip = isSelected
            ? `Nodo #${String(idx + 1).padStart(2, '0')}: [${node.letter.toUpperCase()}] Seleccionado`
            : `Nodo #${String(idx + 1).padStart(2, '0')}: [${node.letter.toUpperCase()}] (${lore?.concept || ''})\n• Click Izquierdo: Seleccionar\n• Click Derecho: Intercambiar posición con [${selectedLetter}]`;

          return (
            <button
              key={idx}
              onClick={() => {
                playSoftClick();
                playPhonemeTone(node.letter, 0.15);
                onSelectNode(idx);
              }}
              onContextMenu={e => {
                e.preventDefault();
                if (selectedIndex !== null && selectedIndex !== undefined && selectedIndex !== idx) {
                  onSwapNodes(selectedIndex, idx);
                } else {
                  onSelectNode(idx);
                }
              }}
              title={tooltip}
              className={`py-2 px-1 rounded border text-center font-mono transition-all relative group flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)] scale-105 z-10'
                  : isLocked
                  ? 'bg-purple-950/40 border-purple-800 text-purple-300 hover:border-purple-600'
                  : 'bg-[#09111c] hover:bg-slate-800 border-slate-800 hover:border-amber-500/60 text-slate-300'
              }`}
            >
              <span className="text-xs font-bold uppercase">{node.letter}</span>
              <span className="text-[8px] text-slate-500 block leading-none mt-0.5">
                {String(idx + 1).padStart(2, '0')}
              </span>
              {isLocked && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-purple-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Right-Click Swap Action Tip */}
      <div className="p-2 bg-[#060a12] border border-[#1b2738] rounded flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-cyan-400 font-bold">Click Izq:</span> Selecciona
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-amber-400 font-bold">Click Der:</span> Permuta ⇄ [{selectedLetter}]
        </div>
      </div>
    </div>
  );
};