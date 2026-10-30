import React, { useState } from 'react';
import { 
  Sparkles, 
  Minus, 
  Square, 
  X, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  FolderOpen
} from 'lucide-react';
import { toggleAmbientHum, playSoftClick } from './utils/audioEngine';

interface Props {
  patternName: string;
  nodeCount: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onOpenVault: () => void;
  onPlayArpeggio: () => void;
}

export const StudioToolbar: React.FC<Props> = ({
  patternName,
  nodeCount,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onOpenVault,
  onPlayArpeggio,
}) => {
  const [isHumming, setIsHumming] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const electronAPI = (window as any).electronAPI;

  const handleToggleDrone = () => {
    playSoftClick();
    const active = toggleAmbientHum();
    setIsHumming(active);
  };

  const handleMinimize = () => {
    if (electronAPI?.minimize) electronAPI.minimize();
  };

  const handleMaximize = async () => {
    if (electronAPI?.maximize) {
      const max = await electronAPI.maximize();
      setIsMaximized(max);
    }
  };

  const handleClose = () => {
    if (electronAPI?.close) electronAPI.close();
  };

  return (
    <header className="h-14 bg-[#080d16]/95 border-b border-[#253549] px-4 flex items-center justify-between gap-3 select-none z-30 backdrop-blur-md">
      {/* Brand & Sigil */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-amber-500/60 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
          <Sparkles size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-100">
              COMPOSITOR DE MATRICES TAEL'IM
            </h1>
            <span className="px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9px] uppercase tracking-wider rounded">
              v2.5 PRO
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 tracking-wider">
            Protocolo Tael'vohn // Algante, Común & Composiciones Paramétricas
          </p>
        </div>
      </div>

      {/* Middle Badges & View Controls */}
      <div className="hidden md:flex items-center gap-2">
        <span className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded font-mono text-[10px] text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {patternName}
        </span>

        <span className="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded font-mono text-[10px] text-slate-300 uppercase">
          {nodeCount} / 24 NODOS INVARIABLES
        </span>

        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded p-0.5">
          <button
            onClick={() => { playSoftClick(); onZoomOut(); }}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
            title="Reducir Zoom"
          >
            <ZoomOut size={13} />
          </button>
          <span className="px-2 text-[10px] font-mono text-amber-300 min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => { playSoftClick(); onZoomIn(); }}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
            title="Aumentar Zoom"
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={() => { playSoftClick(); onResetZoom(); }}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded transition-colors border-l border-slate-800"
            title="Ajustar Vista 100%"
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {/* Action Tools & Window Controls */}
      <div className="flex items-center gap-2">
        {/* Total Resonance Arpeggio */}
        <button
          onClick={onPlayArpeggio}
          className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/80 text-cyan-200 rounded font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reproducir arpegio de resonancia armónica de todos los nodos (432Hz)"
        >
          <Sparkles size={12} className="text-cyan-400" />
          <span className="hidden sm:inline">Acorde 432Hz</span>
        </button>

        {/* Reactor Drone Ambient Toggle */}
        <button
          onClick={handleToggleDrone}
          className={`px-2.5 py-1 border rounded font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
            isHumming
              ? 'bg-amber-950/80 border-amber-500 text-amber-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
          title="Activar/Desactivar zumbido del reactor a 48Hz (Estación Humanidad)"
        >
          {isHumming ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span className="hidden sm:inline">{isHumming ? 'Drone 48Hz ON' : 'Drone OFF'}</span>
        </button>

        {/* Bóveda Modal */}
        <button
          onClick={() => { playSoftClick(); onOpenVault(); }}
          className="px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-mono font-bold text-[11px] uppercase tracking-wider rounded shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1.5 transition-all cursor-pointer"
          title="Abrir Bóveda de Proyectos, Presets y Exportación"
        >
          <FolderOpen size={13} />
          <span>Bóveda</span>
        </button>

        {/* Native Electron Window Controls */}
        {/* Standalone window controls hidden in suite mode */} {false && (
          <div className="flex items-center gap-1 border-l border-slate-700/80 pl-2 ml-1">
            <button
              onClick={handleMinimize}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
              title="Minimizar"
            >
              <Minus size={13} />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
              title={isMaximized ? 'Restaurar' : 'Maximizar'}
            >
              {isMaximized ? <Maximize2 size={12} /> : <Square size={12} />}
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-red-900/80 text-slate-400 hover:text-red-200 rounded transition-colors"
              title="Cerrar"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};