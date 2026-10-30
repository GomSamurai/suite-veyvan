import React, { useRef, useState, useEffect } from 'react';
import { 
  BookOpen, 
  BarChart2, 
  PlusCircle, 
  Download, 
  Upload, 
  PenTool, 
  Cpu, 
  Volume2, 
  VolumeX, 
  Languages, 
  Scroll, 
  GraduationCap, 
  Sparkles, 
  Globe, 
  Sun, 
  Moon, 
  Headphones, 
  ChevronLeft, 
  ChevronRight,
  Radio,
  LayoutGrid
} from 'lucide-react';
import { toggleAmbientHum } from '../utils/taelimAudio';
import { NavigationTab } from '../types';
import { thaliosVoice } from '../services/thaliosVoiceService';

interface Props {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenVoiceSettings?: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: 'cyan' | 'purple' | 'amber' | 'emerald' | 'sky';
  group: 'LÉXICO' | 'SINTAXIS' | 'CALIGRAFÍA' | 'UNIVERSO';
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Grupo Léxico
  {
    id: 'glossary',
    label: 'Datos',
    subtitle: 'Base Léxica Canónica',
    icon: BookOpen,
    accent: 'cyan',
    group: 'LÉXICO',
    badge: 'LEX'
  },
  {
    id: 'constructor',
    label: 'Constructor',
    subtitle: 'Forja de Radicales',
    icon: PlusCircle,
    accent: 'cyan',
    group: 'LÉXICO',
    badge: 'RAD'
  },
  // Grupo Sintaxis
  {
    id: 'translator',
    label: 'Traductor',
    subtitle: 'Matriz Sintáctica VOS',
    icon: Languages,
    accent: 'sky',
    group: 'SINTAXIS',
    badge: 'VOS'
  },
  {
    id: 'codex',
    label: 'Códice',
    subtitle: 'Códice Lingüístico',
    icon: Scroll,
    accent: 'purple',
    group: 'SINTAXIS',
    badge: 'DOC'
  },
  // Grupo Caligrafía
  {
    id: 'taelim',
    label: "Tael'im",
    subtitle: 'Caligrafía Dinámica',
    icon: PenTool,
    accent: 'purple',
    group: 'CALIGRAFÍA',
    badge: 'GLYPH'
  },
  {
    id: 'calligram',
    label: 'Caligramas',
    subtitle: "Tael'vohn Sagrado",
    icon: Sparkles,
    accent: 'amber',
    group: 'CALIGRAFÍA',
    badge: 'VOHN'
  },
  {
    id: 'matrixCompositor',
    label: "Matriz Tael'im",
    subtitle: "Compositor 24 Fonemas",
    icon: LayoutGrid,
    accent: 'cyan',
    group: 'CALIGRAFÍA',
    badge: 'MAT'
  },
  // Grupo Universo & Telemetría
  {
    id: 'lore',
    label: 'Estación Lore',
    subtitle: 'Atlas & Crónicas 344a',
    icon: Globe,
    accent: 'emerald',
    group: 'UNIVERSO',
    badge: 'ATLAS'
  },
  {
    id: 'academy',
    label: 'Academia',
    subtitle: 'Entrenamiento & Práctica',
    icon: GraduationCap,
    accent: 'sky',
    group: 'UNIVERSO',
    badge: 'TEST'
  },
  {
    id: 'stats',
    label: 'Métricas',
    subtitle: 'Telemetría del Reactor',
    icon: BarChart2,
    accent: 'emerald',
    group: 'UNIVERSO',
    badge: 'STATS'
  }
];

