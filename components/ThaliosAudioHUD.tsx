import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, Settings, Radio, Cpu, Sparkles } from 'lucide-react';
import { thaliosVoice, ThaliosVoiceState } from '../services/thaliosVoiceService';

interface Props {
  onOpenSettings: () => void;
}

export const ThaliosAudioHUD: React.FC<Props> = ({ onOpenSettings }) => {
  const [state, setState] = useState<ThaliosVoiceState>(thaliosVoice.getState());
  const [bars, setBars] = useState<number[]>([15, 30, 60, 45, 80, 50, 25, 70, 90, 40, 60, 30, 20, 50, 75, 35]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = thaliosVoice.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Animación del osciloscopio en tiempo real mientras habla
  useEffect(() => {
    if (!state.isSpeaking || state.isPaused) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setBars([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
      return;
    }

    const updateBars = () => {
      const freqData = thaliosVoice.getFrequencyData();
      if (freqData && freqData.length > 0) {
        // Tomar 16 muestras repartidas
        const step = Math.max(1, Math.floor(freqData.length / 16));
        const newBars: number[] = [];
        for (let i = 0; i < 16; i++) {
          const val = freqData[i * step] || Math.floor(Math.random() * 60 + 20);
          newBars.push(Math.max(12, Math.min(100, Math.round((val / 255) * 100))));
        }
        setBars(newBars);
      } else {
        // Simulación orgánica procedural
        setBars(prev => prev.map(() => Math.floor(Math.random() * 75 + 15)));
      }
      animFrameRef.current = requestAnimationFrame(updateBars);
    };

    animFrameRef.current = requestAnimationFrame(updateBars);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state.isSpeaking, state.isPaused]);

  // Atajos de teclado globales: Espacio para pausar/reanudar, Escape para detener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const config = thaliosVoice.getConfig();
      if (!config.enableSpacebarPause) return;

      // No interceptar si el usuario está escribiendo en un input o textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === ' ' && state.isSpeaking) {
        e.preventDefault();
        thaliosVoice.togglePlayPause();
      } else if (e.key === 'Escape' && (state.isSpeaking || state.isPaused)) {
        e.preventDefault();
        thaliosVoice.stop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isSpeaking, state.isPaused]);

  const config = thaliosVoice.getConfig();
  if (!config.showFloatingHud || (!state.isSpeaking && !state.isPaused && !state.isLoading)) {
    return null;
  }

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getEngineBadge = () => {
    switch (state.activeEngine) {
      case 'gemini-voice':
        return { label: 'GEMINI STUDIO', color: 'text-purple-400 border-purple-500/40 bg-purple-950/40' };
      case 'kokoro-onnx':
        return { label: 'KOKORO ONNX', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' };
      default:
        return { label: 'DSP CUÁNTICO', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' };
    }
  };

  const badge = getEngineBadge();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-auto">
      <div className="relative group bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-xl w-84 sm:w-96 text-slate-200 transition-all duration-300">
        
        {/* Borde sutil pulsante */}
        <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-purple-500/20 -z-10 blur-sm ${state.isSpeaking && !state.isPaused ? 'animate-pulse opacity-100' : 'opacity-40'}`} />

        {/* Encabezado del HUD */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${state.isSpeaking && !state.isPaused ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              <Radio size={13} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 block truncate font-bold">
                Thalios Solaris // Transmisión
              </span>
              <span className="text-[11px] font-sans text-slate-300 truncate block max-w-[190px]">
                {state.currentTitle || 'Transmisión Cuántica'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border tracking-widest uppercase font-semibold ${badge.color}`}>
              {badge.label}
            </span>
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors cursor-pointer"
              title="Ajustes de Voz y Efectos DSP"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Visualizador de Barras de Espectro (Osciloscopio Holográfico) */}
        <div className="h-8 bg-slate-900/80 rounded-xl px-2.5 flex items-end justify-between gap-1 border border-cyan-500/20 mb-3 overflow-hidden">
          {bars.map((height, i) => (
            <div
              key={i}
              className={`w-full rounded-t-sm transition-all duration-75 ${
                state.isSpeaking && !state.isPaused
                  ? 'bg-gradient-to-t from-cyan-600 to-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                  : 'bg-slate-700/60'
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Controles de Reproducción y Estado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Botón Pausa / Reanudar */}
            <button
              onClick={() => thaliosVoice.togglePlayPause()}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.15)]"
              title={state.isPaused ? "Reanudar Transmisión (Espacio)" : "Pausar Transmisión (Espacio)"}
            >
              {state.isPaused ? (
                <>
                  <Play size={12} className="fill-current text-cyan-300" />
                  <span>Reanudar</span>
                </>
              ) : (
                <>
                  <Pause size={12} className="fill-current text-cyan-300" />
                  <span>Pausar</span>
                </>
              )}
            </button>

            {/* Botón Detener Transmisión */}
            <button
              onClick={() => thaliosVoice.stop()}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-100 transition-all text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              title="Detener Transmisión (Esc)"
            >
              <Square size={11} className="fill-current" />
              <span>Detener</span>
            </button>
          </div>

          {/* Tiempo transcurrido y modo */}
          <div className="text-right">
            <span className="text-[11px] font-mono text-cyan-300 font-bold block">
              {formatSeconds(state.elapsedSeconds)}
            </span>
            <span className="text-[9px] font-mono text-slate-500 block uppercase">
              {state.isLoading ? 'Sintonizando...' : state.isPaused ? 'En Pausa' : 'Transmitiendo'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
