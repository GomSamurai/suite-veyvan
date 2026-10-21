import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

export interface ExportConfig {
  bgColor: string;
  strokeColor: string;
  includeMetadata: boolean;
  includeGuides: boolean;
  includeStartEnd: boolean;
  isTransparent: boolean;
  useGradient: boolean;
}

interface TaelimExportModalProps {
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  exportConfig: ExportConfig;
  setExportConfig: (config: ExportConfig) => void;
  performExport: () => void;
}

const TaelimExportModal: React.FC<TaelimExportModalProps> = ({
  showExportModal,
  setShowExportModal,
  exportConfig,
  setExportConfig,
  performExport
}) => {
  if (!showExportModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
       <div className="bg-slate-950 border border-slate-700 w-full max-w-md shadow-2xl relative corner-accent tech-border p-6">
          <button 
            onClick={() => setShowExportModal(false)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
             <ImageIcon size={20} className="text-cyan-400" /> Exportar Glifo
          </h2>

          <div className="space-y-6">
             {/* Color Settings */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Color / Gradiente</label>
                   <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" checked={exportConfig.useGradient} onChange={e => setExportConfig({...exportConfig, useGradient: e.target.checked})} className="accent-cyan-500" />
                         <span className="text-[10px] text-slate-300 uppercase">Usar Gradiente</span>
                      </label>
                      {!exportConfig.useGradient && (
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={exportConfig.strokeColor} 
                                onChange={e => setExportConfig({...exportConfig, strokeColor: e.target.value})}
                                className="w-8 h-8 rounded-none border border-slate-600 bg-transparent p-0 cursor-pointer"
                            />
                            <span className="text-xs font-mono text-slate-300">{exportConfig.strokeColor}</span>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Fondo</label>
                   <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={exportConfig.bgColor} 
                        disabled={exportConfig.isTransparent}
                        onChange={e => setExportConfig({...exportConfig, bgColor: e.target.value})}
                        className={`w-8 h-8 rounded-none border border-slate-600 bg-transparent p-0 cursor-pointer ${exportConfig.isTransparent ? 'opacity-20' : ''}`}
                      />
                      <div className="flex items-center gap-2">
                        <input 
                           type="checkbox" 
                           checked={exportConfig.isTransparent}
                           onChange={e => setExportConfig({...exportConfig, isTransparent: e.target.checked})}
                           id="chk-trans"
                           className="accent-cyan-500"
                        />
                        <label htmlFor="chk-trans" className="text-[10px] uppercase text-slate-400">Transp.</label>
                      </div>
                   </div>
                </div>
             </div>

             {/* Toggles */}
             <div className="space-y-3 bg-slate-900 p-4 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Incluir Metadatos</span>
                   <div className={`w-10 h-5 rounded-full relative transition-colors ${exportConfig.includeMetadata ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                      <input type="checkbox" className="hidden" checked={exportConfig.includeMetadata} onChange={e => setExportConfig({...exportConfig, includeMetadata: e.target.checked})} />
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${exportConfig.includeMetadata ? 'left-6' : 'left-1'}`}></div>
                   </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mostrar Guías</span>
                   <div className={`w-10 h-5 rounded-full relative transition-colors ${exportConfig.includeGuides ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                      <input type="checkbox" className="hidden" checked={exportConfig.includeGuides} onChange={e => setExportConfig({...exportConfig, includeGuides: e.target.checked})} />
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${exportConfig.includeGuides ? 'left-6' : 'left-1'}`}></div>
                   </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Marcar Inicio/Fin</span>
                   <div className={`w-10 h-5 rounded-full relative transition-colors ${exportConfig.includeStartEnd ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                      <input type="checkbox" className="hidden" checked={exportConfig.includeStartEnd} onChange={e => setExportConfig({...exportConfig, includeStartEnd: e.target.checked})} />
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${exportConfig.includeStartEnd ? 'left-6' : 'left-1'}`}></div>
                   </div>
                </label>
             </div>

             {/* Action */}
             <button 
               onClick={performExport}
               className="w-full py-3 bg-cyan-700 hover:bg-cyan-600 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-cyan-500 shadow-lg shadow-cyan-900/20"
             >
                <ImageIcon size={16} /> Rendering Mode
             </button>
          </div>
       </div>
    </div>
  );
};

export default TaelimExportModal;