const Navigation: React.FC<Props> = ({ 
  activeTab, 
  setActiveTab, 
  onExport, 
  onImport,
  theme = 'dark',
  onToggleTheme,
  onOpenVoiceSettings
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHumming, setIsHumming] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  // Estado de colapso de la barra lateral persistente en localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('suite_veyvan_sidebar_collapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('suite_veyvan_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const unsub = thaliosVoice.subscribe((s) => {
      setIsVoiceActive(s.isSpeaking && !s.isPaused);
    });
    return () => unsub();
  }, []);

  const handleToggleAudio = () => {
    const active = toggleAmbientHum();
    setIsHumming(active);
  };

  const getAccentConfig = (accent: NavItem['accent'], isActive: boolean) => {
    switch (accent) {
      case 'purple':
        return {
          text: isActive ? 'text-purple-300' : 'text-slate-400 group-hover:text-purple-300',
          bg: isActive ? 'bg-purple-500/15 border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]' : 'border-transparent hover:bg-purple-500/5',
          indicator: 'bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]',
          badge: isActive ? 'text-purple-300 bg-purple-500/20 border-purple-400/30' : 'text-purple-400/60 bg-purple-500/5 border-purple-500/20'
        };
      case 'amber':
        return {
          text: isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-amber-300',
          bg: isActive ? 'bg-amber-500/15 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]' : 'border-transparent hover:bg-amber-500/5',
          indicator: 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]',
          badge: isActive ? 'text-amber-300 bg-amber-500/20 border-amber-400/30' : 'text-amber-400/60 bg-amber-500/5 border-amber-500/20'
        };
      case 'emerald':
        return {
          text: isActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-emerald-300',
          bg: isActive ? 'bg-emerald-500/15 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'border-transparent hover:bg-emerald-500/5',
          indicator: 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]',
          badge: isActive ? 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30' : 'text-emerald-400/60 bg-emerald-500/5 border-emerald-500/20'
        };
      case 'sky':
        return {
          text: isActive ? 'text-sky-300' : 'text-slate-400 group-hover:text-sky-300',
          bg: isActive ? 'bg-sky-500/15 border-sky-400/40 shadow-[0_0_15px_rgba(14,165,233,0.25)]' : 'border-transparent hover:bg-sky-500/5',
          indicator: 'bg-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.8)]',
          badge: isActive ? 'text-sky-300 bg-sky-500/20 border-sky-400/30' : 'text-sky-400/60 bg-sky-500/5 border-sky-500/20'
        };
      case 'cyan':
      default:
        return {
          text: isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300',
          bg: isActive ? 'bg-cyan-500/15 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]' : 'border-transparent hover:bg-cyan-500/5',
          indicator: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]',
          badge: isActive ? 'text-cyan-300 bg-cyan-500/20 border-cyan-400/30' : 'text-cyan-400/60 bg-cyan-500/5 border-cyan-500/20'
        };
    }
  };

  // Agrupamiento ordenado para renderizado en modo expandido
  const groups = ['LÉXICO', 'SINTAXIS', 'CALIGRAFÍA', 'UNIVERSO'] as const;

  return (
    <aside 
      className={`
        h-screen flex flex-col flex-shrink-0 z-40 relative select-none
        bg-slate-950/95 dark:bg-slate-950/95 light:bg-slate-900/98 backdrop-blur-2xl
        border-r border-white/10 dark:border-white/10 light:border-slate-800
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64 sm:w-72'}
      `}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. SECCIÓN DE CABECERA & IDENTIDAD DE ESTACIÓN */}
      {/* ------------------------------------------------------------- */}
      <div className={`p-3.5 border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} min-h-[70px]`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative group cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
            <div className="w-10 h-10 rounded-2xl border border-cyan-500/40 bg-cyan-500/15 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.35)] transition-all group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">
              <Cpu size={18} className="animate-pulse" />
            </div>
            {/* Indicador de pulso cuántico */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold font-rajdhani text-slate-100 uppercase tracking-[0.2em] truncate">
                  Suite Veyvan
                </h1>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-cyan-400/90 font-mono tracking-widest uppercase font-medium">
                  SYS.TRANSVERSAL
                </span>
                <span className="text-[9px] text-slate-500 font-mono">v4.0</span>
              </div>
            </div>
          )}
        </div>

        {/* Botón de alternar colapso / expansión */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            p-1.5 rounded-xl border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 
            transition-all duration-200 cursor-pointer
            ${isCollapsed ? 'hidden' : 'block'}
          `}
          title={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. LISTA DE NAVEGACIÓN DINÁMICA (9 SECCIONES) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar space-y-4">
        {groups.map((groupName) => {
          const itemsInGroup = NAV_ITEMS.filter((item) => item.group === groupName);
          return (
            <div key={groupName} className="space-y-1">
              {/* Título de categoría (visible solo en modo expandido) */}
              {!isCollapsed && (
                <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-slate-500 uppercase font-semibold">
                  <span>{groupName}</span>
                  <div className="h-[1px] flex-1 bg-white/5 ml-3" />
                </div>
              )}

              {/* Botones de navegación */}
              {itemsInGroup.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                const colors = getAccentConfig(item.accent, isActive);

                return (
                  <div key={item.id} className="relative group">
                    <button
                      id={`sidebar-tab-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`
                        w-full flex items-center rounded-xl transition-all duration-200 border cursor-pointer text-left relative
                        ${isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'}
                        ${colors.bg}
                        ${colors.text}
                      `}
                      title={isCollapsed ? `${item.label} — ${item.subtitle}` : undefined}
                    >
                      {/* Indicador luminoso vertical a la izquierda */}
                      {isActive && (
                        <span 
                          className={`
                            absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full 
                            ${colors.indicator}
                          `} 
                        />
                      )}

                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1 rounded-lg ${isActive ? 'bg-white/10' : 'group-hover:bg-white/5'} transition-colors`}>
                          <Icon size={18} className={isActive ? 'drop-shadow-[0_0_8px_currentColor]' : 'opacity-80 group-hover:opacity-100'} />
                        </div>

                        {!isCollapsed && (
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-rajdhani font-bold tracking-wider uppercase leading-snug">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate font-mono">
                              {item.subtitle}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Badge / Tag identificador en modo expandido */}
                      {!isCollapsed && item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border font-bold tracking-widest ${colors.badge}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Popover / Tooltip flotante en modo colapsado */}
                    {isCollapsed && (
                      <div className="
                        absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none opacity-0 group-hover:opacity-100 
                        translate-x-1 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap
                        bg-slate-950/95 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl
                        rounded-xl p-2.5 min-w-[160px]
                      ">
                        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1 mb-1">
                          <span className="text-xs font-rajdhani font-bold text-slate-100 tracking-wider uppercase">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className={`text-[8px] font-mono px-1 py-0.2 rounded border font-bold ${colors.badge}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans">
                          {item.subtitle}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. DOCK DE CONTROL, UTILIDADES Y CALIBRACIÓN DE VOZ */}
      {/* ------------------------------------------------------------- */}
      <div className="p-3 border-t border-white/10 bg-black/40 space-y-2">
        {/* Botón de Calibración de Voz de Thalios Solaris */}
        {onOpenVoiceSettings && (
          <div className="relative group">
            <button
              onClick={onOpenVoiceSettings}
              className={`
                w-full flex items-center rounded-xl border transition-all duration-300 cursor-pointer
                ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'}
                ${isVoiceActive 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.4)] animate-pulse' 
                  : 'bg-white/5 hover:bg-cyan-500/10 border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300'}
              `}
              title="Calibración del Núcleo de Voz // Thalios Solaris (DSP, Gemini 3.8 & Kokoro GPU)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Headphones size={16} className={isVoiceActive ? 'text-cyan-300 animate-bounce' : 'text-slate-400 group-hover:text-cyan-300'} />
                {!isCollapsed && (
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-rajdhani font-bold tracking-wider uppercase">
                      Voz Thalios
                    </span>
                    <span className="text-[9px] text-cyan-400/80 font-mono">
                      {isVoiceActive ? '● Sintetizando...' : 'Calibrar Audio'}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && isVoiceActive && (
                <Radio size={14} className="text-cyan-400 animate-spin" />
              )}
            </button>

            {isCollapsed && (
              <div className="
                absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none opacity-0 group-hover:opacity-100 
                translate-x-1 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap
                bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-2xl rounded-xl p-2.5
              ">
                <div className="text-xs font-rajdhani font-bold text-cyan-300 uppercase">
                  Voz Thalios Solaris
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                  {isVoiceActive ? 'Transmitiendo locución...' : 'Configuración de Voz & DSP'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fila compacta de utilidades de estación */}
        <div className={`flex items-center gap-1.5 ${isCollapsed ? 'flex-col' : 'justify-between'}`}>
          {/* Selector de Modo Solar / Vacío */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`
                p-2 rounded-xl transition-all duration-200 cursor-pointer border
                ${theme === 'light'
                  ? 'text-amber-500 bg-amber-500/20 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-white/5 border-transparent'}
              `}
              title={theme === 'light' ? 'Modo Solar activo. Clic para Modo Vacío (Oscuro)' : 'Modo Vacío activo. Clic para Modo Solar (Claro)'}
            >
              {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

          {/* Pulso del Reactor de Estación */}
          <button
            onClick={handleToggleAudio}
            className={`
              p-2 rounded-xl transition-all duration-200 cursor-pointer border
              ${isHumming
                ? 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.4)] animate-pulse'
                : 'text-slate-500 hover:text-cyan-300 hover:bg-white/5 border-transparent'}
            `}
            title={isHumming ? 'Silenciar Pulso del Reactor' : 'Activar Pulso del Reactor'}
          >
            {isHumming ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Exportar base de datos */}
          <button
            onClick={onExport}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200 cursor-pointer"
            title="Exportar Base de Datos (JSON)"
          >
            <Download size={15} />
          </button>

          {/* Importar base de datos */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200 cursor-pointer"
            title="Importar Base de Datos (JSON)"
          >
            <Upload size={15} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onImport} 
            className="hidden" 
            accept="application/json" 
          />

          {/* Botón de expansión cuando está colapsado */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10 rounded-xl border border-cyan-500/30 transition-all duration-200 cursor-pointer mt-1"
              title="Expandir barra lateral"
            >
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Navigation;