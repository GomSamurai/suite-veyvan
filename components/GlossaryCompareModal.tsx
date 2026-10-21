import React from 'react';
import { Term, Tonality } from '../types';
import { X, GitCompare } from 'lucide-react';
import MiniTaelim from './MiniTaelim';

interface Props {
  showCompareModal: boolean;
  setShowCompareModal: (v: boolean) => void;
  comparedTerms: Term[];
  getTonalityColor: (t: Tonality) => string;
}

const GlossaryCompareModal: React.FC<Props> = ({ showCompareModal, setShowCompareModal, comparedTerms, getTonalityColor }) => {
  if (!showCompareModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-950 border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative corner-accent">
        <button 
          onClick={() => setShowCompareModal(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white border border-slate-800 p-2"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-widest border-b border-slate-800 pb-4">
            <GitCompare className="text-orange-500" />
            Análisis Comparativo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800 border border-slate-800">
            {comparedTerms.map(term => (
              <div key={term.id} className="bg-slate-950 p-8 flex flex-col">
                <div className="text-center pb-6 border-b border-slate-800 mb-6">
                  <div className="flex justify-center mb-6 gap-6 items-end">
                     {/* Dual Glyph Display in Compare Modal */}
                     <div className="flex flex-col items-center gap-2">
                        <span className="text-[9px] text-cyan-500 font-mono tracking-widest border border-cyan-900 px-1">ALGANTE</span>
                        <div className="w-32 h-24 border border-slate-800 bg-slate-900 p-2">
                          <MiniTaelim root={term.root} mode="algante" strokeColor="#22d3ee" />
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <span className="text-[9px] text-emerald-500 font-mono tracking-widest border border-emerald-900 px-1">COMÚN</span>
                        <div className="w-24 h-32 border border-slate-800 bg-slate-900 p-2">
                          <MiniTaelim root={term.root} mode="comun" strokeColor="#34d399" />
                        </div>
                     </div>
                  </div>
                  <h3 className="text-5xl font-bold text-white mb-2 tracking-wide font-sans">
                    {term.root}
                  </h3>
                  <p className="text-lg text-slate-400 font-mono">{term.meaning}</p>
                </div>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-600 block mb-1">Categoría</label>
                    <p className="text-slate-300 font-bold">{term.category}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-600 block mb-1">Matiz / Descripción</label>
                    <p className="text-slate-400 font-mono text-sm leading-relaxed">{term.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-slate-600 block mb-1">Tonalidad</label>
                      <div className={`text-xs font-bold px-2 py-1 border inline-block ${getTonalityColor(term.tonality)}`}>
                        {term.tonality}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-slate-600 block mb-1">Métrica</label>
                      <p className="text-slate-300 font-mono">{term.syllables} SIL</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {comparedTerms.length < 2 && (
              <div className="bg-slate-950 flex flex-col items-center justify-center p-12 text-slate-700">
                <div className="border border-dashed border-slate-800 p-8 w-full h-full flex items-center justify-center uppercase font-mono text-sm">
                  [ ESPERANDO DATOS DE ENTRADA ]
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlossaryCompareModal;
