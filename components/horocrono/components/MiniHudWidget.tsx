import React from 'react';
import { ChronosTime, EarthTime } from '../types/chronos';
import { Maximize2, Zap, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { chronoAudio } from '../utils/audioEngine';

interface MiniHudWidgetProps {
  chronosTime: ChronosTime;
  earthTime: EarthTime;
  onExpand: () => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
}

export const MiniHudWidget: React.FC<MiniHudWidgetProps> = ({
  chronosTime,
  earthTime,
  onExpand,
  isMuted,
  setIsMuted
}) => {
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    chronoAudio.setMuted(next);
  };

  return (
    <div className="max-w-md mx-auto p-5 rounded-3xl bg-neutral-950/95 border border-cyan-500/30 box-glow-cyan shadow-2xl relative overflow-hidden">
      {/* Corner brackets */}
      <div className="hud-corner absolute inset-0 pointer-events-none" />

      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-display font-bold text-xs tracking-wider text-cyan-300 uppercase">
            HOROCRONO // MINI-HUD
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-cyan-400 transition-colors"
            title={isMuted ? "Activar Sonido" : "Silenciar"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onExpand}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            title="Expandir a Pantalla Completa"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Expandir</span>
          </button>
        </div>
      </div>

      {/* Main Big Chrono Digits */}
      <div className="text-center py-3 bg-neutral-900/60 rounded-2xl border border-white/5 my-2">
        <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
          SEMA 0{chronosTime.sema} · {chronosTime.phase.name}
        </div>

        <div className="flex items-baseline justify-center gap-2 font-mono font-bold text-neutral-100">
          <span className="text-3xl sm:text-4xl text-cyan-400 glow-cyan">
            {String(chronosTime.kroma).padStart(2, '0')}
          </span>
          <span className="text-xl text-neutral-600">:</span>
          <span className="text-3xl sm:text-4xl text-neutral-100">
            {String(chronosTime.fula).padStart(2, '0')}
          </span>
          <span className="text-xl text-neutral-600">:</span>
          <span className="text-3xl sm:text-4xl text-amber-400 glow-amber">
            {String(chronosTime.vira).padStart(2, '0')}
          </span>
        </div>

        {/* Vira micro-heartbeat bar */}
        <div className="mt-2 px-8">
          <div className="w-full h-1 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]"
              style={{ width: `${chronosTime.viraProgress * 100}%` }}
            />
          </div>
        </div>

        <div className="text-[10px] font-mono text-neutral-500 mt-1.5 flex items-center justify-center gap-2">
          <span>{chronosTime.displayCode}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-amber-400/80 font-bold">1 Vi = 0.66s</span>
        </div>
      </div>

      {/* Circadian Bar Mini */}
      <div className="my-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
          <span>{chronosTime.phase.lightStatus}</span>
          <span className="text-cyan-400">{chronosTime.talaElapsedFormatted.slice(0, 8)} / 48h</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
          <div
            className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            style={{ width: `${chronosTime.progressInTala * 100}%` }}
          />
        </div>
      </div>

      {/* Earth Time Row */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
        <span className="text-neutral-400">{earthTime.dateFormatted.split(',')[0]}</span>
        <span className="font-bold text-emerald-400 text-sm">{earthTime.timeFormatted24}</span>
      </div>

      {/* Kroma 8 warning in mini mode */}
      {chronosTime.isKroma8Active && (
        <div className="mt-2.5 p-2 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-[10px] font-mono flex items-center gap-2 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>¡ALERTA KROMA 8! Silencio de soporte vital activo.</span>
        </div>
      )}
    </div>
  );
};
