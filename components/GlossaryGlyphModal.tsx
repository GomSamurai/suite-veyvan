import React, { useRef, useMemo } from 'react';
import { Term, Tonality } from '../types';
import { X, Download, Layers } from 'lucide-react';
import MiniTaelim from './MiniTaelim';
import { parseTaelimExpression } from '../utils/taelimParser';
import { TAELIM_MORPHEMES } from '../data/taelimRules';

export interface GlyphModalState {
  term: Term;
  mode: 'algante' | 'comun';
}

interface Props {
  viewingGlyph: GlyphModalState;
  setViewingGlyph: (state: GlyphModalState | null) => void;
  getTonalityColor: (t: Tonality) => string;
}

const GlossaryGlyphModal: React.FC<Props> = ({ viewingGlyph, setViewingGlyph, getTonalityColor }) => {
  const glyphRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => {
    return parseTaelimExpression(viewingGlyph.term.root || '');
  }, [viewingGlyph.term.root]);

  const isMulti = parsed.isMultiUnit;

  const handleDownloadGlyph = () => {
    if (!glyphRef.current || !viewingGlyph) return;

    const svgElement = glyphRef.current.querySelector('svg');
    if (!svgElement) return;

    // Serialize SVG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // High res export
    const size = 1200; 
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if(ctx) {
        // Dark background for contrast
        ctx.fillStyle = "#020617"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center image using actual SVG aspect ratio
        const viewBoxAttr = svgElement.getAttribute('viewBox');
        let gridAspectRatio = viewingGlyph.mode === 'algante' ? (isMulti ? 0.65 : 1.44) : (isMulti ? 1.6 : 0.69);
        if (viewBoxAttr) {
          const parts = viewBoxAttr.split(/\s+/).map(Number);
          if (parts.length === 4 && parts[3] > 0) {
            gridAspectRatio = parts[2] / parts[3];
          }
        }

        const maxDraw = size * 0.75;
        let drawW: number;
        let drawH: number;

        if (gridAspectRatio > 1) {
          // Landscape
          drawW = maxDraw;
          drawH = maxDraw / gridAspectRatio;
        } else {
          // Portrait
          drawH = maxDraw;
          drawW = maxDraw * gridAspectRatio;
        }

        const offsetX = (size - drawW) / 2;
        const offsetY = (size - drawH) / 2 - 40;

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        
        // Metadata footer
        ctx.font = "bold 38px 'Space Grotesk', sans-serif";
        ctx.fillStyle = viewingGlyph.mode === 'algante' ? '#22d3ee' : '#34d399';
        ctx.textAlign = 'center';
        ctx.fillText(viewingGlyph.term.root.toUpperCase(), size / 2, size - 110);
        
        ctx.font = "24px 'Space Grotesk', sans-serif";
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(viewingGlyph.term.meaning, size / 2, size - 60);

        const link = document.createElement("a");
        link.download = `Glosario_${viewingGlyph.term.root}_${viewingGlyph.mode}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020617]/95 backdrop-blur-md p-4 animate-fade-in">
       <div className="bg-slate-950 border border-slate-700 w-full max-w-6xl shadow-2xl flex flex-col md:flex-row h-[90vh] relative corner-accent">
          
          {/* Decorative Scanlines */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20"></div>

          {/* Left Column: Glyph Display */}
          <div className="relative w-full md:w-1/2 bg-slate-900/50 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-800 z-10">
            
            {/* Close Button (Mobile) */}
            <button 
              onClick={() => setViewingGlyph(null)}
              className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white bg-slate-800 p-2 border border-slate-700"
            >
              <X size={24} />
            </button>

            {/* Adaptive Aspect Ratio Container for Modal */}
            <div 
              className={`relative border border-slate-800 bg-slate-950 p-6 flex items-center justify-center w-full
                ${isMulti
                  ? (viewingGlyph.mode === 'algante' ? 'h-full max-h-[65vh] max-w-[85%] aspect-[3/4]' : 'max-h-[60vh] max-w-[95%] aspect-[16/10]')
                  : (viewingGlyph.mode === 'algante' ? 'aspect-[4/3] max-h-[60vh]' : 'h-full aspect-[3/4] max-w-[80%]')
                }
              `} 
              ref={glyphRef}
            >
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(8,145,178,0.1)_0%,_transparent_70%)]"></div>
               
               {/* Grid Overlay */}
               <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(51,65,85,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(51,65,85,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

               <div className="w-full h-full relative z-10 flex items-center justify-center">
                <MiniTaelim 
                  root={viewingGlyph.term.root} 
                  mode={viewingGlyph.mode} 
                  strokeColor={viewingGlyph.mode === 'algante' ? '#22d3ee' : '#34d399'} 
                />
               </div>
               
               {/* Technical markers */}
               <div className="absolute top-2 left-2 text-[10px] text-slate-600 font-mono">AXIS-Y</div>
               <div className="absolute bottom-2 right-2 text-[10px] text-slate-600 font-mono">AXIS-X</div>
            </div>
            
            <div className="mt-8 flex gap-4 w-full max-w-md">
              <button 
                onClick={handleDownloadGlyph}
                className={`flex-1 flex justify-center items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all border ${
                  viewingGlyph.mode === 'algante' 
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 hover:bg-cyan-900/60' 
                  : 'bg-emerald-950/40 border-emerald-500 text-emerald-400 hover:bg-emerald-900/60'
                }`}
              >
                <Download size={16} />
                Descargar Esquema
              </button>
            </div>

            <div className="absolute bottom-4 left-6 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono">
               Render_Mode: {viewingGlyph.mode.toUpperCase()} {isMulti ? `// COMPUESTA (${parsed.units.length} RADICALES)` : '// SIMPLE'}
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="w-full md:w-1/2 p-10 flex flex-col relative overflow-y-auto z-10 bg-slate-950">
             {/* Close Button (Desktop) */}
             <button 
              onClick={() => setViewingGlyph(null)}
              className="hidden md:block absolute top-6 right-6 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-2 border-l-2 border-slate-700 pl-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${viewingGlyph.mode === 'algante' ? 'text-cyan-500' : 'text-emerald-500'}`}>
                   Análisis Espectral
                </span>
              </div>
              
              <h2 className="text-6xl font-bold text-white mb-2 tracking-tighter uppercase font-sans">
                {viewingGlyph.term.root}
              </h2>
              <h3 className="text-xl font-light text-slate-400 mb-6 font-mono border-b border-slate-800 pb-3">
                // {viewingGlyph.term.meaning}
              </h3>

              <div className="space-y-5">
                {/* Multi-radical Caligraphic Breakdown */}
                {isMulti && (
                  <div className="bg-slate-900/90 p-4 border border-cyan-500/25 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono flex items-center gap-1.5">
                        <Layers size={12} className="text-cyan-400" />
                        Descomposición Tael'im ({parsed.units.length} Radicales)
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {parsed.arcs.length} Arco{parsed.arcs.length !== 1 ? 's' : ''} de Vínculo
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {parsed.units.map((unit, idx) => {
                        const prefM = unit.prefixId ? TAELIM_MORPHEMES.find(m => m.id === unit.prefixId) : null;
                        const suffM = unit.suffixId ? TAELIM_MORPHEMES.find(m => m.id === unit.suffixId) : null;
                        const nextArc = parsed.arcs.find(a => a.fromIndex === idx);
                        const particleM = nextArc?.particleId ? TAELIM_MORPHEMES.find(m => m.id === nextArc.particleId) : null;

                        return (
                          <React.Fragment key={unit.id}>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black/60 border border-slate-700 font-mono text-xs">
                              {prefM && (
                                <span className="text-amber-400 text-[10px] bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30" title={prefM.label}>
                                  {prefM.symbol} {prefM.label.split(' ')[0]}
                                </span>
                              )}
                              <span className="font-bold text-slate-100 tracking-wider">{unit.cleanRoot}</span>
                              {suffM && (
                                <span className="text-purple-400 text-[10px] bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-500/30" title={suffM.label}>
                                  {suffM.label.split(' ')[0]} {suffM.symbol}
                                </span>
                              )}
                            </div>

                            {nextArc && (
                              <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                                {nextArc.pauseType === 'pause' ? (
                                  <span className="text-amber-400 font-bold px-1.5 py-0.5 bg-amber-950/30 rounded border border-amber-500/30" title="Pausa Litúrgica Especular">
                                    ·· pausa
                                  </span>
                                ) : (
                                  <span className="text-cyan-400 text-sm font-bold" title="Arco de Vínculo">⌒</span>
                                )}
                                {particleM && (
                                  <span className="text-emerald-400 text-[9px] bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold" title={particleM.description}>
                                    {particleM.symbol} {particleM.label.split(' ')[0]}
                                  </span>
                                )}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-slate-900 p-5 border-l-2 border-orange-500">
                   <p className="text-base text-slate-300 leading-relaxed font-light">
                     {viewingGlyph.term.description}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-px bg-slate-800 border border-slate-800">
                   <div className="p-3.5 bg-slate-900">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Clasificación</label>
                      <p className="text-slate-200 text-sm font-bold">{viewingGlyph.term.category}</p>
                   </div>
                   <div className="p-3.5 bg-slate-900">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Resonancia</label>
                      <p className={`text-sm font-bold ${getTonalityColor(viewingGlyph.term.tonality).split(' ')[0]}`}>{viewingGlyph.term.tonality}</p>
                   </div>
                   <div className="p-3.5 bg-slate-900">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Métrica</label>
                      <p className="text-slate-200 text-sm font-mono">{viewingGlyph.term.syllables} Uni-Sil</p>
                   </div>
                   <div className="p-3.5 bg-slate-900">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Modo Visual</label>
                      <p className="text-slate-200 text-xs font-mono uppercase">{viewingGlyph.mode === 'algante' ? '6x4 Vertical' : '4x6 Horizontal'}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
       </div>
    </div>
  );
};

export default GlossaryGlyphModal;
