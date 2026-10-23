import React, { useState, useEffect, useRef } from 'react';
import { ChronosTime, EarthTime } from '../types/chronos';
import { chronoAudio } from '../utils/audioEngine';
import { Copy, Check, Clock, Globe, Shield, Activity, Compass, Cpu, Volume2, VolumeX, HeartPulse } from 'lucide-react';

interface DualClockProps {
  chronosTime: ChronosTime;
  earthTime: EarthTime;
}

export const DualClock: React.FC<DualClockProps> = ({ chronosTime, earthTime }) => {
  const [copied, setCopied] = useState(false);
  const [liveTickAudio, setLiveTickAudio] = useState(false);
  const lastViraRef = useRef(chronosTime.vira);

  // Play acoustic pulse on native Vira tick if enabled
  useEffect(() => {
    if (liveTickAudio && chronosTime.vira !== lastViraRef.current) {
      lastViraRef.current = chronosTime.vira;
      chronoAudio.playViraTick(chronosTime.vira % 8 === 0);
    } else {
      lastViraRef.current = chronosTime.vira;
    }
  }, [chronosTime.vira, liveTickAudio]);

  const copyChronoCode = () => {
    navigator.clipboard.writeText(chronosTime.displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Divide 18-bit binary register into components:
  // Bits 17-15: Sema (3 bits, 0-7)
  // Bits 14-11: Kroma (4 bits, 0-15)
  // Bits 10-6:  Fula (5 bits, 0-31)
  // Bits 5-0:   Vira (6 bits, 0-63)
  const bin = chronosTime.binaryRegister;
  const semaBits = bin.slice(0, 3);
  const kromaBits = bin.slice(3, 7);
  const fulaBits = bin.slice(7, 12);
  const viraBits = bin.slice(12, 18);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: CRONOSISTEMA DE ESTACIÓN HUMANIDAD */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 box-glow-cyan relative overflow-hidden flex flex-col justify-between">
        {/* Decorative corner brackets */}
        <div className="hud-corner absolute inset-0 pointer-events-none" />

        <div>
          {/* Header & Macro Tag */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                CRONOSISTEMA · NTU-01
              </span>
            </div>
            
            {/* Macro Calendar coordinates */}
            <div className="px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-300">
              Era <strong className="text-cyan-400">{chronosTime.eraIndex}</strong> · Ko <strong className="text-cyan-400">{chronosTime.koraIndex}</strong> · Ne <strong className="text-cyan-400">{chronosTime.nemaIndex}</strong> · Ta <strong className="text-cyan-400">{chronosTime.talaIndex}</strong>
            </div>
          </div>

          {/* Large Chrono Time Display */}
          <div className="py-4 my-2 text-center bg-neutral-950/70 rounded-2xl border border-white/5 relative group">
            {/* Top controls: Vira audio pulse toggle & Native frequency telemetry */}
            <div className="flex items-center justify-between px-4 mb-2">
              <span className="text-[10px] font-mono text-cyan-400/90 flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Ritmo Nativo: <strong>1 Vi = 0.65918s</strong> (1.517 Hz)</span>
              </span>

              <button
                onClick={() => setLiveTickAudio(!liveTickAudio)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                  liveTickAudio
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                }`}
                title="Activar/Desactivar pulso acústico en cada cambio de Vira"
              >
                {liveTickAudio ? <Volume2 className="w-3 h-3 text-amber-400" /> : <VolumeX className="w-3 h-3" />}
                <span>Tick Vi</span>
              </button>
            </div>

            {/* Sema Badge */}
            <div className="inline-block mb-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
                SEMA 0{chronosTime.sema} / 08
              </span>
            </div>

            {/* Digits Display */}
            <div className="flex items-baseline justify-center gap-2 sm:gap-4 font-mono font-bold tracking-tight text-neutral-100">
              {/* Kroma */}
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl text-cyan-400 glow-cyan">
                  {String(chronosTime.kroma).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                  Kroma (Kr)
                </span>
              </div>

              <span className="text-3xl sm:text-5xl text-neutral-600 font-light">:</span>

              {/* Fula */}
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl text-neutral-100">
                  {String(chronosTime.fula).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                  Fula (Fu)
                </span>
              </div>

              <span className="text-3xl sm:text-5xl text-neutral-600 font-light">:</span>

              {/* Vira */}
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl text-amber-400 glow-amber">
                  {String(chronosTime.vira).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                  Vira (Vi)
                </span>
              </div>
            </div>

            {/* Organic Vira Sub-pulse Bar (0 to 659ms heartbeat) */}
            <div className="mt-3 px-6 max-w-sm mx-auto">
              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 mb-0.5">
                <span>Pulso Vira ({Math.round(chronosTime.viraMsRemaining)} ms)</span>
                <span className="text-amber-400">{Math.round(chronosTime.viraProgress * 100)}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)] transition-none"
                  style={{ width: `${chronosTime.viraProgress * 100}%` }}
                />
              </div>
            </div>

            {/* Quick Copy Display Code */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <code className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">
                {chronosTime.displayCode}
              </code>
              <button
                onClick={copyChronoCode}
                title="Copiar código cronológico"
                className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-cyan-400 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Binary Register Readout */}
          <div className="mt-4 p-3 rounded-xl bg-neutral-950/80 border border-white/5">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Registro Binario del Tala (18-bit Bus)
              </span>
              <span className="text-[10px] text-neutral-500">
                {chronosTime.totalVirasInTala.toLocaleString()} / 262,144 Vi
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 font-mono text-xs sm:text-sm py-1 tracking-widest bg-neutral-900/60 rounded-lg border border-neutral-800/80">
              <span className="text-sky-400 font-bold" title="Sema (3 bits)">{semaBits}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-cyan-400 font-bold" title="Kroma (4 bits)">{kromaBits}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-300" title="Fula (5 bits)">{fulaBits}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-amber-400 font-bold" title="Vira (6 bits)">{viraBits}</span>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-500 px-2 mt-1">
              <span>Bit 17..15 (Sema)</span>
              <span>Bit 14..11 (Kroma)</span>
              <span>Bit 10..6 (Fula)</span>
              <span>Bit 5..0 (Vira)</span>
            </div>
          </div>
        </div>

        {/* 48h Tala Progression Gauge */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-neutral-400">Progreso del Ciclo Tala (48h)</span>
            <span className="font-bold text-cyan-400">
              {chronosTime.talaElapsedFormatted} ({(chronosTime.progressInTala * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-amber-400 shadow-[0_0_10px_rgba(6,182,212,0.6)] transition-all duration-300"
              style={{ width: `${chronosTime.progressInTala * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT: TIEMPO TERRESTRE ESTÁNDAR (ESPAÑOL) */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
        <div className="hud-corner absolute inset-0 pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                TIEMPO TERRESTRE · COMPUTO CIVIL
              </span>
            </div>
            
            <div className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
              {earthTime.timezone}
            </div>
          </div>

          {/* Large Earth Time Display */}
          <div className="py-6 my-2 text-center bg-neutral-950/70 rounded-2xl border border-white/5 relative">
            {/* Full Date in Spanish */}
            <div className="text-sm md:text-base font-medium text-neutral-300 mb-2 capitalize">
              {earthTime.dateFormatted}
            </div>

            {/* 24-hour Big Time */}
            <div className="font-mono font-bold text-5xl sm:text-6xl text-neutral-100 tracking-tight">
              {earthTime.timeFormatted24}
            </div>

            {/* 12-hour sub-display */}
            <div className="text-xs font-mono text-neutral-500 mt-2">
              Formato 12 horas: <strong className="text-neutral-400">{earthTime.timeFormatted12}</strong>
            </div>
          </div>

          {/* Comparative Life Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
              <span className="text-[11px] font-mono text-neutral-400 block mb-1">
                Ritmo Biológico Terrestre
              </span>
              <span className="text-sm font-semibold text-neutral-200">
                Ciclo de 24 Horas
              </span>
              <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                16h vigilia / 8h sueño. Basado en la rotación ancestral de la Tierra alrededor del Sol.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
              <span className="text-[11px] font-mono text-cyan-400 block mb-1">
                Ritmo Estación Humanidad
              </span>
              <span className="text-sm font-semibold text-cyan-300">
                Ciclo Tala (48 Horas)
              </span>
              <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                30h vigilia continua (Semas 1 a 5) / 18h letargo reparador (Semas 6 a 8).
              </p>
            </div>
          </div>
        </div>

        {/* System Status Footnote */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Protocolo Thalios Solaris // Sin deriva temporal</span>
          </div>
          <span className="text-[11px] text-emerald-400">100% Sincronizado</span>
        </div>
      </div>
    </div>
  );
};
