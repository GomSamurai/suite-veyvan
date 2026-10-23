import React, { useState, useEffect, useRef } from 'react';
import { LapRecord } from '../types/chronos';
import { 
  SECONDS_PER_VIRA, 
  VIRAS_PER_FULA, 
  VIRAS_PER_KROMA, 
  formatVirasDecomposed 
} from '../utils/chronosystemMath';
import { chronoAudio } from '../utils/audioEngine';
import { Play, Pause, RotateCcw, Flag, Volume2, VolumeX, Timer } from 'lucide-react';

export const Chronometer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [soundTickEnabled, setSoundTickEnabled] = useState(false);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastViraTickRef = useRef<number>(-1);

  // Precision loop using requestAnimationFrame + Date.now()
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - elapsedMs;

      const loop = () => {
        const now = performance.now();
        const currentMs = now - startTimeRef.current;
        setElapsedMs(currentMs);

        // Sound tick on each completed Vira (0.65918s = 659.18ms)
        if (soundTickEnabled) {
          const currentViraInt = Math.floor((currentMs / 1000) / SECONDS_PER_VIRA);
          if (currentViraInt !== lastViraTickRef.current && currentViraInt > 0) {
            lastViraTickRef.current = currentViraInt;
            chronoAudio.playViraTick(currentViraInt % 10 === 0);
          }
        }

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
  }, [isRunning, soundTickEnabled]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedMs(0);
    setLaps([]);
    lastViraTickRef.current = -1;
  };

  const handleLap = () => {
    if (elapsedMs === 0) return;

    const totalSeconds = elapsedMs / 1000;
    const totalViras = totalSeconds / SECONDS_PER_VIRA;

    const previousTotalViras = laps.length > 0 ? laps[0].totalViras : 0;
    const previousTotalSeconds = laps.length > 0 ? laps[0].earthSecondsTotal : 0;

    const lapViras = totalViras - previousTotalViras;
    const earthSecondsLap = totalSeconds - previousTotalSeconds;

    const newLap: LapRecord = {
      id: `lap-${Date.now()}-${laps.length + 1}`,
      lapNumber: laps.length + 1,
      lapViras,
      totalViras,
      lapFormatted: formatVirasDecomposed(lapViras),
      totalFormatted: formatVirasDecomposed(totalViras),
      earthSecondsLap,
      earthSecondsTotal: totalSeconds
    };

    setLaps([newLap, ...laps]);
    chronoAudio.playViraTick(true);
  };

  // Calculations for current time
  const totalSeconds = elapsedMs / 1000;
  const totalVirasFloat = totalSeconds / SECONDS_PER_VIRA;
  const totalVirasInt = Math.floor(totalVirasFloat);

  const kromas = Math.floor(totalVirasInt / VIRAS_PER_KROMA);
  const remainingAfterKr = totalVirasInt % VIRAS_PER_KROMA;
  const fulas = Math.floor(remainingAfterKr / VIRAS_PER_FULA);
  const viras = remainingAfterKr % VIRAS_PER_FULA;
  const fraction = Math.floor((totalVirasFloat - totalVirasInt) * 100);

  // Earth equivalent formatted
  const earthMins = Math.floor(totalSeconds / 60);
  const earthSecs = Math.floor(totalSeconds % 60);
  const earthCentis = Math.floor((totalSeconds % 1) * 100);
  const earthFormatted = `${String(earthMins).padStart(2, '0')}:${String(earthSecs).padStart(2, '0')}.${String(earthCentis).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Main Stopwatch Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/20 box-glow-cyan relative overflow-hidden text-center">
        <div className="hud-corner absolute inset-0 pointer-events-none" />

        {/* Top telemetry & tick audio toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              Cronómetro Binario de Cubierta
            </span>
          </div>

          <button
            onClick={() => setSoundTickEnabled(!soundTickEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
              soundTickEnabled
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {soundTickEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Pulso Acústico Vira</span>
          </button>
        </div>

        {/* Big Chrono Readout */}
        <div className="py-6 my-2 bg-neutral-950/80 rounded-2xl border border-white/5 relative">
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

            <span className="text-2xl sm:text-4xl text-neutral-600">.</span>

            {/* Sub-vira fraction */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl text-neutral-400">
                {String(fraction).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                Sub-Vi
              </span>
            </div>
          </div>

          {/* Earth seconds conversion pill */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-300">
              Tiempo Terrestre: <strong className="text-emerald-400">{earthFormatted}</strong> ({totalSeconds.toFixed(2)} s)
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
              Total: <strong className="text-cyan-300">{totalVirasInt.toLocaleString()}</strong> Viras
            </span>
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
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>INICIAR</span>
              </>
            )}
          </button>

          <button
            onClick={handleLap}
            disabled={elapsedMs === 0}
            className="px-6 py-3.5 rounded-xl font-mono font-medium text-sm flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none text-neutral-200 border border-neutral-700 hover:border-cyan-500/40 transition-all"
          >
            <Flag className="w-4 h-4 text-cyan-400" />
            <span>VUELTA (LAP)</span>
          </button>

          <button
            onClick={handleReset}
            disabled={elapsedMs === 0 && !isRunning}
            className="px-6 py-3.5 rounded-xl font-mono font-medium text-sm flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-500/40 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REINICIAR</span>
          </button>
        </div>
      </div>

      {/* Laps Table */}
      {laps.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Flag className="w-3.5 h-3.5 text-cyan-400" />
              Historial de Vueltas Registradas ({laps.length})
            </h4>
            <span className="text-[11px] font-mono text-neutral-500">
              1 Vira = 0.65918s · 1 Fula = 64 Vi
            </span>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Tiempo de Vuelta</th>
                  <th className="py-2.5 px-3">Viras Vuelta</th>
                  <th className="py-2.5 px-3">Total Acumulado</th>
                  <th className="py-2.5 px-3 text-right">Equivalente Terrestre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {laps.map((lap) => (
                  <tr key={lap.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">
                      {String(lap.lapNumber).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-100">
                      {lap.lapFormatted}
                    </td>
                    <td className="py-2.5 px-3 text-amber-400">
                      {Math.round(lap.lapViras).toLocaleString()} Vi
                    </td>
                    <td className="py-2.5 px-3 text-neutral-400">
                      {lap.totalFormatted}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">
                      {lap.earthSecondsLap.toFixed(2)} s ({Math.floor(lap.earthSecondsLap / 60)}m {Math.floor(lap.earthSecondsLap % 60)}s)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
