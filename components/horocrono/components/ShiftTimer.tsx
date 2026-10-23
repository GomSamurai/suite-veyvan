import React, { useState, useEffect, useRef } from 'react';
import { 
  SECONDS_PER_VIRA, 
  VIRAS_PER_FULA, 
  VIRAS_PER_KROMA, 
  SHIFT_PRESETS,
  formatVirasDecomposed 
} from '../utils/chronosystemMath';
import { chronoAudio } from '../utils/audioEngine';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Bell, 
  Plus, 
  Minus, 
  Sparkles,
  Hourglass,
  CheckCircle2
} from 'lucide-react';

export const ShiftTimer: React.FC = () => {
  // Configured duration in total Viras
  const [targetViras, setTargetViras] = useState<number>(2048); // default 1 Kroma (2048 Viras = 22.5 min)
  const [remainingViras, setRemainingViras] = useState<number>(2048);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string>('p-1kr');

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  // Timer loop
  useEffect(() => {
    if (isRunning && remainingViras > 0) {
      lastTimestampRef.current = performance.now();

      const loop = () => {
        const now = performance.now();
        const deltaSeconds = (now - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = now;

        const deltaViras = deltaSeconds / SECONDS_PER_VIRA;

        setRemainingViras((prev) => {
          const next = prev - deltaViras;
          if (next <= 0) {
            setIsRunning(false);
            setIsFinished(true);
            chronoAudio.playShiftAlarm();
            return 0;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, remainingViras]);

  const handleStartPause = () => {
    if (isFinished) {
      setRemainingViras(targetViras);
      setIsFinished(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemainingViras(targetViras);
  };

  const selectPreset = (preset: typeof SHIFT_PRESETS[0]) => {
    setIsRunning(false);
    setIsFinished(false);
    setActivePresetId(preset.id);
    setTargetViras(preset.totalViras);
    setRemainingViras(preset.totalViras);
  };

  const adjustCustomTime = (deltaFulas: number) => {
    if (isRunning) return;
    const currentFulas = Math.floor(targetViras / VIRAS_PER_FULA);
    const newFulas = Math.max(1, currentFulas + deltaFulas);
    const newViras = newFulas * VIRAS_PER_FULA;
    setActivePresetId('custom');
    setTargetViras(newViras);
    setRemainingViras(newViras);
    setIsFinished(false);
  };

  // Progress ratio
  const progressRatio = targetViras > 0 ? (remainingViras / targetViras) : 0;

  // Breakdown of remaining viras
  const remainingInt = Math.ceil(remainingViras);
  const kromas = Math.floor(remainingInt / VIRAS_PER_KROMA);
  const remainingAfterKr = remainingInt % VIRAS_PER_KROMA;
  const fulas = Math.floor(remainingAfterKr / VIRAS_PER_FULA);
  const viras = remainingAfterKr % VIRAS_PER_FULA;

  // Earth remaining
  const earthTotalSecRemaining = remainingViras * SECONDS_PER_VIRA;
  const earthMins = Math.floor(earthTotalSecRemaining / 60);
  const earthSecs = Math.floor(earthTotalSecRemaining % 60);

  return (
    <div className="space-y-6">
      {/* Main Countdown Display */}
      <div className={`glass-panel p-6 sm:p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden text-center ${
        isFinished 
          ? 'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.35)]' 
          : 'border-cyan-500/20 box-glow-cyan'
      }`}>
        <div className="hud-corner absolute inset-0 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              Temporizador de Turno & Alarma de Guardia
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => chronoAudio.playShiftAlarm()}
              title="Probar Campana de Alarma"
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Test Chime</span>
            </button>
          </div>
        </div>

        {/* Big Remaining Display */}
        <div className={`py-8 my-2 rounded-2xl border transition-all duration-300 relative ${
          isFinished 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
            : 'bg-neutral-950/80 border-white/5 text-neutral-100'
        }`}>
          {isFinished ? (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce mb-3" />
              <h3 className="font-display font-bold text-2xl text-emerald-300 tracking-wider uppercase">
                TURNO CONCLUIDO
              </h3>
              <p className="text-xs font-mono text-emerald-400/80 mt-1">
                Aviso de campana de cubierta emitido por Thalios Solaris
              </p>
            </div>
          ) : (
            <div className="flex items-baseline justify-center gap-3 sm:gap-6 font-mono font-bold">
              {/* Kromas */}
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-7xl text-cyan-400 glow-cyan">
                  {String(kromas).padStart(2, '0')}
                </span>
                <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                  Kromas (Kr)
                </span>
              </div>

              <span className="text-3xl sm:text-5xl text-neutral-600">:</span>

              {/* Fulas */}
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-7xl text-neutral-100">
                  {String(fulas).padStart(2, '0')}
                </span>
                <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                  Fulas (Fu)
                </span>
              </div>

              <span className="text-3xl sm:text-5xl text-neutral-600">:</span>

              {/* Viras */}
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-7xl text-amber-400 glow-amber">
                  {String(viras).padStart(2, '0')}
                </span>
                <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                  Viras (Vi)
                </span>
              </div>
            </div>
          )}

          {/* Earth seconds remainder */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-300">
              Tiempo Terrestre Restante: <strong className="text-emerald-400">{String(earthMins).padStart(2, '0')}:{String(earthSecs).padStart(2, '0')}</strong> ({earthTotalSecRemaining.toFixed(1)} s)
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-5 px-6">
            <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
              <div
                className={`h-full transition-all duration-150 ${
                  isFinished 
                    ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]' 
                    : 'bg-gradient-to-r from-cyan-500 to-amber-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                }`}
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Buttons Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            onClick={handleStartPause}
            className={`px-8 py-3.5 rounded-xl font-mono font-bold text-sm flex items-center gap-2 transition-all duration-200 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSAR</span>
              </>
            ) : isFinished ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>REINICIAR TURNO</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>INICIAR CUENTA ATRÁS</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3.5 rounded-xl font-mono font-medium text-sm flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>
        </div>

        {/* Custom Stepper */}
        {!isRunning && !isFinished && (
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono text-neutral-400 mr-2">Ajuste Manual:</span>
            <button
              onClick={() => adjustCustomTime(-32)}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300"
            >
              -1 Kroma
            </button>
            <button
              onClick={() => adjustCustomTime(-5)}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300"
            >
              -5 Fulas
            </button>
            <button
              onClick={() => adjustCustomTime(-1)}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300"
            >
              -1 Fula
            </button>
            <span className="w-px h-4 bg-neutral-800 mx-1" />
            <button
              onClick={() => adjustCustomTime(1)}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300"
            >
              +1 Fula
            </button>
            <button
              onClick={() => adjustCustomTime(5)}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300"
            >
              +5 Fulas
            </button>
            <button
              onClick={() => adjustCustomTime(32)}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300"
            >
              +1 Kroma
            </button>
          </div>
        )}
      </div>

      {/* Canonical Ship Presets Grid */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider">
              Intervalos Operativos Canónicos de la Estación
            </h4>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            Reglamento de Turnos y Guardias
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SHIFT_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-neutral-100 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sm text-cyan-300">
                      {preset.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                      {preset.earthSeconds >= 60 ? `${(preset.earthSeconds / 60).toFixed(1)} min` : `${preset.earthSeconds} s`}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-snug mt-1">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>{preset.totalViras.toLocaleString()} Viras</span>
                  <span className="text-amber-400/90 font-medium capitalize">{preset.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
