import React, { useRef, useState } from 'react';
import { BookOpen, BarChart2, PlusCircle, Download, Upload, PenTool, Cpu, Volume2, VolumeX, Languages, Scroll, GraduationCap, Sparkles, Globe } from 'lucide-react';
import { toggleAmbientHum } from '../utils/taelimAudio';
import { NavigationTab } from '../types';

interface Props {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Navigation: React.FC<Props> = ({ activeTab, setActiveTab, onExport, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHumming, setIsHumming] = useState(false);

  const handleToggleAudio = () => {
    const active = toggleAmbientHum();
    setIsHumming(active);
  };

  const btnClass = (tab: NavigationTab) => `
    relative group flex items-center gap-1.5 lg:gap-2 px-2.5 sm:px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl transition-all duration-300 text-[11px] sm:text-xs font-rajdhani font-semibold tracking-wider whitespace-nowrap flex-shrink-0
    ${activeTab === tab 
      ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/35 shadow-[0_0_15px_rgba(34,211,238,0.25)]' 
      : 'text-slate-400 hover:text-cyan-200 hover:bg-white/5 border border-transparent'}
  `;

  return (
    <div className="w-full flex justify-center pt-3 sm:pt-4 md:pt-5 px-2 sm:px-4 z-50 sticky top-0 pointer-events-none">
      <nav className="flex items-center justify-between p-1.5 sm:p-2 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] pointer-events-auto w-full max-w-[98vw] 2xl:max-w-[1680px] transition-all duration-300 gap-2">
        
        {/* Brand Section */}
        <div className="flex items-center pl-2 pr-3 py-0.5 flex-shrink-0 border-r border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-cyan-500/40 bg-cyan-500/15 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
               <Cpu size={14} className="animate-pulse opacity-90"/>
            </div>
            <div className="flex flex-col justify-center">
               <h1 className="text-xs sm:text-sm font-bold font-rajdhani text-slate-100 uppercase tracking-[0.25em] leading-none">
                 Glosario
               </h1>
               <span className="text-[8px] sm:text-[9px] text-cyan-400/80 font-mono tracking-widest block mt-0.5 font-medium">
                 SYS.TRANSVERSAL
               </span>
            </div>
          </div>
        </div>

        {/* Tab Controls - Generous width, responsive, clean, fits all 9 tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto flex-1 justify-start xl:justify-center hide-scrollbar px-1 py-0.5 scroll-smooth">
          <button id="tab-glossary" onClick={() => setActiveTab('glossary')} className={btnClass('glossary')} title="Base de Datos Lexical Transversal">
            <BookOpen size={14} className={activeTab === 'glossary' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Datos</span>
          </button>
          <button id="tab-translator" onClick={() => setActiveTab('translator')} className={btnClass('translator')} title="Traductor Bidireccional y Gramática Transversal">
            <Languages size={14} className={activeTab === 'translator' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Traductor</span>
          </button>
          <button id="tab-taelim" onClick={() => setActiveTab('taelim')} className={btnClass('taelim')} title="Caligrafía Tael'im Dinámica y Glifos">
             <PenTool size={14} className={activeTab === 'taelim' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Tael'im</span>
          </button>
          <button id="tab-calligram" onClick={() => setActiveTab('calligram')} className={btnClass('calligram')} title="Estudio de Caligramas Sagrados y Fórmulas Canónicas">
            <Sparkles size={14} className={activeTab === 'calligram' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Caligramas</span>
          </button>
          <button id="tab-lore" onClick={() => setActiveTab('lore')} className={btnClass('lore')} title="Atlas y Crónicas Históricas de Estación Humanidad">
            <Globe size={14} className={activeTab === 'lore' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Estación Lore</span>
          </button>
          <button id="tab-codex" onClick={() => setActiveTab('codex')} className={btnClass('codex')} title="Códice Lingüístico y Canónico">
            <Scroll size={14} className={activeTab === 'codex' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Códice</span>
          </button>
          <button id="tab-academy" onClick={() => setActiveTab('academy')} className={btnClass('academy')} title="Academia de Aprendizaje y Práctica">
            <GraduationCap size={14} className={activeTab === 'academy' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Academia</span>
          </button>
          <button id="tab-constructor" onClick={() => setActiveTab('constructor')} className={btnClass('constructor')} title="Constructor de Vocabulario y Raíces">
             <PlusCircle size={14} className={activeTab === 'constructor' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Construct</span>
          </button>
          <button id="tab-stats" onClick={() => setActiveTab('stats')} className={btnClass('stats')} title="Métricas del Sistema y Estado del Reactor">
             <BarChart2 size={14} className={activeTab === 'stats' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Métricas</span>
          </button>
        </div>

        {/* Sound and Import/Export Controls */}
        <div className="flex items-center gap-1 pl-2 pr-1 py-1 border-l border-white/5 flex-shrink-0">
          <button 
            onClick={handleToggleAudio} 
            className={`p-2 rounded-xl transition-all duration-300 ${isHumming ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.4)] animate-pulse' : 'text-slate-500 hover:text-cyan-300 hover:bg-white/5'}`}
            title={isHumming ? "Silenciar Pulso del Reactor de la Estación" : "Activar Pulso del Reactor de la Estación"}
          >
            {isHumming ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button 
            onClick={onExport} 
            className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300"
            title="Exportar Base de Datos"
          >
            <Download size={14} />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300"
            title="Importar Base de Datos"
          >
            <Upload size={14} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onImport} 
            className="hidden" 
            accept="application/json" 
          />
        </div>
      </nav>
    </div>
  );
};

export default Navigation;