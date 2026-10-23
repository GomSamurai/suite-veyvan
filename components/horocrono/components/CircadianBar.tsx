import React, { useState } from 'react';
import { ChronosTime } from '../types/chronos';
import { getCircadianPhase } from '../utils/chronosystemMath';
import { Sun, Moon, AlertTriangle, Info, Zap } from 'lucide-react';

interface CircadianBarProps {
  chronosTime: ChronosTime;
}

export const CircadianBar: React.FC<CircadianBarProps> = ({ chronosTime }) => {
  const [selectedSema, setSelectedSema] = useState<number | null>(null);

  const semas = [
    { num: 1, label: 'S-01', hours: '00h - 06h', name: 'Arranque & Educación', temp: '5500K', bg: 'bg-sky-500/20 border-sky-500/40' },
    { num: 2, label: 'S-02', hours: '06h - 12h', name: 'Cenit Productivo', temp: '5500K', bg: 'bg-sky-500/20 border-sky-500/40' },
    { num: 3, label: 'S-03', hours: '12h - 18h', name: 'Interludio Personal', temp: '3000K', bg: 'bg-amber-500/20 border-amber-500/40' },
    { num: 4, label: 'S-04', hours: '18h - 24h', name: 'Vigilia Secundaria', temp: '4000K', bg: 'bg-violet-500/20 border-violet-500/40' },
    { num: 5, label: 'S-05', hours: '24h - 30h', name: 'Logística & Cierre', temp: '4000K', bg: 'bg-violet-500/20 border-violet-500/40' },
    { num: 6, label: 'S-06', hours: '30h - 36h', name: 'Inducción al Reposo', temp: '2200K', bg: 'bg-orange-500/20 border-orange-500/40' },
    { num: 7, label: 'S-07', hours: '36h - 42h', name: 'Letargo (REM 1)', temp: '0K', bg: 'bg-indigo-950/60 border-indigo-700/40' },
    { num: 8, label: 'S-08', hours: '42h - 48h', name: 'Sueño Profundo (REM 2)', temp: '0K', bg: 'bg-indigo-950/60 border-indigo-700/40' }
  ];

  const activeSemaInfo = selectedSema ? semas.find(s => s.num === selectedSema) : null;
  const activePhaseInfo = selectedSema ? getCircadianPhase(selectedSema) : chronosTime.phase;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-neutral-200 uppercase font-mono">
              Ciclo Circadiano de Cubierta (Tala de 48 Horas)
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Regulación biológica y espectral por Semas · NTU-01
            </p>
          </div>
        </div>

        {/* Current Light Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chronosTime.phase.colorHex }} />
          <span className="text-xs font-mono font-medium text-neutral-200">
            {chronosTime.phase.lightStatus}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
            {chronosTime.phase.intensityPercent}%
          </span>
        </div>
      </div>

      {/* The 48-Hour Tala Timeline */}
      <div className="relative pt-6 pb-2">
        {/* Progress needle */}
        <div 
          className="absolute top-0 transform -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-300"
          style={{ left: `${chronosTime.progressInTala * 100}%` }}
        >
          <div className="px-2 py-0.5 rounded bg-cyan-500 text-neutral-950 font-mono font-bold text-[10px] tracking-tight shadow-[0_0_10px_rgba(6,182,212,0.8)] whitespace-nowrap">
            AHORA (S-0{chronosTime.sema})
          </div>
          <div className="w-0.5 h-10 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
        </div>

        {/* Segments grid */}
        <div className="grid grid-cols-8 gap-1.5 h-12 rounded-xl overflow-hidden p-1 bg-neutral-950/80 border border-white/5">
          {semas.map((s) => {
            const isCurrent = chronosTime.sema === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setSelectedSema(selectedSema === s.num ? null : s.num)}
                className={`relative flex flex-col items-center justify-center rounded-lg border text-xs font-mono transition-all duration-200 overflow-hidden ${s.bg} ${
                  isCurrent ? 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'hover:opacity-90'
                }`}
                title={`Sema 0${s.num} (${s.hours}): ${s.name}`}
              >
                {/* Kroma 8 marker on Sema 6 */}
                {s.num === 6 && (
                  <div 
                    className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" 
                    title="Kroma 8: Silencio de Soporte Vital"
                  />
                )}
                
                <span className="font-bold text-[11px] leading-tight text-neutral-100">
                  {s.label}
                </span>
                <span className="text-[9px] text-neutral-400 opacity-80">
                  {s.temp}
                </span>

                {/* Sema internal fill if current */}
                {isCurrent && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]"
                    style={{ width: `${chronosTime.semaProgress * 100}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Hour markers under bar */}
        <div className="flex justify-between text-[10px] font-mono text-neutral-500 px-1 mt-1.5">
          <span>T-00:00 (Inicio Tala)</span>
          <span>T-12:00</span>
          <span>T-24:00 (Medio Tala)</span>
          <span>T-36:00</span>
          <span>T-48:00 (Reinicio)</span>
        </div>
      </div>

      {/* Details Box for Selected or Current Phase */}
      <div className="mt-4 p-4 rounded-xl bg-neutral-900/60 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300">
            {activePhaseInfo.id === 'letargo_profundo' ? (
              <Moon className="w-5 h-5 text-indigo-400" />
            ) : activePhaseInfo.id === 'interludio_personal' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Sun className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-neutral-200">
                {activeSemaInfo ? `${activeSemaInfo.label} · ${activeSemaInfo.name}` : activePhaseInfo.name}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                ({activePhaseInfo.subname})
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              {activePhaseInfo.description}
            </p>
            <p className="text-[11px] font-mono text-cyan-400/90 mt-1">
              Directiva: {activePhaseInfo.functionText}
            </p>
          </div>
        </div>

        {/* Kroma 8 Alert Widget */}
        <div className={`p-3 rounded-xl border text-xs font-mono min-w-[200px] flex items-start gap-2.5 transition-all ${
          chronosTime.isKroma8Active 
            ? 'bg-red-950/60 border-red-500/60 text-red-200 box-glow-kroma8'
            : 'bg-neutral-950/70 border-neutral-800 text-neutral-400'
        }`}>
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${chronosTime.isKroma8Active ? 'text-red-400 animate-bounce' : 'text-neutral-500'}`} />
          <div>
            <span className="font-bold text-neutral-200 block text-[11px] uppercase tracking-wider">
              {chronosTime.isKroma8Active ? '⚠️ KROMA 8 ACTIVO' : 'Kroma 8 (S-06 : Kr-08)'}
            </span>
            {chronosTime.isKroma8Active ? (
              <span className="text-red-300 text-[10px] leading-tight block mt-0.5">
                Silencio de soporte vital en curso (42.2s). Recalibración atmosférica.
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                Próximo ciclo en: <strong className="text-neutral-200">{Math.floor(chronosTime.kroma8CountdownSeconds / 60)} min</strong> ({chronosTime.kroma8CountdownViras} Vi)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
