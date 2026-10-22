import React, { useRef, useState } from 'react';
import { BookOpen, BarChart2, PlusCircle, Download, Upload, PenTool, Cpu, Volume2, VolumeX, Languages, Scroll, GraduationCap, Sparkles, Globe, Sun, Moon } from 'lucide-react';
import { toggleAmbientHum } from '../utils/taelimAudio';
import { NavigationTab } from '../types';

interface Props {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const Navigation: React.FC<Props> = ({ 
  activeTab, 
  setActiveTab, 
  onExport, 
  onImport,
  theme = 'dark',
  onToggleTheme 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHumming, setIsHumming] = useState(false);

  const handleToggleAudio = () => {
    const active = toggleAmbientHum();
    setIsHumming(active);
  };

  const btnClass = (tab: NavigationTab, accent: 'cyan' | 'purple' | 'amber' | 'emerald' | 'sky' = 'cyan') => {
    const isActive = activeTab === tab;
    let activeColors = 'text-cyan-400 dark:text-cyan-300 bg-cyan-500/15 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]';
    if (accent === 'purple') {
      activeColors = 'text-purple-400 dark:text-purple-300 bg-purple-500/15 border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]';
    } else if (accent === 'amber') {
      activeColors = 'text-amber-500 dark:text-amber-300 bg-amber-500/15 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]';
    } else if (accent === 'emerald') {
      activeColors = 'text-emerald-500 dark:text-emerald-300 bg-emerald-500/15 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
    } else if (accent === 'sky') {
      activeColors = 'text-sky-500 dark:text-sky-300 bg-sky-500/15 border-sky-400/40 shadow-[0_0_15px_rgba(14,165,233,0.25)]';
    }

    return `
      relative group flex items-center gap-1.5 lg:gap-2 px-2.5 sm:px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl transition-all duration-300 text-xs sm:text-sm font-rajdhani font-bold tracking-wider whitespace-nowrap flex-shrink-0 cursor-pointer border
      ${isActive 
        ? activeColors 
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-200 hover:bg-black/5 dark:hover:bg-white/5 border-transparent'}
    `;
  };

  return (
    <div className="w-full flex justify-center pt-2 sm:pt-4 px-2 sm:px-4 z-50 sticky top-0 pointer-events-none">
      <nav className="flex items-center justify-between p-1.5 sm:p-2 bg-slate-950/90 dark:bg-slate-950/90 light:bg-white/95 backdrop-blur-2xl border border-white/10 dark:border-white/10 light:border-slate-200 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] pointer-events-auto w-full max-w-[99vw] 2xl:max-w-[1920px] transition-all duration-300 gap-2">
        
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

        {/* Tab Controls - Generous width, responsive, clean, fits all 9 tabs with distinct semantic accents */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto flex-1 justify-start xl:justify-center hide-scrollbar px-1 py-0.5 scroll-smooth">
          <button id="tab-glossary" onClick={() => setActiveTab('glossary')} className={btnClass('glossary', 'cyan')} title="Base de Datos Lexical Transversal">
            <BookOpen size={14} className={activeTab === 'glossary' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Datos</span>
          </button>
          <button id="tab-translator" onClick={() => setActiveTab('translator')} className={btnClass('translator', 'sky')} title="Traductor Bidireccional y Gramática Transversal">
            <Languages size={14} className={activeTab === 'translator' ? 'text-sky-300 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]' : 'text-slate-500 group-hover:text-sky-400'}/>
            <span>Traductor</span>
          </button>
          <button id="tab-taelim" onClick={() => setActiveTab('taelim')} className={btnClass('taelim', 'purple')} title="Caligrafía Tael'im Dinámica y Glifos">
             <PenTool size={14} className={activeTab === 'taelim' ? 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'text-slate-500 group-hover:text-purple-400'}/>
            <span>Tael'im</span>
          </button>
          <button id="tab-calligram" onClick={() => setActiveTab('calligram')} className={btnClass('calligram', 'amber')} title="Estudio de Caligramas Sagrados y Fórmulas Canónicas">
            <Sparkles size={14} className={activeTab === 'calligram' ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'text-slate-500 group-hover:text-amber-400'}/>
            <span>Caligramas</span>
          </button>
          <button id="tab-lore" onClick={() => setActiveTab('lore')} className={btnClass('lore', 'emerald')} title="Atlas y Crónicas Históricas de Estación Humanidad">
            <Globe size={14} className={activeTab === 'lore' ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'text-slate-500 group-hover:text-emerald-400'}/>
            <span>Estación Lore</span>
          </button>
          <button id="tab-codex" onClick={() => setActiveTab('codex')} className={btnClass('codex', 'purple')} title="Códice Lingüístico y Canónico">
            <Scroll size={14} className={activeTab === 'codex' ? 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'text-slate-500 group-hover:text-purple-400'}/>
            <span>Códice</span>
          </button>
          <button id="tab-academy" onClick={() => setActiveTab('academy')} className={btnClass('academy', 'sky')} title="Academia de Aprendizaje y Práctica">
            <GraduationCap size={14} className={activeTab === 'academy' ? 'text-sky-300 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]' : 'text-slate-500 group-hover:text-sky-400'}/>
            <span>Academia</span>
          </button>
          <button id="tab-constructor" onClick={() => setActiveTab('constructor')} className={btnClass('constructor', 'cyan')} title="Constructor de Vocabulario y Raíces">
             <PlusCircle size={14} className={activeTab === 'constructor' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:text-cyan-400'}/>
            <span>Construct</span>
          </button>
          <button id="tab-stats" onClick={() => setActiveTab('stats')} className={btnClass('stats', 'emerald')} title="Métricas del Sistema y Estado del Reactor">
             <BarChart2 size={14} className={activeTab === 'stats' ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'text-slate-500 group-hover:text-emerald-400'}/>
            <span>Métricas</span>
          </button>
        </div>

        {/* Sound, Theme and Import/Export Controls */}
        <div className="flex items-center gap-1 pl-2 pr-1 py-1 border-l border-white/5 flex-shrink-0">
          {/* Selector de Modo Solar (Claro) / Modo Vacío (Oscuro) */}
          {onToggleTheme && (
            <button 
              onClick={onToggleTheme} 
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                theme === 'light' 
                  ? 'text-amber-600 bg-amber-500/20 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'text-slate-400 hover:text-amber-300 hover:bg-white/5 border border-transparent'
              }`}
              title={theme === 'light' ? "Modo Solar (Luz del Émulo) activo. Clic para cambiar a Modo Oscuro (Vacío Cósmico)" : "Modo Vacío Cósmico activo. Clic para cambiar a Modo Claro (Luz del Émulo)"}
            >
              {theme === 'light' ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} />}
            </button>
          )}

          <button 
            onClick={handleToggleAudio} 
            className={`p-2 rounded-xl transition-all duration-300 ${isHumming ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.4)] animate-pulse' : 'text-slate-500 hover:text-cyan-300 hover:bg-white/5'}`}
            title={isHumming ? "Silenciar Pulso del Reactor de la Estación" : "Activar Pulso del Reactor de la Estación"}
          >
            {isHumming ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button 
            onClick={onExport} 
            className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
            title="Exportar Base de Datos"
          >
            <Download size={14} />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
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